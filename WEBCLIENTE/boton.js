const boton = document.getElementById("boton");
const contador = document.getElementById("contador");

let clics = 0;

boton.addEventListener("click", () => {
  clics++;
  contador.textContent = clics;
  console.log("clic numero", clics);
});
