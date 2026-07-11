# Kernel Events

## Purpose

Reserve the kernel boundary for immutable domain event publication and replay.

## Responsibilities

- Publish ordered mission-domain events
- Preserve causality and attribution metadata
- Support event replay for deterministic reconstruction

## Scope

Focused on event contracts and stream semantics, not transport implementation.

## Relationship to Shared Reality

Events provide auditable progression history that supports explainability for Shared Reality-driven decisions.
