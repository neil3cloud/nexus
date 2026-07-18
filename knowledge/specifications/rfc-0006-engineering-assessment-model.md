# RFC-0006 — Engineering Assessment Model

**Status:** Final
**Version:** 1.2
**Authority:** Normative
**Normative Language:** RFC 2119

Amended to v1.1 by `NEXUS-RAT-2026-07-17-016`, correcting the Assessment Session's Mission Plan Revision record from an untyped opaque reference to an explicit, discriminated `ReviewPlanRevisionReference`.

Amended to v1.2 by `NEXUS-RAT-2026-07-18-006`: generalized `AssessmentSubjectReference` preserving the existing `ExecutableMissionPlan` and `ProposedPlanRevision` discriminator values unchanged (with `ReviewPlanRevisionReference` retained as a deprecated narrow alias); exact `AssessmentCriterion` / `Assessment Criteria Set` model, closed applicability vocabulary, and fingerprint protocol; Corpus-scoped `Assessment Coverage`; Corpus-scoped Finding affected-target model; Corpus-scoped recorded RFC-0003 Projection basis with snapshot-preserving completion; Evidence-expectation enforcement consuming RFC-0002 v1.1; conditional Execution attribution. The `CorpusReviewBasis` extension is dormant until `NEXUS-RAT-2026-07-18-008`.

---

# Purpose

This specification defines the Engineering Assessment domain of the Nexus Kernel.

Engineering Assessment evaluates completed engineering work against the authoritative engineering understanding established by the Mission, Evidence, Shared Reality, and applicable engineering policies.

Engineering Assessment determines whether engineering work is acceptable.

Engineering Assessment SHALL NOT redefine engineering intent.

This specification owns:

- Engineering Assessment
- Assessment Session
- Assessment Subject Reference
- Assessment Criteria
- Assessment Criterion
- Assessment Criterion Applicability
- Assessment Criteria Set
- Assessment Coverage
- Assessment Finding
- Finding Affected Target
- Actionable Finding
- Observation
- Assessment Outcome

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 2 — Evidence Before Generation
- Canon 5 — Controlled Mission Evolution
- Canon 6 — Evidence-Driven Review
- Canon 10 — Explainability
- Canon 11 — Knowledge Through Acceptance

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0001 — Mission Model
- RFC-0002 v1.1 — Evidence Model (Exact Content Evidence and `representedContentReference` consumed read-only)
- RFC-0003 — Shared Reality Projection Model (Projection, Projection Version, Projection Scope, Projection Freshness, and Active Evidence Set consumed read-only)
- RFC-0004 — Execution Model
- RFC-0005 — Domain Event Model
- RFC-0008 — Kernel Adapter Contract (Adapter transport/invocation attribution)
- RFC-0012 — Autonomous Engineering Planning Model (owner of `ProposedPlanRevision`; consumed read-only)

Owns:

- Engineering Assessment
- Assessment Session
- Assessment Subject Reference
- Assessment Criteria
- Assessment Criteria Set
- Assessment Coverage
- Assessment Finding
- Finding Affected Target
- Assessment Outcome

---

# Design Goals

Engineering Assessment SHALL be:

- deterministic
- evidence-driven
- explainable
- reproducible
- attributable
- policy-aware

Assessment SHALL evaluate engineering work without redefining Mission objectives.

---

# Domain Ownership

RFC-0006 exclusively owns:

- Engineering Assessment
- Assessment Session
- Assessment Subject Reference
- Assessment Criteria
- Assessment Criterion
- Assessment Criterion Applicability
- Assessment Criteria Set
- Assessment Coverage
- Assessment Finding
- Finding Affected Target
- Observation
- Actionable Finding
- Assessment Outcome

Other specifications MAY consume these concepts.

Other specifications SHALL NOT redefine them.

---

# Engineering Assessment

Engineering Assessment evaluates completed engineering work.

Assessment SHALL consume:

- Mission
- the Assessment Subject, referenced by an explicit `AssessmentSubjectReference` (below)
- Shared Reality Projection
- Applicable Evidence
- Produced Artifacts

Assessment SHALL produce exactly one Assessment Outcome.

---

# Assessment Session

An Assessment Session represents one complete engineering assessment.

Each Assessment Session SHALL record:

- Mission
- the Assessment Subject, as an `AssessmentSubjectReference`
- Execution attribution (conditional; see Conditional Execution Attribution, below)
- Assessment Criteria
- Consumed Evidence
- Produced Findings
- Assessment Outcome
- Projection basis (exact RFC-0003 Projection identity and Projection Version) — required only when the subject kind is `CorpusReviewBasis`; see Recorded Projection Basis and Snapshot-Preserving Completion, below

Assessment Sessions SHALL remain immutable.

The subject-under-assessment SHALL be an explicit, discriminated reference — an `AssessmentSubjectReference` — identifying which domain owns the subject. Exactly three discriminants are authorized, using exactly these wire values:

- `kind: ExecutableMissionPlan` — an RFC-0001 executable Mission Plan revision.
- `kind: ProposedPlanRevision` — an RFC-0012 Proposed Plan Revision, prior to Activation.
- `kind: CorpusReviewBasis` — an RFC-0013 Corpus Review Basis (`basisFingerprint`), an opaque, discriminated identity; dormant until `NEXUS-RAT-2026-07-18-008`.

A human-readable description MAY refer to the first variant as an "executable Mission Plan revision"; the discriminator value SHALL remain exactly `ExecutableMissionPlan`. No discriminator value defined by v1.1 is renamed, replaced, or re-encoded by this amendment.

An opaque, undiscriminated subject reference SHALL NOT be used. This specification does not otherwise define any referenced domain's subject semantics; RFC-0001, RFC-0012, and RFC-0013 remain the sole owners of their respective concepts.

`ReviewPlanRevisionReference` is RETAINED as a deprecated, backward-compatible narrow alias of `AssessmentSubjectReference`, restricted to exactly the `ExecutableMissionPlan` and `ProposedPlanRevision` discriminants. Precisely:

- the two existing discriminator values and their wire representation remain byte-for-byte unchanged;
- existing Plan-Revision subject construction sites remain valid without modification;
- Corpus-scoped Assessment Coverage does not apply to Plan-Revision assessments;
- the Corpus-scoped Finding affected-target model does not apply to Plan-Revision assessments;
- the Corpus-scoped recorded Projection basis does not apply to Plan-Revision assessments;
- Conditional Execution Attribution is a normative change applying to all subject kinds, whose implementation remains deferred and requires separate authorization.

---

# Assessment Criteria

Assessment SHALL evaluate engineering work using explicit criteria.

Criteria MAY include:

- Mission Objectives
- Architecture
- ADRs
- Repository Policies
- Coding Standards
- Acceptance Criteria
- Security Requirements
- Performance Requirements
- Accessibility Requirements
- Documentation Requirements
- Test Requirements

Assessment SHALL NOT rely upon undocumented preferences.

## Assessment Criteria Identity

An `AssessmentCriterion` SHALL possess:

- `AssessmentCriterionId`;
- EITHER an inline criterion definition OR an exact immutable criterion reference (below);
- an Assessment Criterion Applicability declaration (below);
- sorted supporting authority references;
- required Evidence expectations;
- a required verification-status threshold;
- a required confidence threshold.

An Assessment Criteria Set SHALL be an immutable, non-empty, order-irrelevant collection of `AssessmentCriteria` with an exact identity, an exact version, and a deterministic fingerprint.

An authority-bearing artifact reference is NOT itself an `AssessmentCriterion`.

For a `CorpusReviewBasis` subject, the Assessment's Criteria Set identity, version, and fingerprint SHALL equal those bound into the submitted Basis, failing closed on mismatch. A consuming specification MAY reference an Assessment Criteria Set but SHALL NOT own or derive Assessment Criteria.

