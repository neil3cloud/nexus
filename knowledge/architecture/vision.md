# Vision

## Purpose

Explain the long-term intent of Nexus as a role-based AI engineering workspace.

## Scope

Covers the product-level architectural vision and what distinguishes Nexus from prompt-centric tooling.

## Intended Audience

Maintainers, contributors, architects, and future host implementers.

## Status

Foundational

## Related Documents

- README.md
- principles.md
- system-overview.md

## Vision Statement

Nexus exists to coordinate engineering work inside Visual Studio Code using grounded context, explicit roles, provider-agnostic execution, and structured review.

## Architectural Meaning

The workspace does not begin with a model call. It begins with Shared Reality assembled from engineering evidence. Provider execution is valuable only when the kernel assigns clear responsibilities and validates outcomes against repository evidence.

## Non-Goals

- Building a provider-specific assistant
- Embedding business logic in a host application
- Treating long-term memory infrastructure as the product itself
