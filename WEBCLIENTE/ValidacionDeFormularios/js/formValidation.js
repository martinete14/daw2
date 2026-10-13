// js/formValidation.js
// ============================================================
// Valida campos (nativo + custom), pinta/limpia errores,
// y SOLO habilita "Enviar solicitud" si TODO el formulario es válido.
// ============================================================

import { rules } from "./validation/rules.js";
import { messages } from "./validation/messages.js";
import { showError, clearError } from "./utils/dom.js";

const FORM_ID = "form-inscripcion";

/* ------------------------ Mensajes nativos ------------------------ */
function getNativeMessage(input, name) {
  const v = input.validity;

  if (v.valueMissing) return "Este campo es obligatorio.";
  if (v.typeMismatch) {
    if (input.type === "email") return "Correo no válido.";
    if (input.type === "url")   return "URL no válida.";
    return "Valor no válido.";
  }
  if (v.patternMismatch) return input.title || "Formato inválido.";

  if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch) {
    if (name === "altura" || name === "peso") {
      return messages?.[name] || "Valor fuera de rango.";
    }
    if (v.rangeUnderflow) return `El valor debe ser ≥ ${input.min}.`;
    if (v.rangeOverflow)  return `El valor debe ser ≤ ${input.max}.`;
    if (v.stepMismatch)   return input.step && input.step !== "any"
      ? `Usa incrementos de ${input.step}.`
      : "Valor no válido.";
  }

  if (v.tooShort) return `Debe tener al menos ${input.minLength} caracteres.`;
  if (v.tooLong)  return `Debe tener como máximo ${input.maxLength} caracteres.`;

  return "";
}

/* ------------------------ Validación por campo ------------------------
   paint=true  -> pinta/borra mensajes
   paint=false -> solo calcula y devuelve true/false (no toca la UI)
------------------------------------------------------------------------ */
function validateField(input, { paint = true } = {}) {
  const name = input.name;
  const val  = input.value;

  input.setCustomValidity("");
  if (!input.checkValidity()) {
    if (paint) {
      const msg = getNativeMessage(input, name) || "Valor inválido.";
      showError(input, msg);
    }
    return false;
  }

  const rule = rules[name];
  if (rule && !rule(val)) {
    if (paint) {
      showError(input, messages[name] || "Valor inválido.");
    }
    return false;
  }

  if (paint) clearError(input);
  return true;
}

/* ------------------------ Condiciones médicas ------------------------ */
function wireCondicionesMedicas(form) {
  const group = form.querySelector('[role="group"][aria-label="Condiciones médicas"]');
  if (!group) return () => true;

  const all = Array.from(group.querySelectorAll('input[type="checkbox"][name="condiciones[]"]'));
  const none = all.find(i => i.value?.toLowerCase() === "ninguna");
  const others = all.filter(i => i !== none);

  function toggleFromNone() {
    if (!none) return;
    if (none.checked) {
      others.forEach(i => {
        i.checked = false;
        i.disabled = true;
        i.closest("label")?.classList.add("is-disabled");
      });
    } else {
      others.forEach(i => {
        i.disabled = false;
        i.closest("label")?.classList.remove("is-disabled");
      });
    }
  }

  function toggleFromOthers() {
    if (!none) return;
    const anyOther = others.some(i => i.checked);
    none.checked = false;
    none.disabled = anyOther;
    none.closest("label")?.classList.toggle("is-disabled", anyOther);
  }

  none?.addEventListener("change", toggleFromNone);
  others.forEach(i => i.addEventListener("change", toggleFromOthers));
  toggleFromNone(); toggleFromOthers();

  // Valida que haya algo marcado; si silent, no pinta mensaje
  function validateCondiciones({ silent = false } = {}) {
    const ok = all.some(i => i.checked);
    if (silent) return ok;

    const control = group.closest(".control") || group.parentElement;
    let hint = control.querySelector(".error-msg-condiciones");
    if (!ok) {
      if (!hint) {
        hint = document.createElement("p");
        hint.className = "error-msg error-msg-condiciones";
        hint.setAttribute("role", "alert");
        control.appendChild(hint);
      }
      hint.textContent = "Selecciona al menos una opción (o marca 'Ninguna').";
    } else {
      hint?.remove();
    }
    return ok;
  }

  return validateCondiciones;
}

