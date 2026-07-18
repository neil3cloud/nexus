# Sprint 69 — Recovery Workflow Automation

## Status

✅ Approved — `NEXUS-REV-2026-07-17-006` (fully closed with zero open findings of any blocking category; one Category 6, Informational Observation, no Builder Task). Ratified by `NEXUS-RAT-2026-07-17-007`, implementing RFC-0004 v1.16 (`NEXUS-RAT-2026-07-17-006`).

## Objective

Wire the existing `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 58/59, frozen contract) to an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, resolve the exact Engineering Session and Workflow Step attribution for that Governance Decision through Sprint 67's `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, and invoke the existing Recovery Requirement creation path deterministically for Rejected Governance Decisions only — closing the loop between Sprint 67's correlation record and Recovery Requirement's existing creation authority, as a sibling consumer to Sprint 68's advancement path, without introducing recovery execution, resolution, or withdrawal.

## RFC Coverage

- RFC-0004 v1.16 (Partial — implements exactly the Recovery Workflow Automation section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Ratification

- `NEXUS-RAT-2026-07-16-015` — Milestone 10 Objective, Architectural Boundary, Initial Capability Sequence (unmodified).
- `NEXUS-RAT-2026-07-16-018`/`-019` — Prerequisite Foundation (Sprint 65/66, frozen; outbound half of the attribution gap).
- `NEXUS-RAT-2026-07-17-002`/`-003` — RFC-0004 v1.14 amendment and Sprint 67 (Engineering Decision Correlation Foundation, frozen; inbound half of the attribution gap and this Sprint's attribution source).
- `NEXUS-RAT-2026-07-17-004`/`-005` — RFC-0004 v1.15 amendment and Sprint 68 (Event-Driven Workflow Advancement, frozen; sibling consumer of the same event type, distinct responsibility).
- `NEXUS-RAT-2026-07-17-006` — RFC-0004 v1.16 amendment, defining Recovery Workflow Automation.
- `NEXUS-RAT-2026-07-17-007` — authorizes this Sprint, including the binding Existing Consumer Ownership, Subscription Lifecycle, and Consumer Separation rules below.

## Authorized Concepts

- Extending `RecoveryRequirementGovernanceDecisionConsumer` with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition (or the existing canonical consumer-registration mechanism), exactly once per Kernel composition.
- On receipt of `GovernanceDecisionRecorded`: validate the event; resolve the referenced `GovernanceDecision`; verify its outcome is Rejected; resolve its Engineering Decision Correlation via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; obtain the correlation's authoritative Mission/Engineering-Session/Workflow-Step attribution; validate attribution consistency between the event, the `GovernanceDecision`, and the correlation; invoke the existing Recovery Requirement creation path.
- Only a Rejected `GovernanceDecision` may result in Recovery Requirement creation. Approved, Deferred, and Escalation Required produce a deterministic no-recovery result — not a technical failure.
- Fail-closed handling: missing correlation, ambiguous correlation, or any Mission/Engineering-Session/Workflow-Step mismatch produces no Recovery Requirement creation and no aggregate mutation, with deterministic diagnostics — never a silent no-op indistinguishable from success.
- Idempotent handling of duplicate/replayed `GovernanceDecisionRecorded` delivery using Recovery Requirement's existing deterministic (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) creation key and event identity, so no more than one Recovery Requirement is ever created for the same combination.
- Additive `createKernelServices()` composition wiring establishing the subscription.
- `IMPLEMENTATION_MANIFEST.md` Sprint 68 status-line synchronization (documentation-only correction; already applied by `nexus-plan`).

## Existing Consumer Ownership (binding, per `NEXUS-RAT-2026-07-17-007`)

`RecoveryRequirementGovernanceDecisionConsumer` SHALL be extended, not replaced; a second recovery consumer SHALL NOT be introduced. Its existing direct `handleGovernanceDecisionRecorded(...)`-equivalent capability MAY be retained internally, but production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — production event handling SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

## Subscription Lifecycle (binding, per `NEXUS-RAT-2026-07-17-007`)

Kernel composition SHALL ensure the consumer subscribes exactly once; repeated service retrieval SHALL NOT create duplicate subscriptions; no new general-purpose event-consumer framework is authorized.

## Consumer Separation (binding, per `NEXUS-RAT-2026-07-17-007`)

`GovernanceGatedWorkflowAdvancementConsumer` (Sprint 68) and `RecoveryRequirementGovernanceDecisionConsumer` (this Sprint) SHALL remain two separate `EventBus` subscriptions to `GovernanceDecisionRecorded`, each independently exactly-once per Kernel composition; neither SHALL be merged into, replace, or depend on the other's handling result. Sprint 68's behavior SHALL remain unchanged: `GovernanceGatedWorkflowAdvancementConsumer` SHALL NOT create Recovery Requirements, and `RecoveryRequirementGovernanceDecisionConsumer` SHALL NOT advance Workflow state.

## Deferred Concepts

- Recovery-plan generation, AI remediation planning, or automatic recovery execution.
- Recovery Requirement resolution or withdrawal.
- Event-driven re-advancement after recovery.
- Automatic Builder invocation.
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing of any kind.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, Mission Engineering Group, or Event-Driven Workflow Advancement (Sprint 68).

## Acceptance Criteria

- The existing Recovery consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no Recovery Requirement creation and no aggregate mutation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, and the correlation before Recovery Requirement creation; any mismatch fails closed.
- A Rejected `GovernanceDecision` invokes the existing Recovery Requirement creation path without the consumer constructing or persisting a Recovery Requirement directly.
- Approved, Deferred, and Escalation Required `GovernanceDecision` values produce a deterministic no-recovery result and create no Recovery Requirement.
- Duplicate/replayed event delivery does not create more than one Recovery Requirement for the same (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination and produces no duplicate effective side effects.
- Sprint 68's `GovernanceGatedWorkflowAdvancementConsumer` behavior is unchanged; the two consumers remain independent and neither duplicates the other's responsibility.
- No `EngineeringSession` (beyond its existing, unmodified public operations), `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`'s existing lifecycle/creation contract, `Mission`, Sprint 65/66/67/68 contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.16) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Required Test Matrix

- Subscription registration and exactly-once-per-composition behavior; repeated service resolution does not duplicate subscriptions.
- Rejected decision → correlation resolved → exactly one Recovery Requirement created via the existing creation path.
- Approved / Deferred / Escalation Required decision → deterministic no-recovery result, no Recovery Requirement created.
- Missing correlation for a `governanceDecisionId` → fail closed, no Recovery Requirement created.
- Ambiguous correlation (more than one match without a uniquely-identifying key) → fail closed, no Recovery Requirement created.
- Mission mismatch between event, `GovernanceDecision`, and correlation → fail closed.
- Workflow Step mismatch between correlation and governed runtime position → fail closed.
- Duplicate/replayed event delivery for a Rejected decision → no duplicate Recovery Requirement; existing Recovery Requirement returned.
- Missing `GovernanceDecision` → deterministic rejection, no Recovery Requirement created.
- Malformed `GovernanceDecisionRecorded` event → deterministic rejection.
- Repository/persistence failure → no partial Recovery Requirement state.
- Sprint 68 non-regression: `GovernanceGatedWorkflowAdvancementConsumer`'s existing behavior (Approved-decision advancement, non-advancing results for Rejected/Deferred/Escalation Required) is unchanged by this Sprint's changes.
- Kernel composition / production-drift protection (no `src/hosts`/`src/adapters` file touched; no forbidden file modified).
- Zero direct aggregate mutation by the consumer (Recovery Requirement creation occurs only through the existing creation path).

## Builder Responsibilities

- Implement exactly the Authorized Concepts above under `src/kernel/execution/`, extending `recovery-requirement-governance-decision.consumer.ts` and its Kernel composition wiring in `create-kernel-services.ts`.
- Cover the Required Test Matrix in full.
- Stop and report, per `IMPLEMENTATION_CONSTITUTION.md` "Documentation Before Code" and the Builder Stop Conditions below, if any Authorized Concept cannot be implemented without touching a file this Sprint forbids, or without inferring attribution from a source not authorized above.

## Builder Stop Conditions

The Builder SHALL stop and report if:

- the existing Recovery consumer cannot subscribe deterministically;
- correlation cannot resolve by Governance Decision identity;
- Recovery Requirement creation cannot be invoked through the existing service without direct aggregate construction bypassing it;
- idempotency requires a second recovery identity or deduplication model;
- attribution cannot be validated without changing Sprint 67's frozen contracts;
- implementation requires Workflow advancement;
- implementation requires recovery execution, resolution, or withdrawal;
- implementation requires modifying Sprint 68's `GovernanceGatedWorkflowAdvancementConsumer` or its certified behavior;
- Host or Adapter changes are required.

No speculative retry, fallback attribution, duplicate consumer, or direct aggregate mutation is authorized.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` documents implemented capability, RFC coverage, assumptions, limitations, and validation summary, consistent with prior Sprints.
- `IMPLEMENTATION_MANIFEST.md` gains a Sprint 69 section upon implementation, per established repository practice.
- No RFC, Kernel Canon, or Ratification file is modified by the Builder; RFC-0004 v1.16 and both ratifications are already recorded by `nexus-plan`.

## Known Limitations

- This Sprint does not implement recovery execution, Recovery Requirement resolution, or Recovery Requirement withdrawal; a Resolved Recovery Requirement's re-advancement path remains owned by Sprint 60's existing Recovery-Gated Re-Advancement Eligibility, unmodified and untouched by this Sprint.
- This Sprint does not introduce durable delivery, retry, or buffering; an event delivered before its required correlation exists fails closed rather than being retried.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4) remains entirely out of scope and requires its own future `nexus-plan` Sprint scope proposal once this Sprint is certified.

## Builder Results

Implemented.

- Extended `RecoveryRequirementGovernanceDecisionConsumer` with an exactly-once `EventBusContract` subscription to `GovernanceDecisionRecorded`.
- Added event-driven handling that validates the event, resolves `GovernanceDecision`, resolves attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`, verifies Mission and runtime Workflow Step consistency, and fails closed with deterministic diagnostics.
- Added `RecoveryRequirementService.createRecoveryRequirement` as the existing service-level creation path used by both the frozen direct consumer path and the new event-driven path.
- Preserved no-recovery behavior for Approved, Deferred, and Escalation Required decisions.
- Preserved duplicate/replayed event idempotency through event result caching and Recovery Requirement's deterministic attribution key.
- Added Sprint 69 tests covering subscription lifecycle, Rejected creation, non-Rejected no-recovery handling, missing correlation, attribution mismatch, duplicate delivery, missing/malformed Governance Decision events, repository failure, and service-only creation invocation.

No architectural deviations.

## Reviewer Notes

Reviewed as `NEXUS-REV-2026-07-17-006`. Overall Disposition: PASS. Independently re-verified in source that `RecoveryRequirementGovernanceDecisionConsumer` was extended rather than replaced, subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition (guarded by `subscriptionHandles.length > 0`, confirmed by test `S69-1`, which also confirms this subscription coexists independently alongside Sprint 68's `GovernanceGatedWorkflowAdvancementConsumer` subscription to the same event type), resolves attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId` with no caller-supplied substitute, validates Mission/GovernanceDecision/correlation/WorkflowStep-runtime-position consistency before creation, and invokes only `RecoveryRequirementService.createRecoveryRequirement` for creation with zero direct aggregate construction by the consumer (`S69-9`). Confirmed Approved/Deferred/Escalation Required decisions produce a deterministic `NotCreated` result and create no `RecoveryRequirement` (`S69-3`); confirmed fail-closed behavior on missing/ambiguous correlation, Mission mismatch, and Workflow Step mismatch (`S69-4`/`S69-5`); confirmed missing `GovernanceDecision`, malformed events, and repository failure produce no partial state (`S69-7`/`S69-8`); confirmed duplicate/replayed event delivery does not create more than one Recovery Requirement, protected at both the consumer's event-identity cache and the service's existing attribution-key check (`S69-6`). Confirmed `GovernanceGatedWorkflowAdvancementConsumer` and its Sprint 68 test file carry a zero-line diff, and the full Sprint 68 test suite passed unchanged in the same run, evidencing the binding Consumer Separation rule without a new joint test. Confirmed no `EngineeringSession` (beyond its existing, unmodified `getEngineeringSession` read), `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `Mission`, Sprint 65/66/67/68 contract, `src/hosts`, or `src/adapters` file was modified. Independently re-executed `tsc --noEmit`, `npm run lint -- --quiet`, `npm run test` (89 files / 609 tests), `npm run build`, and `npm run test:extension-host:build`, all passing and matching the Builder's reported counts. One Category 6, Informational Observation recorded (O-001: the Sprint 62 integration harness's Recovery consumer wiring still uses the legacy caller-supplied `handleGovernanceDecisionRecorded` path rather than the new production auto-subscription/`handleEvent` path, so full attribution-resolution coverage is provided at the unit level instead — an established pattern already certified for Sprint 68); non-blocking, no Builder Task. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-17-006` for the complete review.

## Final Disposition

**Approved.** `NEXUS-REV-2026-07-17-006` certified PASS with zero Category 1–5 findings and one Category 6, Informational Observation (O-001, non-blocking, no Builder Task). Sprint 69 is fully closed. Its implementation closes the recovery half of the Milestone 10 event-driven loop, as a sibling consumer to Sprint 68's advancement path over the same `GovernanceDecisionRecorded` event. Autonomous Engineering Integration Validation (Sprint 70) remains unscheduled and requires its own future `nexus-plan` Sprint scope proposal.
