# Host Ingress Contract

## Contract Owner

- Kernel Control Plane

## Purpose

Standardize host-to-kernel workflow ingress.

## Interface

- submitMission(request)
- publishHostObservation(observation)
- submitApproval(decision)
- queryWorkflowStatus(missionId)

## Request Shape

- requestId
- actor
- workspaceContext
- objective
- constraints
- acceptanceCriteria

## Response Shape

- missionId
- accepted
- validationIssues
- orchestrationState

## Invariants

- Host remains observational and does not establish authoritative engineering truth.
- Mission creation is deterministic for equivalent inputs.
