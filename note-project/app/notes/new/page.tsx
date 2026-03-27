import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import NewNoteForm from "./NewNoteForm";

export default async function NewNotePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">New Note</h1>
        <NewNoteForm />
      </main>
    </>
  );
}
