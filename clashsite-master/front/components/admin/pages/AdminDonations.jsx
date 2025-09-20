import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const normalizeTag = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  let tag = String(value).trim().toUpperCase();
  if (!tag) {
    return "";
  }

  if (!tag.startsWith("#")) {
    tag = `#${tag}`;
  }

  tag = tag.replace(/[^#A-Z0-9]/g, "");
  return /^#[A-Z0-9]{3,}$/.test(tag) ? tag : "";
};

const AdminDonations = () => {
  const [clans, setClans] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const resetFeedback = useCallback(() => setFeedback(null), []);

  const loadClans = useCallback(async () => {
    setIsLoading(true);
    resetFeedback();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donation-clans`);
      if (!response.ok) {
        throw new Error("Failed to load donation clans.");
      }
      const data = await response.json();
      const list = Array.isArray(data.clans) ? data.clans : [];
      setClans(list);
      setHasChanges(false);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to fetch donation clans." });
    } finally {
      setIsLoading(false);
    }
  }, [resetFeedback]);

  useEffect(() => {
    loadClans();
  }, [loadClans]);

  const handleAddTag = () => {
    resetFeedback();
    const normalized = normalizeTag(newTag);
    if (!normalized) {
      setFeedback({ type: "error", message: "Enter a valid clan tag (example: #ABC123)." });
      return;
    }
    if (clans.includes(normalized)) {
      setFeedback({ type: "error", message: `Clan ${normalized} is already tracked.` });
      return;
    }
    setClans((prev) => [...prev, normalized]);
    setNewTag("");
    setHasChanges(true);
    setFeedback({ type: "info", message: `${normalized} queued. Save to apply.` });
  };

  const handleRemoveTag = (tag) => {
    resetFeedback();
    setClans((prev) => prev.filter((item) => item !== tag));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    resetFeedback();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/donation-clans`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clans }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const detail = Array.isArray(errorBody.invalid) && errorBody.invalid.length
          ? ` Invalid tags: ${errorBody.invalid.join(", ")}.`
          : "";
        throw new Error(errorBody.message || `Failed to save donation clans.${detail}`);
      }

      const data = await response.json();
      const list = Array.isArray(data.clans) ? data.clans : [];
      setClans(list);
      setHasChanges(false);
      setFeedback({ type: "success", message: "Donation clans updated successfully." });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to save donation clans." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setNewTag("");
    loadClans();
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6 text-slate-100 shadow-lg shadow-sky-900/20">
        <h2 className="text-lg font-semibold text-white">Donation Tracker Control</h2>
        <p className="mt-2 text-sm text-slate-300">
          Manage the clans displayed on the public donations leaderboard. Add or remove tags, then save to update the
          shared DonationClans.json file.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.35em]">donations</span>
          <span className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.35em]">
            {`${clans.length} tracked`}
          </span>
          {hasChanges ? (
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 uppercase tracking-[0.35em] text-amber-100">
              unsaved changes
            </span>
          ) : null}
        </div>
      </header>

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : feedback.type === "error"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
              : "border-sky-500/30 bg-sky-500/10 text-sky-100"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 shadow-lg">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Tracked clan tags</h3>
            <p className="text-xs text-slate-400">
              Tags should match the exact format used by Clash of Clans (e.g., #P0LYR8). Duplicates are ignored.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-white/10 px-4 py-2 font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
              disabled={isLoading}
            >
              Reload list
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-sky-500 px-4 py-2 font-semibold uppercase tracking-wide text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                <span className="h-3 w-3 animate-spin rounded-full border border-slate-500 border-t-sky-400" />
                Loading tracked clans...
              </div>
            ) : clans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-4 py-6 text-center text-sm text-slate-400">
                No clans tracked yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {clans.map((tag, index) => (
                  <li
                    key={tag}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-200">
                        {index + 1}
                      </span>
                      <span className="font-mono text-base tracking-wide text-white">{tag}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <label className="flex flex-col gap-2 text-xs font-semibold text-slate-300">
              Add clan tag
              <input
                value={newTag}
                onChange={(event) => {
                  resetFeedback();
                  setNewTag(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="#P0LYR8"
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </label>
            <button
              type="button"
              onClick={handleAddTag}
              className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-400"
            >
              Add clan
            </button>
            <p className="mt-3 text-[11px] leading-5 text-slate-400">
              Saving will overwrite the DonationClans.json file used by the public donations leaderboard. Changes take
              effect immediately after saving.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDonations;
