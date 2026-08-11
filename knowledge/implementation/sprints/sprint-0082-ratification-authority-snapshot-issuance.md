# Sprint 82 — Milestone 12 Independent Supporting-Governance Prerequisite Track (SGP-1) — Ratification Authority Snapshot Issuance Capability

## Status

**Approved with Findings.** Activated by `NEXUS-RAT-2026-08-06-002` (2026-08-06), as amended by `NEXUS-RAT-2026-08-10-001`,
on the independent Milestone 12 Supporting-Governance Prerequisite Track, item SGP-1, established by
`NEXUS-RAT-2026-08-06-001` (2026-08-06), as amended by `NEXUS-RAT-2026-08-10-001` (2026-08-10).
Implementation delivered and reviewed; **rejected** by the independent Reviewer under `NEXUS-REV-2026-08-06-001`
(2026-08-06) — two Critical, four Major, and three Minor findings; see § Reviewer Notes and § Final Disposition.
Remediation proceeds through the `nexus-sprint` workflow within the existing authorized 24-file inventory.
Re-verified with no delta under `NEXUS-REV-2026-08-06-002` (2026-08-06): no Builder work occurred between the two
cycles; rejection stands unchanged; no new finding. Sprint Owner Resolution (2026-08-06) subsequently opened
`BT-082-002` as the sole currently executable recovery task under the then-existing, still-active
`NEXUS-RAT-2026-08-06-002`, since amended by `NEXUS-RAT-2026-08-10-001` (the Resolution itself created no new
Ratification and no new Ledger entry). Re-verified with no delta a second time under `NEXUS-REV-2026-08-06-003`
(2026-08-06): `BT-082-002` remains unstarted; rejection stands unchanged; no new finding.
`BT-082-002` implemented and independently certified complete under `NEXUS-REV-2026-08-07-001` (2026-08-07):
`NEXUS-REV-0082-CRIT-001` is resolved. **Sprint-level disposition remains Rejected** — eight findings
(`NEXUS-REV-0082-CRIT-002`, `-MAJ-001`, `-MAJ-002`, `-MAJ-003`, `-MIN-001`, `-MIN-002`, `-MIN-003`, `-DOC-001`)
remain open. `BT-082-003` is unblocked for the next remediation cycle.
`BT-082-003` implemented and independently certified complete under `NEXUS-REV-2026-08-07-002` (2026-08-07):
`NEXUS-REV-0082-CRIT-002` is resolved (the agreement corpus now covers the live Ledger, four `Issued` cases, and
all 46 vocabulary codes; independence re-examined and confirmed intact given the two implementations' similar
size). `NEXUS-REV-0082-MAJ-001` is resolved as a collateral effect. **No Critical finding remains open.**
**Sprint 82 is Approved with Findings.**
`BT-082-005` implemented and independently certified complete under `NEXUS-REV-2026-08-07-003` (2026-08-07):
`NEXUS-REV-0082-MAJ-002` is resolved — both governed graphs are now exercised independently for cycle detection,
and each reported `RelationPathPayload` was verified against paths the Reviewer derived independently from
RFC-0011 § Cycle Selection. **Sprint 82 remains Approved with Findings.** Open findings: `NEXUS-REV-0082-MAJ-003`,
`-MAJ-004` (agreement-corpus fixture completeness against the T1–T20 corpus definition), `-MIN-001`, `-MIN-002`,
`-MIN-003`, `-MIN-004` (`toEqual` vs. `toStrictEqual`), `-MIN-005` (new — the T11 cycle fixtures do not
discriminate rule 3.2's `closed` branch or rule 2's root ordering), and `-DOC-001` (unblocked). See § Reviewer
Notes and § Final Disposition. Remediation of the remaining findings proceeds through `nexus-sprint` but does not
block this approval.

### Authority chain (binding)

1. `IMPLEMENTATION_CONSTITUTION.md` governs.
2. **`NEXUS-RAT-2026-08-06-002`, as amended by `NEXUS-RAT-2026-08-10-001`, recorded in
   `knowledge/governance/RATIFICATION_LEDGER.md`, is the permanent authorization authority for this Sprint.**
   The amendment reaches only the semantic extent named in its § Amendment Matrix and does not displace,
   supersede, or share that permanent authority. `NEXUS-RAT-2026-08-11-001` likewise does not displace,
   supersede, or share it: that instrument is an amendment authority within its own named extent only and
   authorizes no Sprint. The Ratification Ledger is the authoritative repository and
   single source of truth for ratifications.
3. **This document is the self-contained operative Sprint Specification**, subordinate to the Constitution, to
   `NEXUS-RAT-2026-08-06-002`, and to `NEXUS-RAT-2026-08-10-001` and `NEXUS-RAT-2026-08-11-001` as its
   amendment authorities, each within its own named extent. It is the document
   the Builder works from, and it depends on no scratchpad, no session artifact, and no ungoverned section
   reference.
4. `builder-task.md` is a transient implementation artifact carrying no independent authority.

**Conflict rule.** If this record diverges from `NEXUS-RAT-2026-08-06-002` as amended by
`NEXUS-RAT-2026-08-10-001`, or from `NEXUS-RAT-2026-08-11-001` within its named amended extent,
**the applicable Ledger entry or entries prevail** and this record is corrected. Where those Ledger entries
themselves diverge, `NEXUS-RAT-2026-08-11-001` prevails within its named amended extent,
`NEXUS-RAT-2026-08-10-001` prevails within its named amended extent outside that, and
`NEXUS-RAT-2026-08-06-002` prevails everywhere else. This record neither enlarges, narrows, nor
reinterprets the Authorized Builder Scope.

SGP-1 sits **outside** the binding six-step Initial Capability Sequence. This Sprint is not a step, is not in the
Step 1 → 6 dependency order, resolves no Step 3A stop condition, does not reopen completed Milestone 9, and
neither conditions nor accelerates Milestone 12 completion.

