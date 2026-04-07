---
description: Create a detailed, TDD-first implementation plan from an approved design.
---

# /plan

Use this workflow once a design has been approved to create a bite-sized, executable path forward.

## Core Principles
- **TDD-First**: Every task must start with a failing test.
- **Architectural Rigor**: Apply Clean Architecture, SOLID, and Domain-Driven Design (DDD) to ensure maintainability and high quality.
- **Bite-sized Granularity**: Each task should take 2-5 minutes to implement.
- **Zero Ambiguity**: Use exact file paths and specify line ranges when modifying.
- **Goals & Success Criteria**: Every phase must have measurable outcomes.
- **Deep Planning**: For high-stakes or complex features, use the `gepetto` skill to perform exhaustive research and specs synthesis before writing the plan.
- **Visual Clarity**: Use the `c4-architecture` skill to define system boundaries and container relationships for architectural changes.

## Process (Before Generating Plan)

**IF FRONTEND CHANGES ARE REQUIRED:**
1. **Mockup First**: You MUST create a single-file HTML prototype (e.g., `public/prototype_<feature_name>.html`) to mimic functionality and aesthetics.
   - Use standard HTML/CSS/JS (no build step required).
   - Ensure it matches `BRAND_GUIDELINES.md`.
   - Mimic interactions (modals, transitions, states) using vanilla JS.
2. **User Validation**: Present this mockup to the user for "look and feel" approval.
3. **Iterate**: Refine the mockup until the user says "Yes, build this."
4. **Data First Check**: Before planning UI, define the data source.
   - WHERE does the data come from? (API? Local Storage? File?)
   - IF the source doesn't exist, create a task to build it.
   - *Tip*: "Mocking" in the UI component is technical debt. Mock at the source/API level instead.
5. **Infrastructure Validation**: Before planning UI or API logic, verify that the underlying database schema and environment are ready.
    - Run `npm test tests/infrastructure/schema.test.ts` to ensure the live DB matches expectations.
    - Run `node scripts/status-quovadis.js` to check counts and existing columns.
    - **Environment Check**: Run `grep [REQUIRED_KEY] .env.local` and verify the secret exists in Vercel/Production settings.
    - IF columns are missing, keys are missing, or data types are wrong, create a **Schema/Env Migration** task as the first bite-sized task.
6. **Reliability Pre-flight**: Before finalizing the plan, map all external interactions.
    - [ ] **Timeout Mapping**: Identify every `fetch` or `supabase` call and assign a timeout (10s for standard UI actions, 30s for heavy AI/TTS operations).
    - [ ] **Error Toasts**: Ensure every `catch` block includes both a `toast.error` for the user and a `console.error` for technical debugging.
7. **Conventions Check**: Before writing the plan, read 1-2 existing files in each category you'll be creating (test, component, API route) to learn how the codebase already does things. Document key conventions as constraints in the plan:
     - [ ] **Test Style**: What assertion library? (e.g., `.toBeDefined()` vs `.toBeInTheDocument()`)? What mock patterns?
     - [ ] **File Patterns**: How are imports structured? Named exports or defaults? Where do types live?
     - [ ] **Error Handling**: What's the existing `catch` pattern? Toast + console, or something else?
8. **Plan**: ONLY then, proceed to write the Implementation Plan below, referencing the approved mockup as the "Spec".

## Plan Structure (MUST include these sections)

1. **Header**
   - **Goal**: One sentence describing what this builds.
   - **Architecture**: 2-3 sentences about the approach (e.g., "Dependency Inversion for testing," "Domain Layer isolation").
   - **Design Patterns**: Specify if using Factory, Observer, Repository, etc.
   - **Tech Stack**: Libraries or frameworks involved.

2. **Implementation Phases**
   - Break work down into logic phases (e.g., Phase 1: Data Schema, Phase 2: Core Logic).
   - For each phase, list **Success Criteria** using checkboxes.

3. **Bite-Sized Tasks**
   For each task, provide:
   - **Files**: Create: `path/to/new.ts`, Modify: `path/to/old.ts:L10-20`.
   - **Step 1: Write failing test**: Provide the minimal test code.
   - **Step 2: Verify failure**: Specify the command and expected error.
   - **Step 3: Implement minimal code**: Provide the smallest implementation.
   - **Step 4: Verify pass**: Specify command and expected output.
   - **Step 5: Commit**: Provide the bash command and atomic message.

4. **Technical Debt Strategy**
   - Identify any known shortcuts or "hacks" being introduced to meet the goal.
   - List them explicitly so they can be added to `BUGS.md` or a technical debt tracker if the plan is approved without addressing them immediately.

5. **Production & Design Standards (P0)**
   - Before finalizing the plan, ensure the design satisfies the standards in **.agent/REFERENCE.md**.
   - **Timeout Mapping**: Identify every `fetch` or `supabase` call and assign a timeout (10s for standard UI, 30s for AI) as per REFERENCE.md.
   - **Error Handling**: Plan for `toast.error` + `console.error` on every async path.
   - **Loading States**: Every new route MUST include a `loading.tsx` with skeleton loaders.

6. **For UI Features**
   - Check for `.interface-design/system.md`
   - If exists: Load and apply established patterns in implementation plan
   - If not: Include design system creation as a task in the plan

## Persistence
- Save the plan to `docs/plans/YYYY-MM-DD-<feature-name>.md`.
- Ask the user: "Ready to start building? Use `/build`."

## Phase Completion Requirements

A phase is NOT complete until the following workflow sequence is executed:

1. **`/build`** - Execute the implementation plan
2. **`/audit`** - Perform combined technical and UX verification
3. **`/closeout`** - Document and commit

Skipping `/audit` is not permitted. The phase remains open until BUGS.md shows zero active items for that phase.

**Internal Note**: Use the `test-driven-development` skill during implementation. For complex architecture, use `c4-architecture`. For deep research, use `gepetto`.
