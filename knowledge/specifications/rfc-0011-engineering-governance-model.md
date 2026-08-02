# RFC-0011 — Engineering Governance Model

**Status:** Final (Amended)
**Version:** 1.3
**Authority:** Normative
**Normative Language:** RFC 2119

Ratified Final by `NEXUS-RAT-2026-07-15-014`. Amended by `NEXUS-RAT-2026-07-16-004` to establish Mission-Scoped Governance Evaluation (see Mission-Scoped Governance Evaluation, below, and Amendment History). Amended by `NEXUS-RAT-2026-07-18-007` to introduce the closed Governance Evaluation Input Profile model (`ReviewGovernanceEvaluationInput`, unchanged; `CorpusReadinessAcceptanceEvaluationInput`, dormant), the `CurrentProjectionApplicabilityReference` input and recording contract, the separated fail-closed classifications, and the current-applicability requirement. RFC-0003 is not amended. The Corpus-readiness profile is unusable until RFC-0013 v0.6 is authorized, the required Assessment exists, the acceptance policy including its selector is ratified, and implementation is authorized. Amended by `NEXUS-RAT-2026-07-31-001` to establish the Ratification Authority Snapshot Issuance Contract (see Ratification Authority Snapshot Issuance, below, and Amendment History). RFC-0003 is not amended; NCCS-1 is consumed exactly as RFC-0003 v1.1 defines it. `NEXUS-RAT-2026-07-15-017` is not amended; `RatificationAttributionValidation` retains sole ownership of Ratification reference resolution and of its three closed validation outcomes. Implementation of any capability described here still requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process.

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
- Ratification Authority Snapshot Issuance

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
- Policy Evaluation
- Governance Evaluation Input Profiles
- Governance Decision
- Governance Escalation
- Ratification Authority Snapshot Issuance

---

# Design Goals

Engineering Governance SHALL remain:

- deterministic, per input profile —
  - for `ReviewGovernanceEvaluationInput`: equivalent Repository Policy version, Mission, finalized Review Outcome, Evidence, and Shared Reality SHALL always produce the equivalent Governance Decision;
  - for `CorpusReadinessAcceptanceEvaluationInput`: equivalent Repository Policy version, Mission, and complete input profile instance — including an equivalent `CurrentProjectionApplicabilityReference` (selector policy and criterion identity/version, resolution result, resolved current Projection where present, freshness determination, and candidate-corpus fingerprint) — SHALL always produce the equivalent Governance Decision. Because current applicability is supplied as a recorded input rather than discovered at evaluation time, determinism does not depend on evaluation-time repository state;
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

---

# Repository Policy

A Repository Policy is an explicit, ratified, named rule expressing a condition that a finalized engineering outcome SHALL satisfy.

A Repository Policy SHALL be:

- explicit — expressed as one or more deterministic Policy Criteria, never as freeform natural-language judgment;
- ratified — a Repository Policy SHALL originate only from an approved Ratification (`RATIFICATION_LEDGER.md`) or an equivalently Sprint-Owner-authorized source; Governance SHALL NOT invent, infer, or optimize policy;
- immutable per version — once ratified, a specific Repository Policy version's Policy Criteria SHALL NOT be mutated;
- versioned by supersession — a Repository Policy modification SHALL create a new Repository Policy version through a new Ratification; it SHALL NOT overwrite a prior version. The prior version SHALL remain permanently preserved and remain the version of record for every Policy Evaluation and Governance Decision that cited it;
- attributable — a Repository Policy SHALL reference the Ratification or repository law that authorized it.

A Policy Criterion is one deterministic, individually evaluable condition within a Repository Policy (for example: "Review Outcome SHALL be Accepted or Accepted With Observations"; "no Finding of Severity Critical SHALL remain unresolved"). A Policy Criterion SHALL be evaluable through an explicit deterministic predicate, without additional interpretation, inference, or unrestricted model judgment.

Every Policy Criterion SHALL declare the Governance Evaluation Input Profile it evaluates against. A Policy Criterion's evaluability SHALL be judged solely against the inputs its declared profile provides. A Policy Criterion SHALL NOT be evaluated against a profile it does not declare; such an attempt SHALL produce **Escalation Required**.

For the `ReviewGovernanceEvaluationInput` profile, a Policy Criterion SHALL be evaluable from Evidence, Shared Reality, and/or a finalized Review Outcome alone — unchanged from v1.1.

