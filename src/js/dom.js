export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

export const createEl = (tag, className) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
};

export const setText = (target, value) => {
  const el = typeof target === "string" ? qs(target) : target;
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
};

export const renderList = (container, items, className) => {
  if (!container) return;
  container.innerHTML = "";
  (items || []).forEach((item) => {
    const li = createEl("li", className);
    li.textContent = item;
    container.appendChild(li);
  });
};

export const createEmptyState = (text) => {
  const box = createEl("div", "empty-state");
  box.textContent = text;
  return box;
};
