// js/utils/dom.js (versión mejorada)

/**
 * Devuelve el contenedor "control" del campo, si existe.
 * Fallback: el parentElement actual (para no romper markup).
 */
function getControlContainer(input) {
  return input.closest(".control") || input.parentElement;
}

/**
 * Asegura que exista un nodo <p class="error-msg"> y lo devuelve.
 * Define role="alert" y aria-live="polite" para accesibilidad.
 */
function ensureErrorNode(control) {
  let hint = control.querySelector(".error-msg");
  if (!hint) {
    hint = document.createElement("p");
    hint.className = "error-msg";
    hint.setAttribute("role", "alert");
    hint.setAttribute("aria-live", "polite");
    control.appendChild(hint);
  }
  return hint;
}

export function showError(input, msg) {
  input.setAttribute("aria-invalid", "true");

  const control = getControlContainer(input);
  const hint = ensureErrorNode(control);
  hint.textContent = msg;

  // Asegura un id estable para vincular aria-describedby
  if (!hint.id) {
    const base = input.id || input.name || "campo";
    hint.id = `${base}-error`;
  }

  // Vincula el mensaje al campo
  const described = new Set(
    (input.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
  );
  described.add(hint.id);
  input.setAttribute("aria-describedby", Array.from(described).join(" "));

  // Marca el contenedor para estilos (label, etc.)
  control.classList.add("has-error");
}

export function clearError(input) {
  input.removeAttribute("aria-invalid");

  const control = getControlContainer(input);
  const hint = control.querySelector(".error-msg");

  if (hint) {
    // Limpia solo la referencia a ESTE mensaje en aria-describedby
    const ids = new Set(
      (input.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter(Boolean)
    );
    ids.delete(hint.id);
    ids.size
      ? input.setAttribute("aria-describedby", Array.from(ids).join(" "))
      : input.removeAttribute("aria-describedby");

    hint.remove();
  }

  control.classList.remove("has-error");
}
