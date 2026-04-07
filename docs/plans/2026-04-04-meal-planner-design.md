# Meal Planner — Design Doc
**Date:** 2026-04-04  
**Status:** Approved  

---

## Problem Statement

Reduce weekly **decision fatigue** and **food waste** for a single planner managing a vegetarian family household.

---

## Success Criteria (MVP)

- Sit down Sunday, plan the week's dinners
- Walk away with a smart shopping list that accounts for what's already at home
- Access the shopping list from phone while grocery shopping

---

## Constraints

- **Dinner only** for MVP (no breakfast/lunch)
- **Fully vegetarian** — no meat/fish in any recipe
- **Mobile + desktop** — must work on both
- Free tier infrastructure only (Supabase free tier)

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for fast mobile load, co-located server/client |
| Styling | Tailwind CSS | Responsive utility classes, mobile-first |
| Database | Supabase (Postgres) | Free tier, real-time sync across devices |
| Auth | Supabase Magic Link | No password, works seamlessly on phone + laptop |

---

## Data Model

```sql
-- Saved vegetarian recipes
recipes (
  id          uuid primary key,
  user_id     uuid references auth.users,
  name        text not null,
  ingredients jsonb not null,  -- [{ name, quantity, unit }]
  prep_time   int,             -- minutes
  created_at  timestamptz
)

-- Weekly dinner plan
week_plan (
  id           uuid primary key,
  user_id      uuid references auth.users,
  week_start   date not null,  -- Sunday of that week
  day          int not null,   -- 0=Sun, 1=Mon ... 6=Sat
  recipe_id    uuid references recipes(id) on delete set null
)

-- Home pantry inventory
pantry (
  id         uuid primary key,
  user_id    uuid references auth.users,
  name       text not null,
  quantity   numeric not null,
  unit       text,             -- e.g. "bag", "kg", "cans"
  added_at   timestamptz
)
```

> The **shopping list is derived** — computed from `week_plan + recipes`, with pantry items cross-referenced and subtracted. No fourth table needed.

---

## Screens

### 1. Week View (default `/`)
- 7-column dinner grid (Sun–Sat)
- Empty cell: tap to open MealPicker modal
- Filled cell: shows recipe name, tap to change, long-press/swipe to clear
- Navigation: Previous / Next week arrows

### 2. Recipes (`/recipes`)
- List of saved vegetarian recipes
- Add new recipe: name, ingredients (name + quantity + unit per row), prep time
- Tap recipe to view/edit

### 3. Pantry (`/pantry`)
- Running list of ingredients currently at home
- Each item: name, quantity, unit
- Actions: **+ / −** to adjust quantity (auto-removes at 0), **delete** to remove immediately
- Add item: name + quantity + unit

### 4. Shopping List (`/shopping-list`)
- Auto-generated from current week's planned dinners
- Ingredients grouped by category (produce, dairy, pantry staples)
- Pantry items that cover an ingredient are **crossed off** or shown in a "You already have" section
- Checkbox per item to mark as bought while shopping

---

## Component Structure

```
app/
├── page.tsx                    — Week View
├── recipes/
│   └── page.tsx                — Recipe list + add form
├── pantry/
│   └── page.tsx                — Pantry inventory
├── shopping-list/
│   └── page.tsx                — Smart shopping list
└── components/
    ├── WeekGrid.tsx             — 7-day dinner grid
    ├── MealPicker.tsx           — Modal: search + assign recipe to a day
    ├── RecipeCard.tsx           — Name, ingredients, prep time
    ├── PantryItem.tsx           — Item row with +/− controls
    └── ShoppingList.tsx         — Grouped, pantry-aware ingredient list
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Recipe deleted while assigned to a day | Cell shows "Recipe removed" — tap to reassign |
| Pantry item quantity reaches 0 | Auto-removed; ingredient reappears on shopping list |
| No meals planned for the week | Shopping list shows empty state with nudge to plan |
| Offline on phone at the store | Shopping list page cached for offline reading |
| Two devices editing simultaneously | Supabase real-time sync; last write wins |

---

## Out of Scope (MVP)

- Breakfast and lunch planning
- Nutritional tracking
- Sharing plans with family members
- Recipe import from URLs
- Meal history / analytics

---

## Next Step

Run `/plan` to break this design into TDD-ready implementation tasks.
