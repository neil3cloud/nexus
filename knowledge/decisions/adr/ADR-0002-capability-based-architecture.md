# ADR-0002 — Capability-Based Architecture

- **Status:** Superseded by ADR-0003
- **Date:** 2026-07-10
- **Related Principles:** Capability-Based Architecture, AI is Replaceable, Host Independence

## Context

AI-assisted tooling often hard-codes vendors, runtimes, or host constraints into its core architecture. That makes evolution expensive and Adapter substitution difficult.

## Decision

At repository initialization, Nexus was framed around stable capabilities rather than AI vendors, model APIs, storage products, or execution technologies.

## Consequences

- The repository started with Adapter-independence as a valid concern.
- The capability-first framing proved too broad for the intended product scope.
- Future architectural work should prefer workflow- and role-based kernel contracts instead.

## Follow-On Guidance

Use this ADR only as historical context. New architectural work should follow ADR-0003 and the role-based engineering workspace model.
