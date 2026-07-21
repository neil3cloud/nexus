# Sprint 79 — Corrective Prerequisite 1A — RFC-0002 v1.3 Evidence Confidence and Verification Status Integration

## Status

Approved with Findings — `NEXUS-REV-2026-07-21-001`. Activated by `NEXUS-RAT-2026-07-21-005`. Milestone 12 — Corpus Review and Implementation Readiness, Initial Capability Sequence Corrective Prerequisite 1A, established by `NEXUS-RAT-2026-07-21-003` (wording corrected by `NEXUS-RAT-2026-07-21-004`), between Step 1 (Sprint 78, Approved with Findings, closed) and Step 2.

**Authority note.** This governed Sprint Implementation Record is the durable and authoritative delivery contract for Sprint 79, per `NEXUS-RAT-2026-07-21-005`. Any drafting artifact used to prepare this activation (e.g. a scratchpad file under `.claude/scratchpad/`) is provenance only and is not required for implementation, review, or closure. Every binding text — the six-item scope, the Construction/Reconstitution Contract, the Compatibility Test Matrix, and the exact file-change inventory — is reproduced in full below; nothing in this record depends on an external file.

---

# Objective

Implement Milestone 12 Initial Capability Sequence Corrective Prerequisite 1A only: RFC-0002 v1.3's Evidence Confidence and Evidence Verification Status obligations, verified absent from `src/`, as the sole blocking prerequisite for Step 2. Introduce no RFC-0006 concept and no Steps 2–6 behavior.

---

# RFC Coverage

## Primary RFC Coverage

- RFC-0002 v1.3 — Evidence Model, § Evidence Confidence, § Evidence Verification Status (implemented in full within this scope; RFC-0002 remains the exclusive architectural owner — this Sprint implements, not amends, its obligations)

## Referenced RFCs

