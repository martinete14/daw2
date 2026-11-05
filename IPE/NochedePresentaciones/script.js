(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.querySelector(".reading-progress span");
  const topbar = document.querySelector(".topbar");
  let frameQueued = false;

  const updatePagePosition = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progress?.style.setProperty("transform", `scaleX(${Math.min(1, Math.max(0, amount))})`);
    topbar?.classList.toggle("topbar-scrolled", window.scrollY > 18);
    frameQueued = false;
  };

  window.addEventListener("scroll", () => {
    if (!frameQueued) {
      frameQueued = true;
      window.requestAnimationFrame(updatePagePosition);
    }
  }, { passive: true });
  window.addEventListener("resize", updatePagePosition, { passive: true });
  updatePagePosition();

  const storyLinks = [...document.querySelectorAll(".story-index a")];
  const stories = [...document.querySelectorAll(".story")];
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".intro-heading, .intro-copy, .story, .closing").forEach((item) => revealObserver.observe(item));

    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = `#${entry.target.id}`;
        storyLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === activeId;
          link.classList.toggle("is-current", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { threshold: 0.55, rootMargin: "-15% 0px -30% 0px" });
    stories.forEach((story) => storyObserver.observe(story));
  }

  if (!reduceMotion) {
    const field = document.querySelector(".spark-field");
    for (let i = 0; i < 24; i += 1) {
      const mote = document.createElement("span");
      mote.className = "mote";
      mote.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      mote.style.setProperty("--y", `${16 + Math.random() * 75}%`);
      mote.style.setProperty("--delay", `${Math.random() * -15}s`);
      mote.style.setProperty("--duration", `${9 + Math.random() * 10}s`);
      mote.style.setProperty("--drift", `${-34 + Math.random() * 68}px`);
      field?.append(mote);
    }

    document.querySelectorAll(".story-art").forEach((art) => {
      art.addEventListener("pointermove", (event) => {
        const bounds = art.getBoundingClientRect();
        art.style.setProperty("--light-x", `${event.clientX - bounds.left}px`);
        art.style.setProperty("--light-y", `${event.clientY - bounds.top}px`);
      });
    });

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let lastSparkAt = 0;
      const glyphs = ["✦", "✧", "⋆", "·"];
      window.addEventListener("pointermove", (event) => {
        const now = performance.now();
        if (now - lastSparkAt < 38) return;
        lastSparkAt = now;

        const spark = document.createElement("span");
        spark.className = "wand-spark";
        spark.setAttribute("aria-hidden", "true");
        spark.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        spark.style.left = `${event.clientX}px`;
        spark.style.top = `${event.clientY}px`;
        spark.style.setProperty("--dx", `${-24 + Math.random() * 48}px`);
        spark.style.setProperty("--dy", `${-36 + Math.random() * 56}px`);
        spark.style.setProperty("--turn", `${-70 + Math.random() * 140}deg`);
        document.body.append(spark);
        spark.addEventListener("animationend", () => spark.remove(), { once: true });
      }, { passive: true });
    }
  }

  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (reduceMotion) return;
      const box = button.getBoundingClientRect();
      for (let i = 0; i < 7; i += 1) {
        const spark = document.createElement("span");
        spark.className = "click-spark";
        spark.setAttribute("aria-hidden", "true");
        spark.style.setProperty("--x", `${event.clientX ? event.clientX - box.left : box.width / 2}px`);
        spark.style.setProperty("--y", `${event.clientY ? event.clientY - box.top : box.height / 2}px`);
        spark.style.setProperty("--angle", `${i * 51}deg`);
        button.append(spark);
        spark.addEventListener("animationend", () => spark.remove(), { once: true });
      }
    });
  });
})();
