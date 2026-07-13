# RFC-0002 — Evidence Model

**Status:** Final
**Version:** 1.0
**Authority:** Normative
**Normative Language:** RFC 2119

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

Failure to satisfy these guarantees constitutes non-conformance with this specification.
