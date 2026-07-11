# Review Service

## Owned RFCs

- RFC-0006 - Engineering Assessment Model

## Interfaces

- Assessment interface
- Findings interface
- Outcome interface

## Responsibilities

- Evaluate implementation outcomes against mission criteria and evidence
- Produce explainable, attributable findings and deterministic outcomes
- Gate progression and mission plan evolution

## Dependencies

- Projection Service
- Evidence Service
- Mission Service
- Execution Service outputs
- Event Bus

## Events

- Publishes ReviewStarted, ReviewCompleted, ReviewAccepted, ActionableFindingProduced
- Subscribes to ExecutionCompleted, MissionPlanRevised

## Persistence

- Assessment session store
- Findings and outcomes store
