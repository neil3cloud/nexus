# RFC-0011 — Engineering Governance Model

**Status:** Final (Amended)
**Version:** 1.8
**Authority:** Normative
**Normative Language:** RFC 2119

Ratified Final by `NEXUS-RAT-2026-07-15-014`. Amended by `NEXUS-RAT-2026-07-16-004` to establish Mission-Scoped Governance Evaluation (see Mission-Scoped Governance Evaluation, below, and Amendment History). Amended by `NEXUS-RAT-2026-07-18-007` to introduce the closed Governance Evaluation Input Profile model (`ReviewGovernanceEvaluationInput`, unchanged; `CorpusReadinessAcceptanceEvaluationInput`, dormant), the `CurrentProjectionApplicabilityReference` input and recording contract, the separated fail-closed classifications, and the current-applicability requirement. RFC-0003 is not amended. The Corpus-readiness profile is unusable until RFC-0013 v0.6 is authorized, the required Assessment exists, the acceptance policy including its selector is ratified, and implementation is authorized. Amended by `NEXUS-RAT-2026-07-31-001` to establish the Ratification Authority Snapshot Issuance Contract (see Ratification Authority Snapshot Issuance, below, and Amendment History). RFC-0003 is not amended; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it. `NEXUS-RAT-2026-07-15-017` is not amended; `RatificationAttributionValidation` retains sole ownership of Ratification reference resolution and of its three closed validation outcomes. Implementation of any capability described here still requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process. Amended by `NEXUS-RAT-2026-08-02-002` to establish Mission Applicability Scope (see Repository Policy → Mission Applicability Scope, below, and Amendment History). That amendment adds a sixth required Repository Policy attribute and the exact predicate by which a governance evaluation request's explicit Mission identity is validated against a Policy version's declared scope. It deletes, narrows, rewords, and withdraws no existing rule, and it does not edit the Policy Evaluation section; it does add a Mission-applicability precondition to evaluation gating and ten Escalation Required failure mappings, while Policy Criterion evaluation semantics remain unchanged. An absent scope is never treated as repository-wide: a Repository Policy version that declares no scope remains valid for Governance Decisions already produced and is ineligible for any new evaluation until superseded by an explicitly scoped version or covered by a separately ratified migration. RFC-0001 is not amended. RFC-0003 is not amended. `NEXUS-RAT-2026-07-18-007` is not amended; neither authorized Governance Evaluation Input Profile gains, loses, or alters any field. `NEXUS-RAT-2026-07-15-017` is not amended; it retains sole authority over Ratification attribution validation, which Mission Applicability Scope neither replaces nor participates in. `NEXUS-RAT-2026-07-31-001` is not amended; no field is added to or reserved in the Ratification Authority Snapshot schema, and every deferral it declared, including the entire deferral of authorized-subject attestations, remains in force. Corpus Readiness Acceptance Evaluation, including Current Projection Applicability Selection, is not revised. Amended by `NEXUS-RAT-2026-08-03-001` to establish the Governed Repository Policy Corpus Source Contract (see Repository Policy Corpus Source, below, and Amendment History). That amendment defines the exact pinned governed source from which the complete population of Repository Policy versions is enumerated, the extraction grammar and record schema, linear version lineage and the deterministically derived current lineage head per Policy identity, a content commitment verifiable from the pinned source rather than asserted by an assembler, and the corpus root and envelope commitment. It deletes, narrows, rewords, and withdraws no existing rule. It defines no Repository Policy selection rule, eligibility predicate, cardinality rule, or Governance Decision recording shape, and authorizes no implementation, no corpus population, and no Snapshot issuance. RFC-0001 is not amended. RFC-0003 is not amended; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it. `NEXUS-RAT-2026-07-31-001` is not amended; no field is added to, reserved in, reinterpreted within, or read from the Ratification Authority Snapshot schema, and its deferral of automatic Ratification-Ledger ingestion beyond its own source contract is neither narrowed nor excepted. `NEXUS-RAT-2026-07-15-017` is not amended; it retains sole authority over Ratification attribution validation, which corpus assembly neither performs nor substitutes for. `NEXUS-RAT-2026-08-02-002` is not amended; the `MissionApplicabilityScope` record and its closed two-variant union are consumed exactly as ratified, no third variant is declared, and no `ScopeUndeclared` version is migrated, back-filled, annotated, or repaired. Amended by `NEXUS-RAT-2026-08-04-001` to establish the Ratification Authority Snapshot Consumption Correspondence, to carry the governed Ratification subject into the Ratification Authority Record, and to allocate the resulting canonical record encoding the schema version `nexus-ratification-authority-snapshot/3`, and to state the exact field shape of an `Issued` issuance result together with the derivation of its three counts (see Ratification Authority Snapshot Issuance, below, and Amendment History). `NEXUS-RAT-2026-07-15-017` is not amended by that amendment; its binding `RatificationAuthorityRecord` field rule, requiring identifier, date, and subject as recorded in the authority source and permitting no field to be inferred from prose, intent, or Builder assumption, is satisfied exactly rather than narrowed, and all ten conditions of its Required Outcome Mapping remain in force. `NEXUS-RAT-2026-07-16-001` is not amended by that amendment; the derivation of the Ratification Authority Snapshot fingerprint remains owned by `RatificationAttributionValidation`. Amended by `NEXUS-RAT-2026-08-02-001` to establish Repository Policy Selection and Version Binding (see Repository Policy Selection and Version Binding, below, and Amendment History). That amendment is additive in the precise sense that no existing rule, row, bullet, or clause is deleted, narrowed, reworded, or withdrawn; it does, however, add a mandatory selection-and-validation precondition to Policy Evaluation and a mandatory recording obligation to Governance Decision. Policy Criterion evaluation semantics are unchanged. The candidate collection is exactly the current-head universe of the Repository Policy Corpus at one pinned corpus source revision, and a superseded version is never revived as a candidate. `NEXUS-RAT-2026-08-03-001` is not amended; the Repository Policy Corpus Source contract is consumed exactly as ratified, and selection enumerates no corpus, declares no corpus record, derives no current head, computes no content commitment, issues no corpus artifact, and adds no field to any corpus schema. `NEXUS-RAT-2026-08-02-002` is not amended by this amendment either; Mission Applicability Scope, its closed union, its predicate, its ordering, and its encoding are consumed exactly as ratified, and no scope is declared, synthesized, defaulted, mutated, extended, fingerprinted, or migrated by selection. RFC-0001 is not amended. RFC-0003 is not amended. `NEXUS-RAT-2026-07-18-007` is not amended; neither authorized Governance Evaluation Input Profile gains, loses, or alters any field. `NEXUS-RAT-2026-07-15-017` is not amended; selection consumes a precomputed Ratification attribution validation result and produces none. `NEXUS-RAT-2026-07-31-001` is not amended by this amendment; every deferral it declared, including the entire deferral of authorized-subject attestations, remains in force, and the `ratificationSubject` field added by `NEXUS-RAT-2026-08-04-001` is neither altered nor read here. `NEXUS-RAT-2026-08-04-001` is not amended by that amendment; the Ratification Authority Snapshot Consumption Correspondence, its supplied-artifact verification chain, and its canonical consumed order are consumed exactly as ratified. Amended by `NEXUS-RAT-2026-08-05-001` to establish Segmented Lifecycle Scope Selection (see Repository Policy Selection and Version Binding → Pre-Use Verification, below, and Amendment History). That amendment withdraws in full the correspondence's artifact-level refusal of any artifact carrying a `SegmentedLifecycle` record, together with its refusal reason `segmented-lifecycle-scope-selection-unratified`, and requires every verified record to be carried into the consumed state with its declared segments intact and its carried segment order non-authoritative for resolution. It locates the scope-free resolution rule where resolution is owned: `NEXUS-RAT-2026-07-15-017` is amended **by addition only, and in exactly two respects**. First, its accepted `RatificationAuthorityRecord` input domain becomes a **closed structural union of exactly two arms, distinguished by field presence and not by any shared discriminant field**: the pre-existing whole-record arm, preserved exactly, on which `lifecycleResolutionForm` and `lifecycleSegments` are absent and forbidden and the existing record-level status and relation fields apply; and a new segmented arm, on which `lifecycleResolutionForm` is required and exactly `SegmentedLifecycle`, `lifecycleSegments` is required, and the record-level status and relation fields are forbidden. Every other field combination is structurally malformed. Second, its Required Outcome Mapping gains exactly one condition, under which a scope-free Ratification reference matching a **structurally valid, recognized-status, noncontradictory** record whose `lifecycleResolutionForm` is `SegmentedLifecycle` resolves to `Unresolvable` with the exact diagnostic `unresolvable-scope-free-reference-to-segmented-record`. That condition is inserted into **matched-record evaluation alone**. It is reached only after the pre-existing malformed-Ratification-reference and Snapshot-source-unavailable preconditions have succeeded — neither of which is defined, reordered, narrowed, or amended by this amendment — and only after every pre-existing matched-record validity condition has been applied unchanged and in its existing order: a segmented record that is structurally malformed remains `Invalid`, one carrying an unrecognized lifecycle status remains `Unresolvable` under the pre-existing unknown-status condition, and one that is contradictory under the existing meaning of that term remains `Invalid`, each with its own pre-existing diagnostic. Those three outcomes are not reachable through a conforming version 3 artifact, which refuses such a record at V3 as `record-not-encodable` before any consumed state exists; they are preserved as obligations of the validation authority on every other path, exactly as that authority's conditions were already preserved. Divergent statuses across distinct valid segments remain noncontradictory exactly as already ratified. Thereafter no segment is selected, preferred, aggregated, flattened, or arbitrated among, no segment status is mapped to a lifecycle outcome, and neither the reserved `residual` segment nor any `GovernedScope` segment is privileged. **Within the Required Outcome Mapping and the diagnostic vocabulary of `NEXUS-RAT-2026-07-15-017`, and scoped to those alone, no existing condition, outcome, diagnostic, row, or clause is deleted, narrowed, reworded, or withdrawn**, and the pre-existing whole-record input arm is preserved exactly; elsewhere the amendment does withdraw the correspondence's artifact-level refusal and three published expectations, each named exactly in the ratification entry. The closed outcome set remains exactly `Valid`, `Invalid`, and `Unresolvable`, and scope-bearing references, together with any positive resolution of a carved governed scope, are deferred in full. `NEXUS-RAT-2026-08-02-001` is amended by that ratification to a named extent and in no other: Pre-Use Verification Step 5 consumes the amended correspondence, its segmented failure row and its segmented conformance obligation are replaced, its Dependency DEP2 is discharged for scope-free references only, and its published expectations `SV6` and `N23d` are withdrawn and restated. Every other selection rule, ownership boundary, verification step, eligibility conjunct, and dependency of that ratification — including Dependency DEP1 — is preserved verbatim, and its entry octets and Current Status are untouched. `NEXUS-RAT-2026-07-31-001` is not amended; the version 3 record encoding, its schemas, its schema version identifier, its ordering rules, and its three commitment layers are unchanged, and no artifact is migrated, because none has been issued. `NEXUS-RAT-2026-07-16-001` is not amended; the derivation of the Ratification Authority Snapshot fingerprint remains owned by `RatificationAttributionValidation`, and no rendering of it is published here.

---

# Purpose

This specification defines the Engineering Governance domain: the deterministic evaluation of finalized engineering outcomes against explicit, ratified Repository Policy, producing an attributable Governance Decision.

Nexus's Kernel Canon and multiple existing RFCs already reference "Repository Policies" and "Kernel policies" as inputs to Evidence acceptance (RFC-0002), Shared Reality computation (RFC-0003), Review (RFC-0006; the Kernel Canon's own `# Review` section states "Review SHALL evaluate engineering work against ... Repository Policies"), and Knowledge scope (RFC-0007 lists `Policy` as a Knowledge Scope category) — and RFC-0005 already reserves a "Policy Events" category (`PolicyEvaluated`, `PolicyViolationDetected`) in its non-exhaustive Event Categories list. None of these specifications define, or claim ownership of, what a Repository Policy *is*, how it is evaluated, or what evaluating it produces. This specification closes that gap; it does not open a new one.

This specification owns:

- Repository Policy
- Policy Criterion
- Mission Applicability Scope
- Policy Evaluation
- Repository Policy Selection and Version Binding
- Governance Decision
- Governance Escalation
- Ratification Authority Snapshot Issuance
- Repository Policy Corpus Source

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
- RFC-0006 v1.2 — Engineering Assessment Model (Assessment identity, terminal Assessment Outcome, and recorded Projection basis consumed read-only for the `CorpusReadinessAcceptanceEvaluationInput` profile).
- RFC-0002 v1.1 — Evidence Model (transitive; the bound Evidence basis resolves to Exact Content Evidence semantics owned by RFC-0002 v1.1).
- RFC-0003 — Shared Reality Projection Model (Projection identity, Projection Version, Projection Scope, and Projection Freshness consumed read-only; **not amended**).
- RFC-0013 — Corpus Review Model (forward-referenced vocabulary only — Corpus Readiness Result, Corpus Review Basis).

Owns:

- Repository Policy
- Policy Criterion
- Mission Applicability Scope
- Policy Evaluation
- Governance Evaluation Input Profiles
- Repository Policy Selection and Version Binding
- Governance Decision
- Governance Escalation
- Ratification Authority Snapshot Issuance
- Repository Policy Corpus Source

---

# Design Goals

Engineering Governance SHALL remain:

- deterministic, per input profile —
  - for `ReviewGovernanceEvaluationInput`: equivalent Repository Policy version, Mission, finalized Review Outcome, Evidence, and Shared Reality SHALL always produce the equivalent Governance Decision;
  - for `CorpusReadinessAcceptanceEvaluationInput`: equivalent Repository Policy version, Mission, and complete input profile instance — including an equivalent `CurrentProjectionApplicabilityReference` (selector policy and criterion identity/version, resolution result, resolved current Projection where present, freshness determination, and candidate-corpus fingerprint) — SHALL always produce the equivalent Governance Decision. Because current applicability is supplied as a recorded input rather than discovered at evaluation time, determinism does not depend on evaluation-time repository state;
  - for Repository Policy Selection, applicable to both profiles: an equivalent `RepositoryPolicySelectionReference` — equivalent Mission identity, declared input profile kind, pinned corpus source identity, corpus source revision and corpus root, pinned authority snapshot schema version, authority source identity, authority source revision, and authority snapshot envelope commitment, pinned candidate policy references including each candidate's content commitment, scope declaration state and declared `MissionApplicabilityScope`, candidate-set fingerprint, and selection outcome — SHALL always produce the equivalent selected Repository Policy identity and version, or the equivalent non-`Resolved` outcome. Because the candidate set is the current-head universe of one pinned corpus source revision and is supplied as a recorded input rather than discovered at evaluation time, selection determinism does not depend on evaluation-time repository state. Because the recorded outcome SHALL be recomputed from those recorded inputs before use, selection determinism does not depend on the trustworthiness of the supplying caller;
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

# Governance Evaluation Input Profiles

This specification defines a closed set of Governance Evaluation Input Profiles. Exactly two profiles are authorized:

- `ReviewGovernanceEvaluationInput` — the existing profile. Contains the Mission identity and the finalized RFC-0006 Review Outcome, together with the Evidence and Shared Reality inputs the applicable Policy Criteria require. Its semantics, required inputs, failure handling, and wire contract are exactly those of v1.1 and are NOT modified.
- `CorpusReadinessAcceptanceEvaluationInput` — the new profile, defined under Corpus Readiness Acceptance Evaluation, below. DORMANT: it SHALL remain unusable until RFC-0013 Draft v0.6 is authorized, the required terminal RFC-0006 Assessment exists, a Corpus Readiness Acceptance Repository Policy including its deterministic selector is separately authored and ratified, and implementation is separately authorized.

Every Policy Evaluation SHALL declare exactly one input profile. No additional, arbitrary, ad hoc, or implicitly inferred input profile is authorized. A Policy Evaluation SHALL NOT infer its profile from the shape of the supplied data, and SHALL NOT substitute one profile's inputs for another's. An unknown, undeclared, or ambiguous profile SHALL produce **Escalation Required**.

Repository Policy Selection, below, operates alongside this closed profile set and does not extend it. The `RepositoryPolicySelectionReference` is the output of the governed selection process, subsequently bound as a component of the Policy Evaluation request and recorded on the resulting Governance Decision. It SHALL NOT be a field of `ReviewGovernanceEvaluationInput` and SHALL NOT be a field of `CorpusReadinessAcceptanceEvaluationInput`. Neither profile's field list, semantics, required inputs, failure handling, or wire contract is modified by Repository Policy Selection. No third input profile is introduced, and the authorized set remains exactly two. A Policy Criterion's declared Governance Evaluation Input Profile, carried as data in a Repository Policy Corpus Record per Repository Policy Corpus Source, below, is a declaration and not an evaluation, and selection's use of it as an eligibility input neither activates nor undefers the DORMANT profile.

---

# Repository Policy

A Repository Policy is an explicit, ratified, named rule expressing a condition that a finalized engineering outcome SHALL satisfy.

A Repository Policy SHALL be:

- explicit — expressed as one or more deterministic Policy Criteria, never as freeform natural-language judgment;
- ratified — a Repository Policy SHALL originate only from an approved Ratification (`RATIFICATION_LEDGER.md`) or an equivalently Sprint-Owner-authorized source; Governance SHALL NOT invent, infer, or optimize policy;
- immutable per version — once ratified, a specific Repository Policy version's Policy Criteria SHALL NOT be mutated;
- versioned by supersession — a Repository Policy modification SHALL create a new Repository Policy version through a new Ratification; it SHALL NOT overwrite a prior version. The prior version SHALL remain permanently preserved and remain the version of record for every Policy Evaluation and Governance Decision that cited it;
- attributable — a Repository Policy SHALL reference the Ratification or repository law that authorized it;
- Mission-scoped — every newly created or superseding Repository Policy version SHALL explicitly declare exactly one `MissionApplicabilityScope`, stating the Mission scope over which that version has authority (see Mission Applicability Scope, below). The declaration SHALL be explicit; it SHALL NOT be absent, inferred, wildcarded, defaulted, or supplied by a caller.

A Policy Criterion is one deterministic, individually evaluable condition within a Repository Policy (for example: "Review Outcome SHALL be Accepted or Accepted With Observations"; "no Finding of Severity Critical SHALL remain unresolved"). A Policy Criterion SHALL be evaluable through an explicit deterministic predicate, without additional interpretation, inference, or unrestricted model judgment.

Every Policy Criterion SHALL declare the Governance Evaluation Input Profile it evaluates against. A Policy Criterion's evaluability SHALL be judged solely against the inputs its declared profile provides. A Policy Criterion SHALL NOT be evaluated against a profile it does not declare; such an attempt SHALL produce **Escalation Required**.

For the `ReviewGovernanceEvaluationInput` profile, a Policy Criterion SHALL be evaluable from Evidence, Shared Reality, and/or a finalized Review Outcome alone — unchanged from v1.1.

For the `CorpusReadinessAcceptanceEvaluationInput` profile, current-applicability criteria are evaluable exactly because the `CurrentProjectionApplicabilityReference` is a supplied field of that profile; no criterion SHALL reach outside its profile to discover a current Projection.

## Mission Applicability Scope

### Definition and Ownership

A `MissionApplicabilityScope` is an immutable declaration, owned by exactly one Repository
Policy version, of the Mission scope over which that version has authority.

It is Repository Policy data. It is declared on the Repository Policy version, versioned
with it, and preserved with it. It is not a Ratification Authority Snapshot field, not a
snapshot record, not an attestation, and not a caller-supplied input.

### Closed Union

`MissionApplicabilityScope` is a closed union of exactly two variants. No third variant is
authorized:

- `RepositoryWide` — the Repository Policy version has authority across every Mission;
- `MissionSet` — the Repository Policy version has authority over exactly the Mission
  identities enumerated in its `missions` collection. `missions` SHALL contain one or more
  exact RFC-0001 Mission identities, canonically ordered and duplicate-free. An empty
  `missions` collection is invalid and SHALL fail closed.

Every newly created or superseding Repository Policy version SHALL explicitly declare
exactly one variant.

A scope SHALL NOT be absent, inferred, wildcarded, pattern-matched, prefix-matched,
range-matched, hierarchically derived, defaulted, or supplied or overridden by a caller.
Governance SHALL NOT synthesize a scope.

`RepositoryWide` SHALL be deliberately authorized for that exact Repository Policy version
by that version's own authorizing Ratification. It SHALL NEVER be inferred from the absence
of a declaration, from a legacy artifact, from a prior version's scope, or from the scope of
any other Repository Policy.

### The Mission Applicability Predicate

Mission applicability is exactly this predicate, and nothing else.

A Repository Policy version is **Mission-applicable** to a governance evaluation request if
and only if:

- the version declares `RepositoryWide`; or
- the version declares `MissionSet` and the evaluation request's explicit Mission identity
  is a member of that version's `missions` collection.

Membership SHALL be exact identity equality, determined by byte equality of the NCCS-1
String encoding of each Mission identity after Unicode NFC normalization. Membership SHALL
NOT be determined by prefix, pattern, wildcard, range, case-insensitive comparison,
hierarchy, or any similarity measure.

A Repository Policy version that is not Mission-applicable to a request SHALL NOT be applied
to that request. A version that fails this predicate SHALL NOT be described as applied.

### Relationship to the No-Inference Rule

Mission-Scoped Governance Evaluation, below, requires that `MissionId` originate from the
governance evaluation request and SHALL NOT be inferred from Ratification data or from
Repository Policy data. This section does not weaken, narrow, or except that rule; it
depends on it.

The distinction is one of direction, and it is exact:

- **Prohibited (inference):** deriving, synthesizing, defaulting, or discovering *what the
  Mission is* by reading a Repository Policy or a Ratification. This section performs no
  such derivation, and authorizes none.
- **Authorized (validation):** comparing an already-supplied, explicit request Mission
  identity against a Repository Policy version's declared scope, to determine whether that
  version has authority over the Mission the request already named.

The Mission identity is an input to the predicate, never an output of it. The predicate
reads Repository Policy data only to answer a yes-or-no authority question about a Mission
identity that the request has already established. Consequently a request with an absent,
malformed, or unresolvable `MissionId` SHALL fail under Mission-Scoped Governance Evaluation
before this predicate is reached; the predicate SHALL NOT supply, repair, or substitute a
Mission identity under any circumstance.

### Immutability and Supersession

A Repository Policy version's `MissionApplicabilityScope` SHALL be immutable for the life of
that version. It SHALL NOT be mutated, extended, narrowed, re-declared, or overridden in
place.

A change of scope SHALL create a new sequential Repository Policy version through a new
authorizing Ratification, exactly as a change of Policy Criteria does. The prior version
SHALL remain permanently preserved with its original scope.

A later Repository Policy version's scope SHALL NOT retroactively apply to, rebind, or
invalidate a Governance Decision already produced against an earlier version. Every
Governance Decision remains historically evaluated against the scope its cited version
declared at the time.

### Legacy Versions and Migration

A Repository Policy version created before this section and declaring no
`MissionApplicabilityScope` is `ScopeUndeclared`.

A `ScopeUndeclared` version:

- SHALL remain valid for, and SHALL NOT invalidate, any Governance Decision already produced
  against it. Historical Decisions remain exactly as recorded;
- SHALL be ineligible for any new governance evaluation, and SHALL fail closed with
  **Escalation Required** if referenced by one;
- SHALL NOT be mutated, back-filled, annotated, or repaired in place;
- SHALL NOT be treated as `RepositoryWide`, and SHALL NOT be treated as having any implied,
  default, or inherited scope.

A `ScopeUndeclared` version becomes usable only by being superseded by a new, explicitly
scoped Repository Policy version through a new authorizing Ratification, or by being covered
by a separately ratified migration that states its exact scope. No such migration is
authorized by this section.

### Two Independent Eligibility Dimensions

Mission Applicability Scope and the Policy Criterion profile declaration are two separate,
independent eligibility dimensions. Neither replaces, subsumes, or implies the other.

Every Policy Criterion SHALL continue to declare the Governance Evaluation Input Profile it
evaluates against, exactly as stated above, and that requirement is unchanged.

A Repository Policy version is usable for a given evaluation only when both dimensions hold
independently: the version is Mission-applicable to the request, **and** the criterion's
declared profile matches the profile the evaluation declared. Satisfying one dimension SHALL
NOT be treated as satisfying the other.

### Non-Attestation Boundary

`MissionApplicabilityScope` is Repository Policy data. It is not an attestation of an
authorized subject, and it SHALL NOT be implemented, stored, reserved, or represented as one.

This section introduces no attestation field, no attestation collection, no subject-kind
union, no attestation placeholder, and no dormant attestation extraction path. It adds no
field to, and reserves no field in, the Ratification Authority Snapshot schema.

`RatificationAttributionValidation` remains the sole authority for validating a Repository
Policy version's Ratification reference and for producing its three closed outcomes. Mission
Applicability Scope neither participates in, contributes to, nor substitutes for that
validation, and attribution validation neither produces nor consumes a scope.

The only subject this section recognizes is the Mission. No other subject, subject kind, or
subject enumeration is introduced, and Repository Policy authority over any other subject
remains unestablished.

### Canonical Encoding

Canonical encoding uses NCCS-1 exactly as RFC-0003 defines it, protocol identity `"nccs"`,
version `"1"`, rules 1 through 12. This section adds, omits, and reinterprets no NCCS-1
framing rule. It declares only what NCCS-1 rule 5 delegates to the governing schema: this
schema's record, field order, and collection ordering.

**MissionApplicabilityScope record.** Encoded per NCCS-1 rule 8 as a record of exactly two
fields, field count `i2e`, in this fixed order:

1. `scopeKind` — Enumeration framing of exactly `RepositoryWide` or `MissionSet`;
2. `missions` — ordered collection (rule 5) of Mission identity values in String framing.

**Variant coupling.** When `scopeKind` is `RepositoryWide`, `missions` SHALL be the empty
ordered collection — the two bytes `le`. When `scopeKind` is `MissionSet`, `missions` SHALL
contain at least one element. Any other combination SHALL fail closed.

**Mission Ordering Comparator.** `missions` SHALL be ordered strictly ascending by the
byte-wise comparison of each Mission identity's NCCS-1 String encoding — that is, of the
`<decimal UTF-8 byte length>:<bytes>` form, not of the raw identity. NCCS-1 does not
auto-sort an ordered collection; this comparator is this schema's declared order. A
collection presented in any other order SHALL fail closed.

**Duplicates.** `missions` is uniqueness-declared on the Mission identity. Two elements with
an equal encoded — or NFC-normalized — value SHALL fail closed under NCCS-1 rule 7.

**Normalization.** UTF-8 without byte order mark; every string value normalized to Unicode
NFC; `CRLF` and bare `CR` normalized to `LF` — NCCS-1 rules 1, 2, and 3, applied unchanged.

**Fail-closed conditions.** In addition to NCCS-1 rule 12, encoding SHALL fail closed on: a
`scopeKind` outside the closed union; `RepositoryWide` with a non-empty `missions`;
`MissionSet` with an empty `missions`; a `missions` collection not in Mission Ordering
Comparator order; a duplicate Mission identity; and an empty Mission identity.

**No fingerprint contract.** This section establishes no fingerprint, digest, commitment, or
identity value derived from a `MissionApplicabilityScope`. Equality is determined by the
canonical bytes themselves, below. Any future fingerprint over a scope would require its own
ratification.

### Equality

Two `MissionApplicabilityScope` values are equal if and only if their NCCS-1 canonical byte
encodings are byte-identical.

Equality SHALL NOT be determined by set semantics over an unordered collection, by
membership overlap, by subset or superset relation, or by any comparison that ignores the
declared canonical order. Because the Mission Ordering Comparator makes the encoding of a
given scope unique, byte equality and semantic equality coincide exactly.

Two Repository Policy versions declaring equal scopes remain distinct versions; scope
equality SHALL NOT be treated as version equivalence, and SHALL NOT permit one version to be
substituted for another.

### Determinism

For an equivalent evaluation request Mission identity and an equivalent Repository Policy
version scope, the Mission applicability predicate SHALL always produce the equivalent
result.

The predicate reads exactly two inputs: the request's explicit Mission identity and the
Policy version's declared scope. It reads no repository state, no Ratification Ledger, no
Ratification Authority Snapshot, no attestation, and no system clock. Its result therefore
does not depend on evaluation-time repository state.

### Deferred Concepts

The following are **deferred** and SHALL NOT be implemented under this section:

- authorized-subject attestations in any form — no field, no collection, no subject-kind
  union, no placeholder, and no dormant extraction path;
- attestation extraction, validation, attestation-backed applicability authority, or
  attestation-backed scope authority;
- legacy attestation migration;
- migration, back-fill, or repair of `ScopeUndeclared` Repository Policy versions;
- wildcard, pattern, prefix, range, or hierarchical Mission matching of any kind;
- Repository Policy authority over any subject other than the Mission;
- any fingerprint, digest, commitment, or identity value derived from a
  `MissionApplicabilityScope`;
- any addition to, reservation in, or reinterpretation of the Ratification Authority
  Snapshot schema, and any Snapshot issuance;
- any revision of Acceptance Semantics, Current Projection Applicability Selection, or
  External Authoritative Applicability and Recording;
- activation of the DORMANT `CorpusReadinessAcceptanceEvaluationInput` profile.

Implementation of this section requires its own separate Sprint scope ratification.

---

# Ratification Authority Snapshot Issuance

## Purpose and Ownership Boundary

Ratification Authority Snapshot Issuance is the deterministic derivation, from an exact
governed octet sequence, of an immutable collection of Ratification Authority Records
together with a reproducible commitment to that collection.

Issuance answers exactly one question:

> Do these governed source octets yield a complete, structurally valid, internally
> consistent collection of Ratification Authority Records?

Issuance SHALL NOT resolve a Ratification reference. It receives no reference, opens no
`RepositoryPolicy`, and produces no per-record verdict. Resolving a Ratification
reference recorded on exactly one immutable `RepositoryPolicy` version against an
immutable collection of Ratification Authority Records, and producing exactly one of the
three closed outcomes `Valid`, `Invalid`, or `Unresolvable`, remains owned solely by
`RatificationAttributionValidation` as ratified by `NEXUS-RAT-2026-07-15-017`. That
ratification is not amended, narrowed, or superseded by this section.

The two capabilities are sequential, not alternative. Issuance produces the collection.
Validation consumes it. Issuance produces exactly `Issued` or `Rejected` and SHALL NEVER
produce `Valid`, `Invalid`, or `Unresolvable`.

This section is written to be independently implementable from its own text. Every
grammar, schema, field order, constant, ordering rule, and output shape that a conforming
implementation needs is stated here. An implementation SHALL NOT need to consult an
existing implementation, a test suite, or an evidence artifact to reproduce the governed
octets or the commitments derived from them.

## Canonical Serialization

Every octet sequence this section commits to SHALL be produced by NCCS-1 exactly as
RFC-0003 v1.1 § Canonical Serialization Protocol defines it. That subsection is the
complete and exclusive definition of the encoding. This specification adds no framing
rule, omits none, and reinterprets none.

In particular: rule 4 String length is the decimal UTF-8 **byte** length; rule 8 records
encode in **fixed declared schema order** and SHALL NOT be sorted dynamically; rule 1
invalid UTF-8 and any byte order mark fail closed before any further processing; and
rule 12's enumerated conditions fail closed.

Rule 8 encodes a record as its field count followed by its `(fieldName, value)` pairs in
fixed declared order. **The record's type name is not encoded.** The names used for
schemas in this section are expository; two schemas with identical field names, kinds,
and order therefore encode identically, which is intended.

## The Source Input Domain

The architectural input to issuance is an **exact governed octet sequence** together with
the declared issuance facts defined below. Nothing else is an input.

The octet sequence is part of the public contract, not an implementation convenience:
two conforming implementations SHALL classify the same supplied octets identically. An
implementation SHALL declare exactly one concrete carrier type for the octet sequence and
SHALL reject every other carrier with `invalid-input`, whether or not the rejected
carrier holds the same octets. Converting other octets into the declared carrier is the
caller's deliberate assertion that they are the governed source.

The concrete carrier is an implementation-adapter obligation. No language-specific type
is an architectural domain type of this specification.

## Governed Source Text Preparation

The octet sequence SHALL be prepared as text, in this order, before any structure is read:

1. Decode as UTF-8. Invalid UTF-8 SHALL fail closed as `invalid-utf8`.
2. A byte order mark, at any position, SHALL fail closed as `byte-order-mark-present`.
3. Apply NCCS-1 rule 2 (Unicode NFC) and rule 3 (`CRLF` and lone `CR` become `LF`).

No other preparation SHALL be applied. In particular **no line is trimmed, padded,
folded, or case-normalized anywhere in this section**. A line carrying trailing whitespace
is not the line it resembles. This is a load-bearing rule, not a stylistic one: trimming
is what would allow a padded `Active ` to resolve as Effective.

The prepared text is the subject of `authoritySourceRevision`, and it is the text every
grammar below is defined over. Lines are the maximal substrings separated by `LF`.

**Preparation is not mutation.** This section states how governed octets are *read* for
issuance. It is not authority to rewrite the stored source. An implementation SHALL NOT
write the prepared text back over the source it prepared, and a repository change
authorized as append-only SHALL preserve every existing octet of the stored source as a
byte-identical prefix of the result. Decoding, NFC, and line-ending folding are issuance
operations whose only product is the issuance input; they change no stored octet. Applying
them as a file edit would rewrite historical line endings throughout a source that was
authorized only to grow at its end.

## Fenced Regions

A governed entry may quote Markdown verbatim — including level-1 and level-2 headings and
its own fenced code — for example when it carries a self-contained Full Ratification Text.
Heading recognition is therefore fence-aware, by this rule and by no other:

- An **opening fence** is a line, encountered outside any fenced region, whose leading run
  of backtick characters has length N ≥ 3. The run SHALL begin at the first character of
  the line; no leading whitespace is permitted.
- The region **closes** at the first later line consisting of a run of M ≥ N backtick
  characters and nothing else.
- Both fence lines belong to the region.
- A line inside a fenced region SHALL NOT be recognized as an entry boundary or as a
  section heading, whatever its text.
- A region that is opened and never closed SHALL fail closed as
  `unterminated-fenced-region`, in the `EntryStructure` phase. Carrying an open region to
  the end of the source would silently reclassify every heading after it.

Because a closing fence must be at least as long as its opening fence, **a longer outer
fence encloses shorter inner fences verbatim.** That is what permits an entry to quote
Markdown that itself contains fenced code.

## Governed Entry Extraction Grammar

**Entry boundary.** A line is an entry boundary if and only if it lies outside every
fenced region, begins with `# `, and the remainder of the line matches the Ratification
identifier grammar exactly:

    NEXUS-RAT-<4 digits>-<2 digits>-<2 digits>-<3 digits>

matched against the whole remainder, anchored at both ends. Trailing whitespace
disqualifies a line from being an entry boundary. If the source contains no entry
boundary, issuance SHALL fail closed as `no-entries`. An entry consists of its boundary
line and every following line up to, but excluding, the next entry boundary, or the end
of the source.

**Sections.** Within an entry, a section begins at a line that lies outside every fenced
region and begins with `## `. The section heading is the **entire line, verbatim**. The
section body is every following line up to, but excluding, the next section heading or
the end of the entry. Lines preceding the first section heading belong to no section. Two
sections of one entry carrying the identical heading SHALL fail closed as
`duplicate-section`.

**Content lines.** A content line of a section is a body line that is neither empty nor
exactly the three characters `---`. Every rule below that counts or indexes lines counts
and indexes content lines.

**Required sections.** Each of the following headings SHALL be present in every entry,
matched exactly. An absent one SHALL fail closed as `missing-section`:

`## Ratification Identifier` · `## Date` · `## Subject` · `## Current Status`

`## Lifecycle Authority Declarations` is optional. Every other section is carried in the
source, committed through `authoritySourceRevision`, and read into no record field.

**Field rules.**

| Source field | Rule | Failure |
| --- | --- | --- |
| Identifier | The **first** content line of `## Ratification Identifier`. Later content lines of that section are read into no record field. | none present → `missing-identifier` |
| Identifier grammar | SHALL match the identifier grammar exactly. | → `identifier-grammar-violation` |
| Identifier agreement | SHALL equal the identifier on the entry boundary line. | → `identifier-heading-mismatch` |
| Date | `## Date` SHALL have exactly one content line, and it SHALL be a real calendar date `YYYY-MM-DD`. `2026-02-31` is not one. | → `malformed-date` |
| Current Status | `## Current Status` SHALL have exactly one content line. | → `malformed-status` |
| Subject | `## Subject` SHALL have at least one content line. Its content lines, joined by a single `LF` in ascending source-line order, are the record's `ratificationSubject`, carried verbatim. No line is trimmed, folded, reordered, truncated, or summarized; no other section contributes to it; and no value is substituted for it. | → `missing-subject` |
| Entry uniqueness | No two entries SHALL carry the same identifier. | → `duplicate-entry-identifier` |

