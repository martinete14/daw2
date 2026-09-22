import "./style.css";
import { evaluarContraseña, generarContraseñaFuerte, NIVELES } from "./logic/password.js";

// elementos del HTML que vamos a leer/modificar
const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggle-visibility");
const toggleIcon = document.getElementById("toggle-icon");
const generateBtn = document.getElementById("generate-btn");
const strengthContainer = document.getElementById("strength");
const strengthFill = document.getElementById("strength-fill");
const strengthLabel = document.getElementById("strength-label");
const checklistItems = document.querySelectorAll("#checklist li");

const TEXTO_POR_NIVEL = {
  [NIVELES.VACIA]: "Escribe una contraseña para ver su nivel de seguridad",
  [NIVELES.DEBIL]: "Contraseña débil",
  [NIVELES.MEDIA]: "Contraseña media",
  [NIVELES.FUERTE]: "Contraseña fuerte",
};
const CLASE_POR_NIVEL = {
  [NIVELES.VACIA]: "is-empty",
  [NIVELES.DEBIL]: "is-weak",
  [NIVELES.MEDIA]: "is-medium",
  [NIVELES.FUERTE]: "is-strong",
};
// la barra tiene 3 posiciones: un tercio para debil, dos tercios
// para media, llena para fuerte
const ANCHO_POR_NIVEL = {
  [NIVELES.VACIA]: "0%",
  [NIVELES.DEBIL]: "33%",
  [NIVELES.MEDIA]: "66%",
  [NIVELES.FUERTE]: "100%",
};

function mostrarFortaleza(resultado) {
  strengthContainer.classList.remove("is-empty", "is-weak", "is-medium", "is-strong");
  strengthContainer.classList.add(CLASE_POR_NIVEL[resultado.level]);
  strengthFill.style.width = ANCHO_POR_NIVEL[resultado.level];
  strengthLabel.textContent = TEXTO_POR_NIVEL[resultado.level];
}

function mostrarChecklist(checks) {
  checklistItems.forEach((item) => {
    const cumple = Boolean(checks[item.dataset.check]);
    item.classList.toggle("is-passed", cumple);
  });
}

function actualizarPantalla() {
  const resultado = evaluarContraseña(passwordInput.value);
  mostrarFortaleza(resultado);
  mostrarChecklist(resultado.checks);
}

// mostrar / ocultar la contraseña
toggleBtn.addEventListener("click", () => {
  const seVaAMostrar = passwordInput.type === "password";
  passwordInput.type = seVaAMostrar ? "text" : "password";
  toggleIcon.textContent = seVaAMostrar ? "🙈" : "👁️";
  toggleBtn.setAttribute("aria-label", seVaAMostrar ? "Ocultar contraseña" : "Mostrar contraseña");
});

// evaluar en tiempo real mientras se escribe
passwordInput.addEventListener("input", actualizarPantalla);

// generar contraseña aleatoria
generateBtn.addEventListener("click", () => {
  passwordInput.value = generarContraseñaFuerte();
  passwordInput.dispatchEvent(new Event("input")); // reusa el mismo flujo de arriba
});

actualizarPantalla();
