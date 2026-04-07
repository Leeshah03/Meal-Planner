# Meal Planner — Implementation Plan
**Date:** 2026-04-04  
**Design Doc:** `docs/plans/2026-04-04-meal-planner-design.md`  
**Mockup:** `public/prototype_meal_planner.html` ✅ Approved  
**Status:** Ready to build

---

## Goal
Build a mobile-first weekly dinner planner with pantry tracking and a smart shopping list, using Next.js 14, Supabase, and Tailwind CSS.

## Architecture
- **Clean separation**: `lib/` holds all Supabase queries (repository layer); pages and components never call Supabase directly.
- **Server Components by default**: pages fetch data server-side; only components needing interactivity are `"use client"`.
- **Derived shopping list**: computed at query time from `week_plan + recipes`, cross-referenced against `pantry`. No stored shopping list.

## Design Patterns
- Repository pattern for data access (`lib/recipes.ts`, `lib/pantry.ts`, `lib/week-plan.ts`)
- Compound component for WeekGrid (parent manages state, day cells are dumb)
- Optimistic UI updates for pantry quantity changes

## Tech Stack
Next.js 14 (App Router) · Supabase JS v2 · Tailwind CSS · TypeScript · Vitest + Testing Library

---

## Design System

**Colors (from prototype):**
```
--green:       #3d7a5a   (primary actions, filled days)
--green-light: #e8f5ee   (hover states, ingredient tags)
--green-mid:   #6aab87   (borders, secondary)
--amber:       #e8a838   (pantry "already have" section)
--bg:          #f7f6f2   (page background)
--muted:       #8a8a8a   (secondary text, empty states)
```

**Tailwind config:** extend with these as named colors.

---

## Conventions (to establish from scratch)

- **Tests:** Vitest + `@testing-library/react`. Use `screen.getBy*` queries. Mock Supabase at the module level with `vi.mock`.
- **Imports:** Named exports for components, default exports for pages. Types in `lib/types.ts`.
- **Error handling:** `toast.error(message)` + `console.error(err)` in every `catch` block. Use `sonner` for toasts.
- **Loading states:** Every route needs a `loading.tsx` with skeleton loaders.
- **Async timeouts:** 10s for all Supabase calls (standard UI operations).

---

## Phases

---

### Phase 1 — Scaffold & Infrastructure
**Goal:** Running Next.js app connected to Supabase with the correct schema.  
**Success criteria:**
- [ ] `npm run dev` serves the app at localhost:3000
- [ ] All 3 database tables exist in Supabase
- [ ] Supabase client connects without errors
- [ ] `npm test` runs (even with 0 tests)

---

#### Task 1.1 — Scaffold Next.js app

**Files:** Create project at `/Users/leenashah/WDAI Projects/Meal Planner/`

**Step 1: Run scaffold command**
```bash
cd "/Users/leenashah/WDAI Projects/Meal Planner"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

**Step 2: Install dependencies**
```bash
npm install @supabase/supabase-js @supabase/ssr sonner
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

**Step 3: Verify**
```bash
npm run dev  # should start on port 3000
```

**Step 4: Commit**
```bash
git init && git add -A && git commit -m "scaffold: Next.js 14 + Supabase + Tailwind + Vitest"
```

---

#### Task 1.2 — Configure Tailwind design tokens

**Files:** Modify `tailwind.config.ts`

Add the design system colors from the prototype:
```ts
colors: {
  green: {
    DEFAULT: '#3d7a5a',
    light: '#e8f5ee',
    mid: '#6aab87',
  },
  amber: {
    DEFAULT: '#e8a838',
    light: '#fff8ec',
  },
  bg: '#f7f6f2',
  muted: '#8a8a8a',
}
```

---

#### Task 1.3 — Add Vitest config

