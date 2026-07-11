# Nexus Implementation Technology Standard

**Status:** Implementation Standard
**Version:** 1.0
**Authority:** Mandatory for all Kernel implementations

---

# Purpose

This document defines the mandatory implementation technology standards for the Nexus repository.

The purpose of this standard is to eliminate implementation ambiguity.

Technology selection is intentionally constrained.

Implementations SHALL conform to these standards unless an explicit Architectural Decision Record (ADR) supersedes them.

---

# Authority

Implementation authority SHALL follow this order:

1. Kernel Canon
2. RFC Specification Suite
3. Implementation Constitution
4. Implementation Technology Standard (this document)
5. Implementation Conventions

Implementations SHALL NOT violate higher authority.

---

# Technology Philosophy

Technology exists to realize the architecture.

Architecture SHALL NOT change to accommodate a framework.

Frameworks are replaceable.

Architectural concepts are not.

Whenever a framework encourages implementation that violates the Kernel Canon, the framework SHALL yield to the architecture.

---

# Required Technology Stack

## Language

TypeScript

Requirements:

- latest stable version
- strict mode enabled
- no implicit any
- exact optional property types
- no unchecked indexed access

The compiler SHALL operate with maximum type safety.

---

## Runtime

Node.js LTS

The Kernel SHALL remain runtime-independent of Visual Studio Code.

---

## Extension Framework

Visual Studio Code Extension API

No abstraction framework shall replace the official API.

---

## Build System

esbuild

Build configuration SHALL remain minimal.

---

## Webview UI

React

Vite

Tailwind CSS

Webviews SHALL be used only when native VS Code components are insufficient.

---

## Native UI

Tree Views

Commands

Status Bar

Quick Pick

Output Channels

These SHALL use the native VS Code APIs.

---

## Validation

Zod

All external contracts SHALL be validated.

Examples:

- adapter requests
- adapter responses
- configuration
- user settings

---

## Logging

Pino

Logs SHALL be structured.

Logs SHALL remain machine-readable.

---

## Testing

Unit Testing

Vitest

Integration Testing

VS Code Extension Test Runner

---

## Persistence

SQLite

Persistence SHALL remain abstracted behind Repository Contracts.

The Kernel SHALL NOT depend directly upon SQLite.

---

## Process Execution

Node child_process

CLI integrations SHALL be isolated behind Adapter implementations.

---

# Folder Structure

The repository SHALL follow capability-based organization.

```
src/
│
├── kernel/
│   ├── mission/
│   ├── evidence/
│   ├── shared-reality/
│   ├── execution/
│   ├── review/
│   ├── knowledge/
│   ├── adapter/
│   ├── host/
│   └── common/
│
├── adapters/
│   ├── claude-cli/
│   ├── copilot-cli/
│   ├── codex-cli/
│   ├── gemini-cli/
│   └── shared/
│
├── hosts/
│   └── vscode/
│
├── infrastructure/
│   ├── persistence/
│   ├── logging/
│   ├── configuration/
│   └── telemetry/
│
├── ui/
│   ├── treeviews/
│   ├── webviews/
│   └── common/
│
├── shared/
│
└── tests/
```

Folders SHALL represent architectural boundaries.

Folders SHALL NOT represent implementation patterns.

---

# Dependency Rules

The following dependencies are permitted.

```
UI
        ↓
Host
        ↓
Kernel
        ↓
Shared
```

```
Adapters
        ↓
Kernel Contracts
```

```
Infrastructure
        ↓
Kernel Contracts
```

The following dependencies are prohibited.

- Kernel → Host
- Kernel → UI
- Kernel → Adapter Implementations
- Kernel → Infrastructure Implementations
- Adapter → Adapter
- UI → Adapter

Dependency inversion SHALL occur through Kernel Contracts.

---

# Dependency Injection

Dependency Injection frameworks SHALL NOT be used.

Constructor Injection SHALL be preferred.

Example:

Mission Capability

↓

Repository

↓

Event Bus

↓

Execution Strategy

---

# Event Bus

The Kernel SHALL provide a lightweight internal Event Bus.

Third-party event frameworks SHALL NOT be introduced without architectural approval.

---

# Repository Pattern

Persistence SHALL be abstracted.

Kernel capabilities SHALL depend only upon Repository Contracts.

---

# Service Design

Implementations SHALL be capability-oriented.

Folders named:

- services
- managers
- helpers
- utilities

SHALL NOT become dumping grounds for unrelated logic.

Each implementation SHALL preserve bounded domain ownership.

---

# Framework Restrictions

The following frameworks SHALL NOT be introduced without an ADR.

- NestJS
- InversifyJS
- Redux
- MobX
- RxJS
- Electron-specific runtime abstractions

Framework additions require explicit architectural justification.

---

# Implementation Principles

Implementations SHALL prioritize:

- readability
- determinism
- explicitness
- low coupling
- high cohesion
- composition
- testability

Implementations SHALL avoid:

- reflection
- global mutable state
- hidden dependencies
- magic configuration
- premature abstraction

---

# Code Generation Rules

AI-generated code SHALL:

- preserve RFC terminology
- preserve aggregate ownership
- preserve event contracts
- preserve state machine rules
- preserve capability boundaries

AI SHALL NOT invent architecture.

AI SHALL stop and report ambiguity instead of making architectural assumptions.

---

# Architectural Compliance

Every Pull Request SHALL satisfy the following.

- Conforms to the Kernel Canon.
- Conforms to the RFC Suite.
- Preserves Domain Schema.
- Preserves Kernel Data Model.
- Preserves State Machine.
- Preserves Event Catalog.
- Preserves Capability Contracts.
- Conforms to this Technology Standard.

Violations SHALL be treated as architectural defects rather than implementation defects.

---

# Future Technology Changes

Technology selections are intentionally conservative.

Technology SHALL evolve only when:

- measurable engineering benefit exists
- architectural compatibility is preserved
- implementation complexity is reduced

Technology changes SHALL be approved through an ADR.

No implementation SHALL independently replace mandatory technologies.
