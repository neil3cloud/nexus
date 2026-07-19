# RFC-0013 — Corpus Review Model

**Status:** Draft
**Version:** 0.7
**Authority:** Normative
**Normative Language:** RFC 2119

RFC-0013 originated as an unratified working draft during Milestone 11 closure preparation. `NEXUS-RAT-2026-07-18-004` subsequently declared Milestone 11 complete and opened Milestone 12 — Corpus Review and Implementation Readiness — with a binding Objective and Architectural Boundary, and authorized this specification's continued architectural drafting and a future final-ratification review. The Ratification does not itself ratify RFC-0013, does not advance this Status or Version field, and does not authorize implementation of any capability described here. Successive drafts (v0.1–v0.3) incorporated the Sprint Owner's directed concept list, readiness vocabulary, Architectural Boundary, and two rounds of architectural correction. v0.4 incorporates a further, fifteen-point correction closing the review-integrity gap identified in v0.3 (a Corpus Review could reach `Completed` and produce `Ready` without any evidence that review work occurred), adding exact, content-addressed artifact revision identity, canonical fingerprinting across Scope, Contract, Finding-set (v0.4 terminology; superseded in v0.6 by the `CorpusFindingReference` set), and readiness basis, full lifecycle transition attribution, self-attributable Corpus Readiness Results, and corrected Canon-relationship wording. v0.5 (historical) attempted to resolve a Canon 2 — Evidence Before Generation conflict identified during pre-ratification review, in which v0.4 had described a Corpus Readiness Result as "the authoritative output of this specification... not merely advisory" while that draft consumed no RFC-0002 Evidence. v0.5 (historical) addressed this by disclaimer — narrowing the claim and deferring Evidence integration to a future amendment — rather than by construction. That approach was not adopted. v0.5 was an unratified intermediate Draft, superseded by v0.6 before Sprint Owner sign-off; its disclaimer-and-defer treatment of Canon 2 is superseded in full and is no longer normative. v0.6 is authorized by `NEXUS-RAT-2026-07-18-008` (dependent on `NEXUS-RAT-2026-07-18-005`, `-006`, and `-007`) and relocates ownership: assessment, criteria, applicability, coverage, Findings, Finding affected-targets, and attribution to RFC-0006 v1.2; Evidence, represented content, and exact-content semantics to RFC-0002 v1.1; Projection, Projection Freshness, and Active Evidence Set to RFC-0003; and policy evaluation, acceptance, and current-Projection applicability determination to RFC-0011 v1.2. This specification retains Corpus identity, Scope, Purpose, Contract declaration, the Corpus Review Basis and its fingerprint, Evidence-anchored artifact binding, a typed Corpus Finding Reference, the Corpus Readiness Result schema, the Projection Snapshot Lifecycle, and a pure deterministic readiness classification.

The cross-RFC vocabulary relationship activated by `NEXUS-RAT-2026-07-18-008` is effective for architectural drafting only; no runtime use and no implementation of any RFC is authorized.

v0.7 is authorized by `NEXUS-RAT-2026-07-19-004` (dependent on `NEXUS-RAT-2026-07-19-001`, RFC-0003 v1.1) and adds Reproducible Context Integration: the concrete `CorpusReviewContextProfile` instantiation of RFC-0003 v1.1's generic Context Package Profile contract, requiring `MissionScoped` scope and defining the state-specific source-role cardinality and `profilePayload` export matrix. v0.7 is additive only; every v0.6 record and rule is preserved unchanged. This draft awaits Sprint Owner final verification before Final ratification. This specification does not itself authorize implementation; a separate implementation governance record, ratified on its own authority, is required before any capability described here is built.

---

# Purpose

This specification defines the Corpus Review domain: the deterministic, human-governed, attestable evaluation of a bounded, exact-revision Corpus of existing engineering artifacts — declared by an immutable Corpus Review Scope, evaluated against an immutable Corpus Review Contract, for a declared immutable Corpus Review Purpose, belonging to exactly one Mission — referencing the structured, immutable Assessment Findings owned by RFC-0006 v1.2 as Corpus Finding References, and producing one deterministic, self-attributable Corpus Readiness Result.

Corpus Review exists to answer one question, deterministically, reproducibly, and provably: is a defined, exact-revision Corpus ready for a declared engineering purpose? It does not perform that purpose's work itself, and it does not redefine, mutate, or replace any domain owned elsewhere.

Under the ratified v0.6 architecture, this specification consumes the following **read-only**:

- RFC-0001 — Mission identity (structural attribution only);
- RFC-0002 v1.1 — Exact Content Evidence, including `representedContentReference` and exact-content semantics;
- RFC-0003 — Projection, Projection Version, Projection Freshness, and the Active Evidence Set;
- RFC-0006 v1.2 — the terminal Assessment, Assessment Criteria Set, Assessment Coverage, Findings, Finding affected-targets, attribution, and Assessment Outcome;
- RFC-0011 v1.2 — `GovernanceDecision` and the current-applicability contract.

Consumption is strictly read-only in every case: this specification creates, mutates, accepts, approves, and redefines nothing in those domains.

RFC-0004 (Execution Model), RFC-0005 (Domain Event Model), RFC-0007 (Knowledge Model), RFC-0008 (Kernel Adapter Contract), and RFC-0012 (Autonomous Engineering Planning Model) remain unconsumed, exactly as specified in Dependencies, below.

A Corpus Readiness Result SHALL never be obtainable merely because no Corpus Finding Reference exists. Two distinct requirements hold, and SHALL NOT be conflated:

- **That assessment occurred** is established by the exact terminal RFC-0006 v1.2 Assessment bound to the same Corpus Review Basis, including RFC-0006-owned Assessment Coverage. RFC-0006 v1.2 alone establishes this.
- **That RFC-0013's structural lifecycle may close** is established by an attributable Human Completion Attestation, which attests to the exact Corpus Review Basis Fingerprint — and thereby to the exact Mission, Purpose, Scope, Contract authorities, Assessment Criteria Set, and bound RFC-0003 Projection.

The Human Completion Attestation SHALL NOT be read as independently proving Assessment Coverage, accepting Evidence, approving or overriding the RFC-0006 Assessment Outcome, conferring authoritative status, or establishing current applicability. See Assessment Binding and Corpus Review Completion Attestation, below.

A Corpus Readiness Result is, in form, an engineering conclusion: a structured determination about the state of a Corpus. Canon 2 — Evidence Before Generation is satisfied by construction, not by disclaimer, and not by deferral to a future amendment.

Clause 1 — Evidence origination — is satisfied within this specification: every Corpus Artifact Reference is anchored to an exact RFC-0002 v1.1 Exact Content Evidence identity and version, consumed **read-only**, with the artifact's exact identity and `contentDigest` required to equal the anchoring Evidence's `representedContentReference`; applicability of that Evidence is established by the Basis-bound RFC-0003 Projection's Active Evidence Set. This specification neither creates, mutates, accepts, nor redefines Evidence.

Assessment is not performed here. RFC-0006 v1.2 exclusively owns Assessment Findings — their production, classification, targeting, attribution, and lifecycle — and exclusively owns Evidence-expectation enforcement. This specification computes only its own deterministic Corpus Readiness classification, as a pure four-way mapping over the terminal RFC-0006 Assessment Outcome, exercising no independent judgment (see Classification Derivation, below).

Clause 2 — acceptance through the engineering workflow — is satisfied **externally**, never self-conferred. A Corpus Readiness Result is historically valid for exactly its immutable Basis and bound Projection, and asserts nothing about the present. Authoritative downstream applicability requires an applicable terminal Approved `GovernanceDecision` recorded under RFC-0011 v1.2. This specification stores and mutates no `authoritativeStatus`, and SHALL NOT represent a Corpus Readiness Result as current, accepted, or self-executing. See Relationship to the Kernel Canon and Downstream Readiness-Gate Boundary, below.

---

# Domain Ownership

This specification owns:

- Corpus Review
- Corpus Review Purpose (and its Canonical Purpose Key)
- Corpus Review Contract (and its Corpus Review Contract Fingerprint)
- Corpus Review Scope (and its Corpus Review Scope Fingerprint)
- Corpus Review Basis Fingerprint
- Corpus Artifact Reference, including exact, content-addressed artifact revision identity and Canonical Artifact Kind Key
- Corpus Artifact Kind
- Corpus Review Opening Attribution
- Corpus Review Completion Attestation
- Corpus Review Withdrawal Attribution
- Corpus Finding Reference
- Corpus Readiness Result and its schema
- Projection Snapshot Lifecycle
- Corpus Review Status
- Corpus Review Diagnostics

No other specification may redefine these concepts. This specification does not redefine any concept owned by RFC-0001 through RFC-0012.

**Corpus Findings are RFC-0006 Assessment Findings under a contextual designation.** This specification does NOT own Finding identity, Finding structure, severity, intent/category, Evidence references, affected targets, criterion references, attribution, or lifecycle — all of which remain exclusively owned by RFC-0006 v1.2. This specification owns only the `CorpusFindingReference`: an immutable, typed reference to an exact RFC-0006 Assessment Finding. See Corpus Finding (Contextual Designation), below.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First. A Corpus Review's Scope and Contract declare exactly which artifact revisions and authorities are under review; a Corpus Review SHALL NOT be attributed to, or imply reasoning about, any artifact or revision outside those declarations. Every Corpus Artifact Reference is anchored to exact RFC-0002 v1.1 Evidence, and Evidence applicability is established exclusively through the RFC-0003 Projection bound into the Corpus Review Basis. This specification does not itself acquire, parse, or inspect artifact content, and does not compute or verify a content digest — RFC-0002 owns those semantics and this specification consumes them read-only.
- Canon 2 — Evidence Before Generation. Clause 1 (Evidence origination) is satisfied: every Corpus Artifact Reference resolves to exact RFC-0002 v1.1 Exact Content Evidence, whose applicability is established by the Basis-bound RFC-0003 Projection's Active Evidence Set; see Corpus Artifact Reference and Active Evidence Applicability, below. Clause 2 (acceptance) is satisfied externally, never self-conferred: a Corpus Readiness Result becomes authoritative for downstream use only through a finalized RFC-0006 v1.2 Assessment and a terminal Approved RFC-0011 v1.2 Governance Decision. This specification asserts no authoritative status of its own and stores no `authoritativeStatus`; see Downstream Readiness-Gate Boundary, below.
- Canon 3 — Mission-Centric Engineering. Every Corpus Review SHALL structurally belong to exactly one Mission; see Mission Relationship, below.
- Canon 6 — Evidence-Driven Review. Structured Corpus Findings are produced, but this specification does not own them: a Corpus Finding is the contextual designation of an RFC-0006 v1.2 Assessment Finding, which RFC-0006 requires to reference supporting Evidence, identify affected targets, and identify satisfied or violated criteria. Assessment, Assessment Criteria, Assessment Coverage, Finding structure, and Finding affected targets are owned exclusively by RFC-0006 v1.2. This specification records only immutable references to those Findings and computes a pure readiness classification from the terminal Assessment Outcome.
- Canon 9 — Deterministic Engineering. Equivalent Corpus Review Basis and terminal RFC-0006 Assessment Outcome SHALL always produce an equivalent Corpus Readiness Result, through a pure four-way mapping that exercises no independent judgment. Determinism is evaluated against the exact Projection version bound into the Basis, not against whichever Projection is currently fresh; the Basis and its bound Projection are immutable, so re-evaluating identical inputs always yields an identical result irrespective of elapsed time or subsequent Projection versions.
- Canon 10 — Explainability. Every Corpus Readiness Result SHALL be self-attributable: traceable, without external lookup, to the exact Mission, Corpus Review Basis fingerprint, RFC-0006 Assessment identity and terminal Outcome, Assessment Criteria Set identity/version/fingerprint, complete sorted Corpus Finding Reference set and its fingerprint, bound RFC-0003 Projection identity and version, Human Completion Attestation, and completion timestamp. Finding-level explainability is owned by RFC-0006 v1.2.
- Canon 12 — Human Authority. Corpus Review completion requires a Human Completion Attestation, which closes this specification's structural lifecycle only. It confers no authoritative status, asserts no current applicability, and never approves or overrides the RFC-0006 Assessment Outcome. Final authority over downstream use rests with RFC-0011 v1.2 Governance and the Sprint Owner-ratified acceptance policy, never with this specification.
- Canon 13 — Contract-Driven Architecture. Corpus Review owns exactly one bounded domain — the declaration of an exact-revision artifact Corpus, its Basis, and the deterministic readiness classification derived from a finalized external Assessment — and declares its dependencies explicitly, below.

