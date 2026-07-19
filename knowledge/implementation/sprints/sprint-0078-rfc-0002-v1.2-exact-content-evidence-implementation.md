# Sprint 78 — RFC-0002 v1.2 Exact Content Evidence Implementation

## Status

✅ Approved with Findings — Closed by `NEXUS-REV-2026-07-19-001` (`PASS_WITH_FINDINGS`). Activated by `NEXUS-RAT-2026-07-19-009`. Milestone 12 — Corpus Review and Implementation Readiness, Initial Capability Sequence Step 1 of 6, established by `NEXUS-RAT-2026-07-19-006`. Depends on `NEXUS-RAT-2026-07-19-007` (version-aware Evidence repository/service contract, Active) and `NEXUS-RAT-2026-07-19-008` (RFC-0002 v1.2, `ExactOctetStream`/`"1"` canonicalization profile, Active), both satisfied prior to activation.

**Authority note.** This governed Sprint Implementation Record is the durable and authoritative delivery contract for Sprint 78, per `NEXUS-RAT-2026-07-19-009`. The drafting artifact at `.claude/scratchpad/sprint-78-ratification-package.md` is provenance only and is not required for implementation, review, or closure.

## Objective

Implement Milestone 12 Initial Capability Sequence Step 1 only:

- RFC-0002 v1.2 Exact Content Evidence, under the `ExactOctetStream`/`"1"` canonicalization profile;
- the version-aware Evidence repository and service contract from `NEXUS-RAT-2026-07-19-007`;
- the `ExactOctetStream`/`"1"` canonicalization profile from `NEXUS-RAT-2026-07-19-008`;
- a production `InMemoryExactContentResolver`, delivered as Evidence-domain code;
- stateless, recursive Resolution Verification with no hidden state on `Evidence`.

No RFC-0013 concept is implemented. No Initial Capability Sequence Step 2–6 work begins.

## RFC Coverage

- RFC-0002 v1.2 — Evidence Model, § Exact Content Evidence, including the Canonicalization Profile Registry and `ExactOctetStream`/`"1"` (Primary)
- RFC-0001, RFC-0005 (Referenced; read-only, unmodified)

## Ratification References

- `NEXUS-RAT-2026-07-19-006` — establishes this Sprint as Step 1, binds compatibility gates.
- `NEXUS-RAT-2026-07-19-007` — version-aware repository and service contract. Blocking prerequisite, Active.
- `NEXUS-RAT-2026-07-19-008` — RFC-0002 v1.2, `ExactOctetStream`/`"1"` profile. Blocking prerequisite, Active.
- `NEXUS-RAT-2026-07-19-009` — this Sprint's own activation ratification.

## § EvidenceType Preservation

Unchanged: the frozen `EvidenceType` enum (`evidence-type.ts`) is untouched by this Sprint or by either prerequisite ratification. `evidenceTypeIdentity`/`evidenceTypeVersion` live only on `representedContentReference`.

## Exact Represented-Content Pipeline

```text
exact six-field representedContentReference
(contentOwner, contentType, contentId, contentRevision,
 evidenceTypeIdentity, evidenceTypeVersion)

→ ExactContentResolver.resolve(requestedReference)

→ ResolvedSourceRepresentation {
    sourceOctets: Uint8Array,
    echoedReference: exact complete six-field reference
  }

→ compare all six echoed fields with the requested reference
  (any single-field mismatch is a substitution failure — fail closed)

→ select canonicalizer by exact
  (evidenceTypeIdentity, evidenceTypeVersion)
  (fail closed if unregistered)

→ ExactOctetStream/"1" identity canonicalizer:
  canonicalBytes = sourceOctets, without transformation

→ SHA-256(canonicalBytes) → computedDigest

→ compare computedDigest with declared contentDigest
  (fail closed on mismatch — only here is a digest ever "matching")
```

`ResolvedSourceRepresentation` is never treated as canonical prior to the canonicalizer running.

## Content-Representation Source Cardinality

**SnapshotContent** carries **no** derivation-source references. It resolves its own exact six-field `representedContentReference` and verifies its own resolver-returned octets directly through the canonicalizer and digest pipeline above — there is no source-reference concept for SnapshotContent at all.

