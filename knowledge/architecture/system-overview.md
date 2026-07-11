# System Overview

## Purpose

Describe the high-level architectural shape of Nexus.

## Scope

Covers workflow stages, runtime responsibilities, and directional dependencies.

## Intended Audience

New contributors and architects seeking a system map.

## Status

Foundational

## Related Documents

- repository-layout.md
- extension-architecture.md
- ../kernel/kernel.md
- ../roles/workflow.md

## Workflow Model

Developer Request → Mission → Context Assembly → Shared Reality → Execution Strategy → Role Assignment → Adapter Execution → Review Findings → Developer Approval → Knowledge Update

## Runtime Model

Developer → VS Code Host → Nexus Kernel Services → Adapters → Adapter CLIs and Repository Systems

## Responsibility Boundaries

- The host captures requests and presents outcomes.
- The kernel coordinates engineering workflow.
- Shared Reality is assembled from evidence, not guessed from prompts.
- Execution strategy assigns roles before providers run.
- Providers perform assigned responsibilities without owning repository policy or architecture.

## Dependency Guidance

Dependencies should flow inward toward stable kernel contracts. Adapter- or storage-specific details should not leak into mission, review, or Shared Reality concepts.
