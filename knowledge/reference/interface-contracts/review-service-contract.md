# Review Service Contract

## Contract Owner

- Review Service

## Purpose

Define engineering assessment and finding lifecycle.

## Interface

- startAssessment(command)
- publishFinding(command)
- finalizeAssessmentOutcome(command)
- queryAssessmentResult(query)

## Command/Query Shape

- missionId
- missionPlanRevision
- assessmentCriteria
- evidenceRefs
- findings
- outcome

## Guarantees

- Outcomes are deterministic for equivalent inputs.
- Findings are evidence-backed and explainable.
- Undocumented preferences do not influence outcomes.
