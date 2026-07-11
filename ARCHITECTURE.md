# Nexus Architecture Overview

Nexus is organized around a stable engineering workflow:

Developer Request → Mission → Context Assembly → Shared Reality → Execution Strategy → Builder → Implementation → Reviewer → Structured Findings → Developer Approval → Knowledge Update

## Architectural Priorities

1. Improve software engineering inside Visual Studio Code.
2. Keep the kernel intentionally small.
3. Assemble Shared Reality from project evidence on demand.
4. Assign stable engineering roles before invoking providers.
5. Keep providers and adapters replaceable.

## Kernel Responsibilities

The kernel should own only the services required to coordinate engineering workflow:

- Mission Service
- Context Service
- Execution Service
- Review Service
- Knowledge Service
- Execution Strategy Service

## Layer Responsibilities

### Host Applications

Hosts provide interaction surfaces such as Visual Studio Code. Hosts gather developer intent and return control to the developer, but they do not own engineering workflow logic.

### Nexus Kernel

The kernel understands the request, assembles Shared Reality, selects execution strategy, assigns roles, coordinates Adapter execution, validates outcomes, and captures reusable engineering knowledge.

### Adapters

Adapters translate between kernel contracts and external systems such as Git, diagnostics, storage, and Adapter CLIs.

### Execution Providers

Providers implement assigned engineering responsibilities. They do not define mission logic, policies, architecture, or repository understanding.

## Shared Reality

Shared Reality is assembled from engineering evidence such as source code, architecture documents, ADRs, repository policies, git state, diagnostics, active mission context, and accepted implementation history.

Shared Reality is a mechanism for reliable engineering coordination. It is not a product identity, autonomous memory system, or knowledge graph platform.

## Implementation Guidance

- Prefer vertical slices over horizontal frameworks.
- Add contracts before implementations when a boundary is stable.
- Prefer new ADRs over implicit architectural drift.
- Keep Adapter-specific details outside the kernel.
- Preserve explainability by linking outcomes to evidence and structured findings.
