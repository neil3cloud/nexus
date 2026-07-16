# Nexus Implementation Report

## Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification

### Implemented Slice

Implemented the Milestone 9 Sprint 62 validation-only vertical slice. No production capability, lifecycle state, domain concept, event consumer, Host/Adapter surface, or architectural dependency was introduced.

Implemented scope:

- Added `test/integration/governance-automation-integration-validation.integration.test.ts`.
- Exercised the complete governed path through existing Sprint 52–61 services and repositories: Review, Repository Policy Evaluation, Ratification Authority Validation, Governance Decision, `GovernanceDecisionRecorded` publication, Governance-Gated Workflow Advancement, Recovery Requirement creation/publication, Recovery Resolution, Recovery-Gated Re-Advancement, and Governance-Gated Mission Completion.
- Covered every required Sprint 62 scenario, including Approved, Rejected, Deferred, Escalation Required, missing Review, invalid/unresolvable ratification attribution, cross-Mission mismatch, idempotency, failed-persistence event silence, and source-level production contract drift detection.
- Confirmed no `src` production contract, `src/hosts`, or `src/adapters` file changed for Sprint 62.

Out of scope and not implemented:

- Withdrawn Recovery Requirement eligibility.
- Recovery-aware Mission completion.
- `MissionPaused` lifecycle correction.
- Generic event subscription/consumer infrastructure.
- Host/Adapter governance surfacing.
- Autonomous ratification or AI governance deliberation.

### RFC Coverage

Referenced RFCs:

- RFC-0001 v1.1 — Mission Model, Governance-Gated Mission Completion consumed unmodified.
- RFC-0004 v1.13 — Execution Model, Governance-Gated Advancement, Recovery Requirement, and Recovery-Gated Re-Advancement Eligibility consumed unmodified.
- RFC-0005 — Domain Event Model, publication/persistence/consumption boundaries exercised unmodified.
- RFC-0006 — Engineering Assessment Model, Review consumed unmodified.
- RFC-0011 — Engineering Governance Model, `GovernanceDecision`, Policy Evaluation, Ratification Authority Validation, and Mission-Scoped Governance Evaluation consumed unmodified.

Implemented Concepts:

- Integration validation suite for the complete Milestone 9 governance lifecycle.
- Milestone 9 closure recommendation.

Deferred Concepts:

- Withdrawn Recovery Requirement eligibility.
- Recovery-aware Mission completion.
- The `MissionPaused` lifecycle inconsistency.
- Generic event subscription/consumer infrastructure.
- Host/Adapter governance surfacing.
- Autonomous ratification and AI governance deliberation.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013` through `NEXUS-RAT-2026-07-16-014`).
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0062-governance-automation-integration-validation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 62 is certification-only and may assemble existing in-memory services/repositories to validate the governed path without creating a production event-subscription infrastructure.
- Recovery Requirement creation is exercised through the existing `RecoveryRequirementGovernanceDecisionConsumer` contract and an explicit test subscription, not through a new generic consumer framework.
- Mission Completion remains governed solely by Mission-attributed `GovernanceDecision` values; Resolved Recovery Requirements restore workflow advancement eligibility only and do not alter Mission Completion.

### Known Limitations

- Sprint 62 certifies the in-memory, single-process Kernel composition exercised by the integration suite.
- It does not certify durable persistence, multi-process event delivery, or Host/Adapter-integrated governance UX, which remain outside the current architecture.
- Milestone 9 is Ready to Close only as a Builder recommendation; formal closure remains a future `nexus-plan`/Reviewer-governed action.

### Validation Summary

- Targeted Sprint 62 validation passed: `governance-automation-integration-validation.integration.test.ts` (15 tests).
- TypeScript compile passed.
- ESLint passed.
- Vitest passed: 85 files, 543 tests.
- esbuild passed.
- Extension-host bundle build passed with `npm run test:extension-host:build`.
- Source-level production contract drift check passed: no `src` production files, `src/hosts`, or `src/adapters` files changed.

### Milestone 9 Closure Recommendation

Ready to Close. The Sprint 62 integration suite validates all fourteen required scenarios across the complete Sprint 52–61 governance automation lifecycle, identifies no production contract drift, and required no defect remediation or architectural deviation.

### Deviations

No architectural deviations.

---

## Sprint 61 — Governance-Gated Mission Completion

### Implemented Slice

Implemented the Milestone 9 Sprint 61 Governance-Gated Mission Completion vertical slice. This sprint additively gates `MissionExecutionService.completeMission` after the existing Sprint 4 Task-completion precondition succeeds and before Mission completion is persisted.

Implemented scope:

- Added `mission-completion-eligibility.ts` with a pure deterministic eligibility function for RFC-0001 v1.1's Required Behavioral Matrix.
- Extended `MissionExecutionService.completeMission` to enumerate `GovernanceDecision`s through the existing `IGovernanceDecisionRepository.enumerate()` contract, filter by `missionId`, and reject completion when any applicable decision is Rejected, Deferred, or Escalation Required.
- Preserved no-applicable-`GovernanceDecision` behavior as non-blocking Sprint 4 completion behavior.
- Wired `createKernelServices()` so the production `MissionExecutionService` receives the shared `IGovernanceDecisionRepository`.
- Added unit/service/integration coverage for every matrix row, independent blocking, pure-function determinism, no repository access inside eligibility evaluation, production wiring, no applicable decisions, and no recovery-symbol references in the new eligibility code.

Out of scope and not implemented:

- Recovery-aware Mission completion.
- Mission-level Recovery Requirement projection or aggregation.
- Engineering Session/Workflow Step attribution bridging.
- Review-outcome or Knowledge-requirement completion gating.
- Event subscribers/consumers or Host/Adapter surfacing.

### RFC Coverage

Primary RFC:

- RFC-0001 v1.1 — Mission Model, Governance-Gated Mission Completion.

Referenced RFCs:

- RFC-0004 v1.11 — Execution Model, Blocking/Non-Blocking Governance Decision classification consumed read-only.
- RFC-0011 v1.1 — Engineering Governance Model, `GovernanceDecision` consumed unmodified.
- RFC-0004 v1.12/v1.13 — Recovery Requirement / Recovery-Gated Re-Advancement referenced only as explicitly out of scope.

Implemented Concepts:

- Governance-Gated Mission Completion.
- Pure Mission Completion governance eligibility evaluation.
- Read-only Mission-attributed Governance Decision enumeration.
- Production repository injection for the shared `IGovernanceDecisionRepository`.

Deferred Concepts:

- Recovery-aware Mission completion.
- Mission-level Recovery Requirement projection or aggregation.
- Engineering Session/Workflow Step attribution bridging.
- Withdrawn Recovery Requirement eligibility.
- Review-outcome and Knowledge-requirement completion gating.
- The `MissionPaused` lifecycle inconsistency.
- Downstream Host/Adapter surfacing.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-16-012`, `NEXUS-RAT-2026-07-16-013`).
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0061-governance-gated-mission-completion.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `MissionExecutionService.completeMission` is the Sprint 61 orchestration boundary for retrieving Mission-attributed `GovernanceDecision`s before completion.
- `Approved` is the only Non-Blocking Governance Decision for Mission Completion; Rejected, Deferred, and Escalation Required block uniformly and unconditionally.
- Recovery Requirement consultation remains excluded because Mission Completion has no authoritative Engineering Session/Workflow Step context for RFC-0004 v1.12's attribution key.

### Known Limitations

- Rejected, Deferred, and Escalation Required Governance Decisions block Mission Completion permanently and unconditionally under this sprint.
- Governance-Gated Mission Completion is not surfaced through Host or Adapter code.
- Mission Completion still uses in-memory repositories in the current production composition.
- The `MissionPaused` lifecycle inconsistency remains unresolved.

### Validation Summary

- Targeted Sprint 61 validation passed: `mission-execution.service.test.ts` (19 tests).
- TypeScript compile passed.
- ESLint passed.
- Vitest passed: 84 files, 528 tests.
- esbuild passed.
- Extension-host bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 60 — Recovery-Gated Re-Advancement

### Implemented Slice

Implemented the Milestone 9 Sprint 60 Recovery-Gated Re-Advancement vertical slice. This sprint additively extends Governance-Gated Advancement so a Rejected `GovernanceDecision` can regain advancement eligibility only when the exact attributed `RecoveryRequirement` is Resolved with a present `acceptedOutcomeReference`.

Implemented scope:

- Added a pure, deterministic `isGovernanceDecisionAdvancementEligible(...)` function covering the Sprint 60 Required Behavioral Matrix.
- Extended `EngineeringSession.advanceWorkflowAfterGovernanceDecision(...)` to consume an optional `RecoveryRequirementSnapshot` without mutating the `GovernanceDecision` or `RecoveryRequirement`.
- Added a read-only `IRecoveryRequirementRepository.findByAttributionKey(...)` lookup to `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision(...)` for Rejected governance decisions.
- Wired `createKernelServices()` so `EngineeringSessionService` receives the shared production `InMemoryRecoveryRequirementRepository`.
- Added unit and service coverage for exact resolved recovery, missing/open/withdrawn/malformed recovery, mismatched attribution, Deferred/Escalation Required blocking, deterministic pure eligibility, production wiring, and unaffected Manual / Automatic/Event-Driven / Review-Gated Advancement.

Out of scope and not implemented:

- Advancement eligibility for Withdrawn Recovery Requirements.
- Event subscribers or consumers for Recovery Requirement or Governance Decision events.
- Governed Mission Completion or any Mission completion precondition change.
- Any differentiated Deferred / Escalation Required treatment beyond uniform Blocking.
- Any Host or Adapter surfacing.

### RFC Coverage

Primary RFC:

- RFC-0004 v1.13 — Execution Model, Recovery-Gated Re-Advancement Eligibility.

Referenced RFCs:

- RFC-0004 v1.11 — Governance-Gated Advancement, consumed and extended without redefining the strategy.
- RFC-0004 v1.12 — Recovery Requirement, consumed read-only and unmodified.
- RFC-0011 v1.1 — Engineering Governance Model, `GovernanceDecision` consumed unmodified.

Implemented Concepts:

- Recovery-Gated Re-Advancement Eligibility.
- Read-only Recovery Requirement lookup by exact attribution key.
- Pure governance-decision advancement eligibility evaluation.
- Production repository injection for the shared `IRecoveryRequirementRepository`.

Deferred Concepts:

- Withdrawn Recovery Requirement eligibility.
- Event-driven recovery re-advancement consumers.
- Governed Mission Completion.
- Host/Adapter recovery surfaces.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-16-010`, `NEXUS-RAT-2026-07-16-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0060-recovery-gated-re-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `EngineeringSessionService` is the orchestration boundary responsible for resolving the optional Recovery Requirement snapshot before invoking the aggregate.
- The Recovery Requirement repository remains the sole source for exact attribution lookup; the pure eligibility function still fails closed if a supplied snapshot does not match the expected attribution.
- A Resolved Recovery Requirement restores eligibility only; the existing `advanceWorkflow(...)` path remains the only operation that advances the workflow position.

### Known Limitations

- Recovery-Gated Re-Advancement remains caller/event-flow driven; no new event consumer initiates advancement.
- Recovery Requirement persistence remains in-memory and process-local.
- Governed Mission Completion remains unauthorized and unimplemented.

### Validation Summary

- Targeted Sprint 60 validation passed: `engineering-session.test.ts`, `engineering-session.service.test.ts`, and `recovery-requirement.test.ts` (96 tests).
- TypeScript compile passed.
- ESLint passed.
- Vitest passed: 84 files, 517 tests.
- esbuild passed.
- Extension-host bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 59 — Recovery Requirement Domain Event Publication

### Implemented Slice

Implemented the Milestone 9 Sprint 59 Recovery Requirement Domain Event Publication vertical slice. This sprint additively publishes RFC-0005 Execution-category Domain Events for the existing Sprint 58 `RecoveryRequirement` aggregate creation, resolution, and withdrawal transitions.

Implemented scope:

- Added `recovery-requirement.events.ts` with `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` factories.
- Added a recorded-events collection and drain-once `pullDomainEvents()` to `RecoveryRequirement`.
- Recorded `RecoveryRequirementCreated` only during authoritative creation; `fromSnapshot` rehydration records no event.
- Added save-then-publish `EventBusContract` injection to `RecoveryRequirementGovernanceDecisionConsumer` and `RecoveryRequirementService`.
- Preserved idempotent duplicate creation and repeated terminal-transition behavior without duplicate publication.
- Updated `createKernelServices()` to inject the shared production `EventBusContract` into both Recovery Requirement publisher surfaces.
- Added the three Recovery Requirement events to `knowledge/reference/kernel-event-catalog.md` under Execution Events.
- Added Sprint 59 event-publication test coverage.

Out of scope and not implemented:

- Event subscriptions or consumers of the new Recovery Requirement events.
- Governed Mission Completion or any Mission completion precondition change.
- Workflow Chain topology, Workflow Step, GovernanceService, GovernanceDecision, or GovernanceEscalation changes.
- Durable or transactional event delivery.
- Any `src/hosts` or `src/adapters` change.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model v1.0 (Domain Event, Event Attribution, Event Causality, Event Correlation, Execution Events, Engineering Progression).

Referenced RFCs:

- RFC-0004 v1.12 — Execution Model (`RecoveryRequirement` aggregate, uniqueness, lifecycle, and boundaries consumed unmodified).
- RFC-0011 v1.1 — Engineering Governance Model (`GovernanceDecision` consumed unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `RecoveryRequirementCreated` Domain Event.
- `RecoveryRequirementResolved` Domain Event.
- `RecoveryRequirementWithdrawn` Domain Event.
- Aggregate recorded-events drain for `RecoveryRequirement`.
- Save-then-publish EventBus wiring for Recovery Requirement creation, resolution, and withdrawal.

Deferred Concepts:

- Event subscribers/consumers for Recovery Requirement Domain Events.
- Governed Mission Completion / Mission completion precondition changes.
- Differentiated Rejected / Deferred / Escalation Required Engineering Session state.
- Host/Adapter surfacing and durable Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-16-009`).
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/implementation/sprints/sprint-0059-recovery-requirement-domain-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Recovery Requirement event Mission attribution is read from the existing `RecoveryRequirement.missionId`.
- `RecoveryRequirementCreated` uses the originating `GovernanceDecisionRecorded` event timestamp, causality, and correlation metadata.
- Resolution and withdrawal event timestamps and metadata come from the corresponding service command's transition metadata.
- Publication failure after successful persistence surfaces to the caller; durable or transactional delivery remains outside this Sprint.

### Known Limitations

- Recovery Requirement persistence and EventBus storage remain in-memory and process-local.
- No downstream consumer reacts to the new events.
- Governed Mission Completion remains unauthorized and unimplemented.

### Validation Summary

- Targeted Sprint 59 validation passed: `recovery-requirement.test.ts` (18 tests).
- TypeScript compile passed.
- ESLint passed.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 84 files, 500 tests.
- Extension-host bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 58 — Governance Recovery and Blocking-State Foundation

### Implemented Slice

Implemented the Milestone 9 Sprint 58 Governance Recovery and Blocking-State Foundation vertical slice. This sprint adds RFC-0004 v1.12 `RecoveryRequirement` as an explicit record that a Rejected RFC-0011 `GovernanceDecision` generated engineering remediation work.

Implemented scope:

- Added `RecoveryRequirement` with immutable identity, immutable Mission / Engineering Session / Workflow Step / `GovernanceDecision` attribution, creation timestamp, causality, correlation, and closed `Open` / `Resolved` / `Withdrawn` lifecycle.
- Added `IRecoveryRequirementRepository` and `InMemoryRecoveryRequirementRepository`, enforcing deterministic idempotent uniqueness for `(Mission, Engineering Session, Workflow Step, GovernanceDecision)`.
- Added `RecoveryRequirementGovernanceDecisionConsumer`, a narrow `GovernanceDecisionRecorded` consumer that creates a Recovery Requirement only for persisted Rejected decisions.
- Added `RecoveryRequirementService` exposing exactly `resolveRecoveryRequirement(...)` and `withdrawRecoveryRequirement(...)`, preserving accepted-outcome / authoritative withdrawal metadata while delegating lifecycle validity to the aggregate.
- Wired the new repository, service, and consumer through `createKernelServices`.
- Added Sprint 58 test coverage for all Required Test Matrix rows.

Out of scope and not implemented:

- Recovery Requirement Domain Event publication.
- AI-generated remediation plans, remediation steps, or remediation content.
- Workflow Chain topology or Workflow Step mutation.
- Differentiated Engineering Session state beyond Sprint 57's uniform Blocking classification.
- Governed Mission Completion or Mission completion precondition changes.
- Host/Adapter surfacing and any `src/hosts` or `src/adapters` change.

### RFC Coverage

Primary RFC:

- RFC-0004 v1.12 — Execution Model, Recovery Requirement section.

Referenced RFCs:

- RFC-0011 v1.1 — Engineering Governance Model (`GovernanceDecision` consumed read-only and unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `RecoveryRequirement` aggregate.
- Recovery Requirement identity, uniqueness, attribution, and lifecycle.
- Rejected-only creation from `GovernanceDecisionRecorded`.
- Recovery Resolution Contract.
- Recovery Withdrawal Contract.
- In-memory repository and Kernel service composition.

Deferred Concepts:

- Recovery Requirement Domain Event publication.
- AI-generated remediation planning.
- Governed Mission Completion / Mission completion precondition changes.
- Differentiated Rejected / Deferred / Escalation Required Engineering Session state.
- Host/Adapter recovery surfaces.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-16-007`, `NEXUS-RAT-2026-07-16-008`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0058-governance-recovery-and-blocking-state-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `GovernanceDecisionRecorded` carries the originating `GovernanceDecision` identity and event envelope metadata; the Recovery consumer resolves the persisted `GovernanceDecision` from the repository and uses only its immutable identity/value/Mission attribution.
- The caller supplies the Engineering Session and Workflow Step context because `GovernanceDecisionRecorded` does not carry those RFC-0004 execution-context identities.
- Resolution sufficiency is external to `RecoveryRequirementService`; callers provide an already accepted outcome or Evidence reference.
- Withdrawal authority is external to `RecoveryRequirementService`; callers provide an authoritative decision or Ratification reference.

### Known Limitations

- Recovery Requirement persistence remains in-memory and process-local.
- No Recovery Requirement Domain Event is published.
- No Host/Adapter surface exposes Recovery Requirement state.
- Governed Mission Completion remains unauthorized for this Sprint.

### Validation Summary

- Targeted Sprint 58 validation passed: `recovery-requirement.test.ts` and `kernel-boundary-certification.integration.test.ts` (22 tests).
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 84 files, 499 tests.
- Extension-host bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 57 — Governance-Gated Workflow Advancement

### Implemented Slice

Implemented the Milestone 9 Sprint 57 Governance-Gated Workflow Advancement vertical slice. This sprint adds RFC-0004 v1.11's Governance-Gated Advancement Strategy to `EngineeringSession` while consuming RFC-0011 `GovernanceDecision` as immutable, read-only input.

Implemented scope:

- Added `EngineeringSession.advanceWorkflowAfterGovernanceDecision`.
- Added `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision`.
- Added `GovernanceGatedWorkflowAdvancementConsumer` for narrowly scoped `GovernanceDecisionRecorded` event handling.
- Wired the new consumer through `createKernelServices`.
- Added tests for Approved advancement, all three uniform Blocking Governance Decision values, missing Governance Decision, Review-Gated ineligibility, duplicate event/idempotency behavior, and preservation of existing non-governance advancement behavior.

Out of scope and not implemented:

- Recovery Requirement records, recovery-plan generation, differentiated Rejected/Deferred/Escalation-Required Engineering Session state, Governed Mission Completion, Host/Adapter surfacing, and general-purpose event routing.
- Any change to `GovernanceService`, `GovernanceDecision`, `EventBusContract`, `DomainEvent`, `WorkflowChain`, `WorkflowStep`, `ExecutionStrategy`, `AssignmentPolicy`, `src/hosts`, or `src/adapters`.

### RFC Coverage

Primary RFC:

- RFC-0004 v1.11 — Execution Model, Workflow Advancement § Governance-Gated Advancement.

Referenced RFCs:

- RFC-0011 v1.1 — Engineering Governance Model (`GovernanceDecision` consumed read-only and unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Governance-Gated Advancement operation on `EngineeringSession`.
- Non-Blocking Governance Decision classification: `Approved`.
- Uniform Blocking Governance Decision classification: `Rejected`, `Deferred`, `Escalation Required`.
- Idempotent duplicate handling for the same governed WorkflowStep.
- Narrow `GovernanceDecisionRecorded` consumer delegation.

Deferred Concepts:

- Recovery Requirement records; recovery-plan generation.
- Differentiated Engineering Session state for Rejected, Deferred, or Escalation Required Governance Decisions.
- Governed Mission Completion or Mission completion precondition changes.
- General-purpose event subscription/routing and Host/Adapter surfaces.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-16-005`, `NEXUS-RAT-2026-07-16-006`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0057-governance-gated-workflow-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Existing Review-Gated eligibility is represented by the persisted Review outcome associated with the persisted `GovernanceDecision.reviewId`.
- Because `GovernanceService` exposes evaluation but no read operation, and Sprint 57 forbids modifying `GovernanceService`, the service operation retrieves the already-produced `GovernanceDecision` through the existing `IGovernanceDecisionRepository` contract.
- TASK-001 Option B resolution: direct repository resolution is accepted for Governance-Gated Advancement because its authoritative trigger is a persisted `GovernanceDecision`, not a caller-supplied Review-only gate. This intentionally diverges from Sprint 46's caller-supplied `reviewOutcome` precedent only for this strategy: the Review outcome is resolved from the persisted Governance Decision's `reviewId` so the Governance Decision and Review eligibility inputs remain coupled to the same recorded governing evaluation.
- `GovernanceDecisionRecorded` does not carry an Engineering Session identity; the narrow consumer therefore requires the caller to supply the target Engineering Session and governed WorkflowStep context, and performs no eligibility or mutation logic itself.

### Known Limitations

- Governance-Gated Advancement gates workflow advancement only.
- The consumer is narrowly scoped and does not introduce a general event subscription/routing framework.
- Host/Adapter surfacing remains deferred.

### Validation Summary

- Targeted Sprint 57 validation passed: `npm run test -- test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.service.test.ts` (61 tests).
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 83 files, 482 tests.
- Extension-host bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 56 — Governance Decision Domain Event Publication

### Implemented Slice

Implemented the Milestone 9 Sprint 56 Governance Decision Domain Event Publication vertical slice and its second recovery remediation under `NEXUS-RAT-2026-07-16-004`. This sprint additively publishes exactly one `GovernanceDecisionRecorded` Domain Event for each newly persisted `GovernanceDecision`, now using RFC-0011 v1.1 Mission-scoped governance evaluation.

Implemented scope:

- Added `GovernanceDecisionRecorded` as the single RFC-0005 Policy-category event for all four existing `GovernanceDecision` values.
- Added required `missionId` to the governance-evaluation request contract and every `GovernanceDecision`, populated from the evaluation request.
- Validated resolved Review Mission identity against the requested evaluation Mission identity; Mission mismatch produces `Escalation Required`.
- Restored missing/unresolvable Review behavior as Mission-scoped fail-closed decisions: `Escalation Required` retains the requested `missionId` and throws no Mission-availability error.
- Wired `EventBusContract` into `GovernanceService` and `createKernelServices()`.
- Published events only after `GovernanceDecision` repository registration succeeds.
- Published `GovernanceDecisionRecorded` with structurally required `missionId` and `attribution.missionId` from the persisted `GovernanceDecision`, with no unsafe `GovernanceDomainEvent` cast.
- Preserved idempotent re-evaluation by returning existing decisions without duplicate publication.
- Preserved Sprint 53/55 evaluation precedence, attribution-driven escalation, and existing Policy Criterion predicates.
- Added tests covering approved, rejected, deferred, criterion-driven escalation, attribution-driven escalation, resolved Review Mission match, resolved Review Mission mismatch, missing/unresolvable Review with explicit Mission identity, idempotent no-duplicate publication, persisted-decision mission identity, persist-before-publish ordering, and existing behavior preservation.
- TASK-001 remediation removed the unratified `EvaluateGovernancePolicyCommand.missionId` fallback and `GovernanceDecisionMissionUnavailableError`, restoring Sprint 53's missing/unresolvable Review → `Escalation Required` guarantee.
- TASK-002 remediation superseded the first remediation's optional event-envelope Mission rule with RFC-0011 v1.1 Mission-scoped evaluation, satisfying RFC-0005 Event Attribution structurally.

Out of scope and not implemented:

- Downstream event consumers, workflow gates, repository-write automation, Host/Adapter surfaces, Evidence/Shared-Reality-consuming Policy Criteria, multi-Policy or multi-Ratification conflict arbitration, and durable persistence.
- Any change to `EventBusContract`, `DomainEvent`, RFC-0005, RFC-0011 text, Kernel Canon, `src/hosts`, or `src/adapters`.

### RFC Coverage

Primary RFCs:

- RFC-0005 — Domain Event Model v1.0 (Domain Event, Event Identity, Event Attribution, Event Causality, Event Correlation, Policy Events).
- RFC-0011 — Engineering Governance Model v1.1 (Dependencies § Domain Event publication requirement; Mission-Scoped Governance Evaluation §).

Referenced authorities:

- `NEXUS-RAT-2026-07-16-002` — Sprint 56 Scope Ratification.
- `NEXUS-RAT-2026-07-16-003` — Sprint 56 first remediation ratification; its Mission Identity Rule was withdrawn by `NEXUS-RAT-2026-07-16-004`.
- `NEXUS-RAT-2026-07-16-004` — RFC-0011 v1.1 Mission-Scoped Governance Evaluation amendment and second remediation authorization.
- Sprint 53 — approved `GovernanceDecision`/`GovernanceEscalation`/`GovernanceService` foundation.
- Sprint 55 — approved attribution-driven `Escalation Required` path.

Implemented Concepts:

- `GovernanceDecisionRecorded` Domain Event.
- Required governance-evaluation `missionId` and required `GovernanceDecision.missionId`.
- Mission mismatch validation producing `Escalation Required`.
- `GovernanceService` EventBus publication after persistence.
- Idempotent no-duplicate publication for existing evaluation keys.
- Missing/unresolvable Review fail-closed behavior retaining the explicit evaluation Mission identity.

Deferred Concepts:

- Downstream consumption of `GovernanceDecisionRecorded`; workflow gates; repository-write automation; Host/Adapter surfaces; Evidence/Shared-Reality-consuming Policy Criteria; multi-Policy or multi-Ratification conflict arbitration; durable persistence.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014`, `NEXUS-RAT-2026-07-16-002`, `NEXUS-RAT-2026-07-16-003`, `NEXUS-RAT-2026-07-16-004`).
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0056-governance-decision-domain-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `GovernanceDecisionRecorded` carries the persisted decision identity, value, policy reference, review reference, policy-evaluation identity, evaluation key, explanation codes, and escalation identity when present.
- Governance evaluation is Mission-scoped: the request supplies explicit Mission identity, every `GovernanceDecision` retains it, and publication reads Mission identity only from the persisted `GovernanceDecision`.
- Missing/unresolvable Review decisions and Review Mission mismatch decisions produce `Escalation Required` with the explicit evaluation Mission identity; no synthetic or inferred Mission identity is used.
- Publication failure after repository registration surfaces to the caller but does not roll back the in-memory persisted decision.

### Known Limitations

- No downstream consumer exists for `GovernanceDecisionRecorded`.
- Governance persistence remains in-memory and process-local.

### Validation Summary

- Targeted Sprint 56 TASK-002 validation passed: `governance.service.test.ts` (49 tests).
- TypeScript compile passed.
- ESLint passed.
- Full Vitest suite passed: 83 files, 468 tests.
- esbuild passed.
- Extension-host bundle build passed.

### Deviations

Architectural deviation identified by `NEXUS-REV-2026-07-16-003-F-001`: the original Sprint 56 implementation introduced an unratified `EvaluateGovernancePolicyCommand.missionId` fallback and `GovernanceDecisionMissionUnavailableError`, breaking Sprint 53's frozen missing/unresolvable Review → `Escalation Required` guarantee.

Resolved by TASK-001 under `NEXUS-RAT-2026-07-16-003`: the command fallback and error behavior were removed; missing/unresolvable Review again produces `Escalation Required`; `missionId` is optional only on the `GovernanceDecisionRecorded` event-envelope path and is omitted rather than synthesized when Review cannot resolve.

Second-cycle specification conflict identified by `NEXUS-REV-2026-07-16-004-F-001`: `NEXUS-RAT-2026-07-16-003`'s optional event-envelope Mission rule conflicted with RFC-0005's unconditional Event Attribution requirement.

Resolved by TASK-002 under `NEXUS-RAT-2026-07-16-004`: RFC-0011 v1.1 makes governance evaluation Mission-scoped, `missionId` is required on the evaluation request and `GovernanceDecision`, Review Mission mismatch fails closed to `Escalation Required`, missing/unresolvable Review retains the requested Mission identity, and `GovernanceDecisionRecorded` is structurally RFC-0005-conformant with no unsafe Domain Event cast. No remaining architectural deviations.

---

## Sprint 55 — Ratification and Repository-Law Integration

### Implemented Slice

Implemented the Milestone 9 Sprint 55 Ratification and Repository-Law Integration vertical slice. This sprint integrates Sprint 54's `RatificationAttributionValidationService` into Sprint 53's `GovernanceService` as an additive precondition before Policy Criteria evaluation.

Implemented scope:

- `GovernanceService` now validates the `RepositoryPolicy` version's Ratification attribution before creating a `PolicyEvaluation`/`GovernanceDecision`.
- `Valid` attribution proceeds through the existing Sprint 53 Policy Criterion evaluation and decision-precedence logic unchanged.
- `Invalid` and `Unresolvable` attribution short-circuit to exactly one `Escalation Required` `GovernanceDecision` without evaluating Policy Criteria.
- `GovernanceEscalation` now preserves attribution-driven fields for attribution escalations: `RepositoryPolicy` identity/version, referenced Ratification identity, attribution-validation outcome, deterministic attribution diagnostics, and Ratification Authority Snapshot fingerprint.
- Deterministic evaluation keys now include the Ratification Authority Snapshot fingerprint, preserving idempotency for identical complete inputs and allowing changed Snapshots to be independently evaluated.
- `createKernelServices()` now supplies `GovernanceService` with the shared `RatificationAttributionValidationService`.
- Added Sprint 55 governance tests covering all required matrix rows.

Out of scope and not implemented:

- Contradiction detection across multiple distinct Ratifications or Policies beyond Sprint 54's existing single-record scope.
- General repository-law interpretation or precedence.
- Automatic `RATIFICATION_LEDGER.md` ingestion.
- RFC-0005 Domain Event publication.
- Host-facing or Adapter-facing governance surfaces.
- Durable persistence.
- Any change to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates.
- Any `src/hosts` or `src/adapters` change.

### RFC Coverage

Primary RFC:

- RFC-0011 — Engineering Governance Model v1.0 (Authority Hierarchy §, Failure and Conflict Handling §).

Referenced authorities:

- `NEXUS-RAT-2026-07-16-001` — Sprint 55 Scope Ratification.
- Sprint 53 — approved `GovernanceDecision`/`PolicyEvaluation`/`GovernanceEscalation`/`GovernanceService` foundation.
- Sprint 54 — approved `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot` foundation.

Implemented Concepts:

- Ratification attribution validation as a `GovernanceService` precondition.
- Two-branch validation ordering: `Valid` continues; `Invalid`/`Unresolvable` escalates without criteria evaluation.
- Attribution-driven `GovernanceEscalation` fields.
- Ratification Authority Snapshot fingerprint inclusion in the deterministic evaluation key.
- Kernel service composition wiring for the new dependency.

Deferred Concepts:

- Cross-Ratification/cross-Policy contradiction detection; repository-law interpretation or precedence; automatic Ratification Ledger ingestion; Policy Events; Host/Adapter governance surfaces; durable persistence; downstream Governance Decision consumers.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014`, `NEXUS-RAT-2026-07-16-001`).
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0055-ratification-and-repository-law-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The structured `RatificationAuthoritySnapshot` supplied to Sprint 54 remains the authority input; Sprint 55 does not parse or interpret `RATIFICATION_LEDGER.md` prose.
- Snapshot fingerprinting is deterministic serialization of the structured Snapshot source consulted by `RatificationAttributionValidationService`.
- Missing `RepositoryPolicy` identity/version remains governed by Sprint 53's existing fail-closed escalation behavior because there is no policy version whose attribution can be validated.

### Known Limitations

- Snapshot persistence remains in-memory and process-local.
- Attribution validation confirms structured Ratification authority only; it does not determine whether Ratification prose semantically authorizes Policy content.
- Downstream consumption of a Sprint 55 `GovernanceDecision`/`GovernanceEscalation` beyond recording remains deferred.

### Validation Summary

- Targeted Sprint 55 validation passed: `governance.service.test.ts` and `ratification-attribution-validation.test.ts` (59 tests).
- TypeScript compile passed.
- ESLint passed.
- Full Vitest suite passed: 83 files, 464 tests.
- esbuild passed.
- Extension-host bundle build passed.

### Deviations

No architectural deviations.

---

## Sprint 54 — Ratification Attribution Validation Foundation

### Implemented Slice

Implemented the Milestone 9 Sprint 54 Ratification Attribution Validation Foundation vertical slice. This sprint validates exactly one immutable `RepositoryPolicy` version's Ratification reference against one immutable collection of structured Ratification Authority Records, producing exactly one of three closed outcomes: `Valid`, `Invalid`, or `Unresolvable`.

Implemented scope:

- Added `RatificationAuthoritySnapshot` as an immutable collection of `RatificationAuthorityRecord` entries.
- Added `RatificationAuthorityRecord` with identifier, date, subject, explicit lifecycle status, and optional explicit supersession/withdrawal relationship fields.
- Added the closed lifecycle status set: `Effective`, `Superseded`, `Withdrawn`.
- Added `RatificationAttributionValidationService` as a standalone validation capability.
- Added closed validation outcomes: `Valid`, `Invalid`, `Unresolvable`.
- Added deterministic diagnostics for every Required Outcome Mapping sub-condition.
- Added `IRatificationAuthoritySnapshotRepository` and in-memory implementation for the Snapshot source.
- Updated `createKernelServices()` and Kernel boundary certification to compose `RatificationAttributionValidationService`.
- Added 14 Sprint 54 tests covering every Required Outcome Mapping condition, immutability, repository behavior, non-integration boundaries, and Kernel composition.

Out of scope and not implemented:

- Ratification prose or intent interpretation.
- Semantic applicability of a Ratification to `RepositoryPolicy` content.
- Contradiction detection across multiple distinct Ratifications or Policies beyond a single record's internal contradiction.
- General repository-law interpretation or precedence resolution.
- Integration with `PolicyEvaluation`, `GovernanceDecision`, `GovernanceService`, workflow gates, Domain Events, Host surfaces, Adapter surfaces, durable persistence, or live `RATIFICATION_LEDGER.md` ingestion.

### RFC Coverage

Primary RFC:

- RFC-0011 — Engineering Governance Model v1.0 (Repository Policy § "attributable").

Referenced authorities:

- RFC-0011 — Authority Hierarchy §, referenced only for the tier-4 `RATIFICATION_LEDGER.md` relationship.
- `IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications.

Implemented Concepts:

- `RatificationAuthoritySnapshot`.
- `RatificationAuthorityRecord`.
- `RatificationAttributionValidationService`.
- `IRatificationAuthoritySnapshotRepository` and in-memory Snapshot source.
- Closed outcome and diagnostic model for `Valid`, `Invalid`, and `Unresolvable`.

Deferred Concepts:

- Ratification prose/intent interpretation; semantic applicability; cross-Ratification/cross-Policy contradiction detection; repository-law precedence; integration with Sprint 53 governance evaluation/decision services; Domain Events; Host/Adapter governance surfaces; durable persistence; automatic Ratification-Ledger ingestion.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014`, `NEXUS-RAT-2026-07-15-017`).
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/implementation/sprints/sprint-0054-ratification-attribution-validation-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Snapshot source contract supplies structured authority records; automatic parsing of `RATIFICATION_LEDGER.md` remains deferred.
- A missing or unavailable Snapshot source is represented by the repository returning no Snapshot and yields `Unresolvable`.
- A malformed matching authority record is preserved as source data so validation can fail closed with an `Invalid` diagnostic rather than throwing away the record.

### Known Limitations

- Snapshot persistence is in-memory and process-local.
- Validation confirms attribution structure and lifecycle status only; it does not decide whether Ratification prose authorizes Policy content.
- The validation output is standalone and is not consumed by `GovernanceService`, `PolicyEvaluation`, `GovernanceDecision`, workflow gates, Hosts, or Adapters.

### Validation Summary

- Targeted Sprint 54 validation passed: `npm run test -- ratification-attribution-validation kernel-boundary-certification` (19 tests).
- Repository validation passed: TypeScript compile, ESLint, Vitest, esbuild, and extension-host bundle build.
- Vitest passed: 83 files, 456 tests.

### Deviations

No architectural deviations.

## Sprint 53 — Policy Evaluation and Governance Decision Foundation

### Implemented Slice

Implemented the Milestone 9 Sprint 53 Policy Evaluation and Governance Decision Foundation vertical slice. This sprint evaluates exactly one immutable `RepositoryPolicy` version against exactly one `Review`, producing exactly one immutable and attributable `GovernanceDecision`.

Implemented scope:

- Added `PolicyEvaluation`, `PolicyEvaluationId`, `PolicyCriterionResult`, and canonical result statuses (`Satisfied`, `Violated`, `Undetermined`, `Unsupported`).
- Added `GovernanceDecision`, `GovernanceDecisionId`, and canonical decision values (`Approved`, `Rejected`, `Deferred`, `Escalation Required`).
- Added `GovernanceEscalation` for Escalation Required decisions only.
- Added closed predicate interpretation for `ReviewOutcomeMembership` and `UnresolvedFindingMatch`.
- Implemented explicit `UnresolvedFindingMatch.expectedMatch: Present | Absent` polarity.
- Implemented strict decision precedence: Escalation Required > Deferred > Rejected > Approved.
- Implemented Final Refinement 1: existing non-final/incomplete Review produces Deferred; missing/unresolvable Review produces Escalation Required.
- Implemented failure-closed handling for unknown Policy identity/version, unsupported predicate kinds, unsupported schema versions, malformed descriptors, contradictory descriptor data, and invalid `expectedMatch`.
- Added deterministic Review-state fingerprinting without modifying RFC-0006 Review.
- Added deterministic evaluation keys, idempotent repeated evaluation, semantic duplicate equivalence, and contradictory duplicate rejection.
- Added `IGovernanceDecisionRepository` and in-memory append-only implementation.
- Added thin `GovernanceService` orchestration.
- Updated `createKernelServices()` and Kernel boundary certification to compose `GovernanceService`.
- Added 36 Sprint 53 tests.

Out of scope and not implemented:

- Evidence-, Shared Reality-, or Knowledge-consuming Policy Criteria.
- Multi-Policy evaluation, precedence, and conflict arbitration.
- Ratification-Ledger content validation, authority validation, or repository-law interpretation.
- RFC-0005 Policy Events or Domain Event publication.
- Downstream enforcement, workflow gates, automatic remediation, Host/Adapter surfaces, durable persistence, AI deliberation, unrestricted model judgment, or repository-write automation.

### RFC Coverage

Primary RFC:

- RFC-0011 — Engineering Governance Model v1.0 (Policy Evaluation, Governance Decision, Governance Escalation, Failure and Conflict Handling).

Referenced RFCs:

- RFC-0006 — Engineering Assessment Model. Finalized Review Outcome and Finding consumption only; unmodified.
- RFC-0005 — Domain Event Model. Policy Events remain deferred.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Policy Evaluation.
- Policy Criterion Result.
- Governance Decision.
- Governance Escalation.
- Closed predicate model for `ReviewOutcomeMembership` and `UnresolvedFindingMatch`.
- Deterministic evaluation key, Review-state fingerprint attribution, and append-only Governance Decision repository.
- Thin Governance Service orchestration and Kernel composition.

Deferred Concepts:

- Evidence/Shared Reality/Knowledge-consuming Criteria; multi-Policy arbitration; Ratification-Ledger and repository-law validation; RFC-0005 Policy Events; policy enforcement/workflow gates; Host/Adapter governance surfaces; durable persistence; policy generation/optimization; autonomous authority.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014`, `NEXUS-RAT-2026-07-15-015`, `NEXUS-RAT-2026-07-15-016`).
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0053-policy-evaluation-and-governance-decision-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `PolicyCriterion.conditionDescriptor` remains an immutable opaque string owned by Sprint 52; Sprint 53 interprets only exact JSON descriptors matching the two authorized closed predicate schemas.
- Review-state attribution uses a deterministic canonical fingerprint derived from the existing immutable Review snapshot because RFC-0006 exposes no explicit Review revision concept.
- The deterministic evaluation key excludes wall-clock lookup and is derived from the requested Policy identity/version, Review identity, Review-state reference, and evaluator contract version.
- Repeated service evaluation returns the already recorded Governance Decision for an existing evaluation key rather than creating a second record with different attribution metadata.

