"use server";

import { auth } from "@/lib/auth";
import { run } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createNote(title: string, contentJson: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  if (!title.trim()) throw new Error("Title is required");

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  run(
    `INSERT INTO notes (id, user_id, title, content_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, session.user.id, title.trim(), contentJson, now, now]
  );

  redirect(`/notes/${id}`);
}