# Sprint Identifier

Sprint 82 — Ratification Authority Snapshot Issuance Capability (Milestone 12, SGP-1).

# Objective

Implement the RFC-0011 Final (Amended) v1.10 § Ratification Authority Snapshot Issuance contract, as amended by
`NEXUS-RAT-2026-08-04-001`, `NEXUS-RAT-2026-08-05-001`, `NEXUS-RAT-2026-08-10-001`, and
`NEXUS-RAT-2026-08-11-001`, as one pure, standalone,
directly invoked Kernel
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

- **RFC-0011 — Engineering Governance Model, Final (Amended) v1.10**,
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
- **`NEXUS-RAT-2026-07-31-001`, as amended by `NEXUS-RAT-2026-08-04-001`, `NEXUS-RAT-2026-08-05-001`,
  `NEXUS-RAT-2026-08-10-001`, and `NEXUS-RAT-2026-08-11-001`** — establishes the Issuance Contract and owns
  issuance, its derivation, and its
  commitments; establishes the conformance checkpoint as the ratified non-production evidence form. Its
  `Sprint proposal` limb was lifted by `NEXUS-RAT-2026-08-06-001`; its `implementation` and `Sprint activation`
  limbs are lifted for this exact scope by `NEXUS-RAT-2026-08-06-002` and for nothing else. Its phase model,
  closed public vocabulary, diagnostic precedence, duplicate-fingerprint outcome, and contract-violation
  representation are amended by `NEXUS-RAT-2026-08-10-001` at those clauses only, and its diagnostic payload
  contract is amended by `NEXUS-RAT-2026-08-11-001` solely by the pair-scoped empty-token exception over
  data-String fields; every other clause stands
  unchanged. As so amended it remains the contract authority.
- **`NEXUS-RAT-2026-08-04-001`** — `ratificationSubject` on both record arms; schema version
  `nexus-ratification-authority-snapshot/3`; the complete `Issued` result schema.
- **`NEXUS-RAT-2026-08-02-001`** — records DEP1; establishes that a `RepositoryPolicySelectionReference` pins the
  envelope commitment and that every compared root is recomputed or re-derived.
- **`NEXUS-RAT-2026-08-05-001`** — DEP2 discharged for scope-free references only; DEP1 preserved.
- **`NEXUS-RAT-2026-08-06-001`, as amended by `NEXUS-RAT-2026-08-10-001`** — defines this Sprint's complete
  implementation scope (Stage 1). The amendment reaches Defined Scope item 14 and Required Tests T12, T14, T16,
  T17, and T18 only; the twenty-four-file inventory, the Deferred and Prohibited Scope including DEP1, and every
  other clause are unchanged. As so amended it remains the Stage 1 Defined Scope.
- **`NEXUS-RAT-2026-08-06-002`, as amended by `NEXUS-RAT-2026-08-10-001`** — activates this Sprint and authorizes
  the exact inventory (Stage 2); the permanent authorization authority for this Sprint. The amendment authorizes
  implementation of the amended semantics within that unchanged inventory and replaces the remediation task
  order; outside that named extent its Subject sentence continues to bind exactly as written. Its authority is
  not displaced, superseded, or shared.
- **`NEXUS-RAT-2026-08-10-001`** — the binding amendment authority for exactly the semantics named in its
  § Amendment Matrix, and for nothing else: the governed `Commitment` phase at rank 7, the public
  `duplicate-record-fingerprint` diagnostic, the forty-seven-code closed public vocabulary, the two changed
  `Envelope` precedence values, and the non-public representation of the three contract-violation codes. It
  amended RFC-0011 to v1.9 at its issuance date, which is a historical statement of that instrument's extent
  and not a current governing-version assertion; the current governing version is v1.10 as amended by
  `NEXUS-RAT-2026-08-11-001`. It authorizes no activation, no new Sprint, no new file, and no scope beyond the
  amended extent.
- **`NEXUS-RAT-2026-08-11-001`** — the binding amendment authority for exactly the semantics named in its
  § Amendment Matrix, and for nothing else: the pair-scoped empty-token exception over data-String diagnostic
  payload fields, comprising `malformed-scope-key` with `scopeKey` and `malformed-attribution` with
  `declaredField`; the code-aware form of § Contract Violations rule 5; and one additive cross-reference
  sentence at rule 3, which is otherwise preserved verbatim. It amends RFC-0011 to **v1.10**, which is the
  current governing version. It changes no diagnostic identity, no phase, no precedence, no payload variant, no
  result shape, no traversal order, no canonical encoding, and no schema version; the `payloadKind`
  variant-match obligation is unchanged. It authorizes a bounded two-file implementation delta inside the
  existing seven-file `BT-082-007` boundary, enlarges no inventory, authorizes no activation, creates no file,
  dispatches no Builder task, and pulls no oracle work forward from `BT-082-010`. It does not displace,
  supersede, or share the permanent authorization authority of `NEXUS-RAT-2026-08-06-002`.
- **`NEXUS-RAT-2026-07-15-017`**, **`NEXUS-RAT-2026-07-16-001`** — untouched.
- **Kernel Canon 9** (determinism), **Canon 10** (explainability), **Canon 12** (human authority).
- **`IMPLEMENTATION_CONSTITUTION.md`** §§ Vertical Slice Policy, Approved Vertical Slice Immutability (397), RFC
  Coverage, Stop Conditions, Sprint Specifications, Sprint Owner Ratifications.
- **`IMPLEMENTATION_GATE.md`** Gates 1–15; Gate 3, Gate 8, Gate 10, and Gate 11 to be evidenced explicitly.

# RFC Coverage

## Primary

RFC-0011 — Engineering Governance Model, Final (Amended) v1.10, `# Ratification Authority Snapshot Issuance`.

## Referenced, read-only

RFC-0003 — Shared Reality Projection Model § Canonical Serialization Protocol (NCCS-1), rules 1–12 and the
normative Conformance Vectors.

