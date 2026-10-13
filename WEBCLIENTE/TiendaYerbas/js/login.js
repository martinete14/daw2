// usuarios de prueba: solo para practicar, no es un login seguro
const USUARIOS = [
  { usuario: "Riquelme", clave: "1234", nombre: "Juan Román Riquelme" },
  { usuario: "Robben", clave: "abcd", nombre: "Arjen Robben" },
  { usuario: "Palermo", clave: "boca", nombre: "Martín Palermo" },
];

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
    location.href = "tienda.html";
  } else {
    error.hidden = false;
  }
});
