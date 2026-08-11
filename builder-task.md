# Builder Task

## Source

Governing Authority:

`NEXUS-RAT-2026-08-06-002` — Sprint 82 Stage 2 Activation Ratification (Milestone 12, independent
Supporting-Governance Prerequisite Track, item SGP-1), recorded in `knowledge/governance/RATIFICATION_LEDGER.md`.
Depends on `NEXUS-RAT-2026-08-06-001` (Stage 1 scope ratification, Active), which defines the complete
implementation scope that activation authorizes.

Sprint:

Sprint 82 — Ratification Authority Snapshot Issuance Capability (activated by `NEXUS-RAT-2026-08-06-002`; scope
defined by `NEXUS-RAT-2026-08-06-001`). **Status: Approved with Findings** under `NEXUS-REV-2026-08-07-002`
(2026-08-07), reaffirmed under `NEXUS-REV-2026-08-07-003` (2026-08-07) and again under `NEXUS-REV-2026-08-09-001`
(2026-08-09), following rejection under `NEXUS-REV-2026-08-06-001` and three ordered recovery cycles.

Engineering Review Report:

`NEXUS-REV-2026-08-06-001` (2026-08-06), recorded in `REVIEW_HISTORY.md`. Disposition **FAIL**. Two Critical, four
Major, and three Minor findings. This is the original source report from which the task set was first translated.

Re-verified by `NEXUS-REV-2026-08-06-002` and `NEXUS-REV-2026-08-06-003` (both 2026-08-06), no-delta cycles.
Disposition **FAIL (unchanged)**; **zero new findings**. **No task was added, removed, renumbered, reclassified,
or restatused by either cycle.**

Certification Report (first recovery cycle):

`NEXUS-REV-2026-08-07-001` (2026-08-07), recorded in `REVIEW_HISTORY.md`. Disposition **FAIL (unchanged)**; **zero
new findings**. The Reviewer independently verified `BT-082-002` against its acceptance criteria and certified it
**Completed**, resolving `NEXUS-REV-0082-CRIT-001`. `BT-082-003` was thereby unblocked.

Certification Report (second recovery cycle):

`NEXUS-REV-2026-08-07-002` (2026-08-07), recorded in `REVIEW_HISTORY.md`. Disposition **PASS WITH FINDINGS**.
The Reviewer independently verified `BT-082-003` against its acceptance criteria and certified it **Completed**,
resolving `NEXUS-REV-0082-CRIT-002`; `NEXUS-REV-0082-MAJ-001` is resolved as a collateral effect of that task's
corpus-completeness assertion. **No Critical finding remains open, and Sprint 82 is Approved with Findings.**
Two new findings were raised — `NEXUS-REV-0082-MAJ-004` (Implementation Defect, Major) and
`NEXUS-REV-0082-MIN-004` (Implementation Defect, Minor) — and `NEXUS-REV-0082-DOC-001` is now **unblocked**.
**This cycle restatuses `BT-082-003` to Completed, retires `BT-082-004` as resolved, generates `BT-082-010` and
`BT-082-011` from the two new findings, unblocks `DOC-082-001`, and reclassifies no existing finding.**

Certification Report (third recovery cycle — current governing report for the task set):

`NEXUS-REV-2026-08-07-003` (2026-08-07), recorded in `REVIEW_HISTORY.md`. Disposition **PASS WITH FINDINGS**.
The Reviewer independently verified `BT-082-005` against its acceptance criteria and certified it **Completed**,
resolving `NEXUS-REV-0082-MAJ-002`. Both governed graphs are now exercised independently for cycle detection, and
the Reviewer derived each expected cycle path independently from RFC-0011 § Cycle Selection and confirmed all three
assertions match exactly. **Sprint 82 remains Approved with Findings; no status change was required.** One new
finding was raised — `NEXUS-REV-0082-MIN-005` (Implementation Defect, Minor). **This cycle restatuses `BT-082-005`
to Completed, generates `BT-082-012` from the new finding, restates `DOC-082-001`'s stale target counts, and
reclassifies no existing finding.**

Re-Verification Report (no-delta cycle — most recent review):

`NEXUS-REV-2026-08-09-001` (2026-08-09), recorded in `REVIEW_HISTORY.md`. Disposition **PASS WITH FINDINGS
(unchanged)**; **zero new findings, zero resolved, zero reclassified**. No Builder work occurred between this cycle
and `NEXUS-REV-2026-08-07-003`. The Reviewer content-inspected every file targeted by an open task — not solely by
file-modification-time comparison — and confirmed each unchanged, and independently reproduced the full validation
set rather than carrying the prior report's figures forward. **No task is added, removed, renumbered,
reclassified, or restatused by this cycle.** The task set, its statuses, and the mandatory order below are exactly
those translated from `NEXUS-REV-2026-08-07-003`.

Sprint Owner Resolution:

**APPROVE WITH NAMED CORRECTION (2026-08-06)** — later than, and distinct from, both Reviewer reports. Directs that
remediation proceed under the existing, still-active `NEXUS-RAT-2026-08-06-002` with no new Ratification and no new
Ledger entry; opens `BT-082-002` only; preserves Stop Condition 9 prospectively; retains the mandatory order; and
corrects `DOC-082-001` to depend on `BT-082-002` through `BT-082-009`. **`BT-082-002`'s status transition is
attributable to this resolution alone, never to `NEXUS-REV-2026-08-06-002`.** No Reviewer finding was
reclassified or reinterpreted, and `REVIEW_HISTORY.md` is unaltered.

Authority chain (binding):

1. `IMPLEMENTATION_CONSTITUTION.md` governs.
2. `NEXUS-RAT-2026-08-06-002`, in the Ratification Ledger, is the permanent authorization authority for Sprint 82.
   The Ledger is the single source of truth for what is authorized.
3. `knowledge/implementation/sprints/sprint-0082-ratification-authority-snapshot-issuance.md` is the
   self-contained operative Sprint Specification, subordinate to the Constitution and to that Ledger entry, and is
   the document the Builder works from.
4. **This document is a transient implementation artifact and carries no independent authority.** It references
   the above and defines no scope of its own. Where this document and either authority above appear to differ,
   they govern and this document is corrected.

Generated By:

`nexus-sprint`

Generation Date:

2026-08-06 (initial translation of `NEXUS-REV-2026-08-06-001`; provenance re-confirmed 2026-08-06 against
`NEXUS-REV-2026-08-06-002`/`-003`, no task change). Regenerated 2026-08-07 to translate `NEXUS-REV-2026-08-07-001`
(`BT-082-002` Completed; `BT-082-003` unblocked). Regenerated again 2026-08-07 to translate
`NEXUS-REV-2026-08-07-002` (`BT-082-003` Completed; `BT-082-004` retired as resolved; `BT-082-010` and
`BT-082-011` generated; `DOC-082-001` unblocked; Sprint Approved with Findings). Regenerated a third time
2026-08-07 to translate `NEXUS-REV-2026-08-07-003` (`BT-082-005` Completed; `BT-082-012` generated from
`NEXUS-REV-0082-MIN-005`; `DOC-082-001` target counts restated; Sprint remains Approved with Findings).
Provenance re-confirmed 2026-08-09 against `NEXUS-REV-2026-08-09-001` — **no task change**.

---

# Executive Summary

Sprint 82 was delivered in full, **rejected** under `NEXUS-REV-2026-08-06-001`, and has been **Approved with
Findings** since `NEXUS-REV-2026-08-07-002` (2026-08-07), reaffirmed under `NEXUS-REV-2026-08-07-003` (2026-08-07)
after three ordered recovery cycles. `BT-082-001` remains FAILED and superseded. The twenty-four-file authorized
inventory was delivered exactly, with no file created or modified outside it across the original delivery or any
recovery task.

The original rejection rested on **certification evidence, not architecture**. RFC-0011 § Two Structurally
Independent Implementations conditions conformance for this contract on two independent implementations agreeing on
the complete public result, each cross-checked against RFC-0003's normative Conformance Vectors *first*. At first
review neither half was satisfied. **Both halves are now satisfied**: `BT-082-002` supplied the RFC-0003 vector
evidence (`NEXUS-REV-0082-CRIT-001` resolved), and `BT-082-003` extended oracle agreement to the declared corpus
(`NEXUS-REV-0082-CRIT-002` resolved). **No Critical finding remains open.**

Twelve tasks now exist across the Sprint's full remediation history. Current standing:

- **3 Completed Builder Tasks** — `BT-082-002` (certified by `NEXUS-REV-2026-08-07-001`), `BT-082-003` (certified
  by `NEXUS-REV-2026-08-07-002`), and `BT-082-005` (certified by `NEXUS-REV-2026-08-07-003`). All are carried
  forward under § Resolved Builder Tasks and **SHALL NOT be reopened or reimplemented**.
- **1 Retired Builder Task** — `BT-082-004`, generated from `NEXUS-REV-0082-MAJ-001`. That finding is **resolved**
  as a collateral effect of `BT-082-003`'s corpus-completeness assertion, which mechanically forces all 46 closed
  vocabulary codes reachable. Per the Reviewer's recorded disposition this task is **retired, not regenerated**.
- **7 Open Builder Tasks** — `BT-082-006`, `BT-082-010` (Major); `BT-082-007`, `BT-082-008`, `BT-082-009`,
  `BT-082-011`, `BT-082-012` (Minor). All are **executable follow-up work**; none blocks the Sprint's approval.
- **1 Open Documentation Task** — `DOC-082-001`, **unblocked** by `NEXUS-REV-2026-08-07-002` now that both Critical
  findings it was gated behind are resolved.

**All remediation falls within the existing twenty-four-file authorized inventory. No new path is required and no
further scope ratification is required.** The Reviewer's recorded dependency order from
`NEXUS-REV-2026-08-07-003` § Builder Task Recommendation — restated unchanged by `NEXUS-REV-2026-08-09-001` — is
**superseded** by `NEXUS-RAT-2026-08-10-001` and SHALL NOT be followed. The mandatory order is enumerated
**once only**, in § Builder Instructions, which governs exclusively; no other text in this document enumerates
task order. `BT-082-007` is first, and nothing precedes it or is bundled with it.

