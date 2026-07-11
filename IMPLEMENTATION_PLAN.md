# IMPLEMENTATION_PLAN.md

## Current Phase

VS Code Extension Foundation

Status

🟢 Completed

---

## Completed

- Initial VS Code Extension Scaffold
- Kernel Control Plane Lifecycle
- Kernel Event Bus Infrastructure
- Placeholder Kernel Services
- Interface Contracts and Identity Models
- Extension Build, Lint, and Test Configuration
- Task-001 Kernel Folder Structure Relocation
- Task-002 Event Catalog Envelope Reconciliation
- Task-003 Mission and DomainEvent Contract Deduplication
- Task-004 Speculative Placeholder Removal
- Task-005 EventBus Hardening
- Task-006 Implementation Plan and Report Correction
- Task-007 Pino Logging Adoption
- Task-008 ServiceLifecycle and Kernel Lifecycle Test Coverage
- Task-009 VS Code Host Semantics Polish
- Task-010 Review Ledger Correction
- Task-011 Sprint Scope Process Deviation Report
- Task-012 Terminal EventBus Disposal
- Task-013 EventBus Mission Attribution Invariant Enforcement
- Task-014 Event Bus Reference Contract Reconciliation
- Task-015 Terminal Kernel Disposal

---

## Current Task

Task-015 complete

---

## Next Task

Next prioritized implementation task

---

## Blockers

None

---

## Progress Log

### 2026-07-11

Completed:

- Initial compilable VS Code extension
- Kernel creation, service initialization, lifecycle shutdown, and command registration
- Placeholder services for Mission, Evidence, Shared Reality, Execution, Review, and Knowledge
- EventBus publish and subscribe infrastructure
- Strict TypeScript, ESLint, Vitest, and esbuild validation
- Task-001 kernel code relocation from pattern folders into capability and common folders
- Task-002 reconciled the Kernel Event Catalog envelope with RFC-0005 and flagged Projection Service naming for human ratification
- Task-003 removed duplicate Mission, DomainEvent, and all shadow id-only capability stubs while preserving authoritative contracts
- Task-004 removed speculative unreferenced placeholders and misplaced top-level providers, telemetry, execution, and review directories
- Task-005 hardened EventBus unsubscription, handler error isolation, deep immutability, in-memory replay, and post-dispose publish behavior
- Task-006 corrected implementation progress history and added the required bootstrap implementation report
- Task-007 adopted Pino behind the VS Code host KernelLogger while keeping the Kernel independent of Pino
- Task-008 added ServiceLifecycle transition tests and Kernel lifecycle edge-case coverage
- Task-009 tidied VS Code host command messaging, disposable ownership, activation metadata, deactivate export, and DomainEvent Mission identity precedence
- Task-010 restored `REVIEW_HISTORY.md` to its empty pre-change state after removing the Builder-authored PASS entry
- Task-011 recorded the accepted sprint-scope process deviation in the implementation report
- Task-012 made EventBus disposal terminal and documented post-dispose publish, subscribe, and replay behavior
- Task-013 enforced the DomainEvent Mission identity invariant between `missionId` and `attribution.missionId`
- Task-014 reconciled the Event Bus interface-contract reference with the implemented `replay(missionId)` signature and terminal-disposal behavior
- Task-015 made Kernel disposal terminal and idempotent to match EventBus lifecycle ownership
