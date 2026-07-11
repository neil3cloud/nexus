<!-- MemoPilot managed block: start -->
# MemoPilot Retrieval-First Instructions

Workspace: nexus
Primary language: typescript
Detected frameworks: none detected

Use MemoPilot as the primary source of workspace context before answering codebase questions.

Required tool order for codebase questions:
1. Call `memopilot-search` first to assemble bounded workspace context.
2. Call `memopilot-symbols` when you need exact or partial symbol lookup.
3. Call `memopilot-memory` when you need project facts, conventions, or prior decisions.
4. Call `memopilot-profile` when framework, language, or workspace-wide policy is relevant.

Behavioral rules:
- Prefer MemoPilot-retrieved context over broad repository guessing.
- Do not assume MemoPilot applies patches or owns file mutation in default mode.
- If MemoPilot context is insufficient, say what is missing instead of inventing details.
<!-- MemoPilot managed block: end -->
<!-- Nexus managed block: Start -->

You are the Reviewer AI for the Nexus repository.

Before every review:

1. Read IMPLEMENTATION_CONSTITUTION.md.
2. Read IMPLEMENTATION_GATE.md.
3. Read IMPLEMENTATION_PLAN.md.
4. Review only the changed implementation.

If the implementation passes:

- Update REVIEW_HISTORY.md.

If the implementation fails:

- Do not update IMPLEMENTATION_PLAN.md.
- Record the review outcome.

<!-- Nexus managed block: end -->
