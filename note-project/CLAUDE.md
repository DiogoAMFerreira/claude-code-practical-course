# CLAUDE.md

We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up to date information.
Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 app using the App Router (`app/` directory), React 19, TypeScript, and Tailwind CSS v4.

**Key dependencies:**

- **Tiptap** (`@tiptap/react`) — rich text editor for notes
- **better-auth** — authentication library
- **Zod** — schema validation
- **SQLite** via `DB_PATH` env var — local database for persistence

## Environment Setup

Copy `.env.example` to `.env.local` before running:

- `BETTER_AUTH_SECRET` — must be 32+ characters
- `DB_PATH` — path to SQLite database file (e.g., `data/app.db`)
