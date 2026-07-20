# RFC-0002 — Evidence Model

**Status:** Final (Amended)
**Version:** 1.3
**Authority:** Normative
**Normative Language:** RFC 2119

Amended to v1.1 by `NEXUS-RAT-2026-07-18-005`, adding an additive, optional Exact Content Evidence contract (Evidence Type, content-representation classification, `representedContentReference`, `contentDigestAlgorithm`, `contentDigest`, deterministic derivation-source semantics, and fail-closed resolution). Evidence not consumed as Exact Content Evidence is unaffected.

Amended to v1.2 by `NEXUS-RAT-2026-07-19-008`: establishes the Canonicalization Profile Registry and registers the `ExactOctetStream`/`"1"` profile — canonical bytes equal the exact resolver-returned octets, byte-for-byte, with no transformation of any kind. No other normative text changed.

Amended to v1.3 by `NEXUS-RAT-2026-07-21-001`: closes the Evidence Confidence classification vocabulary to exactly five values, establishes their total ordering, comparison and threshold-satisfaction semantics, and canonical encoding; and establishes `EvidenceVerificationStatus` as a closed, totally ordered provenance vocabulary distinguished from legacy data by the serialization-stable `verificationStatusSemantics = "EvidenceVerificationStatus/v1"` marker. Evidence recorded before this amendment is preserved exactly as recorded, is never coerced or defaulted, and is treated as unrankable — including any pre-amendment verification status string that happens to match a governed vocabulary value by spelling alone, which remains legacy opaque and unrankable regardless of that match. No other normative text changed. No implementation and no Sprint activation authorized.

---

# Purpose

This specification defines the Evidence domain of the Nexus Kernel.

Evidence is the authoritative representation of engineering facts.

Evidence serves as the constitutional source from which Shared Reality is computed.

This specification owns the normative definitions for:

- Evidence
- Evidence Authority
- Evidence Provenance
- Evidence Versioning
- Evidence Relationships
- Evidence Confidence
- Evidence Conflicts
- Evidence Type
- Evidence Content Representation
- Represented Content Reference
- Evidence Content Digest

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First
- Canon 2 — Evidence Before Generation
- Canon 10 — Explainability
- Canon 11 — Knowledge Through Acceptance

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Design Goals

The Evidence Model SHALL ensure that engineering reasoning is:

- deterministic
- explainable
- attributable
- auditable
- version-aware
- conflict-aware

---

# Domain Ownership

RFC-0002 exclusively owns:

- Evidence
- Evidence Identity
- Evidence Provenance
- Evidence Authority
- Evidence Confidence
- Evidence Relationships
- Evidence Conflict
- Evidence Version
- Evidence Type
- Evidence Content Representation
- Represented Content Reference
- Evidence Content Digest

Other RFCs MAY reference Evidence.

Other RFCs SHALL NOT redefine Evidence semantics.

---

# Evidence

Evidence is the authoritative representation of engineering information.

Evidence represents observable engineering information together with its provenance, version, confidence, and relationships.

Evidence SHALL:

- represent an observable engineering fact
- possess immutable identity
- record provenance
- preserve historical traceability
- remain independently verifiable

Evidence SHALL NOT represent assumptions or unsupported conclusions.

---

# Evidence Authority

Evidence SHALL be the sole authoritative representation of engineering information.

Authoritative engineering information SHALL originate exclusively from Evidence.

No engineering participant SHALL establish authoritative engineering information through unsupported reasoning.

Where Evidence conflicts exist, Evidence Authority SHALL determine the active authoritative engineering information in accordance with applicable Kernel policies.

Shared Reality SHALL consume authoritative engineering information through normative projections defined by RFC-0003.

Examples include:

- Repository source code
- Architecture documents
- ADRs
- Accepted Mission Outcomes
- Approved Repository Policies
- Build outputs
- Static analysis results
- Test results
- Human-approved engineering decisions

Generated AI output SHALL NOT become authoritative Evidence until accepted through the engineering workflow.

---

# Evidence Identity

