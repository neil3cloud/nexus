# RFC-0013 — Corpus Review Model

**Status:** Draft
**Version:** 0.1
**Authority:** Normative
**Normative Language:** RFC 2119

Authorized for drafting by `NEXUS-RAT-2026-07-18-004`, which declared Milestone 11 Complete and opened Milestone 12 — Corpus Review and Implementation Readiness with the binding Objective and Architectural Boundary reproduced in that ratification. This draft incorporates the Sprint Owner's directed concept list, readiness vocabulary, and Architectural Boundary exactly as specified. Implementation of any capability described here still requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process. This specification does not itself authorize implementation.

---

# Purpose

This specification defines the Corpus Review domain: the deterministic, human-governed evaluation of a bounded collection of existing engineering artifacts — a Corpus — against a declared Corpus Review Scope, producing a structured set of Corpus Findings and one deterministic Corpus Readiness Result.

Corpus Review exists to answer one question, deterministically and traceably: is a defined Corpus ready for the engineering work that depends on it? It does not perform that dependent work itself, and it does not consume or replace Mission, Evidence, Shared Reality, Review, Governance, or Knowledge — this specification's Boundaries and Non-Goals, below, hold those integrations explicitly out of scope for this foundational vertical slice, to be authorized by their own future Sprint(s) once this domain's foundation is ratified and implemented.

This specification owns:

- Corpus Review
- Corpus Review Scope
- Corpus Artifact Reference
- Corpus Finding
- Corpus Finding Category
- Corpus Finding Severity
- Corpus Readiness Result
- Corpus Review Status
- Corpus Review Diagnostics

