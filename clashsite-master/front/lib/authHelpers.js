const STORAGE_KEY = "user";

const safeParse = (value) => {
  if (!value || value === "undefined") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (err) {
    console.error("Failed to parse stored user", err);
    return null;
  }
};

export const getStoredUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(stored);

  if (!parsed) {
    return null;
  }

  if (typeof parsed === "object" && parsed !== null) {
    return parsed;
  }

  if (typeof parsed === "string") {
    return { email: parsed };
  }

  return null;
};

export const persistUser = (profile) => {
  if (!profile) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

export const clearStoredUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const mapSupabaseUserToProfile = (input, fallbackProvider = "email") => {
  const user = input?.user ?? input;
  if (!user) {
    return null;
  }

  const {
    id,
    email = "",
    user_metadata: metadata = {},
    app_metadata: appMeta = {},
  } = user;

  const displayName =
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    metadata.user_name ||
    "";

  return {
    id,
    email,
    name: displayName,
    provider: appMeta.provider || fallbackProvider,
  };
};
