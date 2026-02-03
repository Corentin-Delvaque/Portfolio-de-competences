import { qs, setText, createEl, createEmptyState, renderList } from "./dom.js";
import { renderStats } from "./stats.js";
import { loadSaeDetail } from "./data.js";

export const renderSaeDetailPage = async (data) => {
  if (!qs("#sae-title")) return;
  const params = new URLSearchParams(window.location.search);
  const idFromUrl = params.get("id");
  const fallbackId = data?.saes?.[0]?.id || null;
  const targetId = idFromUrl || fallbackId;
  const sae = await loadSaeDetail(targetId);

  if (!sae) {
    const lead = qs("#sae-lead");
    if (lead) lead.textContent = "Aucune SAÉ disponible.";
    return;
  }

  document.title = `SAÉ — ${sae.title}`;
  setText("#sae-tag", sae.tag || `SAÉ — ${sae.semester || "Semestre"}`);
  setText("#sae-title", sae.title);
  setText("#sae-lead", sae.lead || sae.short);
  setText("#sae-role", sae.role);

  renderStats(qs("#sae-stats"), [
    { value: sae.duration || "-", label: "Durée" },
    { value: `${sae.deliverables?.length || sae.deliverablesCount || 0}`, label: "Livrables" },
    { value: `${sae.teamSize || 1}`, label: "Équipe" }
  ]);

  const info = qs("#sae-info");
  if (info) {
    info.innerHTML = "";
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
      info.appendChild(item);
    });
  }

  setText("#sae-description", sae.description || sae.short || "");

  const process = qs("#sae-process");
  if (process) {
    process.innerHTML = "";
    const steps = sae.process || [];
    if (steps.length === 0) {
      process.appendChild(createEmptyState("Déroulement non renseigné."));
    } else {
      steps.forEach((step, index) => {
        const item = createEl("div", "timeline__item");
        const title = createEl("h3");
        title.textContent = `${index + 1}. ${step.title}`;
        const text = createEl("p");
        text.textContent = step.text;
        item.append(title, text);
        process.appendChild(item);
      });
    }
  }

  const livrables = qs("#sae-livrables");
  if (livrables) {
    livrables.innerHTML = "";
    const items = sae.deliverables || [];
    if (items.length === 0) {
      livrables.appendChild(createEmptyState("Livrables non renseignés."));
    } else {
      items.forEach((deliverable) => {
        const card = createEl("article", "card");
        const title = createEl("h3");
        title.textContent = deliverable.title;
        const text = createEl("p");
        text.textContent = deliverable.description;
        card.append(title, text);
        livrables.appendChild(card);
      });
    }
  }

  renderList(qs("#sae-apprentissages"), sae.apprentissages || []);
  setText("#sae-resources-but", sae.resources?.but || "-");
  setText("#sae-resources-tools", sae.resources?.tools || "-");
};
