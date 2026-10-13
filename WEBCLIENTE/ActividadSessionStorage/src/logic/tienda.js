// lógica de la tienda, sin HTML ni listeners.
// los productos y las compras van en el localStorage (lo comparten todos los usuarios),
// el carrito va en el sessionStorage (es de cada sesión)
import productosIniciales from "../data/productos.json";

export const MAXIMO_POR_PERSONA = 3; // paquetes de cada yerba por persona
export const MONTO_MAXIMO = 25000; // tope de cada compra en pesos

// la primera vez cargo el json en el localStorage, después siempre leo de ahí
export function obtenerProductos() {
  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
  }
  return JSON.parse(localStorage.getItem("productos"));
}

function guardarProductos(productos) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

export function obtenerCarrito() {
  return JSON.parse(sessionStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

export function vaciarCarrito() {
  sessionStorage.removeItem("carrito");
}

// lo que ya compró cada usuario: { Riquelme: { 1: 2, 3: 1 }, ... }
function obtenerCompras() {
  return JSON.parse(localStorage.getItem("compras")) || {};
}

function yaComprados(usuario, id) {
  const compras = obtenerCompras();
  if (!compras[usuario] || !compras[usuario][id]) return 0;
  return compras[usuario][id];
}

export function totalCarrito() {
  const productos = obtenerProductos();
  let total = 0;
  obtenerCarrito().forEach((item) => {
    const producto = productos.find((p) => p.id === item.id);
    total += producto.precio * item.cantidad;
  });
  return total;
}

// devuelve el error, o "" si se pudo agregar
export function agregarAlCarrito(usuario, id, cantidad) {
  const producto = obtenerProductos().find((p) => p.id === id);
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === id);
  const enCarrito = item ? item.cantidad : 0;

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return "La cantidad tiene que ser un número entero mayor que 0.";
  }
  if (enCarrito + cantidad > producto.existencia) {
    return "No hay stock suficiente de " + producto.nombre + ", quedan " + producto.existencia + ".";
  }
  if (yaComprados(usuario, id) + enCarrito + cantidad > MAXIMO_POR_PERSONA) {
    return "Solo podés llevar " + MAXIMO_POR_PERSONA + " paquetes de " + producto.nombre + " por persona.";
  }
  if (totalCarrito() + producto.precio * cantidad > MONTO_MAXIMO) {
    return "La compra no puede pasar de $" + MONTO_MAXIMO.toLocaleString("es-AR") + ".";
  }

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: id, cantidad: cantidad });
  }
  guardarCarrito(carrito);
  return "";
}

export function quitarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter((item) => item.id !== id));
}

// descuenta el stock y anota lo que compró el usuario. devuelve el error, o "" si salió bien
export function comprar(usuario) {
  const productos = obtenerProductos();
  const carrito = obtenerCarrito();
  const compras = obtenerCompras();

  if (carrito.length === 0) return "El carrito está vacío.";

  // vuelvo a revisar por si otro usuario (u otra pestaña) compró mientras tanto
  for (const item of carrito) {
    const producto = productos.find((p) => p.id === item.id);
    if (item.cantidad > producto.existencia) {
      return "Ya no queda stock suficiente de " + producto.nombre + ".";
    }
    if (yaComprados(usuario, item.id) + item.cantidad > MAXIMO_POR_PERSONA) {
      return "Ya compraste el máximo de " + producto.nombre + ".";
    }
  }

  if (!compras[usuario]) compras[usuario] = {};
  carrito.forEach((item) => {
    const producto = productos.find((p) => p.id === item.id);
    producto.existencia -= item.cantidad;
    compras[usuario][item.id] = yaComprados(usuario, item.id) + item.cantidad;
  });

  guardarProductos(productos);
  localStorage.setItem("compras", JSON.stringify(compras));
  vaciarCarrito();
  return "";
}
