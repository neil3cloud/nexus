# Knowledge Service

## Owned RFCs

- RFC-0007 - Knowledge Model

## Interfaces

- Knowledge capture interface
- Knowledge revision interface
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
- Does not subscribe to domain events
- Deferred: KnowledgeAccepted, KnowledgePublished, KnowledgeSuperseded, and KnowledgeArchived remain unimplemented until their corresponding lifecycle-advancement service operations are authorized

## Persistence

- Revisioned memory store
- Scope and provenance index
