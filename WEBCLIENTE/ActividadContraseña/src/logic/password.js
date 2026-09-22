// acá no hay nada de HTML, solo funciones que reciben texto y devuelven datos

export const NIVELES = {
  VACIA: "vacia",
  DEBIL: "debil",
  MEDIA: "media",
  FUERTE: "fuerte",
};

// contraseñas y patrones de teclado muy usados, mejor evitarlos
const CONTRASEÑAS_COMUNES = [
  "123456", "123456789", "12345678", "12345", "password", "qwerty",
  "abc123", "letmein", "welcome", "admin", "iloveyou", "monkey",
  "football", "dragon", "master", "contraseña", "contrasena",
  "hola1234", "futbol", "bienvenido", "asdf", "zxcv", "qazwsx", "poiuy",
];

function esContraseñaComun(password) {
  const texto = password.toLowerCase();
  return CONTRASEÑAS_COMUNES.some((comun) => texto.includes(comun));
}

// true si hay 3 caracteres repetidos ("aaa") o 3 seguidos en orden ("abc", "321")
function tienePatronPrevisible(password) {
  const texto = password.toLowerCase();
  for (let i = 0; i < texto.length - 2; i++) {
    const a = texto.charCodeAt(i);
    const b = texto.charCodeAt(i + 1);
    const c = texto.charCodeAt(i + 2);
    if (a === b && b === c) return true;
    if (b - a === c - b && Math.abs(b - a) === 1) return true;
  }
  return false;
}

function contarTiposDeCaracter(password) {
  const patrones = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
  return patrones.filter((patron) => patron.test(password)).length;
}

// analiza la contraseña y decide si es debil, media o fuerte.
// primero descarta las obviamente malas, y si pasa ese filtro,
// mira si es larga y variada para saber si es fuerte o media.
export function evaluarContraseña(password) {
  if (!password) {
    return {
      level: NIVELES.VACIA,
      checks: { longitudSuficiente: false, variedad: false, sinPatrones: false, sinPalabrasComunes: false },
    };
  }

  const tipos = contarTiposDeCaracter(password);
  const patronPrevisible = tienePatronPrevisible(password);
  const comun = esContraseñaComun(password);

  let nivel;
  if (password.length < 8 || comun || patronPrevisible) {
    nivel = NIVELES.DEBIL; // corta, muy usada, o con patrón fácil de adivinar
  } else if (password.length >= 15 && tipos >= 3) {
    nivel = NIVELES.FUERTE; // larga y variada
  } else {
    nivel = NIVELES.MEDIA; // pasó el filtro pero no llega a fuerte
  }

  return {
    level: nivel,
    checks: {
      longitudSuficiente: password.length >= 15,
      variedad: tipos >= 3,
      sinPatrones: !patronPrevisible,
      sinPalabrasComunes: !comun,
    },
  };
}

// ---- Generador de contraseñas ----

const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%^&*()-_=+[]{};:,.<>?";
const TODOS_LOS_CARACTERES = MINUSCULAS + MAYUSCULAS + NUMEROS + SIMBOLOS;

function caracterAleatorio(charset) {
  return charset[Math.floor(Math.random() * charset.length)];
}

function construirContraseñaAleatoria() {
  const longitud = 16 + Math.floor(Math.random() * 5); // entre 16 y 20
  const letras = [];
  for (let i = 0; i < longitud; i++) {
    letras.push(caracterAleatorio(TODOS_LOS_CARACTERES));
  }
  // nos aseguramos de que haya un poco de cada tipo
  letras[0] = caracterAleatorio(MINUSCULAS);
  letras[1] = caracterAleatorio(MAYUSCULAS);
  letras[2] = caracterAleatorio(NUMEROS);
  letras[3] = caracterAleatorio(SIMBOLOS);
  return letras.join("");
}

// si por casualidad sale un patrón previsible, la vuelve a intentar
export function generarContraseñaFuerte() {
  let resultado = construirContraseñaAleatoria();
  let intentos = 0;
  while (tienePatronPrevisible(resultado) && intentos < 10) {
    resultado = construirContraseñaAleatoria();
    intentos++;
  }
  return resultado;
}
