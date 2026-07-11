# ADR-0003 — Role-Based Engineering Workspace

- **Status:** Accepted
- **Date:** 2026-07-11
- **Related Principles:** Shared Reality First, Adapter Replaceability, Vertical Slice Delivery

## Context

The initial repository framing described Nexus as a capability-based platform with broad knowledge-system overtones. That framing stretched beyond the intended product scope and made the kernel shape less clear than necessary.

## Decision

Nexus is a role-based AI engineering workspace for Visual Studio Code. The kernel will stay intentionally small and will coordinate missions, Shared Reality assembly, execution strategy, role assignment, Adapter execution, review, and knowledge capture.

Providers are execution adapters only. They do not own planning, mission logic, architecture, repository understanding, or engineering policy.

## Consequences

- Kernel contracts should be expressed in terms of missions, context, roles, execution, review, and knowledge.
- Shared Reality remains essential, but only as an implementation mechanism for grounded engineering work.
- Adapter names should not be embedded into architectural concepts.
- Future expansion should follow complete engineering workflow slices rather than broad horizontal abstractions.

## Follow-On Guidance

When introducing a new feature, first ask whether it directly improves software engineering inside Visual Studio Code. If not, it likely does not belong in Nexus.
