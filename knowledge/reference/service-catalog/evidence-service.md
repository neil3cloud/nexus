# Evidence Service

## Owned RFCs

- RFC-0002 - Evidence Model

## Interfaces

- Evidence acquisition and classification interface
- Evidence authority resolution interface
- Evidence relationship and lineage interface

## Responsibilities

- Maintain authoritative evidence lifecycle and provenance
- Preserve immutable evidence history and conflict coexistence
- Resolve active authoritative evidence set

## Dependencies

- Host observations
- Adapter outputs
- Event Bus

## Events

- Publishes EvidenceAcquired, EvidenceVerified, EvidenceConflictDetected, EvidenceAuthorized, EvidenceSuperseded
- Subscribes to ReviewAccepted and policy/approval events

## Persistence

- Append-only evidence store
- Provenance and relationship store
- Active-authority index
