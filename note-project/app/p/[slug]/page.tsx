import { notFound } from "next/navigation";
import { getNoteByPublicSlug } from "@/lib/notes";
import NoteViewer from "@/app/components/NoteViewer";

interface PublicNotePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicNotePage({ params }: PublicNotePageProps) {
  const { slug } = await params;
  const note = getNoteByPublicSlug(slug);
  if (!note) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
        {note.title}
      </h1>
      <NoteViewer contentJson={note.contentJson} />
    </main>
  );
}
