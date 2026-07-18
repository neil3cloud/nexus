# Sprint 68 — Event-Driven Workflow Advancement

## Status

✅ Approved — `NEXUS-REV-2026-07-17-005` (zero Category 1–5 findings; one Category 6, Informational Observation, no Builder Task). Ratified by `NEXUS-RAT-2026-07-17-005`, implementing RFC-0004 v1.15 (`NEXUS-RAT-2026-07-17-004`).

## Objective

Wire the existing `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57, frozen contract) to an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, resolve the exact Engineering Session and Workflow Step attribution for that Governance Decision through Sprint 67's `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, and invoke the existing Governance-Gated Advancement path deterministically — closing the loop between Sprint 67's correlation record and Sprint 57's existing advancement authority, without introducing Recovery automation or any second event consumer.

## RFC Coverage

- RFC-0004 v1.15 (Partial — implements exactly the Event-Driven Workflow Advancement section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; outbound half of the attribution gap).
- `NEXUS-RAT-2026-07-17-002`/`-003` — RFC-0004 v1.14 amendment and Sprint 67 (Engineering Decision Correlation Foundation, frozen; inbound half of the attribution gap and this Sprint's attribution source).
- `NEXUS-RAT-2026-07-17-004` — RFC-0004 v1.15 amendment, defining Event-Driven Workflow Advancement.
- `NEXUS-RAT-2026-07-17-005` — authorizes this Sprint, including the binding Existing Consumer Ownership and Subscription Lifecycle rules below.

## Authorized Concepts

- Extending `GovernanceGatedWorkflowAdvancementConsumer` with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition (or the existing canonical consumer-registration mechanism), exactly once per Kernel composition.
- On receipt of `GovernanceDecisionRecorded`: validate the event; resolve the referenced `GovernanceDecision`; resolve its Engineering Decision Correlation via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; obtain the correlation's authoritative Mission/Engineering-Session/Workflow-Step attribution; validate attribution consistency between the event, the `GovernanceDecision`, and the correlation; invoke the existing Governance-Gated Advancement path through `EngineeringSessionService`'s existing `advanceWorkflowAfterGovernanceDecision` operation.
- Only an Approved `GovernanceDecision` may result in advancement. Rejected, Deferred, and Escalation Required produce a deterministic non-advancing result — not a technical failure, and not a Recovery Requirement.
- Fail-closed handling: missing correlation, ambiguous correlation, or any Mission/Engineering-Session/Workflow-Step mismatch produces no advancement, no aggregate mutation, and no Recovery Requirement, with deterministic diagnostics — never a silent no-op indistinguishable from success.
- Idempotent handling of duplicate/replayed `GovernanceDecisionRecorded` delivery using existing authoritative Engineering Session state and event identity, so a Workflow position is never advanced more than once for the same event.
- Additive `createKernelServices()` composition wiring establishing the subscription.

## Existing Consumer Ownership (binding, per `NEXUS-RAT-2026-07-17-005`)

`GovernanceGatedWorkflowAdvancementConsumer` SHALL be extended, not replaced; a second consumer for the same responsibility SHALL NOT be introduced. Its existing direct `handleGovernanceDecisionRecorded(...)` capability MAY be retained internally, but production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — production event handling SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

## Subscription Lifecycle (binding, per `NEXUS-RAT-2026-07-17-005`)

Kernel composition SHALL ensure the consumer subscribes exactly once; repeated service retrieval SHALL NOT create duplicate subscriptions; no new general-purpose event-consumer framework is authorized.

## Deferred Concepts

- `RecoveryRequirementGovernanceDecisionConsumer` wiring and Recovery Workflow Automation (Sprint 69) in their entirety, including automatic Recovery Requirement creation from events.
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing of any kind.
- Event-driven Review creation or event-driven Governance evaluation.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, or Mission Engineering Group.

## Acceptance Criteria

- The consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no advancement, no aggregate mutation, and no Recovery Requirement creation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, the correlation, and the Engineering Session before advancement; any mismatch fails closed.
- An Approved `GovernanceDecision` invokes the existing Governance-Gated Advancement path through `EngineeringSessionService`'s existing operations without the consumer mutating `EngineeringSession` directly.
- Rejected, Deferred, and Escalation Required `GovernanceDecision` values produce a deterministic non-advancing result and create no Recovery Requirement.
- Duplicate/replayed event delivery does not advance the same Workflow position more than once and produces no duplicate effective side effects.
- No `EngineeringSession` (beyond its existing, unmodified public operations), `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, Sprint 65 event contract, Sprint 66 projection, Sprint 67 correlation contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.15) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Required Test Matrix

- Subscription registration and exactly-once-per-composition behavior; repeated service resolution does not duplicate subscriptions.
- Approved decision → successful advancement through the existing Governance-Gated Advancement path.
- Rejected / Deferred / Escalation Required decision → deterministic non-advancing result, no Recovery Requirement created.
- Missing correlation for a `governanceDecisionId` → fail closed, no advancement.
- Ambiguous correlation (more than one match without a uniquely-identifying key) → fail closed, no advancement.
- Mission mismatch between event, `GovernanceDecision`, and correlation → fail closed.
- Workflow Step mismatch between correlation and governed runtime position → fail closed.
- Duplicate/replayed event delivery → no duplicate advancement, deterministic already-processed/equivalent result.
- Already-advanced Workflow position → no duplicate transition.
- Repository/persistence failure → no partial successful transition.
- Malformed `GovernanceDecisionRecorded` event → deterministic rejection.
- Kernel composition / production-drift protection (no `src/hosts`/`src/adapters` file touched; no forbidden file modified).
- Zero direct aggregate mutation by the consumer (advancement occurs only through `EngineeringSessionService`'s existing operations).

## Builder Responsibilities

- Implement exactly the Authorized Concepts above under `src/kernel/execution/`, extending `governance-gated-workflow-advancement.consumer.ts` and its Kernel composition wiring in `create-kernel-services.ts`.
- Cover the Required Test Matrix in full.
- Stop and report, per `IMPLEMENTATION_CONSTITUTION.md` "Documentation Before Code" and the Builder Stop Conditions below, if any Authorized Concept cannot be implemented without touching a file this Sprint forbids, or without inferring attribution from a source not authorized above.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- the existing `EventBus` cannot support deterministic single subscription;
- the existing correlation service cannot resolve by `GovernanceDecisionId` as specified;
- an Approved decision cannot be routed through the existing Governance-Gated Advancement service without direct aggregate mutation;
- idempotency requires modifying Governance Decision or Engineering Decision Correlation ownership;
- attribution cannot be validated without changing Sprint 67's frozen contracts;
- implementation requires Recovery Requirement creation;
- implementation requires Host or Adapter changes.

No speculative retry, fallback attribution, or duplicate consumer path is authorized.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` documents implemented capability, RFC coverage, assumptions, limitations, and validation summary, consistent with prior Sprints.
- `IMPLEMENTATION_MANIFEST.md` gains a Sprint 68 section upon implementation, per established repository practice.
- No RFC, Kernel Canon, or Ratification file is modified by the Builder; RFC-0004 v1.15 and both ratifications are already recorded by `nexus-plan`.

## Known Limitations

- This Sprint does not implement Recovery Workflow Automation; a Rejected `GovernanceDecision`'s Recovery Requirement creation and its own event-driven wiring remain entirely reserved for Sprint 69, requiring its own future Sprint Owner scope ratification.
- This Sprint does not introduce durable delivery, retry, or buffering; an event delivered before its required correlation exists fails closed rather than being retried.

## Builder Results

Implemented — Pending Reviewer Validation.

Completed Builder scope:

- Extended the existing `GovernanceGatedWorkflowAdvancementConsumer` with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`.
- Wired the consumer through `createKernelServices()` with shared `GovernanceDecision` and Engineering Decision Correlation dependencies.
- Resolved Event-Driven Workflow Advancement attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`.
- Validated event, `GovernanceDecision`, correlation, and Engineering Session runtime Workflow Step consistency before invoking advancement.
- Invoked the existing `EngineeringSessionService.advanceWorkflowAfterGovernanceDecision` operation for Approved decisions only.
- Produced deterministic fail-closed/non-advancing diagnostics for malformed events, missing or ambiguous correlation, attribution mismatch, non-approved decisions, duplicate/replayed events, and persistence rejection.
- Added tests covering the Required Test Matrix without modifying Host/Adapter files or forbidden aggregate contracts.

No architectural deviations.

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-005`. Overall Disposition: PASS. Independently re-verified in source that `GovernanceGatedWorkflowAdvancementConsumer` was extended rather than replaced, subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition (guarded by `subscriptionHandles.length > 0`, confirmed by test `S68-1`), resolves attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId` with no caller-supplied substitute, validates Mission/GovernanceDecision/correlation/WorkflowStep consistency before advancing, and invokes only the existing `EngineeringSessionService.getEngineeringSession`/`advanceWorkflowAfterGovernanceDecision` operations with zero direct aggregate mutation (`S68-8`). Confirmed Rejected/Deferred/Escalation Required decisions produce a deterministic non-advancing result and create no `RecoveryRequirement` (`S68-3`); confirmed fail-closed behavior on missing/ambiguous correlation, Mission mismatch, and Workflow Step mismatch (`S68-4`/`S68-5`); confirmed duplicate/replayed event delivery does not advance the same Workflow position more than once (`S68-6`); confirmed malformed events and persistence failures produce no partial advancement (`S68-7`). Confirmed no `EngineeringSession`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, Sprint 65/66/67 contract, `src/hosts`, or `src/adapters` file was modified. Independently re-executed `tsc --noEmit`, ESLint, `npm run test` (89 files / 598 tests), `npm run build`, and `npm run test:extension-host:build`, all passing. One Category 6, Informational Observation recorded (O-001: the consumer's `processedEventIds` Set is provably unreachable dead code given the earlier `resultsByEventId` cache check — the idempotency guarantee itself is fully satisfied regardless); non-blocking, no Builder Task. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-005` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-005` certified PASS with zero Category 1–5 findings and one Category 6, Informational Observation (O-001, non-blocking, no Builder Task). Sprint 68 is fully closed. Its implementation closes the loop between Sprint 67's Engineering Decision Correlation and Sprint 57's Governance-Gated Advancement for the Approved-decision path. Recovery Workflow Automation (Sprint 69) remains unscheduled and requires its own future `nexus-plan` Sprint scope proposal.
