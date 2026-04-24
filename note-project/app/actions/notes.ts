"use server";

import { auth } from "@/lib/auth";
import { run } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createNote(
  title: string,
  contentJson: string
): Promise<{ error: string } | void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const trimmedTitle = title.trim();
  if (!trimmedTitle) return { error: "Title is required" };
  if (trimmedTitle.length > 255) return { error: "Title must be 255 characters or fewer" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    return { error: "Invalid note content" };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed as Record<string, unknown>).type !== "doc" ||
    !Array.isArray((parsed as Record<string, unknown>).content)
  ) {
    return { error: "Invalid note content shape" };
  }

  const safeContentJson = JSON.stringify(parsed);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    run(
      `INSERT INTO notes (id, user_id, title, content_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, session.user.id, trimmedTitle, safeContentJson, now, now]
    );
  } catch {
    return { error: "Failed to create note" };
  }

  redirect(`/notes/${id}`);
}