The Date SHALL NOT be cross-checked against the date embedded in the identifier. The two
are independently governed, and the governed corpus already contains an entry whose
recorded Date differs from its identifier's embedded date. Imposing agreement would reject
governed history on an invented ground.

**Current status digest.** The digest bound by a governed declaration is the SHA-256
digest of the NCCS-1 String encoding of the subject entry's single Current Status content
line, rendered as 64 lowercase hexadecimal characters.

## Governed Declaration Block Grammar

Within `## Lifecycle Authority Declarations`, exactly one fenced block carries every
declaration. Over the section's body lines:

| Condition | Failure |
| --- | --- |
| No line is exactly ` ```text ` | `missing-declaration-block` |
| No later line is exactly ` ``` ` | `unterminated-declaration-block` |
| A second ` ```text ` line occurs before the closing line | `nested-declaration-block` |
| Any content line occurs after the closing line | `extraneous-declaration-content` |

An entry with no `## Lifecycle Authority Declarations` section declares nothing, which is
not a defect.

The block body is every line strictly between the opening and closing lines. Indentation
is fixed and significant: exactly two spaces at declaration level, exactly four at segment
level. Every token is matched exactly, as a literal prefix of the whole line.

```text
nexus-lifecycle-authority-declarations/1
declaration <subject identifier>
  sourceStatusDigest <64 lowercase hexadecimal characters>
  form WholeRecordLifecycle
  status <lifecycle status>
  [relation <relation kind> <target identifier>]...
end-declaration
declaration <subject identifier>
  sourceStatusDigest <64 lowercase hexadecimal characters>
  form SegmentedLifecycle
  segment <scope key>
    describes <uninterpreted governed scope description>
    status <lifecycle status>
    [relation <relation kind> <target identifier>]...
  end-segment
  [further segments]
end-declaration
end-block
```

**Body rules.**

- The first body line SHALL be exactly `nexus-lifecycle-authority-declarations/1`.
- The last body line SHALL be exactly `end-block`, and no body line SHALL follow it.
- At least one declaration SHALL be present, else `empty-declaration-block`.
- Any line that does not carry its expected literal prefix, and any `relation` line
  without a space separating kind from target, SHALL fail closed as
  `declaration-grammar-violation`. A `sourceStatusDigest` value that is not 64 lowercase
  hexadecimal characters SHALL also fail closed as `declaration-grammar-violation`: the
  token simply is not a digest, which is a grammar defect and not an encoder defect.
- A subject that does not match the identifier grammar SHALL fail closed as
  `declaration-subject-grammar-violation`.
- A `form` value outside `WholeRecordLifecycle` and `SegmentedLifecycle` SHALL fail closed
  as `unsupported-lifecycle-form`.
- A `status` value outside `Effective`, `Superseded`, and `Withdrawn` SHALL fail closed as
  `unsupported-lifecycle-status`.
- A `relation` kind outside `SupersededBy` and `WithdrawnBy` SHALL fail closed as
  `unsupported-relation-kind`; a relation target not matching the identifier grammar SHALL
  fail closed as `relation-target-grammar-violation`.
- A scope key SHALL match `<lowercase alphanumeric run>(-<lowercase alphanumeric run>)*`
  exactly, else `malformed-scope-key`.
- A `WholeRecordLifecycle` declaration declares its status and relations directly, and is
  read as a single `residual` segment carrying them.
- A `SegmentedLifecycle` declaration SHALL declare at least two segments, else
  `degenerate-segmentation`.
- A non-residual segment SHALL carry a non-empty `describes` line, else
  `missing-scope-description`. The `residual` segment SHALL NOT carry one, else
  `residual-scope-description`.
- Scope keys SHALL be unique within a declaration, else `duplicate-scope-key`.
- Exactly one segment per declaration SHALL carry the reserved scope key `residual`, else
  `incomplete-segmentation`.
- Status and relations SHALL agree exactly: `Effective` declares no relation, `Superseded`
  declares exactly one `SupersededBy`, `Withdrawn` declares exactly one `WithdrawnBy`.
  Otherwise `status-relation-mismatch`.
- No two declarations within one block SHALL name the same subject, else
  `duplicate-declaration-subject`.

## The Two Source Facts

An issued snapshot SHALL record two distinct source facts, and SHALL NOT collapse them:

- **`authoritySourceIdentity`** — which governed artifact the snapshot was taken from.
  Stable across every revision of that artifact's content. It SHALL NOT be a filesystem
  path, a URL, or any other environment-dependent locator.
- **`authoritySourceRevision`** — which octets of that artifact were read. It SHALL be
  the SHA-256 digest of the NCCS-1 String encoding of the **prepared** source text as
  defined under Governed Source Text Preparation, not of the raw file octets: NCCS-1
  rule 3 makes line endings a non-difference, and a raw-octet digest would contradict the
  protocol the commitment claims to be governed by. It is rendered as 64 lowercase
  hexadecimal characters.

Collapsing the two would destroy the distinction between "the same artifact at a
different revision" and "a different artifact". Both SHALL be bound into the authority
root and into the envelope.

## Fixed Protocol Constants

These values are fixed by this specification. An implementation SHALL NOT parameterize
them, derive them from its environment, or accept them from a caller.

| Constant | Value |
| --- | --- |
| `authoritySourceIdentity` | `nexus-repository-ratification-ledger` |
| `canonicalSerializationProtocolId` | `NCCS-1` |
| `snapshotSchemaVersion` | `nexus-ratification-authority-snapshot/3` |
| Record fingerprint prefix | `lr-sha256-` |
| Authority root prefix | `ar-sha256-` |
| Envelope commitment prefix | `ec-sha256-` |
| Reserved residual scope key | `residual` |
| Generic-rule status text | `Active` |
| Declaration block format line | `nexus-lifecycle-authority-declarations/1` |

Every digest is SHA-256 per FIPS 180-4, rendered as 64 lowercase hexadecimal characters.
A prefixed value is the prefix immediately followed by that rendering.

## Lifecycle Authority Records

An issued snapshot contains exactly one **Ratification Authority Record** per Ratification
entry in the source. Each record declares:

- `lifecycleAuthorityKind` — exactly one of `GenericSourceRule` or `GovernedDeclaration`;
- `ratificationIdentifier`;
- `ratificationDate`;
- `ratificationSubject`;
- `lifecycleResolutionForm` — exactly one of `WholeRecordLifecycle` or `SegmentedLifecycle`;
- `lifecycleDeclaringAuthority` — present if and only if the kind is `GovernedDeclaration`;
- `lifecycleSegments` — an ordered collection of Lifecycle Segments.

The record is a discriminated union on `lifecycleAuthorityKind`. A generically resolved
record naming a declaring authority, and a declared record omitting one, SHALL both be
structurally inexpressible rather than merely rejected.

`ratificationSubject` carries the governed subject of the Ratification entry, extracted from
the `## Subject` section exactly as the field rules above define, and is present on every
record of both arms. It is **governed evidence carried verbatim, never a derived, defaulted,
substituted, or synthesized value.** Issuance SHALL NOT read it, interpret it, normalize it,
truncate it, or resolve any lifecycle from it; it is carried so that a consumer requiring the
subject as a record field receives the subject the authority source actually records, rather
than a value standing in for one. A record whose subject is absent from the source is not
issued at all: `missing-subject` fails closed in the `EntryStructure` phase, before any
record exists.

**Lifecycle Resolution Form is a representation form, not a lifecycle status.** It SHALL
NOT be treated as a fourth status.

## Lifecycle Segments and Structural Completeness

A Lifecycle Segment declares:

- `scopeKind` — exactly one of `GovernedScope` or `ResidualScope`;
- `scopeKey` — an atomic key, unique within its record;
- `scopeDescription` — present if and only if `scopeKind` is `GovernedScope`;
- `lifecycleStatus` — exactly one of `Effective`, `Superseded`, `Withdrawn`;
- `lifecycleRelations` — an ordered collection of Lifecycle Relations.

The segment is a discriminated union on `scopeKind`. The residual segment carries no
description field at all, rather than a nullable one.

Every record SHALL declare **exactly one** `ResidualScope` segment, under the reserved
scope key `residual`. Total coverage is therefore provable structurally, without reading
any prose. A `SegmentedLifecycle` record SHALL declare at least two segments.

Every `GovernedScope` segment SHALL carry a non-empty `scopeDescription`: an uninterpreted
governed scope description or exact governed-clause citation, carried verbatim into the
record.

**Issuance verifies uniqueness of atomic scope keys and the ratified mapping. Issuance
SHALL NOT read the scope description, and SHALL NOT infer semantic disjointness from
prose.**

A Lifecycle Relation declares `relationKind` — exactly one of `SupersededBy` or
`WithdrawnBy` — and `relationTarget`. Status and relations SHALL agree exactly:
`Effective` declares no relation; `Superseded` declares exactly one `SupersededBy`;
`Withdrawn` declares exactly one `WithdrawnBy`.

## Canonical Schemas and Field Order

Every schema below is a rule 8 record. **Field order is fixed as listed and SHALL NOT be
sorted.** Field kinds are:

| Kind | Encoding and constraint |
| --- | --- |
| `String` | NCCS-1 rule 4 String. |
| `Integer` | NCCS-1 rule 4 Integer. Non-negative. |
| `Identity` | A rule 4 String, constrained to be non-empty. |
| `Digest` | A rule 4 String, constrained to 64 lowercase hexadecimal characters. |
| `Enumeration(a, b, …)` | A rule 4 String, constrained to exactly one listed member. |
| `OrderedList(T)` | NCCS-1 rule 5 ordered collection of encoded `T` values, in declared order. |
| `OrderInsensitiveStrings` | NCCS-1 rule 6 collection of encoded Strings, sorted ascending by encoded octets. A duplicate fails closed under rule 7. |
| `Record(S)` | A rule 8 record in schema `S`'s fixed declared order. |

**`LifecycleRelation`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `relationKind` | `Enumeration(SupersededBy, WithdrawnBy)` |
| 2 | `relationTarget` | `Identity` |

**`LifecycleSegment`** — discriminated on `scopeKind`.

`GovernedScope` arm:

| # | Field | Kind |
| --- | --- | --- |
| 1 | `scopeKind` | `Enumeration(GovernedScope, ResidualScope)` |
| 2 | `scopeKey` | `Identity` |
| 3 | `scopeDescription` | `String` |
| 4 | `lifecycleStatus` | `Enumeration(Effective, Superseded, Withdrawn)` |
| 5 | `lifecycleRelations` | `OrderedList(LifecycleRelation)` |

`ResidualScope` arm:

| # | Field | Kind |
| --- | --- | --- |
| 1 | `scopeKind` | `Enumeration(GovernedScope, ResidualScope)` |
| 2 | `scopeKey` | `Identity` |
| 3 | `lifecycleStatus` | `Enumeration(Effective, Superseded, Withdrawn)` |
| 4 | `lifecycleRelations` | `OrderedList(LifecycleRelation)` |

**`LifecycleAuthorityRecord`** — discriminated on `lifecycleAuthorityKind`.

`GenericSourceRule` arm:

| # | Field | Kind |
| --- | --- | --- |
| 1 | `lifecycleAuthorityKind` | `Enumeration(GenericSourceRule, GovernedDeclaration)` |
| 2 | `ratificationIdentifier` | `Identity` |
| 3 | `ratificationDate` | `String` |
| 4 | `ratificationSubject` | `String` |
| 5 | `lifecycleResolutionForm` | `Enumeration(WholeRecordLifecycle, SegmentedLifecycle)` |
| 6 | `lifecycleSegments` | `OrderedList(LifecycleSegment)` |

`GovernedDeclaration` arm:

| # | Field | Kind |
| --- | --- | --- |
| 1 | `lifecycleAuthorityKind` | `Enumeration(GenericSourceRule, GovernedDeclaration)` |
| 2 | `ratificationIdentifier` | `Identity` |
| 3 | `ratificationDate` | `String` |
| 4 | `ratificationSubject` | `String` |
| 5 | `lifecycleResolutionForm` | `Enumeration(WholeRecordLifecycle, SegmentedLifecycle)` |
| 6 | `lifecycleDeclaringAuthority` | `Identity` |
| 7 | `lifecycleSegments` | `OrderedList(LifecycleSegment)` |

**`AuthorityRootBasis`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `authorityRecordFingerprints` | `OrderInsensitiveStrings` |
| 2 | `authoritySourceIdentity` | `Identity` |
| 3 | `authoritySourceRevision` | `Digest` |
| 4 | `canonicalSerializationProtocolId` | `Identity` |
| 5 | `recordCount` | `Integer` |
| 6 | `snapshotSchemaVersion` | `Identity` |

**`ProducingAttribution`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `producingImplementationIdentity` | `Identity` |
| 2 | `producingImplementationRevision` | `Identity` |

**`EnvelopeCommitmentBasis`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `authorityRoot` | `Identity` |
| 2 | `authoritySourceIdentity` | `Identity` |
| 3 | `authoritySourceRevision` | `Digest` |
| 4 | `canonicalSerializationProtocolId` | `Identity` |
| 5 | `capturedAt` | `String` |
| 6 | `producingAttribution` | `Record(ProducingAttribution)` |
| 7 | `recordCount` | `Integer` |
| 8 | `snapshotSchemaVersion` | `Identity` |

## The Generic Source Rule

A source entry whose Current Status is **exactly** the text `Active` SHALL resolve to
`WholeRecordLifecycle` with a single `Effective` residual segment, under
`lifecycleAuthorityKind` `GenericSourceRule`.

"Exactly" admits no prefix, substring, case, punctuation, whitespace, or parenthetical
interpretation. No status text is trimmed, padded, folded, or otherwise normalized beyond
NCCS-1 rules 2 and 3.

**The generic rule is exclusive over its own domain.** A governed declaration targeting an
entry that the generic rule resolves SHALL be rejected. No declaration can override the
generic rule for any entry, because targeting such an entry is itself a rejection
condition.

## Governed Lifecycle Authority Declarations

An entry whose Current Status is not exactly `Active` resolves only through a **governed
lifecycle authority declaration**.

Every declaration SHALL be extracted exclusively from the pinned governed source octets.
Issuance SHALL accept **no caller-supplied declaration object**, and SHALL expose no
parameter, field, or channel through which one could be supplied. A fabricated declaration
must be smuggled into governed octets to be attempted at all.

A declaration SHALL be carried in a fixed, exactly tokenized structured block, as defined
under Governed Declaration Block Grammar. No element of a declaration SHALL be inferred
from prose, intent, or implementation assumption.

A **declaring authority** SHALL itself be Effective under the generic rule alone, else
`declarant-not-effective`. It SHALL NOT borrow effectiveness from a declaration, its own
or any other. A declaration SHALL NOT name its own declarant as its subject, else
`self-referential-declaration`.

Each declaration SHALL bind to the exact governed status octets it was written against,
through the current status digest defined above. A declaration whose bound digest does not
match its subject's current status octets SHALL be rejected as `status-binding-mismatch`,
so a declaration cannot outlive the text it governs. A declaration naming a subject that
is not an entry of the source SHALL be rejected as `absent-declaration-subject`. Two
declarations binding the same subject, from any declarants, SHALL be rejected as
`duplicate-declaration`.

## Two Distinct Graphs

Two graphs exist and they are not the same graph:

- the **declarant-authority graph**: declaring authority → declaration subject;
- the **lifecycle-relation graph**: record → `SupersededBy` / `WithdrawnBy` target.

Each SHALL be constructed and validated independently. Guarding the first proves nothing
about the second.

The lifecycle-relation graph SHALL be constructed over **provisional records** — every
source entry contributes a node, whether or not it resolves — and SHALL be validated in
full **before** any entry is rejected for resolving to nothing. An entry that resolves to
nothing still exists, and a lineage passing through it is still a lineage.

A relation target SHALL exist, SHALL resolve to a structurally valid record, and SHALL
participate in an acyclic lineage. A relation target **need not be currently Effective**:
supersession and withdrawal lineages are historical, and an intermediate target may itself
have been superseded later.

## Authority Root and Envelope Commitment

Issuance produces exactly three commitment layers:

1. **Record fingerprint** — the record fingerprint prefix followed by the SHA-256 digest
   of the `LifecycleAuthorityRecord` encoding of one Ratification Authority Record.
2. **Authority root** — the authority root prefix followed by the SHA-256 digest of the
   `AuthorityRootBasis` encoding.
3. **Envelope commitment** — the envelope commitment prefix followed by the SHA-256 digest
   of the `EnvelopeCommitmentBasis` encoding.

**The authority root SHALL be derived from governed octets alone.** It is therefore
issuer-independent and time-independent: two structurally independent implementations
reading the same octets SHALL produce the same root, and re-deriving it later SHALL not
change it. The authority root SHALL NOT bind the capture instant or the producing
attribution. A root that absorbed either could never be reproduced, and reproducibility is
the entire purpose of committing to one.

The record fingerprints are committed as an order-insensitive collection because a
snapshot is an immutable **collection**; its root SHALL NOT depend on the order the
records were read in. A duplicate fingerprint fails closed.

**The envelope commitment SHALL bind the authority root, both source facts, the canonical
serialization protocol identifier, the capture instant, the producing attribution, the
record count, and the snapshot schema version.** It is deliberately not issuer-independent:
it records who computed the root and when. Two implementations agreeing on the root while
differing on the envelope commitment is the expected and correct outcome when their
attributions differ.

**No authority root, envelope commitment, or record fingerprint SHALL be recorded inside
the governed source it is derived from.** Self-inclusion would make the one-pass derivation
stated in this section circular, and would require instead solving a fixed-point problem
that this specification neither states nor authorizes. A ratification that authorizes
issuance SHALL therefore state the contract, never pin a value produced by it.

## Declared Issuance Facts

Exactly two facts are declared rather than derived:

- **`capturedAt`** — the capture instant. RFC 3339 UTC, second precision, literal `Z`, in
  the form `YYYY-MM-DDThh:mm:ssZ`. The date part SHALL be a real calendar date; `hh` SHALL
  NOT exceed 23, and `mm` and `ss` SHALL NOT exceed 59. Offsets, fractional seconds, local
  time, the `24:00:00` end-of-day form, and leap seconds SHALL each be rejected. An
  implementation SHALL NOT read a system clock internally: an instant an external party
  cannot supply is an instant no external party can verify.
- **`producingAttribution`** — exactly `producingImplementationIdentity` and
  `producingImplementationRevision`, each a non-empty String.

No other declared field SHALL be accepted. An unrecognized declared field SHALL be
rejected, not ignored. There is no declared channel for a record, a segment, a status, a
relation, a declaration, a root, or an attestation.

## Deterministic Ordering

Determinism is a contract obligation, not an implementation preference. Where any
traversal could otherwise depend on incidental data-structure order, this section fixes it:

Every term below is defined by position in the prepared text. No traversal term is left to
be inferred from another, and none depends on a data structure's insertion order.

- **Entry order** is the ascending source-line order of entry boundaries in the prepared
  text. **Every** entry is traversed, including entries that are provisional, malformed, or
  that will never become records.
- **Record order** is entry order, restricted to the entries that became records.
- **Provisional-record order** is entry order. A provisional record exists for every entry,
  so the two coincide element for element; the term is named separately because
  `LifecycleGraph` runs before any entry has become a record, when record order does not
  yet exist.
- **Section order** within an entry is the ascending source-line order of its section
  headings, taking each distinct heading at its first occurrence.
- **Block order** is the entry order of the entry carrying the block. An entry carries at
  most one declaration block, so block order is total.
- **Declaration order within a block** is the ascending source-line order of the
  `declaration` lines that open each declaration in that block.
- **Declaration traversal** is block order, then declaration order within the block.
- **Segment order** within a declaration or record is declared order: the ascending
  source-line order of its `segment` lines. For a `WholeRecordLifecycle` declaration, the
  single `residual` segment.
- **Relation order** within a segment is declared order: the ascending source-line order of
  its `relation` lines.
- **Fingerprint collection order** is NCCS-1 rule 6: ascending by encoded octets.
- **Cycle selection**, in both graphs, is fixed completely by Cycle Selection below.
- **Phase order is execution order**, as defined below.

Given identical octets and identical declared facts, two conforming implementations SHALL
produce identical results in every field, including the reported diagnostic and its
payload.

### Cycle Selection

A cycle diagnostic names a path. A graph may hold more than one cycle, and one cycle may
admit more than one path describing it. Declaring only that cycles are refused would leave
the payload to whichever traversal an implementation happened to choose, and two conforming
readers could return different valid paths for identical octets. The selection is therefore
stated in full.

Each governed graph is a directed multigraph whose nodes are Ratification identifiers.
Because relation targets and declaration subjects are grammar-checked in an earlier phase,
every node is a conforming identifier and therefore ASCII.

- The **declarant-authority graph** takes one edge from the declaring authority to the
  declaration subject for each declaration, in declaration traversal order.
- The **lifecycle-relation graph** takes one edge from a provisional record to a relation
  target for each relation, in provisional-record order, then segment order, then relation
  order.

A node is a **source node** if at least one edge leaves it. **Outgoing-edge order** at a
node is the order in which that node's edges were taken above. Duplicate edges are retained
rather than collapsed, and keep the order of the relations or declarations that produced
them.

Cycle detection SHALL be the following depth-first search, and the first cycle it finds
SHALL be the reported diagnostic:

1. Every node begins `unvisited`, and the search stack begins empty.
2. Source nodes are entered as search roots in **ascending octet order** of their
   identifiers.
3. On entering a node:
   1. if it is `open`, a cycle has been found; the search SHALL stop and report it;
   2. if it is `closed`, the search SHALL return at once without re-entering it;
   3. otherwise it is marked `open` and pushed onto the search stack, and its outgoing edges
      are followed in outgoing-edge order, each target entered by this same rule.
4. When every outgoing edge of a node has been followed without a cycle being found, that
   node is popped from the stack and marked `closed`.
5. When every root is exhausted without a cycle being found, the graph is acyclic.

The reported path SHALL be the contents of the search stack from the first occurrence of the
re-entered node through the top of the stack, followed by that node once more. It begins and
ends at the same identifier and names every other identifier on it exactly once.

Marking a node `closed` is normative, not an optimization: it fixes how many times a node is
entered, and therefore fixes the search itself rather than leaving it to an implementation's
discretion. It hides no cycle. On any cycle, the node discovered first finds every other
node on that cycle still `unvisited`, so the search from it walks the whole cycle and
re-enters an `open` node. A node is never `closed` while a cycle through it remains
undetected.

## The Total Result Contract

Issuance SHALL be total: exactly `Issued` or `Rejected`, never an unhandled failure for
any governed input.

### Result Schemas

An `Issued` result SHALL carry:

- `result` — `Issued`;
- `envelope` — `authorityRoot`, `authoritySourceIdentity`, `authoritySourceRevision`,
  `canonicalSerializationProtocolId`, `capturedAt`, `producingAttribution`, `recordCount`,
  `snapshotSchemaVersion`;
- `envelopeCommitment`;
- `records` — the ordered Ratification Authority Records;
- `recordFingerprints` — the order-insensitive fingerprint collection as committed;
- `declarationCount`, `genericCount`, `segmentedCount`.

**The three counts are derived, never declared.** Each is a non-negative Integer, derived
from the issued records alone:

| Count | Derivation |
| --- | --- |
| `declarationCount` | the number of records whose `lifecycleAuthorityKind` is `GovernedDeclaration` |
| `genericCount` | the number of records whose `lifecycleAuthorityKind` is `GenericSourceRule` |
| `segmentedCount` | the number of records whose `lifecycleResolutionForm` is `SegmentedLifecycle` |

`declarationCount` and `genericCount` partition the records, so their sum SHALL equal
`recordCount`. `segmentedCount` counts a representation form across both arms and SHALL NOT
be added to either. Every count is derived from governed octets alone, so two conforming
implementations reading the same octets SHALL report the same three values, and a reader
MAY re-derive all three rather than accept them.

**The listed fields are exactly the fields of an `Issued` result.** A result missing any of
them is not an `Issued` result, and an unrecognized field SHALL be rejected rather than
ignored, exactly as an unrecognized declared issuance fact is. The same rule binds the
`envelope` and the `producingAttribution` record: each carries exactly the fields listed for
it, no more and no fewer.

**The commitment layers do not bind this shape.** No count, and no framing of the result as
a whole, enters `AuthorityRootBasis` or `EnvelopeCommitmentBasis`. A reader SHALL therefore
establish the shape structurally and SHALL NOT infer it from a matching root or envelope
commitment: an object carrying a correct root and a correct commitment, but a missing,
extra, or false count, satisfies every commitment layer and is still not an `Issued`
result.

A `Rejected` result SHALL carry:

- `result` — `Rejected`;
- `diagnosticCode` — one code from the closed public vocabulary;
- `diagnosticPhase` — that code's declared phase;
- `diagnosticPrecedence` — that phase's rank;
- `diagnosticPayload` — the exact discriminated payload, carrying its variant name;
- `detail` — the derived canonical rendering.

A `Rejected` result SHALL carry no partial snapshot. A snapshot is issued in whole or not
at all.

The canonical rendering of a payload is: the empty string for `NoPayload`; the path
identifiers joined by ` -> ` for `RelationPathPayload`; otherwise the variant's fields, in
declared order, joined by ` :: `.

### Diagnostic Phases

Precedence is defined first by **phase**, and phase order SHALL be execution order. A phase
is atomic and runs to a decision before the next begins, so when a source carries several
independent defects the reported diagnostic is always drawn from the lowest-ranked phase
containing any defect, wherever in the source the defects sit.

There are **eight governed phases**, ranked 0 through 7, and a ninth partition,
`ContractViolation` at rank 8, which is not a governed outcome. Nine ranks in total; eight
of them public.

| Rank | Phase | Partition | Meaning |
| --- | --- | --- | --- |
| 0 | `SourceIntegrity` | public | The octets are not admissible as governed source. |
| 1 | `EntryStructure` | public | The source is text, but its entry structure is not readable. |
| 2 | `DeclarationGrammar` | public | Entries are readable, but a declaration block is malformed. |
| 3 | `DeclarantAuthority` | public | Blocks parse, but the declaring authority is not entitled. |
| 4 | `DeclarationBinding` | public | Authority is entitled, but a declaration does not bind. |
| 5 | `LifecycleGraph` | public | Declarations bind, but the asserted lineage is not a lineage. |
| 6 | `Resolution` | public | The lineage is sound, but some entry resolves to no lifecycle. |
| 7 | `Envelope` | public | Records resolved, but a declared issuance fact was inadmissible. |
| 8 | `ContractViolation` | not a governed outcome | The implementation violated its own contract. |

### Within-Phase Precedence

Phase precedence alone does not determine the answer when one source carries two defects
belonging to the **same** phase. That case SHALL be decided as follows.

Each phase declares its codes in a fixed order — the order in which they are listed under
The Closed Public Vocabulary below. **That order is normative, and it is also the order in
which the phase executes.** A phase SHALL run as a sequence of passes, one per declared
code, in declared order; each pass SHALL examine every target of that code under the
phase's deterministic traversal order and SHALL report the first target that fails.

Equivalently: the reported diagnostic is the minimum, **code-major**, of the pair

> (position of the code within its phase, position of the target under the phase's
> traversal order)

A **target-major** rule — first failing target, then whichever check that target happened
to fail — SHALL NOT be used. It would leave a conforming implementation free to report
either of two same-phase codes depending on the order in which it examined one target, and
identical inputs would no longer produce identical results.

The declared code order is not free. A pass SHALL only read data whose well-formedness
every earlier-listed pass has already established across the whole source. Two consequences
are load-bearing and are stated here so that no implementation has to rediscover them:

- `missing-section` precedes every code that reads a section, and the missing-section pass
  SHALL examine the required headings in the order they are listed above.
- `unsupported-lifecycle-form` precedes every code that reads a declaration body. The body
  of a declaration whose form token is not a recognized form has no known shape; a reader
  SHALL record the attempt, resynchronize at that declaration's `end-declaration` line, and
  continue.

Within `SourceIntegrity`, `invalid-utf8` precedes `byte-order-mark-present`, so an
implementation SHALL decode before testing for a byte order mark. A byte order mark is
itself valid UTF-8, so nothing is lost by decoding first.

Within `Envelope`, the declared inputs SHALL be examined in this order: `capturedAt`; the
`producingAttribution` container; `producingImplementationIdentity`;
`producingImplementationRevision`; unrecognized top-level declared fields; unrecognized
`producingAttribution` fields. Unrecognized fields SHALL be reported in **ascending name
order**, so that the diagnostic depends on what the caller supplied and not on the order in
which the caller's object happens to enumerate its keys.

### Target Selection Order

Within-phase precedence fixes *which code* is reported. When that code fails on more than
one target, the payload SHALL name the **first failing target** under the traversal order
declared here.

Every traversal term used here — entry order, section order, block order, declaration order
within a block, declaration traversal, provisional-record order, record order, segment
order, relation order — is defined under Deterministic Ordering above, and cycle selection
is defined under Cycle Selection above. This subsection assigns those orders to phases; it
defines no order of its own.

Entry order and section order exist precisely because record order cannot serve
`EntryStructure`: that phase runs while nothing has yet become a record, so a rule stated
over records would leave its payload undetermined.

| Rank | Phase | Target traversal order |
| --- | --- | --- |
| 0 | `SourceIntegrity` | The source is the only target. No traversal. |
| 1 | `EntryStructure` | Entry order, refined per code below. |
| 2 | `DeclarationGrammar` | Outermost first: declaration traversal order, then segment order, then relation order. |
| 3 | `DeclarantAuthority` | Declaration traversal order; `declarant-not-effective` is block-scoped and uses block order; `cyclic-declaration-authority` uses cycle selection over the declarant-authority graph. |
| 4 | `DeclarationBinding` | Declaration traversal order. |
| 5 | `LifecycleGraph` | Provisional-record order, then segment order, then relation order; `cyclic-lifecycle-relation` uses cycle selection over the lifecycle-relation graph. |
| 6 | `Resolution` | Record order. |
| 7 | `Envelope` | The declared-input examination order stated above. |

Within `EntryStructure`:

- `no-entries` and `unterminated-fenced-region` are properties of the whole source. Each has
  a single target and carries `NoPayload`.
- `missing-section` SHALL be traversed **entry-major**: entry order first, and within an
  entry the required headings in their declared order — `## Ratification Identifier`,
  `## Date`, `## Subject`, `## Current Status`. A heading-major traversal SHALL NOT be used.
- `duplicate-section` reports, within the first entry carrying any repeated heading, the
  heading whose **second** occurrence appears earliest in source-line order.
- `duplicate-entry-identifier` reports the **later** occurrence — the second entry bearing
  an identifier already seen — and not the first.
- Every other `EntryStructure` code is entry-scoped and reports the first entry, in entry
  order, that fails it.

Within `DeclarationGrammar`, a code whose payload names a declaration or a scope reports the
first such target under the nesting order above; a code whose payload names an entry reports
the entry carrying the first failing block. `duplicate-declaration-subject` and
`duplicate-scope-key` report the **later** duplicate, consistently with
`duplicate-entry-identifier`.

Within `DeclarantAuthority`, `declarant-not-effective` reports the entry carrying the first
failing block in block order, and `self-referential-declaration` reports the first failing
declaration in declaration traversal order.

Within `DeclarationBinding`, every code reports the first failing declaration in declaration
traversal order. `duplicate-declaration` reports the **later** declaration — the one whose
subject a declaration earlier in declaration traversal order has already claimed —
consistently with `duplicate-entry-identifier`.

Within `LifecycleGraph`, `absent-relation-target` and `self-referential-relation` SHALL
report the two-element path `[declaring record, relation target]`.

### Structured Diagnostic Payloads

Every `Rejected` result SHALL carry an exact discriminated payload. `detail`, where
present, SHALL be **derived** from that payload by the single canonical rendering rule
above and SHALL NOT be the data-bearing channel.

Every payload SHALL be discriminated by the exact field **`payloadKind`**, whose value is
the variant name. `payloadKind` SHALL be the payload's **first** field, and its value SHALL
be exactly one of the following seven, which are the whole vocabulary:

`NoPayload` · `EntryPayload` · `EntrySectionPayload` · `DeclarationPayload` ·
`DeclarationScopePayload` · `RelationPathPayload` · `DeclaredInputPayload`

The complete exact fields of each variant are:

| Payload variant | Complete exact fields, in order |
| --- | --- |
| `NoPayload` | `payloadKind` |
| `EntryPayload` | `payloadKind`, `ratificationIdentifier` |
| `EntrySectionPayload` | `payloadKind`, `ratificationIdentifier`, `sectionHeading` |
| `DeclarationPayload` | `payloadKind`, `declaringAuthority`, `declarationSubject` |
| `DeclarationScopePayload` | `payloadKind`, `declaringAuthority`, `declarationSubject`, `scopeKey` |
| `RelationPathPayload` | `payloadKind`, `pathIdentifiers` |
| `DeclaredInputPayload` | `payloadKind`, `declaredField` |

`NoPayload` is therefore **not** an empty payload: `payloadKind` is its sole field, carrying
the value `NoPayload`.

Every field is a non-empty String except `pathIdentifiers`, which is a non-empty ordered
list of non-empty Strings. The canonical rendering rule above operates on the fields
following `payloadKind`; `payloadKind` itself is never rendered into `detail`.

`declaredField` SHALL name the **exact leaf** at fault — for example
`producingImplementationIdentity` — and SHALL NOT be widened to its containing record.

A payload that does not match its declared variant exactly — a missing field, an extra
field, a wrongly typed field, an empty path — SHALL be replaced by a contract violation
rather than reported as a governed outcome.

### The Closed Public Vocabulary

Exactly forty-six public diagnostic codes are declared. Every one SHALL be reachable
through the public issuance contract from governed octets and declared facts alone, and no
code outside this partition SHALL be reachable through it.

**The order in which each phase's codes are listed below is normative**: it is that
phase's within-phase precedence and its pass execution order, as defined under Within-Phase
Precedence above.

`SourceIntegrity` — `invalid-input` (NoPayload) · `invalid-utf8` (NoPayload) ·
`byte-order-mark-present` (NoPayload).

`EntryStructure` — `no-entries` (NoPayload) · `unterminated-fenced-region` (NoPayload) ·
`missing-section` (EntrySectionPayload) · `duplicate-section` (EntrySectionPayload) ·
`missing-identifier` (EntryPayload) · `identifier-grammar-violation` (EntryPayload) ·
`identifier-heading-mismatch` (EntryPayload) · `malformed-date` (EntryPayload) ·
`malformed-status` (EntryPayload) · `missing-subject` (EntryPayload) ·
`duplicate-entry-identifier` (EntryPayload).

`DeclarationGrammar` — `missing-declaration-block` (EntryPayload) ·
`unterminated-declaration-block` (EntryPayload) · `nested-declaration-block`
(EntryPayload) · `extraneous-declaration-content` (EntryPayload) ·
`empty-declaration-block` (EntryPayload) · `declaration-grammar-violation` (EntryPayload)
· `declaration-subject-grammar-violation` (EntryPayload) ·
`unsupported-lifecycle-form` (DeclarationPayload) ·
`relation-target-grammar-violation` (DeclarationPayload) ·
`unsupported-lifecycle-status` (DeclarationPayload) ·
`unsupported-relation-kind` (DeclarationPayload) · `degenerate-segmentation`
(DeclarationPayload) · `duplicate-declaration-subject` (DeclarationPayload) ·
`malformed-scope-key` (DeclarationScopePayload) · `missing-scope-description`
(DeclarationScopePayload) · `residual-scope-description` (DeclarationScopePayload) ·
`duplicate-scope-key` (DeclarationScopePayload) · `incomplete-segmentation`
(DeclarationScopePayload) · `status-relation-mismatch` (DeclarationScopePayload).

`DeclarantAuthority` — `declarant-not-effective` (EntryPayload) ·
`self-referential-declaration` (DeclarationPayload) · `cyclic-declaration-authority`
(RelationPathPayload).

`DeclarationBinding` — `absent-declaration-subject` (DeclarationPayload) ·
`generic-rule-conflict` (DeclarationPayload) · `status-binding-mismatch`
(DeclarationPayload) · `duplicate-declaration` (DeclarationPayload).

`LifecycleGraph` — `absent-relation-target` (RelationPathPayload) ·
`self-referential-relation` (RelationPathPayload) · `cyclic-lifecycle-relation`
(RelationPathPayload).

`Resolution` — `unresolved-lifecycle` (EntryPayload).

`Envelope` — `malformed-capture-instant` (DeclaredInputPayload) · `malformed-attribution`
(DeclaredInputPayload).

### Contract Violations

Exactly three codes classify implementation defects and SHALL NOT be reachable through the
public contract: `undeclared-diagnostic`, `malformed-diagnostic-payload`, and
`internal-invariant-violation`. They are not governed outcomes.

A code emitted outside the declared vocabulary SHALL be replaced by `undeclared-diagnostic`
rather than passed through. An encoder failure raised on an already-validated fixed schema
SHALL be classified as `internal-invariant-violation`, never dressed as an `Envelope`
outcome a caller could have caused.