Each Evidence instance SHALL possess a globally unique immutable identifier.

Identity SHALL remain stable across revisions.

Identity SHALL NOT encode implementation-specific details.

---

# Evidence Provenance

Every Evidence instance SHALL record its origin.

Provenance SHALL include:

- originating source
- acquisition method
- acquisition timestamp
- producing actor
- producing system
- verification status

Provenance SHALL remain immutable.

---

# Evidence Versioning

Evidence corrections SHALL produce new versions.

Historical versions SHALL remain preserved.

Previous versions SHALL remain addressable for audit purposes.

Evidence SHALL be append-only.

Modification SHALL NOT overwrite historical Evidence.

---

# Exact Content Evidence

Exact Content Evidence is an optional Evidence capability. An Evidence instance not consumed as Exact Content Evidence remains conformant without the fields defined in this section.

## Evidence Type

Evidence Type is an explicit, immutable classification of what an Evidence instance represents.

Every Evidence Type SHALL possess an exact identity and an exact version.

For Exact Content Evidence, the Evidence Type identity and version SHALL define the canonical byte representation of the represented content — the deterministic rule by which represented content is reduced to an exact octet sequence.

Evidence Type identity and version SHALL be recorded immutably on every Exact Content Evidence instance.

## Content Representation Classification

Every Exact Content Evidence instance SHALL declare an immutable content-representation classification:

- SnapshotContent — the Evidence version directly represents the exact content of an engineering artifact.
- DerivedContent — the Evidence version represents content derived from one or more Snapshot Evidence instances.

The classification SHALL NOT be inferred.

## Represented Content Reference

Every Exact Content Evidence instance SHALL carry an immutable `representedContentReference` that structurally identifies what the Evidence represents, containing exactly:

- `contentOwner` — the owning domain or artifact namespace;
- `contentType` — the type of the represented artifact or content;
- `contentId` — a stable identity of the represented artifact or content, independent of revision;
- `contentRevision` — the exact revision of that represented artifact or content;
- `evidenceTypeIdentity` and `evidenceTypeVersion` — the Evidence Type defining the canonical byte representation.

Artifact identity SHALL NOT be encoded implicitly inside EvidenceId, and SHALL NOT be established by free-form Provenance alone.

The `representedContentReference` SHALL be immutable for the lifetime of the Evidence version.

Construction SHALL fail closed when any component is absent, empty, mutable, ambiguous, or unresolvable.

## Exact Content Digest

Every Exact Content Evidence instance SHALL record:

- `contentDigestAlgorithm` — an explicit algorithm identifier, initially restricted to the single value SHA-256. No other value is authorized by this specification; additional algorithms require their own future amendment.
- `contentDigest` — the digest of the exact canonical content bytes under `contentDigestAlgorithm`, represented as exactly 64 lowercase hexadecimal characters.

Both fields SHALL be immutable.

Construction SHALL fail closed when either is absent, empty, malformed, or uses an unauthorized algorithm identifier.

## Canonicalization Profile Registry

The canonical byte representation for a given `evidenceTypeIdentity`/`evidenceTypeVersion` pair SHALL be defined by exactly one registered Canonicalization Profile in this Registry. Canonicalization SHALL fail closed for any `evidenceTypeIdentity`/`evidenceTypeVersion` pair without a registered profile. Each future profile is registered by its own separate amendment to this specification; no implementation SHALL define a canonicalization rule not registered here.

### `ExactOctetStream`, version `"1"`

For Evidence Type identity `ExactOctetStream`, version `"1"`: the canonical byte representation SHALL be the exact octet sequence returned by content resolution, unchanged. No UTF-8 or other decoding, no Unicode normalization, no line-ending normalization, no whitespace transformation, no content parsing, and no omission or addition of any byte SHALL be applied. `contentDigest` SHALL be the SHA-256 digest of that exact octet sequence.

An octet sequence of zero length is valid represented content under this profile, provided every other requirement of `representedContentReference` and content resolution is satisfied; emptiness is not itself a failure condition. Octets that do not form valid UTF-8 are likewise valid input under this profile — no decoding is attempted, so no UTF-8 validity requirement applies — and SHALL be hashed exactly as received.

