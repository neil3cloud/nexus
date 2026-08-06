# Sprint 82 — Milestone 12 Independent Supporting-Governance Prerequisite Track (SGP-1) — Ratification Authority Snapshot Issuance Capability

## Status

**Current Sprint.** Activated by `NEXUS-RAT-2026-08-06-002` (2026-08-06) on the independent Milestone 12
Supporting-Governance Prerequisite Track, item SGP-1, established by `NEXUS-RAT-2026-08-06-001` (2026-08-06).
Implementation authorized; not yet delivered; not yet reviewed.

### Authority chain (binding)

1. `IMPLEMENTATION_CONSTITUTION.md` governs.
2. **`NEXUS-RAT-2026-08-06-002`, recorded in `knowledge/governance/RATIFICATION_LEDGER.md`, is the permanent
   authorization authority for this Sprint.** The Ratification Ledger is the authoritative repository and single
   source of truth for ratifications.
3. **This document is the self-contained operative Sprint Specification**, subordinate to the Constitution and to
   `NEXUS-RAT-2026-08-06-002`. It is the document the Builder works from, and it depends on no scratchpad, no
   session artifact, and no ungoverned section reference.
4. `builder-task.md` is a transient implementation artifact carrying no independent authority.

**Conflict rule.** If this record and `NEXUS-RAT-2026-08-06-002` diverge, **that Ledger entry prevails** and this
record is corrected. This record neither enlarges, narrows, nor reinterprets the Authorized Builder Scope.

SGP-1 sits **outside** the binding six-step Initial Capability Sequence. This Sprint is not a step, is not in the
Step 1 → 6 dependency order, resolves no Step 3A stop condition, does not reopen completed Milestone 9, and
neither conditions nor accelerates Milestone 12 completion.

# Sprint Identifier

Sprint 82 — Ratification Authority Snapshot Issuance Capability (Milestone 12, SGP-1).

# Objective

Implement the RFC-0011 Final (Amended) v1.8 § Ratification Authority Snapshot Issuance contract, as amended by
`NEXUS-RAT-2026-08-04-001` and `NEXUS-RAT-2026-08-05-001`, as one pure, standalone, directly invoked Kernel
library capability (Boundary A):

> Given exactly one governed octet sequence in the single declared carrier type, plus exactly two declared
> issuance facts (`capturedAt`, `producingAttribution`), produce exactly one total result — `Issued` or
> `Rejected` — conforming octet-for-octet to the Total Result Contract.

Certified by two structurally independent implementations agreeing on the complete public result field for field,
each cross-checked against RFC-0003's normative Conformance Vectors beforehand.

**Why this is the smallest coherent slice.** It is the whole of one ratified ownership boundary and no part of any
other. Every candidate reduction breaks the contract's own totality requirement: dropping any diagnostic phase
breaks *Issuance SHALL be total*; dropping the commitment layers leaves no `Issued` result to produce; dropping
either source fact is prohibited by § The Two Source Facts; dropping declaration handling silently reintroduces
the generic rule over its exclusive domain.

# Governing Authority

- **RFC-0011 — Engineering Governance Model, Final (Amended) v1.8**,
  `knowledge/specifications/rfc-0011-engineering-governance-model.md`. Governing sections, all within
  `# Ratification Authority Snapshot Issuance`: Purpose and Ownership Boundary; Canonical Serialization; The
  Source Input Domain; Governed Source Text Preparation; Fenced Regions; Governed Entry Extraction Grammar;
  Governed Declaration Block Grammar; The Two Source Facts; Fixed Protocol Constants; Lifecycle Authority Records;
  Lifecycle Segments and Structural Completeness; Canonical Schemas and Field Order; The Generic Source Rule;
  Governed Lifecycle Authority Declarations; Two Distinct Graphs; Authority Root and Envelope Commitment; Declared
  Issuance Facts; Deterministic Ordering; The Total Result Contract; Relationship to `NEXUS-RAT-2026-07-15-017`;
  Two Structurally Independent Implementations (line 1355); Schema Version and Compatibility (line 1368); Deferred
  Concepts. Also binding: `# Failure and Conflict Handling → ## Ratification Authority Snapshot Issuance
  Failures`; `# Conformance`.
- **RFC-0003 — Shared Reality Projection Model § Canonical Serialization Protocol (NCCS-1)**,
  `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`, rules 1–12 and the normative
  **Conformance Vectors** (line 295). Consumed exactly; not amended, not extended, not reinterpreted.
