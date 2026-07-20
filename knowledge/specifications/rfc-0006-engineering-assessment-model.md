# RFC-0006 — Engineering Assessment Model

**Status:** Final
**Version:** 1.3
**Authority:** Normative
**Normative Language:** RFC 2119

Amended to v1.1 by `NEXUS-RAT-2026-07-17-016`, correcting the Assessment Session's Mission Plan Revision record from an untyped opaque reference to an explicit, discriminated `ReviewPlanRevisionReference`.

Amended to v1.2 by `NEXUS-RAT-2026-07-18-006`: generalized `AssessmentSubjectReference` preserving the existing `ExecutableMissionPlan` and `ProposedPlanRevision` discriminator values unchanged (with `ReviewPlanRevisionReference` retained as a deprecated narrow alias); exact `AssessmentCriterion` / `Assessment Criteria Set` model, closed applicability vocabulary, and fingerprint protocol; Corpus-scoped `Assessment Coverage`; Corpus-scoped Finding affected-target model; Corpus-scoped recorded RFC-0003 Projection basis with snapshot-preserving completion; Evidence-expectation enforcement consuming RFC-0002 v1.1; conditional Execution attribution. The `CorpusReviewBasis` extension is dormant until `NEXUS-RAT-2026-07-18-008`.

Amended to v1.3 by `NEXUS-RAT-2026-07-21-002`: closes the `required Evidence expectations` field to an RFC-0006-owned, closed, declarative, non-executable four-variant vocabulary (`NoAdditionalExpectation`, `RequiredEvidenceType`, `RequiredExactContent`, `RequiredEvidenceCount`), with `RequiredEvidenceType` defined as an exact immutable equality constraint on a well-formed Evidence Type identity/version pair, with no RFC-0002 registry dependency; defines a per-coverage-pair baseline qualifying Evidence set with deterministic matching and a fully enveloped canonical fingerprint encoding (expectation-set cardinality encoded as one length-framed canonical unsigned decimal ASCII field, followed by each sorted complete clause as one independently length-framed byte sequence, with clause fields remaining length-framed internally); binds the `AssessmentCriterion` required confidence threshold and required verification-status threshold fields to RFC-0002 v1.3's closed `ConfidenceClassification` and `EvidenceVerificationStatus` vocabularies, consumed read-only, requiring every baseline Evidence item to individually satisfy both thresholds for `Satisfied`; routes a baseline containing at least one rankable-but-insufficient item, with none unrankable or malformed, to `FindingProduced` recording every failing comparison; and routes any baseline containing an unrankable item, or any correlated malformed-Provenance item — unconditionally, regardless of other valid items present — to `UnableToEvaluate`, distinguishing malformed from legacy-opaque unrankable verification status throughout. Applies only where `AssessmentSubjectReference.kind` is `CorpusReviewBasis`, unchanged from v1.2; `ExecutableMissionPlan` and `ProposedPlanRevision` assessment behavior is byte-for-byte unchanged. Also synchronizes RFC-0006's live `RFC-0002 v1.1` Exact Content Evidence citations to `RFC-0002 v1.3`, the current version of the same unmodified normative text, with no semantic change to that consumption. No RFC-0002 Evidence Relationships concept, and no universal RFC-0002 Evidence Type registry, is referenced or assumed. No other normative text changed. No implementation and no Sprint activation authorized.

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
- RFC-0002 v1.3 — Evidence Model (Exact Content Evidence and `representedContentReference` consumed read-only; version-string synchronized from v1.1 — the current RFC-0002 document is v1.3, and the Exact Content Evidence text this dependency consumes is unmodified since v1.1)
- RFC-0002 v1.3 — Evidence Model (`ConfidenceClassification` and `EvidenceVerificationStatus` vocabularies — closed membership, canonical encoding, total ordering, comparison, and threshold-satisfaction semantics — consumed read-only; RFC-0006 does not redefine any of these)
- RFC-0002 v1.3 — Evidence Model (the structural requirement that every Evidence Type possesses an exact identity and version, and the closed two-value SnapshotContent/DerivedContent content-representation classification — both consumed read-only, for the `RequiredEvidenceType` and `RequiredExactContent` Evidence Expectation variants defined below; RFC-0006 assumes no universal Evidence Type registry or resolution operation, and does not consume RFC-0002's Canonicalization Profile Registry, which is scoped to Exact Content Evidence canonical byte representation only)
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
- required Evidence expectations — a non-empty, order-irrelevant, duplicate-free set of `EvidenceExpectation` declarations (below);
- a required verification-status threshold, which SHALL be exactly one RFC-0002 v1.3 `EvidenceVerificationStatus` value, consumed read-only;
- a required confidence threshold, which SHALL be exactly one RFC-0002 v1.3 `ConfidenceClassification` value, consumed read-only.

RFC-0006 does not define, reorder, re-encode, or reinterpret the `ConfidenceClassification` or `EvidenceVerificationStatus` vocabularies; their closed membership, canonical encoding, total ordering, comparison, and threshold-satisfaction semantics remain exclusively owned by RFC-0002.

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

## Required Evidence Expectations

An `AssessmentCriterion`'s required Evidence expectations SHALL be a non-empty, order-irrelevant set of `EvidenceExpectation` declarations, exactly duplicate-free (no two clauses with identical encoded bytes, per Canonical Encoding, below). Exactly four variants are authorized. Each is a closed, declarative, non-executable structural constraint, owned exclusively by RFC-0006. It SHALL contain no executable predicate, expression language, callback, script, provider prompt, or unrestricted policy logic of any kind.

- `NoAdditionalExpectation` — imposes no structural constraint on the baseline qualifying Evidence set (below) beyond what § Evidence Expectation Enforcement already requires. Carries no additional field. A criterion declaring `NoAdditionalExpectation` SHALL declare no other variant.
- `RequiredEvidenceType` — carries a non-empty Evidence Type identity and a non-empty Evidence Type version. It is an exact immutable equality constraint, not a registry lookup: it is satisfied when at least one baseline Evidence item records exactly the same identity/version pair. RFC-0006 does not determine or redefine whether the referenced Evidence Type is otherwise supported, recognized, or registered; conformance of an Evidence instance and its recorded Evidence Type remains governed exclusively by RFC-0002. A criterion MAY declare more than one `RequiredEvidenceType` clause, provided their identity/version references differ; each is independently satisfied by a (possibly different) baseline Evidence item.
- `RequiredExactContent` — requires valid RFC-0002 Exact Content Evidence, matched to the coverage pair through `representedContentReference`. Carries exactly one closed RFC-0006 expectation value: `AnyExactContent` (either RFC-0002 content-representation classification is acceptable), `SnapshotContent`, or `DerivedContent` — the latter two reusing RFC-0002's own two-value content-representation classification (§ Exact Content Evidence) read-only. A `DerivedContent` requirement is satisfied only by Evidence whose deterministic derivation-source set resolves per RFC-0002's derivation-source resolution rules; RFC-0002's Canonicalization Profile Registry and content-digest resolution apply and MAY fail closed independently of this vocabulary. At most one `RequiredExactContent` clause is permitted per criterion.
- `RequiredEvidenceCount` — carries one positive integer `minimumCount`, encoded as canonical decimal ASCII, no sign, no leading zero. At most one `RequiredEvidenceCount` clause is permitted per criterion.

### Baseline Qualifying Evidence Set

For a given coverage pair, the baseline qualifying Evidence set is the set of distinct `(EvidenceId, EvidenceVersion)` pairs that:

1. resolve exactly;
2. belong to the exact bound Projection's Active Evidence Set (§ Recorded Projection Basis and Snapshot-Preserving Completion (Corpus-scoped));
3. correlate to the exact Assessment Subject Element (pairs in (a)) or to the Assessment Subject as a whole (pairs in (b)), established through the RFC-0002 v1.3 `representedContentReference` — never through implicit EvidenceId encoding or free-form Provenance alone;
4. possess valid, resolvable Provenance; and
5. satisfy every common exact-content integrity rule applicable to that Evidence (representedContentReference match, contentDigestAlgorithm/contentDigest match, and, where DerivedContent, unambiguous resolution to valid SnapshotContent Evidence).

**Malformed Provenance aborts the pair unconditionally.** If any purported Consumed Evidence item correlated to the coverage pair resolves to malformed Provenance (per RFC-0002 v1.3 § Verification Status Semantics Marker — Legacy/Governed Distinction), evaluation of that pair SHALL fail closed as `UnableToEvaluate` in its entirety — regardless of whether other, otherwise-qualifying, valid Evidence items exist for the same pair. The malformed item is not admitted into the baseline qualifying Evidence set; its persisted bytes remain unchanged; and the attributable reason SHALL identify malformed Provenance distinctly from legacy-opaque unrankable verification status. This rule applies identically wherever baseline construction, Common Validity Preconditions, Disposition Rules, and Threshold Semantics are stated (§ Evidence Expectation Enforcement, below).

This baseline set, once malformed items are excluded per the rule above, is the sole universe against which every `EvidenceExpectation` clause and both threshold requirements are evaluated. No Evidence item outside the baseline set may satisfy any clause or threshold.

### Matching Semantics

Required Evidence expectations are satisfied, as a set, if and only if every declared clause is independently satisfied by the baseline qualifying Evidence set — not necessarily by the same baseline item:

- `NoAdditionalExpectation` is always satisfied by a non-empty baseline set.
- Each `RequiredEvidenceType` clause is satisfied if at least one baseline item records that exact Evidence Type identity and version. Different `RequiredEvidenceType` clauses on the same criterion MAY be satisfied by different baseline items. A well-formed `RequiredEvidenceType` clause matched by no baseline item is a determinate expectation-mismatch (§ Evidence Expectation Enforcement, below), never an `UnableToEvaluate` "unresolved reference."
- `RequiredExactContent` is satisfied if at least one baseline item satisfies its declared content-representation constraint.
- `RequiredEvidenceCount` is satisfied if the count of distinct baseline pairs is greater than or equal to `minimumCount`. This count is taken over the full baseline set, independent of which items satisfied any other declared clause.

A criterion's required Evidence expectations are expectation-mismatched if the baseline set is non-empty and at least one declared clause is not satisfied by it (§ Evidence Expectation Enforcement, below, governs the case where the baseline set is empty).

### Threshold Aggregation

Every item in the baseline qualifying Evidence set SHALL possess rankable confidence and rankable verification status and SHALL individually satisfy both required thresholds for the criterion's threshold requirement to be satisfied. This aggregation rule, and its `Satisfied`/`FindingProduced`/`UnableToEvaluate` consequences, is stated in full in § Evidence Expectation Enforcement — Threshold Aggregation (RFC-0002 v1.3), below, which this subsection cross-references rather than restates.

### Canonical Encoding

Each `EvidenceExpectation` clause SHALL be encoded, for fingerprint and every serialized representation, as its variant token followed by its declared fields in canonical order, each length-framed, UTF-8: `RequiredEvidenceType` — the EvidenceType identity, then the EvidenceType version; `RequiredExactContent` — the exact classification token (`AnyExactContent`, `SnapshotContent`, or `DerivedContent`); `RequiredEvidenceCount` — the decimal ASCII encoding of `minimumCount`, no sign, no leading zero; `NoAdditionalExpectation` — the literal token with no fields. This produces one **complete encoded clause** per declaration.

The complete set's canonical form is: the set's cardinality, encoded as one length-framed canonical unsigned decimal ASCII field, with no sign and no leading zero, followed by each complete encoded clause — sorted ascending by its own complete encoded bytes — each independently length-framed as a single unit (the clause's internal field length-framing, above, is unaffected and remains nested inside this outer per-clause frame). Exact duplicate complete encoded clauses SHALL be rejected before this sort is applied. Equivalent sets (identical clauses by complete encoded bytes, in any declaration order) SHALL produce identical canonical-form bytes; a different cardinality, a different clause variant, or different clause field content SHALL produce different canonical-form bytes.

### Construction and Resolution

Construction and resolution of required Evidence expectations SHALL fail closed on: an empty set; an unknown or unauthorized variant; a missing or structurally empty required field on a variant that declares one, including a `RequiredEvidenceType` with a missing or empty Evidence Type identity or version; an exact duplicate clause (identical complete encoded bytes); `NoAdditionalExpectation` declared together with any other variant; more than one `RequiredExactContent` clause; more than one `RequiredEvidenceCount` clause; a `RequiredExactContent` classification token outside the closed three-value set; or a `RequiredEvidenceCount.minimumCount` that is not a positive integer. Construction and resolution SHALL NOT fail on account of a well-formed `RequiredEvidenceType` reference that no RFC-0002 registry recognizes — no such registry is assumed to exist, and a well-formed reference matched by no baseline item is a matter for § Evidence Expectation Enforcement's disposition rule (expectation-mismatch), not for construction.

## Assessment Criteria Set Fingerprint

Per criterion, the fingerprint SHALL include, in this canonical field order:

1. `AssessmentCriterionId`;
2. the inline criterion definition canonical bytes OR the complete canonical exact immutable criterion reference tuple;
3. the canonical applicability form (below);
4. sorted supporting authority references;
5. the canonical Required Evidence Expectations form: the expectation-set cardinality, encoded as one length-framed canonical unsigned decimal ASCII field, followed by each complete `EvidenceExpectation` clause — per § Required Evidence Expectations — Canonical Encoding — individually length-framed and sorted ascending by its own complete encoded bytes;
6. verification threshold — the exact RFC-0002 v1.3 canonical `EvidenceVerificationStatus` ASCII string;
7. confidence threshold — the exact RFC-0002 v1.3 canonical `ConfidenceClassification` ASCII string.

The canonical applicability form SHALL be:

- `AllSubjectElements` → the literal token `AllSubjectElements`;
- `SubjectElementsOfKind` → the token `SubjectElementsOfKind` followed by the exact `canonicalKind`;
- `ExactSubjectElementSet` → the token `ExactSubjectElementSet` followed by the element references sorted ascending by reference identity, each length-framed;
- `SubjectWide` → the literal token `SubjectWide`.

The applicability declaration participates in the fingerprint completely; no component is omitted.

Protocol: UTF-8 encoding; unambiguous length framing of every field and every collection element; criteria sorted ascending by `AssessmentCriterionId`; SHA-256; lowercase hexadecimal output. `AssessmentCriterionId` is included as a stable authored identity; system-generated record identifiers and all timestamps are excluded.

Fingerprint inputs 5, 6, and 7 SHALL use the canonical encodings defined in § Required Evidence Expectations and RFC-0002 v1.3 directly, with no additional transformation, case-folding, whitespace handling, or re-encoding beyond what those definitions themselves specify. Fingerprint input 5's expectation-set cardinality SHALL be encoded as one length-framed canonical unsigned decimal ASCII field, followed by each per-clause length-framed complete encoded clause (§ Required Evidence Expectations — Canonical Encoding); this envelope is explicit and SHALL NOT be inferred from the generic collection-framing rule above; equivalent expectation sets SHALL produce identical fingerprint input 5 bytes regardless of declaration order, and a different cardinality, variant, or field content SHALL produce different bytes.

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

This section applies only to Assessment Coverage dispositions, which exist only for `CorpusReviewBasis` subjects. This section does not apply to, and does not add any normative requirement for, `ExecutableMissionPlan` or `ProposedPlanRevision` assessments; their existing behavior is unchanged.

### Common Validity Preconditions

For every coverage pair, the following are common preconditions, evaluated before any disposition is assigned:

- the baseline qualifying Evidence set (§ Required Evidence Expectations — Baseline Qualifying Evidence Set) resolves without ambiguity, conflict, or unresolved reference, and without any correlated item resolving to malformed Provenance — a malformed item aborts the pair unconditionally to `UnableToEvaluate`, per § Required Evidence Expectations — Baseline Qualifying Evidence Set, regardless of other valid items present;
- where the criterion requires exact-content Evidence, the applicable RFC-0002 v1.3 Exact Content Evidence integrity rules (`representedContentReference`, content-representation classification, `contentDigestAlgorithm`, `contentDigest`, and, for DerivedContent, unambiguous resolution to valid SnapshotContent Evidence) are satisfied by every baseline item read-only.

### Disposition Rules

- **`Satisfied`** — the common validity preconditions hold, the baseline qualifying Evidence set is non-empty, every declared `EvidenceExpectation` clause is satisfied (§ Required Evidence Expectations — Matching Semantics), and every item in the baseline qualifying Evidence set individually satisfies both the required verification-status threshold and the required confidence threshold (§ Threshold Aggregation (RFC-0002 v1.3), below).
- **`FindingProduced`** — the common validity preconditions hold and the baseline qualifying Evidence set is non-empty, but at least one declared `EvidenceExpectation` clause is not satisfied (expectation-mismatched, including a well-formed `RequiredEvidenceType` reference matched by no baseline item), or at least one baseline item is rankable but weaker than a required threshold while no baseline item is unrankable or malformed (§ Threshold Aggregation (RFC-0002 v1.3), below). The Finding SHALL record the exact failing clause, or every failing `(EvidenceId, EvidenceVersion, actual value, required threshold)` comparison, and SHALL declare an affected-target variant matching the originating coverage pair's scope (§ Assessment Coverage (Corpus-scoped), § Finding Affected Target (Corpus-scoped)).
- **`UnableToEvaluate`** — the required evaluation cannot be established. This includes: the baseline qualifying Evidence set is empty; Evidence is ambiguous, conflicting, cross-Mission, cross-element, represented-content-mismatched, digest-mismatched, or unresolved-derivation; any baseline item has UNRANKABLE confidence (absent, per RFC-0002 v1.3 § Evidence Confidence); any baseline item has UNRANKABLE verification status (a valid, marker-less legacy Provenance representation, per RFC-0002 v1.3 § Verification Status Semantics Marker — Legacy/Governed Distinction); or any purported Consumed Evidence item correlated to the pair resolves to malformed Provenance, which unconditionally aborts the pair regardless of other valid items present (§ Required Evidence Expectations — Baseline Qualifying Evidence Set). `UnableToEvaluate` SHALL carry an attributable reason distinguishing which of these applied, per § Assessment Coverage (Corpus-scoped), line 333, and, for the confidence/verification-status cases, per § Threshold Aggregation (RFC-0002 v1.3), below. A well-formed `RequiredEvidenceType` reference matched by no baseline item is NOT a reason for `UnableToEvaluate`; it is a `FindingProduced` expectation-mismatch, above.
- **`NotApplicable`** — unchanged. Remains governed exclusively by the existing § Assessment Coverage (Corpus-scoped) applicability rules; not addressed by this amendment.

No Evidence is required to simultaneously satisfy and fail the same expectation or threshold: `Satisfied` requires every clause and every baseline item's thresholds to succeed; `FindingProduced` requires the baseline set to exist and resolve validly, with at least one clause or threshold determinately failing and no baseline item unrankable or malformed; `UnableToEvaluate` requires that the required evaluation itself cannot be established. These three conditions are mutually exclusive by construction.

## Threshold Aggregation (RFC-0002 v1.3)

"Satisfy the required confidence threshold" and "satisfy the required verification-status threshold" SHALL mean satisfaction exactly as defined by RFC-0002 v1.3 § Evidence Confidence and § Evidence Verification Status respectively: a baseline item's declared classification or verification status equals the criterion's required threshold, or is strictly stronger than it, under RFC-0002 v1.3's normative total ordering. RFC-0006 consumes this ordering and satisfaction rule read-only and does not redefine, reorder, or override either.

**The following rule governs the whole baseline qualifying Evidence set and supersedes any reference elsewhere in this specification to "the relevant baseline Evidence":**

> Every item in the baseline qualifying Evidence set SHALL possess rankable confidence and rankable verification status and SHALL individually satisfy both required thresholds for the Coverage disposition to be `Satisfied`. If at least one baseline item is rankable but weaker than either threshold, and no item is unrankable or malformed, the result is a determinate failure and the disposition SHALL be `FindingProduced`. The Finding SHALL record every failing `(EvidenceId, EvidenceVersion, actual value, required threshold)` comparison. If any baseline item has unrankable confidence or valid legacy-opaque unrankable verification status, or any purported Consumed Evidence item for the pair has malformed Provenance, the required evaluation cannot be established and the disposition SHALL be `UnableToEvaluate`.

### Unrankable Versus Malformed Verification Status

RFC-0006 SHALL distinguish two verification-status failure modes:

- **UNRANKABLE verification status**: a baseline item's Provenance reconstitutes successfully as a valid, marker-less legacy representation. The item is resolvable and remains in the baseline set, but its verification status carries no rank and SHALL NOT satisfy any threshold. Per the rule above, the disposition SHALL be `UnableToEvaluate`.
- **Malformed verification status**: a correlated purported item's persisted Provenance representation is malformed per RFC-0002 v1.3 (an unknown or empty marker, a governed marker paired with an out-of-vocabulary status, a missing status, or any other invalid combination). Provenance reconstitution fails closed and produces no Provenance value. Per § Required Evidence Expectations — Baseline Qualifying Evidence Set, this unconditionally aborts the coverage pair's evaluation to `UnableToEvaluate`, regardless of whether other baseline items would otherwise be valid and sufficient.

Both failure modes converge on `UnableToEvaluate`. RFC-0006 SHALL record and explain them as the distinct failure modes defined above, consistent with § Explainability; one SHALL NOT be reported or attributed as the other.

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
- enforces required Evidence expectations against the closed, RFC-0006-owned, four-variant `EvidenceExpectation` vocabulary — with `RequiredEvidenceType` as an exact identity/version equality constraint requiring no RFC-0002 registry — evaluated deterministically over the baseline qualifying Evidence set, including read-only RFC-0002 v1.3 exact-content equality, before any `Satisfied` disposition
- binds the required confidence threshold and required verification-status threshold to RFC-0002 v1.3's closed `ConfidenceClassification` and `EvidenceVerificationStatus` vocabularies, and requires every item in the baseline qualifying Evidence set to individually satisfy both thresholds before `Satisfied`
- distinguishes UNRANKABLE verification status from malformed verification status, and routes any malformed-Provenance item to `UnableToEvaluate` unconditionally, regardless of other valid baseline items present, attributing each failure mode to its own explainable reason
- separates common Evidence-validity preconditions from the `Satisfied`/`FindingProduced`/`UnableToEvaluate` disposition rule, never requiring the same Evidence to simultaneously satisfy and fail a declared expectation or threshold, and routes a baseline containing at least one rankable-but-insufficient item (with none unrankable or malformed) and expectation-mismatched Evidence to `FindingProduced`, recording every failing comparison, with `UnableToEvaluate` reserved strictly for cases where the required evaluation cannot be established
- confines all of the above to `CorpusReviewBasis` assessments, leaving `ExecutableMissionPlan` and `ProposedPlanRevision` assessment behavior byte-for-byte unchanged
- encodes Assessment Criteria Set fingerprint input 5 with an explicit collection envelope — the expectation-set cardinality encoded as one length-framed canonical unsigned decimal ASCII field, followed by each per-clause length-framed complete encoded clause — producing identical bytes for equivalent expectation sets regardless of declaration order and different bytes for any difference in cardinality, variant, or field content
- records Execution attribution conditionally, never fabricating an Execution Session for a direct Human assessment, and never treating an Adapter as evaluator origin
- for a `CorpusReviewBasis` subject, records the exact RFC-0003 Projection identity and Projection Version, permits snapshot-preserving completion against a stale-but-exactly-resolvable bound Projection, and never treats staleness alone as a fail-closed condition
- applies Corpus-scoped Coverage, Finding affected targets, and Projection recording only to `CorpusReviewBasis` assessments, leaving Plan-Revision assessment behavior unchanged

Failure to satisfy these guarantees constitutes non-conformance with this specification.

---

# Amendment History

- v1.0 — Final.
- v1.1 — Amended by `NEXUS-RAT-2026-07-17-016`. Originates from `NEXUS-REV-2026-07-17-014-F-002` and `NEXUS-REV-2026-07-17-016-F-003` (Category 6, Observation): the implementation-layer `Review` model's revision-under-assessment field was an untyped, opaque string, ambiguously reused to reference either an RFC-0001 executable Mission Plan revision or an RFC-0012 Proposed Plan Revision, flagged as a risk to Sprint 76 (Approved Plan Activation), which treats this exact correlation as a precondition for an irreversible conversion into executable state. Corrects the Assessment Session's Mission Plan Revision record to an explicit, discriminated `ReviewPlanRevisionReference` (`kind: ExecutableMissionPlan | ProposedPlanRevision`, `revisionId`). No other RFC-0006 concept, lifecycle, or outcome is amended.
- v1.2 — Amended by `NEXUS-RAT-2026-07-18-006`. Generalizes the Assessment Session subject to an `AssessmentSubjectReference` with exactly three discriminants (`ExecutableMissionPlan`, `ProposedPlanRevision`, `CorpusReviewBasis`), retaining `ReviewPlanRevisionReference` as a deprecated backward-compatible narrow alias; **no discriminator value is renamed, replaced, or re-encoded, and the two pre-existing values and their wire representation remain byte-for-byte unchanged**. Adds an exact `AssessmentCriterion` / non-empty Assessment Criteria Set identity-version-fingerprint model with a complete immutable criterion-reference contract, explicit inline-definition canonicalization (NFC, LF, outer-trim, UTF-8), a closed four-variant declarative applicability vocabulary, and a canonical SHA-256 fingerprint protocol; a Corpus-scoped Assessment Coverage universe formed as the union of the element-scoped Cartesian product and exactly one subject-wide pair per `SubjectWide` criterion; a closed Corpus-scoped Finding affected-target model (`SubjectElementTarget` / `AssessmentSubjectTarget`); Evidence-expectation enforcement consuming RFC-0002 v1.1 Exact Content Evidence read-only; conditional Execution attribution; and a Corpus-scoped recorded RFC-0003 Projection basis with snapshot-preserving completion under which staleness alone is never a fail-closed condition. No Assessment Outcome value, Finding Severity, or Finding Intent is changed. RFC-0005 and RFC-0012 dependencies are preserved unmodified, and RFC-0002 v1.1, RFC-0008, and RFC-0012 are recorded explicitly. Projection Freshness remains owned by RFC-0003 and is consumed, not redefined. Corpus-scoped Coverage, the Finding affected-target model, and Projection recording apply only to `CorpusReviewBasis` assessments; Plan-Revision assessment behavior is unchanged. The `CorpusReviewBasis` subject variant, the `SubjectWide` applicability variant, Corpus-scoped Coverage, the Finding affected-target model, and the recorded Projection basis remain **dormant and unusable** until `NEXUS-RAT-2026-07-18-008` authorizes RFC-0013 Draft v0.6. Conditional Execution Attribution is a normative change whose implementation is deferred and separately authorized. Specification text only; no implementation, no Sprint, no Initial Capability Sequence.
- v1.3 — Amended by `NEXUS-RAT-2026-07-21-002`. Closes the `required Evidence expectations` field to an RFC-0006-owned, closed, declarative, non-executable four-variant vocabulary (`NoAdditionalExpectation`, `RequiredEvidenceType`, `RequiredExactContent`, `RequiredEvidenceCount`); `RequiredEvidenceType` is an exact immutable identity/version equality constraint requiring no RFC-0002 registry — no such registry is assumed to exist, and a well-formed reference matched by no baseline item is a determinate expectation-mismatch (`FindingProduced`), never `UnableToEvaluate`. Defines a per-coverage-pair baseline qualifying Evidence set and deterministic set-level matching, with a fully enveloped canonical fingerprint encoding for input 5: the expectation-set cardinality encoded as one length-framed canonical unsigned decimal ASCII field, followed by each complete encoded clause independently length-framed and sorted by its own complete encoded bytes, with exact duplicates rejected before sorting. Binds `AssessmentCriterion`'s required confidence threshold and required verification-status threshold fields to RFC-0002 v1.3's closed, totally ordered `ConfidenceClassification` and `EvidenceVerificationStatus` vocabularies, consumed read-only, with canonical fingerprint encoding for inputs 6 and 7. Establishes deterministic per-item threshold aggregation over the entire baseline qualifying Evidence set: every baseline item must individually satisfy both thresholds for `Satisfied`; a baseline with at least one rankable-but-insufficient item, and none unrankable or malformed, is a determinate `FindingProduced` recording every failing `(EvidenceId, EvidenceVersion, actual value, required threshold)` comparison; a baseline with any unrankable item, or any correlated malformed-Provenance item, is `UnableToEvaluate`. Malformed Provenance aborts a coverage pair's evaluation to `UnableToEvaluate` unconditionally, regardless of other valid baseline items present, and is distinguished from legacy-opaque unrankable verification status as separately explainable failure modes throughout baseline construction, common validity preconditions, disposition rules, and threshold semantics. Routes expectation-mismatched Evidence, including an unmatched well-formed `RequiredEvidenceType` reference, to `FindingProduced` with a matching-scope affected-target Finding. Applies only where `AssessmentSubjectReference.kind` is `CorpusReviewBasis`, exactly as in v1.2; `ExecutableMissionPlan` and `ProposedPlanRevision` assessment behavior is byte-for-byte and semantically unchanged. Synchronizes RFC-0006's live `RFC-0002 v1.1` Exact Content Evidence citations (§ Dependencies, § Evidence Expectation Enforcement, § Conformance) to `RFC-0002 v1.3`, the current RFC-0002 document version, with no semantic change to that consumption; historical Amendment History entries citing `RFC-0002 v1.1` are left untouched as an accurate historical record. No `AssessmentCriterion Applicability` variant, `Assessment Outcome` value, `Finding Severity`, `Finding Intent`, Coverage universe rule, RFC-0002 Evidence Relationships concept, or universal RFC-0002 Evidence Type registry is otherwise changed, referenced, or assumed. Specification text only; no implementation, no Sprint activation authorized.
