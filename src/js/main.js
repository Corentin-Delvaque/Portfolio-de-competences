import { initNavigation } from "./navigation.js";
import { fetchData } from "./data.js";
import { buildProfile, renderSharedProfile } from "./profile.js";
import { renderIndex } from "./render-index.js";
import { renderSaeYears } from "./sae-years.js";
import { renderSaeDetailPage } from "./sae-detail.js";
import { createEmptyState, qs } from "./dom.js";

const showLoadError = () => {
  const containers = [
    "#sae-preview",
    "#competences-list",
    "#sae-years",
    "#sae-livrables"
  ];

  containers.forEach((selector) => {
    const target = qs(selector);
    if (target) {
      target.innerHTML = "";
      target.appendChild(
        createEmptyState(
          "Les données ne peuvent pas être chargées en local. Utilise un serveur local ou GitHub Pages."
        )
      );
    }
  });
};

const init = async () => {
  initNavigation();

  try {
    const data = await fetchData();
    const profile = buildProfile(data.profile || {});
    renderSharedProfile(profile);
    renderIndex(data, profile);
    renderSaeYears(data);
    await renderSaeDetailPage(data);
  } catch (error) {
    showLoadError();
  }
};

init();
