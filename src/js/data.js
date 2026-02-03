const DATA_URL = "data/portfolio.json";
let cachedData = null;
const detailCache = new Map();

export const fetchJson = async (url) => {
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Impossible de charger ${url}`);
  return response.json();
};

export const fetchData = async () => {
  if (cachedData) return cachedData;
  const data = await fetchJson(DATA_URL);
  cachedData = data;
  return data;
};

export const getLatestSaes = (saes, count) => {
  if (!Array.isArray(saes) || saes.length === 0) return [];
  const safeCount = Math.max(1, count || 2);
  const hasDatesForAll = saes.every((sae) => sae.addedAt);
  if (hasDatesForAll) {
    return [...saes]
      .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      .slice(0, safeCount);
  }
  return saes.slice(-safeCount).reverse();
};

export const loadSaeDetail = async (id) => {
  const data = await fetchData();
  if (!id) return null;
  if (detailCache.has(id)) return detailCache.get(id);

  const entry = (data.saes || []).find((item) => item.id === id) || null;
  if (!entry) return null;

  if (entry.dataFile) {
    try {
      const detail = await fetchJson(entry.dataFile);
      const merged = { ...entry, ...detail };
      detailCache.set(id, merged);
      return merged;
    } catch {
      detailCache.set(id, entry);
      return entry;
    }
  }

  detailCache.set(id, entry);
  return entry;
};
