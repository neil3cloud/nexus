# Nexus Implementation Conventions

**Status:** Implementation Standard
**Version:** 1.0
**Authority:** Mandatory
**Normative Language:** RFC 2119

---

# Purpose

This document defines the implementation conventions for the Nexus repository.

Its purpose is to ensure that every implementation remains consistent regardless of whether it is produced by humans or AI.

Formatting concerns SHALL be delegated to automated tooling whenever possible.

This document governs only conventions that affect maintainability, architectural consistency, and repository organization.

---

# General Principles

Implementation SHALL prioritize:

- readability
- simplicity
- determinism
- explicitness
- maintainability

Implementation SHALL avoid:

- clever code
- hidden behavior
- unnecessary abstractions
- speculative design
- duplicated architectural concepts

---

# File Naming

Files SHALL use lowercase kebab-case.

Examples:

```
mission.aggregate.ts
mission.events.ts
mission.repository.ts
mission.types.ts
review.aggregate.ts
shared-reality.service.ts
```

The following SHALL NOT be used:

```
MissionAggregate.ts
missionAggregate.ts
Mission_Aggregate.ts
```

---

# Folder Naming

Folders SHALL represent architectural boundaries.

Examples:

```
kernel/
mission/
review/
execution/
knowledge/
adapter/
host/
```

Folders SHALL NOT represent implementation patterns.

Avoid folders such as:

```
helpers/
utils/
misc/
common-services/
managers/
```

unless explicitly justified by architecture.

---

# Aggregate Organization

Each Aggregate SHALL reside within its owning capability.

Example:

```
mission/

mission.aggregate.ts
mission.repository.ts
mission.events.ts
mission.types.ts
mission.errors.ts
mission.service.ts
```

Related implementation SHALL remain together.

---

# Import Rules

Imports SHALL follow the following order.

1. Node.js
2. External packages
3. Internal shared libraries
4. Internal capability modules
5. Relative imports

Example:

```typescript
import fs from 'node:fs';

import { z } from 'zod';

import { Identifier } from '@/shared';

import { MissionStatus } from './mission.types';
```

Unused imports SHALL be removed.

Wildcard imports SHOULD be avoided.

---

# Export Rules

Prefer named exports.

Avoid default exports.

Example:

```typescript
export class MissionAggregate {}
```

instead of

```typescript
export default MissionAggregate;
```

---

# Naming

Names SHALL reflect architectural terminology.

Examples:

```
Mission

MissionPlan

ExecutionStrategy

SharedReality

Evidence

Finding
```

Names SHALL NOT invent synonyms.

Avoid:

```
Job

Workflow

Session

Manager

Processor
```

when the RFC already defines the canonical terminology.

---

# Functions

Functions SHALL perform one responsibility.

Functions SHOULD remain small.

Deep nesting SHOULD be avoided.

Early returns are preferred.

---

# Classes

Classes SHALL represent architectural concepts.

Classes SHALL NOT become containers for unrelated behavior.

Large "God Objects" SHALL NOT be introduced.

---

# Interfaces

Interfaces SHALL define contracts.

Interfaces SHALL NOT contain implementation assumptions.

Interfaces SHALL remain stable.

---

# Dependency Injection

Constructor Injection SHALL be used.

Example:

```typescript
new MissionService(repository, eventBus, executionStrategy);
```

Service locators SHALL NOT be introduced.

Dependency Injection frameworks SHALL NOT be introduced.

---

# Error Handling

Errors SHALL be explicit.

Errors SHALL preserve context.

Errors SHALL NOT be silently ignored.

Expected failures SHALL use domain-specific error types.

---

# Logging

Logging SHALL be structured.

Logging SHALL NOT replace error handling.

Sensitive information SHALL NOT be logged.

---

# Comments

Code SHALL explain itself whenever possible.

Comments SHOULD explain:

- architectural intent
- non-obvious decisions
- RFC references

Comments SHALL NOT explain obvious implementation.

Prefer:

```typescript
// RFC-0004: Mission Evolution occurs only through Execution Strategy.
```

Avoid:

```typescript
// increment counter
counter++;
```

---

# TODO Items

TODO comments SHALL include context.

Example:

```typescript
// TODO(RFC-0007): Replace temporary in-memory repository with SQLite implementation.
```

Generic TODOs SHALL NOT be used.

---

# Testing

Test files SHALL mirror implementation structure.

Example:

```
mission.aggregate.ts

mission.aggregate.test.ts
```

Every Aggregate SHALL have unit tests.

Every Capability SHALL have integration tests where appropriate.

---

# Events

Events SHALL remain immutable.

Events SHALL use canonical names.

Examples:

```
MissionCreated

TaskAssigned

ReviewCompleted
```

Commands SHALL NOT be represented as Events.

---

# State

State transitions SHALL follow the Kernel State Machine.

Implementations SHALL NOT introduce undocumented transitions.

---

# Repositories

Repositories SHALL expose domain operations.

Repositories SHALL NOT expose storage implementation.

The Kernel SHALL depend only upon repository contracts.

---

# Configuration

Configuration SHALL be centralized.

Magic values SHALL NOT appear in implementation.

Configuration SHALL be validated before use.

---

# Async Programming

Async operations SHALL use async/await.

Promise chains SHOULD be avoided.

Blocking operations SHALL be avoided.

---

# Nullability

Undefined behavior SHALL be explicit.

Optional values SHALL be modeled intentionally.

Null SHALL be avoided unless required by an external API.

---

# Code Duplication

Minor duplication is preferable to premature abstraction.

Shared abstractions SHALL emerge from repeated implementation rather than anticipation.

---

# Architectural References

Where implementation directly realizes an RFC requirement, developers SHOULD reference the owning RFC.

Example:

```typescript
// RFC-0001 §Mission Completion Contract
```

This improves traceability.

---

# AI Code Generation

AI-generated code SHALL:

- preserve terminology
- preserve aggregate ownership
- preserve contracts
- preserve event semantics
- preserve state transitions

AI SHALL NOT invent architecture.

AI SHALL stop and report ambiguity rather than making assumptions.

---

# Repository Hygiene

Every implementation SHALL leave the repository in a better state.

Before completion:

- remove dead code
- remove unused imports
- remove temporary debugging
- remove commented-out implementation
- remove obsolete TODOs

---

# Continuous Improvement

These conventions SHALL evolve conservatively.

New conventions SHALL solve recurring implementation problems.

Personal preference SHALL NOT justify changes to this document.

Consistency across the repository SHALL take precedence over individual coding style.

# Architectural Traceability

Every non-trivial implementation SHOULD be traceable back to its governing documentation.

Where practical, implementation SHOULD reference:

- Kernel Canon principles
- RFC identifiers
- Domain Schema concepts
- Event Catalog entries
- State Machine transitions

Traceability SHALL improve maintainability and simplify architectural reviews.

Implementation SHALL NOT introduce behavior that cannot be traced to an authoritative document.