**DerivedContent in Sprint 78:**
- Carries exactly one immutable source Evidence reference.
- That source identifies an exact `EvidenceId` and exact `EvidenceVersion`.
- Zero sources fail closed (a DerivedContent instance with no source is invalid, not merely unusual).
- Two or more sources fail closed with the explicit deferred multi-source-contract diagnostic.
- A duplicate source reference (relevant only once cardinality could exceed one) fails closed.
- The single source is resolved by exact identity and version via `getByIdAndVersion`.
- Recursive verification of the DerivedContent chain terminates in independently Resolution-Verified `SnapshotContent`.
- A cycle in the chain fails closed.

RFC-0002's broader multi-source contract is **not redefined** by this Sprint. Sprint 78 implements only the deterministic single-source subset that RFC-0002 v1.2 already fully specifies without ambiguity. Multi-source combination and ordering semantics require a future, separate RFC-0002 amendment before any implementation — this is an exclusion from this Sprint's scope, unavailable until separately ratified, not something declared permanently impossible.

## Construction Validation (synchronous, format/structure-only, no I/O)

Validates:

- all six `representedContentReference` fields are present and non-empty;
- immutable `SnapshotContent | DerivedContent` classification, always explicit, never inferred;
- `contentDigestAlgorithm` exactly identifies `SHA-256`;
- `contentDigest` is exactly 64 lowercase hexadecimal characters;
- `SnapshotContent` carries no source references (construction fails closed if one is supplied);
- `DerivedContent` carries exactly one source reference in this Sprint;
- a duplicate-source input fails closed;
- zero or multiple `DerivedContent` sources fail closed with distinct, deterministic diagnostics for each case (a "zero sources" diagnostic is not conflated with the "deferred multi-source contract" diagnostic).

Construction Validation makes no digest-equality or content-truth claim of any kind — it validates shape and format only, never resolves content, never computes a digest from bytes.

## Version-Aware Repository and Service

Implements `NEXUS-RAT-2026-07-19-007` exactly: exact-pair storage; exact-pair duplicate rejection with a corrected identity+version diagnostic; distinct-version acceptance under an existing identity; `getByIdAndVersion` (three-way behavior exactly as ratified); identity-wide `exists` (unchanged); exact-pair, non-throwing `existsByIdAndVersion`; ambiguity-on-multiple-version `getById`; first-registration identity ordering and ascending-numeric-version ordering in `enumerate()`; corrected `validateEvidence` (exact-pair check, not identity-only); additive `retrieveEvidenceVersion`; `EvidenceVersionNotFoundException` and `AmbiguousEvidenceVersionException`, both newly defined and exported. No Builder-invented deviation from that contract is authorized.

## Production `InMemoryExactContentResolver`

Delivered as production Evidence-domain code, with:

- explicit six-field-reference-to-octets registration (`register(reference, octets)`);
- exact lookup only — no partial, fuzzy, or prefix matching on any field;
- duplicate exact binding rejection (a second registration for an already-bound exact six-field reference fails closed);
- defensive copy on both registration (of the input octets) and resolution (of the returned octets) — mutating either side cannot corrupt the other;
- deterministic missing-binding failure on lookup;
- no filesystem access, no Git access, no Adapter invocation, no Host interaction, no repository parsing, and no implicit artifact-acquisition behavior of any kind.

External content acquisition (filesystem, Git, or otherwise) and resolver population from real sources remain entirely outside this Sprint — something outside Sprint 78 is responsible for calling `register()` with real bytes it acquired elsewhere.

## Stateless, Recursive Resolution Verification

`ExactContentVerificationService.verify(evidence): Promise<VerificationResult>`:

- returns a new, immutable `VerificationResult` for every invocation;
- stores no verification state on `Evidence` — the aggregate gains no new mutable field of any kind;
- repeats resolution, all-six-field comparison, canonicalization, digest computation, and digest comparison on every call, with no caching or memoization;
- for DerivedContent, recursively repeats full verification of the exact single source on every call;
- detects cycles using invocation-local traversal state (a fresh visited-set per `verify()` call, never a shared or persisted structure);
- caches or stores no "authoritative," "current," "active," "applicable," or "verified" flag on the aggregate, under any circumstance.

