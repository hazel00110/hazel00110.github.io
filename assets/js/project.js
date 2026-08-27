// project.js — renders the Featured Projects grid from data/projects.json.
import { escapeHTML } from "./utils.js";

const STATUS_STYLES = {
  Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  "In Progress": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Planned: "bg-navy-50 text-navy-600 dark:bg-navy-700/40 dark:text-navy-300",
};

function techBadges(technologies = []) {
  return technologies
    .map(
      (t) =>
        `<span class="rounded-md bg-surface-light dark:bg-navy-800 px-2 py-1 font-mono text-[11px] text-ink-soft dark:text-navy-300">${escapeHTML(
          t
        )}</span>`
    )
    .join("");
}

function projectCard(project) {
  const statusClass = STATUS_STYLES[project.status] || STATUS_STYLES.Planned;

  const links = [];
  if (project.githubUrl) {
    links.push(
      `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft dark:text-navy-300 hover:text-accent transition-colors" aria-label="View ${escapeHTML(
        project.title
      )} source on GitHub"><i data-lucide="github" class="h-4 w-4"></i>Code</a>`
    );
  }
  if (project.liveDemo) {
    links.push(
      `<a href="${project.liveDemo}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft dark:text-navy-300 hover:text-accent transition-colors" aria-label="View live demo of ${escapeHTML(
        project.title
      )}"><i data-lucide="external-link" class="h-4 w-4"></i>Live demo</a>`
    );
  }
  if (project.caseStudy) {
    links.push(
      `<a href="${project.caseStudy}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft dark:text-navy-300 hover:text-accent transition-colors" aria-label="Read case study for ${escapeHTML(
        project.title
      )}"><i data-lucide="file-text" class="h-4 w-4"></i>Case study</a>`
    );
  }
  if (project.link) {
    links.push(
      `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft dark:text-navy-300 hover:text-accent transition-colors" aria-label="Go to link for ${escapeHTML(
        project.title
      )}"><i data-lucide="arrow-up-right" class="h-4 w-4"></i>Go to link</a>`
    );
  }

  return `
  <article class="project-card reveal card card-hover overflow-hidden flex flex-col" data-category="${escapeHTML(
    project.category
  )}">
    <div class="relative aspect-[16/10] overflow-hidden bg-surface-light dark:bg-navy-800">
      <img
        src="${project.thumbnail}"
        alt="Preview screenshot of ${escapeHTML(project.title)}"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onerror="this.onerror=null;this.src='https://placehold.co/640x400/eef2f8/1e293b?text=${encodeURIComponent(
          project.title
        )}';"
      />
      ${
        project.featured
          ? `<span class="absolute left-3 top-3 rounded-full bg-navy-800/90 dark:bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">Featured</span>`
          : ""
      }
      <span class="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}">${escapeHTML(
    project.status
  )}</span>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <div>
        <p class="font-mono text-xs uppercase tracking-wide text-accent">${escapeHTML(project.category)}</p>
        <h3 class="mt-1 text-lg font-bold text-navy-800 dark:text-white">${escapeHTML(project.title)}</h3>
      </div>
      <p class="text-sm leading-relaxed text-ink-soft dark:text-navy-300">${escapeHTML(project.description)}</p>
      <div class="mt-auto flex flex-wrap gap-1.5 pt-2">${techBadges(project.technologies)}</div>
      <div class="flex flex-wrap items-center gap-4 border-t border-navy-100 dark:border-navy-700/60 pt-4">
        ${links.join("")}
      </div>
    </div>
  </article>`;
}

export function renderProjects(projects, container) {
  if (!container || !Array.isArray(projects)) return;
  container.innerHTML = projects.map(projectCard).join("");
  if (window.lucide) window.lucide.createIcons();
}

export function buildCategoryList(projects) {
  const categories = new Set(projects.map((p) => p.category));
  return ["All", ...Array.from(categories).sort()];
}
