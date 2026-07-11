# Evidence Service Contract

## Contract Owner

- Evidence Service

## Purpose

Define evidence acquisition, authority resolution, and lineage semantics.

## Interface

- ingestEvidence(command)
- verifyEvidence(command)
- relateEvidence(command)
- resolveAuthoritativeSet(query)

## Command/Query Shape

- evidenceId
- source
- provenance
- confidence
- relationships
- authorityPolicy

## Guarantees

- Evidence is append-only and versioned.
- Provenance and attribution are immutable.
- Conflicting evidence is preserved.
