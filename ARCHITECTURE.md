# Architecture Index

This document is an index, not a behavioral specification.

Normative behavior is defined by the Kernel Canon and RFC suite.

## Navigation Flow

Architecture Overview

↓

[Kernel Canon](knowledge/canon/nexus-kernel-canon.md)

↓

[RFC Suite](knowledge/specifications/README.md)

↓

[Reference Architecture](knowledge/reference/README.md)

↓

[Implementation](src/README.md)

## Canonical Sources

- Constitutional source: [knowledge/canon/nexus-kernel-canon.md](knowledge/canon/nexus-kernel-canon.md)
- Normative specifications: [knowledge/specifications/README.md](knowledge/specifications/README.md)
- Architecture HOW: [knowledge/reference/README.md](knowledge/reference/README.md)
- Dependency and DI blueprint: [knowledge/reference/kernel-dependency-graph.md](knowledge/reference/kernel-dependency-graph.md)
- Service-to-code bridge: [knowledge/reference/kernel-service-map.md](knowledge/reference/kernel-service-map.md)
- Source layout: [src/README.md](src/README.md)

## Scope Boundary

- This file should remain index-only.
- Do not place normative rules or architectural behavior definitions here.
- Add new behavior in Canon, RFCs, or Reference Architecture as appropriate.

## Development Strategy

Nexus follows Vertical Slice Architecture.

Implementation proceeds through small, testable increments.

Architectural specifications remain complete before implementation begins.

Development order SHALL NOT imply architectural dependency.

RFCs define architectural contracts.

Sprints define implementation order.
