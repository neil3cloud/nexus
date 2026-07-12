# Evidence Service Contract

## Contract Owner

- Evidence Service

## Purpose

Define Evidence registration, validation, retrieval, and future authority and lineage semantics.

## Implemented Interface — Sprint 5 Evidence Foundation

- registerEvidence(request)
- validateEvidence(evidence)
- retrieveEvidence(evidenceId)
- enumerateEvidence()

## Implemented Command/Query Shape

- id
- type
- version
- hash
- metadata
- provenance

## Deferred Interface

The following operations remain future Evidence capabilities and are not implemented by the Sprint 5 Evidence Foundation slice:

- relateEvidence(command)
- resolveAuthoritativeSet(query)

The earlier reference names `ingestEvidence` and `verifyEvidence` have been reconciled to the implemented Sprint 5 operation names `registerEvidence` and `validateEvidence`.

## Deferred Command/Query Shape

- confidence
- relationships
- authorityPolicy

## Guarantees

- Evidence is append-only and versioned.
- Provenance and attribution are immutable.
- Conflicting evidence is preserved.
