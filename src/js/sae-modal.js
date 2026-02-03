import { loadSaeDetail } from "./data.js";
import { createEl, createEmptyState } from "./dom.js";
import { renderStats } from "./stats.js";

let modalInstance = null;
let lastFocusedElement = null;

const createModal = () => {
  if (modalInstance) return modalInstance;
  const modal = createEl("div", "modal");
  modal.id = "sae-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");

  const content = createEl("div", "modal__content");
  const header = createEl("header", "modal__header");
  const headerText = createEl("div", "modal__header-text");
  const closeBtn = createEl("button", "modal__close");
  closeBtn.type = "button";
  closeBtn.textContent = "Fermer";
  closeBtn.setAttribute("aria-label", "Fermer la fenêtre");

  header.append(headerText, closeBtn);
  const body = createEl("div", "modal__body");
  content.append(header, body);
  modal.appendChild(content);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => closeModal());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  modalInstance = { modal, headerText, body, closeBtn };
  return modalInstance;
};

export const openSaeModal = async (id) => {
  const modal = createModal();
  modal.modal.classList.add("is-open");
  modal.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lastFocusedElement = document.activeElement;

  modal.headerText.innerHTML = "";
  modal.body.innerHTML = "";
  const loading = createEl("p", "lead");
  loading.textContent = "Chargement de la SAÉ...";
  modal.headerText.appendChild(loading);

  const sae = await loadSaeDetail(id);
  if (!sae) {
    modal.headerText.textContent = "SAÉ introuvable.";
    modal.body.appendChild(createEmptyState("Impossible de charger cette SAÉ."));
    modal.closeBtn.focus();
    return;
  }

  modal.headerText.innerHTML = "";
  const tag = createEl("p", "tag");
  tag.textContent = sae.tag || `SAÉ — ${sae.semester || "Semestre"}`;
  const title = createEl("h2");
  title.textContent = sae.title;
  const lead = createEl("p", "lead");
  lead.textContent = sae.lead || sae.short || "";
  modal.headerText.append(tag, title, lead);

  const stats = createEl("div", "stats");
  renderStats(stats, [
    { value: sae.duration || "-", label: "Durée" },
    { value: `${sae.deliverables?.length || sae.deliverablesCount || 0}`, label: "Livrables" },
    { value: `${sae.teamSize || 1}`, label: "Équipe" }
  ]);
  modal.body.appendChild(stats);

  modal.body.appendChild(buildInfoSection(sae));
  modal.body.appendChild(buildDescriptionSection(sae));
  modal.body.appendChild(buildProcessSection(sae));
  modal.body.appendChild(buildDeliverablesSection(sae));
  modal.body.appendChild(buildApprentissagesSection(sae));
  modal.body.appendChild(buildResourcesSection(sae));
  modal.body.appendChild(buildModalFooter(sae));

  modal.closeBtn.focus();
};

export const closeModal = () => {
  if (!modalInstance) return;
  modalInstance.modal.classList.remove("is-open");
  modalInstance.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const buildSectionTitle = (titleText, subtitleText) => {
  const wrapper = createEl("div", "section__title");
  const title = createEl("h2");
  title.textContent = titleText;
  const subtitle = createEl("p");
  subtitle.textContent = subtitleText;
  wrapper.append(title, subtitle);
  return wrapper;
};

const buildInfoSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(buildSectionTitle("Informations", "Données clés pour situer rapidement la SAÉ."));
  const grid = createEl("div", "info-grid");
  const items = sae.info || {
    "Temps du projet": sae.duration || "-",
    "Nombre de livrables": `${sae.deliverables?.length || sae.deliverablesCount || 0}`,
    "Nombre de personnes": sae.teamSize ? `${sae.teamSize} étudiants` : "1 étudiant",
    Outils: sae.tools || "-"
  };
  Object.entries(items).forEach(([label, value]) => {
    const item = createEl("div", "info-item");
    const labelEl = createEl("p", "info-item__label");
    labelEl.textContent = label;
    const valueEl = createEl("p", "info-item__value");
    valueEl.textContent = value;
    item.append(labelEl, valueEl);
    grid.appendChild(item);
  });
  section.appendChild(grid);
  return section;
};

const buildDescriptionSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(
    buildSectionTitle("Description du projet", "Le contexte, le besoin et la solution proposée.")
  );
  const block = createEl("div", "text-block");
  const text = createEl("p");
  text.textContent = sae.description || sae.short || "";
  block.appendChild(text);
  section.appendChild(block);
  return section;
};

const buildProcessSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(
    buildSectionTitle("Déroulement du projet", "Les étapes clés pour montrer la méthode de travail.")
  );
  const timeline = createEl("div", "timeline");
  const steps = sae.process || [];
  if (steps.length === 0) {
    timeline.appendChild(createEmptyState("Déroulement non renseigné."));
  } else {
    steps.forEach((step, index) => {
      const item = createEl("div", "timeline__item");
      const title = createEl("h3");
      title.textContent = `${index + 1}. ${step.title}`;
      const text = createEl("p");
      text.textContent = step.text;
      item.append(title, text);
      timeline.appendChild(item);
    });
  }
  section.appendChild(timeline);
  return section;
};

const buildDeliverablesSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(buildSectionTitle("Livrables", "Ce qui a été produit concrètement."));
  const grid = createEl("div", "grid-3");
  const items = sae.deliverables || [];
  if (items.length === 0) {
    grid.appendChild(createEmptyState("Livrables non renseignés."));
  } else {
    items.forEach((deliverable) => {
      const card = createEl("article", "card");
      const title = createEl("h3");
      title.textContent = deliverable.title;
      const text = createEl("p");
      text.textContent = deliverable.description;
      card.append(title, text);
      grid.appendChild(card);
    });
  }
  section.appendChild(grid);
  return section;
};

const buildApprentissagesSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(
    buildSectionTitle("Apprentissages critiques", "Ce que cette SAÉ a permis d'acquérir.")
  );
  const block = createEl("div", "text-block");
  const list = createEl("ul", "list");
  const items = sae.apprentissages || [];
  if (items.length === 0) {
    block.appendChild(createEmptyState("Apprentissages non renseignés."));
  } else {
    items.forEach((item) => {
      const li = createEl("li");
      li.textContent = item;
      list.appendChild(li);
    });
    block.appendChild(list);
  }
  section.appendChild(block);
  return section;
};

const buildResourcesSection = (sae) => {
  const section = createEl("section", "section");
  section.appendChild(
    buildSectionTitle("Ressources mobilisées", "Modules, cours et outils utilisés.")
  );
  const grid = createEl("div", "grid-2");
  const butCard = createEl("article", "card");
  const butTitle = createEl("h3");
  butTitle.textContent = "Ressources BUT";
  const butText = createEl("p");
  butText.textContent = sae.resources?.but || "-";
  butCard.append(butTitle, butText);

  const toolsCard = createEl("article", "card");
  const toolsTitle = createEl("h3");
  toolsTitle.textContent = "Outils";
  const toolsText = createEl("p");
  toolsText.textContent = sae.resources?.tools || "-";
  toolsCard.append(toolsTitle, toolsText);

  grid.append(butCard, toolsCard);
  section.appendChild(grid);
  return section;
};

const buildModalFooter = (sae) => {
  const footer = createEl("div", "modal__footer");
  const link = createEl("a", "btn btn--ghost");
  link.href = `sae-template.html?id=${sae.id}`;
  link.textContent = "Ouvrir la page SAÉ";
  footer.appendChild(link);
  return footer;
};
