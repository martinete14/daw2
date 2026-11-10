// La Pulpería · lo que hace el navegador.
// La tienda funciona igual sin este archivo: la sesión, la cookie y los datos los maneja PHP.
// Acá solo hay comodidades y animaciones.

// 1. El gif de cada producto arranca desde el primer cuadro (el paquete de frente, igual que
//    la foto) cada vez que entra el mouse. Si no, seguiría girando de fondo y aparecería por la mitad.
document.querySelectorAll(".producto").forEach((tarjeta) => {
  const gif = tarjeta.querySelector(".animada");
  if (!gif) return;
  const original = gif.src;
  let copia; // el gif se baja una sola vez y se guarda en memoria

  tarjeta.addEventListener("mouseenter", async () => {
    copia ??= await fetch(original).then((respuesta) => respuesta.blob());
    if (gif.src.startsWith("blob:")) URL.revokeObjectURL(gif.src); // libera la copia anterior
    gif.src = URL.createObjectURL(copia); // dirección nueva = la animación empieza de cero
  });
});

// 2. Botón del ojo para ver la clave en el login. Sin JavaScript el botón queda oculto.
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

// 3. Animaciones de entrada con GSAP. Si la librería no cargó (sin internet), se saca la clase
//    "js" del <html> y el CSS deja de esconder lo que iba a animarse: se ve todo, quieto.
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
        const partes = SplitText.create(titulo, { type: "words,chars", mask: "chars" });
        mostrar(titulo);
        gsap.from(partes.chars, { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.03 });
      });
    });

    // la lista de precios de la portada y las yerbas del login se pegan como stickers
    const stickers = gsap.utils.toArray('[data-anima="salta"]');
    stickers.forEach(mostrar);
    gsap.from(stickers, { scale: 0, rotation: -25, duration: 0.9, ease: "back.out(1.7)", stagger: 0.15, delay: 0.3 });

    // afiches y tarjetas: aparecen en tandas a medida que llegan con el scroll
    ScrollTrigger.batch('[data-anima="tarjeta"]', {
      start: "top 95%",
      once: true,
      onEnter: (tarjetas) => {
        tarjetas.forEach(mostrar);
        gsap.from(tarjetas, { y: 70, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
      },
    });
  });
}