**Files:** Create `vitest.config.ts`, update `package.json`

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
```

```json
// package.json — add to scripts:
"test": "vitest",
"test:run": "vitest run"
```

---

#### Task 1.4 — Environment variables

**Files:** Create `.env.local` (gitignored), update `.gitignore`

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from: Supabase Dashboard → Project Settings → API.

---

#### Task 1.5 — Supabase client setup

**Files:** Create `lib/supabase/client.ts`, `lib/supabase/server.ts`

```ts
// lib/supabase/client.ts — browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```ts
// lib/supabase/server.ts — server component client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

**Test (Task 1.5):**
```ts
// lib/supabase/__tests__/client.test.ts
import { describe, it, expect } from 'vitest'
import { createClient } from '../client'

describe('Supabase client', () => {
  it('creates a client without throwing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
    expect(() => createClient()).not.toThrow()
  })
})
```

---

#### Task 1.6 — Database migration

**Files:** Create `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Recipes table
create table recipes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  name        text not null,
  ingredients jsonb not null default '[]',
  prep_time   integer,
  created_at  timestamptz default now()
);
alter table recipes enable row level security;
create policy "Users manage own recipes"
  on recipes for all using (auth.uid() = user_id);

-- Week plan table
create table week_plan (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  week_start  date not null,
  day         integer not null check (day between 0 and 6),
  recipe_id   uuid references recipes(id) on delete set null,
  unique (user_id, week_start, day)
);
alter table week_plan enable row level security;
create policy "Users manage own week plan"
  on week_plan for all using (auth.uid() = user_id);

-- Pantry table
create table pantry (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  name        text not null,
  quantity    numeric not null default 1,
  unit        text,
  added_at    timestamptz default now()
);
alter table pantry enable row level security;
create policy "Users manage own pantry"
  on pantry for all using (auth.uid() = user_id);
```

Run in Supabase SQL editor or via Supabase CLI.

---

### Phase 2 — Auth
**Goal:** Magic link login/logout working on both desktop and mobile.  
**Success criteria:**
- [ ] Visiting `/login` shows email input
- [ ] Submitting email sends a magic link
- [ ] Clicking the link signs the user in and redirects to `/`
- [ ] Unauthenticated users are redirected to `/login`

---

#### Task 2.1 — Auth types & shared types

**Files:** Create `lib/types.ts`

```ts
export interface Ingredient {
  name: string
  qty: number
  unit: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: Ingredient[]
  prep_time: number | null
}

export interface PantryItem {
  id: string
  name: string
  quantity: number
  unit: string
}

export interface WeekPlanEntry {
  id: string
  week_start: string
  day: number          // 0 = Sun, 6 = Sat
  recipe_id: string | null
  recipes: Recipe | null
}
```

---

#### Task 2.2 — Middleware (route protection)

**Files:** Create `middleware.ts`

**Test:**
```ts
// middleware.test.ts
import { describe, it, expect, vi } from 'vitest'
// Test that unauthenticated requests to '/' redirect to '/login'
// Test that '/login' is accessible without auth
```

**Implementation:**
```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll() } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

---

#### Task 2.3 — Login page

**Files:** Create `app/login/page.tsx`, `app/login/actions.ts`

**Test:**
```ts
// app/login/__tests__/login.test.tsx
import { render, screen } from '@testing-library/react'
import LoginPage from '../page'

describe('LoginPage', () => {
  it('renders email input and submit button', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
  })
})
```

---

#### Task 2.4 — Auth callback route

**Files:** Create `app/auth/callback/route.ts`

Handles the magic link redirect, exchanges the code for a session, redirects to `/`.

---

### Phase 3 — Data Layer (Repository)
**Goal:** All Supabase queries isolated in `lib/`, tested with mocks.  
**Success criteria:**
- [ ] Each repository function has a passing unit test
- [ ] No Supabase calls exist outside `lib/`

---

#### Task 3.1 — Recipe repository

**Files:** Create `lib/recipes.ts`, `lib/__tests__/recipes.test.ts`

**Test:**
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getRecipes, createRecipe } from '../recipes'

vi.mock('../supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Recipe repository', () => {
  it('getRecipes returns array of recipes', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: '1', name: 'Dal' }], error: null })
    const mockFrom = vi.fn(() => ({ select: mockSelect }))
    const { createClient } = await import('../supabase/server')
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as any)

    const result = await getRecipes()
    expect(result).toEqual([{ id: '1', name: 'Dal' }])
  })
})
```