**Re-verification status (`NEXUS-REV-2026-08-09-001`, 2026-08-09 — most recent cycle).** No Builder work occurred
since `NEXUS-REV-2026-08-07-003`. The independent Reviewer content-inspected every file targeted by an open task and
confirmed each unchanged: `ratification-authority-snapshot-issuance-commitments.test.ts` still holds exactly two
`it()` cases (`BT-082-006` not started); `oracle-agreement.test.ts:47` still uses `toEqual` and the corpus still
carries only the BOM-at-start case (`BT-082-011`, `BT-082-010` not started); `ratification-authority-snapshot-issuance.ts:923`
still reaches `'internal-invariant-violation' as never` (`BT-082-007` not started); `assertKnownDiagnosticCode`
remains unwired and still maps to `invalid-input` (`BT-082-008` not started);
`ratification-authority-snapshot-issuance-declarations.test.ts` still holds two `it()` cases (`BT-082-009` not
started); the T11 graphs file still holds exactly the five certified cases (`BT-082-012` not started); and both
documents still state the stale `26/26` and `809/809` counts (`DOC-082-001` not started). Validation was
independently reproduced: `tsc --noEmit`, lint, and build clean; targeted Sprint 82 suite **32/32 across 15/15**;
full non-extension suite **815/815 across 134/134**, zero regressions; the live-Ledger conformance checkpoint
reproduces the same `Rejected` · `identifier-grammar-violation` outcome. All eight findings remain open exactly as
recorded. **Zero new findings; no task changed. Sprint 82 remains Approved with Findings.**

**Certification status (`NEXUS-REV-2026-08-07-003`, 2026-08-07 — third recovery cycle).** The Builder executed
`BT-082-005` within its single authorized file, growing the T11 graph-diagnostic test from one `it()` to five:
a declarant-authority cycle, a lifecycle-relation cycle, a `closed`-marking case, and a `self-referential-relation`
case alongside the pre-existing `absent-relation-target` case. The independent Reviewer derived each expected cycle
path directly from RFC-0011 § Cycle Selection — root ascending-octet order, outgoing-edge order, and the
stack-slice reconstruction rule — and confirmed all three assertions match exactly; both cycle fixtures contain two
distinct cycles, so an implementation reporting any valid cycle rather than the normatively selected one would
fail. Phase precedence was checked to confirm each fixture reaches the code it claims. Validation reproduced clean:
targeted Sprint 82 suite **32/32 across 15/15** files (up from 28/28), full non-extension suite **815/815 across
134/134** files (up from 811/811, zero regressions), compile, lint, build, and extension-host build all clean. The
four git-boundary timeout failures reported by the Builder did not reproduce on the Reviewer's run and are
confirmed environmental flake, unrelated to this change. `NEXUS-REV-0082-MAJ-002` is **resolved**. One new Minor
finding was raised and is translated below as `BT-082-012` (`NEXUS-REV-0082-MIN-005` — the fixtures do not
discriminate the DFS's `closed` branch or its root ordering). Per the Reviewer's recorded disposition it is
**generated as its own task rather than reopening `BT-082-005`**.

**Certification status (`NEXUS-REV-2026-08-07-002`, 2026-08-07).** The Builder executed `BT-082-003` within its two
authorized files, rebuilding `issuance.oracle.ts` from a shallow single-entry stub into a full second implementation
and `oracle-agreement.test.ts` from one `Issued` fixture into approximately fifty cases spanning the live
Ratification Ledger, four `Issued` cases, and all 46 vocabulary codes. The independent Reviewer specifically
re-examined the authoring rule given the two implementations' near-identical size (1387 vs. 1389 lines, twelve
shared function names) and confirmed independence intact on function-decomposition and body-level comparison, with
`oracle-independence.test.ts` passing unchanged. Validation reproduced clean: targeted Sprint 82 suite 28/28 across
15/15 files (up from 26/26), full non-extension suite 811/811 across 134/134 files (unchanged, zero regressions),
compile, lint, build, and extension-host build all clean. The live-Ledger conformance checkpoint is now
independently cross-validated against the oracle for the first time and reproduces exactly.

Two new findings were raised by that cycle and are translated below as `BT-082-010` (`NEXUS-REV-0082-MAJ-004` — the
agreement corpus is not fixture-complete against § Agreement corpus's literal "every fixture exercising T1–T20"; the
Reviewer independently probed all three omitted cases against both implementations and found **no disagreement**, so
the gap is non-concealing) and `BT-082-011` (`NEXUS-REV-0082-MIN-004` — `toEqual` rather than `toStrictEqual`,
currently latent, verified by the Reviewer to pass under the stricter matcher).

**Sprint Owner Resolution (2026-08-06).** The repository owner accepted the Final Owner Review with disposition
**APPROVE WITH NAMED CORRECTION** and directed that Sprint 82 remediation proceed under the **existing,
still-active** `NEXUS-RAT-2026-08-06-002`, with **no new Sprint Owner Ratification and no new Ledger entry**. That
direction governed both completed recovery cycles and continues to govern the follow-up tasks below.

No new ratification is required because the corrective work changes no architecture, ownership rule, lifecycle,
invariant, deferral, or RFC meaning; remains wholly within the exact twenty-four-file inventory already authorized;
creates no new path and crosses no scope boundary; and implements the existing RFC-0011/RFC-0003 conformance
obligations rather than redefining them.

**Stop Conditions 1–10 are NOT waived, weakened, amended, or deleted** and continue to apply verbatim. Stop
Condition 9 remains binding prospectively: the RFC-0003 vector checks and the corpus agreement evidence SHALL
remain passing, and no subsequent task may weaken either.

No prior Sprint is reopened. Sprint 81 remains Approved and fully closed under `NEXUS-REV-2026-07-22-005`;
Sprint 80 under `NEXUS-REV-2026-07-22-002`; Sprint 79 under `NEXUS-REV-2026-07-21-002`. Their Resolved Builder
Tasks are carried forward below for traceability only.

Sprint 82 sits on the independent Supporting-Governance Prerequisite Track SGP-1, **outside** the Milestone 12
Initial Capability Sequence. It resolves no Step 3A stop condition, activates no sequence step, and does not
reopen completed Milestone 9.

---

# Scope

## Included

Exactly the Sprint 82 Authorized Vertical Slice: one pure, standalone, directly invoked Kernel library capability,
`RatificationAuthoritySnapshotIssuance` (Boundary A), implementing the RFC-0011 Final (Amended) v1.8
§ Ratification Authority Snapshot Issuance contract as amended by `NEXUS-RAT-2026-08-04-001` and
`NEXUS-RAT-2026-08-05-001`; plus the second structurally independent conformance oracle and its independence,
prior-vector, and complete-result agreement evidence; plus one conformance checkpoint over the live Ratification
Ledger at the Sprint's exact revision, reported in the Sprint Implementation Record and the review record only.

Remediation under this document is confined to the **same** twenty-four-file inventory. No task below creates,
renames, consolidates, or splits any path.

See the Sprint 82 Sprint Implementation Record for the complete Implemented Concepts (items 1–18), Deferred and
Prohibited Scope, Required Tests T1–T21, Acceptance Evidence, Stop Conditions 1–10, and the exact twenty-four-file
inventory. **Nothing outside `NEXUS-RAT-2026-08-06-002`'s Authorized Builder Scope, as specified by that record,
is authorized.**

## Excluded

- Production Snapshot issuance. **Dependency DEP1 of `NEXUS-RAT-2026-08-02-001` is not discharged by this Sprint,
  its implementation, or its conformance checkpoint.**
- Pinning any authority root, envelope commitment, or record fingerprint; writing any conformance-checkpoint value
  into `RATIFICATION_LEDGER.md`.
- Consumer-side schema-version readability and v1/v2 refusal; the V1–V9 Consumption Correspondence; Repository
  Policy Selection and Pre-Use Verification; Repository Policy Corpus Source assembly; scope-bearing Ratification
  references.
- Artifact custody, retrieval, serialization, re-issuance, and superseded-revision lifecycle.
- Any host surface, adapter surface, VS Code command, Domain Event, or durable persistence; any
  `createKernelServices()` composition; any change to `src/kernel/common/create-kernel-services.ts` or
  `test/integration/kernel-boundary-certification.integration.test.ts`.
- Any modification to any Sprint 54 module; any merge, alias, rename, or re-type of Sprint 54's
  `RatificationAuthorityRecord` with the v3 `LifecycleAuthorityRecord`.
- Any RFC amendment, Kernel Canon change, or edit to any prior Ledger entry. **In particular, the live corpus's
  `identifier-grammar-violation` on `NEXUS-RAT-2026-08-04-001` SHALL NOT be resolved by any Builder edit to a
  governed Ledger entry** — Stop Condition 8 continues to bind.
- Any fixture directory, fixture file, or generated-artifact path — all fixture octets are constructed inline in
  the authorized test files.
- Any file outside the authorized twenty-four-file inventory.
- Any git commit, push, or PR action (reserved to the human operator per `knowledge/CLAUDE.md`).

---

# Open Builder Tasks

Every task in this section is OPEN. Sprint 82 is Approved with Findings; no task below blocks that
approval, and no Critical finding remains open. `BT-082-006`, `BT-082-007`, `BT-082-008`, and
`BT-082-010` were blocked by Owner Review of 2026-08-09 under **Specification Conflict / Governance
Decision Required**, and are restated below under `NEXUS-RAT-2026-08-10-001`. Their prior forms are
withdrawn and SHALL NOT be implemented. The mandatory order in § Builder Instructions governs the
sequence in which the restated tasks are taken.

---

## BT-082-006 — Corrected T12 and T14 evidence, including the governed collision test

**Status:** OPEN. **Executable third**, after `BT-082-007` and `BT-082-008`. Restated under
`NEXUS-RAT-2026-08-10-001`; the prior form of this task is withdrawn.

**Summary:** The commitments test file carries the mapping for both T12 and T14 but contains two
tests, both T12. T12's duplicate-fingerprint obligation is unasserted, and T14 is unasserted
entirely. T14's prior wording ("supply-order independence of the root") was architecturally
incorrect and is corrected by `NEXUS-RAT-2026-08-10-001` D7.

**Authority:** `NEXUS-RAT-2026-08-10-001` D7, D8a, D8b, D8c, and objective tests 1, 2, 2b, 6, 8; Sprint
82 Sprint Implementation Record T12, T14, T17 as amended. Governing RFC: RFC-0011 Final (Amended)
v1.10 § Authority Root and Envelope Commitment, § Deterministic Ordering, § The Total Result
Contract.

**Target (exact, one file):**
`test/kernel/governance/ratification-authority-snapshot-issuance-commitments.test.ts`.

**Required work:**