- **`NEXUS-RAT-2026-07-31-001`** — establishes the Issuance Contract and owns issuance, its derivation, and its
  commitments; establishes the conformance checkpoint as the ratified non-production evidence form. Its
  `Sprint proposal` limb was lifted by `NEXUS-RAT-2026-08-06-001`; its `implementation` and `Sprint activation`
  limbs are lifted for this exact scope by `NEXUS-RAT-2026-08-06-002` and for nothing else.
- **`NEXUS-RAT-2026-08-04-001`** — `ratificationSubject` on both record arms; schema version
  `nexus-ratification-authority-snapshot/3`; the complete `Issued` result schema.
- **`NEXUS-RAT-2026-08-02-001`** — records DEP1; establishes that a `RepositoryPolicySelectionReference` pins the
  envelope commitment and that every compared root is recomputed or re-derived.
- **`NEXUS-RAT-2026-08-05-001`** — DEP2 discharged for scope-free references only; DEP1 preserved.
- **`NEXUS-RAT-2026-08-06-001`** — defines this Sprint's complete implementation scope (Stage 1).
- **`NEXUS-RAT-2026-08-06-002`** — activates this Sprint and authorizes the exact inventory (Stage 2); the
  permanent authorization authority for this Sprint.
- **`NEXUS-RAT-2026-07-15-017`**, **`NEXUS-RAT-2026-07-16-001`** — untouched.
- **Kernel Canon 9** (determinism), **Canon 10** (explainability), **Canon 12** (human authority).
- **`IMPLEMENTATION_CONSTITUTION.md`** §§ Vertical Slice Policy, Approved Vertical Slice Immutability (397), RFC
  Coverage, Stop Conditions, Sprint Specifications, Sprint Owner Ratifications.
- **`IMPLEMENTATION_GATE.md`** Gates 1–15; Gate 3, Gate 8, Gate 10, and Gate 11 to be evidenced explicitly.

# RFC Coverage

## Primary

RFC-0011 — Engineering Governance Model, Final (Amended) v1.8, `# Ratification Authority Snapshot Issuance`.

## Referenced, read-only

RFC-0003 — Shared Reality Projection Model § Canonical Serialization Protocol (NCCS-1), rules 1–12 and the
normative Conformance Vectors.

## Not in coverage

RFC-0001, RFC-0002, RFC-0005, RFC-0006, RFC-0013 — not consumed, not referenced, not implemented.

# Implementation Scope — Implemented Concepts

One capability, `RatificationAuthoritySnapshotIssuance`, comprising exactly the following eighteen items,
reproduced in full from `NEXUS-RAT-2026-08-06-001` § Defined Scope.

**Boundary A is binding.** The capability is a pure function with no constructed state, no dependency, and no host
reachability. It is **not** composed by `createKernelServices()`. It is invoked directly by its own tests and by
nothing else. `src/kernel/common/create-kernel-services.ts` and
`test/integration/kernel-boundary-certification.integration.test.ts` are **not** changed. Composition would
enlarge the integration surface without supplying any capability this pure function requires.

1. **Source input domain** — exactly one declared concrete carrier type; every other carrier rejected as
   `invalid-input`, whether or not it holds the same octets.
2. **Governed source text preparation** — UTF-8 decode (`invalid-utf8`), BOM at any position
   (`byte-order-mark-present`), NCCS-1 rules 2 and 3. No trimming, padding, folding, or case normalization
   anywhere. Preparation produces the issuance input only and writes nothing back.
3. **Fence-aware region handling** — opening fence at column 0 with N ≥ 3 backticks, closing at M ≥ N; both fence
   lines belong to the region; no heading or entry boundary recognized inside one; unterminated region →
   `unterminated-fenced-region` in `EntryStructure`.
4. **Governed entry extraction grammar** — entry boundaries, section order, and extraction of identifier, date,
   subject, and current status; `missing-subject` fails closed in `EntryStructure` before any record exists.
5. **Governed declaration block grammar** — the `nexus-lifecycle-authority-declarations/1` block, exactly
   tokenized; no element inferred from prose. Issuance accepts **no caller-supplied declaration object** and
   exposes no parameter, field, or channel through which one could be supplied.
6. **The Generic Source Rule** — Current Status *exactly* `Active` → `WholeRecordLifecycle`, one `Effective`
   residual segment, kind `GenericSourceRule`; exclusive over its own domain.
