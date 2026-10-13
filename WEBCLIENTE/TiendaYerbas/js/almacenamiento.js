// funciones para guardar y leer objetos/arrays en sessionStorage o localStorage.
// el storage solo guarda texto, por eso se pasa todo por JSON

function guardarJSON(storage, clave, valor) {
  storage.setItem(clave, JSON.stringify(valor));
}

// si todavía no hay nada guardado, o lo que hay no es un JSON válido,
// devuelve el valor por defecto en vez de romper la página
function leerJSON(storage, clave, porDefecto) {
  const texto = storage.getItem(clave);
  if (texto === null) return porDefecto;

  try {
    return JSON.parse(texto);
  } catch (e) {
    console.warn("No se pudo leer '" + clave + "', uso el valor por defecto");
    return porDefecto;
  }
}
