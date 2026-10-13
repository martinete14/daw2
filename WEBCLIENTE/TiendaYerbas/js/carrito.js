// lógica del inventario (localStorage) y del carrito (sessionStorage), sin HTML ni listeners

// ---- inventario ----

function obtenerInventario() {
  const inventario = leerJSON(localStorage, "inventario", null);

  // primera vez que se abre, o lo guardado está roto: arranco con el inventario inicial
  if (!Array.isArray(inventario)) {
    guardarJSON(localStorage, "inventario", PRODUCTOS_INICIALES);
    return leerJSON(localStorage, "inventario", []);
  }
  return inventario;
}

function buscarProducto(inventario, id) {
  return inventario.find((p) => p.id === id);
}

// ---- carrito: [{ id, cantidad }, ...] ----

function obtenerCarrito() {
  const carrito = leerJSON(sessionStorage, "carrito", []);
  if (!Array.isArray(carrito)) return [];
  return carrito;
}

function guardarCarrito(carrito) {
  guardarJSON(sessionStorage, "carrito", carrito);
}

function totalCarrito() {
  const inventario = obtenerInventario();
  let total = 0;
  obtenerCarrito().forEach((item) => {
    total += buscarProducto(inventario, item.id).precio * item.cantidad;
  });
  return total;
}

// devuelve el error, o "" si se pudo agregar
function agregarAlCarrito(id, cantidad) {
  const producto = buscarProducto(obtenerInventario(), id);
  const carrito = obtenerCarrito();
  const item = carrito.find((i) => i.id === id);
  const enCarrito = item ? item.cantidad : 0;

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return "La cantidad tiene que ser un número entero mayor que 0.";
  }
  if (enCarrito + cantidad > producto.existencias) {
    return "No hay tantas unidades de " + producto.nombre + ": quedan " + producto.existencias + " y ya tenés " + enCarrito + " en el carrito.";
  }

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: id, cantidad: cantidad });
  }
  guardarCarrito(carrito);
  return "";
}

function quitarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter((item) => item.id !== id));
}

// compara el carrito con el inventario de ahora (puede haber cambiado en otra pestaña).
// devuelve la lista de problemas, vacía si está todo bien
function comprobarCarrito() {
  const inventario = obtenerInventario();
  const avisos = [];
  obtenerCarrito().forEach((item) => {
    const producto = buscarProducto(inventario, item.id);
    if (item.cantidad > producto.existencias) {
      avisos.push(producto.nombre + ": tenés " + item.cantidad + " en el carrito y quedan " + producto.existencias + ".");
    }
  });
  return avisos;
}

// descuenta las unidades del inventario y vacía el carrito.
// devuelve el error, o "" si salió bien
function comprar() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return "El carrito está vacío.";

  // antes de comprar vuelvo a comprobar las cantidades
  const avisos = comprobarCarrito();
  if (avisos.length > 0) return "No se puede comprar. " + avisos.join(" ");

  const inventario = obtenerInventario();
  carrito.forEach((item) => {
    buscarProducto(inventario, item.id).existencias -= item.cantidad;
  });
  guardarJSON(localStorage, "inventario", inventario);
  sessionStorage.removeItem("carrito");
  return "";
}
