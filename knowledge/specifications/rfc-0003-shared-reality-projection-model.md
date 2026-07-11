# RFC-0003 — Shared Reality Projection Model

**Status:** Final
**Version:** 1.0
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Purpose

This specification defines the Shared Reality domain of the Nexus Kernel.

Shared Reality is the deterministic engineering understanding computed from authoritative Evidence within the scope of an active Mission.

Shared Reality SHALL NOT become a persistent source of engineering truth.

Instead, it is a computed projection that enables all engineering participants to reason from the same engineering understanding.

This specification owns the normative definitions for:

- Shared Reality
- Context Assembly
- Projection
- Projection Version
- Projection Scope
- Projection Freshness

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First
- Canon 2 — Evidence Before Generation
- Canon 9 — Deterministic Engineering
- Canon 10 — Explainability

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Dependencies

This specification consumes:

- RFC-0001 Mission Model
- RFC-0002 Evidence Model

This specification owns:

- Shared Reality
- Projection
- Context Assembly

---

# Design Goals

Shared Reality SHALL ensure that every engineering participant reasons from an identical engineering understanding.

Shared Reality SHALL be:

- deterministic
- explainable
- reproducible
- mission scoped
- evidence derived
- disposable

---

# Domain Ownership

RFC-0003 exclusively owns:

- Shared Reality
- Projection
- Projection Version
- Projection Scope
- Context Assembly
- Context Package

Other specifications MAY consume Shared Reality.

Other specifications SHALL NOT redefine Shared Reality semantics.

---

# Shared Reality

Shared Reality is the computed engineering understanding of a Mission.

Shared Reality SHALL:

- originate exclusively from Evidence
- remain mission scoped
- remain deterministic
- remain explainable
- remain reproducible

Shared Reality SHALL NOT become authoritative engineering truth.

---

# Projection

A Projection is the materialized representation of Shared Reality.

A Projection SHALL:

- be generated from Evidence
- preserve deterministic behavior
- identify the Evidence used
- preserve reproducibility

Multiple Projections MAY exist.

Equivalent inputs SHALL produce equivalent Projections.

---

# Projection Scope

Every Projection SHALL declare its scope.

Scope SHALL include:

- Mission
- Repository
- Branch
- Workspace
- Repository Policies
- Applicable Architecture
- Active Evidence Set

No Projection SHALL extend beyond its declared scope.

---

# Projection Version

Every Projection SHALL possess a version identifier.

A Projection version SHALL change whenever its Evidence set changes.

Projection versions SHALL remain reproducible.

---

# Context Assembly

Context Assembly is the deterministic process that computes Shared Reality.

Context Assembly SHALL:

- discover applicable Evidence
- resolve Evidence relationships
- apply Kernel policies
- compute Projection
- preserve explainability

Context Assembly SHALL NOT introduce unsupported assumptions.

---

# Context Package

A Context Package is the engineering representation delivered to execution providers.

A Context Package SHALL contain only the engineering information required for execution.

Typical contents include:

- Mission
- Applicable Architecture
- Repository Policies
- Relevant Source Code
- Active Findings
- Supporting Evidence
- Task Context

Implementations MAY optimize package size without changing semantics.

---

# Evidence Selection

Context Assembly SHALL select Evidence according to:

- Mission scope
- Evidence Authority
- Repository Policies
- Architectural relevance
- Dependency relationships

Evidence selection SHALL remain deterministic.

---

# Evidence Resolution

When multiple Evidence instances are applicable:

Context Assembly SHALL:

- preserve conflicting Evidence
- apply Authority rules
- apply Kernel policies
- preserve explainability

Conflict resolution SHALL NOT modify Evidence.

---

# Projection Freshness

Shared Reality SHALL represent the current engineering state.

A Projection becomes stale whenever:

- new Evidence is acquired
- Mission Plans evolve
- Review Outcomes modify applicable Evidence
- Repository state changes
- Repository Policies change

Stale Projections SHOULD be recomputed before execution.

---

# Explainability

Every Projection SHALL identify:

- contributing Evidence
- applied policies
- discarded Evidence
- conflict resolutions

Every engineering participant SHALL be capable of reproducing the Projection.

---

# Engineering Participants

Engineering participants include:

- Kernel Services
- Execution Providers
- Review Providers
- Validation Engines
- Host Integrations

All participants SHALL consume Shared Reality.

No participant SHALL construct an independent engineering understanding.

---

# Shared Reality Lifetime

Shared Reality SHALL exist only for the duration required to support engineering activities.

Implementations MAY cache Projections.

Cached Projections SHALL be invalidated whenever freshness requirements are no longer satisfied.

Shared Reality SHALL remain disposable.

---

# Determinism

Equivalent:

- Mission
- Evidence
- Repository State
- Policies

SHALL produce an equivalent Shared Reality Projection.

Kernel implementations SHALL preserve deterministic computation.

---

# Security Considerations

Shared Reality SHALL preserve Evidence confidentiality.

Sensitive Evidence MAY be omitted according to applicable policies.

Omitted Evidence SHALL remain attributable.

Filtering SHALL preserve deterministic behavior.

---

# Implementation Requirements

Implementations SHALL:

- support deterministic Context Assembly
- support reproducible Projections
- support Projection versioning
- support freshness validation
- preserve explainability
- preserve Evidence attribution

Implementation details remain outside the scope of this specification.

---

# Conformance

A Kernel implementation conforms to RFC-0003 only if it:

- computes Shared Reality exclusively from Evidence
- preserves deterministic behavior
- preserves explainability
- preserves Projection reproducibility
- preserves Mission scoping
- prevents Shared Reality from becoming authoritative truth
- invalidates stale Projections
- delivers deterministic Context Packages

Failure to satisfy these guarantees constitutes non-conformance with this specification.
