# Capability Model

## Purpose
Explain capability-based architecture as the stable shape of platform behavior.

## Scope
Covers capability contracts, provider substitution, and boundary design.

## Intended Audience
Architects and implementers defining platform services.

## Status
Foundational

## Related Documents
- principles.md
- orchestration.md
- ../decisions/adr/ADR-0002-capability-based-architecture.md

## Capability First Design

A capability describes a stable architectural behavior, such as assembling evidence, evolving the corpus, planning work, or orchestrating execution.

## Provider Independence

Capabilities should not encode assumptions about a specific model vendor, runtime, or storage engine.

## Contract Guidance

Future specifications should define inputs, outputs, evidence requirements, failure modes, and observability expectations for each capability.