## Current Applicability Boundary

Resolution Verification establishes only: exact identity resolution, canonical-byte correctness, digest equality, and derivation-graph integrity, for a specific, exact snapshot. It never establishes, computes, or implies Projection applicability, active Evidence status, authority, acceptance, readiness, or governance approval of any kind. A future consumer requiring any of those SHALL supply its own explicit, read-only, externally-owned decision from whatever authority owns that determination; this Sprint defines no such mechanism.

## EvidenceHash Separation

`EvidenceHash` and `contentDigest` remain entirely separate fields with entirely separate semantics. No existing `EvidenceHash` field, value, or behavior is reinterpreted, migrated, derived from, or treated as satisfying RFC-0002's exact-content digest requirement, anywhere in this Sprint's implementation.

## Implemented Concepts

1. RFC-0002 v1.2 Exact Content Evidence (six-field `representedContentReference`, `ContentDigest`, `SnapshotContent`/`DerivedContent` classification).
2. The `ExactOctetStream`/`"1"` canonicalization profile (zero-transformation identity function).
3. The resolver → canonicalizer → digest verification pipeline, with fail-closed six-field substitution detection.
4. The version-aware Evidence repository and service contract (`NEXUS-RAT-2026-07-19-007`).
5. The production `InMemoryExactContentResolver`.
6. Stateless, recursive Resolution Verification with invocation-local cycle detection.
7. Single-source DerivedContent, with zero/multi-source cases failing closed under distinct diagnostics.

## Deferred Concepts

- Multi-source DerivedContent combination and ordering semantics (requires a future, separate RFC-0002 amendment).
- Any canonicalization profile beyond `ExactOctetStream`/`"1"`.
- Current/active/authoritative Evidence applicability of any kind.
- Any RFC-0013 concept.
- Milestone 12 Initial Capability Sequence Steps 2–6.
- `CorpusReviewContextProfile` (Reproducible Context Integration).
- The Corpus Readiness Acceptance Repository Policy.
- External content acquisition (filesystem, Git, or otherwise) and resolver population from real sources.

## Forecasted Implementation Surface

**New production files (`src/kernel/evidence/`) — exactly seven:**
1. `exact-content-reference.ts` — six-field `RepresentedContentReference` value object.
2. `content-digest.ts` — `ContentDigestAlgorithm`/`ContentDigest` value object(s).
3. `exact-content-evidence.ts` — the additive block type; `SnapshotContent` (no sources) / `DerivedContent` (exactly one source in this Sprint) classification and structure.
4. `exact-content-resolver.ts` — `ExactContentResolver` contract, `ResolvedSourceRepresentation` type.
5. `in-memory-exact-content-resolver.ts` — the production `InMemoryExactContentResolver`.
6. `exact-content-canonicalizer-registry.ts` — the `ExactOctetStream`/`"1"` identity-function canonicalizer, per `NEXUS-RAT-2026-07-19-008`; no other entry.
7. `exact-content-verification.service.ts` — the stateless, recursive verification pipeline; returns immutable `VerificationResult`.

**Modified production files (`src/kernel/evidence/`) — five:**
- `evidence.aggregate.ts` (currently 167 lines) — optional Exact Content Evidence block on `CreateEvidenceInput`/`RegisterEvidenceRequest`/`EvidenceSnapshot`/`Evidence`; `hasExactContent()` predicate; the aggregate's snapshot/rehydration contract (`toSnapshot()`/`fromSnapshot()`) SHALL preserve the complete optional Exact Content Evidence block — every field, including the full `representedContentReference` six-tuple, `contentDigestAlgorithm`/`contentDigest`, classification, and (for DerivedContent) the single source reference — with no field discarded or reconstructed approximately across a round trip. No verification-state field of any kind.
- `evidence.contract.ts` (currently 26 lines) — exports every new public type, service, resolver, registry, and exception introduced by this Sprint and by `NEXUS-RAT-2026-07-19-007`.
- `evidence.errors.ts` (currently 36 lines) — per `NEXUS-RAT-2026-07-19-007` (`EvidenceVersionNotFoundException`, `AmbiguousEvidenceVersionException`, corrected `DuplicateEvidenceException`), plus new diagnostics for: digest mismatch, unsupported canonicalizer identity/version, missing/duplicate resolver binding, six-field substitution mismatch, zero-source DerivedContent, multi-source (deferred-contract) DerivedContent, duplicate source, cycle detected, unverified-source termination.
- `evidence.repository.ts` (currently 60 lines) — per `NEXUS-RAT-2026-07-19-007`.
- `evidence.service.ts` (currently 83 lines) — per `NEXUS-RAT-2026-07-19-007` (corrected `validateEvidence`, additive `retrieveEvidenceVersion`).

