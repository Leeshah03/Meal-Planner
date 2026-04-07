---
description: Extract intuition-building lessons and process improvements from the recent work session.
---

# /teach-me: Architectural Masterclass

Use this workflow to evolve your **Spec-Crafting** and **System Design** intuition. The goal is to learn how to architect ideas so that they are modular, maintainable, and easy for AI agents to execute flawlessly.

> [!IMPORTANT]
> **Audience**: The user is a beginner coder. ALL explanations must use plain-language analogies first (e.g., "kitchen vs. dining room"), THEN introduce the formal term in parentheses. Never assume the user knows terms like "dependency injection", "observer pattern", or "interface" without explaining them.

## 1. Architectural Patterns (The Blueprint)
*   **The Concept**: What is the formal name for the pattern we used? Explain it with an everyday analogy first (e.g., "like a recipe card that tells the kitchen what to cook" = *Interface*), then give the technical name.
*   **Modularization**: Identify where we separated "what the user sees" from "how data is fetched." Explain why this makes the codebase safer to change — use the restaurant analogy (kitchen = server, dining room = client) or similar.
*   **Standardization (DRY)**: Where did we copy-paste similar code? Explain what a shared utility is ("one recipe used by many chefs") and how to spot the need for one next time.

## 2. Agent-Centric Spec-Crafting
*   **The Promptable Constraint**: What specific instruction could you have included in your original request to ensure the agent built it the right way automatically? Frame this as "next time, try saying: ___".
*   **The Contract**: Explain how writing down "what data comes back and what it looks like" (the TypeScript interface / order slip) before building anything makes both the data source and the UI easier to build. Use the order-slip analogy.

## 3. Workflow Meta-Evolution
*   **The Friction**: Identify the exact point where the session felt slow or the agent was "confused." 
*   **The Patch**: Suggest a specific update to `/brainstorm`, `/plan`, `/audit`, or `/fix` to prevent this friction next time.
*   **The Snippet**: Provide a concrete markdown checklist item or instruction to insert into the target workflow.

## 4. Summary
*   **The One-Sentence Pivot**: A rule for your next session to help you architect better — stated in plain English, not jargon.
