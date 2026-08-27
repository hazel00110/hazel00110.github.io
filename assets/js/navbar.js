// navbar.js — sticky navbar, hamburger menu, scroll-spy active link, back-to-top button.
import { debounce } from "./utils.js";

export function initNavbar() {
  const nav = document.querySelector("[data-navbar]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const links = Array.from(document.querySelectorAll("[data-nav-link]"));
  const backToTop = document.querySelector("[data-back-to-top]");

  if (!nav) return;

  // --- Hamburger menu ---------------------------------------------------
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("hidden", isOpen);
      document.body.classList.toggle("overflow-hidden", !isOpen);
    });

    links.forEach((link) =>
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          menu.setAttribute("data-open", "false");
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.add("hidden");
          document.body.classList.remove("overflow-hidden");
        }
      })
    );
  }

  // --- Sticky navbar shadow/background on scroll -------------------------
  const onScroll = () => {
    nav.classList.toggle("shadow-soft", window.scrollY > 8);
    nav.classList.toggle("bg-white/80", window.scrollY > 8);
    nav.classList.toggle("dark:bg-navy-900/80", window.scrollY > 8);
    nav.classList.toggle("backdrop-blur-md", window.scrollY > 8);

    if (backToTop) {
      backToTop.classList.toggle("opacity-0", window.scrollY < 480);
      backToTop.classList.toggle("pointer-events-none", window.scrollY < 480);
    }
  };
  document.addEventListener("scroll", debounce(onScroll, 30), { passive: true });
  onScroll();

  // --- Scroll spy: highlight the nav link for the section in view -------
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // --- Back to top --------------------------------------------------------
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
