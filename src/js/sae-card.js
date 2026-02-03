import { createEl } from "./dom.js";
import { openSaeModal } from "./sae-modal.js";

const shouldOpenModal = (event) => {
  if (!event) return true;
  if (event.defaultPrevented) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (typeof event.button === "number" && event.button !== 0) return false;
  return true;
};

export const buildSaeCard = (sae) => {
  const card = createEl("article", "project");
  card.classList.add("project--clickable");
  card.dataset.saeId = sae.id;
  card.tabIndex = 0;
  card.setAttribute("role", "button");

  card.addEventListener("click", (event) => {
    if (!shouldOpenModal(event)) return;
    event.preventDefault();
    openSaeModal(sae.id);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSaeModal(sae.id);
    }
  });

  const head = createEl("div", "project__head");
  const title = createEl("h3");
  title.textContent = sae.title;
  const badge = createEl("span", "badge");
  if (sae.teamLabel) {
    badge.textContent = sae.teamLabel;
  } else if (sae.teamSize && sae.teamSize > 1) {
    badge.textContent = `Équipe de ${sae.teamSize}`;
  } else {
    badge.textContent = "Solo";
  }
  head.append(title, badge);

  const desc = createEl("p", "project__desc");
  desc.textContent =
    sae.short || sae.lead || sae.description || "SAÉ en cours de rédaction.";

  const meta = createEl("ul", "project__meta");
  const duration = createEl("li");
  duration.textContent = `Durée : ${sae.duration || "-"}`;
  const deliverables = createEl("li");
  const count = sae.deliverables ? sae.deliverables.length : sae.deliverablesCount || 0;
  deliverables.textContent = `Livrables : ${count}`;
  meta.append(duration, deliverables);

  const link = createEl("a", "link");
  link.href = `sae-template.html?id=${sae.id}`;
  link.textContent = "Voir la page SAÉ";

  card.append(head, desc, meta, link);
  return card;
};
