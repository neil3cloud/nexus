# Projection Service

## Owned RFCs

- RFC-0003 - Shared Reality Projection Model

## Interfaces

- Context assembly interface
- Projection materialization interface
- Context package publication interface

## Responsibilities

- Compute mission-scoped shared reality from authoritative evidence
- Preserve deterministic and explainable projection behavior
- Invalidate stale projections and trigger recomputation

## Dependencies

- Mission Service
- Evidence Service
- Event Bus

## Events

- Publishes ProjectionComputed, ProjectionInvalidated, ContextPackagePublished
- Subscribes to MissionPlanRevised, EvidenceAuthorized, EvidenceSuperseded

## Persistence

- Projection cache and version index
- Projection lineage metadata
