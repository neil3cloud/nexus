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

- Publishes KnowledgeCaptured, KnowledgeUpdated, KnowledgeSuperseded
- Subscribes to ReviewAccepted and approval events

## Persistence

- Revisioned memory store
- Scope and provenance index
