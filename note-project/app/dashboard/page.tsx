import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import { getNotesByUser } from "@/lib/notes";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const notes = getNotesByUser(session.user.id);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">My Notes</h1>
          <Link
            href="/notes/new"
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">No notes yet. Create one!</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {note.title}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-4 shrink-0">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