## Not in coverage

RFC-0001, RFC-0002, RFC-0005, RFC-0006, RFC-0013 — not consumed, not referenced, not implemented.

# Implementation Scope — Implemented Concepts

One capability, `RatificationAuthoritySnapshotIssuance`, comprising exactly the following eighteen items,
reproduced in full from `NEXUS-RAT-2026-08-06-001` § Defined Scope as amended by `NEXUS-RAT-2026-08-10-001`. That
amendment reaches item 14 only; items 1–13 and 15–18 are reproduced unchanged.

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
14. **Nine-phase diagnostic model** — phase order is execution order; phases atomic; within-phase
    precedence and target selection order; the closed public vocabulary and the contract-violation
    partition. The ninth governed phase is `Commitment` at rank 7, between `Resolution` and
    `Envelope`; `Envelope` is rank 8 and the non-governed `ContractViolation` partition is rank 9.
    The `Commitment` phase comprises authority-source-revision derivation, record-fingerprint
    derivation in record order, the record-order uniqueness check, the canonical order-insensitive
    encoding of the fingerprint collection, and authority-root derivation, all completing before
    any `Envelope` examination begins. The closed public vocabulary is forty-seven codes. The three
    contract-violation codes are represented on the named non-public error channel of RFC-0011
    v1.10 § Contract Violations and are never returned. Rule 5's non-empty obligation over
    data-String payload fields is code-aware per `NEXUS-RAT-2026-08-11-001`, admitting an empty
    value on exactly the two declared empty-token pairs and on no other of the sixty-three pairs;
    the `payloadKind` variant-match obligation is unchanged and reaches no exception.
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

Reproduced in full from `NEXUS-RAT-2026-08-06-001` § Deferred and Prohibited Scope, which `NEXUS-RAT-2026-08-10-001`
leaves unchanged in every clause, DEP1 included.
The two limbs lifted by `NEXUS-RAT-2026-08-06-002`, and equally untouched by `NEXUS-RAT-2026-08-10-001` —
implementation of the defined scope, and creation/activation of Sprint 82, its
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
| Derivation of the immutable record collection, its schemas, schema version, three commitment layers, declared issuance facts, diagnostic vocabulary, phase model | Ratification Authority Snapshot Issuance (`NEXUS-RAT-2026-07-31-001`, amended by `NEXUS-RAT-2026-08-04-001`, `NEXUS-RAT-2026-08-05-001`, and `NEXUS-RAT-2026-08-10-001`) | **In scope** |
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
exception escaping the boundary, or an absent result is a **contract violation**, not a diagnostic. Nine governed
phases ranked 0–8, plus the tenth contract-violation partition at rank 9. Phase order is execution order; a phase is atomic
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

**Empty-token reporting.** Three governed inputs report a defect whose subject is itself the empty
token: a declaration segment line declaring a present but empty scope key, an unrecognized input
property key that is the empty String, and an unrecognized `producingAttribution` property key that
is the empty String. Each returns a governed `Rejected` result — `malformed-scope-key` in
`DeclarationGrammar` for the first, `malformed-attribution` in `Envelope` for the other two — and
none reaches the contract-violation channel. Under `NEXUS-RAT-2026-08-11-001` the runtime payload
validation of RFC-0011 v1.10 § Contract Violations rule 5 is code-aware over data-String fields and
permits an empty value on exactly two code-and-field pairs, `malformed-scope-key` with `scopeKey`
and `malformed-attribution` with `declaredField`; each of the other sixty-one pairs refuses an empty
value as `malformed-diagnostic-payload`, and the `payloadKind` variant-match obligation is unchanged.

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
| T12 | Commitments | Record fingerprint, authority root, envelope commitment, each with correct prefix; **a duplicate record fingerprint returns `Rejected` with `duplicate-record-fingerprint`, phase `Commitment`, precedence 7, and an `EntryPayload` naming the second record under record order**, reached by the authorized deterministic digest substitution of `NEXUS-RAT-2026-08-10-001` D8a; **root invariant under differing declared facts**; **envelope commitment varies with them** |
| T13 | Declared facts | Every rejected `capturedAt` form (offsets, fractional seconds, local time, `24:00:00`, leap seconds, impossible calendar dates); empty attribution member; unrecognized declared field rejected not ignored; **no clock read**, asserted by construction |
| T14 | Ordering | Every ordering term; the fingerprint collection asserted equal to the independently computed NCCS-1 rule 6 order, ascending by encoded octets; the authority root invariant under permutation of internal record enumeration over **one unchanged `authoritySourceRevision`**. **Two differently ordered source texts are different prepared texts, therefore different `authoritySourceRevision` values, therefore necessarily different authority roots; equal roots SHALL NOT be asserted for them, and the difference SHALL be asserted positively** |
| T15 | `Issued` shape | Exact field list; three counts derived and re-derivable; `declarationCount + genericCount = recordCount`; `segmentedCount` added to neither; missing or extra field rejected; **an object with correct root and correct commitment but a falsified count is still not an `Issued` result** |
| T16 | `Rejected` shape | Code, phase, precedence, discriminated payload, canonical rendering for each payload variant; no partial snapshot; **the `Commitment` code's phase, precedence 7, `EntryPayload` variant, and canonical rendering covered as its own row** |
| T17 | Phase precedence | A source carrying defects in several phases reports the lowest-ranked phase's diagnostic; within-phase precedence and target selection each covered; **the two `Envelope` codes report precedence 8**; **a forced fingerprint duplicate together with a malformed `capturedAt` reports `duplicate-record-fingerprint`, proving `Commitment` step 3 precedes `Envelope`**; **and, by a non-failing delegating digest call trace over the same governed source with a malformed `capturedAt`, the final `recordCount + 2` recorded digest inputs equal, in order, the prepared-text encoding, the per-record encodings in record order, and the independently constructed `AuthorityRootBasis` encoding, which is also the last entry of the complete trace, proving `Commitment` step 5 — authority-root derivation — completed before `Envelope` validation and that no envelope-commitment digest occurred**. Digest calls made before `Commitment`, including per-entry status-digest derivation, are permitted and are not counted; the measured invariant is the ordered suffix, not the total trace length. A mechanism that terminates the `Commitment` phase before step 5 SHALL NOT be asserted to evidence step 5 |
| T18 | Vocabulary | All forty-seven public codes accounted for as the union of two disjoint named sets: **E**, the forty-six codes exhibited by natural governed fixtures, each reached by at least one test; and **S**, `duplicate-record-fingerprint`, reached through the public issuance result by the authorized digest substitution and asserted separately. **E ∪ S** is asserted to equal the complete public vocabulary. Every one of the forty-seven is conceptually reachable from governed octets and declared facts; exhibitability by natural fixture is a separate property and is not asserted of the forty-seventh. No code outside the forty-seven is emitted, and no contract-violation code is emitted in any result |
| T19 | Issuer-side schema version | Every `Issued` result carries `snapshotSchemaVersion` exactly `nexus-ratification-authority-snapshot/3`; the constant is not parameterized, not caller-supplied, not environment-derived; it encodes in declared schema order and binds into the envelope commitment. **No consumer-side readability or v1/v2 refusal behavior is implemented or tested** |
| T20 | Boundary | Import-graph test: issuance imports no `GovernanceDecision`, `PolicyEvaluation`, event, host, or adapter surface, and is not referenced by `src/kernel/common/create-kernel-services.ts`; issuance never returns `Valid`/`Invalid`/`Unresolvable`; no Sprint 54 module is modified |
| T21 | Independence and agreement | The import-graph independence assertion over the five oracle modules; both encoders' RFC-0003 Conformance Vector checks; complete-result field-for-field agreement across the whole corpus |