### Known Limitations

- Governance Decision persistence is in-memory and process-local.
- Only `ReviewOutcomeMembership` and `UnresolvedFindingMatch` are supported predicate kinds.
- Governance Decisions are recorded facts only; they do not enforce policy, advance workflows, write governance files, create Ratifications, invoke Adapters, or publish Domain Events.
- Ratification attribution and repository-law validation remain deferred.

### Validation Summary

- TASK-001 remediation corrected `InMemoryGovernanceDecisionRepository` duplicate-registration equivalence to ignore non-semantic top-level `GovernanceDecision.id`, `policyEvaluationId`, `evaluatedAt`, and `GovernanceEscalation.id` fields while preserving contradiction rejection for semantic differences.
- Targeted Sprint 53 validation passed: `npm run compile` and `npx vitest run test\kernel\governance\governance.service.test.ts` (37 tests).
- Repository validation passed: TypeScript compile, ESLint, Vitest, esbuild, and extension-host bundle build.
- Vitest passed: 82 files, 442 tests.

### Deviations

No architectural deviations.

## Sprint 52 — Governance Policy Model Foundation

### Implemented Slice

Implemented the Milestone 9 Sprint 52 Governance Policy Model Foundation vertical slice. This sprint adds the RFC-0011 Repository Policy definition and version-history foundation only; it does not implement Policy Evaluation, Governance Decision production, Governance Escalation, Domain Events, workflow enforcement, Host surfaces, Adapter changes, or durable persistence.

Implemented scope:

- Added `RepositoryPolicy` as an immutable, ratification-attributed, versioned Kernel governance domain concept.
- Added `RepositoryPolicyId` and `PolicyCriterion`.
- Added policy version and predecessor-version lineage validation: initial version `1`, sequential supersession, stable identity preservation, duplicate/skipped/regressed version rejection, unknown-predecessor rejection, and competing-successor rejection.
- Added ordered, immutable criteria with unique criterion identifiers, non-empty descriptions, required-input declarations, and opaque condition descriptors.
- Added structural Ratification identifier validation only (`NEXUS-RAT-YYYY-MM-DD-###`).
- Added `IRepositoryPolicyRepository` and `InMemoryRepositoryPolicyRepository` for initial registration, supersession registration, retrieval by identity/version, current-version lookup, current policy enumeration, and complete history enumeration.
- Added `RepositoryPolicyService` for thin orchestration over registration, supersession, retrieval, current lookup, enumeration, and history lookup.
- Updated `createKernelServices()` only to construct and register the Repository Policy repository/service.
- Updated Kernel boundary certification to include the newly authorized composed `RepositoryPolicyService`.
- Added governance domain, repository, service, and composition tests.

Out of scope and not implemented:

- Policy Criterion predicate evaluation.
- Policy Evaluation.
- Governance Decision (`Approved`, `Rejected`, `Deferred`, `Escalation Required`).
- Governance Escalation.
- Evidence, Shared Reality, Review Outcome, or Finding consumption.
- Ratification Ledger content validation, policy authority resolution, policy conflict resolution, or policy precedence evaluation.
- RFC-0005 Policy Events or Domain Event publication.
- Policy activation, enforcement, workflow gates, repository-write automation, Host-facing policy surfaces, durable persistence, `src/hosts`, or `src/adapters`.

### RFC Coverage

Primary RFC:

- RFC-0011 — Engineering Governance Model v1.0 (Repository Policy, Policy Criterion, immutability, versioning/supersession, attribution).

Referenced RFCs:

- RFC-0005 — Domain Event Model. No Domain Events are authorized or implemented in this sprint.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Repository Policy definition and stable identity.
- Repository Policy immutable per-version state.
- Repository Policy versioning and supersession.
- Repository Policy Ratification attribution reference.
- Policy Criterion declarative definition data.
- Repository Policy repository contract, in-memory implementation, thin service orchestration, and Kernel composition.

Deferred Concepts:

- Policy Criterion predicate evaluation; Policy Evaluation; Governance Decision; Governance Escalation.
- Evidence, Shared Reality, Review Outcome/Finding consumption.
- Ratification Ledger content validation; authority, conflict, and precedence resolution.
- RFC-0005 Policy Events and Domain Event publication.
- Policy activation/enforcement, workflow gates, repository-write automation, Host-facing policy surfaces, durable persistence, and any `src/hosts` or `src/adapters` changes.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-013`, `NEXUS-RAT-2026-07-15-014`, `NEXUS-RAT-2026-07-15-015`).
- `knowledge/specifications/rfc-0011-engineering-governance-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0052-governance-policy-model-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `PolicyCriterion.conditionDescriptor` is stored as an opaque, inert string to preserve the Sprint 52 prohibition on predicates, expression trees, executable callbacks, parsing, provider-specific formats, or evaluation semantics.
- `PolicyCriterion.requiredInputs` are declarative string references only; the Kernel does not resolve, fetch, validate, or evaluate the referenced inputs in this sprint.
- Ratification attribution is syntactic only; a structurally valid Ratification identifier may reference a non-existent or non-authorizing Ratification until a future Ratification and Repository-Law Integration slice is authorized.

### Known Limitations

- Repository Policy persistence is in-memory and process-local.
- Policy history is linear per `RepositoryPolicyId`; no cross-policy authority, precedence, conflict, activation, enforcement, or applicability model exists yet.
- RepositoryPolicyService does not access Evidence, Shared Reality, Review, Ratification Ledger contents, Event Bus, Hosts, or Adapters.
- Policy Criteria are never evaluated or interpreted.

### Validation Summary

- Targeted Sprint 52 compile and governance tests passed: 3 governance test files, 13 tests.
- Boundary/governance targeted validation passed: 4 files, 18 tests.
- Repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 81 files, 405 tests.
- Extension-host bundle build passed.

### Deviations

No architectural deviations.

## Sprint 51 — Multi-Agent Engineering Orchestration Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 51 Multi-Agent Engineering Orchestration Foundation vertical slice. This sprint adds structural, observational Kernel records for Mission Engineering Grouping and Engineering Session Handoff while preserving existing `EngineeringSession`, Checkpoint/Recovery, Concurrent Session Coordination, Workflow Chain, Workflow Advancement, Workflow Chain Execution, Assignment Policy, Execution Strategy, Execution Session, Host, and Adapter behavior unchanged.

Implemented scope:

- Added `MissionEngineeringGroup` for deterministic association between one Mission and participating Engineering Sessions.
- Added `EngineeringSessionHandoff` as an immutable record that responsibility passed from one Engineering Session/Execution Role to another.
- Added deterministic Handoff lifecycle state `Recorded`.
- Added repository contracts and in-memory repositories for Mission Engineering Groups and Engineering Session Handoffs.
- Added `MissionEngineeringOrchestrationService` operations to associate Engineering Sessions with a Mission, enumerate a Mission Engineering Group, record Handoffs, and enumerate Handoffs.
- Added deterministic rejection diagnostics for unknown Engineering Session references, unauthorized Handoffs between non-participating Engineering Sessions, and duplicate Handoffs.
- Updated `createKernelServices()` only to construct and register the new repositories/service.
- Added unit and integration coverage for deterministic enumeration, Handoff recording, lifecycle state, invalid/unauthorized diagnostics, cross-session isolation, and Kernel composition.

Out of scope and not implemented:

- Autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging.
- Scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives.
- Dynamic Assignment Policy or automatic Adapter Selection.
- Any modification to `EngineeringSession`, `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, `recoverFromCheckpoint()`, `enumerateActiveEngineeringSessions()`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.10 (`Multi-Agent Engineering Orchestration Foundation`).

Referenced RFCs:

- RFC-0004 — Execution Model v1.2/v1.3 (`Engineering Session`; existing runtime state, workflow position, timeline, diagnostics, and repository behavior reused without modification).
- RFC-0004 — Execution Model v1.8 (`Session Recovery/Checkpointing`; existing Checkpoint/Recovery behavior unmodified).
- RFC-0004 — Execution Model v1.9 (`Concurrent Session Coordination`; existing active-session enumeration and isolation guarantee unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Mission Engineering Group association and enumeration.
- Engineering Session Handoff record, repository, lifecycle state, and enumeration.
- Orchestration visibility over structural records only.
- Deterministic diagnostics for invalid or unauthorized Handoff attempts.
- Automated proof that Mission Engineering Group and Handoff operations do not mutate participating Engineering Session runtime state.

Deferred Concepts:

- Autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging.
- Scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives.
- Dynamic Assignment Policy and automatic Adapter Selection.
- Any change to existing Engineering Session runtime state, snapshot/reconstitution semantics, workflow state, timeline, diagnostics, Checkpoint/Recovery, active-session enumeration, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation, Host, or Adapter behavior.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-011`, `NEXUS-RAT-2026-07-15-012`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0051-multi-agent-engineering-orchestration-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Mission Engineering Group operations validate Engineering Session references through the existing `IEngineeringSessionRepository` contract; Mission identity is retained as a `MissionId` reference without reading Mission aggregate internals.
- A duplicate Handoff is defined as the same Mission, source Engineering Session, and target Engineering Session transfer, independent of Handoff identity.
- Handoff lifecycle is intentionally single-state (`Recorded`) for this foundation slice because RFC-0004 v1.10 defines a structural fact, not a proposal/acceptance workflow.

### Known Limitations

- Mission Engineering Group and Engineering Session Handoff persistence is in-memory with the existing repository pattern.
- Orchestration visibility is a point-in-time query over repository state, not a subscription, scheduler, lock, execution trigger, or live coordination feed.
- Handoff records do not execute Workflow Steps, advance workflows, evaluate Assignment Policies, dispatch Adapters, or mutate Engineering Sessions.

### Validation Summary

