// pantalla de la tienda: pinta productos y carrito, y pone los listeners

// sin sesión no se puede estar acá: vuelta al login
const sesion = obtenerSesion();
if (!sesion) {
  location.href = "index.html";
}

const nombreUsuario = document.getElementById("nombre-usuario");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const listaProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("carrito");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const botonComprar = document.getElementById("comprar");
const botonSalir = document.getElementById("salir");

// 5208 -> "$5.208"
function pesos(numero) {
  return "$" + numero.toLocaleString("es-AR");
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  mensaje.hidden = false;
}

// una card por cada yerba
function mostrarProductos() {
  listaProductos.innerHTML = "";
  obtenerInventario().forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <div class="foto"><img src="${producto.imagen}" alt="${producto.nombre}"></div>
      <h3>${producto.nombre}</h3>
      <p class="precio">${pesos(producto.precio)}</p>
      <p class="stock">Quedan ${producto.existencias}</p>
      <div class="agregar">
        <input type="number" min="1" value="1">
        <button class="boton">Agregar</button>
      </div>
    `;

    const cantidad = card.querySelector("input");
    const botonAgregar = card.querySelector("button");

    if (producto.existencias === 0) {
      botonAgregar.disabled = true;
      botonAgregar.textContent = "Sin stock";
    }

    botonAgregar.addEventListener("click", () => {
      const resultado = agregarAlCarrito(producto.id, Number(cantidad.value));
      if (resultado) {
        mostrarMensaje(resultado, "error");
      } else {
        mostrarMensaje(producto.nombre + " agregada al carrito.", "ok");
      }
      mostrarCarrito();
    });

    listaProductos.appendChild(card);
  });
}

function mostrarCarrito() {
  const inventario = obtenerInventario();
  let unidades = 0;
  listaCarrito.innerHTML = "";

  obtenerCarrito().forEach((item) => {
    const producto = buscarProducto(inventario, item.id);
    unidades += item.cantidad;

    const fila = document.createElement("li");
    fila.textContent = item.cantidad + " x " + producto.nombre + " = " + pesos(producto.precio * item.cantidad);

    const botonQuitar = document.createElement("button");
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", () => {
      quitarDelCarrito(item.id);
      mostrarCarrito();
    });

    fila.appendChild(botonQuitar);
    listaCarrito.appendChild(fila);
  });

  total.textContent = "Total: " + pesos(totalCarrito());
  cantidadCarrito.textContent = unidades;
}

botonComprar.addEventListener("click", () => {
  const resultado = comprar();
  if (resultado) {
    mostrarMensaje(resultado, "error");
  } else {
    mostrarMensaje("¡Compra realizada! Que lo disfrutes con unos buenos mates.", "ok");
  }
  mostrarProductos();
  mostrarCarrito();
});

botonSalir.addEventListener("click", () => {
  cerrarSesion();
  location.href = "index.html";
});

// el evento "storage" salta cuando OTRA pestaña cambia el localStorage.
// si cambió el inventario, vuelvo a pintar y aviso si el carrito ya no alcanza
window.addEventListener("storage", (e) => {
  if (e.key !== "inventario" && e.key !== null) return;

  mostrarProductos();
  mostrarCarrito();
  const avisos = comprobarCarrito();
  if (avisos.length > 0) {
    mostrarMensaje("El stock cambió en otra pestaña. " + avisos.join(" "), "error");
  }
});

if (sesion) {
  nombreUsuario.textContent = "Hola, " + sesion.nombre;
  mostrarProductos();
  mostrarCarrito();
}
