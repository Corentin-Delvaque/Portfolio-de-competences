import { qsa } from "./dom.js";

export const initNavigation = () => {
  const navLinks = qsa(".nav a");
  if (navLinks.length === 0) return;

  const normalizePath = (path) => path.replace(/\/index\.html$/, "/");
  const currentPath = normalizePath(window.location.pathname);

  const getUrl = (href) => {
    try {
      return new URL(href, window.location.href);
    } catch {
      return null;
    }
  };

  const sectionIds = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href) return null;
      const url = getUrl(href);
      if (!url) return href.startsWith("#") ? href.slice(1) : null;
      const samePage = normalizePath(url.pathname) === currentPath;
      return samePage ? url.hash.replace("#", "") : null;
    })
    .filter((id) => id);

  const markCurrentPage = () => {
    const pageLink = navLinks.find((link) => {
      const href = link.getAttribute("href");
      if (!href) return false;
      const url = getUrl(href);
      if (!url) return false;
      const samePage = normalizePath(url.pathname) === currentPath;
      return samePage && (!url.hash || url.hash === "#");
    });

    if (pageLink) {
      navLinks.forEach((item) => item.classList.remove("active"));
      pageLink.classList.add("active");
    }
  };

  if (sectionIds.length > 0) {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinks.find((item) =>
            item.getAttribute("href").includes(entry.target.id)
          );
          if (link && entry.isIntersecting) {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    markCurrentPage();
  }
};
