# RFC-0008 — Kernel Adapter Contract

**Status:** Final
**Version:** 1.1
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Amendment History

- v1.0 — Original specification.
- v1.1 — Adds exact reproducible Context Package consumption (Sprint Owner Ratification `NEXUS-RAT-2026-07-19-002`). Introduces a new, structurally separate `AdapterRequestV1` request type (`Legacy` | `ReproducibleContextBound` discriminated union) alongside the unmodified delivered `AdapterRequest`; historical requests remain valid under their exact original schema, with no added field and no default value assigned to them. The `ReproducibleContextBound` variant carries exactly one `reproducibleContextPackageReference` — RFC-0003 v1.1's `ContextPackageReference`, reused unmodified, carrying the mandatory `pinnedVerificationResultId` — and requires exact pre-consumption resolution verification before provider dispatch. Cites RFC-0003 v1.1 only; introduces no dependency on RFC-0004 or RFC-0013. Depends on `NEXUS-RAT-2026-07-19-001` (RFC-0003 v1.1). No other section of this specification is modified.

---

# Purpose

This specification defines the Kernel Adapter Contract of the Nexus Kernel.

The Kernel Adapter Contract defines the standardized interface through which the Nexus Kernel delegates responsibilities to external systems.

Adapters extend Kernel capabilities without extending Kernel ownership.

Adapters SHALL perform delegated responsibilities.

Adapters SHALL NOT own engineering state.

This specification owns:

- Adapter
- Adapter Contract
- Adapter Capability
- Adapter Request
- Adapter Response
- Adapter Metadata
- Adapter Lifecycle

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 7 — Shared Engineering Roles
- Canon 8 — Replaceable Integrations
- Canon 9 — Deterministic Engineering
- Canon 13 — Contract-Driven Architecture

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0003 — Shared Reality Projection Model
- RFC-0004 — Execution Model
- RFC-0006 — Engineering Assessment Model

Owns:

- Adapter
- Adapter Contract
- Adapter Capability
- Adapter Request
- Adapter Response
- Adapter Metadata
- Adapter Lifecycle

---

# Design Goals

Adapters SHALL be:

- stateless
- deterministic
- replaceable
- capability-declared
- implementation-independent

The Kernel SHALL depend only upon the Adapter Contract.

---

# Domain Ownership

RFC-0008 exclusively owns:

- Adapter
- Adapter Contract
- Adapter Capability
- Adapter Request
- Adapter Response
- Adapter Metadata
- Adapter Lifecycle

Other specifications MAY consume these concepts.

Other specifications SHALL NOT redefine them.

---

# Adapter

An Adapter is a boundary component that enables the Kernel to delegate engineering responsibilities to an external system.

An Adapter SHALL:

- receive Adapter Requests
- perform delegated responsibilities
- return Adapter Responses

Adapters SHALL remain stateless.

---

# Adapter Contract

Every Adapter SHALL implement the Kernel Adapter Contract.

The contract SHALL define:

- request format
- response format
- capability declaration
- supported engineering roles
- protocol version
- metadata requirements

Internal implementation details remain adapter-specific.

---

# Statelessness

Adapters SHALL NOT persist or own:

- Mission
- Mission Plan
- Evidence
- Shared Reality
- Domain Events
- Engineering Assessment
- Engineering Memory

All engineering state SHALL remain within the Kernel.

---

# Adapter Capability

Every Adapter SHALL explicitly declare its capabilities.

Capabilities MAY include:

- Source Code Generation
- Source Code Modification
- Engineering Assessment
- Documentation Generation
- Test Generation
- Static Analysis
- Refactoring
- Policy Evaluation
- Repository Analysis
- Formatting

Capabilities describe technical functions.

Capabilities SHALL NOT redefine Engineering Roles.

---

# Engineering Roles

Engineering Roles are assigned by the Kernel.

Adapters MAY support one or more roles.

Examples include:

- Builder
- Reviewer
- Documentation Reviewer
- Security Reviewer
- Performance Reviewer
- Accessibility Reviewer
- Test Engineer

Role assignment SHALL remain the exclusive responsibility of the Kernel.

---

# Adapter Request

Every Adapter Request SHALL include:

- Engineering Role
- Task
- Context Package
- execution constraints
- applicable policies

Requests SHALL remain immutable.

## Reproducible Context Package Consumption (v1.1)

The delivered `AdapterRequest` type carries `engineeringRole`, `taskId`, `contextPackageReference` (an opaque string reference, not a structured object), `executionConstraints`, and `requestMetadata`, and no discriminator field. This amendment does not modify that type; the delivered `AdapterRequest` schema remains valid under its exact original shape forever, with no added field and no default value assigned to it.

This amendment defines a separate, new, explicitly discriminated request type, `AdapterRequestV1`, carrying a required `adapterRequestContractKind` discriminator with exactly two values, used only when a caller explicitly opts into the v1.1 contract for a new request:

