# Event Bus

## Owned RFCs

- RFC-0005 - Domain Event Model

## Interfaces

- Publish interface
- Subscribe interface
- Replay and query interface

## Responsibilities

- Provide durable, ordered, immutable domain event streams
- Preserve causality, attribution, and auditability
- Enable deterministic reconstruction of mission progression

## Dependencies

- Receives events from all domain services
- Serves all services requiring coordination or replay

## Events

- Carries mission, evidence, projection, execution, review, knowledge, and policy domain events

## Persistence

- Append-only event stream store
- Correlation and causality index
