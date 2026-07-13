# Sprint 17 — Cross-Domain Failure-Path Integration Validation

## Sprint Status

Approved (NEXUS-REV-2026-07-13-017)

## Sprint Objective

Extend the Sprint 16 integration validation by exercising the composed Nexus Kernel through deterministic **failure-path integration scenarios**.

Sprint 16 established that the completed Kernel successfully composes across the nominal ("happy path") Mission workflow.

Sprint 17 validates the complementary architectural guarantee:

> The composed Kernel SHALL reject invalid cross-domain operations safely, deterministically, and without producing unintended side effects.

This sprint introduces **no new architectural concepts**, **no new domain behavior**, and **no new business rules**. It validates only behavior already authorized by the implemented RFCs and approved vertical slices.

## Milestone

Milestone 3 — Kernel Integration & Composition (second slice). Continues the shift, begun by Sprint 16, from introducing new domains to validating composed behavior.

## Architectural Principle

The Kernel has already demonstrated successful orchestration (Sprint 16). This sprint demonstrates **safe orchestration**.

Equivalent invalid requests SHALL:

- fail deterministically;
- preserve aggregate consistency;
- prevent unauthorized state transitions;
- prevent partial persistence;
- prevent unauthorized Domain Event publication.

Failure handling is therefore treated as a first-class architectural property rather than an implementation detail.

## RFC Coverage

Primary: none — this sprint introduces no new normative concepts.

Referenced:

- RFC-0001 — Mission Model
- RFC-0002 — Evidence Model
- RFC-0004 — Execution Model
- RFC-0005 — Domain Event Model
- RFC-0006 — Engineering Assessment Model (implementation vocabulary: Review)
- RFC-0007 — Knowledge Model

Only previously implemented behavior may be exercised. No RFC ownership changes; no specification changes.

## Scope

Sprint 17 SHALL validate deterministic rejection of invalid cross-domain operations through the composed Kernel (`createKernelServices`), complementing Sprint 16's validated nominal workflow. No mocked domain behavior SHALL replace implemented services.

## Authorized Validation

The Builder is authorized to implement:

- failure-path integration tests under `test/integration/`;
- rejection-path validation across composed Kernel services;
- side-effect verification (no partial persistence, no unintended Domain Event publication);
- integration diagnostics;
- repository documentation updates.

## Authorized Builder Scope

The Builder MAY:

- add failure-path integration tests to `test/integration/` exercising the scenarios below through public service contracts only;
- compose existing Kernel services exactly as `createKernelServices` wires them;
- add integration fixtures required for failure-path setup;
- correct implementation defects discovered during integration testing, **provided they remain within existing approved architecture** — i.e., bug fixes to existing approved behavior, not new concepts, states, or events;
- update implementation documentation.

## Failure Scenarios

The Builder SHALL implement integration tests covering at least the following scenarios, each verifying: correct exception/error type; aggregate state unchanged; repository state unchanged; no persistence occurred; no Domain Events published; subsequent valid operations continue to succeed.

### Scenario 1 — Task Dependency Violation

Attempt to execute a Task whose dependencies remain incomplete. Expected: request rejected; Task state unchanged; Mission unchanged; no persistence; no Domain Events published.

### Scenario 2 — Premature Mission Completion

Attempt to complete a Mission with active or incomplete Tasks. Expected: completion rejected; Mission lifecycle unchanged; no completion event published.

### Scenario 3 — Duplicate Mission Plan

Attempt to register a duplicate MissionPlan for the same Mission. Expected: registration rejected; repository unchanged; no duplicate artifacts created.

### Scenario 4 — Invalid Review Registration

Attempt to start a Review for an invalid Mission lifecycle state. Expected: request rejected; Review repository unchanged.

### Scenario 5 — Invalid Knowledge Capture

Attempt Knowledge capture before an accepted, completed Review exists. Expected: operation rejected; Knowledge repository unchanged; no Knowledge events published.

### Scenario 6 — Missing Evidence

Attempt an operation requiring authoritative Evidence when the referenced Evidence is unavailable. Expected: deterministic rejection; no partial state changes.

### Scenario 7 — Invalid Review Completion

Attempt Review completion outside the permitted lifecycle (e.g., before `In Progress`, or twice). Expected: lifecycle validation failure; Review state preserved.

