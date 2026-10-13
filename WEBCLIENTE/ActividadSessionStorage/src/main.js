import "./style.css";
import { login, usuarioLogeado, logout } from "./logic/sesion.js";
import {
  MAXIMO_POR_PERSONA, MONTO_MAXIMO, formatearPrecio, obtenerProductos, obtenerCarrito,
  vaciarCarrito, totalCarrito, agregarAlCarrito, quitarDelCarrito, comprar,
} from "./logic/tienda.js";

const formLogin = document.getElementById("form-login");
const zonaUsuario = document.getElementById("zona-usuario");
const cabeceraUsuario = document.getElementById("cabecera-usuario");
const usuarioCabecera = document.getElementById("usuario-cabecera");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const error = document.getElementById("error");
const reglas = document.getElementById("reglas");
const listaProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("carrito");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const botonComprar = document.getElementById("comprar");
const botonSalir = document.getElementById("salir");
const botonArs = document.getElementById("moneda-ars");
const botonEur = document.getElementById("moneda-eur");

let moneda = "ARS";

function precio(pesos) {
  return formatearPrecio(pesos, moneda);
}

function mostrarReglas() {
  reglas.textContent = "Máximo " + MAXIMO_POR_PERSONA + " paquetes de cada yerba por persona · Compras de hasta " + precio(MONTO_MAXIMO);
}

// cambia la moneda y vuelve a pintar todo lo que tiene precios
function cambiarMoneda(nueva) {
  moneda = nueva;
  botonArs.classList.toggle("activa", moneda === "ARS");
  botonEur.classList.toggle("activa", moneda === "EUR");
  mostrarReglas();
  mostrarProductos();
  mostrarCarrito();
}

function mostrar() {
  const usuario = usuarioLogeado();
  if (usuario) {
    formLogin.hidden = true;
    zonaUsuario.hidden = false;
    cabeceraUsuario.hidden = false;
    usuarioCabecera.textContent = "Hola, " + usuario;
    mostrarProductos();
    mostrarCarrito();
  } else {
    formLogin.hidden = false;
    zonaUsuario.hidden = true;
    cabeceraUsuario.hidden = true;
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
    card.className = "producto";
    card.innerHTML = `
      <div class="foto"><img src="${producto.imagen}" alt="${producto.nombre}"></div>
      <h3>${producto.nombre}</h3>
      <p class="precio">${precio(producto.precio)}</p>
      <p class="stock">Quedan ${producto.existencia}</p>
      <div class="agregar">
        <input type="number" min="1" value="1">
        <button class="boton">Agregar</button>
      </div>
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
  let unidades = 0;
  listaCarrito.innerHTML = "";

  obtenerCarrito().forEach((item) => {
    const producto = productos.find((p) => p.id === item.id);
    unidades += item.cantidad;

    const fila = document.createElement("li");
    fila.textContent = item.cantidad + " x " + producto.nombre + " = " + precio(producto.precio * item.cantidad);

    const botonQuitar = document.createElement("button");
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", () => {
      quitarDelCarrito(item.id);
      mostrarCarrito();
    });

    fila.appendChild(botonQuitar);
    listaCarrito.appendChild(fila);
  });

  total.textContent = "Total: " + precio(totalCarrito());
  cantidadCarrito.textContent = unidades;
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

botonArs.addEventListener("click", () => cambiarMoneda("ARS"));
botonEur.addEventListener("click", () => cambiarMoneda("EUR"));

mostrarReglas();
mostrar();
