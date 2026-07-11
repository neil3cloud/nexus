# RFC-0009 — Host Contract

**Status:** Final
**Version:** 1.1
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Purpose

This specification defines the Host Contract of the Nexus Kernel.

A **Host** provides the runtime environment in which the Kernel executes.

The Host supplies platform-specific services while the Kernel retains ownership of engineering coordination.

The Host SHALL expose platform capabilities.

The Host SHALL NOT implement engineering logic.

The Host SHALL NOT establish authoritative engineering information.

This specification owns:

- Host
- Host Contract
- Host Capability
- Host Context
- Host Event
- Host Lifecycle

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First
- Canon 2 — Evidence Before Generation
- Canon 9 — Deterministic Engineering
- Canon 13 — Contract-Driven Architecture

Where conflicts exist between this specification and the Kernel Canon, the Kernel Canon SHALL prevail.

---

# Dependencies

Consumes:

- RFC-0001 — Mission Model
- RFC-0002 — Evidence Model
- RFC-0003 — Shared Reality Model
- RFC-0005 — Event Model

Owns:

- Host
- Host Contract
- Host Capability
- Host Context
- Host Event
- Host Lifecycle

---

# Design Goals

Hosts SHALL be:

- platform-specific
- deterministic
- replaceable
- capability-declared
- implementation-independent

The Kernel SHALL depend exclusively upon the Host Contract.

---

# Domain Ownership

RFC-0009 exclusively owns:

- Host
- Host Contract
- Host Capability
- Host Context
- Host Event
- Host Lifecycle

Other specifications MAY consume these concepts.

Other specifications SHALL NOT redefine them.

---

# Host

A Host is the execution environment in which the Nexus Kernel operates.

A Host provides platform services required by the Kernel while remaining independent of engineering behavior.

Examples include:

- Visual Studio Code
- JetBrains IDEs
- Visual Studio
- Command-Line Interface
- Web Application
- Future development environments

A Host SHALL provide runtime services.

A Host SHALL NOT own authoritative engineering information.

---

# Host Contract

Every Host SHALL implement the Host Contract.

The contract SHALL define:

- lifecycle management
- workspace access
- user interaction
- event delivery
- capability declaration
- environment metadata

Implementation details remain Host-specific.

---

# Separation of Responsibilities

The Host owns platform interaction.

The Kernel owns engineering coordination.

The Evidence Model owns engineering truth.

The Host SHALL NOT:

- create Missions
- plan Missions
- compute Shared Reality
- evaluate Evidence
- create Evidence
- resolve Evidence conflicts
- perform Reviews
- evolve Mission Plans
- assign Engineering Roles
- maintain engineering knowledge

These responsibilities belong exclusively to the Kernel or the owning RFC.

---

# Host Capabilities

Every Host SHALL explicitly declare its capabilities.

Capabilities MAY include:

- Workspace Access
- File System Access
- User Interface
- Notifications
- Command Registration
- Configuration
- Diagnostics
- Terminal Access
- Version Control Integration
- Authentication
- Secret Storage

Capabilities describe platform services.

Capabilities SHALL NOT describe engineering behavior.

---

# Workspace Context

Hosts SHALL expose workspace observations required by the Kernel.

Workspace Context MAY include:

- repository location
- workspace folders
- open files
- active editor
- workspace configuration
- diagnostics
- terminal state
- source control status

Workspace Context SHALL remain observational.

Workspace Context SHALL NOT constitute Evidence.

Hosts SHALL NOT interpret engineering meaning.

The Kernel determines whether Workspace observations should be transformed into Evidence in accordance with RFC-0002.

---

# Host Events

Hosts SHALL publish platform events.

Examples include:

- Workspace Opened
- Workspace Closed
- File Created
- File Modified
- File Deleted
- Active Editor Changed
- Command Invoked
- Configuration Changed

Host Events describe platform activity.

Host Events SHALL NOT constitute Engineering Events.

Engineering Domain Events remain governed by RFC-0005.

---

# Host Context

The Host SHALL provide contextual information describing the execution environment.

Examples include:

- operating system
- IDE version
- extension version
- available capabilities
- workspace identity
- session information

Host Context SHALL remain independent of engineering knowledge.