7. **Governed declarations** — `declarant-not-effective`; `self-referential-declaration`;
   `status-binding-mismatch`; `absent-declaration-subject`; `duplicate-declaration`.
8. **Records and segments** — the seven declared fields; discriminated union on `lifecycleAuthorityKind` with
   illegal combinations structurally inexpressible, not merely rejected; `scopeKind` discrimination; exactly one
   reserved `residual` segment per record; `lifecycleResolutionForm` as a representation form, never a fourth
   status.
9. **Two distinct graphs** — declarant-authority and lifecycle-relation, with the complete normative DFS cycle
   selection, `closed`-marking as normative rather than an optimization, and the exact reported-path construction.
10. **Three commitment layers** — record fingerprint (`lr-sha256-`); authority root (`ar-sha256-`, governed octets
    alone, issuer- and time-independent); envelope commitment (`ec-sha256-`). Order-insensitive fingerprint
    collection per NCCS-1 rule 6; duplicate fingerprint fails closed.
11. **Declared issuance facts** — the `capturedAt` grammar with every rejected form; non-empty
    `producingImplementationIdentity` and `producingImplementationRevision`; **no internal clock read**;
    unrecognized declared field rejected, never ignored.
12. **Deterministic ordering** — every ordering term of § Deterministic Ordering.
13. **Total result contract** — the exact `Issued` field list with the three derived counts; `Rejected` with code,
    phase, precedence rank, discriminated payload, and canonical rendering. No partial snapshot, ever.
14. **Eight-phase diagnostic model** — phase order is execution order; phases atomic; within-phase precedence and
    target selection order; the closed public vocabulary and the contract-violation partition.
15. **Fixed protocol constants** — `nexus-repository-ratification-ledger`, `NCCS-1`,
    `nexus-ratification-authority-snapshot/3`, the three prefixes, `residual`, `Active`,
    `nexus-lifecycle-authority-declarations/1`. Not parameterized, not environment-derived, not caller-supplied.
16. **Issuer-side schema version emission only** — every `Issued` result carries `snapshotSchemaVersion` equal to
    the fixed v3 constant, encoded in declared schema order per NCCS-1 rule 8 and bound into the envelope
    commitment. **No consumer-side readability decision and no v1/v2 refusal behavior is within scope.**
17. **The second structurally independent implementation** (conformance oracle) and its independence,
    prior-vector, and complete-result agreement evidence.
18. **One conformance checkpoint** over the live Ratification Ledger at the exact revision current when the Sprint
    runs, reported in this Sprint Implementation Record and the review record only.

# Deferred and Prohibited Scope

Reproduced in full from `NEXUS-RAT-2026-08-06-001` § Deferred and Prohibited Scope. The two limbs lifted by
`NEXUS-RAT-2026-08-06-002` — implementation of the defined scope, and creation/activation of Sprint 82, its
Sprint Implementation Record, and its Builder Task — are the *only* items no longer deferred. Everything below
remains deferred and prohibited.

- **Production Snapshot issuance. DEP1 remains open, undischarged, unnarrowed.**
- **Pinning any authority root, envelope commitment, or record fingerprint anywhere** — a separately dispositioned
  deferral, preserved in full, and expressly not inside the governed source per RFC-0011 § Authority Root and
  Envelope Commitment: *a ratification that authorizes issuance SHALL therefore state the contract, never pin a
  value produced by it.*
- **Consumer-side schema-version readability and refusal** — deciding from `snapshotSchemaVersion` alone whether a
  held encoding is readable, and refusing v1 and v2 outright. A consuming-boundary obligation (RFC-0011 line
  1377), not an issuance obligation.
- The V1–V9 Consumption Correspondence of `NEXUS-RAT-2026-08-04-001` and the canonical consumed order.
- The two-arm structural input-domain widening and the added Required Outcome Mapping condition of
  `NEXUS-RAT-2026-08-05-001`.
- Repository Policy Selection, Pre-Use Verification Steps 1–5, `RepositoryPolicySelectionReference`, and every
  eligibility, cardinality, and binding rule of `NEXUS-RAT-2026-08-02-001`.
- Repository Policy Corpus Source assembly (`NEXUS-RAT-2026-08-03-001`).
- Any store, registry, resolver, locator, index, or retrieval protocol for issued artifacts.
- Any signature, certificate, key, trust anchor, or authenticated issuance registry.
- Any complete artifact encoding, wire format, framing, or commitment over a serialized issued result as a whole.
- Authorized-subject attestations in every form — no field, no collection, no subject-kind union, no placeholder,
  no dormant extraction path.