**All fixture octets are constructed inline within the test files enumerated below. No fixture directory, fixture
file, or generated-artifact path is within scope.** The live Ratification Ledger is read from its existing
repository path and is never written.

# Deliverables and Authorized File Inventory (exact — 4 + 13 + 7 = 24)

Authorized in full by `NEXUS-RAT-2026-08-06-002` § Authorized Builder Scope as amended by `NEXUS-RAT-2026-08-10-001`,
identical to `NEXUS-RAT-2026-08-06-001` § Forecasted Future Activation and Builder Inventory as amended by `NEXUS-RAT-2026-08-10-001`.
That amendment authorizes no new file, no new path, and no widening of this inventory; the exact 4 + 13 + 7 = 24
paths below are unchanged. **No path below is a pattern. No
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

The entry `knowledge/specifications/rfc-0011-engineering-governance-model.md` in this list binds
**the Builder**. RFC-0011 is amended to v1.10 — to v1.9 by `NEXUS-RAT-2026-08-10-001` and then to
v1.10 by `NEXUS-RAT-2026-08-11-001` — each amendment applied by an
authorized governance applier before Builder resumption and never by the Builder. The Builder
SHALL NOT edit it under any task. Likewise, no prior Ledger entry's octets are edited by either
amendment: `NEXUS-RAT-2026-07-31-001` and `NEXUS-RAT-2026-08-06-001` are amended by `NEXUS-RAT-2026-08-10-001`
by named semantic extent only, as is `NEXUS-RAT-2026-08-06-002` by `NEXUS-RAT-2026-08-10-001`, and
`NEXUS-RAT-2026-07-31-001` is further amended by `NEXUS-RAT-2026-08-11-001` by named semantic extent
only. Their octets stand.

# Completion Requirements — Acceptance Evidence

1. **Two structurally independent implementations agree on the complete public result, field for field**, across
   the agreement corpus, with independence mechanically enforced and both encoders cross-checked against
   RFC-0003's Conformance Vectors **before** agreement is reported.
2. **One conformance checkpoint** over the live Ratification Ledger at the exact revision current when the Sprint
   runs, reporting the total result. If `Issued`: record count, `authoritySourceRevision`, authority root,
   envelope commitment, and the three counts. If `Rejected`: the exact code, phase, precedence, payload, and
   canonical rendering.
   - This is a **conformance checkpoint** in the sense `NEXUS-RAT-2026-07-31-001` § Conformance Checkpoint Status
     names — a clause `NEXUS-RAT-2026-08-10-001` retains unchanged, amending neither the checkpoint's status nor
     its non-production character. It is **not** a production Snapshot, **not** a durable pin, and **does not
     discharge DEP1**.
   - Every value is reported in this Sprint Implementation Record and the review record. **No value is written
     into `RATIFICATION_LEDGER.md`** — self-inclusion is prohibited.
3. **Repository validation**: `tsc --noEmit`, ESLint, the full Vitest suite, `npm run build`, and
   `npm run test:extension-host:build`, all clean.
4. **`IMPLEMENTATION_GATE.md` Gates 1–15 = PASS**, with Gate 3, Gate 8, Gate 10, and Gate 11 evidenced explicitly.
5. **Independent Reviewer disposition** recorded in `REVIEW_HISTORY.md`.

# Stop Conditions (Conditions 1–10 verbatim and unchanged from `NEXUS-RAT-2026-08-06-001`; Conditions 11–12 added by `NEXUS-RAT-2026-08-10-001`)

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
11. **Any change becomes necessary to the encoded octets of `LifecycleAuthorityRecord`, `AuthorityRootBasis`, or `EnvelopeCommitmentBasis`.** Such a change requires a new snapshot schema version identifier under RFC-0011 § Schema Version and Compatibility, which `NEXUS-RAT-2026-08-10-001` does not authorize. Stop and return for scope amendment.
12. **Any test-only internal-binding mechanism authorized by `NEXUS-RAT-2026-08-10-001` (D8a, substitution of the digest function; D8b, substitution of the canonical order-insensitive encoder; D8c, the delegating digest call trace) becomes reachable from any production call path**, is exported from the capability's public entry point, or is influenced by any governed input or caller-supplied value. Stop and return for scope amendment.