### Exact Immutable Criterion Reference

An exact immutable criterion reference SHALL identify, completely:

- the owning specification or governed artifact type;
- the criterion identity within that owner;
- the exact owner/artifact identity;
- the exact owner/artifact version;
- the exact criterion content fingerprint;
- sorted supporting authority references.

The Assessment Criteria Set fingerprint SHALL incorporate this complete canonical reference tuple.

Resolution SHALL fail closed on a reference that is missing, mutable, unversioned, ambiguous, superseded without an explicit applicability declaration, or fingerprint-mismatched.

### Inline Criterion Definition Canonicalization

For an inline criterion definition, the exact bytes included in the fingerprint SHALL be produced by, in order:

1. Unicode Normalization Form C (NFC);
2. line-ending normalization to LF (U+000A);
3. removal of leading and trailing whitespace of the complete definition, with all internal whitespace preserved exactly;
4. UTF-8 encoding.

No other normalization SHALL be applied. Two inline definitions producing identical bytes under this procedure are the same definition for every fingerprint purpose.

### Assessment Criterion Applicability

Assessment Criterion Applicability SHALL be a closed, declarative, non-executable selection declaration. It SHALL contain no executable predicate, expression language, callback, script, provider prompt, or unrestricted policy logic of any kind. Exactly four variants are authorized:

- `AllSubjectElements` — element-scoped. Selects every Assessment Subject Element of the subject. Carries no additional field.
- `SubjectElementsOfKind` — element-scoped. Carries exactly one `canonicalKind`, an exact immutable canonical kind identifier (for a `CorpusReviewBasis` subject, an RFC-0013 Canonical Artifact Kind Key). Selects every Subject Element whose canonical kind equals it.
- `ExactSubjectElementSet` — element-scoped. Carries a non-empty, duplicate-free set of exact immutable Subject Element references, sorted ascending by reference identity. Selects exactly those elements.
- `SubjectWide` — subject-scoped. Selects the Assessment Subject as a whole rather than any individual Subject Element. For a `CorpusReviewBasis` subject, it evaluates the Corpus Review Basis as a whole. Carries no additional field.

Selection semantics SHALL be deterministic: identical applicability declarations over an identical Subject Element set SHALL always select the identical set.

Applicability construction and resolution SHALL fail closed on: an unknown or unauthorized variant; a missing required field; a duplicate reference within `ExactSubjectElementSet`; an empty `ExactSubjectElementSet`; a Subject Element reference that does not resolve within the subject; a `canonicalKind` that does not resolve to a kind the subject recognizes; or any ambiguous selection.

## Assessment Criteria Set Fingerprint

Per criterion, the fingerprint SHALL include, in this canonical field order:

1. `AssessmentCriterionId`;
2. the inline criterion definition canonical bytes OR the complete canonical exact immutable criterion reference tuple;
3. the canonical applicability form (below);
4. sorted supporting authority references;
5. required Evidence expectations;
6. verification threshold;
7. confidence threshold.

The canonical applicability form SHALL be:

- `AllSubjectElements` → the literal token `AllSubjectElements`;
- `SubjectElementsOfKind` → the token `SubjectElementsOfKind` followed by the exact `canonicalKind`;
- `ExactSubjectElementSet` → the token `ExactSubjectElementSet` followed by the element references sorted ascending by reference identity, each length-framed;
- `SubjectWide` → the literal token `SubjectWide`.

The applicability declaration participates in the fingerprint completely; no component is omitted.

Protocol: UTF-8 encoding; unambiguous length framing of every field and every collection element; criteria sorted ascending by `AssessmentCriterionId`; SHA-256; lowercase hexadecimal output. `AssessmentCriterionId` is included as a stable authored identity; system-generated record identifiers and all timestamps are excluded.

Equivalent Criteria Sets (identical criteria by identity and content, including identical applicability declarations) SHALL produce identical fingerprints regardless of insertion order.

---

# Assessment Findings

