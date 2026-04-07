# Project History

---

## 2026-04-04 — Design Phase

**Status:** Complete ✅

**Session summary:**
- Defined core problem: reduce dinner decision fatigue and food waste for a vegetarian family household
- Chose stack: Next.js 14 + Supabase + Tailwind CSS
- Scoped MVP to dinner planning only (7-day grid) + shopping list + pantry inventory
- Key decision: pantry inventory directly addresses the waste goal — shopping list auto-subtracts what's already at home
- Key decision: Fuse.js fuzzy matching at threshold 0.2 (80% similarity) — case-insensitive, typo-forgiving
- Design doc written: `docs/plans/2026-04-04-meal-planner-design.md`
- Mockup approved: `public/prototype_meal_planner.html`
- Implementation plan written: `docs/plans/2026-04-04-meal-planner-implementation.md`

---

## 2026-04-04–07 — Build & Audit Phase

**Status:** Complete ✅

**Key accomplishments:**
- Phase 1: Scaffolded Next.js 14 + Supabase SSR + Tailwind v4 + Vitest — clean from the start
- Phase 2: Magic link auth — login page, middleware (route protection), auth callback route
- Phase 3: Full data layer with repository pattern — `getRecipes`, `getWeekPlan`, `assignRecipe`, `clearDay`, `getPantryItems`, `addPantryItem`, `updateQuantity`, `deletePantryItem` — all tested with mocked Supabase
- Phase 3: `computeShoppingList` — pure TypeScript, Fuse.js fuzzy matching, ingredient aggregation, category grouping
- Phase 4: 6 UI components — `WeekGrid`, `MealPicker`, `PantryItem`, `ShoppingList`, `RecipeCard`, `AddRecipeForm` — all tested with Testing Library
- Phase 5: 4 pages (Week, Recipes, Pantry, Shopping List) + skeleton loading states + server actions with `revalidatePath`
- Audit: Fixed 3 critical bugs (missing `user_id` in inserts, wrong upsert conflict target, missing timeout wrapper)

**Test count:** 64 tests across 12 files — 100% passing

**CI smoke test:**
- `npm run lint` — clean (0 errors)
- `npm run test:run` — 64/64 passing
- `npm run build` — clean, 4 dynamic routes rendered correctly

**Key files:**
- `lib/shopping-list.ts` — core business logic, Fuse.js fuzzy pantry matching
- `lib/with-timeout.ts` — 10s timeout wrapper for all Supabase calls
- `app/actions.ts` — server mutations with revalidatePath + error handling
- `supabase/migrations/001_initial_schema.sql` — run in Supabase SQL editor to set up DB

**Lessons learned:**
- Supabase `PostgrestFilterBuilder` is `PromiseLike<T>` not `Promise<T>` — `withTimeout` must accept `PromiseLike<T>` and wrap with `Promise.resolve()` for `Promise.race()`
- Always include `user_id` in Supabase inserts — RLS alone doesn't inject it; NOT NULL constraint will silently block writes
- Upsert conflict targets must match the exact columns in the unique constraint (including `user_id`)
- Tailwind v4 uses `@theme {}` in CSS instead of `tailwind.config.ts` for design tokens
- `create-next-app` infers package name from directory — spaces and capitals cause failure; scaffold to temp dir then rsync

**What's needed to ship:**
1. Create a Supabase project at supabase.com
2. Copy project URL + anon key into `.env.local`
3. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor
4. `npm run dev` — app is live at localhost:3000

**Next (post-MVP):**
- Breakfast and lunch planning
- Recipe editing (currently add/delete only)
- Offline PWA support for shopping list
- Nutritional tracking