Where conflicts exist between this specification and the Kernel Canon, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0001 — Mission Model (a Corpus Review references a Mission by identity only, read-only, structural attribution; see Mission Relationship, below; this specification does not create, mutate, or complete a Mission, and does not create or activate a Mission Plan).
- RFC-0002 v1.1 — Evidence Model (Evidence identity and version, `representedContentReference`, content-representation classification, `contentDigestAlgorithm`, `contentDigest`, provenance, verification status, confidence, and `derives-from` relationships consumed READ-ONLY; this specification defines, recomputes, and substitutes for none of them).
- RFC-0003 — Shared Reality Projection Model (Projection identity, Projection Version, Projection Scope, Projection Freshness, and Active Evidence Set consumed READ-ONLY; this specification determines no Evidence applicability of its own).
- RFC-0006 v1.2 — Engineering Assessment Model (Assessment identity, Assessment Criteria Set, Assessment Criterion Applicability, Assessment Coverage, Assessment Findings and their affected targets, evaluator/execution attribution, recorded Projection basis, and terminal Assessment Outcome consumed READ-ONLY; this specification owns, computes, and recomputes none of them).
- RFC-0011 v1.2 — Engineering Governance Model (Governance Decision, Corpus Readiness Acceptance Evaluation, and current-Projection applicability determination consumed READ-ONLY; this specification confers no authoritative status of its own).

This specification does not consume RFC-0004 (Execution Model), RFC-0007 (Knowledge Model), RFC-0008 (Kernel Adapter Contract), or RFC-0012 (Autonomous Engineering Planning Model). Integration with any of them is reserved for a future, separately authorized RFC-0013 amendment and its own implementation governance.

This specification does not consume RFC-0005 (Domain Event Model) in this version: Corpus Review domain objects record only their own attribution timestamps (opening, completion, withdrawal). RFC-0005 becomes a dependency of this specification only once Corpus Review Domain Event publication is itself authorized and specified, at which point this specification SHALL be amended to declare that dependency explicitly rather than assume it.

**Effectiveness.** The cross-RFC vocabulary relationship declared above is active for architectural drafting only, per `NEXUS-RAT-2026-07-18-008`. No runtime use and no implementation of this specification, RFC-0002 v1.1, RFC-0006 v1.2, or RFC-0011 v1.2 is authorized by it.

Owns: see Domain Ownership, above.

---

# Architectural Responsibilities

| Concern | Owner |
| --- | --- |
| Mission identity, executable Mission Plan, Task, Task Graph, Mission completion | Mission Model (RFC-0001), unmodified; Mission identity consumed read-only |
| Evidence, provenance, Evidence Type, Content Representation, `representedContentReference`, exact-content semantics | Evidence Model (RFC-0002 v1.1), amended by `NEXUS-RAT-2026-07-18-005`; consumed read-only |
| Projection, Projection Version, Projection Scope, Projection Freshness, Active Evidence Set | Shared Reality Projection Model (RFC-0003), unmodified; consumed read-only |
| Execution Roles, Engineering Session, Adapter invocation topology | Execution Model (RFC-0004), unmodified; not consumed by this specification |
| Domain Event envelope, ordering, causality, correlation | Domain Event Model (RFC-0005), unmodified; not consumed by this specification |
| Assessment, Assessment Criteria Set, criterion applicability, Assessment Coverage, Findings, Finding affected-targets, attribution, Assessment Outcome | Engineering Assessment Model (RFC-0006 v1.2), amended by `NEXUS-RAT-2026-07-18-006`; consumed read-only |
| Knowledge | Knowledge Model (RFC-0007), unmodified; not consumed by this specification |
| Adapter contract, Adapter Request/Response | Kernel Adapter Contract (RFC-0008), unmodified; not consumed by this specification |
| Policy evaluation, `GovernanceDecision`, escalation, acceptance, Governance Evaluation Input Profiles, current-Projection applicability | Engineering Governance Model (RFC-0011 v1.2), amended by `NEXUS-RAT-2026-07-18-007`; consumed read-only |
| Autonomous Mission Plan proposal | Autonomous Engineering Planning Model (RFC-0012), unmodified; not consumed by this specification |
| Corpus Review and every concept listed under Domain Ownership, above | Corpus Review Model (this specification) |

The architectural contract for Governance consumption of a Corpus Readiness Result is **already defined**, by RFC-0011 v1.2's dormant Corpus Readiness Acceptance Evaluation. What remains separately authorized is the authoring and ratification of the applicable Corpus Readiness Acceptance Repository Policy and its deterministic selector, implementation, runtime activation, and any downstream-consequence rules — not a further architectural amendment to this specification or to RFC-0011. See Downstream Readiness-Gate Boundary, below.

---

# Canonical Fingerprint Protocol

Every deterministic fingerprint defined by this specification (Corpus Review Scope Fingerprint, Corpus Review Contract Fingerprint, `corpusFindingReferenceSetFingerprint`, and Corpus Review Basis Fingerprint) SHALL be computed by exactly one shared protocol, so that equivalent architectural inputs produce identical fingerprints in every conforming implementation:

1. **Field participation.** Only the exact fields this specification designates as fingerprint inputs for a given fingerprint (below) participate, and a given fingerprint's own normative input definition is authoritative over this clause.

   Purely record-keeping identifiers — `corpusReviewId`, `corpusArtifactReferenceId`, `attestationId`, `corpusReadinessResultId` — and timestamps SHALL NOT participate in any fingerprint defined by this specification **unless** that fingerprint's exact normative input definition expressly designates an identity as an input. Fingerprints identify architectural content, not record-keeping metadata.

   This clause SHALL NOT be read to exclude identities that a fingerprint's own definition expressly requires. In particular, the `corpusFindingReferenceSetFingerprint` is defined over the complete, sorted, duplicate-free set of `(assessmentId, assessmentFindingId)` identity tuples, as required by `NEXUS-RAT-2026-07-18-008` C7; those RFC-0006-owned identities are designated inputs and SHALL participate.
2. **String encoding.** Every participating field SHALL be encoded as UTF-8.
3. **Collection normalization.** Every participating collection — Scope's artifact references, Contract's authority references, and the `CorpusFindingReference` set — SHALL be sorted ascending by the canonical string form of each element's identity tuple before serialization, and SHALL be duplicate-free; input order SHALL NOT affect the result. For the `CorpusFindingReference` set, that identity tuple is `(assessmentId, assessmentFindingId)`.
4. **Unambiguous framing.** Each field and each collection element SHALL be serialized with explicit length-prefixing (or an equivalent unambiguous, collision-resistant delimiting scheme), such that no two distinct field or collection combinations can produce the same concatenated byte sequence.
5. **Digest algorithm.** The canonical UTF-8 byte sequence produced by steps 1–4 SHALL be digested with SHA-256.
6. **Digest representation.** The digest SHALL be represented as a lowercase hexadecimal string.

This protocol governs fingerprint computation only. It is independent of, and SHALL NOT be conflated with, the content digest required by Exact Artifact Revision Identity, below — an artifact's content digest is an input value carried by a Corpus Artifact Reference; a Corpus Review Scope, Corpus Review Contract, `corpusFindingReferenceSetFingerprint`, or Corpus Review Basis Fingerprint is computed over collections of such reference values — artifact references, authority references, and `CorpusFindingReference` identity tuples — using this protocol.

---

# Corpus Review Purpose

A Corpus Review Purpose is an immutable declaration, made when a Corpus Review is opened, of the engineering activity for which the Corpus is being assessed. Corpus Readiness SHALL always be interpreted relative to the combination of Mission, Corpus Review Purpose, Corpus Review Contract, and exact Corpus Review Scope — never relative to Scope alone. Two Corpus Reviews of the same exact artifact revisions MAY legitimately reference different RFC-0006 v1.2 Assessment Findings, and produce a different Corpus Readiness Result, when they declare different Purposes.

Corpus Review Purpose SHALL be a closed enumeration:

- `AutonomousPlanning`
- `Implementation`
- `ProviderExecution`
- `ArchitecturalRatification`
- `Migration`
- `ReleasePreparation`
- `Other` — SHALL require a non-empty, namespaced extension identifier and a non-empty human-readable description; SHALL NOT be used as a default; SHALL NOT replace a more precise existing value.

A Corpus Review Purpose SHALL be established at Corpus Review creation and SHALL remain immutable for the lifetime of the Corpus Review. The Purpose SHALL NOT be inferred by the application service, a reviewer, or any provider; it SHALL always be an explicit input to Corpus Review creation.

## Canonical Purpose Key

The **Canonical Purpose Key** is the identity value used everywhere Purpose participates in fingerprinting, attribution, or applicability comparison:

- for a core enumeration value, the Canonical Purpose Key is the exact enumeration value (for example, `Implementation`);
- for `Other`, the Canonical Purpose Key is `Other:<normalized-extension-identifier>`, where the extension identifier is normalized by trimming leading and trailing whitespace and converting to lowercase.

The human-readable description accompanying `Other` SHALL NOT participate in the Canonical Purpose Key or in any fingerprint; it is informational only. Two `Other` Purposes with the same normalized extension identifier are the same Purpose for every architectural purpose this specification defines; two with different normalized extension identifiers are different Purposes, regardless of how similar their descriptions read.

---

# Corpus Review Contract

A Corpus Review Contract is an immutable declaration, made when a Corpus Review is opened, of the exact evaluation authorities a Corpus Review's Findings are assessed against.

A Corpus Review Contract answers a distinct question from the Corpus Review Scope: the Scope declares which artifacts are being reviewed; the Contract declares against which exact authorities and readiness expectations they are being reviewed.

A Corpus Review Contract SHALL possess an immutable, non-empty, order-irrelevant collection of Corpus Artifact References (below), each carrying full exact artifact revision identity, restricted to the closed set of authority-bearing Corpus Artifact Kinds defined below. A Corpus Review Contract SHALL reject a duplicate authority reference, where duplication is determined by equal canonical exact artifact identity (see Corpus Artifact Reference, below). A Corpus Review Contract, once attached to an opened Corpus Review, SHALL remain immutable for the lifetime of that Corpus Review.

A Corpus Review Contract SHALL NOT embed a general expression language, executable policy logic, or dynamic evaluation rules of any kind. Its purpose is attribution and reproducibility — recording exactly which authorities a Corpus Review was measured against — not policy execution. Policy evaluation, if any, remains a downstream concern (see Downstream Readiness-Gate Boundary, below).

## Mandatory Assessment Criteria Set Reference

Every Corpus Review Contract SHALL reference exactly one immutable, non-empty RFC-0006 v1.2 Assessment Criteria Set, by its exact identity, exact version, and deterministic fingerprint.

This specification references that Assessment Criteria Set but SHALL NOT own or derive its criteria, its applicability declarations, or its Finding-target semantics — all of which are owned exclusively by RFC-0006 v1.2.

Construction SHALL fail closed when the referenced Assessment Criteria Set is missing, empty, unresolved, stale, ambiguous, or fingerprint-mismatched.

## Contract Authority-Kind Eligibility

The following Corpus Artifact Kinds are authority-bearing and eligible for inclusion in a Corpus Review Contract:

- `Canon`
- `RFC`
- `ADR`
- `Ratification`
- `RepositoryPolicy`
- `ImplementationConstitution`
- `ProviderInstruction`
- `BuilderInstruction`
- `ReviewerInstruction`
- `PlannerInstruction`

The following Corpus Artifact Kinds are Scope-eligible only and SHALL NOT appear in a Corpus Review Contract: `ImplementationPlan`, `ImplementationManifest`, `SprintImplementationRecord`, `ReviewHistory`. These record implementation and review state; a Corpus Review evaluates them, it does not treat them as authorities a Corpus Review is evaluated against.

`Other`-kind Corpus Artifact References MAY appear in a Corpus Review Contract only when the same Contract also includes at least one `Canon`- or `Ratification`-kind reference (an authority-bearing reference this specification already recognizes as capable of declaring new authority-bearing kinds). This specification requires that structural condition deterministically at construction; it does not, and cannot, mechanically verify that the referenced Canon or Ratification content actually declares the specific namespaced extension kind authority-bearing, consistent with this specification's exclusion of artifact content resolution (see Relationship to the Kernel Canon, above). That declaration is a governance precondition binding on whoever authors the Contract, enforced outside this domain model, not a runtime-checkable invariant of it.

## Corpus Review Contract Fingerprint

The Corpus Review Contract Fingerprint is a deterministic value, computed via the Canonical Fingerprint Protocol, over the complete normalized set of each Contract entry's canonical exact artifact identity (`artifactId`, Canonical Artifact Kind Key, content digest — see Corpus Artifact Reference, below). It SHALL be order-independent, reproducible, and immutable once the owning Contract is constructed. Equivalent Contracts containing the same exact authority revisions SHALL produce the same Contract Fingerprint regardless of insertion order.

