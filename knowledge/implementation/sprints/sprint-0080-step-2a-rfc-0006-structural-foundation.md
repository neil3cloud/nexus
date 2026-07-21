# Sprint 80 — Milestone 12 Initial Capability Sequence Step 2A — RFC-0006 v1.3 Structural Foundation

## Status

Approved and fully closed under `NEXUS-REV-2026-07-22-002` (both findings from `NEXUS-REV-2026-07-22-001`
resolved; zero remaining findings). Activated by `NEXUS-RAT-2026-07-21-007`, per the Sprint 80 Proposal
Revision 7 (Sprint Owner Final Owner Review: APPROVE). Milestone 12 — Corpus Review and Implementation
Readiness, Initial Capability Sequence Step 2A, established by `NEXUS-RAT-2026-07-21-006` (Milestone 12 sequence
amendment), between Corrective Prerequisite 1A (Sprint 79, Approved and fully closed under
`NEXUS-REV-2026-07-21-002`) and Step 3.

**Authority note.** This governed Sprint Implementation Record is the durable and authoritative delivery
contract for Sprint 80, per `NEXUS-RAT-2026-07-21-007`. Every binding text — the full pure evaluation contract,
the complete Acceptance Criteria, and the exact sixteen-file forecasted inventory — is reproduced in full below
from the Sprint 80 Proposal Revision 7; nothing in this record depends on an external scratchpad file.

---

# Objective

Implement the structural types, deterministic canonicalization, immutable value models, pure Coverage
operations, and pure evaluation result required by RFC-0006 v1.3, exactly as scoped by
`NEXUS-RAT-2026-07-21-006`, with zero change to any existing Review runtime path.

---

# RFC Coverage

## Primary RFC Coverage

- RFC-0006 v1.3 — Engineering Assessment Model — structural definitions only: `AssessmentSubjectReference`
  (lines 160–178); `AssessmentCriterion`/`AssessmentCriteriaSet` and its SHA-256 fingerprint protocol (lines
  201–333); `AssessmentCriterionApplicability` (lines 247–258); `EvidenceExpectation` (lines 260–306);
  `AssessmentCoverage` (lines 375–393); `FindingAffectedTarget` (lines 354–371); `evaluateCoveragePair`
  implementing §§ Evidence Expectation Enforcement / Threshold Aggregation (lines 395–432) and § Assessment
  Criterion Applicability's selection semantics (lines 247–258). The exact function name `evaluateCoveragePair`
  is binding; no alternative naming or deviation recording is authorized for this identifier.

## Secondary RFC Coverage (consumed read-only)

- RFC-0002 v1.3 — Evidence Model: `ConfidenceClassification` and `EvidenceVerificationStatus` (implemented
  Sprint 79), and Exact Content Evidence integrity rules (implemented Sprint 78). RFC-0006 v1.3 does not
  redefine, reorder, or re-encode either vocabulary (RFC-0006 v1.3 line 213, line 417). No RFC-0002 file is
  modified; no new RFC-0002 concept is implemented.

## Structurally Referenced, Not Implemented

- RFC-0013 — Corpus Review Model, Final v1.0. The `CorpusReviewBasis` discriminant carries an opaque
  `basisFingerprint` field only. No RFC-0013 Corpus Artifact Reference identity semantics, `CorpusReview`
  aggregate, Scope, Contract, or Basis-construction concept is implemented.

## Not in Coverage

RFC-0003, RFC-0005.

## Ratification References

