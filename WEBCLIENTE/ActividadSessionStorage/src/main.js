import "./style.css";
import { USUARIOS, iniciarSesion, obtenerUsuarioLogueado, cerrarSesion } from "./logic/sesion.js";

// elementos del HTML que vamos a leer/modificar
const vistaLogin = document.getElementById("vista-login");
const vistaBienvenida = document.getElementById("vista-bienvenida");
const loginForm = document.getElementById("login-form");
const usuarioInput = document.getElementById("usuario");
const contraseñaInput = document.getElementById("contraseña");
const mensajeError = document.getElementById("mensaje-error");
const listaUsuarios = document.getElementById("lista-usuarios");
const nombreUsuario = document.getElementById("nombre-usuario");
const logoutBtn = document.getElementById("logout-btn");

function mostrarLogin() {
  vistaLogin.hidden = false;
  vistaBienvenida.hidden = true;
  loginForm.reset();
  mensajeError.textContent = "";
}

function mostrarBienvenida(usuario) {
  vistaLogin.hidden = true;
  vistaBienvenida.hidden = false;
  nombreUsuario.textContent = usuario.nombre;
}

function mostrarUsuariosDePrueba() {
  USUARIOS.forEach((u) => {
    const item = document.createElement("li");
    item.textContent = `${u.usuario} / ${u.contraseña}`;
    listaUsuarios.appendChild(item);
  });
}

// iniciar sesión
loginForm.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const usuario = iniciarSesion(usuarioInput.value.trim(), contraseñaInput.value);
  if (usuario) {
    mostrarBienvenida(usuario);
  } else {
    mensajeError.textContent = "Usuario o contraseña incorrectos";
  }
});

// cerrar sesión
logoutBtn.addEventListener("click", () => {
  cerrarSesion();
  mostrarLogin();
});

// al cargar la página, si ya había sesión guardada entra directo
mostrarUsuariosDePrueba();
const usuarioGuardado = obtenerUsuarioLogueado();
if (usuarioGuardado) {
  mostrarBienvenida(usuarioGuardado);
} else {
  mostrarLogin();
}
