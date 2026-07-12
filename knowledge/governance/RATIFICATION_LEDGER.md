# Nexus Ratification Ledger

**Status:** Authoritative Governance Artifact
**Authority:** NEXUS-RAT-2026-07-12-005
**Purpose:** Permanent system of record for Sprint Owner Ratifications

---

# Ledger Rules

Sprint Owner Ratifications are permanent implementation-governance decisions.

This ledger is the authoritative repository for ratification text. Transient workflow artifacts, including `builder-task.md`, Work Orders, Sprint prompts, and chat conversations, SHALL NOT be the long-term system of record for ratifications.

Ratification entries are immutable historical records. Superseded or withdrawn entries SHALL remain in this ledger and SHALL reference the superseding or withdrawal ratification.

Ratification identifiers SHALL be preserved exactly once assigned.

---

# Ratification Identifier Convention

Ratification identifiers use:

```text
NEXUS-RAT-YYYY-MM-DD-###
```

Where:

- `YYYY-MM-DD` is the ratification date.
- `###` is a three-digit sequence number assigned in issuance order for that date.

If an identifier collision is discovered, the existing assignment remains unchanged and the new ratification receives the next available sequence number unless the Sprint Owner explicitly directs another unused identifier.

---

# NEXUS-RAT-2026-07-12-001

## Ratification Identifier

NEXUS-RAT-2026-07-12-001

## Date

2026-07-12

## Subject

Sprint 5 retroactive Sprint Specification and governance recovery.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-12-008 — Sprint 5 Evidence Foundation governance finding.
- NEXUS-REV-2026-07-12-009 — Remediation verification.

## Governance Decision

The Sprint Owner ratified the Sprint 5 retroactive Sprint Specification as a recoverable governance deviation with no architecture or implementation impact.

## Authorized Builder Scope

- Create and persist the retroactive Sprint 5 Sprint Specification.
- Record the ratification citation in Sprint 5 implementation-layer sections.
- Preserve the already-implemented Sprint 5 Evidence Foundation scope.

## Scope Restrictions

- Documentation only.
- No architecture changes.
- No RFC changes.
- No implementation behavior changes.

## Related Sprint(s)

- Sprint 5 — Evidence Foundation.

## Related Review(s)

- NEXUS-REV-2026-07-12-008.
- NEXUS-REV-2026-07-12-009.
- NEXUS-REV-2026-07-12-010.

## Full Ratification Text

Reconstructed from authoritative repository artifacts:

> Sprint Owner ratified the Sprint 5 process deviation, where implementation initiated before the Sprint Specification was persisted, as a recoverable governance deviation. The Sprint 5 retroactive Sprint Specification is authorized as Governance Recovery and Documentation Only. The ratification has no architecture or implementation impact. Future planned sprints SHALL create the Sprint Specification before implementation begins.

## Current Status

Active

---

# NEXUS-RAT-2026-07-12-002

## Ratification Identifier

NEXUS-RAT-2026-07-12-002

## Date

2026-07-12

## Subject

Sprint 6 deferred-concept tracking and canonical RFC-0003 naming reconciliation.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-12-011-F-002.
- NEXUS-REV-2026-07-12-011-F-003.

## Governance Decision

The Sprint Owner ratified Sprint 6 documentation-only deferral tracking and removed the blocker for canonical RFC-0003 naming reconciliation.

## Authorized Builder Scope