A Finding represents an evidence-supported engineering conclusion.

Every Finding SHALL:

- reference supporting Evidence
- identify affected artifacts
- identify violated or satisfied criteria
- remain attributable

Findings SHALL remain reproducible.

The requirement to identify affected artifacts SHALL be read as target-aware: it is satisfied exactly as in v1.0/v1.1 for `ExecutableMissionPlan` and `ProposedPlanRevision` assessments, and satisfied by exactly one declared affected-target variant for `CorpusReviewBasis` assessments. See Finding Affected Target, below.

---

# Finding Affected Target (Corpus-scoped)

For an Assessment whose `AssessmentSubjectReference.kind` is `CorpusReviewBasis`, every Assessment Finding SHALL declare exactly one affected-target variant from a closed set of two:

- `SubjectElementTarget` — carries a non-empty, duplicate-free, deterministically sorted set of exact Corpus Artifact References, each resolving within the referenced Basis's Scope.
- `AssessmentSubjectTarget` — carries exactly one exact `CorpusReviewBasis` fingerprint, equal to the Assessment's own subject Basis fingerprint.

Rules:

- A Finding arising from an element-scoped coverage pair SHALL declare `SubjectElementTarget` and identify the exact selected element or elements it concerns.
- A Finding arising from a `SubjectWide` coverage pair SHALL declare exactly one `AssessmentSubjectTarget` containing the exact `CorpusReviewBasis` fingerprint.
- A `SubjectWide` Finding MAY additionally enumerate affected Corpus Artifact References for explanation only. That optional enumeration SHALL NOT replace, weaken, or substitute for the required `AssessmentSubjectTarget`, and SHALL NOT be treated as a `SubjectElementTarget`.
- Zero-target Findings are prohibited.
- Targets SHALL be immutable, attributable, and deterministic.

Construction and resolution SHALL fail closed on: a missing target; more than one declared target variant on a single Finding; an empty `SubjectElementTarget`; a duplicate reference within a `SubjectElementTarget`; a reference that does not resolve within the referenced Basis's Scope; a cross-Basis reference; an `AssessmentSubjectTarget` whose fingerprint does not equal the Assessment's subject Basis fingerprint; or a target variant that does not match the originating coverage pair's scope.

Existing Finding behavior, fields, and structure for `ExecutableMissionPlan` and `ProposedPlanRevision` assessments remain unchanged; this model applies only to `CorpusReviewBasis` assessments. This specification retains exclusive ownership of Finding structure and affected targets. A consuming specification MAY reference a Finding by identity but SHALL NOT duplicate or redefine its target structure.

---

# Assessment Coverage (Corpus-scoped)

ONLY WHEN `AssessmentSubjectReference.kind` is `CorpusReviewBasis`, an Assessment Session SHALL own an immutable Assessment Coverage record whose universe is exactly the union of:

(a) the complete Cartesian product of every Corpus Artifact Reference in the referenced Basis's Scope × every element-scoped `AssessmentCriterion` in the bound Assessment Criteria Set (that is, every criterion whose applicability variant is `AllSubjectElements`, `SubjectElementsOfKind`, or `ExactSubjectElementSet`); and

(b) exactly one pair per subject-scoped `AssessmentCriterion`: (the Corpus Review Basis as a whole, that criterion), for every criterion whose applicability variant is `SubjectWide`.

A subject-scoped criterion SHALL NOT appear in (a), and SHALL NOT be forced into a pair with any individual Corpus Artifact Reference. An element-scoped criterion SHALL NOT appear in (b). A single cross-artifact condition SHALL therefore be dispositioned exactly once, and a Finding arising from it SHALL NOT be duplicated across artifacts.

Each pair in the coverage universe SHALL receive exactly one immutable disposition: `Satisfied`; `FindingProduced`; `NotApplicable`; `UnableToEvaluate`.

