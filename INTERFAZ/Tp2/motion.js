const revealItems = document.querySelectorAll(".cv-section, .timeline-item, .education-card, .skill-group, .portfolio-footer");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}