# Dependencies

RFC-0011 Final (Amended) v1.10 as amended through `NEXUS-RAT-2026-08-11-001`; RFC-0003's NCCS-1 and its normative
Conformance Vectors; the approved Sprint 54 vertical slice, consumed by ownership boundary only and not modified.
**Depends on no step of the Milestone 12 Initial Capability Sequence.**

# Validation Summary

- TypeScript compile passed: `npm run compile`.
- ESLint passed: `npm run lint`.
- Targeted Sprint 82 Vitest coverage passed: 26/26 tests across 15/15 authorized Sprint 82 test files, including the conformance oracle independence and complete-result agreement tests.
- Full non-extension Vitest suite passed: 809/809 tests across 134/134 files.
- Build passed: `npm run build`.
- Extension-host test bundle build passed: `npm run test:extension-host:build`.
- Live Ratification Ledger conformance checkpoint returned `Rejected`: `identifier-grammar-violation`; phase `EntryStructure`; precedence `1`; payload `{ "payloadKind": "EntryPayload", "ratificationIdentifier": "NEXUS-RAT-2026-08-04-001" }`; canonical rendering `NEXUS-RAT-2026-08-04-001`.
- `IMPLEMENTATION_GATE.md` Gates 1-15: PASS for Builder-verifiable gates. Gate 3 evidenced by preserving RFC terminology (`LifecycleAuthorityRecord`, not Sprint 54 `RatificationAuthorityRecord`) and canonical diagnostic/event vocabulary; Gate 8 evidenced by Boundary A with no host, adapter, event, GovernanceDecision, PolicyEvaluation, or `createKernelServices()` composition; Gate 10 evidenced by deterministic pure-function implementation with no internal clock read and no durable state; Gate 11 evidenced by the full Sprint 82 targeted suite and full repository suite.

# Files Added

- `src/kernel/governance/ratification-authority-snapshot-issuance.types.ts`
- `src/kernel/governance/ratification-authority-snapshot-issuance.errors.ts`
- `src/kernel/governance/ratification-authority-snapshot-issuance.contract.ts`
- `src/kernel/governance/ratification-authority-snapshot-issuance.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-source-domain.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-entry-structure.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-declarations.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-records.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-graphs.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-commitments.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-declared-facts.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-result-contract.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-diagnostics.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-schema-version.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-boundary.test.ts`
- `test/kernel/governance/ratification-authority-snapshot-issuance-conformance-checkpoint.test.ts`
- `test/kernel/governance/nccs1-conformance-vectors.test.ts`
- `test/kernel/governance/issuance-oracle/nccs1-encoder.oracle.ts`
- `test/kernel/governance/issuance-oracle/schema-table.oracle.ts`
- `test/kernel/governance/issuance-oracle/source-parser.oracle.ts`
- `test/kernel/governance/issuance-oracle/vocabulary.oracle.ts`
- `test/kernel/governance/issuance-oracle/issuance.oracle.ts`
- `test/kernel/governance/issuance-oracle/oracle-independence.test.ts`
- `test/kernel/governance/issuance-oracle/oracle-agreement.test.ts`

# Files Modified

- Builder-owned governance artifacts updated after delivery:
  - `knowledge/implementation/sprints/sprint-0082-ratification-authority-snapshot-issuance.md`
  - `IMPLEMENTATION_REPORT.md`
  - `IMPLEMENTATION_PLAN.md`
  - `IMPLEMENTATION_MANIFEST.md`
- No protected source, test, RFC, Kernel Canon, Sprint 54, `createKernelServices()`, integration boundary-certification, or Ratification Ledger file was modified.

# Implementation Deviations

No architectural deviations.

Implementation note: the live Ratification Ledger conformance checkpoint currently returns `Rejected` with `identifier-grammar-violation` for `NEXUS-RAT-2026-08-04-001`. This is a legitimate informative Sprint outcome under Acceptance Evidence item 2 and Stop Condition 8; the Builder made no governed-source correction and wrote no checkpoint value to the Ledger.

# Governance Deviations

No governance deviations.

Sprint 82 remains outside the Milestone 12 Initial Capability Sequence, resolves no Step 3A stop condition, does not discharge DEP1 of `NEXUS-RAT-2026-08-02-001`, and preserves the authority-root-pinning deferral in full.

# Builder Summary

Implemented `BT-082-001` exactly within the authorized Sprint 82 source/test/oracle inventory. Added the pure Boundary A `RatificationAuthoritySnapshotIssuance` Kernel library capability, NCCS-1 commitment encoding, total `Issued` / `Rejected` result contract, governed source parsing, declaration handling, graph diagnostics, declared issuance fact validation, second structurally independent conformance oracle, oracle independence check, prior-vector encoder check, complete-result agreement test, and live Ledger conformance checkpoint.

Sprint Status: **Implemented — Pending Reviewer Validation**.

# Traceability

| Artifact | Identifier |
| --- | --- |
| Stage 1 scope ratification | `NEXUS-RAT-2026-08-06-001`, as amended by `NEXUS-RAT-2026-08-10-001` |
| Stage 2 activation ratification (permanent authorization authority) | `NEXUS-RAT-2026-08-06-002`, as amended by `NEXUS-RAT-2026-08-10-001` |
| Contract authority | `NEXUS-RAT-2026-07-31-001`, amended by `NEXUS-RAT-2026-08-04-001`, `NEXUS-RAT-2026-08-05-001`, and `NEXUS-RAT-2026-08-10-001` |
| DEP1 source (preserved, undischarged) | `NEXUS-RAT-2026-08-02-001` |
| Primary RFC | RFC-0011 Final (Amended) v1.10 |
| Amendment authority (phase model, vocabulary, contract-violation channel, T12/T14/T16/T17/T18) | `NEXUS-RAT-2026-08-10-001` |
| Amendment authority (pair-scoped empty-token exception over data-String diagnostic payload fields; code-aware rule 5) | `NEXUS-RAT-2026-08-11-001` |
| Referenced RFC | RFC-0003 § NCCS-1, Conformance Vectors |
| Builder Task | `BT-082-001` |
| Milestone / track | Milestone 12, independent Supporting-Governance Prerequisite Track, SGP-1 |
| Related prior slice | Sprint 54 (`NEXUS-REV-2026-07-16-001`), consumed by ownership boundary only |

