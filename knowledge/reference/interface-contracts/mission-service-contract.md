# Mission Service Contract

## Contract Owner

- Mission Service

## Purpose

Define mission lifecycle and plan coordination interfaces.

## Interface

- createMission(command)
- reviseMissionPlan(command)
- updateTaskGraph(command)
- evaluateMissionCompletion(query)
- transitionMissionState(command)

## Command/Query Shape

- missionId
- missionPlanRevision
- objective
- taskGraphDelta
- transition
- rationale

## Guarantees

- Mission identity is immutable.
- Mission objectives remain stable after mission creation.
- Lifecycle transitions follow RFC-0001 constraints.
