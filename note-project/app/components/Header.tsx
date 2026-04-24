import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Link
        href="/dashboard"
        className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
      >
        NextNotes
      </Link>
      {session && <LogoutButton />}
    </header>
  );
}
