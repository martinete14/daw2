// pantalla de login: lee el formulario y pone los listeners

// si ya hay sesión, va directo a la tienda
if (obtenerSesion()) {
  location.href = "tienda.html";
}

const formLogin = document.getElementById("form-login");
const error = document.getElementById("error");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (iniciarSesion(usuario, clave)) {
    location.href = "tienda.html";
  } else {
    error.hidden = false;
  }
});
