# System Overview

## Purpose
Describe the high-level architectural shape of the platform.

## Scope
Covers layers, responsibilities, and directional dependencies.

## Intended Audience
New contributors and architects seeking a platform map.

## Status
Foundational

## Related Documents
- principles.md
- capability-model.md
- extension-architecture.md

## Layer Model

Developer → Host Application → Nexus Kernel → Capabilities → Adapters → Execution Providers

## Responsibility Boundaries

- Hosts expose user interaction.
- The kernel coordinates platform behavior.
- Capabilities define what Nexus can do.
- Adapters connect Nexus to external systems.
- Providers supply concrete execution strategies.

## Dependency Guidance

Dependencies should flow inward toward stable contracts. External tooling details should not leak upward into host or corpus concepts.
