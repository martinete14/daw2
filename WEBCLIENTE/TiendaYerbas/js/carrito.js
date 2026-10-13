// carrito: [{ id, cantidad }], guardado en el sessionStorage.
// usa productos.js (leer, buscar, releerProductos, guardarProductos)

function obtenerCarrito() {
  const carrito = leer(sessionStorage, "carrito", []);
  return Array.isArray(carrito) ? carrito : [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function totalCarrito() {
  return obtenerCarrito().reduce((suma, item) => suma + buscar(item.id).precio * item.cantidad, 0);
}

// devuelve el error, o "" si se pudo agregar
function agregar(id, cantidad) {
  const producto = buscar(id);
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

function quitar(id) {
  guardarCarrito(obtenerCarrito().filter((item) => item.id !== id));
}

// los productos del carrito que piden más de lo que queda
function problemasCarrito() {
  return obtenerCarrito()
    .filter((item) => item.cantidad > buscar(item.id).existencias)
    .map((item) => buscar(item.id).nombre + ": tenés " + item.cantidad + " en el carrito y quedan " + buscar(item.id).existencias + ".");
}

// devuelve el error, o "" si salió bien
function comprar() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return "El carrito está vacío.";

  // antes de comprar vuelvo a leer el inventario por si otra pestaña compró mientras tanto
  releerProductos();
  const problemas = problemasCarrito();
  if (problemas.length > 0) return "No se puede comprar. " + problemas.join(" ");

  carrito.forEach((item) => {
    buscar(item.id).existencias -= item.cantidad;
  });
  guardarProductos();
  sessionStorage.removeItem("carrito");
  return "";
}
