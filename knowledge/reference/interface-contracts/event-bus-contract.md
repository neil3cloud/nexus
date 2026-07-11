# Event Bus Contract

## Contract Owner

- Event Bus

## Purpose

Define publish, subscribe, and replay behavior for domain events.

## Interface

- publish(event)
- subscribe(subscription)
- replay(streamQuery)

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