Evidence Provenance for content resolved under this profile SHALL identify how the exact octets were acquired — acquisition method, source, and verification status establishing that those octets, and no others, are the represented content — per this specification's existing § Evidence Provenance, unmodified.

Because this profile performs no transformation, any byte-level difference in represented content — including whitespace, line-ending (for example, CRLF versus LF), or Unicode normalization form (for example, NFC versus NFD) differences — SHALL produce a different canonical input and, absent a SHA-256 collision, a different `contentDigest`. This is the canonicalization profile of exact revision identity: it never treats two byte-distinct representations as equivalent.

Any `evidenceTypeIdentity`/`evidenceTypeVersion` pair other than `("ExactOctetStream", "1")` remains unsupported and SHALL fail closed until registered by its own future amendment.

## SnapshotContent Requirements

For SnapshotContent Evidence:

- the `representedContentReference` SHALL identify exactly one artifact/content revision — never a range, a mutable label, a collection, or an unresolved selector;
- `contentDigest` SHALL be SHA-256 over the exact canonical bytes of that represented revision, per the Evidence Type's canonical byte representation;
- immutable Evidence Provenance SHALL identify how those exact bytes were acquired and verified — originating source, acquisition method, acquisition timestamp, producing actor, producing system, and verification status — in sufficient detail to reproduce both the acquisition and the digest verification;
- the `representedContentReference`, the Evidence identity and version, and the `contentDigest` SHALL all remain immutable and mutually consistent;
- any mismatch or ambiguity among represented content, Evidence version, and digest SHALL fail closed.

Confidence classification SHALL be recorded per this specification's existing Evidence Confidence semantics, unmodified.

## DerivedContent Requirements

For DerivedContent Evidence:

- it SHALL declare an immutable, non-empty, deterministically ordered source Evidence reference set;
- every source reference SHALL identify an exact EvidenceId and exact EvidenceVersion;
- every derivation path used to reach a conclusion treated as authoritative SHALL terminate in valid SnapshotContent Evidence;
- the derivation SHALL explicitly identify which Snapshot source, or which deterministic source combination, establishes the represented-content binding;
- a multi-source derivation is valid only when its combination and ordering semantics are explicit and deterministic; an implicit, order-dependent, or unspecified combination SHALL fail closed;
- source paths that are missing, cyclic, ambiguous, stale, or unresolved SHALL fail closed;
- DerivedContent Evidence SHALL NOT replace, override, or substitute for its source SnapshotContent Evidence's exact-content identity (`representedContentReference`, Evidence identity and version, `contentDigestAlgorithm`, `contentDigest`).

Derivation SHALL use this specification's existing `derives-from` relationship semantics, unmodified.

## Immutability, Versioning, and Fail-Closed Handling

Exact Content Evidence SHALL inherit this specification's existing immutability and append-only versioning semantics, unmodified: corrections produce new versions; historical versions remain preserved and addressable.

A change to represented content SHALL produce a new Evidence version with its own `representedContentReference` and `contentDigest`; a `contentDigest` SHALL NEVER be recomputed in place.

Resolution SHALL fail closed — never guess, default, or silently resolve — on:

- a digest mismatch;
- a missing, malformed, or unauthorized algorithm identifier;
- a missing, ambiguous, or unresolvable `representedContentReference`;
- missing or ambiguous Snapshot Evidence;
- an invalid, absent, cyclic, or ambiguous derivation path or source set;
- a superseded or non-active Evidence version consumed as though current;
- content whose canonical byte representation cannot be established under its declared Evidence Type.

---

# Evidence Confidence

Evidence SHALL declare its confidence classification.

## Closed Classification Vocabulary

The confidence classification vocabulary is CLOSED. It consists of exactly
these five values and no others:

- Verified
- Accepted
- Observed
- Inferred
- Unverified

