// animation.js — scroll-reveal for any element with the `.reveal` class,
// plus a tiny count-up animation for the stat strip.

export function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 40);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/** Animate numeric stat values (e.g. "3.2M+", "24") counting up on view. */
export function initCountUp(selector = "[data-count-up]") {
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  const animate = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return; // non-numeric value, leave as-is
    const [, numStr, suffix] = match;
    const end = parseFloat(numStr);
    const decimals = (numStr.split(".")[1] || "").length;
    const duration = 900;
    const start = performance.now();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = raw;
      return;
    }

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = end * progress;
      el.textContent = `${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  if (!("IntersectionObserver" in window)) {
    targets.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  targets.forEach((el) => observer.observe(el));
}
