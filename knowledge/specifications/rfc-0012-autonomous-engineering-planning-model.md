# RFC-0012 — Autonomous Engineering Planning Model

**Status:** Final
**Version:** 1.0
**Authority:** Normative
**Normative Language:** RFC 2119

Ratified Final by `NEXUS-RAT-2026-07-17-010`, following Sprint 71's Reviewer certification (`NEXUS-REV-2026-07-17-010`) and the Sprint Owner's 16-point consistency review. Implementation of any capability described here still requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process.

---

# Purpose

This specification defines the Autonomous Engineering Planning domain: the deterministic, human-reviewed, human-governed proposal of a Mission Plan by a planner (human or Adapter-driven), prior to and independent of that plan's activation as an executable RFC-0001 Mission Plan.

`NEXUS-RAT-2026-07-17-009` opened Milestone 11 — Autonomous Engineering Planning Readiness with the binding Objective: "Enable governed, human-reviewed autonomous Mission Plan proposal, built on the corrected Mission Completion baseline established by RFC-0001 v1.2 and Sprint 71," and the binding Architectural Boundary that Milestone 11 SHALL NOT redefine Mission, active Mission Plan, Task, Task Graph, Mission completion, Governance Decision, Review, or Shared Reality. This specification implements that Objective within that Boundary.

This specification owns:

