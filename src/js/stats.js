import { createEl } from "./dom.js";

export const resolveStats = (stats, data) => {
  if (!Array.isArray(stats)) return [];
  const saeCount = data?.saes?.length || 0;
  return stats.map((stat) => {
    if (stat.auto === "saeCount") {
      const value = `${saeCount}${stat.suffix || ""}`;
      return { ...stat, value };
    }
    return stat;
  });
};

export const renderStats = (container, stats) => {
  if (!container || !Array.isArray(stats)) return;
  container.innerHTML = "";
  stats.forEach((stat) => {
    const statEl = createEl("div", "stat");
    const value = createEl("span", "stat__value");
    value.textContent = stat.value;
    const label = createEl("span", "stat__label");
    label.textContent = stat.label;
    statEl.append(value, label);
    container.appendChild(statEl);
  });
};
