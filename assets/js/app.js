// app.js — boots the whole site: mounts HTML components, fetches JSON data,
// renders every data-driven section, then initializes interactive modules.
import { fetchJSON, mountComponent, escapeHTML } from "./utils.js";
import { initTheme } from "./theme.js";
import { initNavbar } from "./navbar.js";
import { initTyping } from "./typing.js";
import { initScrollReveal, initCountUp } from "./animation.js";
import { renderProjects, buildCategoryList } from "./project.js";
import { initProjectFilter, applyProjectFilter } from "./filter.js";

const SOCIAL_ICON_MAP = {
  github: "github",
  linkedin: "linkedin",
  tableau: "bar-chart-3",
  mail: "mail",
};

/** Fill every element matching [data-bind="key"] within root with a text value. */
function bindText(root, key, value) {
  root.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => {
    el.textContent = value;
  });
}

// ---------------------------------------------------------------------------
// Hero photo — fully JSON-driven via profile.photo in data/profile.json.
// Any field left out falls back to HERO_PHOTO_DEFAULTS below, so the simplest
// possible config is just `"photo": { "src": "assets/images/me.jpg" }`.
//
// Supported keys (all optional):
//   src         - image path (defaults to profile.profileImage)
//   alt         - alt text (defaults to "Foto profil {name}")
//   shape       - "rounded" | "circle" | "square"
//   ratio       - CSS aspect-ratio, e.g. "4 / 5", "1 / 1", "3 / 4"
//   fit         - object-fit value, almost always "cover"
//   focalPoint  - CSS object-position, e.g. "center", "top", "50% 20%".
//                 Use this to nudge the auto-crop if a face/subject gets cut
//                 off — no need to re-edit the image file itself.
//   zoom        - number, 1 = normal, >1 zooms in (e.g. 1.15 = 15% zoom in),
//                 <1 zooms out (won't go below the frame, still covers it)
//   frame       - true/false, adds a subtle ring + shadow around the photo
//   grayscale   - true/false
//   badge       - { enabled, text, dotColor } small status pill over the photo
// ---------------------------------------------------------------------------
const HERO_PHOTO_DEFAULTS = {
  alt: "",
  shape: "rounded",
  // 6/5 keeps the hero card (terminal mock + photo) short enough to fit
  // inside common laptop viewports (1280x720, 1366x768) without scrolling
  // on first load, while still reading as a clear portrait.
  ratio: "6 / 5",
  fit: "cover",
  // Biased toward the top so a portrait/full-body source photo keeps the
  // face in frame even under this shorter ratio — crop eats into the
  // bottom (legs/feet) first, not the head.
  focalPoint: "50% 15%",
  zoom: 1,
  frame: true,
  grayscale: false,
  badge: { enabled: true, text: "Open to work", dotColor: "bg-emerald-500" },
};

const HERO_PHOTO_SHAPE_CLASS = {
  rounded: "rounded-xl",
  circle: "rounded-full",
  square: "rounded-md",
};

/** "Hazel Pernanda Putra" -> "HP" — used as a fallback avatar if the photo fails to load. */
function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words[0]?.[0] || "") + (words[1]?.[0] || "");
}

function renderHeroPhoto(profile) {
  const container = document.querySelector("[data-hero-photo]");
  if (!container) return;

  const photo = {
    ...HERO_PHOTO_DEFAULTS,
    src: profile.profileImage,
    alt: `Foto profil ${profile.name}`,
    ...profile.photo, // profile.json can override any of the above
  };

  const shapeClass = HERO_PHOTO_SHAPE_CLASS[photo.shape] || HERO_PHOTO_SHAPE_CLASS.rounded;
  const frameClass = photo.frame ? "ring-1 ring-navy-900/10 dark:ring-white/10 shadow-soft" : "";
  const filterClass = photo.grayscale ? "grayscale" : "";
  const showBadge = photo.badge?.enabled && photo.badge?.text;
  const initials = getInitials(profile.name);

  // aspect-ratio + object-fit:cover means ANY source image (portrait,
  // landscape, huge, tiny) gets auto-cropped to fill the frame with no
  // distortion. focalPoint just shifts which part of the image stays visible.
  container.innerHTML = `
    <div class="group relative overflow-hidden ${shapeClass} ${frameClass}" style="aspect-ratio:${escapeHTML(photo.ratio)};">
      <img
        src="${escapeHTML(photo.src || "")}"
        alt="${escapeHTML(photo.alt)}"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${filterClass}"
        style="object-position:${escapeHTML(photo.focalPoint)}; transform:scale(${Number(photo.zoom) || 1});"
        onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');"
      />
      <div class="hidden absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/15 to-navy-900/10 dark:from-accent/25 dark:to-navy-950/50 font-display text-4xl font-extrabold tracking-wide text-accent dark:text-accent-light">
        ${escapeHTML(initials)}
      </div>
      ${
        showBadge
          ? `
      <div class="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-navy-900/90 px-3 py-2 text-xs font-medium text-navy-700 dark:text-navy-200 shadow-soft backdrop-blur">
        <span class="relative flex h-2 w-2 shrink-0">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full ${photo.badge.dotColor} opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full ${photo.badge.dotColor}"></span>
        </span>
        <span class="truncate">${escapeHTML(photo.badge.text)}</span>
      </div>`
          : ""
      }
    </div>`;
}

