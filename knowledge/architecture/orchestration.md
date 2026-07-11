# Orchestration

## Purpose

Position orchestration as workflow coordination built on Shared Reality rather than the product identity.

## Scope

Explains orchestration boundaries and its dependence on evidence and mission state.

## Intended Audience

Contributors working on planning, coordination, or execution flows.

## Status

Draft

## Related Documents

- ../kernel/execution-strategy.md
- ../engineering/context-assembly.md
- ../specifications/workflows/README.md

## Architectural Position

Orchestration is downstream of understanding. It consumes Shared Reality, selects an execution strategy, assigns roles, and returns outcomes that should improve future engineering work.

## Constraints

- Orchestration must not bypass evidence assembly.
- Orchestration must remain explainable.
- Provider-specific coordination logic belongs behind provider contracts or adapters.