**New/modified test files (`test/kernel/evidence/`):** focused tests for the aggregate (including snapshot/rehydration round trip of the full Exact Content Evidence block), the repository, the service, the resolver, the canonicalizer registry, the verification service, the errors module, and the contract's exports — covering every item in Objective Tests, below.

**After completion**, governance/delivery changes are limited to applicable updates to `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, this Sprint Implementation Record, and `builder-task.md`. No other domain is authorized under any circumstance.

## Objective Tests (minimum required)

1. All Sprint 5 tests pass unmodified.
2. Legacy Evidence remains distinguishable and has no exact-content block (`hasExactContent() === false`).
3. `SnapshotContent` accepts no derivation sources; supplying one fails closed at construction.
4. `DerivedContent` rejects zero sources.
5. `DerivedContent` accepts exactly one source.
6. `DerivedContent` rejects a duplicate source reference.
7. `DerivedContent` rejects two or more sources with the deferred multi-source-contract diagnostic, distinct from the zero-source diagnostic.
8. Successful SHA-256 verification under `ExactOctetStream`/`"1"`.
9. A syntactically valid but incorrect digest is rejected at Resolution Verification.
10. A non-`SHA-256` algorithm is rejected at Construction Validation.
11. A digest of the wrong length is rejected at Construction Validation.
12. An uppercase or non-hex digest is rejected at Construction Validation.
13. An unsupported profile identity is rejected at Resolution Verification.
14. An unsupported profile version (for a supported identity) is rejected at Resolution Verification, distinctly from an unsupported identity.
15. One substitution test for each of the six reference fields (`contentOwner`, `contentType`, `contentId`, `contentRevision`, `evidenceTypeIdentity`, `evidenceTypeVersion`) — a resolver echo differing in exactly that field fails closed.
16. CRLF and LF octet sequences produce different digests.
17. NFC and NFD byte sequences produce different digests.
18. Invalid-UTF-8 octets are hashed unchanged, with no rejection on validity grounds.
19. An empty (zero-length) octet sequence hashes successfully when the reference and resolution are otherwise valid.
20. The resolver performs exact lookup only — a near-miss reference fails closed, never a fuzzy match.
21. The resolver rejects a duplicate exact binding.
22. The resolver exhibits defensive-copy behavior on both registration input and resolution output.
23. The resolver fails closed deterministically on a missing binding.
24. DerivedContent source resolution retrieves the exact requested `EvidenceVersion`, never "latest."
25. A missing source identity and a missing source version produce distinct, distinguishable failures.
26. Transitive cycle detection (fixture: A's sole source is B, B's sole source is A).
27. A recursive DerivedContent chain terminates successfully only in independently Resolution-Verified `SnapshotContent`.
28. The repository rejects an exact `(EvidenceId, EvidenceVersion)` duplicate.
29. The repository accepts a distinct version under an existing identity.
30. `exists` remains identity-wide (true if any version exists, regardless of count).
31. `existsByIdAndVersion` is exact and never throws.
32. `getByIdAndVersion` covers missing identity (`undefined`), missing version (`EvidenceVersionNotFoundException`), and exact hit.
33. `getById` covers zero versions (`undefined`), one version (unchanged value), and multiple versions (`AmbiguousEvidenceVersionException`).
34. Enumeration preserves identity first-registration order.
35. Versions within an identity enumerate in ascending numeric order.
36. Single-version-per-identity enumeration matches Sprint 5 behavior exactly, in content and order.
37. An exact duplicate is rejected through `EvidenceService.registerEvidence`.
38. A distinct version is accepted through `EvidenceService.registerEvidence`.
39. `validateEvidence` rejects only an exact pair, not a distinct version under an existing identity.
40. `retrieveEvidenceVersion` covers missing identity, missing version, and exact hit, per the specified translation rules.
41. Snapshot/rehydration (`toSnapshot()`/`fromSnapshot()`) and repository round trip preserve every Exact Content Evidence field with no loss or reconstruction approximation.
42. `EvidenceHash` and `contentDigest` remain independent — both persist, retrieve, and verify independently, with no code path comparing or substituting one for the other.
43. Legacy Evidence (no Exact Content Evidence block) fails closed, with a distinct diagnostic, when a test-only stub consumer requires Exact Content Evidence.
44. Two successive `verify()` calls on the same `Evidence` each independently repeat full resolution, canonicalization, and digest computation (proven via resolver/canonicalizer call-count assertions).
45. `Evidence` exposes no verification-status, current-status, applicability, or authoritative-state field or method of any kind.
46. `evidence.contract.ts` exports every required public type, service, resolver, registry, and exception introduced by this Sprint and by `NEXUS-RAT-2026-07-19-007`.

## Builder Responsibilities / Builder Stop Conditions

1. Both prerequisite ratifications (`NEXUS-RAT-2026-07-19-007`, `NEXUS-RAT-2026-07-19-008`) are Active — implementation may proceed.
2. This Sprint Implementation Record and `NEXUS-RAT-2026-07-19-009` together constitute this Sprint's own Sprint-scope ratification and activation.
3. No work outside `src/kernel/evidence/` and its Evidence test paths, and the named governance artifacts, is authorized under any circumstance.
4. `InMemoryExactContentResolver` SHALL perform no filesystem, Git, Adapter, Host, or repository-parsing access of any kind.
5. `ExactOctetStream`/`"1"` SHALL perform zero transformation of any kind — if any transformation appears necessary, that is a Stop Condition, not a permitted adjustment.
6. No change to the frozen `EvidenceType` enum, under any circumstance.
7. No multi-source `DerivedContent` implementation of any cardinality beyond exactly one.
8. Stop on any ambiguity or contradiction encountered in RFC-0002 v1.2, `NEXUS-RAT-2026-07-19-007`, or `NEXUS-RAT-2026-07-19-008` during implementation — report rather than resolve unilaterally.
9. Stop if satisfying any Exact Content Evidence requirement would require destructive reinterpretation of any existing Evidence field (`EvidenceHash`, `EvidenceType`, `EvidenceMetadata`, `Provenance`, or any Sprint 5 snapshot field).
10. Stop if implementation would store verification, applicability, currentness, authority, acceptance, or readiness state on `Evidence`, in any form, under any circumstance.

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` Sprint 78 section documenting the full validation matrix (`tsc`, lint, Vitest, build) and Acceptance Evidence below.
- Synchronization of `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` Sprint 78 status upon completion.

