---
description: Perform a combined technical and UX audit of newly built code.
---

# /audit

Use this workflow to ensure code is production-ready and aesthetically perfect before merging. This replaces separate code review and UX verification steps.

## 1. Technical Audit (The "Engine" Check)
Inspect the implementation for reliability and performance.
*   **P0 Standards**: Consult `.agent/REFERENCE.md` for the Technical Reliability checklist (Timeouts, Idempotency, etc.).
*   **Test Verification**: Run the test suite. If tests are missing or failing, the audit is **FAILED**.
*   **Clean Code**: Check for YAGNI, DRY, and proper Modularization. Use `reducing-entropy` skill to minimize code bloat.

## 2. UX & Aesthetic Audit (The "Chassis" Check)
Verify the interface and user interaction.
*   **Design Standards**: Consult `.agent/REFERENCE.md` for Visual and Interaction standards (Teal anchor, Spring physics).
*   **Manual Verification**: 
    1. Run `npm run dev`.
    2. Open [http://localhost:3000].
    3. Verify responsiveness, Dark Mode parity, and "The Librarian" brand voice.

## 3. Results & Remediation
*   **Small Fixes**: Correct minor typos, spacing, or color variables immediately.
*   **Blocking Issues**: Add any bugs or UX debt to `BUGS.md` with `/log`.
*   **Audit Status**:
    *   ✅ **PASS**: Specs met, P0s satisfied, Aesthetics verified.
    *   ❌ **FAIL**: Known bugs, P0 violations, or UX drift.

**Next Step**: Once audit is passing, run `/teach-me` followed by `/closeout`.
