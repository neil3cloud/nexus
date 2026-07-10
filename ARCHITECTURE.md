# Nexus Architecture Overview

Nexus is organized around a stable architectural flow:

Developer → Host Application → Nexus Kernel → Capabilities → Adapters → Execution Providers

## Architectural Priorities

1. Preserve Shared Reality as the center of the platform.
2. Keep host applications thin and replaceable.
3. Define capabilities as durable contracts.
4. Treat providers as interchangeable implementations.
5. Ensure recommendations are explainable through evidence.

## Layer Responsibilities

### Host Applications
Hosts provide interaction surfaces such as VS Code, CLI, or web experiences. They do not own platform business logic.

### Nexus Kernel
The kernel coordinates context assembly, shared reality access, planning, orchestration boundaries, and capability invocation.

### Capabilities
Capabilities represent stable platform behaviors such as evidence assembly, corpus evolution, planning, or orchestration.

### Adapters
Adapters translate between Nexus contracts and external systems such as Git, issue trackers, model APIs, or storage engines.

### Execution Providers
Providers supply concrete execution strategies without changing architectural contracts.

## Shared Reality and the Engineering Corpus

The Engineering Corpus is the evolving body of engineering knowledge that represents project Shared Reality. Nexus capabilities consume and enrich this corpus. The current repository stores initial corpus artifacts under `/knowledge`, but the concept must remain stable even if storage changes over time.

## Implementation Guidance

- Add contracts before implementations.
- Prefer new ADRs over implicit architectural drift.
- Keep cross-layer dependencies explicit and minimal.
- Preserve explainability by linking outcomes to evidence.
