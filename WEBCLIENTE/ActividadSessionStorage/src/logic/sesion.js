// acá no hay nada de HTML ni listeners, solo los usuarios y la sesión

const CLAVE_SESION = "usuarioLogueado";

// usuarios de prueba hardcodeados
export const USUARIOS = [
  { usuario: "martin", contraseña: "1234", nombre: "Martín Villagra" },
  { usuario: "lucia", contraseña: "mate2024", nombre: "Lucía Fernández" },
  { usuario: "diego", contraseña: "asado10", nombre: "Diego Romero" },
];

// si el usuario y la contraseña coinciden, guarda la sesión y devuelve el usuario.
// si no, devuelve null
export function iniciarSesion(usuario, contraseña) {
  const encontrado = USUARIOS.find(
    (u) => u.usuario === usuario && u.contraseña === contraseña
  );
  if (!encontrado) return null;

  // la contraseña no la guardamos en el sessionStorage
  const datosSesion = { usuario: encontrado.usuario, nombre: encontrado.nombre };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
  return datosSesion;
}

// devuelve el usuario guardado en la sesión, o null si no hay nadie logueado
export function obtenerUsuarioLogueado() {
  const guardado = sessionStorage.getItem(CLAVE_SESION);
  return guardado ? JSON.parse(guardado) : null;
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}