### Diagnostic Ownership by Boundary

A code belongs to the phase in which the **defect** lies, not the phase whose component
detected it. A malformed declared issuance fact is an `Envelope` defect even when the
canonical encoder is what refuses it, because the governed source octets were valid and
the declared input was not.

## Relationship to `NEXUS-RAT-2026-07-15-017`

`NEXUS-RAT-2026-07-15-017`'s Required Outcome Mapping remains in force, unamended, for
`RatificationAttributionValidation`. Its ten conditions are conditions on resolving a
reference against an existing collection; issuance receives no reference.

Two of those conditions describe defects that can also occur in governed source octets.
Where so, issuance owns an equivalent condition under its own name and rejects earlier and
more strongly than validation could:

| Ratified validation condition | Issuance disposition |
| --- | --- |
| Duplicate identifier | Owned by issuance as `duplicate-entry-identifier`; the snapshot is never issued. |
| Unknown / unrecognized lifecycle status | Owned by issuance as `unsupported-lifecycle-status`; the declaration is refused. |
| Contradictory record | Structurally inexpressible in this schema; no code is declared for it. |
| Snapshot source unavailable | Outside this contract; owned by the Snapshot source contract. |
| Malformed reference on the `RepositoryPolicy` | Outside this contract; issuance opens no `RepositoryPolicy`. |
| The remaining five conditions | Retained for attribution validation; not issuance outcomes. |

Issuance SHALL NOT emit a code whose name asserts an outcome issuance cannot produce.

## Two Structurally Independent Implementations

Conformance SHALL be demonstrated by at least two structurally independent
implementations. Independence means: no shared encoder, no shared schema table, no shared
vocabulary structure, and no shared parsing component. Sharing this specification is the
point; sharing an implementation would make agreement between them meaningless.

Both implementations SHALL agree on the complete public result, field for field, for
identical inputs — not merely on fingerprints. Both SHALL be cross-checked against
RFC-0003's own normative Conformance Vectors **before** any agreement between them is
claimed: an encoder agreeing with its counterpart but not with RFC-0003 demonstrates only
a shared defect.

## Schema Version and Compatibility

The snapshot schema version is `nexus-ratification-authority-snapshot/3`.

**A schema version identifier names an exact canonical encoding, and is therefore an
encoding compatibility boundary.** Any change to a schema in this section that alters the
octets a conforming record encodes to SHALL take a new schema version identifier, whether or
not any artifact has yet been issued under the previous one. The absence of issued artifacts
removes migration cost; it does not make a version identifier stop identifying the encoding
it names. A consumer SHALL be able to decide, from `snapshotSchemaVersion` alone, whether it
holds an encoding it can read — never by attempting to decode and observing a failure.

**Version 3 is not backward compatible with version 2 and SHALL NOT be read as version 2.**
The incompatibility is exact and total:

- v3 `LifecycleAuthorityRecord` carries `ratificationSubject` at field 4 on both arms; v2
  carried no subject at all. The arms carry six and seven fields in v3, where they carried
  five and six in v2.
- Rule 8 encodes a record's field count and its `(fieldName, value)` pairs, so **no v2
  record has a well-defined v3 encoding and no v3 record has a well-defined v2 encoding.**
- Consequently **no v2 record fingerprint, authority root, or envelope commitment is
  comparable to any v3 record fingerprint, authority root, or envelope commitment**, even
  when both are derived from byte-identical governed source octets.

**Version 3 is likewise not backward compatible with version 1 and SHALL NOT be read as
version 1.** That incompatibility is exact and total, and was already so at version 2:

- v1 records carried a single record-level lifecycle status; v2 and v3 records carry a
  segmented lifecycle whose statuses attach to atomic scopes.
- v2 introduced `lifecycleResolutionForm`, `lifecycleAuthorityKind`,
  `lifecycleDeclaringAuthority`, `scopeKind`, `scopeKey`, `scopeDescription`, and
  `lifecycleRelations`, and v3 retains all of them; none exists in v1.
- v2 and v3 records are discriminated unions; v1 records were not, so no v1 record has a
  well-defined v2 or v3 encoding and no v2 or v3 record has a well-defined v1 encoding.
- Consequently **no v1 fingerprint, root, or commitment is comparable to any v2 or v3
  fingerprint, root, or commitment.** Comparing them across versions is meaningless, not
  merely inadvisable.

A v1 or v2 snapshot SHALL NOT be upgraded, reinterpreted, or partially read under v3.
Migration of any v1 or v2 artifact requires separate ratification stating its scope, and is
not authorized by this section. **No production artifact has been issued under any version
of this schema**, so no migration is presently required by anything; the rule is stated
because the boundary is a property of the encoding and not of the deployment state.

## Deferred Concepts

The following are **deferred** and SHALL NOT be implemented under this section:

- authorized-subject attestations in any form — no field, no collection, no subject-kind
  union, no placeholder, and no dormant extraction path;
- attestation extraction, validation, or attestation-backed applicability authority;
- legacy attestation migration;
- automatic Ratification-Ledger ingestion beyond this source contract.

Introducing attestations later SHALL require either a new snapshot schema version or a
separately ratified overlay. They SHALL NOT be added to
`nexus-ratification-authority-snapshot/3`.

---

# Repository Policy Corpus Source

## Purpose and Ownership Boundary

The Repository Policy Corpus Source is the deterministic derivation, from an exact pinned
governed octet sequence, of the complete enumerated collection of Repository Policy versions
together with a reproducible commitment to that collection.

Corpus assembly answers exactly one question:

> Which Repository Policy versions do these governed source octets declare, and what does each
> of them declare?

Corpus assembly SHALL NOT select a Repository Policy version for an evaluation. It receives no
governance evaluation request, no Mission identity, and no Policy Criterion evaluation input,
and it produces no Governance Decision. Corpus assembly SHALL NOT determine whether an
authorizing Ratification is effective, and SHALL NOT produce `Valid`, `Invalid`, or
`Unresolvable`.

This section is written to be independently implementable from its own text together with the
sections of this specification it names. Every grammar, schema, field order, constant,
ordering rule, and output shape that a conforming implementation needs is stated here or in a
named section of this specification. An implementation SHALL NOT need to consult an existing
implementation, a test suite, or an evidence artifact to reproduce the governed octets or the
commitments derived from them.

## Relationship to Ratification Authority Snapshot Issuance

Corpus assembly and Ratification Authority Snapshot Issuance are two independent derivations
over the same governed artifact. They are not the same derivation, and neither is defined in
terms of the other's output.

The Ratification Authority Snapshot is not the Repository Policy corpus and SHALL NOT be read,
extended, or reinterpreted as one. `nexus-ratification-authority-snapshot/3` carries one
lifecycle-authority record per Ratification entry; it carries no Repository Policy identity, no
Policy version, no declared profile kind, and no Mission applicability scope. This section adds
no field to that schema, reserves none, reinterprets none, and reads none.

Corpus assembly consumes, unamended, the following sections of Ratification Authority Snapshot
Issuance, which state how governed octets are *read* and are not Snapshot schema:

- Governed Source Text Preparation, in full, including the rule that no line is trimmed,
  padded, folded, or case-normalized, and including the rule that preparation is not mutation;
- Fenced Regions, in full;
- Governed Entry Extraction Grammar, in full, including the entry boundary grammar, the section
  grammar, the content-line definition, the required sections, and the field rules.

Consuming those sections is not an amendment of them. Corpus assembly adds no rule to them,
omits none, and reinterprets none.

Because both derivations prepare the same artifact by the same rules, `corpusSourceRevision`
and `authoritySourceRevision` take equal values whenever both are computed over the same source
revision. That equality is expected. It carries no cross-artifact authority: an equal revision
digest establishes only that the two derivations read the same prepared text, and never that
either derivation's records, roots, or commitments are comparable to the other's.

Corpus assembly reads the `## Current Status` section only for entry-structure conformance
under the consumed grammar. It derives no authority from that section's value, performs no
lifecycle resolution, and applies no generic source rule.

## Canonical Serialization

Every octet sequence this section commits to SHALL be produced by NCCS-1 exactly as RFC-0003
v1.1 § Canonical Serialization Protocol defines it. That subsection is the complete and
exclusive definition of the encoding. This specification adds no framing rule, omits none, and
reinterprets none.

In particular: rule 4 String length is the decimal UTF-8 **byte** length; rule 8 records encode
in **fixed declared schema order** and SHALL NOT be sorted dynamically; rule 5 ordered
collections are not auto-sorted, and their order is the order this schema declares; rule 6
collections are sorted ascending by encoded octets and a duplicate fails closed under rule 7;
and rule 12's enumerated conditions fail closed.

Rule 8 encodes a record as its field count followed by its `(fieldName, value)` pairs in fixed
declared order. **The record's type name is not encoded.** The names used for schemas in this
section are expository.

## The Source Input Domain

The architectural input to corpus assembly is an **exact governed octet sequence** together
with the declared assembly facts defined below. Nothing else is an input.

The octet sequence is part of the public contract, not an implementation convenience: two
conforming implementations SHALL classify the same supplied octets identically. An
implementation SHALL declare exactly one concrete carrier type for the octet sequence and SHALL
reject every other carrier with `invalid-input`, whether or not the rejected carrier holds the
same octets.

The concrete carrier is an implementation-adapter obligation. No language-specific type is an
architectural domain type of this specification.

**No caller-supplied record or applicability fact SHALL be accepted.** Corpus assembly SHALL
expose no parameter, field, or channel through which a Policy identity, a Policy version, a
predecessor, a scope, a Policy Criterion declaration, a content commitment, a record, a
current head, or a root could be supplied. A fabricated declaration must be smuggled into
governed octets to be attempted at all, where it becomes a governed change subject to
ratification.

## The Named Source Authority

The governed source artifact is the repository Ratification Ledger, under the stable identity
`nexus-repository-ratification-ledger`. It is the named source authority for this contract.

That artifact is the source authority because this specification already requires that a
Repository Policy be **ratified** — that it "originate only from an approved Ratification
(`RATIFICATION_LEDGER.md`) or an equivalently Sprint-Owner-authorized source." The universe of
Repository Policy versions is therefore not an external population an assembler samples; it is
exactly the population that governed Ratification octets declare. This section makes that
identity operative rather than introducing a new authority.

An equivalently Sprint-Owner-authorized source, as that existing attribute permits, becomes a
corpus source only by a ratification that names it, states its identity, and states its
extraction rule under this contract. No such additional source is named here.

## The Repository Policy Declaration Section

Within an entry, Repository Policy declarations are carried in the section whose heading is
exactly:

`## Repository Policy Declarations`

An entry with no such section declares no Repository Policy version. **That is not a defect.**
A governed Ratification that authorizes no Repository Policy contributes zero corpus records,
and the corpus correctly holds no record attributing to its identifier. Absence SHALL NOT be
read as omission.

`## Repository Policy Declarations` is an optional section. Its presence and its content are
governed by the consumed Governed Entry Extraction Grammar exactly as every other section is:
a heading repeated within one entry fails closed as `duplicate-section`, and a heading inside a
fenced region is not a section heading.

## Governed Policy Declaration Block Grammar

Within `## Repository Policy Declarations`, exactly one fenced block carries every declaration.
Over the section's body lines:

| Condition | Failure |
| --- | --- |
| No line is exactly ` ```text ` | `missing-declaration-block` |
| No later line is exactly ` ``` ` | `unterminated-declaration-block` |
| A second ` ```text ` line occurs before the closing line | `nested-declaration-block` |
| Any content line occurs after the closing line | `extraneous-declaration-content` |

The block body is every line strictly between the opening and closing lines. Indentation is
fixed and significant: exactly two spaces at policy-element level, exactly four at mission and
profile level. Every token is matched exactly, as a literal prefix of the whole line.

```text
nexus-repository-policy-declarations/1
policy <policy identity>
  version <policy version>
  predecessor initial
  scope RepositoryWide
  content <exact section heading, verbatim, including its leading number sign run>
  contentCommitment <64 lowercase hexadecimal characters>
  criterion <criterion identity>
    profile <governance evaluation input profile>
  end-criterion
  [further criteria]
end-policy
policy <policy identity>
  version <policy version>
  predecessor <policy version>
  scope MissionSet
    mission <mission identity>
    [further missions]
  content <exact section heading, verbatim, including its leading number sign run>
  contentCommitment <64 lowercase hexadecimal characters>
  criterion <criterion identity>
    profile <governance evaluation input profile>
  end-criterion
end-policy
end-block
```

`scope ScopeUndeclared` is the third and final admissible `scope` line. It carries no `mission`
line.

**Two grammar levels, stated exactly.** Every body line lies at exactly one of two levels, and
the level decides which code classifies its defects. This partition is total: there is no body
line at neither level and none at both.

- A body line lies at **element level** when it falls strictly between a `policy` line that
  opened an element and that element's `end-policy` line.
- Every other body line lies at **block level**.

Block level is classified by the block-scoped codes, which carry `EntryPayload`. Element level is
classified by the element-scoped codes, which carry an ordinal or identity payload. The partition
exists so that every declaration defect has a populable payload: at block level no `policy`
element has been opened, so no policy ordinal exists to name, and a block-scoped code is the only
one whose payload can be populated.

**Body rules.**

- The first body line SHALL be exactly `nexus-repository-policy-declarations/1`, and the last
  body line SHALL be exactly `end-block` with no body line following it, else
  `block-grammar-violation`.
- Every block-level body line other than the format line and the terminal `end-block` line SHALL
  be a `policy` line opening an element, else `block-grammar-violation`. This is exhaustive over
  block level and admits no residue: a line following a completed `policy` element and preceding
  `end-block`, a line preceding the first `policy` element, an `end-policy` line with no open
  element, and a `policy` line opened but never closed before `end-block` are each
  `block-grammar-violation`.
- `block-grammar-violation` is block-scoped: it classifies a defect of the block envelope or of
  the region between elements, where no `policy` element has been delimited and no policy ordinal
  exists. It therefore carries `EntryPayload`, naming the entry that carries the block. It SHALL
  NOT be reported for a defect at element level, and no element-scoped code SHALL be reported for
  a defect at block level.
- A block SHALL contain at least one `policy` element, else `empty-declaration-block`.
- The lines of a `policy` element SHALL appear at element level in exactly this order:
  `version`, `predecessor`, `scope` with its `mission` lines where the variant carries them,
  `content`, `contentCommitment`, then **zero or more** `criterion` groups, then `end-policy`.
  Any element-level line that does not carry its expected literal prefix at its expected position
  SHALL fail closed as `declaration-grammar-violation`, whose `policyOrdinal` is always populable
  because the element it sits in has, by the definition of element level, already been opened by
  a `policy` line.
- **Criterion cardinality is a semantic rule, not a grammar rule.** The element grammar admits
  zero `criterion` groups precisely so that a syntactically well-delimited policy element
  declaring none reaches `missing-criterion-declaration` rather than being consumed first by
  `declaration-grammar-violation`. An `end-policy` line immediately following `contentCommitment`
  is therefore **grammatically valid** and SHALL NOT be reported as a grammar defect; it is
  reported by the later `missing-criterion-declaration` pass, which carries `PolicyPayload` and
  runs after the identity and version grammars have established those fields.
- A policy identity SHALL match `<lowercase alphanumeric run>(-<lowercase alphanumeric run>)*`
  exactly, else `policy-identity-grammar-violation`. An empty policy identity fails under the
  same code, because an empty string does not match that grammar.
- A criterion identity SHALL match the same grammar, else
  `criterion-identity-grammar-violation`. It is a separate code from the Policy identity code:
  the two name different targets, and collapsing them would prevent an implementation from
  reporting which of them failed.
- A policy version SHALL be a decimal digit run with no leading zero, whose value is at least
  1, else `policy-version-grammar-violation`. A `predecessor` value SHALL be either the exact
  token `initial` or a policy version under the same grammar, else
  `policy-version-grammar-violation`.
- A `scope` value outside `RepositoryWide`, `MissionSet`, and `ScopeUndeclared` SHALL fail
  closed as `unsupported-scope-kind`.
- `RepositoryWide` and `ScopeUndeclared` SHALL carry no `mission` line, and `MissionSet` SHALL
  carry at least one, else `scope-variant-mismatch`.
- `mission` lines SHALL appear in Mission Ordering Comparator order as ratified under Mission
  Applicability Scope, else `mission-ordering-violation`; a repeated Mission identity SHALL
  fail closed as `duplicate-mission-identity`; an empty Mission identity SHALL fail closed as
  `empty-mission-identity`.
- A `policy` element SHALL declare at least one `criterion` group, else
  `missing-criterion-declaration`. This is the criterion-count rule the element grammar defers to
  it, and it is the sole classification of a well-delimited zero-criterion element. It is a rule
  about a declaration's own required content, and it is not a Repository Policy selection
  cardinality rule, which remains deferred and unestablished.
- A `profile` value outside `ReviewGovernanceEvaluationInput` and
  `CorpusReadinessAcceptanceEvaluationInput` SHALL fail closed as
  `unsupported-evaluation-input-profile`. Declaring the profile is carrying a declaration as
  data; it is not evaluation, and it neither activates nor undefers the
  `CorpusReadinessAcceptanceEvaluationInput` profile.
- Two `criterion` groups within one `policy` element naming the same criterion identity SHALL
  fail closed as `duplicate-criterion-identity`.
- A `contentCommitment` value that is not 64 lowercase hexadecimal characters SHALL fail closed
  as `malformed-content-commitment`: the token simply is not a digest, which is a grammar
  defect and not an encoder defect.

## Policy Version Lineage and the Current Head

Lineage is validated per Policy identity, over every corpus record the source declares for that
identity, in record order.

- Exactly one version of a Policy identity SHALL declare `predecessor initial`, and its
  `version` SHALL be exactly `1`. A version other than `1` declaring `initial` SHALL fail
  closed as `initial-version-not-one`. A version `1` declaring a predecessor SHALL fail closed
  as `initial-version-with-predecessor`. A Policy identity whose declared versions include no
  `initial` version SHALL fail closed as `non-initial-version-without-predecessor`.
- Every version other than `1` SHALL declare a `predecessor` whose value is exactly that
  version minus one, else `predecessor-not-immediate`.
- The declared predecessor SHALL itself be a declared version of the same Policy identity, else
  `absent-predecessor-version`. This is the gap detector: declaring versions 1 and 3 without 2
  fails here.
- No two records SHALL carry the same `(policyIdentity, policyVersion)` pair, else
  `duplicate-policy-version`.

**Competing successors are structurally inexpressible.** Because every non-initial version's
predecessor is fixed at that version minus one, and because `(policyIdentity, policyVersion)`
is unique, no two records can name the same predecessor. Two competing successors cannot be
declared, rather than merely being rejected.

**Current head.** The declared versions of a Policy identity therefore form the complete
sequence 1 through N with no gap and no branch. The **current lineage head** of that Policy
identity at a corpus revision is the record whose version is N — equivalently, the unique
record no other record names as its predecessor. It is derived, never declared, and never
supplied by a caller.

**Preserved history is not the candidate universe.** The corpus enumerates both populations and
commits to both, and they SHALL NOT be conflated:

- **preserved history** — every declared record, of every version, in record order. A
  superseded version remains permanently preserved and remains the version of record for every
  Policy Evaluation and Governance Decision that cited it;
- **current-head universe** — exactly one record per Policy identity, in record order
  restricted to heads. This is the enumeration a new-evaluation candidate assembly consumes.

A version that is `ScopeUndeclared` remains in the current-head universe while it is the
current head of its Policy identity; once superseded it is preserved and is no longer a current
head. That is version selection. It is not scope migration: no `ScopeUndeclared` version is
mutated, back-filled, annotated, repaired, or treated as `RepositoryWide` or as having any
implied scope, and the Legacy Versions and Migration rules under Mission Applicability Scope
remain in force exactly as ratified.

## Content Binding

Each `policy` element SHALL bind the complete content of its Repository Policy version, not
merely the selection projection this section's record schema carries.

The `content` line names, verbatim and in full including its leading number sign run, a section
heading of the **same entry**. That section SHALL exist, else `absent-content-section`. It
SHALL NOT be `## Repository Policy Declarations`, else `self-referential-content-section`: a
commitment computed over a section that carries the commitment is a fixed-point problem this
specification neither states nor authorizes.

**The prepared section text.** The commitment is computed over the **prepared section text**,
which is defined here and only here:

> The prepared section text of a named section is that section's heading line, verbatim,
> followed by every body line from the line immediately after the heading up to but excluding
> the next section heading, with all of those lines joined by a single `LF`. A section heading
> is a line that lies outside every fenced region and begins with `## `, exactly as the consumed
> Governed Entry Extraction Grammar defines it.

**Every line is included. No line is omitted, filtered, trimmed, padded, folded, or
case-normalized.** In particular an empty line is included as an empty line, and a body line
consisting of exactly the three characters `---` is included exactly as it occurs.

**The filtered content-line projection SHALL NOT be used for this purpose.** The consumed
grammar's *content line* definition — a body line that is neither empty nor exactly `---` —
governs the required source fields of an entry and nothing else. Computing a content commitment
over that projection would leave an empty line and a literal `---` line outside the commitment,
so adding, deleting, or moving either would change the Policy version's content while leaving
its `contentCommitment`, its corpus record fingerprint, and its content-binding validation
unchanged. A commitment that a content change can survive does not bind the content. The
Conformance Vectors below demonstrate that failure with literal digests.

**A content section SHALL NOT be the final section of its entry**, else
`terminal-content-section`. This is a load-bearing rule, not a stylistic one. An entry runs to
the next entry boundary, so the blank line, the `---` separator line, and the blank line that
precede the following entry's boundary belong textually to the preceding entry's final section.
Appending a later Ratification to the governed source would therefore change the prepared
section text of a terminal section, and with it a previously committed content digest. Requiring
a following section — in practice the required `## Current Status` section, which is never a
content section — makes every content commitment stable under append.

The **content digest** is the SHA-256 digest of the NCCS-1 String encoding of the prepared
section text, rendered as 64 lowercase hexadecimal characters.

The declared `contentCommitment` SHALL equal the content digest recomputed from the pinned
prepared source, else `content-binding-mismatch`.

**The commitment is verified, not trusted.** Because the digest is recomputed from the pinned
octets rather than accepted from a declarant, a change to a Policy version's content under an
unchanged declaration block is detected by assembly itself, and a declaration cannot outlive
the content it commits to.

**The heading is inside the commitment.** Renaming a content section without updating its
declaration produces `absent-content-section`; renaming both produces `content-binding-mismatch`.
Two Repository Policy versions whose content bodies are byte-identical therefore still receive
distinct content digests, because their headings differ.

## The Two Source Facts

An assembled corpus SHALL record two distinct source facts, and SHALL NOT collapse them:

- **`corpusSourceIdentity`** — which governed artifact the corpus was assembled from. Stable
  across every revision of that artifact's content. It SHALL NOT be a filesystem path, a URL,
  or any other environment-dependent locator.
- **`corpusSourceRevision`** — which octets of that artifact were read. It SHALL be the SHA-256
  digest of the NCCS-1 String encoding of the **prepared** source text as defined under
  Governed Source Text Preparation, not of the raw file octets, rendered as 64 lowercase
  hexadecimal characters.

Collapsing the two would destroy the distinction between "the same artifact at a different
revision" and "a different artifact". Both SHALL be bound into the corpus root and into the
envelope.

## Fixed Protocol Constants

These values are fixed by this specification. An implementation SHALL NOT parameterize them,
derive them from its environment, or accept them from a caller.

| Constant | Value |
| --- | --- |
| `corpusSourceIdentity` | `nexus-repository-ratification-ledger` |
| `canonicalSerializationProtocolId` | `NCCS-1` |
| `policyCorpusSchemaVersion` | `nexus-repository-policy-corpus/1` |
| Corpus record fingerprint prefix | `pc-sha256-` |
| Corpus root prefix | `cr-sha256-` |
| Corpus envelope commitment prefix | `cce-sha256-` |
| Declaration section heading | `## Repository Policy Declarations` |
| Declaration block format line | `nexus-repository-policy-declarations/1` |
| Initial predecessor token | `initial` |

Every digest is SHA-256 per FIPS 180-4, rendered as 64 lowercase hexadecimal characters. A
prefixed value is the prefix immediately followed by that rendering.

## Repository Policy Corpus Records

An assembled corpus contains exactly one **Repository Policy Corpus Record** per conforming
`policy` element in the source. Each record declares:

- `policyIdentity`;
- `policyVersion`;
- `authorizingRatificationIdentifier` — **derived**, never declared: it is the identifier of the
  entry carrying the declaration. A declarant therefore cannot attribute a Policy version to a
  Ratification other than the one that declares it;
- `predecessorVersions` — the empty collection exactly when the version is initial, and exactly
  one element otherwise;
- `scopeDeclarationState` — exactly one of `Declared` or `ScopeUndeclared`;
- `missionApplicabilityScope` — the empty collection exactly when `ScopeUndeclared`, and
  exactly one ratified `MissionApplicabilityScope` record otherwise;
- `criterionDeclarations` — a non-empty ordered collection of Policy Criterion declarations,
  each carrying a criterion identity and its declared Governance Evaluation Input Profile;
- `contentCommitment` — the verified content digest.

A record carries no attribution outcome, no version-existence flag, no eligibility verdict, and
no evaluation result. Those are evaluation-time facts owned elsewhere, and a corpus record
SHALL NOT carry them.

## Canonical Schemas and Field Order

Every schema below is a rule 8 record. **Field order is fixed as listed and SHALL NOT be
sorted.** Field kinds are exactly as declared under Ratification Authority Snapshot Issuance §
Canonical Schemas and Field Order, consumed unamended: `String`, `Integer`, `Identity`,
`Digest`, `Enumeration`, `OrderedList(T)`, `OrderInsensitiveStrings`, and `Record(S)`.

**`PolicyCriterionDeclaration`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `criterionIdentity` | `Identity` |
| 2 | `evaluationInputProfile` | `Enumeration(ReviewGovernanceEvaluationInput, CorpusReadinessAcceptanceEvaluationInput)` |

**`RepositoryPolicyCorpusRecord`**

| # | Field | Kind |
| --- | --- | --- |
| 1 | `policyIdentity` | `Identity` |
| 2 | `policyVersion` | `Integer` |
| 3 | `authorizingRatificationIdentifier` | `Identity` |
| 4 | `predecessorVersions` | `OrderedList(Integer)` |
| 5 | `scopeDeclarationState` | `Enumeration(Declared, ScopeUndeclared)` |
| 6 | `missionApplicabilityScope` | `OrderedList(Record(MissionApplicabilityScope))` |
| 7 | `criterionDeclarations` | `OrderedList(Record(PolicyCriterionDeclaration))` |
| 8 | `contentCommitment` | `Digest` |

Fields 4 and 6 are ordered collections of zero or one element rather than nullable fields or
discriminated arms. The coupling is exact and SHALL fail closed otherwise:
`predecessorVersions` is empty if and only if `policyVersion` is `1`, and
`missionApplicabilityScope` is empty if and only if `scopeDeclarationState` is
`ScopeUndeclared`.

`MissionApplicabilityScope` is the ratified two-field record consumed exactly as
`NEXUS-RAT-2026-08-02-002` defines it. No field is added to it, and no third variant is
declared.

**`CorpusRootBasis`** — field order is ascending by field name.

| # | Field | Kind |
| --- | --- | --- |
| 1 | `canonicalSerializationProtocolId` | `Identity` |
| 2 | `corpusRecordFingerprints` | `OrderInsensitiveStrings` |
| 3 | `corpusSourceIdentity` | `Identity` |
| 4 | `corpusSourceRevision` | `Digest` |
| 5 | `currentHeadFingerprints` | `OrderInsensitiveStrings` |
| 6 | `policyCorpusSchemaVersion` | `Identity` |
| 7 | `recordCount` | `Integer` |

**`CorpusEnvelopeCommitmentBasis`** — field order is ascending by field name.

| # | Field | Kind |
| --- | --- | --- |
| 1 | `canonicalSerializationProtocolId` | `Identity` |
| 2 | `capturedAt` | `String` |
| 3 | `corpusRoot` | `Identity` |
| 4 | `corpusSourceIdentity` | `Identity` |
| 5 | `corpusSourceRevision` | `Digest` |
| 6 | `policyCorpusSchemaVersion` | `Identity` |
| 7 | `producingAttribution` | `Record(ProducingAttribution)` |
| 8 | `recordCount` | `Integer` |

`ProducingAttribution` is the ratified two-field record consumed exactly as declared under
Ratification Authority Snapshot Issuance. No field is added to it.

## Corpus Root and Envelope Commitment

Assembly produces exactly three commitment layers:

1. **Corpus record fingerprint** — the corpus record fingerprint prefix followed by the SHA-256
   digest of the `RepositoryPolicyCorpusRecord` encoding of one record.
2. **Corpus root** — the corpus root prefix followed by the SHA-256 digest of the
   `CorpusRootBasis` encoding.
3. **Corpus envelope commitment** — the corpus envelope commitment prefix followed by the
   SHA-256 digest of the `CorpusEnvelopeCommitmentBasis` encoding.

**The corpus root SHALL be derived from governed octets alone.** It is therefore
assembler-independent and time-independent: two structurally independent implementations
reading the same octets SHALL produce the same root, and re-deriving it later SHALL not change
it. The corpus root SHALL NOT bind the capture instant or the producing attribution.

The root binds **both** fingerprint collections. Binding only the record fingerprints would
leave the current-head derivation uncommitted, and an assembler could then present a different
candidate universe under an unchanged root.

Both fingerprint collections are committed order-insensitively, because a corpus is an
immutable **collection**; its root SHALL NOT depend on the order the records were read in. A
duplicate fingerprint fails closed under NCCS-1 rule 7.

**The envelope commitment SHALL bind the corpus root, both source facts, the canonical
serialization protocol identifier, the capture instant, the producing attribution, the record
count, and the corpus schema version.** It is deliberately not assembler-independent: it
records who computed the root and when.

**No corpus root, envelope commitment, or record fingerprint SHALL be recorded inside the
governed source it is derived from.** Self-inclusion would make the one-pass derivation stated
in this section circular. A ratification that authorizes assembly SHALL therefore state the
contract, never pin a value produced by it.

## Declared Assembly Facts

Exactly two facts are declared rather than derived, and each is exactly as declared under
Ratification Authority Snapshot Issuance § Declared Issuance Facts, consumed unamended:

- **`capturedAt`** — RFC 3339 UTC, second precision, literal `Z`, in the form
  `YYYY-MM-DDThh:mm:ssZ`, subject to every constraint that section states. An implementation
  SHALL NOT read a system clock internally.
- **`producingAttribution`** — exactly `producingImplementationIdentity` and
  `producingImplementationRevision`, each a non-empty String.

No other declared field SHALL be accepted. An unrecognized declared field SHALL be rejected,
not ignored. There is no declared channel for a record, a policy identity, a version, a
predecessor, a scope, a criterion, a content commitment, a current head, or a root.

## Deterministic Ordering

Every term below is defined by position in the prepared text. No traversal term is left to be
inferred from another, and none depends on a data structure's insertion order.

- **Entry order** is consumed unamended from Ratification Authority Snapshot Issuance §
  Deterministic Ordering: the ascending source-line order of entry boundaries in the prepared
  text. **Every** entry is traversed, including entries that declare no Repository Policy.
- **Block order** is the entry order of the entry carrying the declaration block. An entry
  carries at most one such block, so block order is total.
- **Policy declaration order within a block** is the ascending source-line order of the `policy`
  lines that open each element in that block.
- **Record order** is block order, then policy declaration order within the block.
- **Criterion order** within a policy element is the ascending source-line order of its
  `criterion` lines.
- **Mission order** within a scope is the ascending source-line order of its `mission` lines,
  which the Mission Ordering Comparator constrains to be strictly ascending by encoded octets.
- **Current-head order** is record order restricted to the records that are current heads.
- **Fingerprint collection order**, for both committed collections, is NCCS-1 rule 6: ascending
  by encoded octets.
- **Phase order is execution order**, as defined below.

Given identical octets and identical declared facts, two conforming implementations SHALL
produce identical results in every field, including the reported diagnostic and its payload.

## Completeness, Omission, and Injection

**Completeness is closed by construction, and is not asserted by an assembler.**

Assembly is a total function of the pinned prepared text. Every entry is traversed in entry
order; every `## Repository Policy Declarations` section of every entry is read; every
conforming `policy` element becomes exactly one record; no filter is applied and no selection
is exercised. Two assemblers given the same `corpusSourceRevision` therefore necessarily
enumerate the same universe, because the enumeration is a function of the pinned octets alone
and of nothing else. Neither assembler consults, and neither can consult, a population outside
those octets.

The four detection cases are exactly these, and each is decided from the pinned governed source
rather than from an assembler's assertion:

| Case | Detection |
| --- | --- |
| **Omission** — an assembler emits fewer records than the pinned text declares | Re-derivation from the same `corpusSourceRevision` yields a different `recordCount`, different `corpusRecordFingerprints`, and therefore a different `corpusRoot`. The omitting assembler's root does not reproduce. Detection requires no trust in the assembler and no external register. |
| **Injection** — an assembler emits a record with no corresponding conforming declaration in the pinned text | Re-derivation excludes the injected record, changing `recordCount` and both fingerprint collections, and therefore the root. A self-consistent injected record cannot survive re-derivation. |
| **Changed Policy content under an unchanged declaration** | Two independent detectors. The prepared text changed, so `corpusSourceRevision` changes and a corpus pinned to the old revision no longer describes the new source. Independently, `content-binding-mismatch` rejects assembly outright, because the recomputed content digest no longer equals the declared `contentCommitment`. |
| **A governed Ratification that authorizes no Repository Policy** | The entry carries no `## Repository Policy Declarations` section, contributes zero records, and is not a defect. The corpus correctly holds no record whose `authorizingRatificationIdentifier` is that identifier. Absence SHALL NOT be reported as omission, and SHALL NOT cause rejection. |

An **empty corpus is admissible.** A source declaring no Repository Policy version assembles to
`recordCount` zero, two empty fingerprint collections, and the corpus root of that basis. Zero
records is `Assembled`, never `Rejected`.

## Relationship to Attribution Validation

The corpus enumerates and commits Repository Policy versions and binds each to its authorizing
Ratification identifier. It determines nothing further about that Ratification.

Whether an authorizing Ratification is Effective, Superseded, or Withdrawn is determined solely
by the Ratification Authority Snapshot as ratified by `NEXUS-RAT-2026-07-31-001`, and resolving
one supplied Policy version's Ratification reference to `Valid`, `Invalid`, or `Unresolvable`
remains owned solely by `RatificationAttributionValidation` as ratified by
`NEXUS-RAT-2026-07-15-017`. Neither ratification is amended, narrowed, or superseded by this
section.

The two capabilities are independent, not sequential alternatives. An assembled corpus is
evidence of **what the governed source declares**. It is not evidence that a declared Policy
version is authorized, and it SHALL NOT be described, recorded, or reported as such.

## Bootstrap, Append, and Supersession

**Bootstrap.** At the revision at which this section is applied, the governed source carries no
`## Repository Policy Declarations` section. The initial corpus is therefore empty. An empty
initial corpus is deliberate and is preferred to an inferred one: no exact governed Repository
Policy instance can presently be proven from governed octets, and inferring one would create
the very unpinned universe this section exists to close.

No implementation object, test fixture, in-memory repository content, unratified file, or
existing prose description SHALL be imported as a corpus record. Populating the corpus is a
governance action.

**Append.** A Repository Policy version enters the corpus only through a Ratification whose
entry carries both its conforming `policy` declaration and the content section that declaration
commits to. Appending an entry to the governed source is an append-only change that preserves
every existing octet as a byte-identical prefix of the result, exactly as Governed Source Text
Preparation requires.

**Supersession.** A superseding Repository Policy version is a new `policy` element in a new
entry, declaring its immediate predecessor. No existing declaration is edited, re-declared,
narrowed, or repaired in place. Supersession changes which record is the current head; it
removes nothing from preserved history.

## The Total Result Contract

Corpus assembly SHALL be total: exactly `Assembled` or `Rejected`, never an unhandled failure
for any governed input. It SHALL NEVER produce `Issued`, `Valid`, `Invalid`, or `Unresolvable`.

### Result Schemas

An `Assembled` result SHALL carry:

- `result` — `Assembled`;
- `envelope` — `canonicalSerializationProtocolId`, `capturedAt`, `corpusRoot`,
  `corpusSourceIdentity`, `corpusSourceRevision`, `policyCorpusSchemaVersion`,
  `producingAttribution`, `recordCount`;
- `envelopeCommitment`;
- `records` — the preserved history, in record order;
- `recordFingerprints` — the order-insensitive record fingerprint collection as committed;
- `currentHeads` — the current-head universe, in current-head order;
- `currentHeadFingerprints` — the order-insensitive current-head fingerprint collection as
  committed;
- `policyIdentityCount`.

A `Rejected` result SHALL carry:

- `result` — `Rejected`;
- `diagnosticCode` — one code from the closed public vocabulary;
- `diagnosticPhase` — that code's declared phase;
- `diagnosticPrecedence` — that phase's rank;
- `diagnosticPayload` — the exact discriminated payload, carrying its variant name;
- `detail` — the derived canonical rendering.

A `Rejected` result SHALL carry no partial corpus. A corpus is assembled in whole or not at
all.

The canonical rendering of a payload is: the empty string for `NoPayload`; otherwise the
variant's fields, in declared order, joined by ` :: `.

### Diagnostic Phases

Precedence is defined first by **phase**, and phase order SHALL be execution order. A phase is
atomic and runs to a decision before the next begins, so when a source carries several
independent defects the reported diagnostic is always drawn from the lowest-ranked phase
containing any defect, wherever in the source the defects sit.

There are **six governed phases**, ranked 0 through 5, and a seventh partition,
`ContractViolation` at rank 6, which is not a governed outcome.

| Rank | Phase | Partition | Meaning |
| --- | --- | --- | --- |
| 0 | `SourceIntegrity` | public | The octets are not admissible as governed source. |
| 1 | `EntryStructure` | public | The source is text, but its entry structure is not readable. |
| 2 | `DeclarationGrammar` | public | Entries are readable, but a policy declaration block is malformed. |
| 3 | `PolicyLineage` | public | Declarations parse, but the asserted version lineage is not a lineage. |
| 4 | `ContentBinding` | public | Lineage is sound, but a declaration does not bind the content it commits to. |
| 5 | `Envelope` | public | Records assembled, but a declared assembly fact was inadmissible. |
| 6 | `ContractViolation` | not a governed outcome | The implementation violated its own contract. |

### Within-Phase Precedence

Each phase declares its codes in a fixed order — the order in which they are listed under The
Closed Public Vocabulary below. **That order is normative, and it is also the order in which
the phase executes.** A phase SHALL run as a sequence of passes, one per declared code, in
declared order; each pass SHALL examine every target of that code under the phase's
deterministic traversal order and SHALL report the first target that fails.

Equivalently: the reported diagnostic is the minimum, **code-major**, of the pair

> (position of the code within its phase, position of the target under the phase's traversal
> order)

A **target-major** rule SHALL NOT be used. It would leave a conforming implementation free to
report either of two same-phase codes depending on the order in which it examined one target,
and identical inputs would no longer produce identical results.

The declared code order is not free. A pass SHALL only read data whose well-formedness every
earlier-listed pass has already established across the whole source. Three consequences are
load-bearing and are stated here so that no implementation has to rediscover them:

- Within `SourceIntegrity`, `invalid-utf8` precedes `byte-order-mark-present`, so an
  implementation SHALL decode before testing for a byte order mark.
- Within `DeclarationGrammar`, the block-level codes precede every code that reads a `policy`
  element, and `declaration-grammar-violation` precedes every code that reads a token's value:
  a line whose expected prefix is absent has no known value to validate.
- `DeclarationGrammar` is **total over the block body** because the two grammar levels partition
  every body line and each level is exhaustively classified: every block-level line that is not
  the format line, the terminal `end-block`, or a `policy` opener is `block-grammar-violation`,
  and every element-level line that does not carry its expected prefix at its expected position
  is `declaration-grammar-violation`. No admissible governed body line escapes both, and neither
  code is ever reported where its payload could not be populated.
- `missing-criterion-declaration` runs **after** `declaration-grammar-violation` and reports a
  condition that pass cannot consume, because the element grammar admits zero `criterion` groups.
  It is reachable exactly on a well-delimited element declaring none.
- Within `DeclarationGrammar`, `policy-identity-grammar-violation`,
  `policy-version-grammar-violation`, and `criterion-identity-grammar-violation` precede every
  code carrying `PolicyPayload`, `PolicyMissionPayload`, or `PolicyCriterionPayload`. This is
  what makes those payloads populable: by the time any of them is reported, the identity and
  version fields it names have already been established well-formed across the whole source. The
  three grammar codes themselves carry ordinal payloads precisely because they run before that
  is true.
- `PolicyLineage` runs after the whole of `DeclarationGrammar`, so every version and predecessor
  it compares is already a well-formed policy version, and `ContentBinding` runs after
  `PolicyLineage`, so no digest is recomputed for a source whose lineage is not a lineage.

Within `Envelope`, the declared inputs SHALL be examined in this order: `capturedAt`; the
`producingAttribution` container; `producingImplementationIdentity`;
`producingImplementationRevision`; unrecognized top-level declared fields; unrecognized
`producingAttribution` fields. Unrecognized fields SHALL be reported in **ascending name
order**.

### Target Selection Order

Within-phase precedence fixes *which code* is reported. When that code fails on more than one
target, the payload SHALL name the **first failing target** under the traversal order declared
here.

| Rank | Phase | Target traversal order |
| --- | --- | --- |
| 0 | `SourceIntegrity` | The source is the only target. No traversal. |
| 1 | `EntryStructure` | Entry order, refined exactly as Ratification Authority Snapshot Issuance § Target Selection Order refines it for that phase, consumed unamended. |
| 2 | `DeclarationGrammar` | Outermost first: block order, then policy declaration order, then criterion order, then mission order. |
| 3 | `PolicyLineage` | Record order. |
| 4 | `ContentBinding` | Record order. |
| 5 | `Envelope` | The declared-input examination order stated above. |

`duplicate-policy-version`, `duplicate-criterion-identity`, and `duplicate-mission-identity`
report the **later** duplicate — the one whose value a target earlier in the traversal order has
already claimed — consistently with the consumed `duplicate-entry-identifier` rule.

`non-initial-version-without-predecessor`, when a Policy identity declares no initial version at
all, reports that identity's lowest declared version.

Every `DeclarationGrammar` code reports its target at the finest granularity its payload
expresses: a block-scoped code reports the first failing block under block order, and names that
block's entry, because no finer target is delimited at block level; a policy-scoped code reports
the first failing `policy` element under block order then
policy declaration order; a criterion-scoped code reports the first failing `criterion` group
under that order then criterion order; a mission-scoped code reports the first failing `mission`
line under that order then mission order. Because the ordinal payloads are populated from
traversal position rather than from declared values, a malformed or empty identity is still
reported at its exact target, and two conforming implementations select the same one.

### Structured Diagnostic Payloads

Every `Rejected` result SHALL carry an exact discriminated payload. `detail`, where present,
SHALL be **derived** from that payload by the single canonical rendering rule above and SHALL
NOT be the data-bearing channel.

Every payload SHALL be discriminated by the exact field **`payloadKind`**, whose value is the
variant name. `payloadKind` SHALL be the payload's **first** field, and its value SHALL be
exactly one of the following nine, which are the whole vocabulary:

`NoPayload` · `EntryPayload` · `EntrySectionPayload` · `PolicyOrdinalPayload` ·
`CriterionOrdinalPayload` · `PolicyPayload` · `PolicyMissionPayload` ·
`PolicyCriterionPayload` · `DeclaredInputPayload`

The complete exact fields of each variant are:

| Payload variant | Complete exact fields, in order |
| --- | --- |
| `NoPayload` | `payloadKind` |
| `EntryPayload` | `payloadKind`, `ratificationIdentifier` |
| `EntrySectionPayload` | `payloadKind`, `ratificationIdentifier`, `sectionHeading` |
| `PolicyOrdinalPayload` | `payloadKind`, `ratificationIdentifier`, `policyOrdinal` |
| `CriterionOrdinalPayload` | `payloadKind`, `ratificationIdentifier`, `policyOrdinal`, `criterionOrdinal` |
| `PolicyPayload` | `payloadKind`, `ratificationIdentifier`, `policyIdentity`, `policyVersion` |
| `PolicyMissionPayload` | `payloadKind`, `ratificationIdentifier`, `policyIdentity`, `policyVersion`, `missionOrdinal` |
| `PolicyCriterionPayload` | `payloadKind`, `ratificationIdentifier`, `policyIdentity`, `policyVersion`, `criterionIdentity` |
| `DeclaredInputPayload` | `payloadKind`, `declaredField` |

`NoPayload` is therefore **not** an empty payload: `payloadKind` is its sole field, carrying the
value `NoPayload`.

**Ordinal payloads exist because an identity that failed its own grammar cannot name its
target.** A malformed or empty policy identity cannot populate a non-empty `policyIdentity`
field, and collapsing such a failure to `EntryPayload` would leave the payload naming only the
Ratification entry while the phase's traversal order names a specific `policy` element. The
ordinal payloads name that element by deterministic position instead:

- `policyOrdinal` is the 1-based position of the `policy` element under policy declaration order
  within its block;
- `criterionOrdinal` is the 1-based position of the `criterion` group under criterion order
  within its policy element;
- `missionOrdinal` is the 1-based position of the `mission` line under mission order within its
  scope.

Every field is a non-empty String. `policyOrdinal`, `criterionOrdinal`, and `missionOrdinal` are
carried as decimal text. `policyVersion` is carried as its exact declared decimal text.

**A code carrying `PolicyPayload`, `PolicyMissionPayload`, or `PolicyCriterionPayload` is
declared only where its identity and version fields are already known well-formed**, which the
within-phase code order below guarantees. No code is declared with a payload it could not
populate.

`declaredField` SHALL name the **exact leaf** at fault and SHALL NOT be widened to its
containing record.

A payload that does not match its declared variant exactly — a missing field, an extra field, a
wrongly typed field — SHALL be replaced by a contract violation rather than reported as a
governed outcome.

### The Closed Public Vocabulary

Exactly forty-five public diagnostic codes are declared. Every one SHALL be reachable through
the public assembly contract from governed octets and declared facts alone, and no code outside
this partition SHALL be reachable through it. Reachability is a property of the grammar and phase
rules stated above, not an assertion: in particular `block-grammar-violation` is reachable on any
block-level line that is not a `policy` opener, and `missing-criterion-declaration` is reachable
on a well-delimited policy element declaring zero `criterion` groups, because the element grammar
admits that shape rather than consuming it as `declaration-grammar-violation`.

**The order in which each phase's codes are listed below is normative**: it is that phase's
within-phase precedence and its pass execution order.

`SourceIntegrity` — `invalid-input` (NoPayload) · `invalid-utf8` (NoPayload) ·
`byte-order-mark-present` (NoPayload).

`EntryStructure` — `no-entries` (NoPayload) · `unterminated-fenced-region` (NoPayload) ·
`missing-section` (EntrySectionPayload) · `duplicate-section` (EntrySectionPayload) ·
`missing-identifier` (EntryPayload) · `identifier-grammar-violation` (EntryPayload) ·
`identifier-heading-mismatch` (EntryPayload) · `malformed-date` (EntryPayload) ·
`malformed-status` (EntryPayload) · `missing-subject` (EntryPayload) ·
`duplicate-entry-identifier` (EntryPayload).

`DeclarationGrammar` — `missing-declaration-block` (EntryPayload) ·
`unterminated-declaration-block` (EntryPayload) · `nested-declaration-block` (EntryPayload) ·
`extraneous-declaration-content` (EntryPayload) · `block-grammar-violation` (EntryPayload) ·
`empty-declaration-block` (EntryPayload) · `declaration-grammar-violation`
(PolicyOrdinalPayload) · `policy-identity-grammar-violation` (PolicyOrdinalPayload) ·
`policy-version-grammar-violation` (PolicyOrdinalPayload) ·
`criterion-identity-grammar-violation` (CriterionOrdinalPayload) · `unsupported-scope-kind`
(PolicyPayload) · `scope-variant-mismatch` (PolicyPayload) · `mission-ordering-violation`
(PolicyMissionPayload) · `duplicate-mission-identity` (PolicyMissionPayload) ·
`empty-mission-identity` (PolicyMissionPayload) · `missing-criterion-declaration`
(PolicyPayload) · `unsupported-evaluation-input-profile` (PolicyCriterionPayload) ·
`duplicate-criterion-identity` (PolicyCriterionPayload) · `malformed-content-commitment`
(PolicyPayload).

`PolicyLineage` — `duplicate-policy-version` (PolicyPayload) · `initial-version-not-one`
(PolicyPayload) · `initial-version-with-predecessor` (PolicyPayload) ·
`non-initial-version-without-predecessor` (PolicyPayload) · `predecessor-not-immediate`
(PolicyPayload) · `absent-predecessor-version` (PolicyPayload).

`ContentBinding` — `absent-content-section` (PolicyPayload) · `self-referential-content-section`
(PolicyPayload) · `terminal-content-section` (PolicyPayload) · `content-binding-mismatch`
(PolicyPayload).

`Envelope` — `malformed-capture-instant` (DeclaredInputPayload) · `malformed-attribution`
(DeclaredInputPayload).

The `SourceIntegrity` and `EntryStructure` codes are spelled identically to the correspondingly
named Ratification Authority Snapshot Issuance codes, because they classify the identical defect
in the identical governed text under the consumed grammar. They are nonetheless separate
declarations in a separate closed vocabulary. A corpus assembly result SHALL NOT be reported as
an issuance result, and an issuance result SHALL NOT be reported as a corpus assembly result.

### Contract Violations

Exactly three codes classify implementation defects and SHALL NOT be reachable through the
public contract: `undeclared-diagnostic`, `malformed-diagnostic-payload`, and
`internal-invariant-violation`. They are not governed outcomes.

A code emitted outside the declared vocabulary SHALL be replaced by `undeclared-diagnostic`
rather than passed through. An encoder failure raised on an already-validated fixed schema SHALL
be classified as `internal-invariant-violation`, never dressed as an `Envelope` outcome a caller
could have caused.

## Two Structurally Independent Implementations

Conformance SHALL be demonstrated by at least two structurally independent implementations.
Independence means: no shared encoder, no shared schema table, no shared vocabulary structure,
and no shared parsing component.

Both implementations SHALL agree on the complete public result, field for field, for identical
inputs — not merely on fingerprints. Both SHALL be cross-checked against RFC-0003's own
normative Conformance Vectors **before** any agreement between them is claimed.

## Schema Version and Compatibility

The corpus schema version is `nexus-repository-policy-corpus/1`.

It is a distinct schema from `nexus-ratification-authority-snapshot/3`. No fingerprint, root, or
commitment of either schema is comparable to any fingerprint, root, or commitment of the other.
Comparing them is meaningless, not merely inadvisable.

A future corpus schema version SHALL require its own ratification stating its scope. No
migration of any artifact is authorized by this section.

## Deferred Concepts

The following are **deferred** and SHALL NOT be implemented under this section:

- population of the corpus with any Repository Policy version; the corpus this section
  establishes is empty, and each version enters only through a later Ratification;
- issuance of any production corpus artifact, and pinning of any corpus root, envelope
  commitment, or record fingerprint;
- a separately issued Repository Policy Corpus Commitment artifact, its schema, its issuance
  protocol, and its derived root. Such an artifact may be established later only as a derived
  optimization over this ratified source;
- any Repository Policy selection rule, eligibility predicate, cardinality rule, attribution
  precedence rule, or Governance Decision recording shape;
- authorized-subject attestations in any form — no field, no collection, no subject-kind union,
  no placeholder, and no dormant extraction path;
- migration, back-fill, annotation, or repair of any `ScopeUndeclared` Repository Policy
  version;
- any addition to, reservation in, reinterpretation of, or read from the
  `nexus-ratification-authority-snapshot/3` schema, and any Snapshot issuance;
- any additional corpus source beyond the named source authority stated above;
- activation of the DORMANT `CorpusReadinessAcceptanceEvaluationInput` profile. Carrying that
  profile's identifier as a declared Policy Criterion profile kind is data, not activation.

Implementation of this section requires its own separate Sprint scope ratification.

---

# Repository Policy Selection and Version Binding

## Purpose and Ownership Boundary

Repository Policy Selection and Version Binding is the deterministic determination of which
single ratified Repository Policy version is applicable to exactly one Mission and exactly
one declared Governance Evaluation Input Profile instance, together with the exact binding
of that version into the resulting Governance Decision.

Selection answers exactly one question:

> Which ratified Repository Policy version, if any, is applicable to this Mission and this
> declared input profile kind?

Selection SHALL NOT evaluate whether the selected Policy's Criteria are satisfied. That
remains Policy Evaluation, below, and its criterion semantics are unchanged.

Selection SHALL NOT enumerate the Repository Policy corpus, assemble a corpus record, derive
a current lineage head, compute or verify a content commitment, compute a corpus root or
envelope commitment, or issue a corpus artifact. Repository Policy Corpus Source, above,
retains sole ownership of all of those. Selection consumes an assembled corpus's
current-head universe together with the corpus source identity, corpus source revision, and
corpus root that pin it, and produces none of them.

Selection SHALL NOT determine, alter, or contribute to the current applicability of a
Corpus Readiness Result. That remains governed, unchanged, by Corpus Readiness Acceptance
Evaluation and its Current Projection Applicability Selection rules, which this section
does not revise.

Selection SHALL NOT establish, extend, enumerate, or infer the authority of a Repository
Policy over any subject. This section introduces no subject, no subject-kind union, no
subject enumeration, and no attestation of an authorized subject. The only subject it
recognizes is the Mission, exactly as Mission Applicability Scope, above, already
recognizes it.

Selection SHALL NOT declare, synthesize, default, mutate, extend, narrow, re-order, or
fingerprint a `MissionApplicabilityScope`, and SHALL NOT authorize or perform any migration
of a `ScopeUndeclared` Repository Policy version. Mission Applicability Scope, above,
retains sole ownership of the scope, its closed union, its predicate, its Mission Ordering
Comparator, and its canonical encoding. Selection reads a Repository Policy version's
declared scope as the corpus records it and evaluates the already-ratified Mission
applicability predicate against it; it produces no scope and alters none.

Selection SHALL NOT infer a `MissionId`. The evaluation request's explicit Mission identity
is an input to the Mission applicability predicate and is never an output of it, exactly as
Mission Applicability Scope, above, requires. A request with an absent, malformed, or
unresolvable `MissionId` SHALL fail under Mission-Scoped Governance Evaluation, below,
before selection is reached.

Selection SHALL NOT resolve a Ratification reference and SHALL NOT produce a `Valid`,
`Invalid`, or `Unresolvable` attribution outcome. `RatificationAttributionValidation`, as
ratified by `NEXUS-RAT-2026-07-15-017`, retains sole authority over Ratification reference
resolution and over those three closed outcomes. Selection consumes an attribution result
already produced by that authority, together with the identity and fingerprint of the
Ratification Authority Snapshot it was produced against. Selection SHALL NOT infer the
existence, validity, or lifecycle status of a Ratification from an identifier's form,
spelling, or presence.

Selection SHALL NOT issue a Ratification Authority Snapshot, derive an authority root or an
envelope commitment, or add any field to the `nexus-ratification-authority-snapshot/3`
schema. It records the envelope commitment that issuance already produced, and reads it as an
opaque identifier of one issued artifact. Snapshot issuance remains governed solely by
`NEXUS-RAT-2026-07-31-001`, which this ratification amends in exactly one respect — the
closure of its deferral of Snapshot consumption in governance evaluation, to the exact extent of
Verification Step 5 — and in no other.

## Non-Modification of the Authorized Profiles

The `RepositoryPolicySelectionReference` is the output of the governed selection process
and a bound component of the Policy Evaluation request. It is not a field of either
authorized profile.

`ReviewGovernanceEvaluationInput`'s semantics, required inputs, failure handling, and wire
contract remain exactly those of v1.1 and are NOT modified by this section.

`CorpusReadinessAcceptanceEvaluationInput`'s exact field list under Corpus Readiness
Acceptance Evaluation is NOT modified, and that profile remains DORMANT under the
conditions already stated in Governance Evaluation Input Profiles, above. A Policy
Criterion's declared profile kind, carried as data in a Repository Policy Corpus Record, is
a declaration and not an evaluation; consuming it as an eligibility input neither activates
nor undefers that profile.

## Stage Model and Total Precedence

Selection is not a single act. It is three ordered stages with total precedence. A later
stage SHALL NOT execute until every earlier stage has completed for every candidate.

**Stage 1 — Candidate Set Assembly.** Performed by the Candidate Set Assembly Authority,
below, outside Policy Evaluation. Produces the pinned candidate collection and its
fingerprint from the current-head universe of one assembled Repository Policy Corpus.

**Stage 2 — Attribution Validation.** Performed by `RatificationAttributionValidation`
(`NEXUS-RAT-2026-07-15-017`) against the pinned Ratification Authority Snapshot, for every
assembled candidate without exception, before any eligibility test. This preserves, and does not restate, the ratified
requirement that attribution validation precedes Policy Criteria evaluation for every
Governance Decision production.

**Stage 3 — Selection.** Applies the Eligibility Predicate and the Selection Rules, below,
to the fully validated candidate collection, and produces exactly one
`RepositoryPolicySelectionReference`.

Policy Evaluation follows Stage 3 and SHALL NOT begin until Stage 3 has produced a
`Resolved` outcome.

Precedence is total and SHALL be applied in this exact order. The first condition that
holds determines the outcome; no later condition may override an earlier one:

1. Structural integrity of the selection reference itself (Rule 4).
2. Binding equality against the evaluation request (Rule 5).
3. Candidate-level **indeterminacy** (Rule 6).
4. Eligibility and cardinality (Rules 7, 8, 9).

Pre-Use Verification, below, strictly precedes all four. Its steps establish the recorded
facts against the authorities that own them, and no rule in this precedence order is reached
until every verification step has succeeded. Rule 10, Historical Version Non-Revival, is a
constraint on Stage 1 rather than a stage of Stage 3; its violation is detected at Pre-Use
Verification Step 4, and it is stated separately because its subject is which records may be
assembled at all.

**Indeterminacy is not the same as determinate exclusion, and the two SHALL NOT be
conflated.** This distinction is total and governs every stage, rule, failure mapping, and
diagnostic in this section:

- A candidate whose re-validated `attributionValidationOutcome` is `Unresolvable`, or whose
  carried corpus record is internally inconsistent, is **indeterminate**: its authority cannot be determined at all. Selection SHALL classify the
  whole selection `Unresolvable` under Rule 6, before eligibility and cardinality are
  reached. Selection SHALL NOT convert an absence of determination into a determinate
  exclusion, because doing so would silently treat an unknown as a known negative.
- A candidate whose `attributionValidationOutcome` is `Invalid` is **determinately
  excluded**: its lack of effective authority is known, not unknown. It is ineligible under
  Eligibility Predicate conjunct 1, participates normally in cardinality, and SHALL NOT make
  the selection `Unresolvable`.

Because candidate-level indeterminacy (3) strictly precedes eligibility and cardinality (4),
an indeterminate candidate SHALL be classified `Unresolvable` and SHALL NOT also be
classified `Resolved`, `NoCandidate`, or `Ambiguous`. The classifications are mutually
exclusive by construction of this precedence order. One indeterminate candidate is
sufficient: it makes the selection `Unresolvable` even where another candidate would
otherwise be eligible, because a candidate set containing an undeterminable member cannot be
known to have exactly one eligible member.

## Candidate Set Assembly Authority

The Candidate Set Assembly Authority is the producer of the candidate collection. It is
named, and it is not the caller.

The Authority SHALL NOT accept a caller-supplied candidate collection, a caller-supplied
candidate entry, or a caller-supplied applicability fact, and SHALL NOT expose any
parameter, field, or channel through which one could be supplied.

**Enumeration source.** The Authority SHALL enumerate the candidate collection from exactly
one assembled Repository Policy Corpus, as governed by Repository Policy Corpus Source,
above. The corpus SHALL have been assembled from one pinned governed octet sequence and SHALL
have reported `Assembled`; a corpus that reported `Rejected` SHALL NOT be a source, and no
partial or repaired corpus SHALL be a source.

The candidate collection SHALL be exactly the corpus's **current-head universe** — one
record per Policy identity, being the record of that identity's highest declared version,
derived by the corpus contract and never declared. It SHALL NOT be the preserved history, a
subset of the current-head universe, a superset of it, or any other projection.

The Authority SHALL pin, and record on the selection reference, exactly seven governed facts —
three corpus facts and four authority facts:
`corpusSourceIdentity`, `corpusSourceRevision`, and `corpusRoot`, each taken from that
assembled corpus without alteration. These three, together with the pinned Snapshot's schema
version, source identity, source revision, and envelope commitment, are what make the candidate
collection reproducible and its attribution outcomes re-verifiable: an
independent party given the same `corpusSourceRevision` re-derives the same corpus, the same
current-head universe, and the same `corpusRoot`.

**Assembly applies no filter.** Every current head of the pinned corpus SHALL be assembled as a
candidate, unconditionally. The Authority SHALL NOT omit, skip, drop, defer, or refuse a
current head for any reason, and in particular SHALL NOT omit one because its
`authorizingRatificationIdentifier` is absent from, or unrecognised by, the pinned
Ratification Authority Snapshot.

An unrecognised authorizing Ratification is **not** an assembly condition. Whether such a
Ratification is effective, ineffective, or unresolvable is owned exclusively by
`RatificationAttributionValidation` (`NEXUS-RAT-2026-07-15-017`), which produces its result in
Stage 2 for every assembled candidate without exception. Selection SHALL NOT predict, anticipate,
or pre-empt that result by filtering the candidate out beforehand. Doing so would both usurp that
authority and destroy completeness: the candidate collection would no longer equal the corpus's
current-head universe, and no verifier could establish that it did.

The candidate whose Ratification the Snapshot does not recognise is therefore assembled, receives
whatever outcome that authority produces, and is disposed of by the ordinary rules — `Unresolvable`
makes the whole selection `Unresolvable` under Rule 6, `Invalid` makes it determinately ineligible
under Eligibility Predicate conjunct 1. Either way it fails closed, and either way it remains in
the collection.

The Authority SHALL derive every field of every candidate entry from exactly one of:

- the Repository Policy Corpus Record of that current head, as assembled from the pinned
  `corpusSourceRevision`, carried verbatim; or
- a digest recomputed from that carried record; or
- the attribution validation result produced in Stage 2 against the pinned Snapshot.

Every field's producer and every derivation is enumerated exhaustively under Traceability of
Every Field in this ratification's Ledger entry. No field has any other source, and no field
is a caller label.

## Candidate Set Completeness

Completeness SHALL be **established by re-derivation**, not asserted by a producer and not
inferred from a recorded digest.

**Self-consistency is not authenticity.** A `RepositoryPolicySelectionReference` is a
self-contained artifact. Every digest it carries is computable from the other values it
carries. It follows that recomputing `candidateSetFingerprint` from the reference's own
recorded fields can only establish internal consistency: a party who omits a candidate,
injects one, alters an attribution outcome, or alters the selection outcome, and then
recomputes the fingerprint and any recorded root over the altered values, produces an
artifact that is internally consistent and indistinguishable from a genuine one by
recomputation alone.

**No claim is made that a recorded `corpusRoot` proves the recorded list is its current-head
projection.** The root is an opaque recorded value until it is re-derived. Hashing it beside
a candidate list establishes that the two were hashed together and nothing more. This
specification defines no derivation from the root to the list and asserts none.

Completeness is therefore established only by Pre-Use Verification, below, which re-derives
the corpus from the governed source octets that the recorded `corpusSourceRevision` pins, and
compares the recorded collection against the re-derived current-head universe. That comparison
is against an authority external to the reference, and is the only comparison in this
specification capable of rejecting a consistently re-fingerprinted forgery.

**The completeness basis.** The universe of Repository Policy versions is exactly the
population that the pinned governed source octets declare, as Repository Policy Corpus
Source, above, establishes. The candidate universe is the current-head projection of that
population, re-derived under that contract at verification time.

**Omission**, **injection**, and **lineage descent** are each rejected because the re-derived
current-head fingerprint multiset differs from the multiset recomputed over the recorded
candidates. The forger cannot escape by also altering the recorded root, because the root is
itself re-derived; and cannot escape by also altering `corpusSourceRevision`, because no
governed source octets then prepare to that digest and verification fails closed.

**Changed Policy content under an unchanged declaration** is rejected three times over: corpus
re-derivation fails with `content-binding-mismatch`; the prepared source text changed, so no
source prepares to the recorded `corpusSourceRevision`; and the candidate's carried corpus
record, which includes the `contentCommitment`, produces a different corpus record fingerprint.

**A governed Ratification that authorizes no Repository Policy version** contributes zero
corpus records and therefore zero candidates. That is not an omission and SHALL NOT be
reported as one, exactly as Repository Policy Corpus Source, above, requires.

Reordering of a recorded candidate collection is additionally detectable as a
`candidateSetFingerprint` mismatch, because the Candidate Ordering Comparator makes the
encoding of a given collection unique. That check is necessary and is not sufficient.

Every `ScopeUndeclared` current head SHALL be assembled as a candidate and then found
ineligible by the Eligibility Predicate, below. Such a version SHALL NOT be silently omitted
at assembly time, because omission would make the candidate set irreproducible.

## Pre-Use Verification

The **Selection Verification Authority** is the consumer-side authority that establishes a
supplied `RepositoryPolicySelectionReference` against the authorities that own its facts. It
is a distinct role from the Candidate Set Assembly Authority. A conforming implementation
SHALL NOT satisfy this section by re-running the producer over the producer's own recorded
output.

Before a bound reference is used for any purpose, the Selection Verification Authority SHALL
perform every one of the following steps, in this order. Any step that does not succeed SHALL
produce **Escalation Required**, and Policy Evaluation SHALL NOT proceed. No step is optional,
and no step may be skipped on the strength of another having succeeded.

**Step 1 — Pin the governed source.** Obtain the governed source octets identified by the
recorded `corpusSourceIdentity` and prepare them under the Governed Source Text Preparation
rules that Repository Policy Corpus Source, above, consumes. The prepared text's digest SHALL
equal the recorded `corpusSourceRevision`. If no obtainable source prepares to that digest,
verification SHALL fail closed. This is a read of a **pinned** revision identified by digest,
not a read of current repository state.

**Step 2 — Re-derive the corpus.** Assemble the Repository Policy Corpus from that prepared
text under Repository Policy Corpus Source, above. The result SHALL be `Assembled`. A
`Rejected` result SHALL fail closed, and its diagnostic SHALL be reported.

**Step 3 — Re-derive and compare the root.** Compute the corpus root from the re-derived
corpus. It SHALL equal the recorded `corpusRoot` exactly. This step is what makes the recorded
root a claim about governed octets rather than an opaque literal.

**Step 4 — Compare the collection against the re-derived current-head universe.** For each
recorded candidate, recompute its corpus record fingerprint from the corpus record it carries.
The multiset of those recomputed fingerprints SHALL equal, exactly, the multiset of corpus
record fingerprints of the re-derived current-head universe. Equality is by multiset, so a
missing member, an extra member, and a substituted member each fail. A recorded candidate
whose recomputed fingerprint is not a current-head fingerprint of the re-derived corpus SHALL
be reported as an injected or non-head candidate, naming its exact
`(policyIdentity, policyVersion)` pair. A re-derived current head with no matching recorded
candidate SHALL be reported as an omitted candidate, naming its exact pair.

**Step 5 — Verify the supplied Snapshot artifact and re-validate every attribution outcome.** The
issued Ratification Authority Snapshot artifact is a **required supplied input** to
verification, supplied alongside the reference itself.

Verification SHALL execute the **complete supplied-artifact verification chain V1 through V9 of
`NEXUS-RAT-2026-08-04-001`**, in the order that ratification fixes, stopping at the first failing
step and producing no partial result. That chain is invoked, not restated here, and no step of it is
weakened, reordered, or omitted. In summary, and normatively by reference to that entry: exactly one
artifact is supplied and its result is `Issued`; its `snapshotSchemaVersion` equals the recorded
`authoritySnapshotSchemaVersion` and equals `nexus-ratification-authority-snapshot/3`; **every
record fingerprint is recomputed from the record actually supplied**, under every enumeration
constraint of the record schema; both counts agree with `envelope.recordCount`; the recomputed
fingerprints are pairwise distinct and their NCCS-1 rule 6 collection is octet-identical to the
supplied one; the **authority root is recomputed** from that collection and the envelope's own facts
and equals `envelope.authorityRoot`; the **envelope commitment is recomputed** and equals both the
artifact's self-declared value and the recorded `authoritySnapshotEnvelopeCommitment`; **the record
collection is re-derived from the governed source octets the artifact's `authoritySourceRevision`
names, by the ratified issuance contract, and the re-derived authority root and fingerprint
collection are required to match**; and the records are placed in the **canonical consumed order**
that ratification defines, ascending by the encoded octets of their recomputed fingerprints.

**Step 8 of that chain is the external-authority anchor, and it is mandatory.** Steps V1 through V7
recompute values the supplied artifact itself carries and compare the result to a value recorded on a
`RepositoryPolicySelectionReference`, which this section already declares to be mutable and
untrusted. Both are reproducible by whoever wrote the artifact: a party that fabricates records can
recompute every fingerprint, the root, and the commitment, place that commitment in a forged
reference, and recompute that reference's candidate-set fingerprint and recorded outcomes. Nothing in
V1 through V7 distinguishes such an object from a genuine issuance.

Two earlier revisions of this draft are accordingly **withdrawn**. The first required only that a
recomputed envelope commitment equal the recorded pin, so a genuine envelope could be presented
alongside altered records. The second added per-record recomputation and collection comparison but
stopped there, and described the result as establishing "self-consistency plus pin equality" — which
named the gap accurately and left it open. **An issuance obligation binding the producer is not
evidence available to the verifier.** Vector CV4 of `NEXUS-RAT-2026-08-04-001` exhibits the altered
record and its refusal; vector CV13 exhibits a wholly self-consistent forged artifact, with a
matching forged reference, that passes V1 through V7 and is refused at V8.

**Selection Steps 1 through 4 re-derive the Repository Policy corpus; they do not re-derive the
Ratification authority collection.** Before V8 existed, no step of this contract established the
authority records against governed law, and the Selection Verification Authority's obligation to
establish every attribution outcome against its owning external authority was therefore unmet in
substance. V8 meets it: every Ratification Authority Record consulted is a record the governed source
at the pinned revision actually yields, so **no attribution outcome can be produced that the governed
Ratification Ledger does not support.**

What V8 does not establish is stated with it, in that ratification and here: the declared capture
instant and the declared producing attribution are not re-derivable, are fixed by the recorded pin
against substitution only, and are inputs to no attribution outcome.

**Consumed order is fixed by the pin, not by supply order.** Because the canonical consumed order is
derived from the recomputed fingerprint collection — the same collection the authority root commits
order-insensitively — the order in which records happen to be supplied is inert. Two verifiers
supplied the same artifact's records in different orders obtain the identical consumed state. The
earlier reliance on the artifact's declared record order is **withdrawn**.

**Then, before any attribution outcome is validated, re-establish both recorded authority-source
facts against the verified artifact.** Verification SHALL require, as normative conditions of this
step:

- `envelope.authoritySourceIdentity` of the verified artifact SHALL equal the recorded
  `authoritySourceIdentity` of field 7, octet for octet. A divergence SHALL fail this step closed as
  a **recorded authority-source identity divergence**, naming both values.
- `envelope.authoritySourceRevision` of the verified artifact SHALL equal the recorded
  `authoritySourceRevision` of field 8, octet for octet. A divergence SHALL fail this step closed as
  a **recorded authority-source revision divergence**, naming both values.

Neither comparison is performed by the verification chain, and neither may be assumed from it. The
pin `NEXUS-RAT-2026-08-04-001` accepts carries exactly two recorded values — the schema version,
checked at V2, and the envelope commitment, checked at V7 — and Selection Step 5 passes only those
two into it. **Fields 7 and 8 are therefore established here or nowhere.**

The reason they must be established is the same reason every other recorded field must be: a
recomputation over a reference's own fields proves only that the reference is self-consistent. A
caller holding a genuine, correctly pinned artifact can alter either recorded source fact, recompute
the candidate-set fingerprint and the recorded outcomes, and produce an entirely self-consistent
reference. The artifact would then be verified against its actual governed source while the immutable
reference recorded a different lineage — a divergence invisible to every other step, and a direct
breach of both the reference's provenance contract and this authority's obligation to re-establish
every recorded field against the authority that owns it. Vectors **SV10** and **SV11** exhibit one
such reference for each field.

These two comparisons are equality checks and nothing more. They do not locate an artifact, do not
authorize a retrieval, and confer no independent authority; what they establish is that the lineage
the reference records is the lineage the verified artifact actually carries.

Then, for each candidate, invoke `RatificationAttributionValidation` (`NEXUS-RAT-2026-07-15-017`) on
that candidate's `corpusRecord.authorizingRatificationIdentifier` against the consumed state that
correspondence produces. Each re-validated outcome SHALL equal the candidate's recorded
`attributionValidationOutcome`. A divergence SHALL be reported as a forged or stale attribution
outcome, naming the candidate and both outcomes. Selection SHALL NOT produce, default, infer, or
override an attribution outcome at any point; it invokes the sole authority and compares.

