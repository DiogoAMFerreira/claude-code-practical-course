"use server";

import { auth } from "@/lib/auth";
import { run, get } from "@/lib/db";
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

export async function updateNote(
  noteId: string,
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

  const existing = get<{ id: string }>(
    "SELECT id FROM notes WHERE id = ? AND user_id = ?",
    [noteId, session.user.id]
  );
  if (!existing) return { error: "Note not found" };

  try {
    run(
      `UPDATE notes SET title = ?, content_json = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
      [trimmedTitle, JSON.stringify(parsed), new Date().toISOString(), noteId, session.user.id]
    );
  } catch {
    return { error: "Failed to update note" };
  }

  redirect(`/notes/${noteId}`);
}

export async function deleteNote(noteId: string): Promise<{ error: string } | void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/authenticate");

  const existing = get<{ id: string }>(
    "SELECT id FROM notes WHERE id = ? AND user_id = ?",
    [noteId, session.user.id]
  );
  if (!existing) return { error: "Note not found" };

  try {
    run("DELETE FROM notes WHERE id = ? AND user_id = ?", [noteId, session.user.id]);
  } catch {
    return { error: "Failed to delete note" };
  }

  redirect("/dashboard");
}
