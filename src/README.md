# Source Architecture Skeleton

## Purpose

Provide implementation-facing placeholders for the Nexus runtime architecture.

## Responsibilities

- Establish kernel, host, adapter, and Adapter boundaries in code
- Hold service contracts and implementation scaffolding
- Prevent host integrations from absorbing engineering workflow logic

## Scope

This directory currently contains architecture-aligned placeholders only; no business logic is implemented.

## Future Evolution

Future work should fill these areas incrementally behind stable contracts and ADR-backed decisions, with complete workflow slices preferred over broad framework expansion.

## Relationship to Shared Reality

The source skeleton exists to reflect how Shared Reality is assembled and used during engineering missions without hardcoding Adapter-specific behavior into the kernel.
