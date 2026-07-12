# Knowledge Service Contract

## Contract Owner

- Knowledge Service

## Purpose

Define capture and evolution of accepted Knowledge.

## Interface

- captureKnowledge(command)
- reviseKnowledge(command)
- queryKnowledge(query)

## Command/Query Shape

- knowledgeId
- originatingMissionId
- missionPlanRevisionId
- supportingEvidence
- supportingReview
- contributingEventIds
- approvingAuthority
- knowledgeScope
- revisionMetadata

## Guarantees

- Knowledge originates only from accepted outcomes.
- Knowledge evolution is revisioned and attributable.
- Provenance is preserved across revisions.
