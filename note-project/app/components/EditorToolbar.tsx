"use client";

import { Editor } from "@tiptap/react";

type Props = { editor: Editor | null };

type ButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled: boolean;
  label: string;
  title: string;
};

function ToolbarButton({ onClick, active, disabled, label, title }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active
          ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

export default function EditorToolbar({ editor }: Props) {
  const disabled = !editor;

  return (
    <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-neutral-300 dark:border-neutral-700">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        active={editor?.isActive({ bold: true })}
        disabled={disabled}
        label="B"
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        active={editor?.isActive({ italic: true })}
        disabled={disabled}
        label="I"
        title="Italic"
      />
      <span className="w-px bg-neutral-300 dark:bg-neutral-700 mx-0.5" />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setParagraph().run()}
        active={editor?.isActive("paragraph")}
        disabled={disabled}
        label="P"
        title="Paragraph"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor?.isActive("heading", { level: 1 })}
        disabled={disabled}
        label="H1"
        title="Heading 1"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor?.isActive("heading", { level: 2 })}
        disabled={disabled}
        label="H2"
        title="Heading 2"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor?.isActive("heading", { level: 3 })}
        disabled={disabled}
        label="H3"
        title="Heading 3"
      />
      <span className="w-px bg-neutral-300 dark:bg-neutral-700 mx-0.5" />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        active={editor?.isActive("bulletList")}
        disabled={disabled}
        label="List"
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCode().run()}
        active={editor?.isActive("code")}
        disabled={disabled}
        label="<>"
        title="Inline Code"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        active={editor?.isActive("codeBlock")}
        disabled={disabled}
        label="```"
        title="Code Block"
      />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        disabled={disabled}
        label="—"
        title="Horizontal Rule"
      />
    </div>
  );
}
