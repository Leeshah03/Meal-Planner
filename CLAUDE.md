# My App — Claude Code Instructions

@/Users/leenashah/claude-code-quickstart/CLAUDE.md

---

## About This App

**Name:** Weekly Meal Planner
**Purpose:** Reduce dinner decision fatigue and food waste for a vegetarian family household — plan the week's dinners, track pantry inventory, and auto-generate a smart shopping list.
**Stack:** Next.js 14 (App Router), Supabase (Postgres + Auth), Tailwind CSS
**Key constraints:** Mobile-first (used on phone at grocery store), dinner-only MVP, fully vegetarian, free tier only

---

## Project Structure

- `app/` — Next.js app router pages (week view, recipes, pantry, shopping list)
- `app/components/` — shared UI components (WeekGrid, MealPicker, PantryItem, ShoppingList)
- `lib/` — Supabase client and data utilities
- `supabase/` — database migrations
- `docs/plans/` — design docs and implementation plans

---

## Key Decisions

- Dinner-only for MVP — keeps scope tight and shippable
- Supabase Magic Link auth — no password, works on both phone and laptop
- Shopping list is derived (computed), not stored — avoids sync complexity
- Pantry quantity auto-removes at 0 — less manual cleanup for the user
- Week starts Sunday — matches typical meal planning behavior
- Pantry matching uses Fuse.js at threshold 0.2 (80% similarity) — case-insensitive, typo-forgiving; "Tomatoe" matches "Tomatoes"

---

## Slash Commands

Use these commands during development (defined in `.agent/workflows/`):

| Command | When to use |
|---|---|
| `/brainstorm` | Starting something new — turn an idea into a design doc |
| `/plan` | Break an approved design into TDD-ready tasks |
| `/build` | Execute a plan using subagents and TDD |
| `/audit` | Review finished code for quality and UX |
| `/fix` | Resolve bugs and technical debt |
| `/log` | Log a bug, idea, or debt item to track later |
| `/teach-me` | Extract lessons from the session |
| `/closeout` | Wrap up — changelog, history, push |
