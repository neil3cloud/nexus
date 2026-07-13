# Review Service Contract

## Contract Owner

- Review Service

## Purpose

Define Review (RFC-0006 Engineering Assessment) and Finding lifecycle. Canonical naming ratified by NEXUS-RAT-2026-07-12-006; RFC-0006 owns the underlying semantics.

## Interface

- startReview(command)
- publishFinding(command)
- finalizeReviewOutcome(command)
- queryReviewResult(query)

## Command/Query Shape

- missionId
- missionPlanRevision
- reviewCriteria
- evidenceRefs
- findings
- outcome

## Guarantees

- Outcomes are deterministic for equivalent inputs.
- Findings are evidence-backed and explainable.
- Undocumented preferences do not influence outcomes.