- Planning Policy
- Proposed Mission Plan
- Proposed Plan Revision
- Proposed Task
- Proposed Task Dependency
- Planner Attribution
- Proposal Lifecycle
- Planning Correlation (the Proposal-domain analogue of RFC-0004's Engineering Decision Correlation)
- Structural Plan Validation
- Planning Diagnostics
- Activation (the atomic conversion of an Approved Proposed Plan Revision into RFC-0001-owned executable state)

No other specification may redefine these concepts. This specification does not redefine any concept owned by RFC-0001 through RFC-0011.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 2 — Evidence Before Generation (a Proposed Mission Plan is speculative content; it SHALL NOT be treated as engineering truth, and SHALL NOT become executable until Reviewed, Governed, and Approved).
- Canon 6 — Evidence-Driven Review (Proposal Review reuses RFC-0006 `Review` unmodified; the Proposed Plan Revision is the artifact under Review).
- Canon 9 — Deterministic Engineering (equivalent Proposal inputs SHALL produce equivalent Structural Plan Validation and Activation outcomes).
- Canon 10 — Explainability (every Activation SHALL be traceable to its exact Proposed Plan Revision, Review, and `GovernanceDecision`).
- Canon 12 — Human Authority (a Proposed Mission Plan SHALL NOT become executable without a terminal, Approved `GovernanceDecision`; autonomous planning proposes, it does not decide).
- Canon 13 — Contract-Driven Architecture (Planning owns exactly one bounded domain and consumes Mission, Review, and Governance only through their existing public contracts).

Where conflicts exist between this specification and the Kernel Canon, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0001 — Mission Model (a Proposed Mission Plan references a Mission by identity only; Activation invokes the existing Mission Planning Service boundary and SHALL NOT bypass RFC-0001's `MissionPlan`/`Task`/`TaskDependency` invariants; RFC-0001 remains the sole owner of executable Mission Plan and Task state).
- RFC-0004 — Execution Model (Planner Attribution MAY reference an `executionRoleId` and, where applicable, an Engineering Session and Execution Session identity, consumed read-only; this specification's Planning Correlation record mirrors RFC-0004's Engineering Decision Correlation pattern without modifying it).
- RFC-0005 — Domain Event Model (Proposal Lifecycle transitions are published as Domain Events following the existing Standard Event Envelope, Event Attribution, and Event Causality/Correlation rules; see Event Catalog, below).
- RFC-0006 — Engineering Assessment Model (Proposal Review reuses `Review` unmodified; a Proposed Plan Revision is the artifact `Review` evaluates; RFC-0006 remains the sole owner of Review production and `ReviewOutcome`).
- RFC-0008 — Kernel Adapter Contract (an Adapter-driven planner produces a Proposed Mission Plan through the existing Adapter Request/Response contract, unmodified; this specification does not define a new Adapter capability).
- RFC-0011 — Engineering Governance Model (Proposal Governance reuses `GovernanceDecision` unmodified; RFC-0011 remains the sole owner of Governance Decision production and semantics).

Owns:

- Planning Policy
- Proposed Mission Plan
- Proposed Plan Revision
- Proposed Task
- Proposed Task Dependency
- Planner Attribution
- Proposal Lifecycle
- Planning Correlation
- Structural Plan Validation
- Planning Diagnostics
- Activation

---

# Design Goals

Autonomous Engineering Planning SHALL remain:

- speculative until Activated — a Proposed Mission Plan SHALL NOT be treated as, or leak into, executable Mission Plan/Task state at any Proposal Lifecycle stage prior to Activation;
- deterministic — equivalent Proposed Plan Revision content SHALL always produce equivalent Structural Plan Validation results and equivalent Activation outcomes;
- non-authoritative over execution — Proposal approval is a Governance Decision, not an execution command; Activation is the only operation that produces executable state, and it does so exclusively through RFC-0001's existing public contracts;
- additive — Planning SHALL consume existing Mission, Review, Governance, Execution Role, and Adapter contracts unmodified; it SHALL NOT alter their ownership, lifecycle, or public contracts;
- provider-neutral — a human planner and an Adapter-driven planner SHALL be represented through the same Planner Attribution model.

---

# Architectural Responsibilities

| Concern | Owner |
| --- | --- |
| Mission identity, executable Mission Plan, Task, Task Graph, Mission completion | Mission Model (RFC-0001), unmodified |
| Execution Roles, Engineering Session, Adapter invocation topology | Execution Model (RFC-0004), unmodified |
| Domain Event envelope, ordering, causality, correlation | Domain Event Model (RFC-0005), unmodified |
| Review production, Review Outcome, Findings | Engineering Assessment Model (RFC-0006), unmodified |
| Adapter contract, Adapter Request/Response | Kernel Adapter Contract (RFC-0008), unmodified |
| Governance Decision production and semantics | Engineering Governance Model (RFC-0011), unmodified |
| Proposed Mission Plan, Proposed Plan Revision, Proposed Task, Proposed Task Dependency, Planner Attribution, Proposal Lifecycle, Planning Correlation, Structural Plan Validation, Planning Diagnostics, Activation | Autonomous Engineering Planning Model (this specification) |

Planning does not supersede Review or Governance. Review determines whether a Proposed Plan Revision is sound; Governance determines whether a Review outcome for that exact revision satisfies applicable Repository Policy and authorizes Activation. These remain sequential, distinct evaluations, mirroring RFC-0011 §"Architectural Responsibilities."

---

# Planning Policy

Planning Policy is deterministic, Sprint-Owner-ratified constraint data consumed, read-only, by Structural Plan Validation and Proposal Lifecycle transition eligibility — analogous in kind to RFC-0004's `ExecutionStrategy` policy data (deterministic policy data, not an evaluation engine).

Planning Policy MAY constrain, at minimum: the maximum Proposed Task count per revision, required Proposed Task field completeness, and required correlation to an existing Mission. Planning Policy is versioned data; its exact schema and content are defined by the Sprint that implements it, subject to its own Sprint Owner ratification.

Planning Policy SHALL NOT:

- modify, set, or infer a Mission's objective (RFC-0001 `MissionObjective`, unmodified) — a Proposed Mission Plan proposes Tasks toward an existing Mission's existing objective, and never proposes or alters the objective itself;
- grant, simulate, substitute for, or bypass Governance approval authority — satisfying Planning Policy is a precondition for a Proposed Plan Revision to be eligible for Review/Governance evaluation, never a substitute for a terminal, Approved `GovernanceDecision`;
- evaluate or gate Activation directly — Activation eligibility is governed exclusively by Planning Correlation's `GovernanceDecision` check (see Activation, below); Planning Policy's role ends at Structural Plan Validation and submission eligibility.

Planning Policy is Repository Policy's (RFC-0011) planning-domain-specific counterpart in kind, not in ownership: RFC-0011 remains the sole owner of `GovernanceDecision` production and Repository Policy evaluation semantics; Planning Policy is deterministic proposal-shape constraint data only, and is never itself a Governance Decision input requiring RFC-0011 evaluation.

---

# Proposed Mission Plan

A Proposed Mission Plan is a speculative, non-executable planning artifact associated with exactly one Mission by identity.

A Proposed Mission Plan SHALL possess:

- an immutable `ProposedMissionPlanId`, assigned at creation;
- an immutable `missionId` reference, resolved the same way established for Mission attribution elsewhere in this repository (never caller-supplied without verification, never inferred);
- Planner Attribution (see below) for its originating Proposed Plan Revision;
- a current Proposal Lifecycle state (see below);
- an ordered, append-only collection of Proposed Plan Revisions.

A Proposed Mission Plan SHALL NOT mutate an existing Proposed Plan Revision once created. A change to proposed content SHALL always produce a new Proposed Plan Revision.

## Proposed Plan Revision

A Proposed Plan Revision is an immutable snapshot of one planning iteration:

- an immutable `ProposedPlanRevisionId`;
- the owning `ProposedMissionPlanId`;
- a monotonically increasing revision number;
- an immutable collection of Proposed Tasks and Proposed Task Dependencies (see below);
- Planner Attribution for this specific revision;
- a creation timestamp and causality/correlation identifiers, consistent with RFC-0005's Domain Event envelope.

## Proposed Task and Proposed Task Dependency

Proposed Task and Proposed Task Dependency are separate, immutable types owned by this specification. They SHALL NOT reuse or inherit RFC-0001's executable `Task` or `TaskDependency` models, and SHALL NOT be constructed as, or coerced into, executable `Task`/`TaskDependency` instances at any point prior to Activation.

A Proposed Task SHALL possess an immutable `ProposedTaskId` (scoped to its owning Proposed Plan Revision), a title, a description, and a Proposed Task Dependency collection referencing other Proposed Tasks within the same revision only.

A Proposed Task Dependency SHALL possess the same self-dependency and duplicate-dependency exclusions RFC-0001 §Task Dependency already establishes for executable Tasks, evaluated independently at the proposal layer by Structural Plan Validation (below) — not by delegating to RFC-0001's `Task` validation, which does not exist for non-executable content.

Proposed Tasks and Proposed Task Dependencies exist solely within their owning Proposed Plan Revision; they possess no independent identity or lifecycle outside it.

---

# Planner Attribution

Planner Attribution is an immutable value object recording who or what produced a Proposed Mission Plan or Proposed Plan Revision, composed entirely from existing repository identities:

- `executionRoleId` — required; normally the canonical Planner role registered through RFC-0004's `RoleRegistry`;
- `actorType` — `Human` or `Adapter`;
- `actorId` — required stable identifier of the human or Adapter that produced the revision;
- `adapterId` — required when `actorType` is `Adapter`, referencing an existing RFC-0008 Adapter identity;
- `engineeringSessionId` — optional; present when planning occurred within an Engineering Session (RFC-0004);
- `executionSessionId` — optional; present when the proposal was produced through an executable Adapter invocation;
- `generatedAt` — a timestamp;
- causality and correlation identifiers, consistent with RFC-0005's Domain Event envelope.

Planner Attribution SHALL remain provider-neutral, SHALL distinguish the stable engineering responsibility (`executionRoleId`) from the concrete producing actor (`actorType`/`actorId`/`adapterId`), and SHALL preserve auditability across both human and Adapter-driven planners. A free-form role-name string alone SHALL NOT be treated as a complete Planner Attribution record. This specification does not introduce a new general-purpose identity subsystem; every field above resolves to an identity already owned by RFC-0004 or RFC-0008.

---

# Proposal Lifecycle

A Proposed Plan Revision SHALL progress through the following states:

```
Draft -> Submitted -> Under Review -> Governed -> Activated
Draft -> Withdrawn
Submitted -> Withdrawn
Under Review -> Rejected
Governed -> Rejected
Governed -> Superseded
```

- **Draft** — the revision has been created and MAY still be superseded by a later revision without formal submission.
- **Submitted** — the revision has been submitted for Review; it SHALL NOT be further mutated (a change SHALL create a new revision).
- **Under Review** — an RFC-0006 `Review` has been initiated for this exact revision through a Planning Correlation record (below), but no final eligible Review outcome has yet been accepted.
- **Governed** — an authoritative RFC-0011 `GovernanceDecision` exists for this exact revision's Review, correlated through the same Planning Correlation record.
- **Activated** — this exact revision has been converted into executable RFC-0001 state through Activation (below). Terminal.
- **Withdrawn** — the planner or an authorized human withdrew the revision before a terminal Review or Governance outcome was reached. Terminal.
- **Rejected** — the Review reached a non-eligible outcome, or the `GovernanceDecision` outcome was not `Approved`. Terminal.
- **Superseded** — a later revision of the same Proposed Mission Plan reached `Governed` with an `Approved` `GovernanceDecision` first. Terminal.

Only a `Governed` revision whose correlated `GovernanceDecision` outcome is `Approved` is eligible for Activation. Review or Governance rejection SHALL NOT be represented merely as a generic lifecycle transition label; the authoritative `Review` and `GovernanceDecision` remain the system of record, referenced by the Planning Correlation, not duplicated or reinterpreted by the Proposal Lifecycle state itself.

A revised proposal SHALL always create a new Proposed Plan Revision; an already `Submitted`, `Under Review`, `Governed`, or `Activated` revision SHALL NOT be mutated.

---

# Planning Correlation

Planning Correlation is the explicit, attributable, append-only record correlating a Proposed Plan Revision with the `Review` (RFC-0006) and `GovernanceDecision` (RFC-0011) subsequently produced for it, mirroring RFC-0004's Engineering Decision Correlation pattern for the Planning domain.

A Planning Correlation record SHALL possess immutable references to:

- `ProposedMissionPlanId`;
- `ProposedPlanRevisionId` (the exact revision under evaluation);
- `missionId`;
- Planner Attribution;
- `reviewId`, appended once Review is initiated;
- `governanceDecisionId`, appended once Governance evaluation produces a decision;
- causation and correlation identifiers.

Each association SHALL be recorded exactly once and SHALL be immutable once recorded, matching RFC-0004's Engineering Decision Correlation append-only rule.

`Review` SHALL evaluate the exact immutable Proposed Plan Revision identified by the Planning Correlation. `GovernanceDecision` SHALL govern the exact Review/Proposed-Plan-Revision correlation. A `GovernanceDecision` SHALL NOT authorize Activation when:

- it references a different Proposed Plan Revision than the one currently correlated;
- the correlated Review is non-terminal;
- the correlated Review reached a non-eligible outcome for Governance evaluation (mirroring RFC-0011's existing terminal-Review precondition);
- Planner Attribution cannot be resolved to a valid `executionRoleId`/`actorId` pair;
- the Proposed Mission Plan has produced a later revision since the Review was initiated;
- the `GovernanceDecision` outcome is not `Approved`;
- the referenced `Review`'s or `GovernanceDecision`'s own `missionId` does not exactly equal the Planning Correlation's `missionId`, mirroring RFC-0004's Engineering Decision Correlation mismatch rule.

Planning Correlation lookup and association SHALL fail closed: a missing Review, missing `GovernanceDecision`, missing Mission reference, missing or ambiguous correlation record, or unresolved Planner Attribution SHALL be treated as a deterministic rejection — never a guessed match, a default, or an implicit pass. No fallback inference is authorized.

This specification does not define a duplicate Planning-specific Review or Governance aggregate. `Review` and `GovernanceDecision` remain owned, unmodified, by RFC-0006 and RFC-0011 respectively.

---

# Structural Plan Validation

Structural Plan Validation is deterministic, proposal-layer-only validation of a Proposed Plan Revision's internal consistency, performed independently of RFC-0001's executable `Task`/`TaskDependency` validation (which does not apply to non-executable content):

- every `ProposedTaskId` referenced by a Proposed Task Dependency SHALL exist within the same Proposed Plan Revision;
- no Proposed Task SHALL declare a dependency on itself;
- no duplicate Proposed Task Dependency SHALL exist between the same ordered pair of Proposed Tasks;
- the Proposed Task Dependency graph SHALL be acyclic (direct and transitive), evaluated using the same Option A cycle-validation approach ratified for RFC-0001 `MissionPlan` (Sprint 3).

Structural Plan Validation SHALL run before a Proposed Plan Revision may transition from `Draft` to `Submitted`, and SHALL be re-run, unconditionally, as a precondition of Activation against the exact revision being activated.

---

# Planning Diagnostics

Planning operations SHALL produce deterministic diagnostics, mirroring the pattern established by every prior domain in this repository, for at minimum:

- invalid Proposed Mission Plan or Proposed Plan Revision definitions;
- Structural Plan Validation failures (missing reference, self-dependency, duplicate dependency, cycle);
- invalid Proposal Lifecycle transitions;
- Planning Correlation association rejections (mismatched revision, non-terminal Review, unresolved Planner Attribution);
- Activation preconditions not satisfied (see Activation, below);
- Activation conversion failures.

---

# Activation

Activation is the atomic, irreversible conversion of exactly one `Governed`, `GovernanceDecision`-`Approved` Proposed Plan Revision into RFC-0001-owned executable state, performed exclusively through the existing Mission Planning Service boundary (RFC-0001, Sprint 3, unmodified).

Activation SHALL:

- re-run Structural Plan Validation against the exact revision being activated and refuse to proceed if it fails;
- re-verify, immediately before conversion, that the revision's Planning Correlation carries a terminal, `Approved` `GovernanceDecision` for that exact revision and no later revision has reached `Governed`/`Approved` first;
- construct executable RFC-0001 `MissionPlan`, `Task`, and `TaskDependency` instances exclusively through `MissionPlanningService`'s existing public operations, invoking no other write path;
- revalidate all RFC-0001 Task and Task Dependency invariants as an unavoidable consequence of using the existing Mission Planning Service boundary — Activation SHALL NOT bypass, duplicate, or weaken them;
- reject partial conversion — if any Proposed Task or Proposed Task Dependency fails conversion or RFC-0001 validation, Activation SHALL produce no executable state at all;
- preserve stable, queryable traceability from the resulting executable `MissionPlan` back to the exact `ProposedMissionPlanId`, `ProposedPlanRevisionId`, `reviewId`, and `governanceDecisionId` that authorized it;
- transition the Proposed Plan Revision to `Activated` only after the executable conversion has been durably persisted, and transition every sibling revision of the same Proposed Mission Plan that had reached `Governed` to `Superseded`;
- be rejected, deterministically and with no state change, when the owning Proposed Mission Plan already has a revision in `Activated` state — a Proposed Mission Plan SHALL produce at most one Activated revision, ever;
- be idempotent when repeated for a revision that is already `Activated`: a repeated Activation invocation for that exact revision SHALL NOT create a second or duplicate executable `MissionPlan`, SHALL NOT be treated as an error requiring resubmission, and SHALL deterministically return the reference to the executable `MissionPlan` already produced by that revision's original Activation;
- resolve concurrent Activation attempts for two different revisions of the same Proposed Mission Plan atomically and exclusively: at most one Activation SHALL succeed and durably persist executable state; every other concurrent attempt SHALL fail closed, observing either the already-`Activated` rejection above or an equivalent deterministic conflict rejection, and SHALL produce no partial or competing executable state.

Activation SHALL NOT introduce a second Mission Plan creation path independent of `MissionPlanningService`, and SHALL NOT allow a Proposed Mission Plan's own lifecycle state to leak into, or be interpreted as, executable Task lifecycle state (`TaskStatus`, Sprint 3, unmodified).

---

# Event Catalog

This specification reserves the following Domain Events, published only after the associated state transition has been successfully persisted, consistent with the Governance Rule established by `NEXUS-RAT-2026-07-13-004` (events represent completed domain facts, not implementation actions):

- `ProposedMissionPlanCreated`
- `ProposedPlanRevisionCreated`
- `ProposedPlanRevisionSubmitted`
- `ProposedPlanRevisionWithdrawn`
- `ProposedPlanRevisionRejected`
- `ProposedPlanRevisionSuperseded`
- `ProposedMissionPlanActivated`

Event publication for any of the above is deferred to the implementing Sprint(s); this specification reserves the names and the completed-fact semantics only. No event SHALL be published for `Under Review` or `Governed` state observation — those are already covered by RFC-0006's and RFC-0011's own existing event catalogs (`ReviewStarted`/`ReviewCompleted`/etc., Governance Decision events) referenced through the Planning Correlation, and this specification SHALL NOT duplicate them.

---

# Boundaries

This specification SHALL NOT:

- redefine Mission, active Mission Plan, Task, Task Graph, Mission completion, `GovernanceDecision`, `Review`, or Shared Reality (RFC-0001/RFC-0006/RFC-0011/RFC-0003, unmodified), per Milestone 11's binding Architectural Boundary;
- permit a Proposed Mission Plan, Proposed Plan Revision, Proposed Task, or Proposed Task Dependency to be treated as executable state prior to Activation;
- permit Activation to write executable state through any path other than `MissionPlanningService`'s existing public operations;
- define a Planning-specific Review or Governance aggregate;
- introduce provider selection, Adapter selection, scheduling, parallel execution, or automatic policy generation;
- touch `src/hosts` or `src/adapters`.

---

# Non-Goals

- Autonomous Mission planning without human-reviewed Governance gating.
- Autonomous or planner-driven creation or modification of a Mission's objective — Mission Objective remains exclusively RFC-0001-owned; a Proposed Mission Plan proposes Tasks toward an existing objective and never proposes the objective itself.
- Self-approval: the actor identified by Planner Attribution as having produced a Proposed Plan Revision SHALL NOT also act as its Reviewer or as the authority producing its `GovernanceDecision`; Review and Governance eligibility rules for this remain owned by RFC-0006/RFC-0011 and are unmodified, but this specification does not authorize any planner-side bypass of them.
- Adapter selection or provider selection for planning or any other purpose.
- Task execution of any kind — Activation produces executable RFC-0001 state; it does not start, complete, cancel, or otherwise execute any Task (RFC-0001 `MissionExecutionService`, unmodified, remains the sole Task execution entry point).
- Workflow orchestration, Workflow Chain participation, or Workflow Step assignment for the Proposal Lifecycle — Proposal Lifecycle states are a distinct, Planning-domain-owned lifecycle, not an RFC-0004 Workflow Chain.
- Automatic or autonomous recovery planning of any kind.
- Dynamic Workflow generation.
- AI deliberation, multi-planner negotiation, or automatic conflict resolution between competing Proposed Mission Plans.
- Automatic Activation upon Governance Approval without an explicit Activation invocation — silent Activation is prohibited.
- Any generalized "decision supersession" or "content revision" framework beyond the Proposal Lifecycle defined here.

---

# Conformance

An implementation of this specification SHALL:

- keep Proposed Mission Plan, Proposed Plan Revision, Proposed Task, and Proposed Task Dependency structurally and behaviorally independent of RFC-0001's executable `MissionPlan`/`Task`/`TaskDependency` until Activation;
- perform Activation exclusively through `MissionPlanningService`'s existing public contract, atomically, idempotently for an already-`Activated` revision, and rejecting every conflicting concurrent Activation attempt;
- reuse `Review` and `GovernanceDecision` unmodified, correlated through Planning Correlation, with Mission-identity mismatch and every other missing/ambiguous reference failing closed;
- enforce Planning Policy as read-only, deterministic proposal-shape constraint data that never sets a Mission objective and never substitutes for a `GovernanceDecision`;
- represent Planner Attribution exactly as specified, for both Human and Adapter-driven planners;
- produce the Planning Diagnostics enumerated above deterministically.

---

# Implementation Guidance

Implementation of any capability described in this specification requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process, consistent with every prior RFC in this suite (see RFC-0011 §"Ratified Final by...", RFC-0004 §"Amendment History"). This specification does not itself authorize implementation.

---

# Amendment History

- v0.1 — Draft. Authorized for drafting by `NEXUS-RAT-2026-07-17-009`. Incorporates Sprint Owner decisions on Proposed Task modeling (separate `ProposedTask`/`ProposedTaskDependency` types, converted at Activation), Proposal Lifecycle (`Draft → Submitted → Under Review → Governed → Activated`, with `Withdrawn`/`Rejected`/`Superseded` terminal branches), Review/Governance reuse (unmodified `Review`/`GovernanceDecision`, correlated through a new Planning Correlation record), and Planner Attribution (`executionRoleId` + `actorType`/`actorId`/`adapterId` + optional session references).
- v0.2 — Draft. Added the previously-missing Planning Policy section and ownership entry, with an explicit boundary that Planning Policy SHALL NOT modify Mission Objective and SHALL NOT grant or substitute for Governance approval authority. Added Activation idempotency for repeated activation of an already-`Activated` revision, explicit rejection of Activation when the owning Proposed Mission Plan already has an Activated revision, and atomic/exclusive resolution of concurrent Activation attempts. Added Planning Correlation Mission-identity mismatch rejection (mirroring RFC-0004 Engineering Decision Correlation) and an explicit fail-closed rule for missing/ambiguous references. Expanded Non-Goals to explicitly exclude autonomous objective creation, self-approval, Adapter/provider selection, Task execution, and workflow orchestration/Workflow Chain participation.
- v1.0 — Final. Ratified by `NEXUS-RAT-2026-07-17-010`, incorporating v0.2 in full following the Sprint Owner's 16-point consistency review with zero further changes required.