- Automatic Ratification-Ledger ingestion beyond this source contract.
- v1/v2 artifact migration, upgrade, or partial reading.
- Scope-bearing Ratification references and any positive resolution of a carved governed scope. **DEP2's discharge
  is not broadened by one word.**
- Any host surface, adapter surface, VS Code command, Domain Event, or durable persistence — including any
  `createKernelServices()` composition (Boundary A).
- Any modification to `src/kernel/common/create-kernel-services.ts` or
  `test/integration/kernel-boundary-certification.integration.test.ts`.
- Any modification to any Sprint 54 module.
- Any change to Milestone 9, to the Milestone 12 Initial Capability Sequence, or to any Step 3A stop condition.
- Any Git operation, and any edit to a prior Ledger entry's octets, `## Current Status`, declaration block, or
  `sourceStatusDigest`.

# Out-of-Scope Items (restated for the Sprint Template)

Production Snapshot issuance; artifact custody, retrieval, serialization, re-issuance, and superseded-revision
lifecycle; authority-root or commitment-value pinning; consumer-side version readability and v1/v2 refusal; the
V1–V9 Consumption Correspondence; Repository Policy Selection and Pre-Use Verification; Repository Policy Corpus
Source assembly; scope-bearing Ratification references; hosts, adapters, Domain Events, durable persistence, and
`createKernelServices()` composition; any Sprint 54 module change; any RFC, Kernel Canon, or prior Ledger entry
amendment; any planning-document historical-narrative correction; any Git operation.

# RFC Coverage and Ownership Boundaries

| Concern | Owner | Sprint 82 |
| --- | --- | --- |
| Derivation of the immutable record collection, its schemas, schema version, three commitment layers, declared issuance facts, diagnostic vocabulary, phase model | Ratification Authority Snapshot Issuance (`NEXUS-RAT-2026-07-31-001`, amended by `-08-04-001`) | **In scope** |
| Ratification reference resolution; the closed `Valid \| Invalid \| Unresolvable` set; the Required Outcome Mapping; the Snapshot fingerprint derivation | `RatificationAttributionValidation` (`NEXUS-RAT-2026-07-15-017`, `-07-16-001`, amended by `-08-05-001`) | **Untouched.** Issuance produces exactly `Issued` or `Rejected` and SHALL NEVER produce any of the three outcomes. |
| V1–V9 verification chain; canonical consumed order; consumer-side version readability | Consumption Correspondence (`NEXUS-RAT-2026-08-04-001`) | **Untouched, not invoked** |
| Candidate assembly, eligibility, cardinality, version binding | Repository Policy Selection (`NEXUS-RAT-2026-08-02-001`) | **Untouched, not invoked** |
| Which Repository Policy versions exist; corpus root; content commitment | Repository Policy Corpus Source (`NEXUS-RAT-2026-08-03-001`) | **Untouched, not invoked** |
| Sprint 54's `RatificationAuthoritySnapshot`, `RatificationAuthorityRecord`, `IRatificationAuthoritySnapshotRepository`, `RatificationAttributionValidationService` | Approved vertical slice (`NEXUS-REV-2026-07-16-001`) | **Behavior preserved; not redefined; not extended; not modified.** |