/* ------------------------ ¿Es válido TODO el formulario? ------------------------
   - Ejecuta validaciones nativas + custom en SILENCIO.
   - Incluye el grupo de condiciones médicas (silent).
------------------------------------------------------------------------------- */
function isFormValid(form, validateCondicionesSilent) {
  const inputs = form.querySelectorAll("input, select, textarea");
  for (const el of inputs) {
    if (!validateField(el, { paint: false })) return false;
  }
  if (validateCondicionesSilent && !validateCondicionesSilent({ silent: true })) {
    return false;
  }
  return true;
}

/* ------------------------ Gate del botón de Enviar ------------------------
   Habilita el submit SOLO si:
   - todo el form es válido (isFormValid)
   - (opcional) T&C (y RGPD) están marcados
---------------------------------------------------------------------------- */
function wireSubmitGate(form, validateCondiciones) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const tos  = form.querySelector('input[name="tos"]');
  const rgpd = form.querySelector('input[name="rgpd"]'); // opcional

  function update() {
    // 1) Validez global (silenciosa)
    const allValid = isFormValid(form, validateCondiciones);

    // 2) Requisitos de consentimientos
    let consentsOK = true;
    if (tos)  consentsOK = consentsOK && tos.checked;   // exige T&C
    // Si también quieres exigir RGPD, descomenta:
    // if (rgpd) consentsOK = consentsOK && rgpd.checked;

    const allow = allValid && consentsOK;

    if (submitBtn) {
      submitBtn.disabled = !allow;
      submitBtn.setAttribute("aria-disabled", String(!allow));
    }
  }

  // Escuchas globales para recalcular el gate en tiempo real
  form.addEventListener("input",  update, true);
  form.addEventListener("change", update, true);
  tos?.addEventListener("change", update);
  rgpd?.addEventListener("change", update);

  // Estado inicial + tras reset
  update();
  form.addEventListener("reset", () => setTimeout(update, 0));
}

/* ------------------------ Wiring de validación visible ------------------------ */
function wireValidationUI(form, validateCondiciones) {
  const inputs = form.querySelectorAll("input, select, textarea");

  // Validación visible (pinta) en blur / input / change
  inputs.forEach((el) => {
    el.addEventListener("blur",   () => validateField(el, { paint: true }));
    el.addEventListener("input",  () => validateField(el, { paint: true }));
    el.addEventListener("change", () => validateField(el, { paint: true }));
  });

  form.addEventListener("submit", (e) => {
    const invalids = [];
    inputs.forEach((el) => { if (!validateField(el, { paint: true })) invalids.push(el); });

    const okCond = validateCondiciones ? validateCondiciones({}) : true;

    if (invalids.length || !okCond) {
      e.preventDefault();
      (invalids[0] || form.querySelector(".error-msg-condiciones"))?.focus?.();
    }
  });
}

/* ------------------------ Reset elegante ------------------------ */
function wireResetCleanup(form) {
  function limpiarEstados() {
    form.querySelectorAll(".error-msg").forEach(n => n.remove());
    form.querySelectorAll("[aria-invalid='true']").forEach(el => el.removeAttribute("aria-invalid"));
    form.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid","is-invalid"));
    form.querySelectorAll("select[multiple]").forEach(sel => { for (const opt of sel.options) opt.selected = false; });
  }
  form.addEventListener("reset", () => {
    limpiarEstados();
    const first = form.querySelector("input, select, textarea");
    first?.focus();
  });
}

/* ------------------------ Arranque ------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(FORM_ID);
  if (!form) return;

  const validateCondiciones = wireCondicionesMedicas(form);

  // 1) Gate del botón por validez global (silenciosa) + consentimientos
  wireSubmitGate(form, validateCondiciones);

  // 2) Validación visible (mensajes) y submit
  wireValidationUI(form, validateCondiciones);

  // 3) Limpieza de estados tras reset
  wireResetCleanup(form);
});