- RFC-0002 v1.2 — Exact Content Evidence (Sprint 78, frozen; referenced only for the compatibility gate below)
- RFC-0006 v1.3 (Referenced Only — Step 2 consumes this Sprint's output; no RFC-0006 concept is implemented here)

## Ratification References

- `NEXUS-RAT-2026-07-19-006` — establishes the binding, planning-only Initial Capability Sequence.
- `NEXUS-RAT-2026-07-21-003` — establishes Corrective Prerequisite 1A's six-item scope. Blocking prerequisite, Active.
- `NEXUS-RAT-2026-07-21-004` — wording correction to `-003`. Active.
- `NEXUS-RAT-2026-07-21-005` — this Sprint's own activation ratification.

---

# Implementation Scope

## Planned Scope

### Binding Corrective Prerequisite 1A Scope (verbatim, unedited, from `NEXUS-RAT-2026-07-21-003`)

1. **Evidence Confidence** — the five-value closed `ConfidenceClassification` vocabulary (`Verified`, `Accepted`, `Observed`, `Inferred`, `Unverified`); byte-stable canonical encoding; normative total ordering, comparison semantics, and threshold-satisfaction helper; `UNDETERMINED` reporting for a threshold evaluated against absent confidence, distinct from a determinate ranked-but-insufficient result, with fail-closed consumer behavior; fail-closed construction on an absent or out-of-vocabulary value; reconstitution of pre-amendment Evidence preserving an absent confidence classification exactly, without defaulting, back-filling, or migration; confidence, once declared, remains immutable per RFC-0002 § Evidence Immutability, with any correction producing a new Evidence version.
2. **Evidence Verification Status** — the three-value closed `EvidenceVerificationStatus` vocabulary (`Verified`, `Unverified`, `VerificationFailed`), canonical encoding, and normative total ordering (`Verified > Unverified > VerificationFailed`), kept fully distinct from and never conflated with Sprint 78's existing exact-content per-operation `VerificationStatus = 'Verified' | 'Failed'` outcome type — no rename, no merge, no shared identifier or representation.
3. **Governed/legacy Provenance representations and the `verificationStatusSemantics` marker** — the exactly-two-valid-representations rule; a governed-only construction API rejecting any bare string lacking the exact marker, even one that spells a closed vocabulary value; marker inclusion wherever a governed representation is serialized, canonically encoded, fingerprinted, or compared.
4. **Malformed-representation and malformed-reconstitution failure** — fail-closed construction of any malformed representation (out-of-vocabulary status under a marker; a marker value other than `EvidenceVerificationStatus/v1`; an empty/unknown marker; a marker with a missing status; any additional/conflicting status representation); fail-closed reconstitution of a persisted malformed representation, producing no Provenance value while leaving persisted bytes unchanged, unrepaired, unnormalized, and unmigrated.
5. **Canonical encoding, ordering, comparison, threshold helpers, and `UNDETERMINED`** — for both vocabularies: byte-stable ASCII canonical encoding, no case folding or whitespace variance; normative total orderings; threshold-satisfaction helpers accepting only a governed/closed-vocabulary value; `UNDETERMINED` evaluation, distinct from determinate insufficiency, for any threshold evaluated against unrankable confidence or unrankable verification status, with fail-closed consumer behavior in every case.
6. **Byte-identical preservation of legacy snapshots** — reconstitution of every pre-v1.3 Evidence and Provenance snapshot preserves exact persisted bytes, including absent confidence and a marker-less `verificationStatus` string of any spelling, without repair, coercion, normalization, migration, or re-serialization that adds the marker or a confidence value; a legacy record acquires governed status or declared confidence only through a new Evidence version, with the prior version's legacy data unchanged.

### Binding Compatibility Gates (verbatim, from `NEXUS-RAT-2026-07-21-003`)

No destructive change to Sprint 78's frozen Evidence Foundation (`representedContentReference`, content-representation classification, `contentDigestAlgorithm`, `contentDigest`, canonical byte representation, `SnapshotContent`/`DerivedContent`). Pre-v1.3 Evidence and Provenance records remain preserved exactly as recorded, per scope item 6. Depends on Step 1 only; blocking prerequisite for Step 2 only.

### Binding Construction/Reconstitution Contract (from `NEXUS-RAT-2026-07-21-005`)

**Two vocabulary value objects.**

- `ConfidenceClassification` — closed five-value vocabulary (`Verified`, `Accepted`, `Observed`, `Inferred`, `Unverified`), immutable value object, `fromString` factory (fails closed on absent/empty/out-of-vocabulary), byte-stable canonical `toString`/`toJSON`, normative total ordering (`Verified > Accepted > Observed > Inferred > Unverified`).
- `EvidenceVerificationStatus` — closed three-value vocabulary (`Verified`, `Unverified`, `VerificationFailed`), immutable value object, `fromString` factory, canonical `toString`/`toJSON`, normative total ordering (`Verified > Unverified > VerificationFailed`). Shares no identifier, type, or representation with Sprint 78's exact-content per-operation `VerificationStatus = 'Verified' | 'Failed'`.
- Both expose a threshold-satisfaction helper returning a shared three-way result type: `ThresholdSatisfactionResult = 'Satisfied' | 'Insufficient' | 'Undetermined'` — never a boolean.

**Separate construction and registration types for `Provenance`.**

```ts
// Typed construction input — used by Provenance.create, and by CreateEvidenceInput.provenance
export interface ProvenanceInput {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: EvidenceVerificationStatus; // typed, governed
  readonly verificationStatusSemantics: 'EvidenceVerificationStatus/v1'; // exact literal marker, required
}

// Raw transport input — used at the registration boundary, and by RegisterEvidenceRequest.provenance
export interface ProvenanceRegistrationInput {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string; // raw
  readonly verificationStatusSemantics: string; // raw, must equal the exact marker after validation
}
```

- `Provenance.create(input: ProvenanceInput): Provenance` — the sole "new construction" path. Requires `verificationStatus` to already be a typed `EvidenceVerificationStatus` and `verificationStatusSemantics` to be exactly the literal `'EvidenceVerificationStatus/v1'`. Fails closed (throws, no partial `Provenance`) if the marker is not exactly that literal.
- `Provenance.register(input: ProvenanceRegistrationInput): Provenance` — the registration boundary. Validates the raw `verificationStatus` string via `EvidenceVerificationStatus.fromString(...)` (fails closed on out-of-vocabulary), validates `verificationStatusSemantics` is exactly `'EvidenceVerificationStatus/v1'` (fails closed otherwise), then delegates to `Provenance.create` with the now-typed value.
- Every new Evidence registration must supply both governed verification semantics and confidence — there is no code path through `Evidence.register`/`Provenance.register` that accepts either one without the other.

**`Evidence` construction and registration types.**

```ts
export interface CreateEvidenceInput {
  readonly id: EvidenceId;
  readonly missionId?: string;
  readonly type: EvidenceType;
  readonly version: EvidenceVersion;
  readonly hash: EvidenceHash;
  readonly metadata: EvidenceMetadata;
  readonly provenance: Provenance;
  readonly confidenceClassification: ConfidenceClassification; // typed, required
  readonly exactContent?: ExactContentEvidence;
}

export interface RegisterEvidenceRequest {
  readonly id: string;
  readonly missionId?: string;
  readonly type: string;
  readonly version: number;
  readonly hash: string;
  readonly metadata: EvidenceMetadataInput;
  readonly provenance: ProvenanceRegistrationInput; // raw transport shape
  readonly confidenceClassification: string; // raw, required
  readonly exactContent?: ExactContentEvidenceInput;
}

export interface EvidenceSnapshot {
  readonly id: string;
  readonly missionId?: string;
  readonly type: string;
  readonly version: number;
  readonly source: string;
  readonly hash: string;
  readonly metadata: EvidenceMetadataSnapshot;
  readonly provenance: ProvenanceSnapshot; // closed union, below
  readonly confidenceClassification?: string; // optional; see below for the present-but-invalid rule
  readonly exactContent?: ExactContentEvidenceSnapshot;
}
```

- `Evidence.create(input: CreateEvidenceInput)` fails closed if `confidenceClassification` is not provided.
- `Evidence.register(input: RegisterEvidenceRequest)` validates `confidenceClassification` via `ConfidenceClassification.fromString(...)` (fails closed on absent/empty/out-of-vocabulary), calls `Provenance.register(input.provenance)`, then calls `Evidence.create` with both typed values.

**`ProvenanceSnapshot` — closed union.**

```ts
export interface LegacyProvenanceSnapshot {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: string; // unconstrained; marker key absent
  readonly verificationStatusSemantics?: never; // explicitly prohibited — closes the union against structural typing
}

export interface GovernedProvenanceSnapshot {
  readonly source: string;
  readonly acquisitionMethod: string;
  readonly acquiredAt: string;
  readonly actor: string;
  readonly system: string;
  readonly verificationStatus: EvidenceVerificationStatusName; // in-vocabulary
  readonly verificationStatusSemantics: 'EvidenceVerificationStatus/v1'; // exact marker, present
}

export type ProvenanceSnapshot = LegacyProvenanceSnapshot | GovernedProvenanceSnapshot;
```

No third shape is valid input to `Provenance.fromSnapshot`.

**Independent reconstitution paths.**

- `Provenance.fromSnapshot(snapshot: ProvenanceSnapshot): Provenance` SHALL NOT call `Provenance.create` or `Provenance.register`. A `LegacyProvenanceSnapshot` (marker key absent) reconstitutes with `verificationStatus` preserved verbatim, any spelling, unrankable regardless of match to a closed value, and no marker; a `GovernedProvenanceSnapshot` reconstitutes only if `verificationStatusSemantics` is exactly `'EvidenceVerificationStatus/v1'` and `verificationStatus` is in-vocabulary. Any other combination is malformed and SHALL fail closed, producing no `Provenance`.
- `Evidence.fromSnapshot(snapshot: EvidenceSnapshot): Evidence` SHALL NOT call `Evidence.create` or `Evidence.register`. It constructs the aggregate via its own reconstitution path: an **absent** `confidenceClassification` reconstitutes with confidence absent (unrankable), exactly as recorded, no default or back-fill; a **present** `confidenceClassification` is parsed via `ConfidenceClassification.fromString(...)` and, if invalid, reconstitution **fails closed** (throws, no partial `Evidence`) — a present-but-invalid value is malformed, not legacy, and is never silently treated as absent. It calls `Provenance.fromSnapshot(snapshot.provenance)` for the nested value.

**Governed verification-status threshold input.**

```ts
export type GovernedVerificationStatusInput =
  | { readonly kind: 'Governed'; readonly value: EvidenceVerificationStatus }
  | { readonly kind: 'Unrankable' };
```

The verification-status threshold helper SHALL NOT accept `string`. Its sole parameter type is `GovernedVerificationStatusInput`, produced only by `Provenance.verificationStatusForThreshold()`: a governed representation (marker present, in-vocabulary) yields `{ kind: 'Governed', value }`; every legacy representation — marker absent, regardless of what the bare string spells, including a marker-less string reading `"Verified"` — yields `{ kind: 'Unrankable' }`. There is no code path by which a bare string reaches the ranking logic. The `ConfidenceClassification` threshold helper is unaffected — it already only accepts `ConfidenceClassification | undefined`, never a string.

**Malformed construction and reconstitution — summary.**

Every one of the following fails closed, producing no `Provenance` and no `Evidence`, leaving persisted bytes (where applicable) unchanged, unrepaired, unnormalized, and unmigrated:

- `Provenance.create`/`Provenance.register` with a missing or out-of-vocabulary `verificationStatus`, or a `verificationStatusSemantics` not exactly `'EvidenceVerificationStatus/v1'`.
- `Provenance.fromSnapshot` on a marker present with an out-of-vocabulary status, a non-exact marker value, an empty/unknown marker, a marker with a missing status, or any additional/conflicting status representation.
- `Evidence.create`/`Evidence.register` with a missing or out-of-vocabulary `confidenceClassification`.
- `Evidence.fromSnapshot` on a present-but-invalid `confidenceClassification` string.

## Implemented Scope

Implemented exactly as planned. Sprint 79 implements RFC-0002 v1.3 Evidence Confidence and Evidence Verification Status integration only, including the six binding Corrective Prerequisite 1A scope items, the Construction/Reconstitution Contract, and the Compatibility Test Matrix. No RFC-0006 concept, Step 2 behavior, Evidence Relationships, Evidence Type registry, or Canonicalization Profile Registry generalization was introduced.

---

# Implemented Capabilities

- `ConfidenceClassification` value type — closed five-value vocabulary, canonical encoding, total ordering, threshold-satisfaction helper.
- `EvidenceVerificationStatus` value type — closed three-value vocabulary, canonical encoding, total ordering, threshold-satisfaction helper.
- Separate `ProvenanceInput`/`Provenance.create` (typed construction) and `ProvenanceRegistrationInput`/`Provenance.register` (raw registration boundary) — every new Evidence registration supplies both governed verification semantics and confidence together.
- Governed/legacy `Provenance` representation rule and `verificationStatusSemantics` marker.
- Fail-closed construction and fail-closed reconstitution for malformed representations of both vocabularies.
- Byte-identical legacy snapshot preservation for pre-v1.3 Evidence and Provenance.
- Three-way `ThresholdSatisfactionResult` (`Satisfied` | `Insufficient` | `Undetermined`) for both vocabularies, with a type-safe `GovernedVerificationStatusInput` parameter that structurally excludes a bare string.

---

# Architectural Decisions

- `ConfidenceClassification` and `EvidenceVerificationStatus` are implemented as immutable value objects in `src/kernel/evidence/`, following the existing `EvidenceType`/`EvidenceSource` closed-vocabulary pattern (private constructor, `fromString` factory, `equals`, `toString`/`toJSON`).
- `Provenance` construction is split into `Provenance.create` (typed) and `Provenance.register` (raw transport, delegates to `create`) — mirroring the existing `Evidence.create`/`Evidence.register` split exactly. This is binding, not a Builder preference.
- `CreateEvidenceInput.confidenceClassification` is typed `ConfidenceClassification`; `RegisterEvidenceRequest.confidenceClassification` is typed `string`, converted by `Evidence.register`, mirroring the same split.
- `Provenance.fromSnapshot` and `Evidence.fromSnapshot` are independent reconstitution paths that do not call `create`/`register` — binding, not a Builder preference; SHALL NOT be refactored to share code that would cause legacy opaque values to pass through governed validation.
- Threshold-satisfaction helpers are pure functions, not methods on `Evidence`/`Provenance`, for independent unit-testability and reuse by Step 2 without exposing aggregate internals. The verification-status helper's parameter type (`GovernedVerificationStatusInput`) is produced only by `Provenance.verificationStatusForThreshold()`, never accepted as a raw string anywhere in its call surface.

This section SHALL NOT redefine RFC-0002 behavior; it records only implementation-layer choices within the ratified contract.

---

# Deferred Concepts

- RFC-0006 v1.3 `AssessmentCriterion`/`EvidenceExpectation` (Step 2)
- RFC-0002 Evidence Relationships
- Evidence Type registry
- Canonicalization Profile Registry generalization beyond Sprint 78's Exact-Content-Evidence scope
- Corpus Review Structural Foundation (Steps 3–6)
- Reproducible Context Integration (`CorpusReviewContextProfile`)
- Corpus Readiness Acceptance Repository Policy

---

# Deferred RFC Ownership

- RFC-0006 — Engineering Assessment Model (Step 2 and later; consumes this Sprint's vocabularies read-only)
- RFC-0013 — Corpus Review Model (Steps 3–6)

---

# Known Limitations

- In-memory repository only (unchanged from Sprint 5/78).
- No durable persistence, indexing, or search (unchanged).
- Threshold-satisfaction helpers operate on a single value against a single threshold; multi-item baseline-set aggregation is Step 2's responsibility, not this Sprint's.

These are implementation boundaries, not defects.

---

# Acceptance Criteria

- `ConfidenceClassification` and `EvidenceVerificationStatus` implemented as closed vocabularies with byte-stable canonical encodings and normative total orderings.
- Threshold-satisfaction helpers for both vocabularies return `Satisfied` | `Insufficient` | `Undetermined`, never a boolean.
- `Provenance.create` requires a typed `EvidenceVerificationStatus` and the exact `verificationStatusSemantics` marker literal; `Provenance.register` validates raw strings for both and delegates to `create`.
- `Evidence.create`/`register` fail closed when `confidenceClassification` is absent, empty, or out-of-vocabulary; `Evidence.register` and `Provenance.register` together require every new registration to supply both governed verification semantics and confidence — neither can be supplied without the other.
- `EvidenceSnapshot.confidenceClassification` is optional; `Evidence.fromSnapshot` preserves an absent value exactly, and fails reconstitution on a present-but-invalid value.
- `ProvenanceSnapshot` is a closed union of legacy (marker-absent, with `verificationStatusSemantics?: never`) and governed (marker-present) shapes.
- `Provenance.fromSnapshot` and `Evidence.fromSnapshot` do not delegate to `create`/`register`; both fail closed on every malformed combination, producing no aggregate.
- Every pre-v1.3 Evidence/Provenance snapshot round-trips with byte-identical legacy data; no marker or confidence backfill occurs on re-serialization.
- Confidence, once declared, is immutable; any correction produces a new Evidence version.
- No destructive change to Sprint 78's frozen Evidence Foundation fields or behavior.
- No introduction of any deferred concept listed above.
- The complete Compatibility Test Matrix (15 items, below) is implemented and passing.
- All 9 test fixtures and the 1 production caller in the Forecasted File Inventory below are updated exactly as forecast (both the confidence field and the governed marker/status), with any deviation reported to the Reviewer.
- Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

---

# Compatibility Test Matrix (15 items, binding minimum coverage)

1. Every `ConfidenceClassification` value and every `EvidenceVerificationStatus` value, individually and in every adjacent ordering pair, asserting the normative total ordering both ways.
2. Exact canonical encoded strings for every value of both vocabularies, and rejection of every invalid/out-of-vocabulary string.
3. New construction (`Evidence.create`/`register`) with missing `confidenceClassification` — fails closed.
4. Legacy `Evidence.fromSnapshot` with absent `confidenceClassification` — reconstitutes with confidence absent, `Undetermined` on threshold evaluation.
5. Legacy marker-less `verificationStatus` values, both vocabulary-matching (e.g. `"Verified"` with no marker) and arbitrary spelling — both reconstitute as unrankable/`Undetermined`, never coerced to governed.
6. Valid governed `Provenance` (`verificationStatus` in-vocabulary, marker exactly `'EvidenceVerificationStatus/v1'`) — constructs via both `create` and `register`, and reconstitutes successfully, ranks correctly.
7. Every malformed marker/status combination named in the Binding Construction/Reconstitution Contract above — each fails closed on `create`, `register`, and `fromSnapshot`, producing no `Provenance`.
8. Governed and legacy snapshot round trips (`toSnapshot` → `fromSnapshot`) — byte-identical field values on both sides.
9. No marker or confidence backfill — a legacy snapshot reconstituted and re-serialized via `toSnapshot` produces the same legacy (marker-less / confidence-absent) shape, not a governed one.
10. Equality (`Provenance.equals`) and serialization (`toSnapshot`) including the marker field where present.
11. Separation from Sprint 78's `VerificationStatus`: a test asserting `EvidenceVerificationStatus` and Sprint 78's exact-content per-operation `VerificationStatus` share no identifier, type, or representation.
12. Full regression of the 9 fixtures and the 1 production caller in the Forecasted File Inventory below, plus full-repository validation (`npm run validate`, `npm run test:extension-host:build`).
13. `CreateEvidenceInput.confidenceClassification`/`ProvenanceInput.verificationStatus` accept only constructed value objects — verified by `tsc` compilation of a fixture using the typed constructors; runtime coverage via item 3.
14. The verification-threshold helper's parameter type accepts only `GovernedVerificationStatusInput`; a test constructing `Provenance` with a legacy marker-less `"Verified"` string and calling `verificationStatusForThreshold()` asserts the result is `{ kind: 'Unrankable' }`, and the threshold helper on that input returns `'Undetermined'` — never `'Satisfied'`.
15. Compile-time and runtime proof that a marker-bearing shape cannot enter the legacy branch: a compile-time fixture attempting to assign an object literal carrying `verificationStatusSemantics` to a `LegacyProvenanceSnapshot`-typed value fails `tsc` compilation, confirming `verificationStatusSemantics?: never` actually closes the union; and a runtime test passing a marker-bearing, otherwise-malformed shape into `Provenance.fromSnapshot` confirms it is evaluated exclusively under `GovernedProvenanceSnapshot`'s rules and fails closed, producing no `Provenance` — never silently accepted as legacy/unrankable.

---

# Validation Summary

| Validation         | Status              |
| ------------------- | -------------------- |
| Build               | Passed |
| Lint                | Passed |
| Unit Tests          | Passed |
| Integration Tests   | Passed |

---

# Forecasted File Inventory

## Forecasted Source Files (new)

- `src/kernel/evidence/confidence-classification.ts` — `ConfidenceClassification` value type.
- `src/kernel/evidence/evidence-verification-status.ts` — `EvidenceVerificationStatus` value type, `evidenceVerificationStatusMarker` constant (`'EvidenceVerificationStatus/v1'`), `GovernedVerificationStatusInput`.
- `src/kernel/evidence/threshold-satisfaction.ts` (or colocated in the two files above — Builder's choice) — `ThresholdSatisfactionResult` and both threshold-satisfaction helpers.

## Forecasted Source Files (modified)

- `src/kernel/evidence/provenance.ts` — `ProvenanceInput` (typed) vs `ProvenanceRegistrationInput` (raw); `LegacyProvenanceSnapshot`/`GovernedProvenanceSnapshot`/`ProvenanceSnapshot` union; `Provenance.create`, `Provenance.register`, independent `Provenance.fromSnapshot`; `verificationStatusForThreshold()` accessor.
- `src/kernel/evidence/evidence.aggregate.ts` — `CreateEvidenceInput.confidenceClassification: ConfidenceClassification`; `RegisterEvidenceRequest.confidenceClassification: string` and `.provenance: ProvenanceRegistrationInput`; `EvidenceSnapshot.confidenceClassification?: string`; fail-closed `create`/`register`; independent, validating `fromSnapshot`.
- `src/kernel/evidence/evidence.errors.ts` — new exceptions for malformed confidence/verification-status construction and reconstitution.
- `src/kernel/evidence/evidence.contract.ts` — barrel exports for `ConfidenceClassification`, `EvidenceVerificationStatus`, `ProvenanceRegistrationInput`, `ThresholdSatisfactionResult`, `GovernedVerificationStatusInput`, and new exception types.
- `src/hosts/vscode/host-mission-workflow.ts` — line 459–466's `registerEvidence` call literal gains `confidenceClassification: 'Observed'` and `provenance.verificationStatusSemantics: 'EvidenceVerificationStatus/v1'`, per the exact diff below. Sole authorized edit to this file.

## Forecasted Source Files (unchanged, verify no incidental change)

- `src/kernel/evidence/evidence.service.ts` — passes `RegisterEvidenceRequest` through unchanged.
- `src/kernel/evidence/evidence-type.ts`, `evidence-source.ts`, `evidence-hash.ts`, `evidence-version.ts`, `evidence-metadata.ts`, `exact-content-*.ts`, `content-digest.ts` — Sprint 78 Evidence Foundation, frozen by the compatibility gate.

## Forecasted Test Files (existing fixtures requiring update — exact, 9 files, each gaining BOTH `confidenceClassification` AND `provenance.verificationStatusSemantics`)

**1. `test/kernel/evidence/exact-content-verification.service.test.ts` (line 317–324)**

Current:
```ts
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  };
```
Corrected:
```ts
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: '2026-07-12T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  };
```

**2. `test/kernel/evidence/evidence.service.test.ts` (line 55–62 and line 245–252 — two occurrences)**

Same current/corrected shape as entry 1, applied at both locations (both are standalone `RegisterEvidenceRequest` literals).

**3. `test/kernel/evidence/evidence.aggregate.test.ts` (four sites)**

- **`evidenceRequest()` helper (line 23–45):** same current/corrected shape as entry 1. Every `it(...)` in this file calls `evidenceRequest()` or spreads it, so this single edit propagates to `Evidence.register(evidenceRequest())` at lines 49 and 126, the `...request` spread at lines 82–88, and the `...evidenceRequest()` spreads at lines 100 and 106.
- **`toEqual` expectation at line 52–73** — the *expected* object must independently gain `confidenceClassification: 'Verified'` and `provenance.verificationStatusSemantics: 'EvidenceVerificationStatus/v1'`, matching what `toSnapshot()` will now actually return. This is a separate edit from the input-side helper fix.
- **Independent literal at line 282–301** — does not use `evidenceRequest()`; apply the same current/corrected shape as entry 1 directly.
- **Error-path spread at line 114–122** (`provenance: { ...evidenceRequest().provenance, source: ' ' }`) — no direct edit required; once `evidenceRequest()` is corrected, the spread inherits the marker and governed status automatically.

**4. `test/kernel/evidence/evidence.repository.test.ts` (line 25–32)**

Same current/corrected shape as entry 1.

**5. `test/integration/kernel-failure-paths.integration.test.ts` (line 585–592)**

Current:
```ts
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'integration-test',
      acquiredAt: '2026-07-13T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  } as const;
```
Corrected:
```ts
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'integration-test',
      acquiredAt: '2026-07-13T00:00:00.000Z',
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  } as const;
```

**6. `test/integration/kernel-boundary-certification.integration.test.ts` (line 725–732)**

Same shape as entry 5 (`acquisitionMethod: 'integration-test'`, `as const` literal).

**7. `test/integration/kernel-mission-workflow.integration.test.ts` (line 150–157)**

Same shape as entry 5, without the trailing `as const`.

**8. `test/kernel/knowledge/knowledge.test-support.ts` (`createEvidence()` helper, line 31–38)**

Current:
```ts
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  });
```
Corrected:
```ts
    confidenceClassification: 'Verified',
    provenance: {
      source: 'vitest',
      acquisitionMethod: 'test-run',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  });
```

**9. `test/kernel/shared-reality/projection.service.test.ts` (line 95–102)**

Current:
```ts
    provenance: {
      source: input.source ?? 'repository',
      acquisitionMethod: 'repository-inspection',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
    },
  });
```
Corrected:
```ts
    confidenceClassification: 'Verified',
    provenance: {
      source: input.source ?? 'repository',
      acquisitionMethod: 'repository-inspection',
      acquiredAt: timestamp,
      actor: 'builder',
      system: 'nexus',
      verificationStatus: 'Verified',
      verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
    },
  });
```

## Forecasted Production Caller (exact, 1 file)

**`src/hosts/vscode/host-mission-workflow.ts` (line 459–466, inside `completeDeveloperWorkflow`, the `registerEvidence` call opening at line 446)**

Current:
```ts
      provenance: {
        source: 'vscode-host',
        acquisitionMethod: 'developer-workflow-completion',
        acquiredAt: '2026-07-13T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
      },
    });
```
Corrected:
```ts
      confidenceClassification: 'Observed',
      provenance: {
        source: 'vscode-host',
        acquisitionMethod: 'developer-workflow-completion',
        acquiredAt: '2026-07-13T00:00:00.000Z',
        actor: 'builder',
        system: 'nexus',
        verificationStatus: 'Verified',
        verificationStatusSemantics: 'EvidenceVerificationStatus/v1',
      },
    });
```

**Rationale for `'Observed'` (not `'Verified'`, `'Accepted'`, `'Inferred'`, or `'Unverified'`):** this call registers Evidence **automatically upon Adapter dispatch completion** — the Host itself produces and captures this `TestResult` Evidence as a direct record of workflow completion; it is not independently reviewed, cross-verified, or human-attested at this call site (Review happens afterward, as a separate step, over this Evidence). Per RFC-0002's ordering (`Verified > Accepted > Observed > Inferred > Unverified`), `'Observed'` reflects that the system directly observed and recorded its own completion outcome with no additional verification mechanism applied at this point — ranking appropriately below `Verified`/`Accepted` and above `Inferred`/`Unverified`. This is an exact producer classification with stated rationale, not a caller-plumbed parameter: plumbing a new confidence parameter through `completeDeveloperWorkflow`'s signature would expand this corrective Sprint's scope into new Host API design, which is out of scope. This is the sole authorized edit to `host-mission-workflow.ts`; no other line of this file changes, and no new parameter or method signature is introduced. The Builder SHALL NOT invent, infer, or default any other value at this or any other call site; if another Evidence-registering call site is found during implementation that this inventory missed, it SHALL be reported to the Reviewer before a classification is chosen for it.

## Confirmed False Positives, Excluded (8 — verified, not part of this Sprint's scope)

Each of the following nests `provenance` under Knowledge's `attribution` block (a `KnowledgeSnapshot.provenance` field carrying `attribution`/`approvingAuthority`), not under an Evidence `hash`/`metadata`/`provenance` shape, and is unaffected by this Sprint:

- `test/kernel/knowledge/knowledge.aggregate.test.ts`
- `test/integration/host-mission-workflow.integration.test.ts`
- `test/hosts/vscode/host-mission-workflow.test.ts`
- `test/hosts/vscode/host-mission-workflow-command-registration.test.ts`
- `test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts`
- `test/hosts/vscode/host-mission-workflow-codex-command-registration.test.ts`
- `test/hosts/vscode/host-mission-workflow-gemini-command-registration.test.ts`
- `test/hosts/vscode/host-adapter-configuration.test.ts`

## Forecasted Test Files (new)

- `test/kernel/evidence/confidence-classification.test.ts`
- `test/kernel/evidence/evidence-verification-status.test.ts`
- `test/kernel/evidence/provenance.test.ts` (or extend `evidence.aggregate.test.ts` — Builder's discretion, verify current file boundaries first)
- A targeted assertion (in `test/hosts/vscode/host-mission-workflow.test.ts` or a new file) confirming the Sprint 27 developer-workflow-completion Evidence now carries `confidenceClassification: 'Observed'` and a governed `verificationStatus`.

**Any deviation from this inventory SHALL be reported to the Reviewer in `IMPLEMENTATION_REPORT.md`.**

---

# Files Added

- `src/kernel/evidence/confidence-classification.ts`
- `src/kernel/evidence/evidence-verification-status.ts`
- `src/kernel/evidence/threshold-satisfaction.ts`
- `test/kernel/evidence/confidence-classification.test.ts`
- `test/kernel/evidence/evidence-verification-status.test.ts`
- `test/kernel/evidence/provenance.test.ts`

---

# Files Modified

- `src/kernel/evidence/provenance.ts`
- `src/kernel/evidence/evidence.aggregate.ts`
- `src/kernel/evidence/evidence.contract.ts`
- `src/hosts/vscode/host-mission-workflow.ts`
- `test/kernel/evidence/evidence.aggregate.test.ts`
- `test/kernel/evidence/evidence.repository.test.ts`
- `test/kernel/evidence/evidence.service.test.ts`
- `test/kernel/evidence/exact-content-verification.service.test.ts`
- `test/kernel/knowledge/knowledge.test-support.ts`
- `test/kernel/shared-reality/projection.service.test.ts`
- `test/integration/kernel-failure-paths.integration.test.ts`
- `test/integration/kernel-boundary-certification.integration.test.ts`
- `test/integration/kernel-mission-workflow.integration.test.ts`
- `test/hosts/vscode/host-mission-workflow.test.ts`

---

# Implementation Deviations

No architectural deviations.

Implementation note: the forecasted source inventory stated that `src/kernel/evidence/evidence.service.ts` would pass `RegisterEvidenceRequest` through unchanged; that file remained unchanged. The production caller edit was limited to the authorized `registerEvidence` payload in `src/hosts/vscode/host-mission-workflow.ts`. The test inventory was implemented with the forecasted new Evidence tests plus a direct assertion in `test/hosts/vscode/host-mission-workflow.test.ts` covering the production caller payload.

Forecast deviation: the Forecasted Source Files entry for `src/kernel/evidence/evidence.errors.ts` new exception types was not implemented; Sprint 79 reused the existing `InvalidEvidenceException` for every new fail-closed confidence and verification-status path instead.

---

# Governance Deviations

None.

---

# Builder Summary

Sprint 79 is implemented and ready for independent Reviewer validation. The Evidence domain now exposes closed, byte-stable `ConfidenceClassification` and `EvidenceVerificationStatus` value objects, three-way threshold helpers, governed/legacy Provenance representation handling, fail-closed malformed construction/reconstitution, and legacy snapshot preservation without backfill or migration. New Evidence registration requires both confidence and governed verification semantics; legacy snapshots remain reconstitutable with absent confidence and marker-less verification status preserved as unrankable.

---

# Traceability

| Artifact                 | Reference                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Sprint                   | Sprint 79                                                                             |
| Primary RFC              | RFC-0002 v1.3                                                                         |
| Ratification             | `NEXUS-RAT-2026-07-21-005` (activation); `NEXUS-RAT-2026-07-21-003`/`-004` (scope)   |
| Implementation Plan      | `IMPLEMENTATION_PLAN.md`                                                              |
| Implementation Manifest  | `IMPLEMENTATION_MANIFEST.md`                                                          |
| Implementation Report    | `IMPLEMENTATION_REPORT.md`                                                            |
| Review Report            | `REVIEW_HISTORY.md`                                                                   |

---

# Reviewer Notes

**Status**

Complete

## Review Summary

See `NEXUS-REV-2026-07-21-001` and its resolution-verification cycle `NEXUS-REV-2026-07-21-002` in `REVIEW_HISTORY.md`. The Construction/Reconstitution Contract, the closed `ProvenanceSnapshot` union, and independent `fromSnapshot` reconstitution paths were verified conformant to RFC-0002 v1.3. Both findings from `NEXUS-REV-2026-07-21-001` are resolved and independently verified by `NEXUS-REV-2026-07-21-002`. TypeScript compile passed; the targeted Sprint 79 file-inventory Vitest suite passed 98/98 across 16 files. Sprint 78's frozen Evidence Foundation is unmodified.

## Findings

- `NEXUS-REV-0079-DEF-001` (Major, Implementation Defect) — `ConfidenceClassification.fromString`/`EvidenceVerificationStatus.fromString` trimmed whitespace before vocabulary comparison, silently accepting non-canonical padded input that the byte-stable canonical-encoding requirement should reject. **Resolved** by `BT-079-002`, verified by `NEXUS-REV-2026-07-21-002`.
- `NEXUS-REV-0079-DOC-001` (Minor, Documentation Drift) — the Forecasted Source Files' `evidence.errors.ts` new-exception-types entry was not implemented and this deviation was not disclosed in § Implementation Deviations or `IMPLEMENTATION_REPORT.md`. **Resolved** by `DOC-079-001`, verified by `NEXUS-REV-2026-07-21-002`.

## Required Actions

None. `BT-079-002` and `DOC-079-001` are Completed; no open Builder Task or Documentation Task remains for Sprint 79.

---

# Final Disposition

Approved with Findings.

Date: 2026-07-21

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-21-001`; findings resolved and verified by `NEXUS-REV-2026-07-21-002` (PASS) on 2026-07-21.
