---
description: Update documentation, commit and push to the latest branch
---

# /closeout

Use this workflow to wrap up a development session and maintain a clean project history.

## Prerequisites
- `/code-review` has been completed
- `/fix` has been completed with zero remaining bugs/debt
- BUGS.md shows all items resolved for current phase

## Core Principles
- **Document as You Go**: History is most accurate when fresh.
- **Kaizen (Continuous Improvement)**: Each session should leave the codebase better than it found it.
- **Clean State**: No dangling worktrees or uncommitted changes.
- **Atomic History**: Ensure the branch is ready for merge or PR.

## The Process

## The Process

### 1. Integration of Learnings
- **Pull Lessons**: Retrieve the "Lessons Learned" established in the recent `/teach-me` session.
- **Update Lessons Artifact**: Ensure `lessons_learned.md` is current.

### 2. Documentation Update
- **Project Structure**: Update `PROJECT_HISTORY.md` with:
    - Date and Phase
    - Key Accomplishments (Bullet points)
    - Key Learnings (from Step 1)
- **Roadmap**: Update `PROJECT_ROADMAP.md` to mark completed items.
- **Bugs**: Ensure `docs/BUGS.md` reflects any new items or resolutions.

### 3. Workflow Synchronization
- Run the `/sync-workflows` workflow to ensure local workflow improvements are upstreamed to the quickstart repo (if applicable) or synced down.
    - *Note*: If we modified a workflow locally (like we just did for `teach-me`), we want to save that.

### 4. Git Hygiene
- **Commit**: Ensure all changes (including doc updates) are committed.
- **Push**: Push the current feature/phase branch to valid remote.

### 4.5 CI Smoke Test
- **Simulate CI locally** before pushing: `npm run lint && npm test && npm run build`
- **Verify CI config**: Ensure `.github/workflows/ci.yml` references only existing `npm` scripts (run `grep 'npm run' .github/workflows/ci.yml` and cross-check against `package.json`)
- **Secret Hygiene**: If the phase added new env vars, confirm they exist in GitHub → Settings → Secrets → Actions
- **Node Version**: Confirm the CI matrix targets only **active LTS** Node versions (check [nodejs.org/releases](https://nodejs.org/en/about/releases))
- **Integration Tests**: Any test that calls an external service must have a graceful skip guard (`if (!url || !key) return`)

### 5. Phase Transition (If Applicable)
- **Check Roadmap**: Did we just complete a Phase?
- **Branch**: If yes, ask the user if they want to move to debug mode. If they don't then create the branch for the *next* phase (e.g., `git checkout -b feat/phase-4`).
- **Notify**: Inform user of the new active branch.

### 6. Summary
- Provide a final brief summary of the session to the user.