// La Pulpería · lo que hace el navegador.
// La tienda funciona igual sin este archivo: la sesión, la cookie y los datos los maneja PHP.
// Acá solo hay comodidades y animaciones.

// 1. Botón del ojo para ver la clave en el login. Sin JavaScript el botón queda oculto.
const verClave = document.querySelector(".ver-clave");
if (verClave) {
  const clave = document.getElementById("clave");
  verClave.hidden = false;
  verClave.addEventListener("click", () => {
    const mostrar = clave.type === "password";
    clave.type = mostrar ? "text" : "password";
    verClave.setAttribute("aria-label", mostrar ? "Ocultar la clave" : "Mostrar la clave");
    verClave.querySelector("i").className = mostrar ? "ph-bold ph-eye-slash" : "ph-bold ph-eye";
  });
}

// 2. En el celular el filtro por tipo es una fila que se desliza de costado: se corre sola hasta
//    la opción elegida, para que se vea cuál está marcada. El filtro en sí lo hace PHP (RF-18).
document.querySelector(".filtro [aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });

// 3. Animaciones de entrada con GSAP. Si la librería no cargó (sin internet), se saca la clase
//    "js" del <html> y el CSS deja de esconder lo que iba a animarse: se ve todo, quieto.
//    clearProps: al terminar, GSAP borra los estilos que dejó escritos en cada elemento. Si no,
//    su "translate: none" pisaría el CSS y las tarjetas no se levantarían al pasar el mouse.
if (!window.gsap || !window.ScrollTrigger || !window.SplitText) {
  document.documentElement.classList.remove("js");
} else {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const mostrar = (elemento) => elemento.classList.add("visto");

  // solo si el sistema no pide reducir movimiento (si lo pide, el CSS no esconde nada)
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    // títulos grandes: cada letra sube desde abajo, como si se estuviera imprimiendo
    document.fonts.ready.then(() => {
      document.querySelectorAll('[data-anima="letras"]').forEach((titulo) => {
        // cada letra va en una máscara (clase letra-mask) que la esconde mientras sube; el CSS la agranda para la tilde
        const partes = SplitText.create(titulo, { type: "words,chars", mask: "chars", charsClass: "letra" });
        mostrar(titulo);
        gsap.from(partes.chars, { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.03 });
      });
    });

    // la lista de precios de la portada y las yerbas del login se pegan como stickers
    const stickers = gsap.utils.toArray('[data-anima="salta"]');
    stickers.forEach(mostrar);
    if (stickers.length) { // solo están en la portada y el login; sin esto GSAP avisa en la consola
      gsap.from(stickers, { scale: 0, rotation: -25, duration: 0.9, ease: "back.out(1.7)", stagger: 0.15, delay: 0.3, clearProps: "all" });
    }

    // afiches y tarjetas: aparecen en tandas a medida que llegan con el scroll
    ScrollTrigger.batch('[data-anima="tarjeta"]', {
      start: "top 95%",
      once: true,
      onEnter: (tarjetas) => {
        tarjetas.forEach(mostrar);
        gsap.from(tarjetas, { y: 70, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "all" });
      },
    });
  });
}
