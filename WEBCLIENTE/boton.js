const boton = document.getElementById("boton");
const contador = document.getElementById("contador");
const fondo = document.getElementById("fondo");

const TOTAL_FOTOS = 20;

const fotos = Array.from({ length: TOTAL_FOTOS }, (_, i) => `fotos/${i + 1}.jpg`);

fotos.forEach((ruta) => {
  new Image().src = ruta;
});

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

let orden = [];
let ultima = null;

function siguienteFoto() {
  if (orden.length === 0) {
    orden = mezclar(fotos);
    if (orden[0] === ultima && orden.length > 1) {
      orden.push(orden.shift());
    }
  }
  ultima = orden.shift();
  return ultima;
}

let clics = 0;

boton.addEventListener("click", () => {
  fondo.style.backgroundImage = `url("${siguienteFoto()}")`;
  clics++;
  contador.textContent = clics;
});
