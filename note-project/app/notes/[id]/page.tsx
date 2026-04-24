import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import NoteViewer from "@/app/components/NoteViewer";
import DeleteNoteButton from "@/app/components/DeleteNoteButton";
import ShareToggle from "@/app/components/ShareToggle";
import { getNoteById } from "@/lib/notes";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const { id } = await params;
  const note = getNoteById(session.user.id, id);
  if (!note) notFound();

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {note.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/notes/${note.id}/edit`}
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Edit
            </Link>
            <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
          </div>
        </div>
        <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
          <ShareToggle
            noteId={note.id}
            initialIsPublic={note.isPublic}
            initialSlug={note.publicSlug}
          />
        </div>
        <NoteViewer contentJson={note.contentJson} />
      </main>
    </>
  );
}
