import "./style.css";
import { login, usuarioLogeado, logout } from "./logic/sesion.js";
import {
  MAXIMO_POR_PERSONA, MONTO_MAXIMO, obtenerProductos, obtenerCarrito, vaciarCarrito,
  totalCarrito, agregarAlCarrito, quitarDelCarrito, comprar,
} from "./logic/tienda.js";

const formLogin = document.getElementById("form-login");
const zonaUsuario = document.getElementById("zona-usuario");
const saludo = document.getElementById("saludo");
const usuarioCabecera = document.getElementById("usuario-cabecera");
const error = document.getElementById("error");
const reglas = document.getElementById("reglas");
const listaProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("carrito");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const botonComprar = document.getElementById("comprar");
const botonSalir = document.getElementById("salir");

function mostrar() {
  const usuario = usuarioLogeado();
  if (usuario) {
    formLogin.hidden = true;
    zonaUsuario.hidden = false;
    saludo.textContent = "Hola " + usuario + ", ya estás logeado.";
    usuarioCabecera.textContent = usuario;
    mostrarProductos();
    mostrarCarrito();
  } else {
    formLogin.hidden = false;
    zonaUsuario.hidden = true;
    usuarioCabecera.textContent = "";
  }
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  mensaje.hidden = false;
}

// una card por cada yerba
function mostrarProductos() {
  listaProductos.innerHTML = "";
  obtenerProductos().forEach((producto) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>🧉 ${producto.nombre}</h3>
      <p class="precio">$${producto.precio}</p>
      <p class="stock">Quedan ${producto.existencia}</p>
      <input type="number" min="1" value="1">
      <button>Agregar</button>
    `;

    const cantidad = card.querySelector("input");
    const botonAgregar = card.querySelector("button");

    if (producto.existencia === 0) {
      botonAgregar.disabled = true;
      botonAgregar.textContent = "Sin stock";
    }

    botonAgregar.addEventListener("click", () => {
      const resultado = agregarAlCarrito(usuarioLogeado(), producto.id, Number(cantidad.value));
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
  const productos = obtenerProductos();
  listaCarrito.innerHTML = "";

  obtenerCarrito().forEach((item) => {
    const producto = productos.find((p) => p.id === item.id);
    const fila = document.createElement("li");
    fila.textContent = item.cantidad + " x " + producto.nombre + " = $" + producto.precio * item.cantidad;

    const botonQuitar = document.createElement("button");
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", () => {
      quitarDelCarrito(item.id);
      mostrarCarrito();
    });

    fila.appendChild(botonQuitar);
    listaCarrito.appendChild(fila);
  });

  total.textContent = "Total: $" + totalCarrito();
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (login(usuario, clave)) {
    error.hidden = true;
    mostrar();
  } else {
    error.hidden = false;
  }
});

botonComprar.addEventListener("click", () => {
  const resultado = comprar(usuarioLogeado());
  if (resultado) {
    mostrarMensaje(resultado, "error");
  } else {
    mostrarMensaje("¡Compra realizada! Que lo disfrutes con unos buenos mates.", "ok");
  }
  mostrarProductos();
  mostrarCarrito();
});

botonSalir.addEventListener("click", () => {
  logout();
  vaciarCarrito();
  mensaje.hidden = true;
  mostrar();
});

reglas.textContent = "Máximo " + MAXIMO_POR_PERSONA + " paquetes de cada yerba por persona y compras de hasta $" + MONTO_MAXIMO + ".";
mostrar();
