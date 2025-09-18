export const ASSET_BASE_URL = "https://api-assets.clashofclans.com";
export const LOCAL_ICON_BASE = "/assets/coc/icons";

export const pickIconUrl = (iconUrls) => {
  if (!iconUrls) return "";
  return iconUrls.medium || iconUrls.large || iconUrls.small || iconUrls.tiny || "";
};

export const buildLocalFromRemote = (url) => {
  if (!url) return "";
  try {
    const { pathname } = new URL(url);
    return `${LOCAL_ICON_BASE}${pathname}`;
  } catch {
    return "";
  }
};

export const buildLabelSources = (label) => {
  if (!label) return { local: "", remote: "" };
  const remote = pickIconUrl(label.iconUrls) || (label.id ? `${ASSET_BASE_URL}/labels/${label.id}.png` : "");
  const localFallback = buildLocalFromRemote(remote) || (label.id ? `${LOCAL_ICON_BASE}/labels/${label.id}.png` : "");
  return { local: localFallback, remote };
};

export const getImageSource = (sources) => (sources?.remote || sources?.local || "");

export const createFallbackHandler = (sources) => (event) => {
  if (sources?.remote && event.currentTarget.dataset.fallback !== "remote") {
    event.currentTarget.dataset.fallback = "remote";
    event.currentTarget.src = sources.remote;
  } else {
    event.currentTarget.onerror = null;
    event.currentTarget.style.visibility = "hidden";
  }
};

export const dedupeLabels = (labels) => {
  if (!Array.isArray(labels) || !labels.length) return [];
  const seen = new Set();
  return labels.filter((label) => {
    if (!label) return false;
    const identifier = label.id ?? label.name;
    if (!identifier) return false;
    const key = String(identifier).toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