**Sprint 54 restriction, by ownership.** `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability
permits a subsequent Sprint to consume approved capabilities, to extend them where explicitly authorized, and to
correct review-identified defects, while prohibiting redefinition of approved behavior, unauthorized scope
expansion, and modification for architectural preference. The binding restriction here is narrower than
provenance: the consumed-state `RatificationAuthorityRecord` and the v3 issued `LifecycleAuthorityRecord` are
**two structures with two distinct owners and two distinct shapes**, and SHALL NOT be merged, aliased, renamed, or
re-typed into one another. Boundary A defines no Sprint 54 modification of any kind.

**Naming boundary (Gate 3):** the issued v3 record is `LifecycleAuthorityRecord`; Sprint 54's in-memory
consumed-state type is `RatificationAuthorityRecord`.

# Deterministic Failure Behavior

Issuance is total. Every governed input yields exactly `Issued` or `Rejected`; an unhandled failure, a thrown
exception escaping the boundary, or an absent result is a **contract violation**, not a diagnostic. Eight governed
phases ranked 0–7, plus the ninth contract-violation partition. Phase order is execution order; a phase is atomic
and runs to a decision before the next begins. When a source carries several independent defects, the reported
diagnostic is always drawn from the **lowest-ranked phase containing any defect**, wherever in the source the
defects sit.

| Condition | Outcome |
| --- | --- |
| Octets outside the declared source input domain | `Rejected` · `SourceIntegrity` |
| Invalid UTF-8, or a byte order mark | `Rejected` · `SourceIntegrity` |
| Unreadable entry structure, or an unclosed fenced region | `Rejected` · `EntryStructure` |
| Malformed structured declaration block | `Rejected` · `DeclarationGrammar` |
| Declaring authority not Effective under the generic rule | `Rejected` · `DeclarantAuthority` |
| Declaration self-reference, or a declarant-authority cycle | `Rejected` · `DeclarantAuthority` |
| Absent subject, generic-rule conflict, status-binding mismatch, or duplicate declaration | `Rejected` · `DeclarationBinding` |
| Absent relation target, self-referential relation, or a lifecycle-relation cycle | `Rejected` · `LifecycleGraph` |
| An entry with neither generic resolution nor a governed declaration | `Rejected` · `Resolution` |
| Inadmissible declared capture instant or producing attribution | `Rejected` · `Envelope` |
| All phases pass | `Issued` |

Issuance failures are **not** Governance Decisions and SHALL NOT be mapped onto `Approved`, `Rejected`,
`Deferred`, or `Escalation Required`. Recovery is re-invocation: a `Rejected` result leaves no partial artifact
and no stored value to reconcile. Correcting a rejection is a **governed-source correction under separate
authority** — never a repair, normalization, back-fill, or re-declaration performed by issuance or by the Builder.
A `Rejected` result on the live corpus is a legitimate, informative Sprint outcome, not a Sprint failure.

# The Second Structurally Independent Implementation

RFC-0011 line 1355 requires at least two implementations with **no shared encoder, no shared schema table, no
shared vocabulary structure, and no shared parsing component**, agreeing on **the complete public result, field
for field** — *not merely on fingerprints* — and both cross-checked against RFC-0003's normative Conformance
Vectors **before** any agreement between them is claimed.

**Independence is enforced three ways.**

1. **Authoring rule.** The oracle is written from the specification text alone. It SHALL NOT be derived from,
   refactored out of, or diffed against the implementation. This is attested in this Sprint Implementation Record
   and verified by the Reviewer.
2. **Mechanical import-graph assertion.** `oracle-independence.test.ts` asserts by static import-graph traversal
   that none of the five oracle modules — `nccs1-encoder.oracle.ts`, `schema-table.oracle.ts`,
   `source-parser.oracle.ts`, `vocabulary.oracle.ts`, `issuance.oracle.ts` — transitively imports any module under
   `src/`. The assertion fails on any such edge. `oracle-agreement.test.ts` is the single authorized place where
   both sides are imported together.
3. **Prior-vector rule.** Both encoders are cross-checked independently against RFC-0003's Conformance Vectors in
   `nccs1-conformance-vectors.test.ts`, and **agreement between the two implementations SHALL NOT be reported
   until both vector checks pass.**

**Agreement means deep structural equality on the complete public result value**, for every input in the agreement
corpus:

- for `Issued`: `result`; the complete `envelope`, all eight fields, including both members of
  `producingAttribution`; `envelopeCommitment`; the complete `records` collection field for field, including every
  segment and every relation on every record; the complete `recordFingerprints` collection; and
  `declarationCount`, `genericCount`, `segmentedCount`;
- for `Rejected`: `result`; `diagnosticCode`; `diagnosticPhase`; `diagnosticPrecedence`; the discriminated
  `diagnosticPayload` including its canonical rendering; and `detail`.

**Digest-only, envelope-only, or selected-field comparison is insufficient and SHALL NOT be reported as
agreement.**

**Agreement corpus:** the live Ratification Ledger at the Sprint's exact revision; every fixture exercising
T1–T20; and every code in the closed public vocabulary.

# Acceptance Criteria — Required Tests T1–T21

| # | Area | Obligation |
| --- | --- | --- |
| T1 | Carrier domain | Declared carrier accepted; every other carrier rejected `invalid-input`, including one holding byte-identical octets |
| T2 | Source integrity | `invalid-utf8`; `byte-order-mark-present` at start, middle, and end |
| T3 | Preparation | CRLF and lone CR fold to LF; NFC applied; a trailing-whitespace `Active ` does **not** resolve as Effective; no stored octet mutated |
| T4 | Fenced regions | Inner fence enclosed verbatim by a longer outer fence; heading inside a region not recognized; `unterminated-fenced-region` |
| T5 | Entry structure | Boundary and section extraction; section order by first occurrence; `missing-subject` |
| T6 | Declaration grammar | Exact tokenization; every malformed form rejected; **negative test that no API surface accepts a caller-supplied declaration object** |
| T7 | Generic source rule | Exactly `Active` → `WholeRecordLifecycle` + one `Effective` residual; exclusivity — a declaration targeting a generically resolved entry is rejected |
| T8 | Declaration binding | `declarant-not-effective`; `self-referential-declaration`; `status-binding-mismatch`; `absent-declaration-subject`; `duplicate-declaration` |
| T9 | Records | Seven fields; `ratificationSubject` carried verbatim, never derived or normalized; illegal arm combinations structurally inexpressible at type level, not runtime-only |
| T10 | Segments | `scopeKind` discrimination; exactly one reserved `residual` per record; `lifecycleResolutionForm` never treated as a status |
| T11 | Graphs and cycles | Both graphs independently; a multi-cycle source returns the exact normatively selected path; `closed`-marking hides no cycle |
| T12 | Commitments | Record fingerprint, authority root, envelope commitment, each with correct prefix; duplicate fingerprint fails closed; **root invariant under differing declared facts**; **envelope commitment varies with them** |
| T13 | Declared facts | Every rejected `capturedAt` form (offsets, fractional seconds, local time, `24:00:00`, leap seconds, impossible calendar dates); empty attribution member; unrecognized declared field rejected not ignored; **no clock read**, asserted by construction |
| T14 | Ordering | Every ordering term; NCCS-1 rule 6 collection order; supply-order independence of the root |
| T15 | `Issued` shape | Exact field list; three counts derived and re-derivable; `declarationCount + genericCount = recordCount`; `segmentedCount` added to neither; missing or extra field rejected; **an object with correct root and correct commitment but a falsified count is still not an `Issued` result** |
| T16 | `Rejected` shape | Code, phase, precedence, discriminated payload, canonical rendering for each payload variant; no partial snapshot |
| T17 | Phase precedence | A source carrying defects in several phases reports the lowest-ranked phase's diagnostic; within-phase precedence and target selection each covered |
| T18 | Vocabulary | Every code in the closed public vocabulary reachable by at least one test; no code outside it emitted |
| T19 | Issuer-side schema version | Every `Issued` result carries `snapshotSchemaVersion` exactly `nexus-ratification-authority-snapshot/3`; the constant is not parameterized, not caller-supplied, not environment-derived; it encodes in declared schema order and binds into the envelope commitment. **No consumer-side readability or v1/v2 refusal behavior is implemented or tested** |
| T20 | Boundary | Import-graph test: issuance imports no `GovernanceDecision`, `PolicyEvaluation`, event, host, or adapter surface, and is not referenced by `src/kernel/common/create-kernel-services.ts`; issuance never returns `Valid`/`Invalid`/`Unresolvable`; no Sprint 54 module is modified |
| T21 | Independence and agreement | The import-graph independence assertion over the five oracle modules; both encoders' RFC-0003 Conformance Vector checks; complete-result field-for-field agreement across the whole corpus |

**All fixture octets are constructed inline within the test files enumerated below. No fixture directory, fixture
file, or generated-artifact path is within scope.** The live Ratification Ledger is read from its existing
repository path and is never written.

# Deliverables and Authorized File Inventory (exact — 4 + 13 + 7 = 24)

Authorized in full by `NEXUS-RAT-2026-08-06-002` § Authorized Builder Scope, identical to
`NEXUS-RAT-2026-08-06-001` § Forecasted Future Activation and Builder Inventory. **No path below is a pattern. No
wildcard, "at minimum", or open-ended directory allowance forms part of it. A file not listed here is not
authorized and requires a further ratification.**

## Implementation files (4)

1. `src/kernel/governance/ratification-authority-snapshot-issuance.types.ts`
2. `src/kernel/governance/ratification-authority-snapshot-issuance.errors.ts`
3. `src/kernel/governance/ratification-authority-snapshot-issuance.contract.ts`
4. `src/kernel/governance/ratification-authority-snapshot-issuance.ts`

## Test files (13)

| # | Exact path | Covers |
| --- | --- | --- |
| 1 | `test/kernel/governance/ratification-authority-snapshot-issuance-source-domain.test.ts` | T1, T2, T3 |
| 2 | `test/kernel/governance/ratification-authority-snapshot-issuance-entry-structure.test.ts` | T4, T5 |
| 3 | `test/kernel/governance/ratification-authority-snapshot-issuance-declarations.test.ts` | T6, T7, T8 |
| 4 | `test/kernel/governance/ratification-authority-snapshot-issuance-records.test.ts` | T9, T10 |
| 5 | `test/kernel/governance/ratification-authority-snapshot-issuance-graphs.test.ts` | T11 |
| 6 | `test/kernel/governance/ratification-authority-snapshot-issuance-commitments.test.ts` | T12, T14 |
| 7 | `test/kernel/governance/ratification-authority-snapshot-issuance-declared-facts.test.ts` | T13 |
| 8 | `test/kernel/governance/ratification-authority-snapshot-issuance-result-contract.test.ts` | T15, T16 |
| 9 | `test/kernel/governance/ratification-authority-snapshot-issuance-diagnostics.test.ts` | T17, T18 |
| 10 | `test/kernel/governance/ratification-authority-snapshot-issuance-schema-version.test.ts` | T19 |
| 11 | `test/kernel/governance/ratification-authority-snapshot-issuance-boundary.test.ts` | T20 |
| 12 | `test/kernel/governance/ratification-authority-snapshot-issuance-conformance-checkpoint.test.ts` | The live-corpus conformance checkpoint |
| 13 | `test/kernel/governance/nccs1-conformance-vectors.test.ts` | Both encoders against RFC-0003's Conformance Vectors (T21, prior-vector rule) |

## Conformance-oracle files (7)

1. `test/kernel/governance/issuance-oracle/nccs1-encoder.oracle.ts`
2. `test/kernel/governance/issuance-oracle/schema-table.oracle.ts`
3. `test/kernel/governance/issuance-oracle/source-parser.oracle.ts`
4. `test/kernel/governance/issuance-oracle/vocabulary.oracle.ts`
5. `test/kernel/governance/issuance-oracle/issuance.oracle.ts`
6. `test/kernel/governance/issuance-oracle/oracle-independence.test.ts`
7. `test/kernel/governance/issuance-oracle/oracle-agreement.test.ts`

## Expressly not changed at any stage

`src/kernel/common/create-kernel-services.ts`; `test/integration/kernel-boundary-certification.integration.test.ts`;
`src/kernel/governance/ratification-authority-snapshot.ts`;
`src/kernel/governance/ratification-attribution-validation.ts`;
`src/kernel/governance/ratification-attribution.contract.ts`;
`src/kernel/governance/ratification-attribution.errors.ts`;
`src/kernel/governance/ratification-attribution.types.ts`;
`src/kernel/governance/ratification-authority.repository.ts`;
`knowledge/specifications/rfc-0011-engineering-governance-model.md`;
`knowledge/specifications/rfc-0003-shared-reality-projection-model.md`; and every Kernel Canon document. No prior
Ledger entry's octets, `## Current Status`, declaration block, or `sourceStatusDigest` is edited at any stage.

