# RFC-0002 — Evidence Model

**Status:** Final (Amended)
**Version:** 1.1
**Authority:** Normative
**Normative Language:** RFC 2119

Amended to v1.1 by `NEXUS-RAT-2026-07-18-005`, adding an additive, optional Exact Content Evidence contract (Evidence Type, content-representation classification, `representedContentReference`, `contentDigestAlgorithm`, `contentDigest`, deterministic derivation-source semantics, and fail-closed resolution). Evidence not consumed as Exact Content Evidence is unaffected.

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

Minimum classifications SHALL include:

- Verified
- Accepted
- Observed
- Inferred
- Unverified

Kernel policies MAY determine acceptable confidence thresholds for specific workflows.

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

Failure to satisfy these guarantees constitutes non-conformance with this specification.

---

# Amendment History

- v1.0 — Final.
- v1.1 — Amended by `NEXUS-RAT-2026-07-18-005`. Adds the optional, backward-compatible Exact Content Evidence contract: Evidence Type (identity/version, canonical byte representation), content-representation classification, `representedContentReference`, `contentDigestAlgorithm` (SHA-256 only), `contentDigest` (64 lowercase hex), SnapshotContent and DerivedContent requirements, and fail-closed handling. No existing Evidence instance, relationship, lifecycle stage, or conformance guarantee is invalidated. Implementation, including `EvidenceHash` reconciliation, is deferred and separately authorized.
