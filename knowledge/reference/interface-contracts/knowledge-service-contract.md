# Knowledge Service Contract

## Contract Owner

- Knowledge Service

## Purpose

Define capture and evolution of accepted engineering memory.

## Interface

- captureMemory(command)
- reviseMemory(command)
- queryMemory(query)

## Command/Query Shape

- memoryId
- originatingMissionId
- supportingEvidence
- supportingAssessment
- scope
- revisionMetadata

## Guarantees

- Memory originates only from accepted outcomes.
- Memory evolution is revisioned and attributable.
- Provenance is preserved across revisions.
