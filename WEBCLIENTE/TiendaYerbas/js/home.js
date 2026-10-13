// tienda: pantalla y listeners. usa productos.js y carrito.js

// sin sesión no se puede estar acá: vuelta al login
const sesion = leer(sessionStorage, "sesion", null);
if (!sesion) {
  window.location.replace("index.html");
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
  window.location.replace("index.html");
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