Host Context SHALL NOT become authoritative engineering information.

---

# Evidence Authority

Hosts SHALL treat Evidence as the sole authoritative representation of engineering truth.

Hosts SHALL NOT:

- create authoritative engineering facts
- modify Evidence
- resolve Evidence conflicts
- compute Shared Reality
- establish engineering conclusions

Hosts SHALL provide observations.

The Kernel determines whether observations become Evidence.

---

# Host Lifecycle

Every Host SHALL progress through the following observable lifecycle states:

1. Registered
2. Initialized
3. Ready
4. Active
5. Suspended
6. Shutdown

Lifecycle transitions SHALL be observable.

---

# User Interaction

The Host SHALL provide mechanisms for interaction with users.

Examples include:

- commands
- notifications
- dialogs
- progress indicators
- status reporting
- output channels
- activity views

User interaction SHALL remain outside the Kernel.

---

# Security Responsibilities

The Host SHALL enforce platform security.

Examples include:

- filesystem permissions
- workspace trust
- authentication
- secret storage
- sandbox restrictions

Security enforcement SHALL remain a Host responsibility.

Engineering authorization remains governed by the Kernel.

---

# Configuration

Hosts SHALL expose configuration mechanisms.

Configuration MAY include:

- provider selection
- adapter registration
- logging
- telemetry preferences
- feature enablement

Configuration SHALL NOT redefine Kernel behavior.

---

# Failure Handling

Hosts SHALL report platform failures.

Hosts SHALL preserve attribution.

Hosts SHALL NOT silently recover engineering failures.

Hosts SHALL NOT modify Evidence to recover failures.

Engineering recovery remains the responsibility of the Kernel.

---

# Explainability

Hosts SHALL expose sufficient metadata to explain:

- platform identity
- available capabilities
- lifecycle state
- emitted events
- environmental context

Hidden platform behavior SHALL NOT influence engineering decisions.

---

# Statelessness

Hosts SHALL NOT persist:

- Missions
- Mission Plans
- Evidence
- Shared Reality Projections
- Knowledge Projections
- Reviews
- Engineering Domain Events

Persistent engineering information remains governed by the owning specifications.

---

# Implementation Requirements

Host implementations SHALL:

- implement the Host Contract
- expose declared capabilities
- publish observable lifecycle events
- preserve deterministic behavior
- preserve attribution
- remain replaceable

Implementation details remain outside the scope of this specification.

---

# Conformance

A Host implementation conforms to RFC-0009 only if it:

- implements the Host Contract
- exposes declared capabilities
- publishes Host Events
- preserves separation between platform behavior and engineering behavior
- treats Evidence as the sole authoritative engineering information
- remains replaceable
- does not own authoritative engineering information
- preserves deterministic interaction with the Kernel

Failure to satisfy these guarantees constitutes non-conformance with this specification.

---

# Architectural Principles

## Platform Neutrality

The Kernel SHALL operate independently of any specific Host implementation.

Host-specific behavior SHALL remain isolated within the Host implementation.

---

## Replaceability

Replacing one Host with another SHALL NOT require modification of Kernel behavior.

Only Host implementations MAY change.

Kernel contracts SHALL remain stable.

---

## Platform Abstraction

The Host SHALL abstract platform-specific APIs behind the Host Contract.

The Kernel SHALL NOT depend upon platform-specific APIs.

---

## Observable Execution

All interactions between the Host and the Kernel SHALL be observable.

Hosts SHALL expose sufficient information to support diagnostics, auditing, and troubleshooting.

---

## Deterministic Interaction

Equivalent Host inputs SHALL produce equivalent Host interactions with the Kernel.

Host implementations SHALL avoid introducing nondeterministic engineering behavior.

---

# Security Considerations

Host implementations SHOULD minimize the privileges granted to the Kernel.

Hosts SHALL prevent unauthorized access to platform resources.

Hosts SHALL ensure sensitive platform data remains protected according to Host security policies.

---

# Future Compatibility

Future Host implementations MAY introduce additional capabilities.

New capabilities SHALL:

- preserve backward compatibility
- remain optional unless standardized by a future RFC
- avoid modifying existing Host Contract semantics

Extensions SHALL NOT redefine concepts owned by this specification.
