export const buildProfile = (profile = {}) => {
  const firstName = profile.firstName || "";
  const lastName = profile.lastName || "";
  const fullName =
    profile.fullName || [firstName, lastName].filter(Boolean).join(" ").trim();
  const initials =
    profile.initials ||
    [firstName, lastName]
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  return { ...profile, firstName, lastName, fullName, initials };
};

export const applyTokens = (text, profile) => {
  if (!text || !profile) return text;
  return text
    .replaceAll("{firstName}", profile.firstName || "")
    .replaceAll("{lastName}", profile.lastName || "")
    .replaceAll("{fullName}", profile.fullName || "")
    .replaceAll("{initials}", profile.initials || "");
};

export const renderSharedProfile = (profile) => {
  if (!profile) return;
  document.querySelectorAll("[data-profile]").forEach((el) => {
    const key = el.getAttribute("data-profile");
    const value = profile[key];
    if (value) el.textContent = value;
  });
  document.title = applyTokens(document.title, profile);
};