No implementation, policy, host, adapter, or other specification SHALL add,
remove, rename, alias, or reinterpret a value in this vocabulary. Any value
outside it is not a confidence classification.

## Canonical Encoding

Each value SHALL be encoded, in every serialized representation and every
fingerprint input, as the exact ASCII string shown above, in the exact case
shown, with no leading or trailing whitespace, no punctuation, no separator
substitution, and no case folding. Encoding is byte-stable and SHALL NOT vary
by host, locale, adapter, or serialization format.

## Total Ordering

The vocabulary is TOTALLY ORDERED by strength of engineering claim, from
strongest to weakest:

    Verified > Accepted > Observed > Inferred > Unverified

This ordering is normative, complete, antisymmetric, and transitive. Every pair
of classifications is comparable. No two distinct classifications are of equal
strength.

The ordering is a property of the vocabulary itself. It SHALL NOT be
reconfigured, inverted, extended, or overridden by policy, workflow, host, or
implementation. The ordinal positions are an artifact of the ordering and SHALL
NOT be persisted, transmitted, or used as an identity; only the canonical string
is authoritative.

## Comparison Semantics

Comparison is defined only between two classifications drawn from the closed
vocabulary. For any such pair, exactly one of these holds: the first is
stronger, the second is stronger, or they are the same classification.

## Threshold Satisfaction

A Kernel policy MAY require a minimum confidence threshold, which SHALL itself
be a value from the closed vocabulary.

Evidence satisfies a threshold if and only if its declared classification is the
threshold classification or is stronger than it under the total ordering above.

## Unrankable Confidence

Evidence whose confidence classification is ABSENT is UNRANKABLE.

An unrankable confidence SHALL NOT be defaulted, inferred, substituted,
back-filled, or otherwise supplied. It SHALL remain absent.

Unrankable confidence SHALL NOT satisfy any threshold, including a threshold of
Unverified.

A threshold evaluation against unrankable confidence SHALL be reported as
UNDETERMINED, distinctly from a determinate evaluation of ranked-but-insufficient
confidence. Consumers SHALL fail closed on an undetermined result and SHALL NOT
treat it as satisfaction.

## Construction and Reconstitution

Evidence newly constructed after this amendment SHALL declare a confidence
classification from the closed vocabulary. Construction with an absent value, or
with a value outside the vocabulary, SHALL fail closed.

Evidence reconstituted from a representation recorded before this amendment SHALL
be preserved exactly as recorded. Where confidence is absent it SHALL remain
absent and unrankable. Reconstitution SHALL NOT fail on account of that absence,
SHALL NOT supply a value, and SHALL NOT rewrite, migrate, or re-serialize the
record to add one.

Confidence classification, once declared, is immutable, consistent with
§ Evidence Immutability. A correction SHALL create a new Evidence version.

---

# Evidence Relationships

Evidence MAY reference other Evidence.

Supported relationships include:

- derives-from
- supports
- contradicts
- supersedes
- references
- duplicates

Relationship semantics SHALL remain directional.

Relationship ownership SHALL remain explicit.

`derives-from` carries the additional DerivedContent semantics defined under Exact Content Evidence, above. Its existing directional semantics are unmodified.

---

# Shared Reality Projection

Shared Reality SHALL be computed exclusively from the active authoritative Evidence Set.

Shared Reality SHALL NOT establish new engineering information.

Shared Reality SHALL remain a deterministic projection governed by RFC-0003.

Changes to Shared Reality SHALL occur only as a consequence of changes to the active Evidence Set.

---

# Evidence Conflict

Conflicting Evidence SHALL coexist.

The Kernel SHALL preserve conflicting Evidence until conflict resolution occurs.

Conflict resolution SHALL produce additional Evidence.

Conflict resolution SHALL NOT erase historical Evidence.

Shared Reality SHALL compute from the active authoritative Evidence set rather than deleting conflicting history.

---

# Evidence Acquisition

Evidence MAY originate from multiple sources.

Examples include:

- Workspace analysis
- Repository inspection
- Mission execution
- Review outcomes
- Human decisions
- Adapter outputs
- Tool integrations