**A refused artifact is a failed step.** `NEXUS-RAT-2026-08-04-001` refuses an artifact that fails
any refusal-producing step of its chain — V1 through V8, V9 being total. Every such refusal SHALL
fail this step closed, and Policy Evaluation SHALL NOT proceed. Selection SHALL NOT report a refused
artifact as an attribution outcome of any kind. A record that does not encode under the version 3
schemas — including a segmented record missing a required field, carrying a lifecycle status outside
the closed enumeration, or whose segment status and relations disagree — fails **V3** as
`record-not-encodable`, so no such record ever reaches this step's consumed state.

**A `SegmentedLifecycle` record is carried, not refused.** As amended by
`NEXUS-RAT-2026-08-05-001`, the correspondence carries **every** verified record into the consumed
state — whole-record and segmented alike — with each segmented record's declared segments intact.
The artifact-level refusal of that correspondence's first revision, and its refusal reason
`segmented-lifecycle-scope-selection-unratified`, are **withdrawn in full**; the reason is retired
rather than reused, and no diagnostic of this section replaces it. Artifact acceptance is not an
assertion that a scope-free reference to every carried record is valid.

**Resolution belongs to the validation authority alone.** A scope-free Ratification reference
matching a **structurally valid, recognized-status, noncontradictory** record whose
`lifecycleResolutionForm` is `SegmentedLifecycle` resolves to **`Unresolvable`**, with the exact
diagnostic `unresolvable-scope-free-reference-to-segmented-record`, under
`RatificationAttributionValidation` as amended by addition by the same ratification. That condition
belongs to **matched-record evaluation** and is reached only after that authority's pre-existing
malformed-reference and Snapshot-source-unavailable preconditions have succeeded — neither of which
is amended — and only after every pre-existing matched-record validity condition has been applied
unchanged and in its existing order: for a segmented record exactly as for any other, no matching
record, duplicate identifier, structural malformation, an unrecognized lifecycle status, and
contradiction under the existing meaning of that term each retain their pre-existing outcome and
their pre-existing diagnostic. Divergent statuses across distinct valid segments remain
noncontradictory exactly as already ratified. Only thereafter does the record's
`lifecycleResolutionForm` decide. Selection SHALL NOT select, prefer, aggregate, flatten, arbitrate
among, or otherwise interpret segments; SHALL NOT map any segment status to a lifecycle outcome;
SHALL NOT privilege the reserved `residual` segment or any `GovernedScope` segment; and SHALL NOT
anticipate, substitute for, or override that outcome. It invokes the sole authority and compares,
exactly as for every other outcome. An `Unresolvable` re-validated outcome makes that candidate
indeterminate and the whole selection `Unresolvable` under the Selection Rules already stated,
before eligibility and cardinality are assessed.

The consequence is stated rather than concealed, in both directions. An artifact issued from the
present governed corpus is **no longer refused**, so verification can complete against it and a
candidate whose authorizing Ratification is whole-record is no longer blocked by an unrelated
segmented record elsewhere in the same artifact. A candidate whose authorizing Ratification **is**
recorded by a segmented declaration still yields no `Resolved` selection — now because the
scope-free reference to it is `Unresolvable` by rule, rather than because no rule exists. Positive
resolution of a carved governed scope requires a scope-bearing reference, which is deferred in
full and is not authorized here.

**Nothing is fetched here, and no locator is established here.** The recorded
`authoritySourceIdentity` and `authoritySourceRevision` are **checked for equality** against the
supplied artifact's own envelope facts. They identify the **governed source the artifact was issued
from**. They do not identify an issuance, a store, or a retrieval path, and SHALL NOT be described,
encoded, or read as doing so anywhere in this section, including in the Traceability tables.
`NEXUS-RAT-2026-07-31-001` permits many issuances from one source revision, and Conformance Vector
S1 exhibits two; source facts therefore cannot single out an artifact even in principle. An earlier
revision of this draft stated that those two fields identify where the artifact is to be sought, and
a later one left that claim standing in the Traceability table after removing it from the prose. Both
statements were incorrect and are **withdrawn**. Where an issued artifact is kept, who serves it, and
how a commitment is resolved to it are **deferred in full**, are not ratified here, and appear in
Deferred and Prohibited Scope, above. An envelope commitment verifies a supplied artifact; it does
not make one retrievable.

**Absence, substitution, and forgery are the same outcome.** If no artifact is supplied, if more than
one is supplied, or if the supplied artifact fails any step of the verification chain — including an
artifact re-issued from the same governed source at a different capture instant or by a different
producer, an artifact whose records the governed source does not yield, and the case where no
governed source is obtainable at the pinned revision — this step SHALL fail closed and Policy
Evaluation SHALL NOT proceed. There is no fallback to
the supplied artifact, no most-recent-source substitution, and no degradation to the
recomputation-only chain. The conditions are distinguished only in the reported diagnostic; they are
never distinguished in the outcome. Vectors SV1 through SV8, below, fix each, and SV9 through SV11 fix
the two recorded authority-source equality conditions together with their control. A verified
artifact carrying a `SegmentedLifecycle` record is **not** among these conditions: it is accepted,
and a scope-free reference to such a record is resolved by the validation authority under its own
Required Outcome Mapping.

**This step consumes an immutable artifact; it does not re-issue one.** The distinction is
load-bearing. `NEXUS-RAT-2026-07-15-017` gives attribution validation authority over an **immutable
Snapshot collection**, and `NEXUS-RAT-2026-07-31-001` binds an issued artifact's envelope commitment
to the authority root, both source facts, the canonical serialization protocol identifier, the
capture instant, the producing attribution, the record count, and the snapshot schema version.
Re-issuing from the pinned source revision would reproduce an authority-root-equivalent record set,
not the artifact previously consulted: two issuances of the same governed octets at different
instants, or by different producers, share an authority root and differ in envelope commitment by
design. An earlier revision of this draft pinned the authority root and directed the verifier to
re-issue. That was incorrect and is **withdrawn** — it silently substituted root equivalence for the
pinned artifact, and so permitted a verifier to consult an artifact other than the one the reference
was produced against.

**What this step claims, exactly.** After the chain succeeds, the supplied artifact's record
collection is established to be one the governed source at the pinned revision actually yields; the
supplied object is established to be a complete ratified `Issued` result and to be
**commitment-equivalent** to the object the recorded commitment names; and the consumed state is
established to be a function of the pinned values alone.
**Nothing stronger is claimed.** The envelope commitment is expressly **not** a commitment to a
serialized artifact as a whole and does **not** identify a unique artifact or a unique issuance
event: two distinct issuance events declaring identical basis facts produce the same commitment. It
commits the eight fields of `EnvelopeCommitmentBasis` and, through the authority root, the
order-insensitive record fingerprint collection, and it commits neither the artifact's declared
record order — which the canonical consumed order makes inert — nor its wire framing, nor the three
result counts, which are instead established structurally at V1 and re-derived at V8.
`NEXUS-RAT-2026-08-04-001` states the complete bound and unbound lists in a table, and this section
adopts them without extension. Commitment-equivalence is sufficient here and is exactly what this
step needs: objects with equal envelope commitments yield the identical consumed state, and the
consumed state is the only thing attribution validation reads.

**Re-derivation does not make the pin redundant, and the pin does not make re-derivation redundant.**
Two issuances of the same governed octets share an authority root and differ in envelope commitment
wherever their declared facts differ, so re-derivation alone does not narrow the supplied object to
the commitment-equivalence class the reference records; and a commitment alone cannot say whether the
records are governed. V7 narrows to that class, V8 establishes that its records are governed, and
both are required. An earlier revision of this draft that pinned the authority root and directed the verifier
to re-issue remains **withdrawn**, because it discarded V7 rather than adding V8.

**What this step does not claim.** It does not claim to produce, reproduce, or stand in for the
Ratification Authority Snapshot fingerprint that `NEXUS-RAT-2026-07-16-001` binds into escalation
attribution and Governance Decision idempotency. That fingerprint is a distinct value with a distinct
derivation, a distinct owner, and a distinct consumer; it is unaffected by this section, is separately
produced and separately recorded, and is compared against the envelope commitment, derivation by
derivation, under Reconciliation, below. A `RepositoryPolicySelectionReference` SHALL NOT be
described, encoded, or recorded as carrying one.

**Both halves of verification now re-derive from governed octets.** Steps 2 through 4 re-derive the
Repository Policy corpus and compare its root; chain step V8 re-derives the Ratification authority
collection and compares its root. The remaining difference is what each additionally pins, and it
follows from what each artifact carries. The corpus root is issuer- and time-independent and is the
whole of what corpus assembly commits, so pinning it suffices. A Ratification Authority Snapshot
additionally carries two declared issuance facts — a capture instant and a producing attribution —
that no derivation can reproduce and that enter the consumed state; the envelope commitment is the
only layer binding them, so it is what a selection reference pins. An earlier revision of this draft
stated that Step 5 re-derives nothing from source. That is no longer true and the statement is
**withdrawn**.

**Step 6 — Recompute the candidate-set fingerprint.** It SHALL equal the recorded
`candidateSetFingerprint`. This step detects reordering and internal inconsistency. It is
necessary and, standing alone, insufficient, and SHALL NOT be represented as establishing
completeness, provenance, or attribution.

**Step 7 — Recompute the outcome.** Recompute `selectionOutcome` and every selected field from
the verified inputs under the Eligibility Predicate and the Selection Rules. Each SHALL equal
the recorded value. The recomputed value governs; the supplied value is never preferred.

**Determinism is preserved by pinning, not by refusing to read.** Steps 1 through 5 read a
corpus source revision fixed by digest and an issued Snapshot artifact fixed by its envelope
commitment. Two verifiers performing these
steps at different times obtain the same corpus and the same Snapshot or fail closed, so the
verified outcome does not vary with evaluation-time repository state. Earlier revisions of this
contract forbade these reads and relied on recomputation alone; that reliance is withdrawn,
because recomputation over a self-contained artifact cannot distinguish a genuine reference
from a consistently re-fingerprinted forgery.

**Verification is not assembly.** The Selection Verification Authority produces no candidate,
no corpus record, no attribution outcome, and no selection reference. It re-derives, compares,
and fails closed.

## Historical Version Non-Revival

A superseded Repository Policy version is **preserved history**. It remains permanently
recorded in the corpus and remains the version of record for every Policy Evaluation and
Governance Decision that cited it. It is **not** a candidate for any new governance
evaluation.

A Repository Policy version that is not the current lineage head of its Policy identity at the
pinned `corpusSourceRevision` SHALL NOT be assembled as a candidate under any circumstance.

In particular, selection SHALL NOT assemble, substitute, promote, fall back to, descend to,
walk to, or otherwise reach an earlier version of a Policy identity because that identity's
current head:

- has a re-validated `attributionValidationOutcome` of `Invalid`;
- has a re-validated `attributionValidationOutcome` of `Unresolvable`;
- has an authorizing Ratification the pinned Snapshot does not recognise;
- is `ScopeUndeclared`;
- fails any conjunct of the Eligibility Predicate;
- is internally inconsistent; or
- would, if excluded, leave no eligible candidate.

**There is no lineage walk.** Selection examines exactly one version per Policy identity — the
current head — and never a second. An identity whose current head is ineligible contributes
exactly one ineligible candidate and nothing further. An identity whose current head is
indeterminate makes the whole selection `Unresolvable` and contributes nothing further.

**Rationale, stated normatively.** Reviving a predecessor would apply a Repository Policy
version that the repository has superseded, on the strength of a defect in the version that
superseded it. It would make the applied version a function of the current head's validation
outcome rather than of the governed source, and it would allow a withdrawn or invalidated
authority to silently restore the law it replaced. The corpus's lineage is linear and its head
is derived, precisely so that exactly one version per identity is ever a candidate.

**Detection.** A candidate collection containing a non-head version does not correspond to the
pinned corpus's current-head universe. Pre-Use Verification Step 4 recomputes each candidate's
corpus record fingerprint and compares the resulting multiset against the current-head
fingerprint multiset of the **re-derived** corpus; a non-head version's fingerprint appears in
the re-derived corpus's preserved-history collection and not in its current-head collection, so
the comparison fails before any eligibility or cardinality assessment, and the Decision SHALL be
**Escalation Required**. A self-consistent recomputation of the candidate-set fingerprint does
not avoid this, because the comparison is against the re-derived corpus rather than against the
reference itself. The failure SHALL be reported as a candidate-set divergence
naming the non-head `(policyIdentity, policyVersion)` pair, and SHALL NOT be reported as an
eligibility failure of that pair.

## RepositoryPolicySelectionReference

An exact, immutable, read-only `RepositoryPolicySelectionReference` SHALL contain exactly
the following fields, in this fixed declared schema order:

1. `missionId` — the Mission for which selection was performed. It SHALL equal the
   evaluation request's Mission identity;
2. `declaredProfileKind` — exactly one of `ReviewGovernanceEvaluationInput` or
   `CorpusReadinessAcceptanceEvaluationInput`. It SHALL equal the profile declared by the
   Policy Evaluation;
3. `corpusSourceIdentity` — the identity of the governed source the corpus was assembled
   from, taken unaltered from the assembled corpus;
4. `corpusSourceRevision` — that corpus's source revision digest, exactly 64 lowercase hex
   characters, taken unaltered;
5. `corpusRoot` — that corpus's root, being the ratified corpus root prefix followed by
   exactly 64 lowercase hex characters, taken unaltered;
6. `authoritySnapshotSchemaVersion` — the schema version of the pinned Ratification Authority
   Snapshot, taken unaltered from that Snapshot. Under `NEXUS-RAT-2026-07-31-001` this is exactly
   `nexus-ratification-authority-snapshot/3`. It is recorded explicitly, and not merely implied by
   the fingerprint prefix, because that ratification declares version 2 **totally incompatible**
   with version 1, so a verifier SHALL be able to reject a version 1 or version 2 artifact before consuming it;
7. `authoritySourceIdentity` — the identity of the governed source the pinned Ratification
   Authority Snapshot was issued from, taken unaltered from that Snapshot;
8. `authoritySourceRevision` — that Snapshot's source revision digest, exactly 64
   lowercase hex characters, taken unaltered;
9. `authoritySnapshotEnvelopeCommitment` — the pinned Snapshot artifact's **envelope commitment**,
   being the ratified envelope commitment prefix followed by exactly 64 lowercase hex characters,
   taken unaltered from that artifact. Under `NEXUS-RAT-2026-07-31-001` the envelope commitment binds
   the authority root, both source facts, the canonical serialization protocol identifier, the
   capture instant, the producing attribution, the record count, and the snapshot schema version —
   exactly those eight fields, and, through the authority root, the order-insensitive record
   fingerprint collection. It therefore identifies a **commitment-equivalence class**, not a unique
   artifact and not a unique issuance event: two distinct issuances declaring identical basis facts
   produce the same commitment, and the commitment binds neither wire framing, nor supplied record
   order, nor the three result counts. That is sufficient for this contract, because objects in one
   such class yield the identical consumed state — supplied order being made inert by the canonical
   consumed order, the result shape being fixed at V1, and the counts being re-derived at V8. No
   stronger identity is claimed for this field anywhere in this section, and establishing one would
   require a ratified complete artifact encoding, which does not exist and is not proposed here. **This field is not, and does not replace, the Ratification Authority Snapshot fingerprint
   of `NEXUS-RAT-2026-07-16-001`.** That fingerprint has a different derivation, a different input
   domain, a different representation, a different owner, and a different consumer; it is neither
   recorded in this reference nor altered by it, and it continues to be derived and consumed exactly
   as it is today. The two values are compared exhaustively under Reconciliation, below. Fields 6
   through 8 are recorded in addition because they state the schema the artifact must declare and
   the governed source it was issued from; they are each bound by this commitment, they confer no
   independent authority, and they do **not** locate the artifact;
10. `candidatePolicyReferences` — the ordered, possibly empty collection of candidate
    Repository Policy references assembled by the Candidate Set Assembly Authority from the
    pinned corpus's current-head universe, ordered by the Candidate Ordering Comparator,
    below;
11. `candidateSetFingerprint` — the fingerprint defined under Canonical Encoding and
    Candidate Set Fingerprint, below; exactly 64 lowercase hex characters;
12. `selectionOutcome` — exactly one of `Resolved | NoCandidate | Ambiguous | Unresolvable`;
13. `selectedPolicyIdentity` — the selected Repository Policy identity. Present exactly when
    `selectionOutcome` is `Resolved`; absent otherwise;
14. `selectedPolicyVersion` — the selected Repository Policy version. Present exactly when
    `selectionOutcome` is `Resolved`; absent otherwise;
15. `selectedAuthorizingRatificationIdentifier` — the authorizing Ratification identifier of
    the selected candidate. Present exactly when `selectionOutcome` is `Resolved`; absent
    otherwise.

## Candidate Policy Reference

Each entry of `candidatePolicyReferences` SHALL contain exactly the following three fields,
in this fixed declared schema order. The schema is deliberately minimal: it carries the
governed record verbatim rather than a projection of it, so that the record's own fingerprint
is recomputable from the candidate alone and can be compared against the re-derived
current-head universe.

1. `corpusRecord` — the complete `RepositoryPolicyCorpusRecord` of that current head, as
   ratified by `NEXUS-RAT-2026-08-03-001`, carried **verbatim and unaltered**. Selection
   declares no field of it, adds none, removes none, reorders none, and reinterprets none. It
   is consumed exactly as that contract defines it, including its `policyIdentity`,
   `policyVersion`, `authorizingRatificationIdentifier`, `predecessorVersions`,
   `scopeDeclarationState`, `missionApplicabilityScope`, `criterionDeclarations`, and
   `contentCommitment`;
2. `corpusRecordFingerprint` — the ratified corpus record fingerprint prefix followed by the
   SHA-256 digest of field 1's canonical encoding. It is **recomputed**, never copied from a
   caller and never accepted as supplied. It exists so that Pre-Use Verification, above, can
   compare this candidate against the re-derived corpus's current-head fingerprints;
3. `attributionValidationOutcome` — exactly one of `Valid | Invalid | Unresolvable`, produced
   exclusively by `RatificationAttributionValidation` (`NEXUS-RAT-2026-07-15-017`) in Stage 2
   against the pinned Snapshot, and **re-validated** against that same pinned Snapshot in
   Pre-Use Verification Step 5. Selection SHALL NOT compute, default, infer, or override this
   value.

**Every value in this record has exactly one producer, and this section states it truthfully.**
Field 1 is copied verbatim from corpus assembly. Field 2 is recomputed from field 1 by a
digest this specification names. Field 3 is produced by an external sole authority and
re-validated against it. There is no field that is partly copied, partly derived, or
described as copied while in fact being derived.

**Two values used by the Eligibility Predicate are derivations, not fields, and are not
stored.** Storing a derived value alongside the record it derives from would permit the two to
diverge and would require a rule reconciling them. Neither is stored, so neither can diverge:

- **Declared profile kinds.** A candidate declares a Governance Evaluation Input Profile kind
  if and only if at least one element of `corpusRecord.criterionDeclarations` carries an
  `evaluationInputProfile` equal to that kind. This is evaluated directly against the carried
  record, and no `declaredProfileKinds` collection is stored, ordered, deduplicated, or
  encoded.
- **Current-head membership.** Whether a candidate is a current head is established for the
  collection as a whole by Pre-Use Verification Step 4, against the re-derived corpus. It is
  not a per-candidate stored flag, is not an eligibility conjunct, and its failure is a
  candidate-set divergence rather than an ineligible candidate. Earlier revisions of this
  contract carried a `policyVersionExistence` enumeration for this purpose; that field is
  withdrawn, because a value recorded by the same party that recorded the collection cannot
  establish the collection's membership in a universe defined elsewhere.


## Eligibility Predicate

A candidate is **eligible** if and only if every one of the following holds. Each conjunct
is an explicit predicate over an authoritative input, not an assumption. Each is evaluated
only after Pre-Use Verification, above, has succeeded in full:

1. `attributionValidationOutcome` is exactly `Valid`, as re-validated against the pinned
   Snapshot in Verification Step 5. A candidate whose attribution outcome is `Invalid` is
   determinately ineligible under this conjunct. A candidate whose attribution outcome is
   `Unresolvable` never reaches this conjunct, because Rule 6 classifies the selection
   `Unresolvable` first; this conjunct SHALL NOT be read as an alternative disposition for
   that case.
2. At least one element of `corpusRecord.criterionDeclarations` carries an
   `evaluationInputProfile` equal to the reference's `declaredProfileKind`. This preserves,
   and does not restate, the existing requirement that a Policy Criterion SHALL NOT be
   evaluated against a profile it does not declare. Because the test reads the carried corpus
   record directly, profile eligibility derives from authoritative governed data and never
   from a caller-supplied label.
3. `corpusRecord.scopeDeclarationState` is exactly `Declared`. A `ScopeUndeclared` candidate
   SHALL NOT be eligible, and SHALL NOT be treated as `RepositoryWide` or as having any
   implied, default, or inherited scope.
4. The candidate's declared `MissionApplicabilityScope`, carried in
   `corpusRecord.missionApplicabilityScope`, satisfies the Mission applicability predicate of
   Mission Applicability Scope, above, for the reference's `missionId` — that is, the scope
   declares `RepositoryWide`, or it declares `MissionSet` and the reference's `missionId` is
   an exact member of that scope's `missions` collection, with membership determined by byte
   equality of the NCCS-1 String encodings after Unicode NFC normalization. Selection SHALL
   apply that predicate exactly as ratified and SHALL NOT substitute, relax, extend, or
   reimplement it, and SHALL NOT apply prefix, pattern, wildcard, range, case-insensitive,
   hierarchical, or similarity matching.

These four conjuncts are independent eligibility dimensions. Every one SHALL hold. Satisfying
one SHALL NOT be treated as satisfying another, and in particular Mission applicability
(conjuncts 3 and 4) and the declared profile kind (conjunct 2) remain the two independent
dimensions that Mission Applicability Scope, above, requires.

**Current-head membership is not a conjunct.** Earlier revisions of this contract carried a
fifth conjunct over a recorded `policyVersionExistence` value. That conjunct is withdrawn:
whether the recorded collection is the corpus's current-head universe is a property of the
collection, established against the re-derived corpus by Verification Step 4, and it cannot be
established by a flag the same party recorded. A collection that fails Step 4 never reaches
eligibility at all.

Eligibility is assessed only over assembled candidates, and only current heads are assembled.
No conjunct is ever assessed against a superseded version, and the failure of every conjunct
for every candidate SHALL NOT cause a superseded version to be assessed.

**`ScopeUndeclared` candidates.** Mission Applicability Scope, above, requires that a
`ScopeUndeclared` Repository Policy version be ineligible for any new governance evaluation
and fail closed with **Escalation Required** if referenced by one. Within selection, that
requirement is satisfied exactly as follows, and this is the complete and exclusive
reconciliation:

- a `ScopeUndeclared` current head is assembled as a candidate, so that the candidate set
  remains complete and verifiable against the re-derived current-head universe;
- it is **ineligible** under conjunct 3, and is therefore excluded from the eligible set;
- it SHALL NOT be bound to any Policy Evaluation or Governance Decision, and therefore is
  never **referenced by** an evaluation in the sense that section uses;
- where a `ScopeUndeclared` candidate is the only candidate, or where every candidate is
  ineligible, no candidate is eligible, `selectionOutcome` SHALL be `NoCandidate`, and the
  Decision SHALL be **Escalation Required** — which is the fail-closed outcome that section
  requires;
- the presence of a `ScopeUndeclared` candidate alongside one eligible candidate SHALL NOT
  by itself produce `Unresolvable`, `Ambiguous`, or **Escalation Required**. Ineligibility is
  not ambiguity, and a version that is never bound is never applied;
- a `ScopeUndeclared` candidate SHALL NOT be mutated, back-filled, annotated, or repaired,
  and no Governance Decision already produced against such a version is altered or
  invalidated;
- a `ScopeUndeclared` current head SHALL NOT cause an earlier, explicitly scoped version of
  the same Policy identity to be assembled or selected. That is the prohibited revival of
  Historical Version Non-Revival, above, and the correct outcome is `NoCandidate` and
  **Escalation Required** until a superseding explicitly scoped version is ratified.

## Selection Rules

The following ten rules govern selection and its consequences, applied in the total
precedence order declared under Stage Model and Total Precedence, above, and only after
Pre-Use Verification, above, has succeeded in full.

1. Selection SHALL be performed for exactly one Mission and exactly one declared input
   profile kind.
2. Selection SHALL operate solely over the verified `candidatePolicyReferences` and the
   verified corpus and Snapshot facts recorded with them. It SHALL NOT perform an implicit
   or opportunistic repository lookup, and SHALL NOT read any repository state other than
   the two pinned reads that Pre-Use Verification requires: the governed source octets whose
   prepared-text digest equals the recorded `corpusSourceRevision`, and the issued Ratification
   Authority Snapshot artifact whose envelope commitment equals the recorded
   `authoritySnapshotEnvelopeCommitment`.
   Both reads are pinned — the first by prepared-text digest, the second by envelope
   commitment — are mandatory, and are the only reads authorized.
   Reading a governed source at a different revision, or a Snapshot at a different envelope
   commitment, SHALL fail closed rather than be substituted.
3. A supplied `RepositoryPolicySelectionReference` SHALL NOT be trusted as caller-authored
   authority, and SHALL NOT be accepted on the strength of internal consistency alone. Every
   step of Pre-Use Verification SHALL succeed before any value it carries is used, and any
   divergence between a supplied and a re-established value SHALL produce **Escalation
   Required**.
4. A reference that is absent, structurally incomplete, or internally inconsistent — a
   `Resolved` outcome missing any selected field, a non-`Resolved` outcome carrying any of
   them, a `candidateSetFingerprint` that does not match the recorded collection, a
   `corpusRecordFingerprint` that does not match the corpus record it accompanies, a
   malformed corpus source revision, corpus root, authority source revision, or authority snapshot envelope commitment, or a corpus record
   whose `scopeDeclarationState` and `missionApplicabilityScope` collection length are
   inconsistent — SHALL produce **Escalation Required**.
5. A reference whose `missionId` differs from the evaluation request's Mission identity, or
   whose `declaredProfileKind` differs from the profile declared by the Policy Evaluation,
   SHALL produce **Escalation Required**.
6. Where **any** candidate is indeterminate, `selectionOutcome` SHALL be `Unresolvable` and
   the Decision SHALL be **Escalation Required**. A candidate is indeterminate when, and only
   when, at least one of the following holds:
   - its re-validated `attributionValidationOutcome` is exactly `Unresolvable`;
   - its `corpusRecord` is internally inconsistent, including a `missionApplicabilityScope`
     collection whose length does not match its `scopeDeclarationState`.

   An unrecognised `authorizingRatificationIdentifier` is **not** a separate indeterminacy
   condition and SHALL NOT be treated as one by selection. Such a candidate is assembled like
   any other, and `RatificationAttributionValidation` alone determines whether it is
   `Unresolvable`, `Invalid`, or `Valid`. Selection consumes that determination and SHALL NOT
   anticipate it, filter on it, or substitute its own.

   This rule is evaluated before Rules 7 through 9. An indeterminate candidate can therefore
   never be resolved, never be counted toward cardinality, and never be reported as
   `NoCandidate` or `Ambiguous`. One indeterminate candidate is sufficient to make the whole
   selection `Unresolvable`, even where another candidate is otherwise eligible. An
   `Invalid` attribution outcome is **not** indeterminacy and SHALL NOT trigger this rule.
   An `Unresolvable` outcome SHALL NOT cause any earlier version of any Policy identity to be
   assembled, examined, or selected.
7. Where every candidate is determinate and no candidate is eligible, `selectionOutcome`
   SHALL be `NoCandidate` and the Decision SHALL be **Escalation Required**. This condition
   SHALL NOT produce **Deferred**: a Repository Policy comes into existence only through
   Ratification, which is a governance action, and never through normal engineering
   progression. This is the outcome when the candidate collection is empty, when every
   candidate's attribution outcome is `Invalid`, when every candidate is `ScopeUndeclared`,
   when no candidate's declared scope is Mission-applicable to the request, and when no
   candidate declares the profile kind. In every one of those cases the correct outcome is
   `NoCandidate`, and SHALL NOT be resolution against a superseded version.
8. Where every candidate is determinate and two or more candidates are eligible,
   `selectionOutcome` SHALL be `Ambiguous` and
   the Decision SHALL be **Escalation Required**, identifying every eligible candidate in
   Candidate Ordering Comparator order. This rule fails closed on **all** multiplicity,
   whether or not the eligible candidates' Policy Criteria contradict one another.
   Contradictory applicable Policies, as governed by Authority Hierarchy, above, are a
   narrower subset of this multiplicity; that rule remains in force and is not modified.
   Selection SHALL NOT arbitrate between candidates under any circumstance, and SHALL NOT
   prefer a `RepositoryWide` scope over a `MissionSet` scope, or the reverse, or a higher
   Policy version over a lower one.
9. Where every candidate is determinate and exactly one candidate is eligible,
   `selectionOutcome` SHALL be `Resolved`, and the
   bound Repository Policy identity and version SHALL be that candidate's exact
   `corpusRecord.policyIdentity` and `corpusRecord.policyVersion`. The bound version SHALL NOT
   be derived by recency guessing, maximum-version guessing, latest-ratification-date
   guessing, scope-specificity guessing, or defaulting.
10. The candidate collection SHALL be exactly the current-head universe of the re-derived
    corpus at `corpusSourceRevision`, as established by Pre-Use Verification Step 4. A
    collection containing any non-head version, omitting any current head, or containing any
    record the re-derived corpus does not declare SHALL produce **Escalation Required**,
    reported as a candidate-set divergence naming the exact
    `(policyIdentity, policyVersion)` pair and the exact divergence kind. This rule holds
    irrespective of every candidate's attribution outcome, scope, or eligibility, and
    irrespective of the selection outcome that would otherwise obtain. No condition anywhere
    in this specification authorizes the assembly, substitution, promotion, or selection of a
    superseded Repository Policy version.

No outcome above may produce **Approved** through defaulting, recency guessing,
maximum-version guessing, scope-specificity guessing, lineage descent, implicit repository
lookup, or acceptance of a self-consistent but unverified selection reference.

## Canonical Encoding and Candidate Set Fingerprint

Canonical encoding uses NCCS-1 exactly as RFC-0003 defines it, protocol identity `"nccs"`,
version `"1"`, rules 1 through 12. This section does not add, omit, or reinterpret any
NCCS-1 framing rule. It declares only what NCCS-1 rule 5 expressly delegates to the
governing schema: this schema's records, field order, and collection ordering.

**Candidate Ordering Comparator.** `candidatePolicyReferences` is an ordered collection
(NCCS-1 rule 5), which NCCS-1 does not auto-sort. Its order SHALL be strictly ascending by
the byte-wise comparison of the NCCS-1 String encoding of each candidate's
`corpusRecord.policyIdentity`. Because the collection is the current-head universe, it carries
at most one entry per Policy identity, so that key alone is a total order and no tiebreak is
required. A collection presented in any other order SHALL fail closed.

The comparison is over the **length-prefixed encoded form**, not the bare identifier. A
shorter identity therefore sorts before a longer one whose bare text would sort earlier
alphabetically. This is a deliberate consequence of NCCS-1 framing and is stated so that no
implementation sorts raw identifiers instead.

**Duplicates.** `candidatePolicyReferences` is uniqueness-declared on
`corpusRecord.policyIdentity`. Two entries with an equal encoded identity SHALL fail closed
under NCCS-1 rule 7. This is the encoding-level consequence of the current-head universe
holding exactly one record per identity, and it makes two versions of one identity
structurally inexpressible in a candidate collection.

**Empty set.** An empty `candidatePolicyReferences` encodes as the empty ordered collection,
NCCS-1 rule 5 with no elements — the two bytes `le`. It SHALL NOT be encoded as an absent
field, and SHALL NOT fail closed merely for being empty. An empty collection is one of the
exact inputs that produces `NoCandidate`, and is the correct collection when the re-derived
corpus is empty.

**RepositoryPolicyCorpusRecord.** The record carried in Candidate Policy Reference field 1 is
encoded exactly as `NEXUS-RAT-2026-08-03-001` defines it: NCCS-1 rule 8, field count `i8e`,
its ratified fixed declared order, with `predecessorVersions` and `missionApplicabilityScope`
as ordered collections of zero or one element under that contract's exact coupling rules, and
`criterionDeclarations` a non-empty ordered collection of its ratified two-field
`PolicyCriterionDeclaration` records. This section neither restates nor modifies that
encoding, and adds no field to it.

**MissionApplicabilityScope.** The scope record nested within the corpus record is encoded
exactly as Mission Applicability Scope, above, defines it: NCCS-1 rule 8, field count `i2e`,
fixed order `scopeKind` then `missions`, with `missions` in Mission Ordering Comparator order
and empty exactly when `scopeKind` is `RepositoryWide`. This section neither restates nor
modifies that encoding.

**Candidate Policy Reference record.** Encoded per NCCS-1 rule 8 as a record of exactly three
fields, field count `i3e`, in the fixed declared order given under Candidate Policy Reference,
above: `corpusRecord`, `corpusRecordFingerprint`, `attributionValidationOutcome`. Field 1 uses
record framing; field 2 uses String framing and SHALL be the ratified corpus record
fingerprint prefix followed by exactly 64 lowercase hexadecimal characters; field 3 uses
Enumeration framing.

**Candidate Set record.** Encoded per NCCS-1 rule 8 as a record of exactly ten fields, field
count `i10e`, in **ascending field-name order**, matching the convention the ratified corpus
contract uses for its commitment-basis records:

1. `authoritySnapshotEnvelopeCommitment` — String framing, the ratified envelope commitment prefix
   followed by exactly 64 lowercase hex characters;
2. `authoritySnapshotSchemaVersion` — String framing;
3. `authoritySourceIdentity` — String framing;
4. `authoritySourceRevision` — String framing, exactly 64 lowercase hex characters;
5. `candidatePolicyReferences` — ordered collection (rule 5) of Candidate Policy Reference
   records in Candidate Ordering Comparator order;
6. `corpusRoot` — String framing, the ratified corpus root prefix followed by exactly 64
   lowercase hex characters;
7. `corpusSourceIdentity` — String framing;
8. `corpusSourceRevision` — String framing, exactly 64 lowercase hex characters;
9. `declaredProfileKind` — Enumeration framing;
10. `missionId` — String framing.

Ascending field-name order places `authoritySnapshotEnvelopeCommitment` before
`authoritySnapshotSchemaVersion` (`F` precedes `S`) and both before `authoritySourceIdentity`
(`n` precedes `o` at the tenth octet). The order is fixed by the field names alone and is not a
matter of judgement.

**The selection outcome is not a field of this record.** It is recomputed in Verification Step 7
from the verified inputs, so binding it would make the fingerprint attest to its own conclusion.

**Fields 9 and 10 are bound deliberately.** The selection outcome is a function of the Mission
identity and the declared profile kind as well as of the candidate collection. Were they omitted,
two references over one candidate collection but different Missions would share a fingerprint
while requiring different outcomes, and a recomputation could not tell them apart. Binding them
makes the fingerprint a commitment to the complete selection input.

**Hash representation.** `candidateSetFingerprint = lowercase-hex(SHA-256(NCCS-1 canonical
bytes of the exact ten-field Candidate Set record))`, FIPS 180-4 SHA-256, output exactly
64 lowercase hex characters, per NCCS-1 rules 9 and 11.

**What the candidate-set fingerprint does and does not establish.** It establishes that the
recorded authority facts, corpus facts, request facts, and candidate collection were encoded
together in the declared order, and it detects reordering, truncation, and internal inconsistency of the
recorded artifact.

It establishes **nothing** about completeness, provenance, or attribution. It is computed
over values the reference itself carries, so any party able to alter those values can
recompute it. In particular:

- a reproducing fingerprint SHALL NOT be represented as establishing that
  `candidatePolicyReferences` is the current-head projection of `corpusRoot`. This
  specification defines no derivation from a recorded root to a recorded list and asserts
  none;
- a reproducing fingerprint SHALL NOT be represented as establishing that any
  `attributionValidationOutcome` is the outcome the sole attribution authority produced;
- a reproducing fingerprint SHALL NOT be represented as establishing that the recorded corpus
  facts describe any governed source.

Each of those is established only by the corresponding step of Pre-Use Verification, above,
and the fingerprint check is Verification Step 6 — one necessary step among seven, never a
substitute for the others.

**No scope fingerprint.** The `candidateSetFingerprint` is a fingerprint over the candidate
set. It is not a fingerprint over any `MissionApplicabilityScope`, and no fingerprint,
digest, commitment, or identity value derived from a scope is established here. Mission
Applicability Scope, above, establishes none and defers any, and that deferral is preserved.

**Normalization.** UTF-8 without byte order mark; every string value normalized to Unicode
NFC; `CRLF` and bare `CR` normalized to `LF` — NCCS-1 rules 1, 2, and 3, applied unchanged.

**Traversal order.** Selection traversal, eligibility evaluation, and diagnostic target
enumeration SHALL all use the Candidate Ordering Comparator order, so that the order in
which candidates are examined and reported is identical to the order in which they are
encoded.