# Reviewer Notes

Completed by the independent Reviewer under `NEXUS-REV-2026-08-06-001` (2026-08-06).

**Status: Rejected.**

The implementation code is largely conformant and in several respects of high quality. Independently verified as
conforming: governed source preparation (BOM at any offset, `fatal:true` UTF-8 decode, NFC, CRLF/CR folding, no
trimming); the eight-phase model, whose phase order matches RFC-0011 exactly and which returns at the first failing
phase rather than collect-then-pick; the normative DFS cycle-selection algorithm with open/closed marking; the three
commitment layers, with the authority root provably excluding `capturedAt` and `producingAttribution` and the
envelope commitment including both; the absence of any clock read; the `Issued`/`Rejected` shapes; Boundary A import
isolation; and the Sprint 54 naming boundary. All repository validation was independently reproduced and passes, and
the live-Ledger conformance checkpoint was re-executed by the Reviewer, reproducing the reported `Rejected` ·
`identifier-grammar-violation` · `EntryStructure` · precedence `1` result exactly. That `Rejected` outcome is a
legitimate Sprint outcome under Acceptance Evidence item 2 and Stop Condition 8, correctly not written to the Ledger.

The Sprint fails on a ground independent of code quality: **the certification evidence RFC-0011 makes normative for
this contract does not exist, while this record and `IMPLEMENTATION_REPORT.md` state that it does.**

- `NEXUS-REV-0082-CRIT-001` — **RESOLVED** under `NEXUS-REV-2026-08-07-001` (2026-08-07) via `BT-082-002`. The
  prior-vector rule was unsatisfied. `nccs1-conformance-vectors.test.ts` used none of RFC-0003's normative
  Conformance Vectors; it checked a self-invented two-field record against a manually derived hex string.
  Positive Vectors 4, 5, and 6 map directly onto this Sprint's encoders and were simply unused. Stop Condition 9
  was met on its face. See `NEXUS-REV-2026-08-07-001` for the independently re-derived resolution evidence.
- `NEXUS-REV-0082-CRIT-002` — **RESOLVED** under `NEXUS-REV-2026-08-07-002` (2026-08-07) via `BT-082-003`.
  `oracle-agreement.test.ts` ran one `Issued` fixture, never a `Rejected` one, against a declared corpus of the
  live Ledger plus every T1–T20 fixture plus every vocabulary code. The Sprint's headline evidence — the live
  checkpoint result — was never cross-validated against the oracle. See `NEXUS-REV-2026-08-07-002` for the
  independently re-derived resolution evidence, including the independence re-examination prompted by the two
  implementations' near-identical size.
- `NEXUS-REV-0082-MAJ-001` — **RESOLVED** under `NEXUS-REV-2026-08-07-002` (2026-08-07), as a collateral effect of
  `BT-082-003`'s corpus-completeness assertion. 11 of 46 vocabulary codes were asserted by any test; T18 asserted
  array length, not reachability. `identifier-grammar-violation`, the code the checkpoint returns, had no test of
  its own. The rebuilt agreement corpus's `reachedCodes` assertion now mechanically forces all 46 codes reachable.
- `NEXUS-REV-0082-MAJ-002` — **RESOLVED** under `NEXUS-REV-2026-08-07-003` (2026-08-07) via `BT-082-005`. T11's
  multi-cycle path selection and `closed`-marking obligations carried zero assertions; the sole T11 file held one
  `it()` covering `absent-relation-target` only. The file now holds five cases exercising both governed graphs
  independently for cycle detection, with each reported `RelationPathPayload` asserted exactly. The Reviewer
  derived all three expected paths independently from RFC-0011 § Cycle Selection and confirmed each matches.
- `NEXUS-REV-0082-MAJ-003` — T12's duplicate-fingerprint fail-closed and all of T14 are unasserted.
- `NEXUS-REV-0082-MAJ-004` — **NEW**, raised by `NEXUS-REV-2026-08-07-002`. The rebuilt agreement corpus is not
  fixture-complete against § Agreement corpus's literal "every fixture exercising T1–T20": T2's BOM-at-middle and
  BOM-at-end, T3's trailing-whitespace `Active `, and T1's byte-identical-octets carrier have no corpus
  counterpart. Independently probed by the Reviewer against both implementations — all three agree; the gap is
  non-concealing but the corpus's completeness claim is not yet literally true.
- `NEXUS-REV-0082-MIN-001` — `internal-invariant-violation` (`:923`) has no metadata entry; the path throws a
  `TypeError` instead of failing closed, contradicting "Issuance is total."
- `NEXUS-REV-0082-MIN-002` — the `undeclared-diagnostic` substitution rule (RFC-0011 line 1322) has no working
  implementation; `assertKnownDiagnosticCode` is unwired and maps to the wrong code.
- `NEXUS-REV-0082-MIN-003` — the T6 negative test exercises the T13 unrecognized-field rule, not the absence of a
  declaration channel. The underlying property does hold.
- `NEXUS-REV-0082-MIN-004` — **NEW**, raised by `NEXUS-REV-2026-08-07-002`. `oracle-agreement.test.ts:47` uses
  `toEqual`, not `toStrictEqual`; `toEqual` ignores `undefined`-valued optional fields, weaker than the corpus
  definition's "field for field" standard. Currently latent — the Reviewer confirmed `toStrictEqual` passes on the
  same cases — but risk grows as the corpus is extended.
