# BUGS & Technical Debt

## Resolved (Audit 2026-04-07)

| # | Severity | Issue | Resolution |
|---|---|---|---|
| 1 | 🔴 Critical | Missing `user_id` in `createRecipe`, `addPantryItem`, `assignRecipe` — would fail NOT NULL + RLS | Added `getUserId()` helper; `user_id` injected into all inserts |
| 2 | 🔴 Critical | `week_plan` upsert conflict target `week_start,day` — missing `user_id` from unique constraint | Changed to `user_id,week_start,day` |
| 3 | 🟡 P0 | No timeout on Supabase calls | Created `lib/with-timeout.ts`; all DB calls wrapped at 10s |
| 4 | 🟡 P0 | `NEXT_PUBLIC_SITE_URL` used but undocumented | Added to `.env.local` template |

---

## Known Technical Debt (Post-MVP)

| # | Severity | Item | Notes |
|---|---|---|---|
| TD-1 | 🟠 Low | Pantry fuzzy matching may over-match short words | "oil" could match "foil". Acceptable at MVP scale. |
| TD-2 | 🟠 Low | Shopping list category grouping is hardcoded | Move to a `category` field on recipe ingredients post-MVP |
| TD-3 | 🟡 Med | No offline caching for shopping list | Add `next-pwa` post-MVP so list is readable without connection at the store |
| TD-4 | 🟡 Med | No recipe editing — add/delete only | Edit flow is a post-MVP feature |
| TD-5 | 🟠 Low | `PantryClient` shows stale list until server revalidation | By design with Next.js Server Components pattern; acceptable UX |
| TD-6 | 🟠 Low | `middleware.ts` deprecation warning in Next.js 16.2.2 | Next.js 16 is moving to `proxy.ts` convention but export API is unstable in 16.2.2 — revisit when stable |
