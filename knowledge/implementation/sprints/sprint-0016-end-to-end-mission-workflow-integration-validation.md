# Sprint 16 — End-to-End Mission Workflow Integration Validation

## Sprint Status

Approved (NEXUS-REV-2026-07-13-014)

## Sprint Objective

Validate that the implemented Kernel bounded contexts compose correctly into a complete engineering workflow. The objective is to exercise the Kernel using the actual composed services (via `createKernelServices`) rather than isolated unit tests. This sprint validates the implementation. It does **not** expand the architecture.

## Milestone

Milestone 3 — Kernel Integration & Composition (first slice). Beginning with this milestone, implementation priorities shift from introducing new domains to validating composed behavior: integration, composition, deterministic execution, architectural correctness, cross-domain validation, and production readiness — driven by demonstrated integration needs rather than speculative architectural expansion.

## Scope

Sprint 16 SHALL validate the complete Mission workflow:

```text
Create Mission
        ↓
Create Mission Plan
        ↓
Create Tasks
        ↓
Execute Tasks
        ↓
Complete Mission
        ↓
Perform Review
        ↓
Capture Knowledge
```

The workflow SHALL execute using the existing Kernel implementation (`createKernelServices`). No mocked domain behavior SHALL replace implemented services.

## RFC Coverage

Primary: none — this sprint introduces no new normative concepts.

Referenced:

- RFC-0001 — Mission Model
- RFC-0002 — Evidence Model
- RFC-0003 — Shared Reality Projection Model
- RFC-0004 — Execution Model
- RFC-0005 — Domain Event Model
- RFC-0006 — Engineering Assessment Model
- RFC-0007 — Knowledge Model

Sprint 16 validates previously implemented behavior only.

## Authorized Validation

The Builder is authorized to implement:

- end-to-end integration tests;
- composed service validation (via `createKernelServices`, not per-service isolated construction);
- dependency injection composition verification;
- repository interaction validation;
- aggregate interaction validation;
- Domain Event ordering verification;
- cross-domain invariant validation;
- repository-wide execution validation.

## Authorized Builder Scope

The Builder MAY:

