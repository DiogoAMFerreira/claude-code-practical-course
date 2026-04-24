"use client";

import { useState } from "react";
import { toggleNoteSharing } from "@/app/actions/notes";

interface ShareToggleProps {
  noteId: string;
  initialIsPublic: boolean;
  initialSlug: string | null;
}

export default function ShareToggle({ noteId, initialIsPublic, initialSlug }: ShareToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setPending(true);
    setError("");
    const result = await toggleNoteSharing(noteId, !isPublic);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setIsPublic(result.isPublic);
      setSlug(result.publicSlug);
    }
  }

  async function handleCopy() {
    if (!slug) return;
    const url = `${window.location.origin}/p/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const publicUrl = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          disabled={pending}
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 ${
            isPublic ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-300 dark:bg-neutral-600"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 shadow transition-transform ${
              isPublic ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {isPublic ? "Public sharing on" : "Public sharing off"}
        </span>
      </div>

      {isPublic && publicUrl && (
        <div className="flex items-center gap-2 mt-1">
          <input
            readOnly
            value={publicUrl}
            className="flex-1 px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-600 dark:text-neutral-400 font-mono truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
