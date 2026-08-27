// typing.js — small dependency-free typewriter effect for rotating role titles.

export function initTyping(selector = "[data-typing]", words = [], options = {}) {
  const el = document.querySelector(selector);
  if (!el || !words.length) return;

  const { typeSpeed = 70, deleteSpeed = 40, pause = 1400 } = options;

  // Respect users who've asked for reduced motion: show the first word, static.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        return setTimeout(tick, pause);
      }
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  tick();
}