- **`Legacy` variant** — `adapterRequestContractKind = "Legacy"`, plus `engineeringRole`, `taskId`, `contextPackageReference` (string), `executionConstraints`, `requestMetadata` — field-compatible with, but not identical to, the delivered `AdapterRequest` type.
- **`ReproducibleContextBound` variant** — `adapterRequestContractKind = "ReproducibleContextBound"`, plus `engineeringRole`, `taskId`, exactly one `reproducibleContextPackageReference` (RFC-0003 v1.1 `ContextPackageReference`, reused unmodified, carrying the mandatory `pinnedVerificationResultId`), `executionConstraints`, `requestMetadata`.

Invocation of `ReproducibleContextBound` SHALL NOT be inferred from field presence, absence, provider behavior, or conversational context — only from the discriminator's exact value on a request that explicitly uses the `AdapterRequestV1` type.

### Pre-Consumption Resolution Verification (`ReproducibleContextBound` only)

Before provider consumption, resolution SHALL verify, in order, failing closed at first failure: (1) `contextPackageId` and `contextPackageVersion` resolve to an existing package; (2) `contextPackageProfileId` and `contextPackageProfileVersion` identify a profile this Adapter supports; (3) `canonicalSerializationProtocolId` and version match a supported NCCS protocol version; (4) recomputing RFC-0003 v1.1's fingerprint computation over the resolved Semantic Payload equals `packageFingerprint` exactly; (5) every `Required`-classified Durable Source Reference resolves; (6) the Verification Result identified by `pinnedVerificationResultId` is resolved and has `verificationOutcome: Verified` — there is no other selection path; a reference with an unresolvable `pinnedVerificationResultId` fails closed; (7) `packageApplicabilityState` is compatible with the Adapter Request's declared task.

Adapters SHALL NOT independently assemble missing context, infer missing governed state from conversational history, substitute a newer package or a different Verification Result for the exact pinned one, silently accept an unsupported profile, reinterpret identities, mutate the Context Package, select another provider, dispatch themselves, or advance workflow. Fail closed on: missing discriminator on an `AdapterRequestV1`; a `ReproducibleContextBound` request with zero or more than one `reproducibleContextPackageReference`; unresolved package; unresolved `pinnedVerificationResultId`; unsupported profile; malformed reference; stale-as-current applicability; incomplete manifest; fingerprint mismatch.

Every historical request built under the delivered `AdapterRequest` schema remains valid under that exact schema, permanently, with no added field and no default value assigned to it. `AdapterRequestV1` is a separate, additional type for newly constructed requests; its `Legacy` variant is field-compatible with, but never described as byte-for-byte identical to, the delivered type, because it structurally includes one additional required field the delivered type does not have.

This subsection cites RFC-0003 v1.1 only. It introduces zero references to RFC-0004, RFC-0013, Handoff, Engineering Session, or Checkpoint.

---

# Context Consumption

Adapters SHALL consume Context Packages produced by the Kernel.

Adapters SHALL NOT independently assemble engineering understanding.

Engineering understanding SHALL originate exclusively from Shared Reality.

---

# Adapter Response

Every Adapter SHALL return exactly one Adapter Response.

Responses MAY include:

- produced artifacts
- findings
- diagnostics
- execution metadata
- status
- metrics

Responses SHALL remain attributable.

Responses SHALL NOT become Evidence until accepted through the Kernel workflow.

---

# Adapter Metadata

Every Adapter SHALL declare:

- Adapter Identity
- Adapter Version
- Protocol Version
- Supported Capabilities
- Supported Roles

Metadata SHALL remain discoverable.

---

# Adapter Lifecycle

Adapters SHALL progress through:

1. Registered
2. Available
3. Active
4. Completed
5. Unavailable

Lifecycle transitions SHALL remain observable.

---

# Failure Handling

Adapters SHALL report failures.

Adapters SHALL NOT autonomously retry delegated responsibilities unless instructed by the Kernel.

Failures SHALL preserve attribution.

---

# Explainability

Every Adapter SHALL expose sufficient metadata to explain:

- received request
- consumed Context Package version
- produced response
- execution outcome

Hidden adapter behavior SHALL NOT influence Kernel decisions.

---

# Human Adapters

Human participants MAY be represented through Adapters.

Human Adapters SHALL satisfy the same contractual guarantees regarding:

- request handling
- response attribution
- explainability

Human engineering authority SHALL remain governed by the Kernel.

---

# Security Considerations

Adapters SHALL respect:

- repository permissions
- execution policies
- workspace restrictions
- host security policies

Adapters SHALL NOT exceed delegated authority.

---

# Implementation Requirements

Implementations SHALL:

- remain stateless
- implement the Adapter Contract
- expose declared capabilities
- preserve deterministic request handling
- preserve attribution
- support explainable responses
- remain replaceable

Implementation details remain outside the scope of this specification.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# Conformance

A Kernel implementation conforms to RFC-0008 only if every Adapter:

- implements the Kernel Adapter Contract
- remains stateless
- consumes Kernel-produced Context Packages
- declares capabilities
- declares supported Engineering Roles
- produces deterministic Adapter Responses
- preserves attribution
- remains replaceable

Failure to satisfy these guarantees constitutes non-conformance with this specification.