**Fail-closed conditions.** In addition to NCCS-1 rule 12, encoding SHALL fail closed on: a
`candidatePolicyReferences` collection not in Candidate Ordering Comparator order; a
duplicate `corpusRecord.policyIdentity`; an `authoritySourceRevision`,
`corpusSourceRevision`, or `candidateSetFingerprint` that is not exactly 64 lowercase hex
characters; a `corpusRoot` or `authoritySnapshotEnvelopeCommitment` that is not its ratified prefix
followed by exactly 64 lowercase hex characters; an `authoritySnapshotSchemaVersion` other than
exactly `nexus-ratification-authority-snapshot/3`; a `corpusRecordFingerprint` that is not the ratified corpus record
fingerprint prefix followed by exactly 64 lowercase hex characters, or that does not equal
the digest recomputed from the corpus record it accompanies; and an enumeration value outside
its declared closed set. Every fail-closed condition that `NEXUS-RAT-2026-08-03-001` declares
for the corpus record, and every one that Mission Applicability Scope, above, declares for the
scope record, continues to apply unchanged to the record carried in field 1.

## Verification Obligation

A `RepositoryPolicySelectionReference` is the immutable output of the governed selection
process defined above. Once produced, it is bound as a component of the Policy Evaluation
request and recorded on the resulting Governance Decision.

It SHALL NOT be trusted as caller-authored authority at any point, and SHALL NOT be accepted
on the strength of internal consistency alone.

Before a bound reference is used for any purpose, every step of Pre-Use Verification, above,
SHALL be performed by the Selection Verification Authority and SHALL succeed. Any divergence
between a supplied value and the value re-established against the authority that owns it SHALL
produce **Escalation Required**, and Policy Evaluation SHALL NOT proceed.

An implementation that performs only the fingerprint and outcome recomputations of Steps 6 and
7, omitting the re-derivation of Steps 1 through 5, does **not** conform to this section, even
though every recomputation it performs succeeds on a forged reference.

## Exact Version Binding

Exactly one Repository Policy identity and exactly one Repository Policy version SHALL be
bound to each Policy Evaluation and to the Governance Decision it produces.

The bound identity and version SHALL be immutable for the life of that Governance Decision.

Governance SHALL NOT substitute, rebase, refresh, or upgrade a bound Repository Policy
version after binding.

A later Repository Policy version SHALL NOT retroactively rebind, supersede, or invalidate
a Governance Decision already produced against an earlier version. This preserves, and does
not restate, the existing requirement that a prior Repository Policy version remains the
version of record for every Policy Evaluation and Governance Decision that cited it, and it
preserves the equivalent requirement that a later version's declared scope SHALL NOT
retroactively apply to a Decision already produced.

The converse holds symmetrically and is stated here because Historical Version Non-Revival,
above, depends on it: an earlier Repository Policy version remains the version of record for
the Decisions that cited it and SHALL NOT become applicable again to a new evaluation, whatever
becomes of the version that superseded it.

## Determinism

Equivalent `missionId`, `declaredProfileKind`, `corpusSourceIdentity`, `corpusSourceRevision`,
`corpusRoot`, `authoritySnapshotSchemaVersion`, `authoritySourceIdentity`,
`authoritySourceRevision`, `authoritySnapshotEnvelopeCommitment`, and
`candidatePolicyReferences` — including each candidate's complete carried corpus record and
re-validated attribution outcome — and `candidateSetFingerprint` SHALL always produce the
equivalent bound Repository Policy identity and version, or the equivalent non-`Resolved`
outcome.

**Determinism rests on pinning, not on refusing to read.** Pre-Use Verification reads a
governed source revision fixed by prepared-text digest and an issued Ratification Authority
Snapshot artifact fixed by its envelope commitment. Two verifiers performing those reads at
different times obtain the same corpus
and the same Snapshot, or fail closed; neither obtains a different result from a repository
that has moved on. Selection therefore does not depend on evaluation-time repository state,
while still being anchored to authorities outside the artifact it is verifying.

Because the recorded outcome is recomputed from verified inputs before use, selection
determinism does not depend on the supplying caller. Because the Mission applicability
predicate reads exactly two inputs — the request's explicit Mission identity and the
candidate's declared scope — and reads no clock and no repository state, its contribution to
selection is equally deterministic. Because only current heads are ever candidates, and
because that is enforced against a re-derived universe rather than a recorded flag, the
selected version is a function of the governed source and never of any candidate's validation
outcome.

## Deferred Concepts

The following are **deferred** and SHALL NOT be implemented under this section:

- authorized-subject attestations in any form — no field, no collection, no subject-kind
  union, no placeholder, and no dormant extraction path;
- attestation extraction, validation, attestation-backed applicability authority, or
  attestation-backed selection authority;
- legacy attestation migration;
- Repository Policy authority over any subject other than the Mission;
- migration, back-fill, annotation, or repair of `ScopeUndeclared` Repository Policy
  versions;
- any amendment to, extension of, or addition to `MissionApplicabilityScope`, its closed
  union, its predicate, its Mission Ordering Comparator, or its canonical encoding;
- any fingerprint, digest, commitment, or identity value derived from a
  `MissionApplicabilityScope`;
- any amendment to, extension of, or addition to the Repository Policy Corpus Source
  contract, its grammars, its schemas, its lineage rules, its current-head derivation, its
  commitments, its constants, or its diagnostic vocabulary;
- issuance of a Repository Policy Corpus artifact, population of the corpus, and pinning of
  any corpus root, envelope commitment, or record fingerprint;
- any separately issued, signed, or otherwise authenticated selection artifact, and any
  producer-authentication mechanism that would permit Pre-Use Verification Steps 1 through 5
  to be omitted. Such a mechanism may be established later by its own ratification; until it
  is, re-derivation is the only authorized verification path;
- any mechanism by which a superseded Repository Policy version could become a candidate,
  including lineage descent, fallback, promotion, pinning to a historical version, or
  selection against preserved history;
- wildcard, pattern, prefix, range, or hierarchical Mission matching of any kind;
- issuance of a Ratification Authority Snapshot, derivation of any authority root or envelope
  commitment, or any addition to the `nexus-ratification-authority-snapshot/3` schema;
- automatic Ratification-Ledger ingestion beyond the source contracts already ratified by
  `NEXUS-RAT-2026-07-31-001` and `NEXUS-RAT-2026-08-03-001`;
- any revision of Acceptance Semantics, Current Projection Applicability Selection, or
  External Authoritative Applicability and Recording;
- activation of the DORMANT `CorpusReadinessAcceptanceEvaluationInput` profile.

Implementation of this section requires its own separate Sprint scope ratification.

---

# Policy Evaluation

Policy Evaluation is the deterministic act of evaluating one specific, identified Repository Policy version's Policy Criteria against exactly one declared Governance Evaluation Input Profile instance, for exactly one Mission (see Mission-Scoped Governance Evaluation, below).

The v1.1 formulation — "against a specific finalized engineering outcome (a completed Review, at minimum)" — is retained, scoped to the `ReviewGovernanceEvaluationInput` profile.

Policy Evaluation SHALL:

- execute for exactly one explicit, mandatory Mission identity, supplied as part of the evaluation request;
- consume only finalized Review Outcomes, never an in-progress Review;
- consume only authoritative Evidence and/or a computed Shared Reality projection, never generated content directly;
- evaluate each Policy Criterion through an explicit deterministic predicate only; no Policy Criterion evaluation step SHALL invoke unrestricted, non-deterministic model judgment as part of the evaluation path itself;
- produce the same result for the same (Mission identity, Repository Policy version, Evidence, Shared Reality, Review Outcome, applicable Ratifications) input every time (Canon 9);
- record which Policy Criteria were satisfied, which were violated, and which could not be deterministically evaluated;
- as an additive precondition, consume exactly one bound `RepositoryPolicySelectionReference`, verify it in full under Pre-Use Verification — re-deriving the Repository Policy Corpus from the governed source octets its recorded corpus source revision pins, re-validating every attribution outcome against the exact pinned Ratification Authority Snapshot, and confirming the recorded candidate collection is that corpus's current-head universe — confirm the recomputed outcome is `Resolved`, and evaluate exactly the Repository Policy identity and version that reference binds (see Repository Policy Selection and Version Binding, above). Policy Evaluation SHALL NOT be attempted for a non-`Resolved` recomputed outcome, for a supplied outcome that diverges from the recomputed one, or for a reference that is internally consistent but fails any verification step; every such case resolves under Failure and Conflict Handling, below. This precondition adds no Policy Criterion, alters no Policy Criterion predicate, and changes no criterion evaluation semantics.

For the `ReviewGovernanceEvaluationInput` profile: if any Policy Criterion cannot be deterministically evaluated from the available Evidence, Shared Reality, and Review Outcome — including because the required input does not yet exist, is stale, or is ambiguous — Policy Evaluation SHALL NOT guess and SHALL NOT default to satisfied. It SHALL produce a Governance Escalation (or, if the missing input is a precondition rather than an ambiguity, a **Deferred** Governance Decision; see Governance Decision, below) for that criterion.

For the `CorpusReadinessAcceptanceEvaluationInput` profile: if any Policy Criterion cannot be deterministically evaluated from that profile's own bound fields — including because a required field is absent, internally inconsistent, or ambiguous — Policy Evaluation SHALL NOT guess and SHALL NOT default to satisfied. It SHALL resolve to **Deferred** or **Escalation Required** exactly as specified under Failure and Conflict Handling, below.

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

Validating a supplied `MissionId` against a Repository Policy version's declared `MissionApplicabilityScope` (see Mission Applicability Scope, above) is not an inference of Mission identity and is not excepted from this rule. The direction is exact: the `MissionId` is an input to that validation and never an output of it. The Mission applicability predicate reads Repository Policy data solely to answer whether a Policy version has authority over a Mission the request has already explicitly named; it SHALL NOT derive, synthesize, default, repair, or substitute a `MissionId` under any circumstance. A governance evaluation whose `MissionId` is absent, malformed, or unresolvable SHALL fail under this section before any Mission applicability predicate is evaluated.

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

Every rule in this section above applies to the `ReviewGovernanceEvaluationInput` profile, unchanged from v1.1.

## Corpus-Readiness Profile Mission Equality

For the `CorpusReadinessAcceptanceEvaluationInput` profile, the profile's Mission identity, the referenced Assessment's Mission identity, the referenced Corpus Readiness Result's Mission identity, the historical bound Projection's Mission, and the `CurrentProjectionApplicabilityReference.missionId` SHALL all be equal. Any mismatch SHALL produce **Escalation Required**.

## Domain Event Publication

A `GovernanceDecisionRecorded` Domain Event (or equivalently named Policy Event; see Dependencies, above) SHALL obtain its `missionId`/Mission Attribution exclusively from the Mission identity already stored on the persisted `GovernanceDecision`.

Because every `GovernanceDecision` carries a mandatory Mission identity under this section, the corresponding Domain Event SHALL always satisfy RFC-0005's Event Attribution requirement ("Attribution SHALL include: Mission") structurally, through the event's ordinary required fields.

No implementation SHALL omit Mission attribution from a Governance Domain Event, weaken RFC-0005's Event Attribution requirement, or use a type-unsound construct (such as a cast past a required field) to publish an event that does not structurally conform to the RFC-0005 Domain Event envelope.

---

# Corpus Readiness Acceptance Evaluation

This section defines the `CorpusReadinessAcceptanceEvaluationInput` profile and its acceptance semantics. It is DORMANT per Governance Evaluation Input Profiles, above.

## CorpusReadinessAcceptanceEvaluationInput

An exact, immutable, read-only `CorpusReadinessAcceptanceEvaluationInput` SHALL contain exactly:

- Mission identity;
- Corpus Review Basis fingerprint;
- RFC-0006 Assessment identity;
- terminal RFC-0006 Assessment Outcome;
- RFC-0013 Corpus Readiness Result identity;
- Corpus Readiness classification;
- the **historical bound Projection**: exact RFC-0003 Projection identity and Projection Version constituting the Result's Evidence / Shared Reality basis. This SHALL equal the Projection recorded on the referenced Assessment (RFC-0006 v1.2), the Projection bound into the referenced Corpus Review Basis (RFC-0013 v0.6), and the Projection recorded on the referenced Corpus Readiness Result (RFC-0013 v0.6);
- a `CurrentProjectionApplicabilityReference` (below);
- Corpus Readiness Acceptance Repository Policy identity and version.

Governance SHALL consume the exact RFC-0013 Corpus Readiness Result. It SHALL NOT recompute, reinterpret, or infer the readiness classification from the Assessment Outcome. The completed RFC-0006 Assessment is one bound component of this profile, not the sole finalized-engineering-outcome input.

## CurrentProjectionApplicabilityReference

An immutable `CurrentProjectionApplicabilityReference` SHALL contain exactly:

- `missionId` — the Mission for which selection was performed;
- `projectionScopeReference` — the exact Projection Scope fingerprint, or the complete canonical Projection Scope identity, used for selection;
- `currentProjectionIdentity` — the resolved current RFC-0003 Projection identity. Present exactly when `resolutionResult` is `Resolved`; absent otherwise;
- `currentProjectionVersion` — the resolved current RFC-0003 Projection Version. Present exactly when `resolutionResult` is `Resolved`; absent otherwise;
- `selectorPolicyIdentity` and `selectorPolicyVersion` — the exact Repository Policy identity and version whose deterministic selector resolved the current Projection;
- `selectorCriterionIdentity` and `selectorCriterionVersion` — the exact selector criterion identity and version within that policy;
- `resolutionResult` — exactly one of `Resolved | TemporarilyAbsent | Unresolvable | Ambiguous`;
- `freshnessDetermination` — the RFC-0003 freshness determination for that exact resolved Projection under the evaluation's current candidate corpus. Present exactly when `resolutionResult` is `Resolved`; absent otherwise. This determination is consumed read-only; this specification does not redefine RFC-0003 freshness;
- `candidateCorpusFingerprint` — the immutable evaluation-state or candidate-corpus fingerprint against which freshness and current applicability were evaluated.

This reference is a recorded input, not a computation performed by this specification. This specification defines what SHALL be supplied and recorded; the Corpus Readiness Acceptance Repository Policy owns the selector that produces it.

## Acceptance Semantics

Authoritative downstream applicability of a Corpus Readiness Result SHALL require an applicable, terminal, **Approved** Governance Decision produced by Policy Evaluation of the exact ratified Corpus Readiness Acceptance Repository Policy version over a `CorpusReadinessAcceptanceEvaluationInput`, for exactly one Mission.

### Current Projection Applicability Selection

The following ten rules govern selection and its consequences. Selection itself is owned by the separately ratified Corpus Readiness Acceptance Repository Policy; this specification owns the input and recording contract only.

1. The Corpus Readiness Acceptance Repository Policy SHALL define a deterministic selector over exactly one Mission and exactly one Projection Scope.
2. The selector SHALL resolve zero or one current Projection. It SHALL NEVER silently choose among multiple candidates.
3. The selected current Projection and the historical Basis-bound Projection SHALL remain distinct recorded references. Neither may substitute for, overwrite, or mutate the other.
4. **Approved** is eligible only when ALL hold: selection resolves exactly one current Projection (`resolutionResult == Resolved`); that Projection is fresh under RFC-0003 (`freshnessDetermination` indicates fresh); its Mission and Projection Scope match the input's `missionId` and `projectionScopeReference`; its identity and version equal the historical Result's bound Projection; and every other Corpus-readiness acceptance condition is satisfied.
5. If the selector returns `TemporarilyAbsent` and a Projection is expected through normal engineering progression, the Decision SHALL be **Deferred**.
6. If the selector resolves a fresh current Projection whose identity or version differs from the Result's bound Projection, the Decision SHALL be **Deferred**, identifying that a fresh Corpus Review Basis and a new Corpus Review are required.
7. If the historical bound Projection is stale relative to the resolved current Projection or the candidate corpus, the Decision SHALL be **Deferred**, identifying that a fresh Corpus Review Basis and a new Corpus Review are required.
8. If selection is `Unresolvable` or `Ambiguous`, or produces a Mission or Projection Scope conflict, duplicate candidates, unsupported selector semantics, or identity/version inconsistency, the Decision SHALL be **Escalation Required**.
9. No condition above may produce **Approved** through defaulting, recency guessing, maximum-version guessing, or implicit repository lookup.
10. Every Governance Decision produced under this profile SHALL record: the historical bound Projection identity and version; the resolved current Projection identity and version, when present; the selector policy and criterion identity and version; the candidate-corpus / evaluation-state fingerprint; and the resolution result together with the freshness determination.

**Historical validity is not current applicability.** A Corpus Readiness Result is historically valid for its exact immutable Basis; historical validity does not establish current applicability, which is determined only through the rules above.

## External Authoritative Applicability and Recording

Governance SHALL record the applicable terminal Governance Decision together with its exact bound `CorpusReadinessAcceptanceEvaluationInput`, including the complete `CurrentProjectionApplicabilityReference` and every element required by rule 10 above. Authoritative downstream applicability is determined externally by consumers resolving that Governance Decision.

Governance SHALL NOT mutate the RFC-0013 Corpus Readiness Result; SHALL NOT rebase, refresh, or substitute its historical bound Projection; and SHALL NOT overwrite the historical bound Projection with the resolved current Projection, or the reverse. The two references remain distinct and independently recorded. RFC-0013 stores no `authoritativeStatus`.

---

# Governance Decision

A Governance Decision is the immutable, attributable outcome of applying one identified Repository Policy version's Policy Evaluation to exactly one Governance Evaluation Input Profile instance.

A Governance Decision SHALL be exactly one of the following four mutually exclusive values:

## Approved

- **Required inputs, per profile:**
  - `ReviewGovernanceEvaluationInput` — the applicable Repository Policy version; a finalized (`ReviewStatus: Completed`) Review Outcome; all Evidence referenced by the Policy's Criteria. Unchanged from v1.1.
  - `CorpusReadinessAcceptanceEvaluationInput` — the applicable Corpus Readiness Acceptance Repository Policy version; a complete profile instance whose referenced RFC-0006 Assessment is terminal AND whose `CurrentProjectionApplicabilityReference` satisfies every condition of Current Projection Applicability Selection rule 4.
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

- **Required inputs:** where an applicable Repository Policy version was selected and bound, that version and whatever inputs exist; the specific obstruction is an ambiguity, conflict, or unsupported condition, not a missing input. Where Repository Policy Selection produced `NoCandidate`, `Ambiguous`, or `Unresolvable` (see Repository Policy Selection and Version Binding, above), no Repository Policy version is applicable, none is required, and the required inputs are instead the Mission identity, the declared Governance Evaluation Input Profile, and the complete `RepositoryPolicySelectionReference` carrying the exact condition that produced the outcome. The absence of an applicable Repository Policy version is itself the recorded obstruction, and a superseded Repository Policy version SHALL NOT be supplied in its place.
- **Precondition:** at least one applicable Policy Criterion could not be deterministically evaluated despite all required inputs being present (for example: conflicting applicable Repository Policies; a Policy Criterion referencing an undefined term; a Policy version gap), or the applicable Policy itself is ambiguous, conflicting, or absent for the case presented, or Repository Policy Selection did not resolve exactly one applicable Repository Policy version for this Mission and declared input profile kind. In that last case no Policy Criterion was evaluated, and none SHALL be recorded as evaluated.
- **Meaning:** repository law, as it currently exists, does not deterministically resolve this case.
- **Permitted downstream effect:** creates a Governance Escalation record (see below); MAY be surfaced to the Sprint Owner through existing Host/reporting mechanisms in a future Sprint.
- **Prohibited side effects:** SHALL NOT default to Approved or Rejected under any circumstance; SHALL NOT be silently retried with relaxed criteria.
- **Human confirmation required:** Yes — resolution SHALL occur only through a new or amended Repository Policy Ratification, or direct Sprint Owner decision recorded as repository law (see Governance Escalation, below).

No Governance Decision, of any value, SHALL mutate Mission, Review, Knowledge, Execution, or any other repository state as a side effect of being produced. A Governance Decision is a recorded fact about a Policy Evaluation, not a command.

A Governance Decision's recording shape depends on the recomputed `selectionOutcome` of the `RepositoryPolicySelectionReference` that governed the evaluation (see Repository Policy Selection and Version Binding, above). Exactly one of the two shapes below applies to any Governance Decision, and no Governance Decision SHALL carry both.

Where the recomputed `selectionOutcome` is `Resolved`, a Governance Decision SHALL reference: the Mission identity for which the evaluation was requested (see Mission-Scoped Governance Evaluation, above), the Repository Policy and version applied, the Policy Criteria evaluated and their individual results, the consumed Evidence references, the consumed Review reference, any applied Ratifications, the complete `RepositoryPolicySelectionReference` that bound the applied Repository Policy identity and version — including its pinned corpus source identity, corpus source revision, and corpus root, its pinned Ratification Authority Snapshot schema version, source identity, source revision, and snapshot envelope commitment, and each candidate's complete Repository Policy Corpus Record, corpus record fingerprint, and re-validated attribution validation outcome — and a deterministic timestamp/causality position consistent with the existing Domain Event envelope (RFC-0005). The Ratification Authority Snapshot fingerprint that `NEXUS-RAT-2026-07-16-001` requires is a separate value, produced by `RatificationAttributionValidation` rather than carried on the selection reference, and continues to be recorded in escalation attribution and included in the complete deterministic input exactly as that ratification provides. A `RepositoryPolicySelectionReference` pins the envelope commitment and SHALL NOT be described, encoded, or recorded as carrying a Ratification Authority Snapshot fingerprint.

Where the recomputed `selectionOutcome` is `NoCandidate`, `Ambiguous`, or `Unresolvable`, no Repository Policy version was selected, none was bound, none was applied, and no Policy Criterion was evaluated. Such a Governance Decision SHALL be **Escalation Required**, and SHALL reference: the Mission identity for which the evaluation was requested, the declared Governance Evaluation Input Profile, the complete `RepositoryPolicySelectionReference` — including its pinned corpus source identity, corpus source revision, and corpus root, its pinned Ratification Authority Snapshot schema version, source identity, source revision, and snapshot envelope commitment, and its complete ordered candidate collection — the exact condition that produced the outcome, and a deterministic timestamp/causality position consistent with the existing Domain Event envelope (RFC-0005). It SHALL NOT carry a selected, bound, or applied Repository Policy identity or version; SHALL NOT carry Policy Criteria evaluation results; SHALL NOT carry a superseded Repository Policy version as a substitute for the unresolved current head; and SHALL NOT be described, recorded, or reported as having applied or evaluated any Repository Policy version. The absence of an applicable Repository Policy version is the recorded fact, not a deficiency in the record.

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
- publish a Governance Domain Event that omits required RFC-0005 Event Attribution fields (including Mission identity), weakens RFC-0005's Event Attribution requirement, or relies on a type-unsound construct to bypass structural conformance with the RFC-0005 Domain Event envelope;
- accept a caller-supplied lifecycle authority declaration, record, segment, status, relation, or authority root during Ratification Authority Snapshot Issuance, or expose any parameter, field, or channel through which one could be supplied;
- resolve a Ratification reference, open a `RepositoryPolicy`, or produce a `Valid`, `Invalid`, or `Unresolvable` outcome during Ratification Authority Snapshot Issuance (`NEXUS-RAT-2026-07-15-017` retains sole authority over Ratification attribution validation);
- infer semantic disjointness of lifecycle scopes from prose, or read a `scopeDescription` for any purpose other than carrying it verbatim;
- bind the capture instant or the producing attribution into the authority root, or read a system clock internally in place of a declared capture instant;
- record an authority root, envelope commitment, or record fingerprint inside the governed source it is derived from;
- trim, pad, fold, or case-normalize any line of the governed source, or recognize an entry boundary or section heading inside a fenced region;
- implement, stub, or reserve authorized-subject attestations under the `nexus-ratification-authority-snapshot/3` schema.

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

Every row above applies to the `ReviewGovernanceEvaluationInput` profile. The following rows apply to the `CorpusReadinessAcceptanceEvaluationInput` profile:

| Condition (`CorpusReadinessAcceptanceEvaluationInput` profile) | Resulting Governance Decision |
| --- | --- |
| Referenced RFC-0006 Assessment temporarily missing, expected through normal engineering progression | Deferred |
| Referenced RFC-0006 Assessment exists but is non-terminal | Deferred |
| Historical bound RFC-0003 Projection temporarily absent, expected through normal engineering progression | Deferred |
| `CurrentProjectionApplicabilityReference.resolutionResult` is `TemporarilyAbsent` and a Projection is expected through normal engineering progression | Deferred |
| Selection resolves exactly one fresh current Projection whose identity or version differs from the Result's historical bound Projection — a fresh Basis and new Corpus Review are required | Deferred |
| Historical bound Projection stale relative to the resolved current Projection or candidate corpus, while uniquely resolvable and reproducible with identical Mission and Projection Scope — a fresh Basis and new Corpus Review are required | Deferred |
| Referenced RFC-0006 Assessment unresolvable, ambiguous, duplicated, conflicting, or identity-mismatched | Escalation Required |
| Historical bound RFC-0003 Projection missing without expectation, unresolvable, non-reproducible, ambiguous, or conflicting | Escalation Required |
| Historical bound Projection identity or version mismatch across Basis, Assessment, Result, and input; or Mission or Projection Scope differs from Basis-bound values | Escalation Required |
| `CurrentProjectionApplicabilityReference.resolutionResult` is `Unresolvable` or `Ambiguous` | Escalation Required |
| Selection produced a Mission or Projection Scope conflict, duplicate candidates, unsupported selector semantics, or identity/version inconsistency | Escalation Required |
| `CurrentProjectionApplicabilityReference` absent, incomplete, or internally inconsistent (for example, `Resolved` without `currentProjectionIdentity`, `currentProjectionVersion`, or `freshnessDetermination`; or a non-`Resolved` result carrying any of them) | Escalation Required |
| Corpus Review Basis fingerprint mismatch | Escalation Required |
| Corpus Readiness Result identity or classification mismatch | Escalation Required |
| Mission identity not equal across input profile, referenced Assessment, referenced Corpus Readiness Result, historical bound Projection, and `CurrentProjectionApplicabilityReference` | Escalation Required |
| Corpus Readiness Acceptance Repository Policy version mismatch, referenced policy version does not exist, or recorded selector policy identity/version does not match the acceptance policy under evaluation | Escalation Required |

The following row applies to both profiles:

| Condition (any profile) | Resulting Governance Decision |
| --- | --- |
| Undeclared, unknown, or ambiguous Governance Evaluation Input Profile | Escalation Required |

The following rows apply to Repository Policy Selection, under both profiles. They are evaluated in the total precedence order declared under Stage Model and Total Precedence, above; the first condition that holds determines the outcome:

| Condition (any profile; Repository Policy Selection) | Resulting Governance Decision |
| --- | --- |
| No obtainable governed source prepares to the recorded `corpusSourceRevision`, so the pinned corpus cannot be re-derived (Verification Step 1) | Escalation Required |
| Re-derivation of the pinned corpus reports `Rejected` rather than `Assembled` (Verification Step 2); the corpus diagnostic is reported | Escalation Required |
| The corpus root re-derived from the pinned governed source differs from the recorded `corpusRoot` (Verification Step 3) | Escalation Required |
| The multiset of corpus record fingerprints recomputed from the recorded candidates differs from the current-head fingerprint multiset of the re-derived corpus — an omitted head, an injected record, or a substituted record (Verification Step 4) | Escalation Required |
| The candidate collection contains a Repository Policy version that is not a current lineage head of the re-derived corpus — a superseded version assembled, substituted, promoted, or descended to for any reason, including the ineligibility, invalidity, indeterminacy, or `ScopeUndeclared` state of that identity's current head | Escalation Required |
| The candidate collection omits a current lineage head that the re-derived corpus declares | Escalation Required |
| The required issued Ratification Authority Snapshot artifact is not supplied; or more than one is supplied; or the supplied artifact's `snapshotSchemaVersion` differs from the recorded `authoritySnapshotSchemaVersion`; or its recomputed envelope commitment differs from the value it declares for itself; or its recomputed envelope commitment differs from the recorded `authoritySnapshotEnvelopeCommitment`, including an artifact re-issued from the same governed source at a different capture instant or by a different producer (Verification Step 5) | Escalation Required |
| The supplied Snapshot artifact fails any step of the verification chain V1 through V8 of `NEXUS-RAT-2026-08-04-001` — an object that is not a complete ratified `Issued` result, whether by a missing field or an unrecognized one; a record that does not encode; a record fingerprint collection that does not match the collection recomputed from the records supplied; an authority root that does not recompute; a record count that does not agree; a record collection, authority root, or result count not derivable from the governed source at the pinned revision; or a declared issuance fact the ratified issuance contract refuses when re-derivation reruns issuance with it (Verification Step 5) | Escalation Required |
| The verified artifact's `envelope.authoritySourceIdentity` differs from the recorded `authoritySourceIdentity` of field 7 — a recorded authority-source identity divergence, reported naming both values (Verification Step 5) | Escalation Required |
| The verified artifact's `envelope.authoritySourceRevision` differs from the recorded `authoritySourceRevision` of field 8 — a recorded authority-source revision divergence, reported naming both values (Verification Step 5) | Escalation Required |
| A candidate's `corpusRecord.authorizingRatificationIdentifier` matches a structurally valid, recognized-status, noncontradictory record of the verified Snapshot artifact whose `lifecycleResolutionForm` is `SegmentedLifecycle`, so `RatificationAttributionValidation` resolves the scope-free reference to `Unresolvable` with `unresolvable-scope-free-reference-to-segmented-record` and the candidate is indeterminate; the artifact itself is not refused, no segment is selected or mapped to a lifecycle outcome, and a record carried but not cited by any candidate has no effect (Verification Step 5) | Escalation Required |
| A candidate's re-validated attribution outcome, produced by `RatificationAttributionValidation` against the consumed state of the verified pinned Snapshot, differs from its recorded `attributionValidationOutcome` — a forged or stale attribution outcome (Verification Step 5) | Escalation Required |
| A `corpusRecordFingerprint` does not equal the digest recomputed from the corpus record it accompanies | Escalation Required |
| `RepositoryPolicySelectionReference` absent, structurally incomplete, or internally inconsistent (for example, `Resolved` without `selectedPolicyIdentity`, `selectedPolicyVersion`, or `selectedAuthorizingRatificationIdentifier`; or a non-`Resolved` outcome carrying any of them) | Escalation Required |
| A carried corpus record's `missionApplicabilityScope` collection length does not match its `scopeDeclarationState`, or that collection carries two or more elements | Escalation Required |
| `candidateSetFingerprint` does not match the value recomputed over the recorded corpus facts, snapshot facts, and candidate collection (Verification Step 6) | Escalation Required |
| Supplied `selectionOutcome` or any supplied selected field diverges from the value recomputed from the verified inputs (Verification Step 7) | Escalation Required |
| `authoritySourceRevision`, `corpusSourceRevision`, or `candidateSetFingerprint` is not exactly 64 lowercase hex characters; or `corpusRoot`, `authoritySnapshotEnvelopeCommitment`, or a `corpusRecordFingerprint` is not its ratified prefix — `cr-sha256-`, `ec-sha256-`, and `pc-sha256-` respectively — followed by exactly 64 lowercase hex characters; or `authoritySnapshotSchemaVersion` is not exactly `nexus-ratification-authority-snapshot/3` | Escalation Required |
| `RepositoryPolicySelectionReference.missionId` differs from the evaluation request's Mission identity | Escalation Required |
| `RepositoryPolicySelectionReference.declaredProfileKind` differs from the profile declared by the Policy Evaluation | Escalation Required |
| `selectionOutcome` is `Unresolvable` — at least one candidate is indeterminate: its re-validated attribution validation outcome is `Unresolvable`, or its carried corpus record is internally inconsistent. One indeterminate candidate is sufficient, even where another candidate would otherwise be eligible | Escalation Required |
| `selectionOutcome` is `NoCandidate` — every candidate is determinate and none satisfies the Eligibility Predicate for this Mission and declared profile kind, including the case where every candidate's attribution validation outcome is `Invalid`, the case where every candidate is `ScopeUndeclared`, and the case where no candidate's declared `MissionApplicabilityScope` is Mission-applicable to the request | Escalation Required |
| `selectionOutcome` is `Ambiguous` — every candidate is determinate and two or more satisfy the Eligibility Predicate, whether or not their Policy Criteria contradict one another | Escalation Required |
| The Repository Policy identity or version bound to the Governance Decision differs from the identity or version whose Policy Criteria were evaluated | Escalation Required |
| A Governance Decision produced for a `NoCandidate`, `Ambiguous`, or `Unresolvable` selection outcome carries a selected, bound, or applied Repository Policy identity or version, or carries Policy Criteria evaluation results, or is described as having applied or evaluated a Repository Policy version | Escalation Required |

An `Invalid` attribution validation outcome is a determinate exclusion, not indeterminacy: it renders that candidate ineligible and SHALL NOT by itself produce `Unresolvable`. An `Unresolvable` attribution validation outcome is indeterminacy and SHALL produce `Unresolvable` before cardinality is assessed. The exact underlying attribution result SHALL be preserved and reported in either case. An unrecognised authorizing Ratification identifier is neither of these conditions in itself: such a candidate is assembled unconditionally, and `RatificationAttributionValidation` alone determines its outcome. Neither outcome, and no other condition in this table, authorizes the assembly or selection of a superseded Repository Policy version; a candidate-set divergence naming a non-head version SHALL be reported as such and never as an eligibility failure.

A reference that satisfies every recomputation in this specification while failing any re-derivation step is a **forged or stale reference**, not a valid one. Internal consistency SHALL NOT be accepted in place of verification, and no row above may be satisfied by recomputing a value over the reference's own recorded fields.

No Repository Policy Selection condition produces **Deferred**, and none produces **Approved**. Selection failures are never resolved by normal engineering progression, because a Repository Policy comes into existence only through Ratification.

The following rows apply to Mission Applicability Scope, under both profiles:

| Condition (any profile; Mission Applicability Scope) | Resulting Governance Decision |
| --- | --- |
| Referenced Repository Policy version declares no `MissionApplicabilityScope` (`ScopeUndeclared`) and is referenced by a new governance evaluation | Escalation Required |
| A `ScopeUndeclared` version is presented as, back-filled to, or otherwise treated as `RepositoryWide` or any other implied scope | Escalation Required |
| The evaluation request's Mission identity is not a member of the referenced Policy version's declared `MissionSet` | Escalation Required |
| `scopeKind` is a value outside the closed union `RepositoryWide \| MissionSet` | Escalation Required |
| `scopeKind` is `MissionSet` and `missions` is empty | Escalation Required |
| `scopeKind` is `RepositoryWide` and `missions` is non-empty | Escalation Required |
| `missions` is not in Mission Ordering Comparator order, contains a duplicate Mission identity, or contains an empty identity | Escalation Required |
| A scope is absent, inferred, wildcarded, defaulted, synthesized, or supplied or overridden by a caller | Escalation Required |
| A Repository Policy version's scope is mutated, extended, narrowed, or re-declared in place rather than superseded by a new version | Escalation Required |
| Mission applicability is satisfied but the Policy Criterion's declared Governance Evaluation Input Profile does not match the profile the evaluation declared, or the converse | Escalation Required |

No Mission Applicability Scope condition produces **Deferred**, and none produces **Approved**. A Repository Policy version's scope comes into existence only through Ratification, which is a governance action, and never through normal engineering progression.

Deferred is used exactly when the obstruction is the temporary absence of a required input that is expected to eventually exist through normal engineering progression — including, for the Corpus-readiness profile, a historical bound Projection that is stale but exactly resolvable, whose resolution is a new Corpus Review against a fresh Basis. Escalation Required is used exactly when the obstruction is an ambiguity, conflict, mismatch, non-reproducibility, or unsupported condition that will not resolve through normal engineering progression and instead requires a governance action (Ratification or Sprint Owner decision). No condition in either profile produces Approved.

## Ratification Authority Snapshot Issuance Failures

Issuance failures are not Governance Decisions and SHALL NOT be mapped onto `Approved`,
`Deferred`, or `Escalation Required`. Issuance produces exactly `Issued` or `Rejected`,
and a `Rejected` result carries exactly one diagnostic code from the closed public
vocabulary, its declared phase, its precedence rank, and its exact discriminated payload.

| Condition | Resulting issuance outcome |
| --- | --- |
| Octets outside the declared source input domain | `Rejected` · `SourceIntegrity` |
| Invalid UTF-8, or a byte order mark | `Rejected` · `SourceIntegrity` |
| Unreadable Ratification entry structure, or an unclosed fenced region | `Rejected` · `EntryStructure` |
| Malformed structured declaration block | `Rejected` · `DeclarationGrammar` |
| Declaring authority not Effective under the generic rule | `Rejected` · `DeclarantAuthority` |
| Declaration self-reference, or a declarant-authority cycle | `Rejected` · `DeclarantAuthority` |
| Absent subject, generic-rule conflict, status-binding mismatch, or duplicate declaration | `Rejected` · `DeclarationBinding` |
| Absent relation target, self-referential relation, or a lifecycle-relation cycle | `Rejected` · `LifecycleGraph` |
| An entry with neither generic resolution nor a governed declaration | `Rejected` · `Resolution` |
| Inadmissible declared capture instant or producing attribution | `Rejected` · `Envelope` |
| All phases pass | `Issued` |

