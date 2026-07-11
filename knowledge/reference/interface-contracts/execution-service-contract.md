# Execution Service Contract

## Contract Owner

- Execution Service

## Purpose

Define role-based assignment and execution session control.

## Interface

- assignTask(command)
- startExecutionSession(command)
- reportExecutionOutcome(command)
- queryExecutionState(query)

## Command/Query Shape

- missionId
- taskId
- role
- adapterCapability
- projectionVersion
- executionOutcome

## Guarantees

- Assignment preserves dependency ordering.
- Execution outcomes are attributable and traceable.
- Provider behavior remains adapter-bounded.