No other specification may redefine these concepts. This specification does not redefine any concept owned by RFC-0001 through RFC-0012.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First (a Corpus Review reasons only from the exact Corpus Artifact References declared in its Corpus Review Scope; it SHALL NOT establish an independent understanding of artifacts outside that Scope).
- Canon 6 — Evidence-Driven Review (a Corpus Review SHALL produce structured Corpus Findings, not unsupported opinions; every Corpus Finding SHALL identify the exact Corpus Artifact Reference it concerns).
- Canon 9 — Deterministic Engineering (equivalent Corpus Review Scope and Corpus Finding inputs SHALL always produce an equivalent Corpus Readiness Result).
- Canon 10 — Explainability (every Corpus Finding SHALL be traceable to the exact Corpus Artifact Reference it concerns; every Corpus Readiness Result SHALL be traceable to the exact Corpus Findings that produced it).
- Canon 12 — Human Authority (a Corpus Readiness Result informs human and Governance decision-making; it SHALL NOT itself authorize, gate, or substitute for any Mission, Governance, or Activation decision owned by another specification).
- Canon 13 — Contract-Driven Architecture (Corpus Review owns exactly one bounded domain — the evaluation of a declared artifact Corpus — and declares its dependencies explicitly, per Milestone 12's binding Architectural Boundary, below).

Where conflicts exist between this specification and the Kernel Canon, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes: none, in this foundational vertical slice.

Per `NEXUS-RAT-2026-07-18-004`'s binding Architectural Boundary, Corpus Review Mode SHALL reuse the following existing Nexus capabilities only in later, separately authorized Sprints — this specification does not integrate with any of them yet, and a Corpus Artifact Reference SHALL NOT be constructed as, or coerced into, any of their owned types:

- Mission (RFC-0001)
- Evidence (RFC-0002)
- Shared Reality (RFC-0003)
- Execution Roles (RFC-0004)
- Adapters (RFC-0008)
- Review (RFC-0006)
- Governance (RFC-0011)
- Knowledge (RFC-0007)

Owns:

- Corpus Review
- Corpus Review Scope
- Corpus Artifact Reference
- Corpus Finding
- Corpus Finding Category
- Corpus Finding Severity
- Corpus Readiness Result
- Corpus Review Status
- Corpus Review Diagnostics

---

# Design Goals

Corpus Review SHALL remain:

- bounded — every Corpus Review SHALL declare an explicit, immutable Corpus Review Scope before any Corpus Finding may be recorded; a Corpus Review SHALL NOT reason about any artifact outside its declared Scope;
- deterministic — equivalent Corpus Review Scope and Corpus Finding content SHALL always produce an equivalent Corpus Readiness Result;
- non-authoritative over dependent engineering work — a Corpus Readiness Result informs downstream human and Governance decision-making; it SHALL NOT itself gate, authorize, or substitute for any Mission, Review, Governance, or Activation decision owned by another specification;
- additive — this foundational vertical slice SHALL NOT alter the ownership, lifecycle, or public contracts of Mission, Evidence, Shared Reality, Execution Roles, Adapters, Review, Governance, or Knowledge;
- provider-neutral in this foundation — this specification does not define or require any Adapter, provider, or role-based reviewer; Corpus Review foundation content is produced and recorded through this domain's own thin application service only.

---

# Architectural Responsibilities

| Concern | Owner |
| --- | --- |
| Mission identity, executable Mission Plan, Task, Task Graph, Mission completion | Mission Model (RFC-0001), unmodified |
| Evidence, provenance | Evidence Model (RFC-0002), unmodified |
| Shared Reality projection | Shared Reality Projection Model (RFC-0003), unmodified |
| Execution Roles, Engineering Session, Adapter invocation topology | Execution Model (RFC-0004), unmodified |
| Domain Event envelope, ordering, causality, correlation | Domain Event Model (RFC-0005), unmodified |
| Review production, Review Outcome, Findings | Engineering Assessment Model (RFC-0006), unmodified |
| Knowledge | Knowledge Model (RFC-0007), unmodified |
| Adapter contract, Adapter Request/Response | Kernel Adapter Contract (RFC-0008), unmodified |
| Governance Decision production and semantics | Engineering Governance Model (RFC-0011), unmodified |
| Autonomous Mission Plan proposal | Autonomous Engineering Planning Model (RFC-0012), unmodified |
| Corpus Review, Corpus Review Scope, Corpus Artifact Reference, Corpus Finding, Corpus Finding Category, Corpus Finding Severity, Corpus Readiness Result, Corpus Review Status, Corpus Review Diagnostics | Corpus Review Model (this specification) |

---

# Corpus Review Scope

A Corpus Review Scope is an immutable, explicit declaration of exactly which Corpus Artifact References a given Corpus Review evaluates.

A Corpus Review Scope SHALL possess:

- an immutable, ordered, non-empty collection of Corpus Artifact References (below);
- a creation timestamp and causality/correlation identifiers, consistent with RFC-0005's Domain Event envelope conventions (recorded for future compatibility; no event is published by this foundational specification, see Event Catalog, below).

A Corpus Review Scope SHALL NOT be mutated once a Corpus Review has been opened against it. Expanding or narrowing the artifacts under review SHALL always require a new Corpus Review with a new Corpus Review Scope.

---

# Corpus Artifact Reference

A Corpus Artifact Reference is an immutable, identity-only reference to exactly one artifact included in a Corpus Review Scope. It SHALL NOT embed or duplicate the referenced artifact's content.

A Corpus Artifact Reference SHALL possess:

- an immutable `corpusArtifactReferenceId`;
- an artifact identifier (an opaque, caller-supplied stable string identifying the referenced artifact; this specification does not define or constrain artifact identifier schemes beyond stability and uniqueness within a Corpus Review Scope);
- an artifact kind (an opaque, caller-supplied classification string; this specification does not define a closed enumeration of artifact kinds).

A Corpus Review Scope SHALL NOT contain two Corpus Artifact References with the same artifact identifier.

This specification does not resolve, fetch, parse, or validate the content an artifact identifier denotes. Resolution of a Corpus Artifact Reference to Evidence, a Shared Reality projection, or any other owned artifact representation is explicitly deferred to a future, separately authorized Sprint integrating this domain with RFC-0002/RFC-0003, per this specification's Boundaries, below.

---

# Corpus Review

A Corpus Review is the bounded, stateful evaluation of exactly one Corpus Review Scope.

A Corpus Review SHALL possess:

- an immutable `corpusReviewId`, assigned at creation;
- an immutable reference to exactly one Corpus Review Scope, assigned at creation and never reassigned;
- a current Corpus Review Status (below);
- an ordered, append-only collection of Corpus Findings (below), each concerning exactly one Corpus Artifact Reference within the Corpus Review's Scope;
- a Corpus Readiness Result (below), present only once the Corpus Review reaches `Completed`;
- a creation timestamp and causality/correlation identifiers, consistent with RFC-0005's Domain Event envelope conventions.

A Corpus Review SHALL NOT record a Corpus Finding referencing a Corpus Artifact Reference outside its own Corpus Review Scope; such an attempt SHALL be rejected, deterministically, with no state change.

---

## Corpus Review Status

A Corpus Review SHALL progress through the following states:

```
Open -> Completed
Open -> Withdrawn
```

- **Open** — the Corpus Review has been created against an immutable Corpus Review Scope and MAY accept new Corpus Findings.
- **Completed** — no further Corpus Finding MAY be recorded; a Corpus Readiness Result has been deterministically computed and permanently attached. Terminal.
- **Withdrawn** — the Corpus Review was withdrawn before completion; no Corpus Readiness Result is computed. Terminal.

A Corpus Review's Corpus Findings SHALL be immutable once recorded; correcting a recorded Corpus Finding SHALL always require recording a new Corpus Finding, never mutating an existing one.

---

# Corpus Finding

A Corpus Finding is an immutable record of one discrete observation made during a Corpus Review, concerning exactly one Corpus Artifact Reference within that Corpus Review's Scope.

A Corpus Finding SHALL possess:

- an immutable `corpusFindingId`;
- the owning `corpusReviewId`;
- the exact `corpusArtifactReferenceId` it concerns, which SHALL exist within the owning Corpus Review's Scope;
- a Corpus Finding Category (below);
- a Corpus Finding Severity (below);
- a summary (a required, non-empty descriptive string);
- a creation timestamp and causality/correlation identifiers, consistent with RFC-0005's Domain Event envelope conventions.

## Corpus Finding Category

A closed enumeration classifying the nature of a Corpus Finding:

- `Completeness` — a required element of the referenced artifact is absent.
- `Consistency` — the referenced artifact conflicts with another artifact in the same Corpus Review Scope.
- `Clarity` — the referenced artifact is ambiguous or under-specified.
- `Traceability` — the referenced artifact cannot be traced to its required origin or justification.
- `Other` — a Corpus Finding that does not fit the above categories; the summary SHALL explain the classification.

No other Corpus Finding Category value is authorized by this specification.

## Corpus Finding Severity

A closed, ordered enumeration, ordered from least to most severe:

- `Observation` — non-blocking; recorded for traceability only.
- `Minor` — a quality concern; does not by itself prevent readiness.
- `Major` — a significant concern; SHALL prevent an unqualified `Ready` Corpus Readiness Result.
- `Blocking` — a concern that SHALL prevent any `Ready` or `Ready with Observations` Corpus Readiness Result.

No other Corpus Finding Severity value is authorized by this specification.

---

# Corpus Readiness Result

A Corpus Readiness Result is the single, deterministic, terminal outcome of a `Completed` Corpus Review, computed exclusively from the Corpus Findings recorded against it at the moment of completion.

A Corpus Readiness Result SHALL be exactly one of:

- **`Ready`** — the Corpus Review recorded zero Corpus Findings of `Minor`, `Major`, or `Blocking` Severity (only `Observation`-Severity Findings, or none, are present).
- **`Ready with Observations`** — the Corpus Review recorded at least one `Minor`-Severity Corpus Finding and zero `Major`- or `Blocking`-Severity Corpus Findings.
- **`Not Ready`** — the Corpus Review recorded at least one `Major`-Severity Corpus Finding and zero `Blocking`-Severity Corpus Findings.
- **`Escalation Required`** — the Corpus Review recorded at least one `Blocking`-Severity Corpus Finding.

This computation SHALL be deterministic and derivable solely from the exact set of Corpus Findings recorded against the Corpus Review at completion: equivalent Corpus Finding sets SHALL always produce an equivalent Corpus Readiness Result. No human or Adapter-supplied override of a computed Corpus Readiness Result is authorized by this specification.

A Corpus Readiness Result of `Escalation Required` mirrors, in kind, RFC-0011's `GovernanceDecision` outcome of the same name — both indicate that no automated or default disposition is authorized and human attention is explicitly required — but a Corpus Readiness Result is not a `GovernanceDecision`, does not correlate with one, and does not itself gate any Mission, Review, Governance, or Activation decision. Any future integration between Corpus Readiness Result and `GovernanceDecision` requires its own future Sprint scope ratification and, if it requires extending RFC-0011, its own RFC-0011 amendment.

---

# Corpus Review Diagnostics

Corpus Review Diagnostics are deterministic, read-only descriptions of why a given Corpus Review operation was rejected, mirroring RFC-0012's Planning Diagnostics in kind. At minimum, this specification requires deterministic diagnostics for:

- an attempt to record a Corpus Finding against a Corpus Artifact Reference outside the Corpus Review's Scope;
- an attempt to record a Corpus Finding, or compute a Corpus Readiness Result, against a Corpus Review that is not `Open`;
- an attempt to construct a Corpus Review Scope with zero Corpus Artifact References, or with a duplicate artifact identifier;
- an attempt to complete a Corpus Review more than once.

Every diagnostic SHALL fail closed: a missing, ambiguous, or invalid reference SHALL be treated as a deterministic rejection — never a guessed match, a default, or an implicit pass. No fallback inference is authorized.

---

# Event Catalog

This specification reserves no Domain Event in this foundational vertical slice. Should a future Sprint require Corpus Review lifecycle events (for example, a `CorpusReviewCompleted` fact), that reservation and its implementation SHALL be authorized by its own future Sprint scope ratification and, if required, its own RFC-0013 amendment. This specification SHALL NOT be read as implicitly reserving any event name.

---

# Boundaries

This specification SHALL NOT:

- redefine Mission, active Mission Plan, Task, Task Graph, Mission completion (RFC-0001, unmodified);
- redefine Evidence or provenance (RFC-0002, unmodified);
- redefine Shared Reality (RFC-0003, unmodified);
- redefine Execution Roles, Engineering Session, or Adapter invocation topology (RFC-0004, unmodified);
- redefine Review, Review Outcome, or Findings (RFC-0006, unmodified);
- redefine Knowledge (RFC-0007, unmodified);
- redefine the Adapter contract (RFC-0008, unmodified);
- redefine `GovernanceDecision` or Governance Decision semantics (RFC-0011, unmodified);
- redefine Proposed Mission Plan, Proposal Lifecycle, Planning Correlation, or Activation (RFC-0012, unmodified);
- permit a Corpus Readiness Result to gate, authorize, or substitute for any Mission, Review, Governance, or Activation decision owned by another specification;
- introduce provider execution, role-based corpus reviewers, cross-challenge rounds, finding consolidation, autonomous correction, or corpus mutation of any kind in this foundational vertical slice;
- touch `src/hosts` or `src/adapters` in this foundational vertical slice.

---

# Non-Goals

- Provider execution of any kind — this foundational specification defines only the Corpus Review domain model; it does not invoke any Adapter or provider.
- Role-based corpus reviewers — Execution Role assignment to Corpus Review is explicitly deferred; this foundation records no Attribution model of any kind.
- Cross-challenge rounds or multi-participant deliberation over a Corpus Review.
- Finding consolidation, deduplication, or automatic resolution across Corpus Findings.
- Autonomous correction of any artifact referenced by a Corpus Artifact Reference.
- Corpus mutation of any kind — a Corpus Artifact Reference is an identity-only reference; this specification never reads, writes, or otherwise mutates the artifact it denotes.
- Builder handoff or any translation of a Corpus Readiness Result into implementation work.
- Open-ended AI debate of any kind.
- Any amendment to the Kernel Canon or any other RFC.
- Domain Event publication for the Corpus Review domain (see Event Catalog, above).
- Integration with Mission, Evidence, Shared Reality, Execution Roles, Adapters, Review, Governance, or Knowledge — reserved for later, separately authorized Sprints per Milestone 12's binding Architectural Boundary.

---

# Conformance

An implementation of this specification SHALL:

- require an immutable, non-empty Corpus Review Scope before any Corpus Review may be opened;
- reject a Corpus Finding referencing a Corpus Artifact Reference outside its Corpus Review's Scope;
- keep Corpus Findings immutable and append-only once recorded;
- permit Corpus Review Status transitions only as specified (`Open → Completed`, `Open → Withdrawn`);
- compute Corpus Readiness Result deterministically, exclusively from the exact Corpus Findings recorded at completion, using the exact Severity-ordering rule specified above;
- produce the Corpus Review Diagnostics enumerated above deterministically;
- fail closed on every missing, ambiguous, or invalid reference.

---

# Implementation Guidance

Implementation of any capability described in this specification requires its own separate Sprint scope ratification, per `nexus-plan`'s governance process, consistent with every prior RFC in this suite. This specification does not itself authorize implementation.

---

# Amendment History

- v0.1 — Draft. Authorized for drafting by `NEXUS-RAT-2026-07-18-004`, which opened Milestone 12 — Corpus Review and Implementation Readiness and directed this specification's concept list (Corpus Review, Corpus Review Scope, Corpus Artifact Reference, Corpus Finding, Corpus Finding Category, Corpus Finding Severity, Corpus Readiness Result, Corpus Review Status), Corpus Readiness Result vocabulary (`Ready`/`Ready with Observations`/`Not Ready`/`Escalation Required`), and binding Architectural Boundary (Mission, Evidence, Shared Reality, Execution Roles, Adapters, Review, Governance, and Knowledge reused only in later, separately authorized Sprints). `nexus-plan` drafted the deterministic Corpus Readiness Result computation rule (Severity-ordering: `Blocking` > `Major` > `Minor` > `Observation`), the closed Corpus Finding Category and Corpus Finding Severity enumerations, and the Corpus Review Status lifecycle (`Open → Completed`/`Open → Withdrawn`), consistent with this repository's existing deterministic-classification and fail-closed conventions (RFC-0006 Review Outcome, RFC-0011 GovernanceDecision outcome, RFC-0012 Planning Diagnostics). These drafted elements require Sprint Owner review before Final ratification.