**Functions to implement:**
- `getRecipes()` → `Recipe[]`
- `createRecipe(data)` → `Recipe`
- `deleteRecipe(id)` → `void`

---

#### Task 3.2 — Week plan repository

**Files:** Create `lib/week-plan.ts`, `lib/__tests__/week-plan.test.ts`

**Functions:**
- `getWeekPlan(weekStart: string)` → `WeekPlanEntry[]` (with recipes joined)
- `assignRecipe(weekStart, day, recipeId)` → `void`
- `clearDay(weekStart, day)` → `void`

---

#### Task 3.3 — Pantry repository

**Files:** Create `lib/pantry.ts`, `lib/__tests__/pantry.test.ts`

**Functions:**
- `getPantryItems()` → `PantryItem[]`
- `addPantryItem(name, qty, unit)` → `PantryItem`
- `updateQuantity(id, delta)` → `PantryItem | null` (returns null if qty hits 0 and item is deleted)
- `deletePantryItem(id)` → `void`

---

#### Task 3.4 — Shopping list computation

**Files:** Create `lib/shopping-list.ts`, `lib/__tests__/shopping-list.test.ts`

**Dependency:** `fuse.js` — fuzzy string matching
```bash
npm install fuse.js
```

**Matching rules (user decision):**
- Case-insensitive: "Spinach" matches "spinach" ✓
- Fuzzy / typo-forgiving: uses Fuse.js with `threshold: 0.2` (80% similarity)
- "Spinach leaves" in recipe matches "Spinach" in pantry ✓
- "Tomatoe" (typo) matches "Tomatoes" ✓

**Test (critical — this is the core business logic):**
```ts
import { describe, it, expect } from 'vitest'
import { computeShoppingList } from '../shopping-list'

describe('computeShoppingList', () => {
  it('excludes exact pantry matches (case-insensitive)', () => {
    const weekPlan = [
      { recipes: { ingredients: [{ name: 'Spinach', qty: 300, unit: 'g' }] } }
    ]
    const pantry = [{ name: 'spinach', quantity: 1, unit: 'bag' }]
    const { toBuy, haveAlready } = computeShoppingList(weekPlan, pantry)
    expect(toBuy).toHaveLength(0)
    expect(haveAlready[0].name).toBe('Spinach')
  })

  it('excludes fuzzy pantry matches at 80% similarity', () => {
    const weekPlan = [
      { recipes: { ingredients: [{ name: 'Tomatoe', qty: 2, unit: '' }] } }  // typo
    ]
    const pantry = [{ name: 'Tomatoes', quantity: 3, unit: '' }]
    const { toBuy, haveAlready } = computeShoppingList(weekPlan, pantry)
    expect(toBuy).toHaveLength(0)
    expect(haveAlready).toHaveLength(1)
  })

  it('does NOT match ingredients below 80% similarity', () => {
    const weekPlan = [
      { recipes: { ingredients: [{ name: 'Broccoli', qty: 1, unit: '' }] } }
    ]
    const pantry = [{ name: 'Spinach', quantity: 1, unit: 'bag' }]
    const { toBuy } = computeShoppingList(weekPlan, pantry)
    expect(toBuy).toHaveLength(1)
    expect(toBuy[0].name).toBe('Broccoli')
  })

  it('aggregates quantities for the same ingredient across multiple recipes', () => {
    const weekPlan = [
      { recipes: { ingredients: [{ name: 'Tomatoes', qty: 2, unit: '' }] } },
      { recipes: { ingredients: [{ name: 'Tomatoes', qty: 3, unit: '' }] } },
    ]
    const { toBuy } = computeShoppingList(weekPlan, [])
    expect(toBuy[0].qty).toBe(5)
  })
})
```