Each acquisition SHALL preserve provenance.

---

# Evidence Verification

Evidence SHALL be independently verifiable.

Verification mechanisms MAY include:

- repository inspection
- checksum validation
- digital signatures
- successful builds
- successful tests
- policy validation
- human approval
- content digest verification

Unverified Evidence SHALL remain explicitly classified.

## Evidence Verification Status

The verification status required by § Evidence Provenance SHALL be an
EvidenceVerificationStatus.

The EvidenceVerificationStatus vocabulary is CLOSED. It consists of exactly these
three values and no others:

- Verified
- Unverified
- VerificationFailed

Verified SHALL mean that a verification mechanism named in this section was
applied and succeeded. VerificationFailed SHALL mean that such a mechanism was
applied and did not succeed. Unverified SHALL mean that no such mechanism has
been applied. VerificationFailed SHALL NOT be recorded as Unverified, and
Unverified SHALL NOT be recorded as VerificationFailed; the distinction between
an unattempted and a failed verification is normative.

Canonical encoding follows § Evidence Confidence — the exact ASCII string, exact
case, no whitespace, byte-stable.

The vocabulary is TOTALLY ORDERED, strongest to weakest:

    Verified > Unverified > VerificationFailed

A policy MAY require a minimum verification status. Satisfaction, comparison, and
undetermined-result semantics follow § Evidence Confidence exactly.

EvidenceVerificationStatus is a distinct concept from the outcome of any single
verification operation. It is the immutable provenance record of the verification
state of the Evidence at acquisition, not a re-evaluable result. In particular it
is NOT the per-operation exact-content digest verification outcome established
under § Exact Content Evidence, and the two SHALL NOT be conflated, unified,
substituted for one another, or share an identifier.

## Verification Status Semantics Marker — Legacy/Governed Distinction

A persisted verification status value alone, by spelling, is never sufficient to
establish that it is a governed EvidenceVerificationStatus. Rank is established
only by an accompanying, serialization-stable semantic marker field named
`verificationStatusSemantics`.

The only governed marker value is the exact string `EvidenceVerificationStatus/v1`.

Exactly two persisted representations are valid:

- **Legacy opaque representation**: `verificationStatus` present as an arbitrary
  string, and `verificationStatusSemantics` absent. This representation SHALL
  be treated as legacy opaque and UNRANKABLE regardless of what the
  `verificationStatus` string spells — including a string that is byte-identical
  to `Verified`, `Unverified`, or `VerificationFailed`. Spelling alone SHALL NOT
  confer rank.
- **Governed representation**: `verificationStatus` present as exactly one of
  the three closed EvidenceVerificationStatus values, and
  `verificationStatusSemantics` present as exactly `EvidenceVerificationStatus/v1`.
  This representation alone is RANKABLE.

No other combination is valid. A record presenting a marker with a status value
outside the closed vocabulary, a marker value other than
`EvidenceVerificationStatus/v1`, an empty or unknown marker, a marker with a
missing status, or any additional or conflicting status representation is
malformed. Construction of a malformed representation SHALL fail closed.
Reconstitution of a persisted malformed representation SHALL fail closed and
SHALL NOT produce a Provenance value. The persisted bytes SHALL remain
unchanged and SHALL NOT be repaired, normalized, migrated, or discarded.

### Construction

Provenance newly constructed after this amendment SHALL use the governed
representation: it SHALL provide exactly one closed EvidenceVerificationStatus
value together with the exact marker `EvidenceVerificationStatus/v1`. The
new-construction path SHALL expose the governed type, not a bare string. A bare
verification-status string presented without the marker SHALL NOT be accepted
by the new-construction path, even if it spells a closed vocabulary value. The
legacy opaque representation SHALL NOT be reachable through new construction; it
exists solely for reconstitution and preservation of pre-amendment data.

### Reconstitution

