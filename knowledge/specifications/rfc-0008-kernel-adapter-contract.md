# RFC-0008 — Kernel Adapter Contract

**Status:** Final
**Version:** 1.0
**Authority:** Normative
**Normative Language:** RFC 2119

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