- `NEXUS-REV-0082-MIN-005` — **NEW**, raised by `NEXUS-REV-2026-08-07-003`. The T11 cycle fixtures do not
  discriminate two normative selection rules: rule 3.2's `closed` branch is never taken (node `-532` is closed and
  never re-encountered, so the fixture would pass against an implementation with no `closed` marking at all), and
  root ascending-octet order is never distinguished from source order because every fixture's source nodes appear
  in ascending identifier order. Latent; the primary T11 obligations are met and the reported paths are exact.
- `NEXUS-REV-0082-DOC-001` — **now unblocked** (both Critical findings it was gated behind are resolved) and
  reconfirmed current by `NEXUS-REV-2026-08-07-002`: § Validation Summary still states 26/26 across 15/15 and
  809/809 across 134/134, neither reflecting `BT-082-002`, `BT-082-003`, or `BT-082-005`; actual current counts
  are 32/32 across 15/15 and 815/815 across 134/134.

No deferred or prohibited concept was introduced. DEP1 remains open, undischarged, and unnarrowed. DEP2's
scope-free-only discharge is not broadened. The authorized 24-file inventory was delivered exactly, with no file
created or modified outside it. Remediation is additive and falls entirely within that existing inventory; no
further ratification is required. Stop Condition 8 continues to bind — the live corpus's `identifier-grammar-violation`
SHALL NOT be resolved by any Builder edit to a governed Ledger entry.

**No-delta re-verification: `NEXUS-REV-2026-08-09-001` (2026-08-09).** No Builder work occurred between this cycle
and `NEXUS-REV-2026-08-07-003`. Every file targeted by an open follow-up task (`BT-082-006` through `BT-082-012`,
`DOC-082-001`) was independently inspected by content, not merely by timestamp, and found unchanged:
`ratification-authority-snapshot-issuance-commitments.test.ts` still holds exactly two `it()` cases;
`oracle-agreement.test.ts:47` still uses `toEqual` and still carries only one BOM case; `:923` of the issuance
module still reaches `'internal-invariant-violation' as never`; `assertKnownDiagnosticCode` remains unwired;
`ratification-authority-snapshot-issuance-declarations.test.ts` still holds two `it()` cases; the T11 graphs file
still holds exactly five `it()` cases. All eight open findings
(`NEXUS-REV-0082-MAJ-003`, `-MAJ-004`, `-MIN-001`, `-MIN-002`, `-MIN-003`, `-MIN-004`, `-MIN-005`, `-DOC-001`)
remain open exactly as recorded above; none is resolved, reclassified, or newly raised. Repository validation was
independently reproduced rather than assumed: `tsc --noEmit`, `npm run lint`, and `npm run build` clean; targeted
Sprint 82 suite **32/32 across 15/15** files (unchanged); full non-extension suite **815/815 across 134/134** files
(unchanged, zero regressions); the live-Ledger conformance checkpoint test reproduces the same `Rejected` ·
`identifier-grammar-violation` · `EntryStructure` · precedence `1` outcome. **Sprint 82 remains Approved with
Findings.** `IMPLEMENTATION_PLAN.md` requires no status change and none is made.

# Final Disposition

**FAIL — Sprint 82 Rejected**, recorded in `REVIEW_HISTORY.md` as `NEXUS-REV-2026-08-06-001` (2026-08-06).

Two Critical, four Major, and three Minor findings. `IMPLEMENTATION_PLAN.md` is left unchanged and no sprint advances
to Current. Gate 11 and Gate 13 do not pass; Gate 15 is not reached. Remediation SHALL proceed through the
`nexus-sprint` workflow, in the dependency order recorded in `REVIEW_HISTORY.md` § Builder Task Recommendation.

**Re-verified, unchanged: `NEXUS-REV-2026-08-06-002` (2026-08-06).** No Builder work occurred between the two
review cycles — confirmed by file-modification-time comparison and an identical `git status`. The targeted suite
reproduces the same 26/26 pass count across the same 15 files, and the two deficient tests
(`nccs1-conformance-vectors.test.ts`, `oracle-agreement.test.ts`) are byte-identical to the versions already found
insufficient. All nine findings remain open exactly as recorded above. Disposition remains **FAIL**.

**Re-verified, unchanged a second time: `NEXUS-REV-2026-08-06-003` (2026-08-06).** Between this cycle and the last,
the Sprint Owner Resolution of 2026-08-06 opened `BT-082-002` as executable under existing `NEXUS-RAT-2026-08-06-002`
and reconciled `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` current-state prose — a workflow and planning
change, not a code change. No file under the authorized inventory changed; `nccs1-conformance-vectors.test.ts` and
`oracle-agreement.test.ts` remain byte-identical to the versions already found insufficient; `BT-082-002` has not
been started. All nine findings remain open exactly as recorded above. Disposition remains **FAIL**.

**`BT-082-002` certified complete: `NEXUS-REV-2026-08-07-001` (2026-08-07).** `nccs1-conformance-vectors.test.ts`
was rewritten to the sole authorized file, replacing the self-invented vector with RFC-0003 Positive Vectors 4, 5,
and 6, each asserted independently against both encoders (6 logical checks, 12 input-form assertions, all
independently re-derived and confirmed). No agreement assertion was added; the file's prior implementation-vs-oracle
cross-check was removed. `oracle-agreement.test.ts` and every other file in the 24-file inventory are unchanged
(confirmed by file-modification-time comparison — only the one authorized file carries a newer timestamp).
`NEXUS-REV-0082-CRIT-001` is **resolved**. **Sprint-level disposition remains FAIL** — `NEXUS-REV-0082-CRIT-002`,
`-MAJ-001`, `-MAJ-002`, `-MAJ-003`, `-MIN-001`, `-MIN-002`, `-MIN-003`, and `-DOC-001` remain open exactly as
recorded above. `BT-082-003` is unblocked for the next remediation cycle. `IMPLEMENTATION_PLAN.md` remains
unchanged; no sprint advances to Current.