1. Add the governed collision test by the D8a mechanism: `vi.mock` of
   `…ratification-authority-snapshot-issuance.contract` built over `importActual`, with a
   module-scoped toggle, default off, and a replacement `sha256Hex` that returns `'0'.repeat(64)`
   for exactly the two byte sequences obtained by encoding `result.records[0]` and
   `result.records[1]` of an unsubstituted `Issued` run with the exported
   `encodeLifecycleAuthorityRecord`, and delegates to the real digest for every other input.
   Byte-sequence identity is by length plus `Buffer.compare`; **substring inspection of encoded
   bytes is prohibited**, because the prepared source text is itself hashed.
2. Assert the exact public result: `Rejected`, `duplicate-record-fingerprint`, phase `Commitment`,
   precedence 7, `EntryPayload` naming the second record under record order, `detail` equal to that
   identifier.
3. Add the phase-order case: the same forced duplicate together with a malformed `capturedAt`
   reports `duplicate-record-fingerprint`, not `malformed-capture-instant`.
4. Add the encoder-disagreement test by the D8b mechanism: a second, separately toggled replacement
   of `encodeNccsOrderInsensitiveStrings` returning `undefined` for exactly the expected two-member
   fingerprint array and delegating otherwise, with the digest substitution **off** so the
   uniqueness pass admits the collection. Assert
   `RatificationAuthoritySnapshotIssuanceContractError` with `contractViolationCode`
   `internal-invariant-violation`, `diagnosticPhase` `ContractViolation`, `diagnosticPrecedence` 9,
   and that no result is produced. **This case evidences the classification of a step-4 refusal and
   nothing about step 5. It SHALL NOT be described, named, or asserted as evidence of
   complete-stage order.**
5. Add the complete-stage-order case by the D8c mechanism, which is a **separate test** from item 4
   and shares no toggle with it. With every substitution off and tracing on: record the digest
   inputs in call order, delegating every output unchanged; construct the expected
   `AuthorityRootBasis` byte array in the test from `encodeNccsRecord`, `encodeNccsString`,
   `encodeNccsInteger`, `encodeNccsOrderInsensitiveStrings`, the three exported fixed constants, and
   the unsubstituted baseline's `recordFingerprints`, `authoritySourceRevision`, and `recordCount`;
   reconstruct `preparedText` from the fixture bytes by UTF-8 decode, NFC, and CRLF/CR to LF; and
   form
   `expectedCommitmentDigestInputs = [encodeNccsString(preparedText), ...baseline.records.map(encodeLifecycleAuthorityRecord), expectedAuthorityRootBasis]`,
   of length `recordCount + 2`. Invoke issuance on the same governed source with a malformed
   `capturedAt`. Assert that the call returns `Rejected` with `malformed-capture-instant`, phase
   `Envelope`, precedence 8; that the trace has at least `recordCount + 2` entries and its **final
   `recordCount + 2` entries** equal `expectedCommitmentDigestInputs` element for element and in
   order, each by length plus `Buffer.compare`; and that the complete trace's final entry is the
   expected authority-root basis, so no envelope-commitment digest occurred.
   **Do not assert that the complete trace length is `recordCount + 2`, and do not assert that no
   digest call preceded `Commitment`.** The same `sha256Hex` binding derives `currentStatusDigest`
   once per accepted entry at `…issuance.ts:340`, before `Commitment`; those calls are traced and
   are lawful. Moving authority-root derivation after `validateEnvelopeInput`, or digesting the
   records out of record order, SHALL make this test fail.
6. Add the corrected T14 evidence of Sprint record § T14: differently ordered source texts produce
   different `authoritySourceRevision` values and different authority roots, asserted positively;
   the fingerprint collection equals the independently computed ascending-by-encoded-octets order;
   the root is invariant across differing declared facts over one unchanged source revision; the
   envelope commitment varies with them.
7. Isolation: `vi.resetModules()` and **all three** flags — the D8a digest substitution, the D8b
   encoder substitution, and the D8c trace — cleared in `afterEach`, together with the trace log. No
   other case in this file or the suite may observe any substitution or any trace.

**Prohibited:** **No test SHALL assert that two differently ordered source texts produce the same
authority root.** The two existing cases are preserved unchanged. No production signature, input
field, or public export may be added to carry either substitution.

**Acceptance:** objective tests 1, 2, 2b, 6, and 8 pass; repository validation clean.

## BT-082-010 — Oracle parity for `Commitment`, and recalculated agreement completeness

**Status:** OPEN. **Executable fourth.** Extended and restated under `NEXUS-RAT-2026-08-10-001`;
the prior corpus-completion obligation is retained in full and added to, not replaced.

**Summary:** The oracle implements the v1.8 eight-phase model and must independently implement the
v1.9 nine-phase model. Separately, the rebuilt agreement corpus constructs its own per-scenario
fixtures rather than reusing the literal fixtures defined in the twelve T-labeled test files; three
obligations from those files have no corpus counterpart. Both are addressed here.

**Authority:** `NEXUS-RAT-2026-08-10-001` D8b, D8c, D9, D10, and objective tests 9, 9b, 9c, 10, 11; Sprint 82
Sprint Implementation Record § The Second Structurally Independent Implementation, § Agreement
corpus. Governing RFC: RFC-0011 Final (Amended) v1.10 § Two Structurally Independent
Implementations.

**Targets (exact):** `test/kernel/governance/issuance-oracle/vocabulary.oracle.ts`;
`test/kernel/governance/issuance-oracle/issuance.oracle.ts`;
`test/kernel/governance/issuance-oracle/oracle-agreement.test.ts`.

**Required work:**

1. `vocabulary.oracle.ts`: add `duplicate-record-fingerprint`; add the `Commitment` phase at rank 7;
   move `ContractViolation` to 9. **The `malformed-capture-instant` and `malformed-attribution`
   precedence rows, and the move of `Envelope` to 8, were already applied under `BT-082-007` by
   `NEXUS-RAT-2026-08-10-002` § Governance Decision E2, so that the two natural agreement fixtures
   remain green at that boundary. Confirm they read 8 and do not re-apply them.**
2. `issuance.oracle.ts`: derive the authority source revision, the record fingerprints in record
   order, the record-order uniqueness check, the order-insensitive encoding, and the authority root
   **before** any declared-fact examination; return the governed
   `duplicate-record-fingerprint` rejection from the uniqueness check; export the record encoder as
   `oracleEncodeLifecycleAuthorityRecord`; replace the bare `Error` in `requiredBytes` with the
   oracle's own independently declared contract-violation signal.
3. `oracle-agreement.test.ts`: recalculate the completeness assertion at line 50 to assert equality
   with set **E**, the forty-six natural-fixture codes, naming `duplicate-record-fingerprint` in the
   exclusion with the reason stated inline — that no natural governed fixture can exhibit it, not
   that it is unreachable. Add a second assertion establishing **E ∪ S = V**, the complete
   forty-seven-code public vocabulary. Complete the three missing corpus obligations from the prior
   form of this task.
4. Add the oracle's own collision case and its own encoder-disagreement case by substitution of
   `oracleSha256Hex` and `oracleOrderInsensitiveStrings`, discriminated by byte sequences built
   with `oracleEncodeLifecycleAuthorityRecord`, under the same isolation rules. The
   encoder-disagreement case is **required**, not optional: it is the only evidence that the
   oracle's independently implemented non-public contract channel classifies a step-4 refusal
   correctly.
5. Add the oracle's own **complete-stage-order** case by the D8c mechanism, separate from item 4
   and sharing no toggle with it: a delegating trace over `oracleSha256Hex` that records inputs in
   call order and returns every output unchanged; an expected authority-root basis constructed from
   the oracle's own encoders and its own declared constants and from the oracle's own unsubstituted
   baseline values; invocation on the same governed source with a malformed `capturedAt`; and the
   same assertions as objective test 2b — the ordinary `Envelope` rejection is returned; the trace's
   **final `recordCount + 2` entries** equal, element for element and in order, the oracle's own
   `[oracleString(preparedText), …oracleEncodeLifecycleAuthorityRecord per record in record order,
   expectedOracleAuthorityRootBasis]`; and the complete trace's final entry is that expected basis.
   **The oracle SHALL NOT assert a total trace length**: `sourceStatusDigest` calls
   `oracleSha256Hex(oracleString(status))` at `issuance.oracle.ts:1309`, before `Commitment`, and
   those entries are lawfully present. The oracle SHALL NOT import the implementation's expected
   byte array, its encoders, or any implementation module. Moving the oracle's authority-root
   derivation after its declared-fact examination SHALL make this test fail.

**Binding authoring rule:** the oracle is written from RFC-0011 v1.10 text alone, as amended through
`NEXUS-RAT-2026-08-11-001`. It SHALL NOT be
derived from, refactored out of, or diffed against the implementation, and SHALL NOT import
`…issuance.errors.ts`, `…issuance.contract.ts`, `…issuance.types.ts`, or `…issuance.ts`.
Field-for-field agreement is asserted over governed corpus inputs only; it is **not** asserted over
substituted inputs.

**Acceptance:** objective tests 9, 9b, 9c, 10, 11, and 12 pass; repository validation clean.

## BT-082-007 — Implement the governed `Commitment` phase and the contract-violation channel

**Status:** OPEN. **Executable first. Nothing else may precede it.** Restated under
`NEXUS-RAT-2026-08-10-001`; the prior form of this task, which offered two incompatible
alternatives, is withdrawn.

**Summary:** `reject('internal-invariant-violation' as never, …)` at
`…issuance.ts:920-924` references a code with no metadata entry and no phase; the path raises a
`TypeError` that escapes the boundary. RFC-0011 v1.9 replaces this with one exact behavior: the
condition is governed, and the residual contract violations are raised on a named non-public
channel.

**Authority:** `NEXUS-RAT-2026-08-10-001` D2, D3, D4, D5, and objective tests 1, 2, 2b, 3, 5, 6, 7;
and `NEXUS-RAT-2026-08-11-001` G1, G1a, G2, G4, and G5, which correct the runtime payload validation
of this task and pin its corrective baseline to PR head
`658dd5d973c031fb31fab2774c6241f807ca9a9a`. Governing RFC: RFC-0011 Final (Amended) **v1.10** § The
Total Result Contract → Diagnostic Phases, Within-Phase Precedence, Target Selection Order, The
Closed Public Vocabulary, Structured Diagnostic Payloads, Contract Violations.

**Targets (exact, seven files):** production — `…issuance.types.ts`, `…issuance.errors.ts`,
`…issuance.contract.ts`, `…issuance.ts`; evidence, added by `NEXUS-RAT-2026-08-10-002` § Governance
Decision E2 — `test/kernel/governance/ratification-authority-snapshot-issuance-diagnostics.test.ts`,
`test/kernel/governance/ratification-authority-snapshot-issuance-result-contract.test.ts`, and
`test/kernel/governance/issuance-oracle/vocabulary.oracle.ts`. All seven are already inside the
twenty-four-file authorized inventory; it is **not** enlarged and no new file may be created.