- create integration test infrastructure (e.g. `test/integration/`);
- compose existing Kernel services exactly as `createKernelServices` wires them;
- exercise complete Mission workflows end to end;
- add integration fixtures;
- improve deterministic testing where required (e.g. injectable identity/timestamp generators, consistent with the pattern already used throughout Sprint 2–15's unit tests);
- update implementation documentation;
- correct implementation defects discovered during integration testing, **provided they remain within existing approved architecture** — i.e., bug fixes to existing approved behavior, not new concepts, states, or events.

## Scope Restrictions

The Builder SHALL NOT:

- introduce new bounded contexts;
- modify the Kernel Canon;
- modify any RFC;
- redesign aggregate boundaries;
- introduce provider implementations;
- introduce AI integrations;
- introduce VS Code host integration;
- introduce workflow automation;
- introduce production infrastructure;
- implement deferred concepts (see below).

Any architectural defect discovered during integration SHALL be reported through the established Builder/Reviewer workflow and SHALL NOT be resolved by architectural reinterpretation. If integration testing reveals that the workflow cannot complete without a new concept, state, or event, implementation SHALL stop on that point and the gap SHALL be reported rather than filled by assumption, per `IMPLEMENTATION_CONSTITUTION.md` § Documentation Before Code and § Stop Conditions.

## Deferred Concepts

The following remain outside the authorized scope of this sprint:

- Claude CLI integration
- GitHub Copilot integration
- Gemini integration
- Codex integration
- Provider implementations
- Adapter runtime implementations
- VS Code host integration
- Workflow engine
- Automatic sprint generation
- Automatic governance orchestration
- Context Package
- Policy Engine
- Durable Event Streams
- Event subscriptions
- Persistent storage
- Production infrastructure
- Distributed execution
- Background processing

## Acceptance Criteria

Sprint 16 SHALL demonstrate:

- all Kernel services compose successfully;
- the complete Mission workflow (Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge) executes successfully through `createKernelServices`;
- Domain Events are published in deterministic, causally-correct order across all participating domains;
- aggregate boundaries remain intact — no cross-domain internal-entity access;
- repositories coordinate correctly across services that share them (e.g. Mission/MissionPlan repository shared by `MissionService`, `MissionPlanningService`, `MissionExecutionService`, `ProjectionService`);
- dependency injection wiring is valid — the same `EventBusContract` instance flows to every service that publishes;
- cross-domain invariants are preserved (e.g. Knowledge capture's preconditions — supporting Review must be Completed with an accepted outcome, supporting Evidence must exist, originating Mission must be Completed — are genuinely satisfied by the exercised workflow, not stubbed);
- repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild;
- no architectural regressions are introduced.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 3 / Sprint 16, `IMPLEMENTATION_MANIFEST.md` § Milestone 3 / Sprint 16, `knowledge/implementation/milestone-2-completion-report.md`, `knowledge/implementation/repository-readiness-assessment.md`, `src/kernel/common/create-kernel-services.ts` (the actual composition to exercise), each domain's approved aggregate/service (`mission.aggregate.ts`, `mission-plan.aggregate.ts`, `task.ts`, `evidence.aggregate.ts`, `review.aggregate.ts`, `knowledge.aggregate.ts`, and their services), `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Validation / Authorized Builder Scope above.
- Preserve every Deferred Concept without approximation.
- Do not modify any aggregate's business rules or lifecycle transitions. If the workflow cannot be completed without one, stop and report — do not invent a workaround.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 16 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- Repository/EventBus persistence remains in-memory and process-local, consistent with every domain since Sprint 1.
- This sprint validates one specific workflow path (the happy path through Create → Plan → Execute → Complete → Review → Knowledge). It does not attempt exhaustive cross-domain failure-path integration coverage; that remains a candidate for a future Milestone 3 sprint if repository experience shows it's needed.
- No event consumer is introduced; the integration test observes published events directly via the EventBus, it does not add a subscriber.

## Builder Results

Implemented Sprint 16 as an integration-validation slice without adding new normative concepts.

Implemented:

- Added `test/integration/kernel-mission-workflow.integration.test.ts`.
- Exercised the composed Kernel through `createKernelServices` and `Kernel`-owned EventBus injection.
- Validated Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge through public service contracts.
- Validated shared Mission/MissionPlan repository coordination across Mission, MissionPlanning, MissionExecution, and Projection services.
- Validated Knowledge capture preconditions using a completed Mission, accepted completed Review, and existing supporting Evidence produced by the exercised workflow.
- Corrected an integration-discovered RFC-0005 defect where Review outcome-specific events reused the `ReviewCompleted` event identity. `ReviewCompleted` and `ReviewAccepted`/`ReviewRejected` now require distinct Domain Event metadata and publish distinct event identities.

No architectural deviations.

## Test Summary

- `npm test -- --run test\integration\kernel-mission-workflow.integration.test.ts test\kernel\review\review.aggregate.test.ts test\kernel\review\review.service.test.ts` — passed, 3 files / 15 tests.
- `npm run validate` — passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 33 files / 200 tests.

## Reviewer Notes

**Status**

Approved

See `REVIEW_HISTORY.md` entry `NEXUS-REV-2026-07-13-014` for the complete review record, including gate-by-gate compliance, deferred-concept validation, and the one non-blocking Observation (stale Milestone 3 header status, corrected by the Reviewer in `IMPLEMENTATION_PLAN.md`).

The integration-discovered Review event-identity fix (`review.aggregate.ts`/`review.service.ts`) was verified as an in-scope bug fix under Sprint 16's Authorized Builder Scope, restoring RFC-0005's global Domain Event identity uniqueness requirement without introducing any new event, state, or business rule. Independent re-validation confirmed `npm run validate` passes (TypeScript compile, ESLint, Vitest 33 files / 200 tests, esbuild).

## Final Disposition

**PASS.** No architectural violations detected. No open findings. Sprint 16's review cycle is complete.