function renderSocialIcons(social) {
  document.querySelectorAll("[data-social-icons]").forEach((container) => {
    container.innerHTML = social
      .map(
        (s) => `
        <a
          href="${s.url}"
          ${s.url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
          aria-label="${escapeHTML(s.platform)}"
          class="grid h-10 w-10 place-items-center rounded-xl border border-navy-200 dark:border-navy-700 text-ink-soft dark:text-navy-300 transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          <i data-lucide="${SOCIAL_ICON_MAP[s.icon] || "link"}" class="h-[18px] w-[18px]"></i>
        </a>`
      )
      .join("");
  });
}

function renderHero(profile) {
  bindText(document, "name", profile.name);
  bindText(document, "availability", profile.availability);
  bindText(document, "intro", profile.intro);

  renderHeroPhoto(profile);

  initTyping("[data-typing]", profile.titles, { typeSpeed: 65, deleteSpeed: 35, pause: 1300 });
}

function renderAbout(profile) {
  bindText(document, "about-summary", profile.about.summary);
  bindText(document, "about-objective", profile.about.objective);
  bindText(document, "location", profile.location);
  bindText(document, "availability-full", `${profile.availability}. Based in ${profile.location} \u2014 happy to work remote or on-site.`);

  const interests = document.querySelector("[data-interests-list]");
  if (interests) {
    interests.innerHTML = profile.about.interests
      .map((i) => `<span class="badge"><i data-lucide="sparkle" class="h-3.5 w-3.5"></i>${escapeHTML(i)}</span>`)
      .join("");
  }
}

function renderAboutEducation(education) {
  const container = document.querySelector("[data-about-education]");
  if (!container || !education?.length) return;
  const first = education[0];
  container.innerHTML = `
    <div>
      <p class="text-sm font-semibold text-navy-800 dark:text-white">${escapeHTML(first.degree)}</p>
      <p class="text-sm text-ink-soft dark:text-navy-300">${escapeHTML(first.institution)} \u00b7 ${escapeHTML(first.period)}</p>
    </div>`;
}

const SKILL_ICON_FALLBACK = "box";

function renderSkills(skills) {
  const grid = document.querySelector("[data-skills-grid]");
  if (!grid) return;
  grid.innerHTML = skills
    .map(
      (group, i) => `
      <div class="reveal card p-6" style="transition-delay:${i * 60}ms">
        <h3 class="flex items-center gap-2 text-base font-bold text-navy-800 dark:text-white">
          <i data-lucide="${group.icon || SKILL_ICON_FALLBACK}" class="h-5 w-5 text-accent"></i>
          ${escapeHTML(group.category)}
        </h3>
        <div class="mt-4 flex flex-wrap gap-2">
          ${group.skills.map((s) => `<span class="badge">${escapeHTML(s)}</span>`).join("")}
        </div>
      </div>`
    )
    .join("");
}

function renderTimeline(items, container, { primary, secondary, meta, points }) {
  if (!container || !items?.length) return;
  container.innerHTML = `
    <div class="timeline-line"></div>
    ${items
      .map((item, i) => {
        const isLeft = i % 2 === 0; // desktop: alternate left/right of the center line
        return `
      <div class="reveal relative mb-10 sm:mb-14 sm:flex ${isLeft ? "sm:justify-start" : "sm:justify-end"}" style="transition-delay:${i * 80}ms">
        <span class="absolute left-[7px] top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent bg-white dark:bg-navy-900 sm:left-1/2"></span>
        <div class="pl-8 sm:w-1/2 ${isLeft ? "sm:pl-0 sm:pr-10 sm:text-right" : "sm:pl-10"}">
          <p class="font-mono text-xs uppercase tracking-wide text-accent">${escapeHTML(item[meta])}</p>
          <h3 class="mt-1 text-lg font-bold text-navy-800 dark:text-white">${escapeHTML(item[primary])}</h3>
          <p class="text-sm font-medium text-ink-soft dark:text-navy-300">${escapeHTML(item[secondary])}${item.location ? ` \u00b7 ${escapeHTML(item.location)}` : ""}</p>
          ${
            points && item[points]
              ? `<ul class="mt-2 space-y-1 text-sm leading-relaxed text-ink-soft dark:text-navy-400 ${isLeft ? "sm:list-inside" : ""}">
                  ${item[points].map((p) => `<li>\u2022 ${escapeHTML(p)}</li>`).join("")}
                </ul>`
              : item.details
              ? `<p class="mt-2 text-sm leading-relaxed text-ink-soft dark:text-navy-400">${escapeHTML(item.details)}</p>`
              : ""
          }
        </div>
      </div>`;
      })
      .join("")}
  `;
}