**Required evidence work, in addition to the production changes below:**

- `…-diagnostics.test.ts`: change the closed-vocabulary length assertion from 46 to 47; add
  objective test 3, asserting `diagnosticPhase` `Envelope` and `diagnosticPrecedence` 8 for both
  `malformed-capture-instant` and `malformed-attribution`.
- `…-result-contract.test.ts`: add objective test 5 — five cases against the validated constructor
  (wrong payload variant for the code; a missing declared field; an extra field; a wrongly typed
  field; an empty String field and an empty `pathIdentifiers`), each raising
  `RatificationAuthoritySnapshotIssuanceContractError` carrying `malformed-diagnostic-payload`. Add
  objective test 7 as the exhaustive central-construction test specified by
  `NEXUS-RAT-2026-08-10-002` § Governance Decision E5: enumerate the complete 47-code public
  vocabulary, construct a valid declared payload for each code's declared `payloadKind`, construct
  every corresponding `Rejected` result through
  `createRatificationAuthoritySnapshotRejectedResult`, and assert that every returned
  `diagnosticCode` and `diagnosticPhase` lies inside the closed 47-code and 9-phase public
  partitions; assert that the three contract-violation codes and the `ContractViolation` phase are
  absent from those partitions and cannot be returned as an `Issued` or `Rejected` result; and
  assert that an `Issued` result carries no diagnostic fields. Sampling does not satisfy this test.
- `vocabulary.oracle.ts`: **metadata only** — change `malformed-capture-instant` and
  `malformed-attribution` from `['Envelope', 7]` to `['Envelope', 8]`, derived from RFC-0011 v1.10
  § Diagnostic Phases and from no implementation source. Add nothing else. The `Commitment` phase,
  `duplicate-record-fingerprint`, the collision and encoder-disagreement mechanisms, and the
  stage-order trace remain `BT-082-010`. The oracle SHALL NOT import any `src/` module, and
  `oracle-independence.test.ts` SHALL continue to pass unchanged.

**Required changes:**

- `…types.ts`: insert `'Commitment'` between `'Resolution'` and `'Envelope'` in
  `ratificationAuthoritySnapshotDiagnosticPhases`; append `'duplicate-record-fingerprint'` to
  `ratificationAuthoritySnapshotDiagnosticCodes`. No contract-violation code is added to either.
- `…errors.ts`: declare the three-member contract-violation code union **in this file only**; give
  `RatificationAuthoritySnapshotIssuanceContractError` a required code parameter and the readonly
  fields `contractViolationCode`, `diagnosticPhase: 'ContractViolation'`, `diagnosticPrecedence: 9`.
- `…contract.ts`: add the metadata row
  `'duplicate-record-fingerprint': { phase: 'Commitment', precedence: 7, payloadKind: 'EntryPayload' }`;
  change `malformed-capture-instant` and `malformed-attribution` precedence from 7 to 8; add to
  `createRatificationAuthoritySnapshotRejectedResult` the runtime payload validation of RFC-0011
  v1.10 § Contract Violations rule 5 — variant match, exact field set, field type, code-aware
  non-empty data-String fields, non-empty `pathIdentifiers` — raising the contract error carrying
  `malformed-diagnostic-payload`. The non-empty check over data-String fields is **code-aware** per
  `NEXUS-RAT-2026-08-11-001` § Governance Decision G1 and G2: it is driven by a declared table of
  exactly two permitted empty-token pairs — `malformed-scope-key` with `scopeKey`, and
  `malformed-attribution` with `declaredField` — and refuses an empty value on every one of the
  other sixty-one code-and-data-String-field pairs. The `payloadKind` variant-match limb is
  unchanged and reaches no exception, per G1a. The evidence required by
  `NEXUS-RAT-2026-08-11-001` § Governance Decision G5 is added to
  `…-result-contract.test.ts` and to no other file;
  relocate `sha256Hex` here from `…issuance.ts` as a named export.
- `…issuance.ts`: import `sha256Hex` from `…contract.ts`; add the module-private
  `AuthorityCommitmentStage` interface and `deriveAuthorityCommitment(preparedText, records)`
  returning `{ result?, value? }`; call it **before** `validateEnvelopeInput`; within it derive
  `authoritySourceRevision`, the record fingerprints in record order, run the record-order
  uniqueness pass returning `Rejected` with `duplicate-record-fingerprint` and an `EntryPayload`
  naming the second repeating record, run `encodeNccsOrderInsensitiveStrings` and raise the contract
  error carrying `internal-invariant-violation` if it returns `undefined`, and derive
  `AuthorityRootBasis` and the authority root; reduce `issueResult` to consuming
  `AuthorityCommitmentStage` and deriving only the envelope commitment, the three counts, and the
  `Issued` object; remove `reject('internal-invariant-violation' as never, noPayload())` and the
  `as never` cast.

**Binding execution-order requirement:** all five steps of the `Commitment` phase SHALL complete
before `validateEnvelopeInput` is called. Envelope-commitment derivation SHALL remain after it. An
implementation that can report an `Envelope` diagnostic without having derived the authority root
does not satisfy this task.

**Prohibited:** no change to the encoded octets of `LifecycleAuthorityRecord`, `AuthorityRootBasis`,
or `EnvelopeCommitmentBasis`; no change to the snapshot schema version; no contract-violation code
in `…types.ts` or in any result field; no new file.

**Acceptance:** objective tests **3, 5, and 7** pass; no exception escapes for any governed input;
**repository validation is clean, with no failing test of any kind**. Objective tests 1, 2, 2b, and
6 are **deferred to `BT-082-006`**, whose authorized D8a, D8b, and D8c mechanisms and authorized
test file supply them; they SHALL NOT be claimed, cited, or asserted at this boundary. Objective
test 4 is `BT-082-008`. Restated by `NEXUS-RAT-2026-08-10-002` § Governance Decision E1, E2, E4,
and E5.

## BT-082-008 — Implement the `undeclared-diagnostic` classification

**Status:** OPEN. **Executable second**, immediately after `BT-082-007`. Restated under
`NEXUS-RAT-2026-08-10-001`; the "implement or remove" alternative is withdrawn — the rule is
implemented, not removed.

**Summary:** `assertKnownDiagnosticCode` is never called anywhere, and would map an unknown code to
`invalid-input` rather than to `undeclared-diagnostic`. RFC-0011 v1.9 § Contract Violations rule 4
states the exact behavior: verify vocabulary membership at the single construction site and raise
the contract error; never substitute a governed code for an undeclared one.

**Authority:** `NEXUS-RAT-2026-08-10-001` D5 and objective test 4. Governing RFC: RFC-0011 Final
(Amended) v1.10 § Contract Violations rule 4, which `NEXUS-RAT-2026-08-11-001` preserves verbatim.

**Targets (exact, two files):** `…issuance.contract.ts`; and
`test/kernel/governance/ratification-authority-snapshot-issuance-result-contract.test.ts`, which
carries objective test 4. Both are inside the twenty-four-file authorized inventory. Evidence
allocation per `NEXUS-RAT-2026-08-10-002` § Governance Decision E4. This task SHALL NOT alter,
weaken, or re-scope the objective test 5 or objective test 7 assertions delivered by `BT-082-007`.

**Required work:** add the vocabulary-membership check to the validated constructor created by
`BT-082-007`, raising `RatificationAuthoritySnapshotIssuanceContractError` carrying
`undeclared-diagnostic`; delete `assertKnownDiagnosticCode` entirely.

**Acceptance:** objective test 4 passes, evidenced in `…-result-contract.test.ts`; repository
validation is clean, with no failing test of any kind.

## BT-082-009 — Make the T6 negative test assert the property it claims

**Status:** OPEN. **Executable — third group in the Reviewer's recorded order.**

**Summary:** The T6 negative test adds an unrecognized top-level key and observes `malformed-attribution`, which
exercises the T13 unrecognized-declared-field rule rather than the absence of a caller-supplied declaration channel.