A persisted pre-v1.3 snapshot containing `verificationStatus` and no
`verificationStatusSemantics` marker SHALL be classified as legacy opaque,
regardless of the string's spelling, and reconstituted without modification.
Reconstitution SHALL preserve both the exact string and the absence of the
marker. Re-serialization of an unchanged legacy snapshot SHALL NOT add the
marker, normalize the string, or otherwise migrate the record. Reconstitution
of a governed representation SHALL preserve both fields exactly and remains
rankable.

### Ranking and Thresholds

Only a value accompanied by the exact `EvidenceVerificationStatus/v1` marker is
rankable. A bare string SHALL NOT be ranked by spelling under any
circumstance. Threshold helpers SHALL accept only a governed semantic value,
never an untagged string. Evaluation of a legacy opaque status SHALL return
UNDETERMINED, distinct from a determinate insufficiency, and consumers SHALL
fail closed. A legacy record may acquire a governed verification status only
through a new Evidence version created under the normal immutable Evidence
lifecycle, following an applicable verification action; the old Evidence
version, including its legacy opaque provenance, SHALL remain unchanged.

### Serialization and Identity

`verificationStatusSemantics` SHALL be included wherever the governed
Provenance representation is serialized, canonically encoded, fingerprinted, or
compared. The exact marker spelling and case are normative and
locale-independent. Marker absence is semantically meaningful for legacy
preservation and SHALL remain absent when that legacy representation is
reserialized. The marker SHALL NOT be conflated with, and SHALL NOT share an
identifier with, Sprint 78's existing exact-content
`VerificationStatus = 'Verified' | 'Failed'` operation-outcome type.

## Unrankable Verification Status

Every pre-amendment verification status is legacy opaque and UNRANKABLE,
without exception and without regard to spelling, per the Legacy/Governed
Distinction above. This applies identically to an out-of-vocabulary legacy
string and to a legacy string that happens to match `Verified`, `Unverified`,
or `VerificationFailed`.

An unrankable verification status SHALL NOT be mapped, coerced, normalized,
approximated, or migrated to a governed vocabulary value, and SHALL NOT be
discarded.

Unrankable verification status SHALL NOT satisfy any verification requirement,
including a requirement of VerificationFailed. Evaluation against it SHALL be
UNDETERMINED and consumers SHALL fail closed.

Provenance newly constructed after this amendment SHALL record a governed
verification status per the Construction rule above; any other value SHALL
fail closed at construction. Reconstitution of pre-amendment provenance SHALL
NOT fail on account of an out-of-vocabulary value, a matching-by-spelling
value, or the absence of the marker.

Provenance remains immutable per § Evidence Provenance. Verification status
SHALL NOT be updated in place; a change SHALL produce a new Evidence version.

---

# Evidence Immutability

Evidence SHALL be immutable.

Corrections SHALL create new Evidence.

Historical Evidence SHALL remain accessible.

The Kernel SHALL preserve complete engineering history.

---

# Evidence Lifecycle

Evidence progresses through the following lifecycle:

1. Acquired
2. Classified
3. Verified
4. Related
5. Authorized
6. Archived (optional)

Lifecycle progression SHALL remain attributable.

---

# Explainability

Every engineering conclusion SHALL identify the supporting Evidence.

Engineering reasoning SHALL remain reproducible from the supporting Evidence and its explicit Evidence Relationships.

Evidence outside the active Evidence Set SHALL NOT influence engineering conclusions.

---

# Security Considerations

Evidence SHALL preserve integrity.

Evidence SHALL prevent unauthorized modification.

Evidence provenance SHALL remain auditable.

Sensitive Evidence MAY be access-controlled without changing its semantic meaning.

---

# Implementation Requirements

Implementations SHALL:

- preserve immutable identifiers
- preserve provenance
- support version history
- maintain append-only semantics
- preserve relationship integrity
- expose confidence classification
- preserve conflicting Evidence
- support deterministic retrieval
- preserve Evidence Type identity and version
- preserve the represented content reference
- preserve content-representation classification, contentDigestAlgorithm, and contentDigest for Exact Content Evidence
- preserve confidence classification exactly, including its absence in
  pre-amendment Evidence, without defaulting or back-filling
