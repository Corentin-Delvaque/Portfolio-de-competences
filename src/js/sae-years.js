import { qs, createEl, createEmptyState } from "./dom.js";
import { renderStats, resolveStats } from "./stats.js";
import { buildSaeCard } from "./sae-card.js";

export const renderSaeYears = (data) => {
  const container = qs("#sae-years");
  if (!container) return;
  container.innerHTML = "";

  const yearsMap = new Map();
  (data.saes || []).forEach((sae) => {
    if (!yearsMap.has(sae.year)) yearsMap.set(sae.year, []);
    yearsMap.get(sae.year).push(sae);
  });

  const years = Array.from(yearsMap.keys()).sort((a, b) => a - b);
  if (years.length === 0) {
    container.appendChild(createEmptyState("Aucune SAÉ disponible."));
    return;
  }

  years.forEach((year) => {
    const section = createEl("section", "section");
    section.id = `but${year}`;
    const titleWrap = createEl("div", "section__title");
    const title = createEl("h2");
    title.textContent = `BUT ${year}`;
    const summary = createEl("p");
    const yearInfo = data.years?.find((item) => item.year === year);
    summary.textContent =
      yearInfo?.summary || "SAÉ et compétences travaillées pendant cette année.";
    titleWrap.append(title, summary);

    const grid = createEl("div", "grid-2");
    yearsMap.get(year).forEach((sae) => grid.appendChild(buildSaeCard(sae)));

    section.append(titleWrap, grid);
    container.appendChild(section);
  });

  renderStats(qs("#sae-stats-years"), resolveStats(data.statsYears || [], data));
};
