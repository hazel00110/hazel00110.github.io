// utils.js — small, dependency-free helpers shared across modules.

/** Fetch and parse a JSON file, with a friendly console error on failure. */
export async function fetchJSON(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path} responded with ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[data] failed to load ${path}:`, err);
    return null;
  }
}

/** Fetch an HTML partial (component) as a string. */
export async function fetchHTML(path) {
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path} responded with ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`[component] failed to load ${path}:`, err);
    return `<!-- failed to load ${path} -->`;
  }
}

/** Inject a component into every element matching a [data-component] selector. */
export async function mountComponent(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return null;
  target.innerHTML = await fetchHTML(path);
  return target;
}

/** Escape user/data-driven strings before injecting as HTML text. */
export function escapeHTML(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** Tiny debounce for scroll/resize handlers. */
export function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** Dispatch a custom event once, used to signal "components ready" to other modules. */
export function announce(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}