## Known Limitations

- Multi-source DerivedContent, current/active applicability, and Steps 2–6 remain unimplemented by design; see Deferred Concepts.
- Resolver population from real external sources (filesystem/Git) is out of scope; only in-memory, test/harness-registered content is available under this Sprint.

## Acceptance Evidence Required for Reviewer PASS / Approved

- Clean TypeScript compilation (`tsc --noEmit`), clean lint, a complete passing Vitest suite, and a clean build (`esbuild` plus extension-host test bundle).
- A strictly additive test-count delta from the established baseline (Sprint 77: 684/684 across 96 files).
- The exact changed-file list matches the Forecasted Implementation Surface above, with any deviation explicitly reported and justified.
- Proof both prerequisite contracts (`NEXUS-RAT-2026-07-19-007`, `NEXUS-RAT-2026-07-19-008`) were implemented exactly as ratified, with no Builder invention.
- Proof a distinct Evidence version registers successfully through `EvidenceService.registerEvidence`.
- Proof an exact-pair duplicate fails through `EvidenceService.registerEvidence`.
- Proof the optional Exact Content Evidence fields survive both aggregate snapshot/rehydration and repository round trips with no loss.
- Proof the `ExactOctetStream`/`"1"` canonicalizer performs zero transformation (a direct byte-equality assertion between resolver input and canonicalizer output).
- Proof `InMemoryExactContentResolver` performs no external acquisition of any kind.
- Proof no verification, applicability, currentness, authority, acceptance, or readiness state exists anywhere on `Evidence`.
- Proof no RFC-0013 concept and no Initial Capability Sequence Step 2–6 behavior was introduced.
- Required synchronization, at completion, of `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, this Sprint Implementation Record, `builder-task.md`, and `IMPLEMENTATION_REPORT.md`.

---

## Builder Results

Implemented Sprint 78 exactly within the authorized Evidence-domain surface.

Implemented:

- Seven new production files under `src/kernel/evidence/`: `exact-content-reference.ts`, `content-digest.ts`, `exact-content-evidence.ts`, `exact-content-resolver.ts`, `in-memory-exact-content-resolver.ts`, `exact-content-canonicalizer-registry.ts`, and `exact-content-verification.service.ts`.
- Five modified production files under `src/kernel/evidence/`: `evidence.aggregate.ts`, `evidence.contract.ts`, `evidence.errors.ts`, `evidence.repository.ts`, and `evidence.service.ts`.
- Focused Evidence tests under `test/kernel/evidence/` covering the 46 Objective Tests, including construction validation, exact resolver behavior, zero-transform canonicalization, recursive verification, version-aware repository/service behavior, snapshot/repository round trips, EvidenceHash separation, legacy fail-closed behavior, stateless repeated verification, and contract exports.

Acceptance evidence:

- `npm run compile` passed (`tsc --noEmit`).
- `npm run lint -- --quiet` passed.
- `npx vitest run test\kernel\evidence` passed: 51/51 tests across 8/8 files.
- `npm run validate` was run before final documentation synchronization and failed only in two historical integration guard tests that inspect unstaged `src` diffs from older sprints (`test/integration/autonomous-engineering-integration-validation.integration.test.ts` and `test/integration/governance-automation-integration-validation.integration.test.ts`); all other tests in that run passed (713/715). The guard failures reported exactly the five Sprint 78 modified production files as unstaged `src` diffs.
- Final complete validation was rerun with a temporary validation-only Git index containing the authorized Sprint 78 source/test changes, leaving the repository index/worktree unmodified: `npm run validate` passed, including compile, lint, complete non-extension-host Vitest suite, and build.
- Extension-host test bundle build passed: `npm run test:extension-host:build`.

No architectural deviations.

## Reviewer Notes

Independent Reviewer re-review disposition: `PASS_WITH_FINDINGS`, recorded as `NEXUS-REV-2026-07-19-001` in `REVIEW_HISTORY.md`.

Review summary:

- No architectural violations detected.
- Sprint 78 source and tests conform to RFC-0002 v1.2 and this Sprint Implementation Record.
- Focused validation passed: TypeScript compile, ESLint for `src/kernel/evidence` and `test/kernel/evidence`, and `npx vitest run test\kernel\evidence` (51/51 tests across 8/8 files).
- Prohibited surfaces remained untouched: `src/kernel/evidence/evidence-type.ts`, `src/adapters`, and `src/hosts`.
- `NEXUS-REV-0078-DOC-001` was a documentation drift finding requiring governance synchronization and is resolved by `DOC-078-002`.
- `NEXUS-REV-0078-OBS-001` remains a non-blocking observation for unrelated pre-existing dirty files outside Sprint 78 scope (`.github/copilot-instructions.md`, `GEMINI.md`).

## Final Disposition

Sprint 78 is Approved with Findings and closed for implementation review under `NEXUS-REV-2026-07-19-001`.

The approved implemented slice remains exactly Milestone 12 Initial Capability Sequence Step 1: RFC-0002 v1.2 Exact Content Evidence and the prerequisite version-aware Evidence repository/service contract. No RFC-0013 concept and no Initial Capability Sequence Step 2-6 behavior is activated or implemented by this disposition.
