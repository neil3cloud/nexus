# Mission Service

## Owned RFCs

- RFC-0001 - Mission Model

## Interfaces

- Mission definition interface
- Mission plan and revision interface
- Mission lifecycle and completion interface

## Responsibilities

- Create and maintain mission identity and objective
- Manage mission plans, revisions, and task graph constraints
- Validate mission lifecycle transitions

## Dependencies

- Evidence Service for mission grounding
- Event Bus for domain lifecycle events

## Events

- Publishes MissionCreated, MissionPlanRevised, TaskAdded, MissionCompleted, MissionCancelled, MissionFailed
- Subscribes to ReviewCompleted, ActionableFindingProduced, ExecutionFailed

## Persistence

- Mission aggregate store
- Mission plan and revision store
