import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Header from "@/app/components/Header";
import NoteViewer from "@/app/components/NoteViewer";
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
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          {note.title}
        </h1>
        <NoteViewer contentJson={note.contentJson} />
      </main>
    </>
  );
}