**Authority:** Sprint 82 Sprint Implementation Record § Acceptance Criteria T6 ("negative test that no API surface
accepts a caller-supplied declaration object").

**References:** `NEXUS-REV-2026-08-06-001`, Finding `NEXUS-REV-0082-MIN-003`.

**Implementation Targets:**

- `test/kernel/governance/ratification-authority-snapshot-issuance-declarations.test.ts`

**Required Changes:**

- Assert directly against the public surface that no parameter, field, or channel accepts a declaration object.
- Keep the existing unrecognized-field assertion where it properly belongs under T13.

**Acceptance Criteria:**

- The T6 negative test verifies the absence of a declaration channel, distinctly from T13's unrecognized-field
  rule.
- Repository validation clean.

**Reviewer Evidence:** `ratification-authority-snapshot-issuance-declarations.test.ts:81-93`. The underlying
property does hold — the sole export takes `input: unknown`
(`ratification-authority-snapshot-issuance.ts:93`) and `contract.ts` exports only encoders and metadata — so this
is a test-accuracy defect, not a contract breach.

---

## BT-082-011 — Strengthen the agreement matcher to `toStrictEqual`

**Status:** OPEN. **Executable — third group in the Reviewer's recorded order.**

**Summary:** The agreement assertion uses `toEqual`, which treats an object carrying an `undefined`-valued key as
equal to one lacking that key entirely. Several oracle types carry optional fields where this distinction could
pass silently, making the assertion weaker than the "field for field" standard the corpus definition declares.

**Authority:** Sprint 82 Sprint Implementation Record § Agreement ("Digest-only, envelope-only, or selected-field
comparison is insufficient"); RFC-0011 Final (Amended) v1.8 line 1357 ("the complete public result, field for
field"). Execution authority: existing `NEXUS-RAT-2026-08-06-002`, still active.

**References:** `NEXUS-REV-2026-08-07-002`, Finding `NEXUS-REV-0082-MIN-004`. Category: **Implementation Defect**.
Severity: **Minor**.

**Implementation Targets:**

- `test/kernel/governance/issuance-oracle/oracle-agreement.test.ts`

**Required Changes:**

- Change `toEqual` to `toStrictEqual` at the agreement assertion.

**Acceptance Criteria:**

- The agreement assertion uses `toStrictEqual`.
- The full corpus continues to pass under the stricter matcher, including the `reachedCodes` completeness
  assertion.
- Repository validation clean.

**Reviewer Evidence:** `oracle-agreement.test.ts:47`; the optional fields `scopeDescription` and
`lifecycleDeclaringAuthority` on the `Segment` and `LifecycleRecord` interfaces in `issuance.oracle.ts`. The
Reviewer substituted `toStrictEqual` locally on the `Issued` and live-Ledger cases and confirmed **both still
pass** — the gap is currently latent, and the change is expected to be free. Risk grows as the corpus is extended
under `BT-082-010`.

---

## BT-082-012 — Make the T11 cycle fixtures discriminate the `closed` branch and root ordering

**Status:** OPEN. **Executable — third group in the Reviewer's recorded order.** Generated as its own task; it
SHALL NOT be treated as reopening `BT-082-005`, which is Completed.

**Summary:** Across all five cases in the T11 file, the DFS never re-encounters a `closed` node, so rule 3.2's
branch is never taken; and every fixture's source nodes appear in the governed source in ascending identifier
order, so rule 2's ascending-octet root order is never distinguished from a naive source-order root traversal. Two
normative selection rules therefore remain unverified.

**Authority:** RFC-0011 Final (Amended) v1.8 § Cycle Selection — rule 2 (roots entered "in **ascending octet
order** of their identifiers") and rule 3.2 ("if it is `closed`, the search SHALL return at once without
re-entering it"), together with that section's closing paragraph declaring `closed` marking "normative, not an
optimization." Execution authority: existing `NEXUS-RAT-2026-08-06-002`, still active.

**References:** `NEXUS-REV-2026-08-07-003`, Finding `NEXUS-REV-0082-MIN-005`. Category: **Implementation Defect**
(test coverage). Severity: **Minor**.

**Implementation Targets:**

- `test/kernel/governance/ratification-authority-snapshot-issuance-graphs.test.ts`

**Required Changes:**

- Add a fixture in which a node closed under one root is re-encountered under a later root, or a diamond in which
  two predecessors both reach a common acyclic subtree — the latter SHALL remain `Issued` and SHALL NOT report a
  false cycle.
- Add a fixture whose cycle-bearing entries appear in the governed source in **descending** identifier order, so
  that ascending-octet root selection produces a different reported path than source order would.

**Acceptance Criteria:**

- Rule 3.2's `closed` branch is taken by at least one case.
- At least one case would fail if roots were entered in source order rather than ascending octet order.
- The existing five cases continue to pass unchanged, and `NEXUS-REV-0082-MAJ-002` remains resolved.
- Repository validation clean.

**Reviewer Evidence:** `ratification-authority-snapshot-issuance-graphs.test.ts:77-99` — the `closed`-marking
fixture's edges are `-531→-532`, `-531→-533`, `-533→-534`, `-534→-533`. Under root `-531`, node `-532` is entered,
exhausted, popped, and marked `closed`, but nothing ever re-enters it; the cycle is then found on the sibling edge
to `-533`. **Removing `closed` marking from the implementation entirely would not change this fixture's result.**
At `:31-53`, `:55-75`, and `:77-99` the source-node sets are `{-510,-511,-512}`, `{-521,-522,-523,-524}`, and
`{-531,-533,-534}`, each appearing in the source in ascending order, so entry order and ascending octet order
coincide in every case. The Reviewer recorded the gap as latent and narrower than `MAJ-002`: the primary T11
obligations are met and the reported paths are exact.

---

# Blocked Builder Tasks

**None currently.** `BT-082-006`, `BT-082-007`, `BT-082-008`, and `BT-082-010` were classified
**Specification Conflict / Governance Decision Required** by Owner Review of 2026-08-09. The
conflict was that the duplicate-fingerprint condition had no lawful result representation: RFC-0011
v1.8 required simultaneously that issuance be total, that a duplicate fingerprint fail closed, that
the public vocabulary be closed, and that the three contract-violation codes not be reachable
through the public contract. No implementation satisfied all four.
`NEXUS-RAT-2026-08-10-001` resolves the conflict by making the condition governed, and amends
RFC-0011 to v1.9 accordingly. All four tasks are restated under § Open Builder Tasks and are
unblocked **as restated**.

`BT-082-003` was the last Blocked Builder Task. It was unblocked by `NEXUS-REV-2026-08-07-001` (2026-08-07) on
verified completion of `BT-082-002`, and certified **Completed** by `NEXUS-REV-2026-08-07-002` (2026-08-07),
resolving `NEXUS-REV-0082-CRIT-002`. It is carried forward under § Resolved Builder Tasks.

`DOC-082-001` was unblocked by `NEXUS-REV-2026-08-07-002` — both Critical findings it was gated behind are now
resolved — and appears as OPEN under § Documentation Tasks.

---

# Documentation Tasks

## DOC-082-001 — Restate Sprint 82 acceptance evidence to match what the suite verifies

**Status:** OPEN. **Unblocked** by `NEXUS-REV-2026-08-07-002` (2026-08-07) — both Critical findings this task was
gated behind are resolved. Still sequenced **last**, after every implementation task, per the Reviewer's recorded
disposition: restating acceptance evidence against an intermediate state would re-record an inaccurate account,
which is the very defect this finding identifies.

**Summary:** The Sprint Implementation Record and `IMPLEMENTATION_REPORT.md` assert acceptance evidence the suite
does not provide, and record "No architectural deviations." The stated test counts are literally true but are
presented as satisfying obligations they do not satisfy — and are now additionally **stale**: both documents still
state 26/26 across 15/15 and 809/809 across 134/134, none of which reflects `BT-082-002`, `BT-082-003`, or
`BT-082-005`.

**Authority:** `IMPLEMENTATION_GATE.md` Gate 13; `IMPLEMENTATION_CONSTITUTION.md` § Sprint Specifications.

**References:** `NEXUS-REV-2026-08-06-001`, Finding `NEXUS-REV-0082-DOC-001`; reconfirmed current and unblocked by
`NEXUS-REV-2026-08-07-002`; reconfirmed open and unchanged by `NEXUS-REV-2026-08-09-001` (2026-08-09), which
independently reproduced the target counts as still **32/32 across 15/15** and **815/815 across 134/134**.
Category: Documentation Drift (unchanged). Severity: Major (unchanged).

**Implementation Targets:**

- `knowledge/implementation/sprints/sprint-0082-ratification-authority-snapshot-issuance.md` — § Validation
  Summary, § Completion Requirements, § Implementation Deviations (Builder-owned sections only; § Reviewer Notes
  and § Final Disposition are Reviewer-owned and SHALL NOT be modified)
- `IMPLEMENTATION_REPORT.md` — Sprint 82 § Validation Summary, § Deviations

**Required Changes:**

- Restate acceptance evidence to match what the suite actually verifies **at the time this task is executed**.
- Update the stated test counts, which are stale. As of `NEXUS-REV-2026-08-07-003` the actual counts are **32/32
  across 15/15** authorized Sprint 82 test files and **815/815 across 134/134** non-extension files; both documents
  still state 26/26 and 809/809. These targets have moved once per recovery cycle — **reproduce them at execution
  time rather than copying the figures quoted here.**
- Record the completed recovery tasks (`BT-082-002`, `BT-082-003`, `BT-082-005`, and any completed later), which
  neither document mentions.
- Record the deviations identified by `NEXUS-REV-2026-08-06-001` rather than "No architectural deviations."
- Documentation only. **No source or test file SHALL be modified by this task.**

**Acceptance Criteria:**

- Every acceptance-evidence statement is verifiable against the delivered suite at execution time.
- Stated test counts match a freshly reproduced run; **report actual counts rather than predicting them**.
- Gate 13 obligations satisfied.
- No Reviewer-owned section altered.

**Reviewer Evidence:** `IMPLEMENTATION_REPORT.md:76-77` and the Sprint record § Validation Summary (`:428-429`)
report "26/26 tests across 15/15 authorized Sprint 82 test files" and "809/809 tests across 134/134 files"; none
reflects `BT-082-002`, `BT-082-003`, or `BT-082-005`. `IMPLEMENTATION_REPORT.md` carries a modification timestamp
predating every recovery task. Independently reproduced current counts (`NEXUS-REV-2026-08-07-003`): 32/32 across
15/15 and 815/815 across 134/134.

**Prior Block Reason (retained as history).** The Reviewer originally dispositioned this finding as a Documentation
Task blocked behind the two Critical findings, on the ground that restating evidence before that evidence exists
would re-record an inaccurate account.

**Unblock (`NEXUS-REV-2026-08-07-002`, 2026-08-07).** Both Critical findings — `NEXUS-REV-0082-CRIT-001` and
`NEXUS-REV-0082-CRIT-002` — are resolved, so the block is lifted and this task is OPEN. **Sequencing is
unchanged**: it remains last, after every implementation task, so that the evidence it describes is final when it
is written. Category, Severity, and Authority are unchanged.

---

# Future Improvements

Recorded from `NEXUS-REV-2026-08-06-001`, `NEXUS-REV-2026-08-07-002`, and `NEXUS-REV-2026-08-07-003`. No Builder
Task is generated and none of these blocks Sprint completion. `NEXUS-REV-2026-08-09-001` (2026-08-09) recorded
**no new Observation**; every item below stands unchanged.

Recorded as Observations by `NEXUS-REV-2026-08-07-003` (2026-08-07):

- The five T11 cases assert `result`, `diagnosticCode`, and `diagnosticPayload` but not `phase` or `precedence`.
  The Reviewer recorded this as matching the file's pre-existing convention and outside `BT-082-005`'s Required
  Changes; the phase/precedence contract is covered elsewhere in the Sprint's diagnostics test file.
- The `closed`-marking fixture is the only case in the Sprint exercising a `SegmentedLifecycle` declaration as a
  source of lifecycle-graph edges — useful incidental coverage of segment-order edge contribution.

Recorded as Observations by `NEXUS-REV-2026-08-07-002` (2026-08-07):

- `oracle-agreement.test.ts:51-52` assert that the literal case-name array built two lines above contains entries
  the same author hardcoded moments earlier. These cannot fail under any code path and verify nothing about
  behavior.
- `source-parser.oracle.ts`'s exports (`oracleSourceForSingleActiveEntry`, `oracleDeclarationSource`) are no longer
  imported anywhere, since `oracle-agreement.test.ts` now builds its fixtures inline. The file **SHALL remain** —
  it is one of the seven authorized conformance-oracle paths and `oracle-independence.test.ts` walks it — but its
  current exports are dead code.
- The entire ~50-case agreement corpus runs inside one `it()`. `expect(x, name)` labels failures for diagnosis, but
  a first failure aborts every remaining case in that run.

Recorded from `NEXUS-REV-2026-08-06-001`:

- The Reviewer noted that the live-corpus conformance checkpoint returning `Rejected` ·
  `identifier-grammar-violation` on `NEXUS-RAT-2026-08-04-001` is a legitimate, informative Sprint outcome under
  Acceptance Evidence item 2, correctly not written into the Ledger. Any correction of the governed source is a
  separate governance act under separate authority and is **prohibited** to the Builder by Stop Condition 8.
- The Reviewer observed that `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` described Sprint 82 as
  "Implemented — Pending Reviewer Validation," which overstated a rejected sprint. **Resolved by the Sprint Owner
  Resolution of 2026-08-06**: the five applicable current-state Sprint 82 sites were reconciled to Rejected /
  remediation authorized. Historical "Pending Reviewer Validation" text belonging to other sprints was deliberately
  left untouched.
- **Separate observation, expressly out of scope for this change.** The `nexus-review` and `nexus-sprint` skills
  reference `knowledge/implementation/review-finding-categories.md`, which does not exist; the actual classification
  document is `knowledge/implementation/review-classification.md`. This is pre-existing skill/repository drift,
  unrelated to Sprint 82, and SHALL NOT be used to expand this or any Sprint 82 task.

---

# Builder Instructions

Implement work exactly as authorized by `NEXUS-RAT-2026-08-06-002` and specified by the Sprint 82 Sprint
Implementation Record, and by nothing else. This document carries no independent authority, per
`IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications.

**The Builder SHALL take tasks in the mandatory order below, and SHALL NOT skip an incomplete predecessor.** The
order is the order established by `NEXUS-RAT-2026-08-10-001`, which replaces the Reviewer's
recorded dependency order from `NEXUS-REV-2026-08-07-003` § Builder Task Recommendation as restated
by `NEXUS-REV-2026-08-09-001`. That prior order required duplicate-fingerprint acceptance evidence
before the result-contract implementation the evidence depends on, and was therefore not
executable. The order below is binding and SHALL NOT be reordered.

The governing specification for all open Sprint 82 work is **RFC-0011 Final (Amended) v1.10**. Where
any task record in this document cites RFC-0011 v1.8 or v1.9, that citation is **historical** and
records the governing text at the time that task record was written; for all open work the governing
text is **v1.10 as amended by `NEXUS-RAT-2026-08-10-001` and `NEXUS-RAT-2026-08-11-001`**, and no
task-level citation of an earlier version narrows, qualifies, or displaces it. The authorization
authority is `NEXUS-RAT-2026-08-06-002` as amended by `NEXUS-RAT-2026-08-10-001`; that permanent
authority is unchanged by `NEXUS-RAT-2026-08-11-001`, which is an amendment authority within its
named extent only. This document carries no independent authority.

1. `BT-082-002` — **COMPLETED** (`NEXUS-REV-2026-08-07-001`, 2026-08-07)
2. `BT-082-003` — **COMPLETED** (`NEXUS-REV-2026-08-07-002`, 2026-08-07)
3. `BT-082-004` — **RETIRED, resolved** (`NEXUS-REV-0082-MAJ-001` resolved collaterally by `BT-082-003`)
4. `BT-082-005` — **COMPLETED** (`NEXUS-REV-2026-08-07-003`, 2026-08-07)
5. `BT-082-007` — the governed `Commitment` phase, the contract-violation channel, and runtime
   payload validation. **First. Nothing else may precede it.**
6. `BT-082-008` — the `undeclared-diagnostic` classification and deletion of
   `assertKnownDiagnosticCode`.
7. `BT-082-006` — corrected T12 and T14 evidence, including the collision-forcing and
   encoder-disagreement tests.
8. `BT-082-010` — oracle parity for the `Commitment` phase and the recalculated agreement
   completeness assertion.
9. `BT-082-009`, `BT-082-011`, `BT-082-012`
10. `DOC-082-001` last

**Sprint 82 is Approved with Findings.** Every remaining task is follow-up work that does **not** block that
approval. This is a change from prior generations of this document, in which `OPEN` did not confer eligibility.

`BT-082-002`, `BT-082-003`, and `BT-082-005` are **COMPLETED** and SHALL NOT be reopened, reimplemented, or
revisited. Their deliverables SHALL remain passing and SHALL NOT be weakened, relaxed, or removed by any subsequent
task:

- `nccs1-conformance-vectors.test.ts` asserting RFC-0003 Positive Vectors 4, 5, and 6 against both encoders.
- `oracle-agreement.test.ts`'s corpus coverage — the live Ratification Ledger, four `Issued` cases,
  and the forty-six natural-fixture vocabulary codes (set **E**) — including the `reachedCodes`
  completeness assertion, which is the mechanical guarantee that resolved
  `NEXUS-REV-0082-MAJ-001`. `BT-082-010` recalculates that assertion's expected set from an
  implicit whole-vocabulary set to the explicit set **E**, and adds the assertion that **E** united
  with the separately evidenced `duplicate-record-fingerprint` equals the complete forty-seven-code
  vocabulary. Every code it previously covered remains covered. This is a recalculation, not a
  relaxation; `BT-082-003` is **not** reopened and its guarantee is **not** weakened.
- `oracle-independence.test.ts`, which SHALL continue to pass unchanged.
- The five T11 cases in `ratification-authority-snapshot-issuance-graphs.test.ts`, including the three exact
  `RelationPathPayload` assertions the Reviewer verified against RFC-0011 § Cycle Selection. `BT-082-012` extends
  this file; it SHALL NOT relax or replace any existing case.

Per § Determinism, completed tasks are closed and generate no further Builder action.

`BT-082-004` is **RETIRED**. Its finding is resolved; per the Reviewer's recorded disposition it is retired, not
regenerated, and SHALL NOT be implemented.

**The authoring rule remains binding on `BT-082-010` and `BT-082-011`.** Both touch the conformance oracle. The
oracle is written from the specification text alone and SHALL NOT be derived from, refactored out of, or diffed
against the implementation. Do not read the `src/kernel/governance/ratification-authority-snapshot-issuance.*`
modules to resolve oracle behavior; if the specification is ambiguous, stop and report it.

**Stop Condition 9 remains binding prospectively.** Both halves of the prerequisite evidence now exist, but neither
may be weakened, and agreement SHALL NOT be reported on any basis that circumvents the vector checks.

All remediation is confined to the existing twenty-four-file authorized inventory. **Stop Condition 10 continues to
bind: if any file outside that inventory requires creation or modification, stop and return for explicit scope
amendment.** Stop Conditions 1–10 apply verbatim as recorded in the Sprint Implementation Record.

`BT-082-001` is FAILED and is superseded by the tasks above; it SHALL NOT be reimplemented as a whole.
`BT-081-001`, `BT-081-002`, `DOC-081-002`, `BT-080-001`–`BT-080-004`, `BT-079-001`, `BT-079-002`, `DOC-079-001`,
and `BT-078-001` are COMPLETED or RESOLVED and SHALL NOT be reopened or reimplemented.

`REVIEW_HISTORY.md` is written by the independent Reviewer only. The Sprint Implementation Record's § Reviewer Notes
and § Final Disposition are Reviewer-owned and SHALL NOT be modified by the Builder.

No git commit, push, merge, or PR action is authorized; those remain reserved to the human operator per
`knowledge/CLAUDE.md`.

---

# Traceability

| Task ID       | Sprint    | RFC            | Governing Authority         | Finding                     | Status |
| ------------- | --------- | -------------- | ---------------------------- | --------------------------- | ------ |
| `BT-082-002`  | Sprint 82 | RFC-0011 v1.8; RFC-0003 | `NEXUS-RAT-2026-08-06-002` | `NEXUS-REV-0082-CRIT-001` | Completed (`NEXUS-REV-2026-08-07-001`) |
| `BT-082-003`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-CRIT-002`   | Completed (`NEXUS-REV-2026-08-07-002`) |
| `BT-082-004`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MAJ-001`    | Retired — finding resolved (`NEXUS-REV-2026-08-07-002`) |
| `BT-082-005`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MAJ-002`    | Completed (`NEXUS-REV-2026-08-07-003`) |
| `BT-082-006`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MAJ-003`    | **Open — executable now** |
| `BT-082-010`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MAJ-004`    | Open — executable |
| `BT-082-007`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MIN-001`    | Open — executable |
| `BT-082-008`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MIN-002`    | Open — executable |
| `BT-082-009`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MIN-003`    | Open — executable |
| `BT-082-011`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MIN-004`    | Open — executable |
| `BT-082-012`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-0082-MIN-005`    | Open — executable |
| `DOC-082-001` | Sprint 82 | RFC-0011 v1.8  | `NEXUS-REV-2026-08-06-001`   | `NEXUS-REV-0082-DOC-001`    | Open — unblocked, sequenced last |
| `BT-082-001`  | Sprint 82 | RFC-0011 v1.8  | `NEXUS-RAT-2026-08-06-002`   | `NEXUS-REV-2026-08-06-001`  | Failed |
| `DOC-081-002` | Sprint 81 | RFC-0013 v1.0  | `NEXUS-REV-2026-07-22-005`   | `NEXUS-REV-0081-DOC-001`    | Completed |
| `BT-081-002`  | Sprint 81 | RFC-0013 v1.0  | `NEXUS-REV-2026-07-22-004`   | `NEXUS-REV-0081-DEF-001`    | Completed |
| `BT-081-001`  | Sprint 81 | RFC-0013 v1.0  | `NEXUS-REV-2026-07-22-003`   | —                            | Completed |
| `BT-080-002`  | Sprint 80 | RFC-0006 v1.3  | `NEXUS-REV-2026-07-22-002`   | `NEXUS-REV-0080-DEF-001`    | Completed |
| `BT-080-003`  | Sprint 80 | RFC-0006 v1.3  | `NEXUS-REV-2026-07-22-002`   | `NEXUS-REV-0080-TST-001`    | Completed |
| `BT-080-004`  | Sprint 80 | RFC-0006 v1.3  | `NEXUS-REV-2026-07-22-002`   | `NEXUS-REV-0080-TST-002`    | Completed |
| `BT-080-001`  | Sprint 80 | RFC-0006 v1.3  | `NEXUS-RAT-2026-07-21-007`   | —                            | Resolved |
| `BT-079-002`  | Sprint 79 | RFC-0002 v1.3  | `NEXUS-REV-2026-07-21-002`   | `NEXUS-REV-0079-DEF-001`    | Completed |
| `DOC-079-001` | Sprint 79 | RFC-0002 v1.3  | `NEXUS-REV-2026-07-21-002`   | `NEXUS-REV-0079-DOC-001`    | Completed |

---

# Failed Builder Tasks

## BT-082-001 — Implement Sprint 82 (SGP-1 — Ratification Authority Snapshot Issuance Capability)

**Status:** FAILED. Reviewed by `NEXUS-REV-2026-08-06-001` (FAIL; Sprint 82 Rejected). The twenty-four-file
inventory was delivered exactly and the implementation code is largely conformant, but Acceptance Evidence item 1 is
not satisfied and Stop Condition 9 is triggered: the RFC-0003 Conformance Vectors are never used
(`NEXUS-REV-0082-CRIT-001`) and oracle agreement covers one fixture rather than the declared corpus
(`NEXUS-REV-0082-CRIT-002`). Four Major and three Minor findings also remain open. Remediation is additive and falls
entirely within the existing authorized inventory; no further scope ratification is required. Superseded by
`BT-082-002` through `BT-082-012` and `DOC-082-001`. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-08-06-001`.
Both Critical findings against it are now resolved (`NEXUS-REV-2026-08-07-001`, `NEXUS-REV-2026-08-07-002`) and
Sprint 82 is Approved with Findings; this task nonetheless remains FAILED as a historical record and SHALL NOT be
reimplemented as a whole.

**Authority:** `NEXUS-RAT-2026-08-06-002` (activation; permanent authorization authority);
`NEXUS-RAT-2026-08-06-001` (scope). Operative Sprint Specification:
`knowledge/implementation/sprints/sprint-0082-ratification-authority-snapshot-issuance.md`.

**Delivered:** All twenty-four authorized files — four implementation files under `src/kernel/governance/`,
thirteen test files under `test/kernel/governance/`, and seven conformance-oracle files under
`test/kernel/governance/issuance-oracle/`. No file outside the inventory was created or modified. Repository
validation clean at review time: compile, lint, build, extension-host build, 26/26 targeted tests, 809/809 full
non-extension suite. Live-Ledger conformance checkpoint independently reproduced by the Reviewer.

---

# Resolved Builder Tasks (carried forward for traceability)

## BT-082-005 — Add cycle-selection and `closed`-marking coverage for both graphs (T11)

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-08-07-003` (2026-08-07). Resolves `NEXUS-REV-0082-MAJ-002`
(Implementation Defect, Major) — T11's cycle-selection obligations for both governed graphs.

**Authority:** Sprint 82 Sprint Implementation Record § Acceptance Criteria T11; RFC-0011 Final (Amended) v1.8
§ Two Distinct Graphs, § Cycle Selection. Execution authority: existing `NEXUS-RAT-2026-08-06-002` — no new
Ratification and no new Ledger entry was created.

**Delivered:** `test/kernel/governance/ratification-authority-snapshot-issuance-graphs.test.ts` grew from one
`it()` to five (195 lines), adding a declarant-authority cycle, a lifecycle-relation cycle, a `closed`-marking
case, and a `self-referential-relation` case alongside the pre-existing `absent-relation-target` case. Both
governed graphs are exercised independently, satisfying RFC-0011 line 888 ("Guarding the first proves nothing about
the second"). Each of the two cycle fixtures contains two distinct cycles, so the assertions discriminate the
normatively selected path from any merely valid one.

**Reviewer certification:** The Reviewer derived all three expected cycle paths independently from RFC-0011
§ Cycle Selection — root ascending-octet order, outgoing-edge order, and the stack-slice reconstruction rule — and
confirmed each matches: `[-510, -511, -510]`, `[-521, -522, -521]`, and `[-533, -534, -533]`. Phase precedence was
checked to confirm each fixture reaches the code it claims. Validation reproduced clean: compile, lint, build, and
extension-host build; targeted Sprint 82 suite 32/32 across 15/15 files; full non-extension suite 815/815 across
134/134 files with zero regressions. The Builder's four reported git-boundary timeout failures did not reproduce
and are confirmed environmental flake. Exactly one file's modification time moved; no `src/` file was touched and
no path outside the twenty-four-file inventory was created or modified.

**Follow-up raised, not a reopening:** `NEXUS-REV-0082-MIN-005` (Minor) records that the fixtures do not
discriminate the DFS's `closed` branch or its root ordering. Per the Reviewer's recorded disposition it is
generated as `BT-082-012`, its own task. **`BT-082-005` SHALL NOT be reopened or reimplemented.**

---

## BT-082-003 — Extend oracle agreement to the declared agreement corpus

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-08-07-002` (2026-08-07). Resolves
`NEXUS-REV-0082-CRIT-002` (Architectural Violation, Critical) — the RFC-0011 complete-result agreement obligation.
**Its completion is what lifted Sprint 82's last Critical finding and moved the Sprint to Approved with Findings.**

**Authority:** RFC-0011 Final (Amended) v1.8 § Two Structurally Independent Implementations (lines 1355–1357, "the
complete public result, field for field"); Sprint 82 Sprint Implementation Record § Agreement corpus, § Acceptance
Criteria T21, § Completion Requirements item 1. Execution authority: existing `NEXUS-RAT-2026-08-06-002` — no new
Ratification and no new Ledger entry was created.

**Original defect:** `oracle-agreement.test.ts` ran exactly one test case over a single trivially-`Active` fixture,
against a declared corpus of the live Ledger plus every T1–T20 fixture plus every vocabulary code. No `Rejected`
result was ever compared, so the Sprint's headline evidence — the live checkpoint result — was never
cross-validated against the oracle.

**Delivered:** Two authorized files. `test/kernel/governance/issuance-oracle/issuance.oracle.ts` (144 → 1389 lines)
was rebuilt from a shallow single-entry stub — one hardcoded `GenericSourceRule`/`ResidualScope` record, no
declaration parsing, no graph work, 5 of 46 codes reachable — into a full second implementation: fence-aware entry
extraction, section parsing, the generic source rule, declaration-block parsing for both lifecycle forms,
declarant-authority and lifecycle-relation graph validation with cycle detection, envelope and commitment
validation, and the total `Issued`/`Rejected` result contract.
`test/kernel/governance/issuance-oracle/oracle-agreement.test.ts` (31 → 295 lines) was rebuilt from one `Issued`
fixture into approximately fifty cases spanning the live Ratification Ledger, four `Issued`-path fixtures, and
forty-six `Rejected`-path fixtures — one per closed-vocabulary code — with a mechanically enforced completeness
assertion (`expect(reachedCodes).toEqual(new Set(oracleDiagnosticCodes))`) that fails if any code goes unreached.

**Reviewer verification:** Independence was specifically re-examined, since the two implementations arrived at
near-identical size (1387 vs. 1389 lines; 42 vs. 41 top-level functions) with twelve identically named functions —
a signal strong enough to warrant body-level comparison. The decompositions diverge: thirty function names appear
only in `src/`, twenty-nine only in the oracle, and the shared names are almost entirely the six payload
constructors named after the RFC's own `payloadKind` discriminants. `parseDeclarationBlock` is structurally
different in the two files. `oracle-independence.test.ts` passes unchanged. **No violation of the authoring rule
was found.** Validation reproduced clean: targeted Sprint 82 suite 28/28 across 15/15 files (up from 26/26); full
non-extension suite 811/811 across 134/134 files (unchanged, zero regressions); compile, lint, build, and
extension-host build all clean. Stop Condition 10 compliance confirmed by file-modification-time comparison and
directory listing — only the two authorized files changed, and the oracle directory still holds exactly seven
files. The live-Ledger conformance checkpoint is now independently cross-validated against the oracle for the first
time and reproduces exactly: `Rejected` · `identifier-grammar-violation` · `EntryStructure` · precedence `1` ·
payload `{"payloadKind":"EntryPayload","ratificationIdentifier":"NEXUS-RAT-2026-08-04-001"}`.

**Findings raised against the delivered work:** `NEXUS-REV-0082-MAJ-004` (corpus not fixture-complete against the
T1–T20 corpus definition; all omitted cases independently probed and found non-disagreeing) and
`NEXUS-REV-0082-MIN-004` (`toEqual` rather than `toStrictEqual`). Both are translated as `BT-082-010` and
`BT-082-011` above. Neither reopens this task.

**Prospective obligation:** This deliverable SHALL remain passing. The corpus coverage and the `reachedCodes`
completeness assertion SHALL NOT be weakened, relaxed, or removed by any subsequent task.

---

## BT-082-004 — Make every closed-vocabulary diagnostic code reachable by test (T18)

**Status:** RETIRED — finding resolved without direct implementation. `NEXUS-REV-0082-MAJ-001` was resolved by
`NEXUS-REV-2026-08-07-002` (2026-08-07) as a collateral effect of `BT-082-003`. **Per the Reviewer's recorded
disposition this task is retired, not regenerated, and SHALL NOT be implemented.**

**Authority:** Sprint 82 Sprint Implementation Record § Acceptance Criteria T18; `IMPLEMENTATION_GATE.md` Gate 11.
Governing RFC: RFC-0011 Final (Amended) v1.8 § The Total Result Contract.

**References:** `NEXUS-REV-2026-08-06-001`, Finding `NEXUS-REV-0082-MAJ-001`; resolved by
`NEXUS-REV-2026-08-07-002`.

**Original defect:** Only 11 of the 46 codes in the closed public vocabulary were asserted by any test. The T18 test
asserted vocabulary *cardinality* and single-code membership rather than reachability.

**How it was resolved:** `BT-082-003`'s rebuilt agreement corpus includes one `Rejected`-path fixture per
closed-vocabulary code and asserts `expect(reachedCodes).toEqual(new Set(oracleDiagnosticCodes))`, which
mechanically forces the implementation side to emit **all 46 codes** across the corpus or fail. Vocabulary coverage
moved from 11 of 46 to 46 of 46, independently confirmed by the Reviewer re-running the suite.
`identifier-grammar-violation` — the code the live checkpoint returns, and the specific gap this finding
called out — is now covered both by its own corpus case and by the live-Ledger case.

---

## BT-082-002 — Cross-check both encoders against RFC-0003's normative Conformance Vectors

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-08-07-001` (2026-08-07). Resolves
`NEXUS-REV-0082-CRIT-001` (Architectural Violation, Critical) — the RFC-0011 prior-vector rule.

**Authority:** RFC-0011 Final (Amended) v1.8 § Two Structurally Independent Implementations (lines 1355–1357);
RFC-0003 § Conformance Vectors (normative), lines 295–297; Sprint 82 Sprint Implementation Record § The Second
Structurally Independent Implementation (prior-vector rule), § Acceptance Criteria T21, § Stop Conditions 9.
Execution authority: existing `NEXUS-RAT-2026-08-06-002` — no new Ratification and no new Ledger entry was created.

**Original defect:** The vector test cross-checked the two encoders only against a self-constructed two-field record
and a manually derived hex literal, using none of RFC-0003's published normative vectors. Stop Condition 9 was met
on its face.

**Delivered:** `test/kernel/governance/nccs1-conformance-vectors.test.ts` — the single authorized file — rewritten
to assert RFC-0003 Positive Vector 4 (Unicode NFC equivalence, `353a436166c3a9`), Positive Vector 5 (line-ending
equivalence, `31313a6c696e65310a6c696e6532`), and Positive Vector 6 (order-insensitive collection ordering, 73
bytes), each independently against both `encodeNccsString`/`encodeNccsOrderInsensitiveStrings` and the structurally
independent `oracleString`/`oracleOrderInsensitiveStrings` — 6 logical encoder/vector checks, 12 input-form
assertions, 3 `it()` cases. The prior implementation-vs-oracle record cross-check was removed; the file contains no
agreement assertion. Negative Vector N1 is correctly not exercised — the string-only encoder surfaces cannot receive
invalid UTF-8 octets.

**Reviewer verification:** All three vectors independently hand-reconstructed against the NCCS-1 encoding rules and
confirmed correct; targeted suite re-executed at 3/3 cases; full non-extension suite 811/811 across 134/134 files
(up from the 809/809 baseline, zero regressions); compile, lint, build, and extension-host build all clean.
Stop Condition 10 compliance confirmed by file-modification-time comparison — only the one authorized file changed;
`oracle-agreement.test.ts` and the other 22 inventory paths are untouched.

**Prospective obligation:** This deliverable SHALL remain passing. Stop Condition 9 continues to bind — agreement
SHALL NOT be reported on any basis that circumvents these vector checks.

---

## DOC-081-002 — Reconcile Sprint 81 Validation Summary and Implementation Deviations after `BT-081-002`

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-005` (PASS).

**Summary:** `IMPLEMENTATION_REPORT.md` Sprint 81 § Validation Summary and § Deviations, and the Sprint 81 Sprint
Implementation Record's § Validation Summary and § Implementation Deviations, now state the current counts
(24/24 targeted tests across 8/8 files; 783/783 full non-extension suite across 119/119 files) and record
`BT-081-002`'s corrective change (removal of `.trim()` from the three named closed-vocabulary parsers, plus
three new regression tests). No source or test file was touched.

**Reference:** Generated from `NEXUS-REV-2026-07-22-004`, Finding `NEXUS-REV-0081-DOC-001`; resolution verified
by `NEXUS-REV-2026-07-22-005`.

## BT-081-002 — Remove non-canonical whitespace acceptance in Sprint 81 closed-vocabulary parsers

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-004` (PASS WITH FINDINGS).

**Summary:** `CorpusReviewPurpose.fromString`, `CorpusArtifactKind.fromString`, and `CorpusReviewOpeningAttribution`'s
`normalizeOriginType` no longer call `.trim()` before comparing against their closed vocabularies; each now
compares raw input directly, mirroring the `BT-079-002` precedent. Regression tests added to
`test/kernel/corpus-review/corpus-review-purpose.test.ts`, `corpus-artifact-kind.test.ts`, and
`corpus-review-opening-attribution.test.ts` assert rejection of every vocabulary value with leading, trailing, and
both-sides whitespace padding. Targeted Sprint 81 suite: 24/24 across 8/8 files. Full non-extension suite: 783/783
across 119/119 files. No other file in the sixteen-file Sprint 81 inventory changed.

**Reference:** Generated from `NEXUS-REV-2026-07-22-003`, Finding `NEXUS-REV-0081-DEF-001`; resolution verified
by `NEXUS-REV-2026-07-22-004`.

## BT-081-001 — Implement Sprint 81 (Milestone 12 Step 3, Narrowed, Final — Corpus Review Structural Foundation)

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-003` (PASS WITH FINDINGS; one Major Implementation
Defect, `NEXUS-REV-0081-DEF-001`, closed via `BT-081-002` above and does not reopen this task).

**Summary:** Implemented exactly the structural value objects, construction contracts, and Canonical Fingerprint
Protocol described in the Sprint 81 Sprint Implementation Record's § Implementation Scope and § Acceptance
Criteria, within its sixteen-file inventory (eight new source files under `src/kernel/corpus-review/`, eight
mirrored new test files under `test/kernel/corpus-review/`). Independently verified conformant: all fifteen
explicit Sprint 81 prohibitions hold, zero changes to any Sprint 78/79/80 frozen file or
`src/kernel/shared-reality/`, zero Kernel composition/host/barrel changes, clean compile/lint/build.

**Reference:** `NEXUS-RAT-2026-07-22-001`; `NEXUS-RAT-2026-07-22-002`; Sprint 81 Sprint Implementation Record;
`NEXUS-REV-2026-07-22-003`.

## BT-080-002 — Cross-validate `NotApplicable.applicability` in `AssessmentCoverage.recordDisposition()`

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-002` (PASS).

**Summary:** `AssessmentCoverage`'s private `validateDisposition` method now derives the pair's actual criterion
applicability and rejects a `NotApplicable` disposition whose `applicability` field does not canonicalize (via
`canonicalizeAssessmentCriterionApplicability`) to the same bytes, throwing `InvalidReviewDefinitionError` on
mismatch. A regression test in `test/kernel/review/assessment-coverage.test.ts` asserts both rejection of a
substituted `applicability` and acceptance of the correct one.

**Reference:** Generated from `NEXUS-REV-2026-07-22-001`, Finding `NEXUS-REV-0080-DEF-001`; resolution verified
by `NEXUS-REV-2026-07-22-002`.

## BT-080-003 — Add `AnyExactContent` classification test coverage

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-002` (PASS).

**Summary:** `test/kernel/review/evaluate-coverage-pair.test.ts` now declares an `'any-exact'` criterion using
`requiredExactContent('AnyExactContent')` and asserts `Satisfied` against both `qualifiedSnapshotContent()` and
`qualifiedDerivedContent()` evidence, and `FindingRequired` against `notExactContent()` evidence — covering all
three `RequiredExactContent` classification values.

**Reference:** Generated from `NEXUS-REV-2026-07-22-001`, Finding `NEXUS-REV-0080-TST-001`; resolution verified
by `NEXUS-REV-2026-07-22-002`.

## BT-080-004 — Add multi-`RequiredEvidenceType` clause test coverage

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-22-002` (PASS).

**Summary:** `test/kernel/review/evaluate-coverage-pair.test.ts` now declares a `'multi-type'` criterion with two
distinct `RequiredEvidenceType` clauses and asserts `Satisfied` against a baseline of two evidence items, each
independently satisfying exactly one clause.

**Reference:** Generated from `NEXUS-REV-2026-07-22-001`, Finding `NEXUS-REV-0080-TST-002`; resolution verified
by `NEXUS-REV-2026-07-22-002`.

## BT-080-001 — Implement Sprint 80 (Milestone 12 Step 2A — RFC-0006 v1.3 Structural Foundation)

**Status:** RESOLVED. Reviewed by `NEXUS-REV-2026-07-22-001` (PASS WITH FINDINGS) and
`NEXUS-REV-2026-07-22-002` (PASS; zero remaining findings).

**Summary:** Implemented the pure structural types, deterministic canonicalization, immutable value models, pure
Coverage operations, and pure evaluation result described in
`knowledge/implementation/sprints/sprint-0080-step-2a-rfc-0006-structural-foundation.md`, within its sixteen-file
inventory. Independently verified conformant: zero protected-file changes, zero new-symbol imports outside
`src/kernel/review/`, zero barrel/host-wiring changes, clean compile/lint/build, 28/28 targeted tests, 759/759
full non-extension suite. All three findings closed by `BT-080-002`–`BT-080-004` above.

**Reference:** `NEXUS-RAT-2026-07-21-007`; Sprint 80 Implementation Record; `NEXUS-REV-2026-07-22-001`;
`NEXUS-REV-2026-07-22-002`.

## BT-079-002 — Remove non-canonical whitespace acceptance in vocabulary `fromString`

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-21-002` (PASS).

**Summary:** `ConfidenceClassification.fromString` and `EvidenceVerificationStatus.fromString` called `value.trim()` before comparing against the closed vocabulary, silently accepting whitespace-padded but correctly-spelled input (e.g. `' Verified '`) as equal to the canonical value, contrary to RFC-0002 v1.3's byte-stable canonical-encoding requirement. Fixed by removing the normalization step; both factories now compare the raw input directly. Regression tests added to `test/kernel/evidence/confidence-classification.test.ts` and `test/kernel/evidence/evidence-verification-status.test.ts` asserting rejection of every vocabulary value with leading, trailing, and both-sides whitespace padding.

**Reference:** Generated from `NEXUS-REV-2026-07-21-001`, Finding `NEXUS-REV-0079-DEF-001`; resolution verified by `NEXUS-REV-2026-07-21-002`.

## DOC-079-001 — Record the undisclosed `evidence.errors.ts` forecast deviation

**Status:** COMPLETED. Verified by `NEXUS-REV-2026-07-21-002` (PASS).

**Summary:** The Sprint 79 Sprint Implementation Record's § Forecasted Source Files stated `evidence.errors.ts` would gain new exception types; the implementation reused the existing `InvalidEvidenceException` instead, undisclosed. Fixed by adding the deviation statement to the Sprint 79 record's § Implementation Deviations and to `IMPLEMENTATION_REPORT.md` Sprint 79 § Deviations.

**Reference:** Generated from `NEXUS-REV-2026-07-21-001`, Finding `NEXUS-REV-0079-DOC-001`; resolution verified by `NEXUS-REV-2026-07-21-002`.

## BT-079-001 — Implement Sprint 79 (Corrective Prerequisite 1A — RFC-0002 v1.3 Evidence Confidence and Verification Status Integration)

**Status:** RESOLVED. Implemented and reviewed; see `REVIEW_HISTORY.md` (`NEXUS-REV-2026-07-21-001`, `PASS_WITH_FINDINGS`) and the Sprint 79 Sprint Implementation Record's Reviewer Notes / Final Disposition. Both corrective findings closed by `BT-079-002`/`DOC-079-001` above, verified `NEXUS-REV-2026-07-21-002` (PASS).

## BT-078-001 — Implement Sprint 78 (RFC-0002 v1.2 Exact Content Evidence Implementation)

**Status:** RESOLVED. See `REVIEW_HISTORY.md` (`NEXUS-REV-2026-07-19-001`) for the complete resolved history through Sprint 78.
