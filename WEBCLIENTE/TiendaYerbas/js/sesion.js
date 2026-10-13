// lógica de la sesión (sessionStorage), sin HTML ni listeners

function iniciarSesion(usuario, clave) {
  const encontrado = USUARIOS.find((u) => u.usuario === usuario && u.clave === clave);
  if (!encontrado) return false;

  // guardo solo lo necesario para identificarlo, la contraseña no
  guardarJSON(sessionStorage, "sesion", { usuario: encontrado.usuario, nombre: encontrado.nombre });
  return true;
}

// devuelve { usuario, nombre } o null si no hay nadie logeado
function obtenerSesion() {
  const sesion = leerJSON(sessionStorage, "sesion", null);
  if (!sesion || !sesion.usuario) return null;
  return sesion;
}

// al cerrar sesión se borran la sesión y el carrito
function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  sessionStorage.removeItem("carrito");
}
