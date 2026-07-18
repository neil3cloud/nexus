# RFC-0011 — Engineering Governance Model

**Status:** Final (Amended)
**Version:** 1.1
**Authority:** Normative
**Normative Language:** RFC 2119

Ratified Final by `NEXUS-RAT-2026-07-15-014`. Amended by `NEXUS-RAT-2026-07-16-004` to establish Mission-Scoped Governance Evaluation (see Mission-Scoped Governance Evaluation, below, and Amendment History). Implementation of any capability described here still requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process.

---

# Purpose

This specification defines the Engineering Governance domain: the deterministic evaluation of finalized engineering outcomes against explicit, ratified Repository Policy, producing an attributable Governance Decision.

Nexus's Kernel Canon and multiple existing RFCs already reference "Repository Policies" and "Kernel policies" as inputs to Evidence acceptance (RFC-0002), Shared Reality computation (RFC-0003), Review (RFC-0006; the Kernel Canon's own `# Review` section states "Review SHALL evaluate engineering work against ... Repository Policies"), and Knowledge scope (RFC-0007 lists `Policy` as a Knowledge Scope category) — and RFC-0005 already reserves a "Policy Events" category (`PolicyEvaluated`, `PolicyViolationDetected`) in its non-exhaustive Event Categories list. None of these specifications define, or claim ownership of, what a Repository Policy *is*, how it is evaluated, or what evaluating it produces. This specification closes that gap; it does not open a new one.

This specification owns:

- Repository Policy
- Policy Criterion
- Policy Evaluation
- Governance Decision
- Governance Escalation

No other specification may redefine these concepts. This specification does not redefine any concept owned by RFC-0001 through RFC-0010, and does not redefine RFC-0007's `Policy` Knowledge Scope category label (a Knowledge classification tag, not a governed domain object).

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 2 — Evidence Before Generation (a Governance Decision SHALL derive from accepted Evidence and finalized Review Outcomes, never from generated content directly).
- Canon 6 — Evidence-Driven Review ("Review SHALL evaluate engineering work against ... Repository Policies" — this specification defines what a Repository Policy is and how it is evaluated; Review remains the sole authority over engineering correctness and Review Outcome).
- Canon 9 — Deterministic Engineering (equivalent Policy Evaluation inputs SHALL produce equivalent Governance Decisions).
- Canon 10 — Explainability (every Governance Decision SHALL reference the Policy, Policy Criteria, Evidence, and Review Outcome that produced it).
- Canon 12 — Human Authority (Governance automation SHALL NOT redefine project intent, SHALL NOT silently resolve ambiguity, and SHALL preserve the Sprint Owner as final engineering authority).
- Canon 13 — Contract-Driven Architecture (Governance owns exactly one bounded domain and consumes upstream domains only through their existing public contracts).

Where conflicts exist between this specification and the Kernel Canon, the Kernel Canon SHALL prevail.

This specification satisfies RFC-0010's Architectural Integrity Test: it directly improves AI-assisted software engineering by reducing repetitive Sprint Owner interpretation of already-ratified law; it belongs to a previously unowned but already-referenced architectural domain (Repository Policy); it preserves Evidence Authority, deterministic behavior, explainability, Host independence, and Adapter replaceability by construction (see Boundaries, below); and it is expressed entirely through new, additive contracts rather than modification of existing ones.

---

# Dependencies

Consumes:

- RFC-0001 — Mission Model (every governance evaluation SHALL receive an explicit, mandatory Mission identity as part of its request, independent of Review resolution — see Mission-Scoped Governance Evaluation, below; a Governance Decision references a Mission by identity only and SHALL NOT read or interpret Mission Plan/Task internals beyond published contracts).
- RFC-0002 — Evidence Model (Governance Decisions SHALL reference authoritative Evidence; Governance SHALL NOT establish engineering truth independently of Evidence).
- RFC-0003 — Shared Reality Projection Model (Governance MAY consume a Shared Reality projection as Policy Evaluation input; Governance SHALL NOT bypass or duplicate projection computation, and SHALL treat a stale/absent projection as a missing input, not as an implicit "no opinion").
- RFC-0005 — Domain Event Model (Governance Decisions are published as Domain Events, following the existing Standard Event Envelope, Event Attribution, and Event Causality/Correlation rules; publication SHALL reuse RFC-0005's reserved "Policy Events" category rather than defining a competing category).
- RFC-0006 — Engineering Assessment Model (Governance SHALL consume only a finalized Assessment Outcome — realized in the current implementation as `ReviewOutcome` per `NEXUS-RAT-2026-07-12-006` — and its Findings; Governance SHALL NOT reinterpret, override, or reopen a Review, and SHALL NOT be consulted before a Review reaches a terminal `ReviewStatus`).
- RFC-0007 — Knowledge Model (Governance MAY consume ratified Repository Policy as Knowledge Scope input; Governance SHALL NOT alter Knowledge's existing acceptance criteria or Memory Lifecycle).
- RFC-0010 — Kernel Boundaries (Governance is bound by the Kernel Boundary, Evidence Authority, and Engineering Authority sections; see Boundaries, below).

Owns:

- Repository Policy
- Policy Criterion
- Policy Evaluation
- Governance Decision
- Governance Escalation

---

# Design Goals

Engineering Governance SHALL remain:

- deterministic — equivalent inputs (Policy version, Evidence, Shared Reality, Review Outcome) SHALL always produce the equivalent Governance Decision;
- explainable — every Governance Decision SHALL be traceable to the Repository Policy, Policy Criteria, and Evidence that produced it;
- non-authoritative over intent — Governance SHALL NOT create, alter, or infer Mission objectives;
- subordinate to Human Authority — Governance SHALL escalate rather than silently resolve any input it cannot deterministically evaluate;
- additive — Governance SHALL consume existing Evidence, Shared Reality, Review, and Ratification contracts unmodified; it SHALL NOT alter their ownership, lifecycle, or public contracts.

---

# Architectural Responsibilities

| Concern | Owner |
| --- | --- |
| Engineering truth | Evidence Model (RFC-0002), unmodified |
| Computed engineering understanding | Shared Reality (RFC-0003), unmodified |
| Engineering correctness validation, Review Outcome, Findings | Engineering Assessment Model (RFC-0006), unmodified |
| Accepted engineering understanding | Knowledge Model (RFC-0007), unmodified |
| Mission identity and objective | Mission Model (RFC-0001), unmodified |
| Domain Event envelope, ordering, causality, correlation | Domain Event Model (RFC-0005), unmodified |
| Repository Policy definition, Policy Criterion, deterministic Policy Evaluation, Governance Decision, Governance Escalation | Engineering Governance Model (this specification) |
| Ratification of Repository Policy text and Governance scope | Sprint Owner, recorded in `RATIFICATION_LEDGER.md` (governance process, outside the Kernel) |

Governance does not supersede Review. Review determines whether engineering work is correct; Governance determines whether a *finalized* Review Outcome satisfies applicable Repository Policy. These remain sequential, distinct evaluations, and a Governance Decision SHALL NOT be produced for a non-terminal Review.

---

# Authority Hierarchy

`IMPLEMENTATION_CONSTITUTION.md`'s Implementation Authority ordering (Kernel Canon → RFC Specification Suite → Implementation Constitution → Implementation Technology Standard → Implementation Conventions → Reference Documents → Implementation) and its Governance Artifacts precedence (`IMPLEMENTATION_CONSTITUTION.md` → `RATIFICATION_LEDGER.md` → `IMPLEMENTATION_PLAN.md` → `IMPLEMENTATION_MANIFEST.md` → `IMPLEMENTATION_REPORT.md` → `REVIEW_HISTORY.md`) both govern this specification and are not redefined by it.

A Sprint Owner Ratification does not occupy an independent tier above RFCs. A Ratification's authority derives from, and is bound by, whichever artifact it amends: a Ratification that amends RFC text (as `NEXUS-RAT-2026-07-14-017` through `NEXUS-RAT-2026-07-15-011` did for RFC-0004) takes on RFC-tier authority for that amendment; a Ratification that authorizes Sprint scope operates at the Implementation Plan tier; a Ratification that creates a Repository Policy operates strictly below the Kernel Canon, the RFC Suite, and `IMPLEMENTATION_CONSTITUTION.md`.

Accordingly, the authority ordering applicable to a Repository Policy is:

1. Kernel Canon
2. RFC Specification Suite (RFC-0001 through RFC-0011, once this specification is ratified Final)
3. `IMPLEMENTATION_CONSTITUTION.md`
4. `RATIFICATION_LEDGER.md` (the Ratification that authorized the Repository Policy)
5. Repository Policy (this specification's governed artifact)
6. `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md`
7. Sprint Implementation Records / Implementation

A Repository Policy SHALL NOT contradict, override, or purport to amend any artifact above it in this ordering. A Repository Policy that would require such a contradiction to be evaluated is, by definition, not deterministically evaluable and SHALL produce a Governance Decision of **Escalation Required**, not a silent resolution in either direction.

If two or more applicable Repository Policies conflict with each other (same tier, contradictory Policy Criteria), Policy Evaluation SHALL NOT arbitrate between them. It SHALL produce **Escalation Required**, identifying the conflicting Policies, pending a Sprint Owner ratification that resolves or supersedes one of them.

---

# Repository Policy

A Repository Policy is an explicit, ratified, named rule expressing a condition that a finalized engineering outcome SHALL satisfy.

A Repository Policy SHALL be:

- explicit — expressed as one or more deterministic Policy Criteria, never as freeform natural-language judgment;
- ratified — a Repository Policy SHALL originate only from an approved Ratification (`RATIFICATION_LEDGER.md`) or an equivalently Sprint-Owner-authorized source; Governance SHALL NOT invent, infer, or optimize policy;
- immutable per version — once ratified, a specific Repository Policy version's Policy Criteria SHALL NOT be mutated;
- versioned by supersession — a Repository Policy modification SHALL create a new Repository Policy version through a new Ratification; it SHALL NOT overwrite a prior version. The prior version SHALL remain permanently preserved and remain the version of record for every Policy Evaluation and Governance Decision that cited it;
- attributable — a Repository Policy SHALL reference the Ratification or repository law that authorized it.

A Policy Criterion is one deterministic, individually evaluable condition within a Repository Policy (for example: "Review Outcome SHALL be Accepted or Accepted With Observations"; "no Finding of Severity Critical SHALL remain unresolved"). A Policy Criterion SHALL be evaluable from Evidence, Shared Reality, and/or a finalized Review Outcome alone, through an explicit deterministic predicate, without additional interpretation, inference, or unrestricted model judgment.

---

# Policy Evaluation

Policy Evaluation is the deterministic act of evaluating one specific, identified Repository Policy version's Policy Criteria against a specific finalized engineering outcome (a completed Review, at minimum), for exactly one Mission (see Mission-Scoped Governance Evaluation, below).

Policy Evaluation SHALL:

- execute for exactly one explicit, mandatory Mission identity, supplied as part of the evaluation request;
- consume only finalized Review Outcomes, never an in-progress Review;
- consume only authoritative Evidence and/or a computed Shared Reality projection, never generated content directly;
- evaluate each Policy Criterion through an explicit deterministic predicate only; no Policy Criterion evaluation step SHALL invoke unrestricted, non-deterministic model judgment as part of the evaluation path itself;
- produce the same result for the same (Mission identity, Repository Policy version, Evidence, Shared Reality, Review Outcome, applicable Ratifications) input every time (Canon 9);
- record which Policy Criteria were satisfied, which were violated, and which could not be deterministically evaluated.

If any Policy Criterion cannot be deterministically evaluated from the available Evidence, Shared Reality, and Review Outcome — including because the required input does not yet exist, is stale, or is ambiguous — Policy Evaluation SHALL NOT guess and SHALL NOT default to satisfied. It SHALL produce a Governance Escalation (or, if the missing input is a precondition rather than an ambiguity, a **Deferred** Governance Decision; see Governance Decision, below) for that criterion.

---

# Mission-Scoped Governance Evaluation

Every governance evaluation SHALL execute within exactly one Mission boundary.

The evaluation request SHALL include an immutable Mission identity (`MissionId`).

`MissionId` SHALL be required for every governance evaluation. It SHALL NOT be:

- optional;
- inferred from Ratification data;
- inferred from Repository Policy data;
- synthesized;
- defaulted;
- treated as a fallback value.

## Governance Decision Attribution

Every produced `GovernanceDecision` SHALL identify the Mission for which the evaluation occurred.

The decision's Mission identity SHALL originate from the governance evaluation request, not from the referenced Review.

When the referenced Review resolves successfully, its own Mission identity SHALL equal the evaluation request's Mission identity. A mismatch SHALL produce **Escalation Required**.

## Missing or Unresolvable Review

When the referenced Review is missing or unresolvable:

- governance evaluation SHALL still produce a `GovernanceDecision` of **Escalation Required**;
- the `GovernanceDecision` SHALL retain the explicit evaluation request's Mission identity;
- no Review-derived Mission lookup is required or permitted for this case;
- no exception, thrown error, or other non-`GovernanceDecision` outcome SHALL replace the required `GovernanceDecision`.

This preserves this specification's existing Failure and Conflict Handling guarantee that a missing or unresolvable Review SHALL deterministically produce `Escalation Required`, never an unhandled failure.

## Domain Event Publication

A `GovernanceDecisionRecorded` Domain Event (or equivalently named Policy Event; see Dependencies, above) SHALL obtain its `missionId`/Mission Attribution exclusively from the Mission identity already stored on the persisted `GovernanceDecision`.

Because every `GovernanceDecision` carries a mandatory Mission identity under this section, the corresponding Domain Event SHALL always satisfy RFC-0005's Event Attribution requirement ("Attribution SHALL include: Mission") structurally, through the event's ordinary required fields.

No implementation SHALL omit Mission attribution from a Governance Domain Event, weaken RFC-0005's Event Attribution requirement, or use a type-unsound construct (such as a cast past a required field) to publish an event that does not structurally conform to the RFC-0005 Domain Event envelope.

---

# Governance Decision

A Governance Decision is the immutable, attributable outcome of applying one identified Repository Policy version's Policy Evaluation to one finalized engineering outcome.

A Governance Decision SHALL be exactly one of the following four mutually exclusive values:

## Approved

- **Required inputs:** the applicable Repository Policy version; a finalized (`ReviewStatus: Completed`) Review Outcome; all Evidence referenced by the Policy's Criteria.
- **Precondition:** every applicable Policy Criterion was deterministically evaluated and satisfied.
- **Meaning:** the finalized engineering outcome satisfies the applicable Repository Policy as evaluated.
- **Permitted downstream effect:** the Governance Decision MAY be consumed by a downstream Kernel capability (in a future Sprint) as one input toward an already-existing gate (for example, a future Knowledge capture precondition); it is a recorded fact, not a command.
- **Prohibited side effects:** SHALL NOT itself mutate Mission, Review, Knowledge, or Execution state; SHALL NOT itself trigger Knowledge capture, Mission advancement, or any other domain operation.
- **Human confirmation required:** No, for recording the Decision itself. Any consumption of an Approved Governance Decision to gate a real state transition remains subject to whatever human-authority rule already governs that transition (for example, RFC-0004's existing "Human authority SHALL supersede automated execution decisions").

## Rejected

- **Required inputs:** identical to Approved.
- **Precondition:** at least one applicable Policy Criterion was deterministically evaluated and violated.
- **Meaning:** the finalized engineering outcome does not satisfy the applicable Repository Policy as evaluated.
- **Permitted downstream effect:** recorded as a Governance Decision Domain Event only; MAY inform a future human or Kernel consumer that remediation is required.
- **Prohibited side effects:** SHALL NOT reopen the Review, alter the Review Outcome, or cancel/fail the Mission; SHALL NOT block any operation that is not already, separately, gated on Governance by an explicit, ratified rule.
- **Human confirmation required:** No, for recording the Decision itself; the Sprint Owner remains free to override or ratify an exception through existing governance channels.

## Deferred

- **Required inputs:** the applicable Repository Policy version; the current Mission/Review/Evidence state, which is incomplete relative to what the Policy requires.
- **Precondition:** a required upstream input (Evidence, Shared Reality, or a finalized Review Outcome) does not yet exist. This is distinct from RFC-0004's `Blocked` Task Execution State, which concerns Task dependency satisfaction, not Policy Evaluation readiness; the two SHALL NOT be conflated, confused, or cross-referenced as equivalent.
- **Meaning:** evaluation cannot yet be attempted; no Policy Criterion has been evaluated as satisfied or violated.
- **Permitted downstream effect:** none beyond recording that evaluation was attempted and could not proceed.
- **Prohibited side effects:** SHALL NOT be treated as, or reported as, either Approved or Rejected by any consumer.
- **Human confirmation required:** No. A Deferred Decision resolves automatically into a new Policy Evaluation once its missing input becomes available; it does not require Sprint Owner action unless the missing input itself is blocked on a human decision elsewhere.

## Escalation Required

- **Required inputs:** the applicable Repository Policy version and whatever inputs exist; the specific obstruction is an ambiguity, conflict, or unsupported condition, not a missing input.
- **Precondition:** at least one applicable Policy Criterion could not be deterministically evaluated despite all required inputs being present (for example: conflicting applicable Repository Policies; a Policy Criterion referencing an undefined term; a Policy version gap), or the applicable Policy itself is ambiguous, conflicting, or absent for the case presented.
- **Meaning:** repository law, as it currently exists, does not deterministically resolve this case.
- **Permitted downstream effect:** creates a Governance Escalation record (see below); MAY be surfaced to the Sprint Owner through existing Host/reporting mechanisms in a future Sprint.
- **Prohibited side effects:** SHALL NOT default to Approved or Rejected under any circumstance; SHALL NOT be silently retried with relaxed criteria.
- **Human confirmation required:** Yes — resolution SHALL occur only through a new or amended Repository Policy Ratification, or direct Sprint Owner decision recorded as repository law (see Governance Escalation, below).

No Governance Decision, of any value, SHALL mutate Mission, Review, Knowledge, Execution, or any other repository state as a side effect of being produced. A Governance Decision is a recorded fact about a Policy Evaluation, not a command.

A Governance Decision SHALL reference: the Mission identity for which the evaluation was requested (see Mission-Scoped Governance Evaluation, above), the Repository Policy and version applied, the Policy Criteria evaluated and their individual results, the consumed Evidence references, the consumed Review reference, any applied Ratifications, and a deterministic timestamp/causality position consistent with the existing Domain Event envelope (RFC-0005).

A Governance Decision SHALL NOT:

- redefine or override the Review Outcome it consumed;
- create, alter, or infer a Mission objective;
- be produced for a Review that has not reached a terminal, finalized `ReviewStatus`.

---

# Governance Escalation

A Governance Escalation is the explicit, attributable record that a Governance Decision could not be reached deterministically and requires Sprint Owner (human) resolution.

A Governance Escalation SHALL identify exactly which Policy Criterion, Policy ambiguity, Policy conflict, or unsupported condition prevented a deterministic Governance Decision. A Governance Escalation SHALL NOT be silently resolved by Governance itself; resolution SHALL occur only through:

- a new Repository Policy Ratification that supersedes the ambiguous or conflicting Policy version; or
- direct Sprint Owner decision recorded as repository law.

Escalation is not a failure mode to be minimized away — it is the mechanism by which Canon 12 (Human Authority) is preserved when repository law does not yet cover a case. An implementation that reduces Escalation frequency by weakening Policy Criterion determinism, rather than by the Sprint Owner ratifying additional Repository Policy coverage, does not conform to this specification.

---

# Boundaries

Engineering Governance SHALL NOT:

- redefine Mission objectives or Mission intent (RFC-0001, unmodified);
- autonomously create a Mission;
- autonomously modify a Mission objective;
- autonomously amend an RFC;
- autonomously create, amend, or withdraw a Sprint Owner Ratification;
- autonomously grant architectural approval (Reviewer certification remains governed by `nexus-review` and `REVIEW_HISTORY.md`);
- autonomously mutate any repository artifact, including `RATIFICATION_LEDGER.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, or any RFC;
- autonomously activate a Sprint;
- perform unrestricted architectural deliberation, reasoning, or judgment outside deterministic Policy Criterion evaluation;
- replace final human engineering authority; a Governance Decision is a recommendation/gate outcome, not an irrevocable action, and remains subject to Sprint Owner override through existing repository governance;
- introduce persistent cognition, reflection loops, or self-directed engineering (Kernel Canon, Architectural Boundaries);
- silently approve a Policy Criterion it cannot deterministically evaluate; such cases SHALL always produce a Deferred or Escalation Required Governance Decision, never an inferred Approval;
- reopen, reinterpret, or override a Review's Outcome or Findings (RFC-0006 remains the sole authority over Review Outcome);
- modify Evidence, Shared Reality, Review, or Knowledge aggregates, repositories, or services;
- modify `src/hosts` or `src/adapters`;
- publish a Governance Domain Event that omits required RFC-0005 Event Attribution fields (including Mission identity), weakens RFC-0005's Event Attribution requirement, or relies on a type-unsound construct to bypass structural conformance with the RFC-0005 Domain Event envelope.

These prohibitions apply to this specification's normative scope; they do not, by themselves, authorize any of the listed actions to any other Kernel capability either. Each remains governed exclusively by its own owning specification and process (RFC amendment: Sprint Owner Ratification process; Sprint activation: `nexus-plan`/`nexus-sprint` process; Reviewer certification: `nexus-review` process).

---

# Failure and Conflict Handling

Engineering Governance SHALL fail closed. The following conditions SHALL NEVER produce an Approved Governance Decision, and SHALL be resolved exactly as specified:

| Condition | Resulting Governance Decision |
| --- | --- |
| Missing Evidence required by an applicable Policy Criterion | Deferred |
| Stale or absent Shared Reality projection required by an applicable Policy Criterion | Deferred |
| Incomplete (non-terminal) Review | Deferred (Policy Evaluation SHALL NOT be attempted at all until `ReviewStatus: Completed`) |
| Two or more applicable Repository Policies conflict | Escalation Required |
| Referenced Repository Policy version does not exist or has no ratified version | Escalation Required |
| Applicable Ratifications are contradictory | Escalation Required |
| A Policy Criterion references a condition this specification or its implementation does not support evaluating | Escalation Required |
| Repository state inconsistency that prevents reliable input resolution (for example, an Evidence reference that no longer resolves) | Escalation Required |
| Referenced Review is missing | Escalation Required (the `GovernanceDecision` SHALL retain the evaluation request's Mission identity; see Mission-Scoped Governance Evaluation, above) |
| Referenced Review is unresolvable | Escalation Required (the `GovernanceDecision` SHALL retain the evaluation request's Mission identity; see Mission-Scoped Governance Evaluation, above) |
| Resolved Review's Mission identity does not match the evaluation request's Mission identity | Escalation Required |

Deferred is used exactly when the obstruction is the temporary absence of a required input that is expected to eventually exist through normal engineering progression. Escalation Required is used exactly when the obstruction is an ambiguity, conflict, or unsupported condition that will not resolve through normal engineering progression and instead requires a governance action (Ratification or Sprint Owner decision).

---

# Explainability

Every Policy Evaluation and every Governance Decision SHALL identify:

- the Mission for which the evaluation was requested;
- the evaluated Repository Policy and its specific version;
- the applicable Policy Criteria considered;
- the consumed Evidence references;
- the consumed Review reference and its finalized Outcome;
- any Ratifications applied during evaluation;
- which Policy Criteria were satisfied;
- which Policy Criteria were violated;
- the Governance Escalation reason, when the Decision is Escalation Required.

Hidden reasoning SHALL NOT influence a Governance Decision, consistent with Canon 10.

---

# Non-Goals

Engineering Governance is not:

- an autonomous project manager;
- a substitute for Review (RFC-0006);
- a policy *authoring* tool — Repository Policy text is authored and ratified through the existing Sprint Owner ratification process, not generated or inferred by Governance;
- a general-purpose rules engine for concerns outside finalized-engineering-outcome evaluation;
- an amendment mechanism for the Kernel Canon, any RFC, `IMPLEMENTATION_CONSTITUTION.md`, or `RATIFICATION_LEDGER.md`.

---

# Conformance

An implementation conforms to RFC-0011 only if it:

- executes every governance evaluation for exactly one explicit, mandatory Mission identity, supplied by the evaluation request and never inferred, synthesized, defaulted, or omitted;
- attributes every `GovernanceDecision` and its corresponding Domain Event with that Mission identity, satisfying RFC-0005's Event Attribution requirement structurally and without type-unsound constructs;
- produces `Escalation Required` for a missing Review, an unresolvable Review, and a resolved Review whose Mission identity does not match the evaluation request's Mission identity — never an unhandled exception in place of a `GovernanceDecision`;
- evaluates only ratified Repository Policy, never invented or inferred policy;
- produces deterministic Governance Decisions for equivalent inputs, using explicit predicates rather than unrestricted model judgment within the evaluation path;
- fails closed to Deferred or Escalation Required for every condition enumerated under Failure and Conflict Handling, never to Approved;
- escalates every non-deterministic case rather than resolving it silently;
- consumes Evidence, Shared Reality, and Review Outcomes only through their existing, unmodified public contracts, and only after a Review reaches a terminal `ReviewStatus`;
- does not mutate Mission, Review, Knowledge, Execution, or repository-governance state as a side effect of producing a Governance Decision;
- preserves the Sprint Owner as final engineering authority, including for RFC amendment, Ratification creation, architectural approval, repository mutation, and Sprint activation;
- preserves full attribution and explainability for every Governance Decision and Escalation.

---

# Implementation Guidance

This specification is implementation independent. Implementation sequencing, API shape, internal representation, and the concrete Domain Event names published under RFC-0005's "Policy Events" category are governed by the Implementation Plan and the corresponding Sprint Implementation Record(s), not by this specification — mirroring the existing pattern by which `NEXUS-RAT-2026-07-12-006` (Review) and `NEXUS-RAT-2026-07-13-003` (Knowledge) separately ratified concrete implementation-layer vocabulary for an already-approved RFC domain.

This specification does not itself authorize implementation. Implementation of any capability described here requires its own Sprint scope ratification, per `nexus-plan`'s governance process.

---

# Amendment History

- v0.1 (2026-07-15) — Initial Draft, authored by `nexus-plan` per `NEXUS-RAT-2026-07-15-013`.
- v0.2 (2026-07-15) — Revised per Sprint Owner pre-ratification review. Renamed the fourth Governance Decision value from `Blocked` to `Deferred` to eliminate a terminology collision with RFC-0004's existing `Blocked` Task Execution State. Added Authority Hierarchy, per-value Decision Semantics (required inputs/preconditions/meaning/permitted effect/prohibited side effects/human-confirmation requirement), explicit Failure and Conflict Handling table, expanded Boundaries enumerating prohibited autonomous actions (Mission creation, Mission objective modification, RFC amendment, Ratification creation, architectural approval, repository mutation, Sprint activation), and explicit alignment with RFC-0005's reserved "Policy Events" category.
- v1.0 (2026-07-15) — Ratified Final by `NEXUS-RAT-2026-07-15-014`, without further textual change from v0.2.
- v1.1 (2026-07-16) — Amended by `NEXUS-RAT-2026-07-16-004` to add Mission-Scoped Governance Evaluation as a new binding section: every governance evaluation SHALL receive an explicit, mandatory Mission identity independent of Review resolution; every `GovernanceDecision` retains that Mission identity; a resolved Review's Mission identity SHALL match the evaluation request's Mission identity (mismatch → `Escalation Required`); a missing or unresolvable Review continues to produce `Escalation Required`, retaining the evaluation request's Mission identity, never an unhandled exception; Domain Event publication obtains Mission identity exclusively from the persisted `GovernanceDecision`, satisfying RFC-0005's unconditional Event Attribution requirement structurally, without casts or omitted required fields. This amendment withdraws no other Sprint 52–55 authorized concept and does not modify RFC-0005. Originates from `NEXUS-REV-2026-07-16-004-F-001` (Category 3, Specification Conflict) and its Recovery Review history (`NEXUS-REV-2026-07-16-003`, `-004`, `-005`).
