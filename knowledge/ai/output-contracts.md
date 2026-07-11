# Legacy AI Output Contracts

## Purpose

This document preserves an older output format reference.

Current role guidance lives under `../roles/output-contracts.md`.

Structured outputs should still be:

- reviewed consistently
- parsed automatically
- captured as reusable engineering knowledge
- compared across providers
- consumed by future engineering workflows

The output contract remains independent of the underlying AI provider.

---

# General Rules

Every response should:

- be concise
- separate facts from assumptions
- identify uncertainty
- avoid unnecessary prose
- explicitly report risks
- use Markdown headings
- omit sections that are not applicable

---

# Builder Output Contract

Every implementation task should return the following sections.

## Summary

A brief description of what was implemented.

---

## Scope

Describe what was intentionally included.

Describe what was intentionally excluded.

---

## Files Modified

List every modified file.

Example

- src/kernel/context/contextBuilder.ts
- knowledge/specifications/context-assembly.md

---

## Implementation Notes

Describe important implementation decisions.

Explain why specific approaches were chosen.

---

## Assumptions

List assumptions made due to incomplete requirements.

If no assumptions were made, explicitly state:

> None

---

## Risks

Describe known risks.

Examples:

- backward compatibility
- performance
- migration requirements
- future refactoring

---

## Documentation Updated

List documentation changed.

If none:

> No documentation changes required.

---

## Tests

Describe:

- new tests
- modified tests
- manual verification

---

## Remaining Work

List unfinished items.

If complete:

> None

---

# Reviewer Output Contract

Every review should produce the following sections.

## Overall Assessment

One paragraph summarizing implementation quality.

---

## Architecture Alignment

State whether implementation follows:

- ADRs
- architecture
- repository conventions

Possible values

- PASS
- PASS WITH CONCERNS
- FAIL

---

## Correctness

Review implementation correctness.

---

## Maintainability

Review readability.

Review complexity.

Review modularity.

---

## Security

Identify security issues.

If none:

> No security concerns identified.

---

## Performance

Identify performance concerns.

If none:

> No significant performance concerns identified.

---

## Testing

Evaluate testing quality.

Identify missing scenarios.

---

## Documentation

Verify documentation matches implementation.

---

## Findings

Every finding should contain:

### Severity

One of:

- Critical
- Major
- Minor
- Suggestion

---

### Title

Short description.

---

### Evidence

Reference:

- file
- function
- module
- behavior

---

### Impact

Explain why it matters.

---

### Recommendation

Describe how to improve.

---

# Positive Observations

Identify engineering strengths.

Examples:

- reusable abstraction
- improved modularity
- reduced coupling
- better documentation

---

# Approval Status

Possible values

- Approved
- Approved with Minor Recommendations
- Changes Requested
- Rejected

Approval must include justification.

---

# Architect Output Contract

Used when architectural analysis is requested.

Sections

- Problem Statement
- Constraints
- Options Considered
- Trade-offs
- Recommended Option
- Risks
- Architectural Impact
- ADR Required (Yes/No)

---

# Documentation Output Contract

Used when generating documentation.

Sections

- Purpose
- Scope
- Audience
- Content
- Related Documents
- Last Updated

---

# Error Contract

When work cannot continue.

Return

## Blocking Issue

Describe the blocker.

---

## Evidence

Explain why work cannot continue.

---

## Information Required

Describe what is needed.

---

## Recommendation

Suggest next action.

---

# Uncertainty Contract

When confidence is limited.

Return

## Confidence

High

Medium

Low

---

## Uncertain Areas

List unknowns.

---

## Suggested Validation

Describe how to verify assumptions.

---

# Guiding Principle

A response is considered complete only when another engineer can understand:

- what changed
- why it changed
- what assumptions were made
- what risks remain
- what should happen next

without reading the AI's internal reasoning.