- preserve verification status exactly, including out-of-vocabulary and
  vocabulary-matching pre-amendment values, without mapping or coercion
- evaluate confidence and verification thresholds by the normative total
  orderings, and fail closed on any undetermined result
- persist and evaluate verification status only through the closed
  legacy-opaque/governed representations defined by the
  `verificationStatusSemantics` marker, never by inspecting or ranking a bare
  `verificationStatus` string's spelling
- expose a governed-only construction API for verification status that rejects
  any bare string lacking the exact `EvidenceVerificationStatus/v1` marker,
  even when that string spells a closed vocabulary value

Implementation details remain outside the scope of this specification.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# Conformance

A Kernel implementation conforms to RFC-0002 only if it:

- treats Evidence as the sole authoritative representation of engineering information
- preserves Evidence immutability
- preserves provenance
- preserves version history
- supports Evidence relationships
- preserves conflicting Evidence
- enables deterministic retrieval
- enables explainable engineering reasoning
- for Exact Content Evidence, preserves Evidence Type, content-representation classification, representedContentReference, contentDigestAlgorithm, and contentDigest
- fails closed on digest mismatch, unresolvable represented content, or ambiguous derived-Evidence source resolution
- treats the confidence classification and EvidenceVerificationStatus
  vocabularies as closed, encodes them canonically, and applies their normative
  total orderings for every threshold evaluation
- preserves pre-amendment Evidence exactly, never fabricating an absent
  confidence classification and never coercing an out-of-vocabulary or
  vocabulary-matching verification status, and fails closed rather than
  satisfying a threshold on unrankable input
- ranks a verification status only when it carries the exact
  `verificationStatusSemantics = "EvidenceVerificationStatus/v1"` marker, and
  treats every marker-less legacy value as unrankable regardless of spelling

Failure to satisfy these guarantees constitutes non-conformance with this specification.

---

# Amendment History

- v1.0 — Final.
- v1.1 — Amended by `NEXUS-RAT-2026-07-18-005`. Adds the optional, backward-compatible Exact Content Evidence contract: Evidence Type (identity/version, canonical byte representation), content-representation classification, `representedContentReference`, `contentDigestAlgorithm` (SHA-256 only), `contentDigest` (64 lowercase hex), SnapshotContent and DerivedContent requirements, and fail-closed handling. No existing Evidence instance, relationship, lifecycle stage, or conformance guarantee is invalidated. Implementation, including `EvidenceHash` reconciliation, is deferred and separately authorized.
- v1.2 — Registers the `ExactOctetStream`/`"1"` Canonicalization Profile and establishes the Canonicalization Profile Registry as the mechanism for all future profile registration, ratified by `NEXUS-RAT-2026-07-19-008`. No other normative text changed. No implementation or Sprint activation authorized.
- v1.3 — Amended by `NEXUS-RAT-2026-07-21-001`. Closes the Evidence Confidence vocabulary to exactly five values; establishes their canonical encoding, normative total ordering (Verified > Accepted > Observed > Inferred > Unverified), comparison and threshold-satisfaction semantics; and establishes `EvidenceVerificationStatus` as a closed, totally ordered three-value provenance vocabulary (Verified > Unverified > VerificationFailed) distinct from the § Exact Content Evidence per-operation verification outcome. Introduces the serialization-stable `verificationStatusSemantics` marker (governed value: `EvidenceVerificationStatus/v1`) as the sole basis for rank: any persisted verification status lacking the exact marker is legacy opaque and unrankable regardless of spelling, including a string that matches a governed vocabulary value; a malformed representation fails closed at both construction and reconstitution, producing no Provenance value while leaving persisted bytes unchanged. Pre-amendment Evidence is preserved exactly: absent confidence remains absent and unrankable, every pre-amendment verification status is preserved byte-for-byte and unrankable without exception, and threshold evaluation over unrankable input is undetermined and fails closed. No existing Evidence instance, provenance record, version, relationship, or lifecycle stage is invalidated, rewritten, or migrated. No implementation and no Sprint activation authorized.
