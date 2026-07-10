# VS Code Host

## Purpose

Reserve the first host implementation for the Nexus workspace runtime.

## Responsibilities

- Define extension-facing boundaries
- Hold VS Code-specific wiring and presentation concerns
- Delegate engineering workflow behavior to kernel contracts

## Scope

Contains host-only artifacts for the initial extension.

## Future Evolution

This area should remain thin even as the extension grows in commands, views, and settings.

## Relationship to Shared Reality

The VS Code host should surface Shared Reality to developers without owning its logic.