- Targeted Sprint 51 validation passed: `npm run compile` and `npx vitest run test/kernel/execution/mission-engineering-orchestration.repository.test.ts test/kernel/execution/mission-engineering-orchestration.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts` (13 tests).
- ESLint passed with `npm run lint`.
- Repository validation passed with `$env:VITEST_MAX_WORKERS='1'; npm run validate`: TypeScript compile, ESLint, Vitest (78 files / 392 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 50 — Concurrent Session Coordination

### Implemented Slice

Implemented the Milestone 8 Sprint 50 Concurrent Session Coordination vertical slice. This sprint adds one provider-neutral active Engineering Session discovery operation while preserving the existing `EngineeringSession`, repository, Checkpoint/Recovery, Workflow Advancement, Workflow Chain Execution, Assignment Policy, Host, and Adapter behavior unchanged.

Implemented scope:

- Added `EngineeringSessionService.enumerateActiveEngineeringSessions()`.
- Added the operation to `EngineeringSessionServiceContract`.
- Reused the existing `IEngineeringSessionRepository.enumerate()` ordering and isolation behavior.
- Added coverage for deterministic active-session visibility, Open/Closed lifecycle eligibility, concurrent Engineering Session coexistence, and cross-session isolation across lifecycle, advancement, Checkpoint/Recovery, and WorkflowStep execution.
- Updated Kernel boundary certification to assert the composed `EngineeringSessionService` exposes the new discovery operation.

Out of scope and not implemented:

- Multi-Agent Engineering Orchestration.
- Single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, cross-session synchronization, scheduling, or orchestration.
- Any modification to `EngineeringSession`, `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, `recoverFromCheckpoint()`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.9 (`Concurrent Session Coordination`).

Referenced RFCs:

- RFC-0004 — Execution Model v1.2/v1.3 (`Engineering Session`; existing runtime state and repository behavior reused).
- RFC-0004 — Execution Model v1.8 (`Session Recovery/Checkpointing`; existing Checkpoint/Recovery behavior reused and unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Concurrent visibility of active Engineering Sessions through `EngineeringSessionService.enumerateActiveEngineeringSessions()`.
- Deterministic active-session discovery from repository state.
- Automated proof that operations on one Engineering Session do not observe or mutate another Engineering Session's runtime state.

Deferred Concepts:

- Multi-Agent Engineering Orchestration.
- Single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, cross-session synchronization, automatic/background scheduling, or orchestration.
- Any change to existing Engineering Session runtime state, snapshot/reconstitution semantics, workflow state, timeline, diagnostics, Checkpoint/Recovery, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation, Host, or Adapter behavior.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-009`, `NEXUS-RAT-2026-07-15-010`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0050-concurrent-session-coordination.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `EngineeringSessionStatus` value `Open` represents an active Engineering Session eligible for active-session discovery; `Closed` is terminal and omitted from active discovery.
- Active-session discovery is a point-in-time query over repository state, not a subscription, scheduler, lock, or orchestration mechanism.

### Known Limitations

- Active-session discovery is in-memory with the existing repository implementation.
- No single-session concurrency control, locking, optimistic concurrency, distributed coordination, cross-session synchronization, automatic scheduling, or Multi-Agent Engineering Orchestration is introduced.

### Validation Summary

- Targeted Sprint 50 validation passed: `npm test -- --run test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts` (34 tests).
- Repository validation passed with `$env:VITEST_MAX_WORKERS='1'; npm run validate`: TypeScript compile, ESLint, Vitest (76 files / 383 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 49 — Session Recovery/Checkpointing Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 49 Session Recovery/Checkpointing Foundation vertical slice. This sprint adds explicit Checkpoint capture and Recovery for `EngineeringSession` runtime state while preserving the existing Sprint 39 `EngineeringSession.toSnapshot()` / `EngineeringSession.fromSnapshot()` contract unchanged.

Implemented scope:

- Added `EngineeringSessionCheckpointId`.
- Added `EngineeringSessionCheckpoint`, an immutable value object wrapping an existing `EngineeringSessionSnapshot`, Checkpoint identity, and capture timestamp.
- Added `IEngineeringSessionCheckpointRepository` and `InMemoryEngineeringSessionCheckpointRepository`.
- Added `EngineeringSessionService.createCheckpoint()` to capture the current `EngineeringSession.toSnapshot()` output and persist a named Checkpoint.
- Added `EngineeringSessionService.recoverFromCheckpoint()` to retrieve a stored Checkpoint and reconstitute a semantically equivalent `EngineeringSession` via the existing `EngineeringSession.fromSnapshot()`.
- Updated `createKernelServices()` only to construct and provide the Checkpoint repository to `EngineeringSessionService`.
- Added coverage for deterministic Checkpoint capture, semantic recovery round-trip, Recovery not-found handling, repository behavior, and Kernel composition continuity.

Out of scope and not implemented:

- Concurrent Session Coordination.
- Multi-Agent Engineering Orchestration.
- Automatic or background checkpointing.
- Checkpoint retention, pruning, or expiry policy.
- Cross-session Checkpoint sharing.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.8 (`Session Recovery/Checkpointing`).

Referenced RFCs:

- RFC-0004 — Execution Model v1.2/v1.3 (`Engineering Session`; existing snapshot/reconstitution contract reused).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringSessionCheckpoint`.
- `EngineeringSessionCheckpointId`.
- Checkpoint capture through `EngineeringSessionService.createCheckpoint()`.
- Checkpoint persistence through `IEngineeringSessionCheckpointRepository`.
- Recovery through `EngineeringSessionService.recoverFromCheckpoint()` using existing `EngineeringSession.fromSnapshot()`.

Deferred Concepts:

- Concurrent Session Coordination.
- Multi-Agent Engineering Orchestration.
- Automatic/background checkpointing.
- Checkpoint retention, pruning, expiry, or cross-session sharing.
- Any modification to `EngineeringSession` snapshot/reconstitution semantics, workflow state, timeline, diagnostics, or existing advancement/execution operations.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-007`, `NEXUS-RAT-2026-07-15-008`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0049-session-recovery-checkpointing-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Recovery returns a semantically equivalent reconstituted `EngineeringSession` snapshot from the stored Checkpoint; it does not mutate or replace any in-flight `EngineeringSession` instance.
- Checkpoints are caller-created through explicit `createCheckpoint()` calls only.
- Checkpoint identity is the named Checkpoint reference for this vertical slice.

### Known Limitations

- Checkpoints are in-memory only.
- No automatic or triggered checkpointing is implemented.
- No retention, pruning, expiry, or cross-session sharing policy is implemented.
- Recovery reconstructs a new `EngineeringSession` instance from a Checkpoint and returns its snapshot; it does not resume an external runtime process.

### Validation Summary

- TypeScript compile passed: `npm run compile -- --pretty false`.
- Targeted Sprint 49 validation passed: `npx vitest run test/kernel/execution/engineering-session.service.test.ts test/kernel/execution/engineering-session-checkpoint.repository.test.ts test/integration/kernel-boundary-certification.integration.test.ts` (33 tests).
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (76 files / 380 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 48 — Assignment Policy Integration

### Implemented Slice

Implemented the Milestone 8 Sprint 48 Assignment Policy Integration vertical slice. This sprint adds RFC-0004 v1.7's optional Assignment Policy Evaluation gate to `EngineeringSessionService.executeCurrentWorkflowStep` while preserving Sprint 47 Workflow Chain Execution behavior when no Assignment Policy reference is supplied.

Implemented scope:

- Extended `ExecuteCurrentWorkflowStepCommand` with an explicit optional `assignmentPolicyId` and optional `assignmentPolicyEvaluationInput` matching the existing `AssignmentPolicyEvaluationInput` factors except `requiredRole`, which is supplied from the resolved current `WorkflowStep` RoleId.
- Added `AssignmentPolicyRejected` to `EngineeringSessionWorkflowExecutionStatus`.
- Added deterministic rejection before Adapter dispatch and before `ExecutionSession` creation when `AssignmentPolicyService.evaluateAssignmentPolicy` reports `satisfied: false`.
- Reused the existing, unmodified `AssignmentPolicyService.evaluateAssignmentPolicy` and `AssignmentPolicy.evaluate()` behavior; no Assignment Policy value objects or evaluation semantics were changed.
- Updated `createKernelServices()` only to supply the composed `AssignmentPolicyService` instance to `EngineeringSessionService`.
- Added focused coverage for satisfied policy execution, unsatisfied policy rejection, omitted policy behavior, deterministic policy outcomes, advancement regression safety, and Kernel composition continuity.

Out of scope and not implemented:

- Adapter Selection, Adapter routing, capability scoring, or fallback logic.
- Automatic Assignment Policy binding, inference, lookup by `WorkflowStep`, or policy selection.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing or concurrent session/workflow coordination.
- Task lifecycle transition.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.7 (`Workflow Chain Execution` / `Assignment Policy Evaluation`).

Referenced RFCs:

- RFC-0004 — Execution Model v1.3 (`Assignment Policy`; existing semantics reused).
- RFC-0004 — Execution Model v1.6 (`Workflow Chain Execution`; Sprint 47 behavior preserved except this optional gate).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Caller-supplied Assignment Policy reference for Workflow Chain Execution.
- Assignment Policy Evaluation consumption point before Adapter dispatch.
- Use of resolved current `WorkflowStep` RoleId as Assignment Policy `requiredRole` input.
- Deterministic `AssignmentPolicyRejected` outcome with no Adapter dispatch and no `ExecutionSession` record.

Deferred Concepts:

- Adapter Selection, routing, capability scoring, and fallback logic.
- Automatic Assignment Policy binding, inference, lookup, or selection.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing and concurrent session coordination.
- Task lifecycle transition.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-005`, `NEXUS-RAT-2026-07-15-006`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0048-assignment-policy-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The caller supplies the explicit Assignment Policy reference and evaluation input when policy gating is required.
- `EngineeringSessionService` owns only the consumption gate; Assignment Policy value objects and evaluation semantics remain owned by `AssignmentPolicy`/`AssignmentPolicyService`.
- Existing readiness evaluation remains part of Sprint 47 Workflow Chain Execution and continues to reject before dispatch when readiness fails.

### Known Limitations

- Assignment Policy Evaluation gates only the single already-resolved current `WorkflowStep` RoleId.
- No persistent binding exists between a `WorkflowStep` and an `AssignmentPolicy`.
- Adapter selection remains entirely caller-supplied through explicit `adapterId`.
- Sessions and execution sessions remain in-memory only; no durable persistence is implemented.

### Validation Summary

- Targeted Sprint 48 validation passed: `npx vitest run test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts` (27 tests).
- TypeScript compile passed: `npm run compile`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 374 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

### TASK-001 Remediation — NEXUS-REV-2026-07-15-004-F-001

Implemented the test-only remediation for `TASK-001`.

Remediation scope:

- Added coverage for `executeCurrentWorkflowStep()` rejecting with `InvalidEngineeringSessionDefinitionError` when `assignmentPolicyId` is supplied without `assignmentPolicyEvaluationInput`, with no `ExecutionSession` created and no Adapter invocation.
- Added coverage for `requireAssignmentPolicyService()` rejecting with `InvalidEngineeringSessionDefinitionError` when `assignmentPolicyId` is supplied but `EngineeringSessionService` was constructed without an `assignmentPolicyService` collaborator, with no `ExecutionSession` created and no Adapter invocation.

No production source files were modified for this remediation.

Validation:

- Targeted remediation validation passed: `npx vitest run test/kernel/execution/engineering-session.service.test.ts` (25 tests).
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 376 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

---

## Sprint 47 — Workflow Chain Execution

### Implemented Slice

Implemented the Milestone 8 Sprint 47 Workflow Chain Execution vertical slice. This sprint introduces caller-invoked execution of the current `EngineeringSession` Workflow Step while preserving Workflow Advancement as a separate operation.

Implemented scope:

- Added `EngineeringSession.executeCurrentWorkflowStep()` to resolve the current workflow position's bound `WorkflowStep` RoleId without advancing workflow position.
- Added `EngineeringSessionService.executeCurrentWorkflowStep()` to orchestrate current-step Role resolution, `ExecutionStrategyService.evaluateAssignmentReadiness`, explicit-`adapterId` `AdapterService.dispatch`, and `ExecutionSessionService.createExecutionSession` attempt recording.
- Added deterministic execution result contracts covering completed Adapter responses, failed/non-`Completed` Adapter responses, and readiness rejection.
- Updated `createKernelServices()` composition only to supply existing `ExecutionStrategyService`, `AdapterService`, and `ExecutionSessionService` instances to `EngineeringSessionService`.
- Added tests for successful execution recording, readiness rejection with no `ExecutionSession`, non-`Completed` Adapter response recording, deterministic equivalent execution results, unchanged workflow position, existing advancement regression safety, and Kernel composition continuity.

Out of scope and not implemented:

- Adapter Selection, Adapter routing, capability scoring, or fallback logic.
- Assignment Policy evaluation.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing or concurrent session/workflow coordination.
- Review lifecycle, Review outcome determination, or ReviewService behavior.
- Any execution-driven Workflow Advancement or combined execute-and-advance operation.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.6 (`Workflow Chain Execution`).

Referenced RFCs:

- RFC-0004 — Execution Model v1.6 (`Engineering Session`, `Workflow Chaining`, `Workflow Advancement`, `Execution Strategy`, `Execution Session`; existing semantics reused).
- RFC-0008 — Kernel Adapter Contract (`AdapterService.dispatch`, unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Current Workflow Step Role resolution from the bound `WorkflowChain`.
- Caller-invoked current Workflow Step execution through existing readiness and Adapter dispatch contracts.
- Execution attempt recording through the existing `ExecutionSessionService`.
- Deterministic readiness rejection without creating an `ExecutionSession`.

Deferred Concepts:

- Adapter Selection, routing, capability scoring, and fallback logic.
- Assignment Policy wiring into execution.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing and concurrent session coordination.
- Execution-driven automatic advancement or any change to existing Advancement strategies.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-003`, `NEXUS-RAT-2026-07-15-004`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0047-workflow-chain-execution.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The caller supplies the explicit `adapterId`, `taskId`, `executionStrategyId`, `missionPlanId`, context package reference, and consumed projection version required to execute and record the current Workflow Step.
- Existing `ExecutionStrategyService.evaluateAssignmentReadiness()` remains the readiness authority; readiness-domain failures are returned as deterministic `ReadinessRejected` results with no `ExecutionSession` record.
- Adapter responses are authoritative for the execution attempt outcome recorded in `ExecutionSession.executionOutcome`.

### Known Limitations

- The operation executes exactly one current Workflow Step per invocation.
- Execution does not advance the workflow position; callers must invoke existing Advancement operations separately.
- Adapter selection remains entirely caller-supplied through explicit `adapterId`.
- Sessions and execution sessions remain in-memory only; no durable persistence is implemented.

### Validation Summary

- Targeted Sprint 47 validation passed: `npx vitest run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- TypeScript compile passed: `npm run compile`.
- ESLint passed: `npm run lint`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 366 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### TASK-001 Remediation — NEXUS-REV-2026-07-15-002-F-001

Implemented the test-only remediation for `TASK-001`.

Remediation scope:

- Added coverage for WorkflowStep Role / Assignment Role mismatch returning `ReadinessRejected` with diagnostic code `engineering-session.workflow-step-role-mismatch`, with no `ExecutionSession` created and no Adapter invocation.
- Added coverage for `requireExecutionStrategyService()` rejecting `executeCurrentWorkflowStep()` when `executionStrategyService` is omitted.
- Added coverage for `requireAdapterService()` rejecting `executeCurrentWorkflowStep()` when `adapterService` is omitted.
- Added coverage for `requireExecutionSessionService()` rejecting `executeCurrentWorkflowStep()` when `executionSessionService` is omitted.

No production source files were modified for this remediation.

Validation:

- Targeted remediation validation passed: `npm run compile` and `npx vitest run test/kernel/execution/engineering-session.service.test.ts` (19 tests).
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 370 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.

### Deviations

No architectural deviations.

---

## Sprint 46 — Review-Gated Workflow Advancement

### Implemented Slice

Implemented the Milestone 8 Sprint 46 Review-Gated Workflow Advancement vertical slice. This sprint introduces RFC-0004 v1.5's synchronous Review-Gated Advancement Strategy entry point without introducing Review lifecycle changes, Event Bus subscription, scheduling, background processing, or cross-domain review-state persistence.

Implemented scope:

- Added `EngineeringSession.advanceWorkflowAfterReview()` as the Review-Gated Advancement aggregate operation.
- Consumed `ReviewOutcome` as immutable, already-finalized input from RFC-0006; no Review evaluation, calculation, modification, persistence, or lifecycle behavior was introduced.
- Classified the supplied `ReviewOutcome` using RFC-0004 v1.5's Blocking/Non-Blocking semantics: Accepted and Accepted With Observations are Non-Blocking; Action Required and Rejected are Blocking.
- Reused Sprint 43's existing `EngineeringSession.advanceWorkflow()` path for bound-chain validation, current-position validation, terminal-position rejection, advancement result, and no-state-change failure behavior.
- Added `EngineeringSessionService.advanceWorkflowAfterReview()` as repository lookup, read-only `WorkflowChain` lookup, ReviewOutcome value construction, aggregate delegation, persistence, and snapshot return only.
- Added deterministic tests for Non-Blocking advancement, Blocking rejection, existing ineligibility rejection, equivalent-session/equivalent-outcome determinism, service persistence, and Kernel composition continuity.

Out of scope and not implemented:

- Event Bus-driven or automatic Review-completion-triggered advancement.
- Scheduling, background processing, polling, or asynchronous workflow advancement.
- Any `ReviewService` write operation, Review lifecycle change, Review state persistence, or Review outcome calculation.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing or concurrent session/workflow coordination.
- Assignment Policy, ExecutionSession, Adapter dispatch, Host, or Adapter wiring.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.5 (`Workflow Advancement`, Review-Gated Advancement Strategy and Blocking/Non-Blocking Review Outcome classification).

Referenced RFCs:

- RFC-0006 — Engineering Assessment Model (`ReviewOutcome` consumed as immutable input only).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringSession.advanceWorkflowAfterReview()`.
- `EngineeringSessionService.advanceWorkflowAfterReview()`.
- Review-Gated Advancement eligibility check requiring a Non-Blocking Review Outcome.
- Blocking Review Outcome rejection as an Advancement Failure preserving the current workflow position.

Deferred Concepts:

- Event Bus-driven or Review-completion-triggered advancement.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing and concurrent session/workflow coordination.
- Review lifecycle modification or Review state persistence from `EngineeringSession` / `EngineeringSessionService`.
- Host or Adapter consumption of Review-Gated Advancement.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-15-001`, `NEXUS-RAT-2026-07-15-002`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0046-review-gated-workflow-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The call site supplies an already-finalized `ReviewOutcome`; this sprint does not resolve a Review reference through `ReviewService` because the authorized slice allows direct outcome input and forbids Review writes.
- Existing Advancement Failure semantics are represented by the existing `InvalidEngineeringSessionDefinitionError`, consistent with Sprint 43 and Sprint 45 behavior.

### Known Limitations

- Review-Gated Advancement is synchronous and caller-invoked at the service boundary for this Sprint; no automatic, scheduled, event-subscribed, or Review-completion-triggered invocation exists.
- Manual Advancement, Automatic/Event-Driven Advancement, and Review-Gated Advancement remain separate entry points onto shared Advancement Eligibility/Result/Failure behavior.
- Sessions remain in-memory only; no durable persistence is implemented.

### Validation Summary

- Targeted Sprint 46 validation passed: `npm exec vitest run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- TypeScript compile passed: `npm run compile -- --pretty false`.
- ESLint passed: `npm run lint -- --quiet`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 362 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 46.

### Deviations

No architectural deviations.

---

## Sprint 45 — Automatic/Event-Driven Workflow Advancement

### Implemented Slice

Implemented the Milestone 8 Sprint 45 Automatic/Event-Driven Workflow Advancement vertical slice. This sprint introduces RFC-0004 v1.4's synchronous Automatic/Event-Driven Advancement Strategy entry point without introducing Event Bus subscription, scheduling, background processing, or cross-domain trigger producers.

Implemented scope:

- Added immutable, producer-independent `AdvancementTrigger` construction, snapshot reconstitution, equality, and validation.
- Added `AdvancementTrigger.fact` as the sole trigger datum; no caller, API, producer, `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter, Role Registry, Engineering Role Profile, or Execution Strategy reference is represented.
- Added `EngineeringSession.advanceWorkflowOnTrigger()` as the trigger-accepting aggregate operation.
- Reused Sprint 43's existing `EngineeringSession.advanceWorkflow()` path for Advancement Eligibility, Advancement Result, and Advancement Failure semantics, preserving the single validation behavior for bound chain existence, valid current position, and terminal-position rejection.
- Added `EngineeringSessionService.advanceWorkflowOnTrigger()` as synchronous repository lookup, trigger construction, aggregate delegation, persistence, and snapshot return only.
- Added deterministic tests for trigger validation, eligible trigger advancement, ineligible trigger rejection, equivalent-trigger/equivalent-session determinism, service persistence, and Kernel composition continuity.

Out of scope and not implemented:

- `ExecutionSession`-completion-driven or any other concrete domain-event-driven trigger producer.
- Event Bus integration or subscription for `EngineeringSession`.
- Scheduling, background processing, polling, asynchronous workflow advancement, or hidden behavior.
- Review-Gated Advancement and Review Outcome gating semantics.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing or concurrent session/workflow coordination.
- Assignment Policy, Adapter dispatch, Role Registry, Engineering Role Profile, Execution Strategy, Host, or Adapter wiring.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.4 (`Workflow Advancement`, Automatic/Event-Driven Advancement Strategy).

Referenced RFCs:

- RFC-0004 — Execution Model v1.4 (`Engineering Session`, existing and unmodified).
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `AdvancementTrigger`.
- `EngineeringSession.advanceWorkflowOnTrigger()`.
- `EngineeringSessionService.advanceWorkflowOnTrigger()`.
- Synchronous trigger submission and deterministic advancement evaluation using Sprint 43's existing Advancement Eligibility/Result/Failure semantics.

Deferred Concepts:

- Concrete trigger producers, including `ExecutionSession` completion or domain-event-driven production.
- Event Bus subscription or scheduling.
- Review-Gated Advancement and Review Outcome gating semantics.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing and concurrent session/workflow coordination.
- Host or Adapter consumption of trigger advancement.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-025`, `NEXUS-RAT-2026-07-14-026`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0045-automatic-event-driven-workflow-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `AdvancementTrigger.fact` is the Sprint 45 representation of RFC-0004's deterministic condition or reported fact that causes Advancement Eligibility to be evaluated.

### Known Limitations

- `AdvancementTrigger` submission is synchronous and caller-initiated at the service boundary for this Sprint; no automatic, scheduled, event-subscribed, or domain-produced trigger source exists.
- Automatic/Event-Driven Advancement and Manual Advancement remain separate entry points onto the same Advancement Eligibility/Result/Failure behavior.
- Sessions and triggers remain in-memory only; no durable persistence is implemented.

### Validation Summary

- Targeted Sprint 45 validation passed: `npm exec vitest run test/kernel/execution/advancement-trigger.test.ts test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- TypeScript compile passed: `npm run compile -- --pretty false`.
- ESLint passed: `npm run lint -- --quiet`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (75 files / 354 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 45.

### Deviations

No architectural deviations.

---

## Sprint 44 — Assignment Policy Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 44 Assignment Policy Foundation vertical slice. This sprint introduces RFC-0004's standalone, deterministic `AssignmentPolicy` domain model without runtime wiring.

Implemented scope:

- Added `AssignmentPolicyId`.
- Added exactly five immutable assignment-requirement value objects: required role via the existing `RoleId`, Adapter/execution capability, repository configuration, execution constraints, and human preferences.
- Added immutable `AssignmentPolicy` construction and snapshot reconstitution.
- Added deterministic `AssignmentPolicy.evaluate()` as a pure comparison of the five stated assignment factors, producing equivalent outcomes for equivalent inputs and no side effects.
- Added `IAssignmentPolicyRepository` and `InMemoryAssignmentPolicyRepository` for creation, lookup, and enumeration only.
- Added thin `AssignmentPolicyService` for creation, lookup, enumeration, and policy evaluation only.
- Updated `createKernelServices()` only to compose `AssignmentPolicyService` and its repository.
- Updated the Kernel boundary certification composition assertion to include `AssignmentPolicyService` while preserving existing `WorkflowChainService` and `EngineeringSessionService` composition.
- Added deterministic unit coverage for aggregate construction and immutability, all five assignment-requirement value objects, evaluation, repository behavior, service behavior, and composition.

Out of scope and not implemented:

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, or Adapter invocation driven by policy evaluation.
- Review-Gated Progression.
- Multi-Agent Engineering Orchestration.
- Automatic or event-driven workflow advancement.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any change to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowStep`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.3 (`Assignment` and `Assignment Policy` sections).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `AssignmentPolicy`.
- `AssignmentPolicyId`.
- Five assignment-requirement factors: required role, Adapter/execution capability, repository configuration, execution constraints, and human preferences.
- Deterministic policy evaluation as a pure function of stated inputs.
- `AssignmentPolicyService` creation, lookup, enumeration, and evaluation orchestration only.

Deferred Concepts:

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, Adapter invocation, or execution-eligibility side effects driven by policy evaluation.
- Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic/event-driven workflow advancement.
- Session recovery/checkpointing and concurrent session/workflow coordination.
- Host or Adapter consumption of `AssignmentPolicy`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-024`, `NEXUS-RAT-2026-07-14-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0044-assignment-policy-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Adapter/execution capability is represented as a standalone assignment-requirement string value object for this Sprint; it is not Adapter selection, Adapter dispatch, or an Adapter reference.
- Repository configuration, execution constraints, and human preferences are immutable string-record requirement sets; evaluation requires every policy requirement entry to be present with an equivalent value in the evaluation input.

### Known Limitations

- `AssignmentPolicy` is advisory domain data only; no existing workflow, session, Task lifecycle, Adapter, Host, or orchestration behavior consults it.
- Policies and repositories remain in-memory only; no durable persistence is implemented.

### Validation Summary

- Targeted Sprint 44 validation passed: `npm exec vitest run test/kernel/execution/assignment-policy.test.ts test/kernel/execution/assignment-policy.repository.test.ts test/kernel/execution/assignment-policy.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- TypeScript compile passed: `npm run compile -- --pretty false`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (74 files / 347 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 44.

### Deviations

No architectural deviations.

---

## Sprint 43 — Engineering Session Manual Workflow Advancement

### Implemented Slice

Implemented the Milestone 8 Sprint 43 Engineering Session Manual Workflow Advancement vertical slice. This sprint introduces deterministic, caller-invoked, single-step manual workflow advancement within an already-bound `EngineeringSession`.

Implemented scope:

- Added `EngineeringSession.advanceWorkflow()` to advance `currentWorkflowStepId` by exactly one zero-based workflow position per invocation.
- Added `EngineeringSession.isWorkflowComplete()` as a read-only terminal-step completion signal.
- Kept progression validation inside `EngineeringSession`, rejecting missing bound chains, mismatched chains, invalid current positions, and advancement beyond the terminal `WorkflowStep`.
- Extended `EngineeringSessionService` with `advanceWorkflow()` orchestration over repository lookup, read-only `WorkflowChain` retrieval, aggregate invocation, and persistence only.
- Preserved `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` snapshot reconstitution so the advanced position persists through save and retrieval.
- Added deterministic unit coverage for aggregate advancement, terminal detection, invalid advancement cases, repository persistence/reconstitution, service success and rejection paths, and equivalent-input determinism.

Out of scope and not implemented:

- Automatic or event-driven workflow advancement.
- Assignment Policy, Review-Gated Progression, Adapter dispatch, `ExecutionStrategy` invocation, orchestration events, or behavior triggered by workflow completion.
- Workflow branching, restart, replacement, concurrent workflow execution, Multi-Agent Engineering Orchestration, or session recovery/checkpointing.
- Any change to `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.3 (`EngineeringSession` current workflow position and workflow state ownership; existing `WorkflowChain`/`WorkflowStep` consumed read-only).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringSession.advanceWorkflow()`.
- `EngineeringSession.isWorkflowComplete()`.
- Deterministic single-step advancement validation owned by `EngineeringSession`.
- Repository persistence of advanced `currentWorkflowStepId` through existing snapshot reconstitution.
- `EngineeringSessionService.advanceWorkflow()` repository orchestration and persistence only.

Deferred Concepts:

- Automatic workflow advancement, event-driven advancement.
- Assignment Policy, Review-Gated Progression.
- Adapter dispatch, `ExecutionStrategy` invocation, orchestration events, or completion-triggered behavior.
- Workflow branching, restart, replacement, concurrent execution, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Host or Adapter consumption of workflow advancement.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-023`, `NEXUS-RAT-2026-07-14-022`, `NEXUS-RAT-2026-07-14-021`, `NEXUS-RAT-2026-07-14-020`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0043-engineering-session-manual-workflow-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `currentWorkflowStepId` remains the Sprint 42 canonical zero-based workflow position string; Sprint 43 advances that existing positional representation without changing the snapshot field name.
- Workflow completion is computed from the bound `WorkflowChain`'s terminal ordered step and remains a read-only state signal only.

### Known Limitations

- Advancement is manual and caller-invoked only.
- Workflow completion does not complete the `EngineeringSession` and triggers no additional behavior.
- Sessions and workflow chains remain in-memory only; no durable persistence, recovery, checkpointing, or concurrent coordination is implemented.

### Validation Summary

- Targeted Sprint 43 validation passed: `npm exec vitest run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.repository.test.ts test/kernel/execution/engineering-session.service.test.ts`.
- TypeScript compile passed: `npm run compile -- --pretty false`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest (71 files / 337 tests), and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 43.

### Deviations

No architectural deviations.

---

## Sprint 42 — Engineering Session Workflow Chain Wiring

### Implemented Slice

Implemented the Milestone 8 Sprint 42 Engineering Session Workflow Chain Wiring vertical slice. This sprint introduces RFC-0004 v1.3's creation-time-only structural runtime binding from `EngineeringSession` to exactly one active `WorkflowChain` and exactly one current workflow position reference.

Implemented scope:

- Added required immutable `workflowChainId` and `currentWorkflowStepId` fields to `EngineeringSession` input and snapshot structures.
- Extended `EngineeringSession` construction to validate an existing `WorkflowChain` reference and verify that the current workflow position points to an existing step in the bound chain.
- Preserved `EngineeringSession` lifecycle behavior; no operation changes `workflowChainId` or `currentWorkflowStepId` after creation.
- Extended `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository` persistence through existing snapshot reconstitution to carry the new binding fields.
- Extended `EngineeringSessionService` creation orchestration to consult `IWorkflowChainRepository` read-only, pass the binding into `EngineeringSession`, and persist only validated sessions.
- Updated `createKernelServices()` to pass the existing composed `WorkflowChain` repository into `EngineeringSessionService`.
- Added deterministic unit and integration coverage for valid binding, null/nonexistent chain and step rejection, out-of-range step-position rejection, repeated-role step positions, deterministic construction, repository reconstitution, service orchestration, and Kernel composition.
- Remediated `NEXUS-REV-2026-07-14-021-F-001` / `TASK-001` by representing `currentWorkflowStepId` as a canonical zero-based position string instead of matching against `WorkflowStep.roleId`.

Out of scope and not implemented:

- Workflow advancement, event-driven advancement, Review-Gated Progression, Assignment Policy, workflow completion, branching, restart, or replacement.
- `EngineeringSession` orchestration behavior beyond validated creation.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, or concurrent session coordination.
- Any change to `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Any `src/hosts` or `src/adapters` file change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.3 (Engineering Session active Workflow Chain reference and current workflow position).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringSession.workflowChainId`.
- `EngineeringSession.currentWorkflowStepId`.
- Creation-time binding validation owned by `EngineeringSession`.
- Read-only `IWorkflowChainRepository` lookup during `EngineeringSessionService` creation orchestration.
- Kernel composition wiring between the existing workflow-chain repository and `EngineeringSessionService`.

Deferred Concepts:

- Workflow advancement, event-driven advancement, Review-Gated Progression, Assignment Policy.
- Workflow completion, branching, restart, or replacement.
- `EngineeringSession` orchestration behavior beyond validated creation.
- Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination.
- Host or Adapter consumption of workflow-chain-bound Engineering Sessions.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-022`, `NEXUS-RAT-2026-07-14-021`, `NEXUS-RAT-2026-07-14-020`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0042-engineering-session-workflow-chain-wiring.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `currentWorkflowStepId` preserves the Sprint 42 snapshot field name while using a canonical zero-based position string. This satisfies RFC-0004's ordinal "current workflow position" requirement without modifying Sprint 41's frozen `WorkflowChain` or `WorkflowStep` shapes.
- `activeEngineeringWorkflowReference` remains unchanged from Sprint 39 while `workflowChainId` provides the new RFC-0004 v1.3 active `WorkflowChain` reference; this Sprint does not rename or remove pre-existing fields.

### Known Limitations

- Binding is validated at creation only; no revalidation or mutation operation exists after persistence.
- Sessions and workflow chains remain in-memory only; no durable persistence, recovery, checkpointing, or concurrent coordination is implemented.
- No workflow progression semantics exist; the current workflow step reference is fixed for the lifetime of the `EngineeringSession` in this sprint.

### Validation Summary

- Targeted Sprint 42 validation passed: `npx vitest run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.repository.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- Targeted Sprint 42 recovery validation passed after `TASK-001` remediation: `npm run compile -- --pretty false` followed by `npx vitest run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.repository.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- Repository validation passed after `TASK-001` remediation with `npm run validate`: TypeScript compile, ESLint, Vitest (71 files / 330 tests), and esbuild.
- Extension-host test bundle build passed after `TASK-001` remediation with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 42.

### Deviations

No architectural deviations.

---

## Sprint 41 — Workflow Chaining Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 41 Workflow Chaining Foundation vertical slice. This sprint introduces RFC-0004 v1.3's standalone `WorkflowChain` Kernel domain concept as the immutable definition of an ordered engineering workflow, wholly independent of `EngineeringSession` and `ExecutionSession`.

Implemented scope:

- Added immutable `WorkflowChainId`.
- Added `WorkflowStep` as a value object containing exactly one Execution Role reference via `RoleId`.
- Added `WorkflowChain` with `create`/`fromSnapshot`/`toSnapshot`/`equals`, immutable ordered `WorkflowStep` topology, immutable snapshots, deterministic equality, and dedicated definition diagnostics.
- Added `WorkflowChain` snapshot/input structures for chain identity and ordered workflow steps.
- Added `IWorkflowChainRepository` and `InMemoryWorkflowChainRepository` with create, lookup, and deterministic enumeration only.
- Added `WorkflowChainService` as thin orchestration over constructor-injected repository contracts for create, lookup, and enumeration only.
- Updated `createKernelServices()` to compose `InMemoryWorkflowChainRepository` and `WorkflowChainService`.
- Updated Sprint 18 Kernel Boundary Certification only where it enumerates Kernel-composed services.
- Added deterministic unit coverage for domain construction, validation, equality, immutability, no-mutation-method behavior, `WorkflowStep` boundary constraints, repository behavior, service diagnostics, and composition.

Out of scope and not implemented:

- `EngineeringSession` to `WorkflowChain` wiring, active-chain references, current workflow position, workflow state advancement, or workflow execution history.
- Automatic workflow advancement, Assignment Policy evaluation, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, or concurrent session coordination.
- Adapter dispatch, Adapter invocation, execution eligibility determination, Task lifecycle transition, workflow coordination, or orchestration behavior.
- Any `src/hosts` or `src/adapters` file change.
- Any behavior change to `EngineeringSession`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, or `TaskId`.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.3 (Workflow Chaining).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `WorkflowChain`.
- `WorkflowChainId`.
- `WorkflowStep`.
- `IWorkflowChainRepository` / `InMemoryWorkflowChainRepository`.
- `WorkflowChainService`.
- Kernel composition of the workflow-chain repository and workflow-chain service.

Deferred Concepts:

- `EngineeringSession` to `WorkflowChain` wiring, active-chain reference, and current workflow position.
- Automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing and concurrent session coordination.
- Host or Adapter consumption of `WorkflowChain`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-021`, `NEXUS-RAT-2026-07-14-020`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0041-workflow-chaining-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Workflow topology is represented by the immutable order of `WorkflowStep` snapshots because RFC-0004 v1.3 defines topology as "the ordering and structure of those steps" and Sprint 41 authorizes no additional step fields.
- `WorkflowChain` identity is the only chain-level identifying field implemented because Sprint 41 authorizes chain identity and ordered steps only; no separate display-name field is introduced.

### Known Limitations

- Chains are in-memory only; no durable persistence, recovery, checkpointing, or concurrent coordination is implemented.
- `WorkflowChain` is inert Kernel state this sprint; no `EngineeringSession`, Host, Adapter, Execution Pipeline, Assignment Policy, or Task lifecycle consumer exists.
- `WorkflowStep` validates only structural boundaries and `RoleId` identity shape; it does not validate role registry membership or dispatch eligibility.

### Validation Summary

- Targeted Sprint 41 validation passed: `npm exec vitest run test\kernel\execution\workflow-chain.test.ts test\kernel\execution\workflow-chain.repository.test.ts test\kernel\execution\workflow-chain.service.test.ts test\integration\kernel-boundary-certification.integration.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 41.

### Deviations

No architectural deviations.

---

## Sprint 40 — Execution Session Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 40 Execution Session Foundation vertical slice. This sprint introduces the RFC-0004 v1.2 `ExecutionSession` Kernel domain concept as the immutable, append-only record of one coordinated execution attempt owned by exactly one `EngineeringSession`.

Implemented scope:

- Added immutable `ExecutionSessionId`.
- Added `ExecutionSession` with `create`/`fromSnapshot`/`toSnapshot`/`equals`, required owning `EngineeringSessionId`, assigned role, assigned adapter, execution timestamps, consumed Projection version, produced artifacts, execution outcome, immutable snapshots, deterministic equality, and dedicated definition diagnostics.
- Added `ExecutionSession` snapshot/input structures for RFC-0004's Execution Session fields and Sprint 40's owning-`EngineeringSessionId` invariant.
- Added `IExecutionSessionRepository` and `InMemoryExecutionSessionRepository` with create, lookup, existence checks, deterministic enumeration, and owner-scoped enumeration by `EngineeringSessionId`.
- Added repository-layer ownership validation as defense in depth for the required owning `EngineeringSessionId`.
- Added `ExecutionSessionService` as thin orchestration over constructor-injected repository contracts for create, lookup, and enumeration only.
- Updated `createKernelServices()` to compose `InMemoryExecutionSessionRepository` and `ExecutionSessionService`.
- Updated Sprint 18 Kernel Boundary Certification only where it enumerates Kernel-composed services.
- Added deterministic unit coverage for domain construction, validation, equality, snapshot immutability, append-only behavior, repository behavior, owner-scoped enumeration, service diagnostics, and composition.

Out of scope and not implemented:

- Adapter dispatch, Adapter invocation, execution eligibility determination, Assignment Policy evaluation, Task lifecycle transition, workflow coordination, or orchestration behavior.
- Workflow Chaining, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, or concurrent session coordination.
- Any `src/hosts` or `src/adapters` file change.
- Any behavior change to `EngineeringSession`, `EngineeringSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, or `TaskId`.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.2 (Execution Session).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `ExecutionSession`.
- `ExecutionSessionId`.
- `IExecutionSessionRepository` / `InMemoryExecutionSessionRepository`.
- `ExecutionSessionService`.
- Kernel composition of the execution-session repository and execution-session service.

Deferred Concepts:

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- Adapter dispatch, execution-eligibility determination, Task lifecycle transition, and all orchestration behavior.
- Host or Adapter consumption of `ExecutionSession`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-019`, `NEXUS-RAT-2026-07-14-018`, `NEXUS-RAT-2026-07-14-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0040-execution-session-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `executionOutcome` is preserved as a deterministic non-empty string because RFC-0004's Execution Session section requires recording the execution outcome without defining a Sprint 40-owned outcome enumeration.
- `assignedAdapter` is preserved as a deterministic non-empty adapter reference string; Sprint 40 records assignment but does not validate adapter registry membership or dispatch eligibility.
- `executionTimestamps` are recorded as explicit `startedAt` and `completedAt` values to represent RFC-0004's execution timestamps without introducing a lifecycle state machine.

### Known Limitations

- Sessions are in-memory only; no durable persistence, recovery, checkpointing, or concurrent coordination is implemented.
- `ExecutionSession` is inert Kernel state this sprint; no Host, Adapter, Execution Pipeline, Assignment Policy, or Task lifecycle consumer exists.
- The `EngineeringSession` containment association is represented by the required owning `EngineeringSessionId`; no `EngineeringSession` mutation or lifecycle propagation is introduced.

### Validation Summary

- Targeted Sprint 40 validation passed: `npm exec vitest run test/kernel/execution/execution-session.test.ts test/kernel/execution/execution-session.repository.test.ts test/kernel/execution/execution-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 40.

### Deviations

No architectural deviations.

---

## Sprint 39 — Engineering Sessions Foundation

### Implemented Slice

Implemented the Milestone 8 Sprint 39 Engineering Sessions Foundation vertical slice. This sprint introduces the RFC-0004 v1.2 `EngineeringSession` Kernel runtime boundary for one span of AI-assisted engineering work, with identity, deterministic lifecycle, in-memory persistence, diagnostics structure, and a thin Kernel service.

Implemented scope:

- Added immutable `EngineeringSessionId` and `EngineeringSessionStatus` value objects.
- Added `EngineeringSession` with `create`/`fromSnapshot`/`toSnapshot`/`equals`, required foundation fields for RFC-0004 v1.2 Architectural Responsibilities, deterministic `Open` -> `Closed` lifecycle, immutable snapshot output, and dedicated definition/lifecycle diagnostics.
- Added `EngineeringSession` diagnostics and collaboration metadata snapshot structures without introducing workflow behavior.
- Added `IEngineeringSessionRepository` and `InMemoryEngineeringSessionRepository` with create, save, lookup, existence, and deterministic enumeration.
- Added `EngineeringSessionService` as thin orchestration over constructor-injected repository contracts for create, close, lookup, and enumeration.
- Updated `createKernelServices()` to compose `InMemoryEngineeringSessionRepository` and `EngineeringSessionService`.
- Updated Sprint 18 Kernel Boundary Certification only where it enumerates Kernel-composed services.
- Added deterministic unit coverage for domain construction, validation, equality, snapshot immutability, lifecycle transitions, repository behavior, service diagnostics, and composition.

Out of scope and not implemented:

- `ExecutionSession` implementation or any reference to implemented `ExecutionSession` records.
- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, or concurrent session coordination.
- Any `src/hosts` or `src/adapters` file change.
- Any behavior change to `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, or existing workflow command dispatch.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.2 (Engineering Session).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringSession`.
- `EngineeringSessionId`.
- `EngineeringSessionStatus`.
- `IEngineeringSessionRepository` / `InMemoryEngineeringSessionRepository`.
- `EngineeringSessionService`.
- Kernel composition of the session repository and session service.

Deferred Concepts:

- Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration.
- Automatic workflow advancement, session recovery/checkpointing, concurrent session coordination.
- `ExecutionSession` implementation.
- Host or Adapter consumption of `EngineeringSession`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-018`, `NEXUS-RAT-2026-07-14-017`, `NEXUS-RAT-2026-07-14-011`, `NEXUS-RAT-2026-07-14-016`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0039-engineering-sessions-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Sprint-authorized minimal lifecycle is represented as `Open` and terminal `Closed`, with no automatic advancement and no review gating.
- `workflowState` is intentionally opaque foundation state; no workflow semantics, sequencing, or orchestration rules are derived from it.
- Session diagnostics and collaboration metadata are structural Kernel-owned session data only; they do not create events, execution attempts, adapter dispatch, or Host behavior.

### Known Limitations

- Sessions are in-memory only; no durable persistence, recovery, checkpointing, or concurrent coordination is implemented.
- `EngineeringSession` is inert Kernel state this sprint; no Host, Adapter, Execution Pipeline, or workflow consumer exists.
- `ExecutionSession` remains unimplemented and out of scope.

### Validation Summary

- Targeted Sprint 39 validation passed: `npm test -- --run test/kernel/execution/engineering-session.test.ts test/kernel/execution/engineering-session.repository.test.ts test/kernel/execution/engineering-session.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- No `src/hosts` or `src/adapters` file was modified for Sprint 39.

### Deviations

No architectural deviations.

---

## Sprint 38 — Engineering Role Profiles Foundation

### Implemented Slice

Implemented the Milestone 7 Sprint 38 Engineering Role Profiles Foundation vertical slice. This sprint introduces the Kernel-owned `EngineeringRoleProfile` metadata concept authorized by RFC-0004 v1.1 and seeds one immutable default profile per already-registered default Kernel Role.

Implemented scope:

- Added immutable `EngineeringRoleProfile` value object with `roleId`, workflow presentation label, completion presentation label, attribution presentation policy, `create`/`fromSnapshot`/`toSnapshot`/`equals`, and dedicated definition validation.
- Added `EngineeringRoleProfileRegistry` and `InMemoryEngineeringRoleProfileRegistry` with deterministic registration, lookup, existence checks, enumeration, duplicate diagnostics, and constructor-time seeding for Kernel composition.
- Added `createDefaultEngineeringRoleProfiles()` with one profile each for `builder`, `reviewer`, and `documentation-reviewer`, preserving presentation metadata semantically equivalent to the existing Host workflow values.
- Added `EngineeringRoleProfileService` as a thin lookup/existence/enumeration/diagnostics abstraction only.
- Updated `createKernelServices()` to seed `InMemoryEngineeringRoleProfileRegistry` from `createDefaultEngineeringRoleProfiles()` at Kernel composition time and register `EngineeringRoleProfileService`.
- Added deterministic unit and integration coverage for value-object behavior, registry diagnostics, default-profile semantic equivalence, service surface, and Kernel composition seeding.

Out of scope and not implemented:

- Any Host workflow or command discovery changes.
- Workflow catalogs, Activity Bar integration, dashboards, Host discovery, or user-facing presentation changes.
- Workflow Chaining, Assignment Policy, Execution Sessions, Planner Workflow, Adapter Routing, Adapter Selection, multi-agent orchestration, or authorization.
- Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer workflows or Kernel Role registration.
- Any `src/hosts`, `src/adapters`, Adapter Runtime, Host Adapter Configuration, or Execution Pipeline change.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model v1.1 (Engineering Role Profile).

Referenced RFCs:

- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- `EngineeringRoleProfile` as RFC-0004-owned Kernel metadata for workflow presentation, completion presentation, attribution presentation policy, and engineering role discoverability.
- `EngineeringRoleProfileRegistry` / `InMemoryEngineeringRoleProfileRegistry` for profile registration, lookup, existence checks, and enumeration.
- Default Engineering Role Profiles for the three registered default Kernel Roles.
- `EngineeringRoleProfileService` as a non-orchestration lookup/enumeration abstraction.
- Kernel composition-time profile registry seeding.

Deferred Concepts:

- Any Host (`src/hosts`) file change or Host consumer of Engineering Role Profiles.
- Host/command discovery, workflow catalogs, Activity Bar integration, dashboard generation.
- Workflow Chaining, Assignment Policy, Execution Sessions, Planner Workflow.
- Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer Workflows and their Kernel Role registration.
- Adapter Routing, Adapter Selection, multi-agent orchestration, authorization, and Execution Pipeline changes.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-015`, `NEXUS-RAT-2026-07-14-014`, `NEXUS-RAT-2026-07-14-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0038-engineering-role-profiles-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `EngineeringRoleProfile` is descriptive Kernel metadata only and remains subordinate to `ExecutionRole` for execution identity, semantics, and dispatch eligibility.
- Constructor-time seeding of `InMemoryEngineeringRoleProfileRegistry` in `createKernelServices()` satisfies the Sprint requirement that registration occurs only during Kernel composition and is not exposed as normal runtime behavior.
- Keeping Host workflow presentation strings inline in `vscode-host.ts` preserves Sprint 38's no-observable-behavior-change boundary while default profiles carry semantically equivalent metadata for future consumers.

### Known Limitations

- Profiles exist only for the three current default Kernel Roles: `builder`, `reviewer`, and `documentation-reviewer`.
- Profiles are in-memory only and seeded during Kernel composition; there is no durable persistence, runtime creation, update, or versioning path.
- No Host consumer exists yet; Engineering Role Profiles are inert metadata until a future separately ratified Sprint consumes them.

### Validation Summary

- Targeted Sprint 38 validation passed: `npm test -- --run test/kernel/execution/engineering-role-profile.test.ts test/kernel/execution/engineering-role-profile-registry.test.ts test/kernel/execution/engineering-role-profile.service.test.ts test/integration/kernel-boundary-certification.integration.test.ts`.
- TypeScript compile passed with `npm run compile`.
- ESLint passed with `npm run lint`.
- Vitest passed with `npm test`: 62 files, 301 tests.
- esbuild passed with `npm run build`.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification was updated only where it enumerates Kernel-composed services/profiles; the distinct `src/kernel` import-graph-boundary assertion remained unmodified.
- No `src/hosts` or `src/adapters` file was modified for Sprint 38.

### Deviations

No architectural deviations.

---

## Sprint 37 — Documentation Workflow Foundation

### Implemented Slice

Implemented the Milestone 7 Sprint 37 Documentation Workflow Foundation vertical slice. This sprint registers the RFC-0004-named `Documentation Reviewer` Additional Role as default Kernel Role `documentation-reviewer` and adds the dedicated Documentation Reviewer Workflow Host command through the Sprint 36 Role-scoped workflow factory.

Implemented scope:

- Added exactly one default Kernel `ExecutionRole` entry in `createDefaultKernelRoles()` for `documentation-reviewer`.
- Added `nexus.runDocumentationReviewerMissionWorkflow` as an additive VS Code Host command.
- Constructed the Documentation Reviewer Workflow through `createConfiguredMissionWorkflow` with explicit `roleId: 'documentation-reviewer'`.
- Preserved the existing Host Adapter Configuration resolution, explicit `adapterId` dispatch, certified Execution Pipeline, Adapter Runtime, and Kernel contracts.
- Registered the new command in `package.json` `activationEvents` and `contributes.commands` as **Nexus: Run Documentation Reviewer Workflow**.
- Added Documentation Reviewer-specific Host result/history presentation metadata that labels successful results/history with `Documentation Reviewer (documentation-reviewer)`.
- Added deterministic tests for default Role registration, Host command registration/success/cancellation, Documentation Reviewer result/history role labeling, package metadata/activation events, and extension-host command discoverability.
- Updated README user guidance to describe the Documentation Reviewer Workflow command alongside existing Developer, Builder, and Reviewer Workflow commands.

Out of scope and not implemented:

- Planner Workflow, Documentation Author Workflow, Security Reviewer Workflow, Architecture Reviewer Workflow, or any role-scoped workflow beyond Builder/Reviewer/Documentation Reviewer.
- Registration of any Additional Role other than `Documentation Reviewer`.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing, Adapter Selection Policy, or fallback routing.
- New Execution Model concepts, Execution Session behavior, Assignment Policy, Kernel lifecycle changes, Kernel Domain Events, or Adapter contracts.
- Fourth production Adapter, Marketplace publication, `src/adapters` changes, or changes to `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow`.

### RFC Coverage

Primary RFC:

- No Primary RFC — Kernel Role registration reuses RFC-0004's existing `ExecutionRole`/`RoleRegistry` contracts; Host command is additive, reusing existing certified contracts.

Referenced RFCs:

- RFC-0004 — Execution Model (`Documentation Reviewer` Additional Role registered as a default Kernel Role).
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Default Kernel Role registration for `documentation-reviewer`.
- VS Code Host command contribution and activation for `nexus.runDocumentationReviewerMissionWorkflow`.
- Host-local command registration delegating to existing configured-adapter Mission Workflow machinery.
- Explicit Host composition of Documentation Reviewer Workflow execution with `roleId: 'documentation-reviewer'`.
- Host presentation/result metadata for the assigned Documentation Reviewer Execution Role.

Deferred Concepts:

- Planner Workflow, Documentation Author Workflow, Security Reviewer Workflow, Architecture Reviewer Workflow, and other role-scoped AI Engineering Workflows beyond Builder/Reviewer/Documentation Reviewer.
- Registration of Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer, or any Additional Role other than Documentation Reviewer.
- Role-based adapter assignment, automatic routing, workflow chaining, and multi-agent coordination.
- Execution Model expansion, Execution Session behavior, Assignment Policy, review-gated progression, or new Kernel lifecycle semantics.
- Fourth production Adapter, Adapter Selection Policy, Marketplace publication, and Adapter capability scoring.
- Any `src/adapters` change; any change to `HostAdapterConfigurationResolver` or `HostConfiguredMissionWorkflow`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-013`, `NEXUS-RAT-2026-07-14-012`, `NEXUS-RAT-2026-07-14-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0037-documentation-workflow-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `Documentation Reviewer` is already named by RFC-0004 as an Additional Role, so registering it as a default Kernel Role does not introduce a new RFC concept.
- A dedicated Documentation Reviewer Workflow command is Host-layer user interaction under RFC-0009 and does not create a new Kernel lifecycle, event, or bounded context.
- Reusing `HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId()` for the Documentation Reviewer Workflow remains configuration resolution to one explicit `adapterId`, not Adapter Selection Policy.
- Surfacing the assigned Documentation Reviewer role in Host result/history presentation is Host-local metadata derived from the existing RFC-0004 Execution Role and does not introduce Kernel data or a Domain Event.

### Known Limitations

- Only Builder, Reviewer, and Documentation Reviewer Workflows exist after this Sprint; further role-scoped workflows remain deferred.
- The Documentation Reviewer Workflow uses the same configured adapter setting as the configured Developer, Builder, and Reviewer Workflows, preserving Sprint 33 configuration scope and avoiding role-based adapter assignment.
- Workflow history remains session-only and non-durable.

### Validation Summary

- Targeted Sprint 37 validation passed: `npm test -- --run test/kernel/execution/execution-role.test.ts test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts test/hosts/vscode/host-mission-workflow.test.ts test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 294 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification passed in repository-wide validation; `test/integration/kernel-boundary-certification.integration.test.ts`'s role-enumeration assertion was updated to reflect the new default `documentation-reviewer` Role, while the distinct `src/kernel` import-graph-boundary assertion named by the Sprint 37 Acceptance Criteria remained unmodified.
- No `src/adapters` file was modified for Sprint 37.

### Deviations

No architectural deviations.

---

## Sprint 36 — Reviewer Workflow Foundation

### Implemented Slice

Implemented the Milestone 7 Sprint 36 Reviewer Workflow Foundation vertical slice. This sprint adds a dedicated Reviewer Workflow Host command and extracts the Role-scoped Configured Mission Workflow construction into a single Host-layer factory reused by Developer, Builder, and Reviewer workflows without changing Kernel, Adapter, Host Adapter Configuration, or Execution Pipeline contracts.

Implemented scope:

- Extracted the configured Role-scoped workflow construction in `vscode-host.ts` into `createConfiguredMissionWorkflow`.
- Refactored the existing Builder Workflow wiring to use the shared factory while preserving its command identifier, dispatch target, presentation strings, and existing tests.
- Added `nexus.runReviewerMissionWorkflow` as an additive VS Code Host command.
- Registered the new command in `package.json` `activationEvents` and `contributes.commands` as **Nexus: Run Reviewer Workflow**.
- Constructed Reviewer Workflow `HostMissionWorkflow` instances with explicit `roleId: 'reviewer'`.
- Added Reviewer-specific Host result/history presentation metadata that labels successful Reviewer results/history with the assigned `Reviewer (reviewer)` Execution Role.
- Added deterministic tests for Reviewer command registration/success, input-cancellation failure, Reviewer result/history role labeling, package command metadata/activation events, and extension-host command discoverability.
- Updated README user guidance to describe the Reviewer Workflow command alongside existing Developer and Builder Workflow commands.

Out of scope and not implemented:

- Planner Workflow, Documentation Workflow, or any role-scoped workflow beyond Builder/Reviewer.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing, Adapter Selection Policy, or fallback routing.
- New Execution Model concepts, Execution Session behavior, Assignment Policy, Kernel state changes, Kernel data, Domain Events, or Adapter contracts.
- Fourth production Adapter, Marketplace publication, or changes under `src/kernel` or `src/adapters`.

### RFC Coverage

Primary RFC:

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.

Referenced RFCs:

- RFC-0004 — Execution Model (`reviewer` Execution Role consumed unmodified).
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- A reusable Host-layer factory for configured Role-scoped Mission Workflow construction.
- VS Code Host command contribution and activation for `nexus.runReviewerMissionWorkflow`.
- Host-local command registration delegating to existing configured-adapter Mission Workflow machinery.
- Explicit Host composition of Reviewer Workflow execution with `roleId: 'reviewer'`.
- Host presentation/result metadata for the assigned Reviewer Execution Role.

Deferred Concepts:

- Planner Workflow, Documentation Workflow, and other role-scoped AI Engineering Workflows beyond Builder/Reviewer.
- Role-based adapter assignment, automatic routing, workflow chaining, and multi-agent coordination.
- Execution Model expansion, Execution Session behavior, Assignment Policy, review-gated progression, or new Kernel lifecycle semantics.
- Fourth production Adapter, Adapter Selection Policy, Marketplace publication, and Adapter capability scoring.
- Any `src/kernel` or `src/adapters` change.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-012`, `NEXUS-RAT-2026-07-14-011`, `NEXUS-RAT-2026-07-14-010`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0036-reviewer-workflow-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A dedicated Reviewer Workflow command is Host-layer user interaction under RFC-0009 and does not create a new Kernel concept.
- Reusing `HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId()` for the Reviewer Workflow remains configuration resolution to one explicit `adapterId`, not Adapter Selection Policy.
- Surfacing the assigned Reviewer role in Host result/history presentation is Host-local metadata derived from the existing RFC-0004 Execution Role and does not introduce Kernel data or a Domain Event.

### Known Limitations

- Only Builder and Reviewer Workflows exist after this Sprint; Documentation, Planner, and coordinated multi-role workflows remain deferred.
- The Reviewer Workflow uses the same configured adapter setting as the configured Developer and Builder Workflows, preserving Sprint 33 configuration scope and avoiding role-based adapter assignment.
- Workflow history remains session-only and non-durable.

### Validation Summary

- Targeted Sprint 36 validation passed: `npm test -- --run test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts test/hosts/vscode/host-mission-workflow.test.ts test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 291 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification remained unmodified and was included in repository-wide validation.
- No `src/kernel` or `src/adapters` file was modified for Sprint 36.

### Deviations

No architectural deviations.

---

## Sprint 35 — Builder Workflow Foundation

### Implemented Slice

Implemented the Milestone 6 Sprint 35 Builder Workflow Foundation vertical slice. This sprint adds a dedicated Builder Workflow Host command that reuses the certified Host Adapter Configuration, Host Mission Workflow, Execution Pipeline, and Adapter dispatch architecture without changing Kernel or Adapter behavior.

Implemented scope:

- Added `nexus.runBuilderMissionWorkflow` as an additive VS Code Host command.
- Registered the new command in `package.json` `activationEvents` and `contributes.commands` as **Nexus: Run Builder Workflow**.
- Composed the new command through `HostConfiguredMissionWorkflow`, reusing `HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId()` and the configured-adapter workflow map pattern.
- Constructed Builder Workflow `HostMissionWorkflow` instances with explicit `roleId: 'builder'`.
- Added Host-local Builder Workflow presentation metadata that labels successful Builder results/history with the assigned `Builder (builder)` Execution Role.
- Added deterministic tests for Builder command registration/success, input-cancellation failure, Builder result/history role labeling, package command metadata, and extension-host command discoverability.
- Updated README user guidance to describe the new Builder Workflow command alongside existing Developer Workflow commands.

Out of scope and not implemented:

- Reviewer Workflow, Planner Workflow, or any role-scoped workflow beyond Builder.
- Role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing, Adapter Selection Policy, or fallback routing.
- New Execution Model concepts, Kernel state changes, Kernel data, Domain Events, or Adapter contracts.
- Fourth production Adapter, Marketplace publication, or changes under `src/kernel` or `src/adapters`.

### RFC Coverage

Primary RFC:

- No Primary RFC — Host-layer additive command, reusing existing certified contracts.

Referenced RFCs:

- RFC-0004 — Execution Model (`builder` Execution Role consumed unmodified).
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- VS Code Host command contribution and activation for `nexus.runBuilderMissionWorkflow`.
- Host-local command registration delegating to existing configured-adapter Mission Workflow machinery.
- Explicit Host composition of Builder Workflow execution with `roleId: 'builder'`.
- Host presentation/result metadata for the assigned Builder Execution Role.

Deferred Concepts:

- Reviewer Workflow, Planner Workflow, and other role-scoped AI Engineering Workflows.
- Role-based adapter assignment, automatic routing, workflow chaining, and multi-agent coordination.
- Execution Model expansion, Execution Session behavior, review-gated progression, or new Kernel lifecycle semantics.
- Fourth production Adapter, Adapter Selection Policy, Marketplace publication, and Adapter capability scoring.
- Any `src/kernel` or `src/adapters` change.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-010`, `NEXUS-RAT-2026-07-14-005`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0035-builder-workflow-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A dedicated Builder Workflow command is Host-layer user interaction under RFC-0009 and does not create a new Kernel concept.
- Reusing `HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId()` for the Builder Workflow remains configuration resolution to one explicit `adapterId`, not Adapter Selection Policy.
- Surfacing the assigned Builder role in Host result/history presentation is Host-local metadata derived from the existing RFC-0004 Execution Role and does not introduce Kernel data or a Domain Event.

### Known Limitations

- Only the Builder Workflow command is introduced; Reviewer, Planner, and coordinated multi-role workflows remain deferred.
- The Builder Workflow uses the same configured adapter setting as the configured Developer Workflow, preserving Sprint 33 configuration scope and avoiding role-based adapter assignment.
- Workflow history remains session-only and non-durable.

### Validation Summary

- Targeted Sprint 35 validation passed: `npm test -- --run test/hosts/vscode/host-mission-workflow.test.ts test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 287 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification remained unmodified and was included in repository-wide validation.
- No `src/kernel` or `src/adapters` file was modified for Sprint 35.

### Deviations

No architectural deviations.

---

## Sprint 34 — Developer Workflow UX Consolidation

### Implemented Slice

Implemented the Milestone 6 Sprint 34 Developer Workflow UX Consolidation vertical slice. This sprint consolidates the user-facing Developer Workflow presentation around the Sprint 33 configured-adapter entry point without changing runtime dispatch, Host adapter resolution, Kernel behavior, or Adapter behavior.

Implemented scope:

- Updated `package.json` `contributes.commands` ordering and command presentation so `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` is the primary **Nexus: Run Developer Workflow** Command Palette entry.
- Updated the Mock, Gemini CLI, and Codex CLI Developer Workflow command labels to present them as explicit compatibility alternatives while preserving all command identifiers.
- Updated the `nexus.developerWorkflow.defaultAdapterId` configuration description to identify the configured-adapter command as the recommended default workflow.
- Updated `README.md` user guidance to describe `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` and `nexus.developerWorkflow.defaultAdapterId` as the recommended workflow path, with provider-specific commands documented as compatibility entry points.
- Added package metadata test coverage that asserts command ordering, configured-adapter primary presentation, and provider-specific compatibility labels.

Out of scope and not implemented:

- Removal, deprecation, renaming, aliasing, or merging of any existing command identifier.
- Any command dispatch-target change or Adapter resolution behavior change.
- Any change to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or command registration/dispatch logic.
- Any `src/kernel` or `src/adapters` change.
- Adapter Selection Policy, routing, capability scoring, automatic provider selection, or multi-adapter coordination.

### RFC Coverage

Primary RFC:

- No Primary RFC — documentation/presentation-only slice.

Referenced RFCs:

- RFC-0009 — Host Contract.

Implemented Concepts:

- VS Code command contribution metadata presentation for the configured-adapter Developer Workflow command.
- README/user-facing documentation for the configured-adapter workflow and default adapter configuration.
- Documentation-level test coverage for command metadata only.

Deferred Concepts:

- Removal, deprecation, renaming, or aliasing of any existing command identifier.
- Host Adapter Configuration resolution or dispatch logic changes.
- Adapter Selection Policy, routing, capability scoring, automatic provider selection, fallback, or multi-adapter coordination.
- Execution Model deepening, fourth production Adapter, authentication/credential management, and `SecretStorage` integration.
- Any `src/kernel` or `src/adapters` change.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-009`, `NEXUS-RAT-2026-07-14-007`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/implementation/sprints/sprint-0034-developer-workflow-ux-consolidation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Presenting `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the primary command is Command Palette/user-guidance metadata under RFC-0009 Host user interaction and does not alter Kernel engineering behavior.
- Provider-specific commands remain compatibility entry points because `NEXUS-RAT-2026-07-14-009` explicitly preserves them and defers deprecation/removal.

### Known Limitations

- Four Developer Workflow commands remain registered after this sprint; true command consolidation remains deferred to a future ratification.
- The sprint does not change session-only, non-durable workflow history behavior.
- The configured-adapter command continues to depend on the Sprint 33 Host configuration setting and registered Adapter identifiers.

### Validation Summary

- Targeted package metadata validation passed: `npm test -- --run test/hosts/vscode/package-command-metadata.test.ts`.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 59 files, 284 tests.
- Extension Host suite passed with `npm run test:extension-host`.
- Sprint 18 Kernel boundary certification remained unmodified and was included in repository-wide validation.
- No `src/kernel` or `src/adapters` file was modified for Sprint 34.

### Deviations

No architectural deviations.

---

## Sprint 33 — Adapter Configuration Foundation

### Implemented Slice

Implemented the Milestone 6 Sprint 33 Adapter Configuration Foundation vertical slice. This sprint adds a provider-neutral VS Code Host configuration surface for resolving an additive configured-adapter Developer Workflow command's default `adapterId`, while preserving the explicit Adapter dispatch contract and the existing Mock, Gemini CLI, and Codex CLI command paths.

Implemented scope:

- Added `nexus.developerWorkflow.defaultAdapterId` under `package.json` `contributes.configuration`, scoped to User/Workspace resource configuration with `mock-adapter` as the backward-compatible default.
- Added Host-local configuration resolution for the Developer Workflow default adapter identifier.
- Added `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as a separate additive Host command that resolves the configured identifier before delegating to a `HostMissionWorkflow` instance composed with an explicit `adapterId`.
- Preserved the certified `HostMissionWorkflow` execution pipeline from Adapter dispatch onward: Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge.
- Preserved the three existing Developer Workflow command identifiers and hardcoded dispatch targets: Mock, Gemini CLI, and Codex CLI remain independent of configuration.
- Restored the Milestone 6 governance wording, `NEXUS-RAT-2026-07-14-005`, and the Sprint 31 record to the previously approved "Multi-Provider Adapter Integration" wording per `NEXUS-RAT-2026-07-14-008`.
- Added deterministic unit coverage for configured default present, configured default absent, and configured default naming an unknown/unregistered adapter identifier.

Out of scope and not implemented:

- Adapter Selection Policy, automatic provider routing, capability scoring, provider fallback, or multi-adapter coordination.
- Kernel behavior changes or any `src/kernel` file modifications.
- Role-based adapter assignment, Execution Model deepening, Execution Session behavior, full RFC-0004 Execution State set, or review-gated execution progression.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, background execution, or multi-provider coordination.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- VS Code Host configuration contribution for a default Developer Workflow adapter identifier.
- Host-local resolution of that setting into a single explicit `adapterId`.
- Validation that configured adapter identifiers are registered with the Host before workflow invocation.
- Delegation from the additive configured-adapter Developer Workflow command to an explicit-adapter workflow instance.
- Deterministic configuration-resolution tests using Host test doubles only.

Deferred Concepts:

- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, and multi-adapter coordination.
- Role-based adapter assignment and multi-provider coordination.
- Execution Model deepening and Execution Session behavior.
- Authentication management and Nexus-managed credentials.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.
- Streaming responses and background execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-008`, `NEXUS-RAT-2026-07-14-007`, `NEXUS-RAT-2026-07-14-005`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0033-adapter-configuration-foundation.md`.
- `knowledge/implementation/sprints/sprint-0032-production-workflow-parity.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Resolving a User/Workspace configuration string to a registered adapter identifier is Host-local configuration behavior under RFC-0009, not Adapter Selection Policy.
- The additive configured-adapter command may delegate to the same explicit-adapter workflow construction pattern used by the frozen Sprint 25/30/32 commands, because the Kernel still receives exactly one explicit `adapterId`.
- An unknown configured adapter identifier should fail in the Host before invoking a workflow, preserving deterministic attribution and preventing configuration errors from masquerading as Kernel selection behavior.

### Known Limitations

- The configuration setting supplies only one explicit default adapter identifier; it does not rank, score, route, or fall back between providers.
- Automated validation uses deterministic Host and Adapter test doubles only, never live Gemini CLI or Codex CLI processes.
- Workflow history remains session-only and non-durable, preserving the Sprint 25 Host constraint.

### Validation Summary

- Targeted Sprint 33 remediation validation passed: 6 files, 15 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 58 files, 282 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification remains unmodified and was included in repository-wide validation.
- `src/kernel` remains unchanged for this sprint.

### Deviations

`NEXUS-REV-2026-07-14-007` identified two architectural deviations in the initial Sprint 33 implementation: the existing `nexus.runDeveloperMissionWorkflow` command had been made configuration-dependent, and previously approved Milestone 6 governance wording had been altered. `NEXUS-RAT-2026-07-14-008` authorized remediation only.

Remediation completed in this pass:

- Restored `nexus.runDeveloperMissionWorkflow` to hardcoded `mock-adapter` dispatch and moved configuration-dependent dispatch to the additive `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` command.
- Restored `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `NEXUS-RAT-2026-07-14-005`, and the Sprint 31 Implementation Record to "Multi-Provider Adapter Integration" wording.

No remaining architectural deviations are known after this remediation.

---

## Sprint 32 — Production Workflow Parity

### Implemented Slice

Implemented the Milestone 6 Sprint 32 Production Workflow Parity vertical slice. This sprint integrates the Sprint 31-certified `CodexCliAdapter` into the Developer Workflow through a third dedicated Host command, mirroring the Sprint 30 `GeminiCliAdapter` pattern while preserving the existing Mock and Gemini workflow commands.

Implemented scope:

- Added `nexus.runDeveloperMissionWorkflowWithCodexCli` as a third Developer Workflow Host command.
- Preserved `nexus.runDeveloperMissionWorkflow` and `nexus.runDeveloperMissionWorkflowWithGeminiCli` and their explicit adapter dispatch paths.
- Added the new command contribution and activation event in `package.json`.
- Registered `CodexCliAdapter` at the VS Code extension composition root alongside `MockAdapter` and `GeminiCliAdapter`.
- Composed a separate `HostMissionWorkflow` instance with explicit `adapterId: CODEX_CLI_ADAPTER_ID`.
- Reused the existing certified Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge workflow sequence without changing `HostMissionWorkflow` behavior.
- Added deterministic command-registration coverage and end-to-end Developer Workflow success/failure coverage using the Sprint 31 Codex CLI test-double.

Out of scope and not implemented:

- Adapter Selection Policy, provider routing, fallback, persisted adapter preferences, workspace/user adapter settings, or runtime provider ambiguity.
- Kernel behavior changes or any `src/kernel` file modifications.
- Execution Model deepening, Execution Session, full RFC-0004 Execution State set, or review-gated execution progression.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, background execution, or multi-provider coordination.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Dedicated Host command entry point for `CodexCliAdapter` Developer Workflow execution.
- VS Code command contribution and activation event for the Codex CLI workflow command.
- Extension composition-root registration of `CodexCliAdapter`.
- Explicit `adapterId` dispatch to `CODEX_CLI_ADAPTER_ID` through the existing Adapter Service dispatch contract.
- Deterministic Host command and workflow validation using the Sprint 31 Codex CLI test-double.

Deferred Concepts:

- Adapter Selection Policy, automatic routing, capability scoring, fallback, persisted preferences, and multi-adapter coordination.
- Execution Model deepening and Execution Session behavior.
- Authentication management and Nexus-managed credentials.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.
- Streaming responses, background execution, and multi-provider coordination.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-006`, `NEXUS-RAT-2026-07-14-005`, `NEXUS-RAT-2026-07-14-004`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/sprints/sprint-0030-developer-workflow-gemini-cli-integration.md`.
- `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0032-production-workflow-parity.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Multiple Host command entry points may target independently composed workflow instances as long as each dispatches through an explicit adapter identifier and the Kernel remains unaware of which command initiated execution.
- `CodexCliAdapter` remains certified by Sprint 31 and may be reused without changing its RFC-0008 Adapter behavior.
- The Sprint 30 `GeminiCliAdapter` Developer Workflow command pattern is the binding implementation precedent for Sprint 32 per `NEXUS-RAT-2026-07-14-006`.

### Known Limitations

- Developers must invoke the provider-specific command for the desired Adapter; no Adapter Selection or persisted provider preference exists.
- Automated validation uses only the deterministic Codex CLI test-double, never a live `codex` CLI.
- Workflow history remains session-only and non-durable, preserving the Sprint 25 Host constraint.

### Validation Summary

- Targeted Sprint 32 workflow validation passed: 4 files, 6 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 56 files, 275 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification passed unmodified.
- `git diff --stat -- src\kernel` is empty.

### Deviations

No architectural deviations.

---

## Sprint 31 — Codex CLI Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 6 Sprint 31 Codex CLI Adapter Runtime Integration vertical slice. This sprint introduces the second production Adapter implementation in isolation, alongside the certified `MockAdapter` and `GeminiCliAdapter`, without wiring it into Developer Workflow execution.

Implemented scope:

- Added `CodexCliAdapter` under `src/adapters/codex/`.
- Implemented RFC-0008 `Adapter` metadata and `execute(request): Promise<AdapterResponse>`.
- Translated `AdapterRequest` into a local `ProcessRequest` and invoked it only through constructor-injected `LocalProcessRuntimeContract`.
- Used Codex CLI's non-interactive execution shape, `codex exec "<Nexus Adapter prompt>"`, by default.
- Parsed successful Codex CLI JSON output into the existing `AdapterResponse` shape.
- Preserved process diagnostics from `LocalProcessRuntimeContract` for executable-not-found, non-zero exit, timeout, and startup/runtime failure paths.
- Added malformed-output, invalid-timeout, unsupported-role, and runtime-exception Adapter diagnostics.
- Added deterministic local test-double coverage and direct `AdapterService.dispatch` composition coverage with `MockAdapter`, `GeminiCliAdapter`, and `CodexCliAdapter` registered together.
- Updated `ADAPTER_RUNTIME_INSTRUCTIONS.md` as provider-neutral runtime guidance covering both Gemini CLI and Codex CLI manual verification.

Out of scope and not implemented:

- Developer Workflow integration or any Host command targeting `CodexCliAdapter`.
- Host orchestration changes, `HostMissionWorkflow` changes, or `extension.ts` dispatch-target changes.
- Any `src/kernel` changes.
- Adapter Selection, provider routing, provider preference, fallback, persisted Adapter-selection configuration, or multi-adapter execution policy.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, retries beyond existing runtime timeout behavior, or multi-provider coordination.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any third production Adapter.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial — second production implementation).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Production `Adapter` implementation for Codex CLI.
- Adapter metadata, declared capabilities, and supported roles using the existing Adapter Framework vocabulary.
- Adapter request translation to a local process invocation.
- Adapter response parsing and attribution-preserving execution metadata.
- Deterministic Adapter diagnostics for runtime and parsing failure modes.
- Composition-time registration through the existing `createKernelServices` `adapters` option, exercised only through explicit `adapterId` dispatch.

Deferred Concepts:

- Developer Workflow integration and any Host command targeting `CodexCliAdapter`.
- GitHub Copilot CLI, Claude CLI, or any third production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, persisted Adapter-selection configuration, and multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed credentials.
- Streaming responses, multi-provider coordination, and background provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-005`, `NEXUS-RAT-2026-07-14-002`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

### Architectural Assumptions

- Codex CLI request execution can be represented as a single local process invocation through the existing `LocalProcessRuntimeContract`.
- The Adapter can require JSON-only provider output because RFC-0008 defines Adapter Response shape, while provider-specific protocol details remain inside the Adapter boundary.
- The executable path and base arguments are runtime composition details, enabling deterministic local test-double execution without adding Adapter Selection or provider routing.
- Codex CLI uses `codex exec [PROMPT]` for non-interactive execution; the Adapter's injected runtime passes the prompt as a process argument, avoiding shell prompt-splitting behavior.

### Known Limitations

- `CodexCliAdapter` is not reachable from any VS Code command or Developer Workflow path in this sprint.
- Automated validation exercises only a deterministic local test-double executable, never the live Codex CLI.
- Manual Production Verification depends on a local Codex CLI installation and a usable pre-authenticated Codex account/session.
- In this environment, Codex CLI executable discovery succeeded (`C:\Users\NeilBusa\AppData\Roaming\npm\codex.ps1`, version `codex-cli 0.144.3`). Live request execution succeeded outside the repository using Codex CLI stdin mode with `--skip-git-repo-check`, `--ignore-rules`, `--ephemeral`, and `--output-last-message`; Codex returned the expected parseable JSON response contract.
- No retry, streaming, or multi-turn session support is implemented.

### Validation Summary

- Targeted Sprint 31 Vitest suite passed: 2 files, 7 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 54 files, 272 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- `git diff --stat -- src\kernel src\hosts src\extension.ts package.json` is empty.
- Manual Production Verification procedure is documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`; live execution evidence is recorded above.

### Deviations

No architectural deviations.

---

## Sprint 30 — Developer Workflow Integration of GeminiCliAdapter

### Implemented Slice

Implemented the Milestone 5 Sprint 30 Developer Workflow Integration of `GeminiCliAdapter` vertical slice. This sprint connects the certified Sprint 29 `GeminiCliAdapter` to the Developer Workflow through a second, dedicated Host command while preserving the existing `MockAdapter` workflow command as the deterministic baseline.

Implemented scope:

- Added `nexus.runDeveloperMissionWorkflowWithGeminiCli` as a second Host command.
- Preserved `nexus.runDeveloperMissionWorkflow` and its explicit `MOCK_ADAPTER_ID` dispatch path.
- Added the new command contribution and activation event in `package.json`.
- Registered `GeminiCliAdapter` at the extension composition root alongside `MockAdapter`.
- Composed a separate `HostMissionWorkflow` instance with explicit `adapterId: GEMINI_CLI_ADAPTER_ID`.
- Preserved the already-certified Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge workflow sequence unchanged.
- Added deterministic command-registration and end-to-end workflow coverage for success and failure paths using the Sprint 29 Gemini CLI test-double only.

Out of scope and not implemented:

- Adapter Selection Policy, provider routing, capability scoring, fallback, or multi-adapter coordination.
- Persisted adapter preferences, Workspace/User settings, or any Adapter-selection configuration subsystem.
- Authentication management, credential storage, OAuth, or `SecretStorage`.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, Codex CLI Adapter, or any second production Adapter.
- Streaming responses, multi-provider coordination, background execution, or retry behavior beyond existing runtime timeout behavior.
- Any `src/kernel` changes.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Multiple Host Developer Workflow command entry points.
- Explicit `adapterId` dispatch from a Host workflow call site.
- Extension composition of `MockAdapter` and `GeminiCliAdapter`.
- Deterministic CI-safe Gemini CLI workflow validation through the existing local test-double.

Deferred Concepts:

- Adapter Selection Policy, provider routing, provider preference, fallback, capability scoring, and multi-adapter execution.
- Persisted adapter preferences, Workspace/User settings, default adapter preferences, and configuration subsystem support.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed provider credentials.
- Additional production provider Adapters.
- Streaming responses, background execution, and multi-provider coordination.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-004`, `NEXUS-RAT-2026-07-14-003`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0030-developer-workflow-gemini-cli-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A second Host command is a Host entry point and does not constitute Adapter Selection Policy when the command constructs a workflow with an explicit `adapterId`.
- The Kernel remains unaware of which Host command initiated the workflow because the same `HostMissionWorkflow` contract and public Kernel services are reused.
- Automated Sprint 30 validation must use the existing deterministic Gemini CLI test-double, never a live Gemini CLI.

### Known Limitations

- The Gemini CLI Developer Workflow command depends on a locally authenticated Gemini CLI session in practical production use.
- Automated validation proves the command path with the deterministic test-double only.
- No persisted preference exists for choosing an Adapter; developers must explicitly invoke the Gemini CLI command.
- No retry, streaming, multi-turn conversation, or background workflow behavior is implemented.

### Validation Summary

- Targeted Sprint 30 Vitest suite passed: 2 files, 3 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 52 files, 265 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- `git diff --stat -- src\kernel src\adapters` is empty.

### Deviations

No architectural deviations.

---

## Sprint 29 — Gemini CLI Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 5 Sprint 29 Gemini CLI Adapter Runtime Integration vertical slice. This sprint introduces the first production Adapter implementation in isolation, alongside the certified `MockAdapter`, without wiring it into Developer Workflow execution.

Implemented scope:

- Added `GeminiCliAdapter` under `src/adapters/gemini/`.
- Implemented RFC-0008 `Adapter` metadata and `execute(request): Promise<AdapterResponse>`.
- Translated `AdapterRequest` into a local `ProcessRequest` and invoked it only through constructor-injected `LocalProcessRuntimeContract`.
- Parsed successful Gemini CLI JSON output into the existing `AdapterResponse` shape.
- Preserved process diagnostics from `LocalProcessRuntimeContract` for executable-not-found, non-zero exit, timeout, and startup/runtime failure paths.
- Added malformed-output, invalid-timeout, unsupported-role, and runtime-exception Adapter diagnostics.
- Added deterministic local test-double coverage and direct `AdapterService.dispatch` composition coverage with `MockAdapter` and `GeminiCliAdapter` registered together.
- Created `ADAPTER_RUNTIME_INSTRUCTIONS.md` as provider-neutral runtime execution guidance with a Manual Production Verification procedure.

Out of scope and not implemented:

- Developer Workflow integration or replacement of `MockAdapter`.
- Host orchestration changes, `HostMissionWorkflow` changes, or `extension.ts` dispatch-target changes.
- Any `src/kernel` changes.
- Adapter Selection, provider routing, provider preference, fallback, or multi-adapter execution policy.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, retries beyond existing runtime timeout behavior, or multi-provider coordination.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial — first production implementation).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Production `Adapter` implementation for Gemini CLI.
- Adapter metadata, declared capabilities, and supported roles using the existing Adapter Framework vocabulary.
- Adapter request translation to a local process invocation.
- Adapter response parsing and attribution-preserving execution metadata.
- Deterministic Adapter diagnostics for runtime and parsing failure modes.
- Composition-time registration through the existing `createKernelServices` `adapters` option, exercised only through explicit `adapterId` dispatch.

Deferred Concepts:

- Developer Workflow integration and replacement of `MockAdapter` in Host workflow execution.
- GitHub Copilot CLI, Claude CLI, Codex CLI, or any second production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, and multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed credentials.
- Streaming responses, multi-provider coordination, and background provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-003`, `NEXUS-RAT-2026-07-14-002`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

### Architectural Assumptions

- Gemini CLI request execution can be represented as a single local process invocation through the existing `LocalProcessRuntimeContract`.
- The Adapter can require JSON-only provider output because RFC-0008 defines Adapter Response shape, while provider-specific protocol details remain inside the Adapter boundary.
- The executable path and base arguments are runtime composition details, enabling deterministic local test-double execution without adding Adapter Selection or provider routing.

### Known Limitations

- `GeminiCliAdapter` is not reachable from any VS Code command or Developer Workflow path in this sprint.
- Automated validation exercises only a deterministic local test-double executable, never the live Gemini CLI.
- Manual Production Verification depends on a local Gemini CLI installation and a usable pre-authenticated Gemini account/session.
- In this environment, Gemini CLI executable discovery succeeded (`C:\Users\NeilBusa\AppData\Roaming\npm\gemini.ps1`, version `0.50.0`), but live request execution failed before provider response parsing because Gemini CLI returned `IneligibleTierError` / `UNSUPPORTED_CLIENT` for the local Gemini Code Assist account tier. A rerun with `--skip-trust` removed the workspace-trust blocker and confirmed the remaining blocker is provider-side eligibility, not Nexus automation.
- No retry, streaming, or multi-turn session support is implemented.

### Validation Summary

- Targeted Sprint 29 Vitest suite passed: 2 files, 7 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 50 files, 262 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- Manual Production Verification procedure is documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`; live execution evidence is recorded above.

### Deviations

No architectural deviations.

---

## Sprint 28 — VS Code Extension Installability

### Implemented Slice

Implemented the Milestone 5 Sprint 28 VS Code Extension Installability vertical slice. This sprint productizes the already-certified provider-independent Developer Workflow as an installable local VS Code extension and validates it inside a real Extension Host without extending Nexus architecture.

Implemented scope:

- Completed extension packaging metadata in `package.json`: command-scoped `activationEvents`, `icon`, `repository`, `license`, and `engines.vscode`.
- Added local VSIX packaging through `@vscode/vsce` and `npm run package`, producing `nexus-0.0.1.vsix`.
- Added `.vscodeignore` to exclude source, tests, generated Extension Host output, generated VSIX files, and development tooling from the packaged extension.
- Added `.vscode/launch.json` for manual Extension Development Host verification.
- Added `@vscode/test-electron` and a distinct `test:extension-host` target.
- Added Extension Host validation that installs the packaged VSIX through the VS Code CLI, activates the extension, verifies all six contributed commands, executes `nexus.runDeveloperMissionWorkflow` through the certified `MockAdapter`, and verifies Mission workflow history.
- Added a local extension icon at `assets/nexus-icon.png`.

Out of scope and not implemented:

- Production provider Adapters, live AI execution, Adapter Selection, provider routing, authentication, credential management, OAuth, `SecretStorage`, streaming responses, multi-provider coordination, Marketplace publication, release automation, or `COPILOT_INSTRUCTIONS.md` activation.
- Kernel, Adapter, or Host business-logic changes.
- New commands, capabilities, workflow steps, business rules, execution semantics, lifecycle transitions, or architectural ownership changes.

### RFC Coverage

Primary RFC:

- No Primary RFC — packaging/tooling and validation-only slice.

Referenced RFCs:

- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Local VSIX generation and installation validation.
- Extension activation validation inside a real VS Code Extension Host.
- Public command registration validation for the six existing Host entry points.
- Provider-independent Developer Workflow command execution validation through the certified `MockAdapter`.

Deferred Concepts:

- GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, or any production provider Adapter.
- Adapter Selection, provider routing, provider preference, fallback, and multi-provider execution.
- Authentication, credential management, OAuth, and `SecretStorage`.
- Streaming responses, background execution, workflow automation, release automation, Marketplace publication, and `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-001`, `NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-014`, `NEXUS-RAT-2026-07-13-010`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/sprints/sprint-0028-vs-code-extension-installability.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Extension Host validation may use command-scoped activation rather than eager activation because the existing public command surface is the authorized activation and execution boundary.
- The Extension Host test validates package installation before launching the development Extension Host test harness; this satisfies local installation validation without introducing Marketplace publication or release automation.
- The test runner may use `VSCODE_EXECUTABLE_PATH` when a local VS Code executable is available, preserving the same Extension Host validation semantics while avoiding external download fragility.

### Known Limitations

- Local VSIX generation and local installation are validated; Visual Studio Marketplace packaging, marketplace metadata validation, release automation, and publication remain deferred.
- Only the certified `MockAdapter` participates in Extension Host workflow execution.
- Cross-version VS Code compatibility testing is not introduced; validation uses the VS Code executable supplied by `@vscode/test-electron` or `VSCODE_EXECUTABLE_PATH`.

### Validation Summary

- TypeScript compile passed.
- ESLint passed.
- Existing Vitest suite passed: 48 files, 255 tests, with the Extension Host suite excluded from Vitest and run through its distinct target.
- esbuild passed.
- Repository validation passed after rerunning a transient local-process runtime timeout.
- Local VSIX packaging passed and produced `nexus-0.0.1.vsix`.
- Extension Host validation passed using `@vscode/test-electron` with a local VS Code executable: VSIX installation succeeded, activation completed, all six commands were registered, `nexus.runDeveloperMissionWorkflow` completed through `MockAdapter`, and workflow history was returned.

### Deviations

No architectural deviations.

---

## Sprint 27 — Developer Workflow Completion

### Implemented Slice

Implemented the Milestone 4 Sprint 27 Developer Workflow Completion vertical slice. This sprint completes the provider-independent Host Developer Workflow by extending the existing Mission/Task/Adapter flow through the authorized Evidence -> Review -> Knowledge completion sequence using only existing public Kernel service contracts.

Implemented scope:

- Extended `HostMissionWorkflow` to invoke `EvidenceService.registerEvidence()`, `ReviewService.startReview()`, `ReviewService.publishFinding()`, `ReviewService.finalizeReviewOutcome()`, and `KnowledgeService.captureKnowledge()` immediately after successful `MissionExecutionService.completeMission()`.
- Supplied deterministic Host command inputs for Evidence, Review, Finding, Review outcome, and Knowledge capture without adding Host-side Evidence validity, Review interpretation, or Knowledge eligibility rules.
- Called `KnowledgeService.captureKnowledge()` unconditionally after `finalizeReviewOutcome()`; Kernel-thrown rejection stops the workflow through the existing deterministic Kernel-rejection path.
- Presented Review Finding, Review outcome, Knowledge capture status, and captured Knowledge identity through the existing `HostPresentationSurface`.
- Extended session-only workflow history with Review outcome and Knowledge capture status while preserving the non-durable presentation-only constraint.
- Wired `EvidenceService`, `ReviewService`, and `KnowledgeService` into the VS Code Host composition root using the existing `resolveService` pattern.
- Added focused unit and integration coverage for the authorized call sequence, successful Knowledge capture, command history output, real Kernel service composition, and Knowledge rejection stop behavior.

Out of scope and not implemented:

- Live AI Providers, production Adapter integration, Adapter Selection, provider routing, or multi-provider coordination.
- Human review intervention, review retry workflows, or AI-generated review judgment.
- Streaming, background workflow execution, workflow automation, cancellation, or retries.
- Persistent workflow/execution/review/knowledge history, Evidence indexing, Knowledge conflict resolution, Mission browser, dashboards, or Shared Reality visualization.
- New Kernel capabilities, aggregates, repositories, business rules, lifecycle transitions, Domain Events, or direct Kernel/Adapter source changes.
- `COPILOT_INSTRUCTIONS.md` activation or consumption.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host-layer orchestration of the provider-independent Developer Workflow completion phase.
- Existing public Kernel service invocation for Evidence registration, Review lifecycle/finding/outcome, and Knowledge capture.
- Deterministic Host-supplied command data for the authorized completion workflow.
- Session-only Review outcome and Knowledge capture status presentation/history.
- Deterministic stop behavior on Kernel rejection during the completion phase.

Deferred Concepts:

- Production provider Adapters, Adapter Selection, provider routing, and live AI execution.
- Human review intervention, review retry workflows, and AI/human Review judgment generation.
- Persistent workflow, execution, review, and knowledge history.
- Evidence indexing, Knowledge conflict resolution, Policy Engine integration, and Shared Reality visualization.
- Streaming execution, background workflow execution, workflow automation, cancellation, and multi-provider coordination.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-13-014`, `NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-010`).
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0005-evidence-foundation.md`.
- `knowledge/implementation/sprints/sprint-0009-review-foundation.md`.
- `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md`.
- `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md`.
- `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Deterministic Review outcome input supplied by the Host is command data, not Host interpretation, consistent with `NEXUS-RAT-2026-07-13-014`.
- Knowledge eligibility remains exclusively enforced by `KnowledgeService.captureKnowledge()` and the Knowledge aggregate; the Host does not branch on Review outcome before invoking Knowledge capture.
- Session history remains non-authoritative Host presentation state because it is in-memory only and records minimal workflow outcome fields.
- Deterministic completion Evidence/Finding/Knowledge content is fixed workflow data and does not introduce new Review or Knowledge business rules.

### Known Limitations

- The workflow still supports exactly one Task per Mission.
- Only one deterministic Evidence item, Finding, Review outcome, and Knowledge capture path is exercised.
- Review outcome is a fixed Host-supplied command value, not human or AI-generated engineering judgment.
- Mission workflow history remains session-scoped and is discarded with the extension process.
- Kernel rejection recovery remains stop-and-present diagnostics only; retry and partial-completion recovery remain deferred.

### Validation Summary

- TypeScript compile passed.
- Focused Sprint 27 Vitest coverage passed: 3 files, 9 tests.
- ESLint passed.
- Full Vitest suite passed on rerun: 48 files, 255 tests. The first full `npm run validate` attempt hit a transient timeout in the frozen Sprint 21 local-process runtime integration test; that test passed immediately on targeted rerun and in the subsequent full suite.
- esbuild passed.
- `git diff --stat HEAD -- src\kernel src\adapters` is empty.

### Deviations

No architectural deviations.

---

## Sprint 26 — Developer Workflow Adapter Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 26 Developer Workflow Adapter Integration vertical slice. This sprint connects the Sprint 25 Host Mission workflow to the Sprint 20 certified Adapter execution pipeline through existing public Kernel services and the existing provider-independent `MockAdapter`.

Implemented scope:

- Extended `HostMissionWorkflow` to insert `ExecutionStrategyService.createExecutionStrategy`, `RoleService.assignRole`, `ExecutionStrategyService.evaluateAssignmentReadiness`, `RoleService.retrieveRole`, and `AdapterService.dispatch` between `startTask` and `completeTask`.
- Built Adapter requests from the Kernel readiness result and retrieved Role, using deterministic Mission/Task/Execution Strategy identity metadata.
- Completed Tasks only after a `Completed` Adapter response.
- Stopped deterministically on non-`Completed` Adapter responses, presented Adapter diagnostics, recorded the true last-known Mission status, and did not fabricate Task failure state.
- Wired VS Code Host composition to provide Role, Execution Strategy, and Adapter services plus explicit `mock-adapter` / `CodeModification` dispatch inputs.
- Extended session-only Mission workflow history with Adapter ID and dispatch status.
- Updated unit and integration tests for success sequencing, non-success Adapter handling, command registration, real Kernel composition with `MockAdapter`, and unchanged Sprint 20 pipeline behavior.

Out of scope and not implemented:

- Live AI provider integration or production provider Adapter behavior.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, load balancing, or multi-adapter execution.
- Background execution, workflow automation, retries, streaming, cancellation, or additional progress callbacks beyond existing markers.
- Persistent execution history, Knowledge integration, Shared Reality visualization, Mission browser, dashboards, or `COPILOT_INSTRUCTIONS.md`.
- New Kernel or Adapter business rules, states, lifecycle transitions, events, or source changes.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host-driven invocation of the certified execution pipeline using public Kernel services.
- Explicit provider-independent Adapter dispatch using `MockAdapter`.
- Adapter response-gated Task completion.
- Deterministic non-success Adapter stop behavior without fabricated Task failure state.
- Session-only Adapter dispatch outcome history.

Deferred Concepts:

- Production providers and live AI execution.
- Adapter Selection Policy and any routing/fallback/provider-preference behavior.
- Persistent execution history and broader workflow dashboards.
- Knowledge, Shared Reality, Review-domain, and Evidence workflow integration.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-011`, `NEXUS-RAT-2026-07-13-010`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Host may orchestrate the certified pipeline by invoking public Kernel services, but role assignment, readiness evaluation, dispatch authorization, and Adapter execution outcomes remain owned by Kernel/Adapter contracts.
- Explicit `mock-adapter` dispatch supplied by composition is not Adapter selection and remains consistent with `NEXUS-RAT-2026-07-13-011`.
- Session history remains non-authoritative Host presentation state because it is in-memory only and records only minimal workflow outcome fields.

### Known Limitations

- The workflow continues to support exactly one Task per Mission.
- Only `MockAdapter` participates; no production provider Adapter exists.
- Non-`Completed` Adapter responses stop the workflow with the Task left in the last Kernel-authored state because Task execution failure states remain deferred.
- Mission workflow history is discarded with the extension process.

### Validation Summary

- Targeted Sprint 26 validation passed: 4 files, 11 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files, 254 tests.
- `git diff --stat -- src\kernel src\adapters` is empty.
- Built-in search for `globalState|workspaceState|Memento` under `src\hosts` returned no matches.

### Deviations

No architectural deviations.

---

## Sprint 25 — Developer Workflow Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 25 Developer Workflow Foundation vertical slice. This sprint adds the first provider-independent Mission developer workflow inside the VS Code Host, sequencing the certified Mission/Planning/Execution golden path through public Kernel service contracts only.

Implemented scope:

- Added `HostMissionWorkflow` as a Host-layer orchestration component for the authorized eleven-call sequence: `createMission`, `createMissionPlan`, `planMission`, `addTask`, `updateTask` to `Ready`, `markMissionReady`, `startMission`, `startTask`, `completeTask`, `reviewMission`, and `completeMission`.
- Added `nexus.runDeveloperMissionWorkflow` with interactive input for Mission objective and one Task title/description.
- Added `nexus.showMissionWorkflowHistory` for the session-only in-memory Mission workflow history.
- Added Workspace Trust enforcement before the first Kernel call.
- Added deterministic cancellation handling before Kernel calls.
- Added deterministic progress, result, and failure presentation through the existing Host presentation surface.
- Added Kernel rejection handling that stops without retrying or continuing and records last-known Mission status when a Mission was created.
- Added unit and integration coverage for success, cancellation, Kernel rejection, trust gating, history shape, command registration, and real `createKernelServices` composition.

Out of scope and not implemented:

- Evidence, Shared Reality, Review-domain behavior, and Knowledge capture.
- Multiple Tasks per Mission, Task dependencies, Task Graph authoring, Mission editing, or Mission revision after the fixed single-task sequence.
- Persistent or cross-session Mission history, including `vscode.Memento`, `globalState`, or `workspaceState`.
- Live AI providers, Adapter dispatch, Adapter Selection Policy, provider protocol logic, workflow automation, background execution, retries, or scheduling.
- New Kernel domains, aggregates, business rules, states, or events.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host command registration for the Mission developer workflow.
- Host user interaction for Mission objective and single Task input.
- Host progress/result/error presentation for Mission workflow execution.
- Host Workspace Trust enforcement before Mission workflow Kernel calls.
- Session-only minimal Mission workflow history.
- Public Kernel service invocation only for Mission/Planning/Execution behavior.

Deferred Concepts:

- Evidence, Shared Reality, Review-domain, and Knowledge Host workflows.
- Multiple Task workflows and Task dependency authoring.
- Persistent Mission history.
- Adapter/provider execution and selection.
- Workflow automation and retry policies.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Host may thinly invoke existing public Kernel Mission service contracts without owning Mission business logic, consistent with Sprint 25's Critical Boundary and the Sprint 23/24 Host precedent.
- Generating Host-supplied identifiers for the authorized calls is implementation wiring; Mission identity validation and lifecycle legality remain owned by the Kernel.
- Session history is non-authoritative Host presentation state because it is in-memory only and contains only `{missionId, objective, finalStatus}`.

### Known Limitations

- The workflow supports exactly one Task per Mission.
- Mission workflow history is discarded with the extension process.
- The workflow stops at Mission completion; Evidence, Review-domain, Shared Reality, and Knowledge capture remain future work.
- No Adapter or live provider participates in this workflow.

### Validation Summary

- Targeted Sprint 25 validation passed: 3 files, 7 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files, 253 tests.
- `git diff --stat -- src/kernel src/adapters` is empty.
- `rg "globalState|workspaceState|Memento" src\hosts` returns no matches.

### Deviations

No architectural deviations.

---

## Sprint 24 — Host Runtime Completion

### Implemented Slice

Implemented the Milestone 4 Sprint 24 Host Runtime Completion vertical slice. This sprint completes the provider-independent Host runtime by adding interactive dispatch input, full Adapter response presentation with progress, and Workspace Trust enforcement before dispatch.

Implemented scope:

- Added `HostInputSurface` and VS Code-backed input prompts for command-palette dispatch invocation without a pre-built argument.
- Added deterministic cancellation handling for interactive input; cancellation emits a Host diagnostic and aborts without dispatch.
- Preserved Sprint 23's programmatic dispatch path for pre-built command arguments without prompting.
- Extended `HostPresentationSurface` with deterministic progress support and wired it to VS Code `window.withProgress`.
- Extended `HostIngressLayer.dispatchAdapterRequest` presentation to surface the full `AdapterResponseSnapshot`: `status`, `diagnostics`, `producedArtifacts`, `findings`, and sorted `executionMetadata`.
- Added `HostWorkspaceTrustSurface` and VS Code-backed `workspace.isTrusted` enforcement, gating dispatch only while leaving discovery and capability commands ungated.
- Added unit coverage for interactive input, cancellation, preserved programmatic dispatch, full response/progress presentation, and untrusted-workspace refusal before Adapter execution.

Out of scope and not implemented:

- Live AI provider integration, authentication, provider protocol translation, prompt execution, response parsing, or streaming.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, priority ordering, or load balancing.
- Persisted VS Code configuration for Adapter settings.
- Mission UI, Review UI, Knowledge UI, workflow visualization, broader Host Ingress Contract operations, or `COPILOT_INSTRUCTIONS.md`.
- Modifications to `src/kernel`, `src/adapters/mock`, `src/adapters/runtime`, `AdapterRequest`/`AdapterResponse` shape, `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, or Role Assignment.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host user interaction for Adapter dispatch input.
- Host structured presentation of Adapter responses.
- Host progress indication for Adapter dispatch.
- Host Workspace Trust enforcement before dispatch.
- Provider-independent preservation of explicit `adapterId` / fails-closed single-match dispatch.

Deferred Concepts:

- Live provider execution and provider protocol behavior.
- Adapter Selection Policy and routing/fallback behavior.
- Persisted Host configuration surface.
- Workflow UI and broader Mission/Review/Knowledge Host ingress.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Interactive input is Host-owned user interaction under RFC-0009 and does not change Adapter Request/Response contracts.
- Presenting Adapter response fields verbatim is Host presentation, not provider protocol interpretation.
- Workspace Trust is a Host security responsibility and gates dispatch because future Adapters may execute local processes.
- User-supplied `adapterId`/`requiredCapability` remains explicit dispatch input and does not introduce Adapter Selection Policy.

### Known Limitations

- Input is per-invocation only; no persisted VS Code configuration surface is introduced.
- Workspace Trust enforcement covers Adapter dispatch only in this sprint.
- The completed Host runtime still exercises only certified provider-independent Adapters; no production provider exists yet.

### Validation Summary

- Targeted Sprint 24 validation passed: 3 files, 10 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 246 tests.
- `git diff --stat -- src/kernel src/adapters/mock src/adapters/runtime` is empty.

### Deviations

No architectural deviations.

---

## Sprint 23 — Host Ingress Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 23 Host Ingress Foundation vertical slice. This sprint establishes the first VS Code Host entry point into the certified Kernel Adapter path without introducing live provider execution.

Implemented scope:

- Added Host command registration for Adapter discovery, Adapter dispatch, and Host capability declaration.
- Added `HostIngressLayer` as the Host-layer coordination component for invoking `AdapterService.enumerateAdapters` and `AdapterService.dispatch` through public Kernel service contracts only.
- Added deterministic Host capability declaration for RFC-0009 platform services: Command Registration, Notifications, Diagnostics, and User Interface.
- Added deterministic Adapter discovery presentation including Adapter metadata, Sprint 22 operational metadata, runtime diagnostics, and Host diagnostics.
- Added deterministic Adapter dispatch using explicit `adapterId` or fails-closed single-match lookup only.
- Wired the extension activation composition root to register the certified `MockAdapter`, present provider-independent operational metadata, and expose the new commands through `package.json`.
- Added unit and integration coverage for Host command registration, Host ingress behavior, metadata presentation, fails-closed dispatch, and the Host → Kernel → AdapterService → MockAdapter path.

Out of scope and not implemented:

- Live AI provider integration, authentication, provider protocol translation, prompt execution, response parsing, or streaming.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, priority ordering, or load balancing.
- Mission UI, Review UI, Knowledge UI, workflow visualization, or the broader Host Ingress Contract operations.
- `COPILOT_INSTRUCTIONS.md`.
- Modifications to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, Role Assignment, Kernel Canon, or RFCs.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host command registration.
- Host ingress routing.
- Host capability declaration.
- Adapter discovery through public Kernel service contracts.
- Deterministic Adapter dispatch through public Kernel service contracts.
- Host diagnostics and provider-independent output/notification presentation.
- Runtime operational metadata presentation.

Deferred Concepts:

- Live AI provider execution and provider protocol behavior.
- Adapter Selection Policy and routing/fallback behavior.
- Workflow UI and broader Mission/Review/Knowledge Host ingress.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `AdapterService` is the public Kernel service contract for Adapter discovery and dispatch.
- A Host-layer static operational metadata provider may present already-certified Sprint 22 metadata without making the Host an Adapter owner.
- Fails-closed single-match lookup is permitted only when exactly one registered Adapter matches; multiple matches require explicit `adapterId`.
- Registering the certified `MockAdapter` at the extension activation composition root is the provider-independent exercise path authorized by Sprint 23.

### Known Limitations

- The VS Code Host exercises only the certified deterministic `MockAdapter`; no production provider Adapter exists yet.
- Operational metadata presentation is provider-independent and static for the current Mock Adapter composition.
- The broader Host Ingress Contract operations remain deferred.

### Validation Summary

- Targeted Sprint 23 validation passed: 3 files, 6 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 242 tests.

### Deviations

No architectural deviations.

---

## Sprint 22 — Adapter Runtime Operational Metadata

### Implemented Slice

Implemented the Milestone 4 Sprint 22 Adapter Runtime Operational Metadata vertical slice. This sprint makes Adapter runtime state operationally self-describing before any live provider integration is introduced.

Implemented scope:

- Added immutable Adapter-layer metadata models outside `src/kernel`: `AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`, and `AdapterConfiguration`.
- Added `AdapterExecutableDiscovery` for short-lived executable/version detection through `LocalProcessRuntimeContract`.
- Extended `AdapterCapability` with technical capability values `CLI`, `Chat`, and `Completion`.
- Added unit coverage for immutable snapshots, deterministic diagnostics, configuration validation, secret-bearing setting rejection, invalid metadata rejection, and executable discovery outcomes.
- Preserved `AdapterRegistry` as the sole registry and left `AdapterLifecycle`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, and Role Assignment unchanged.

Out of scope and not implemented:

- Provider-prefixed types or a second runtime registry.
- GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI, or any live provider integration.
- Authentication, login, OAuth, tokens, credential storage, secrets, or account management.
- Provider execution, prompt submission, response parsing, streaming, protocol translation, retries, routing, fallback, prioritization, Adapter Selection Policy, Host integration, or `COPILOT_INSTRUCTIONS.md`.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Adapter runtime installation status.
- Adapter runtime health status.
- Runtime diagnostics with deterministic attribution.
- Adapter runtime configuration metadata without authentication or secrets.
- Executable/version discovery helper for concrete Adapter instances.
- Additive technical Adapter capability values.

Deferred Concepts:

- All production provider integrations and provider execution behavior.
- Authentication, credentials, tokens, account management, and secrets.
- Adapter Selection Policy, routing, fallback, prioritization, and provider selection.
- Host/VS Code integration.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Operational metadata is Adapter-layer tooling, not new RFC-0008 Contract vocabulary.
- `AdapterExecutableDiscovery` may use `LocalProcessRuntimeContract` for short-lived version probes while process execution remains owned by the runtime.
- `AdapterConfiguration` may describe paths, environment metadata, and runtime settings, but must reject secret-bearing configuration keys.
- The authorized additive `AdapterCapability` extension is limited to technical capability values and does not redefine Engineering Roles.

### Known Limitations

- The metadata models describe runtime readiness only; they do not prove future provider execution correctness.
- No production Adapter consumes the metadata yet.
- Executable discovery detects version output and process status; it does not parse provider protocols or perform work execution.

### Validation Summary

- Targeted Sprint 22 validation passed: 2 files, 11 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 42 files, 236 tests.

### Deviations

No architectural deviations.

---

## Sprint 21 — Local Process Runtime Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 21 Local Process Runtime Foundation vertical slice. This sprint adds provider-agnostic local process execution infrastructure beneath the Adapter layer, outside `src/kernel`, without introducing any production provider integration.

Implemented scope:

- Added `src/adapters/runtime/local-process-runtime.ts`.
- Added `LocalProcessRuntimeContract` so Adapters consume a runtime abstraction rather than operating-system process APIs.
- Added immutable runtime value objects: `ProcessRequest`, `ProcessExecutionOptions`, `ProcessResult`, `ProcessExitStatus`, and `ProcessDiagnostics`.
- Added explicit runtime errors for invalid request and result definitions.
- Implemented process launch, stdout/stderr capture, exit status, execution duration, timeout termination, cancellation termination, and deterministic diagnostics.
- Added unit tests for value-object validation, successful execution, non-zero exit, executable-not-found, startup failure, timeout, cancellation, and abnormal termination.
- Added an Adapter-layer integration proof using a separate test-only Adapter that consumes `LocalProcessRuntime`; `MockAdapter` remains unchanged.

Out of scope and not implemented:

- GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, OpenAI, Azure OpenAI, or any production provider integration.
- Authentication, login management, credential storage, provider configuration, provider discovery, provider capability negotiation.
- Parallel execution, process pools, retries, fallback execution, scheduling, prioritization, Adapter Selection Policy, routing, capability scoring, provider preference, fallback selection, or load balancing.
- CLI/response interpretation, markdown interpretation, JSON payload semantics, provider protocol validation, prompt interpretation, and `COPILOT_INSTRUCTIONS.md`.
- Kernel architectural changes, Kernel imports of runtime code, Adapter Contract changes, Execution Strategy changes, Role Assignment changes, Domain Events, repositories, or `MockAdapter` modifications.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Provider-agnostic process execution infrastructure beneath Adapters.
- Immutable process request, execution options, process result, exit status, and diagnostics value objects.
- Deterministic process lifecycle handling: launch, output capture, exit status, timeout, cancellation, and diagnostics.
- Adapter-layer integration proof without changing the Kernel or `MockAdapter`.

Deferred Concepts:

- All production provider integrations and provider runtime features.
- Process orchestration, retries, scheduling, fallback execution, and process pools.
- Adapter Selection Policy / routing / prioritization.
- CLI interpretation and provider protocol semantics.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `LocalProcessRuntime` is Adapter-layer infrastructure, not a Kernel capability, and therefore belongs under `src/adapters/runtime/`.
- Adapters consume `LocalProcessRuntimeContract`; operating-system process management remains encapsulated inside the concrete runtime implementation.
- Runtime diagnostics are process-execution diagnostics; provider-specific interpretation remains the responsibility of future provider Adapters.
- A test-only Adapter is sufficient to prove Adapter-layer integration while preserving `MockAdapter`'s approved in-process behavior.

### Known Limitations

- The runtime executes only local processes and does not implement remote or distributed execution.
- Timeout and cancellation terminate the spawned process; no process-tree management, retry, or cleanup orchestration is introduced.
- The runtime does not parse or interpret CLI responses.
- No production Adapter consumes the runtime yet.

### Validation Summary

- Targeted Sprint 21 validation passed: 3 files, 12 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 41 files, 232 tests.

### Deviations

No architectural deviations.

---

## Sprint 20 — Execution Pipeline Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 20 Execution Pipeline Integration vertical slice. This sprint certifies the complete execution pipeline using existing public Kernel service contracts and the deterministic Mock Adapter from Sprint 19.

Implemented scope:

- Added `test/integration/execution-pipeline-integration.integration.test.ts`.
- Certified Task readiness through `ExecutionStrategyService.evaluateAssignmentReadiness`.
- Certified Role Assignment integration and Role resolution through the existing `RoleService`.
- Certified Adapter Registry lookup and explicit Mock Adapter dispatch through `AdapterService`.
- Certified successful `AdapterResponse` handling, deterministic Mock Adapter execution failure handling, attribution metadata, and diagnostics.
- Reused existing diagnostics for missing Role Assignment, missing Adapter, and unsupported Adapter capability.

Out of scope and not implemented:

- Production provider integrations, process execution, authentication, network communication, streaming, retry/timeout policies, telemetry, metrics, observability, VS Code Host integration, and `COPILOT_INSTRUCTIONS.md`.
- Adapter selection, routing, prioritization, capability scoring, provider preference, fallback adapters, or any automatic selection policy.
- New Execution State, Execution Session, RoleAssignment business rules, MissionPlan/Task lifecycle changes, aggregates, repositories, Domain Events, or production Adapter implementations.
- A new `ExecutionStrategyService` coordination method; public-service composition was sufficient to express the authorized pipeline.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model.

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Complete execution pipeline integration through public service contracts.
- Execution Strategy readiness evaluation as advisory/evaluative coordination.
- Role Assignment resolution without modifying the Sprint 8 model.
- Explicit Adapter dispatch through the existing Adapter Registry and Mock Adapter.
- Successful and failed execution-result handling using the existing `AdapterResponse` contract.
- Deterministic pipeline diagnostics.

Deferred Concepts:

- Production provider integrations and runtime infrastructure.
- Adapter Selection Policy / routing / prioritization.
- Full RFC-0004 Execution State set, Execution Session, and Review-gated execution progression.
- Host integration, Builder Runtime, and live provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0010-execution-strategy.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Public-service composition is the correct Sprint 20 implementation because existing `RoleService`, `ExecutionStrategyService`, and `AdapterService` contracts already express the authorized pipeline.
- Explicit `adapterId` dispatch satisfies the Sprint 20 Critical Guardrail without introducing Adapter selection policy.
- A test-only limited-capability Adapter used to exercise an existing unsupported-capability diagnostic does not introduce a production Adapter or new runtime capability.

### Known Limitations

- The certified pipeline executes only against deterministic in-process Adapter behavior.
- Adapter Registry and dispatch remain in-memory and process-local.
- Context Package handling remains reference-only.
- Execution Strategy remains advisory/evaluative and does not gate `MissionExecutionService`.

### Validation Summary

- Targeted Sprint 20 validation passed: 1 file, 3 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 38 files, 220 tests.

### Deviations

No architectural deviations.

---

## Sprint 19 — Mock Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 19 Mock Adapter Runtime Integration vertical slice. This sprint introduces the first concrete Adapter implementation while preserving the RFC-0008 Adapter Contract and RFC-0010 Kernel boundaries.

Implemented scope:

- Added `src/adapters/mock/mock-adapter.ts`.
- Implemented `MockAdapter` as a deterministic, stateless, in-process Adapter implementation.
- Declared static Adapter capabilities using the existing Adapter Framework vocabulary.
- Added deterministic request handling and immutable `AdapterResponse` generation with diagnostics and attribution metadata.
- Added composition-time Adapter registration through `createKernelServices` using Adapter contracts, without introducing a Kernel dependency on concrete Adapter implementations.
- Added Adapter discovery through `AdapterService.enumerateAdapters`.
- Added unit and integration tests covering Mock Adapter metadata, deterministic responses, failure diagnostics, registry discovery, and runtime dispatch through Kernel service composition.

Out of scope and not implemented:

- GitHub Copilot, Claude, Gemini, Codex, OpenAI, or any production provider integration.
- Process execution, CLI invocation, network communication, authentication, streaming, retry policies, timeout policies, resource management, telemetry, metrics, or observability.
- Adapter lifecycle management beyond the existing value object, dynamic capability negotiation, multi-adapter routing, adapter prioritization, load balancing, or fallback adapters.
- Event subscribers/consumers, Shared Reality expansion, Review Engine enhancements, Knowledge enhancements, Context Package production/consumption beyond the existing reference-only field, VS Code Host integration, new aggregates, repositories, business rules, lifecycle transitions, or Domain Events outside the Adapter domain.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract.

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Mock Adapter contract implementation.
- Adapter registration with the existing `AdapterRegistry`.
- Adapter discovery through `AdapterService`.
- Static Adapter capability declaration.
- Deterministic Adapter request handling.
- Immutable Adapter response generation.
- Deterministic Adapter diagnostics.
- Runtime dispatch through `AdapterService.dispatch` and Kernel service composition.

Deferred Concepts:

- Production provider integrations.
- Runtime features including process execution, authentication, retry logic, streaming responses, timeout policies, resource management, telemetry, metrics, and observability.
- Adapter evolution features including dynamic capability negotiation, multi-adapter routing, prioritization, load balancing, fallback adapters, and lifecycle management beyond the existing value object.
- Host integration, event subscribers/consumers, and Context Package production/consumption beyond the existing reference-only field.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A concrete Adapter implementation belongs outside `src/kernel`; Kernel composition may receive Adapter contract implementations without importing concrete Adapter implementation modules.
- The Mock Adapter validates runtime integration through deterministic simulation only and does not establish production provider behavior.
- Context Package handling remains the existing Sprint 7 reference-only field.

### Known Limitations

- The Mock Adapter is an in-process simulation and does not execute external tools or contact AI providers.
- Adapter registration remains in-memory and process-local.
- Failure diagnostics are deterministic Adapter responses for Mock Adapter-owned request handling failures; existing registry and service diagnostics remain responsible for missing adapters, duplicate registration, unsupported capabilities, and incompatible protocol versions.

### Validation Summary

- Targeted Sprint 19 validation passed: 4 files, 9 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 37 files, 217 tests.

### Deviations

No architectural deviations.

---

## Sprint 18 — RFC-0010 Kernel Boundary Certification

### Implemented Slice

Implemented the Milestone 3 Sprint 18 RFC-0010 Kernel Boundary Certification validation-only slice. This sprint certifies architectural boundary conformance for the composed Kernel baseline implemented through Sprints 1–17; it introduces no new normative concepts, production capabilities, runtime behavior, lifecycle semantics, repositories, aggregate responsibilities, or Domain Events.

Implemented scope:

- Added `test/integration/kernel-boundary-certification.integration.test.ts`.
- Certified `createKernelServices` composes every currently implemented Kernel bounded-context service and initializes them through the Kernel lifecycle.
- Certified successful composed-Kernel behavior through public service contracts across Mission, Mission Planning, Task execution, Evidence, Shared Reality projection, Review, Knowledge, Role assignment, Execution Strategy readiness, Domain Event publication, repository coordination, and dependency injection.
- Certified deterministic rejection of invalid cross-boundary interactions: cross-Mission Execution Strategy evaluation, missing Adapter dispatch targets, and mismatched Domain Event Mission attribution.
- Certified rejected boundary interactions publish no unintended Domain Events and preserve observable repository state.
- Certified Kernel source dependency boundaries with a static integration assertion that `src/kernel` source files do not import outside `src/kernel`.

Out of scope and not implemented:

- Event subscribers, event handlers, event orchestration, and event consumers.
- Adapter runtime implementations, Mock Adapter, AI provider integrations, and VS Code host integration.
- Workflow automation, Context Package, Policy Engine, Durable Event Streams, persistent infrastructure, new aggregates, new repositories, new business rules, new lifecycle transitions, new Domain Events, RFC amendments, or Kernel Canon amendments.

### RFC Coverage

Primary RFC:

- RFC-0010 — Kernel Boundaries.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0003 — Shared Reality Projection Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.
- RFC-0008 — Kernel Adapter Contract (contract validation only).
- RFC-0009 — Host Contract (boundary validation only).

Implemented Concepts:

- RFC-0010 boundary certification for currently implemented Kernel bounded contexts.
- Successful composed-Kernel public-contract validation.
- Deterministic boundary-violation rejection with no unintended EventBus or repository side effects.
- Kernel source dependency boundary validation.

Deferred Concepts:

- Event subscribers, event handlers, event orchestration, and event consumers.
- Adapter implementations, Mock Adapter, AI provider integrations, VS Code host integration, workflow automation, Context Package, Policy Engine, Durable Event Streams, and persistent infrastructure.
- New aggregates, repositories, business rules, lifecycle transitions, Domain Events, RFC amendments, and Kernel Canon amendments.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0018-rfc-0010-kernel-boundary-certification.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 18 certifies existing approved behavior only; it does not expand RFC semantics or introduce new enforcement mechanisms.
- Repository contracts and the Kernel-owned EventBus are approved public contracts for validating composed behavior and rejected side effects.
- Static dependency validation is limited to currently implemented Kernel TypeScript source files.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- Certification is limited to currently implemented bounded contexts and does not certify deferred runtime capabilities.
- No event consumer is introduced; tests observe the EventBus and public repository-backed service results directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 18 boundary certification tests passed: 1 file, 4 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 35 files, 212 tests.

### Deviations

No architectural deviations.

---

## Sprint 17 — Cross-Domain Failure-Path Integration Validation

### Implemented Slice

Implemented the Milestone 3 Sprint 17 failure-path integration-validation slice. This sprint validates previously implemented Kernel bounded contexts using the actual composed services from `createKernelServices`; it introduces no new normative concepts.

Implemented scope:

- Added `test/integration/kernel-failure-paths.integration.test.ts`.
- Exercised all eight authorized rejection scenarios through `Kernel` + `createKernelServices` and public service contracts.
- Validated deterministic rejection for Task dependency violation, premature Mission completion, duplicate MissionPlan registration, duplicate Review registration, invalid Knowledge capture, missing Evidence, invalid Review completion, and terminal Mission planning.
- Validated side-effect behavior: rejected operations do not publish unintended Domain Events and preserve observable aggregate/repository state.
- Validated subsequent valid operations continue to succeed after each rejection path.
- Remediated `NEXUS-REV-2026-07-13-015-F-001` per `NEXUS-RAT-2026-07-13-009`: restored the Sprint 9 `ReviewService` orchestration-only baseline and replaced Scenario 4 with duplicate Review registration, an already-approved Review repository rejection path.

Out of scope and not implemented:

- New bounded contexts, provider integrations, adapter runtimes, VS Code host integration, Context Package, Policy Engine, durable Event Streams, event subscriptions, persistent storage, production infrastructure, observability/telemetry, retry policies, or distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the eight authorized scenarios.

### RFC Coverage

Primary RFC:

- None. Sprint 17 introduces no new normative concepts.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.

Implemented Concepts:

- Cross-domain failure-path integration validation.
- Side-effect verification for rejected operations.
- Public-contract validation through composed Kernel services.
- Duplicate Review registration rejection through approved Sprint 9 Review repository behavior.

Deferred Concepts:

- AI Providers, Adapter runtime implementations, VS Code host integration.
- Context Package and Policy Engine.
- Durable Event Streams and event subscriptions.
- Persistent storage, production infrastructure, observability/telemetry, retry policies, and distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the authorized eight scenarios.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/interface-contracts/review-service-contract.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-009.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 17 validates rejection behavior and approved contracts only; it does not expand RFC semantics.
- `ReviewService` remains orchestration-only and has no Mission repository dependency or Mission lifecycle precondition.
- Scenario 4's replacement exercises only approved Sprint 9 Review-domain behavior.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- Failure-path coverage is limited to the eight authorized scenarios.
- No event consumer is introduced; tests observe the EventBus directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 17 integration and related regression tests passed: 3 files, 14 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 34 files, 208 tests.

### Deviations

Initial Sprint 17 delivery introduced an unauthorized Mission-Completed precondition on `ReviewService.startReview` (`NEXUS-REV-2026-07-13-015-F-001`), exceeding the sprint's validation-only scope and creating a Critical Architectural Violation. That deviation was corrected within Sprint 17 per `NEXUS-RAT-2026-07-13-009` by restoring the Sprint 9 `ReviewService` baseline and replacing Scenario 4 with duplicate Review registration; the correction was verified by `NEXUS-REV-2026-07-13-016`.

---

## Sprint 16 — End-to-End Mission Workflow Integration Validation

### Implemented Slice

Implemented the Milestone 3 Sprint 16 integration-validation slice. This sprint validates previously implemented Kernel bounded contexts using the actual composed services from `createKernelServices`; it introduces no new normative concepts.

Implemented scope:

- Added an end-to-end integration test in `test/integration/kernel-mission-workflow.integration.test.ts`.
- Exercised the composed Kernel through `Kernel` service-factory wiring and the Kernel-owned `EventBusContract`.
- Validated the complete public-contract workflow: Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge.
- Validated shared repository coordination across `MissionService`, `MissionPlanningService`, `MissionExecutionService`, `ProjectionService`, `ReviewService`, `EvidenceService`, and `KnowledgeService`.
- Validated Domain Event ordering across the participating implemented domains.
- Validated Knowledge capture preconditions against real composed state: completed Mission, accepted completed Review, and stored supporting Evidence.
- Corrected an integration-discovered RFC-0005 defect in Review event publication: `ReviewCompleted` and outcome-specific `ReviewAccepted`/`ReviewRejected` events now use distinct Domain Event identities.

Out of scope and not implemented:

- New bounded contexts, provider integrations, adapter runtimes, VS Code host integration, workflow automation, durable Event Streams, event subscriptions, persistent storage, Context Package, Policy Engine, or production infrastructure.
- Exhaustive failure-path integration coverage beyond the authorized happy-path workflow.

### RFC Coverage

Primary RFC:

- None. Sprint 16 introduces no new normative concepts.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0003 — Shared Reality Projection Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.

Implemented Concepts:

- End-to-end composed service validation.
- Dependency-injection and shared EventBus validation.
- Shared repository interaction validation.
- Aggregate interaction validation through public service contracts.
- Domain Event ordering and event identity validation.
- Cross-domain Knowledge capture invariant validation.

Deferred Concepts:

- Claude CLI integration, GitHub Copilot integration, Gemini integration, Codex integration.
- Provider implementations and Adapter runtime implementations.
- VS Code host integration.
- Workflow engine, automatic sprint generation, and automatic governance orchestration.
- Context Package and Policy Engine.
- Durable Event Streams and event subscriptions.
- Persistent storage, production infrastructure, distributed execution, and background processing.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/implementation/milestone-2-completion-report.md`.
- `knowledge/implementation/repository-readiness-assessment.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 16 validates composition and approved behavior only; it does not expand RFC semantics.
- `ProjectionService` remains active-Mission scoped, so Shared Reality projection is exercised before Mission completion.
- Review remains a separate implemented assessment aggregate; Sprint 16 validates Knowledge capture after a completed accepted Review without adding review-gated Mission completion behavior.
- The Review event identity correction is an implementation defect fix under RFC-0005's existing requirement that every Domain Event has a globally unique immutable identity.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- The integration test validates one happy-path workflow, not exhaustive cross-domain failure paths.
- No event consumer is introduced; the test observes the EventBus directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 16 and Review event identity tests passed: 3 files, 15 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 33 files, 200 tests.

### Deviations

No architectural deviations.

---

## Sprint 15 — Mission Plan & Task Event Publication

### Implemented Slice

Implemented the RFC-0005/RFC-0001 Mission Plan & Task Event Publication vertical slice authorized by NEXUS-RAT-2026-07-13-006.

Implemented scope:

- `MissionPlanCreated`, `MissionPlanRevised`, and `TaskCreated` event definitions and factories in `mission-planning.events.ts`.
- `TaskStarted`, `TaskCompleted`, and `TaskCancelled` event definitions and factories in `mission-execution.events.ts`.
- `MissionPlan` and `Task` aggregate recorded-events collections with drain-once `pullDomainEvents()`.
- `MissionPlanningService` optional constructor-injected `EventBusContract` and post-persistence publication for `createMissionPlan`, `addTask`, and `reviseMissionPlan`.
- `MissionExecutionService` post-persistence publication for existing `startTask`, `completeTask`, and `cancelTask` operations using its existing required `EventBusContract`.
- Kernel service composition wiring so `MissionPlanningService` receives the shared Kernel EventBus.
- Reference-document corrections to `knowledge/reference/kernel-state-machine.md` and `knowledge/reference/kernel-event-catalog.md` per NEXUS-RAT-2026-07-13-006.

Out of scope and not implemented:

- `MissionPlanActivated` publication or MissionPlan status/activation lifecycle.
- `TaskReady`, `TaskAssigned`, and `TaskBlocked` publication.
- `updateTask` / `removeTask` event publication.
- Event subscriptions, consumers, handlers, or event-driven Mission Plan/Task behavior.
- Knowledge, Shared Reality, Context Package, Policy, or durable Event Stream implementation.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0001 — Mission Model (Referenced; existing MissionPlan and Task lifecycle operations only).

Ratification:

- NEXUS-RAT-2026-07-13-006 — authorizes Mission Plan/Task event producer reattribution to `MissionPlanningService` and `MissionExecutionService`, Task Lifecycle reference reconciliation, and Mission Plan/Task catalog duplicate removal while preserving Sprint 3/4 frozen behavior.

Implemented Concepts:

- Mission Plan event factories and aggregate recorded-events publication.
- Task event factories and aggregate recorded-events publication.
- Save-then-publish service orchestration for exactly six authorized events.
- EventBus injection for MissionPlanningService.
- Reference-document producer and lifecycle reconciliation.

Deferred Concepts:

- `MissionPlanActivated`.
- `TaskReady`, `TaskAssigned`, and `TaskBlocked`.
- `TaskUpdated` / `TaskRemoved`-equivalent events.
- Event subscriptions and consumers.
- Knowledge, Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-006.
- `knowledge/implementation/sprints/sprint-0015-mission-plan-task-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Mission Plan and Task events are notifications of already-completed, successfully persisted state transitions.
- `MissionPlanningService.updateTask` and `.removeTask` remain event-silent because no ratified canonical event name exists for those operations.
- Task lifecycle reference documentation follows the frozen implementation `TaskStatus` vocabulary (`Planned`, `Ready`, `InProgress`, `Completed`, `Cancelled`) without modifying the `TaskStatus` enum or transition rules.
- Save-then-publish follows the established Mission/Evidence/Review/Knowledge pattern and remains service orchestration rather than aggregate persistence behavior.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted MissionPlan/Task state ahead of the process-local event stream.
- No event consumers are added; published MissionPlan/Task events do not trigger domain behavior.
- `MissionPlanActivated` remains unpublishable because no MissionPlan activation operation exists.
- `updateTask` and `removeTask` remain event-silent pending future ratification.

### Test Summary

- Targeted Sprint 15 Mission tests passed: 4 files, 39 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 199 tests.

### Deviations

No architectural deviations.

---

## Sprint 14 — Knowledge Lifecycle Advancement

### Implemented Slice

Implemented the RFC-0005/RFC-0007 Knowledge Lifecycle Advancement vertical slice authorized by NEXUS-RAT-2026-07-13-005.

Implemented scope:

- `KnowledgeService.approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge`.
- Minimal `{ knowledgeId }` lifecycle request shape on `KnowledgeServiceContract`.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` event factories.
- Save-then-publish service orchestration for all four lifecycle-advancement events.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-005.

Out of scope and not implemented:

- Successor-reference modeling for superseded Knowledge.
- Authorization, policy evaluation, governance workflow, or approval automation.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Context Assembly consumption of Knowledge.
- Durable Event Streams.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0007 — Knowledge Model (Referenced; existing Memory Lifecycle exercised without semantic change).

Ratification:

- NEXUS-RAT-2026-07-13-005 — authorizes the four Knowledge lifecycle-advancement service operations and corresponding Domain Events, while preserving existing aggregate lifecycle rules and deferring successor modeling, authorization/policy enforcement, and event consumers.

Implemented Concepts:

- Knowledge lifecycle-advancement service operations.
- Knowledge lifecycle Domain Event factories.
- KnowledgeService lifecycle EventBus publication after successful persistence.

Deferred Concepts:

- Successor-reference modeling.
- Authorization, policy, and governance workflow enforcement.
- Event subscriptions and consumers.
- Context Assembly consumption.
- Mission Plan Events, Task Events, Execution Strategy Events, Shared Reality Events, Context Package Events, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/reference/interface-contracts/knowledge-service-contract.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entries NEXUS-RAT-2026-07-13-003, NEXUS-RAT-2026-07-13-004, and NEXUS-RAT-2026-07-13-005.
- `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `KnowledgeService` remains thin orchestration; lifecycle legality remains owned by the `Knowledge` aggregate.
- Lifecycle aggregate methods remain parameterless and unmodified per the Sprint Governance Constraint; lifecycle event factories are invoked by `KnowledgeService` only after successful persistence.
- Knowledge lifecycle events are notifications of already-completed, successfully persisted state transitions.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted Knowledge state ahead of the process-local event stream.
- No successor-reference link exists between a superseded Knowledge item and any replacement.
- No event consumers are added; published Knowledge lifecycle events do not trigger domain behavior.
- No authorization or policy enforcement gates who may call lifecycle-advancement operations.

### Test Summary

- Targeted Sprint 14 Knowledge lifecycle tests passed: 2 files, 23 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 192 tests.

### Deviations

No architectural deviations.

---

## Sprint 13 — Knowledge Event Publication

### Implemented Slice

Implemented the RFC-0005 Knowledge Event Publication vertical slice authorized by NEXUS-RAT-2026-07-13-004.

Implemented scope:

- `KnowledgeCandidateCreated` event publication for completed `captureKnowledge` transitions.
- `KnowledgeRevisionCreated` event publication for completed `reviseKnowledge` transitions.
- `knowledge.events.ts` with Knowledge event type definitions and RFC-0005 envelope-compliant event factories.
- `Knowledge` aggregate recorded-event support through drain-once `pullDomainEvents()`.
- `KnowledgeService` optional constructor-injected `EventBusContract` with deterministic unavailable-publisher diagnostics.
- Save-then-publish service orchestration for Knowledge events; persistence failure prevents publication.
- Kernel service composition updated so `KnowledgeService` receives the shared Kernel-owned EventBus.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-004.

Out of scope and not implemented:

- `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge` service operations.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` publication.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Durable Event Streams.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0007 — Knowledge Model (Referenced; event trigger only).

Ratification:

- NEXUS-RAT-2026-07-13-004 — ratifies `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` for Sprint 13, defers lifecycle-advancement operations and events, and establishes that Domain Events represent completed domain facts rather than implementation actions.

Implemented Concepts:

- Knowledge Domain Event factories.
- Knowledge aggregate recorded-events collection and drain-once access.
- KnowledgeService EventBus publication after successful persistence.
- Kernel composition EventBus injection for KnowledgeService.

Deferred Concepts:

- Knowledge lifecycle-advancement service operations and their events.
- Event subscriptions and consumers.
- Mission Plan Events, Task Events, Execution Strategy Events, Shared Reality Events, Context Package Events, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-004.
- `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Knowledge events are notifications of already-completed, successfully persisted state transitions.
- Knowledge always carries Mission identity, so Knowledge events use the standard Mission-scoped `DomainEvent` envelope.
- Save-then-publish follows the existing Mission/Evidence/Review event publication pattern.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted Knowledge state ahead of the process-local event stream.
- No event consumers are added; published Knowledge events do not trigger domain behavior.
- Knowledge lifecycle states beyond `Candidate` remain reachable only through existing aggregate methods, not through KnowledgeService operations.

### Test Summary

- Targeted Sprint 13 Knowledge event tests passed: 2 files, 18 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 187 tests.

### Deviations

No architectural deviations.

---

## Sprint 12 — Knowledge Foundation

### Implemented Slice

Implemented the RFC-0007 Knowledge Foundation vertical slice under the `Knowledge` implementation vocabulary ratified by NEXUS-RAT-2026-07-13-003.

Implemented scope:

- `Knowledge` aggregate with immutable `KnowledgeId`, Mission and Mission Plan Revision attribution, summary, `KnowledgeScope`, `KnowledgeStatus`, supporting Evidence references, supporting Review reference, contributing Domain Event references, approving authority, provenance, and append-only revision history.
- `KnowledgeId`, `KnowledgeStatus`, `KnowledgeScope`, `KnowledgeAttribution`, and `KnowledgeProvenance` value objects.
- `KnowledgeStatus` lifecycle: `Candidate → Approved → Active → Superseded → Archived`; `Archived` is terminal.
- Aggregate-owned Knowledge capture precondition validation: supporting Review exists; supporting Review is `Completed`; supporting Review outcome is `Accepted` or `Accepted With Observations`; supporting Evidence exists; originating Mission is `Completed`; approval metadata is present.
- Memory Evolution through `Knowledge.revise`, producing new immutable Knowledge instances with preserved identity, attribution, provenance, and prior revisions.
- `IKnowledgeRepository` and `InMemoryKnowledgeRepository` process-local snapshot persistence.
- `KnowledgeService` thin orchestration for capture, revision, retrieval, and enumeration using constructor-injected repository contracts.
- Kernel service composition updated so `KnowledgeService` receives the Knowledge repository plus the shared Mission, Evidence, and Review repositories.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-003.

Out of scope and not implemented:

- Knowledge event publication.
- Reconciliation of the three existing Knowledge/Memory event-name sets.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Context Assembly consumption of Knowledge.
- Policy-driven capture criteria beyond the five deterministic capture preconditions.
- Human Authority approval workflow automation beyond recording `approvingAuthority`.
- Adapter invocation or AI Provider integration.
- Search, indexing, durable persistence, or multi-source Knowledge synthesis.

### RFC Coverage

Primary RFC:

- RFC-0007 — Knowledge Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model (Referenced; supporting Evidence lineage).
- RFC-0006 — Engineering Assessment Model (Referenced; supporting accepted Review outcome).
- RFC-0001 — Mission Model (Referenced; Mission and Mission Plan Revision attribution and completed Mission state).

Ratification:

- NEXUS-RAT-2026-07-13-003 — ratifies `Knowledge` as the canonical implementation-layer vocabulary for RFC-0007 Engineering Memory and authorizes the Sprint 12 reference-document corrections.

Implemented Concepts:

- Knowledge aggregate.
- Knowledge identity.
- Knowledge status lifecycle.
- Knowledge scope.
- Knowledge provenance.
- Knowledge attribution.
- Knowledge capture.
- Knowledge revision/evolution.
- Knowledge repository contract and in-memory repository.
- Knowledge service orchestration.

Deferred Concepts:

- Knowledge event publication and event-name reconciliation.
- Event subscriptions and consumers.
- Context Assembly consumption.
- Governance/policy-driven capture criteria.
- Human approval workflow automation.
- Adapter/AI Provider integration.
- Search, indexing, durable persistence, and multi-source synthesis.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/interface-contracts/knowledge-service-contract.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-003.
- `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `KnowledgeService` retrieves Mission, Evidence, and Review aggregate state from existing repositories and passes that context into `Knowledge.capture`; capture precondition decisions remain aggregate-owned.
- Required Mission work completion is represented by the existing Sprint 4 Mission lifecycle state `Completed`; no new Mission or Task concept is introduced.
- `contributingEventIds` are recorded as attribution data only; no Knowledge event publication or event consumption is introduced.
- Revisions preserve the original Knowledge attribution and provenance for this foundation slice.

### Limitations

- Repository persistence remains in-memory and process-local.
- Knowledge lifecycle transitions and revisions publish no events and are observable only through direct service calls or repository retrieval.
- `KnowledgeService` does not subscribe to Review events or approval events.
- Knowledge models one supporting Review per item.
- Approval authority is recorded as data only; no approval command, workflow, role check, or UI is implemented.
- Search, indexing, durable persistence, Context Assembly consumption, Adapter integration, and AI Provider integration remain deferred.

### Test Summary

- Targeted Knowledge tests passed: 4 files, 19 tests.
- TypeScript compile passed.
- ESLint passed.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 182 tests.

### Deviations

No architectural deviations.

---

## Sprint 11 — Domain Event Publication (Evidence, Review)

### Implemented Slice

Implemented the RFC-0005 Domain Event Publication vertical slice for the Evidence and Review domains.

Implemented scope:

- Optional `missionId` contextual association on `RegisterEvidenceRequest`, `EvidenceSnapshot`, and the `Evidence` aggregate as authorized by NEXUS-RAT-2026-07-13-001.
- `EvidenceCaptured` event factory and Evidence aggregate recorded-events collection with `pullDomainEvents()`.
- EvidenceService EventBus publication after successful Evidence repository registration.
- `ReviewStarted`, `FindingCreated`, `ReviewCompleted`, `ReviewAccepted`, and `ReviewRejected` event factories.
- Review aggregate recorded-events collection with `pullDomainEvents()`.
- ReviewService EventBus publication after successful Review repository persistence.
- Outcome-conditional Review publication: Accepted and Accepted With Observations publish `ReviewAccepted`; Rejected publishes `ReviewRejected`; Action Required publishes only `ReviewCompleted`.
- Kernel service composition updated so EvidenceService and ReviewService receive the Kernel-owned EventBus.
- EventBus support for the ratified Mission-independent EvidenceCaptured partial-conformance case through an Evidence-specific event publication variant where `missionId` is omitted.
- Shared `DomainEvent` and `DomainEventAttribution` contracts restored to required `missionId` per NEXUS-RAT-2026-07-13-002.

Out of scope and not implemented:

- Execution Strategy event publication.
- `EvidenceAccepted` and `EvidenceRejected`.
- `FindingAccepted`, `FindingResolved`, and `FindingDismissed`.
- Mission Plan Events and Task Events.
- Knowledge Events, Shared Reality Events, Context Package Events, and Policy Events.
- Event subscription/consumption by other services.
- Durable/persistent Event Streams.
- Event-driven domain behavior, reactions, gates, commands, or workflow automation.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model (Referenced; optional `missionId` extension authorized by NEXUS-RAT-2026-07-13-001).
- RFC-0006 — Engineering Assessment Model (Referenced; event trigger only).

Implemented Concepts:

- EvidenceCaptured.
- ReviewStarted.
- ReviewCompleted.
- ReviewAccepted.
- ReviewRejected.
- FindingCreated.
- Aggregate recorded-events collections and `pullDomainEvents()` for Evidence and Review.
- Service-level EventBus publication for EvidenceService and ReviewService.

Deferred Concepts:

- Execution Strategy event publication.
- Evidence acceptance/rejection events.
- Finding acceptance/resolution/dismissal events.
- Mission Plan and Task events.
- Knowledge, Shared Reality, Context Package, and Policy events.
- Event consumers and durable Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-001.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-002.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Events are notifications of completed facts only; no consumer, handler, command, gate, or workflow reaction is introduced.
- Evidence remains Mission-independent; `missionId` is an optional contextual association only.
- The shared Kernel `DomainEvent` contract remains Mission-scoped with required `missionId`; only the Evidence-specific publication variant permits Mission-independent omission.
- Review events are Mission-scoped because Review already owns a Mission identity reference.
- EvidenceService and ReviewService follow the existing MissionService save-then-publish pattern.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish is non-atomic for Evidence and Review, matching the disclosed Mission limitation.
- EvidenceCaptured events for Evidence without Mission context omit `missionId`, as authorized by NEXUS-RAT-2026-07-13-001.
- Mission-independent EvidenceCaptured events are not retrievable through `EventBusContract.replay()`, because replay remains scoped to a required Mission stream identifier.
- Review event causality does not chain across repository round trips because Review snapshots do not own a latest-event identity field in this slice.

### Test Summary

- Targeted Evidence/Review/EventBus tests passed: 9 files, 52 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 28 files, 163 tests.

### Deviations

Initial Sprint 11 delivery exceeded NEXUS-RAT-2026-07-13-001's Authorized Builder Scope by making the shared Kernel `DomainEvent` / `DomainEventAttribution` contract's `missionId` optional Kernel-wide. That deviation was corrected within Sprint 11 per NEXUS-RAT-2026-07-13-002 by restoring required `missionId` on the shared contract and confining Mission-independent omission to the Evidence-specific event publication variant.

---

## Sprint 10 — Execution Strategy

### Implemented Slice

Implemented the RFC-0004 Execution Strategy vertical slice.

Implemented scope:

- `ExecutionStrategy` aggregate with immutable `ExecutionStrategyId`, Mission reference, dependency-ordering rule, concurrency rule, and deterministic readiness evaluation.
- Dependency-ordering validation for existing Sprint 8 `RoleAssignment` readiness against MissionPlan Task Graph dependencies, including direct and transitive dependencies.
- `IExecutionStrategyRepository` and `InMemoryExecutionStrategyRepository` process-local persistence for ExecutionStrategies.
- `ExecutionStrategyService` orchestration for creating ExecutionStrategies, retrieving and enumerating strategies, and evaluating assigned Task readiness through constructor-injected repository contracts.
- Kernel service composition updated so `ExecutionStrategyService` shares the existing in-memory `RoleAssignmentRepository` used by `RoleService`.
- Deterministic Execution Strategy diagnostics for invalid definitions, duplicate strategies, duplicate Mission strategy ownership, missing strategy references, missing RoleAssignments, missing MissionPlans, missing Tasks, and unsatisfied dependency ordering.

Out of scope and not implemented:

- Execution State enum or state machine.
- Execution Session.
- Review gating of execution progression.
- Adapter invocation or Adapter selection.
- AI Providers and provider coordination.
- Runtime scheduling or actual parallel/concurrent execution.
- Governance.
- Assignment Policy elements beyond dependency ordering.
- Human Authority operations.
- Event Bus integration.
- Full explainability records beyond deterministic validation diagnostics.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Implemented Concepts:

- ExecutionStrategy.
- ExecutionStrategyId.
- Assignment dependency-ordering preservation for RoleAssignment readiness.
- ExecutionStrategyService.
- IExecutionStrategyRepository.
- InMemoryExecutionStrategyRepository.

Deferred Concepts:

- Execution State.
- Execution Session.
- Review requirements enforcement / RFC-0006 Review gating.
- Adapter invocation and Adapter selection.
- AI Providers and provider coordination.
- Actual parallel/concurrent execution runtime.
- Governance.
- Assignment Policy elements beyond dependency ordering.
- Human Authority operations.
- Event Bus integration.
- Full explainability records.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0010-execution-strategy.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-12-007.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- ExecutionStrategy references Mission, MissionPlan Tasks, and RoleAssignments by identity and published repository contracts; it does not own or mutate those aggregates.
- Dependency-ordering readiness is advisory/evaluative in this slice and does not gate or trigger Task execution.
- The concurrency rule is deterministic policy data only; no scheduler, executor, or runtime concurrency behavior is introduced.
- ExecutionStrategyService remains orchestration-only and delegates dependency-ordering behavior to the ExecutionStrategy aggregate.

### Limitations

- ExecutionStrategy persistence is in-memory and process-local.
- Readiness evaluation depends on existing MissionPlan Task statuses and RoleAssignment records.
- ExecutionStrategy evaluations do not publish domain events.

### Test Summary

- Targeted Sprint 10 execution tests passed: 6 files, 22 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 28 files, 156 tests.

### Deviations

No architectural deviations.

---

## Sprint 9 — Review Foundation

### Implemented Slice

Implemented the RFC-0006 Review Foundation vertical slice using the ratified Review implementation vocabulary from NEXUS-RAT-2026-07-12-006.

Implemented scope:

- `Review` aggregate with immutable `ReviewId`, Mission reference, MissionPlan revision reference, explicit `ReviewCriteria`, consumed Evidence references, `ReviewStatus`, completion-only `ReviewOutcome`, and owned Finding collection.
- `Finding` entity with immutable `FindingId`, owning `ReviewId`, `Severity`, optional `FindingCategory` for actionable Findings, summary, description, supporting Evidence references, affected artifact references, criteria references, and `FindingStatus`.
- `ReviewStatus` lifecycle validation for Pending → In Progress → Completed.
- `FindingStatus` lifecycle validation for Created → Accepted / Resolved / Dismissed.
- `ReviewOutcome` value object supporting Accepted, Accepted With Observations, Action Required, and Rejected.
- `ReviewCriteria`, `Severity`, `FindingCategory`, `ReviewId`, and `FindingId` value objects with deterministic validation.
- `IReviewRepository` and `InMemoryReviewRepository` process-local snapshot persistence for Reviews and Findings.
- `ReviewService` orchestration for start Review, publish Finding, finalize Review outcome, retrieve Review, enumerate Reviews, and enumerate Findings through constructor-injected repository contracts.
- Kernel service composition updated to inject a shared in-memory Review repository into `ReviewService`.
- Deterministic Review diagnostics for invalid definitions, invalid lifecycle transitions, duplicate Reviews, duplicate Findings, missing Evidence references, missing Reviews, rejected completion, and invalid Finding transitions.

Out of scope and not implemented:

- AI review execution.
- Claude Reviewer and Copilot Reviewer.
- Adapter invocation from Review.
- Event Bus integration and Review/Finding event publication.
- Governance decisions and policy evaluation.
- Multi-Assessment-Session Reviews.
- Actionable Finding to Mission Plan revision / Mission Evolution wiring.
- Human Authority approve, reject, override, or Override-as-Evidence operations.
- Execution Session consumption.
- Produced artifacts becoming Knowledge.
- Workflow automation and repository state transitions outside Review/Finding lifecycle state.
- Sensitive Finding access control.

### RFC Coverage

Primary RFC:

- RFC-0006 — Engineering Assessment Model (Partial).

Implemented Concepts:

- Review / Engineering Assessment Session.
- ReviewCriteria / Assessment Criteria.
- Finding / Assessment Finding.
- Severity / Finding Severity.
- FindingCategory / Finding Intent for actionable Findings.
- Observation as a Finding without FindingCategory.
- ReviewOutcome / Assessment Outcome.
- ReviewStatus and FindingStatus as implementation-layer operational lifecycle concepts ratified by NEXUS-RAT-2026-07-12-006.
- ReviewService.
- InMemoryReviewRepository.

Deferred Concepts:

- AI/provider execution and Adapter invocation.
- Event Bus integration.
- Governance and policy-driven Assessment Criteria selection.
- Multi-session Reviews.
- Mission Plan revision or Mission Evolution caused by Actionable Findings.
- Human Authority operations and overrides as Evidence.
- Execution Session consumption.
- Shared Reality Projection consumption as an Assessment input.
- Produced Artifacts consumption as an Assessment input.
- Assessment Outcome reasoning-chain capture (RFC-0006 § Explainability).
- Knowledge capture from accepted assessment artifacts.
- Workflow automation and repository state transitions.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/implementation/sprints/sprint-0009-review-foundation.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/interface-contracts/review-service-contract.md`.
- `knowledge/reference/service-catalog/review-service.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-12-006.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.
- `knowledge/.github/copilot-instructions.md`.

### Architectural Assumptions

- Mission identity, MissionPlan revision identity, Evidence references, affected artifact references, and criteria references are stored as immutable references; Review does not access or own foreign aggregate internals.
- `ReviewOutcome` is supplied through `finalizeReviewOutcome` and validated/assigned by the Review aggregate during completion; no undocumented policy heuristic determines outcomes in this slice.
- A Finding with `FindingCategory` is actionable; a Finding without `FindingCategory` is an Observation.
- ReviewService remains orchestration-only and does not validate business rules outside aggregate/repository coordination.

### Limitations

- Review persistence is in-memory and process-local.
- Review and Finding lifecycle transitions do not publish domain events.
- Reviews are recorded through direct ReviewService calls only; no provider, adapter, scheduler, workflow, or policy engine is invoked.
- Review stores consumed Evidence references but does not validate Evidence existence through the Evidence repository in this slice.
- Review models exactly one Assessment Session.

### Test Summary

- Targeted Sprint 9 Review tests passed: 4 files, 17 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 25 files, 147 tests.

### Deviations

No architectural deviations.

---

## Sprint 8 — Execution Roles

### Implemented Slice

Implemented the RFC-0004 Execution Roles vertical slice.

Implemented scope:

- `ExecutionRole` immutable domain model with RoleId, name, description, category, metadata, deterministic equality, and snapshots.
- `RoleMetadata` immutable value object with deterministic attribute normalization and validation.
- Built-in provider-independent Kernel roles: Builder and Reviewer.
- `RoleAssignment` immutable Task-to-ExecutionRole relationship with assignment metadata.
- `RoleRegistry` contract and `InMemoryRoleRegistry` for deterministic role registration, retrieval, enumeration, and duplicate prevention.
- `RoleAssignmentRepository` contract and `InMemoryRoleAssignmentRepository` for process-local assignment persistence and duplicate task-assignment prevention.
- `RoleValidation` deterministic validation diagnostics for unknown roles and duplicate task assignments.
- `RoleService` orchestration for default role registration, role lookup, role registration, assignment creation, and assignment lookup through constructor-injected contracts.
- Kernel service composition updated to include `RoleService`.

Out of scope and not implemented:

- Execution Strategy.
- Assignment dependency-ordering preservation (RFC-0004 § Assignment).
- Provider Mapping.
- Adapter Invocation.
- Review Engine.
- Governance.
- Scheduling.
- Parallel Execution.
- Adapter selection.
- Provider selection.
- Builder workflow.
- Reviewer workflow.
- Event Bus integration.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Implemented Concepts:

- ExecutionRole.
- RoleAssignment.
- RoleRegistry.
- RoleMetadata.
- RoleValidation.
- RoleService.

Deferred Concepts:

- Execution Strategy.
- Assignment dependency-ordering preservation (RFC-0004 § Assignment).
- Provider Mapping.
- Adapter Invocation.
- Review Engine.
- Governance.
- Scheduling.
- Parallel Execution.
- Adapter selection and provider selection.
- Builder and Reviewer workflows.
- Event Bus integration.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- Role category is modeled as deterministic text because RFC-0004 does not define a category enumeration.
- RoleAssignment represents the RFC-0004 Task-to-ExecutionRole relationship by Task identity and Role identity without accessing Task aggregate internals.
- RoleService default role registration is orchestration; role uniqueness remains owned by RoleRegistry.

### Limitations

- Registered roles and role assignments are process-local and in-memory.
- RoleAssignment does not select adapters, select providers, invoke adapters, schedule work, or execute workflows.
- RoleService does not publish events because Event Bus integration is deferred.

### Test Summary

- Targeted Sprint 8 execution-role tests passed: 3 files, 13 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 21 files, 130 tests.

### Deviations

No architectural deviations.

---

## Sprint 7 — Adapter Framework

### Implemented Slice

Implemented the RFC-0008 Adapter Framework vertical slice.

Implemented scope:

- `Adapter` contract defining the minimum implementation-independent adapter interface.
- `AdapterId`, `AdapterName`, `AdapterVersion`, and `ProtocolVersion` immutable value objects.
- `AdapterMetadata` immutable metadata containing adapter identity, version, protocol version, declared capabilities, supported engineering role names, lifecycle, and attributes.
- `AdapterCapability` immutable technical capability value object for CodeGeneration, CodeModification, StaticAnalysis, DocumentationGeneration, and TestGeneration.
- `AdapterLifecycle` immutable lifecycle value object with deterministic transitions through Registered, Available, Active, Completed, and Unavailable.
- `AdapterRequest` immutable execution request containing Engineering Role name, Task Identifier, Context Package Reference, Execution Constraints, and Request Metadata.
- `AdapterResponse` immutable execution outcome containing status, diagnostics, produced artifacts, findings, and execution metadata.
- `AdapterRegistry` contract and `InMemoryAdapterRegistry` for deterministic registration, unregistration, lookup, discovery, and duplicate validation.
- `AdapterService` for orchestration-only registry lookup, protocol compatibility validation, capability validation, and request dispatch.
- Deterministic adapter diagnostics for duplicate registration, adapter not found, unsupported capability, invalid lifecycle transition, incompatible protocol version, invalid definitions, invalid requests, and invalid responses.
- Kernel service composition updated so AdapterService is registered with an empty in-memory AdapterRegistry.

Out of scope and not implemented:

- AI Providers.
- Copilot Adapter.
- Claude Adapter.
- Gemini Adapter.
- Codex Adapter.
- Human Adapter.
- Execution Roles.
- Execution Strategy.
- Builder.
- Reviewer.
- Review Engine.
- Shared Reality enhancements.
- Context Assembly.
- Knowledge.
- Governance.
- AdapterRequest applicable-policies element pending Kernel policy concepts.
- Event Bus integration.
- Provider configuration.
- Retry policies.
- Adapter security policies.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Implemented Concepts:

- Adapter contract.
- AdapterRegistry.
- AdapterRequest.
- AdapterResponse.
- AdapterMetadata.
- AdapterCapability.
- Adapter lifecycle.
- AdapterService.

Deferred Concepts:

- AI Providers.
- Provider-specific adapters.
- Human Adapter.
- Execution Roles and Execution Strategy.
- Review Engine, Builder, and Reviewer.
- Shared Reality expansion and Context Assembly.
- Knowledge and Governance.
- AdapterRequest applicable-policies element pending Kernel policy concepts.
- Event Bus integration.
- Provider configuration, retry policies, and Adapter security policies.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- Engineering Roles are Kernel-assigned role-name strings in this slice; the Adapter Framework declares role support but does not define, enumerate, or own Execution Roles.
- Context Package handling is limited to an immutable reference string; Context Assembly and Shared Reality expansion remain deferred.
- AdapterService compatibility checks for protocol version and declared capability are contract orchestration, not business-rule ownership.
- Adapter lifecycle validation is local and deterministic; lifecycle observability through Event Bus integration remains deferred.

### Limitations

- No provider adapters are implemented.
- Registry persistence is in-memory and process-local.
- AdapterResponse produced artifacts and findings are immutable references/strings and are not promoted to Evidence.
- AdapterRequest applicable policies are not modeled because Kernel policy concepts are not implemented in this slice.
- AdapterService does not retry requests, configure providers, enforce security policy, publish events, or assemble context.

### Test Summary

- Targeted Adapter Framework tests passed: 3 files, 11 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 18 files, 117 tests.

### Deviations

No architectural deviations.

### Governance Notes

- Sprint Owner authorized persisting the Sprint 7 specification and activating `builder-task.md` from the inline Sprint 7 work order on 2026-07-12T19:57:09.375+08:00 before implementation began.

---

## Sprint 6 — Shared Reality Foundation

### Implemented Slice

Implemented the RFC-0003 Shared Reality Foundation vertical slice.

Implemented scope:

- `SharedReality` immutable read model for the computed engineering understanding of an active Mission.
- `ProjectionService` for deterministic projection orchestration through injected Mission and Evidence repository contracts.
- `ProjectionResult` immutable result exposing Projection Version, Active Mission, Mission Plan, Mission Execution State, Evidence References, and Projection Metadata.
- `ProjectionVersion` immutable value object generated deterministically from stable projection inputs.
- Context aggregation by Evidence type and Evidence source.
- Deterministic projection diagnostics for missing Mission, inactive Mission, missing MissionPlan, missing Evidence, empty Evidence sets, duplicate Evidence references, inconsistent Evidence versions, unsupported Evidence types, and internal context consistency.
- Kernel service composition updated so ProjectionService receives the shared in-memory Mission repository and Evidence repository.

Out of scope and not implemented:

- Context Assembly.
- AI Context Packaging and prompt construction.
- Provider Context.
- Adapter Framework.
- Execution Roles.
- Review Engine.
- Knowledge.
- Governance.
- Event Bus integration.
- Incremental projections.
- Projection caching.
- Projection persistence and persistence optimization.
- Search and indexing.

### RFC Coverage

Primary RFC:

- RFC-0003 — Shared Reality Projection Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model.
- RFC-0001 — Mission Model.

Implemented Concepts:

- Shared Reality.
- Projection.
- Projection Version.
- Context aggregation for the foundation slice.
- Projection validation.

Deferred Concepts:

- Context Assembly.
- Context Package / AI Context Packaging.
- Provider Context.
- Adapter Framework.
- Execution Roles.
- Review Engine.
- Knowledge.
- Governance.
- Event Bus integration.
- Incremental projections.
- Projection caching.
- Projection Scope (full scope declaration).
- Projection Freshness / stale projection invalidation.
- Projection persistence.
- Search and indexing.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- The active Evidence set for this foundation slice is either the explicitly requested Evidence references or all Evidence returned by the injected Evidence repository when no references are supplied.
- Evidence authority resolution, conflict resolution, policy application, and freshness invalidation remain deferred; ProjectionService does not approximate those concepts.
- Mission execution state is projected from existing Mission status and MissionPlan Task statuses; Shared Reality does not own or mutate execution state.
- Projection metadata is intentionally deterministic and excludes wall-clock generation timestamps.

### Limitations

- Repository persistence remains in-memory and process-local.
- ProjectionService does not cache, persist, incrementally update, or publish projections.
- Context aggregation is limited to deterministic grouping of Evidence references by type and source.
- Projection validation rejects empty Evidence sets because Shared Reality must be computed from Evidence.
- Unsupported Evidence type rejection is defensive for repository-contract consumers; the current Evidence aggregate already restricts registered Evidence to supported Sprint 5 types.

### Test Summary

- Targeted Shared Reality tests passed: 1 file, 8 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 15 files, 106 tests.

### Deviations

No architectural deviations.

### Review Remediation

- TASK-001 — Recorded Projection Scope and Projection Freshness as deferred Sprint 6 concepts in the Implementation Manifest, Sprint 6 record, Implementation Plan, and Implementation Report.
- TASK-002 — Reconciled the NEXUS-RAT-2026-07-12-002 canonical RFC-0003 contract surface by removing the duplicate `projection.contract.ts` request/service placeholders, removing the obsolete `SharedRealityService` alias, removing legacy Shared Reality placeholder interfaces, and updating placeholder consumers to use the canonical `SharedRealitySnapshot` type.

### Governance Notes

- Sprint 6 implementation proceeded using the human-authorized inline Sprint 6 request as the active Sprint Specification and Builder Work Order because `builder-task.md` remained closed for Sprint 5 and no persisted Sprint 6 sprint specification existed before implementation.
- NEXUS-RAT-2026-07-12-004 — Sprint Owner acknowledged and ratified the Sprint 6 concurrent-Sprint-Specification deviation and established the mandatory Sprint 7+ specification-first workflow.

---

## Sprint 5 — Evidence Foundation

### Implemented Slice

Implemented the RFC-0002 Evidence Foundation vertical slice.

Implemented scope:

- `Evidence` aggregate with immutable identity, type, version, hash, metadata, and provenance.
- `EvidenceId`, `EvidenceType`, `EvidenceSource`, `EvidenceVersion`, and `EvidenceHash` value objects with validation and equality semantics.
- `EvidenceMetadata` and `Provenance` immutable domain objects.
- `IEvidenceRepository` and `InMemoryEvidenceRepository` for process-local registration, retrieval, existence checks, and enumeration.
- `EvidenceService` for thin orchestration over Evidence registration, validation, retrieval, and enumeration using constructor-injected repository contracts.
- Deterministic domain diagnostics: `DuplicateEvidenceException`, `InvalidEvidenceException`, and `EvidenceNotFoundException`.
- Kernel service composition updated so EvidenceService receives an injected in-memory Evidence repository.

Out of scope and not implemented:

- Shared Reality.
- Context Assembly.
- Projection.
- Knowledge.
- Review and Review Findings.
- Event Bus expansion.
- Domain Events.
- Execution Strategy and Execution Roles.
- Provider Adapters.
- AI Providers.
- Indexing and Search.
- Durable persistence engines.
- Evidence relationships.
- Evidence conflict resolution.
- Evidence authority set resolution.
- Evidence confidence policy enforcement.

### RFC Coverage

Primary RFC:

- RFC-0002 — Evidence Model (Partial).

Ratification:

- NEXUS-RAT-2026-07-12-001 — Sprint Owner ratified the Sprint 5 retroactive Sprint Specification as a recoverable governance deviation with no architecture or implementation impact.

Implemented Concepts:

- Evidence aggregate.
- Evidence Identity.
- Evidence Provenance.
- Evidence Version.
- Evidence registration.
- Evidence validation.
- Deterministic Evidence retrieval.
- Append-only in-memory registration semantics.

Deferred Concepts:

- Evidence Relationships.
- Evidence Conflict.
- Evidence Authority resolution.
- Evidence Confidence policy enforcement.
- Shared Reality projection from Evidence.
- Durable append-only Evidence persistence.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/reference/interface-contracts/evidence-service-contract.md`.
- `knowledge/reference/service-catalog/evidence-service.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- EvidenceType support is limited to the RFC-0002 example evidence categories needed to validate this foundation slice: repository source code, architecture documents, ADRs, accepted mission outcomes, approved repository policies, build outputs, static analysis results, test results, and human-approved decisions.
- Evidence registration is append-only for this slice; corrections create additional Evidence instances and versions rather than mutating registered Evidence.
- Duplicate EvidenceId detection is coordinated by EvidenceService before repository registration; InMemoryEvidenceRepository also protects its storage contract from accidental overwrite.
- Evidence confidence classification and authority policies remain deferred even though RFC-0002 owns them.

### Limitations

- Repository persistence is in-memory and process-local.
- Evidence relationships and conflict resolution are intentionally absent.
- Evidence authority set resolution is intentionally absent.
- No indexing, search, durable storage, provider adapters, or event publication were introduced.
- Evidence hash validation requires a non-empty integrity token but does not mandate a specific hashing algorithm because RFC-0002 does not prescribe one for this slice.

### Test Summary

- Targeted Evidence tests passed: 4 files, 16 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 14 files, 98 tests.

### Deviations

No architectural deviations.

### Review Remediation

- TASK-001 — Reconciled `evidence.contract.ts` with the repository capability contract convention by converting it to a barrel export of the implemented Evidence types, aggregate, repository, diagnostics, and service surface.
- TASK-002 — Removed the unreachable source-consistency branch from `EvidenceService.validateEvidence`.
- TASK-004 — Added Evidence Confidence classification and Evidence Lifecycle progression to the Sprint 5 deferred concepts in `IMPLEMENTATION_MANIFEST.md`.
- TASK-005 — Reconciled Evidence Service reference documents with implemented operation names while keeping authority resolution and Evidence relationships deferred.
- TASK-003 — Sprint Owner ratification NEXUS-RAT-2026-07-12-001 resolved the governance dependency for the retroactive Sprint 5 Sprint Specification; the ratification citation is recorded in the Sprint 5 implementation-layer sections.

---

## Sprint 4 — Mission Execution

### Implemented Slice

Implemented deterministic Mission Execution for the RFC-0001 Mission Model vertical slice.

Implemented scope:

- `MissionExecutionService` for thin application orchestration over the existing repository contracts.
- Mission aggregate execution validation for start, complete, fail, and cancel.
- Mission completion evaluation against Task snapshots.
- Task execution operations for start, complete, and cancel.
- MissionPlan execution validation for executable plans and Task dependency satisfaction.
- In-memory repository persistence of Mission status and Task execution status through existing snapshot storage.
- Deterministic domain diagnostics for invalid transitions, dependency violations, non-executable Missions, and rejected completion.
- Kernel service registration of `MissionExecutionService` with the shared in-memory Mission repository.

Out of scope and not implemented:

- Execution Strategy.
- Builder.
- Reviewer.
- Governance.
- Provider Adapters.
- AI Providers.
- Event Bus expansion.
- Domain Event expansion.
- Shared Reality.
- Evidence.
- Knowledge.
- Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- Mission pause and resume.
- Task execution failure states.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission execution use cases.
- Task execution lifecycle.
- Mission completion evaluation.
- Execution validation.

Deferred Concepts:

- Execution Strategy and roles.
- Execution Policies.
- Provider Coordination.
- Provider/adapter execution.
- Task execution failure states deferred to RFC-0004.
- Review Engine.
- Shared Reality, Evidence, and Knowledge.
- Scheduling, parallel execution, and critical path analysis.
- Mission pause and resume pending RFC amendment candidate review.

### Architectural Assumptions

- MissionExecutionService coordinates aggregate loading, aggregate method calls, and persistence only; business rules remain inside Mission, MissionPlan, and Task.
- Mission completion requires the RFC-0001 lifecycle to permit completion and requires every Task in the MissionPlan to be `Completed`.
- Task dependency satisfaction is owned by MissionPlan because MissionPlan owns the Task Graph.
- Task lifecycle validation is owned by Task, including terminal-state immutability.

### Limitations

- Repository persistence remains in-memory and process-local.
- Task execution operations do not publish Task-level events or invoke providers.
- Mission completion requires the Mission to be in the RFC-0001 completion-permitted lifecycle state; this sprint does not implement a Review Engine or reinterpret review semantics.
- Mission pause/resume remains unimplemented because the current RFC lifecycle does not define a `Paused` state transition.
- Task execution failure states are deferred to RFC-0004.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 10 files, 82 tests.

### Deviations

- The Task-level failure state introduced during Sprint 4 was withdrawn per Sprint Owner ratification on 2026-07-12.
- Task execution states beyond start, completion, and cancellation remain deferred to RFC-0004.

### Process Deviations

- Sprint 4 was implemented without a sprint specification conforming to `knowledge/implementation/sprint-template.md`.
- Sprint 4 implementation proceeded outside the executable scope of the governing Builder Task document.
- Sprint 4 RFC coverage was re-scoped from RFC-0004 to RFC-0001 (Partial) concurrently with implementation; the Sprint Owner ratified this re-scope on 2026-07-12.
- The Sprint Owner ratified the RFC-0001 (Partial) re-scope and authorized the retroactive Sprint 4 specification on 2026-07-12, resolving the pending TASK-006 reference.

### Ratification

- Sprint Owner ratification recorded 2026-07-12: Sprint 4 is an RFC-0001 Mission Model (Partial) slice and does not implement RFC-0004.

---

## Sprint 3 — Mission Planning Review Remediation

**Governance Note (added retroactively, NEXUS-RAT-2026-07-13-008):** `NEXUS-REV-2026-07-12-003`/`-004`, cited throughout this section, were never persisted in `REVIEW_HISTORY.md`. This sprint is recorded as a Historically Accepted Governance Deviation; no retroactive Reviewer certification is fabricated. See `knowledge/governance/RATIFICATION_LEDGER.md` § NEXUS-RAT-2026-07-13-008.

### Implemented Slice

Implemented the Sprint 3 Mission Planning remediation tasks authorized by `builder-task.md`, including the Kernel integration restoration from NEXUS-REV-2026-07-12-004.

Implemented scope:

- `MissionPlan`, `PlanRevision`, `Task`, `TaskId`, `TaskStatus`, `TaskDependency`, and `MissionPlanningService`.
- In-memory MissionPlan repository support for MissionPlans, Tasks, and Revisions.
- TASK-001 — Enforced one MissionPlan per Mission.
- TASK-002 — Made `MissionPlan.updateTask` atomic for validation failures.
- TASK-003 — Rejected planning operations for terminal Missions.
- NEXUS-REV-2026-07-12-004 TASK-001 — Restored Kernel factory registration so MissionService receives the Kernel-owned EventBus, MissionService and MissionPlanningService share one `InMemoryMissionRepository`, and MissionPlanningService is registered in the running Kernel.
- NEXUS-REV-2026-07-12-004 TASK-002 — Rejected same-status update validation on terminal Tasks as part of the authorized Task Graph invariant remediation.
- NEXUS-REV-2026-07-12-004 TASK-003 — Implemented Option A cycle validation in the MissionPlan aggregate for direct and transitive Task Graph cycles.

Out of scope and not implemented:

- Execution Strategy.
- Planning Domain Events.
- Task Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- AI-generated Plans.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph dependency validation, including duplicate prevention, self-reference rejection, direct cycle rejection, and transitive cycle rejection.
- Mission Planning Service.

Deferred Concepts:

- Execution Strategy.
- Planning Domain Events.
- Task Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- AI-generated Plans.

### Architectural Assumptions

- Planning operations are rejected for terminal Missions (`Completed`, `Cancelled`, `Failed`).
- Non-terminal lifecycle coordination for planning operations is deferred pending explicit RFC guidance; planning remains permitted for `Draft`, `Planned`, `Ready`, `Executing`, and `Reviewing` Missions.
- The Sprint 3 slice enforces one MissionPlan per Mission without introducing active/inactive plan, archival, or replacement semantics.
- The Kernel composes MissionService and MissionPlanningService with one shared in-memory Mission repository; MissionService receives the Kernel-owned EventBus.

### Limitations

- Repository persistence is in-memory and process-local.
- Planning operations are event-silent in this slice.
- Cycle detection is limited to validation in the MissionPlan aggregate and does not introduce scheduling, execution ordering, topological sorting, or critical path analysis.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 9 files, 68 tests.

### Deviations

No architectural deviations.

---

## Sprint 2 — Mission Foundation

### Implemented Slice

Implemented the first Mission Domain vertical slice for `SPRINT-0002` under Milestone 1 — Kernel Foundation.

Implemented scope:

- `Mission` aggregate with immutable `MissionId`, immutable `MissionObjective`, lifecycle behavior, invariant enforcement, and recorded Mission domain events.
- RFC-0001 lifecycle states: `Draft`, `Planned`, `Ready`, `Executing`, `Reviewing`, `Completed`, `Cancelled`, and `Failed`.
- RFC-0001 lifecycle transitions for implemented Mission states, with terminal states preserved.
- `MissionId` value object with equality and serialization support.
- `IMissionRepository` contract with `save`, `getById`, and `exists`.
- Development-only `InMemoryMissionRepository` with serialized operations and snapshot-based retrieval.
- `MissionService` for Mission creation, lifecycle updates, repository coordination, duplicate handling, not-found handling, and publication through the existing `EventBusContract`.
- Mission domain event catalog names defined by RFC-0001.
- Explicit Mission domain exceptions for identity, objective, lifecycle transition, duplicate Mission, missing Mission, and unavailable event publisher violations.
- Unit tests covering Mission creation, lifecycle, invariants, invalid transitions, value objects, repository behavior, service lifecycle operations, event publication, and duplicate handling.

Out of scope and not implemented:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph.
- Evidence.
- Shared Reality.
- Execution Strategy.
- Event Bus implementation.
- Review Engine.
- Adapter Framework.
- Host features.
- VS Code commands.
- Tree views.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission.
- Mission Identity.
- Mission Objective.
- Mission Lifecycle.
- Mission Repository.
- Mission Service.
- Mission Domain Events.
- Mission Domain Exceptions.

Deferred Concepts:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- RFC-0001 `Any State -> Cancelled` is implemented for non-terminal Mission states because `IMPLEMENTATION_GATE.md` requires terminal states to remain terminal.
- The existing Kernel `EventBusContract` is the publishing mechanism for MissionService; this sprint does not implement a new Event Bus.
- Mission event payloads remain minimal except for `MissionCreated`, which carries Mission identity and objective.

### Limitations

- Mission events are process-local when published through the existing in-memory EventBus.
- `MissionService` requires an `EventBusContract` before create or lifecycle operations; it rejects mutation if an event publisher is unavailable.
- `MissionService` saves Mission state before publishing recorded events; a publish failure after save can leave persisted Mission state ahead of the process-local event stream. Transactional outbox and ordering semantics are deferred until durable persistence is implemented.
- Mission Plan, Mission Revision, Task, and Task Graph are intentionally absent until a later RFC-0001 vertical slice.

### Review Remediation

- TASK-001 — `MissionService.create(objective)` is removed; `createMission(request)` remains the only Mission Service creation operation.
- TASK-002 — Mission lifecycle events preserve causality from the immediately preceding Mission event and lifecycle operations accept optional correlation IDs.
- TASK-003 — The non-atomic save/publish limitation is documented in this report.
- TASK-004 — Blocked pending human ratification; Mission reference documents were not modified.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 6 files, 43 tests.

### Deviations

No architectural deviations.

---

# Nexus Bootstrap Implementation Report

## Scope

This report covers the initial Nexus VS Code extension bootstrap slice and corrective follow-up tasks through Task-005.

Implemented scope:

- Compilable VS Code extension scaffold.
- VS Code host activation and `nexus.initializeWorkspace` command registration.
- Kernel creation, service coordination, initialization, health reporting, and shutdown.
- Placeholder Kernel services for Mission, Evidence, Shared Reality, Execution, Review, and Knowledge.
- Capability-based Kernel folder structure with cross-cutting Kernel infrastructure under `src/kernel/common/`.
- RFC-0005-aligned DomainEvent contract and hardened in-memory EventBus infrastructure.
- Terminal EventBus disposal behavior that rejects publish, subscribe, and replay after disposal.
- EventBus publication validation for the RFC-0005 Mission attribution invariant.
- Event Bus reference documentation reconciled to the implemented `replay(missionId)` contract and terminal-disposal behavior.
- Terminal Kernel disposal semantics aligned with the Kernel-owned terminal EventBus lifecycle.
- Contract deduplication and removal of speculative placeholder interfaces/directories.
- Corrected Kernel Event Catalog envelope documentation.
- Strict TypeScript, ESLint, Vitest, esbuild, and npm validation configuration.
- VS Code host command semantics and lifecycle cleanup for honest initialization reporting and single-owner disposal.

Not implemented:

- Mission Aggregate.
- Mission Repository.
- Mission execution.
- AI providers or adapters.
- Shared Reality computation.
- Review engine.
- Knowledge persistence.
- Durable event persistence.
- Telemetry.
- Storage.
- Networking.
- Git integration.
- MCP integration.
- Settings UI, webviews, or authentication.

## Referenced RFCs

- RFC-0001 — Mission Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

## Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `knowledge/reference/interface-contracts/event-bus-contract.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-reference-architecture.md`.
- `knowledge/reference/kernel-service-map.md`.
- `knowledge/reference/kernel-dependency-graph.md`.

## Assumptions

- In-memory EventBus replay is acceptable for the bootstrap slice because durable event persistence is outside the requested milestone.
- Placeholder services may expose only lifecycle and health behavior until their owning vertical slices implement domain behavior.
- Public capability contracts may remain even when not yet consumed internally.
- The VS Code host owns the Pino-backed adapter for `KernelLogger`; the Kernel remains independent of Pino.

## Limitations

- Event replay is process-local and is lost when the extension process exits.
- The Kernel does not yet persist Domain Events, Evidence, Knowledge, Missions, or service state.
- Placeholder services do not implement domain behavior.
- The extension registers one command and does not expose additional UI.
- The Event Catalog still contains broader event names and service naming that may require future RFC/reference reconciliation.
- The Projection Service versus Shared Reality naming conflict identified during Task-002 remains unresolved and requires human ratification before broad reference-document renaming.

## Architectural Deviations

No architectural deviations.

## Process Deviations

Tasks 005, 007, 008, and 009 were implemented beyond the authorized scope of sprint `NEXUS-SPRINT-2026-07-11-001`, which listed only Tasks 001, 002, 003, 004, and 006 for implementation. This process deviation was accepted by review `NEXUS-REV-2026-07-12-001`.

Future sprints will implement only the tasks explicitly listed in the authorized sprint scope.
