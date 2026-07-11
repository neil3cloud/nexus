# Repository Layout

## Purpose

Explain how the repository structure supports the role-based engineering workspace architecture.

## Primary Structure

- `knowledge/` stores architectural guidance, decisions, workflow rules, and engineering evidence.
- `src/` holds kernel contracts, adapters, hosts, and implementation scaffolding.
- `tests/` reserves space for executable validation.

## Knowledge Structure

- `vision/` captures product purpose, principles, and boundaries.
- `kernel/` documents the kernel services and Adapter-facing contracts.
- `roles/` defines stable engineering responsibilities and output expectations.
- `architecture/` explains host integration and repository shape.

## Guidance

Repository structure should mirror stable runtime concepts. Avoid introducing folders that imply autonomous systems, knowledge graph platforms, or Adapter-owned architecture.
