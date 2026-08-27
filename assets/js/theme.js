// theme.js — dark mode toggle with localStorage persistence + system preference fallback.

const STORAGE_KEY = "portfolio-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.setAttribute("data-theme-icon", theme === "dark" ? "sun" : "moon");
  });
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", theme === "dark" ? "#0a1526" : "#ffffff");
}

// Note: the very first theme application (to avoid a flash of the wrong
// theme) happens via a tiny inline script in <head>, before this module
// loads. This module only takes over from there.

export function initTheme() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  });

  // Keep in sync if the user changes OS-level theme and hasn't set an explicit preference.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? "dark" : "light");
  });
}
