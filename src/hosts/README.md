# Host Layer

## Purpose

Describe user-facing surfaces that integrate with the Nexus workspace runtime.

## Responsibilities

- Translate host interactions into kernel requests
- Keep UI and host concerns isolated
- Avoid embedding business logic

## Scope

Hosts are thin entry points, not the source of architectural truth.

## Future Evolution

Additional hosts such as CLI, web, or JetBrains should be added beside VS Code without changing core contracts.

## Relationship to Shared Reality

Hosts participate in Shared Reality by invoking kernel services and presenting evidence-backed results.
