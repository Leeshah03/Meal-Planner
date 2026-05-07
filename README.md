# Weekly Meal Planner

A mobile-first web app that eliminates dinner decision fatigue for a vegetarian household — plan the week's dinners, track pantry inventory, and auto-generate a smart shopping list that skips ingredients you already have.

---

## Features

- **Week View** — drag-and-drop dinner slots for Sun–Sat, starting fresh each week
- **Recipe Library** — save vegetarian recipes with ingredients, quantities, and prep time
- **Pantry Tracker** — log what's in stock; items auto-remove when quantity hits zero
- **Smart Shopping List** — computed from the week's meals minus pantry stock, grouped by category using fuzzy matching (typo-forgiving: "Tomatoe" matches "Tomatoes")
- **Magic Link Auth** — passwordless login via Supabase, works seamlessly on phone and laptop
- **Row-Level Security** — every user sees only their own data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Magic Link) |
| Styling | Tailwind CSS v4 |
| Fuzzy Matching | Fuse.js |
| Toasts | Sonner |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/Leeshah03/Meal-Planner.git
cd Meal-Planner
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in your Supabase dashboard under **Project Settings → API**.

### 3. Set up the database

Run the migration in the Supabase SQL editor:

```bash
# Copy and run the contents of:
supabase/migrations/001_initial_schema.sql
```

This creates the `recipes`, `week_plan`, and `pantry` tables with Row-Level Security enabled.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — log in with a Magic Link to get started.

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Week view (home)
│   ├── recipes/              # Recipe library
│   ├── pantry/               # Pantry tracker
│   ├── shopping-list/        # Auto-generated shopping list
│   ├── login/                # Magic Link login
│   ├── auth/callback/        # Supabase auth redirect handler
│   └── components/           # WeekGrid, MealPicker, RecipeCard, PantryItem, ShoppingList
├── lib/
│   ├── recipes.ts            # Recipe CRUD
│   ├── week-plan.ts          # Week plan CRUD
│   ├── pantry.ts             # Pantry CRUD
│   ├── shopping-list.ts      # Derived shopping list logic (fuzzy pantry matching)
│   ├── types.ts              # Shared TypeScript types
│   └── supabase/             # Supabase client (browser + server)
└── supabase/
    └── migrations/           # SQL schema
```

---

## How the Shopping List Works

The shopping list is **derived, not stored** — it's computed fresh each time from:

1. All recipes assigned to the current week
2. Aggregated ingredients across those recipes
3. Fuzzy-matched against pantry stock (Fuse.js at 0.2 threshold)

Items already in the pantry appear in a "You already have" section; everything else is grouped by category in the "To buy" list. This avoids sync complexity and keeps pantry data as the single source of truth.

---

## Running Tests

```bash
npm test          # watch mode
npm run test:run  # single run (CI)
```

Tests cover all core data utilities (`recipes`, `week-plan`, `pantry`, `shopping-list`) and key UI components using Vitest + Testing Library.

---

## Design Decisions

| Decision | Reason |
|---|---|
| Dinner-only MVP | Keeps scope tight and shippable |
| Magic Link auth | No passwords to forget; works on phone at the grocery store |
| Shopping list is computed | Avoids stale data and sync bugs |
| Week starts Sunday | Matches typical meal planning behavior |
| Fuse.js at 0.2 threshold | Catches common typos without false positives |
| Pantry auto-removes at 0 | Less manual cleanup for the user |

---

## Deployment

The app is ready to deploy on [Vercel](https://vercel.com):

```bash
vercel deploy --prod
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard. Add your Vercel deployment URL to the **Supabase Auth → Redirect URLs** allowlist.
