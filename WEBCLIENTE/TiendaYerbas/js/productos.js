// inventario de yerbas, guardado en el localStorage.
// la primera vez se trae de data/productos.json, después siempre del localStorage
// (ahí están las existencias actualizadas)

let productos = [];

// lee un objeto/array guardado como JSON (la uso acá y en home.js).
// si todavía no hay nada guardado o el texto está roto, devuelve el valor por defecto
function leer(storage, clave, porDefecto) {
  try {
    return JSON.parse(storage.getItem(clave)) ?? porDefecto;
  } catch (e) {
    return porDefecto;
  }
}

async function cargarProductos() {
  productos = leer(localStorage, "inventario", null);
  if (!Array.isArray(productos)) {
    const respuesta = await fetch("data/productos.json");
    productos = await respuesta.json();
    guardarProductos();
  }
}

// vuelve a leer el localStorage, por si otra pestaña cambió las existencias
function releerProductos() {
  productos = leer(localStorage, "inventario", productos);
}

function guardarProductos() {
  localStorage.setItem("inventario", JSON.stringify(productos));
}

function buscar(id) {
  return productos.find((p) => p.id === id);
}