No issuance condition produces a partial snapshot. A snapshot is issued in whole or not at
all.

## Repository Policy Corpus Assembly Failures

Corpus assembly failures are not Governance Decisions and SHALL NOT be mapped onto `Approved`,
`Rejected`, `Deferred`, or `Escalation Required`. Assembly produces exactly `Assembled` or
`Rejected`, and a `Rejected` result carries exactly one diagnostic code from the closed public
vocabulary, its declared phase, its precedence rank, and its exact discriminated payload.

| Condition | Resulting assembly outcome |
| --- | --- |
| Octets outside the declared source input domain | `Rejected` · `SourceIntegrity` |
| Invalid UTF-8, or a byte order mark | `Rejected` · `SourceIntegrity` |
| Unreadable Ratification entry structure, or an unclosed fenced region | `Rejected` · `EntryStructure` |
| Malformed policy declaration block, policy element, scope, criterion, or content commitment token | `Rejected` · `DeclarationGrammar` |
| Duplicate version, an initial version other than 1, an initial version declaring a predecessor, a non-initial version declaring none, a non-immediate predecessor, or a lineage gap | `Rejected` · `PolicyLineage` |
| Absent content section, a content section that is the declaration section itself, a content section that is the final section of its entry, or a content digest that does not equal the declared commitment | `Rejected` · `ContentBinding` |
| Inadmissible declared capture instant or producing attribution | `Rejected` · `Envelope` |
| Every phase passes, including a source declaring zero Repository Policy versions | `Assembled` |

No assembly condition produces a partial corpus. A corpus is assembled in whole or not at all.

A governed Ratification that declares no Repository Policy version is not an assembly failure of
any kind. It contributes zero records, and its absence from the corpus SHALL NOT be reported as
omission.

---

# Explainability

Every Policy Evaluation and every Governance Decision SHALL identify:

- the Mission for which the evaluation was requested;
- the evaluated Repository Policy and its specific version;
- the applicable Policy Criteria considered;
- the consumed Evidence references;
- the consumed Review reference and its finalized Outcome (`ReviewGovernanceEvaluationInput` profile);
- any Ratifications applied during evaluation;
- which Policy Criteria were satisfied;
- which Policy Criteria were violated;
- the Governance Escalation reason, when the Decision is Escalation Required;
- the declared Governance Evaluation Input Profile and the exact bound fields of that profile instance;
- for the Repository Policy version **referenced** by the evaluation, its declared `MissionApplicabilityScope` — the `scopeKind` and, when `MissionSet`, the complete canonically ordered `missions` collection — together with the evaluation request's Mission identity and the exact result of the Mission applicability predicate. A referenced version that fails the predicate SHALL NOT be described as applied; the term **applied** is reserved for a Repository Policy version that satisfied every required eligibility dimension and whose Policy Criteria were evaluated. When applicability failed, the exact failing condition SHALL be identified; when the referenced version was `ScopeUndeclared`, that SHALL be stated explicitly rather than reported as a scope mismatch;
- the complete `RepositoryPolicySelectionReference`: the Mission identity, the declared input profile kind, the pinned corpus source identity, corpus source revision, and corpus root, the pinned Ratification Authority Snapshot schema version, source identity, source revision, and snapshot envelope commitment, the ordered candidate policy references with each candidate's complete Repository Policy Corpus Record — its Policy identity, version, authorizing Ratification identifier, predecessor versions, scope declaration state, declared `MissionApplicabilityScope` where present, Policy Criterion declarations with their declared profile kinds, and content commitment — together with each candidate's corpus record fingerprint and re-validated attribution validation outcome, the candidate-set fingerprint, the selection outcome, and — when the outcome is `Resolved` — the selected Repository Policy identity, selected version, and selected authorizing Ratification identifier. When the outcome is `Ambiguous`, every eligible candidate SHALL be identified in Candidate Ordering Comparator order. When the outcome is `Unresolvable`, every indeterminate candidate and the exact condition that made it indeterminate SHALL be identified. When the outcome is `NoCandidate`, the exact failing eligibility conjunct SHALL be identified for each candidate; a candidate excluded because it was `ScopeUndeclared` SHALL be reported as `ScopeUndeclared` rather than as a scope mismatch; and a candidate excluded because its attribution validation outcome was `Invalid` SHALL be reported as `Invalid`, distinctly from a candidate that was `Unresolvable`, with the exact underlying attribution result preserved in both cases. Every candidate SHALL be identified as the current lineage head of its Policy identity at the recorded corpus source revision; where a candidate-set divergence was detected, the non-head or omitted `(policyIdentity, policyVersion)` pair SHALL be named as a candidate-set divergence and SHALL NOT be reported as an eligibility failure, and no superseded version SHALL be identified as a candidate, as considered, or as available. When the outcome is `NoCandidate`, `Ambiguous`, or `Unresolvable`, the Governance Decision SHALL identify no applied Repository Policy version and no evaluated Policy Criteria, because none exists; the identification requirements above that presuppose an evaluated Repository Policy version SHALL be read as applying only to the `Resolved` case.

For the `CorpusReadinessAcceptanceEvaluationInput` profile, this means additionally identifying the Mission, Corpus Review Basis fingerprint, RFC-0006 Assessment identity and terminal Outcome, Corpus Readiness Result identity and classification, the historical bound Projection identity and version, the complete `CurrentProjectionApplicabilityReference` (selector policy and criterion identity/version, resolution result, resolved current Projection where present, freshness determination, Projection Scope reference, and candidate-corpus fingerprint), and the acceptance policy identity and version.

A Deferred Decision arising from Current Projection Applicability Selection rules 5, 6, or 7 SHALL identify that a fresh Corpus Review Basis and a new Corpus Review are required.

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
- preserves full attribution and explainability for every Governance Decision and Escalation;
- declares exactly one Governance Evaluation Input Profile per Policy Evaluation, from the closed authorized set, never inferring a profile from data shape and never substituting one profile's inputs for another's;
- preserves `ReviewGovernanceEvaluationInput` semantics, required inputs, failure handling, and wire contract exactly as in v1.1;
- applies per-profile determinism, per-profile required inputs, and per-profile failure classification as specified;
- for the `CorpusReadinessAcceptanceEvaluationInput` profile, supplies and records a complete `CurrentProjectionApplicabilityReference`, and produces `Approved` only when every condition of Current Projection Applicability Selection rule 4 holds;
- never produces `Approved` through defaulting, recency guessing, maximum-version guessing, or implicit repository lookup;
- consumes the exact RFC-0013 Corpus Readiness Result without recomputing, reinterpreting, or inferring its readiness classification;
- never mutates the RFC-0013 Corpus Readiness Result, and never rebases, refreshes, substitutes, or overwrites either the historical bound Projection or the resolved current Projection with the other;
- records, for every Corpus-readiness Governance Decision, the historical bound Projection identity and version, the resolved current Projection identity and version when present, the selector policy and criterion identity and version, the candidate-corpus fingerprint, and the resolution and freshness results;
- for Ratification Authority Snapshot Issuance, encodes every committed octet sequence with NCCS-1 exactly as RFC-0003 v1.1 defines it, and cross-checks each implementation against RFC-0003's normative Conformance Vectors before claiming agreement between implementations;
- reads the governed source under the entry-extraction and declaration-block grammars stated in this specification, including the fenced-region rule, without trimming any line;
- derives every lifecycle authority declaration exclusively from the governed source octets, and exposes no channel for a caller-supplied declaration;
- constructs and validates the declarant-authority graph and the lifecycle-relation graph independently, evaluating the lifecycle-relation graph over provisional records before rejecting any entry for failing to resolve;
- encodes every committed record in the fixed schemas and field order stated in this specification, and applies the stated deterministic ordering rules wherever traversal order could otherwise vary;
- derives the authority root from governed octets alone, so that two structurally independent implementations reading the same octets produce the same root, and records no root, commitment, or fingerprint inside the governed source;
- resolves two defects of the same phase by declared code order, code-major over target order, executing each phase as one pass per declared code, and selects the reported target under the target-selection order stated for that phase, every term of which is defined by position in the prepared text;
- detects cycles in both governed graphs by the stated depth-first search — roots entered in ascending octet order, outgoing edges followed in declared order, exhausted nodes closed and never re-entered — and reports the stated canonical path for the first cycle found;
- prepares governed octets for issuance without writing the prepared text back over the stored source, and treats an append-only change to that source as preserving every existing octet as a byte-identical prefix;
- reports exactly `Issued` or `Rejected`, with every `Rejected` result carrying a declared code, its phase, its precedence, and an exact discriminated payload carrying `payloadKind` as its first field and whose `declaredField`, where applicable, names the exact leaf at fault;
- demonstrates that every declared public diagnostic code is reachable through the public issuance contract, and that no code outside the declared public partition is reachable;
- implements no attestation field, collection, subject-kind union, placeholder, or extraction path;
- requires every newly created or superseding Repository Policy version to explicitly declare exactly one `MissionApplicabilityScope` from the closed union `RepositoryWide | MissionSet`, and accepts no absent, inferred, wildcarded, defaulted, synthesized, or caller-supplied scope;
- never treats a `ScopeUndeclared` Repository Policy version as `RepositoryWide` or as having any implied scope, never mutates or back-fills such a version, preserves every Governance Decision already produced against it exactly as recorded, and fails closed with `Escalation Required` when such a version is referenced by a new evaluation;
- evaluates Mission applicability as exactly the declared predicate — `RepositoryWide`, or exact identity membership of the request's explicit Mission identity in the declared `MissionSet` — using byte equality of NFC-normalized NCCS-1 String encodings, implements no prefix, pattern, wildcard, range, case-insensitive, hierarchical, or similarity matching, and never describes a version that failed the predicate as applied;
- treats Mission applicability and the Policy Criterion's declared Governance Evaluation Input Profile as two independent eligibility dimensions, requires both to hold, and never treats either as satisfying the other;
- encodes `MissionApplicabilityScope` as the declared two-field NCCS-1 record with `missions` in Mission Ordering Comparator order, empty exactly when `RepositoryWide` and non-empty exactly when `MissionSet`, determines scope equality solely by byte-identical canonical encoding, derives no fingerprint from a scope, and stores the scope as Repository Policy data rather than as any Ratification Authority Snapshot field or attestation;
- assembles the Repository Policy corpus as a total function of one pinned governed octet sequence and exactly two declared assembly facts, traversing every entry and every `## Repository Policy Declarations` section, applying no filter and exercising no selection, accepting no caller-supplied record or applicability fact through any parameter, field, or channel, and treating an entry that declares no Repository Policy version as contributing zero records rather than as a defect;
- binds each corpus record to the authorizing Ratification identifier derived from the entry carrying its declaration rather than to a declared one, validates linear version lineage — an initial version of exactly 1 declaring no predecessor, every other version declaring exactly its immediate predecessor, that predecessor itself declared, no duplicate `(policyIdentity, policyVersion)` pair, and therefore no gap and no competing successor — and derives exactly one current lineage head per Policy identity rather than accepting a declared one;
- enumerates and commits both the complete preserved history and the current-head universe as separate collections, never conflating them, and never treating a superseded version as a current candidate or a preserved version as removed;
- recomputes each declared `contentCommitment` from the named content section of the same entry in the pinned prepared source, over the prepared section text comprising that section's heading line and every one of its body lines without exception — including empty lines and body lines consisting of exactly three hyphens — never over the filtered content-line projection that governs an entry's required source fields, and rejects a declaration whose content section is absent, is the declaration section itself, or is the final section of its entry, and rejects a digest mismatch rather than accepting the declarant's digest;
- reports every declaration defect at its exact failing target, naming a `policy` element, a `criterion` group, or a `mission` line by deterministic traversal position where the declared identity is itself malformed or empty, separating Policy-identity from criterion-identity grammar defects, and declaring an identity- or version-bearing payload only for codes whose within-phase order guarantees those fields are already well-formed;
- derives the corpus root from governed octets alone so that two structurally independent implementations reading the same octets produce the same root, binds both fingerprint collections into that root, records no root, commitment, or fingerprint inside the governed source it commits to, reports exactly `Assembled` or `Rejected`, never `Issued`, `Valid`, `Invalid`, or `Unresolvable`, treats an empty corpus as `Assembled`, and never describes an assembled corpus as establishing that an authorizing Ratification is effective;
- binds exactly one Repository Policy identity and version per Policy Evaluation, taken from a `RepositoryPolicySelectionReference` that passed every Pre-Use Verification step and whose recomputed outcome is `Resolved`, and never derives that version by recency, maximum-version, latest-ratification-date, scope-specificity, lineage descent, or defaulting;
- assembles the candidate collection as exactly the current-head universe of one assembled Repository Policy Corpus that reported `Assembled`, assembles every current head unconditionally, applies no assembly-time filter of any kind, and in particular never omits a current head because its authorizing Ratification identifier is absent from or unrecognised by the pinned Snapshot, that disposition belonging exclusively to `RatificationAttributionValidation`;
- carries in each candidate the complete ratified Repository Policy Corpus Record verbatim, a corpus record fingerprint recomputed from that record rather than copied, and an attribution validation outcome produced by the sole attribution authority, stores no derived projection of the record alongside it, and accepts no caller-supplied candidate entry, applicability fact, fingerprint, or outcome through any parameter, field, or channel;
- verifies every supplied selection reference before use by re-deriving the Repository Policy Corpus from the governed source octets whose prepared-text digest equals the recorded corpus source revision, confirming the re-derived corpus root equals the recorded root, confirming the recomputed candidate fingerprint multiset equals the re-derived current-head fingerprint multiset, and re-validating every attribution outcome against the issued Ratification Authority Snapshot artifact supplied as an input and put through the complete verification chain V1 through V9 of `NEXUS-RAT-2026-08-04-001` — which requires the complete ratified `Issued` result shape, recomputes every fingerprint, the authority root, and the envelope commitment, requires the recomputed commitment to equal the recorded pin, and re-derives the record collection, the authority root, and all three result counts from the governed source at the pinned revision — never re-issuing an artifact in its place, never accepting a root-equivalent, never omitting governed-source re-derivation, and never treating that pin as the Ratification Authority Snapshot fingerprint of `NEXUS-RAT-2026-07-16-001`;
- requires, as normative conditions of that same verification step and additional to the chain, that the verified artifact's `envelope.authoritySourceIdentity` equal the recorded authority source identity and that its `envelope.authoritySourceRevision` equal the recorded authority source revision, each octet for octet, reporting a divergence by naming both values and failing closed, and never assumes either comparison from the chain, whose pin carries only the schema version and the envelope commitment;
- invokes the Ratification Authority Snapshot Consumption Correspondence of `NEXUS-RAT-2026-08-04-001` to obtain the state that authority consults rather than defining any transformation of its own, never describes the pinned envelope commitment as identifying a unique artifact, a unique issuance event, or a complete serialized issued state — it establishes commitment-equivalence over the eight basis fields and the committed record collection, which is what fixes the consumed state — and never accepts a reference on the strength of internal consistency, a reproducing candidate-set fingerprint, or a recomputed outcome alone;
- never represents a reproducing candidate-set fingerprint as establishing candidate-set completeness, candidate provenance, corpus membership, or attribution authenticity, and never represents a recorded corpus root hashed beside a recorded candidate list as proving that list to be the root's current-head projection;
- never assembles, substitutes, promotes, falls back to, or descends to a Repository Policy version that is not the current lineage head of its Policy identity in the re-derived corpus, under any condition whatever — including an `Invalid` or `Unresolvable` attribution outcome, a `ScopeUndeclared` head, an ineligible head, an internally inconsistent head, and a head whose exclusion would leave no eligible candidate — and reports a candidate collection containing a non-head or omitting a declared head as a candidate-set divergence naming the exact pair and the exact divergence kind, never as an eligibility failure;
- evaluates Mission applicability within selection as exactly the ratified Mission applicability predicate over the candidate's own declared scope as its carried corpus record states it, treats a `ScopeUndeclared` candidate as ineligible without mutating, back-filling, or repairing it, without treating it as `RepositoryWide`, and without reviving an earlier explicitly scoped version of the same identity, and determines profile eligibility directly from that record's Policy Criterion declarations rather than from any stored or supplied projection of them;
- treats an `Unresolvable` re-validated attribution outcome and an internally inconsistent carried corpus record as candidate indeterminacy that produces `Unresolvable` before cardinality is assessed, treats an `Invalid` re-validated attribution outcome as a determinate exclusion that produces ineligibility and never `Unresolvable`, never conflates the two, never anticipates either by filtering a candidate out of assembly, and preserves and reports the exact underlying attribution result in both cases;
- records a Governance Decision whose shape matches its selection outcome: for `Resolved`, the bound and applied Repository Policy identity and version together with the evaluated Policy Criteria and their results; for `NoCandidate`, `Ambiguous`, and `Unresolvable`, the complete selection reference and the exact failing condition, carrying no selected, bound, or applied Repository Policy identity or version, carrying no Policy Criteria results, carrying no superseded version as a substitute, and never describing or reporting the Decision as having applied or evaluated a Repository Policy version;
- encodes the three-field Candidate Policy Reference record and the ten-field Candidate Set record in ascending field-name order as declared, orders candidates by the length-prefixed encoding of the carried corpus record's Policy identity, fails closed on a duplicate identity, a misordered collection, a malformed prefixed digest, and a corpus record fingerprint that does not equal the digest of the record it accompanies, resolves `NoCandidate`, `Ambiguous`, and `Unresolvable` outcomes to `Escalation Required` and never to `Deferred` or `Approved`, fails closed on all candidate multiplicity without arbitration, and records the complete selection reference on every Governance Decision it produces;
- consumes a verified artifact carrying any `SegmentedLifecycle` record rather than refusing it, carries every such record into the consumed state on the segmented arm of the closed structural union of consumed records with its declared segments intact, treats the carried segment order as non-authoritative for resolution, never drops, flattens, aggregates, reorders, deduplicates, or arbitrates among segments, and obtains the `Unresolvable` outcome and the exact `unresolvable-scope-free-reference-to-segmented-record` diagnostic of a scope-free reference to a structurally valid, recognized-status, noncontradictory segmented record from `RatificationAttributionValidation` alone, never by selection, preference, inference, or a diagnostic of its own.

