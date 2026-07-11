# Reference Architecture

## Purpose

Define HOW Nexus is architected using stable service boundaries, interfaces, and data flows derived from the RFC suite.

## Responsibilities

- Translate normative RFC requirements into an architectural service model
- Describe service contracts without implementation detail
- Preserve separation of concerns across Kernel, Host, and Adapters

## Scope

Architecture only. This area does not prescribe runtime libraries, frameworks, protocols, or storage engines.

## Contents

- `kernel-reference-architecture.md`: top-level architecture narrative, topology, and governance constraints
- `kernel-dependency-graph.md`: dependency graph blueprint for DI and package boundaries
- `kernel-service-map.md`: developer-facing bridge from RFC ownership to kernel code boundaries
- `service-catalog/`: one file per kernel service boundary
- `interface-contracts/`: architecture-level service and boundary contracts

## Service-to-Contract Navigation

| Service / Boundary   | Service Definition                                                                 | Interface Contract                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Kernel Control Plane | [service-catalog/kernel-control-plane.md](service-catalog/kernel-control-plane.md) | [interface-contracts/host-ingress-contract.md](interface-contracts/host-ingress-contract.md)             |
| Mission Service      | [service-catalog/mission-service.md](service-catalog/mission-service.md)           | [interface-contracts/mission-service-contract.md](interface-contracts/mission-service-contract.md)       |
| Evidence Service     | [service-catalog/evidence-service.md](service-catalog/evidence-service.md)         | [interface-contracts/evidence-service-contract.md](interface-contracts/evidence-service-contract.md)     |
| Projection Service   | [service-catalog/projection-service.md](service-catalog/projection-service.md)     | [interface-contracts/projection-service-contract.md](interface-contracts/projection-service-contract.md) |
| Execution Service    | [service-catalog/execution-service.md](service-catalog/execution-service.md)       | [interface-contracts/execution-service-contract.md](interface-contracts/execution-service-contract.md)   |
| Review Service       | [service-catalog/review-service.md](service-catalog/review-service.md)             | [interface-contracts/review-service-contract.md](interface-contracts/review-service-contract.md)         |
| Knowledge Service    | [service-catalog/knowledge-service.md](service-catalog/knowledge-service.md)       | [interface-contracts/knowledge-service-contract.md](interface-contracts/knowledge-service-contract.md)   |
| Event Bus            | [service-catalog/event-bus.md](service-catalog/event-bus.md)                       | [interface-contracts/event-bus-contract.md](interface-contracts/event-bus-contract.md)                   |
| Adapter Boundary     | [kernel-reference-architecture.md](kernel-reference-architecture.md)               | [interface-contracts/adapter-boundary-contract.md](interface-contracts/adapter-boundary-contract.md)     |
| Host Boundary        | [kernel-reference-architecture.md](kernel-reference-architecture.md)               | [interface-contracts/host-ingress-contract.md](interface-contracts/host-ingress-contract.md)             |

## Relationship to Specifications

- `knowledge/specifications/` defines WHAT must be true (normative contracts)
- `knowledge/reference/` defines HOW the architecture is composed to satisfy those contracts
