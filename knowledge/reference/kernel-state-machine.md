# Nexus Kernel State Machine

**Status:** Reference
**Version:** 1.0
**Authority:** Informative (Derived from RFC-0001 through RFC-0009)

---

# Purpose

This document defines the canonical lifecycle state machines of the Nexus Kernel.

The state machines describe the legal lifecycle transitions of Kernel aggregates.

This document does not define implementation.

It defines the allowable evolution of Kernel state.

Behavior is owned by the RFC specification suite.

---

# State Machine Principles

## Deterministic

Equivalent events SHALL produce equivalent transitions.

---

## Explicit

Every transition SHALL be triggered by a Domain Event.

---

## Observable

Every successful transition SHALL emit a Domain Event.

---

## Atomic

A transition either completes successfully or has no observable effect.

---

## Invalid Transitions

Invalid transitions SHALL fail.

Kernel implementations SHALL NOT silently recover from illegal state changes.

---

# Mission Lifecycle

## States

```
Created

↓

Planning

↓

Planned

↓

Executing

↓

Reviewing

↓

Completed
```

Alternative states

```
Paused

Cancelled

Failed
```

---

## Transition Table

| Current    | Event                   | Next      | Notes                |
| ---------- | ----------------------- | --------- | -------------------- |
| Created    | MissionPlanningStarted  | Planning  | Initial planning     |
| Planning   | MissionPlanned          | Planned   | Plan finalized       |
| Planned    | MissionExecutionStarted | Executing | First task begins    |
| Executing  | ReviewStarted           | Reviewing | Awaiting review      |
| Reviewing  | ReviewAccepted          | Completed | Mission finished     |
| Reviewing  | ActionableFindings      | Executing | Mission Plan evolves |
| Any Active | MissionPaused           | Paused    | Manual pause         |
| Paused     | MissionResumed          | Executing | Resume execution     |
| Any Active | MissionCancelled        | Cancelled | Terminal             |
| Any Active | MissionFailed           | Failed    | Terminal             |

---

## Mission Invariants

Mission identity never changes.

Mission objective never changes.

Mission Plan may evolve.

Mission revisions preserve identity.

---

# Mission Plan Lifecycle

## States

```
Draft

↓

Active

↓

Superseded
```

---

## Transition Table

| Current | Event              | Next       |
| ------- | ------------------ | ---------- |
| Draft   | PlanActivated      | Active     |
| Active  | MissionPlanRevised | Superseded |

A Mission may own many Plans.

Only one Plan may be Active.

---

# Task Lifecycle

## States

```
Pending

↓

Ready

↓

Assigned

↓

Executing

↓

Completed
```

Alternative

```
Blocked

Cancelled
```

---

## Transition Table

| Current   | Event                 | Next      |
| --------- | --------------------- | --------- |
| Pending   | DependenciesSatisfied | Ready     |
| Ready     | AssignmentCreated     | Assigned  |
| Assigned  | TaskStarted           | Executing |
| Executing | TaskCompleted         | Completed |
| Any       | DependencyBlocked     | Blocked   |
| Blocked   | DependencyResolved    | Ready     |
| Pending   | TaskCancelled         | Cancelled |

---

## Task Rules

Tasks SHALL belong to one Mission Plan.

Completed Tasks SHALL NOT return to Executing.

Cancelled Tasks SHALL remain terminal.

---

# Review Lifecycle

## States

```
Pending

↓

In Progress

↓

Completed
```

---

## Outcomes

A completed Review SHALL produce exactly one outcome.

Possible outcomes:

```
Accepted

Accepted With Observations

Actionable Findings

Rejected
```

---

## Transition Table

| Current     | Event           | Next        |
| ----------- | --------------- | ----------- |
| Pending     | ReviewStarted   | In Progress |
| In Progress | ReviewCompleted | Completed   |

---

## Review Rules

One Review evaluates one execution.

Reviews are immutable after completion.

---

# Finding Lifecycle

## States

```
Open

↓

Accepted

↓

Resolved
```

Alternative

```
Dismissed
```