- `NotApplicable` is valid only when the criterion's applicability declaration does not select that pair's Subject Element — that is, only for pairs in (a) whose element the criterion does not select. It SHALL carry an attributable explanation and the exact applicability declaration relied upon. A pair the criterion's applicability declaration selects SHALL NOT be marked `NotApplicable`. Pairs in (b) are selected by construction and SHALL NOT be marked `NotApplicable`.
- `FindingProduced` SHALL link a Finding whose affected-target variant matches the pair's scope: a pair in (a) SHALL link a Finding declaring `SubjectElementTarget`; a pair in (b) SHALL link a Finding declaring `AssessmentSubjectTarget`.
- `UnableToEvaluate` SHALL carry an attributable reason and SHALL prevent `Accepted` or `Accepted With Observations`.

Coverage is complete only when every pair in the coverage universe carries exactly one valid disposition. A terminal Assessment Outcome SHALL fail closed until coverage is complete.

This section SHALL NOT apply to `ExecutableMissionPlan` or `ProposedPlanRevision` assessments; any future universal-coverage requirement SHALL require its own separate migration analysis and ratification.

## Evidence Expectation Enforcement

This section applies only to Assessment Coverage dispositions, which exist only for `CorpusReviewBasis` subjects.

For a `Satisfied` or `FindingProduced` disposition, the supporting Consumed Evidence SHALL:

- identify exact EvidenceId and EvidenceVersion;
- belong to the exact Active Evidence Set of the RFC-0003 Projection recorded on the Assessment Session;
- apply to the exact Assessment Subject Element (for pairs in (a)), or to the Assessment Subject as a whole (for pairs in (b)), established through the RFC-0002 v1.1 `representedContentReference` — never through implicit EvidenceId encoding or free-form Provenance alone;
- satisfy the `AssessmentCriterion`'s required Evidence expectations;
- satisfy the required verification-status threshold;
- satisfy the required confidence threshold;
- where the criterion requires exact-content Evidence, resolve to RFC-0002 v1.1 Exact Content Evidence whose `representedContentReference`, content-representation classification, `contentDigestAlgorithm`, and `contentDigest` are consumed READ-ONLY and match the Subject Element's recorded represented content and digest; where that Evidence is DerivedContent, its deterministic source set SHALL resolve unambiguously to valid SnapshotContent Evidence per RFC-0002 v1.1.

Missing, ambiguous, conflicting, insufficient-confidence, insufficient-verification, cross-Mission, cross-element, represented-content-mismatched, digest-mismatched, unresolved-derivation, or expectation-mismatched Evidence SHALL NOT satisfy the criterion. When the required evaluation cannot be established, the disposition SHALL be `UnableToEvaluate`, never `Satisfied`.

Evidence membership is evaluated against the exact bound Projection recorded per Recorded Projection Basis, below, including when that Projection has become stale after Basis construction. Staleness of the bound Projection SHALL NOT, by itself, disqualify Evidence that remains resolvable and a member of that exact Projection's Active Evidence Set.

---

# Conditional Execution Attribution

This supersedes the v1.0 unconditional Execution Session field.

- **Direct Human assessment:** Human actor identity SHALL be recorded; an Execution Session SHALL be absent and SHALL NOT be fabricated.
- **Provider-produced assessment:** the producing Provider/system identity, the RFC-0004 Execution Role, and the actual RFC-0004 Execution Session SHALL all be recorded.
- An RFC-0004 Engineering Session SHALL be recorded only when an Engineering Session actually participated.
- An RFC-0008 Adapter reference SHALL be recorded, when present, strictly as transport/invocation attribution; an Adapter SHALL NEVER be recorded as, or treated as, the evaluator origin.

This applies consistently across every clause of this specification referencing Assessment attribution, for all three subject kinds. Attribution SHALL remain complete and reproducible under each branch above.

---

# Recorded Projection Basis and Snapshot-Preserving Completion (Corpus-scoped)

