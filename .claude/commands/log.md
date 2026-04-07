---
description: Log bugs, technical debt, or feature ideas into the tracking system.
---

# /log

Use this workflow to capture future work—whether it's a bug, technical debt, or a new feature idea—without starting implementation.

## 1. Categorization
Determine the destination of the entry based on the user's intent:
*   **Bugs/Debt**: Functional issues or "code smell" (DRY violations, missing timeouts).
    *   *Destination*: `BUGS.md`
*   **Features/Ideas**: New capabilities or enhancements.
    *   *Destination*: `ROADMAP.md`

## 2. The Capture Process

### If BUG or DEBT:
1.  Add a row to the **Active** table in `BUGS.md`.
2.  Use the format: `| [ID] | Description | Severity | Status | Note |`
3.  **Severity**: Critical (Breaks app), High (Degrades UX), Medium (Utility), Low (Polish/Debt).

### If FEATURE or IDEA:
1.  Locate `ROADMAP.md`.
2.  Determine if it belongs in the **Current Phase** (small UX tweak) or **Future Phases** (new capabilities).
3.  Add a row with Feature Name, Description, and Status/Priority.

## 3. The "No-Work" Clause
*   **Do NOT** investigate the root cause.
*   **Do NOT** propose a fix or design.
*   **Do NOT** start a new branch.
*   **Do NOT** read more than the minimum files needed for categorization.

## 4. Confirmation
"Added [ID] to [File]. I am NOT starting work on this now."
