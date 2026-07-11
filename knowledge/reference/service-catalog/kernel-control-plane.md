# Kernel Control Plane

## Owned RFCs

- RFC-0010 - Kernel Boundaries
- RFC-0008 - Kernel Adapter Contract (integration boundary)
- RFC-0009 - Host Contract (integration boundary)

## Interfaces

- Host ingress orchestration interface
- Service coordination interface
- Contract-boundary governance interface

## Responsibilities

- Coordinate end-to-end workflow across domain services
- Enforce boundary rules and responsibility allocation
- Enforce deterministic orchestration and explainability constraints

## Dependencies

- Mission Service
- Evidence Service
- Projection Service
- Execution Service
- Review Service
- Knowledge Service
- Event Bus
- Host boundary
- Adapter boundary

## Events

- Subscribes to mission, evidence, execution, review, and knowledge lifecycle events
- Publishes orchestration progression events

## Persistence

- Transient coordination state only
- No authoritative engineering truth persisted