# Completion Requirements — Acceptance Evidence

1. **Two structurally independent implementations agree on the complete public result, field for field**, across
   the agreement corpus, with independence mechanically enforced and both encoders cross-checked against
   RFC-0003's Conformance Vectors **before** agreement is reported.
2. **One conformance checkpoint** over the live Ratification Ledger at the exact revision current when the Sprint
   runs, reporting the total result. If `Issued`: record count, `authoritySourceRevision`, authority root,
   envelope commitment, and the three counts. If `Rejected`: the exact code, phase, precedence, payload, and
   canonical rendering.
   - This is a **conformance checkpoint** in the sense `NEXUS-RAT-2026-07-31-001` § Conformance Checkpoint Status
     names. It is **not** a production Snapshot, **not** a durable pin, and **does not discharge DEP1**.
   - Every value is reported in this Sprint Implementation Record and the review record. **No value is written
     into `RATIFICATION_LEDGER.md`** — self-inclusion is prohibited.
3. **Repository validation**: `tsc --noEmit`, ESLint, the full Vitest suite, `npm run build`, and
   `npm run test:extension-host:build`, all clean.
4. **`IMPLEMENTATION_GATE.md` Gates 1–15 = PASS**, with Gate 3, Gate 8, Gate 10, and Gate 11 evidenced explicitly.
5. **Independent Reviewer disposition** recorded in `REVIEW_HISTORY.md`.

