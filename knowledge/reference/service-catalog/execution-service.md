# Execution Service

## Owned RFCs

- RFC-0004 - Execution Model

## Interfaces

- Assignment interface
- Execution session interface
- Artifact handoff interface

## Responsibilities

- Coordinate deterministic task execution from mission plans
- Apply execution strategy and role assignment policies
- Preserve execution traceability across adapters/providers

## Dependencies

- Mission Service
- Projection Service
- Adapter boundary
- Event Bus

## Events

- Publishes TaskAssigned, ExecutionStarted, ExecutionCompleted, ExecutionFailed
- Subscribes to MissionPlanRevised, ProjectionInvalidated

## Persistence

- Execution session store
- Assignment and state tracking store