---

# Mission Relationship

Corpus Review is Mission-scoped engineering activity, consistent with Canon 3 — Mission-Centric Engineering. Every `CorpusReview` SHALL structurally possess exactly one immutable `missionId`, consumed read-only from RFC-0001. A Corpus Review construction request that omits `missionId` SHALL be rejected, deterministically, with no state change — missing Mission attribution fails closed.

Mandatory structural Mission attribution is distinct from Mission existence validation. This specification requires every `CorpusReview` to structurally carry a `missionId`; it does not, in this version, require an implementation to verify against RFC-0001 that the referenced Mission exists, is active, or is otherwise valid. That verification is a future, separately authorized integration with RFC-0001's Mission resolution machinery. Until that integration is authorized, an implementation of this specification MAY treat `missionId` as an opaque, structurally required, unverified reference.

Corpus Review does not own Mission creation, does not alter a Mission's objective, does not mutate Mission state, does not complete a Mission, and does not create or activate a Mission Plan.

---

# Corpus Review Scope

A Corpus Review Scope is an immutable, explicit declaration of exactly which exact artifact revisions a given Corpus Review evaluates. A Corpus Review Scope is an immutable value object embedded within its owning `CorpusReview` — it is not an independently identified or independently persisted domain object. Where a Corpus Review Scope must be referenced, compared, or looked up independently of its owning Corpus Review (for example, for duplicate-review detection), it SHALL be referenced by its Corpus Review Scope Fingerprint (below), never by a separately generated identity.

A Corpus Review Scope SHALL possess an immutable, non-empty, order-irrelevant collection of Corpus Artifact References (below). A Corpus Review Scope SHALL reject construction with zero Corpus Artifact References. A Corpus Review Scope SHALL reject a duplicate Corpus Artifact Reference, where duplication is determined by equal canonical exact artifact identity (`artifactId`, Canonical Artifact Kind Key, content digest — see Corpus Artifact Reference, below).

Artifact order within a Corpus Review Scope is semantically irrelevant. An implementation SHALL preserve deterministic enumeration (for example, insertion order for reproducible iteration) but SHALL NOT treat input order as carrying architectural meaning, and neither Corpus Readiness Result computation nor Corpus Review Scope Fingerprint computation SHALL depend on it.

A Corpus Review Scope SHALL NOT be mutated once a Corpus Review has been opened against it. Expanding or narrowing the artifacts under review, or including a different revision of an already-included artifact, SHALL always require a new Corpus Review with a new Corpus Review Scope.

## Corpus Review Scope Fingerprint

The Corpus Review Scope Fingerprint is a deterministic value, computed via the Canonical Fingerprint Protocol, over the complete normalized set of each Scope entry's canonical exact artifact identity (`artifactId`, Canonical Artifact Kind Key, content digest). It SHALL be order-independent, reproducible, and immutable once the owning Scope is constructed. Equivalent Scopes containing the same exact artifact revisions SHALL produce the same Scope Fingerprint regardless of insertion order.

The Scope Fingerprint SHALL support: traceability of a Corpus Readiness Result back to its exact reviewed inputs; duplicate-review detection; comparison between two Corpus Reviews' Scopes; and future replay validation. See Staleness and Applicability Semantics, below, for how the Scope Fingerprint participates in determining whether a completed Corpus Review remains applicable to a current Corpus.

---

# Corpus Artifact Reference and Exact Revision Identity

A Corpus Artifact Reference is an immutable reference to exactly one **exact revision** of an artifact, included in a Corpus Review Scope or a Corpus Review Contract. It SHALL NOT embed or duplicate the referenced artifact's content.

A Corpus Artifact Reference SHALL possess:

- an immutable `corpusArtifactReferenceId`, assigned at creation. This identifier SHALL be unique within its owning Corpus Review across both the Scope and the Contract collections — no Scope entry and no Contract entry within the same Corpus Review SHALL share a `corpusArtifactReferenceId`;
- `artifactId` — a required, non-empty, immutable, opaque string identifying the referenced artifact's stable identity (independent of revision);
- `artifactKind` — a required Corpus Artifact Kind (below);
- `contentDigest` — a required, non-empty, immutable SHA-256 digest (a 64-character lowercase hexadecimal string) of the exact represented artifact revision;
- `evidenceId` — the exact RFC-0002 v1.1 Evidence Identity anchoring this reference;
- `evidenceVersion` — the exact RFC-0002 v1.1 Evidence Version anchoring this reference;
- `representedContentReference` — the RFC-0002 v1.1 Represented Content Reference of the anchored Evidence, recorded read-only;
- an optional `locator` — a human-readable pointer (for example, a file path) that is informational only and is never treated as authoritative identity.

## Exact Evidence-Anchored Artifact Binding

The `representedContentReference`, content-representation classification, `contentDigestAlgorithm`, `contentDigest`, canonical byte representation, and derivation-source semantics are owned by RFC-0002 v1.1 and consumed READ-ONLY. This specification SHALL NOT define, recompute, or substitute for them, and defines no digest algorithm, no canonical byte representation, no SnapshotContent/DerivedContent semantics, and no derivation-source semantics of its own.

This specification SHALL require that:

- its recorded `contentDigest` equal the RFC-0002 v1.1 `contentDigest` of the anchored Exact Content Evidence; and
- the anchored Evidence's `representedContentReference` identify the exact Corpus artifact and revision this Corpus Artifact Reference declares.

Construction and resolution SHALL fail closed on:

- a digest or algorithm mismatch;
- a `representedContentReference` that is missing, unresolvable, ambiguous, or identifying different content than declared;
- missing or ambiguous SnapshotContent Evidence;
- an invalid, absent, cyclic, ambiguous, or unresolved derivation source set for DerivedContent Evidence;
- Evidence that is no longer resolvable;
- Evidence whose canonical byte representation cannot be established under its declared Evidence Type.

The canonical exact identity of a Corpus Artifact Reference is the tuple `(artifactId, Canonical Artifact Kind Key, contentDigest)`. All three components SHALL be compared using stable equality semantics. Because identity is anchored to `contentDigest` rather than to `locator`, the canonical exact artifact identity SHALL remain valid even when an artifact's `locator` (for example, its file path) later changes.

A Corpus Artifact Reference SHALL NOT contain or duplicate: file content; Evidence content; Shared Reality content; Context Packages; or Host- or Adapter-specific objects. It records identity and exact revision anchoring only.

A completed Corpus Review certifies readiness only for the exact artifact revisions named by its Corpus Artifact References; it makes no readiness claim about any later revision of any referenced artifact. Any change to an included artifact's content (and therefore its `contentDigest`) requires a new Corpus Review; see Staleness and Applicability Semantics, below.

---

# Active Evidence Applicability

This specification SHALL NOT determine which Evidence version is active or authoritative.

Evidence applicability SHALL be established by consuming, read-only, the exact RFC-0003 Projection bound into the Corpus Review Basis: its exact Projection identity and Projection Version; its Active Evidence Set (Projection Scope); Mission and scope compatibility; and `evidenceId` + `evidenceVersion` membership in that Active Evidence Set.

The Projection consumed here SHALL be exactly the Projection identity and version bound into the Basis. No other Projection SHALL be consulted, and no substitution, refresh, or rebasing SHALL occur; see Projection Snapshot Lifecycle, below.

Resolution SHALL fail closed on a missing, unresolvable, non-reproducible, ambiguous, conflicting, or Mission-mismatched Projection; on a Projection identity or version unequal to the Basis-bound Projection; on a Projection Scope unequal to the Basis-bound scope; or on non-membership of any referenced Evidence.

Staleness of the bound Projection under RFC-0003's freshness rules SHALL NOT, by itself, be a fail-closed condition after the Corpus Review has been opened; see Projection Snapshot Lifecycle, below.

## Corpus Artifact Kind

A closed enumeration of the artifact kinds this specification recognizes:

- `Canon`
- `RFC`
- `ADR`
- `Ratification`
- `RepositoryPolicy`
- `ImplementationConstitution`
- `ImplementationPlan`
- `ImplementationManifest`
- `SprintImplementationRecord`
- `ReviewHistory`
- `ProviderInstruction`
- `BuilderInstruction`
- `ReviewerInstruction`
- `PlannerInstruction`
- `Other` — SHALL require an explicit, non-empty, namespaced extension identifier and an explicit, non-empty description; SHALL NOT be used as a default; SHALL NOT replace a more precise existing value.

No other Corpus Artifact Kind value is authorized by this specification. Future artifact kinds require their own RFC-0013 amendment, or, pending such an amendment, use of `Other` with its required extension identifier and description. Silent arbitrary strings SHALL NOT be accepted as a canonical Corpus Artifact Kind.

## Canonical Artifact Kind Key

The **Canonical Artifact Kind Key** is the identity value used everywhere Artifact Kind participates in fingerprinting, duplicate detection, Contract comparison, applicability comparison, or Finding reference resolution:

- for a core enumeration value, the Canonical Artifact Kind Key is the exact enumeration value (for example, `RFC`);
- for `Other`, the Canonical Artifact Kind Key is `Other:<normalized-extension-identifier>`, where the extension identifier is normalized by trimming leading and trailing whitespace and converting to lowercase.

The human-readable description accompanying `Other` SHALL NOT participate in the Canonical Artifact Kind Key or in any fingerprint; it is informational only. Two `Other`-kind references with the same normalized extension identifier are the same kind for every architectural purpose this specification defines; two with different normalized extension identifiers are different kinds. The Canonical Artifact Kind Key, not the raw enumeration value or description, SHALL be used in every canonical exact artifact identity tuple, every fingerprint computation, and every Contract authority-kind eligibility check.

---

# Corpus Review Basis

Every Corpus Review Basis SHALL bind the exact RFC-0003 Projection identity and Projection Version that establishes Active Evidence applicability for the Corpus Review. That Projection SHALL be fresh under RFC-0003's freshness rules at the moment the Basis is constructed and the Corpus Review is opened; construction SHALL fail closed if it is not.

## Corpus Review Basis Fingerprint

The Corpus Review Basis Fingerprint is a deterministic value, computed via the Canonical Fingerprint Protocol, over exactly these nine components:

1. `missionId`;
2. the Canonical Purpose Key;
3. the Corpus Review Scope Fingerprint;
4. the Corpus Review Contract authority-reference fingerprint;
5. the RFC-0006 v1.2 Assessment Criteria Set identity;
6. the RFC-0006 v1.2 Assessment Criteria Set version;
7. the RFC-0006 v1.2 Assessment Criteria Set fingerprint;
8. the RFC-0003 Projection identity;
9. the RFC-0003 Projection Version.

Once constructed, these nine components are immutable. The Basis Fingerprint SHALL exclude every timestamp and every system-generated identifier. It identifies the exact readiness question a Corpus Review answers — precisely which Mission, for precisely which Purpose, over precisely which exact Scope, measured against precisely which exact Contract authorities and Assessment Criteria Set, over precisely which exact Projection.

Because the Human Completion Attestation attests to the Basis fingerprint (below), it thereby attests to the exact Projection as well as to Mission, Purpose, Scope, Contract authorities, and Criteria Set.

Construction SHALL fail closed when the referenced Assessment Criteria Set is missing, empty, unresolved, stale, ambiguous, or fingerprint-mismatched; or when the referenced RFC-0003 Projection is missing, unresolvable, non-reproducible, ambiguous, not fresh under RFC-0003's freshness rules, cross-Mission, identity-mismatched, or version-mismatched.

The Basis Fingerprint SHALL participate in: the Corpus Review Completion Attestation (below); Assessment Binding (below); Corpus Readiness Result attribution (below); and Staleness and Applicability Semantics (below).

---

# Assessment Binding

A Corpus Readiness Result SHALL be computed only after this specification verifies that a referenced RFC-0006 v1.2 Assessment is:

(a) terminal; and

(b) bound to this exact Corpus Review Basis — including equality of Assessment Criteria Set identity, version, and fingerprint, and equality of the RFC-0003 Projection identity and Projection Version recorded on that Assessment with the Projection bound into the Basis.

Verification SHALL compare against the exact Basis-bound Projection and SHALL NOT accept an Assessment recorded against any other Projection version, fresher or otherwise.

This specification SHALL NOT own, compute, or recompute Assessment Coverage, Assessment Findings, Finding affected targets, or the Assessment Outcome.

---

# Corpus Review Aggregate

A Corpus Review is the bounded, stateful evaluation of exactly one Corpus Review Scope, against exactly one Corpus Review Contract, for exactly one Corpus Review Purpose, belonging to exactly one Mission.

