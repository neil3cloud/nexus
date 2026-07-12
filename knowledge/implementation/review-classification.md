# Review Classifications

## Purpose

Review findings classify issues identified during implementation review.

The classification determines the required disposition, implementation workflow, and governing authority.

Every review finding SHALL belong to exactly one category.

---

# Categories

## Category 1 — Implementation Defect

Implementation does not satisfy the approved Sprint Specification.

Examples:

- Missing acceptance criteria
- Incorrect implementation
- Broken tests
- Invalid behavior
- Missing validation

Disposition

Builder SHALL correct the implementation.

Governance approval is not required.

---

## Category 2 — Architectural Violation

Implementation violates the Kernel Canon, an RFC, or the Implementation Constitution.

Examples:

- Invalid aggregate ownership
- Undocumented state transition
- Contract violation
- Architectural drift

Disposition

Implementation SHALL stop.

Builder SHALL NOT resolve the violation independently.

Human ratification MAY be required.

---

## Category 3 — Specification Conflict

Two or more governing specifications produce contradictory implementation requirements.

Examples:

- RFC conflict
- RFC vs Reference Document
- Sprint Specification vs RFC
- Conflicting terminology

Disposition

Implementation SHALL stop.

The conflict SHALL be referred for governance resolution.

---

## Category 4 — Documentation Drift

Implementation and documentation are inconsistent.

Examples:

- State machine outdated
- Event catalog missing
- Reference documentation stale
- Sprint report outdated

Disposition

Documentation SHALL be reconciled.

No architectural changes are implied.

---

## Category 5 — Governance Decision Required

Implementation cannot proceed because authority is required.

Examples:

- Scope change
- RFC ownership question
- Human ratification
- Specification ownership

Disposition

Builder SHALL perform no implementation.

Sprint Owner SHALL resolve the governance decision.

---

## Category 6 — Observation

A non-blocking recommendation or quality improvement.

Examples:

- Refactoring opportunity
- Better diagnostics
- Naming improvement
- Documentation suggestion

Disposition

No implementation required.

Observation MAY become future work.

---

# Severity

Every finding SHALL declare one severity.

- Critical
- Major
- Minor
- Informational

Severity indicates impact.

Category indicates workflow.

The two SHALL NOT be conflated.

---

# Builder Actions

| Category                     | Builder Action            |
| ---------------------------- | ------------------------- |
| Implementation Defect        | Fix                       |
| Architectural Violation      | Stop                      |
| Specification Conflict       | Stop                      |
| Documentation Drift          | Update documentation only |
| Governance Decision Required | Wait for ratification     |
| Observation                  | No action unless directed |

---

# Reviewer Responsibility

Reviewer SHALL classify every finding before publication.

A finding SHALL include:

- Category
- Severity
- Authority
- Rationale
- Required Builder Action