**Recording.** An Assessment Session whose `AssessmentSubjectReference.kind` is `CorpusReviewBasis` SHALL record the exact RFC-0003 Projection identity and Projection Version constituting its Evidence basis, consumed read-only and unmodified. That recorded Projection SHALL equal the RFC-0003 Projection identity and Projection Version bound into the referenced Corpus Review Basis, failing closed on inequality. This recorded basis is the normative referent for every clause in this specification that refers to "the Projection basis bound to the Assessment", and is the value a consuming specification compares against.

**Freshness at Basis construction.** The bound Projection SHALL have been fresh under RFC-0003's freshness rules at the time the referenced Corpus Review Basis was constructed. RFC-0013 owns that construction-time requirement; this specification consumes the resulting bound Projection.

**Snapshot-Preserving Completion.** An Assessment MAY reach a terminal Assessment Outcome against its exact bound Projection after that Projection has become stale under RFC-0003's freshness rules, provided ALL of the following hold:

- the exact bound Projection version remains uniquely resolvable and reproducible;
- its Mission and Projection Scope remain identical to the values bound into the Corpus Review Basis;
- every referenced EvidenceId and EvidenceVersion remains resolvable;
- the Assessment records exactly that same Projection identity and version;
- no identity, version, Mission, scope, Evidence-membership, or fingerprint mismatch exists.

Staleness of the bound Projection SHALL NOT, by itself, prevent an Assessment from reaching a terminal Outcome. Such an Assessment is a historically valid exact-snapshot evaluation of its immutable Basis; it does not assert current applicability, which is determined externally (RFC-0011).

**Fail-closed conditions.** Assessment SHALL fail closed when the recorded Projection is missing, unresolvable, non-reproducible, ambiguous, conflicting, Mission-incompatible with the Assessment's Mission identity, scope-mismatched relative to the Basis-bound Projection Scope, or unequal to the Basis-bound Projection identity or version; or when any referenced EvidenceId or EvidenceVersion is no longer resolvable. Staleness alone is NOT a fail-closed condition.

**Scope.** This requirement SHALL NOT apply to `ExecutableMissionPlan` or `ProposedPlanRevision` assessments. v1.1 states no normative requirement for exact Projection identity or version on any Assessment Session, and this Corpus-specific amendment SHALL NOT incidentally expand the existing Plan-Revision Assessment contract. Any future universal Projection-recording requirement SHALL require its own separate migration analysis and ratification.

This specification does not redefine Projection, Projection Version, Projection Scope, Projection Freshness, or the Active Evidence Set, all of which remain owned by RFC-0003.

---

# Finding Severity

Minimum severities SHALL include:

- Informational
- Minor
- Major
- Critical

Kernel policies MAY define additional severities.

---

# Finding Intent

Actionable Findings SHALL declare intent.

Minimum intents SHALL include:

- Correction
- Expansion
- Refactoring
- Alignment
- Risk Mitigation
- Documentation

Intent SHALL guide Mission Evolution.

---

# Observations

Observations communicate engineering information requiring no additional engineering work.

Observations SHALL NOT trigger Mission Evolution.

---

# Actionable Findings

Actionable Findings identify engineering deficiencies requiring additional work.

Every Actionable Finding SHALL:

- reference Evidence
- identify affected Tasks
- identify Assessment Criteria
- declare Finding Intent

Actionable Findings MAY result in Mission Plan revisions.

Assessment SHALL NOT directly modify the Mission Plan.

---

# Assessment Outcomes

Each Assessment SHALL produce exactly one outcome.

Minimum outcomes SHALL include:

## Accepted

Engineering work satisfies all applicable Assessment Criteria.

Mission MAY continue.

---

## Accepted With Observations

Engineering work satisfies Assessment Criteria.

Observations MAY become Knowledge.

Mission MAY continue.

---

## Action Required

Engineering work requires additional Tasks or Mission Plan revisions.

Mission Evolution MAY occur.

---

## Rejected

Engineering work fails Assessment.

Execution SHALL NOT continue until deficiencies are resolved.

---