---

## Transition Table

| Current  | Event            | Next      |
| -------- | ---------------- | --------- |
| Open     | FindingAccepted  | Accepted  |
| Accepted | FindingResolved  | Resolved  |
| Open     | FindingDismissed | Dismissed |

---

## Rules

Only Actionable Findings may evolve a Mission Plan.

Dismissed Findings SHALL NOT influence execution.

---

# Evidence Lifecycle

Evidence is immutable.

```
Captured

↓

Accepted
```

or

```
Captured

↓

Rejected
```

No further transitions exist.

Evidence corrections SHALL produce new Evidence.

---

# Shared Reality Lifecycle

Shared Reality is computed.

```
Requested

↓

Computing

↓

Available

↓

Obsolete
```

---

## Transition Table

| Current   | Event               | Next      |
| --------- | ------------------- | --------- |
| Requested | ProjectionStarted   | Computing |
| Computing | ProjectionCompleted | Available |
| Available | EvidenceChanged     | Obsolete  |
| Obsolete  | ProjectionRequested | Requested |

---

## Rules

Shared Reality SHALL NOT be edited.

Shared Reality SHALL be regenerated.

---

# Context Package Lifecycle

```
Generating

↓

Ready

↓

Consumed

↓

Expired
```

---

## Rules

Context Packages are immutable.

Expired Context Packages SHALL NOT be reused.

---

# Execution Strategy Lifecycle

```
Draft

↓

Active

↓

Completed
```

Alternative

```
Superseded
```

---

## Rules

Only one Execution Strategy may be Active.

Mission Evolution produces a new Strategy.

---

# Adapter Lifecycle

```
Registered

↓

Available

↓

Busy

↓

Available
```

Alternative

```
Unavailable

Retired
```

---

## Transition Table

| Current     | Event               | Next        |
| ----------- | ------------------- | ----------- |
| Registered  | AdapterEnabled      | Available   |
| Available   | AssignmentReceived  | Busy        |
| Busy        | AssignmentCompleted | Available   |
| Any         | AdapterUnavailable  | Unavailable |
| Unavailable | AdapterRecovered    | Available   |
| Any         | AdapterRetired      | Retired     |

---

# Host Lifecycle

```
Registered

↓

Connected

↓

Active
```

Alternative

```
Disconnected

Retired
```

---

## Rules

Only Active Hosts may execute Kernel operations.

---

# Knowledge Lifecycle

Knowledge is append-only.

```
Candidate

↓

Accepted

↓

Published
```

Rejected knowledge is discarded.

Published Knowledge is immutable.

---

# Domain Event Lifecycle

Domain Events are immutable.

```
Raised

↓

Recorded

↓

Consumed
```

Domain Events SHALL NEVER be modified.

---

# Aggregate Dependencies

```
Mission
    │
    ▼
Mission Plan
    │
    ▼
Task
    │
    ▼
Execution Strategy
    │
    ▼
Adapter
    │
    ▼
Review
    │
    ▼
Finding
    │
    ▼
Mission Evolution
    │
    ▼
Mission Plan Revision
    │
    ▼
Knowledge
```

---

# Kernel Transition Rules

The Kernel SHALL enforce the following:

- Terminal states SHALL NOT transition.
- Invalid transitions SHALL fail.
- Every successful transition SHALL emit a Domain Event.
- Every transition SHALL preserve aggregate consistency.
- Aggregate identity SHALL remain stable.
- Immutable aggregates SHALL never transition through mutation.

---

# Mission Completion Contract

A Mission SHALL enter the Completed state only when all of the following are true:

- The active Mission Plan is complete.
- All Tasks are completed.
- No Task is blocked.
- No Actionable Findings remain open.
- No Mission Evolution is pending.
- Final Review outcome is Accepted.
- Human approval has been granted when required.

---

# Relationship to Other Documents

This document derives its authority from:

1. Kernel Canon
2. RFC Specification Suite
3. Domain Schema
4. Kernel Data Model

Implementations SHALL NOT introduce lifecycle transitions that contradict this document.
