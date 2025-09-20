const parseAdminEmails = () => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS;
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
};

const ADMIN_EMAILS = parseAdminEmails();

export const getStoredUser = () => {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

export const isAdminUser = (user) => {
  if (!user) {
    return false;
  }

  if (user.role && user.role.toLowerCase() === "admin") {
    return true;
  }

  if (typeof user.isAdmin === "boolean") {
    return user.isAdmin;
  }

  const email = user.email?.toLowerCase();
  if (!email) {
    return false;
  }

  if (ADMIN_EMAILS.length === 0) {
    return false;
  }

  return ADMIN_EMAILS.includes(email);
};
