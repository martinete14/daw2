// js/validation/rules.js

// Config: mínimo de palabras para "objetivos"
export const OBJETIVOS_MIN_WORDS = 3;

/**
 * Cuenta palabras “reales” (letras) de 2+ caracteres.
 * - Normaliza y elimina diacríticos (tildes) para máxima compatibilidad.
 * - Evita contar números o signos.
 */
export function contarPalabras(texto = "") {
  const limpio = texto
    .normalize("NFD")                    // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, "");   // quita diacríticos
  const tokens = limpio.match(/[a-zA-Z]{2,}/g) || [];
  return tokens.length;
}

export const rules = {
  nombre: v => v.trim().length >= 2,
  apellidos: v => v.trim().length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telefono: v => /^[0-9\s+()-]{9,20}$/.test(v),
  cp: v => /^\d{5}$/.test(v),
  dni: v => /^[A-Za-z0-9]{5,15}$/.test(v),
  iban_ultimos: v => /^\d{4}$/.test(v),

  fecha_nacimiento: v => {
    if (!v) return false;
    const y = new Date(v).getFullYear();
    const age = new Date().getFullYear() - y;
    return age >= 16 && age < 120;
  },
  altura: v => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 120 && n <= 230;
  },
  peso: v => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 35 && n <= 250;
  },

  // NUEVO: “Objetivos principales” — requiere al menos 3 palabras
  objetivos: v => contarPalabras(v) >= OBJETIVOS_MIN_WORDS,
};

