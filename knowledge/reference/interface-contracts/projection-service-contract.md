# Projection Service Contract

## Contract Owner

- Projection Service

## Purpose

Define deterministic context assembly and projection publication.

## Interface

- assembleContext(query)
- computeProjection(command)
- publishContextPackage(command)
- validateProjectionFreshness(query)

## Command/Query Shape

- missionId
- evidenceSetVersion
- policySetVersion
- projectionScope
- projectionVersion

## Guarantees

- Equivalent inputs produce equivalent projections.
- Projection outputs are explainable and reproducible.
- Stale projections are invalidated.