# Explainability

Every Assessment Outcome SHALL identify:

- supporting Evidence
- Assessment Criteria
- produced Findings
- reasoning chain
- the `AssessmentSubjectReference`

For a `CorpusReviewBasis` subject, the Assessment Outcome SHALL additionally identify the Basis fingerprint, the Assessment Criteria Set fingerprint, the recorded RFC-0003 Projection identity and Projection Version, and each Finding's declared affected target.

Hidden reasoning SHALL NOT influence Assessment Outcomes.

---

# Determinism

For an `ExecutableMissionPlan` or `ProposedPlanRevision` subject, equivalent:

- Mission
- Mission Plan
- Evidence
- Shared Reality
- Produced Artifacts

SHALL produce equivalent Assessment Outcomes.

For a `CorpusReviewBasis` subject, equivalent:

- Mission
- Corpus Review Basis fingerprint
- Assessment Criteria Set fingerprint
- recorded RFC-0003 Projection identity and Projection Version
- Produced Artifacts and Findings

SHALL produce equivalent Assessment Outcomes. A Mission Plan SHALL NOT be required for a `CorpusReviewBasis` assessment.

Determinism SHALL be evaluated against the exact bound Projection version, not against whichever Projection is currently fresh; re-evaluating the same Assessment inputs against the same bound Projection version SHALL always produce the same Assessment Outcome, irrespective of elapsed time or subsequent Projection versions.

---

# Human Authority

Human participants MAY:

- approve Assessment Outcomes
- reject Assessment Outcomes
- override Assessment Outcomes
- request additional Assessment

Overrides SHALL become Evidence.

Human authority SHALL supersede automated Assessment.

---

# Produced Artifacts

Engineering Assessment MAY produce:

- Findings
- Assessment Reports
- Metrics
- Review Summaries

Assessment artifacts SHALL remain attributable.

Assessment artifacts SHALL NOT become Knowledge until accepted.

---

# Security Considerations

Assessment SHALL preserve repository integrity.

Assessment SHALL respect repository policies.

Sensitive Findings MAY be access-controlled.

Filtering SHALL preserve Assessment semantics.

---

# Implementation Requirements

Implementations SHALL:

- support deterministic Assessment
- support Assessment Sessions
- support explainable Findings
- support explicit Assessment Criteria
- preserve attribution
- preserve reproducibility

Implementation details remain outside the scope of this specification.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# Conformance

A Kernel implementation conforms to RFC-0006 only if it:

- evaluates engineering work using explicit Assessment Criteria
- produces deterministic Assessment Outcomes
- preserves explainability
- preserves attribution
- produces evidence-supported Findings
- prevents undocumented preferences from influencing engineering decisions
- represents the Assessment Session's subject as an explicit, discriminated `AssessmentSubjectReference` with exactly the three authorized discriminants (`ExecutableMissionPlan`, `ProposedPlanRevision`, `CorpusReviewBasis`), never as an opaque, undiscriminated reference, and preserves the two pre-existing discriminator values and their wire representation byte-for-byte
- treats `ReviewPlanRevisionReference` as a deprecated, backward-compatible narrow alias restricted to the two Plan-Revision discriminants
- for a `CorpusReviewBasis` subject, requires an immutable, non-empty Assessment Criteria Set whose identity, version, and fingerprint equal those bound into the submitted Basis
- computes the Assessment Criteria Set fingerprint deterministically and order-independently, incorporating the complete applicability declaration
- restricts Assessment Criterion Applicability to the four authorized declarative variants, containing no executable logic
- for a `CorpusReviewBasis` subject, maintains complete Assessment Coverage over the union of the element-scoped Cartesian product and exactly one subject-wide pair per `SubjectWide` criterion, as a precondition of any terminal Assessment Outcome
- for a `CorpusReviewBasis` subject, requires exactly one Finding affected-target variant per Finding, matching the originating coverage pair's scope, and prohibits zero-target Findings
- enforces Evidence expectations, including read-only RFC-0002 v1.1 exact-content equality, before any `Satisfied` or `FindingProduced` disposition
- records Execution attribution conditionally, never fabricating an Execution Session for a direct Human assessment, and never treating an Adapter as evaluator origin
- for a `CorpusReviewBasis` subject, records the exact RFC-0003 Projection identity and Projection Version, permits snapshot-preserving completion against a stale-but-exactly-resolvable bound Projection, and never treats staleness alone as a fail-closed condition
- applies Corpus-scoped Coverage, Finding affected targets, and Projection recording only to `CorpusReviewBasis` assessments, leaving Plan-Revision assessment behavior unchanged