For the `CorpusReadinessAcceptanceEvaluationInput` profile, current-applicability criteria are evaluable exactly because the `CurrentProjectionApplicabilityReference` is a supplied field of that profile; no criterion SHALL reach outside its profile to discover a current Projection.

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
| Subject | `## Subject` SHALL have at least one content line. | → `missing-subject` |
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
| `snapshotSchemaVersion` | `nexus-ratification-authority-snapshot/2` |
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
- `lifecycleResolutionForm` — exactly one of `WholeRecordLifecycle` or `SegmentedLifecycle`;
- `lifecycleDeclaringAuthority` — present if and only if the kind is `GovernedDeclaration`;
- `lifecycleSegments` — an ordered collection of Lifecycle Segments.

The record is a discriminated union on `lifecycleAuthorityKind`. A generically resolved
record naming a declaring authority, and a declared record omitting one, SHALL both be
structurally inexpressible rather than merely rejected.

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
| 4 | `lifecycleResolutionForm` | `Enumeration(WholeRecordLifecycle, SegmentedLifecycle)` |
| 5 | `lifecycleSegments` | `OrderedList(LifecycleSegment)` |

`GovernedDeclaration` arm:

| # | Field | Kind |
| --- | --- | --- |
| 1 | `lifecycleAuthorityKind` | `Enumeration(GenericSourceRule, GovernedDeclaration)` |
| 2 | `ratificationIdentifier` | `Identity` |
| 3 | `ratificationDate` | `String` |
| 4 | `lifecycleResolutionForm` | `Enumeration(WholeRecordLifecycle, SegmentedLifecycle)` |
| 5 | `lifecycleDeclaringAuthority` | `Identity` |
| 6 | `lifecycleSegments` | `OrderedList(LifecycleSegment)` |

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

The snapshot schema version is `nexus-ratification-authority-snapshot/2`.

**Version 2 is not backward compatible with version 1 and SHALL NOT be read as version 1.**
The incompatibility is exact and total:

- v1 records carried a single record-level lifecycle status; v2 records carry a segmented
  lifecycle whose statuses attach to atomic scopes.
- v2 introduces `lifecycleResolutionForm`, `lifecycleAuthorityKind`,
  `lifecycleDeclaringAuthority`, `scopeKind`, `scopeKey`, `scopeDescription`, and
  `lifecycleRelations`; none exists in v1.
- v2 records are discriminated unions; v1 records were not, so no v1 record has a
  well-defined v2 encoding and no v2 record has a well-defined v1 encoding.
- Consequently **no v1 fingerprint, root, or commitment is comparable to any v2
  fingerprint, root, or commitment.** Comparing them across versions is meaningless, not
  merely inadvisable.

A v1 snapshot SHALL NOT be upgraded, reinterpreted, or partially read under v2. Migration
of any v1 artifact requires separate ratification stating its scope, and is not authorized
by this section.

## Deferred Concepts

The following are **deferred** and SHALL NOT be implemented under this section:

- authorized-subject attestations in any form — no field, no collection, no subject-kind
  union, no placeholder, and no dormant extraction path;
- attestation extraction, validation, or attestation-backed applicability authority;
- legacy attestation migration;
- automatic Ratification-Ledger ingestion beyond this source contract.

Introducing attestations later SHALL require either a new snapshot schema version or a
separately ratified overlay. They SHALL NOT be added to
`nexus-ratification-authority-snapshot/2`.

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
- record which Policy Criteria were satisfied, which were violated, and which could not be deterministically evaluated.

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
- publish a Governance Domain Event that omits required RFC-0005 Event Attribution fields (including Mission identity), weakens RFC-0005's Event Attribution requirement, or relies on a type-unsound construct to bypass structural conformance with the RFC-0005 Domain Event envelope;
- accept a caller-supplied lifecycle authority declaration, record, segment, status, relation, or authority root during Ratification Authority Snapshot Issuance, or expose any parameter, field, or channel through which one could be supplied;
- resolve a Ratification reference, open a `RepositoryPolicy`, or produce a `Valid`, `Invalid`, or `Unresolvable` outcome during Ratification Authority Snapshot Issuance (`NEXUS-RAT-2026-07-15-017` retains sole authority over Ratification attribution validation);
- infer semantic disjointness of lifecycle scopes from prose, or read a `scopeDescription` for any purpose other than carrying it verbatim;
- bind the capture instant or the producing attribution into the authority root, or read a system clock internally in place of a declared capture instant;
- record an authority root, envelope commitment, or record fingerprint inside the governed source it is derived from;
- trim, pad, fold, or case-normalize any line of the governed source, or recognize an entry boundary or section heading inside a fenced region;
- implement, stub, or reserve authorized-subject attestations under the `nexus-ratification-authority-snapshot/2` schema.

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
- the declared Governance Evaluation Input Profile and the exact bound fields of that profile instance.

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
- implements no attestation field, collection, subject-kind union, placeholder, or extraction path.

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
