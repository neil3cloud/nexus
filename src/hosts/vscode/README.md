# VS Code Host

## Purpose
Reserve the first host implementation for the Nexus platform.

## Responsibilities
- Define extension-facing boundaries
- Hold VS Code-specific wiring and presentation concerns
- Delegate platform behavior to kernel contracts

## Scope
Contains host-only artifacts for the initial extension.

## Future Evolution
This area should remain thin even as the extension grows in commands, views, and settings.

## Relationship to the Engineering Corpus
The VS Code host should surface Shared Reality to developers without owning its logic.