Failure to satisfy these guarantees constitutes non-conformance with this specification.

---

# Amendment History

- v1.0 — Final.
- v1.1 — Amended by `NEXUS-RAT-2026-07-17-016`. Originates from `NEXUS-REV-2026-07-17-014-F-002` and `NEXUS-REV-2026-07-17-016-F-003` (Category 6, Observation): the implementation-layer `Review` model's revision-under-assessment field was an untyped, opaque string, ambiguously reused to reference either an RFC-0001 executable Mission Plan revision or an RFC-0012 Proposed Plan Revision, flagged as a risk to Sprint 76 (Approved Plan Activation), which treats this exact correlation as a precondition for an irreversible conversion into executable state. Corrects the Assessment Session's Mission Plan Revision record to an explicit, discriminated `ReviewPlanRevisionReference` (`kind: ExecutableMissionPlan | ProposedPlanRevision`, `revisionId`). No other RFC-0006 concept, lifecycle, or outcome is amended.
- v1.2 — Amended by `NEXUS-RAT-2026-07-18-006`. Generalizes the Assessment Session subject to an `AssessmentSubjectReference` with exactly three discriminants (`ExecutableMissionPlan`, `ProposedPlanRevision`, `CorpusReviewBasis`), retaining `ReviewPlanRevisionReference` as a deprecated backward-compatible narrow alias; **no discriminator value is renamed, replaced, or re-encoded, and the two pre-existing values and their wire representation remain byte-for-byte unchanged**. Adds an exact `AssessmentCriterion` / non-empty Assessment Criteria Set identity-version-fingerprint model with a complete immutable criterion-reference contract, explicit inline-definition canonicalization (NFC, LF, outer-trim, UTF-8), a closed four-variant declarative applicability vocabulary, and a canonical SHA-256 fingerprint protocol; a Corpus-scoped Assessment Coverage universe formed as the union of the element-scoped Cartesian product and exactly one subject-wide pair per `SubjectWide` criterion; a closed Corpus-scoped Finding affected-target model (`SubjectElementTarget` / `AssessmentSubjectTarget`); Evidence-expectation enforcement consuming RFC-0002 v1.1 Exact Content Evidence read-only; conditional Execution attribution; and a Corpus-scoped recorded RFC-0003 Projection basis with snapshot-preserving completion under which staleness alone is never a fail-closed condition. No Assessment Outcome value, Finding Severity, or Finding Intent is changed. RFC-0005 and RFC-0012 dependencies are preserved unmodified, and RFC-0002 v1.1, RFC-0008, and RFC-0012 are recorded explicitly. Projection Freshness remains owned by RFC-0003 and is consumed, not redefined. Corpus-scoped Coverage, the Finding affected-target model, and Projection recording apply only to `CorpusReviewBasis` assessments; Plan-Revision assessment behavior is unchanged. The `CorpusReviewBasis` subject variant, the `SubjectWide` applicability variant, Corpus-scoped Coverage, the Finding affected-target model, and the recorded Projection basis remain **dormant and unusable** until `NEXUS-RAT-2026-07-18-008` authorizes RFC-0013 Draft v0.6. Conditional Execution Attribution is a normative change whose implementation is deferred and separately authorized. Specification text only; no implementation, no Sprint, no Initial Capability Sequence.
