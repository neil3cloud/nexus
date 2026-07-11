# Kernel Service Map

## Purpose

Bridge normative specifications and reference code structure.

This map is developer-facing and answers:

- Which RFC does each service implement?
- What does each service consume?
- What does each service produce?
- Where is the corresponding kernel package boundary?

## Mission Service

Implements

- RFC-0001 - Mission Model

Consumes

- Host mission requests
- Review outcomes and actionable findings
- RFC-0005 domain events

Produces

- Mission definitions and mission plan revisions
- Mission lifecycle transitions
- Mission domain events

Code Boundary

- src/kernel/mission/

---

## Evidence Service

Implements

- RFC-0002 - Evidence Model

Consumes

- Repository observations
- Host context observations
- Adapter outputs accepted by workflow
- Review acceptance outcomes

Produces

- Evidence records
- Authoritative evidence sets
- Evidence conflict and authority events

Code Boundary

- src/kernel/evidence/

---

## Projection Service

Implements

- RFC-0003 - Shared Reality Projection Model

Consumes

- Mission scope and mission objectives
- Authoritative evidence sets
- Repository policy constraints

Produces

- Shared Reality projection views
- Context packages for execution and review
- Projection lifecycle events

Code Boundary

- src/kernel/projection/

---

## Execution Service

Implements

- RFC-0004 - Execution Model

Consumes

- Projection context packages
- Mission plan tasks and dependency graph
- Adapter capabilities

Produces

- Role assignments
- Execution session outcomes
- Execution lifecycle events

Code Boundary

- src/kernel/execution/

---

## Event Bus

Implements

- RFC-0005 - Domain Event Model

Consumes

- Domain events from mission, evidence, projection, execution, review, and knowledge services

Produces

- Ordered immutable event streams
- Event replay views for deterministic reconstruction

Code Boundary

- src/kernel/events/

---

## Review Service

Implements

- RFC-0006 - Engineering Assessment Model

Consumes

- Execution outcomes
- Projection context and authoritative evidence
- Assessment criteria and repository policies
- RFC-0005 domain events

Produces

- Findings and outcomes
- Review lifecycle events
- Inputs for mission evolution and knowledge capture

Code Boundary

- src/kernel/review/

---

## Knowledge Service

Implements

- RFC-0007 - Engineering Memory Model

Consumes

- Accepted review outcomes
- Attributed evidence and provenance
- Mission and event lineage

Produces

- Curated engineering memory revisions
- Knowledge lifecycle events
- Reusable context inputs for future projections

Code Boundary

- src/kernel/knowledge/

---

## Adapter Boundary

Implements

- RFC-0008 - Kernel Adapter Contract

Consumes

- Execution and review delegation requests

Produces

- Attributable adapter responses and diagnostics

Code Boundary

- src/adapters/
- knowledge/reference/interface-contracts/adapter-boundary-contract.md

---

## Host Boundary

Implements

- RFC-0009 - Host Contract

Consumes

- Developer intent and workspace signals

Produces

- Mission ingress requests
- Platform observations for evidence acquisition
- Approvals and interaction outcomes

Code Boundary

- src/hosts/
- knowledge/reference/interface-contracts/host-ingress-contract.md

---

## Boundary Summary Matrix

| Service/Boundary   | Implements | Consumes                                                   | Produces                                                        | Code Boundary          |
| ------------------ | ---------- | ---------------------------------------------------------- | --------------------------------------------------------------- | ---------------------- |
| Mission Service    | RFC-0001   | Host requests, review outcomes, domain events              | Mission definitions, plan revisions, mission events             | src/kernel/mission/    |
| Evidence Service   | RFC-0002   | Repository and host observations, accepted adapter outputs | Evidence records, authoritative sets, evidence events           | src/kernel/evidence/   |
| Projection Service | RFC-0003   | Mission scope, authoritative evidence, policy constraints  | Shared Reality projections, context packages, projection events | src/kernel/projection/ |
| Execution Service  | RFC-0004   | Context packages, task graphs, adapter capabilities        | Assignments, execution outcomes, execution events               | src/kernel/execution/  |
| Event Bus          | RFC-0005   | Domain events from all services                            | Ordered immutable event streams, replay views                   | src/kernel/events/     |
| Review Service     | RFC-0006   | Execution outcomes, projection context, evidence, criteria | Findings, outcomes, review events                               | src/kernel/review/     |
| Knowledge Service  | RFC-0007   | Accepted outcomes, evidence provenance, lineage            | Memory revisions, knowledge events                              | src/kernel/knowledge/  |
| Adapter Boundary   | RFC-0008   | Delegation requests                                        | Adapter responses and diagnostics                               | src/adapters/          |
| Host Boundary      | RFC-0009   | Developer intent and platform signals                      | Mission ingress, observations, approvals                        | src/hosts/             |

## Relationship to Dependency Blueprint

For directional dependency rules and DI/package boundaries, see knowledge/reference/kernel-dependency-graph.md.
