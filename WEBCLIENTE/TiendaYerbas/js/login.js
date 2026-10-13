// login: usa USUARIOS de usuarios.js

// si ya hay sesión no se puede volver al login (ni con la URL ni con "atrás"):
// para entrar con otro usuario hay que cerrar sesión primero
if (sessionStorage.getItem("sesion") !== null) {
  window.location.replace("home.html");
}

// ---------- lógica ----------

function iniciarSesion(usuario, clave) {
  const encontrado = USUARIOS.find((u) => u.usuario === usuario && u.clave === clave);
  if (!encontrado) return false;

  // guardo solo lo que identifica al usuario, la contraseña no
  sessionStorage.setItem("sesion", JSON.stringify({ usuario: encontrado.usuario, nombre: encontrado.nombre }));
  return true;
}

// ---------- listeners ----------

const formLogin = document.getElementById("form-login");
const error = document.getElementById("error");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (iniciarSesion(usuario, clave)) {
    // replace en vez de href: el login no queda en el historial, así "atrás" no vuelve a él
    window.location.replace("home.html");
  } else {
    error.hidden = false;
  }
});