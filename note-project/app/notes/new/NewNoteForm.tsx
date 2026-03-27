"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createNote } from "@/app/actions/notes";
import { useState } from "react";
import EditorToolbar from "@/app/components/EditorToolbar";

export default function NewNoteForm() {
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: "",
    immediatelyRender: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contentJson = JSON.stringify(editor?.getJSON() ?? {});
    await createNote(title, contentJson);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2.5 text-lg font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-400"
      />
      <div className="border border-neutral-300 dark:border-neutral-700 rounded-md focus-within:ring-2 focus-within:ring-neutral-400 bg-white dark:bg-neutral-900">
        <EditorToolbar editor={editor} />
        <div className="min-h-64 px-4 py-3 prose prose-neutral dark:prose-invert max-w-none [&_.tiptap]:outline-none">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          Save Note
        </button>
      </div>
    </form>
  );
}