A conforming version 3 artifact cannot present a segmented record that is structurally malformed, carries an unrecognized lifecycle status, or is internally contradictory: such a record fails **V3** as `record-not-encodable`, the artifact is refused, and no consumed state is produced. The preservation of those pre-existing conditions is therefore an obligation of `RatificationAttributionValidation` over a consumed state, not a consumption obligation of the supplied-artifact path, and it is stated as such: applied to any such state, each condition SHALL yield its pre-existing outcome — `Invalid`, `Unresolvable`, and `Invalid` respectively — with its pre-existing diagnostic, at its pre-existing position in matched-record evaluation, and SHALL NOT be rerouted to the scope-free segmented-reference condition or its diagnostic.

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
- v1.2 (2026-07-18) — Amended by `NEXUS-RAT-2026-07-18-007`. Introduces a closed Governance Evaluation Input Profile model comprising exactly two profiles: `ReviewGovernanceEvaluationInput`, whose semantics, required inputs, failure handling, and wire contract are exactly those of v1.1 and are **not modified**; and `CorpusReadinessAcceptanceEvaluationInput`, carrying the Mission, Corpus Review Basis fingerprint, RFC-0006 Assessment identity and terminal Outcome, RFC-0013 Corpus Readiness Result identity and classification, the historical bound RFC-0003 Projection identity and version, an immutable `CurrentProjectionApplicabilityReference`, and the Corpus Readiness Acceptance Repository Policy identity and version. The `CurrentProjectionApplicabilityReference` supplies the Mission, Projection Scope reference, resolved current Projection identity and version when resolved, selector policy and criterion identity and version, a resolution result (`Resolved | TemporarilyAbsent | Unresolvable | Ambiguous`), the RFC-0003 freshness determination when resolved, and the candidate-corpus fingerprint — making current-applicability comparison possible from the closed profile alone, since a Policy Criterion may evaluate only inputs its declared profile supplies. Selection itself is owned by the separately ratified Corpus Readiness Acceptance Repository Policy; this specification defines only the input and recording contract. Dependencies, Design Goals and determinism, Repository Policy and Policy Criterion evaluability, Policy Evaluation, Mission-Scoped Governance Evaluation, the Governance Decision definition and per-value required inputs, Failure and Conflict Handling, Explainability, and Conformance are each reconciled to the profile model, with every Review-profile rule preserved exactly. Fail-closed classifications are separated by nature: temporary absence, non-terminality, and stale-but-exactly-resolvable historical Projections resolve to `Deferred`; ambiguity, conflict, mismatch, non-reproducibility, and unresolvable identity resolve to `Escalation Required`; no condition resolves to `Approved`. **RFC-0003 is not amended**; Projection, Projection Version, Projection Scope, and Projection Freshness remain RFC-0003-owned and are consumed, not redefined. No new Governance Decision value, Escalation category, or Policy Evaluation mechanism is introduced. Specification text only; the Corpus-readiness profile remains **dormant and unusable** until RFC-0013 v0.6 is authorized, the required Assessment exists, the acceptance policy including its selector is separately ratified, and implementation is separately authorized.
- v1.3 (2026-07-31) — Amended by `NEXUS-RAT-2026-07-31-001` to establish the Ratification Authority Snapshot Issuance Contract as a new binding section, stated completely enough to be implemented from this specification alone. Introduces: the ownership boundary separating issuance from `RatificationAttributionValidation`, which retains sole authority over Ratification reference resolution and its three closed outcomes; an exact governed octet-sequence input domain, stated as a public contract so that conforming implementations classify identical octets identically; the complete governed source text preparation, fenced-region, entry-extraction, and declaration-block grammars; the complete fixed NCCS-1 schemas and field order for records, segments, relations, the authority root basis, the producing attribution, and the envelope commitment basis; the fixed protocol constants; two distinct source facts, a stable `authoritySourceIdentity` and a revision-sensitive `authoritySourceRevision` computed over prepared text; Ratification Authority Records as discriminated unions on `lifecycleAuthorityKind`, with Lifecycle Segments discriminated on `scopeKind` and exactly one reserved `residual` segment per record establishing structural completeness; the exclusive Generic Source Rule for a Current Status of exactly `Active`; governed lifecycle authority declarations extracted solely from pinned governed octets, with entitled declarants, digest-bound subjects, and no caller-supplied channel; two independently validated graphs, the lifecycle-relation graph evaluated over provisional records before any entry is rejected for failing to resolve; three commitment layers, of which the issuer- and time-independent authority root is derived from governed octets alone while the envelope commitment binds the capture instant and producing attribution, and none of which may be recorded inside the source it commits to; exactly two declared issuance facts; explicit deterministic ordering rules, each defined by position in the prepared text, for entries, records, provisional records, sections, blocks, declarations within a block, declaration traversal, segments, relations, and fingerprints, together with a complete cycle-selection algorithm for both governed graphs fixing edge construction, outgoing-edge order, root order, visit states, the first reported cycle, and the exact canonical path; and a total `Issued | Rejected` result contract with declared result schemas, carrying a closed forty-six-code public vocabulary across eight ordered governed execution phases ranked 0 through 7, together with a ninth `ContractViolation` partition at rank 8 that is not a governed outcome, seven exact discriminated payload variants each carrying `payloadKind` as its first field, and three unreachable contract-violation classifications. Precedence is total: phase rank first, then normative within-phase code order applied code-major over the deterministic traversal order, with each phase executing as one pass per declared code, and a complete target-selection order for all eight public phases — including an entry order and a section order for `EntryStructure`, where no entry has yet become a record, and a provisional-record order for `LifecycleGraph`, which runs before record order exists — so that two implementations agreeing on the code also agree on the payload. States that governed source preparation is a read operation and not authority to rewrite the stored source, so that an append-only repository change preserves every existing octet as a byte-identical prefix. Requires two structurally independent implementations agreeing on the complete public result. Declares the schema version `nexus-ratification-authority-snapshot/2` and its exact, total incompatibility with version 1, with migration of any v1 artifact requiring separate ratification. Defers authorized-subject attestations entirely, in every form. **RFC-0003 is not amended**; NCCS-1 is consumed exactly as defined. **`NEXUS-RAT-2026-07-15-017` is not amended**; all ten of its ratified Required Outcome Mapping conditions remain in force for attribution validation. No Governance Decision value, Escalation category, Policy Evaluation mechanism, or Governance Evaluation Input Profile is introduced or modified. Specification text only; implementation requires separate Sprint scope ratification.
- v1.4 (2026-08-02) — Amended by `NEXUS-RAT-2026-08-02-002` to establish Mission Applicability Scope. Adds a sixth required Repository Policy attribute, Mission-scoped, requiring every newly created or superseding Repository Policy version to explicitly declare exactly one immutable, policy-owned `MissionApplicabilityScope`. Defines that scope as a closed union of exactly two variants: `RepositoryWide`, which SHALL be deliberately authorized for that exact version by that version's own authorizing Ratification and SHALL NEVER be inferred from absence; and `MissionSet`, containing one or more exact RFC-0001 Mission identities in a canonically ordered, duplicate-free collection. No absent, inferred, wildcarded, pattern-matched, prefix-matched, range-matched, hierarchically derived, defaulted, synthesized, or caller-supplied scope is authorized. Establishes the exact Mission applicability predicate: a Repository Policy version is Mission-applicable to a governance evaluation request if and only if it declares `RepositoryWide`, or it declares `MissionSet` and the request's explicit Mission identity is an exact member of that collection, membership being byte equality of NFC-normalized NCCS-1 String encodings with no prefix, pattern, wildcard, range, case-insensitive, hierarchical, or similarity matching. Reconciles this explicitly with Mission-Scoped Governance Evaluation's existing no-inference rule, which is not weakened, narrowed, or excepted: the direction is exact, the `MissionId` is an input to the validation and never an output of it, the predicate derives, synthesizes, defaults, repairs, and substitutes no Mission identity, and an absent, malformed, or unresolvable `MissionId` fails under that section before any applicability predicate is reached. Establishes immutability per version: a scope SHALL NOT be mutated, extended, narrowed, re-declared, or overridden in place; a change requires a new sequential Repository Policy version and its own authorizing Ratification; the prior version is permanently preserved with its original scope; and a later version's scope SHALL NOT retroactively apply to, rebind, or invalidate a Governance Decision already produced against an earlier version. Establishes exact legacy behavior: a Repository Policy version created before this section and declaring no scope is `ScopeUndeclared`, remains valid for and never invalidates Governance Decisions already produced against it, is ineligible for any new governance evaluation and fails closed with **Escalation Required**, SHALL NOT be mutated, back-filled, annotated, or repaired in place, and SHALL NOT be treated as `RepositoryWide` or as having any implied, default, or inherited scope; it becomes usable only by supersession through an explicitly scoped new version or by a separately ratified exact migration, which this section does not authorize. Establishes Mission applicability and the Policy Criterion profile declaration as two independent eligibility dimensions, both of which SHALL hold, neither replacing, subsuming, or implying the other; the existing Policy Criterion profile declaration requirement is unchanged. Reserves the term **applied** for a Repository Policy version that satisfied every required eligibility dimension; a referenced version that fails the applicability predicate SHALL NOT be described as applied. Declares the complete canonical encoding this schema owes NCCS-1 rule 5: a two-field record (`scopeKind` Enumeration, `missions` ordered collection), the variant coupling requiring `missions` empty exactly when `RepositoryWide` and non-empty exactly when `MissionSet`, the Mission Ordering Comparator over the length-prefixed String encoding, the uniqueness declaration and duplicate fail-closed policy, the normalization rules, and the additional fail-closed conditions. Defines equality as byte-identical canonical encoding, never as set semantics, membership overlap, subset relation, or any order-ignoring comparison, and states that scope equality is not version equivalence. Establishes no fingerprint, digest, commitment, or identity value derived from a scope. Adds ten Failure and Conflict Handling rows applicable under both profiles, none of which produces **Deferred** or **Approved**. **Scope of modification, stated precisely:** the amendment deletes, narrows, rewords, and withdraws no existing rule, row, bullet, or clause, and does not edit the `# Policy Evaluation` section; it does add a Mission-applicability precondition to evaluation gating and ten Escalation Required failure mappings, both of which are additive changes to gating and failure semantics, while Policy Criterion evaluation semantics, the four Governance Decision values, the Mixed-Result Decision Table, and every existing failure row remain unchanged. **RFC-0001 is not amended**; exact RFC-0001 Mission identities are declared and no Mission concept, lifecycle, or resolution rule is defined here. **RFC-0003 is not amended**; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it, and this section declares only the schema-owned record, field order, and ordering that NCCS-1 rule 5 delegates. **`NEXUS-RAT-2026-07-18-007` is not amended**; neither authorized Governance Evaluation Input Profile gains, loses, or alters any field, and the authorized profile set remains exactly two. **`NEXUS-RAT-2026-07-15-017` is not amended**; it retains sole authority over validating a Repository Policy version's Ratification reference and over its three closed outcomes, Mission Applicability Scope is a separate independent dimension that neither participates in nor substitutes for that validation, and attribution validation neither produces nor consumes a scope. **`NEXUS-RAT-2026-07-31-001` is not amended**; no field is added to or reserved in the `nexus-ratification-authority-snapshot/2` schema, no Snapshot is issued, no authority root is pinned, and every deferral it declared remains in force, with authorized-subject attestations deferred in every form — no field, no collection, no subject-kind union, no placeholder, and no dormant extraction path. **Corpus Readiness Acceptance Evaluation is not revised**; Acceptance Semantics, Current Projection Applicability Selection rules 1 through 10, the "Historical validity is not current applicability" rule, and External Authoritative Applicability and Recording are unchanged. The scope is Repository Policy data, not an attestation of an authorized subject; the only subject recognized is the Mission, and Repository Policy authority over any other subject remains unestablished. Specification text only; implementation requires separate Sprint scope ratification.
- v1.5 (2026-08-03) — Amended by `NEXUS-RAT-2026-08-03-001` to establish the Governed Repository Policy Corpus Source Contract as a new binding section, stated completely enough to be implemented from this specification alone. Closes the gap that v1.4 left open: the specification required throughout that Policy Evaluation apply "the applicable Repository Policy version" while defining no source, extraction rule, or completeness guarantee by which the population of Repository Policy versions is enumerated, so that two assemblers could legitimately produce different candidate collections from the same governed inputs and a fingerprint over one collection could detect mutation of the recorded list without detecting omission relative to the universe it was drawn from. Establishes: the named source authority `nexus-repository-ratification-ledger`, justified by the existing requirement that a Repository Policy originate only from an approved Ratification, so that the universe of Repository Policy versions is exactly the population governed Ratification octets declare rather than an external population an assembler samples; an exact governed octet-sequence input domain admitting exactly one declared carrier and no caller-supplied record or applicability fact through any parameter, field, or channel; consumption, unamended, of the already-ratified Governed Source Text Preparation, Fenced Regions, and Governed Entry Extraction Grammar, which state how governed octets are read and are not Snapshot schema; the optional `## Repository Policy Declarations` section, whose absence from an entry declares no Policy version and is expressly not a defect; the complete fixed policy declaration block grammar with significant indentation, fixed line order within a policy element, and exact tokens for identity, version, predecessor, the three scope forms `RepositoryWide`, `MissionSet`, and `ScopeUndeclared`, content section, content commitment, and criterion profile declaration; linear lineage validation requiring an initial version of exactly 1 declaring no predecessor, every other version declaring exactly its immediate predecessor, that predecessor itself declared, and no duplicate `(policyIdentity, policyVersion)` pair, from which competing successors are structurally inexpressible rather than merely rejected, and from which exactly one current lineage head per Policy identity is derived and never declared; separate enumeration and separate commitment of the complete preserved history and the current-head universe used for new candidate enumeration, so that an ordinary supersession does not present two simultaneous candidates, with a `ScopeUndeclared` version remaining a current head only while it is the head and being preserved rather than migrated once superseded; a per-version content commitment recomputed from the named content section of the same entry in the pinned prepared source and rejected on mismatch, computed over an explicitly defined prepared section text comprising the section heading and every body line without exception, including empty lines and body lines consisting of exactly three hyphens, expressly not over the filtered content-line projection that governs an entry’s required source fields, so that changed Policy content under an unchanged declaration is detected by assembly itself rather than trusted from a declarant; a self-referential content section refused as the fixed-point problem it would create; and a terminal content section refused, because an entry runs to the next entry boundary and a terminal section would otherwise absorb the separator lines of a later append and silently change a previously committed digest; two distinct source facts, a stable `corpusSourceIdentity` and a revision-sensitive `corpusSourceRevision` computed over prepared text; the fixed protocol constants; the complete fixed NCCS-1 schemas and field order for the Policy Criterion declaration, the corpus record, the corpus root basis, and the corpus envelope commitment basis, with the predecessor and scope fields expressed as ordered collections of zero or one element under exact coupling rules; three commitment layers, of which the assembler- and time-independent corpus root is derived from governed octets alone and binds both fingerprint collections so that the current-head derivation cannot vary under an unchanged root, while the envelope commitment binds the capture instant and producing attribution, and none of which may be recorded inside the source it commits to; exactly two declared assembly facts, consumed unamended; explicit deterministic ordering for entries, blocks, policy declarations, records, criteria, missions, current heads, and both fingerprint collections; an exact completeness argument closing omission, injection, changed content under an unchanged declaration, and a governed Ratification authorizing no Repository Policy, each decided from the pinned governed source rather than from an assembler's assertion; an explicitly empty bootstrap corpus, preferred to an inferred one, with importation of any implementation object, test fixture, in-memory repository content, unratified file, or prose description prohibited, and append and supersession stated as governance actions over an append-only source; and a total `Assembled | Rejected` result contract carrying a closed forty-five-code public vocabulary across six ordered governed execution phases ranked 0 through 5, together with a seventh `ContractViolation` partition at rank 6 that is not a governed outcome, nine exact discriminated payload variants each carrying `payloadKind` as its first field, including ordinal payloads that name a `policy` element, a `criterion` group, or a `mission` line by deterministic traversal position so that a malformed or empty identity is still reported at its exact target rather than collapsed to its containing entry, with Policy-identity and criterion-identity grammar defects separately named and every identity- and version-bearing payload declared only for codes that run after those grammars are established, and three unreachable contract-violation classifications, with precedence total by phase rank then normative within-phase code order applied code-major over the declared traversal order. Declaration parsing is total by construction: two grammar levels partition every block body line, every block-level line that is not the format line, the terminal block terminator, or a policy opener is classified by the block-scoped code carrying the entry payload, every element-level line is classified by the element-scoped code carrying a populable policy ordinal, and the element grammar admits zero criterion groups so that a well-delimited policy element declaring none is reported by the distinct criterion-count code rather than consumed by the grammar code, leaving every declared public diagnostic reachable. Requires two structurally independent implementations agreeing on the complete public result. Declares the schema version `nexus-repository-policy-corpus/1` and its non-comparability with `nexus-ratification-authority-snapshot/2`. **Scope of modification, stated precisely:** the amendment adds text and deletes, narrows, rewords, and withdraws no existing rule, row, bullet, or clause; no existing section is edited except the version line, the provenance paragraph, the two owned-concept lists, the final Conformance bullet's containing line, and this history. **RFC-0001 is not amended.** **RFC-0003 is not amended**; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it, and this section declares only the schema-owned records, field order, and ordering that NCCS-1 rule 5 delegates. **`NEXUS-RAT-2026-07-31-001` is not amended**; no field is added to, reserved in, reinterpreted within, or read from `nexus-ratification-authority-snapshot/2`, no Snapshot is issued, no authority root is pinned, the Snapshot is expressly not the Repository Policy corpus and SHALL NOT be read or extended as one, and its deferral of automatic Ratification-Ledger ingestion beyond its own source contract is neither narrowed nor excepted. **`NEXUS-RAT-2026-07-15-017` is not amended**; it retains sole authority over resolving a Repository Policy version's Ratification reference and over its three closed outcomes, and corpus assembly produces none of them and consumes none of them: the corpus states what the governed source declares and is expressly not evidence that a declared version is authorized. **`NEXUS-RAT-2026-08-02-002` is not amended**; the `MissionApplicabilityScope` record and its closed two-variant union are consumed exactly as ratified, no third variant is declared, no field is added, and the Legacy Versions and Migration rules remain in force with no `ScopeUndeclared` version mutated, back-filled, annotated, or repaired. **`NEXUS-RAT-2026-07-18-007` is not amended**; neither authorized profile gains, loses, or alters any field, the authorized profile set remains exactly two, and carrying a profile identifier as declared Policy Criterion data is not evaluation and does not activate the dormant profile. **Corpus Readiness Acceptance Evaluation is not revised.** No Repository Policy selection rule, eligibility predicate, cardinality rule, attribution precedence rule, or Governance Decision recording shape is introduced, and no Governance Decision value, Escalation category, or Policy Evaluation mechanism is introduced or modified. Specification text only; the corpus is empty at application, no corpus artifact is issued, no root is pinned, and implementation requires separate Sprint scope ratification.
- v1.6 (2026-08-04) — Amended by `NEXUS-RAT-2026-08-04-001` to carry the governed Ratification subject into the Ratification Authority Record and to allocate the resulting canonical record encoding a new schema version, in support of the Ratification Authority Snapshot Consumption Correspondence that ratification establishes in the Ratification Ledger. Adds exactly one field, `ratificationSubject`, to both arms of `LifecycleAuthorityRecord`, positioned after `ratificationDate` so that the record carries identifier, date, and subject in the order `NEXUS-RAT-2026-07-15-017` declares them, and defines its extraction as the content lines of the already-required `## Subject` section joined by a single `LF`, carried verbatim. No section becomes required that was not already required, no new failure code is introduced, and `missing-subject` continues to fail closed in the `EntryStructure` phase exactly as before. The field is governed evidence carried without interpretation: issuance neither reads nor normalizes it and resolves no lifecycle from it. Because both arms encode differently, every record fingerprint, authority root, and envelope commitment derived under the amended schema differs from the value the same governed octets would have yielded before, so the schema version identifier advances from `nexus-ratification-authority-snapshot/2` to `nexus-ratification-authority-snapshot/3`. **A schema version identifier names an exact canonical encoding and is therefore an encoding compatibility boundary**: the amendment states that rule normatively, requires a new identifier for any future encoding change whether or not artifacts exist, and requires a consumer to decide readability from `snapshotSchemaVersion` alone rather than by attempting to decode. Version 3 is declared totally incompatible with version 2 and with version 1, with no fingerprint, root, or commitment comparable across versions even from byte-identical governed octets, and migration of any version 1 or version 2 artifact requires separate ratification. No production artifact has been issued under any version, so nothing is migrated, rewritten, or invalidated; that fact removes migration cost and is expressly not the reason the boundary exists. Four schema-identifier citations elsewhere in this specification are updated to `/3` so that the prohibitions and distinctness statements carrying them continue to bind the live schema. **`NEXUS-RAT-2026-07-15-017` is not amended**; its binding `RatificationAuthorityRecord` field rule — identifier, date, and subject as recorded in the authority source, with no field inferred from prose, intent, or Builder assumption — is satisfied exactly, and all ten conditions of its Required Outcome Mapping remain in force. The Total Result Contract's `Issued` result schema is completed rather than changed: the three counts it already required — `declarationCount`, `genericCount`, `segmentedCount` — are given their exact derivation from the issued records, the listed fields are stated to be exactly the fields of an `Issued` result with a missing or unrecognized field rejected rather than ignored, and it is stated normatively that the commitment layers bind none of that shape, so a reader establishes it structurally and never infers it from a matching root or envelope commitment. No count is added, renamed, or removed, and no previously conforming result becomes non-conforming: the derivations are the only ones consistent with the field names and with the partition the record union already fixes. **`NEXUS-RAT-2026-07-31-001` is amended in exactly three respects**: the record schema gains `ratificationSubject`, the schema version identifier advances to `/3`, and the `Issued` result shape and its three counts are stated exactly. Its ownership boundary, input domain, preparation rules, grammars, generic source rule, declaration contract, two graphs, commitment layers, declared issuance facts, ordering rules, diagnostic vocabulary, phase model, and total result contract are otherwise unchanged, and every deferral it declared, including the entire deferral of authorized-subject attestations in every form, remains in force. `ratificationSubject` is the governed **entry subject** and is not an authorized-subject attestation, declares no subject kind, and opens no extraction path for one. **`NEXUS-RAT-2026-08-03-001` is amended in exactly one respect**: three schema-identifier citations within Repository Policy Corpus Source advance from `/2` to `/3`. No rule, field, grammar, ordering, commitment, diagnostic, or output of that section changes, and the corpus schema version `nexus-repository-policy-corpus/1` is untouched. **`NEXUS-RAT-2026-07-16-001` is not amended**; the Ratification Authority Snapshot fingerprint remains derived and owned by `RatificationAttributionValidation`. **RFC-0003 is not amended**; NCCS-1 is consumed exactly as defined. No Governance Decision value, Escalation category, Policy Evaluation mechanism, Policy Criterion predicate, or Governance Evaluation Input Profile is introduced or modified. Specification text only; implementation requires separate Sprint scope ratification.
- v1.7 (2026-08-04) — Amended by `NEXUS-RAT-2026-08-02-001` to establish Repository Policy Selection and Version Binding as a new binding section, placed between Repository Policy Corpus Source and Policy Evaluation because it consumes the former and precedes the latter. Defines the deterministic determination of which single ratified Repository Policy version is applicable to exactly one Mission and exactly one declared Governance Evaluation Input Profile instance, and the exact binding of that version into the resulting Governance Decision. Establishes a three-stage model with total precedence — Candidate Set Assembly, Attribution Validation, Selection — in which Policy Evaluation follows Stage 3 and begins only on a `Resolved` outcome. Names the Candidate Set Assembly Authority as the producer of the candidate collection and fixes that collection as exactly the current-head universe of one assembled Repository Policy Corpus that reported `Assembled`, pinned by its `corpusSourceIdentity`, `corpusSourceRevision`, and `corpusRoot` as ratified by `NEXUS-RAT-2026-08-03-001`. **Assembly applies no filter**: every current head is assembled unconditionally, and a current head whose authorizing Ratification identifier is absent from or unrecognised by the pinned Snapshot is assembled like any other, because filtering it would both destroy completeness and usurp `RatificationAttributionValidation`, which alone determines whether such a Ratification is `Valid`, `Invalid`, or `Unresolvable`. Establishes, as a distinct consumer-side role, the **Selection Verification Authority** and a mandatory seven-step **Pre-Use Verification** path that must succeed in full before a bound reference is used for any purpose: pin the governed source by requiring an obtainable source whose prepared-text digest equals the recorded `corpusSourceRevision`; re-derive the corpus and require `Assembled`; re-derive the corpus root and require equality with the recorded root; recompute each candidate's corpus record fingerprint from its carried record and require the resulting multiset to equal exactly the re-derived current-head fingerprint multiset, reporting an injected, non-head, or omitted candidate by its exact pair; re-validate every attribution outcome through `RatificationAttributionValidation` against the verified issued Ratification Authority Snapshot artifact supplied as a required input, whose schema version is required to equal the recorded one and whose recomputed envelope commitment is required to equal the recorded pin, with no substitution and no re-issued equivalent permitted, and require equality with the recorded outcome; require, additionally and as normative conditions of that same step, that the verified artifact's own `envelope.authoritySourceIdentity` and `envelope.authoritySourceRevision` equal the recorded authority source identity and authority source revision of fields 7 and 8, octet for octet, reporting a divergence by naming both values — comparisons the verification chain does not perform, because the pin it accepts carries only the schema version and the envelope commitment, and which are therefore established at this step or nowhere; recompute the candidate-set fingerprint; and recompute the selection outcome and every selected field. **Self-consistency is expressly not authenticity.** The specification states, normatively, that recomputing a fingerprint over a reference's own recorded fields establishes only internal consistency, that a party altering the candidate collection, an attribution outcome, or the selection outcome and then recomputing produces an equally self-consistent artifact, and that no claim is made anywhere that hashing a recorded corpus root beside a recorded candidate list proves that list to be the root's current-head projection; no derivation from a recorded root to a recorded list is defined or asserted. An implementation performing only the two recomputation steps and omitting re-derivation expressly does not conform. Determinism is restated as resting on **pinning rather than on refusing to read**: the corpus read is fixed by prepared-text digest and the supplied Snapshot artifact is fixed by envelope commitment, so two verifiers obtain the same corpus and verify the same Snapshot artifact or fail closed, and the prior contract's blanket prohibition on evaluation-time reads is withdrawn as having been unable to distinguish a genuine reference from a consistently re-fingerprinted forgery. Establishes **Historical Version Non-Revival**: a superseded Repository Policy version is preserved history, remains the version of record for every Decision that cited it, and SHALL NOT be assembled as a candidate under any circumstance — in particular SHALL NOT be assembled, substituted, promoted, fallen back to, or descended to because its identity's current head is `Invalid`, `Unresolvable`, `ScopeUndeclared`, internally inconsistent, ineligible, or such that excluding it would leave no eligible candidate. There is no lineage walk: exactly one version per Policy identity is ever examined. A candidate collection containing a non-head version, or omitting a declared head, fails at Verification Step 4 as a candidate-set divergence naming the exact pair and divergence kind, before any eligibility or cardinality assessment, and is never reported as an eligibility failure. Introduces the immutable `RepositoryPolicySelectionReference` — fifteen fields in fixed order: Mission identity, declared input profile kind, pinned corpus source identity, corpus source revision, and corpus root, pinned authority snapshot schema version, authority source identity, authority source revision, and authority snapshot envelope commitment, ordered candidate policy references, candidate-set fingerprint, a closed four-value `selectionOutcome` (`Resolved | NoCandidate | Ambiguous | Unresolvable`), and the selected identity, version, and authorizing Ratification identifier present exactly when the outcome is `Resolved` — and a deliberately minimal three-field Candidate Policy Reference record carrying the complete ratified `RepositoryPolicyCorpusRecord` **verbatim and unaltered**, a `corpusRecordFingerprint` recomputed from that record rather than copied, and an `attributionValidationOutcome` produced by the sole attribution authority and re-validated against the pinned Snapshot. Each of the three has exactly one producer and one transformation, stated identically in the schema, the assembly rules, the traceability table, this history, and the vectors. No derived projection is stored: declared profile kinds are evaluated directly against the carried record's `criterionDeclarations`, and the earlier `declaredProfileKinds` collection and `policyVersionExistence` enumeration are both withdrawn — the former because a stored derivation may diverge from the record it derives from, the latter because a value recorded by the same party that recorded the collection cannot establish that collection's membership in a universe defined elsewhere. Current-head membership is accordingly no longer an eligibility conjunct but a property of the collection, established against the re-derived corpus. Defines a four-conjunct Eligibility Predicate over authoritative inputs: a re-validated `Valid` attribution outcome; a Policy Criterion declaration in the carried record whose Governance Evaluation Input Profile is the declared kind; a `Declared` scope declaration state; and satisfaction of the ratified Mission applicability predicate by the carried declared scope. Establishes one total mapping distinguishing candidate indeterminacy from determinate exclusion: an `Unresolvable` re-validated attribution outcome and an internally inconsistent carried record each make the candidate indeterminate and the whole selection `Unresolvable` before eligibility and cardinality are assessed, one such candidate being sufficient even where another is otherwise eligible; whereas an `Invalid` re-validated outcome is a determinately known negative that renders only that candidate ineligible and never produces `Unresolvable`. The exact underlying attribution result is preserved and reported in both cases, neither case revives a predecessor, and neither is anticipated by filtering during assembly. Establishes the complete and exclusive reconciliation of `ScopeUndeclared` candidates: such a current head is assembled so the candidate set stays verifiable against the re-derived current-head universe, is ineligible, is never bound and therefore never referenced by an evaluation, yields `NoCandidate` and **Escalation Required** where no candidate is eligible, does not by itself produce `Unresolvable` or `Ambiguous` where an eligible candidate exists, is never mutated, back-filled, annotated, or repaired, and never causes an earlier explicitly scoped version of the same identity to be assembled or selected. Defines ten Selection Rules applied in total precedence order after verification has succeeded in full, such that candidate-level validity strictly precedes eligibility and cardinality, making `Resolved` and `Unresolvable` mutually exclusive by construction, and restricting evaluation-time reads to exactly the two pinned reads verification requires. No eligible candidate resolves to `NoCandidate` → **Escalation Required**, explicitly never **Deferred**, because a Repository Policy arises only through Ratification and never through normal engineering progression. Two or more eligible candidates resolve to `Ambiguous` → **Escalation Required**, failing closed on all multiplicity whether or not the candidates' Policy Criteria contradict one another and without preferring `RepositoryWide` over `MissionSet`, the reverse, or a higher version over a lower; because candidates are current heads, that multiplicity arises from distinct Policy identities and never from two versions of one identity, and the existing Authority Hierarchy rule on contradictory applicable Policies is a narrower subset of it and remains in force, unmodified. Declares the complete canonical encoding this schema owes NCCS-1 rule 5: the Candidate Ordering Comparator over the carried record's Policy identity alone, compared in length-prefixed encoded form, which is total because the current-head universe holds at most one entry per identity and which makes two versions of one identity structurally inexpressible in a candidate collection; the uniqueness declaration and duplicate fail-closed policy; the empty-set encoding; the three-field Candidate Policy Reference record; the ten-field Candidate Set record encoded in ascending field-name order, matching the ratified corpus contract's convention for commitment-basis records; the SHA-256 hash representation; an explicit statement of what the candidate-set fingerprint does and does not establish; and the additional fail-closed conditions, including a corpus record fingerprint that does not equal the digest of the record it accompanies. Establishes exact version binding in both directions: one identity and one version per Decision, immutable for that Decision's life, never substituted, rebased, refreshed, or upgraded after binding, never retroactively rebound by a later version or a later version's scope, and never becoming applicable again to a new evaluation once superseded. Adds twenty-five Failure and Conflict Handling rows applicable under both profiles, none of which produces **Deferred** or **Approved**, and states that a reference satisfying every recomputation while failing any re-derivation step is a forged or stale reference rather than a valid one. States that a `RepositoryPolicySelectionReference` pins the authority snapshot envelope commitment and SHALL NOT be described, encoded, or recorded as carrying a Ratification Authority Snapshot fingerprint, while the fingerprint that `NEXUS-RAT-2026-07-16-001` requires continues to be produced by `RatificationAttributionValidation` and recorded in escalation attribution and the complete deterministic input exactly as that ratification provides. Makes the Governance Decision recording contract conditional on the selection outcome: a `Resolved` outcome records the bound and applied Repository Policy identity and version together with the evaluated Policy Criteria and their results, exactly as before; a `NoCandidate`, `Ambiguous`, or `Unresolvable` outcome records the complete selection reference and the exact failing condition while carrying no selected, bound, or applied Repository Policy identity or version, no Policy Criteria results, and no superseded version as a substitute, and is never described or reported as having applied or evaluated a Repository Policy version. Amends the `Escalation Required` required inputs and precondition accordingly, so that a Governance Decision arising from an unresolved selection is satisfiable, the absence of an applicable Repository Policy version being itself the recorded obstruction; the `Approved`, `Rejected`, and `Deferred` Decision values are unchanged. The amendment is additive in the precise sense that no existing rule, row, bullet, or clause is deleted, narrowed, or withdrawn; it does add a mandatory selection-and-verification precondition to Policy Evaluation, make the Governance Decision recording contract conditional, and widen the `Escalation Required` required inputs and precondition, and Policy Criterion evaluation semantics are unchanged. The version 3 record encoding is consumed exactly as `NEXUS-RAT-2026-08-04-001` establishes it, including its declaration that a schema version identifier names an exact canonical encoding and is therefore an encoding compatibility boundary; the recorded `authoritySnapshotSchemaVersion` is exactly `nexus-ratification-authority-snapshot/3`, an artifact declaring any other version is refused before a record is read, and no version 1 or version 2 artifact can satisfy Verification Step 5. Which Required Outcome Mapping conditions a conforming version 3 artifact can present is likewise recorded rather than assumed: structurally malformed record, unknown lifecycle status, duplicate identifier, and contradictory record are each unreachable through this path, each by a stated mechanism, and each remains unamended and binding on every other path. An earlier revision published a vector requiring an out-of-set lifecycle status to survive into the consumed state, which the record encoding refuses; that vector is withdrawn. **`NEXUS-RAT-2026-08-04-001` is not amended**; the Ratification Authority Snapshot Consumption Correspondence is a prerequisite of this amendment in two independent senses — it owns contracts Verification Step 5 invokes, and its own RFC-0011 amendment produces the v1.6 baseline this amendment is anchored against — and is consumed exactly as ratified. It owns the supplied-artifact verification chain V1 through V9, the canonical consumed order, the total transformation from a verified version 3 artifact to the Snapshot state `RatificationAttributionValidation` consults, the field-by-field provenance of every consumed field including the governed `ratificationSubject` it carries into the version 3 record, the preservation of missing, duplicate, unknown-status, and structural-completeness semantics, and the refusal of any artifact carrying a `SegmentedLifecycle` record; Verification Step 5 invokes all of these and defines, weakens, or excepts no part of any of them. Verification accordingly requires the complete ratified `Issued` result shape before any recomputation — refusing a missing field and refusing an unrecognized field rather than ignoring it, at the result, the `envelope`, and the `producingAttribution` — recomputes every record fingerprint from the record actually supplied, compares the order-insensitive fingerprint collection, recomputes the authority root and the envelope commitment, **re-derives the record collection, the authority root, and all three result counts from the governed source octets the artifact's `authoritySourceRevision` names, rerunning issuance with exactly the artifact's own declared `capturedAt` and `producingAttribution` and substituting neither, and requires each re-derived value to match**, and accepts nothing supplied as authority. That the counts must be established structurally and re-derived rather than inferred is itself a consequence the prerequisite states normatively: no result count, and no framing of the result as a whole, enters either commitment basis, so a correct root and a correct commitment establish nothing about the shape of what carries them. Two earlier revisions are withdrawn: one compared only a recomputed envelope commitment against the recorded pin, and so would have admitted a genuine envelope presented alongside altered records; the other added per-record recomputation but stopped there, establishing only self-consistency and equality with a pin carried on the mutable reference itself, both of which are reproducible by whoever wrote the artifact. Governed-source re-derivation is the external-authority anchor that closes that gap, and it is mandatory: every Ratification Authority Record consulted is a record the governed source at the pinned revision actually yields, so no attribution outcome can be produced that the governed Ratification Ledger does not support. A normative vector exhibits a wholly self-consistent forged artifact, with a matching forged selection reference, that passes every recomputation step and is refused at re-derivation; had it been consumed it would have reported a superseded Ratification as valid. Re-derivation does not make the envelope commitment pin redundant and the pin does not make re-derivation redundant: two issuances of the same governed octets share an authority root and differ in envelope commitment, so the pin narrows the supplied object to one commitment-equivalence class while re-derivation establishes that its records are governed, and both are required. What re-derivation does not establish is stated with it — the declared capture instant and producing attribution are not re-derivable, are fixed by the pin against substitution only, and are inputs to no attribution outcome. Where the governed source is not obtainable at the pinned revision, verification fails closed, with no fallback to the supplied artifact, no most-recent-source substitution, and no degradation to the recomputation-only chain. The consumed record order is derived from that committed fingerprint collection rather than from the artifact's declared record order, which is accordingly inert, and an earlier revision that preserved supplied order — under which two artifacts sharing a root and a commitment could yield different consumed states — is withdrawn. Normative end-to-end vectors carry an verified issued artifact through the chain, the correspondence, and the sole validation authority, reproducing every published attribution outcome unchanged, and exhibit that two artifacts differing only in producing attribution produce the identical consumed state while differing in envelope commitment — so no fingerprint over that state could have served as the artifact pin, while pinning the artifact fixes the consumed state and therefore any fingerprint derived over it. No rendering of the Ratification Authority Snapshot fingerprint is published or ratified here, because its derivation is owned by `RatificationAttributionValidation` and ratifying an octet length or digest of it would constrain that derivation in fact; an earlier revision that published such renderings as normative evidence is withdrawn. **`NEXUS-RAT-2026-08-03-001` is not amended**; the Repository Policy Corpus Source contract is consumed exactly as ratified, its records are carried verbatim, its assembly is invoked rather than restated, and selection enumerates no corpus, declares no corpus record, derives no current head of its own authority, computes or verifies no content commitment, issues no corpus artifact, populates no corpus, and adds no field to any corpus schema. **`NEXUS-RAT-2026-08-02-002` is not amended**; Mission Applicability Scope retains sole ownership of the scope, its closed union, its predicate, its Mission Ordering Comparator, and its canonical encoding, selection declares no scope and alters none, establishes no scope fingerprint, and authorizes no migration of a `ScopeUndeclared` version. **`NEXUS-RAT-2026-07-18-007` is not amended**; the `RepositoryPolicySelectionReference` is the output of the governed selection process and a bound component of the Policy Evaluation request, is not a field of either authorized profile, `ReviewGovernanceEvaluationInput` retains its v1.1 semantics, required inputs, failure handling, and wire contract exactly, `CorpusReadinessAcceptanceEvaluationInput` retains its exact field list and remains DORMANT, carrying a profile identifier as declared Policy Criterion data is not evaluation and does not activate the dormant profile, and the authorized profile set remains exactly two. **`NEXUS-RAT-2026-07-15-017` is not amended**; it retains sole authority over Ratification reference resolution and over its three closed outcomes, selection never produces one, and Pre-Use Verification invokes that authority rather than reimplementing, anticipating, or substituting for it. **`NEXUS-RAT-2026-07-16-001` is not amended**; its requirement that escalation attribution record, and that the complete deterministic input to a Governance Decision include, the Ratification Authority Snapshot fingerprint continues to be discharged by the existing mechanism, unchanged: that fingerprint is derived by `RatificationAttributionValidation` from the Snapshot state it consults and is consumed by escalation attribution and by the Governance Decision evaluation key. This amendment does not derive, record, rename, or replace it, and introduces no value that stands in for it. The `authoritySnapshotEnvelopeCommitment` recorded on a selection reference is a **different value** with a different input domain, derivation, representation, owner, and consumer; the specification states that distinction explicitly and asserts no equivalence between the two. No obligation of this ratification is deleted, narrowed, superseded, or excepted; no second or alternative evaluation key is introduced; and no existing persisted decision, evaluation key, or diagnostic is read, rewritten, or invalidated, since every `RepositoryPolicySelectionReference` is created under this section and none precedes it. **`NEXUS-RAT-2026-07-31-001` is amended in exactly one respect**: its deferral of *consuming a Snapshot in governance evaluation* is closed to the exact extent of Verification Step 5 of Repository Policy Selection, and to no greater extent, because that step makes governance-time consumption of an issued artifact architecturally mandatory and the deferral therefore cannot be described as intact. Every other deferral of that ratification is preserved verbatim and each is dispositioned individually in the ratification entry — production Snapshot issuance, authority-root pinning, version 1 migration, authorized-subject attestations in every form, attestation extraction and attestation-backed authority, legacy attestation migration, automatic Ledger ingestion beyond its source contract, and implementation or Sprint activation. Its Authorized Scope, Ownership Model, schemas, protocol constants, commitment layers, diagnostic vocabulary, and result contract are unchanged. Snapshot issuance remains governed solely by it, no Snapshot is issued here, nothing is added to, reserved in, or reinterpreted within the `nexus-ratification-authority-snapshot/3` schema, and a supplied Snapshot artifact is accepted only when its recomputed envelope commitment equals the exact pinned value, never re-issued, substituted, or accepted as a root-equivalent. Where an issued artifact is stored, who serves it, and how a commitment is resolved to it are established nowhere in this amendment and remain deferred in full; the recorded source identity and source revision name the governed source the artifact was issued from, are required by an explicit normative condition of Verification Step 5 to equal the verified artifact's own envelope facts octet for octet, and expressly do **not** locate an issuance — a claim to the contrary is made nowhere in the amendment, including in its normative Traceability tables. An earlier revision asserted that equality in prose, in the Traceability table, and in the Amendment History without any normative step performing it, so a caller could alter either recorded fact on an otherwise self-consistent reference, recompute the candidate-set fingerprint and the recorded outcomes, and pass every stated step while the immutable reference recorded a lineage the verified artifact does not carry; that omission is **corrected**, the comparison is now a stated condition of the step with its own two Failure and Conflict Handling rows, and vectors exhibit one altered reference for each field. The reference pins that ratification's **envelope commitment** — the commitment layer it defines as binding the authority root, both source facts, the canonical serialization protocol identifier, the capture instant, the producing attribution, the record count, and the snapshot schema version, and, through the authority root, the order-insensitive record fingerprint collection. That commitment establishes **commitment-equivalence** over exactly those fields and that collection; it does **not** identify a unique artifact or a unique issuance event, because two distinct issuances declaring identical basis facts produce the same commitment, and it binds neither wire framing, nor the artifact's declared record order, nor the three result counts. Commitment-equivalence is sufficient and is what this contract relies on: the canonical consumed order makes supplied order inert, the result shape is fixed structurally, and the counts are re-derived, so commitment-equivalent objects yield the identical consumed state. Every unique-artifact, unique-issuance, and complete-issued-state claim made in an earlier revision of this draft is **withdrawn**, and the specification carries a table of precisely the bound and unbound fields. The reference pins the envelope commitment because attribution validation's result depends on the artifact consulted and root equivalence is therefore strictly weaker than the commitment-equivalence that determines the consumed state; the authority root is deliberately **not** the pinned value, and an earlier revision of this draft that pinned it and directed the verifier to re-issue is withdrawn. The correspondence between an issued version 3 artifact and the record collection attribution validation consults is **not** deferred by this amendment and is **not** defined by it: it is ratified separately and in advance by `NEXUS-RAT-2026-08-04-001`, which this amendment consumes exactly as ratified, and application is gated on that prerequisite already being present in the Ledger. Two dependencies remain and approval discharges neither, and neither is silently assumed by any vector: production Snapshot issuance, which stays deferred, so that no conforming selection reference can be produced until it is separately authorized; and Segmented Lifecycle Scope Selection, the rule determining which governed scope of a segmented record a scope-free Ratification reference resolves against, which belongs to the authorities that own scope and resolution and which this amendment neither supplies nor works around. Because the governed corpus presently carries declarations in segmented form, an artifact issued from it is refused at Verification Step 5 and no conforming reference can be produced against it until that rule is separately ratified; the consequence is stated in the binding text and exhibited by vector SV6 rather than concealed. An earlier revision instead mapped a segmented record's divergent scoped statuses onto a status collection and reported it as a contradictory record, which made the validation authority assert a defect the issuance authority denies; that treatment is withdrawn in full. Its prohibition on recording a root, envelope commitment, or record fingerprint **inside the governed source they are derived from** is unaffected: a selection reference is not that source. The `ratificationSubject` field of the version 3 record is added by `NEXUS-RAT-2026-08-04-001` and not by this amendment, which neither alters nor reads it. Its declaration that schema version 2 is totally incompatible with version 1, and that migrating any version 1 artifact requires separate ratification, is neither discharged, narrowed, nor extended here. Every deferral it declared other than the single one dispositioned above remains in force, with authorized-subject attestations deferred in every form — no field, no collection, no subject-kind union, no placeholder, and no dormant extraction path. **Corpus Readiness Acceptance Evaluation is not revised**; Acceptance Semantics, Current Projection Applicability Selection, the "Historical validity is not current applicability" rule, and External Authoritative Applicability and Recording are unchanged, and the Corpus Readiness Acceptance Repository Policy retains sole ownership of its current-Projection selector. **RFC-0001 is not amended**; Mission identity is consumed by identity only. **RFC-0003 is not amended**; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it, and this section declares only the schema-owned ordering that NCCS-1 rule 5 delegates. Any separately issued, signed, or otherwise authenticated selection artifact that would permit re-derivation to be omitted is expressly deferred to its own future ratification. No Governance Decision value, Escalation category, Policy Criterion predicate, or Governance Evaluation Input Profile is introduced or modified. No Repository Policy authority over any subject other than the Mission is established. Specification text only; implementation requires separate Sprint scope ratification.
- v1.8 (2026-08-05) — Amended by `NEXUS-RAT-2026-08-05-001` to establish **Segmented Lifecycle Scope Selection**, discharging Dependency DEP2 of `NEXUS-RAT-2026-08-02-001` as to scope-free Ratification references. Fixes, deterministically and fail-closed, what a scope-free reference resolves to when it matches a **structurally valid, recognized-status, noncontradictory** record whose `lifecycleResolutionForm` is `SegmentedLifecycle`: **`Unresolvable`**, with the exact diagnostic `unresolvable-scope-free-reference-to-segmented-record`. **The new condition is genuinely additive, and its position in precedence is what makes it so.** It is inserted into **matched-record evaluation alone** — the sub-order that runs after the validation authority's pre-existing malformed-Ratification-reference and Snapshot-source-unavailable preconditions have succeeded, neither of which is defined, reordered, narrowed, or amended here — and within that sub-order it is evaluated only after every pre-existing validity condition has been applied unchanged and in its existing order, so that matched-record evaluation reads: no matching record; duplicate identifier; structural completeness; unknown lifecycle status; contradiction under the existing meaning of that term; **scope-free reference to a structurally valid, recognized-status, noncontradictory `SegmentedLifecycle` record**; then the lifecycle status mapping. A segmented record that is structurally malformed therefore remains `Invalid`, one carrying an unrecognized lifecycle status remains `Unresolvable` under the pre-existing unknown-status condition, and one that is contradictory remains `Invalid`, each with its own pre-existing diagnostic and none rerouted to the new one. Those three conditions are **not reachable through a conforming version 3 artifact**, which refuses such a record at V3 as `record-not-encodable` before any consumed state exists; they are preserved as obligations of the validation authority over a consumed state on every other path, and are stated as such rather than as consumption obligations of the supplied-artifact path. An earlier revision of this amendment placed the new condition ahead of those three and asserted that no segment status is read on any path; that placement overrode pre-existing conditions for segmented records while claiming to add to them, and both it and that assertion are **withdrawn**. The correct invariant is narrower and is stated normatively: **no segment status participates in scope selection, preference, aggregation, or the final lifecycle-status mapping once the pre-existing validity conditions have passed.** Divergent statuses across distinct valid segments remain noncontradictory exactly as `NEXUS-RAT-2026-08-04-001` already ratified, and such a record is never reported as `invalid-contradictory-record`. Where the new condition is reached, no segment is selected, preferred, aggregated, flattened, ranked, or arbitrated among, and neither the reserved `residual` segment nor any `GovernedScope` segment is privileged. Residual-resolution was considered and **rejected**: structural completeness proves that the encoding covers the whole record, not that an identifier-only reference names the residual scope, and the live governed corpus exhibits both unsafe directions — an `Effective` governed segment beneath a `Superseded` residual, where residual-resolution under-grants, and `Superseded` governed segments beneath an `Effective` residual, where it would validate a reference whose authority may have derived from a superseded clause. Because the reference carries no selector, no validator can distinguish these from the reference alone, so any selection would be semantic inference from prose that issuance is forbidden to perform and would breach the no-default rule of `NEXUS-RAT-2026-07-15-017` and Canon 12. `Unresolvable` is the only determinate outcome that is not inferred. The amendment separates two defects that the prior text conflated. The **artifact-level refusal** established by `NEXUS-RAT-2026-08-04-001`, under which one segmented record refused the whole artifact — including artifacts whose every cited Ratification was whole-record — is **withdrawn in full**, together with its refusal reason `segmented-lifecycle-scope-selection-unratified`, which is retired and not reused. The correspondence now carries **every** verified record into the consumed state, whole-record and segmented alike, with each segmented record's declared segments carried verbatim and its carried segment order declared **non-authoritative for resolution**, so that two artifacts differing only in declared segment order produce the identical attribution outcome; byte-identical consumed state is expressly not required, and no canonical segment-order transformation is defined or implied. The consumed record becomes a **closed structural union of exactly two arms, distinguished by field presence and not by any shared discriminant field**, because the whole-record arm is intentionally unchanged and therefore carries no form field to discriminate on: on the `WholeRecordLifecycle` arm, `lifecycleResolutionForm` and `lifecycleSegments` are absent and forbidden and the existing flat status and relation fields apply, byte-for-byte the existing field set; on the `SegmentedLifecycle` arm, `lifecycleResolutionForm` is required and exactly `SegmentedLifecycle`, `lifecycleSegments` is required and carries at least two segments — each carrying scope kind, scope key, description exactly when the kind is `GovernedScope`, status, and the two relation fields exactly when declared — and the record-level status and relation fields are forbidden, since a segmented record has no record-level status and synthesizing one would be the flattening this amendment prohibits. Every other field combination is structurally malformed, and an unrecognized field on either arm is rejected rather than ignored. The outer consumed Snapshot state — `source`, `capturedAt`, `records` — is unchanged, and the distinction between a stable outer shape and a widened element type is stated rather than elided. Artifact acceptance is expressly not an assertion that a scope-free reference to every carried record is valid. The **record-level ambiguity** is resolved where resolution is owned. **`NEXUS-RAT-2026-07-15-017` is amended by addition, in exactly two named respects, and in no other**: first, its accepted `RatificationAuthorityRecord` input domain becomes the closed structural two-arm union described above, preserving the prior whole-record arm exactly and adding the segmented arm, an addition the correspondence cannot make unilaterally because the sole resolver's accepted input domain is the resolver's own contract, and one the new outcome condition depends on because that condition reads the added form field; second, its Required Outcome Mapping gains exactly one condition at the matched-record position stated above. It remains the sole resolver and the sole producer of the three closed outcomes. All ten pre-existing conditions, their outcomes, their diagnostics, and their precedence relative to one another remain in force verbatim, as do the pre-existing whole-record input arm, all of its original fields, and all whole-record behavior; the closed outcome set remains exactly `Valid`, `Invalid`, and `Unresolvable`; the no-default rule is unchanged; no fourth authority is created; and the outcome contract gains no `scopeKey`, segment reference, or scope projection, explainability being supplied instead by the exact diagnostic and the referenced Ratification identifier. **`NEXUS-RAT-2026-08-04-001` is amended in exactly two respects**: the artifact-level segmented refusal is withdrawn, and the record transformation becomes total over both lifecycle resolution forms. Its verification chain V1 through V9, its canonical consumed order, its field provenance for whole-record records, its preservation of absence, multiplicity, verbatim status values, and structural completeness, its preservation of the validation authority's conditions on every path including those its own reachability table records as unreachable through a verified version 3 artifact, and its precedence rule that every verification refusal precedes every consuming check are each unchanged; V1–V9 precedence is preserved exactly, so a verification failure still refuses the artifact before correspondence or attribution validation is reached, and its refusal enumeration reduces to the twenty-one verification refusals of V1 through V8. Its reachability table's contradictory-record row is restated on the ground that survives the withdrawal: that condition remains unreachable through a conforming version 3 artifact because the encoding requires exact status and relation agreement within each segment and divergent statuses across distinct valid segments are noncontradictory by ratified rule, rather than because the artifact is refused. Its vector `CC9` is withdrawn and restated. **`NEXUS-RAT-2026-08-02-001` is amended to a named extent and in no other**: Pre-Use Verification Step 5 consumes the amended correspondence, its segmented failure row and its segmented conformance obligation are replaced, its Dependency DEP2 is discharged for scope-free references only, and its published expectations `SV6` and `N23d` are withdrawn and restated. Its Candidate Set Assembly, Selection Verification Authority, seven verification steps, four-conjunct Eligibility Predicate, ten Selection Rules, Historical Version Non-Revival, `RepositoryPolicySelectionReference` schema, indeterminacy/exclusion distinction, `ScopeUndeclared` reconciliation, Governance Decision recording contract, and Dependency DEP1 are each preserved verbatim; its ownership boundary is unchanged, selection still invoking and comparing rather than resolving. Three published expectations that required the withdrawn refusal — vector `CC9` of the correspondence, and vector `SV6` and negative vector `N23d` of the selection contract — are **explicitly withdrawn and restated** in the ratification entry rather than silently deleted. **`NEXUS-RAT-2026-07-31-001` is not amended**; the version 3 record encoding, its schemas, field order, schema version identifier, ordering rules, diagnostic vocabulary, commitment layers, and every deferral it declared are unchanged, and its deferral of production Snapshot issuance — Dependency DEP1 — is neither discharged, narrowed, nor excepted, so no conforming `RepositoryPolicySelectionReference` can be produced until issuance is separately authorized. **`NEXUS-RAT-2026-07-16-001` is not amended**; the Ratification Authority Snapshot fingerprint remains derived and owned by `RatificationAttributionValidation`, whole-record consumed states are unchanged so whole-record fingerprint behavior is unchanged, segmented artifacts previously produced no consumed state at all so no prior segmented consumed-state fingerprint exists to migrate or preserve, and no fingerprint, authority root, or envelope commitment rendering is published or ratified. No governed lifecycle declaration is rewritten, back-filled, repaired, migrated, or re-declared, no `sourceStatusDigest` is recomputed, and no prior Ledger entry's octets or `## Current Status` are edited: the three live segmented declarations are preserved exactly as governed evidence of what was partially withdrawn. Scope-bearing references, and any positive resolution of a carved governed scope, are **deferred in full**. **RFC-0003 is not amended**; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it. No Governance Decision value, Escalation category, Policy Evaluation mechanism, Policy Criterion predicate, or Governance Evaluation Input Profile is introduced or modified. Specification text only; implementation requires separate Sprint scope ratification.