- `NEXUS-RAT-2026-07-19-006` — establishes the binding, planning-only Initial Capability Sequence.
- `NEXUS-RAT-2026-07-21-006` — amends the sequence to insert Step 2A (this Sprint's scope) and Step 3A; six
  explicit prohibitions; Step 3A's four independent stop conditions.
- `NEXUS-RAT-2026-07-21-007` — this Sprint's own activation ratification.

---

# Implementation Scope

## Planned Scope

### Authorized Vertical Slice (verbatim, from `NEXUS-RAT-2026-07-21-006`)

> Scoped exclusively to structural types, deterministic canonicalization, immutable value models, pure
> Coverage operations, and the pure evaluation result: `AssessmentSubjectReference` (three discriminants;
> defined in a new standalone file, leaving the existing `ReviewPlanRevisionReference` declaration in
> `review.types.ts` completely untouched — its conversion to a derived alias is Step 3A's responsibility);
> `AssessmentCriterion`/`AssessmentCriteriaSet` and its SHA-256 fingerprint protocol; the closed four-variant
> `AssessmentCriterionApplicability` and `EvidenceExpectation` vocabularies with canonical encoding;
> `AssessmentCoverage`'s pure universe-computation and disposition-recording operations; `FindingAffectedTarget`'s
> type (definable, not wired to live `Finding`); `evaluateCoveragePair` as a pure function.

### Explicitly and Exhaustively Prohibited (verbatim, all six)

1. Modifying `Review`, `ReviewSnapshot`, or `StartReviewCommand`.
2. Any change to `review.events.ts`.
3. Any Review-related host/service/repository wiring change.
4. Any runtime Corpus Assessment entry point.
5. Constructing, persisting, completing, or publishing Findings from a `CorpusReviewBasis` Review.
6. Re-exporting any Step 2A symbol from `review.contract.ts` or any `index.ts` runtime barrel.

### Dependencies

Depends on Step 1 (Sprint 78) and Corrective Prerequisite 1A (Sprint 79) only. Does not depend on, and does
not implement any part of, Step 3, Step 3A, or any RFC-0003/RFC-0005/RFC-0013 concept.

### Binding Construction/Reconstitution Contract — The Pure Evaluation Contract (from `NEXUS-RAT-2026-07-21-007`, Sprint 80 Proposal Revision 7)

#### Opaque Identity Types

- **`SubjectElementReference`** — opaque, immutable identity type used wherever RFC-0006 v1.3 refers to a
  Corpus Artifact Reference in an element-scoped context. Non-empty, structurally comparable for exact
  equality, and deterministically bytewise-orderable. No RFC-0013 identity semantics are assigned; no live
  resolution occurs.
- **`CanonicalSubjectElementKind`** — opaque, immutable identity type used for `SubjectElementsOfKind`'s
  `canonicalKind` field and for the canonical kind recorded per element. Non-empty, structurally comparable for
  exact equality, and deterministically bytewise-orderable. No RFC-0013 resolution semantics are assigned.
- **`CorpusReviewBasisFingerprint`** — opaque, immutable, non-empty fingerprint value type for a
  `CorpusReviewBasis`'s exact fingerprint. Structurally comparable for exact equality only.

Both `SubjectElementReference` and `CanonicalSubjectElementKind` fail closed on empty/structurally malformed
construction. Step 2A assigns neither type any RFC-0013 resolution semantics.

#### `StructuralSubjectElementDescriptor`

```
{
  subjectElementReference: SubjectElementReference;
  canonicalKind: CanonicalSubjectElementKind;
}
```
Both fields required and non-empty; construction fails closed otherwise.

#### `AssessmentCoveragePair` — closed, immutable pair identity

```
type AssessmentCoveragePair =
  | {
      kind: "SubjectElementPair";
      subjectElement: StructuralSubjectElementDescriptor;
      assessmentCriterionId: AssessmentCriterionId;
    }
  | {
      kind: "AssessmentSubjectPair";
      basisFingerprint: CorpusReviewBasisFingerprint;
      assessmentCriterionId: AssessmentCriterionId;
    };
```
This is the sole pair-identity representation used throughout this Sprint. The two `kind` variants are
mutually exclusive and exhaustive. Two `AssessmentCoveragePair` values are equal exactly when they are
structurally equal (same `kind` and same field values) — the contract has no notion of, and makes no claim
about detecting, distinct allocation/construction origin for structurally identical values.

#### `AssessmentCoverage.open()` — universe construction

```
AssessmentCoverage.open(
  basisFingerprint: CorpusReviewBasisFingerprint,
  elements: readonly StructuralSubjectElementDescriptor[],
  criteria: AssessmentCriteriaSet
): AssessmentCoverage
```

Behavior:
- The returned `AssessmentCoverage` retains, as immutable state: `basisFingerprint`; `criteria` as an
  immutable `AssessmentCriteriaSet` value (not a caller-owned mutable reference); and the computed, immutable
  universe of `AssessmentCoveragePair` values, each initially undispositioned. This retained state is what
  later `evaluateCoveragePair` and `recordDisposition` calls resolve against — never an independently
  caller-supplied value.
- Universe = (a) one `SubjectElementPair` for every `(element, criterion)` combination where `element` is drawn
  from `elements` and `criterion` is every element-scoped criterion in `criteria` — created **regardless of
  whether that criterion's applicability would select that element**; selection is evaluated later by
  `evaluateCoveragePair` using the pair's own stored fields; ∪ (b) exactly one `AssessmentSubjectPair` per
  `SubjectWide` criterion in `criteria`, carrying the retained `basisFingerprint`.
- Every pair starts undispositioned. Pairs in (a) whose applicability would not select them remain in the
  universe (eligible for a later `NotApplicable` disposition) rather than being omitted.

**Fail-closed construction rules for `open()`:**
- `basisFingerprint` is empty or structurally malformed.
- Any `StructuralSubjectElementDescriptor` in `elements` has an empty/malformed `subjectElementReference` or
  `canonicalKind`.
- The same `SubjectElementReference` occurs more than once within `elements` (even with an identical
  `canonicalKind`).
- Two descriptors in `elements` declare the same `SubjectElementReference` with different `canonicalKind`
  values.
- `criteria` contains a duplicate `AssessmentCriterionId`.
- Any resulting `AssessmentCoveragePair` identity would be duplicated in the computed universe.

**Deterministic pair ordering:** `SubjectElementPair` values ascending first by
`subjectElement.subjectElementReference`'s bytewise order, then by `assessmentCriterionId`'s bytewise order —
precede `AssessmentSubjectPair` values ascending by `assessmentCriterionId`'s bytewise order. The two `kind`
variants are never interleaved. This order is independent of `elements`/`criteria` declaration order.

#### `evaluateCoveragePair` — signature and contract

```
evaluateCoveragePair(
  coverage: AssessmentCoverage,
  pair: AssessmentCoveragePair,
  baselineResolution: BaselineResolutionResult
): CoveragePairEvaluationOutcome
```
`BaselineResolutionResult` is either one Precondition-Failure Vocabulary value (below), or a non-empty,
duplicate-free set of Structural Evidence Descriptors (below). Equivalent parameter-object syntax carrying the
same three logical inputs is acceptable; the exact function name `evaluateCoveragePair` is binding regardless
of parameter-passing style.

`evaluateCoveragePair` SHALL:
- verify `pair` is structurally equal to a pair present in `coverage`'s universe; fail closed if `pair` is
  absent from `coverage`;
- resolve the applicable `AssessmentCriterion` exclusively by looking up `pair.assessmentCriterionId` within
  `coverage`'s retained, immutable `criteria`. The function signature carries no separate criterion parameter;
- use only the `subjectElement` or `basisFingerprint` stored on `pair` itself for selection determination and
  target-construction data;
- fail closed on a `pair` whose stored fields (element reference, canonical kind, Basis fingerprint, or
  criterion identity) do not structurally match any pair actually present in `coverage`'s universe. A `pair`
  value structurally identical to one already in the universe is accepted regardless of separate construction
  origin — only structural difference is detectable and only structural difference is rejected;
- remain pure: no repository access, no live-domain resolution; two calls given structurally identical
  `coverage`, `pair`, and `baselineResolution` arguments SHALL produce identical results.

#### Selection determination

- `AllSubjectElements` — every `SubjectElementPair` is selected.
- `SubjectElementsOfKind` — selected iff the pair's stored `subjectElement.canonicalKind` is structurally equal
  to the applicability's declared `canonicalKind`.
- `ExactSubjectElementSet` — selected iff the pair's stored `subjectElement.subjectElementReference` is a
  structural member of the applicability's declared set.
- `SubjectWide` applies only to `AssessmentSubjectPair`, always selected by construction (RFC-0006 v1.3 line
  383).

No live resolution of a `SubjectElementReference` or `canonicalKind` against a real subject occurs (deferred to
Step 3A, RFC-0006 v1.3 line 258).

#### Exact-Content Qualification (closed union, no contradictory states)

- `NotExactContent` — the item does not qualify as RFC-0002 Exact Content Evidence. No field.
- `QualifiedSnapshotContent` — qualifies with RFC-0002's `SnapshotContent` classification. No field.
- `QualifiedDerivedContent` — qualifies with RFC-0002's `DerivedContent` classification. No field.

No fourth combination is constructible (RFC-0006 v1.3 line 266, line 289).

#### Structural Evidence Descriptor

A resolved baseline item carries: `EvidenceId`, `EvidenceVersion`; Evidence Type identity and version (line
265); `ConfidenceClassification`; `EvidenceVerificationStatus`; the Exact-Content Qualification union. A
baseline set is constructed only from distinct `(EvidenceId, EvidenceVersion)` pairs; duplicate pairs fail
closed construction (line 271).

#### Precondition-Failure Vocabulary

`UnresolvedReference` (line 403) and `UnresolvedDerivation` (line 410, line 266) are textually distinct and
SHALL NOT be conflated. Complete list, drawn from RFC-0006 v1.3 lines 403–410:

- `EmptyBaseline` — no field.
- `Ambiguous` — non-empty set of conflicting `(EvidenceId, EvidenceVersion)` references.
- `Conflicting` — non-empty set of conflicting `(EvidenceId, EvidenceVersion)` references.
- `CrossMission` — offending `(EvidenceId, EvidenceVersion)`, expected Mission identity, actual Mission
  identity.
- `CrossElement` — offending `(EvidenceId, EvidenceVersion)`, expected `SubjectElementReference`, actual
  element reference.
- `UnresolvedReference` — the `(EvidenceId, EvidenceVersion)` reference that failed to resolve.
- `RepresentedContentMismatched` — offending `(EvidenceId, EvidenceVersion)`, expected/actual
  `representedContentReference`.
- `DigestMismatched` — offending `(EvidenceId, EvidenceVersion)`, expected/actual
  `contentDigestAlgorithm`/`contentDigest`.
- `UnresolvedDerivation` — offending `(EvidenceId, EvidenceVersion)`, unresolved derivation-source
  reference(s).
- `UnrankableConfidence` — offending `(EvidenceId, EvidenceVersion)`.
- `UnrankableVerificationStatus` — offending `(EvidenceId, EvidenceVersion)`.
- `MalformedProvenance` — offending `(EvidenceId, EvidenceVersion)` (unconditional pair-abort, line 279, line
  403).

#### Result — two distinct types, strictly separated

**`CoveragePairEvaluationOutcome`** (returned by `evaluateCoveragePair`; non-persistable):
- `Satisfied` — no field.
- `FindingRequired` — non-empty, duplicate-free failure-record list (every failure retained, line 421), plus
  target-construction data derived from the pair's own stored fields — data only, not a constructed
  `FindingAffectedTarget`, not tied to any real Finding.
- `NotApplicable` — non-empty, pair-tied explanation and the exact applicability declaration relied upon.
  Fails closed on an empty or pair-independent explanation.
- `UnableToEvaluate` — exactly one Precondition-Failure Vocabulary value with its structured payload.

**`CoverageDisposition`** (accepted by `AssessmentCoverage.recordDisposition`; the recordable value RFC-0006
v1.3 stores, line 385):
- `Satisfied`, `NotApplicable`, `UnableToEvaluate` — structurally identical to the corresponding outcome
  variants.
- `FindingProduced` — carries **only** a structurally valid, non-empty exact `Finding` reference. No
  affected-target data. `recordDisposition` performs only structural non-empty-shape validation; it makes no
  claim the reference is real, existing, owned, or target-matched — unverified until Step 3A.

No function in this Sprint converts a `FindingRequired` outcome into a `FindingProduced` disposition. Both
result types are separately mutually exclusive by construction; no conversion function between them exists.

#### `AssessmentCoverage.recordDisposition()`

```
recordDisposition(
  pair: AssessmentCoveragePair,
  disposition: CoverageDisposition
): AssessmentCoverage
```
Instance method bound to `this` Coverage's retained state. Pure: returns a new immutable `AssessmentCoverage`;
receiver unchanged. Fails closed when: `pair` is not structurally equal to a universe pair; `pair` already
carries a disposition; `disposition` is `NotApplicable` and the pair's resolved applicability *does* select it,
or the pair is an `AssessmentSubjectPair` (line 387); `disposition` is `NotApplicable` with an empty or
pair-independent explanation; `disposition` is `FindingProduced` without a structurally valid, non-empty exact
Finding reference.

---

# Implemented Scope

Implemented by the Builder:

- The exact eight authorized source files under `src/kernel/review/`:
  `assessment-subject-reference.ts`, `subject-element-reference.ts`,
  `assessment-criterion-applicability.ts`, `evidence-expectation.ts`,
  `assessment-criterion.ts`, `assessment-coverage.ts`, `finding-affected-target.ts`, and
  `evaluate-coverage-pair.ts`.
- The exact eight mirrored test files under `test/kernel/review/`.
- RFC-0006 v1.3 Step 2A structural-only scope: `AssessmentSubjectReference`, opaque subject-element and Basis
  fingerprint identity types, `AssessmentCriterionApplicability`, `EvidenceExpectation`, `AssessmentCriterion`,
  `AssessmentCriteriaSet`, `AssessmentCoverage`, `FindingAffectedTarget`, and pure `evaluateCoveragePair()`.

No existing Review runtime path was modified. No Step 3, Step 3A, RFC-0003, RFC-0005, or RFC-0013 runtime
concept was implemented.

---

# Deferred Concepts

- Conversion of `ReviewPlanRevisionReference` into an `AssessmentSubjectReference` derived alias — Step 3A.
- All runtime `Review.create`/`fromSnapshot` handling of a `CorpusReviewBasis` subject — Step 3A.
- Real resolution of the baseline qualifying Evidence set against a live Basis/Projection — Step 3A.
- Constructing a real `Finding` from a `FindingRequired` outcome, obtaining the reference a `FindingProduced`
  disposition requires, resolving that reference, and verifying target match — Step 3A.
- Live resolution/recognition of a `SubjectElementReference` or `CanonicalSubjectElementKind` against a real
  subject — Step 3A.
- Resolution authority for the Exact Immutable Criterion Reference (existence, mutability, supersession,
  ambiguity, fingerprint matching against a real external artifact) — Step 3A.
- Any RFC-0013 `CorpusArtifactReference` identity semantics, or resolution of `SubjectElementReference` against
  a real RFC-0013 Corpus Artifact Reference — Step 3 (identity semantics) and Step 3A (resolution).
- Any RFC-0013 `CorpusReview` aggregate concept (Step 3, not this Sprint).

## Deferred RFC Ownership (Step 3A's four independent stop conditions, unchanged from `NEXUS-RAT-2026-07-21-006`)

1. An independently ratified RFC-0003-owned durable Projection identity/version resolution contract.
2. An independently ratified RFC-0005-owned discriminated assessment-subject attribution contract.
3. An authoritative RFC-0006-owned Finding severity/intent derivation rule (Severity and Intent only — RFC-0006
   v1.3 defines no Finding Category concept).
4. An exact RFC-0006 consumer contract for Basis resolution and snapshot migration, evaluated against
   RFC-0013's owned Corpus Review Basis and snapshot lineage.

None of the four is resolved by this Sprint.

---

# Known Limitations

- `evaluateCoveragePair` and `AssessmentCoverage` operate exclusively on caller-supplied, pre-resolved
  structural values; they cannot themselves detect that a real Basis, Projection, or Evidence record was
  misrepresented by the caller — that resolution authority is Step 3A's.
- `FindingAffectedTarget` and `AssessmentCoveragePair`'s `SubjectElementReference`/`basisFingerprint` fields are
  opaque; this Sprint assigns them no RFC-0013 identity semantics, so no test in this Sprint can distinguish a
  well-formed opaque reference from one that would fail to resolve against a real Corpus.
- `CoverageDisposition.FindingProduced`'s Finding reference is validated only for non-empty structural shape;
  its existence, ownership, and target match to the originating pair remain unverified until Step 3A.

---

# Acceptance Criteria

## General

1. TypeScript compiles; ESLint passes; full Vitest suite passes.
2. `git diff` against every pre-existing file under `src/kernel/review/` — `review.types.ts`,
   `review.aggregate.ts`, `review.contract.ts`, `review.events.ts`, `review.service.ts`, `review.repository.ts`,
   `review.errors.ts`, `review-criteria.ts`, `review-values.ts`, `review-id.ts`, `finding.ts`, `finding-id.ts`,
   and `README.md` — plus `src/kernel/common/create-kernel-services.ts`, every host wiring file, and every
   `index.ts` runtime barrel, shows **zero** changes (byte-identical).
3. No new symbol from this Sprint is imported by any file outside `src/kernel/review/` or its own new test
   files.
4. No `index.ts` runtime barrel gains a new export as a result of this Sprint.

## `AssessmentSubjectReference`

5. Exactly the three wire discriminants `ExecutableMissionPlan`, `ProposedPlanRevision`, `CorpusReviewBasis`
   are constructible; no fourth variant exists (line 160–164).
6. The two existing discriminator values and their wire representation are preserved byte-for-byte relative to
   `ReviewPlanRevisionReference`'s current representation (line 172), verified without importing or modifying
   `review.types.ts`.
7. `CorpusReviewBasis` requires a non-empty opaque `basisFingerprint`; empty/missing construction fails closed.
8. An unknown discriminator value fails closed (line 168).
9. No test or implementation file in this Sprint imports, modifies, or depends on `ReviewPlanRevisionReference`.

## Opaque identity types

10. `SubjectElementReference` and `CanonicalSubjectElementKind` each fail closed on empty/structurally
    malformed construction.
11. Both types support exact structural equality and a deterministic bytewise total order, verified by tests
    asserting reflexive/symmetric/transitive equality and a stable sort over a fixture set.
12. `CorpusReviewBasisFingerprint` fails closed on empty/malformed construction and supports exact structural
    equality.

## `AssessmentCriteriaSet` / fingerprint

13. Non-empty construction: an empty criteria set fails closed.
14. Duplicate `AssessmentCriterionId` rejection.
15. Inline-definition XOR exact-reference enforcement: construction fails closed when both or neither are
    supplied (line 206).
16. Each of the seven fingerprint inputs (lines 310–318) independently affects the fingerprint.
17. Inline-definition canonicalization: NFC/LF/outer-trim equivalence; internal-whitespace sensitivity (lines
    238–245).
18. **Step 2A structural validation only:** the exact immutable criterion reference tuple's six components are
    present, well-formed, and complete; construction fails closed on a missing or structurally malformed
    component. **Deferred to Step 3A:** external reference resolution authority (line 234).
19. Sorted authority references and sorted criteria: fingerprint is order-independent (line 329, line 333).
20. Expectation-set cardinality and nested length framing (lines 300–302, 331).
21. Equivalent-order byte equality / changed-content byte inequality for `EvidenceExpectation` sets (line 302).
22. Fail-closed construction for all `EvidenceExpectation`/`AssessmentCriterionApplicability` malformed inputs
    (lines 258, 306).
23. SHA-256 fingerprint output is exactly 64 lowercase hexadecimal characters (line 329).
24. System-generated record identifiers and timestamps do not affect the fingerprint (line 329).
25. The canonical applicability form (lines 320–327) participates in the fingerprint completely.

## `AssessmentCriterionApplicability`

26. `ExactSubjectElementSet` requires a non-empty, duplicate-free, sorted set of `SubjectElementReference`
    values (line 253); fails closed otherwise.
27. `SubjectElementsOfKind` requires a non-empty `CanonicalSubjectElementKind`; fails closed otherwise.
28. An unknown/unauthorized applicability variant fails closed (line 258).
29. **Explicitly out of scope:** no test constructs live subject-resolution behavior (line 258) — deferred to
    Step 3A.

## `AssessmentCoverage.open()`

30. Creates the complete Cartesian product of every supplied descriptor × every element-scoped criterion, as
    `SubjectElementPair` values.
31. Creates exactly one `AssessmentSubjectPair` for each `SubjectWide` criterion, carrying the supplied
    `basisFingerprint`.
32. The Basis fingerprint is retained and present in every `AssessmentSubjectPair`'s `basisFingerprint` field.
33. Changing only the `basisFingerprint` argument produces a distinct subject-wide pair universe.
34. Never creates a `SubjectElementPair` for a `SubjectWide` criterion, or an `AssessmentSubjectPair` for an
    element-scoped criterion.
35. Retains every `SubjectElementPair` whose applicability would not select it (undispositioned).
36. Produces a deterministic, duplicate-free universe regardless of input declaration order.
37. Canonical pair ordering is identical under every tested permutation of input order.
38. Fails closed on each of the six `open()` fail-closed conditions independently.

## `evaluateCoveragePair` — coverage binding

39. Rejects a `pair` structurally absent from the supplied `coverage`, including one belonging only to a
    different `AssessmentCoverage` instance.
40. Obtains the applicable `AssessmentCriterion` exclusively from `coverage`'s retained `AssessmentCriteriaSet`.
41. Signature carries no separate criterion parameter; no caller-supplied replacement criterion can be
    substituted.
42. Produces identical results for two calls given structurally identical `coverage`, `pair`, and
    `baselineResolution` arguments, regardless of separate `pair` construction.
43. Rejects a `pair` with a substituted element reference, canonical kind, Basis fingerprint, or criterion
    identity — each of the four cases independently tested.

## Selection determination

44. `AllSubjectElements` selects every `SubjectElementPair`.
45. `SubjectElementsOfKind` selects iff stored canonical kind structurally equals the declared one.
46. `ExactSubjectElementSet` selects iff stored element reference is a structural member of the declared set.

## `AssessmentCoverage.recordDisposition()`

47. Immutable one-disposition-per-pair recording; a second recording attempt fails closed.
48. `recordDisposition` is pure; the receiver instance is unchanged after the call.
49. A structurally foreign or field-substituted pair is rejected; a structurally identical pair is accepted
    regardless of construction origin.
50. `NotApplicable` restrictions per line 387, including rejection for a stored descriptor
    `SubjectElementsOfKind` selects.
51. `NotApplicable` fails closed on an empty or pair-independent explanation.
52. `AssessmentCoverage.isComplete()` returns `false` when at least one universe pair lacks a disposition. No
    terminal-Outcome check is included.

## Exact-Content Qualification

53. Only the three defined variants are constructible; no fourth combination is representable.

## Precondition-Failure Vocabulary payload preservation

54. Each non-empty-payload variant preserves its complete required fields unchanged through to the
    `UnableToEvaluate` outcome.

## `evaluateCoveragePair` / Result Separation

55. `Satisfied` outcome conditions per line 408.
56. `FindingRequired` outcome per lines 288, 409, 421; every failing comparison retained; target-construction
    data derived from the pair's own stored fields.
57. `UnableToEvaluate` outcome per lines 403, 410, 423–430; malformed Provenance aborts unconditionally.
58. `CoveragePairEvaluationOutcome`'s four variants are exhaustive and mutually exclusive by type.
59. A `@ts-expect-error` (or equivalent compile-time) fixture proves `FindingRequired` cannot be passed where
    `CoverageDisposition` is expected.
60. A separate runtime test proves raw, untyped `FindingRequired`-shaped data is rejected by runtime
    construction/validation logic, not merely by the type system.
61. `FindingProduced` cannot be constructed without a structurally valid, non-empty exact Finding reference.
62. `FindingProduced` contains no affected-target field or payload.
63. No exported function converts `FindingRequired` into `FindingProduced`.

## `EvidenceExpectation` variant coverage

64. Multiple distinct `RequiredEvidenceType` clauses, each satisfied by a different baseline item (lines 265,
    288).
65. `RequiredEvidenceCount` counts distinct `(EvidenceId, EvidenceVersion)` pairs (line 290).
66. `RequiredExactContent` classification matching for all three values (lines 266, 289).
67. `NoAdditionalExpectation` exclusivity (lines 264, 306).

## `FindingAffectedTarget`

68. Closed two-variant union; unknown variant rejection (line 356).
69. `SubjectElementTarget` non-empty/duplicate-free/sorted construction (line 358).
70. `AssessmentSubjectTarget` exact single-fingerprint construction (line 359).
71. Zero/multiple target-variant construction fails closed, tested against a standalone target-construction
    fixture, never against `Finding` (line 369).

---

# Forecasted File Inventory

## Forecasted Source Files (new, exact, eight files, all under `src/kernel/review/`)

1. `assessment-subject-reference.ts`
2. `subject-element-reference.ts` (also houses `CanonicalSubjectElementKind` and `CorpusReviewBasisFingerprint`)
3. `assessment-criterion-applicability.ts`
4. `evidence-expectation.ts`
5. `assessment-criterion.ts` (`AssessmentCriterion`, `AssessmentCriteriaSet`, fingerprint protocol)
6. `assessment-coverage.ts` (`AssessmentCoveragePair`, `StructuralSubjectElementDescriptor`,
   `AssessmentCoverage`, `open()`, `CoverageDisposition`, `recordDisposition`)
7. `finding-affected-target.ts`
8. `evaluate-coverage-pair.ts` (`evaluateCoveragePair`, selection determination, `CoveragePairEvaluationOutcome`,
   the Exact-Content Qualification union, and the Precondition-Failure Vocabulary type)

No consolidation, split, or renaming of this inventory is authorized without prior Sprint Owner approval — it
SHALL NOT be recorded as a post-hoc Builder deviation.

## Forecasted Test Files (new, exact, eight files, all under `test/kernel/review/`, mirroring the above)

1. `assessment-subject-reference.test.ts`
2. `subject-element-reference.test.ts`
3. `assessment-criterion-applicability.test.ts`
4. `evidence-expectation.test.ts`
5. `assessment-criterion.test.ts`
6. `assessment-coverage.test.ts`
7. `finding-affected-target.test.ts`
8. `evaluate-coverage-pair.test.ts`

## Complete Byte-Identical Protected-File List (verified unchanged per Acceptance Criterion 2)

Every pre-existing file under `src/kernel/review/`: `review.types.ts`, `review.contract.ts`,
`review.aggregate.ts`, `review.events.ts`, `review.service.ts`, `review.repository.ts`, `review.errors.ts`,
`review-criteria.ts`, `review-values.ts`, `review-id.ts`, `finding.ts`, `finding-id.ts`, and `README.md` — plus
`src/kernel/common/create-kernel-services.ts`, every host wiring file (e.g.
`src/hosts/vscode/host-mission-workflow.ts`), and every `index.ts` runtime barrel.

---

# Builder Responsibilities

- Implement exactly the sixteen files listed in § Forecasted File Inventory, satisfying every Acceptance
  Criterion above.
- Verify, via `git diff`, that every file in the Complete Byte-Identical Protected-File List is unchanged.
- Report any implementation deviation from this record explicitly in § Implementation Deviations (to be added
  upon Builder completion) — no deviation from the sixteen-file inventory itself is authorized without prior
  Sprint Owner approval.

# Documentation Requirements

Upon completing implementation, the Builder SHALL update:
- `IMPLEMENTATION_REPORT.md` — add the Sprint 80 entry recording delivered scope and any deviations.
- This record's § Implemented Scope / Builder Results section.
- `builder-task.md` — record Sprint 80's task disposition.

`REVIEW_HISTORY.md` is Reviewer-owned and is explicitly excluded from the Builder's inventory; only
`nexus-review` writes to it.

---

# Builder Results

Sprint 80 implementation is complete and ready for independent Reviewer validation.

## Implementation Deviations

No architectural deviations.

## Validation Summary

- TypeScript compile passed: `npm run compile -- --pretty false`.
- ESLint passed: `npm run lint -- --quiet`.
- Targeted Sprint 80 Vitest coverage passed: 26/26 tests across the exact eight mirrored test files.
- Full non-extension Vitest suite passed: 757/757 tests across 111/111 files.
- Build passed: `npm run build`.

## Sprint Status

Approved and fully closed. See § Reviewer Notes / § Final Disposition below.

# Reviewer Notes

**Status**

Complete

## Review Summary

See `NEXUS-REV-2026-07-22-001` in `REVIEW_HISTORY.md`. Independently verified: zero changes to every protected pre-existing file (`git diff --stat`); no new symbol imported outside `src/kernel/review/`; no `index.ts`/host-wiring change; `npm run compile` and `npm run lint` clean; targeted Sprint 80 suite 26/26 across the exact eight new test files; full non-extension suite 757/757 across 111/111 files; `npm run build` clean. The `AssessmentSubjectReference` wire shape was cross-checked against `review.types.ts`'s actual `ReviewPlanRevisionReference` and matches byte-for-byte without importing it. The fingerprint protocol, applicability/evidence-expectation vocabularies, `AssessmentCoverage.open()` universe construction, and the `CoveragePairEvaluationOutcome`/`CoverageDisposition` separation conform to RFC-0006 v1.3 and this record's binding Pure Evaluation Contract.

## Findings

- `NEXUS-REV-0080-DEF-001` (Major, Implementation Defect) — `AssessmentCoverage.recordDisposition()`'s `NotApplicable` validation never structurally compared the disposition's stored `applicability` field against the coverage's actual retained criterion applicability for that pair, so a caller could persist a `NotApplicable` disposition whose recorded "applicability declaration relied upon" (RFC-0006 v1.3 line 387) did not match reality. **Resolved** by `BT-080-002`, verified by `NEXUS-REV-2026-07-22-002`.
- `NEXUS-REV-0080-TST-001` (Minor, Test Coverage Gap) — no test exercised `RequiredExactContent`'s `AnyExactContent` classification (Acceptance Criterion 66). **Resolved** by `BT-080-003`, verified by `NEXUS-REV-2026-07-22-002`.
- `NEXUS-REV-0080-TST-002` (Minor, Test Coverage Gap) — no test exercised two distinct `RequiredEvidenceType` clauses on one criterion each satisfied by a different baseline item (Acceptance Criterion 64). **Resolved** by `BT-080-004`, verified by `NEXUS-REV-2026-07-22-002`.

## Required Actions

None. `BT-080-002`, `BT-080-003`, and `BT-080-004` are Completed; no open Builder Task remains for Sprint 80.

---

# Final Disposition

Approved and fully closed.

Date: 2026-07-22

Reviewer: Reviewer AI (Claude Code)

See `NEXUS-REV-2026-07-22-001` (PASS WITH FINDINGS, original review) and `NEXUS-REV-2026-07-22-002` (PASS,
resolution verification — all three findings resolved, zero remaining findings) in `REVIEW_HISTORY.md`.