**Implementation sketch:**
```ts
import Fuse from 'fuse.js'

export function computeShoppingList(weekPlan, pantry) {
  // 1. Aggregate all ingredients from planned recipes
  // 2. Build a Fuse index from pantry item names
  //    const fuse = new Fuse(pantry, { keys: ['name'], threshold: 0.2 })
  // 3. For each ingredient, search the fuse index
  //    - match found → haveAlready
  //    - no match    → toBuy
  // 4. Return { toBuy (grouped by category), haveAlready }
}
```

**Function signature:**
- `computeShoppingList(weekPlan, pantry)` → `{ toBuy: GroupedIngredient[], haveAlready: Ingredient[] }`

---

### Phase 4 — UI Components
**Goal:** All interactive components built and tested in isolation.  
**Success criteria:**
- [ ] Each component renders without errors
- [ ] Key interactions (pick a meal, adjust qty) are covered by tests

---

#### Task 4.1 — WeekGrid component

**Files:** Create `app/components/WeekGrid.tsx`, `app/components/__tests__/WeekGrid.test.tsx`

**Test:**
```ts
it('renders 7 day cards', () => {
  render(<WeekGrid weekPlan={[]} onEdit={vi.fn()} onClear={vi.fn()} weekStart="2026-04-06" />)
  expect(screen.getAllByRole('article')).toHaveLength(7)
})

it('shows recipe name when day is filled', () => {
  const plan = [{ day: 0, recipes: { name: 'Dal Tadka', prep_time: 35 } }]
  render(<WeekGrid weekPlan={plan} onEdit={vi.fn()} onClear={vi.fn()} weekStart="2026-04-06" />)
  expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
})
```

---

#### Task 4.2 — MealPicker modal

**Files:** Create `app/components/MealPicker.tsx`, `app/components/__tests__/MealPicker.test.tsx`

**Test:**
```ts
it('filters recipes by search query', async () => {
  const recipes = [{ id: '1', name: 'Dal Tadka' }, { id: '2', name: 'Pasta' }]
  render(<MealPicker recipes={recipes} onSelect={vi.fn()} onClose={vi.fn()} dayName="Monday" />)
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'dal')
  expect(screen.getByText('Dal Tadka')).toBeInTheDocument()
  expect(screen.queryByText('Pasta')).not.toBeInTheDocument()
})
```

---

#### Task 4.3 — PantryItem component

**Files:** Create `app/components/PantryItem.tsx`, `app/components/__tests__/PantryItem.test.tsx`

**Test:**
```ts
it('calls onAdjust(-1) when minus button clicked', async () => {
  const onAdjust = vi.fn()
  render(<PantryItem item={{ id: '1', name: 'Spinach', quantity: 2, unit: 'bag' }} onAdjust={onAdjust} onDelete={vi.fn()} />)
  await userEvent.click(screen.getByRole('button', { name: /decrease/i }))
  expect(onAdjust).toHaveBeenCalledWith(-1)
})
```

---

#### Task 4.4 — ShoppingList component

**Files:** Create `app/components/ShoppingList.tsx`, `app/components/__tests__/ShoppingList.test.tsx`

**Test:**
```ts
it('marks item as bought when checkbox clicked', async () => {
  const items = { Produce: [{ name: 'Tomatoes', qty: 2, unit: '' }] }
  render(<ShoppingList grouped={items} haveAlready={[]} />)
  await userEvent.click(screen.getByRole('checkbox', { name: /tomatoes/i }))
  expect(screen.getByText('Tomatoes').closest('div')).toHaveClass('opacity-50')
})
```

---

#### Task 4.5 — RecipeCard + AddRecipeForm