A Corpus Review SHALL possess:

- an immutable `corpusReviewId`, assigned at creation;
- an immutable `missionId` (see Mission Relationship, above);
- an immutable Corpus Review Purpose (above);
- an immutable Corpus Review Contract (above);
- an immutable Corpus Review Scope (above);
- the derived Corpus Review Scope Fingerprint, Corpus Review Contract Fingerprint, and Corpus Review Basis Fingerprint;
- a current Corpus Review Status (below);
- an immutable Corpus Review Opening Attribution (below);
- an immutable binding to exactly one terminal RFC-0006 v1.2 Assessment for this exact Corpus Review Basis (see Assessment Binding, above);
- a Corpus Review Completion Attestation (below) and a Corpus Readiness Result (below), present only once the Corpus Review reaches `Completed`, and absent in every other state;
- a Corpus Review Withdrawal Attribution (below), present only once the Corpus Review reaches `Withdrawn`, and absent in every other state.

A Corpus Review aggregate does **not** own a Finding collection. RFC-0006 v1.2 exclusively owns Assessment Findings — their production, classification, targeting, attribution, and lifecycle. This specification owns only immutable `CorpusFindingReference` values: contextual designations of Findings that already exist on the bound Assessment.

Corpus Finding References are not accumulated as mutable aggregate state during the `Open` phase. The complete, sorted, duplicate-free `CorpusFindingReference` set — together with its `corpusFindingReferenceSetFingerprint` — is stored on the Corpus Readiness Result at completion, in full (see Corpus Readiness Result Schema, above).

Every `CorpusFindingReference` SHALL resolve to exactly one Finding of the exact bound terminal Assessment; a reference whose Assessment identity differs, that is duplicated, or that leaves the set incomplete relative to that Assessment's Findings SHALL be rejected deterministically, with no state change.

Both RFC-0006 v1.2 Finding Affected Target variants remain valid and referenceable without restriction: `SubjectElementTarget` and `AssessmentSubjectTarget`. This specification SHALL NOT impose an artifact-only target restriction, SHALL NOT require that a Finding concern exactly one Corpus Artifact Reference, and SHALL NOT reject a subject-wide Finding.

## Corpus Review Opening Attribution

Opening a Corpus Review SHALL require immutable attribution, recorded independently of `missionId` — Mission identity attribution SHALL NOT be treated as, or substitute for, opening-transition attribution. Corpus Review Opening Attribution SHALL possess:

- `originType` — a required, closed classification: `Human`, `Provider`, or `DeterministicSystem`;
- `originId` — a required, non-empty, immutable, opaque identifier for the origin;
- `timestamp` — the moment the Corpus Review was opened.

---

# Corpus Review Lifecycle

A Corpus Review SHALL progress through the following states (Corpus Review Status):

```
Open -> Completed
Open -> Withdrawn
```

- **`Open`** — the Corpus Review has been created against an immutable Basis (Scope, Contract, Purpose, Mission reference, Assessment Criteria Set reference, and bound RFC-0003 Projection), with recorded Opening Attribution. The Basis SHALL remain immutable. No Completion Attestation and no Corpus Readiness Result exists.
- **`Completed`** — terminal. See Review Completion Preconditions, below, for the required transition conditions. A `Completed` Corpus Review SHALL NOT reopen, mutate its Basis, or recompute readiness from changed inputs. A `Completed` Corpus Review's Corpus Readiness Result is permanent for its exact snapshot (see Staleness and Applicability Semantics, below).
- **`Withdrawn`** — terminal. The transition to `Withdrawn` SHALL require a Corpus Review Withdrawal Attribution (below). A `Withdrawn` Corpus Review SHALL produce no Completion Attestation and no Corpus Readiness Result, and SHALL NOT be reopened.

A later review of the same, or a changed, exact artifact revision set SHALL always create a new Corpus Review identity; this specification defines no Pause, Resume, Reopen, Revision, Supersession, or automatic-retry transition for a Corpus Review.

## Corpus Review Completion Attestation

A Corpus Review SHALL NOT transition to `Completed` without a valid Human Completion Attestation.

A Corpus Review Completion Attestation SHALL possess:

- an immutable `attestationId`, assigned at creation;
- the owning `corpusReviewId`;
- `corpusReviewBasisFingerprint` — the exact Corpus Review Basis Fingerprint the attestation attests to; it SHALL exactly equal the owning Corpus Review's own computed Basis Fingerprint at the moment of completion. A mismatch SHALL be rejected, deterministically, with no state change. This binds the attestation to the exact Mission, Purpose, Scope, Contract authorities, Assessment Criteria Set, and RFC-0003 Projection being completed;
- `completionAuthorityOriginType` — a required, closed classification restricted to `Human`. No other value is authorized;
- `completionAuthorityOriginId` — a required, non-empty, immutable, opaque identifier for the Human completion authority;
- `attestationTimestamp` — the moment completion was attested.

**Scope of the Attestation.** Human Completion Attestation closes this specification's structural lifecycle only. It SHALL require an exact terminal RFC-0006 v1.2 Assessment for the same Corpus Review Basis, and it permits this specification to compute its readiness classification.

An Attestation MAY be recorded after the bound Projection has become stale, provided the Snapshot-Preserving Completion conditions of the Projection Snapshot Lifecycle (below) hold. Staleness of the bound Projection SHALL NOT, by itself, prevent Attestation or completion.

Human Completion Attestation SHALL NOT:

- prove coverage independently — Assessment Coverage is owned and enforced by RFC-0006 v1.2;
- accept Evidence;
- approve or override the RFC-0006 Assessment Outcome;
- confer authoritative status;
- assert current applicability;
- replace RFC-0011 v1.2 Governance acceptance.

## Review Completion Preconditions

The `Open → Completed` transition SHALL require, atomically and fail-closed:

1. the Corpus Review's current status is `Open`;
2. a referenced RFC-0006 v1.2 Assessment that is terminal and bound to this exact Corpus Review Basis (see Assessment Binding, above);
3. a Corpus Review Completion Attestation is supplied whose `corpusReviewBasisFingerprint` exactly equals the Corpus Review's own computed Basis Fingerprint;
4. the supplied attestation's `completionAuthorityOriginType` is `Human`.

Upon satisfying every precondition, the transition SHALL, as one atomic operation: record the Completion Attestation; compute exactly one Corpus Readiness Result (below) through the pure mapping over the terminal Assessment Outcome; and set status to `Completed`.

## Corpus Review Withdrawal Attribution

The `Open → Withdrawn` transition SHALL require a Corpus Review Withdrawal Attribution, possessing:

- `originType` — a required, closed classification: `Human`, `Provider`, or `DeterministicSystem`;
- `originId` — a required, non-empty, immutable, opaque identifier for the origin;
- `reason` — a required, non-empty, immutable withdrawal reason;
- `timestamp` — the moment withdrawal occurred.

## Finding Correction Within a Corpus Review

An RFC-0006 Assessment Finding is immutable once recorded; its lifecycle, correction, and supersession semantics are owned exclusively by RFC-0006 v1.2.

An erroneous or materially incorrect evaluation cannot be corrected inside the Corpus Review that referenced it. A Corpus Review found to rest on such an evaluation SHALL be withdrawn (see Corpus Review Withdrawal Attribution, above); a corrected evaluation SHALL occur in a new Corpus Review, with a new `corpusReviewId`, a new Basis, a new RFC-0006 Assessment, a new Human Completion Attestation, and a new Corpus Readiness Result.

---

# Corpus Finding (Contextual Designation)

A **Corpus Finding** is the contextual designation of an RFC-0006 v1.2 Assessment Finding produced by an Assessment whose `AssessmentSubjectReference.kind` is `CorpusReviewBasis` and whose Basis fingerprint matches the owning Corpus Review exactly.

This designation is contextual and ownership-preserving only. This specification SHALL NOT define a second Finding model.

RFC-0006 v1.2 remains the exclusive owner of Finding identity, Finding structure, severity, intent/category, Evidence references, affected targets (`SubjectElementTarget` and `AssessmentSubjectTarget`), criterion references, attribution, and lifecycle. This specification SHALL NOT duplicate, mirror, or redefine the Finding target structure.

## Corpus Finding Reference

This specification owns only:

- **`CorpusFindingReference`** — an immutable, typed reference identifying the exact RFC-0006 Assessment identity and the exact RFC-0006 Assessment Finding identity, and nothing further;
- the binding rule that every referenced Finding belongs to the exact bound Assessment and the exact `CorpusReviewBasis`;
- inclusion of the complete, sorted set of `CorpusFindingReference` values, together with its deterministic fingerprint, in the Corpus Readiness Result (below).

Resolution SHALL fail closed on:

- a missing Finding reference;
- a duplicate Finding reference;
- an unresolved Finding reference;
- a Finding from another Assessment;
- a Finding from another Mission;
- a Finding from another Corpus Review Basis;
- an Evidence mismatch;
- a criterion mismatch;
- a Finding reference set incomplete relative to the exact terminal Assessment.

## Milestone-Objective Conformance

The binding requirement to produce "structured Corpus Findings" is satisfied by RFC-0006 v1.2 Assessment Findings under this designation — structured, Evidence-referenced, criterion-linked, target-scoped (element-scoped or subject-wide), and attributable by RFC-0006's own contract — enumerated completely and verifiably in the Corpus Readiness Result. No RFC-0006 Finding ownership is transferred to this specification.

---

# Corpus Readiness Result

A Corpus Readiness Result is the single, deterministic, terminal, self-attributable outcome of a `Completed` Corpus Review. An `Open` Corpus Review SHALL NOT expose a final Corpus Readiness Result. A `Withdrawn` Corpus Review SHALL NOT produce a Corpus Readiness Result.

## Classification Derivation (normative)

The readiness classification SHALL be derived only through the following pure four-way mapping over the terminal RFC-0006 Assessment Outcome, and SHALL NEVER be independently supplied, defaulted, or overridden by any actor:

- Accepted → `Ready`;
- Accepted With Observations → `ReadyWithObservations`;
- Action Required → `NotReady`;
- Rejected → `NotReady`.

RFC-0013 computes no `EscalationRequired` and exercises no independent judgment. All escalation semantics belong exclusively to RFC-0011 v1.2.

This mapping is normative. Finding enumeration order SHALL NOT alter the result. Artifact enumeration order SHALL NOT alter the result. Repeated derivation from the same terminal Assessment Outcome SHALL always produce the same classification. No human or Adapter-supplied override of a derived readiness classification is authorized by this specification.

This specification defines classification only. It does not state, and SHALL NOT be read to state, whether implementation, planning, activation, or execution may or may not proceed for any classification — that is a downstream concern; see Downstream Readiness-Gate Boundary, below.

## Corpus Readiness Result Schema (normative)

A Corpus Readiness Result is an immutable record containing exactly the following sixteen individually named, directly stored fields:

1. `corpusReadinessResultId` — the Result's own identity.
2. `corpusReviewId` — the owning Corpus Review identity.
3. `missionId` — the Mission identity.
4. `corpusReviewBasisFingerprint` — the exact Corpus Review Basis Fingerprint.
5. `assessmentId` — the exact RFC-0006 Assessment identity.
6. `assessmentOutcome` — the terminal RFC-0006 Assessment Outcome.
7. `readinessClassification` — one of `Ready | ReadyWithObservations | NotReady`, derived only per the pure mapping above.
8. `assessmentCriteriaSetIdentity` — the exact RFC-0006 Assessment Criteria Set identity.
9. `assessmentCriteriaSetVersion` — the exact Assessment Criteria Set version.
10. `assessmentCriteriaSetFingerprint` — the exact Assessment Criteria Set fingerprint.
11. `corpusFindingReferences` — the complete set of `CorpusFindingReference` values, sorted ascending by (`assessmentId`, `assessmentFindingId`), duplicate-free. Stored in full; the set SHALL NOT be omitted in favour of its fingerprint.
12. `corpusFindingReferenceSetFingerprint` — the deterministic fingerprint of field 11, computed via the Canonical Fingerprint Protocol over the sorted, length-framed (`assessmentId`, `assessmentFindingId`) tuples. Stored in addition to field 11, as an integrity check.
13. `projectionIdentity` — the exact RFC-0003 Projection identity bound into the Corpus Review Basis.
14. `projectionVersion` — the exact RFC-0003 Projection Version bound into the Corpus Review Basis.
15. `humanCompletionAttestationId` — the identity of the Human Completion Attestation that closed the Corpus Review's structural lifecycle.
16. `completionTimestamp` — the moment the Corpus Review reached `Completed`.

