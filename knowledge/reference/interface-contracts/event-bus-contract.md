# Event Bus Contract

## Contract Owner

- Event Bus

## Purpose

Define publish, subscribe, and replay behavior for domain events.

## Interface

- `publish(event: DomainEvent): Promise<void>`
- `subscribe(subscription: EventSubscription): EventSubscriptionHandle`
- `replay(missionId: string): readonly DomainEvent[]`

`replay(missionId)` returns the current process-local Event Stream for the requested Mission, preserving the Mission stream ordering maintained by the Event Bus.

Implementations that support disposal SHALL treat disposal as terminal:

- `publish(event)` rejects with `KernelError` after disposal and SHALL NOT mutate stream state.
- `subscribe(subscription)` rejects with `KernelError` after disposal.
- `replay(missionId)` rejects with `KernelError` after disposal rather than returning a partial stream.

## Event Shape

- eventId
- missionId
- eventType
- timestamp
- causality
- correlationId
- attribution
- payload

## Guarantees

- Events are immutable and append-only.
- Ordering is deterministic per mission stream.
- Causality and correlation are preserved.
- Replay is scoped to a single Mission Event Stream.
- Terminal disposal prevents post-dispose publication from creating partial Event Streams.

## Open Items

- Broader stream-query replay is not part of the current Event Bus contract. If future RFCs require replay across additional dimensions, that capability SHALL be specified before implementation.