- TASK-001: add Projection Scope and Projection Freshness to Sprint 6 deferred concepts.
- TASK-002: reconcile placeholder contract surfaces to the canonical RFC-0003 naming.
- Authorized targets for TASK-001: `IMPLEMENTATION_MANIFEST.md` and the Sprint 6 record, with optional harmonization in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_REPORT.md`.
- Authorized targets for TASK-002: duplicate projection contract surface, Shared Reality placeholder contract surface, obsolete `SharedRealityService` alias, and consequential type-reference-only placeholder consumers.

## Scope Restrictions

- TASK-001 is documentation only.
- TASK-002 is contract-surface cleanup only.
- The Builder SHALL NOT implement deferred RFC-0003 capabilities.
- The Builder SHALL NOT introduce Context Assembly.
- The Builder SHALL NOT expand Shared Reality functionality.
- The Builder SHALL NOT redesign architecture.
- The Builder SHALL NOT modify RFC ownership.

## Related Sprint(s)

- Sprint 6 — Shared Reality Foundation.

## Related Review(s)

- NEXUS-REV-2026-07-12-011.
- NEXUS-REV-2026-07-12-012.

## Full Ratification Text

Reconstructed from the superseded Builder Task document and surviving review summaries:

> TASK-001 is RATIFIED as a documentation-only update. Authorized targets: IMPLEMENTATION_MANIFEST.md and the Sprint 6 record are mandatory; IMPLEMENTATION_PLAN.md and IMPLEMENTATION_REPORT.md may be harmonized. No source code, RFC, architectural, or scope changes are authorized.
>
> TASK-002 is RATIFIED and the blocker is removed. Canonical RFC-0003 naming is:
>
> | Concept | Canonical Name |
> | --- | --- |
> | Capability | Shared Reality |
> | Domain Model | SharedReality |
> | Application Service | ProjectionService |
> | Request | ProjectionRequest |
> | Result | ProjectionResult |
>
> The `SharedRealityService` alias is not part of the canonical architecture and SHALL be removed unless explicitly reintroduced by a future RFC. Exactly one published `ProjectionRequest` and one published `ProjectionService` contract surface SHALL remain after reconciliation. The Builder SHALL NOT implement deferred RFC-0003 capabilities, introduce Context Assembly, expand Shared Reality functionality, redesign architecture, or modify RFC ownership.

## Current Status

Active

---

# NEXUS-RAT-2026-07-12-003

## Ratification Identifier

NEXUS-RAT-2026-07-12-003

## Date

2026-07-12

## Subject

Sprint 6 residual documentation remediation for projection README and Manifest status.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-12-012-F-001.
- NEXUS-REV-2026-07-12-012-F-002.

## Governance Decision

The Sprint Owner ratified two Sprint 6 residual documentation actions.

## Authorized Builder Scope

- F-001: reconcile or remove the stale `src/kernel/projection/README.md`.
- F-002: synchronize the Sprint 6 status line in `IMPLEMENTATION_MANIFEST.md`.

## Scope Restrictions

- Documentation and repository status reconciliation only.
- For F-001, authorized target is `src/kernel/projection/README.md` only.
- For F-002, authorized target is `IMPLEMENTATION_MANIFEST.md` only.
- No source code changes.
- No architecture changes.
- No RFC changes.
- No implementation of Context Assembly.
- No implementation of any deferred RFC-0003 capability.

## Related Sprint(s)

- Sprint 6 — Shared Reality Foundation.

## Related Review(s)

- NEXUS-REV-2026-07-12-012.
- NEXUS-REV-2026-07-12-013.

## Full Ratification Text

Reconstructed from the superseded Builder Task document and surviving review summaries:

> F-001 is RATIFIED as documentation drift. Authorized target: `src/kernel/projection/README.md` only. The Builder SHALL either reconcile the document with the ratified RFC-0003 terminology or remove obsolete references to reserved Projection responsibilities now deferred or superseded. The README SHALL NOT describe capabilities that are not implemented. Documentation updates only: no source code, architectural, or RFC changes, and no implementation of Context Assembly or any deferred RFC-0003 capability.
>
> F-002 is RATIFIED as repository status reconciliation. Authorized target: `IMPLEMENTATION_MANIFEST.md` only. Synchronize the Sprint 6 status with the approved repository state. No other implementation metadata may be modified except as required for consistency. No code, architectural, or implementation changes are authorized.

## Current Status

Active

---

# NEXUS-RAT-2026-07-12-004

## Ratification Identifier

NEXUS-RAT-2026-07-12-004

## Date

2026-07-12

## Subject

Sprint 6 concurrent-Sprint-Specification governance deviation and Sprint 7+ specification-first workflow.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-12-011-F-001.
- NEXUS-REV-2026-07-12-013-F-002.

## Governance Decision

The Sprint Owner acknowledged and ratified the Sprint 6 recurrence of the concurrent-Sprint-Specification deviation, confirmed the ratification identifier as NEXUS-RAT-2026-07-12-004, and established the mandatory Sprint 7+ specification-first workflow.

## Authorized Builder Scope

- Record the NEXUS-RAT-2026-07-12-004 citation in Sprint 6 governance sections.
- Add Sprint 7 to `IMPLEMENTATION_PLAN.md` in Planned status.

## Scope Restrictions

- Documentation only.
- No implementation work.
- No RFC modifications.
- No architectural changes.
- No Sprint 7 implementation advancement.
- Sprint 7 SHALL NOT transition to Current until its Sprint Specification has been created and persisted.

## Related Sprint(s)

- Sprint 6 — Shared Reality Foundation.
- Sprint 7 — Adapter Framework.

## Related Review(s)

- NEXUS-REV-2026-07-12-011.
- NEXUS-REV-2026-07-12-013.
- NEXUS-REV-2026-07-12-014.

## Full Ratification Text

Reconstructed from the superseded Builder Task document and surviving review summaries:

> Identifier note: the ratification text originally directed the identifier NEXUS-RAT-2026-07-12-002, which was already assigned to the canonical-naming ratification, and -003 was already assigned to the F-001/F-002 documentation ratification. The Sprint Owner confirmed on 2026-07-12 that TASK-003 SHALL use NEXUS-RAT-2026-07-12-004, preserving the ratification ledger sequence: -001 initial governance, -002 canonical naming, -003 documentation, -004 TASK-003 governance. The substance of the ratification is unchanged. Existing -002 citations refer to the canonical-naming ratification and remain correct.
>
> TASK-003 is RATIFIED. The Sprint Owner acknowledges the Sprint 6 recurrence of the concurrent-specification deviation. The implementation remained human-authorized, traceable, and architecturally compliant; the finding does not invalidate Sprint 6. This ratification supersedes the recurring exception observed during Sprint 6.
>
> Governance policy, mandatory beginning with Sprint 7:
>
> 1. The Sprint Specification (Sprint Implementation Record) SHALL be created and persisted before any Builder implementation begins.
> 2. The Sprint SHALL be recorded in `IMPLEMENTATION_PLAN.md` before implementation begins.
> 3. The Sprint SHALL become the authoritative implementation contract for the Builder.
> 4. Inline chat prompts MAY be used to draft a Sprint Specification but SHALL NOT themselves serve as the implementation contract once implementation begins.
> 5. Future deviations from this workflow SHALL require explicit Sprint Owner authorization and SHALL be recorded as governance deviations.
>
> Authorized changes are documentation only: `IMPLEMENTATION_PLAN.md` may add Sprint 7 in Planned status; Sprint 7 SHALL NOT transition to Current until its Sprint Specification is created and persisted. The Sprint 6 Sprint Implementation Record and `IMPLEMENTATION_REPORT.md` Governance Notes may be updated if required. No implementation work, RFC modifications, architectural changes, or Sprint 7 implementation advancement is authorized.

## Current Status

Active

---

# NEXUS-RAT-2026-07-12-005

## Ratification Identifier

NEXUS-RAT-2026-07-12-005

## Date

2026-07-12

## Subject

Durable ratification ledger and ratification governance.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-12-015-F-002.

## Governance Decision

The repository SHALL introduce `knowledge/governance/RATIFICATION_LEDGER.md` as the authoritative repository for all Sprint Owner Ratifications.

## Authorized Builder Scope

- Create the ratification ledger.
- Populate it with NEXUS-RAT-2026-07-12-001, -002, -003, -004, and -005.
- Reconstruct historical entries from authoritative repository artifacts where original text was superseded by transient workflow documents.
- Preserve existing identifiers exactly.
- Add cross-references to related reviews and sprint records where appropriate.
- Update `IMPLEMENTATION_CONSTITUTION.md` to define Sprint Owner Ratifications as permanent governance artifacts, define the Ratification Ledger as the authoritative system of record, define the Ratification Identifier Convention, and define governance artifact precedence where applicable.

## Scope Restrictions

- Documentation changes only.
- The Builder SHALL NOT modify the Kernel Canon.
- The Builder SHALL NOT modify any RFC.
- The Builder SHALL NOT reinterpret previously ratified governance decisions.
- The Builder SHALL NOT alter existing ratification identifiers.
- The Builder SHALL NOT change repository architecture.

## Related Sprint(s)

- Sprint 7 — Adapter Framework.

## Related Review(s)

- NEXUS-REV-2026-07-12-015.

## Full Ratification Text

Recorded from `builder-task.md`:

> TASK-002 is RATIFIED. Sprint Owner Ratifications are implementation-governance decisions and SHALL remain permanently traceable; they SHALL NOT rely on transient workflow artifacts (`builder-task.md`, Work Orders, Sprint prompts, chat conversations) for long-term retention.
>
> Governance Decision: The repository SHALL introduce `knowledge/governance/RATIFICATION_LEDGER.md` as the authoritative repository for all Sprint Owner Ratifications. The ledger SHALL preserve the complete history of every issued ratification. Ratifications SHALL remain immutable historical records; superseded or withdrawn entries SHALL remain in the ledger and reference the superseding or withdrawal ratification.
>
> Required entry fields: Ratification Identifier; Date; Subject; Originating Review Finding(s) where applicable; Governance Decision; Authorized Builder Scope; Scope Restrictions; Related Sprint(s); Related Review(s); Full Ratification Text; Current Status (Active, Superseded, or Withdrawn).
>
> Authorized Builder scope: create the ledger; populate it with NEXUS-RAT-2026-07-12-001, -002, -003, -004, and -005; reconstruct historical entries from authoritative repository artifacts where original text was superseded by transient workflow documents; preserve existing identifiers exactly; add cross-references to related reviews and sprint records where appropriate. Additionally authorized: update `IMPLEMENTATION_CONSTITUTION.md` to define Sprint Owner Ratifications as permanent governance artifacts, define the Ratification Ledger as the authoritative system of record, define the Ratification Identifier Convention, and define governance artifact precedence where applicable.
>
> Scope restrictions: documentation changes only. The Builder SHALL NOT modify the Kernel Canon, modify any RFC, reinterpret previously ratified governance decisions, alter existing ratification identifiers, or change repository architecture.

## Current Status

Active