function renderCertifications(certs) {
  const grid = document.querySelector("[data-certifications-grid]");
  if (!grid) return;
  grid.innerHTML = certs
    .map(
      (c, i) => `
      <a
        href="${c.credentialUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="reveal card card-hover flex flex-col items-start gap-3 p-5"
        style="transition-delay:${i * 60}ms"
      >
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-surface-light dark:bg-navy-800 text-accent">
          <i data-lucide="award" class="h-5 w-5"></i>
        </span>
        <div>
          <p class="text-sm font-bold leading-snug text-navy-800 dark:text-white">${escapeHTML(c.name)}</p>
          <p class="mt-1 text-xs text-ink-soft dark:text-navy-400">${escapeHTML(c.issuer)} \u00b7 ${escapeHTML(c.date)}</p>
        </div>
        <span class="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
          View credential <i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i>
        </span>
      </a>`
    )
    .join("");
}

function renderContact(profile, social) {
  const list = document.querySelector("[data-contact-list]");
  if (!list) return;

  const entries = [
    { label: "Email", value: profile.email, url: `mailto:${profile.email}`, icon: "mail" },
    ...social
      .filter((s) => s.platform !== "Email")
      .map((s) => ({ label: s.platform, value: s.url.replace(/^https?:\/\//, ""), url: s.url, icon: SOCIAL_ICON_MAP[s.icon] || "link" })),
  ];

  list.innerHTML = entries
    .map(
      (e) => `
      <a
        href="${e.url}"
        ${e.url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
        class="card card-hover flex items-center gap-4 p-4 text-left"
      >
        <span class="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-surface-light dark:bg-navy-800 text-accent">
          <i data-lucide="${e.icon}" class="h-5 w-5"></i>
        </span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-navy-800 dark:text-white">${escapeHTML(e.label)}</span>
          <span class="block truncate text-sm text-ink-soft dark:text-navy-400">${escapeHTML(e.value)}</span>
        </span>
      </a>`
    )
    .join("");
}

function renderFooterExtras() {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function applySEO(profile) {
  document.title = profile.seo.title;
  const set = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", profile.seo.description);
  set('meta[name="keywords"]', "content", profile.seo.keywords);
  set('meta[property="og:title"]', "content", profile.seo.title);
  set('meta[property="og:description"]', "content", profile.seo.description);
  set('meta[property="og:url"]', "content", profile.seo.url);
  set('meta[name="twitter:title"]', "content", profile.seo.title);
  set('meta[name="twitter:description"]', "content", profile.seo.description);
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function hideLoader() {
  const loader = document.querySelector("[data-loader]");
  if (!loader) return;
  loader.classList.add("opacity-0", "pointer-events-none");
  setTimeout(() => loader.remove(), 400);
}

async function boot() {
  // 1. Mount static HTML components in parallel.
  await Promise.all([
    mountComponent("[data-component='navbar']", "components/navbar.html"),
    mountComponent("[data-component='hero']", "components/hero.html"),
    mountComponent("[data-component='about']", "components/about.html"),
    mountComponent("[data-component='skills']", "components/skills.html"),
    mountComponent("[data-component='projects']", "components/projects.html"),
    mountComponent("[data-component='experience']", "components/experience.html"),
    mountComponent("[data-component='education']", "components/education.html"),
    mountComponent("[data-component='certifications']", "components/certifications.html"),
    mountComponent("[data-component='contact']", "components/contact.html"),
    mountComponent("[data-component='footer']", "components/footer.html"),
  ]);

  // 2. Fetch all data files in parallel.
  const [profile, skills, projects, experience, education, certifications, social] = await Promise.all([
    fetchJSON("data/profile.json"),
    fetchJSON("data/skills.json"),
    fetchJSON("data/projects.json"),
    fetchJSON("data/experience.json"),
    fetchJSON("data/education.json"),
    fetchJSON("data/certifications.json"),
    fetchJSON("data/social.json"),
  ]);

  // 3. Render every section with its data.
  if (profile) {
    applySEO(profile);
    renderHero(profile);
    renderAbout(profile);
  }
  if (education) {
    renderAboutEducation(education);
    renderTimeline(education, document.querySelector("[data-education-timeline]"), {
      primary: "degree",
      secondary: "institution",
      meta: "period",
    });
  }
  if (skills) renderSkills(skills);
  if (social) {
    renderSocialIcons(social);
    if (profile) renderContact(profile, social);
  }
  if (experience) {
    renderTimeline(experience, document.querySelector("[data-experience-timeline]"), {
      primary: "role",
      secondary: "company",
      meta: "period",
      points: "points",
    });
  }
  if (certifications) renderCertifications(certifications);

  if (projects) {
    const grid = document.querySelector("[data-projects-grid]");
    renderProjects(projects, grid);
    const categories = buildCategoryList(projects);
    initProjectFilter(categories, applyProjectFilter);
  }

  renderFooterExtras();
  refreshIcons();

  // 4. Boot interactive modules once the DOM is fully populated.
  initTheme();
  initNavbar();
  initScrollReveal();
  initCountUp();

  hideLoader();
}

document.addEventListener("DOMContentLoaded", boot);
