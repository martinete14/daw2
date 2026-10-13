// tienda: carrito, compra y pantalla. usa productos.js (productos, leer, buscar...)

// sin sesión no se puede estar acá: vuelta al login
const sesion = leer(sessionStorage, "sesion", null);
if (!sesion) {
  location.href = "index.html";
}

// ---------- lógica del carrito: [{ id, cantidad }], en el sessionStorage ----------

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

// ---------- pintar en pantalla ----------

const nombreUsuario = document.getElementById("nombre-usuario");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const listaProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("carrito");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

// 5208 -> "$5.208"
function pesos(numero) {
  return "$" + numero.toLocaleString("es-AR");
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  mensaje.hidden = false;
}

function pintarProductos() {
  listaProductos.innerHTML = productos.map((p) => `
    <div class="producto">
      <div class="foto"><img src="${p.imagen}" alt="${p.nombre}"></div>
      <h3>${p.nombre}</h3>
      <p class="precio">${pesos(p.precio)}</p>
      <p class="stock">Quedan ${p.existencias}</p>
      <div class="agregar">
        <input type="number" min="1" value="1" id="cantidad-${p.id}">
        <button class="boton" data-id="${p.id}" ${p.existencias === 0 ? "disabled" : ""}>
          ${p.existencias === 0 ? "Sin stock" : "Agregar"}
        </button>
      </div>
    </div>
  `).join("");
}

function pintarCarrito() {
  const carrito = obtenerCarrito();
  listaCarrito.innerHTML = carrito.map((item) => `
    <li>
      ${item.cantidad} x ${buscar(item.id).nombre} = ${pesos(buscar(item.id).precio * item.cantidad)}
      <button data-quitar="${item.id}">Quitar</button>
    </li>
  `).join("");

  total.textContent = "Total: " + pesos(totalCarrito());
  cantidadCarrito.textContent = carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

// ---------- listeners ----------

// un solo listener para todos los botones "Agregar" (cada uno tiene su data-id)
listaProductos.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const cantidad = Number(document.getElementById("cantidad-" + id).value);
  const error = agregar(id, cantidad);
  if (error) {
    mostrarMensaje(error, "error");
  } else {
    mostrarMensaje(buscar(id).nombre + " agregada al carrito.", "ok");
  }
  pintarCarrito();
});

listaCarrito.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.quitar);
  if (!id) return;
  quitar(id);
  pintarCarrito();
});

document.getElementById("comprar").addEventListener("click", () => {
  const error = comprar();
  if (error) {
    mostrarMensaje(error, "error");
  } else {
    mostrarMensaje("¡Compra realizada! Que lo disfrutes con unos buenos mates.", "ok");
  }
  pintarProductos();
  pintarCarrito();
});

// al cerrar sesión se borran la sesión y el carrito
document.getElementById("salir").addEventListener("click", () => {
  sessionStorage.removeItem("sesion");
  sessionStorage.removeItem("carrito");
  location.href = "index.html";
});

// el evento "storage" salta cuando OTRA pestaña cambia el localStorage
window.addEventListener("storage", (e) => {
  if (e.key !== "inventario") return;

  releerProductos();
  pintarProductos();
  pintarCarrito();
  const problemas = problemasCarrito();
  if (problemas.length > 0) {
    mostrarMensaje("El stock cambió en otra pestaña. " + problemas.join(" "), "error");
  }
});

// ---------- arranque ----------

if (sesion) {
  nombreUsuario.textContent = "Hola, " + sesion.nombre;
  cargarProductos()
    .then(() => {
      pintarProductos();
      pintarCarrito();
    })
    .catch(() => mostrarMensaje("No se pudo cargar data/productos.json. Abrí el proyecto con Live Server.", "error"));
}
