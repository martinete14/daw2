import "./style.css";
import { login, usuarioLogeado, logout } from "./logic/sesion.js";

const formLogin = document.getElementById("form-login");
const zonaUsuario = document.getElementById("zona-usuario");
const saludo = document.getElementById("saludo");
const usuarioCabecera = document.getElementById("usuario-cabecera");
const error = document.getElementById("error");
const botonSalir = document.getElementById("salir");

function mostrar() {
  const usuario = usuarioLogeado();
  if (usuario) {
    formLogin.hidden = true;
    zonaUsuario.hidden = false;
    saludo.textContent = "Hola " + usuario + ", ya estás logeado.";
    usuarioCabecera.textContent = usuario;
  } else {
    formLogin.hidden = false;
    zonaUsuario.hidden = true;
    usuarioCabecera.textContent = "";
  }
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

botonSalir.addEventListener("click", () => {
  logout();
  mostrar();
});

mostrar();
