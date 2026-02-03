import { qs, setText, renderList, createEmptyState } from "./dom.js";
import { renderStats, resolveStats } from "./stats.js";
import { buildSaeCard } from "./sae-card.js";
import { applyTokens } from "./profile.js";
import { getLatestSaes } from "./data.js";

export const renderIndex = (data, profile) => {
  if (!qs("#profile-title")) return;
  const profileData = profile || {};

  setText("#profile-program", applyTokens(profileData.program, profileData));
  setText("#profile-title", applyTokens(profileData.headline, profileData));
  setText("#profile-intro", applyTokens(profileData.intro, profileData));
  setText("#profile-goal", applyTokens(profileData.goal, profileData));

  renderStats(qs("#profile-stats"), resolveStats(profileData.stats || [], data));
  renderList(
    qs("#profile-meta"),
    (profileData.meta || []).map((item) => applyTokens(item, profileData))
  );

  setText("#contact-email", applyTokens(profileData.contact?.email, profileData));
  setText("#contact-linkedin", applyTokens(profileData.contact?.linkedin, profileData));
  setText("#contact-phone", applyTokens(profileData.contact?.phone, profileData));

  const cta = qs("#cta-sae");
  if (cta && data.saes && data.saes.length > 0) {
    cta.href = `sae-template.html?id=${data.saes[0].id}`;
  }

  const competences = qs("#competences-list");
  if (competences) {
    competences.innerHTML = "";
    (data.competences || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      const title = document.createElement("h3");
      title.textContent = item.title;
      const desc = document.createElement("p");
      desc.textContent = item.description;
      card.append(title, desc);
      if (item.tagline) {
        const tag = document.createElement("p");
        tag.className = "tagline";
        tag.textContent = item.tagline;
        card.appendChild(tag);
      }
      competences.appendChild(card);
    });
  }

  const preview = qs("#sae-preview");
  if (preview) {
    preview.innerHTML = "";
    const saes = data.saes || [];
    const latestCount = data.settings?.latestCount || 2;
    const items = getLatestSaes(saes, latestCount);
    if (items.length === 0) {
      preview.appendChild(createEmptyState("Aucune SAÉ pour le moment."));
    }
    items.forEach((sae) => preview.appendChild(buildSaeCard(sae)));
  }
};
