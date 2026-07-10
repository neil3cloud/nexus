# ADR-0002 — Capability-Based Architecture

- **Status:** Accepted
- **Date:** 2026-07-10
- **Related Principles:** Capability-Based Architecture, AI is Replaceable, Host Independence

## Context

AI-assisted tooling often hard-codes vendors, runtimes, or host constraints into its core architecture. That makes evolution expensive and provider substitution difficult.

## Decision

Nexus will be designed around stable capabilities rather than AI vendors, model APIs, storage products, or execution technologies. Providers will implement capability contracts rather than define them.

## Consequences

- Architectural contracts should be expressed in capability terms.
- Provider substitution should not require host or kernel redesign.
- Orchestration logic must depend on capabilities, adapters, and evidence, not vendor-specific behavior.
- Future ADRs should reference this decision when defining new execution or integration paths.

## Follow-On Guidance

When introducing a new integration, first identify which capability it supports and then define the provider or adapter boundary required to implement it.
