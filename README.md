# Nexus

Nexus is a role-based AI engineering workspace for Visual Studio Code.

It improves software engineering by coordinating AI providers through explicit engineering workflows while maintaining a shared understanding of the current project.

## Core Mission

Given an engineering request, Nexus should:

1. Understand the project.
2. Assemble Shared Reality from engineering evidence.
3. Select an execution strategy.
4. Assign engineering roles.
5. Coordinate one or more AI providers.
6. Review and validate implementation.
7. Capture engineering knowledge.
8. Return control to the developer.

## Architectural Commitments

- Shared Reality is an implementation mechanism, not the product identity.
- The kernel remains small and owns mission, context, execution, review, knowledge, and execution strategy.
- Providers are replaceable execution adapters.
- Roles are stable; providers are interchangeable.
- Every feature must directly improve software engineering inside VS Code.

## Scope Boundaries

Nexus does not aim to be an autonomous AI platform, a memory operating system, a distributed multi-agent framework, or a persistent reasoning engine.

## Repository Overview

- `/knowledge` — architectural guidance, decisions, workflows, and engineering evidence
- `/src` — kernel contracts, host integration points, adapters, and implementation scaffolding
- `/tests` — reserved structure for validation layers
- `ARCHITECTURE.md` — top-level architectural orientation for contributors

## Current Status

This repository remains an architectural foundation. The current implementation is intentionally thin, but the documented contracts now align around engineering workflow coordination inside VS Code rather than platform- or capability-first expansion.