### Scenario 8 — Terminal Mission Planning

Attempt to create or modify a MissionPlan after the Mission has entered a terminal lifecycle state. Expected: operation rejected; MissionPlan unchanged.

## Integration Assertions

Every rejection SHALL verify:

- correct exception or error type;
- aggregate state unchanged;
- repository state unchanged;
- no persistence occurred;
- no Domain Events published;
- subsequent valid operations continue to succeed.

Failure validation SHALL prove transactional consistency.

## Scope Restrictions

The Builder SHALL NOT:

- introduce new bounded contexts;
- modify the Kernel Canon;
- modify any RFC;
- redesign aggregate boundaries;
- introduce provider implementations, AI integrations, VS Code host integration, workflow automation, or production infrastructure;
- implement deferred concepts (see below);
- expand Kernel functionality beyond validating already-approved rejection behavior.

Any architectural defect discovered during integration SHALL be reported through the established Builder/Reviewer workflow and SHALL NOT be resolved by architectural reinterpretation. If a scenario cannot be completed without a new concept, state, or event, implementation SHALL stop on that point and the gap SHALL be reported rather than filled by assumption, per `IMPLEMENTATION_CONSTITUTION.md` § Documentation Before Code and § Stop Conditions.

## Deferred Concepts

The following remain outside the authorized scope of this sprint:

- AI Providers (Claude CLI, GitHub Copilot, Gemini, Codex)
- Adapter runtime implementations, Mock Adapter
- VS Code host integration
- Context Package
- Policy Engine
- Durable Event Streams
- Event subscriptions
- Persistent storage
- Production infrastructure
- Observability / Telemetry
- Retry policies
- Distributed execution

## Acceptance Criteria

Sprint 17 SHALL demonstrate:

- every authorized rejection path (Scenarios 1–8) executes through public Kernel service contracts, not aggregate internals;
- deterministic failure behavior;
- no partial persistence on any rejected operation;
- no unintended Domain Event publication on any rejected operation;
- subsequent valid operations continue to succeed after each rejection is exercised;
- no architectural regressions;
- repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild (`npm run validate`);
- integration tests remain deterministic and repeatable.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 3 / Sprint 17, `IMPLEMENTATION_MANIFEST.md` § Milestone 3 / Sprint 17, the Sprint 16 record and its integration test (`test/integration/kernel-mission-workflow.integration.test.ts`) as the established composition pattern, each domain's approved aggregate/service, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Validation / Authorized Builder Scope above.
- Preserve every Deferred Concept without approximation.
- Do not modify any aggregate's business rules or lifecycle transitions. If a scenario cannot be completed without one, stop and report — do not invent a workaround.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 17 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Test Summary section of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)

Include: validated rejection scenarios, architectural observations, integration coverage, test summary, known limitations.

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- Repository/EventBus persistence remains in-memory and process-local, consistent with every domain since Sprint 1.
- This sprint validates the eight scenarios listed above; it does not attempt exhaustive combinatorial failure-path coverage across every possible invalid state transition in every domain.
- No event consumer is introduced; failure-path tests observe the EventBus directly to assert no unintended publication occurred.

## Expected Outcome

Upon successful completion, Sprint 17 certifies that the Nexus Kernel is correct under both **successful** (Sprint 16) and **failure** (Sprint 17) execution paths, establishing a verified behavioral baseline before introducing external adapters, AI providers, or host integrations.

## Builder Results

Implemented Sprint 17 as a composed Kernel failure-path integration-validation slice without adding new normative concepts.

Implemented:

- Added `test/integration/kernel-failure-paths.integration.test.ts`.
- Exercised all eight authorized rejection scenarios through `Kernel` + `createKernelServices` and public service contracts.
- Validated deterministic rejection for Task dependency violation, premature Mission completion, duplicate MissionPlan registration, duplicate Review registration, invalid Knowledge capture, missing Evidence, invalid Review completion, and terminal Mission planning.
- Validated no unintended Domain Event publication on rejected operations and repository/state preservation through public observable contracts.
- Validated subsequent valid operations continue to succeed after each rejection path.
- Remediated `NEXUS-REV-2026-07-13-015-F-001` per `NEXUS-RAT-2026-07-13-009`: restored the Sprint 9 `ReviewService` orchestration-only baseline and replaced Scenario 4 with duplicate Review registration, an already-approved Review repository rejection path.
- Preserved `ReviewService` without any Mission repository dependency or Mission lifecycle precondition.

