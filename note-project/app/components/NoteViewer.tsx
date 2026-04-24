import { ReactNode } from "react";

interface TipTapMark {
  type: string;
}

interface TipTapNode {
  type: string;
  text?: string;
  marks?: TipTapMark[];
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
}

interface NoteViewerProps {
  contentJson: string;
}

function renderText(node: TipTapNode): ReactNode {
  let el: ReactNode = node.text ?? "";
  if (node.marks) {
    for (const mark of node.marks) {
      if (mark.type === "bold") el = <strong className="font-semibold">{el}</strong>;
      else if (mark.type === "italic") el = <em>{el}</em>;
      else if (mark.type === "code")
        el = <code className="bg-neutral-100 dark:bg-neutral-800 text-rose-600 dark:text-rose-400 rounded px-1 py-0.5 text-sm font-mono">{el}</code>;
    }
  }
  return el;
}

function renderNode(node: TipTapNode, index: number): ReactNode {
  switch (node.type) {
    case "doc":
      return <>{node.content?.map((n, i) => renderNode(n, i))}</>;

    case "paragraph":
      return (
        <p key={index} className="mb-4 text-neutral-800 dark:text-neutral-200 leading-relaxed">
          {node.content?.map((n, i) => renderNode(n, i))}
        </p>
      );

    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      const base = "font-bold text-neutral-900 dark:text-neutral-100 mb-3 mt-6";
      const size = level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg";
      const children = node.content?.map((n, i) => renderNode(n, i));
      if (level === 1) return <h1 key={index} className={`${base} ${size}`}>{children}</h1>;
      if (level === 2) return <h2 key={index} className={`${base} ${size}`}>{children}</h2>;
      return <h3 key={index} className={`${base} ${size}`}>{children}</h3>;
    }

    case "bulletList":
      return (
        <ul key={index} className="list-disc pl-6 mb-4 space-y-1 text-neutral-800 dark:text-neutral-200">
          {node.content?.map((n, i) => renderNode(n, i))}
        </ul>
      );

    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((n, i) => renderNode(n, i))}
        </li>
      );

    case "codeBlock":
      return (
        <pre key={index} className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-4 overflow-x-auto">
          <code className="text-sm font-mono text-neutral-800 dark:text-neutral-200">
            {node.content?.map((n, i) => renderNode(n, i))}
          </code>
        </pre>
      );

    case "horizontalRule":
      return <hr key={index} className="my-6 border-neutral-200 dark:border-neutral-700" />;

    case "text":
      return <span key={index}>{renderText(node)}</span>;

    default:
      return null;
  }
}

export default function NoteViewer({ contentJson }: NoteViewerProps) {
  const doc: TipTapNode = JSON.parse(contentJson);
  return <div className="max-w-none">{renderNode(doc, 0)}</div>;
}