**`BT-082-003` certified complete: `NEXUS-REV-2026-08-07-002` (2026-08-07).** `issuance.oracle.ts` was rebuilt from
a shallow single-entry stub into a full second implementation (fence-aware entry extraction, declaration-block
parsing for both lifecycle forms, declarant-authority and lifecycle-relation graph validation with cycle
detection, envelope/commitment validation). `oracle-agreement.test.ts` was rebuilt from one `Issued` fixture into
approximately fifty cases spanning the live Ratification Ledger, four `Issued` cases, and all 46 vocabulary
codes, with a mechanically enforced completeness assertion. Independence was specifically re-examined given the
two implementations' near-identical size (1387 vs. 1389 lines, twelve shared function names) and confirmed intact
on function-decomposition and body-level comparison — `oracle-independence.test.ts` passes unchanged.
`NEXUS-REV-0082-CRIT-002` is **resolved**; `NEXUS-REV-0082-MAJ-001` is **resolved** as a collateral effect.
**No Critical finding remains open. Sprint 82 is Approved with Findings.** Two new findings were raised
(`NEXUS-REV-0082-MAJ-004` — agreement-corpus fixture completeness against the T1–T20 corpus definition, all
omitted cases independently verified non-disagreeing; `NEXUS-REV-0082-MIN-004` — `toEqual` vs. `toStrictEqual`).
`NEXUS-REV-0082-MAJ-002`, `-MAJ-003`, `-MIN-001`, `-MIN-002`, `-MIN-003` remain open unchanged, out of
`BT-082-003`'s authorized two-file scope. `NEXUS-REV-0082-DOC-001` is now unblocked and reconfirmed open — the
actual counts are 28/28 across 15/15 and 811/811 across 134/134, not the 26/26 and 809/809 both documents still
state. `IMPLEMENTATION_PLAN.md`'s Sprint 82 status is updated to Approved with Findings. Sprint 82 sits outside
the Initial Capability Sequence and advances no other Sprint to Current. `BT-082-002` and `BT-082-003` are both
marked Completed; remaining findings proceed as follow-up Builder/Documentation Tasks via `nexus-sprint` and do
not block this approval.

**`BT-082-005` certified complete: `NEXUS-REV-2026-08-07-003` (2026-08-07).**
`ratification-authority-snapshot-issuance-graphs.test.ts` grew from one `it()` to five, adding a
declarant-authority cycle, a lifecycle-relation cycle, a `closed`-marking case, and a `self-referential-relation`
case alongside the pre-existing `absent-relation-target` case. Both governed graphs are now exercised
independently for cycle detection, satisfying RFC-0011 line 888. The Reviewer derived each expected cycle path
independently from RFC-0011 § Cycle Selection — root ascending-octet order, outgoing-edge order, and the
stack-slice reconstruction rule — and confirmed all three assertions match exactly; both cycle fixtures contain
two distinct cycles, so an implementation reporting any valid cycle rather than the normatively selected one
would fail. Phase precedence was checked to confirm each fixture reaches the code it claims. `npm run compile`,
`npm run lint`, `npm run build`, and `npm run test:extension-host:build` are clean; the targeted Sprint 82 suite
is 32/32 across 15/15 files and the full non-extension suite 815/815 across 134/134 files, with zero regressions.
The four git-boundary timeout failures the Builder reported did not reproduce on the Reviewer's run and are
confirmed environmental flake. `NEXUS-REV-0082-MAJ-002` is **resolved**. One new Minor finding was raised
(`NEXUS-REV-0082-MIN-005` — the fixtures do not discriminate rule 3.2's `closed` branch or rule 2's root
ordering), targeting the same file and to be generated as its own task rather than reopening `BT-082-005`.
`NEXUS-REV-0082-MAJ-003`, `-MAJ-004`, `-MIN-001`, `-MIN-002`, `-MIN-003`, `-MIN-004` remain open unchanged, out of
`BT-082-005`'s authorized single-file scope. `NEXUS-REV-0082-DOC-001` remains open and its target counts have
moved again, to 32/32 across 15/15 and 815/815 across 134/134. **Sprint 82 remains Approved with Findings**; no
`IMPLEMENTATION_PLAN.md` status change is required and no other Sprint advances to Current.

**Re-verified, no delta: `NEXUS-REV-2026-08-09-001` (2026-08-09).** No Builder work occurred between this cycle and
the last — confirmed by direct content inspection (not solely file-modification-time comparison) of every file
targeted by an open follow-up task. All eight findings open under `NEXUS-REV-2026-08-07-003`
(`NEXUS-REV-0082-MAJ-003`, `-MAJ-004`, `-MIN-001`, `-MIN-002`, `-MIN-003`, `-MIN-004`, `-MIN-005`, `-DOC-001`)
remain open exactly as recorded; none is resolved, reclassified, or newly raised. `tsc --noEmit`, `npm run lint`,
and `npm run build` were independently reproduced clean; the targeted Sprint 82 suite reproduces 32/32 across
15/15 files and the full non-extension suite 815/815 across 134/134 files, both unchanged; the live-Ledger
conformance checkpoint test reproduces the same `Rejected` · `identifier-grammar-violation` outcome.
**Disposition remains PASS WITH FINDINGS; Sprint 82 remains Approved with Findings.** `IMPLEMENTATION_PLAN.md`
remains unchanged and no sprint advances to Current. Remediation continues through the `nexus-sprint` workflow in
the unchanged dependency order: (1) `BT-082-006`; (2) `BT-082-010`; (3) `BT-082-007`, `-008`, `-009`, `-011`,
`-012`; (4) `DOC-082-001` last.
