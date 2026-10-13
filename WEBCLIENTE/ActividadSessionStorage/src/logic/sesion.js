// acá solo la lógica, los listeners están en main.js

const usuarios = { Riquelme: "1234", Robben: "abcd", Palermo: "boca" };

export function login(usuario, clave) {
  if (usuarios[usuario] == clave) {
    sessionStorage.setItem("usuario", usuario);
    return true;
  }
  return false;
}

export function usuarioLogeado() {
  return sessionStorage.getItem("usuario");
}

export function logout() {
  sessionStorage.removeItem("usuario");
}