No field is resolved indirectly. Every field above is directly stored on the Result, so that a governance consumer can establish the complete Finding set and the full computation basis without traversing another aggregate. This self-attribution ensures a Corpus Readiness Result remains independently explainable and traceable without external lookup, per Canon 10.

## Historical Validity

A Corpus Readiness Result is a historically valid evaluation of exactly the immutable Corpus Review Basis identified by field 4, computed against exactly the Projection identified by fields 13 and 14. It records no assertion of current applicability, and RFC-0013 SHALL NOT represent it as current. Current applicability is determined externally by RFC-0011 v1.2 through its `CurrentProjectionApplicabilityReference` and the separately ratified Corpus Readiness Acceptance Repository Policy's deterministic selector.

## Projection Equality (five-way, binding)

Fields 13 and 14 SHALL be exactly equal to all of: the Projection bound into the Corpus Review Basis; the Projection consumed for Active Evidence applicability; the Projection recorded on the referenced RFC-0006 Assessment (RFC-0006 v1.2); and the **historical bound Projection** carried in RFC-0011 v1.2's `CorpusReadinessAcceptanceEvaluationInput`. Any inequality among these five SHALL fail closed.

The resolved current Projection carried in RFC-0011 v1.2's `CurrentProjectionApplicabilityReference` is a distinct reference and is NOT part of this equality; RFC-0013 neither stores nor computes it.

## Equality Checks Required by RFC-0011 Acceptance

When a Corpus Readiness Result is supplied within an RFC-0011 v1.2 `CorpusReadinessAcceptanceEvaluationInput`, the following SHALL hold exactly, and any inequality SHALL fail closed under RFC-0011's separated Failure and Conflict Handling: the input's Mission identity equals field 3 and the referenced Assessment's Mission identity; the input's Corpus Review Basis fingerprint equals field 4; the input's RFC-0006 Assessment identity equals field 5; the input's terminal Assessment Outcome equals field 6; the input's Corpus Readiness Result identity equals field 1; the input's Corpus Readiness classification equals field 7; and the input's historical bound Projection identity and version equal fields 13 and 14 respectively.

## Fail-Closed Construction

Construction of a Corpus Readiness Result SHALL fail closed on: any missing field; a `readinessClassification` that does not equal the pure mapping of field 6; a `corpusFindingReferenceSetFingerprint` that does not equal the recomputed fingerprint of field 11; a duplicate or unresolved entry in field 11; a field-11 set incomplete relative to the exact terminal Assessment's Findings; any `CorpusFindingReference` whose Assessment identity does not equal field 5; a Criteria Set triple (fields 8–10) not equal to the Basis-bound triple; a Projection identity or version (fields 13–14) failing the five-way equality above; or a missing or unresolvable Human Completion Attestation.

---

# Projection Snapshot Lifecycle

RFC-0013 SHALL adopt a snapshot-preserving Projection lifecycle. The following ten rules are binding.

1. **Freshness at construction.** The RFC-0003 Projection SHALL be fresh under RFC-0003's freshness rules when the Corpus Review Basis is constructed and the Corpus Review is opened.
2. **Immutable binding.** The exact Projection identity and Projection Version are thereafter immutable components of the Corpus Review Basis and its fingerprint.
3. **No implicit invalidation.** A later Projection version, or the later staleness of the bound Projection, SHALL NOT mutate, rebase, invalidate, or silently replace the existing Corpus Review Basis.
4. **Snapshot-preserving completion.** An already-open Corpus Review MAY complete against its exact bound Projection after that Projection becomes stale, provided ALL of:
   - the exact bound Projection version remains uniquely resolvable and reproducible;
   - its Mission and Projection Scope remain identical to the values bound into the Basis;
   - every referenced EvidenceId and EvidenceVersion remains resolvable;
   - the RFC-0006 Assessment records exactly that same Projection identity and version;
   - no identity, version, Mission, scope, Evidence-membership, or fingerprint mismatch exists.
5. **Historical validity only.** Completion under rule 4 produces a historically valid Corpus Readiness Result for exactly that immutable Basis. It does not imply, assert, or establish current applicability.
6. **No stale Approved.** RFC-0011 SHALL NOT produce an Approved GovernanceDecision conferring authoritative downstream applicability when the Result's bound Projection is stale relative to the current candidate corpus or the currently applicable Projection, as determined through RFC-0011 v1.2's `CurrentProjectionApplicabilityReference` and the acceptance policy's deterministic selector (RFC-0011 v1.2 B2.1, B3 rules 4 and 7).
7. **Stale-but-resolvable at acceptance.** A stale-but-resolvable historical Projection at RFC-0011 acceptance evaluation SHALL produce Deferred, identifying that a fresh Corpus Review Basis and a new Corpus Review are required for current applicability (RFC-0011 v1.2 B3 rules 6 and 7, B5).
8. **Ambiguity is escalation, not deferral.** A missing, unresolvable, ambiguous, conflicting, cross-Mission, identity-mismatched, version-mismatched, or non-reproducible Projection — including an `Unresolvable` or `Ambiguous` current-Projection selection result — SHALL produce Escalation Required, not Deferred (RFC-0011 v1.2 B3 rule 8, B5).
9. **New Projection version requires a new Corpus Review.** To obtain readiness for a newer Projection version, the system SHALL create a new Corpus Review with: a new Corpus Review identity; a new immutable Basis; a Basis fingerprint binding the new Projection identity and version; a new RFC-0006 Assessment; a new Human Completion Attestation; and a new Corpus Readiness Result.
10. **No rebasing mechanism.** RFC-0013 SHALL define no rebasing, refresh-in-place, Projection substitution, reopening, or mutation mechanism for an existing Corpus Review.

In summary: a new Projection version requires a new Corpus Review for current or authoritative downstream applicability, but it does not prevent an existing open review from completing as a historical exact-snapshot evaluation.

---

# Staleness and Applicability Semantics

A `Completed` Corpus Review's Corpus Readiness Result is permanent and SHALL NOT be mutated or invalidated. It applies exactly, and only, to its own snapshot, identified exactly by its Corpus Review Basis Fingerprint together with its `corpusFindingReferenceSetFingerprint`.

This specification distinguishes two separate statements, and SHALL NOT conflate them:

- **the historical result remains valid for its snapshot** — a `Completed` Corpus Review's Corpus Readiness Result is never altered, recomputed, or revoked (Projection Snapshot Lifecycle, rule 5);
- **the historical result is not applicable to a changed corpus** — if any artifact in the Corpus has since acquired a new revision (a new `contentDigest`), or the Mission, Purpose, Contract, Assessment Criteria Set, or RFC-0003 Projection of interest differs, the historical result does not certify the new state.

A changed input of any kind requires a new Corpus Review. In particular, a new RFC-0003 Projection version is such a changed input, and therefore requires a new Corpus Review with a new identity, a new immutable Basis, a new RFC-0006 Assessment, a new Human Completion Attestation, and a new Corpus Readiness Result (Projection Snapshot Lifecycle, rule 9).

Conversely, the staleness of an already-bound Projection does not invalidate the existing Corpus Review Basis and does not prevent completion. An already-open Corpus Review MAY complete against its exact bound Projection after that Projection becomes stale, provided the Snapshot-Preserving Completion conditions hold (Projection Snapshot Lifecycle, rules 3 and 4). Staleness alone is NOT a fail-closed condition.

Current applicability is not determined by this specification. It is determined externally by RFC-0011 v1.2 through its `CurrentProjectionApplicabilityReference` and the separately ratified Corpus Readiness Acceptance Repository Policy's deterministic selector, which never produces an Approved GovernanceDecision on a stale or differing bound Projection (Projection Snapshot Lifecycle, rules 6 through 8). Comparison SHALL be exact — never by recency, chronology, or partial match.

This specification defines no mechanism to extend, amend, partially revalidate, rebase, refresh in place, substitute a Projection into, reopen, or otherwise mutate a `Completed` or existing Corpus Review (Projection Snapshot Lifecycle, rule 10).

---

# Reproducible Context Integration (v0.7)

This section defines `CorpusReviewContextProfile` — the concrete instantiation of RFC-0003 v1.1's generic Context Package Profile contract for the Corpus Review domain. It defines the concrete instantiation only, conforming to RFC-0003 v1.1's generic contract. It SHALL NOT create a second Context Package aggregate, a Session Compactor, an Artifact Package, a Handoff Contract, a Decision Ledger, an execution model, or a provider model. `contextPackageProfileId = "CorpusReviewContextProfile"`, `contextPackageProfileVersion = "1"`.

## Package Scope Constraint

Every `CorpusReviewContextProfile` package SHALL carry `packageScope` (RFC-0003 v1.1) as the `MissionScoped` variant, with a required, non-empty `missionId` identifying the owning Corpus Review's Mission, and no other variant. The `RepositoryScoped` variant, while a legal RFC-0003 v1.1 vocabulary value for other profiles, SHALL NOT be used by any `CorpusReviewContextProfile` package; a package declaring `RepositoryScoped` under this profile identifier SHALL fail closed at construction time. This is a profile-level restriction only — RFC-0003 v1.1 itself is unmodified and continues to define both variants generically.

## Source Roles, State-Specific Presence, and Cardinality

| `sourceRole` | Cardinality when `Open` | Cardinality when `Completed` | Cardinality when `Withdrawn` |
|---|---|---|---|
| `CorpusReviewBasis` | exactly 1, Required | exactly 1, Required | exactly 1, Required |
| `CorpusReviewScope` | exactly 1, Required | exactly 1, Required | exactly 1, Required |
| `CorpusReviewContract` | exactly 1, Required | exactly 1, Required | exactly 1, Required |
| `RFC0006Assessment` | 0, forbidden | exactly 1, Required, terminal | 0, forbidden |
| `HumanCompletionAttestation` | 0, forbidden | exactly 1, Required | 0, forbidden |
| `CorpusReadinessResult` | 0, forbidden | exactly 1, Required | 0, forbidden |
| `CorpusFindingReference` (per Finding) | 0, forbidden | complete set, Required, non-empty when Coverage requires Findings | 0, forbidden |

