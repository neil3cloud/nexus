# Specifications

## Purpose

Provide stable contracts for roles, providers, workflows, events, and Shared Reality concerns.

## Responsibilities

- Hold formal specifications as they emerge
- Separate conceptual contracts from implementations
- Preserve provider-neutral interface definitions

## Scope

Focused on specifications and contracts that can guide implementation across hosts and runtimes.

Specifications define WHAT must be true.

Reference Architecture in `knowledge/reference/` defines HOW services are composed to satisfy these specifications.

## Future Evolution

This area should gradually evolve from placeholders into normative specifications with versioned contracts.

## Transition Plan (WHAT -> HOW Split)

Architecture-oriented content should move to `knowledge/reference/` in phases:

1. Phase 1 - Establish Reference Baseline
   - Create service catalog and interface contracts in `knowledge/reference/`.
   - Keep RFCs normative and architecture-neutral.
2. Phase 2 - Cross-Link and De-Duplicate
   - Replace architecture-detail sections in RFC-adjacent docs with pointers to reference architecture.
   - Preserve normative intent and conformance language in specifications.
3. Phase 3 - Stabilize Governance
   - Treat `knowledge/specifications/` as constitutional WHAT.
   - Treat `knowledge/reference/` as architectural HOW.
   - Track major architecture changes through ADRs and RFC revisions.

## Relationship to Shared Reality

Specifications make Shared Reality operational by defining how workflow contracts interact with repository knowledge and external systems.
