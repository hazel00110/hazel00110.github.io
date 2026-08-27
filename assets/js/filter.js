// filter.js — category filter pills for the Featured Projects section.

export function initProjectFilter(categories, onFilterChange) {
  const wrap = document.querySelector("[data-filter-list]");
  if (!wrap) return;

  wrap.innerHTML = categories
    .map(
      (cat, i) => `
      <button
        type="button"
        data-filter="${cat}"
        class="filter-pill rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
          i === 0
            ? "border-accent bg-accent text-white"
            : "border-navy-200 dark:border-navy-700 text-ink-soft dark:text-navy-300 hover:border-accent hover:text-accent"
        }"
        aria-pressed="${i === 0}"
      >${cat}</button>`
    )
    .join("");

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    wrap.querySelectorAll("[data-filter]").forEach((b) => {
      const active = b === btn;
      b.setAttribute("aria-pressed", String(active));
      b.classList.toggle("border-accent", active);
      b.classList.toggle("bg-accent", active);
      b.classList.toggle("text-white", active);
      b.classList.toggle("border-navy-200", !active);
      b.classList.toggle("dark:border-navy-700", !active);
      b.classList.toggle("text-ink-soft", !active);
      b.classList.toggle("dark:text-navy-300", !active);
    });

    onFilterChange(btn.getAttribute("data-filter"));
  });
}

export function applyProjectFilter(category) {
  document.querySelectorAll(".project-card").forEach((card) => {
    const match = category === "All" || card.getAttribute("data-category") === category;
    card.classList.toggle("hidden", !match);
  });
}
