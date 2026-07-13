# Evidence Service

## Owned RFCs

- RFC-0002 - Evidence Model

## Interfaces

- Evidence registration interface
- Evidence validation interface
- Evidence retrieval interface
- Evidence enumeration interface

Deferred interfaces:

- Evidence authority resolution interface
- Evidence relationship and lineage interface

## Responsibilities

- Maintain authoritative evidence lifecycle and provenance
- Preserve immutable evidence history and conflict coexistence
- Coordinate Evidence registration, validation, retrieval, and enumeration
- Resolve active authoritative evidence set (deferred)

## Dependencies

- Host observations
- Adapter outputs
- Event Bus

## Events

- Deferred. Sprint 5 does not publish or subscribe to Evidence events.

## Persistence

- In-memory Evidence repository for Sprint 5 registration, retrieval, and enumeration.
- Durable append-only Evidence store (deferred)
- Provenance and relationship store (deferred)
- Active-authority index (deferred)
