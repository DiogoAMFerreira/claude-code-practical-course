"use client";

import { useRef, useState } from "react";
import { deleteNote } from "@/app/actions/notes";

interface DeleteNoteButtonProps {
  noteId: string;
  noteTitle: string;
}

export default function DeleteNoteButton({ noteId, noteTitle }: DeleteNoteButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    setError("");
    const result = await deleteNote(noteId);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-6 shadow-xl backdrop:bg-black/50 max-w-sm w-full m-0"
      >
        <h2 className="text-lg font-semibold mb-2">Delete note?</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          &ldquo;{noteTitle}&rdquo; will be permanently deleted. This cannot be undone.
        </p>
        {error && (
          <p role="alert" className="text-sm text-red-500 mb-4">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
