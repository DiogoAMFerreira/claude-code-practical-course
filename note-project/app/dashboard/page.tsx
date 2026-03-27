import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

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
      </main>
    </>
  );
}
