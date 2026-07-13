# Knowledge Service

## Owned RFCs

- RFC-0007 - Knowledge Model

## Interfaces

- Knowledge capture interface
- Knowledge revision interface
- Knowledge lifecycle advancement interface
- Knowledge retrieval interface

## Responsibilities

- Capture reusable engineering understanding from accepted outcomes only
- Preserve provenance, attribution, and revision history
- Provide scoped memory for future context assembly

## Dependencies

- Review Service outcomes
- Evidence Service provenance
- Event Bus

## Events

- Publishes KnowledgeCandidateCreated for completed `captureKnowledge` transitions
- Publishes KnowledgeRevisionCreated for completed `reviseKnowledge` transitions
- Publishes KnowledgeAccepted for completed `approveKnowledge` transitions
- Publishes KnowledgePublished for completed `activateKnowledge` transitions
- Publishes KnowledgeSuperseded for completed `supersedeKnowledge` transitions
- Publishes KnowledgeArchived for completed `archiveKnowledge` transitions
- Does not subscribe to domain events

## Persistence

- Revisioned memory store
- Scope and provenance index
