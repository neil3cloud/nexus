# Nexus Kernel

## Purpose

Describe the small core layer that coordinates engineering workflow inside Nexus.

## Responsibilities

- Understand the developer request as a mission
- Assemble Shared Reality from repository evidence
- Select execution strategy and assign engineering roles
- Coordinate providers, reviews, and knowledge capture

## Scope

Kernel placeholders describe the core runtime services but intentionally omit implementation.

## Future Evolution

This layer should evolve through small, contract-first steps backed by ADRs and vertical workflow slices.

## Kernel Services

- Mission Service
- Evidence Service
- Projection Service
- Execution Service
- Review Service
- Knowledge Service
- Event Bus

## Reference Implementation Layout

```text
src/kernel/
	mission/
	evidence/
	projection/
	execution/
	review/
	knowledge/
	events/
```

This layout intentionally mirrors RFC ownership:

- RFC-0001 -> mission/
- RFC-0002 -> evidence/
- RFC-0003 -> projection/
- RFC-0004 -> execution/
- RFC-0005 -> events/
- RFC-0006 -> review/
- RFC-0007 -> knowledge/

Developer-facing bridge document:

- knowledge/reference/kernel-service-map.md

Compatibility note: existing `shared-reality/` contracts remain available during transition and should converge on `projection/` as the canonical RFC-0003 boundary.

## Relationship to Shared Reality

The kernel is responsible for operationalizing Shared Reality without turning it into a product identity or coupling it to any single provider.