`CorpusFindingReference` is forbidden in both `Open` (the Context Package Profile's `InProgress` applicability state) and `Withdrawn` — identical to `RFC0006Assessment`, `HumanCompletionAttestation`, and `CorpusReadinessResult` in those two states, since a Finding cannot exist without the Assessment that produced it. A package containing a Durable Source Reference with a forbidden `sourceRole` for its stated `packageApplicabilityState` SHALL fail closed at construction time.

`sourceManifest` entries SHALL be constructed in this exact fixed order: `CorpusReviewBasis`, `CorpusReviewScope`, `CorpusReviewContract`, `RFC0006Assessment` (when present), `HumanCompletionAttestation` (when present), `CorpusReadinessResult` (when present), then `CorpusFindingReference` entries ascending by the canonical string form of `(assessmentId, assessmentFindingId)`.

## `packageApplicabilityState` Values and Corpus Status Mapping

| Value | Bound Corpus Review status |
|---|---|
| `InProgress` | `Open` |
| `HistoricalCompleted` | `Completed` |
| `Withdrawn` | `Withdrawn` |

RFC-0003 v1.1 does not know these three value names.

## `profilePayload` Export Matrix

Every `entryKey` is subject to RFC-0003 v1.1's `profilePayload` ordering and uniqueness rules (ascending encoded-key order, NFC-normalized uniqueness). The matrix below states, for every entry, its exact `entryValueKind`, its exact `sourceRoleCorrelation`, and its exact presence — and, where constrained, its exact value — in each of the three `packageApplicabilityState` values. An entry marked Absent is not present in the list at all — never a null or placeholder entry — and this absence is itself the canonical representation of non-applicability in that state. This table is the complete and exclusive definition of `CorpusReviewContextProfile`'s `profilePayload`; no entry may be added, omitted, or reinterpreted outside it.

| `entryKey` | `entryValueKind` | `sourceRoleCorrelation` | `InProgress` | `HistoricalCompleted` | `Withdrawn` |
|---|---|---|---|---|---|
| `corpusReviewId` | `Identity` | `none` | Present | Present | Present |
| `corpusReviewMissionId` | `Identity` | `none` | Present | Present | Present |
| `canonicalPurposeKey` | `String` | `none` | Present | Present | Present |
| `corpusReviewLifecycleStatus` | `Status` | `none` | Present, value `Open` | Present, value `Completed` | Present, value `Withdrawn` |
| `corpusReviewScopeFingerprint` | `Fingerprint` | `CorpusReviewScope` | Present | Present | Present |
| `corpusReviewContractFingerprint` | `Fingerprint` | `CorpusReviewContract` | Present | Present | Present |
| `boundProjectionIdentity` | `Identity` | `none` | Present | Present | Present |
| `boundProjectionVersion` | `Version` | `none` | Present | Present | Present |
| `assessmentCriteriaSetIdentity` | `Identity` | `none` | Present | Present | Present |
| `assessmentCriteriaSetVersion` | `Version` | `none` | Present | Present | Present |
| `assessmentCriteriaSetFingerprint` | `Fingerprint` | `none` | Present | Present | Present |
| `assessmentCoverageCompletenessState` | `Status` | `none` | Absent — no Assessment exists to have Coverage | Present, value `Complete` | Absent — no Assessment exists to have Coverage |
| `assessmentTerminalState` | `Status` | `RFC0006Assessment` | Absent | Present, value `Terminal` | Absent |
| `terminalAssessmentOutcome` | `Status` | `none` | Absent | Present, value equal to the exact RFC-0006 v1.2 terminal Assessment Outcome, one of the four values enumerated by Classification Derivation, above: `Accepted`, `Accepted With Observations`, `Action Required`, `Rejected` | Absent |
| `assessmentFindingSetFingerprint` | `Fingerprint` | `CorpusFindingReference` | Absent — `CorpusFindingReference` is forbidden entirely in `InProgress` | Present (complete set) | Absent — `CorpusFindingReference` is forbidden entirely |
| `corpusFindingReferenceSetFingerprint` | `Fingerprint` | `CorpusFindingReference` | Absent, same rule as `assessmentFindingSetFingerprint` | Present | Absent |
| `humanCompletionAttestationIdentity` | `Identity` | `HumanCompletionAttestation` | Absent | Present | Absent |
| `corpusReadinessResultIdentity` | `Identity` | `CorpusReadinessResult` | Absent | Present | Absent |
| `readinessClassification` | `Status` | `none` | Absent | Present, value equal to `readinessClassification` as derived exclusively by Classification Derivation, above, one of: `Ready`, `ReadyWithObservations`, `NotReady` | Absent |
| `applicableRfcVersion.rfc-0002` | `Version` | `none` | Present | Present | Present |
| `applicableRfcRatificationId.rfc-0002` | `Identity` | `none` | Present | Present | Present |
| `applicableRfcVersion.rfc-0003` | `Version` | `none` | Present | Present | Present |
| `applicableRfcRatificationId.rfc-0003` | `Identity` | `none` | Present | Present | Present |
| `applicableRfcVersion.rfc-0013` | `Version` | `none` | Present | Present | Present |
| `applicableRfcRatificationId.rfc-0013` | `Identity` | `none` | Present | Present | Present |
| `applicableRfcVersion.rfc-0006` | `Version` | `none` | Absent — no Assessment exists | Present | Absent — no Assessment exists |
| `applicableRfcRatificationId.rfc-0006` | `Identity` | `none` | Absent | Present | Absent |
| `applicableRfcVersion.rfc-0011` | `Version` | `none` | Absent — no terminal Result exists to accept | Present | Absent — no terminal Result exists to accept |
| `applicableRfcRatificationId.rfc-0011` | `Identity` | `none` | Absent | Present | Absent |

Every `entryKey` above is exhaustive and closed: no other `entryKey` is legal for this profile, in any state. `applicableRfcVersion.<rfcId>` and `applicableRfcRatificationId.<rfcId>` are always exactly two separately typed entries per applicable RFC — never a single combined `"<version>|<ratificationId>"` value. The closed `<rfcId>` list is `{rfc-0002, rfc-0003, rfc-0006, rfc-0011, rfc-0013}`, drawn from RFC-0003 v1.1's `Version`/`Identity` `entryValueKind` vocabulary. The base set (`rfc-0002`, `rfc-0003`, `rfc-0013`) governs the Corpus Review's structural existence, Evidence anchoring, and Context Package representation and is present, unconditionally, in every state. `rfc-0006` governs the terminal Assessment and `rfc-0011` governs Governance's deterministic acceptance of the resulting terminal Corpus Readiness Result; both are present only in `HistoricalCompleted`, mirroring `RFC0006Assessment`'s and `CorpusReadinessResult`'s own forbidden/required cardinality above directly through this matrix's state-specific presence column — not through `sourceRoleCorrelation`, which identifies only which `sourceManifest` entry a `profilePayload` entry scalarizes. An `applicableRfcVersion`/`applicableRfcRatificationId` entry identifies applicable architectural authority; it does not itself scalarize any `sourceManifest` entry, and its `sourceRoleCorrelation` is therefore `none` for every RFC in the closed list, including `rfc-0006` and `rfc-0011`. RFC-0011 governs deterministic Governance acceptance of an existing terminal Corpus Readiness Result; it does not ratify, produce, own, or mutate the Result — RFC-0013 remains the exclusive owner of the Result and its readiness classification (Downstream Readiness-Gate Boundary, above). An `InProgress` or `Withdrawn` package carries no terminal Assessment or Corpus Readiness Result and therefore SHALL NOT claim `rfc-0006` or `rfc-0011` as state-applicable inputs.

`InProgress` and `Withdrawn` therefore each carry exactly 17 `profilePayload` entries (11 always-present Corpus entries + 6 base-RFC entries); `HistoricalCompleted` carries exactly 29 (the same 11 + 8 `HistoricalCompleted`-only Corpus entries + 10 full-RFC entries). This table is consistent with, and directly derived from, the cardinality table above: every `profilePayload` entry whose `sourceRoleCorrelation` names a forbidden `sourceRole` for a given state is itself absent in that state, and every entry correlated to a required `sourceRole` is present. RFC-0013 SHALL NOT redefine any RFC-0002, RFC-0003, RFC-0006, or RFC-0011 field — every entry above is a read-only export. The canonical construction of every entry, and the deterministic ordering under which the full list is presented, are governed exclusively by RFC-0003 v1.1's NCCS-1 protocol (Profile Payload Entry and Canonical Serialization Protocol subsections).

## Lifecycle Consistency and Ownership Boundary

Any mismatch between actual Corpus Review status and a claimed `packageApplicabilityState` fails closed via a new Context Package Verification Result. Any violation of the cardinality table or the export matrix above fails closed at construction time. Current applicability remains exclusively RFC-0011-owned. RFC-0013 SHALL NOT store or own Context Package identity, content, fingerprint, Checkpoint, Handoff, Adapter Request, provider identity, or provider session state.

This section cites RFC-0003 v1.1 and, unchanged, RFC-0002 v1.1, RFC-0006 v1.2, RFC-0011 v1.2. It introduces zero normative references to RFC-0004 or RFC-0008.

---

# Corpus Review Diagnostics

Corpus Review Diagnostics are deterministic, read-only descriptions of why a given Corpus Review operation was rejected. At minimum, this specification requires deterministic diagnostics for:

- a missing `missionId`, or missing Opening Attribution, at Corpus Review construction;
- an empty Corpus Review Scope, or an empty Corpus Review Contract;
- a duplicate canonical exact artifact identity within a Corpus Review Scope or Corpus Review Contract;
- a Contract entry using a non-authority-bearing Corpus Artifact Kind, or an `Other`-kind Contract entry lacking a qualifying `Canon`/`Ratification` reference in the same Contract;
- an empty `artifactId`; a missing or malformed `contentDigest`; or an `artifactKind` of `Other` missing its required extension identifier or description;
- an Evidence-anchoring failure: an unresolvable `evidenceId`/`evidenceVersion`, a missing RFC-0002 `representedContentReference`, or an inequality between a Corpus Artifact Reference's exact identity or `contentDigest` and the anchoring Evidence's represented content;
- a missing, unresolvable, or non-unique Assessment Criteria Set binding on the Corpus Review Contract, or a Criteria Set identity/version/fingerprint mismatch;
- an RFC-0003 Projection that is not fresh at Corpus Review Basis construction;
- a Corpus Artifact Reference whose anchoring Evidence is not a member of the bound Projection's Active Evidence Set;
- a Corpus Review Basis Fingerprint that does not equal the recomputed fingerprint of its nine bound components;
- a violation of the five-way historical-bound Projection equality;
- a snapshot-lifecycle violation: an attempted rebasing, refresh-in-place, Projection substitution, or reopening of an existing Corpus Review;
- a missing, non-terminal, cross-Mission, or Basis-mismatched RFC-0006 Assessment binding;
- a `CorpusFindingReference` that does not resolve to exactly one Finding of the bound Assessment, a duplicate reference, or a reference set incomplete relative to that Assessment's Findings;
- a Corpus Readiness Result schema violation: a missing field, a `readinessClassification` not equal to the pure mapping of the terminal Assessment Outcome, or a `corpusFindingReferenceSetFingerprint` mismatch;
- an attempt to complete a Corpus Review that is not `Open` (including a repeated completion attempt);
- an attempt to complete a Corpus Review with a missing Human Completion Attestation, a Basis Fingerprint mismatch, or a non-`Human` attestation origin;
- an attempt to withdraw a Corpus Review that is not `Open`, or without an attributable withdrawal reason;
- a lookup for a Corpus Review identity that does not exist;
- an attempt to access a Corpus Readiness Result before the Corpus Review has reached `Completed`, or after it has reached `Withdrawn`;
- a `CorpusReviewContextProfile` Context Package declaring a `packageScope` of `RepositoryScoped`;
- a `CorpusReviewContextProfile` Context Package whose `sourceManifest` or `profilePayload` violates the state-specific cardinality or export matrix (Reproducible Context Integration, above), including a forbidden `sourceRole` present for the stated `packageApplicabilityState`, or a mismatch between the actual Corpus Review status and the claimed `packageApplicabilityState`.

This specification defines no diagnostic for Finding production, Finding targets, coverage disposition, criterion definition, or evaluator identity — those are owned by RFC-0006 v1.2 — nor for current-Projection selection or current-applicability determination, which are owned by RFC-0011 v1.2.

Every diagnostic SHALL fail closed: a missing, ambiguous, or invalid reference SHALL be treated as a deterministic rejection — never a guessed match, a default, or an implicit pass. No fallback inference is authorized. Diagnostics SHALL identify the violated contract, SHALL avoid provider-specific language, and SHALL avoid hidden policy interpretation.

---

# Aggregate, Service, and Repository Responsibilities

This section records binding ownership boundaries; it does not prescribe method signatures, storage technology, or source-tree location.

## Aggregate

The Corpus Review aggregate SHALL own: its lifecycle transitions and their required attribution/attestation; its immutable Scope, Contract, Purpose, and Basis; Evidence-anchored artifact binding and Active Evidence applicability validation; Assessment binding validation; `CorpusFindingReference` resolution and set-completeness validation; terminal-state protection; Scope/Contract/Basis/`corpusFindingReferenceSetFingerprint` computation; Corpus Readiness Result construction (per the Classification Derivation and Corpus Readiness Result Schema, above); and withdrawal validation.

## Application Service

A thin Corpus Review application service SHALL own only: repository loading; aggregate invocation; persistence; deterministic result return; and not-found diagnostics.

The application service SHALL NOT: compute a Corpus Readiness Result, a readiness classification, or any fingerprint independently of, or differently from, the aggregate; produce, classify, or target an RFC-0006 Finding; select a current Projection or determine current applicability; resolve Corpus Artifact References to artifact content or compute a `contentDigest` on the aggregate's behalf; execute any provider or Adapter; mutate any corpus artifact; perform finding consolidation; or perform Governance evaluation.

## Repository

A `CorpusReview` repository contract SHALL provide: saving a Corpus Review; retrieving a Corpus Review by its identity; preserving complete aggregate state, including its Corpus Finding References, Human Completion Attestation, and Corpus Readiness Result once present; deterministically handling duplicate-identity creation attempts; and stable not-found diagnostics. The repository SHALL NOT own domain validation. This specification does not mandate a specific persistence technology, storage engine, or degree of durability; it requires only append-preserving storage with deterministic identity and not-found behavior. Enumeration, search, indexing, artifact-based lookup, Fingerprint-based lookup, and Mission-based lookup are not required by this specification and are deferred to whichever future authorization requires them.

---

# Event Publication Boundary

This specification reserves no Domain Event. Speculative event names (for example, naming a "review opened," "finding recorded," "review completed," "review withdrawn," or "readiness determined" event) are explicitly not reserved here. Event names, publication behavior, and the RFC-0005 dependency such publication would require SHALL be introduced only once the aggregate lifecycle is certified, event semantics are known, Mission attribution is verified (not merely structural), and a concrete consumer or architectural need exists — consistent with this repository's established pattern of separating foundation, stable lifecycle, event publication, and event consumption into distinct, separately authorized increments. This specification SHALL NOT be read as implicitly reserving any event name or as implicitly depending on RFC-0005.

---

# Downstream Readiness-Gate Boundary

A Corpus Readiness Result's schema and deterministic construction are exclusively owned by this specification: no other specification may recompute or reinterpret it, and RFC-0011 SHALL NOT mutate it. This ownership is structural only — the unique, reproducible, self-attributable record this specification's own construction produces for an exact Corpus Review Basis.

**No stored authoritative status.** RFC-0013 SHALL store and mutate no `authoritativeStatus`. A Corpus Readiness Result confers no authoritative downstream applicability by itself. Authoritative downstream applicability is external, established by an applicable terminal Approved GovernanceDecision recorded under RFC-0011 v1.2 — which requires, among other conditions, that the separately ratified Corpus Readiness Acceptance Repository Policy's deterministic selector resolve exactly one fresh current Projection equal to this Result's bound Projection — and resolved by consumers.

**Historical validity is not current applicability.** A Corpus Readiness Result is historically valid for exactly its immutable Basis and exactly its bound Projection (Projection Snapshot Lifecycle, rule 5). It asserts nothing about the present. RFC-0011 v1.2 is the sole determiner of current applicability, through its `CurrentProjectionApplicabilityReference` and the acceptance policy's deterministic selector: no Approved decision on a stale or differing bound Projection (rule 6); a stale-but-resolvable historical Projection yields Deferred (rule 7); and a missing, unresolvable, ambiguous, or mismatched Projection yields Escalation Required (rule 8).

This specification defines structure and classification only (see Classification Derivation, above); it does not itself state or imply any downstream consequence, and it does not itself constitute engineering-workflow acceptance. It is not self-enforcing outside the Corpus Review domain.

This specification SHALL NOT, and no implementation of it SHALL:

- mutate any Mission state;
- activate a Proposed Mission Plan or any RFC-0012 Activation;
- advance any RFC-0004 Workflow or Workflow Chain;
- authorize implementation of any kind;
- invoke a Builder, Adapter, or any provider;
- create, imply, or substitute for an RFC-0011 `GovernanceDecision`.

The architectural contract for Governance consumption of a Corpus Readiness Result is **already defined**, by RFC-0011 v1.2's dormant Corpus Readiness Acceptance Evaluation — its `CorpusReadinessAcceptanceEvaluationInput`, its `CurrentProjectionApplicabilityReference`, and its acceptance semantics. No further architectural amendment to this specification or to RFC-0011 v1.2 is required for that contract to exist.

What remains future and separately authorized is:

- the authoring and ratification of the applicable Corpus Readiness Acceptance Repository Policy and its deterministic current-Projection selector;
- implementation of any capability described here or in that contract;
- runtime activation of the dormant contract;
- any downstream-consequence rule — that is, what a given readiness classification permits or forbids downstream.

Each of those remains owned by its own authorization, not by this specification. This specification defines no downstream consequence and grants no such authorization.

---

# Boundaries

This specification SHALL NOT:

- redefine Mission, active Mission Plan, Task, Task Graph, Mission completion (RFC-0001, unmodified);
- redefine Evidence, provenance, Evidence Type, Content Representation, `representedContentReference`, or exact-content semantics (RFC-0002 v1.1, consumed read-only);
- redefine Shared Reality, Projection, Projection Version, Projection Scope, Projection Freshness, or the Active Evidence Set (RFC-0003, unmodified and consumed read-only);
- redefine Execution Roles, Engineering Session, or Adapter invocation topology (RFC-0004, unmodified);
- redefine Assessment, assessment criteria, criterion applicability, Assessment Coverage, Findings, Finding targets, Finding attribution, or Assessment Outcome (RFC-0006 v1.2, consumed read-only);
- redefine Knowledge (RFC-0007, unmodified);
- redefine the Adapter contract (RFC-0008, unmodified);
- redefine policy evaluation, `GovernanceDecision`, escalation, acceptance, Governance Evaluation Input Profiles, or current-Projection applicability (RFC-0011 v1.2, consumed read-only);
- redefine Proposed Mission Plan, Proposal Lifecycle, Planning Correlation, or Activation (RFC-0012, unmodified);
- permit a Corpus Readiness Result to gate, authorize, or substitute for any Mission, Assessment, Governance, or Activation decision owned by another specification (see Downstream Readiness-Gate Boundary, above);
- permit a Corpus Review to reach `Completed` without a valid Human Completion Attestation bound to its exact Basis Fingerprint;
- store or mutate any `authoritativeStatus`, or otherwise assert current applicability;
- compute or store any `EscalationRequired` classification, or exercise any independent judgment over an RFC-0006 Assessment Outcome;
- rebase, refresh in place, substitute a Projection into, reopen, or otherwise mutate an existing Corpus Review;
- introduce provider execution, role-based corpus reviewers, cross-challenge rounds, finding consolidation, autonomous correction, or corpus mutation of any kind.

---

# Non-Goals

- Corpus artifact **content** resolution (Context Package generation or Corpus Context Assembly), and computation or verification of a Corpus Artifact Reference's `contentDigest` against actual artifact bytes. RFC-0002 v1.1 Evidence and RFC-0003 Projections are consumed read-only for anchoring and applicability; this specification resolves no artifact content and produces no digest of its own.
- Provider execution of any kind — this specification defines only the Corpus Review domain model; it does not invoke any Adapter or provider.
- Role-based corpus reviewers of any kind (for example, an Architect reviewer, Devil's Advocate reviewer, Consistency reviewer, or Implementation Readiness reviewer) — Execution Role assignment to Corpus Review is explicitly deferred.
- Cross-challenge rounds, review-round management, or multi-participant deliberation over a Corpus Review.
- Finding production, Finding classification, Finding targeting, criterion definition, applicability determination, coverage computation, or evaluator identity — all owned by RFC-0006 v1.2 and consumed here only by reference.
- Current-Projection selection, current-applicability determination, acceptance evaluation, or escalation — all owned by RFC-0011 v1.2.
- Rebasing, refresh-in-place, Projection substitution, reopening, or mutation of an existing Corpus Review; no such mechanism is defined by this specification.
- Finding deduplication, consolidation, supersession, or conflict resolution across Corpus Findings or across Corpus Reviews.
- Autonomous correction of any artifact referenced by a Corpus Artifact Reference, or any Corpus Correction Set.
- Corpus mutation or repository file editing of any kind — a Corpus Artifact Reference is an identity-and-exact-revision-only reference; this specification never reads, writes, or otherwise mutates the artifact it denotes.
- Governance evaluation, Ratification generation, or autonomous Canon or RFC amendment.
- Builder Context Package generation or any implementation handoff.
- Open-ended AI debate, provider voting, adaptive deliberation, or persistent deliberation memory.
- Planner integration or Planning Domain Event publication (RFC-0012).
- Domain Event publication for the Corpus Review domain, or any event subscriber (see Event Publication Boundary, above).
- Mission existence verification, beyond structural `missionId` attribution; see Mission Relationship, above.
- Integration with Execution Roles (RFC-0004), Domain Events (RFC-0005), Adapters (RFC-0008), Knowledge (RFC-0007), or Autonomous Planning (RFC-0012) — each reserved for a later, separately authorized specification amendment and its own implementation governance. This does not apply to RFC-0002 v1.1 Evidence, RFC-0003 Projections, RFC-0006 v1.2 Assessment, or RFC-0011 v1.2 Governance, whose architectural integration contracts are already defined and consumed read-only under v0.6.

---

# Conformance

An implementation of this specification SHALL:

- require an immutable, structural `missionId` with Opening Attribution, an immutable Purpose, an immutable Contract (non-empty, authority-bearing-kind-only, with `Other` entries structurally qualified per Contract Authority-Kind Eligibility), and an immutable, non-empty Scope with no duplicate canonical exact artifact identity, before any Corpus Review may be opened;
- require every Corpus Artifact Reference to carry a well-formed, non-empty `contentDigest`, failing closed otherwise;
- compute Scope, Contract, Basis, and Corpus Finding Reference-set Fingerprints deterministically, order-independently, and reproducibly, via the single Canonical Fingerprint Protocol;
- anchor every Corpus Artifact Reference to an exact RFC-0002 v1.1 Evidence identity and version, and fail closed on any inequality between the artifact's exact identity or `contentDigest` and the anchoring Evidence's `representedContentReference`;
- require every anchoring Evidence to be a member of the bound RFC-0003 Projection's Active Evidence Set, permitting no substitution;
- bind exactly one RFC-0006 v1.2 Assessment Criteria Set (identity, version, and fingerprint) into the Corpus Review Contract, and carry it unchanged into the Corpus Review Basis;
- require the bound RFC-0003 Projection to be fresh at Corpus Review Basis construction, and thereafter treat its identity and version as immutable components of the Basis and its fingerprint;
- treat `CorpusFindingReference` values as contextual designations of RFC-0006 v1.2 Assessment Findings, producing, classifying, and targeting no Finding of its own;
- reject a `CorpusFindingReference` that does not resolve to exactly one Finding of the exact bound Assessment, is duplicated, or leaves the reference set incomplete relative to that Assessment's Findings;
- permit Corpus Review Status transitions only as specified (`Open → Completed`, `Open → Withdrawn`), each terminal and non-reversible;
- reject an `Open → Completed` transition lacking a Human Completion Attestation whose Basis Fingerprint matches exactly and whose attestation origin is `Human`;
- permit an already-open Corpus Review to complete against its exact bound Projection after that Projection has become stale, provided the Snapshot-Preserving Completion conditions hold, and never treat staleness alone as a fail-closed condition;
- require Withdrawal Attribution, including a non-empty reason, for every `Withdrawn` transition;
- derive `readinessClassification` only through the pure four-way mapping over the terminal RFC-0006 Assessment Outcome, never independently supplying, defaulting, or overriding it, and never computing `EscalationRequired`;
- construct a Corpus Readiness Result with exactly the sixteen individually named, directly stored fields specified above, resolving no field indirectly;
- store the complete `corpusFindingReferences` set in full, never omitting it in favour of its fingerprint;
- enforce the five-way historical-bound Projection equality, failing closed on any inequality, and neither store nor compute a resolved current Projection;
- expose a Corpus Readiness Result only for a `Completed` Corpus Review, and never for `Open` or `Withdrawn`;
- never mutate, recompute, or invalidate a `Completed` Corpus Review's Corpus Readiness Result; determine applicability to a changed corpus only by exact Basis Fingerprint comparison;
- define and provide no rebasing, refresh-in-place, Projection substitution, reopening, or mutation mechanism for an existing Corpus Review, and require a new Corpus Review for any newer Projection version;
- store and mutate no `authoritativeStatus`, and never represent a Corpus Readiness Result as currently applicable;
- produce the Corpus Review Diagnostics enumerated above deterministically;
- fail closed on every missing, ambiguous, or invalid reference;
- keep the application service free of any domain computation the aggregate itself owns;
- never mutate Mission state, activate a plan, advance a workflow, authorize implementation, invoke a Builder or provider, or create a `GovernanceDecision`;
- never state or imply, in any Corpus Readiness Result or its classification text, whether implementation, planning, activation, or execution may proceed;
- never state or imply that a Corpus Readiness Result has been accepted through the engineering workflow absent an applicable terminal Approved `GovernanceDecision` recorded under RFC-0011 v1.2;
- construct every `CorpusReviewContextProfile` Context Package as `MissionScoped` only, failing closed on `RepositoryScoped`;
- construct every `CorpusReviewContextProfile` Context Package's `sourceManifest` and `profilePayload` in exact conformance with the state-specific cardinality and export matrix (Reproducible Context Integration, above), failing closed on any forbidden-role presence, missing required role, or export-matrix inconsistency.

---

# Amendment History

- v0.1 — Draft. Directed concept list, Corpus Readiness Result vocabulary, and binding Architectural Boundary directed by the Sprint Owner during Milestone 11 closure preparation, ahead of Milestone 12's formal opening by `NEXUS-RAT-2026-07-18-004`.
- v0.2 — Draft. Separated Finding Severity from a new Corpus Finding Resolution Authority; corrected Corpus Readiness Result computation to a precedence algorithm; replaced the Finding Category enumeration with an eleven-value closed set; hardened the Corpus Review Status lifecycle; clarified identity-only Corpus Artifact References; added the Mission Relationship section (with deferred runtime enforcement); defined Aggregate/Service/Repository ownership; expanded diagnostics.
- v0.3 — Draft. Removed implementation-sequencing language from the normative body (first pass); introduced exact artifact revision identity as an opaque field and the Scope Fingerprint concept; made Mission attribution structurally mandatory while deferring existence verification; introduced Corpus Review Purpose and Corpus Review Contract; added Finding locator and authority references and Finding Origin Attribution; corrected the Observation/Escalation contradiction (first pass); constrained artifact kinds to a closed enumeration; resolved the RFC-0005 dependency contradiction; added the Downstream Readiness-Gate Boundary and Staleness and Applicability Semantics sections; removed repository-technology specifics from Aggregate/Service/Repository Responsibilities.
- v0.4 — Draft. Incorporates the Sprint Owner's fifteen-point correction of v0.3, closing the review-integrity gap in which a Corpus Review could reach `Completed` with zero Findings and produce `Ready` without evidence that review work occurred: (1) introduced the Corpus Review Completion Attestation, requiring an attributable, Human- or DeterministicSystem-authorized attestation bound to the Corpus Review's exact Basis Fingerprint before `Open → Completed` is permitted, and the Review Completion Preconditions section stating this atomically; (2) added Corpus Review Opening Attribution and Withdrawal Attribution, independent of `missionId`; (3) replaced the opaque `artifactRevision` string with a structured Exact Artifact Revision Identity requiring a mandatory SHA-256 `contentDigest`, explicitly excluding mutable labels (`latest`, branch names, tags, bare paths, bare timestamps, unverified version labels) as sole identity; (4) introduced the Canonical Artifact Kind Key (`<enum-value>` or `Other:<normalized-extension-identifier>`), used uniformly in every identity, fingerprint, and eligibility computation; (5) strengthened `CorpusReviewPurpose.Other` with a namespaced extension identifier and Canonical Purpose Key, mirroring (4); (6) introduced the deterministic Corpus Review Contract Fingerprint; (7) closed Contract authority-kind eligibility to a ten-value set, explicitly excluding `ImplementationPlan`/`ImplementationManifest`/`SprintImplementationRecord`/`ReviewHistory` as Scope-only, and defined the `Other`-in-Contract qualification rule; (8) defined the single normative Reference Resolution Model (`affectedArtifactReferenceId` resolves to Scope only; `authorityReferenceIds` resolve to Scope or Contract; no embedded reference copies); (9) specified the single Canonical Fingerprint Protocol (field participation, UTF-8 encoding, collection sorting, unambiguous framing, SHA-256, lowercase hex) governing every fingerprint in this specification; (10) introduced the Corpus Review Basis Fingerprint (`missionId` + Canonical Purpose Key + Scope Fingerprint + Contract Fingerprint); (11) made Corpus Readiness Result self-attributable, carrying its full computation basis, the Corpus Finding-set Fingerprint, and its Completion Attestation reference; (12) removed downstream-gating language from the four outcome definitions, restating them as pure classification and moving all enforcement language into the Downstream Readiness-Gate Boundary section; (13) corrected Finding-correction semantics: a new Finding never corrects a prior one within the same Corpus Review; an erroneous Finding requires withdrawing the Corpus Review and opening a new one; (14) removed remaining Sprint- and Milestone-sequencing language from the normative body, retaining historical authorization only in this document's metadata header and Amendment History, and removed the standalone Implementation Guidance section; (15) preserved every previously approved v0.1–v0.3 concept unweakened (exclusive domain ownership, distinction from RFC-0006 Findings, immutable Mission/Purpose/Scope/Contract, append-only immutable Findings, terminal non-reversible lifecycle, independent Severity/Resolution-Authority, closed Finding Category enumeration, fail-closed diagnostics, order-independent readiness computation, and the exclusion of provider voting, open-ended debate, autonomous Canon/RFC mutation, implicit Governance Decisions, downstream workflow/Mission mutation, and autonomous artifact correction); and corrected Canon 1/Canon 6 relationship wording so that this specification no longer claims to reason over or evaluate artifact content it does not resolve. This draft awaits Sprint Owner final verification before Final ratification.
- v0.5 — Draft. Corrects a Canon 2 — Evidence Before Generation conflict identified during pre-ratification review: v0.4 described a Corpus Readiness Result as "the authoritative output of this specification... not merely advisory," while this specification does not consume RFC-0002 Evidence — an unconditioned authoritative-conclusion claim Canon 2 does not permit absent an Evidence-originated basis. Corrections: (1) added a Canon 2 entry to Relationship to the Kernel Canon, stating that a Corpus Finding and a Corpus Readiness Result are, in form, engineering conclusions, but are not treated as authoritative engineering conclusions under Canon 2 because this specification does not consume RFC-0002 Evidence; (2) added a corresponding disclaiming paragraph to Purpose, immediately following the introduction of Corpus Readiness Result; (3) rewrote the Downstream Readiness-Gate Boundary's opening paragraph to narrow "authoritative" to the specification's own exclusive-ownership sense only, and to state explicitly that a Corpus Readiness Result is not an Evidence-originated engineering conclusion and not accepted through the engineering workflow until a future, separately authorized Evidence integration establishes that; (4) revised the Canon 12 relationship bullet to clarify that attributable completion authority satisfies Canon 12 alone and does not, by itself, confer Canon 2 engineering-conclusion status; (5) removed the word "authoritative" from the `Withdrawn`-state and Corpus Readiness Result introductory sentences, which previously implied by contrast that a `Completed` review's Result was an authoritative conclusion; (6) simplified the Completion Attestation's Provider-exclusion clause to refer to authorizing completion, not "authoritative...completion," to avoid conflating Canon 12 authorization with Canon 2 conclusion-status; (7) added a Conformance bullet binding implementations to never claim Evidence-originated conclusion status or engineering-workflow acceptance for a Corpus Finding or Corpus Readiness Result absent a future Evidence integration. This v0.5 correction is documentation/normative-text only: it changes no aggregate rule, no lifecycle transition, no fingerprint computation, and no diagnostic; it narrows only what this specification claims about the epistemic status of its own outputs. It does not consume, redefine, or amend RFC-0002 Evidence, RFC-0003 Shared Reality, or RFC-0006 Review, and does not introduce any deferred integration beyond what v0.1–v0.4 already deferred. v0.5 was an unratified intermediate Draft, superseded by v0.6 before Sprint Owner sign-off; it was never ratified Final.
- v0.6 — Draft. Authorized by `NEXUS-RAT-2026-07-18-008`, which is dependent on and applied after `NEXUS-RAT-2026-07-18-005` (RFC-0002 v1.1), `NEXUS-RAT-2026-07-18-006` (RFC-0006 v1.2), and `NEXUS-RAT-2026-07-18-007` (RFC-0011 v1.2). Adopts integration-first ownership relocation, resolving the Canon 2 conflict that v0.5 could only disclaim: rather than self-conferring or disclaiming conclusion status, this specification now anchors to Evidence and assessment owned elsewhere. Relocated out of this specification: Evidence Type, Content Representation, `representedContentReference`, and exact-content semantics to RFC-0002 v1.1; assessment, assessment criteria, criterion applicability, Assessment Coverage, Findings, Finding targets, Finding attribution, and recorded Projection basis to RFC-0006 v1.2; policy evaluation, `GovernanceDecision`, escalation, acceptance, Governance Evaluation Input Profiles, and current-Projection applicability to RFC-0011 v1.2. RFC-0003 is consumed read-only and is not amended. Retained by this specification: Corpus identity, Corpus Review Scope, Corpus Review Purpose, Corpus Review Contract declaration, the Corpus Review Basis and its fingerprint, Evidence-anchored artifact binding, `CorpusFindingReference`, the Corpus Readiness Result schema, the Projection Snapshot Lifecycle, and pure readiness classification. Substantive changes: (1) retired `Corpus Finding`, `Corpus Finding Category`, `Corpus Finding Severity`, and `Corpus Finding Resolution Authority` as owned concepts, replacing them with `Corpus Finding Reference` — a contextual designation of an RFC-0006 v1.2 Assessment Finding; (2) replaced the Corpus Artifact Reference identity block with Exact Evidence-Anchored Artifact Binding against RFC-0002 v1.1; (3) added Active Evidence Applicability, requiring every anchoring Evidence to be a member of the bound RFC-0003 Projection's Active Evidence Set, with no substitution permitted; (4) rebuilt the Corpus Review Basis as a nine-component binding that now includes the bound Assessment Criteria Set and the bound RFC-0003 Projection identity and version, with construction-time Projection freshness required; (5) added Assessment Binding to exactly one terminal RFC-0006 v1.2 Assessment for the same Basis; (6) replaced the Corpus Readiness Result in full with a sixteen-field, directly stored, immutable schema, and replaced the Deterministic Readiness Precedence algorithm with a pure four-way mapping over the terminal Assessment Outcome, removing all escalation semantics from this specification; (7) added the five-way historical-bound Projection equality and the RFC-0011 acceptance equality checks; (8) narrowed Completion Attestation to `Human` only, removing the previously claimed `DeterministicSystem` origin as unsupported under Canon 12; (9) added the binding ten-rule Projection Snapshot Lifecycle, establishing freshness at construction, immutable binding, no implicit invalidation, snapshot-preserving completion, historical validity only, no stale Approved, Deferred on stale-but-resolvable, Escalation Required on ambiguity, a new Corpus Review for a new Projection version, and no rebasing mechanism; (10) established that no `authoritativeStatus` is stored or mutated, with authoritative downstream applicability determined externally by RFC-0011 v1.2; (11) reconciled Staleness and Applicability Semantics, the Downstream Readiness-Gate Boundary, Kernel Canon relationships, Diagnostics, Boundaries, Non-Goals, and Conformance with the relocated ownership. Preserved unchanged: the Canonical Fingerprint Protocol; Corpus Review Purpose and the Canonical Purpose Key; Corpus Artifact Kind and the Canonical Artifact Kind Key; the Corpus Review lifecycle states (`Open → Completed` / `Open → Withdrawn`); and all three Mission-Plan-Activation prohibitions. The previously proposed identifiers `-005` (RFC-0006), `-006` (RFC-0011), and `-007` (RFC-0013) circulated during pre-ratification review had no authority, were renumbered, and were never appended to the Ratification Ledger. This draft remains Draft. It is not ratified Final, authorizes no implementation, and activates no Sprint.
- v0.7 — Draft. Authorized by `NEXUS-RAT-2026-07-19-004`, dependent on `NEXUS-RAT-2026-07-19-001` (RFC-0003 v1.1). Adds Reproducible Context Integration: the concrete `CorpusReviewContextProfile` instantiation (`contextPackageProfileId = "CorpusReviewContextProfile"`, `contextPackageProfileVersion = "1"`) of RFC-0003 v1.1's generic Context Package Profile contract. Substantive additions: (1) a Package Scope Constraint requiring RFC-0003 v1.1's `MissionScoped` `PackageScope` variant exclusively, forbidding `RepositoryScoped` for this profile; (2) a state-specific source-role cardinality table (`Open`/`Completed`/`Withdrawn`) requiring exactly `CorpusReviewBasis`/`CorpusReviewScope`/`CorpusReviewContract` in `Open` and `Withdrawn`, forbidding `RFC0006Assessment`, `HumanCompletionAttestation`, `CorpusReadinessResult`, and `CorpusFindingReference` in both of those states, and requiring the complete assessment-lineage set only in `Completed`; (3) a deterministic `sourceManifest` construction ordering; (4) a `packageApplicabilityState` mapping (`InProgress` → `Open`, `HistoricalCompleted` → `Completed`, `Withdrawn` → `Withdrawn`) that RFC-0003 v1.1 itself does not know; (5) a state-specific `profilePayload` export matrix whose absent entries are the exact canonical representation of "not applicable in this state," consistent with the cardinality table; (6) a closed five-RFC applicable-RFC-set (`rfc-0002`, `rfc-0003`, `rfc-0006`, `rfc-0011`, `rfc-0013`) exported as two separately typed `profilePayload` entries per RFC (`applicableRfcVersion.<rfcId>`, `applicableRfcRatificationId.<rfcId>`), partitioned into a base set present in every state and a terminal/full set (`rfc-0006`, `rfc-0011`) present only in `Completed`; (7) a restatement that RFC-0011 governs deterministic Governance acceptance of an existing terminal Corpus Readiness Result and does not ratify, produce, own, or mutate it, consistent with the unmodified Downstream Readiness-Gate Boundary. This amendment introduces zero normative references to RFC-0004 or RFC-0008, cites RFC-0003 v1.1 and, unchanged, RFC-0002 v1.1/RFC-0006 v1.2/RFC-0011 v1.2, redefines no RFC-0003 field, and is additive only: every v0.6 record and rule is preserved unchanged. It does not create `CorpusProjectionSnapshot`, a second Context Package aggregate, a Session Compactor, an Artifact Package, a Handoff Contract, a Decision Ledger, an execution model, or a provider model. This draft remains Draft. It is not ratified Final, authorizes no implementation, and activates no Sprint 78 or Milestone 12 Initial Capability Sequence.