**Files:** Create `app/components/RecipeCard.tsx`, `app/components/AddRecipeForm.tsx`

**Test:**
```ts
it('submits form with recipe name and ingredients', async () => {
  const onSave = vi.fn()
  render(<AddRecipeForm onSave={onSave} />)
  await userEvent.type(screen.getByLabelText(/recipe name/i), 'Dal Tadka')
  await userEvent.click(screen.getByRole('button', { name: /save/i }))
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Dal Tadka' }))
})
```

---

### Phase 5 — Pages & Loading States
**Goal:** All 4 routes wired to data, with skeleton loaders.

---

#### Task 5.1 — Week View page (`app/page.tsx`)

Server component — fetches current week's plan. Passes to `WeekGrid` client component. Includes week navigation (URL param: `?week=2026-04-06`).

**Files:** `app/page.tsx`, `app/loading.tsx`

Loading skeleton: 7 gray rounded rectangles mimicking day cards.

---

#### Task 5.2 — Recipes page (`app/recipes/page.tsx`)

Server component — fetches all recipes. Renders `RecipeCard` list + `AddRecipeForm` (client).

**Files:** `app/recipes/page.tsx`, `app/recipes/loading.tsx`

---

#### Task 5.3 — Pantry page (`app/pantry/page.tsx`)

Server component — fetches pantry items. `PantryItem` components handle optimistic quantity updates client-side, then sync to Supabase.

**Files:** `app/pantry/page.tsx`, `app/pantry/loading.tsx`

---

#### Task 5.4 — Shopping List page (`app/shopping-list/page.tsx`)

Server component — fetches `week_plan` + `pantry`, runs `computeShoppingList`, renders `ShoppingList` client component.

**Files:** `app/shopping-list/page.tsx`, `app/shopping-list/loading.tsx`

---

### Phase 6 — Polish & Reliability
**Goal:** Error states, timeouts, offline resilience.

---

#### Task 6.1 — Timeout wrapper

**Files:** Create `lib/with-timeout.ts`

```ts
export async function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  )
  return Promise.race([promise, timeout])
}
```

Wrap every Supabase call in the repository layer.

---

#### Task 6.2 — Error boundaries + toast setup

**Files:** Create `app/components/ToastProvider.tsx`, update `app/layout.tsx`

Add `<Toaster />` from `sonner` to root layout. Add error boundaries to each page.

---

#### Task 6.3 — Empty states

Each page needs a helpful empty state:
- Week View: "Tap a day to add your first dinner"
- Recipes: "Add a recipe to get started"  
- Pantry: "Add items you already have at home"
- Shopping List: "Plan some dinners to generate your list"

---

## Technical Debt

| Item | Notes |
|---|---|
| Pantry matching uses Fuse.js 80% threshold | Covers typos and case differences. May over-match very short ingredient names (e.g. "oil" matching "foil"). Acceptable for MVP. |
| Shopping list grouping is hardcoded | Categories are a fixed lookup. Move to a `category` field on ingredients post-MVP. |
| No offline caching | Shopping list is not PWA-cached. Users need connection at the store. Post-MVP: add `next-pwa`. |
| No recipe editing | Can only add/delete. Edit is a post-MVP feature. |

---

## Production Standards Checklist

- [ ] **Timeouts**: All Supabase calls wrapped in `withTimeout(10000)`
- [ ] **Error handling**: Every `catch` has `toast.error` + `console.error`
- [ ] **Loading states**: All 4 routes have `loading.tsx` skeletons
- [ ] **RLS enabled**: All 3 tables have Row Level Security policies
- [ ] **Auth middleware**: Unauthenticated users redirected to `/login`
- [ ] **No secrets in code**: All Supabase keys in `.env.local`

---

## Build Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
  Setup     Auth      Data      UI       Pages    Polish
```

Each phase must pass `/audit` before moving to the next.

---

**Ready to start building? Use `/build`.**