Initial Sprint 17 delivery introduced an unauthorized Mission-Completed precondition on `ReviewService.startReview` (`NEXUS-REV-2026-07-13-015-F-001`), exceeding the sprint's validation-only scope and creating a Critical Architectural Violation. That deviation was corrected within Sprint 17 per `NEXUS-RAT-2026-07-13-009` by restoring the Sprint 9 `ReviewService` baseline and replacing Scenario 4 with duplicate Review registration; the correction was verified by `NEXUS-REV-2026-07-13-016`.

## Test Summary

- `npm test -- --run test\integration\kernel-failure-paths.integration.test.ts test\integration\kernel-mission-workflow.integration.test.ts test\kernel\review\review.service.test.ts` — passed, 3 files / 14 tests.
- `npm run validate` — passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 34 files / 208 tests.
- Scenario 4 now exercises duplicate Review registration through approved Sprint 9 Review-domain behavior; Scenarios 1, 2, 3, and 5–8 remain unchanged.

## Reviewer Notes

**Status**

PASS

## Review Summary

See `REVIEW_HISTORY.md` entries `NEXUS-REV-2026-07-13-015` (original review, FAIL), `NEXUS-REV-2026-07-13-016` (remediation review, PASS WITH FINDINGS), and `NEXUS-REV-2026-07-13-017` (documentation remediation review, PASS) for the complete review record.

Original review: Scenarios 1, 2, 3, and 5–8 were correctly implemented within scope from the start. Scenario 4 ("Invalid Review Registration") was not approved: it required an unratified, unauthorized precondition on `ReviewService.startReview` (Mission must exist and have status `'Completed'`), wired into the real Kernel composition — a Critical Architectural Violation (`NEXUS-REV-2026-07-13-015-F-001`).

First remediation, authorized by Sprint Owner Ratification `NEXUS-RAT-2026-07-13-009` (Option A): `ReviewService` and `create-kernel-services.ts` were restored to their exact pre-Sprint-17, Sprint 9/11-approved baseline (verified byte-identical to `HEAD`), and Scenario 4 was replaced with "rejects duplicate Review registration for the same Review identity" — an already-approved, repository-owned Review rejection path using the pre-existing `DuplicateReviewError`. This left one new Minor, non-blocking finding: the Deviations sections in `IMPLEMENTATION_REPORT.md` and this record understated Sprint 17's history by stating "No architectural deviations."

Second remediation: both Deviations sections now accurately disclose the corrected Critical Architectural Violation, matching the disclosure style already established by `IMPLEMENTATION_REPORT.md` § Sprint 11 § Deviations. `git diff --stat HEAD -- src/ test/` confirmed no source or test file changed. `npm run validate` independently re-confirmed: 34 files / 208 tests passing.

Sprint 17's review cycle is now complete with no open findings.

## Findings

- `NEXUS-REV-2026-07-13-015-F-001` (Critical, Category 2 — Architectural Violation): Unauthorized new precondition on `ReviewService.startReview`. **RESOLVED** by `NEXUS-RAT-2026-07-13-009` + TASK-001a/b/c, verified by `NEXUS-REV-2026-07-13-016`.
- `NEXUS-REV-2026-07-13-016-F-001` (Minor, Category 4 — Documentation Drift): Deviations sections understated Sprint 17's history. **RESOLVED**, verified by `NEXUS-REV-2026-07-13-017`.

## Required Actions

None. Sprint 17's review cycle is complete with no open findings.

## Final Disposition

**Approved.** Both the original Critical architectural violation (`NEXUS-REV-2026-07-13-015-F-001`) and the subsequent Minor documentation finding (`NEXUS-REV-2026-07-13-016-F-001`) are fully resolved. `ReviewService`/`create-kernel-services.ts` are verified byte-identical to the pre-Sprint-17 approved baseline; Scenario 4 exercises only already-approved Review-domain behavior; both Deviations sections accurately disclose the corrected deviation. No open findings remain. Milestone 3 progression is not blocked.

Date: 2026-07-13

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-13-017`