# Stop Conditions (verbatim and unchanged from `NEXUS-RAT-2026-08-06-001`, Conditions 1–10)

1. **The scope attempts to decide the production-issuance authority, the declared production facts, artifact custody, retrieval, serialization, or the re-issuance and superseded-revision lifecycle.** Each belongs to a separate production-issuance ratification; deciding any of them here would redefine architecture, prohibited by `IMPLEMENTATION_CONSTITUTION.md`:559.
2. **This instrument or the future Sprint is described as discharging DEP1.** Neither does. A scope ratification defines future implementation scope; an activation ratification authorizes implementation; DEP1 closes only when production issuance is separately authorized and an artifact is actually issued under that authority.
3. **Any commitment value is proposed for the Ledger, or any authority root is proposed for pinning.** Both are prohibited by RFC-0011 § Authority Root and Envelope Commitment, and the authority-root pinning deferral is preserved in full.
4. **Any Sprint 54 module modification becomes necessary.** `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability does permit an explicitly authorized extension of an approved capability — but **Boundary A defines no Sprint 54 modification**, and none appears in the forecasted inventory. The Builder therefore stops and returns for explicit scope amendment and ownership review; the reason is absence from the approved inventory, not a universal constitutional prohibition. Separately and unconditionally, merging, aliasing, renaming, or re-typing the consumed-state `RatificationAuthorityRecord` and the v3 `LifecycleAuthorityRecord` into one another remains prohibited.
5. **Composition into `createKernelServices()` becomes necessary**, or any change to `src/kernel/common/create-kernel-services.ts` or `test/integration/kernel-boundary-certification.integration.test.ts` is required. Boundary A defines neither.
6. **The scope drifts** into the Consumption Correspondence, consumer-side version readability, the resolver's two-arm input domain, Repository Policy Selection, or the Corpus Source contract.
7. **Any scope-bearing reference concept, or any positive resolution of a carved governed scope, appears.** DEP2's discharge is scope-free-only and is not broadened.
8. **A governed-source correction appears necessary** to make the live corpus issue — a separate governance act under separate authority, never a Builder repair.
9. **The oracle is derived from the implementation, or agreement is reported before both RFC-0003 Conformance Vector checks pass.** Either destroys the independence evidence RFC-0011 line 1357 requires.
10. **Any file outside the forecasted inventory requires creation or modification.**

# Dependencies

RFC-0011 Final (Amended) v1.8 as amended through `NEXUS-RAT-2026-08-05-001`; RFC-0003's NCCS-1 and its normative
Conformance Vectors; the approved Sprint 54 vertical slice, consumed by ownership boundary only and not modified.
**Depends on no step of the Milestone 12 Initial Capability Sequence.**

# Validation Summary

Reserved. To be completed by the Builder after delivery.

# Files Added

Reserved. To be completed by the Builder after delivery.

# Files Modified

Reserved. To be completed by the Builder after delivery. Expected: none outside the authorized inventory; all
twenty-four authorized files are new.

# Implementation Deviations

Reserved. To be completed by the Builder after delivery.

# Governance Deviations

Reserved. To be completed by the Builder after delivery.

# Builder Summary

Reserved. To be completed by the Builder after delivery.

# Traceability

| Artifact | Identifier |
| --- | --- |
| Stage 1 scope ratification | `NEXUS-RAT-2026-08-06-001` |
| Stage 2 activation ratification (permanent authorization authority) | `NEXUS-RAT-2026-08-06-002` |
| Contract authority | `NEXUS-RAT-2026-07-31-001`, amended by `NEXUS-RAT-2026-08-04-001` and `NEXUS-RAT-2026-08-05-001` |
| DEP1 source (preserved, undischarged) | `NEXUS-RAT-2026-08-02-001` |
| Primary RFC | RFC-0011 Final (Amended) v1.8 |
| Referenced RFC | RFC-0003 § NCCS-1, Conformance Vectors |
| Builder Task | `BT-082-001` |
| Milestone / track | Milestone 12, independent Supporting-Governance Prerequisite Track, SGP-1 |
| Related prior slice | Sprint 54 (`NEXUS-REV-2026-07-16-001`), consumed by ownership boundary only |

# Reviewer Notes

Reserved. To be completed by the independent Reviewer.

# Final Disposition

Reserved. To be completed by the independent Reviewer and recorded in `REVIEW_HISTORY.md`.
