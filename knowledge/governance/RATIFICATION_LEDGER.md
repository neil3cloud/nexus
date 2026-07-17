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
> | Concept             | Canonical Name    |
> | ------------------- | ----------------- |
> | Capability          | Shared Reality    |
> | Domain Model        | SharedReality     |
> | Application Service | ProjectionService |
> | Request             | ProjectionRequest |
> | Result              | ProjectionResult  |
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

---

# NEXUS-RAT-2026-07-12-006

## Ratification Identifier

NEXUS-RAT-2026-07-12-006

## Date

2026-07-12

## Subject

RFC-0006 ubiquitous-language ratification ("Review" implementation vocabulary) and RFC-0005 citation correction, identified during `/nexus-plan` Sprint 9 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 9 planning.

## Governance Decision

**TASK-001 — RFC-0006 vocabulary.** "Review" is ratified as the canonical implementation-layer vocabulary for RFC-0006 (Engineering Assessment Model) concepts. RFC-0006 remains the sole normative owner of the underlying semantics (assessment lifecycle guarantees, determinism, explainability, attribution, the four-outcome guarantee) and is not modified. The canonical implementation vocabulary is:

| RFC-0006 Normative Term                           | Canonical Implementation Name                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Engineering Assessment / Assessment Session       | `Review`                                                                             |
| Assessment Criteria                               | `ReviewCriteria`                                                                     |
| Assessment Finding                                | `Finding`                                                                            |
| Finding Severity                                  | `Severity`                                                                           |
| Finding Intent                                    | `FindingCategory`                                                                    |
| Observation                                       | `Observation`                                                                        |
| Actionable Finding                                | `ActionableFinding`                                                                  |
| Assessment Outcome                                | `ReviewOutcome` (Accepted / Accepted With Observations / Action Required / Rejected) |
| _(implementation-layer only; not RFC-0006-owned)_ | `ReviewStatus` (`Pending → In Progress → Completed`)                                 |
| _(implementation-layer only; not RFC-0006-owned)_ | `FindingStatus` (`Created → Accepted / Resolved / Dismissed`)                        |

Per Sprint Owner direction, Reference Documents are reconciled to this ratified vocabulary in full, including renaming `kernel-data-model.md`'s pre-existing `FindingIntent` field type and enumeration entry to `FindingCategory`, so that no parallel implementation concept remains. `kernel-state-machine.md`'s fourth Review outcome, previously mislabeled "Actionable Findings," is corrected to RFC-0006's literal "Action Required" — this direction (Reference Document → RFC-0006) is required by the Implementation Constitution's authority order and is not discretionary.

**TASK-002 — RFC-0005 citation correction.** `domain-schema.md` cites "RFC-0005 — Event Coordination Model"; the actual RFC-0005 document is titled "Domain Event Model." The citation is corrected; no vocabulary or semantic change is implied — the Event Domain's aggregate root name (`Domain Event`) was already correct.

## Authorized Builder Scope

- TASK-001: correct the RFC-0006 title citation in `knowledge/reference/domain-schema.md` (citation only; "Review Domain"/"Review" naming retained); correct `knowledge/reference/interface-contracts/review-service-contract.md` operation/field naming from RFC-0006's literal "Assessment" wording to the ratified `Review`-prefixed naming; correct the fourth Review outcome label ("Actionable Findings" → "Action Required") in `knowledge/reference/kernel-state-machine.md` and `knowledge/reference/domain-schema.md`; rename `FindingIntent` → `FindingCategory` in `knowledge/reference/kernel-data-model.md` (both the `Finding.intent` field type and the enumeration list entry).
- TASK-002: correct the RFC-0005 title citation in `knowledge/reference/domain-schema.md`.
- Reference this ratification from the Sprint 9 Sprint Implementation Record.

## Scope Restrictions

- Documentation changes only.
- RFC-0006 and RFC-0005 SHALL NOT be modified under any circumstance. Where a Reference Document conflicts with an RFC's own normative text, the Reference Document is corrected to match the RFC — never the reverse.
- No Kernel Canon changes. (The Kernel Canon also cites "RFC-0006 — Review Model" at `knowledge/canon/nexus-kernel-canon.md:377`; this is noted but explicitly out of scope for this ratification and is not corrected by it.)
- No source code or test changes are authorized by this ratification alone; implementation authorization is governed separately by the Sprint 9 Sprint Implementation Record.
- This ratification governs naming and lifecycle-bookkeeping placement only and SHALL NOT be read as redefining RFC-0006 or RFC-0005 semantics, guarantees, or scope.
- `ReviewStatus` and `FindingStatus` remain implementation-layer operational concepts; they SHALL NOT be presented as RFC-0006-normative concepts in future documentation.

## Related Sprint(s)

- Sprint 9 — Review Foundation (planned).

## Related Review(s)

- None. This ratification precedes Sprint 9 implementation and the corresponding Reviewer cycle.

## Full Ratification Text

> TASK-001 is RATIFIED. "Review" is the canonical implementation-layer vocabulary for RFC-0006 (Engineering Assessment Model). RFC-0006 remains the normative architectural specification and is not modified. The implementation layer SHALL use: `Review`, `ReviewStatus`, `ReviewOutcome`, `FindingCategory`, and `FindingStatus`, per the canonical naming table above. Reference documents SHALL be reconciled to this ratified vocabulary where semantic differences do not alter architectural intent, including renaming `kernel-data-model.md`'s existing `FindingIntent` to `FindingCategory` so no parallel implementation concept remains. Where a Reference Document instead conflicts with an RFC's own normative text (the Review outcome labeled "Actionable Findings" versus RFC-0006's literal "Action Required"), the RFC prevails per the Implementation Constitution's authority order, and the reference document is corrected to match it.
>
> TASK-002 is RATIFIED. The `domain-schema.md` RFC-0005 citation is corrected from "Event Coordination Model" to "Domain Event Model," matching the actual RFC-0005 title. No semantic change.

## Current Status

Active

---

# NEXUS-RAT-2026-07-12-007

## Ratification Identifier

NEXUS-RAT-2026-07-12-007

## Date

2026-07-12

## Subject

Correction of `domain-schema.md`'s Execution Domain Assignment-ownership claim to match the approved Sprint 8 baseline, identified during `/nexus-plan` Sprint 10 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 10 planning.

## Governance Decision

`knowledge/reference/domain-schema.md` § Execution Domain states: "Assignments belong exclusively to an Execution Strategy." Sprint 8 (Approved by NEXUS-REV-2026-07-12-017 and NEXUS-REV-2026-07-12-018) implemented `RoleAssignment` as a standalone, repository-backed Task-to-ExecutionRole relationship with no Execution Strategy aggregate. Per `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability, an Approved Vertical Slice's implemented capabilities are frozen; subsequent sprints "SHALL NOT redefine previously approved behavior" without explicit authorization. The Sprint Owner ratifies that `domain-schema.md` is corrected to match the approved Sprint 8 baseline: `RoleAssignment` remains a standalone relationship, and Execution Strategy (when implemented) references and coordinates existing `RoleAssignment` records rather than exclusively owning them as a nested entity. RFC-0004 itself is not modified — RFC-0004's own text never states that Assignment belongs exclusively to Execution Strategy; that claim originated only in `domain-schema.md`.

## Authorized Builder Scope

- Correct `knowledge/reference/domain-schema.md` § Execution Domain: replace "Assignments belong exclusively to an Execution Strategy" with wording reflecting that Execution Strategy coordinates and references `Assignment`/`RoleAssignment` records, which remain independently owned per the approved Sprint 8 `RoleAssignment` model.
- Reference this ratification from the Sprint 10 Sprint Implementation Record.

## Scope Restrictions

- Documentation changes only.
- RFC-0004 SHALL NOT be modified under any circumstance.
- No Kernel Canon changes.
- No source code or test changes are authorized by this ratification alone; implementation authorization is governed separately by the Sprint 10 Sprint Implementation Record.
- Sprint 8's approved `RoleAssignment` implementation is not reopened, redesigned, or reinterpreted by this ratification; it remains frozen per Approved Vertical Slice Immutability.
- This ratification does not authorize Execution Strategy to restructure, wrap, or absorb existing `RoleAssignment` persistence; it authorizes only that Execution Strategy may reference/coordinate `RoleAssignment` records.

## Related Sprint(s)

- Sprint 8 — Execution Roles (approved baseline being preserved).
- Sprint 10 — Execution Strategy (planned).

## Related Review(s)

- NEXUS-REV-2026-07-12-017.
- NEXUS-REV-2026-07-12-018.

## Full Ratification Text

> The Sprint Owner ratifies that `knowledge/reference/domain-schema.md`'s Execution Domain description is corrected to match the Sprint 8 approved baseline. `RoleAssignment` remains a standalone, independently owned Task-to-ExecutionRole relationship, as approved by NEXUS-REV-2026-07-12-017 and NEXUS-REV-2026-07-12-018. Execution Strategy, when implemented, SHALL coordinate and reference existing `RoleAssignment` records rather than exclusively own them as nested entities. RFC-0004 is not modified; RFC-0004's own text does not assert exclusive Execution Strategy ownership of Assignment — that assertion existed only in the reference document and is corrected there. This ratification does not authorize any Sprint 8 implementation change and does not authorize Execution Strategy implementation scope beyond what a future Sprint 10 Sprint Implementation Record separately defines.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-001

## Ratification Identifier

NEXUS-RAT-2026-07-13-001

## Date

2026-07-13

## Subject

Authorization of an optional `missionId` attribute on the approved Sprint 5 Evidence data model, resolving the Sprint 11 `EvidenceCaptured` RFC-0005 envelope attribution gap.

## Originating Review Finding(s)

- None. Identified by the Builder during Sprint 11 implementation as a pre-implementation blocking Specification Conflict (Category 3) before any code or documentation was changed, and escalated to the Sprint Owner.

## Governance Decision

RFC-0005's Standard Event Envelope requires every Domain Event to carry `missionId` ("Mission identifier for the Mission event stream") with no "when applicable" qualifier. RFC-0002 and the approved Sprint 5 Evidence model (`RegisterEvidenceRequest`, `EvidenceSnapshot` in `src/kernel/evidence/evidence.aggregate.ts`) carry no Mission relationship at all — Evidence is a repository-wide, Mission-independent fact registry by design. Publishing an RFC-0005-conformant `EvidenceCaptured` envelope is therefore impossible without a source for `missionId`.

The Sprint Owner ratifies an additive, backward-compatible extension to the approved Sprint 5 Evidence data model: `RegisterEvidenceRequest` and `EvidenceSnapshot` gain an **optional** `missionId` field. This is a contextual association, not a redefinition of Evidence ownership — RFC-0002 is not modified, and Evidence remains a Mission-independent fact registry; Evidence MAY optionally be associated with the Mission in whose context it was registered, but is never required to be. Existing callers that omit `missionId` are unaffected; no existing Evidence behavior, invariant, or field is changed.

`EvidenceCaptured` (RFC-0005 event, implemented in Sprint 11) includes `missionId` in its envelope only when the underlying Evidence record carries one. When Evidence has no associated Mission, the envelope's `missionId` field is omitted. This is a disclosed, deliberate partial-conformance limitation for Mission-independent Evidence — consistent with the Implementation Constitution's Vertical Slice Policy allowance for partial implementation with explicitly declared limitations — and is not a reinterpretation of RFC-0005's envelope requirement, which remains fully binding for events where a Mission genuinely exists.

## Authorized Builder Scope

- Add an optional `missionId?: string` field to `RegisterEvidenceRequest` and `EvidenceSnapshot` in `src/kernel/evidence/evidence.aggregate.ts`.
- Propagate the optional `missionId` through `Evidence.register`/`Evidence.fromSnapshot` and expose it via a `missionId` getter, consistent with the aggregate's existing field patterns.
- Propagate the optional `missionId` through `EvidenceService.registerEvidence`'s request type.
- Include `missionId` in the `EvidenceCaptured` event envelope when the registered Evidence carries one; omit the envelope field when it does not.
- Reference this ratification from the Sprint 11 Sprint Implementation Record.

## Scope Restrictions

- The added field SHALL be optional; no existing caller of `RegisterEvidenceRequest`, `EvidenceSnapshot`, or `EvidenceService.registerEvidence` is required to supply it.
- No other Sprint 5 Evidence behavior, invariant, value object, or field is modified. `EvidenceId`, `EvidenceType`, `EvidenceVersion`, `EvidenceHash`, `EvidenceMetadata`, and `Provenance` are untouched.
- RFC-0002 SHALL NOT be modified. Evidence SHALL NOT be redefined as Mission-owned; `missionId` is an optional contextual association only.
- RFC-0005 SHALL NOT be modified.
- No Kernel Canon changes.
- This ratification authorizes only the `missionId` field and its use in `EvidenceCaptured`; it does not authorize any other extension to the Sprint 5 Evidence model or the Sprint 11 event scope defined in `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md`.

## Related Sprint(s)

- Sprint 5 — Evidence Foundation (approved baseline being extended).
- Sprint 11 — Domain Event Publication (Evidence, Review) (consuming sprint).

## Related Review(s)

- None yet. This ratification precedes Sprint 11 implementation completion and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies an optional `missionId` field on `RegisterEvidenceRequest` and `EvidenceSnapshot`, extending the approved Sprint 5 Evidence data model additively and backward-compatibly to resolve the RFC-0005 `EvidenceCaptured` envelope attribution gap identified by the Builder before any implementation began. Evidence remains a Mission-independent fact registry per RFC-0002, unmodified; `missionId` is an optional contextual association, not a redefinition of Evidence ownership. `EvidenceCaptured` includes `missionId` in its envelope when the Evidence record carries one, and omits the field when it does not — a disclosed partial-conformance limitation for Mission-independent Evidence, not a reinterpretation of RFC-0005. No other Sprint 5 field, invariant, or behavior changes. RFC-0002, RFC-0005, and the Kernel Canon are not modified.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-002

## Ratification Identifier

NEXUS-RAT-2026-07-13-002

## Date

2026-07-13

## Subject

Remediation direction for the NEXUS-RAT-2026-07-13-001 scope overreach identified in NEXUS-REV-2026-07-13-003-F-001: the Sprint 11 implementation changed the shared, Kernel-wide `DomainEvent`/`DomainEventAttribution` type to make `missionId` optional, exceeding NEXUS-RAT-2026-07-13-001's Authorized Builder Scope. This ratification selects the corrective direction.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-13-003-F-001 — Shared RFC-0005 envelope type relaxed Kernel-wide, beyond NEXUS-RAT-2026-07-13-001's authorized scope (Major).

## Governance Decision

The Sprint Owner selects remediation direction (b) as recommended by REVIEW_HISTORY.md § NEXUS-REV-2026-07-13-003-F-001 and translated as `builder-task.md` TASK-002: the implementation SHALL be narrowed so that only the Evidence event-construction path is affected, rather than relaxing the shared envelope contract.

The Kernel-wide `DomainEvent` contract SHALL remain unchanged: `DomainEvent.missionId` and `DomainEventAttribution.missionId` SHALL be restored to required (`string`), preserving RFC-0005's unqualified Standard Event Envelope requirement at the type level for every domain. `missionId` SHALL remain required for Mission-scoped domain events (Mission, Review, and any future Mission-scoped domain).

The Builder is authorized to introduce an Evidence-specific event publication variant (or equivalent domain-scoped abstraction) that permits omission of `missionId` only for Evidence events produced outside a Mission context. This variant is additional, Evidence-scoped infrastructure; it does not relax the shared `DomainEvent`/`DomainEventAttribution` type used by other domains.

This ratification does not withdraw or supersede NEXUS-RAT-2026-07-13-001, which remains valid for the Evidence data-model extension it authorized (the optional `missionId` field on `RegisterEvidenceRequest`/`EvidenceSnapshot`/`Evidence`). It resolves only the implementation-scope question NEXUS-RAT-2026-07-13-001 did not address: how the `EvidenceCaptured` event itself may structurally omit `missionId` without touching shared Kernel infrastructure.

## Authorized Builder Scope

- Revert `src/kernel/events/domain-event.ts` so `DomainEvent.missionId` and `DomainEventAttribution.missionId` are required (`string`), as they were before Sprint 11.
- Introduce an Evidence-specific event publication variant (or equivalent domain-scoped abstraction) used exclusively by `src/kernel/evidence/evidence.events.ts` that permits `missionId` to be omitted for Evidence events produced outside a Mission context.
- Update `EvidenceDomainEvent` (`src/kernel/evidence/evidence.events.ts`) and `createEvidenceCapturedEvent` to use the new Evidence-specific variant instead of the Kernel-wide `DomainEvent` type where `missionId` must be optional.
- Update `EventBus`/`EventBusContract` only to the extent strictly required to accept and store the Evidence-specific variant without weakening the required-`missionId` guarantee for `DomainEvent`.
- Update `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md` and `IMPLEMENTATION_REPORT.md`'s Sprint 11 section to describe the Evidence-specific variant accurately (closing `builder-task.md` TASK-001 and TASK-003 as part of this remediation, since the deviation they record will no longer exist once this task is complete).
- Reference this ratification, alongside NEXUS-RAT-2026-07-13-001, from the Sprint 11 Sprint Implementation Record.

## Scope Restrictions

- `DomainEvent` and `DomainEventAttribution` (`src/kernel/events/domain-event.ts`) SHALL NOT retain an optional `missionId`; both fields SHALL be required (`string`) upon completion of this task.
- `MissionDomainEvent` and `ReviewDomainEvent` SHALL continue to always supply `missionId`; no behavior change is authorized for Mission or Review event publication.
- RFC-0005 SHALL NOT be modified.
- No Kernel Canon changes.
- No other Sprint 11 concept (event names, publication ordering, deferred concepts) is reopened by this ratification; it authorizes only the structural remediation described above.
- This ratification does not authorize a broader Kernel-wide relaxation of RFC-0005's envelope requirement; direction (a) (ratifying the Kernel-wide change as implemented) is explicitly not selected.

## Related Sprint(s)

- Sprint 11 — Domain Event Publication (Evidence, Review) (remediation of the reviewed slice).

## Related Review(s)

- NEXUS-REV-2026-07-13-003 — Sprint 11 — Domain Event Publication (Evidence, Review); originating finding F-001.

## Full Ratification Text

> The Sprint Owner selects remediation direction (b) for NEXUS-REV-2026-07-13-003-F-001: the Kernel-wide `DomainEvent` contract SHALL remain unchanged, and `missionId` SHALL remain required for Mission-scoped domain events. The Builder is authorized to introduce an Evidence-specific event publication variant (or equivalent domain-scoped abstraction) that permits omission of `missionId` only for Evidence events produced outside a Mission context. No changes to RFC-0005 or the Kernel-wide `DomainEvent` contract are authorized. This ratification does not withdraw NEXUS-RAT-2026-07-13-001.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-003

## Ratification Identifier

NEXUS-RAT-2026-07-13-003

## Date

2026-07-13

## Subject

Canonical implementation-layer vocabulary for RFC-0007 (Knowledge Model), correcting reference-document drift ahead of the Knowledge Foundation sprint. Identified during `/nexus-plan` Sprint 12 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 12 planning.

## Governance Decision

`Knowledge` is ratified as the canonical implementation-layer vocabulary representing the Engineering Memory domain normatively defined by RFC-0007. This ratification establishes implementation terminology only. It does not modify RFC-0007, its semantics, or its ownership. RFC-0007 remains the sole normative owner of the Engineering Memory domain. The Engineering Memory concepts defined by RFC-0007 and the implementation-layer `Knowledge` vocabulary represent the same architectural domain; this ratification establishes implementation naming only and does not create a second domain. This implementation-layer vocabulary aligns with the terminology already used by the Kernel Canon (Canon 11 — Knowledge Through Acceptance) and the majority of reference documentation.

The canonical implementation vocabulary is:

| RFC-0007 Normative Term                                                    | Canonical Implementation Name                                               |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Engineering Memory                                                         | `Knowledge` (aggregate)                                                     |
| _(implementation-layer identity)_                                          | `KnowledgeId`                                                               |
| Memory Lifecycle (`Candidate → Approved → Active → Superseded → Archived`) | `KnowledgeStatus` (`Candidate → Approved → Active → Superseded → Archived`) |
| Memory Scope                                                               | `KnowledgeScope`                                                            |
| Memory Provenance                                                          | `KnowledgeProvenance`                                                       |
| Memory Attribution                                                         | `KnowledgeAttribution`                                                      |

Three previously inconsistent Knowledge/Memory event-name sets exist in the reference corpus (`kernel-event-catalog.md`'s `KnowledgeCandidateCreated`/`KnowledgeAccepted`/`KnowledgePublished`; `knowledge-service.md`'s `KnowledgeCaptured`/`KnowledgeUpdated`/`KnowledgeSuperseded`; and RFC-0007's own 5-state Memory Lifecycle, which neither event set fully covers). Reconciling these, together with `knowledge-service.md`'s described event-subscription/consumer design, is explicitly deferred to the first Knowledge Event Publication vertical slice (RFC-0005 integration), following the established Foundation → Event Publication pattern previously used for Evidence (Sprint 5 → 11) and Review (Sprint 9 → 11).

## Authorized Builder Scope

- Correct `knowledge/reference/kernel-data-model.md` so the Knowledge model includes: `status` (`KnowledgeStatus`), `missionPlanRevisionId`, `supportingReviewId`, `contributingEventIds`, `approvingAuthority` — closing the gap against RFC-0007's Memory Attribution requirements.
- Correct `knowledge/reference/interface-contracts/knowledge-service-contract.md` by replacing `supportingAssessment` with `supportingReview`, consistent with NEXUS-RAT-2026-07-12-006.
- Update implementation-layer reference documentation to consistently use the ratified `Knowledge` vocabulary (e.g. `knowledge/reference/service-catalog/knowledge-service.md`'s "Memory capture/revision/retrieval interfaces" wording), without reconciling the deferred event-name sets or subscription/consumer design described below.
- Reference this ratification from the Sprint 12 Sprint Implementation Record.

## Scope Restrictions

- This ratification authorizes implementation-layer terminology harmonization and reference-document corrections only.
- It does not authorize: modification of RFC-0007; modification of RFC-0006; modification of the Kernel Canon; changes to Engineering Memory semantics; redesign of the Knowledge domain; implementation of Knowledge event publication; introduction of event subscriptions or event consumers.
- No Knowledge event publication is authorized or required by this ratification.
- Reconciliation of the three existing Knowledge/Memory event naming sets (`kernel-event-catalog.md`, `knowledge-service.md`, RFC-0007 Memory Lifecycle), Knowledge domain event publication, Knowledge event subscriptions, Knowledge event consumers, and event-driven Knowledge workflows are explicitly deferred to the first Knowledge Event Publication vertical slice.
- **Implementation Vocabulary Rule (governance rule established by this ratification):** Normative RFC terminology defines architectural semantics. Implementation-layer terminology MAY differ when explicitly ratified by the Sprint Owner, provided the semantics remain identical, the owning RFC remains unchanged, and the implementation vocabulary is used consistently throughout implementation artifacts.

## Related Sprint(s)

- Sprint 12 — Knowledge Foundation (planned).

## Related Review(s)

- None. This ratification precedes Sprint 12 implementation and the corresponding Reviewer cycle.

## Full Ratification Text

> `Knowledge` is RATIFIED as the canonical implementation-layer vocabulary representing the Engineering Memory domain normatively defined by RFC-0007. This ratification establishes implementation terminology only; it does not modify RFC-0007, its semantics, or its ownership, and RFC-0007 remains the sole normative owner of the Engineering Memory domain. The implementation vocabulary SHALL use: `Knowledge` (aggregate), `KnowledgeId`, `KnowledgeStatus` (`Candidate → Approved → Active → Superseded → Archived`), `KnowledgeScope`, `KnowledgeProvenance`, `KnowledgeAttribution`. The Builder is authorized to correct `kernel-data-model.md` (adding `status`, `missionPlanRevisionId`, `supportingReviewId`, `contributingEventIds`, `approvingAuthority` to the Knowledge model), correct `knowledge-service-contract.md` (`supportingAssessment` → `supportingReview`), and update implementation-layer reference documentation to consistently use the ratified vocabulary. Reconciliation of the three existing Knowledge/Memory event naming sets, Knowledge domain event publication, Knowledge event subscriptions, Knowledge event consumers, and event-driven Knowledge workflows are explicitly deferred to the first Knowledge Event Publication vertical slice, following the established Foundation → Event Publication pattern used for Evidence and Review. No Knowledge event publication is authorized or required by this ratification. This ratification does not authorize modification of RFC-0007, RFC-0006, or the Kernel Canon, nor redesign of the Knowledge domain.

## Current Status

Active

## Factual Addendum — 2026-07-13

During Sprint 12 review NEXUS-REV-2026-07-13-006, the Reviewer noted that the Sprint 12 correction to `knowledge/reference/interface-contracts/knowledge-service-contract.md` included changes beyond the ratification's file-specific Authorized Builder Scope bullet naming only `supportingAssessment` -> `supportingReview`.

For audit traceability, the additional Sprint 12 corrections to that file were applied under this ratification's general Authorized Builder Scope bullet permitting implementation-layer reference documentation to consistently use the ratified `Knowledge` vocabulary. The operation-name and identity-name changes (`captureMemory`/`reviseMemory`/`queryMemory` -> `captureKnowledge`/`reviseKnowledge`/`queryKnowledge`, and `memoryId` -> `knowledgeId`) are vocabulary harmonization only. The additional Command/Query Shape fields (`missionPlanRevisionId`, `contributingEventIds`, and `approvingAuthority`) match fields this same ratification separately authorized for the `knowledge/reference/kernel-data-model.md` Knowledge model correction.

This addendum records the implementation-basis clarification for NEXUS-REV-2026-07-13-006-F-001. It does not reinterpret, supersede, withdraw, or otherwise modify NEXUS-RAT-2026-07-13-003.

---

# NEXUS-RAT-2026-07-13-004

## Ratification Identifier

NEXUS-RAT-2026-07-13-004

## Date

2026-07-13

## Subject

Knowledge domain event-name reconciliation, scoping the first Knowledge Event Publication vertical slice. Identified during `/nexus-plan` Sprint 13 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 13 planning.

## Governance Decision

Three previously inconsistent Knowledge/Memory event-name sources existed: `kernel-event-catalog.md` (`KnowledgeCandidateCreated`, `KnowledgeAccepted`, `KnowledgePublished`), `knowledge-service.md` (`KnowledgeCaptured`, `KnowledgeUpdated`, `KnowledgeSuperseded`), and RFC-0007's own 5-state Memory Lifecycle (`Candidate → Approved → Active → Superseded → Archived`), which none of the event-name sets fully covered. Additionally, no source had ever named an event for Memory Evolution (the `reviseKnowledge` operation), and no `KnowledgeService` operation exists today for the `Approved`, `Active`, `Superseded`, or `Archived` transitions — only the `Knowledge` aggregate's `approve()`/`activate()`/`supersede()`/`archive()` methods exist, unreachable through any service operation.

The Sprint Owner ratifies the following reconciliation:

| Operation                       | Event                                                               | Status                   |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------ |
| `captureKnowledge`              | `KnowledgeCandidateCreated` (reused from `kernel-event-catalog.md`) | Authorized for Sprint 13 |
| `reviseKnowledge`               | `KnowledgeRevisionCreated` (new)                                    | Authorized for Sprint 13 |
| _(future)_ `approveKnowledge`   | `KnowledgeAccepted` (reused)                                        | Deferred                 |
| _(future)_ `activateKnowledge`  | `KnowledgePublished` (reused)                                       | Deferred                 |
| _(future)_ `supersedeKnowledge` | `KnowledgeSuperseded` (reused from `knowledge-service.md`)          | Deferred                 |
| _(future)_ `archiveKnowledge`   | `KnowledgeArchived` (new)                                           | Deferred                 |

`KnowledgeRevisionCreated` (not `KnowledgeRevised`, per Sprint Owner direction) is the ratified name for the Memory Evolution event — chosen because it names the resulting fact (a new revision now exists) rather than the action that produced it, consistent with the Governance Rule established below.

**Sprint 13 scope clarification:** Sprint 13 ("Knowledge Event Publication") is authorized to implement event publication **only** for the two `KnowledgeService` operations that exist today — `captureKnowledge` and `reviseKnowledge` — publishing exactly `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` respectively. No other Knowledge event is authorized or required by this ratification.

**Deferred lifecycle operations clarification:** The four lifecycle-advancement `KnowledgeService` operations (`approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge`) and their corresponding events (`KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived`) are explicitly outside Sprint 13 scope and remain deferred to a future sprint. RFC-0007's Memory Lifecycle states beyond `Candidate` remain reachable only via the `Knowledge` aggregate's existing transition methods, not through `KnowledgeService`, until that future sprint. Sprint 13 SHALL NOT introduce these operations even as unpublished/event-silent additions — they remain entirely out of scope, not merely event-silent.

## Governance Rule Established

**Domain events represent completed domain facts, not implementation actions.** An event name SHALL describe the fact that is now true (e.g., "a revision now exists," "an item is now a Candidate") rather than the operation or action that produced it (e.g., not "revision executed" or "capture performed"). This restates and generalizes RFC-0005's own text ("Events SHALL describe completed facts... SHALL NOT describe: commands, requests, intentions, planned work, executable behavior") as a permanent, reusable implementation-governance naming rule for all future Domain Event naming decisions across every domain, not only Knowledge. This rule does not modify RFC-0005; it operationalizes RFC-0005's existing requirement for implementation-layer naming choices.

## Authorized Builder Scope

- Correct `knowledge/reference/kernel-event-catalog.md` § Knowledge Events to add `KnowledgeRevisionCreated` and `KnowledgeArchived` (Producer: Knowledge Service), retaining `KnowledgeCandidateCreated`, `KnowledgeAccepted`, and `KnowledgePublished` unchanged.
- Correct `knowledge/reference/service-catalog/knowledge-service.md`'s Events section to match the table above (published events limited to what Sprint 13 actually implements; deferred events and operations clearly marked as not yet implemented; the "Subscribes to ReviewAccepted and approval events" line remains unauthorized and SHALL be corrected to reflect that no event subscription exists).
- Implement `KnowledgeCandidateCreated` publication on `captureKnowledge` and `KnowledgeRevisionCreated` publication on `reviseKnowledge`, following the established `EvidenceService`/`ReviewService` optional-`EventBusContract` save-then-publish pattern (Sprint 11).
- Reference this ratification from the Sprint 13 Sprint Implementation Record.

## Scope Restrictions

- No `KnowledgeService` operation beyond `captureKnowledge` and `reviseKnowledge` is authorized by this ratification.
- No event beyond `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` is authorized for publication in Sprint 13.
- No event subscription, consumer, or handler is authorized — Knowledge event publication follows the same no-consumers discipline established in Sprint 11's Governance Constraint.
- RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon SHALL NOT be modified.
- This ratification does not authorize implementing the deferred lifecycle-advancement operations or events; a separate future ratification and Sprint Implementation Record are required for that work.

## Related Sprint(s)

- Sprint 12 — Knowledge Foundation (approved baseline being extended).
- Sprint 13 — Knowledge Event Publication (planned).

## Related Review(s)

- None. This ratification precedes Sprint 13 implementation and the corresponding Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies the Knowledge event-name reconciliation table above, naming `KnowledgeCandidateCreated` (reused) for `captureKnowledge` and `KnowledgeRevisionCreated` (new) for `reviseKnowledge`. Sprint 13 ("Knowledge Event Publication") is authorized to implement publication only for these two operations/events; the four lifecycle-advancement operations and their events (`KnowledgeAccepted`/`KnowledgePublished`/`KnowledgeSuperseded`/`KnowledgeArchived`) remain entirely outside Sprint 13 scope, deferred to a future sprint. This ratification establishes a permanent, reusable Governance Rule: Domain events SHALL represent completed domain facts, not implementation actions — an operationalization of RFC-0005's existing "completed facts" requirement for all future event-naming decisions across every domain. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are not modified.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-005

## Ratification Identifier

NEXUS-RAT-2026-07-13-005

## Date

2026-07-13

## Subject

Authorizes implementation of the four Knowledge lifecycle-advancement `KnowledgeService` operations and their corresponding Domain Events, previously deferred by NEXUS-RAT-2026-07-13-004. Identified during `/nexus-plan` Sprint 14 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 14 planning.

## Governance Decision

NEXUS-RAT-2026-07-13-003 and NEXUS-RAT-2026-07-13-004 previously ratified the `KnowledgeStatus` lifecycle, the `Knowledge` aggregate lifecycle methods (`approve()`, `activate()`, `supersede()`, `archive()`), and the corresponding Domain Event names (`KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived`), while explicitly deferring their implementation.

This ratification now authorizes that implementation.

`KnowledgeService` SHALL gain the application-service operations `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge`. Each operation SHALL remain a thin orchestration service that:

- invokes the corresponding approved `Knowledge` aggregate method;
- persists the resulting state transition;
- publishes the corresponding ratified Domain Event only after successful persistence, following the established save-then-publish pattern introduced in Sprint 13.

This sprint SHALL implement the existing approved `Knowledge` aggregate behavior only. It SHALL NOT redefine, extend, or reinterpret the `Knowledge` aggregate's business rules.

RFC-0007 remains the sole normative owner of the Knowledge lifecycle semantics and remains unmodified.

**Governed by:**

- RFC-0007 — Knowledge Model (unmodified)
- RFC-0005 — Domain Event Model (publication pattern only)
- Sprint 12 approved `Knowledge` aggregate baseline
- Sprint 13 approved Domain Event publication pattern

## Governance Rule Established

None new. This ratification applies the Governance Rule established by NEXUS-RAT-2026-07-13-004 (Domain events represent completed domain facts, not implementation actions) to the four already-named lifecycle events; it does not establish a new rule.

## Authorized Builder Scope

- Add `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge` to `KnowledgeServiceContract` and `KnowledgeService`.
- Use minimal request objects containing only `{ knowledgeId }`, consistent with the existing `ReviseKnowledgeRequest` design.
- Publish `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` respectively, only after successful persistence.
- Update `knowledge/reference/service-catalog/knowledge-service.md` and `knowledge/reference/interface-contracts/knowledge-service-contract.md` to document the four new operations.
- Confirm that `knowledge/reference/kernel-event-catalog.md` already reflects the authorized event names and update it only if required for consistency.

## Scope Restrictions

This sprint SHALL NOT:

- introduce additional business rules beyond those already defined by the approved `Knowledge` aggregate;
- redefine or extend the Knowledge lifecycle;
- introduce authorization, policy evaluation, governance workflows, or approval automation;
- introduce successor-reference modeling for superseded Knowledge; future linkage between superseded and successor Knowledge remains deferred;
- introduce event subscriptions, event consumers, or event-driven orchestration;
- modify RFC-0007, RFC-0005, RFC-0006, or the Kernel Canon.

## Architectural Rule

`KnowledgeService` SHALL remain an application orchestration service. All lifecycle validation and transition legality SHALL remain the responsibility of the `Knowledge` aggregate. Domain Events SHALL remain notifications of successfully persisted state transitions and SHALL NOT initiate or coordinate subsequent domain behavior.

## Related Sprint(s)

- Sprint 12 — Knowledge Foundation (approved baseline being extended).
- Sprint 13 — Knowledge Event Publication (approved publication pattern being extended).
- Sprint 14 — Knowledge Lifecycle Advancement (planned).

## Related Review(s)

- None. This ratification precedes Sprint 14 implementation and the corresponding Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies implementation of the four Knowledge lifecycle-advancement `KnowledgeService` operations (`approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, `archiveKnowledge`) and their corresponding, previously-named Domain Events (`KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, `KnowledgeArchived`), each a thin orchestration invoking the corresponding approved `Knowledge` aggregate method, persisting the resulting transition, and publishing the corresponding event only after successful persistence, following the Sprint 13 save-then-publish pattern. This sprint implements existing approved `Knowledge` aggregate behavior only; it does not redefine, extend, or reinterpret the aggregate's business rules, introduce successor-reference modeling for superseded Knowledge, or introduce authorization/policy/event-consumer concepts. RFC-0007, RFC-0005, RFC-0006, and the Kernel Canon are not modified.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-006

## Ratification Identifier

NEXUS-RAT-2026-07-13-006

## Date

2026-07-13

## Subject

Task Lifecycle three-way naming reconciliation, Mission Plan/Task Domain Event producer-role reattribution, and resolution of a pre-existing Mission Plan/Task event catalog duplication, scoping the first Mission Plan/Task Event Publication vertical slice. Identified during `/nexus-plan` Sprint 15 governance scan.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 2 (Governance Scan) prior to Sprint 15 planning. First flagged as a deferred concept in the Sprint 11 record (`knowledge/implementation/sprints/sprint-0011-domain-event-publication.md`) and carried forward, unresolved, through Sprint 13 and Sprint 14.

## Governance Decision

Two compounding governance gaps have blocked Mission Plan and Task Domain Event publication since Sprint 11:

**1. Task Lifecycle three-way naming mismatch.** Three sources describe the Task/Execution state model with different vocabularies:

- The approved, frozen Sprint 3 `TaskStatus` enum (`src/kernel/mission/task.ts`): `Pending → Ready → InProgress → Completed`, alternative `Cancelled` (5 states).
- `knowledge/reference/kernel-state-machine.md` § Task Lifecycle: `Pending → Ready → Assigned → Executing → Completed`, alternative `Blocked`, `Cancelled` (7 states).
- RFC-0004 § Execution State (normative minimum state set): `Pending, Ready, Assigned, Executing, Awaiting Review, Completed, Failed, Blocked` (8 states).

Sprint 3's `TaskStatus` is an Approved Vertical Slice and is frozen per `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability; it SHALL NOT be modified or expanded by this ratification. The Sprint Owner ratifies that `TaskStatus` is recognized as **implementation-layer operational lifecycle vocabulary**, distinct from RFC-0004's normative Execution State model — the same pattern already established for `ReviewStatus`/`FindingStatus` relative to RFC-0006 (NEXUS-RAT-2026-07-12-006). RFC-0004 remains the sole normative owner of Execution State and is unmodified; RFC-0004's fuller state set (`Assigned`, `Awaiting Review`, `Failed`, `Blocked`) remains a normative target not yet fully realized in implementation, and this partial-conformance gap remains explicitly tracked as a deferred concept rather than approximated. `kernel-state-machine.md` — a Reference Document, not an RFC — is corrected to describe the approved `TaskStatus` reality rather than an unimplemented aspirational state set, per the Implementation Constitution's authority order (Reference Documents are corrected to match approved implementation-governing artifacts; they do not themselves establish normative behavior).

**2. Mission Plan/Task Domain Event producer-role mismatch, and a pre-existing catalog duplication this ratification also resolves.** `knowledge/reference/kernel-event-catalog.md` § Mission Plan Events / Task Events attributes producers that do not exist as implemented services: `TaskStarted`/`TaskCompleted` to "Adapter"; `TaskAssigned`, `TaskBlocked`, and `MissionPlanRevised` (in that section) to "Execution Strategy"; `TaskReady` to "Task Coordinator". No Adapter, Execution Strategy event-producing path, or Task Coordinator concept currently produces events. The two services that actually exist and perform the corresponding state transitions are `MissionPlanningService` (Sprint 3 — MissionPlan/Task creation, revision) and `MissionExecutionService` (Sprint 4 — Task start, complete, cancel).

Additionally, the catalog independently contains a **pre-existing duplication** predating this ratification: the legacy `# Mission Events` section (Aggregate: Mission) already lists `MissionPlanRevised` (Producer: Mission Service) and `TaskAdded` (Producer: Mission Service) — remnants from before Sprint 3 introduced `MissionPlan` and `Task` as their own aggregate roots — alongside the newer, aggregate-correct `# Mission Plan Events` / `# Task Events` sections, which separately list a second, differently-attributed `MissionPlanRevised` entry, a `MissionPlanSuperseded` entry, and a `TaskCreated` entry. `kernel-state-machine.md`'s own Mission Plan Lifecycle transition table already names `MissionPlanRevised` (not `MissionPlanSuperseded`) as the event that transitions a Plan from Active to Superseded, confirming `MissionPlanSuperseded` is a redundant duplicate of the same fact, not a distinct event.

The Sprint Owner ratifies that the Kernel Event Catalog SHALL attribute event producers only to implemented producer roles, following the same discipline already established in Sprint 11 for Evidence/Review ("only the event names cataloged for the producer roles actually implemented this slice"), and that the pre-existing duplicate entries SHALL be reconciled to one canonical entry per fact, using the aggregate-correct `MissionPlan`/`Task` section as canonical (consistent with Sprint 3's approved aggregate model), mirroring the Sprint 6 precedent (NEXUS-RAT-2026-07-12-002) for removing duplicate/obsolete contract surfaces:

| Event                | Corrected Producer        | Rationale                                                                                                                                                                                                                                                                                |
| -------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MissionPlanCreated` | `MissionPlanningService`  | Matches existing `createMissionPlan` operation. No duplicate.                                                                                                                                                                                                                            |
| `MissionPlanRevised` | `MissionPlanningService`  | Matches existing `reviseMissionPlan` operation and `kernel-state-machine.md`'s transition table. Canonical name; the legacy `# Mission Events` duplicate (Producer: Mission Service) and the redundant `MissionPlanSuperseded` entry are removed as the same fact under competing names. |
| `TaskCreated`        | `MissionPlanningService`  | Matches existing `addTask` operation. Canonical name; the legacy `# Mission Events` `TaskAdded` duplicate (Producer: Mission Service) is removed as the same fact under a competing name.                                                                                                |
| `TaskStarted`        | `MissionExecutionService` | Matches existing `startTask` operation (reattributed from "Adapter").                                                                                                                                                                                                                    |
| `TaskCompleted`      | `MissionExecutionService` | Matches existing `completeTask` operation (reattributed from "Adapter").                                                                                                                                                                                                                 |
| `TaskCancelled`      | `MissionExecutionService` | Matches existing `cancelTask` operation (reattributed from "Mission Service", which is not the operation's actual owner).                                                                                                                                                                |

`MissionPlanActivated` is **not** included in this table and is **not authorized for publication**: the approved Sprint 3 `MissionPlan` aggregate has no Draft/Active/Superseded status field and no activation operation exists on `MissionPlanningService` to trigger it from — mirroring the Sprint 11 precedent for `EvidenceAccepted`/`EvidenceRejected` ("Producer: Review Service, no corresponding operation exists"). It remains deferred, not merely event-silent, until a future sprint introduces Mission Plan status/activation as its own vertical slice.

Producer roles not yet implemented — `TaskReady` (Task Coordinator), `TaskAssigned` (Execution Strategy), `TaskBlocked` (Execution Strategy) — SHALL remain deferred until their corresponding vertical slices (Task Coordination, Execution Strategy event production) are implemented. They are not reattributed, renamed, or approximated by this ratification.

## Authorized Builder Scope

- Correct `knowledge/reference/kernel-state-machine.md` § Task Lifecycle to describe the approved Sprint 3 `TaskStatus` state set and transitions (`Pending → Ready → InProgress → Completed`, alternative `Cancelled`), removing or clearly marking as deferred/not-yet-implemented the `Assigned`, `Executing`-as-distinct-from-`InProgress`, and `Blocked` states that do not exist in the approved implementation.
- Correct `knowledge/reference/kernel-event-catalog.md`:
  - Reattribute producers per the table above: `MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated` → `MissionPlanningService`; `TaskStarted`, `TaskCompleted`, `TaskCancelled` → `MissionExecutionService`.
  - Remove the legacy `# Mission Events` section's duplicate `MissionPlanRevised` and `TaskAdded` entries (Producer: Mission Service), consolidating each into its single canonical entry under `# Mission Plan Events` / `# Task Events`.
  - Remove the redundant `MissionPlanSuperseded` entry, consolidated into the canonical `MissionPlanRevised` entry.
  - Move `MissionPlanActivated` out of the actively-cataloged producer table into a clearly marked deferred/no-operation-exists note, without deleting the event name itself (RFC-0003/RFC-0004's normative Mission Plan lifecycle still names an Active state; only the implementation-layer producer path is deferred).
- Implement `MissionPlanningService` and `MissionExecutionService` optional `EventBusContract` injection (Mission/Evidence/Review/Knowledge pattern) and aggregate-level recorded-events/`pullDomainEvents()` access on `MissionPlan` and `Task`, publishing only the six events reattributed above, only after the corresponding state transition has been successfully persisted.
- Reference this ratification from the Sprint 15 Sprint Implementation Record.

## Scope Restrictions

- Sprint 3's approved `TaskStatus` enum, its values, and its transition rules SHALL NOT be modified, renamed, or expanded. No new Task state (`Assigned`, `Awaiting Review`, `Failed`, `Blocked`) is introduced by this ratification.
- Sprint 3's approved `MissionPlan` aggregate SHALL NOT gain a status/Draft/Active/Superseded field or an activation operation. `MissionPlanActivated` publication is explicitly out of scope, not merely deferred as event-silent.
- RFC-0004 SHALL NOT be modified. RFC-0004's Execution State remains the normative concept; this ratification does not narrow or redefine it — it only governs implementation-layer vocabulary and Reference Document accuracy.
- No Kernel Canon changes.
- `TaskReady`, `TaskAssigned`, and `TaskBlocked` SHALL NOT be published by the consuming sprint; they remain deferred, not merely event-silent.
- No Execution Strategy, Adapter, or Task Coordinator event-producing capability is introduced or approximated by this ratification.
- The catalog reconciliation authorized above removes duplicate entries only; it does not rename, redefine, or alter the semantics of the surviving canonical event (`MissionPlanRevised` retains the meaning already stated in `kernel-state-machine.md`'s transition table).
- No source code or test changes are authorized by this ratification alone; implementation authorization is governed separately by the Sprint 15 Sprint Implementation Record.
- This ratification does not reopen or redesign Sprint 3 (Mission Planning) or Sprint 4 (Mission Execution); both remain frozen per Approved Vertical Slice Immutability.

## Governance Rule Applied

None new. This ratification applies the Governance Rule established by NEXUS-RAT-2026-07-13-004 (Domain events represent completed domain facts, not implementation actions) and the producer-role discipline established by Sprint 11 to the Mission Plan/Task event domain.

## Related Sprint(s)

- Sprint 3 — Mission Planning (approved baseline being referenced, not reopened).
- Sprint 4 — Mission Execution (approved baseline being referenced, not reopened).
- Sprint 11 — Domain Event Publication (Evidence, Review) (originating deferred-concept record).
- Sprint 15 — Mission Plan & Task Event Publication (planned).

## Related Review(s)

- None. This ratification precedes Sprint 15 implementation and the corresponding Reviewer cycle.

## Full Ratification Text

> Sprint 3 `TaskStatus` is hereby recognized as implementation-layer operational lifecycle vocabulary, distinct from RFC-0004's normative Execution State model. `kernel-state-machine.md` SHALL be reconciled to reflect the approved implementation vocabulary. The Kernel Event Catalog SHALL attribute event producers only to implemented producer roles. `MissionPlanningService` SHALL own planning events (`MissionPlanCreated`, `MissionPlanRevised`, `TaskCreated`). `MissionExecutionService` SHALL own execution events (`TaskStarted`, `TaskCompleted`, `TaskCancelled`). The catalog's pre-existing duplicate entries (`# Mission Events`' legacy `MissionPlanRevised`/`TaskAdded`, and the redundant `MissionPlanSuperseded` entry) SHALL be reconciled to their single canonical entry under `# Mission Plan Events`/`# Task Events`. `MissionPlanActivated` is explicitly deferred — no implemented operation triggers it. Producer roles not yet implemented (such as Execution Strategy, Task Coordinator, or future Adapters) SHALL remain deferred until their corresponding vertical slices are implemented. RFC-0004, RFC-0005, and the Kernel Canon are not modified. Sprint 3 and Sprint 4 are not reopened.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-007

## Ratification Identifier

NEXUS-RAT-2026-07-13-007

## Date

2026-07-13

## Subject

Reconciliation of the residual duplicate `TaskCompleted`/`TaskRemoved` entries under `kernel-event-catalog.md`'s legacy `# Mission Events` section, unblocking Sprint 15's `builder-task.md` TASK-002.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-13-011-F-002 — residual pre-existing duplicate `TaskCompleted`/`TaskRemoved` catalog entries under the legacy `# Mission Events` section, structurally identical to the duplication NEXUS-RAT-2026-07-13-006 resolved for `MissionPlanRevised`/`TaskAdded` but not named for removal by that ratification.

## Governance Decision

The Sprint Owner accepts the Reviewer's analysis in NEXUS-REV-2026-07-13-011-F-002. The residual `TaskCompleted`/`TaskRemoved` entries under `kernel-event-catalog.md`'s legacy `# Mission Events` section (Aggregate: Mission, Producer: "Mission Service") are a repository documentation inconsistency, not an implementation defect. The Builder correctly left these entries untouched during Sprint 15 because NEXUS-RAT-2026-07-13-006's Authorized Builder Scope named only `MissionPlanRevised` and `TaskAdded` for removal.

The Sprint Owner authorizes a documentation-only reconciliation:

1. **`TaskCompleted`:** Remove the legacy entry from the `# Mission Events` section. Retain the canonical `# Task Events` section entry, Producer: `MissionExecutionService` (already correctly attributed by Sprint 15).
2. **`TaskRemoved`:** `MissionPlanningService.removeTask()` is a confirmed, implemented, approved operation (Sprint 3, extended event-silent by Sprint 15 per NEXUS-RAT-2026-07-13-006). Per the Sprint Owner's conditional direction, because this operation exists, the `TaskRemoved` entry SHALL be **retained**, relocated from the legacy `# Mission Events` section to the canonical `# Task Events` section, and marked as a deferred, unpublished event — mirroring the `Deferred`/`Deferred Producer` marking pattern Sprint 15 already established for `MissionPlanActivated`/`TaskReady`/`TaskAssigned`/`TaskBlocked` — pending a future ratification that determines its publication semantics (event name reconciliation, if any, and producer attribution for `MissionPlanningService.removeTask()`).

This ratification does not name a new event, assign a producer to `TaskRemoved`'s eventual publication, or authorize `MissionPlanningService.removeTask()` to begin publishing an event. It authorizes catalog reconciliation only.

## Authorized Builder Scope

- Update `knowledge/reference/kernel-event-catalog.md` only:
  - Remove the legacy `# Mission Events` section's `TaskCompleted` entry (Aggregate: Mission, Producer: Mission Service).
  - Relocate the legacy `# Mission Events` section's `TaskRemoved` entry to the canonical `# Task Events` section, marking it `Deferred` (no producer attribution; unpublished), consistent with the `MissionPlanActivated`/`TaskReady`/`TaskAssigned`/`TaskBlocked` marking pattern already present in that section.
- Update `builder-task.md` TASK-002 status to reflect this ratification unblocking it (workflow bookkeeping, not itself a Reference Document change).
- Reference this ratification from the Sprint 15 Sprint Implementation Record's Known Limitations or Reviewer Notes, and from `IMPLEMENTATION_PLAN.md`'s Sprint 15 status line, as appropriate for traceability.

## Scope Restrictions

- The Builder SHALL NOT modify the Kernel Canon.
- The Builder SHALL NOT modify any RFC.
- The Builder SHALL NOT modify producer ownership for any event already reattributed by NEXUS-RAT-2026-07-13-006.
- The Builder SHALL NOT introduce a new event name.
- The Builder SHALL NOT modify implementation behavior — `MissionPlanningService.removeTask()` SHALL NOT begin publishing an event as a result of this ratification.
- No source code or test changes are authorized by this ratification.
- Sprint 3, Sprint 4, and Sprint 15's approved implementation baselines are not reopened.

## Related Sprint(s)

- Sprint 3 — Mission Planning (approved baseline being referenced, not reopened).
- Sprint 15 — Mission Plan & Task Event Publication (approved with findings; this ratification resolves the sprint's sole remaining open finding, F-002/TASK-002).

## Related Review(s)

- NEXUS-REV-2026-07-13-011 — Sprint 15 — Mission Plan & Task Event Publication; originating finding F-002.

## Full Ratification Text

> The Sprint Owner accepts the Reviewer's analysis in NEXUS-REV-2026-07-13-011-F-002 and authorizes a documentation-only reconciliation of `kernel-event-catalog.md`. The legacy `# Mission Events` section's `TaskCompleted` entry (Producer: Mission Service) is removed; the canonical `# Task Events` section's `TaskCompleted` entry (Producer: MissionExecutionService) is retained as the single authoritative definition. The legacy `# Mission Events` section's `TaskRemoved` entry is retained — because `MissionPlanningService.removeTask()` is a confirmed implemented operation — and relocated to the canonical `# Task Events` section, marked `Deferred` pending a future ratification determining its publication semantics. This ratification authorizes only the `kernel-event-catalog.md` change described; it does not modify the Kernel Canon, any RFC, producer ownership, event names, or implementation behavior.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-008

## Ratification Identifier

NEXUS-RAT-2026-07-13-008

## Date

2026-07-13

## Subject

Governance Recovery: Sprint 2 — Mission Foundation, Sprint 3 — Mission Planning, and Sprint 4 — Mission Execution are declared Historically Accepted Governance Deviations. No Reviewer certification for these sprints exists in any persisted repository artifact. Retrospective Reviewer certification is explicitly not fabricated. Closes the legacy "Sprint 2 — Review Remediation" TASK-004.

## Originating Review Finding(s)

- None. Identified during `/nexus-plan` State 1/2 (Repository Analysis / Governance Scan) while assessing Milestone 2 completion ahead of Sprint 16 planning.

## Investigation Findings

A full git-history investigation was performed across all 23 commits in the repository before this ratification was drafted, per Sprint Owner direction that "no retrospective Reviewer records, repository history reconstruction, or governance migration SHALL occur unless supported by repository evidence."

- `REVIEW_HISTORY.md` was created as an **empty file** (git blob `e69de29`, 0 bytes) in commit `6568d92` ("Add implementation technology standards, domain schema, capability contracts, data model, event catalog, and state machine documentation", 2026-07-11). In every subsequent commit through the current HEAD (`ad57575`), its first entry is `NEXUS-REV-2026-07-12-008` (Sprint 5 — Evidence Foundation). No commit at any point in repository history contains `NEXUS-REV-2026-07-12-001` through `-007`.
- `IMPLEMENTATION_MANIFEST.md` was likewise created empty in commit `4170367` ("Enhancement to implementation workflow", 2026-07-12). Its Sprint 2/3/4 sections, which cite `NEXUS-REV-2026-07-12-002`, `-003`, and `-004`, already carried those dangling citations as of the last real commit (`ad57575`) — this is not an artifact of the current uncommitted working session.
- `builder-task.md` has never been committed to this repository at any point, consistent with its documented status as a transient workflow artifact (`IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications: "Ratifications SHALL NOT exist solely in transient implementation artifacts, including... `builder-task.md`").

Conclusion: the cited reviews for Sprint 2–4 either occurred as ephemeral, unpersisted session output prior to `REVIEW_HISTORY.md`'s existence, or were never formally conducted. No durable evidence of Reviewer certification exists for Sprint 2, Sprint 3, or Sprint 4. This is a historical governance recording omission, not a repository migration defect, and not evidence of an implementation or architectural defect — Sprint 5 through Sprint 15 were each independently certified by a persisted Reviewer review and none surfaced a defect attributable to the Sprint 2–4 Mission/MissionPlan/Task foundation they build on.

## Governance Decision

Sprint 2 — Mission Foundation, Sprint 3 — Mission Planning, and Sprint 4 — Mission Execution are hereby declared **Historically Accepted Governance Deviations**. This declaration:

- acknowledges that these three sprints were implemented before `REVIEW_HISTORY.md`, the Ratification Ledger, and the current Specification-First Builder/Reviewer governance workflow existed as repository artifacts;
- is **not** retrospective Reviewer approval — no `NEXUS-REV` entry is created for Sprint 2, 3, or 4, and none SHALL be fabricated;
- treats the absence of certification as a permanently documented fact of repository history, not a defect requiring remediation;
- relies on the corroborating evidence that Sprint 5 through Sprint 15 — all independently, persistently certified — were built on and repeatedly exercised the Sprint 2–4 Mission/MissionPlan/Task foundation without any Reviewer surfacing an architectural or implementation defect attributable to it.

The legacy "Sprint 2 — Review Remediation" entry's **TASK-004** ("Mission reference documentation reconciliation remains blocked until explicit human ratification", citing the unpersisted `NEXUS-REV-2026-07-12-002`) is hereby **closed** by this ratification. No further implementation work is required and no recovery sprint is authorized for it — its underlying concern (Mission reference-documentation accuracy) has since been repeatedly addressed through eight subsequent reference-document reconciliation ratifications (NEXUS-RAT-2026-07-12-002 through -007, and NEXUS-RAT-2026-07-13-003 through -007), leaving no known open documentation gap traceable to TASK-004 specifically.

## Authorized Builder Scope

Documentation only, confined to governance-status bookkeeping:

- `IMPLEMENTATION_PLAN.md`: update Sprint 2, Sprint 3, and Sprint 4 status lines from "Implemented — ... Pending Reviewer Validation" to reflect Historically Accepted Governance Deviation status, citing this ratification.
- `IMPLEMENTATION_MANIFEST.md`: update the same three sprint sections and the legacy "Sprint 2 — Review Remediation" entry to reflect this ratification and TASK-004's closure.
- `IMPLEMENTATION_REPORT.md`: add a governance note if that document contains Sprint 2/3/4 sections referencing the same unpersisted reviews.
- `REVIEW_HISTORY.md`: append a governance note (not a `NEXUS-REV` entry) documenting this historical gap and its resolution, for permanent traceability at the point where a reader would otherwise expect to find Sprint 2–4's certification.

## Scope Restrictions

- No `NEXUS-REV-2026-07-12-001` through `-007` entry, or any other retrospective Reviewer certification entry, SHALL be created for Sprint 2, 3, or 4.
- Sprint 2, Sprint 3, and Sprint 4's approved implementation (Mission, MissionPlan, Task, and their services) SHALL NOT be reopened, modified, or reinterpreted by this ratification.
- No source code or test change is authorized by this ratification.
- No RFC or Kernel Canon change is authorized.
- This ratification does not certify Sprint 2–4 as architecturally sound in the sense a real Reviewer pass would — it records a governance-recovery acceptance grounded in the corroborating evidence above, and remains distinguishable in the repository record from genuine Reviewer certification.

## Related Sprint(s)

- Sprint 2 — Mission Foundation.
- Sprint 3 — Mission Planning.
- Sprint 4 — Mission Execution.
- Sprint 5 through Sprint 15 (corroborating evidence; not reopened).

## Related Review(s)

- None. No Reviewer review exists for the sprints this ratification addresses; that is the subject of this ratification.

## Full Ratification Text

> Sprint 2 — Mission Foundation, Sprint 3 — Mission Planning, and Sprint 4 — Mission Execution are declared Historically Accepted Governance Deviations, following a full git-history investigation confirming no Reviewer certification for these sprints was ever persisted in this repository (`REVIEW_HISTORY.md` and `IMPLEMENTATION_MANIFEST.md` were both created empty; `builder-task.md` was never committed). This is a governance acknowledgement of historical repository evolution, not retrospective Reviewer approval — no `NEXUS-REV` entry is created or SHALL be fabricated for these sprints. The legacy "Sprint 2 — Review Remediation" TASK-004 is closed; its underlying concern has been superseded by subsequent reference-document reconciliation ratifications. Sprint 2–4's approved implementation is not reopened. No RFC, Kernel Canon, source code, or test change is authorized.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-009

## Ratification Identifier

NEXUS-RAT-2026-07-13-009

**Identifier note:** The Sprint Owner's decision text originally cited `NEXUS-RAT-2026-07-13-006`, which is already assigned to the Sprint 15 Task Lifecycle three-way naming reconciliation ratification (`knowledge/governance/RATIFICATION_LEDGER.md:868`). Per the Ledger Rules ("If an identifier collision is discovered, the existing assignment remains unchanged and the new ratification receives the next available sequence number unless the Sprint Owner explicitly directs another unused identifier"), this ratification is recorded as `NEXUS-RAT-2026-07-13-009`, the next unused identifier at the time of recording. The substance of the decision is unchanged; only the identifier differs from the Sprint Owner's original text.

## Date

2026-07-13

## Subject

Resolution of the unauthorized `ReviewService.startReview` Mission-Completed precondition introduced during Sprint 17 implementation (Scenario 4). Selects Option A from Builder Task TASK-001 (`builder-task.md`, sourced from `NEXUS-REV-2026-07-13-015-F-001`): revert the precondition and replace Scenario 4 with an already-approved Review-domain rejection path.

## Originating Review Finding(s)

- NEXUS-REV-2026-07-13-015-F-001 — Sprint 17 — Cross-Domain Failure-Path Integration Validation; Critical, Category 2 — Architectural Violation.

## Governance Decision

The Sprint Owner determines that the implementation introduced in `ReviewService.startReview()` during Sprint 17 exceeds Sprint 17's authorized scope. Sprint 17 was approved exclusively as a Cross-Domain Failure-Path Integration Validation sprint, limited to validating already-approved composed-Kernel behavior; it was not authorized to introduce new architectural behavior, business rules, lifecycle semantics, cross-domain dependencies, or aggregate preconditions.

**Option A is RATIFIED.** The newly introduced Mission-lifecycle validation (`ReviewService` querying `IMissionRepository` and requiring Mission status `'Completed'` before `startReview` succeeds) SHALL NOT be retained. The Builder is authorized to restore the approved Sprint 9 Review Foundation architectural baseline and replace Scenario 4 ("Invalid Review Registration") with an integration scenario that exercises only previously approved Review-domain behavior.

The introduced execution path (`ReviewService → MissionRepository → Mission Status == Completed → Review.create()`) constitutes a new architectural behavior not authorized by RFC-0006, Sprint 9, Sprint 16, or any prior Ratification. Whether such a constraint is architecturally desirable is an open question the Sprint Owner explicitly declines to resolve through Sprint 17; it remains available for future consideration only through the established governance workflow (Repository Analysis → `/nexus-plan` → Governance Assessment → Sprint Owner Ratification → RFC Assessment → a dedicated vertical slice), never by implementation assumption.

This ratification does not modify RFC-0006, RFC-0001, or the Kernel Canon. It does not reopen or redesign Sprint 9's approved Review Foundation baseline — it restores it. It does not modify any other Sprint 17 scenario (1, 2, 3, 5, 6, 7, 8), which remain approved and require no rework.

## Authorized Builder Scope

- **TASK-001 (restore baseline):** Remove `assertMissionIsReviewable()`, the `missionRepository` constructor dependency, and the Mission-lifecycle validation from `src/kernel/review/review.service.ts`; remove the corresponding `missionRepository` wiring from `src/kernel/common/create-kernel-services.ts`'s `ReviewService` construction. `ReviewService` SHALL return to orchestration-only responsibilities matching the Sprint 9/11 baseline.
- **TASK-002 (replace scenario):** Replace the "Invalid Review Registration" scenario in `test/integration/kernel-failure-paths.integration.test.ts` with a rejection path exercising only already-approved Review-domain behavior owned by the `Review` aggregate or `IReviewRepository` since Sprint 9 (e.g., duplicate Review registration for the same `ReviewId`, or `ReviewCriteria`/evidence-reference validation already enforced by `Review.create`). No new validation logic may be introduced.
- **TASK-003 (documentation correction):** Correct `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md`'s Builder Results, Test Summary, and any architectural notes to remove the unsupported claim that Sprint 17 "preserved" an existing Mission-completed assessment boundary, and to accurately describe the replaced Scenario 4 as exercising only approved Sprint 9 Review behavior.
- Reference this ratification from the revised Sprint 17 Sprint Implementation Record and from `builder-task.md`.

## Scope Restrictions

- The Builder SHALL NOT modify RFC-0006, RFC-0001, or the Kernel Canon.
- The Builder SHALL NOT introduce any Mission lifecycle requirement, Review lifecycle requirement, new repository dependency, or new aggregate business rule under this ratification.
- The Builder SHALL NOT reinterpret or modify Scenarios 1, 2, 3, 5, 6, 7, or 8.
- Sprint 9's approved Review Foundation baseline is restored, not reopened or redesigned, by this ratification.
- This ratification does not authorize implementing a Mission-Completed precondition for Review under any framing; that question remains open and unresolved, reserved for a future dedicated vertical slice if ever pursued.
- No source code or test change beyond TASK-001/TASK-002/TASK-003's explicit scope is authorized.

## Related Sprint(s)

- Sprint 9 — Review Foundation (approved baseline being restored, not reopened).
- Sprint 17 — Cross-Domain Failure-Path Integration Validation (remediation of the reviewed slice).

## Related Review(s)

- NEXUS-REV-2026-07-13-015 — Sprint 17 — Cross-Domain Failure-Path Integration Validation; originating finding F-001.

## Full Ratification Text

> The Sprint Owner selects Option A for `builder-task.md` TASK-001 (sourced from NEXUS-REV-2026-07-13-015-F-001): the unauthorized Mission-completed precondition introduced into `ReviewService.startReview()` during Sprint 17 SHALL be removed, and the approved Sprint 9 Review Foundation baseline SHALL be restored. Scenario 4 SHALL be replaced with an integration scenario exercising only already-approved Review-domain behavior. No RFC, Kernel Canon, or other aggregate's business rules may be modified. Whether Review should require a particular Mission lifecycle state remains an open architectural question, explicitly not resolved by this ratification, reserved for a future dedicated vertical slice pursued only through the established governance workflow. Sprint 17's remaining scenarios (1, 2, 3, 5, 6, 7, 8) are unaffected and require no rework.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-010

## Ratification Identifier

NEXUS-RAT-2026-07-13-010

## Date

2026-07-13

## Subject

Status of `COPILOT_INSTRUCTIONS.md`: establishes it as a planned, optional, future Provider Integration artifact rather than a required Builder-governance document, resolving the gap flagged by `/nexus-plan` during Sprint 19 (Mock Adapter Runtime Integration) planning.

## Originating Review Finding(s)

None. Originated as a planning-time documentation-gap note (not a Review finding) during `/nexus-plan`'s Sprint 19 Repository Readiness assessment: the Sprint Owner's Sprint 19 scope draft cited `COPILOT_INSTRUCTIONS.md` as required Builder reading, but the file does not exist anywhere in the repository.

## Governance Decision

The Sprint Owner determines that `COPILOT_INSTRUCTIONS.md`'s absence is a repository workflow evolution, not a documentation defect. The Builder's authoritative implementation contract is derived from the repository's governance artifacts (`IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, the Current Sprint Implementation Record, and the approved Specification-First workflow), not a dedicated instruction file.

`COPILOT_INSTRUCTIONS.md` is established as a **planned Provider Integration artifact**: its eventual purpose is to provide runtime execution guidance to a production Builder implementation once one exists. It SHALL NOT become a governance artifact and SHALL NOT replace `IMPLEMENTATION_CONSTITUTION.md`, Sprint Implementation Records, `IMPLEMENTATION_PLAN.md`, or `IMPLEMENTATION_MANIFEST.md` — it SHALL only complement those artifacts during live provider execution.

Its creation is intentionally deferred until the repository's first production AI provider integration sprint (expected: a future Milestone 4 slice such as GitHub Copilot CLI Integration, following Sprint 19's Mock Adapter). Creating a provider-specific instruction document before a concrete provider exists would introduce unnecessary duplication and speculative guidance.

Until that sprint, the file's absence SHALL NOT be treated as a documentation defect, a governance deviation, a repository readiness blocker, or a Sprint implementation task.

## Authorized Builder Scope

None. This ratification authorizes no source code, architecture, or RFC changes, and no Sprint 19 scope expansion. It authorizes only the planning-documentation updates described under Related Sprint(s) below (Sprint 19 record and `IMPLEMENTATION_MANIFEST.md` Sprint 19 notes, to cite this ratification in place of the prior "documentation gap" framing).

## Scope Restrictions

- No Builder work is authorized by this ratification.
- `COPILOT_INSTRUCTIONS.md` SHALL NOT be created as part of Sprint 19 or any sprint prior to the first production AI provider integration sprint.
- When eventually created, `COPILOT_INSTRUCTIONS.md` SHALL focus exclusively on runtime Builder execution guidance and SHALL NOT duplicate repository governance already defined elsewhere.
- Future `/nexus-plan` cycles SHALL treat `COPILOT_INSTRUCTIONS.md` as an optional future artifact prior to that sprint and SHALL NOT report its absence as a repository readiness issue.
- If `COPILOT_INSTRUCTIONS.md` exists at some future planning cycle, it MAY be included as supplemental Builder guidance, but SHALL NOT be treated as mandatory unless `IMPLEMENTATION_CONSTITUTION.md` is amended to require it.

## Related Sprint(s)

- Sprint 19 — Mock Adapter Runtime Integration (Milestone 4 — External Integration) — the originating planning cycle.
- A future, not-yet-planned Milestone 4 slice introducing the first production AI provider Adapter — the expected activation point for `COPILOT_INSTRUCTIONS.md`'s creation.

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> The Sprint Owner agrees that a dedicated `COPILOT_INSTRUCTIONS.md` SHALL eventually exist. However, its creation is intentionally deferred until the repository enters the first production AI provider integration phase. At the current stage, the Builder is governed by the Specification-First implementation model and the existing governance artifacts. Creating a provider-specific instruction document before a concrete provider exists would introduce unnecessary duplication and speculative guidance. `COPILOT_INSTRUCTIONS.md` is hereby established as a planned Provider Integration artifact, whose purpose SHALL be to provide runtime execution guidance to a production Builder implementation. It SHALL NOT become a governance artifact and SHALL NOT replace `IMPLEMENTATION_CONSTITUTION.md`, Sprint Implementation Records, `IMPLEMENTATION_PLAN.md`, or `IMPLEMENTATION_MANIFEST.md`; instead it SHALL complement those artifacts during live provider execution. The creation of `COPILOT_INSTRUCTIONS.md` is deferred until the first production provider integration sprint (expected Milestone 4 — External Integration, expected implementation slice: GitHub Copilot CLI Integration or the first production Builder Adapter). Prior to that sprint, `nexus-plan` SHALL recognize the file as an optional future artifact and SHALL NOT report its absence as a repository readiness issue. No Builder work is authorized by this decision; no architectural changes are authorized; this decision records future repository intent only. The repository remains READY for Sprint 19 implementation.

**Superseding note:** An earlier, broader draft of this decision (proposing to treat `COPILOT_INSTRUCTIONS.md` as permanently optional and never require it) was presented to the Sprint Owner and interrupted before being ratified. It was never recorded in this Ledger and carries no governance effect. This entry (NEXUS-RAT-2026-07-13-010) records only the Sprint Owner's final, narrower decision: `COPILOT_INSTRUCTIONS.md` SHALL eventually exist, with its creation deferred to the first production provider integration sprint.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-011

## Ratification Identifier

NEXUS-RAT-2026-07-13-011

## Date

2026-07-13

## Subject

Confirms and elevates to permanent repository law the Sprint 20 (Execution Pipeline Integration) planning-time Critical Guardrail: Sprint 20 authorizes Adapter **dispatch** only, never Adapter **selection**. Adapter Selection Policy remains explicitly out of scope and undefined.

## Originating Review Finding(s)

None. Originated as a planning-time architectural guardrail during `/nexus-plan`'s Sprint 20 (Execution Pipeline Integration) planning, itself written in direct response to the precedent of `NEXUS-REV-2026-07-13-015-F-001` (the Sprint 17 unauthorized `ReviewService` precondition, corrected by `NEXUS-RAT-2026-07-13-009`).

## Governance Decision

The Sprint Owner ratifies the planning-time Critical Guardrail as binding, not merely advisory. Sprint 20 authorizes only Adapter **dispatch**, not Adapter **selection**. The Kernel SHALL NOT introduce routing, prioritization, capability scoring, provider preference, or any other Adapter-selection policy.

Execution Strategy SHALL invoke an Adapter only through one of the following deterministic mechanisms:

1. an explicitly supplied `adapterId`; or
2. a fails-closed lookup that succeeds only when exactly one registered Adapter satisfies the request.

If zero or multiple matching Adapters exist, execution SHALL fail with a deterministic diagnostic. No automatic selection algorithm is authorized.

Sprint 20 validates the execution pipeline; it does not define runtime Adapter selection policy. Adapter Selection remains a future architectural capability — future production provider integration may introduce Adapter-selection semantics only under a dedicated vertical slice and appropriate RFC authority (RFC-0004 and/or RFC-0008 amendment, or a new RFC), never by implementation assumption inside Sprint 20 or any sprint that has not been explicitly authorized to resolve it.

## Authorized Builder Scope

The Builder MAY introduce a minimal coordination method in `ExecutionStrategyService` if required solely to connect already-approved services (`RoleService`, `ExecutionStrategyService`, `AdapterService`) into the Sprint 20 pipeline. That coordination:

- SHALL contain no business rules;
- SHALL introduce no routing, prioritization, capability-scoring, or provider-preference policy;
- SHALL preserve RFC-0010 dependency boundaries (no `src/kernel` file may import a concrete Adapter implementation);
- SHALL remain deterministic;
- SHALL exist only to exercise the already-certified execution pipeline (Sprint 8, Sprint 10, Sprint 19), not to extend it with new business behavior.

## Scope Restrictions

- No automatic Adapter-selection algorithm, routing table, priority ranking, or capability-scoring mechanism is authorized under this ratification or under Sprint 20.
- Adapter dispatch SHALL use only an explicit `adapterId` or a fails-closed single-match lookup; any other match count SHALL fail deterministically rather than fall back to a default or "best" choice.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon.
- This ratification does not reopen or redesign Sprint 7, Sprint 8, Sprint 10, or Sprint 19's approved baselines.
- Future Adapter Selection Policy work requires its own dedicated vertical slice and RFC authority; it SHALL NOT be introduced incrementally through subsequent sprints without that explicit authorization.

## Related Sprint(s)

- Sprint 20 — Execution Pipeline Integration (Milestone 4 — External Integration) — the originating and governed sprint.
- Sprint 7 — Adapter Framework; Sprint 8 — Execution Roles; Sprint 10 — Execution Strategy (each of which previously and consistently deferred Adapter/Provider selection).

## Related Review(s)

- NEXUS-REV-2026-07-13-015 — Sprint 17 — Cross-Domain Failure-Path Integration Validation; the precedent (unauthorized business rule under similar ambiguity) this guardrail is designed to prevent from recurring.

## Full Ratification Text

> The Sprint Owner accepts the planning clarification. Sprint 20 authorizes only Adapter dispatch, not Adapter selection. The Kernel SHALL NOT introduce routing, prioritization, capability scoring, provider preference, or any other Adapter-selection policy. Execution Strategy SHALL invoke an Adapter only through one of the following deterministic mechanisms: (1) an explicitly supplied `adapterId`; or (2) a fails-closed lookup that succeeds only when exactly one registered Adapter satisfies the request. If zero or multiple matching Adapters exist, execution SHALL fail with a deterministic diagnostic. No automatic selection algorithm is authorized. Sprint 20 validates the execution pipeline; it does not define runtime Adapter selection policy. Adapter Selection remains a future architectural capability. Future production provider integration may introduce Adapter-selection semantics under a dedicated vertical slice and appropriate RFC authority. The Builder MAY introduce a minimal coordination method if required solely to connect already-approved services. That coordination SHALL contain no business rules; SHALL introduce no routing policy; SHALL preserve RFC-0010 dependency boundaries; SHALL remain deterministic. This coordination exists only to exercise the already-certified execution pipeline.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-013

## Ratification Identifier

NEXUS-RAT-2026-07-13-013

## Date

2026-07-13

## Subject

Ratifies the refined implementation scope for Sprint 26 — Developer Workflow Adapter Integration, clarifying architectural intent, preserving provider independence, and ensuring reuse of the previously certified Sprint 20 execution pipeline without introducing new execution architecture.

## Originating Review Finding(s)

None. Originated as a Sprint Owner refinement of a `/nexus-plan` Sprint proposal (2026-07-13), retitling and re-scoping the planner's proposed "Sprint 26 — Developer Workflow Execution Pipeline Integration" as "Sprint 26 — Developer Workflow Adapter Integration."

## Governance Decision

The Sprint Owner approves connecting Sprint 25's Developer Workflow to the already-certified Sprint 20 Adapter execution pipeline, exercising the complete provider-independent execution path through the Host. This introduces exactly one architectural variable: **Developer Workflow → Certified Adapter Pipeline Integration**. No additional architectural responsibilities are authorized.

The planner's proposed title, "Developer Workflow Execution Pipeline Integration," is rejected in favor of "Developer Workflow Adapter Integration" because Sprint 20 already normatively established the Execution Pipeline; Sprint 26 integrates with that pipeline rather than redefining or extending it.

The Host SHALL orchestrate the Developer Workflow, invoke existing public Kernel service contracts, present execution progress and results, and preserve Workspace Trust enforcement. The Host SHALL NOT assign execution roles, select adapters, or determine execution success/failure — these remain exclusively Kernel-owned (Mission execution, Role Assignment, Execution Strategy, Adapter dispatch authorization, Task lifecycle, Domain Events). The Adapter Runtime remains unchanged; `MockAdapter` remains the only execution implementation; no production provider behavior is introduced.

Sprint 26 SHALL exercise exactly this execution sequence, reusing the Sprint 20-certified pipeline verbatim, and SHALL NOT introduce a duplicate execution path:

```text
Developer Workflow
        ↓
MissionExecutionService.startTask()
        ↓
RoleService.assignRole()
        ↓
ExecutionStrategyService.evaluateAssignmentReadiness()
        ↓
AdapterService.dispatch()
        ↓
MockAdapter
        ↓
AdapterResponse
        ↓
MissionExecutionService.completeTask()
```

Execution semantics: Start Task → assign execution role → validate execution readiness → dispatch to Adapter → await response. If execution succeeds, complete the Task and present results. If execution does not succeed, stop deterministically, present Adapter diagnostics, and preserve the Task's last authoritative lifecycle state — Task completion or failure SHALL NOT be fabricated (no Kernel Task-failure operation exists; none is introduced by this ratification).

## Authorized Builder Scope

The Builder MAY:

- integrate the existing Developer Workflow with the existing Adapter execution pipeline;
- invoke Adapter dispatch through the existing `AdapterService`;
- preserve explicit `adapterId` dispatch or deterministic single-match lookup exactly as ratified by `NEXUS-RAT-2026-07-13-011`;
- process Adapter responses through existing public Kernel contracts;
- complete Task execution only after successful Adapter execution;
- present Adapter diagnostics through the existing Host presentation model;
- extend session history with the Adapter execution outcome while preserving Sprint 25's session-only, non-durable semantics;
- update implementation documentation (`IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, the Sprint 26 record).

No additional execution orchestration is authorized.

## Scope Restrictions

- No production AI provider integration (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, or any live provider).
- No Adapter Selection (routing policy, provider preference, capability scoring, fallback routing, load balancing, multi-adapter execution) — `NEXUS-RAT-2026-07-13-011` remains unaffected.
- No background execution, workflow automation, retry policies, streaming execution/responses, partial results, cancellation, or progress callbacks beyond what Sprint 24/25 already established.
- No persistent execution history, Knowledge integration, Shared Reality visualization, Mission browser, or execution dashboards.
- No new Kernel domain; no reassignment of architectural responsibility; no modification to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, or any Sprint 8/10/19/20/23/24/25 approved baseline beyond the authorized Developer Workflow extension itself.
- Existing Sprint 20 execution-pipeline tests SHALL continue to pass unmodified, validating unchanged behavior.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 20 — Execution Pipeline Integration (Milestone 4) — the certified pipeline this sprint reuses verbatim.
- Sprint 23 — Host Ingress Foundation; Sprint 24 — Host Runtime Completion — the Adapter-domain Host entry point this sprint connects to.
- Sprint 25 — Developer Workflow Foundation — the Mission-domain Host entry point this sprint extends.
- Sprint 26 — Developer Workflow Adapter Integration (Milestone 4) — the governed sprint.

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> The Sprint Owner approves the implementation direction proposed by `nexus-plan` with the following refinements. The purpose of Sprint 26 is not to create a new execution pipeline. The purpose of Sprint 26 is to connect the Developer Workflow established in Sprint 25 to the already-certified Adapter execution pipeline established in Sprint 20, exercising the complete provider-independent execution path through the Host. This Sprint introduces exactly one architectural variable: Developer Workflow → Certified Adapter Pipeline Integration. No additional architectural responsibilities are authorized. The Sprint shall be recorded as "Sprint 26 — Developer Workflow Adapter Integration," not "Developer Workflow Execution Pipeline Integration," because Sprint 20 already normatively established the Execution Pipeline; Sprint 26 integrates with that pipeline rather than redefining or extending it. The Host SHALL orchestrate the Developer Workflow, invoke existing public Kernel service contracts, present execution progress and results, and preserve Workspace Trust enforcement; it SHALL NOT assign execution roles, select adapters, or determine execution success or failure. The Kernel remains authoritative for Mission execution, Role Assignment, Execution Strategy, Adapter dispatch authorization, Task lifecycle, and Domain Events; no Kernel ownership changes are authorized. The Adapter Runtime remains unchanged; MockAdapter continues to serve as the only execution implementation; no production provider behavior is introduced. Sprint 26 SHALL exercise exactly the authorized execution sequence (Developer Workflow → MissionExecutionService.startTask → RoleService.assignRole → ExecutionStrategyService.evaluateAssignmentReadiness → AdapterService.dispatch → MockAdapter → AdapterResponse → MissionExecutionService.completeTask) and SHALL NOT introduce a duplicate execution path. Task execution SHALL NOT fabricate completion or failure: on success, complete the Task and present results; on non-success, stop deterministically, present Adapter diagnostics, and preserve the Task's last authoritative lifecycle state. Deferred: provider integration, Adapter Selection, background/streaming/retry/cancellation workflow behavior, and persistent execution history/Knowledge/Shared Reality/dashboard integration. The only remaining architectural substitution for a subsequent sprint SHALL be MockAdapter → Live Provider Adapter, requiring no further Host, Kernel, or execution architecture change.

## Current Status

Active

---

# NEXUS-RAT-2026-07-13-014

## Ratification Identifier

NEXUS-RAT-2026-07-13-014

## Date

2026-07-13

## Subject

Sprint 27 Scope Ratification — Developer Workflow Completion. Refines and supersedes `nexus-plan`'s proposed "Sprint 27 — Host Review & Knowledge Workflow Integration" draft where differences exist.

## Originating Review Finding(s)

None. Originated as a Sprint Owner refinement of a `/nexus-plan` Sprint proposal (2026-07-14).

## Governance Decision

The Sprint Owner approves Sprint 27, retitled **"Developer Workflow Completion"** to reflect that Review and Knowledge integration are implementation details of completing the provider-independent developer workflow, not the primary delivered capability. Sprint 27 SHALL integrate only previously approved Kernel capabilities (`EvidenceService`, `ReviewService`, `KnowledgeService`) through their existing public service contracts. No new Kernel service contracts, aggregate access, repository access, or Domain Event interaction are authorized. No new business rules or execution semantics are authorized.

The Host SHALL remain responsible only for workflow orchestration, user interaction, presentation, and invoking existing public Kernel service contracts. The Host SHALL NOT implement business rules, interpret Review Findings, determine Knowledge eligibility, or own execution/lifecycle decisions. The Kernel remains the authoritative owner of Evidence registration, Review lifecycle, Review outcome determination, Knowledge eligibility, Knowledge capture, and all business rules.

The authorized completion workflow is: Developer Workflow → Mission Completion → `EvidenceService.registerEvidence()` → `ReviewService` (start Review, publish Finding(s), finalize Review outcome) → Kernel determines Review Outcome → (if Knowledge Eligible) `KnowledgeService.captureKnowledge()` → Host presents completion result. The Host SHALL observe the workflow; the Kernel SHALL determine workflow semantics.

**Binding implementation clarification (Sprint Owner-approved resolution of an inherent contract constraint):** The Sprint 9-approved `FinalizeReviewOutcomeCommand` requires the caller to supply an explicit `outcome` value — the Review domain does not derive an outcome from Findings, and Sprint 27 is not authorized to change that Approved Vertical Slice. The Host MAY supply a deterministic, fixed `outcome` value as an explicit command input, exactly as Sprint 26 already supplies a deterministic default `roleId`/explicit `adapterId` — this is data supply, not business interpretation. Knowledge eligibility SHALL NOT be encoded as Host-side conditional logic (e.g., `if (reviewAccepted) { captureKnowledge(); }`). Instead, the Host SHALL call `KnowledgeService.captureKnowledge()` unconditionally as the next workflow step after finalizing the Review outcome, and SHALL treat the Kernel's own precondition enforcement inside `Knowledge.capture()` (which throws `KnowledgeCapturePreconditionError` when the supporting Review has not reached a terminal accepted state, per the frozen Sprint 12 rule) as the sole eligibility determination, handled through the same Kernel-rejection stop-deterministically pattern Sprint 25/26 already established. This preserves "Knowledge eligibility SHALL remain exclusively owned by the Kernel" without requiring a new Kernel contract.

## Authorized Builder Scope

The Builder MAY:

- extend `HostMissionWorkflow` (or an equivalent Host orchestration component) to, after `completeMission`, invoke `EvidenceService.registerEvidence` → `ReviewService.startReview` → `ReviewService.publishFinding` → `ReviewService.finalizeReviewOutcome` → `KnowledgeService.captureKnowledge`, in that order, using only existing public service contracts;
- supply deterministic, explicit command inputs (identities, a fixed Review outcome value, Evidence/Finding/Knowledge content) exactly as Sprint 25/26 already supply deterministic Mission/Task identities and a deterministic default Role/Adapter;
- call `KnowledgeService.captureKnowledge()` unconditionally following `finalizeReviewOutcome`, treating a `KnowledgeCapturePreconditionError` (or any other Kernel rejection) as an ordinary Kernel-rejection stop, mirroring the existing Sprint 25/26 rejection-handling pattern;
- wire `EvidenceService`, `ReviewService`, and `KnowledgeService` into the existing VS Code Host composition root, mirroring the Sprint 25/26 `resolveService` pattern;
- extend session-only workflow history with Review outcome and Knowledge capture status, preserving Sprint 25's non-durable, minimal-field, presentation-only constraint;
- present Review Findings and Knowledge capture results through the existing `HostPresentationSurface`.

No additional execution orchestration, business rule, or Kernel service contract is authorized.

## Scope Restrictions

- No live AI Providers, production Adapter integration, Adapter Selection, or provider routing.
- No streaming execution or background workflow execution.
- No human review intervention or review retry workflows.
- No Policy Engine integration, Evidence indexing, or Knowledge conflict resolution.
- No persistent or durable workflow/execution/review/knowledge history — session history remains session-scoped, non-durable, and presentation-oriented only; it SHALL NOT become engineering history, execution history, review history, or knowledge storage.
- No workflow automation or multi-provider coordination.
- No new Kernel capabilities, aggregates, repositories, business rules, lifecycle transitions, or Domain Events.
- No redefinition of previously approved Sprint 25 or Sprint 26 behavior.
- This ratification does not modify RFC-0002, RFC-0006, RFC-0007, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 5 — Evidence Foundation; Sprint 9 — Review Foundation; Sprint 12–14 — Knowledge Foundation/Event Publication/Lifecycle Advancement — the certified Kernel capabilities this sprint integrates.
- Sprint 16 — End-to-End Mission Workflow Integration Validation — the Kernel-composition-level precedent proving Evidence → Review → Knowledge sequencing legal.
- Sprint 25 — Developer Workflow Foundation; Sprint 26 — Developer Workflow Adapter Integration — the Host Developer Workflow this sprint completes.

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> Sprint 27 is hereby APPROVED and AUTHORIZED for implementation. The Sprint objective is refined to emphasize completion of the provider-independent developer workflow rather than implementation of individual domain services. No new Kernel capabilities are authorized. No new business rules are authorized. Sprint 27 SHALL integrate only previously approved Kernel capabilities through existing public service contracts. The Sprint title is hereby ratified as "Sprint 27 — Developer Workflow Completion." This title better reflects the architectural capability being delivered; Review and Knowledge remain implementation details rather than the primary capability. Sprint 27 SHALL complete the provider-independent developer workflow by exercising the existing Mission completion workflow through the Host using only previously approved public Kernel service contracts. The Sprint SHALL complete the end-to-end developer workflow, preserve provider independence, preserve existing Kernel ownership, introduce no new execution semantics, and introduce no new business rules. The Host SHALL remain responsible only for workflow orchestration, user interaction, presentation, and invoking existing public Kernel service contracts; the Host SHALL NOT implement business rules, interpret Review Findings, determine Knowledge eligibility, own execution semantics, or own lifecycle decisions. The Kernel SHALL remain the authoritative owner of Evidence registration, Review lifecycle, Review outcome determination, Knowledge eligibility, Knowledge capture, business rules, and execution decisions. The authorized completion workflow is: Developer Workflow → Mission Completion → EvidenceService.registerEvidence() → ReviewService → Kernel determines Review Outcome → (If Knowledge Eligible) KnowledgeService.captureKnowledge() → Host presents completion result. The Host SHALL observe the workflow; the Kernel SHALL determine workflow semantics. Sprint 27 SHALL invoke only existing public service contracts; no new Kernel service contracts, aggregate access, repository access, or direct Domain Event interaction are authorized. Review outcome SHALL be determined exclusively by the Review domain; Review findings SHALL remain Review-domain artifacts; the Host SHALL NOT interpret Review findings and SHALL consume Review outcomes only through public Kernel contracts. Knowledge eligibility SHALL remain exclusively owned by the Kernel; the Host SHALL NOT contain logic equivalent to `if (reviewAccepted) { captureKnowledge(); }`; instead the Host SHALL consume the completion workflow through existing public Kernel contracts, with business ownership remaining inside the Kernel. Sprint 27 MAY extend the existing Host session history; session history SHALL remain session scoped, non-durable, and presentation oriented, and SHALL NOT become engineering history, execution history, review history, or knowledge storage. Sprint 27 SHALL preserve previously ratified architectural principles: Host orchestration only, Kernel business ownership, public service contract interaction, provider independence, Approved Vertical Slice immutability, one architectural variable per Sprint, and Specification-First implementation; it SHALL NOT redefine previously approved behavior from Sprint 25 or Sprint 26. Deferred: Live AI Providers, production Adapter integration, Adapter Selection, provider routing, streaming execution, background workflow execution, human review intervention, review retry workflows, Policy Engine integration, Evidence indexing, Knowledge conflict resolution, persistent workflow history, durable execution history, workflow automation, and multi-provider coordination. Upon successful independent review, Sprint 27 SHALL be marked Approved, Milestone 4 SHALL remain complete and extended with the completed developer workflow, and the repository SHALL be ready to begin Milestone 5 — Production Adapter Integration.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-001

## Ratification Identifier

NEXUS-RAT-2026-07-14-001

## Date

2026-07-14

## Subject

Milestone 5 Sequencing and Sprint 28 Scope Ratification — VS Code Extension Installability. Resequences Milestone 5 — Production Adapter Integration to begin with a productization/host-validation slice rather than a production Adapter, and refines `nexus-plan`'s proposed Sprint 28 scope with strengthened Extension Host validation boundaries.

## Originating Review Finding(s)

None. Originated as a Sprint Owner response to `nexus-plan`'s Governance Report (2026-07-14), which had flagged provider choice, authentication model, and `COPILOT_INSTRUCTIONS.md` activation as unresolved ambiguities blocking a production-Adapter Sprint 28 proposal.

## Governance Decision

The Sprint Owner determines that introducing the first production AI provider is not yet the next architectural objective. The repository has completed the provider-independent Developer Workflow (Sprint 27), but Nexus has never been packaged, installed, or exercised inside a real VS Code Extension Host — every existing test runs through Vitest's in-process fakes. Accordingly, Milestone 5 — Production Adapter Integration SHALL begin with a productization and host-validation slice, deferring all three previously flagged ambiguities (provider choice, authentication model, `COPILOT_INSTRUCTIONS.md` activation) undecided, exactly as `nexus-plan`'s Governance Report left them — none of the three is answered by this ratification; all three remain explicitly open for a future, dedicated Sprint.

Sprint 28 is retitled/confirmed as **"Sprint 28 — VS Code Extension Installability,"** approved with refined scope over `nexus-plan`'s proposal. The refinement strengthens (does not loosen) the proposal: it adds an explicit Extension Host Validation Boundary constraining what the new `@vscode/test-electron`-based tests may validate, and an explicit Packaging Scope excluding Marketplace publication and release automation. Sprint 28 SHALL validate the architecture certified through Sprint 27; it SHALL NOT extend it. No Kernel, Adapter, or Host architectural change is authorized.

**Extension Host Validation Boundary (binding):** Extension-host tests introduced by this Sprint SHALL exercise only the existing public Host entry points (registered commands) and SHALL validate installation, activation, command execution, provider-independent workflow execution, and extension lifecycle only. Extension-host tests SHALL NOT become a replacement for Kernel integration testing; Kernel integration remains owned by the existing repository validation suite (Sprint 16/17/18's integration tests, unmodified).

**Packaging Scope (binding):** Authorized: local VSIX generation, local installation, Extension Development Host validation, packaging metadata completion. Explicitly excluded: Visual Studio Marketplace publication, marketplace metadata validation, release automation, extension publishing. Local packaging and installation are the only deployment objectives authorized.

## Authorized Builder Scope

The Builder MAY:

- complete `package.json` extension-manifest metadata required for packaging (`activationEvents`, `icon`, `repository`, `license`, `engines` verification);
- add `.vscodeignore` to exclude source, tests, and dev tooling from the packaged VSIX;
- add `@vscode/vsce` packaging tooling and a local `package` script producing a `.vsix`;
- add `.vscode/launch.json` for manual Extension Development Host verification;
- add `@vscode/test-electron` and an automated extension-host integration test that launches a real VS Code instance, activates the extension, verifies all currently-contributed commands register, and exercises `nexus.runDeveloperMissionWorkflow` end-to-end against the certified `MockAdapter`, subject to the Extension Host Validation Boundary above.

No Kernel, Adapter, or Host business-logic change is authorized. No new command, capability, or workflow step is authorized.

## Scope Restrictions

- No Kernel architectural changes; no Adapter architectural changes; no new business rules; no new execution semantics.
- No production AI providers (GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, or any live provider); no Adapter Selection or provider routing.
- No authentication, credential management, OAuth, or `SecretStorage` integration.
- No streaming responses or multi-provider coordination.
- No Visual Studio Marketplace publication, marketplace metadata validation, or release automation.
- `COPILOT_INSTRUCTIONS.md` activation remains deferred; Sprint 28 continues using the certified `MockAdapter` runtime exclusively.
- Extension-host tests SHALL NOT replace or duplicate Kernel integration testing ownership.
- This ratification does not modify RFC-0009, RFC-0010, the Kernel Canon, or any prior approved vertical slice.

## Related Sprint(s)

- Sprint 1 — VS Code Extension Foundation (the activation/bootstrap baseline this sprint packages).
- Sprint 23/24 — Host Ingress Foundation/Runtime Completion; Sprint 25/26/27 — Developer Workflow Foundation/Adapter Integration/Completion (the complete command surface and workflow this sprint must prove operational inside a real Extension Host).

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> The Sprint Owner approves the proposed direction for Sprint 28 with refined scope. The proposal correctly identifies the next architectural objective: validating Nexus as an installable and operational VS Code extension before introducing any production AI provider. Because this Sprint introduces the first execution inside a real VS Code Extension Host, the Sprint scope is refined to strengthen architectural boundaries and preserve the certified provider-independent runtime established through Sprint 27. Sprint 28 SHALL establish Nexus as an installable, activatable, and operational VS Code extension by validating the complete provider-independent Developer Workflow inside a real VS Code Extension Host. This Sprint is a productization and host-validation vertical slice; its purpose is to prove that the architecture certified through Sprint 27 operates correctly in a real extension environment. Sprint 28 SHALL validate the existing architecture; it SHALL NOT extend it. Authorized: completion of extension packaging metadata required for VSIX generation; local VSIX packaging; extension installation validation; extension activation validation; command registration verification; Extension Development Host execution; Workspace Trust validation inside a real Extension Host; automated extension-host integration testing using `@vscode/test-electron`; end-to-end validation of the certified provider-independent Developer Workflow using the existing MockAdapter. The implementation SHALL exercise only previously approved architectural capabilities. The Host SHALL remain responsible only for extension lifecycle, activation, command registration, dependency injection, workflow orchestration, presentation, and user interaction; the Host SHALL NOT implement business rules, bypass Kernel services, access aggregates directly, access repositories directly, invoke adapters directly, or change execution semantics. The Kernel remains the authoritative owner of Mission execution, Evidence, Review, Knowledge, Adapter dispatch, business rules, and execution decisions; no ownership boundaries are modified. The real Extension Host introduced by this Sprint SHALL exercise only the existing public Host entry points; extension-host tests SHALL validate installation, activation, command execution, provider-independent workflow execution, and extension lifecycle; extension-host tests SHALL NOT become a replacement for Kernel integration testing, which remains owned by the existing repository validation suite. Sprint 28 authorizes local VSIX generation, local installation, Extension Development Host validation, and packaging metadata completion; it explicitly excludes Visual Studio Marketplace publication, marketplace metadata validation, release automation, and extension publishing. Sprint 28 SHALL NOT introduce Kernel architectural changes, Adapter architectural changes, new business rules, new execution semantics, production AI providers, provider routing, Adapter Selection, authentication, credential management, OAuth, SecretStorage integration, streaming responses, or multi-provider coordination; all previous Sprint Owner ratifications remain in force. Sprint 28 SHALL: produce a valid `.vsix` package from a clean repository; install successfully into VS Code; activate successfully without runtime errors; register all currently implemented commands; execute the complete provider-independent Developer Workflow through the certified MockAdapter; pass automated Extension Host validation using `@vscode/test-electron`; preserve the certified architecture with no modifications to Kernel business logic; pass the complete repository validation pipeline. Deferred: GitHub Copilot CLI Adapter, Claude CLI Adapter, Gemini CLI Adapter, Codex CLI Adapter, production Adapter integration, Adapter Selection, provider routing, authentication and credential management, OAuth, SecretStorage integration, streaming responses, multi-provider execution, Marketplace publishing, and release automation. Upon successful completion, Nexus SHALL be installable, activatable, executable inside a real VS Code Extension Host, and capable of exercising the complete provider-independent Developer Workflow through the certified MockAdapter, establishing the first operational Nexus product while preserving the previously certified architecture. Only after independent certification of this Sprint SHALL the repository proceed to the first production Adapter implementation. The Sprint Owner approves Sprint 28, activates it as the Current Sprint, authorizes `nexus-plan` to generate the Sprint 28 Implementation Record, and authorizes the Builder to begin implementation in accordance with this refined scope and the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-002

## Ratification Identifier

NEXUS-RAT-2026-07-14-002

## Date

2026-07-14

## Subject

First Production Adapter Provider Selection, Authentication Model, and Provider-Neutral Runtime Instructions Terminology Ratification. Resolves the three governance ambiguities `nexus-plan` raised in its post-Sprint-28 Governance Report (2026-07-14): provider choice, authentication model, and the `COPILOT_INSTRUCTIONS.md` activation trigger. Supersedes `NEXUS-RAT-2026-07-13-010`'s document name (not its underlying deferral logic, which is now fulfilled).

## Originating Review Finding(s)

None. Originated as a Sprint Owner response to `nexus-plan`'s Governance Report (2026-07-14), raised after `NEXUS-RAT-2026-07-14-001`'s Sprint 28 was independently certified (`NEXUS-REV-2026-07-14-001`), satisfying that ratification's stated precondition for proceeding to the first production Adapter.

## Governance Decision

**Provider Selection:** The first production Adapter SHALL target **Gemini CLI**, not GitHub Copilot CLI. `NEXUS-RAT-2026-07-13-010`'s and `NEXUS-RAT-2026-07-13-013`'s references to "GitHub Copilot CLI Integration" were illustrative examples only, never a binding provider commitment; the repository's implementation direction has since evolved. This ratification is the first to bindingly select a specific provider for a production Adapter.

**Authentication Model:** The first production Adapter SHALL assume a **pre-authenticated local CLI session** — the developer has already authenticated via the Gemini CLI's own login flow outside of Nexus. Nexus SHALL NOT store, manage, request, or otherwise handle credentials, API keys, tokens, or OAuth flows itself. Nexus SHALL invoke the already-authenticated local `gemini` executable through the existing Sprint 21 `LocalProcessRuntimeContract`, exactly as any other local process. This preserves the narrowest, lowest-risk authentication surface and defers the significantly larger "Nexus manages credentials" architectural question to a future, dedicated sprint if ever authorized.

**Provider-Neutral Runtime Instructions:** The Sprint Owner determines that activating a document literally named `COPILOT_INSTRUCTIONS.md` — now that the first production Adapter is confirmed to be Gemini CLI, not GitHub Copilot CLI — would incorrectly bind repository terminology to a vendor the repository is not integrating first, and would conflict with RFC-0008's provider-independent Adapter architecture. The canonical document is hereby retitled:

| Previous (illustrative name, never created) | Canonical                         |
| ------------------------------------------- | --------------------------------- |
| `COPILOT_INSTRUCTIONS.md`                   | `ADAPTER_RUNTIME_INSTRUCTIONS.md` |

This is a terminology ratification only. It introduces no change to Kernel behavior, governance responsibilities, RFC-0008 semantics, or runtime execution semantics. `ADAPTER_RUNTIME_INSTRUCTIONS.md` SHALL define only runtime execution guidance for production Adapter implementations — adapter execution lifecycle, request construction, command invocation, response parsing, diagnostics, runtime expectations, and operational requirements for future production Adapters (Gemini CLI first, with GitHub Copilot CLI, Claude CLI, Codex CLI, and others conforming to the same common runtime contract rather than each introducing a provider-specific instruction document). It SHALL NOT define repository governance, Sprint planning, architectural ownership, Builder authority, Reviewer authority, or implementation policy — those responsibilities remain exclusively owned by `IMPLEMENTATION_CONSTITUTION.md`, the Ratification Ledger, Sprint Implementation Records, and other existing governance artifacts.

**Repository Law Update:** The trigger established under `NEXUS-RAT-2026-07-13-010` ("deferred until the repository's first production AI provider integration sprint") is hereby fulfilled and its document-naming portion superseded. The canonical repository law is now: _the first production Adapter integration sprint activates `ADAPTER_RUNTIME_INSTRUCTIONS.md`._ `NEXUS-RAT-2026-07-13-010` itself remains recorded unmodified per the Constitution's immutable-ledger rule; this entry documents the superseding relationship. Any historical or future reference to `COPILOT_INSTRUCTIONS.md` anywhere in the repository SHALL be read as referring to `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- implement a `GeminiCliAdapter` (or equivalently named) production Adapter conforming to the existing, frozen RFC-0008 Adapter Contract, invoking the local `gemini` CLI executable through the existing Sprint 21 `LocalProcessRuntimeContract`;
- create `ADAPTER_RUNTIME_INSTRUCTIONS.md` at the repository root, scoped strictly to runtime execution guidance as described above;
- update repository documentation that still references the illustrative `COPILOT_INSTRUCTIONS.md` name to use the canonical `ADAPTER_RUNTIME_INSTRUCTIONS.md` name.

The precise Authorized Vertical Slice, Critical Boundary, and Scope Restrictions for the implementing Sprint remain to be defined in that Sprint's own Sprint Implementation Record, consistent with the Specification-First workflow and the "one architectural variable per Sprint" principle; this ratification authorizes provider/authentication/terminology decisions, not an unbounded implementation scope.

## Scope Restrictions

- No credential storage, API key management, OAuth flow, or `SecretStorage` integration of any kind — authentication remains entirely external to Nexus, assumed pre-established via the developer's own Gemini CLI login.
- No Adapter Selection Policy, routing, provider preference, fallback, or multi-adapter execution — `NEXUS-RAT-2026-07-13-011` remains unaffected and binding.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` SHALL NOT become a governance artifact; it SHALL NOT redefine or duplicate `IMPLEMENTATION_CONSTITUTION.md`, Sprint Implementation Records, `IMPLEMENTATION_PLAN.md`, or `IMPLEMENTATION_MANIFEST.md`.
- This ratification does not, by itself, authorize wiring a Gemini Adapter into `HostMissionWorkflow` or replacing `MockAdapter` in the certified Developer Workflow — that remains a separate scope decision for the implementing Sprint's own record, consistent with prior "one architectural variable per Sprint" practice (e.g., Sprint 19 Mock Adapter implementation preceded Sprint 20's pipeline wiring by one full sprint).
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 19 — Mock Adapter Runtime Integration (the Adapter Contract precedent this new production Adapter conforms to).
- Sprint 21 — Local Process Runtime Foundation (the process-execution primitive the Gemini CLI Adapter will use).
- Sprint 28 — VS Code Extension Installability (the independently certified productization precondition that unblocked this decision).

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> The Sprint Owner acknowledges that the trigger established under NEXUS-RAT-2026-07-13-010 has now been reached. However, the implementation roadmap has evolved since that ratification was originally adopted. At the time, GitHub Copilot CLI was referenced only as an illustrative example of the first production Builder Adapter. The repository has since adopted a different implementation direction. The first production Adapter SHALL be Gemini CLI. Accordingly, the Sprint Owner determines that activating a document named COPILOT_INSTRUCTIONS.md would unnecessarily bind repository terminology to a specific vendor and would conflict with the provider-independent architecture established by RFC-0008 and subsequent Sprint Owner ratifications. The first production Adapter integration sprint SHALL NOT create COPILOT_INSTRUCTIONS.md; instead it SHALL introduce the canonical provider-neutral runtime guidance document ADAPTER_RUNTIME_INSTRUCTIONS.md, which becomes the authoritative runtime execution guide for all production Adapter implementations. It is intentionally provider-neutral; future adapters (Gemini CLI, GitHub Copilot CLI, Claude CLI, Codex CLI, and others) SHALL conform to this common runtime contract rather than introducing provider-specific instruction documents. The repository hereby adopts ADAPTER_RUNTIME_INSTRUCTIONS.md as the canonical name in place of the previous illustrative COPILOT_INSTRUCTIONS.md reference; this terminology change is architectural only and introduces no change to Kernel behavior, governance responsibilities, or runtime semantics. ADAPTER_RUNTIME_INSTRUCTIONS.md SHALL define only runtime execution guidance, including adapter execution lifecycle, request construction, command invocation, response parsing, diagnostics, runtime expectations, and adapter operational requirements; it SHALL NOT define repository governance, Sprint planning, architectural ownership, Builder authority, Reviewer authority, or implementation policy, which remain owned by the Implementation Constitution, Ratification Ledger, Sprint Implementation Records, and other governance artifacts. The trigger established under NEXUS-RAT-2026-07-13-010 is hereby superseded on this naming point; the canonical repository law is now that the first production Adapter integration sprint activates ADAPTER_RUNTIME_INSTRUCTIONS.md. Any historical references to COPILOT_INSTRUCTIONS.md SHALL be interpreted as referring to this provider-neutral document. Separately, the authentication model for this first production Adapter SHALL be a pre-authenticated local CLI session: Nexus assumes the developer already logged in via the provider's own CLI, and Nexus never stores or handles credentials/secrets itself. `nexus-plan` is authorized to proceed with Gemini CLI as the first production Adapter, to create ADAPTER_RUNTIME_INSTRUCTIONS.md, to update repository documentation that still references COPILOT_INSTRUCTIONS.md, and to preserve provider-independent architectural terminology throughout the repository. This terminology ratification SHALL become the repository standard for all future production Adapter integrations.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-003

## Ratification Identifier

NEXUS-RAT-2026-07-14-003

## Date

2026-07-14

## Subject

Sprint 29 Scope Ratification — Gemini CLI Adapter Runtime Integration. Refines `nexus-plan`'s Sprint 29 proposal, converting the proposal's suggested test-safety constraint into a binding requirement and adding a mandatory, separately-tracked Manual Production Verification procedure.

## Originating Review Finding(s)

None. Originated as a Sprint Owner refinement of a `/nexus-plan` Sprint 29 proposal (2026-07-14), itself grounded in `NEXUS-RAT-2026-07-14-002`'s provider/authentication decisions.

## Governance Decision

Sprint 29 is APPROVED WITH REFINED SCOPE. Sprint 29 introduces exactly one architectural variable — a new `GeminiCliAdapter` alongside (not replacing) the existing certified `MockAdapter` — while validating the Adapter implementation in isolation. It SHALL NOT introduce Developer Workflow integration, modify Host orchestration, or modify Kernel behavior. Only after a future Sprint's independent certification of Sprint 29 SHALL Developer Workflow integration of `GeminiCliAdapter` be authorized.

**Two-tier Acceptance Criteria (binding):** Sprint 29 SHALL satisfy two independent, separately-tracked forms of validation, refining `nexus-plan`'s proposed single automated-test-safety constraint into a formal two-tier structure:

1. **Automated Repository Validation (Mandatory, CI-safe).** Automated tests SHALL exercise `GeminiCliAdapter` using a deterministic local test-double executable, never a live Gemini CLI. The automated suite SHALL validate Adapter request translation, process invocation, response parsing, diagnostics, timeout handling, malformed-output handling, and Adapter Contract conformance. This suite SHALL NOT depend on network connectivity, external AI services, authenticated user sessions, or nondeterministic model responses, and SHALL remain part of `npm run validate`.
2. **Manual Production Verification (Mandatory, NOT part of automated validation).** Sprint 29 SHALL include a documented manual verification procedure validating `GeminiCliAdapter` against a real, locally authenticated Gemini CLI installation, confirming executable discovery, successful CLI invocation, request execution, response parsing, diagnostics, and expected failure handling. This procedure serves as production interoperability evidence and is documented, not automated; it SHALL NOT be added to the CI-safe automated pipeline and SHALL NOT gate `npm run validate`.

## Authorized Builder Scope

The Builder MAY implement, exactly as proposed by `nexus-plan` and refined above:

- `GeminiCliAdapter implements Adapter` (RFC-0008 Adapter Contract), translating `AdapterRequest` to a `ProcessRequest` and `ProcessResult` back to `AdapterResponse`, via constructor-injected `LocalProcessRuntimeContract` (Sprint 21), placed outside `src/kernel` mirroring `MockAdapter`'s existing placement;
- deterministic diagnostics for executable-not-found, non-zero exit, malformed/unparseable output, timeout, and runtime error, reusing Sprint 21's `ProcessDiagnostics` where applicable;
- composition-time registration of `GeminiCliAdapter` through the existing `createKernelServices` `adapters` option, exercised only via direct `AdapterService.dispatch` calls in tests — NOT wired as the Developer Workflow's dispatch target (`extension.ts` continues registering `MockAdapter` for `HostMissionWorkflow`, unchanged);
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` at the repository root, scoped strictly to runtime execution guidance;
- the automated deterministic-test-double suite and the documented (non-automated) manual verification procedure described above.

No Developer Workflow file, Host orchestration file, or Kernel file may be modified.

## Scope Restrictions

- No Developer Workflow integration; no `HostMissionWorkflow` change; no replacement of `MockAdapter` as the Developer Workflow's dispatch target.
- No Host orchestration changes; no Kernel architectural changes.
- No Adapter Selection, provider routing, or multiple simultaneously-integrated production adapters.
- No authentication management, credential storage, OAuth, or `SecretStorage` integration — the pre-authenticated-local-session model from `NEXUS-RAT-2026-07-14-002` remains binding.
- No streaming responses or multi-provider coordination.
- The Manual Production Verification procedure SHALL remain documentation, not automation; it SHALL NOT be added to `npm run validate` or any CI-gating script.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, and existing integration tests SHALL continue to pass.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 7 — Adapter Framework (the Adapter Contract this implementation conforms to).
- Sprint 19 — Mock Adapter Runtime Integration (the isolated-implementation-before-wiring precedent this Sprint mirrors).
- Sprint 21 — Local Process Runtime Foundation (the process-execution primitive reused here).
- `NEXUS-RAT-2026-07-14-002` (provider selection, authentication model, `ADAPTER_RUNTIME_INSTRUCTIONS.md` naming).

## Related Review(s)

None. No Review finding originated this ratification.

## Full Ratification Text

> The Sprint Owner approves the proposed direction for Sprint 29. The proposal correctly introduces the first production Adapter while preserving the certified architecture established through Milestones 1–5. The Sprint remains intentionally limited to validating the first production Adapter implementation in isolation before introducing it into the Developer Workflow. The Sprint scope is refined to strengthen the acceptance criteria and distinguish deterministic repository validation from real-world production verification. Sprint 29 SHALL implement the first production Adapter (GeminiCliAdapter) conforming to the frozen RFC-0008 Adapter Contract, validating that the Adapter correctly interoperates with the existing LocalProcessRuntime while preserving every previously certified architectural boundary. This Sprint validates the Adapter implementation itself; it SHALL NOT introduce Developer Workflow integration, modify Host orchestration, or modify Kernel behavior. Sprint 29 introduces exactly one architectural variable: MockAdapter alongside GeminiCliAdapter; all other architectural components SHALL remain unchanged. Authorized: GeminiCliAdapter; Adapter request translation; Gemini CLI process invocation through the existing LocalProcessRuntime; response parsing; diagnostics; timeout handling; malformed output handling; runtime error handling; composition-time registration of the Adapter; ADAPTER_RUNTIME_INSTRUCTIONS.md. The implementation SHALL reuse all existing Kernel services and infrastructure. Sprint 29 SHALL NOT introduce Developer Workflow integration, Host workflow changes, Kernel architectural changes, Adapter Selection, provider routing, multiple production adapters, authentication management, credential storage, OAuth, SecretStorage integration, streaming responses, or multi-provider coordination. Sprint 29 SHALL create ADAPTER_RUNTIME_INSTRUCTIONS.md as the canonical runtime guidance for all production Adapter implementations, defining only runtime execution guidance and not repository governance. Sprint 29 SHALL satisfy two independent forms of validation: (1) Automated Repository Validation (Mandatory) — the automated pipeline SHALL remain deterministic and CI-safe, exercising GeminiCliAdapter using a deterministic local test-double executable rather than a live Gemini CLI, validating Adapter request translation, process invocation, response parsing, diagnostics, timeout handling, malformed output handling, and Adapter Contract conformance, and SHALL NOT depend upon network connectivity, external AI services, authenticated user sessions, or nondeterministic model responses; (2) Manual Production Verification (Mandatory) — Sprint 29 SHALL include a documented manual verification procedure validating the Adapter against a real, locally authenticated Gemini CLI installation, confirming executable discovery, successful CLI invocation, request execution, response parsing, diagnostics, and expected failure handling, serving as production interoperability evidence; this manual verification SHALL NOT become part of the automated repository validation pipeline. Sprint 29 SHALL continue to pass TypeScript compilation, ESLint, Vitest, esbuild, existing integration tests, and the repository validation pipeline; no previously approved test SHALL regress. Deferred: Developer Workflow integration, replacing MockAdapter within the Host workflow, GitHub Copilot CLI Adapter, Claude CLI Adapter, Codex CLI Adapter, Adapter Selection, provider routing, authentication management, credential storage, OAuth, SecretStorage integration, streaming execution, and multi-provider coordination. Upon successful completion, Nexus SHALL possess its first certified production Adapter implementation while preserving the previously certified architecture, demonstrating that the RFC-0008 Adapter Contract is executable with a real production provider and that the Adapter interoperates correctly with the existing runtime infrastructure without introducing workflow coupling. Only after successful independent certification of Sprint 29 SHALL a future Sprint authorize integration of GeminiCliAdapter into the Developer Workflow. The Sprint Owner approves Sprint 29 with these refinements, authorizes nexus-plan to update the Sprint proposal accordingly, authorizes generation of the Sprint 29 Implementation Record, and authorizes the Builder to implement Sprint 29 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-004

## Ratification Identifier

NEXUS-RAT-2026-07-14-004

## Date

2026-07-14

## Subject

Sprint 30 Scope Ratification — Developer Workflow Integration of `GeminiCliAdapter`. Resolves the governance ambiguity `nexus-plan` raised regarding how `GeminiCliAdapter` (certified in isolation by Sprint 29, `NEXUS-REV-2026-07-14-002`) should be connected to the Developer Workflow without breaking the frozen, deterministic `MockAdapter`-based automated tests established across Sprints 25–28.

## Originating Review Finding(s)

None. Originated as a Sprint Owner resolution of a `/nexus-plan` Governance Report (2026-07-14) raised after Sprint 29's independent certification, itself the precondition `NEXUS-RAT-2026-07-14-003` set for authorizing Developer Workflow integration.

## Governance Decision

Sprint 30 is APPROVED WITH REFINEMENT. The Sprint Owner does **not** authorize introducing a persisted VS Code configuration surface for Adapter selection this Sprint; persisted adapter preference remains the deferred concept first recorded in Sprint 24 and is not required to validate the first production Developer Workflow.

Sprint 30 SHALL instead introduce a **second, new Developer Workflow command** dedicated to production Adapter validation, leaving the existing certified command entirely unmodified:

**Existing command (frozen, unchanged):** `nexus.runDeveloperMissionWorkflow` ("Nexus: Run Developer Workflow"). Behavior SHALL remain exactly as certified in Sprints 25–29:

```text
Developer Workflow → MockAdapter
```

This command SHALL remain the sole target of all existing automated integration tests and the Sprint 28 Extension Host suite; its behavior SHALL NOT change.

**New command:** a second command dedicated to production Adapter validation (e.g. `nexus.runDeveloperMissionWorkflowWithGeminiCli` / "Nexus: Run Developer Workflow (Gemini CLI)" or an equivalent provider-neutral name), whose implementation explicitly invokes the registered `GeminiCliAdapter`:

```text
Developer Workflow → GeminiCliAdapter
```

The new command SHALL dispatch using an explicit `adapterId` only. No Adapter routing, selection policy, persisted preference, or runtime ambiguity is introduced or implied, remaining fully consistent with `NEXUS-RAT-2026-07-13-011`.

## Architectural Responsibilities (binding)

- The Host MAY expose multiple Developer Workflow entry points (commands); this does not constitute Adapter Selection Policy.
- The Kernel SHALL remain unaware of which command initiated execution.
- Execution Strategy SHALL continue receiving an explicit adapter identifier at the call site, exactly as today.
- The Adapter Registry SHALL continue performing deterministic dispatch only, never routing or scoring.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add one new Host command that sequences the same authorized workflow steps already certified in Sprints 25–27 (Mission creation through Evidence/Review/Knowledge completion), but with the Adapter dispatch step's explicit `adapterId` set to `GEMINI_CLI_ADAPTER_ID` instead of `MOCK_ADAPTER_ID`.
- Register `GeminiCliAdapter` at the `extension.ts` composition root alongside the existing `MockAdapter` registration.
- Add the new command's contribution point (`package.json` `contributes.commands`/`activationEvents`) mirroring the existing command's registration pattern.
- Add unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Gemini CLI test-double (Sprint 29) — never a live Gemini CLI — so the new command's automated coverage remains CI-safe.
- Update `ADAPTER_RUNTIME_INSTRUCTIONS.md` only if reconciling the new command's existence requires it; no redefinition of its existing runtime-guidance-only scope.

The Builder SHALL NOT:

- modify the existing `nexus.runDeveloperMissionWorkflow` command's behavior, its `HostMissionWorkflow` construction, or any Sprint 25–29 test asserting its behavior;
- introduce any persisted VS Code configuration/setting for Adapter selection;
- introduce Adapter Selection Policy, provider routing, capability scoring, fallback, or multi-adapter coordination;
- introduce authentication management, credential storage, OAuth, or `SecretStorage` integration;
- modify `src/kernel`.

## Scope Restrictions

- No persisted adapter preference, Workspace/User setting, or configuration subsystem of any kind.
- No modification to the existing, frozen `nexus.runDeveloperMissionWorkflow` command or its certified MockAdapter-based test coverage.
- No Adapter Selection, automatic provider routing, or capability scoring.
- No live-network-dependent step added to `npm run validate` or any script it invokes; the new command's automated tests SHALL use the existing deterministic Gemini CLI test-double only.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, and existing integration tests (including the Sprint 28 Extension Host suite) SHALL continue to pass.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 25 — Developer Workflow Foundation (the certified command this ratification leaves unmodified).
- Sprint 26 — Developer Workflow Adapter Integration (the certified explicit-`adapterId` dispatch pipeline this ratification reuses for the new command).
- Sprint 27 — Developer Workflow Completion (the certified Evidence/Review/Knowledge sequence the new command also reuses).
- Sprint 29 — Gemini CLI Adapter Runtime Integration (`GeminiCliAdapter`, the isolated implementation this Sprint wires in; `NEXUS-REV-2026-07-14-002`).
- `NEXUS-RAT-2026-07-14-003` (established that Developer Workflow integration of `GeminiCliAdapter` is authorized only after Sprint 29's independent certification — now satisfied).
- `NEXUS-RAT-2026-07-13-011` (explicit `adapterId`-only dispatch; no routing — the binding constraint this ratification's new command continues to satisfy).

## Related Review(s)

None. No Review finding originated this ratification; it resolves a `/nexus-plan` Governance Report.

## Full Ratification Text

> The Sprint Owner approves Sprint 30 with refined scope. Sprint 30 SHALL be titled Developer Workflow Integration of GeminiCliAdapter. The Sprint Owner does not authorize introducing a persisted VS Code configuration surface for Adapter selection as part of this Sprint; persisted adapter selection remains a deferred capability originating from Sprint 24 and is not required to validate the first production Developer Workflow. Sprint 30 SHALL introduce a second Developer Workflow command rather than modifying the existing deterministic workflow. The existing command, Nexus: Run Developer Workflow, SHALL remain unchanged, with behavior remaining exactly as certified in Sprints 25 through 29, executing Developer Workflow through MockAdapter; this command SHALL remain the target of all automated integration tests, and its behavior SHALL remain frozen. Sprint 30 SHALL introduce a new command dedicated to production Adapter validation, for example Nexus: Run Developer Workflow (Gemini CLI) or an equivalent provider-neutral name, whose implementation explicitly invokes the registered GeminiCliAdapter, executing Developer Workflow through GeminiCliAdapter. The new command SHALL use an explicit adapterId; no adapter routing, no adapter selection, no persisted preference, and no runtime ambiguity is introduced, remaining fully consistent with NEXUS-RAT-2026-07-13-011. The Host MAY expose multiple workflow entry points; the Kernel SHALL remain unaware of which command initiated execution; Execution Strategy SHALL continue receiving an explicit adapter identifier; the Adapter Registry SHALL continue performing deterministic dispatch only. Sprint 30 SHALL preserve every approved automated test from Sprints 25 through 29 without modification, SHALL preserve MockAdapter as the deterministic CI execution target, SHALL introduce one additional production workflow command targeting GeminiCliAdapter, SHALL reuse the existing execution pipeline unchanged, SHALL introduce no Adapter Selection logic, no persisted configuration, and no routing policy, and SHALL pass the complete validation pipeline. The following remain explicitly deferred: persisted adapter preferences, Workspace or User adapter settings, Adapter selection policies, automatic provider routing, capability scoring, multi-provider coordination, Builder/Reviewer routing, and default adapter preferences; these belong to future runtime configuration and multi-adapter milestones. Sprint 30 should validate exactly one architectural change, Developer Workflow to GeminiCliAdapter, without simultaneously introducing a new configuration subsystem. The existing MockAdapter workflow remains the certified deterministic baseline for automated testing, while the new production workflow independently validates real provider execution. This preserves the one-architectural-variable-per-Sprint principle and keeps the certification history of Sprints 25 through 29 immutable. The Sprint Owner authorizes nexus-plan to generate the Sprint 30 Implementation Record and authorizes the Builder to implement Sprint 30 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-005

## Ratification Identifier

NEXUS-RAT-2026-07-14-005

## Date

2026-07-14

## Subject

Milestone 6 Opening and Sprint 31 Scope Ratification — Codex CLI Adapter Runtime Integration. Resolves the two governance questions `nexus-plan` raised after Milestone 5's completion (Sprint 30, `NEXUS-REV-2026-07-14-003`): (1) which direction Milestone 6 should take, and (2) which provider the second production Adapter should target.

## Originating Review Finding(s)

None. Originated as a Sprint Owner response to a `/nexus-plan` Repository Analysis (2026-07-14) raised after Milestone 5's completion.

## Governance Decision

**Milestone Direction:** Milestone 6 SHALL be titled **Multi-Provider Adapter Integration** (or an equivalent Sprint Owner-approved name applied at Sprint generation time) and SHALL begin with a **second production Adapter**, implemented and certified in isolation, mirroring the Sprint 29 pattern (implement → certify in isolation → defer Developer Workflow wiring to a later Sprint). The Sprint Owner explicitly declined, at this time, to prioritize a persisted Adapter-selection configuration surface, a third packaging/Marketplace slice, or Execution Model deepening; each remains a valid future candidate and none is foreclosed by this ratification.

**Provider Selection:** The second production Adapter SHALL target **Codex CLI**, not GitHub Copilot CLI or Claude CLI. This is the first ratification to bindingly select Codex CLI for a production Adapter; GitHub Copilot CLI and Claude CLI remain available as candidates for future Adapters.

**Authentication Model (inherited, not re-decided):** Consistent with `NEXUS-RAT-2026-07-14-002`'s Gemini CLI precedent and the provider-neutral guarantee already documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`, `CodexCliAdapter` SHALL assume a **pre-authenticated local `codex` CLI session**. Nexus SHALL NOT store, manage, request, prompt for, or otherwise handle credentials, API keys, tokens, or OAuth flows for Codex CLI, exactly as it does not for Gemini CLI. The Adapter SHALL invoke the already-authenticated local `codex` executable through the existing `LocalProcessRuntimeContract`, exactly as `GeminiCliAdapter` does.

**Isolation Boundary (binding, mirroring NEXUS-RAT-2026-07-14-003):** The implementing Sprint SHALL implement `CodexCliAdapter` conforming to the frozen RFC-0008 Adapter Contract, in isolation, validated via a deterministic local test-double executable (never a live `codex` CLI, for Automated Repository Validation) plus a documented, non-automated Manual Production Verification procedure against a real, locally authenticated Codex CLI installation — the identical Two-Tier Acceptance Criteria structure `NEXUS-RAT-2026-07-14-003` established for Gemini CLI. The Sprint SHALL NOT introduce Developer Workflow integration, modify Host orchestration, modify `HostMissionWorkflow`, or modify any `src/kernel` file. `CodexCliAdapter` SHALL be registered through the existing `createKernelServices` `adapters` option and exercised only via direct `AdapterService.dispatch` calls with an explicit `adapterId` in tests.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- implement a `CodexCliAdapter` (or equivalently named) production Adapter conforming to the existing, frozen RFC-0008 Adapter Contract, invoking a local `codex` CLI executable through the existing `LocalProcessRuntimeContract`, placed outside `src/kernel` mirroring `GeminiCliAdapter`'s (`src/adapters/gemini/`) and `MockAdapter`'s existing placement (e.g. `src/adapters/codex/`);
- deterministic diagnostics for executable-not-found, non-zero exit, malformed/unparseable output, timeout, and runtime error, reusing `ProcessDiagnostics` where applicable, mirroring `GeminiCliAdapter`'s diagnostic surface;
- composition-time registration of `CodexCliAdapter` through the existing `createKernelServices` `adapters` option, exercised only via direct `AdapterService.dispatch` calls in tests — NOT wired as any Developer Workflow command's dispatch target;
- an update to `ADAPTER_RUNTIME_INSTRUCTIONS.md` reconciling it as provider-neutral guidance now covering a second CLI-backed provider, without redefining its existing runtime-guidance-only scope;
- the automated deterministic-test-double suite and the documented (non-automated) Manual Production Verification procedure described above.

No Developer Workflow file, Host orchestration file, or Kernel file may be modified.

## Scope Restrictions

- No Developer Workflow integration; no `HostMissionWorkflow` change; no new Host command targeting `CodexCliAdapter`.
- No Host orchestration changes; no Kernel architectural changes.
- No Adapter Selection, provider routing, or persisted Adapter-configuration surface — that capability remains deferred, unaffected by this ratification, per `NEXUS-RAT-2026-07-13-011` and the Sprint 24/30 deferral.
- No authentication management, credential storage, OAuth, or `SecretStorage` integration — the pre-authenticated-local-session model remains binding for Codex CLI exactly as for Gemini CLI.
- No streaming responses or multi-provider coordination.
- The Manual Production Verification procedure SHALL remain documentation, not automation; it SHALL NOT be added to `npm run validate` or any CI-gating script.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, and existing integration tests SHALL continue to pass.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 7 — Adapter Framework (the Adapter Contract this implementation conforms to).
- Sprint 19 — Mock Adapter Runtime Integration; Sprint 29 — Gemini CLI Adapter Runtime Integration (the isolated-implementation-before-wiring precedent this Sprint mirrors exactly).
- Sprint 21 — Local Process Runtime Foundation (the process-execution primitive reused here).
- Sprint 30 — Developer Workflow Integration of GeminiCliAdapter (the completed Milestone 5 slice this ratification follows; `NEXUS-REV-2026-07-14-003`).
- `NEXUS-RAT-2026-07-14-002` (the Gemini CLI provider-selection/authentication-model precedent this ratification mirrors for Codex CLI).
- `NEXUS-RAT-2026-07-14-003` (the Two-Tier Acceptance Criteria and isolation-boundary precedent this ratification reuses verbatim).

## Related Review(s)

None. No Review finding originated this ratification; it resolves a `/nexus-plan` Repository Analysis and Sprint Owner direction.

## Full Ratification Text

> The Sprint Owner opens Milestone 6 following Milestone 5's completion (Sprint 30, NEXUS-REV-2026-07-14-003). Milestone 6 SHALL begin with a second production Adapter, implemented and certified in isolation, mirroring the Sprint 29 pattern of implement-then-certify-in-isolation before any Developer Workflow wiring is authorized. The Sprint Owner declines, at this time, to prioritize persisted Adapter-selection configuration, Marketplace publication, or Execution Model deepening; each remains available for a future Milestone. The second production Adapter SHALL target Codex CLI. CodexCliAdapter SHALL assume a pre-authenticated local codex CLI session, identical in structure to the Gemini CLI authentication model ratified by NEXUS-RAT-2026-07-14-002; Nexus SHALL NOT store, manage, request, or otherwise handle credentials, API keys, tokens, or OAuth flows for Codex CLI. The implementing Sprint SHALL implement CodexCliAdapter conforming to the frozen RFC-0008 Adapter Contract, via constructor-injected LocalProcessRuntimeContract, placed outside src/kernel mirroring GeminiCliAdapter's and MockAdapter's existing placement. The Sprint SHALL satisfy the identical Two-Tier Acceptance Criteria structure NEXUS-RAT-2026-07-14-003 established for Gemini CLI: Automated Repository Validation using a deterministic local test-double executable, never a live Codex CLI, as part of npm run validate; and a documented, non-automated Manual Production Verification procedure against a real, locally authenticated Codex CLI installation. The Sprint SHALL NOT introduce Developer Workflow integration, modify Host orchestration, modify HostMissionWorkflow, or modify any src/kernel file; CodexCliAdapter SHALL be registered through the existing createKernelServices adapters option and exercised only via direct AdapterService.dispatch calls with an explicit adapterId in tests. No previously approved test SHALL regress. This ratification does not modify RFC-0004, RFC-0008, RFC-0010, or the Kernel Canon. The Sprint Owner authorizes nexus-plan to generate the Sprint 31 Implementation Record under Milestone 6 and authorizes the Builder to implement Sprint 31 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-006

## Ratification Identifier

NEXUS-RAT-2026-07-14-006

## Date

2026-07-14

## Subject

Sprint 32 Scope Ratification — Production Workflow Parity (Developer Workflow Integration of `CodexCliAdapter`). Resolves the governance question `nexus-plan` raised after Sprint 31's independent certification (`NEXUS-REV-2026-07-14-004`) regarding which of the three candidate directions named in `NEXUS-RAT-2026-07-14-005`'s Governance Note (Developer Workflow integration of `CodexCliAdapter`, a persisted Adapter-selection configuration surface, or Execution Model deepening) Sprint 32 should pursue.

## Originating Review Finding(s)

None. Originated as a Sprint Owner response to a `/nexus-plan` governance question (2026-07-14) raised after Sprint 31's completion.

## Governance Decision

Sprint 32 SHALL be titled **Production Workflow Parity** and SHALL integrate `CodexCliAdapter` (certified in isolation by Sprint 31, `NEXUS-REV-2026-07-14-004`) into the Developer Workflow, mirroring the exact architectural pattern `NEXUS-RAT-2026-07-14-004` established for `GeminiCliAdapter` in Sprint 30. The Sprint Owner does **not** authorize a persisted Adapter-selection configuration surface or Execution Model deepening this Sprint; both remain valid candidates for a future Milestone/Sprint, unforeclosed by this ratification.

Sprint 32 SHALL introduce a **third, new Developer Workflow command** dedicated to `CodexCliAdapter` validation, leaving the existing `nexus.runDeveloperMissionWorkflow` (MockAdapter, frozen since Sprint 25) and `nexus.runDeveloperMissionWorkflowWithGeminiCli` (GeminiCliAdapter, frozen since Sprint 30) commands entirely unmodified. Upon completion, every certified production Adapter (`MockAdapter`, `GeminiCliAdapter`, `CodexCliAdapter`) SHALL have a corresponding, independently dispatched Developer Workflow command — the "Production Workflow Parity" this Sprint's title names.

## Architectural Responsibilities (binding)

- The Host MAY expose multiple Developer Workflow entry points (commands); this does not constitute Adapter Selection Policy.
- The Kernel SHALL remain unaware of which command initiated execution.
- Execution Strategy SHALL continue receiving an explicit adapter identifier at the call site, exactly as today.
- The Adapter Registry SHALL continue performing deterministic dispatch only, never routing or scoring.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add one new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithCodexCli`) that sequences the same authorized workflow steps already certified in Sprints 25–27 (Mission creation through Evidence/Review/Knowledge completion), with the Adapter dispatch step's explicit `adapterId` set to the `CodexCliAdapter` identifier instead of `MOCK_ADAPTER_ID`/`GEMINI_CLI_ADAPTER_ID`.
- Register `CodexCliAdapter` at the `extension.ts` composition root alongside the existing `MockAdapter`/`GeminiCliAdapter` registrations.
- Add the new command's contribution point (`package.json` `contributes.commands`/`activationEvents`) mirroring the existing commands' registration pattern.
- Add unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Codex CLI test-double (Sprint 31) — never a live `codex` CLI — so the new command's automated coverage remains CI-safe.
- Update `ADAPTER_RUNTIME_INSTRUCTIONS.md` only if reconciling the new command's existence requires it; no redefinition of its existing runtime-guidance-only scope.

The Builder SHALL NOT:

- modify the existing `nexus.runDeveloperMissionWorkflow` or `nexus.runDeveloperMissionWorkflowWithGeminiCli` commands' behavior, their `HostMissionWorkflow` construction, or any Sprint 25–31 test asserting their behavior;
- introduce any persisted VS Code configuration/setting for Adapter selection;
- introduce Adapter Selection Policy, provider routing, capability scoring, fallback, or multi-adapter coordination;
- introduce authentication management, credential storage, OAuth, or `SecretStorage` integration;
- introduce any RFC-0004 Execution Model concept beyond what Sprints 1–31 already certified;
- modify `src/kernel`.

## Scope Restrictions

- No persisted adapter preference, Workspace/User setting, or configuration subsystem of any kind.
- No modification to the existing, frozen `nexus.runDeveloperMissionWorkflow` or `nexus.runDeveloperMissionWorkflowWithGeminiCli` commands or their certified test coverage.
- No Adapter Selection, automatic provider routing, or capability scoring.
- No Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression) — remains deferred, unaffected by this ratification.
- No live-network-dependent step added to `npm run validate` or any script it invokes; the new command's automated tests SHALL use the existing deterministic Codex CLI test-double only.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, and existing integration tests (including the Sprint 28 Extension Host suite) SHALL continue to pass.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 25 — Developer Workflow Foundation; Sprint 26 — Developer Workflow Adapter Integration; Sprint 27 — Developer Workflow Completion (the certified workflow sequence this Sprint's new command reuses verbatim).
- Sprint 29 — Gemini CLI Adapter Runtime Integration; Sprint 30 — Developer Workflow Integration of GeminiCliAdapter (the isolated-implementation-then-wire precedent this Sprint mirrors exactly).
- Sprint 31 — Codex CLI Adapter Runtime Integration (`CodexCliAdapter`, the isolated implementation this Sprint wires in; `NEXUS-REV-2026-07-14-004`).
- `NEXUS-RAT-2026-07-14-004` (the Sprint 30 scope ratification this ratification mirrors provider-for-provider).
- `NEXUS-RAT-2026-07-14-005` (named this Sprint's three candidate directions; this ratification selects one).

## Related Review(s)

None. No Review finding originated this ratification; it resolves a `/nexus-plan` governance question.

## Full Ratification Text

> The Sprint Owner approves Sprint 32, titled Production Workflow Parity. Sprint 32 SHALL integrate CodexCliAdapter, certified in isolation by Sprint 31, into the Developer Workflow, mirroring exactly the architectural pattern NEXUS-RAT-2026-07-14-004 established for GeminiCliAdapter in Sprint 30. The Sprint Owner does not authorize a persisted Adapter-selection configuration surface or Execution Model deepening this Sprint; both remain valid future candidates, unforeclosed. Sprint 32 SHALL introduce a third Developer Workflow command dedicated to CodexCliAdapter, leaving nexus.runDeveloperMissionWorkflow (MockAdapter) and nexus.runDeveloperMissionWorkflowWithGeminiCli (GeminiCliAdapter) entirely unmodified. The new command SHALL dispatch via an explicit adapterId only; no Adapter routing, selection policy, persisted preference, or runtime ambiguity is introduced, remaining fully consistent with NEXUS-RAT-2026-07-13-011. The Host MAY expose multiple workflow entry points; the Kernel SHALL remain unaware of which command initiated execution; Execution Strategy SHALL continue receiving an explicit adapter identifier; the Adapter Registry SHALL continue performing deterministic dispatch only. Upon completion, every certified production Adapter SHALL have a corresponding, independently dispatched Developer Workflow command. No previously approved test SHALL regress. This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon. The Sprint Owner authorizes nexus-plan to generate the Sprint 32 Implementation Record under Milestone 6 and authorizes the Builder to implement Sprint 32 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-007

## Ratification Identifier

NEXUS-RAT-2026-07-14-007

## Date

2026-07-14

## Subject

Sprint 33 Scope Ratification — Adapter Configuration Foundation. Resolves the governance question `nexus-plan` raised after Sprint 32's completion (`NEXUS-REV-2026-07-14-005`/`-006`) regarding which of the three candidate directions named in `NEXUS-RAT-2026-07-14-005`'s Governance Note (persisted Adapter-selection configuration surface, a third production Adapter, or Execution Model deepening) Sprint 33 should pursue.

## Originating Review Finding(s)

None. Originated as a Sprint Owner response to a `/nexus-plan` governance question (2026-07-14) raised after Sprint 32's completion.

## Governance Decision

Sprint 33 SHALL be titled **Adapter Configuration Foundation**. The Sprint Owner selects the persisted Adapter-selection configuration surface as Milestone 6's next slice, declining at this time to add a fourth production Adapter or to begin Execution Model deepening; both remain valid future candidates, unforeclosed by this ratification.

Sprint 33 SHALL introduce a provider-neutral Adapter Configuration capability that allows the Host to resolve an explicit `adapterId` from VS Code User or Workspace configuration, while preserving the deterministic execution model established through Milestone 5 and Sprint 31/32. Configuration resolution SHALL occur entirely within the Host. The Kernel SHALL continue to be invoked with an explicit `adapterId` exactly as today — the Host resolves _which_ explicit `adapterId` to pass; it does not introduce Adapter Selection Policy, routing, or capability scoring. This distinction is binding: resolving a configured default identifier is not the same architectural concept as automatic provider selection, which `NEXUS-RAT-2026-07-13-011` continues to defer.

## Architectural Responsibilities (binding)

- The Host MAY read a User/Workspace-scoped configuration value naming a default Developer Workflow `adapterId`; this is a Host-local concern, not a Kernel concept.
- The Kernel SHALL remain unaware of configuration; it SHALL continue to receive only an explicit `adapterId` at the call site, exactly as today.
- The Adapter Registry SHALL continue performing deterministic dispatch only, never routing or scoring.
- The existing explicit-command workflow (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`) SHALL remain available and unmodified; configuration is additive, not a replacement for explicit commands.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add VS Code User and Workspace configuration (`package.json` `contributes.configuration`) declaring a default Developer Workflow adapter identifier setting.
- Implement Host-local resolution of this configuration value into an explicit `adapterId`, consumed only by the Host before invoking the existing, unmodified execution pipeline.
- Preserve the existing execution pipeline (`HostMissionWorkflow`, `AdapterService.dispatch`, and the full Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence) unchanged.
- Maintain backward compatibility with the three existing explicit Developer Workflow commands (`MockAdapter`, `GeminiCliAdapter`, `CodexCliAdapter`), which SHALL continue to dispatch via their own hardcoded `adapterId` exactly as certified in Sprints 25, 30, and 32.
- Add unit/integration test coverage for configuration resolution (default present, default absent, default naming an unregistered/unknown adapter identifier), using only deterministic test-doubles.

The Builder SHALL NOT:

- introduce Adapter Selection Policy, routing, capability scoring, automatic provider selection, role-based adapter assignment, or multi-provider coordination;
- modify the behavior, dispatch target, or test coverage of any existing Developer Workflow command;
- introduce any RFC-0004 Execution Model concept beyond what Sprints 1–32 already certified;
- introduce authentication management, credential storage, OAuth, or `SecretStorage` integration;
- modify `src/kernel`.

## Scope Restrictions

- No Adapter Selection Policy, routing, capability scoring, or automatic provider selection — configuration resolves a single explicit default identifier; it does not choose among adapters based on runtime state, capability, or role.
- No role-based adapter assignment or multi-provider coordination.
- No Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression) — remains deferred, unaffected by this ratification.
- No modification to the three existing, frozen Developer Workflow commands or their certified test coverage.
- No live-network-dependent step added to `npm run validate` or any script it invokes.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, and existing integration tests (including the Sprint 28 Extension Host suite and the Sprint 18 kernel boundary test) SHALL continue to pass.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 24 — Adapter Runtime Operational Metadata; Sprint 30 — Developer Workflow Integration of GeminiCliAdapter; Sprint 32 — Production Workflow Parity (each deferred persisted Adapter-selection configuration to a future Sprint; this Sprint is that future Sprint).
- Sprint 25/26/27 — Developer Workflow Foundation/Adapter Integration/Completion (the certified execution pipeline this Sprint's configuration resolution feeds an explicit `adapterId` into, unchanged).
- `NEXUS-RAT-2026-07-13-011` (the binding constraint that explicit-`adapterId`-only dispatch continues; this ratification clarifies that configuration-resolved defaults are not Adapter Selection Policy).
- `NEXUS-RAT-2026-07-14-005` (named this Sprint's three candidate directions; this ratification selects one).

## Related Review(s)

None. No Review finding originated this ratification; it resolves a `/nexus-plan` governance question.

## Full Ratification Text

> The Sprint Owner approves Sprint 33, titled Adapter Configuration Foundation. Sprint 33 SHALL introduce a provider-neutral Adapter Configuration capability that allows the Host to resolve an explicit adapterId from User or Workspace configuration while preserving the deterministic execution model established in Milestone 5. Configuration SHALL be resolved entirely within the Host. The Kernel SHALL continue to be invoked with an explicit adapterId. The existing execution pipeline SHALL remain unchanged. The three existing explicit Developer Workflow commands SHALL remain available and unmodified, maintaining backward compatibility. The Sprint Owner explicitly declines, at this time, to authorize Adapter Selection Policy, routing, capability scoring, automatic provider selection, role-based adapter assignment, multi-provider coordination, or Execution Model expansion (RFC-0004); each remains a valid future candidate, unforeclosed. No previously approved test SHALL regress. This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon. The Sprint Owner authorizes nexus-plan to generate the Sprint 33 Implementation Record under Milestone 6 and authorizes the Builder to implement Sprint 33 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-008

## Ratification Identifier

NEXUS-RAT-2026-07-14-008

## Date

2026-07-14

## Subject

Sprint 33 Review Remediation Authorization. Authorizes Builder remediation of the two Critical Category 2 Architectural Violations and one Documentation Drift finding recorded by `NEXUS-REV-2026-07-14-007` (Sprint 33 — Adapter Configuration Foundation, disposition FAIL), as translated into `builder-task.md` TASK-001, TASK-002, and DOC-001.

## Originating Review Finding(s)

- `NEXUS-REV-2026-07-14-007-F-001` (Critical, Category 2 — Architectural Violation) — the pre-existing `nexus.runDeveloperMissionWorkflow` command's dispatch target was made configuration-dependent instead of remaining hardcoded.
- `NEXUS-REV-2026-07-14-007-F-002` (Critical, Category 2 — Architectural Violation) — unauthorized retroactive edits to the Active `NEXUS-RAT-2026-07-14-005` ratification and the Approved Sprint 31 record.
- `NEXUS-REV-2026-07-14-007-F-003` (Minor, Category 4 — Documentation Drift) — `IMPLEMENTATION_REPORT.md`'s Sprint 33 section inaccurately declares no architectural deviations.

## Governance Decision

The Sprint Owner accepts the findings recorded in `NEXUS-REV-2026-07-14-007` in full. The findings identify implementation divergence from the already-approved `NEXUS-RAT-2026-07-14-007`, not a need for new architectural direction. No new architectural concepts are introduced and no architectural direction changes; this ratification authorizes implementation reconciliation only. Sprint 33 remains an implementation remediation sprint whose objective is to restore conformance with the previously approved architectural intent, preserving the certified architectural baseline established through Milestones 1–5.

**TASK-001 — Developer Workflow Configuration.** Approved. The existing explicit Developer Workflow commands (`nexus.runDeveloperMissionWorkflow`, `nexus.runDeveloperMissionWorkflowWithGeminiCli`, `nexus.runDeveloperMissionWorkflowWithCodexCli`) remain immutable and SHALL be restored to their previously certified behavior exactly as approved in Sprints 25, 30, and 32. The Adapter Configuration capability SHALL remain additive, exposed only through a separate additive command or equivalent additive Host surface. Configuration SHALL NOT modify the dispatch behavior of any existing command; the Host MAY resolve configuration only for the newly introduced additive workflow entry point. The Kernel SHALL remain unaware of configuration. The explicit-`adapterId`-dispatch model established by previous ratifications (including `NEXUS-RAT-2026-07-13-011`) SHALL remain the only authorized dispatch mechanism.

**TASK-002 — Governance Artifact Integrity.** Approved. Previously approved governance artifacts SHALL NOT be rewritten. The Builder SHALL restore `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `NEXUS-RAT-2026-07-14-005`, and the Sprint 31 Implementation Record to their previously approved wording. If the Sprint Owner later decides to rename Milestone 6, that SHALL occur only through a new, superseding ratification — historical governance artifacts SHALL remain immutable, and normative governance history SHALL be corrected through superseding artifacts rather than modification of previously approved records.

**DOC-001 — Documentation Disclosure.** Approved. After TASK-001 and TASK-002 are completed, the Builder SHALL update `IMPLEMENTATION_REPORT.md` and the Sprint 33 Implementation Record to accurately disclose the implemented remediation. Documentation SHALL describe the corrective action taken and SHALL NOT state that no deviations occurred when remediation has been required. Repository documentation SHALL always distinguish between implementation behavior, governance remediation, and architectural evolution.

## Governance Reinforcement (binding on future Builder work)

1. Previously approved implementation behavior SHALL remain immutable unless explicitly superseded by a new Sprint Owner ratification.
2. Previously approved governance artifacts SHALL NOT be edited to reflect later architectural decisions. Future changes SHALL be recorded through new governance artifacts that reference earlier decisions.
3. New implementation capabilities SHALL be additive unless a ratification explicitly authorizes behavioral replacement.

## Architectural Impact

None. This ratification performs implementation reconciliation only. The architectural baseline established through Milestones 1–5 remains unchanged. Sprint 33 continues to introduce exactly one architectural capability — Adapter Configuration Foundation — and no additional capability is authorized.

## Authorized Builder Scope

The Builder is authorized only to:

- implement TASK-001 (`builder-task.md`);
- implement TASK-002 (`builder-task.md`);
- complete DOC-001 (`builder-task.md`);
- update associated automated tests where required;
- update implementation documentation reflecting the remediation.

The Builder SHALL NOT:

- modify Kernel behavior;
- modify RFCs;
- introduce Adapter Selection, routing, or persisted-preference semantics beyond the already-approved Sprint 33 scope;
- introduce additional Host responsibilities;
- modify previously approved governance artifacts except as explicitly authorized by this ratification (i.e., restoring them to their previously approved wording).

## Scope Restrictions

- No Adapter Selection Policy, routing, capability scoring, or automatic provider selection.
- No Execution Model deepening or new RFC-0004 concepts.
- No authentication management, credential storage, OAuth, or `SecretStorage` integration.
- No modification to `src/kernel`.
- Sprint 33 remediation is complete only when: TASK-001 and TASK-002 pass independent Reviewer re-verification; DOC-001 accurately documents the remediation; repository-wide validation passes; Sprint 18's Kernel Boundary Certification passes unmodified; the three existing Developer Workflow commands retain their previously approved behavior; the Adapter Configuration capability exists only as an additive Host capability; previously approved governance artifacts are restored; and repository history is internally consistent.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 25 — Developer Workflow Foundation; Sprint 30 — Developer Workflow Integration of GeminiCliAdapter; Sprint 32 — Production Workflow Parity (the certified command behavior this ratification requires be restored).
- Sprint 31 — Codex CLI Adapter Runtime Integration (the Approved record this ratification requires be restored to its originally approved wording).
- Sprint 33 — Adapter Configuration Foundation (the Rejected sprint this ratification authorizes remediation of).
- `NEXUS-RAT-2026-07-14-007` (the original Sprint 33 scope ratification; remediation restores conformance with it, does not supersede it).
- `NEXUS-RAT-2026-07-13-011` (the explicit-`adapterId`-only dispatch constraint this ratification reaffirms).

## Related Review(s)

- `NEXUS-REV-2026-07-14-007` (Sprint 33, disposition FAIL — the review this ratification responds to).

## Full Ratification Text

> The Sprint Owner accepts the findings recorded in NEXUS-REV-2026-07-14-007. The findings identify implementation divergence from the already-approved Sprint 33 ratification (NEXUS-RAT-2026-07-14-007). No new architectural concepts are introduced. No architectural direction changes. This ratification authorizes implementation reconciliation only. Sprint 33 remains an implementation remediation sprint; the objective is to restore conformance with previously approved architectural intent; all remediation SHALL preserve the certified architectural baseline established through Milestones 1-5. TASK-001 (Developer Workflow Configuration) is approved: the existing explicit Developer Workflow commands remain immutable; the Adapter Configuration capability SHALL remain additive; the Builder SHALL restore the previously certified command behavior exactly as approved in Sprints 25, 30, and 32; the configured-dispatch capability SHALL be exposed through a separate additive command or equivalent additive Host surface; nexus.runDeveloperMissionWorkflow, nexus.runDeveloperMissionWorkflowWithGeminiCli, and nexus.runDeveloperMissionWorkflowWithCodexCli SHALL remain unchanged; configuration SHALL NOT modify the dispatch behavior of any existing command; the Host MAY resolve configuration only for the newly introduced additive workflow entry point; the Kernel SHALL remain unaware of configuration; the explicit adapterId dispatch model established by previous ratifications SHALL remain the only authorized dispatch mechanism. TASK-002 (Governance Artifact Integrity) is approved: previously approved governance artifacts SHALL NOT be rewritten; the Builder SHALL restore IMPLEMENTATION_PLAN.md, IMPLEMENTATION_MANIFEST.md, NEXUS-RAT-2026-07-14-005, and the Sprint 31 implementation record to their previously approved wording; if the Sprint Owner later decides to rename Milestone 6, that SHALL occur only through a new superseding ratification; historical governance artifacts SHALL remain immutable. DOC-001 (Documentation Disclosure) is approved: after TASK-001 and TASK-002 are completed, the Builder SHALL update IMPLEMENTATION_REPORT.md and the Sprint 33 Implementation Record to accurately disclose the implemented remediation; documentation SHALL NOT state that no deviations occurred when remediation has been required. The Builder is authorized only to implement TASK-001, implement TASK-002, complete DOC-001, update associated automated tests where required, and update implementation documentation reflecting the remediation; the Builder SHALL NOT modify Kernel behavior, modify RFCs, introduce Adapter Selection or routing, introduce persisted preference semantics beyond the already approved Sprint 33 scope, introduce additional Host responsibilities, or modify previously approved governance artifacts except as explicitly authorized here. Sprint 33 remediation is complete when TASK-001 and TASK-002 pass independent review, DOC-001 accurately documents the remediation, repository validation passes, Sprint 18 Kernel Boundary Certification passes unchanged, existing certified Developer Workflow commands retain their previously approved behavior, the Adapter Configuration capability exists only as an additive Host capability, previously approved governance artifacts are restored, and repository history remains internally consistent. Upon successful completion, Sprint 33 remains the authoritative implementation of Adapter Configuration Foundation, previously approved vertical slices remain immutable, governance artifact integrity is restored, and planning may proceed to Sprint 34.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-009

## Ratification Identifier

NEXUS-RAT-2026-07-14-009

## Date

2026-07-14

## Subject

Sprint 34 Scope Ratification — Developer Workflow UX Consolidation. Resolves the `nexus-plan` governance question raised after Sprint 33's completion (`NEXUS-REV-2026-07-14-008`/`-009`): whether the candidate "Sprint 34 — Unified Developer Workflow" objective is still open, given that Sprint 33 already delivered the Host Configuration → explicit `adapterId` → Execution Pipeline architecture that objective describes as its end state.

## Originating Review Finding(s)

None. Originated as a `/nexus-plan` Governance Report (2026-07-14) identifying that the candidate Sprint 34 objective, read literally, would require modifying or removing the three existing Developer Workflow commands (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`) — an action `NEXUS-RAT-2026-07-14-007` and `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability already prohibit without a superseding ratification.

## Governance Decision

The Sprint Owner confirms that Sprint 33 already completed the architectural unification: a provider-neutral Developer Workflow entry point (`nexus.runDeveloperMissionWorkflowWithConfiguredAdapter`) resolving a Host-configured default `adapterId` through the unchanged, certified Execution Pipeline exists today. Sprint 34 SHALL NOT re-open, redesign, or re-litigate this architecture.

Sprint 34 is approved as a **Developer Workflow UX Consolidation** sprint — documentation, discoverability, and product-usability scope only. Sprint 34 SHALL NOT introduce any new runtime or architectural capability.

Sprint 34 SHALL:

- promote `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the canonical, primary developer entry point in user-facing surfaces (command title/description, `package.json` `contributes.commands` ordering/labeling, README/user-facing documentation, Command Palette presentation);
- improve command discoverability, naming, and user guidance for the configured-adapter workflow;
- preserve the existing Host → explicit `adapterId` → Execution Pipeline architecture established by Sprint 33 exactly as certified;
- leave `nexus.runDeveloperMissionWorkflow`, `nexus.runDeveloperMissionWorkflowWithGeminiCli`, and `nexus.runDeveloperMissionWorkflowWithCodexCli` fully operational, unmodified in behavior, and available as backward-compatible entry points.

Removal or deprecation of the three existing provider-specific commands is explicitly **not authorized** by this ratification and is deferred to a future governance ratification, to be considered only after sufficient operational experience with the consolidated UX has been gathered.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Edit `package.json` `contributes.commands` titles/descriptions/ordering to present `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the primary Developer Workflow command.
- Edit user-facing documentation (README, in-repo usage guidance) describing the configured-adapter command as the recommended default and the three provider-specific commands as explicit/compatibility alternatives.
- Add clarifying command descriptions, tooltips, or `enablement`/category metadata supported by the existing VS Code contribution model, without changing command identifiers, registration order, or dispatch targets.
- Add or extend documentation-level test coverage (e.g., asserting `package.json` command metadata) where it does not require any change to `src/kernel`, `src/adapters`, or existing command dispatch behavior.

The Builder SHALL NOT:

- rename, remove, merge, or alias any existing command identifier (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`, `...WithConfiguredAdapter`, `nexus.showMissionWorkflowHistory`);
- change any command's dispatch target, adapter resolution behavior, or execution pipeline;
- introduce Adapter Selection Policy, routing, capability scoring, or automatic provider selection;
- introduce any new RFC-0004, RFC-0008, RFC-0009, or RFC-0010 concept;
- modify `src/kernel` or `src/adapters`;
- modify the behavior or test coverage of any existing Developer Workflow command.

## Scope Restrictions

- Documentation, metadata, and presentation changes only; no runtime dispatch logic may change.
- No modification to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, `HostMissionWorkflowCommandRegistration`'s registration logic, or any Kernel/Adapter source file.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.
- This ratification does not authorize deprecation or removal of any existing command; that remains explicitly deferred.

## Related Sprint(s)

- Sprint 33 — Adapter Configuration Foundation (the architecture this Sprint promotes in the UX layer, unmodified).
- Sprint 25/30/32 — Developer Workflow Foundation / GeminiCliAdapter Integration / Production Workflow Parity (the three existing commands preserved as compatibility entry points).

## Related Review(s)

- `NEXUS-REV-2026-07-14-008`, `NEXUS-REV-2026-07-14-009` (Sprint 33 approval and remediation verification, the baseline this Sprint builds on).

## Full Ratification Text

> The Sprint Owner ratifies Sprint 34 as a Developer Workflow UX Consolidation sprint. Sprint 34 SHALL NOT introduce any new runtime or architectural capability. Sprint 34 SHALL promote `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as the canonical developer entry point; improve command discoverability, naming, documentation, package metadata, and user guidance; preserve the existing Host → explicit adapterId → Execution Pipeline architecture established by Sprint 33; and leave all existing provider-specific commands operational for backward compatibility. The existing commands SHALL be treated as compatibility entry points rather than primary user workflows. Removal or deprecation of previously approved commands is explicitly deferred to a future governance ratification after sufficient operational experience has been gathered. Rationale: Sprint 33 already completed the architectural unification; Sprint 34 therefore focuses exclusively on developer experience, discoverability, and product usability while preserving Approved Vertical Slice Immutability. No architectural changes are authorized.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-010

## Ratification Identifier

NEXUS-RAT-2026-07-14-010

## Date

2026-07-14

## Subject

Sprint 35 Scope Ratification — Builder Workflow Foundation. Resolves the `nexus-plan` governance question raised after Sprint 34's completion (`NEXUS-REV-2026-07-14-010`): which of Milestone 6's remaining candidate directions (a fourth production Adapter, Marketplace publication, or Execution Model deepening, per `NEXUS-RAT-2026-07-14-005`'s Governance Note) Sprint 35 should pursue. The Sprint Owner selected a fourth, previously unnamed direction instead: introducing a dedicated Builder Workflow as the first of a family of role-scoped AI Engineering Workflows.

## Originating Review Finding(s)

None. Originated as a direct Sprint Owner scope decision (2026-07-14) during `/nexus-plan`, superseding the three candidate directions `nexus-plan` had proposed for Sprint Owner selection.

## Governance Decision

Sprint 35 SHALL be titled **Builder Workflow Foundation**. The Sprint Owner directs introduction of the first AI Engineering Workflow: a dedicated Builder Workflow entry point that reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture verbatim, differing from the existing Developer Workflow only in explicit Role framing and Builder-specific result presentation.

`/nexus-plan` verified this decision does not require any Kernel, Adapter, or RFC change before ratifying it: `builder` and `reviewer` are already registered default Execution Roles (Sprint 8, `src/kernel/execution/default-kernel-roles.ts`), and the existing `HostMissionWorkflow` pipeline (Sprint 25) already defaults its `roleId` constructor option to `'builder'` (`src/hosts/vscode/host-mission-workflow.ts:129`) for every existing Developer Workflow command. "Developer Workflow" itself is a Sprint-25-invented Host-layer term not defined by RFC-0009; "Builder Workflow" is the same category of Host-layer naming and introduces no RFC-0009 concept. Sprint 35 therefore reuses an already-exercised Kernel Role and an already-parameterized Host pipeline option; it does not introduce Role-based adapter assignment, automatic routing, or any new Execution Model concept.

## Architectural Responsibilities (binding)

- The Host MAY expose a second, additive Developer/Builder-Workflow-style command that constructs the existing `HostMissionWorkflow` (or an equivalent thin Host wrapper) with an explicit `roleId: 'builder'`, reusing the identical certified Execution Pipeline, Host Adapter Configuration resolution, and explicit-`adapterId` dispatch established through Sprints 25–34.
- The Kernel SHALL remain unaware of "Builder Workflow" as a concept; it continues to receive only Role identifiers and Adapter identifiers it already understands (`builder`, explicit `adapterId`).
- Presentation of Builder-specific execution results (e.g., labeling output/history entries with the assigned Role) is a Host presentation-layer concern only.
- The existing Developer Workflow commands (Mock/Gemini/Codex/Configured-Adapter) SHALL remain available, unmodified, exactly as certified in Sprints 25, 30, 32, and 33.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add a new, additive Host command (e.g. `nexus.runBuilderMissionWorkflow`) constructing the existing `HostMissionWorkflow`/`HostConfiguredMissionWorkflow` machinery with an explicit `roleId: 'builder'` and Host Adapter Configuration resolution reused verbatim from Sprint 33.
- Register the new command's contribution point (`package.json` `contributes.commands`/`activationEvents`), following the existing registration pattern.
- Extend Host presentation/result formatting to label the new command's output as Builder-specific (e.g., surfacing the assigned Role name), without introducing new Kernel data or a new Domain Event.
- Add unit/integration test coverage for the new command's success and failure paths, reusing existing deterministic test-doubles exclusively.

The Builder SHALL NOT:

- introduce a Reviewer Workflow, Planner Workflow, or any other role-scoped workflow beyond Builder — these remain explicitly deferred;
- introduce role-based adapter assignment, automatic routing, workflow chaining, or multi-agent coordination;
- introduce any new RFC-0004 Execution Model concept (Execution State expansion, Execution Session, Review-gated progression);
- introduce a fourth production Adapter or any Adapter Selection Policy;
- modify the behavior, dispatch target, or test coverage of any existing Developer Workflow command;
- modify `src/kernel` behavior (only Host-layer construction/wiring using existing Kernel contracts is authorized) or `src/adapters`.

## Scope Restrictions

- No Reviewer Workflow, Planner Workflow, role-based adapter assignment, workflow chaining, multi-agent coordination, automatic routing, Execution Model expansion, or additional production Adapters — each explicitly and entirely deferred by this ratification, not merely event-silent.
- No modification to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or any existing command's registration/dispatch logic.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.
- This ratification does not authorize any change to the Sprint 8-approved `ExecutionRole`/`RoleAssignment` model; the Builder role is consumed exactly as already registered.

## Related Sprint(s)

- Sprint 8 — Execution Roles (the approved baseline defining the `builder`/`reviewer` roles this Sprint consumes unmodified).
- Sprint 25/26/27 — Developer Workflow Foundation/Adapter Integration/Completion (the certified pipeline and `roleId` parameterization this Sprint reuses).
- Sprint 33 — Adapter Configuration Foundation (the Host Adapter Configuration resolution this Sprint reuses unmodified).

## Related Review(s)

- `NEXUS-REV-2026-07-14-010` (Sprint 34 approval, the baseline this Sprint builds on).

## Full Ratification Text

> The Sprint Owner ratifies Sprint 35 as Builder Workflow Foundation: introduction of the first AI Engineering Workflow by implementing a dedicated Builder Workflow that reuses the certified Host, Configuration, Execution Pipeline, and Adapter architecture. Authorized scope: add a Builder Workflow entry point; reuse Host-owned adapter configuration; reuse explicit adapterId dispatch; reuse the certified Execution Pipeline; present Builder-specific execution results; preserve existing Developer Workflow behavior. Explicitly deferred: Reviewer Workflow; Planner Workflow; role-based adapter assignment; workflow chaining; multi-agent coordination; automatic routing; Execution Model expansion; additional production adapters. Expected outcome: Nexus evolves from a generic Developer Workflow into the first dedicated AI Engineering Workflow while preserving the certified execution architecture. `/nexus-plan` verified before ratifying that `builder` is already a registered default Execution Role (Sprint 8) and that the existing Developer Workflow pipeline already defaults to it, so this Sprint introduces no new Kernel Role, Kernel behavior, or RFC concept — only an additive Host-layer command and presentation change.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-011

## Ratification Identifier

NEXUS-RAT-2026-07-14-011

## Date

2026-07-14

## Subject

Milestone Boundary Ratification — Closing Milestone 6 (Multi-Provider Adapter Integration) and Opening Milestone 7 (AI Engineering Workflows). Resolves the `nexus-plan` governance question, raised after Sprint 35's independent certification (`NEXUS-REV-2026-07-14-011`), of whether Sprint 35 — Builder Workflow Foundation (`NEXUS-RAT-2026-07-14-010`) belongs to Milestone 6 or opens a new milestone.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` milestone-governance analysis, approved by the Sprint Owner with refinement (2026-07-14).

## Governance Decision

Milestone 6 — Multi-Provider Adapter Integration is declared **Complete** as of Sprint 34. Its ratified Objective and both Expected Outcomes (`NEXUS-RAT-2026-07-14-005`) were fully satisfied by Sprints 31–33 (second production Adapter, its Developer Workflow integration, and a persisted Adapter-selection configuration surface), with Sprint 34 serving as its closing presentation slice. No further Sprint SHALL be added to Milestone 6.

Milestone 7 — AI Engineering Workflows is opened. Sprint 35 — Builder Workflow Foundation is retroactively classified as Milestone 7's opening Sprint. This ratification does not reopen, modify, or invalidate any Sprint 31–35 implementation, review, or ratification; it reclassifies milestone-level bookkeeping only.

Milestone 7's objective: establish a family of dedicated, Role-scoped AI Engineering Workflow entry points at the Host layer. Each workflow SHALL reuse the already-certified Host, Kernel, Execution Pipeline, Adapter Runtime, and Adapter Configuration without modification, differing only by Execution Role, Host presentation, and workflow-specific result presentation. No Milestone 7 Sprint SHALL introduce Kernel ownership changes, Adapter Contract changes, Adapter Selection, Role-to-Adapter routing, Execution Session, Assignment Policy, Workflow Chaining, or multi-agent orchestration, unless separately authorized through a future RFC or Sprint Owner ratification.

The Sprint Owner names the following as Milestone 7's provisional roadmap direction (each subsequent Sprint SHALL still require its own detailed Sprint Owner scope ratification before implementation, mirroring the `NEXUS-RAT-2026-07-14-010` precedent):

- Sprint 36 — Reviewer Workflow Foundation: reuse the Sprint 35 Host-wrapper pattern verbatim, using the already-registered `reviewer` Execution Role (Sprint 8). No new Kernel Role or RFC concept required.
- Sprint 37 — Documentation Workflow Foundation: register `Documentation Reviewer` as an additional default Kernel Role — a Role RFC-0004 already names in its "Additional roles MAY include" enumeration (`knowledge/specifications/rfc-0004-execution-model.md`) — then expose the corresponding Host workflow. This is the first Milestone 7 Sprint expected to touch `src/kernel` (Role registration only) and SHALL require its own explicit Builder-scope authorization.

A **Planner Workflow** SHALL NOT be scheduled under this or any current ratification. "Planner" is not an RFC-0004 Execution Role — RFC-0004's Default and Additional Role enumerations do not name it. Introducing it requires either an RFC-0004 amendment or a new RFC defining the Role; it remains deferred pending that governance step.

**Milestone 8 — Engineering Orchestration** is named as a future milestone, Status: NOT YET STARTED. Candidate scope: Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Sessions, Multi-agent Engineering Orchestration, and review-gated execution progression. These are execution-orchestration concerns, not Host-workflow concerns, and are intentionally excluded from Milestone 7. No Sprint under Milestone 8 is authorized by this ratification.

## Authorized Scope

`nexus-plan` MAY:

- Update `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` to: close Milestone 6's Status as Complete at Sprint 34; insert a Milestone 7 — AI Engineering Workflows header (Objective per this ratification) preceding the existing Sprint 35 section; relocate the existing Sprint 35 section under that header without altering its content; append a Milestone 8 — Engineering Orchestration stub (Status: NOT YET STARTED, candidate scope only, no Sprint entries).
- Propose Sprint 36 — Reviewer Workflow Foundation as the next Sprint for Sprint Owner review, per the Planning State Machine's Proposal state.

`nexus-plan` SHALL NOT:

- Modify any Sprint 31–35 Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Activate Sprint 36 or generate its Sprint Implementation Record without a further, Sprint-specific Sprint Owner scope ratification.
- Register `Documentation Reviewer` or any other new Kernel Role under this ratification — that is reserved for Sprint 37's own scope ratification.
- Schedule, name, or authorize a Planner Workflow, Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Session, or multi-agent orchestration Sprint under this ratification.

## Related Sprint(s)

- Sprint 31–34 — the completed Milestone 6 Sprints this ratification closes.
- Sprint 35 — Builder Workflow Foundation (`NEXUS-RAT-2026-07-14-010`), retroactively reclassified as Milestone 7's opening Sprint.

## Related Review(s)

- `NEXUS-REV-2026-07-14-011` (Sprint 35 approval — the review whose completion triggered this milestone-governance question).

## Full Ratification Text

> The Sprint Owner approves the `nexus-plan` milestone governance analysis with refinement. Milestone 6 — Multi-Provider Adapter Integration is closed as Complete at Sprint 34; its objective and expected outcomes were fully satisfied by Sprints 31–34. Milestone 7 — AI Engineering Workflows is opened, with Sprint 35 — Builder Workflow Foundation retroactively classified as its first Sprint. Milestone 7's objective is to establish a family of Role-scoped AI Engineering Workflow entry points at the Host layer, each reusing the certified Host, Kernel, Execution Pipeline, Adapter Runtime, and Adapter Configuration without modification, varying only by Execution Role and Host presentation. No Milestone 7 Sprint may introduce Kernel ownership changes, Adapter Contract changes, Adapter Selection, Role-to-Adapter routing, Execution Session, Assignment Policy, Workflow Chaining, or multi-agent orchestration without separate authorization. The Sprint Owner names Sprint 36 — Reviewer Workflow Foundation (reusing the existing `reviewer` Role) and Sprint 37 — Documentation Workflow Foundation (registering the RFC-0004-named `Documentation Reviewer` Role) as Milestone 7's provisional roadmap direction; each still requires its own detailed Sprint Owner scope ratification before implementation. A Planner Workflow is not authorized — "Planner" is not an RFC-0004 Role and requires an RFC-0004 amendment or new RFC before it may be scheduled. Milestone 8 — Engineering Orchestration is named as a future milestone covering Engineering Role Profiles, Workflow Chaining, Assignment Policy, Execution Sessions, and multi-agent orchestration; it is explicitly deferred and no Sprint under it is authorized. This ratification changes only milestone taxonomy and roadmap naming; it does not modify Sprint 35's implementation, review, or governance record, any historical implementation record, any RFC, or the Kernel Canon. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` milestone bookkeeping accordingly and to propose Sprint 36 for Sprint Owner review.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-012

## Ratification Identifier

NEXUS-RAT-2026-07-14-012

## Date

2026-07-14

## Subject

Sprint 36 Scope Ratification — Reviewer Workflow Foundation, establishing the canonical Role-scoped Workflow construction pattern for Milestone 7. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-14-011` opened Milestone 7, and incorporates a Sprint-Owner-directed architectural invariant governing this and all future Milestone 7 Sprints.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 36 — Reviewer Workflow Foundation), refined by an explicit Sprint Owner architectural invariant before approval, and approved as refined (2026-07-14).

## Governance Decision

Sprint 36 SHALL be titled **Reviewer Workflow Foundation**. It adds `nexus.runReviewerMissionWorkflow`, constructed with explicit `roleId: 'reviewer'` (Sprint 8's registered Execution Role), reusing Host Adapter Configuration resolution (Sprint 33) and the certified Execution Pipeline (Sprints 25–27) verbatim — mirroring Sprint 35's Builder Workflow exactly in externally observable behavior.

**Architectural Invariant (binding on this and all future Milestone 7 Sprints):** Every Role-scoped Workflow entry point SHALL differ from every other **only** by (a) the Execution Role requested and (b) workflow presentation metadata (`workflowLabel`, `completionMessageLabel`, `includeAssignedRole`, and equivalents). All such workflows SHALL reuse, unmodified: Host Adapter Configuration, explicit-`adapterId` dispatch, the certified Execution Pipeline, Adapter Runtime, and Kernel contracts. This invariant is not Sprint-36-specific; it governs Sprint 37 and every subsequent Milestone 7 Sprint.

## Architectural Responsibilities (binding)

- The Role-scoped Configured Mission Workflow construction currently duplicated in `vscode-host.ts` (the `Map`-of-`HostMissionWorkflow` + `HostConfiguredMissionWorkflow` block, presently written once for the Developer Workflow and once, near-identically, for the Builder Workflow) SHALL be extracted into a single reusable Host-layer factory function parameterized by `roleId` and `presentationOptions`.
- The existing Builder Workflow wiring (Sprint 35) SHALL be refactored to call this factory instead of its current inline duplicate. This is a **behavior-preserving refactor only**: `nexus.runBuilderMissionWorkflow`'s command identifier, dispatch target, presentation strings, and test coverage SHALL be unaffected and SHALL continue passing unmodified.
- The Reviewer Workflow SHALL be added using the same factory: `nexus.runReviewerMissionWorkflow`, `roleId: 'reviewer'`, `presentationOptions: { workflowLabel: 'Reviewer Workflow', completionMessageLabel: 'Reviewer workflow', includeAssignedRole: true }`.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Extract the Role-scoped Configured Mission Workflow construction into a single reusable Host-layer factory function, as described above.
- Refactor the existing Builder Workflow wiring (Sprint 35) to call this factory, preserving its command identifier, dispatch target, presentation strings, and test coverage exactly.
- Add `nexus.runReviewerMissionWorkflow` using the same factory, with explicit `roleId: 'reviewer'` and the presentation options specified above.
- Register the new command's contribution point (`package.json` `contributes.commands`/`activationEvents`), following the existing registration pattern.
- Add unit/integration test coverage for the new command's success and failure paths (mirroring Sprint 35's two new tests), plus package-metadata/extension-host discoverability assertions, and a regression assertion that the refactored Builder Workflow's existing tests still pass unchanged.

The Builder SHALL NOT:

- Modify `src/kernel` or `src/adapters`.
- Introduce a new Kernel Role, RFC concept, Role-to-Adapter routing, or Adapter Selection Policy.
- Modify `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow` contracts, or any existing command's identifier, dispatch behavior, or test coverage beyond the authorized internal refactor of the Builder Workflow's construction.
- Introduce a Planner Workflow, Documentation Workflow, Engineering Role Profiles, Workflow Chaining, Execution Session, or Assignment Policy concept.

## Scope Restrictions

- No `src/kernel` or `src/adapters` change.
- No new Kernel Role, RFC concept, Role-to-Adapter routing, or Adapter Selection Policy.
- No modification to `HostAdapterConfigurationResolver`/`HostConfiguredMissionWorkflow` contracts.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified. The refactor of Sprint 35's Builder Workflow wiring SHALL be verified by rerunning Sprint 35's existing tests without modification to those tests.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 35 — Builder Workflow Foundation (the wiring being refactored into the canonical pattern).
- Sprint 33 — Adapter Configuration Foundation (the Host Adapter Configuration resolution this Sprint reuses unmodified).

## Related Review(s)

- `NEXUS-REV-2026-07-14-011` (Sprint 35 approval — the precedent this Sprint mirrors).

## Full Ratification Text

> The Sprint Owner ratifies Sprint 36 as Reviewer Workflow Foundation: introduction of a second Role-scoped AI Engineering Workflow, `nexus.runReviewerMissionWorkflow`, constructed with explicit `roleId: 'reviewer'`, reusing Host Adapter Configuration resolution and the certified Execution Pipeline verbatim. The Sprint Owner directs, as a binding architectural invariant governing this and all future Milestone 7 Sprints, that every Role-scoped Workflow entry point SHALL differ from every other only by the Execution Role requested and by workflow presentation metadata, with Host Adapter Configuration, explicit-adapterId dispatch, the certified Execution Pipeline, Adapter Runtime, and Kernel contracts reused unmodified in every case. To establish this as an actual canonical pattern rather than a third copy-pasted block, Sprint 36 SHALL extract the Role-scoped Configured Mission Workflow construction currently duplicated in `vscode-host.ts` into a single reusable factory function, and SHALL refactor the existing Builder Workflow (Sprint 35) to use it, as a behavior-preserving refactor verified by Sprint 35's own unmodified tests continuing to pass. The Reviewer Workflow SHALL be added using the same factory. No `src/kernel` or `src/adapters` change, new Kernel Role, RFC concept, or Adapter Selection Policy is authorized. This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon. The Sprint Owner authorizes `nexus-plan` to generate the Sprint 36 Implementation Record under Milestone 7 and authorizes the Builder to implement Sprint 36 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-013

## Ratification Identifier

NEXUS-RAT-2026-07-14-013

## Date

2026-07-14

## Subject

Sprint 37 Scope Ratification — Documentation Workflow Foundation. Authorizes registration of the RFC-0004 `Documentation Reviewer` Additional Role as a third default Kernel Role and the exposure of its Host workflow via the Sprint 36 canonical factory. Resolves the Sprint 37 scope-ratification requirement flagged by `NEXUS-RAT-2026-07-14-011`.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 37 — Documentation Workflow Foundation), refined in full task-level detail by the Sprint Owner (exact Role id, command id, and presentation strings), and approved as refined (2026-07-14).

## Governance Decision

Sprint 37 SHALL be titled **Documentation Workflow Foundation**. It registers the RFC-0004-named `Documentation Reviewer` Additional Role as Role id `documentation-reviewer` in `src/kernel/execution/default-kernel-roles.ts`, mirroring the existing `builder`/`reviewer` entries exactly (`category: 'Engineering Responsibility'`, `metadata.attributes: { origin: 'KernelDefault', rfc: 'RFC-0004' }`). It adds `nexus.runDocumentationReviewerMissionWorkflow`, constructed via the Sprint 36 `createConfiguredMissionWorkflow` factory with explicit `roleId: 'documentation-reviewer'` and `presentationOptions: { workflowLabel: 'Documentation Reviewer Workflow', completionMessageLabel: 'Documentation Review completed', includeAssignedRole: true }`.

This Sprint's `completionMessageLabel` ("Documentation Review completed") deviates in wording from the `'{Role} workflow'` phrasing used by the Builder/Reviewer Workflows, but remains within `NEXUS-RAT-2026-07-14-012`'s binding Architectural Invariant, which permits variance in `workflowLabel`/`completionMessageLabel`/`includeAssignedRole` "and equivalents" as the one authorized axis of difference beyond Execution Role. No other deviation from the Invariant is authorized.

## Architectural Responsibilities (binding)

- The Kernel's responsibility is limited to `ExecutionRole` registration; it SHALL gain no new execution behavior, lifecycle, or event as a result of this Sprint.
- The Host remains responsible for workflow orchestration, user interaction, and presentation only; it SHALL remain orchestration-only.
- The Execution Pipeline (Sprint 20) and Adapter Runtime SHALL remain unchanged and reused verbatim.
- The existing Builder (Sprint 35) and Reviewer (Sprint 36) Workflows SHALL remain unmodified in identifier, dispatch behavior, presentation strings, and test coverage.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add exactly one new `ExecutionRole` entry to `createDefaultKernelRoles()` for `documentation-reviewer`, mirroring the existing `builder`/`reviewer` entries' shape exactly; the existing two entries SHALL remain byte-for-byte unchanged.
- Add `nexus.runDocumentationReviewerMissionWorkflow` via `createConfiguredMissionWorkflow`, following the Sprint 36 pattern exactly, with `roleId: 'documentation-reviewer'` and the presentation options specified above.
- Register the new command's contribution point (`package.json` `contributes.commands`/`activationEvents`), following the existing registration pattern.
- Add Kernel Role-registration unit test coverage; Host command registration, success-path, and input-cancellation-failure-path test coverage; package-metadata/activation-event/extension-host discoverability assertions; and a regression assertion that the Builder and Reviewer Workflows' existing tests continue to pass unmodified.

The Builder SHALL NOT:

- Modify `src/adapters`, `HostAdapterConfigurationResolver`, or `HostConfiguredMissionWorkflow`.
- Modify the existing Builder or Reviewer Workflow's command identifier, dispatch behavior, presentation strings, or test coverage.
- Introduce Workflow Chaining, Assignment Policy, Execution Sessions, Role-to-Adapter routing, Adapter Selection Policy, or multi-agent orchestration.
- Register any Additional Role other than `Documentation Reviewer` (e.g., Security Reviewer, Performance Reviewer, Accessibility Reviewer, Test Engineer, Database Reviewer) or introduce a Planner Workflow.
- Modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Scope Restrictions

- This is Milestone 7's first authorized `src/kernel` change, limited strictly to Role registration using the existing `ExecutionRole`/`RoleRegistry` contracts (Sprint 8); no new Kernel concept, lifecycle, or event is introduced.
- No modification to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or any existing command's registration/dispatch logic.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified.
- This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 8 — Execution Roles (the `ExecutionRole`/`RoleRegistry` contracts this Sprint extends).
- Sprint 35 — Builder Workflow Foundation; Sprint 36 — Reviewer Workflow Foundation (the canonical factory this Sprint reuses).

## Related Review(s)

- `NEXUS-REV-2026-07-14-012` (Sprint 36 approval — the precedent this Sprint mirrors).

## Full Ratification Text

> The Sprint Owner ratifies Sprint 37 as Documentation Workflow Foundation: registration of the RFC-0004-named `Documentation Reviewer` Additional Role as default Kernel Role `documentation-reviewer`, and exposure of its Host workflow, `nexus.runDocumentationReviewerMissionWorkflow`, constructed via the Sprint 36 canonical factory with `presentationOptions: { workflowLabel: 'Documentation Reviewer Workflow', completionMessageLabel: 'Documentation Review completed', includeAssignedRole: true }`. This Sprint introduces exactly one architectural variable — registering an already RFC-0004-named role and exposing its corresponding Host workflow — while the Kernel gains no new execution behavior, and the Execution Pipeline, Adapter Runtime, and existing Builder/Reviewer Workflows remain unchanged. This is Milestone 7's first authorized `src/kernel` change, strictly limited to Role registration via the existing Sprint 8 `ExecutionRole`/`RoleRegistry` contracts. No `src/adapters` change, Workflow Chaining, Assignment Policy, Execution Session, Role-to-Adapter routing, Adapter Selection Policy, multi-agent orchestration, or additional Role beyond Documentation Reviewer is authorized. This ratification does not modify RFC-0004, RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon. The Sprint Owner authorizes `nexus-plan` to generate the Sprint 37 Implementation Record under Milestone 7 and authorizes the Builder to implement Sprint 37 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-014

## Ratification Identifier

NEXUS-RAT-2026-07-14-014

## Date

2026-07-14

## Subject

RFC-0004 Amendment — Engineering Role Profile. Authorizes the repository's first RFC amendment, introducing `Engineering Role Profile` as a new RFC-0004-owned architectural concept: descriptive, presentational, discovery metadata for an Execution Role, distinct from and subordinate to Execution Role's ownership of execution semantics. Resolves the `nexus-plan` governance conflict raised when the Sprint Owner directed reclassifying Milestone 7 to include an Engineering Role Profile framework objective: `NEXUS-RAT-2026-07-14-011` classified Engineering Role Profiles as Milestone 8 candidate scope requiring "a future RFC extension and a dedicated Sprint Owner ratification" before any Sprint could touch it. This ratification supplies that RFC extension.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` governance-conflict report (Sprint 38 planning request conflicted with `NEXUS-RAT-2026-07-14-011`'s Milestone 8 classification and the absence of any RFC definition for "Engineering Role Profile"), resolved through a Sprint Owner decision to require and approve a minimal RFC-0004 amendment before Sprint 38 planning proceeds (2026-07-14).

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.0 to Version 1.1, adding `Engineering Role Profile` to RFC-0004's Domain Ownership list and introducing a new "Engineering Role Profile" section (placed after the existing "Execution Roles" section).

The amendment is intentionally narrow and architectural-responsibility-scoped rather than implementation-property-scoped, per the Sprint Owner's explicit refinement: RFC-0004 now normatively requires that every registered Execution Role have exactly one corresponding Engineering Role Profile providing workflow presentation metadata, completion presentation metadata, and attribution presentation policy, and supporting canonical engineering role discoverability/enumeration — without naming concrete implementation field names (e.g. `workflowLabel`), which remain implementation details free to evolve without further RFC amendment provided they continue satisfying these architectural responsibilities.

Engineering Role Profile is Kernel-owned (consistent with Execution Role and Role Registry), one-to-one with Execution Role, and strictly non-authoritative for execution semantics, dispatch eligibility, execution lifecycle, assignment policy, workflow behavior, execution sequencing, orchestration, Adapter routing, Adapter selection, or authorization. Execution Role remains the sole authority for execution semantics, identity, and dispatch eligibility; Engineering Role Profile SHALL NOT replace, wrap, or redefine it.

This amendment authorizes only the metadata foundation necessary for engineering role discoverability. It does not authorize, schedule, or bring closer to implementation: Workflow Chaining, Assignment Policy, Execution Sessions, a Planner Workflow, Security/Performance/Accessibility Reviewer or Test Engineer Workflows, Adapter Routing, Adapter Selection, or multi-agent orchestration. Milestone 8 — Engineering Orchestration's remaining candidate scope (Workflow Chaining, Assignment Policy, Execution Sessions, multi-agent orchestration) is unaffected and remains NOT YET STARTED.

The Sprint Owner directed and authorized `nexus-plan` to apply this amendment's text directly to `rfc-0004-execution-model.md`, as a documented one-time exception to `nexus-plan`'s ordinary prohibition on modifying the RFC suite — `nexus-plan`'s own governance-conflict report first identified the need for this amendment and drafted its text for Sprint Owner review; the Sprint Owner reviewed, refined (the two refinements below), and explicitly authorized its application.

## Refinements Incorporated (Sprint Owner direction, verbatim intent)

1. **Architectural responsibilities, not concrete property names.** RFC-0004 describes workflow presentation metadata, completion presentation metadata, and attribution presentation policy as architectural responsibilities; it does not normatively name implementation fields such as `workflowLabel`, `completionMessageLabel`, or `includeAssignedRole`. Those remain implementation details.
2. **Discoverability and enumeration.** Engineering Role Profiles SHALL be discoverable and enumerable without consumers possessing hard-coded knowledge of specific Execution Roles, in support of future capabilities including command/workflow discovery, engineering workflow catalogs, Activity Bar integration, and (once separately authorized) Workflow Chaining/Planner/dashboard use cases. This ratification authorizes only the metadata foundation; it authorizes no orchestration behavior itself.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Execution identity, semantics, dispatch eligibility | `ExecutionRole` |
| Registration, lookup, enumeration of Execution Roles | `RoleRegistry` |
| Presentation metadata, workflow presentation metadata, completion presentation metadata, attribution presentation policy, engineering role discoverability | `EngineeringRoleProfile` |
| Command registration, workflow dispatch | Host (RFC-0009) |
| Execution Pipeline | Existing Kernel architecture (unchanged) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.0 → 1.1; Amendment History entry; `Engineering Role Profile` added to the Domain Ownership list; new "Engineering Role Profile" section added after "Execution Roles".
- Resume Sprint 38 planning under a reclassified Milestone 7 scope that includes an Engineering Role Profile framework objective.

`nexus-plan` SHALL NOT:

- Modify any other RFC-0004 section, guarantee, or concept.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing Workflow Chaining, Assignment Policy, Execution Sessions, a Planner Workflow, any Additional-Role workflow, Adapter Routing, Adapter Selection, or multi-agent orchestration — each remains separately deferred.
- Treat this ratification as a general precedent permitting future RFC modification by ratification alone; each future RFC amendment requires its own explicit Sprint Owner authorization following the same conflict-identification-and-review process.

## Scope Restrictions

- This is a documentation/specification change only; it introduces exactly one new RFC-0004-owned concept (`Engineering Role Profile`) and modifies no existing RFC-0004 guarantee, section, or concept beyond the additive Domain Ownership list entry.
- No Kernel Canon change.
- No source code or test change is authorized by this ratification alone; Sprint 38's own Sprint Implementation Record separately governs implementation scope.
- Engineering Role Profile SHALL remain non-authoritative for execution semantics in all future implementation; any future ratification or Sprint Implementation Record purporting to grant it execution, lifecycle, assignment, orchestration, or authorization behavior would conflict with this ratification and RFC-0004 as amended.

## Related Sprint(s)

- Sprint 35 — Builder Workflow Foundation; Sprint 36 — Reviewer Workflow Foundation; Sprint 37 — Documentation Workflow Foundation (the Milestone 7 Sprints whose Host-layer presentation-metadata duplication motivated this amendment).
- Sprint 38 — Engineering Role Profiles Foundation (planned; consumes this amendment).

## Related Review(s)

- None. This ratification precedes Sprint 38 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies an amendment to RFC-0004 — Execution Model, incrementing it to Version 1.1 and introducing `Engineering Role Profile` as a new RFC-0004-owned architectural concept: one-to-one companion metadata to Execution Role, providing workflow presentation metadata, completion presentation metadata, and attribution presentation policy, and supporting canonical engineering role discoverability and enumeration. The amendment is described at the level of architectural responsibilities, not concrete implementation field names, so that implementation properties may evolve without further RFC amendment. Engineering Role Profile is Kernel-owned, remains strictly non-authoritative for execution semantics, dispatch eligibility, lifecycle, assignment policy, workflow behavior, sequencing, orchestration, Adapter routing/selection, or authorization, and SHALL NOT replace, wrap, or redefine Execution Role, which remains the sole authority for execution semantics. This amendment authorizes only the metadata foundation for discoverability; it authorizes no Workflow Chaining, Assignment Policy, Execution Session, Planner Workflow, additional-Role workflow, Adapter Routing/Selection, or multi-agent orchestration, all of which remain separately deferred under Milestone 8 — Engineering Orchestration (NOT YET STARTED). The Sprint Owner authorizes `nexus-plan` to apply this amendment's text directly to `rfc-0004-execution-model.md` as a one-time, explicitly authorized exception to `nexus-plan`'s ordinary prohibition on RFC modification, and to resume Sprint 38 planning under a reclassified Milestone 7 scope once the amendment is applied.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-015

## Ratification Identifier

NEXUS-RAT-2026-07-14-015

## Date

2026-07-14

## Subject

Sprint 38 Scope Ratification — Engineering Role Profiles Foundation. Authorizes implementation of the `EngineeringRoleProfile` Kernel concept defined by RFC-0004 v1.1 (`NEXUS-RAT-2026-07-14-014`), incorporating five Sprint Owner refinements to the `nexus-plan` Sprint Proposal. Resolves the Sprint 38 scope-ratification requirement.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 38 — Engineering Role Profiles Foundation), refined by five Sprint Owner directives, and approved as refined (2026-07-14).

## Governance Decision

Sprint 38 SHALL be titled **Engineering Role Profiles Foundation**. It introduces `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`/`InMemoryEngineeringRoleProfileRegistry`, `createDefaultEngineeringRoleProfiles()`, and `EngineeringRoleProfileService`, seeding one profile per existing default Kernel Role (`builder`, `reviewer`, `documentation-reviewer`) at Kernel composition time.

**EngineeringRoleProfile SHALL be the only new normative architectural concept introduced by Sprint 38.** No additional execution, lifecycle, workflow, or orchestration concept is introduced.

## Refinements Incorporated (binding)

1. **`EngineeringRoleProfileService` is not a business service.** It SHALL remain a thin abstraction over the registry, limited to lookup, existence checks, enumeration, and diagnostics (duplicate registration, not-found). It SHALL NOT evolve into an orchestration service; no execution behavior or business rule is authorized.
2. **Immutable registry, composition-time-only seeding.** Default profiles SHALL be produced by `createDefaultEngineeringRoleProfiles()`; the registry SHALL be seeded during `createKernelServices()`; after composition, the registry SHALL be treated as immutable. Registration exists only during Kernel composition and is not part of normal runtime behavior. No runtime profile creation is authorized.
3. **Strengthened acceptance criteria.** "EngineeringRoleProfile SHALL be the only new normative architectural concept introduced by Sprint 38" replaces the weaker "exactly one new Kernel concept" framing.
4. **Forward compatibility stated explicitly.** `EngineeringRoleProfile` SHALL become the canonical engineering metadata abstraction for future Kernel and Host capabilities (Workflow Chaining, Planner Workflow, engineering role catalogs, future Host discovery mechanisms, engineering orchestration) while remaining independent of execution semantics. This Sprint does not authorize any of those capabilities; it establishes only their common metadata foundation.
5. **Semantic equivalence, not byte-for-byte, for presentation values.** Default profile presentation metadata SHALL remain semantically equivalent to the existing Builder, Reviewer, and Documentation Reviewer Workflow presentation strings already in `vscode-host.ts`. This preserves observable behavior while permitting future presentation evolution (e.g. localization) without requiring another RFC amendment. No observable behavior change is authorized in this Sprint.

## Architectural Confirmation (binding, restates RFC-0004 v1.1)

`ExecutionRole` remains authoritative for execution identity, execution semantics, and dispatch eligibility. `EngineeringRoleProfile` remains authoritative for engineering metadata, presentation metadata, and engineering role discoverability. Neither replaces, wraps, or redefines the other.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Implement `EngineeringRoleProfile` (`src/kernel/execution/engineering-role-profile.ts`) as an immutable Kernel value object, mirroring `ExecutionRole`'s construction pattern.
- Implement `EngineeringRoleProfileRegistry` contract and `InMemoryEngineeringRoleProfileRegistry`, mirroring `RoleRegistry`/`InMemoryRoleRegistry`.
- Implement `createDefaultEngineeringRoleProfiles()`, producing one profile per existing default Kernel Role with presentation metadata semantically equivalent to existing `vscode-host.ts` values.
- Implement `EngineeringRoleProfileService` as a thin lookup/enumeration/diagnostics abstraction only.
- Update `createKernelServices` composition to seed the registry via `createDefaultEngineeringRoleProfiles()` at composition time.
- Add unit test coverage for all of the above, including composition-time-only seeding and semantic-equivalence assertions.

The Builder SHALL NOT modify:

- Host workflows (`src/hosts`), Adapter Runtime, or Execution Pipeline.
- Execution semantics, workflow behavior, orchestration, assignment policy, or Execution Sessions.
- `src/adapters`, `HostAdapterConfigurationResolver`, or `HostConfiguredMissionWorkflow`.
- Any existing command's identifier, dispatch behavior, presentation strings, or test coverage.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, lifecycle, workflow, or orchestration concept beyond `EngineeringRoleProfile` itself.
- No runtime profile creation; registration occurs only during Kernel composition.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass, updated only where they enumerate Kernel-composed services (mirroring Sprint 37's role-enumeration assertion update).
- This ratification does not modify RFC-0004 further (RFC-0004 v1.1 already reflects this Sprint's authorized concept via `NEXUS-RAT-2026-07-14-014`), RFC-0008, RFC-0009, RFC-0010, or the Kernel Canon.

## Related Sprint(s)

- Sprint 8 — Execution Roles (the `ExecutionRole`/`RoleRegistry` pattern this Sprint mirrors).
- Sprint 35 — Builder Workflow Foundation; Sprint 36 — Reviewer Workflow Foundation; Sprint 37 — Documentation Workflow Foundation (source of the presentation values the default profiles formalize).

## Related Review(s)

- None. This ratification precedes Sprint 38 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies Sprint 38 as Engineering Role Profiles Foundation: implementation of `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `createDefaultEngineeringRoleProfiles()`, and `EngineeringRoleProfileService` per RFC-0004 v1.1. `EngineeringRoleProfile` SHALL be the only new normative architectural concept introduced by this Sprint. `EngineeringRoleProfileService` SHALL remain a thin, non-orchestration abstraction limited to lookup, existence checks, enumeration, and diagnostics. The registry SHALL be seeded only at Kernel composition time via `createDefaultEngineeringRoleProfiles()` and treated as immutable thereafter; no runtime profile creation is authorized. `EngineeringRoleProfile` is confirmed as the canonical engineering metadata abstraction for future capabilities (Workflow Chaining, Planner Workflow, engineering role catalogs, Host discovery, engineering orchestration), none of which are authorized by this Sprint. Default profile presentation metadata SHALL remain semantically equivalent — not byte-for-byte — to the existing Builder/Reviewer/Documentation Reviewer Workflow presentation strings, preserving observable behavior while permitting future presentation evolution without further RFC amendment. `ExecutionRole` remains authoritative for execution identity, semantics, and dispatch eligibility; `EngineeringRoleProfile` remains authoritative for engineering metadata, presentation metadata, and discoverability. No Host, Adapter Runtime, or Execution Pipeline change is authorized. The Sprint Owner authorizes `nexus-plan` to generate the Sprint 38 Implementation Record under Milestone 7 and authorizes the Builder to implement Sprint 38 in accordance with the Specification-First governance model.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-016

## Ratification Identifier

NEXUS-RAT-2026-07-14-016

## Date

2026-07-14

## Subject

Milestone 7 Governance Note Reconciliation. Resolves the `nexus-plan` Governance Report identifying that the Milestone 7 Governance Note (`IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`) named "a future Workflow Chaining Foundation" as a remaining Milestone 7 objective, contradicting `NEXUS-RAT-2026-07-14-011`'s explicit deferral of Workflow Chaining (together with Assignment Policy and Execution Sessions) to Milestone 8, which no subsequent ratification had superseded.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Governance Report during post-Sprint-38 planning (2026-07-14), identifying an internal inconsistency between milestone-level governance documentation and previously ratified repository law. Resolved by direct Sprint Owner decision.

## Governance Decision

The Milestone 7 Governance Note overstated the currently authorized scope by naming Workflow Chaining as a remaining Milestone 7 objective. This wording is corrected. It never authorized any implementation — Sprint 38's implementation and its Deferred Concepts already correctly excluded Workflow Chaining — so no Sprint, review, or implementation record is affected or reopened.

**Canonical Milestone 7 Scope (post-reconciliation):**

- Completed: Sprint 35 — Builder Workflow Foundation; Sprint 36 — Reviewer Workflow Foundation; Sprint 37 — Documentation Reviewer Workflow Foundation; Sprint 38 — Engineering Role Profiles Foundation.
- Remaining: None. Sprint 38 is the final authorized Sprint within Milestone 7. No additional architectural capability is authorized within Milestone 7.
- Milestone 7 SHALL be marked **Complete** as of Sprint 38.

**Milestone 8 Scope (unchanged):** Workflow Chaining remains within Milestone 8 together with Assignment Policy, Execution Sessions, Planner Workflow, and Multi-agent Engineering Orchestration, per `NEXUS-RAT-2026-07-14-011`. No Sprint under Milestone 8 is authorized by this ratification; scheduling any Milestone 8 scope still requires a future RFC extension and a dedicated Sprint Owner ratification, exactly as `NEXUS-RAT-2026-07-14-011` already required.

## Authorized Scope

`nexus-plan` MAY:

- Correct the Milestone 7 Governance Note in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` to remove all references identifying Workflow Chaining as a remaining Milestone 7 objective.
- Update Milestone 7's Status line to **Complete** (Sprint 35 through Sprint 38) in both documents.
- Resume planning following Sprint 38 using the corrected milestone boundaries.

`nexus-plan` SHALL NOT:

- Modify any approved Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Modify any RFC, the Kernel Canon, or any implementation or test.
- Propose, name, or authorize a Workflow Chaining, Assignment Policy, Execution Session, Planner Workflow, or multi-agent orchestration Sprint under this ratification — that remains reserved for a future Milestone 8 RFC extension and dedicated ratification per `NEXUS-RAT-2026-07-14-011`.

## Related Sprint(s)

- Sprint 35 — Builder Workflow Foundation; Sprint 36 — Reviewer Workflow Foundation; Sprint 37 — Documentation Workflow Foundation; Sprint 38 — Engineering Role Profiles Foundation (Milestone 7, now reconciled as Complete).

## Related Review(s)

- None. This ratification is a milestone-governance documentation correction; it does not reopen any Reviewer disposition.

## Full Ratification Text

> The Sprint Owner accepts the `nexus-plan` Governance Report identifying an inconsistency between the Milestone 7 Governance Note and previously ratified governance (`NEXUS-RAT-2026-07-14-011`), which explicitly deferred Workflow Chaining, Assignment Policy, and Execution Sessions to Milestone 8. No subsequent ratification superseded that decision, so the Milestone 7 Governance Note's reference to "a future Workflow Chaining Foundation" overstated the currently authorized scope. The Milestone 7 Governance Note SHALL be corrected in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` to remove all such references. The remaining objectives of Milestone 7 SHALL be limited to those explicitly authorized through ratified governance: Sprint 35 (Builder Workflow Foundation), Sprint 36 (Reviewer Workflow Foundation), Sprint 37 (Documentation Reviewer Workflow Foundation), and Sprint 38 (Engineering Role Profiles Foundation), with no additional architectural capability authorized within Milestone 7. Milestone 7 is therefore Complete as of Sprint 38. Workflow Chaining SHALL remain within Milestone 8 together with Assignment Policy, Execution Sessions, Planner Workflow, and Multi-agent Engineering Orchestration, per the existing Milestone 8 roadmap — no change is made to it. This ratification reconciles milestone governance documentation only; it does not modify any approved Sprint, RFC, implementation, or review record. Following this reconciliation, Milestone 7 governance SHALL be considered internally consistent, Sprint 38 SHALL remain the final authorized Sprint within Milestone 7, and `nexus-plan` is authorized to resume planning following Sprint 38 completion using the corrected milestone boundaries.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-017

## Ratification Identifier

NEXUS-RAT-2026-07-14-017

## Date

2026-07-14

## Subject

RFC-0004 Amendment — Engineering Session. Introduces `Engineering Session` as a new RFC-0004-owned architectural concept: the Kernel-owned runtime boundary for one span of AI-assisted engineering work, which MAY contain zero or more `Execution Session`s. Resolves the `nexus-plan` governance-conflict report raised when Sprint Owner direction to open Milestone 8 with an "Engineering Sessions Foundation" Sprint conflicted with RFC-0004's existing, narrower `Execution Session` definition (one immutable coordinated execution attempt). This ratification supplies that RFC extension, incorporating two Sprint Owner refinements.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` governance-conflict report during Milestone 8 planning (2026-07-14): the proposed `EngineeringSession` concept was materially broader than RFC-0004's existing immutable `Execution Session`, so `nexus-plan` drafted a minimal amendment for Sprint Owner review rather than treating it as a rename. The Sprint Owner approved with two refinements (below) rather than as originally drafted.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.1 to Version 1.2, adding `Engineering Session` to RFC-0004's Domain Ownership list and introducing a new "Engineering Session" section (placed before the existing "Execution Session" section).

`Engineering Session` is the Kernel-owned runtime boundary for one span of AI-assisted engineering work. It MAY contain zero or more `Execution Session`s; each `Execution Session` remains the authoritative, immutable record of one coordinated execution attempt, exactly as already specified and completely unmodified by this amendment. `Engineering Session` establishes a containment relationship over `Execution Session` — it does not redefine, wrap, duplicate, or supersede it.

## Refinements Incorporated (Sprint Owner direction, binding)

1. **Containment relationship, not two overlapping session concepts.** An `EngineeringSession` may contain zero or more `ExecutionSession`s. `ExecutionSession` remains the authoritative record of assigned Execution Role, assigned Adapter, execution timestamps, execution outcome, and produced artifacts; its semantics are unchanged.
2. **Explicit Architectural Responsibilities section**, to prevent future ownership drift:
   - `EngineeringSession` owns: engineering runtime context, the active engineering workflow, participating Engineering Roles, workflow state, the session timeline, session diagnostics, collaboration metadata.
   - `ExecutionSession` owns: one coordinated execution attempt, assigned Execution Role, assigned Adapter, execution timestamps, execution outcome, produced artifacts.
   - Execution semantics, dispatch eligibility, and execution policies remain owned by RFC-0004's existing Execution/Execution Strategy/Execution Role/Assignment/Assignment Policy/Execution State sections. `EngineeringSession` SHALL NOT redefine or duplicate those responsibilities, and SHALL NOT itself define Workflow Chaining behavior, Assignment Policy, or Multi-agent Orchestration.

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.1 → 1.2; Amendment History entry; `Engineering Session` added to the Domain Ownership list; new "Engineering Session" section (with Architectural Responsibilities subsection) added before "Execution Session".
- Proceed to draft the Milestone 8 opening ratification and Sprint 39 — Engineering Sessions Foundation scope ratification.

`nexus-plan` SHALL NOT:

- Modify any other RFC-0004 section, guarantee, or concept, including the existing "Execution Session" section's text.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, automatic workflow advancement, session recovery/checkpointing, or concurrent session coordination — each remains separately deferred.
- Treat this ratification as a general precedent permitting future RFC modification by ratification alone; each future RFC amendment requires its own explicit Sprint Owner authorization following the same conflict-identification-and-review process (per `NEXUS-RAT-2026-07-14-014`'s existing restriction).

## Scope Restrictions

- Documentation/specification change only; introduces exactly one new RFC-0004-owned concept (`Engineering Session`) and modifies no existing RFC-0004 guarantee, section, or concept beyond the additive Domain Ownership list entry.
- No Kernel Canon change.
- No source code or test change is authorized by this ratification alone; Sprint 39's own Sprint Implementation Record separately governs implementation scope.
- `Execution Session`'s existing text, invariants, and immutability requirement are unmodified, verbatim.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (planned; consumes this amendment).

## Related Review(s)

- None. This ratification precedes Sprint 39 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies an amendment to RFC-0004 — Execution Model, incrementing it to Version 1.2 and introducing `Engineering Session` as a new RFC-0004-owned architectural concept: the Kernel-owned runtime boundary for one span of AI-assisted engineering work, which MAY contain zero or more `Execution Session`s. `Execution Session` remains completely unmodified — the authoritative, immutable record of one coordinated execution attempt (assigned Execution Role, assigned Adapter, execution timestamps, execution outcome, produced artifacts). `Engineering Session` owns engineering runtime context, the active engineering workflow, participating Engineering Roles, workflow state, the session timeline, session diagnostics, and collaboration metadata; it SHALL NOT redefine or duplicate Execution Session's responsibilities, execution semantics, dispatch eligibility, or execution policies, and SHALL NOT itself define Workflow Chaining, Assignment Policy, or Multi-agent Orchestration. The Sprint Owner authorizes `nexus-plan` to apply this amendment's text directly to `rfc-0004-execution-model.md`, as a further documented, explicitly authorized exception to `nexus-plan`'s ordinary prohibition on RFC modification, following the same process established by `NEXUS-RAT-2026-07-14-014`, and to proceed to the Milestone 8 opening and Sprint 39 scope ratifications.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-018

## Ratification Identifier

NEXUS-RAT-2026-07-14-018

## Date

2026-07-14

## Subject

Milestone Boundary Ratification — Opening Milestone 8 (Engineering Orchestration), combined with Sprint 39 Scope Ratification — Engineering Sessions Foundation. Resolves the `nexus-plan` governance question of what may follow Milestone 7 (Complete, `NEXUS-RAT-2026-07-14-016`), given that all five Milestone 8 candidate concepts named by `NEXUS-RAT-2026-07-14-011` required a Sprint Owner priority decision and, for Engineering Session specifically, the RFC-0004 v1.2 amendment supplied by `NEXUS-RAT-2026-07-14-017`.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Owner consultation (Milestone 8 has no ratified priority order among its five candidate concepts) and resolved by direct Sprint Owner decision, refined once (renaming/broadening "Execution Sessions" to "Engineering Sessions Foundation", formalized by `NEXUS-RAT-2026-07-14-017`) (2026-07-14).

## Governance Decision

**Milestone 8 — Engineering Orchestration is opened.** Sprint 39 — Engineering Sessions Foundation is its opening Sprint, implementing the RFC-0004 v1.2 `Engineering Session` concept (`NEXUS-RAT-2026-07-14-017`) as a foundation-only vertical slice.

Sprint 39 SHALL introduce only:

- `EngineeringSession`
- `EngineeringSessionId`
- `EngineeringSessionStatus`
- `EngineeringSessionService`
- deterministic session lifecycle
- session persistence
- session diagnostics

No additional orchestration capability is authorized by this ratification.

## Explicitly Deferred (this Sprint and this ratification)

- Workflow Chaining
- Assignment Policy
- Review-Gated Progression
- Multi-Agent Engineering Orchestration
- Automatic workflow advancement
- Session recovery and checkpointing
- Concurrent session coordination

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Implement `EngineeringSession` as an immutable-per-transition Kernel domain concept with `EngineeringSessionId`, `EngineeringSessionStatus` deterministic lifecycle, and the Architectural Responsibilities enumerated by RFC-0004 v1.2 (engineering runtime context, active engineering workflow reference, participating Engineering Roles, workflow state, session timeline, session diagnostics, collaboration metadata) at a foundation level of detail — no capability beyond the state needed to persist and enumerate a session's lifecycle and identity is required this Sprint.
- Implement a Session repository contract and in-memory implementation, mirroring the existing Kernel repository pattern (e.g. `RoleRegistry`/`InMemoryRoleRegistry`, `IKnowledgeRepository`/`InMemoryKnowledgeRepository`).
- Implement `EngineeringSessionService` for session creation, lifecycle transition, lookup, and enumeration through constructor-injected repository contracts, mirroring existing Kernel service orchestration patterns (thin orchestration; business rules remain in the aggregate).
- Update `createKernelServices` composition to construct and register the Session repository and `EngineeringSessionService`.
- Add unit test coverage for the value object/aggregate, lifecycle, repository, and service.

The Builder SHALL NOT:

- Modify `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, or any existing Kernel Execution-domain file's behavior.
- Modify any `src/hosts` or `src/adapters` file.
- Introduce Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, automatic workflow advancement, session recovery/checkpointing, or concurrent session coordination in any form, including as an unused stub.
- Introduce or reference `ExecutionSession` implementation — RFC-0004's existing `Execution Session` concept remains unimplemented and out of scope for this Sprint; Sprint 39 implements `EngineeringSession` only.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, assignment, orchestration, or workflow-chaining concept beyond `EngineeringSession` itself.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services, mirroring the Sprint 37/38 precedent for such updates.
- This ratification does not modify RFC-0004 further (already amended to v1.2 by `NEXUS-RAT-2026-07-14-017`), any other RFC, or the Kernel Canon.

## Related Sprint(s)

- Sprint 8 — Execution Roles; Sprint 10 — Execution Strategy (existing Execution-domain patterns Sprint 39 mirrors without modifying).
- Sprint 38 — Engineering Role Profiles Foundation (Milestone 7's closing Sprint; Milestone 8 opens immediately after).

## Related Review(s)

- None. This ratification precedes Sprint 39 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner opens Milestone 8 — Engineering Orchestration, naming Sprint 39 — Engineering Sessions Foundation as its opening Sprint. Sprint 39 implements the RFC-0004 v1.2 `Engineering Session` concept (`NEXUS-RAT-2026-07-14-017`) as a foundation-only vertical slice: `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `EngineeringSessionService`, deterministic session lifecycle, session persistence, and session diagnostics only. Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, and concurrent session coordination remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. `ExecutionSession` (RFC-0004's existing, narrower concept) remains unimplemented and out of scope for this Sprint. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to open Milestone 8 and activate Sprint 39, and to generate Sprint 39's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-019

## Ratification Identifier

NEXUS-RAT-2026-07-14-019

## Date

2026-07-14

## Subject

Sprint 40 Scope Ratification — Execution Session Foundation. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-14-018` opened Milestone 8 and left Workflow Chaining, Assignment Policy, Review-Gated Progression, and Multi-Agent Engineering Orchestration without a ratified priority order.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 40 — Execution Session Foundation, recommending RFC-0004's already-defined `Execution Session` concept over Assignment Policy, on the grounds that Assignment Policy's domain sits atop the unresolved Task Lifecycle three-way naming mismatch tracked in `IMPLEMENTATION_MANIFEST.md`, while `Execution Session` has no such conflict and is the concept Sprint 39's `EngineeringSession` was built to contain). Approved by the Sprint Owner with four refinements strengthening aggregate-boundary and invariant precision (2026-07-14).

## Governance Decision

**Sprint 40 — Execution Session Foundation is authorized as Milestone 8's next Sprint.** Sprint 40 implements RFC-0004's existing, unmodified `Execution Session` concept (Execution Model v1.2, "Execution Session" section) as a Kernel domain concept associated with, but independently owned from, the `EngineeringSession` introduced by Sprint 39.

Sprint 40 SHALL introduce only:

- `ExecutionSession`
- `ExecutionSessionId`
- an `ExecutionSession` repository contract and in-memory implementation
- a thin `ExecutionSessionService` (create / lookup / enumerate)
- the `EngineeringSession`-to-`ExecutionSession` containment association at foundation level (association only, not lifecycle control)

No additional orchestration, dispatch, assignment, or workflow capability is authorized by this ratification.

### Sprint Owner Refinements (binding)

**Refinement 1 — Aggregate Relationship.** `EngineeringSession` MAY contain zero or more `ExecutionSession`s. `EngineeringSession` owns only the association. `ExecutionSession` remains an independent aggregate responsible for its own lifecycle and immutable execution record. Neither aggregate SHALL mutate the internal state of the other.

**Refinement 2 — Non-Responsibilities.** `ExecutionSession` SHALL NOT: dispatch Adapters; evaluate Assignment Policy; determine execution eligibility; transition Task lifecycle; coordinate workflows; implement orchestration behavior. These responsibilities remain owned by the existing Kernel execution model and future Milestone 8 orchestration capabilities.

**Refinement 3 — Strengthened Invariants.** In addition to base immutability: equivalent execution inputs SHALL always produce equivalent `ExecutionSession` state; `ExecutionSessionId` SHALL be immutable; `ExecutionSession` records SHALL be append-only and SHALL NOT be modified after creation; all execution metadata SHALL remain deterministic and reproducible.

**Refinement 4 — Ownership Invariant.** Every `ExecutionSession` SHALL belong to exactly one `EngineeringSession`. An `EngineeringSession` MAY contain zero or more `ExecutionSession`s. `ExecutionSession` SHALL NOT exist independently of an `EngineeringSession`. This invariant is enforced at the repository/service level (construction requires an owning `EngineeringSessionId`); it does not modify RFC-0004's "Execution Session" section text, which is unmodified by this ratification.

## Explicitly Deferred (this Sprint and this ratification)

- Workflow Chaining
- Assignment Policy
- Review-Gated Progression
- Multi-Agent Engineering Orchestration
- Automatic workflow advancement
- Session recovery and checkpointing
- Concurrent session coordination

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Implement `ExecutionSession` as an immutable, append-only Kernel domain concept with `ExecutionSessionId`, recording assigned Execution Role, assigned Adapter, execution timestamps, consumed Projection version, produced artifacts, and execution outcome, exactly per RFC-0004's existing "Execution Session" section — no field or behavior beyond what that section already defines.
- Implement a required, immutable owning-`EngineeringSessionId` reference on every `ExecutionSession`, enforcing Refinement 4's ownership invariant at construction and at the repository layer (an `ExecutionSession` cannot be created or persisted without a valid owning `EngineeringSessionId`).
- Implement a `ExecutionSession` repository contract and in-memory implementation, mirroring existing Kernel repository patterns, including lookup/enumeration scoped by owning `EngineeringSessionId`.
- Implement a thin `ExecutionSessionService` for creation, lookup, and enumeration through constructor-injected repository contracts only — no dispatch, no Adapter invocation, no Assignment Policy evaluation, no Task lifecycle transition, no workflow coordination.
- Update `createKernelServices` composition to construct and register the `ExecutionSession` repository and `ExecutionSessionService`.
- Add unit test coverage for the aggregate (construction, immutability, append-only behavior, deterministic/reproducible state for equivalent inputs), the ownership invariant (rejection of an `ExecutionSession` without a valid owning `EngineeringSessionId`), the repository, and the service.

The Builder SHALL NOT:

- Modify `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `EngineeringSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`, or any existing Kernel Execution/Mission-domain file's behavior, beyond the one authorized `createKernelServices` composition touch point.
- Modify any `src/hosts` or `src/adapters` file.
- Implement Adapter dispatch, Assignment Policy evaluation, execution-eligibility determination, Task lifecycle transition, workflow coordination, or any orchestration behavior, including as an unused stub.
- Introduce Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, automatic workflow advancement, session recovery/checkpointing, or concurrent session coordination in any form.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, assignment, orchestration, or workflow-chaining concept beyond `ExecutionSession` itself and its ownership association to `EngineeringSession`.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services, mirroring the Sprint 37/38/39 precedent for such updates.
- This ratification does not modify RFC-0004, any other RFC, or the Kernel Canon. Refinement 4's ownership invariant is an implementation/repository-level constraint, not an amendment to RFC-0004's "Execution Session" section text.
- `nexus-plan` is authorized to correct, as part of this Sprint's Activation, the stale Milestone 8 candidate-scope sentence and the stale Sprint 39 status line in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` identified by its governance scan (both already superseded by `NEXUS-RAT-2026-07-14-018` and `NEXUS-REV-2026-07-14-017` respectively; no new decision is required for these corrections).

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (`NEXUS-RAT-2026-07-14-018`; establishes `EngineeringSession`, the aggregate Sprint 40's `ExecutionSession` is owned by).
- Sprint 8 — Execution Roles; Sprint 10 — Execution Strategy (existing Execution-domain patterns Sprint 40 mirrors without modifying).

## Related Review(s)

- None. This ratification precedes Sprint 40 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 40 — Execution Session Foundation as Milestone 8's next Sprint, implementing RFC-0004's existing, unmodified "Execution Session" concept as a Kernel domain concept: `ExecutionSession`, `ExecutionSessionId`, a repository contract and in-memory implementation, and a thin `ExecutionSessionService` (create/lookup/enumerate only). `EngineeringSession` MAY contain zero or more `ExecutionSession`s; `EngineeringSession` owns only the association, `ExecutionSession` remains an independently-owned aggregate, and neither SHALL mutate the other's internal state (Refinement 1). `ExecutionSession` SHALL NOT dispatch Adapters, evaluate Assignment Policy, determine execution eligibility, transition Task lifecycle, coordinate workflows, or implement any orchestration behavior (Refinement 2). Beyond base immutability, equivalent execution inputs SHALL always produce equivalent `ExecutionSession` state, `ExecutionSessionId` SHALL be immutable, records SHALL be append-only and unmodifiable after creation, and all execution metadata SHALL remain deterministic and reproducible (Refinement 3). Every `ExecutionSession` SHALL belong to exactly one `EngineeringSession` and SHALL NOT exist independently of one, enforced at construction and the repository layer (Refinement 4). Workflow Chaining, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic workflow advancement, session recovery/checkpointing, and concurrent session coordination remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 40 (correcting the stale Milestone 8 candidate-scope sentence and stale Sprint 39 status line identified by its governance scan as part of the same update), and to generate Sprint 40's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-020

## Ratification Identifier

NEXUS-RAT-2026-07-14-020

## Date

2026-07-14

## Subject

RFC-0004 Amendment — Workflow Chaining. Authorizes the repository's third RFC amendment, introducing `Workflow Chaining` (aggregate: `WorkflowChain`) as a new RFC-0004-owned architectural concept: the Kernel-owned, immutable definition of an ordered engineering workflow, structurally distinct from `EngineeringSession`'s runtime execution of it. Resolves the `nexus-plan` governance-conflict report raised when the Sprint Owner directed prioritizing Workflow Chaining over Assignment Policy for Milestone 8's next Sprint: unlike Assignment Policy and Execution Session (both fully specified in RFC-0004 since v1.0), Workflow Chaining had no RFC-0004 section — every one of its prior repository-wide mentions was a negative reference in some other Sprint's or ratification's deferred-scope list. This ratification supplies that RFC extension.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` governance-conflict report (Sprint 41 planning request — Workflow Chaining prioritized over Assignment Policy — conflicted with the absence of any RFC definition for "Workflow Chaining"), resolved through a Sprint Owner decision to require and approve a minimal RFC-0004 amendment before Sprint 41 planning proceeds, incorporating four refinements to `nexus-plan`'s drafted amendment text (2026-07-14).

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.2 to Version 1.3, adding `Workflow Chaining` to RFC-0004's Domain Ownership list and introducing a new "Workflow Chaining" section (placed after "Execution State" and before "Engineering Session"), and clarifying (not expanding) `Engineering Session`'s existing Architectural Responsibilities to describe its relationship to `WorkflowChain`.

The amendment is intentionally narrow and architectural-responsibility-scoped, per the Sprint Owner's four refinements below: `WorkflowChain` owns only the immutable template (chain identity, ordered steps, workflow topology); it owns no mutable runtime state. `EngineeringSession` owns all runtime progression (active `WorkflowChain` reference, current workflow position, workflow state, workflow execution history) — this was already implicit in RFC-0004 v1.2's "the active engineering workflow" and "workflow state" Architectural Responsibilities, now made precise rather than newly granted. `WorkflowChain` remains immutable after creation. `ExecutionSession`'s existing definition, invariants, and immutability (RFC-0004 v1.0) are entirely unmodified; it records execution attempts performed within an `EngineeringSession`'s execution of a `WorkflowChain`, exactly as it already recorded execution attempts within an `EngineeringSession` under v1.2.

## Refinements Incorporated (Sprint Owner direction, verbatim intent)

1. **`WorkflowChain` defines structure only.** `WorkflowChain` SHALL own only the immutable definition of an engineering workflow: chain identity, ordered workflow steps, workflow topology. It SHALL NOT own mutable runtime state.
2. **Runtime progress belongs to `EngineeringSession`.** `EngineeringSession` SHALL own runtime progression, including: active `WorkflowChain`; current workflow position; workflow state; workflow execution history. `WorkflowChain` SHALL NOT own step history or current execution position.
3. **Template vs. runtime responsibilities distinguished.** `WorkflowChain` defines the ordered engineering workflow and remains immutable after creation. `EngineeringSession` executes a `WorkflowChain` and records runtime progression through it.
4. **Relationship to `ExecutionSession` clarified.** `EngineeringSession` → `WorkflowChain` → `ExecutionSession(s)`: `WorkflowChain` defines the ordered sequence of engineering activities; `EngineeringSession` coordinates runtime execution of that sequence; `ExecutionSession` records each immutable execution attempt performed within the Engineering Session. This diagram and its accompanying prose are incorporated into RFC-0004's new "Workflow Chaining" section as a non-normative "Relationship to Engineering Session and Execution Session" subsection.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Chain identity, ordered workflow steps, workflow topology (immutable template) | `WorkflowChain` |
| Engineering runtime context, active `WorkflowChain` reference, current workflow position, workflow state, workflow execution history, participating Engineering Roles, session timeline, session diagnostics, collaboration metadata | `EngineeringSession` (unchanged aggregate; clarified responsibilities) |
| One coordinated execution attempt: assigned Execution Role, assigned Adapter, execution timestamps, execution outcome, produced artifacts | `ExecutionSession` (RFC-0004 v1.0, entirely unmodified) |
| Automatic advancement between `WorkflowChain` steps, Assignment Policy evaluation, Review-Gated Progression, Multi-Agent Orchestration, Adapter dispatch, Task lifecycle transition | Future, separately-ratified Milestone 8 Sprints |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.2 → 1.3; Amendment History entry; `Workflow Chaining` added to the Domain Ownership list; new "Workflow Chaining" section added after "Execution State" and before "Engineering Session"; `Engineering Session`'s Architectural Responsibilities section clarified to describe its relationship to `WorkflowChain`, with no change to `Execution Session`'s own section text.
- Proceed to propose Sprint 41 — Workflow Chaining Foundation under this amendment.

`nexus-plan` SHALL NOT:

- Modify `Execution Session`'s own section text, any other RFC-0004 section, guarantee, or concept beyond the additive Domain Ownership list entry and the `Engineering Session` clarification described above.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination — each remains separately deferred.
- Treat this ratification as a general precedent permitting future RFC modification by ratification alone; each future RFC amendment requires its own explicit Sprint Owner authorization following the same conflict-identification-and-review process (per `NEXUS-RAT-2026-07-14-014`'s existing restriction).

## Scope Restrictions

- This is a documentation/specification change only; it introduces exactly one new RFC-0004-owned concept (`Workflow Chaining`), clarifies `Engineering Session`'s existing Architectural Responsibilities without expanding them, and modifies no other RFC-0004 guarantee, section, or concept.
- No Kernel Canon change.
- No source code or test change is authorized by this ratification alone; Sprint 41's own Sprint Implementation Record separately governs implementation scope.
- `WorkflowChain` SHALL remain immutable in all future implementation; any future ratification or Sprint Implementation Record purporting to grant it mutable runtime state, step history, or current execution position would conflict with this ratification and RFC-0004 as amended.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation; Sprint 40 — Execution Session Foundation (the Milestone 8 Sprints whose `EngineeringSession`/`ExecutionSession` ownership boundaries this amendment clarifies and extends without modifying).
- Sprint 41 — Workflow Chaining Foundation (planned; consumes this amendment).

## Related Review(s)

- None. This ratification precedes Sprint 41 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies an amendment to RFC-0004 — Execution Model, incrementing it to Version 1.3 and introducing `Workflow Chaining` (aggregate: `WorkflowChain`) as a new RFC-0004-owned architectural concept: the Kernel-owned, immutable definition of an ordered engineering workflow — chain identity, ordered workflow steps (each referencing exactly one Execution Role), and workflow topology — owning no mutable runtime state (Refinement 1). `EngineeringSession`'s existing Architectural Responsibilities are clarified, not expanded, to state precisely that it owns all runtime progression through a `WorkflowChain`: the active `WorkflowChain` reference, current workflow position, workflow state, and workflow execution history; `WorkflowChain` SHALL NOT own step history or current execution position (Refinement 2). `WorkflowChain` defines the ordered engineering workflow and remains immutable after creation; `EngineeringSession` executes a `WorkflowChain` and records runtime progression through it (Refinement 3). The relationship `EngineeringSession` → `WorkflowChain` → `ExecutionSession(s)` is incorporated into RFC-0004 as a non-normative clarifying diagram: `WorkflowChain` defines the ordered sequence of engineering activities, `EngineeringSession` coordinates runtime execution of that sequence, and `ExecutionSession` records each immutable execution attempt performed within the Engineering Session (Refinement 4). `ExecutionSession`'s own RFC-0004 v1.0 section text is entirely unmodified. This amendment authorizes only the Workflow Chain's structure and identity; it authorizes no automatic advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination, all of which remain separately deferred under Milestone 8 — Engineering Orchestration. The Sprint Owner authorizes `nexus-plan` to apply this amendment's text directly to `rfc-0004-execution-model.md` as a one-time, explicitly authorized exception to `nexus-plan`'s ordinary prohibition on RFC modification, and to proceed to propose Sprint 41 — Workflow Chaining Foundation once the amendment is applied.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-021

## Ratification Identifier

NEXUS-RAT-2026-07-14-021

## Date

2026-07-14

## Subject

Sprint 41 Scope Ratification — Workflow Chaining Foundation. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-14-020` amended RFC-0004 to v1.3, introducing `WorkflowChain` as a standalone, unreferenced Kernel concept — mirroring the Sprint 39 → 40 precedent of introducing one new aggregate per Sprint without modifying previously certified aggregates.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 41 — Workflow Chaining Foundation, recommending `WorkflowChain` be introduced as a standalone concept this Sprint, deferring `EngineeringSession` wiring to a future Sprint). Approved by the Sprint Owner with two refinements strengthening the immutability invariant and `WorkflowStep` boundary precision (2026-07-14).

## Governance Decision

**Sprint 41 — Workflow Chaining Foundation is authorized as Milestone 8's next Sprint.** Sprint 41 implements RFC-0004 v1.3's `WorkflowChain` concept as a standalone, immutable Kernel domain concept, wholly independent of `EngineeringSession` and `ExecutionSession`.

Sprint 41 SHALL introduce only:

- `WorkflowChain`
- `WorkflowChainId`
- immutable ordered workflow steps
- `IWorkflowChainRepository`
- `InMemoryWorkflowChainRepository`
- `WorkflowChainService`
- Kernel composition updates
- unit tests

No modifications to `EngineeringSession` or `ExecutionSession` are authorized.

### Sprint Owner Refinements (binding)

**Refinement 1 — Immutability as an Architectural Invariant.** `WorkflowChain` SHALL be an immutable Kernel definition. Once created, its topology and ordered workflow steps SHALL NOT be modified. Changes to a workflow definition SHALL require creation of a new `WorkflowChain` rather than mutation of an existing instance. This is elevated from an implementation characteristic to a normative architectural invariant, aligning with the immutability principles already established for `ExecutionSession`.

**Refinement 2 — `WorkflowStep` Boundaries.** Each `WorkflowStep` SHALL reference exactly one `ExecutionRole` through the existing `RoleId`. A `WorkflowStep` SHALL NOT directly reference `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile`. This ensures `WorkflowChain` remains a structural workflow definition rather than evolving into an orchestration or runtime model.

## Explicitly Deferred (this Sprint and this ratification)

- `EngineeringSession` → `WorkflowChain` wiring (active-chain reference, current workflow position)
- Automatic workflow advancement
- Assignment Policy
- Review-Gated Progression
- Multi-Agent Engineering Orchestration
- Session recovery and checkpointing
- Concurrent session coordination
- Host or Adapter integration

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Implement `WorkflowChain` as an immutable Kernel domain concept with `WorkflowChainId` and an ordered list of `WorkflowStep`s, exactly per RFC-0004 v1.3's "Workflow Chaining" section — chain identity, ordered workflow steps, workflow topology only. No mutation method of any kind after construction (Refinement 1).
- Implement `WorkflowStep` as a value object referencing exactly one Execution Role via the existing `RoleId`. `WorkflowStep` SHALL NOT reference `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` in any form, including as an unused/optional field (Refinement 2).
- Implement `IWorkflowChainRepository` and `InMemoryWorkflowChainRepository`, mirroring existing Kernel repository patterns: create, lookup, enumerate only.
- Implement a thin `WorkflowChainService` for creation, lookup, and enumeration through constructor-injected repository contracts only — no dispatch, no advancement, no Assignment Policy evaluation, no Engineering Session wiring.
- Update `createKernelServices` composition to construct and register the `WorkflowChain` repository and `WorkflowChainService`.
- Add unit test coverage for the aggregate (construction, immutability, no mutation method, equality), `WorkflowStep` boundary constraints, the repository, and the service.

The Builder SHALL NOT:

- Modify `EngineeringSession`, `EngineeringSessionId`, `EngineeringSessionStatus`, `EngineeringSessionService`, `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, `ExecutionStrategy`, `Task`, `TaskId`, or any existing Kernel Execution/Mission-domain file's behavior, beyond the one authorized `createKernelServices` composition touch point.
- Modify any `src/hosts` or `src/adapters` file.
- Introduce any `EngineeringSession` → `WorkflowChain` reference, current-position tracking, automatic advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination in any form, including as an unused stub.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, assignment, orchestration, or runtime-progression concept beyond `WorkflowChain`'s own immutable structure.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services, mirroring the Sprint 37/38/39/40 precedent for such updates.
- This ratification does not modify RFC-0004 further (already amended to v1.3 by `NEXUS-RAT-2026-07-14-020`), any other RFC, or the Kernel Canon.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation; Sprint 40 — Execution Session Foundation (existing Milestone 8 patterns Sprint 41 mirrors — one new aggregate per Sprint — without modifying either).

## Related Review(s)

- None. This ratification precedes Sprint 41 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 41 — Workflow Chaining Foundation as Milestone 8's next Sprint, implementing RFC-0004 v1.3's `WorkflowChain` as a standalone, immutable Kernel domain concept: `WorkflowChain`, `WorkflowChainId`, immutable ordered `WorkflowStep`s, a repository contract and in-memory implementation, and a thin `WorkflowChainService` (create/lookup/enumerate only). `WorkflowChain` SHALL be an immutable Kernel definition; once created, its topology and ordered workflow steps SHALL NOT be modified, and changes to a workflow definition SHALL require creating a new `WorkflowChain` rather than mutating an existing instance (Refinement 1). Each `WorkflowStep` SHALL reference exactly one `ExecutionRole` through the existing `RoleId` and SHALL NOT directly reference `EngineeringSession`, `ExecutionSession`, Adapter, Assignment Policy, or `EngineeringRoleProfile` (Refinement 2). No modification to `EngineeringSession` or `ExecutionSession` is authorized; `EngineeringSession` → `WorkflowChain` wiring, current workflow position tracking, automatic workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, and Host/Adapter integration all remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 41, and to generate Sprint 41's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-022

## Ratification Identifier

NEXUS-RAT-2026-07-14-022

## Date

2026-07-14

## Subject

Sprint 42 Scope Ratification — Engineering Session Workflow Chain Wiring. Resolves the `nexus-plan` Sprint Proposal presented after Sprint 41 (`NEXUS-RAT-2026-07-14-021`) introduced `WorkflowChain` as a standalone, unreferenced Kernel concept, deferring `EngineeringSession` wiring to a future Sprint. This ratification authorizes that wiring as a bounded, creation-time-only structural binding, per RFC-0004 v1.3's existing "Engineering Session" § Architectural Responsibilities (already amended by `NEXUS-RAT-2026-07-14-020`, unmodified by this ratification).

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 42 — Engineering Session Workflow Chain Wiring). Approved by the Sprint Owner with a comprehensive set of binding architectural refinements narrowing the Sprint to structural runtime binding only (2026-07-14).

## Governance Decision

**Sprint 42 — Engineering Session Workflow Chain Wiring is authorized as Milestone 8's next Sprint.** Sprint 42 introduces immutable `WorkflowChain` binding into `EngineeringSession`: an `EngineeringSession` SHALL reference exactly one active `WorkflowChain` and exactly one current `WorkflowStep`, established at `EngineeringSession` creation only. This Sprint introduces **structural runtime binding only** — no workflow progression semantics of any kind.

### Sprint Owner Refinements (binding)

**Refinement 1 — Binding is creation-time-only.** `WorkflowChain` binding SHALL occur only during `EngineeringSession` creation. After binding, the `WorkflowChain` reference SHALL NOT change, and `WorkflowChain` itself SHALL remain immutable (unmodified from Sprint 41). Workflow replacement is explicitly deferred.

**Refinement 2 — `EngineeringSession` owns the binding and its validation.** `EngineeringSession` owns the active `WorkflowChainId` reference, the current `WorkflowStepId` reference, validation of the `WorkflowChain` binding (existence), and validation that the referenced `WorkflowStep` belongs to the referenced `WorkflowChain`. `EngineeringSession` remains the authoritative owner of its own runtime workflow context; `WorkflowChain` and `WorkflowStep` gain no new owned concern and no runtime state.

**Refinement 3 — No progression semantics of any kind.** This Sprint SHALL NOT implement workflow advancement (manual or automatic), event-driven advancement, review-gated progression, Assignment Policy, workflow completion, workflow branching, workflow restart, workflow replacement, `EngineeringSession` orchestration, Multi-Agent Engineering Orchestration, session recovery/checkpointing, or concurrent session coordination. The current `WorkflowStep` reference is fixed at creation and SHALL NOT change during this Sprint's scope — there is no operation, on `EngineeringSession` or `EngineeringSessionService`, that changes it after construction.

**Refinement 4 — Deterministic validation.** `EngineeringSession` construction SHALL reject: a null `WorkflowChain` reference; a nonexistent `WorkflowChain` reference; a null `WorkflowStep` reference; a nonexistent `WorkflowStep` reference; and a `WorkflowStep` that does not belong to the referenced `WorkflowChain`. Equivalent inputs SHALL always produce equivalent runtime state.

## Explicitly Deferred (this Sprint and this ratification)

- Workflow advancement — manual or automatic
- Event-driven advancement
- Review-Gated Progression
- Assignment Policy
- Workflow completion, branching, restart, or replacement
- `EngineeringSession` orchestration behavior
- Multi-Agent Engineering Orchestration
- Session recovery/checkpointing
- Concurrent session coordination
- Any `src/hosts` or `src/adapters` change

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add `workflowChainId: WorkflowChainId` and `currentWorkflowStepId` (or equivalent `WorkflowStep` identity reference) to `EngineeringSession`, populated only at construction.
- Implement binding validation within `EngineeringSession`'s construction path: reject null/nonexistent `WorkflowChain` references, null/nonexistent `WorkflowStep` references, and `WorkflowStep`s that do not belong to the bound `WorkflowChain` — consulting `IWorkflowChainRepository` read-only, with no mutation of `WorkflowChain` or `WorkflowStep`.
- Update `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository` persistence to carry the new fields through snapshot/reconstitution, mirroring the existing `EngineeringSession` persistence pattern.
- Update `EngineeringSessionService`'s creation path (and constructor injection, if a `WorkflowChain` repository dependency is required) to pass through and validate the binding — no new operation that changes the binding after creation, and no advancement, dispatch, or orchestration behavior.
- Update `createKernelServices` composition only as strictly required to wire the `WorkflowChain` repository into `EngineeringSessionService`'s construction.
- Add unit tests covering: valid binding at construction; rejection of null/nonexistent `WorkflowChain`; rejection of null/nonexistent `WorkflowStep`; rejection of a `WorkflowStep` not belonging to the bound `WorkflowChain`; deterministic/equivalent construction; repository persistence of the new fields; service orchestration of the validated creation path.

The Builder SHALL NOT:

- Modify `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, or `WorkflowChainService` in any way — `WorkflowChain` remains exactly as approved in Sprint 41, fully immutable, with no new owned runtime state.
- Modify `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Introduce any operation, on `EngineeringSession` or `EngineeringSessionService`, that changes the bound `WorkflowChain` or the current `WorkflowStep` reference after construction — including as an unused/stubbed method.
- Introduce any Assignment Policy, Review-Gated Progression, Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination concept, in any form, including as an unused stub.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, assignment, orchestration, or workflow-progression concept beyond the one immutable, creation-time-only binding.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services or `EngineeringSession`'s snapshot shape, mirroring the Sprint 37/38/39/40/41 precedent for such updates.
- This ratification does not modify RFC-0004 (Engineering Session's Architectural Responsibilities were already amended to include this ownership by `NEXUS-RAT-2026-07-14-020` / RFC-0004 v1.3), any other RFC, or the Kernel Canon.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (establishes `EngineeringSession`, extended by this Sprint).
- Sprint 40 — Execution Session Foundation (unmodified by this Sprint).
- Sprint 41 — Workflow Chaining Foundation (establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint).

## Related Review(s)

- None. This ratification precedes Sprint 42 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 42 — Engineering Session Workflow Chain Wiring as Milestone 8's next Sprint, introducing immutable `WorkflowChain` binding into `EngineeringSession`: an `EngineeringSession` SHALL reference exactly one active `WorkflowChain` (via `workflowChainId`) and exactly one current `WorkflowStep` (via a `WorkflowStep` identity reference), established only at `EngineeringSession` creation (Refinement 1). `EngineeringSession` owns the active `WorkflowChain` reference, the current `WorkflowStep` reference, validation of the binding, and validation that the referenced `WorkflowStep` belongs to the referenced `WorkflowChain`; `WorkflowChain` and `WorkflowStep` gain no new owned concern and remain exactly as approved in Sprint 41 (Refinement 2). This Sprint introduces no workflow progression semantics of any kind — no manual or automatic advancement, no event-driven advancement, no review-gated progression, no Assignment Policy, no workflow completion, branching, restart, or replacement, and no `EngineeringSession` orchestration or Multi-Agent Engineering Orchestration behavior; the current `WorkflowStep` reference is fixed at construction and no operation changes it after creation within this Sprint's scope (Refinement 3). `EngineeringSession` construction SHALL deterministically reject null or nonexistent `WorkflowChain` references, null or nonexistent `WorkflowStep` references, and `WorkflowStep`s that do not belong to the referenced `WorkflowChain`, with equivalent inputs always producing equivalent runtime state (Refinement 4). No modification to `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy` is authorized. Workflow advancement, Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination, and Host/Adapter integration all remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 42, and to generate Sprint 42's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-023

## Ratification Identifier

NEXUS-RAT-2026-07-14-023

## Date

2026-07-14

## Subject

Sprint 43 Scope Ratification — Engineering Session Manual Workflow Advancement. Resolves the `nexus-plan` Sprint Proposal presented after Sprint 42 (`NEXUS-RAT-2026-07-14-022`) closed with zero open findings, closing Sprint 42's own recorded Known Limitation ("no mechanism exists this Sprint to advance it") and satisfying RFC-0004 v1.3's "Workflow Chaining" § gating clause that advancement "requires its own Sprint Owner ratification."

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 43 — Engineering Session Manual Workflow Advancement). Approved by the Sprint Owner with a comprehensive set of binding architectural refinements narrowing the Sprint to deterministic, caller-invoked, single-step manual progression and completion detection only (2026-07-14).

## Governance Decision

**Sprint 43 — Engineering Session Manual Workflow Advancement is authorized as Milestone 8's next Sprint.** `EngineeringSession` gains an explicit `advanceWorkflow()` operation that deterministically advances `currentWorkflowStepId` to the next `WorkflowStep` in its already-bound `WorkflowChain` (Sprint 42), exactly one step per invocation, plus terminal-step workflow completion detection.

### Sprint Owner Refinements (binding)

**Refinement 1 — `EngineeringSession` owns progression.** `EngineeringSession` owns the current `WorkflowStep`, validation of workflow progression, the transition to the next `WorkflowStep`, and workflow completion detection. `EngineeringSession` remains the sole owner of runtime workflow state. `WorkflowChain` remains the immutable, read-only workflow definition (chain identity, topology, ordered steps); `WorkflowStep` remains immutable (identity, execution ordering, associated `ExecutionRole`). Neither gains new owned concern or mutable state.

**Refinement 2 — Exactly one step per invocation.** `advanceWorkflow()` SHALL advance `currentWorkflowStepId` to exactly the next `WorkflowStep` in the bound `WorkflowChain`'s ordered steps. No multi-step, skip, or batch advancement is authorized.

**Refinement 3 — Deterministic validation.** `EngineeringSession` SHALL reject: advancement when no `WorkflowChain` is bound; advancement when the current `WorkflowStep` reference is invalid; advancement beyond the terminal `WorkflowStep`; and any `WorkflowStep` reference that does not belong to the bound `WorkflowChain`. Equivalent inputs SHALL always produce equivalent outcomes.

**Refinement 4 — Workflow completion is state only.** This Sprint SHALL introduce workflow completion detection only — a signal that the `EngineeringSession` has reached the terminal `WorkflowStep` of its bound `WorkflowChain`. Completion SHALL NOT complete the `EngineeringSession` itself, trigger Assignment Policy, trigger Review-Gated Progression, dispatch Adapters, invoke `ExecutionStrategy`, or publish orchestration events. No subsequent behavior is authorized upon completion.

**Refinement 5 — `EngineeringSessionService` remains orchestration-only.** `EngineeringSessionService` owns orchestration, repository interaction, and persistence for the `advanceWorkflow()` call path only. It SHALL NOT evaluate Assignment Policy, Review Gates, or any other orchestration rule.

## Explicitly Deferred (this Sprint and this ratification)

- Automatic workflow advancement
- Event-driven advancement
- Assignment Policy
- Review-Gated Progression
- Workflow branching, restart, or replacement
- Concurrent workflow execution
- Multi-Agent Engineering Orchestration
- Session recovery/checkpointing
- Any `src/hosts` or `src/adapters` change

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Add an explicit `advanceWorkflow()` operation to `EngineeringSession` (and its orchestration counterpart on `EngineeringSessionService`) that deterministically resolves and advances to the next `WorkflowStep` in the bound `WorkflowChain`'s ordered steps, exactly one step per invocation.
- Implement workflow completion detection: a read-only signal indicating the `EngineeringSession` has reached the bound `WorkflowChain`'s terminal `WorkflowStep`.
- Implement validation rejecting: advancement with no bound `WorkflowChain`; advancement from an invalid current `WorkflowStep`; advancement beyond the terminal `WorkflowStep`; and a `WorkflowStep` reference not belonging to the bound `WorkflowChain`.
- Update `IEngineeringSessionRepository`/`InMemoryEngineeringSessionRepository` persistence to carry the advanced position through snapshot/reconstitution, mirroring the existing pattern.
- Update `EngineeringSessionService`'s orchestration to expose `advanceWorkflow()` (repository interaction and persistence only — no Assignment Policy, Review Gate, or orchestration-rule evaluation).
- Update `createKernelServices` composition only as strictly required for the above.
- Add unit tests covering: valid single-step advancement; terminal-step rejection; invalid `WorkflowStep` rejection; invalid/missing `WorkflowChain` binding rejection; workflow completion detection; deterministic/equivalent outcomes for equivalent inputs; repository persistence of the advanced position.

The Builder SHALL NOT:

- Modify `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, or `WorkflowChainService` in any way.
- Modify `ExecutionSession`, `ExecutionSessionId`, `ExecutionSessionService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Introduce automatic, event-driven, or multi-step advancement in any form, including as an unused/stubbed method.
- Introduce any behavior triggered by workflow completion (Assignment Policy, Review-Gated Progression, Adapter dispatch, `ExecutionStrategy` invocation, event publication), in any form, including as an unused stub.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, assignment, orchestration, or workflow-progression concept beyond the one deterministic, single-step, caller-invoked advancement and completion-detection signal.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services or `EngineeringSession`'s snapshot shape, mirroring the Sprint 37–42 precedent for such updates.
- This ratification does not modify RFC-0004 (Engineering Session's ownership of "current workflow position" and workflow state was already established by `NEXUS-RAT-2026-07-14-020` / RFC-0004 v1.3), any other RFC, or the Kernel Canon.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (establishes `EngineeringSession`, extended by this Sprint).
- Sprint 40 — Execution Session Foundation (unmodified by this Sprint).
- Sprint 41 — Workflow Chaining Foundation (establishes `WorkflowChain`/`WorkflowStep`, consumed read-only and unmodified by this Sprint).
- Sprint 42 — Engineering Session Workflow Chain Wiring (establishes the `workflowChainId`/`currentWorkflowStepId` binding this Sprint advances).

## Related Review(s)

- None. This ratification precedes Sprint 43 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 43 — Engineering Session Manual Workflow Advancement as Milestone 8's next Sprint, introducing deterministic manual workflow progression within an already-bound `EngineeringSession`. `EngineeringSession` owns the current `WorkflowStep`, validation of workflow progression, the transition to the next `WorkflowStep`, and workflow completion detection; `WorkflowChain` and `WorkflowStep` remain immutable, read-only, and gain no new owned concern (Refinement 1). `advanceWorkflow()` SHALL advance exactly one `WorkflowStep` per invocation (Refinement 2). `EngineeringSession` SHALL deterministically reject advancement with no bound `WorkflowChain`, advancement from an invalid current `WorkflowStep`, advancement beyond the terminal `WorkflowStep`, and any `WorkflowStep` not belonging to the bound `WorkflowChain`, with equivalent inputs always producing equivalent outcomes (Refinement 3). Workflow completion is state only — a signal that the terminal `WorkflowStep` has been reached — and SHALL NOT complete the `EngineeringSession`, trigger Assignment Policy, trigger Review-Gated Progression, dispatch Adapters, invoke `ExecutionStrategy`, or publish orchestration events (Refinement 4). `EngineeringSessionService` remains orchestration-only for the `advanceWorkflow()` call path: repository interaction and persistence only, with no Assignment Policy, Review Gate, or orchestration-rule evaluation (Refinement 5). No modification to `WorkflowChain`, `WorkflowStep`, `ExecutionSession`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy` is authorized. Automatic/event-driven advancement, Assignment Policy, Review-Gated Progression, workflow branching/restart/replacement, concurrent workflow execution, Multi-Agent Engineering Orchestration, session recovery/checkpointing, and Host/Adapter integration all remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 43, and to generate Sprint 43's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-024

## Ratification Identifier

NEXUS-RAT-2026-07-14-024

## Date

2026-07-14

## Subject

Sprint 44 Scope Ratification — Assignment Policy Foundation. Resolves the `nexus-plan` Sprint Proposal presented after Sprint 43 (`NEXUS-RAT-2026-07-14-023`) closed with zero open findings, selecting Assignment Policy as Milestone 8's next candidate concept from the unordered set named by `NEXUS-RAT-2026-07-14-011` and restated by every subsequent Milestone 8 ratification (Assignment Policy, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic/event-driven workflow advancement, session recovery/checkpointing, concurrent session coordination).

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 44 — Assignment Policy Foundation), presented as a recommendation among the remaining unordered Milestone 8 candidates on the basis that Review-Gated Progression and Multi-Agent Engineering Orchestration both presuppose an Assignment concept that does not yet exist at runtime. Approved by the Sprint Owner with a binding scope statement narrowing the Sprint to a standalone, deterministic `AssignmentPolicy` domain model, independent of all runtime wiring (2026-07-14).

## Governance Decision

**Sprint 44 — Assignment Policy Foundation is authorized as Milestone 8's next Sprint.** The Sprint implements RFC-0004's existing, unmodified "Assignment" and "Assignment Policy" sections as a standalone Kernel domain concept: an `AssignmentPolicy` aggregate and supporting value objects representing assignment requirements (required role, Adapter/execution capability, repository configuration, execution constraints, and human preferences), with validation and deterministic policy evaluation. This establishes the canonical assignment model that future, separately-ratified Sprints may wire into workflow progression and multi-agent execution.

### Sprint Owner Refinements (binding)

**Refinement 1 — Standalone, unwired foundation.** `AssignmentPolicy` SHALL be implemented as a standalone Kernel domain concept, wholly independent of `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep`. This Sprint SHALL NOT integrate `AssignmentPolicy` with any of them, and SHALL NOT introduce runtime dispatch, Review-Gated Progression, orchestration, or automatic workflow advancement of any kind, including as an unused/stubbed reference — mirroring the Sprint 41 Workflow Chaining Foundation precedent.

**Refinement 2 — Assignment requirement model.** `AssignmentPolicy` SHALL represent, as immutable value objects, exactly the five factors RFC-0004's "Assignment Policy" section names policies as MAY considering: required role (via the existing `RoleId`), Adapter/execution capability, repository configuration, execution constraints, and human preferences. No additional assignment factor beyond these five SHALL be introduced.

**Refinement 3 — Deterministic evaluation.** Per RFC-0004 ("Policies SHALL remain deterministic"), `AssignmentPolicy` evaluation SHALL be a pure, deterministic function of its inputs: equivalent inputs SHALL always produce equivalent evaluation outcomes. Evaluation SHALL NOT dispatch an Adapter, transition Task or Execution State, or produce any side effect.

**Refinement 4 — Thin service, existing repository pattern.** `AssignmentPolicyService` SHALL provide creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts, mirroring `WorkflowChainService`'s thin-orchestration pattern (Sprint 41). `IAssignmentPolicyRepository` and an in-memory implementation SHALL mirror the existing Kernel repository pattern.

## Explicitly Deferred (this Sprint and this ratification)

- `EngineeringSession` / `WorkflowChain` / `ExecutionSession` wiring of `AssignmentPolicy`.
- Runtime dispatch, Adapter selection, or Adapter invocation driven by policy evaluation.
- Review-Gated Progression.
- Multi-Agent Engineering Orchestration.
- Automatic or event-driven workflow advancement.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Authorized Builder Scope

The Builder MAY, in the Sprint this ratification authorizes:

- Introduce an `AssignmentPolicy` immutable Kernel domain concept with `AssignmentPolicyId` and the five RFC-0004-named assignment-requirement value objects (Refinement 2).
- Introduce a deterministic policy-evaluation operation on `AssignmentPolicy` that is a pure function of its stated inputs (Refinement 3).
- Introduce `IAssignmentPolicyRepository` and an in-memory implementation for creation, lookup, and enumeration only.
- Introduce a thin `AssignmentPolicyService` for creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts — no dispatch, no wiring, no orchestration (Refinement 4).
- Update `createKernelServices` composition only as strictly required to construct and register the `AssignmentPolicy` repository and service.
- Add unit tests covering: aggregate construction and immutability; each assignment-requirement value object's validation; deterministic policy evaluation for equivalent inputs; the repository; and the service.

The Builder SHALL NOT:

- Modify `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowChainId`, `WorkflowStep`, `IWorkflowChainRepository`, `InMemoryWorkflowChainRepository`, `WorkflowChainService`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy` in any way.
- Introduce any reference from `AssignmentPolicy`/`AssignmentPolicyService` to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, or `WorkflowStep`, including as an unused/optional field.
- Introduce Adapter dispatch, Adapter selection, Review-Gated Progression, orchestration, or automatic/event-driven workflow advancement, in any form, including as an unused stub.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, orchestration, or workflow-progression concept beyond the standalone, deterministic `AssignmentPolicy` domain model and its evaluation operation.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass unmodified unless they enumerate Kernel-composed services, mirroring the Sprint 37–43 precedent for such updates.
- This ratification does not modify RFC-0004 (the "Assignment" and "Assignment Policy" sections already exist and are unmodified by this ratification), any other RFC, or the Kernel Canon.

## Related Sprint(s)

- Sprint 8 — Execution Roles (establishes `ExecutionRole`/`RoleId`, referenced by `AssignmentPolicy`'s required-role factor and unmodified by this Sprint).
- Sprint 41 — Workflow Chaining Foundation (the standalone-foundation-first precedent this Sprint mirrors).
- Sprint 43 — Engineering Session Manual Workflow Advancement (the most recently closed Milestone 8 Sprint; unmodified by this Sprint).

## Related Review(s)

- None. This ratification precedes Sprint 44 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 44 — Assignment Policy Foundation as Milestone 8's next Sprint, implementing RFC-0004's existing "Assignment" and "Assignment Policy" sections as a standalone, deterministic Kernel domain concept. `AssignmentPolicy` SHALL be wholly independent of `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, and `WorkflowStep`, with no integration, wiring, dispatch, orchestration, or automatic workflow advancement introduced in any form, including as an unused/stubbed reference (Refinement 1). `AssignmentPolicy` SHALL represent, as immutable value objects, exactly the five RFC-0004-named assignment-requirement factors: required role, Adapter/execution capability, repository configuration, execution constraints, and human preferences (Refinement 2). Policy evaluation SHALL be a pure, deterministic function of its inputs, producing equivalent outcomes for equivalent inputs, with no dispatch or side effect (Refinement 3). `AssignmentPolicyService` SHALL remain thin orchestration — creation, lookup, enumeration, and policy evaluation only, through constructor-injected repository contracts, mirroring `WorkflowChainService`'s established pattern (Refinement 4). No modification to `EngineeringSession`, `ExecutionSession`, `WorkflowChain`, `WorkflowStep`, `ExecutionRole`, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy` is authorized. Runtime wiring, Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic/event-driven workflow advancement, session recovery/checkpointing, and concurrent session coordination all remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 44, and to generate Sprint 44's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-025

## Ratification Identifier

NEXUS-RAT-2026-07-14-025

## Date

2026-07-15

## Subject

RFC-0004 Amendment — Workflow Advancement. Authorizes the repository's fourth RFC-0004 amendment (Version 1.3 → 1.4), introducing a generalized `Workflow Advancement` model owning six concepts (Advancement Strategy, Advancement Trigger, Advancement Eligibility, Advancement Authority, Advancement Result, Advancement Failure) and naming exactly three Advancement Strategies (Manual Advancement, Automatic/Event-Driven Advancement, Review-Gated Advancement). Resolves the `nexus-plan` governance report raised after Sprint 44's approval, when Milestone 8's five remaining candidates (Review-Gated Progression, Multi-Agent Engineering Orchestration, automatic/event-driven workflow advancement, session recovery/checkpointing, concurrent session coordination) were found to have no normative RFC-0004 definition — mirroring the identical gap that blocked Sprint 41 until the v1.3 Workflow Chaining amendment.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Governance Report (post-Sprint-44 planning cycle) identifying that none of Milestone 8's remaining candidates had a normative RFC-0004 definition. The Sprint Owner selected Workflow Advancement as the next direction and directed that the amendment generalize beyond a single "Automatic/Event-Driven" section: it SHALL establish one shared model (Advancement Strategy, Trigger, Eligibility, Authority, Result, Failure) used by all three named strategies — Manual (Sprint 43, already implemented), Automatic/Event-Driven (Sprint 45, this ratification's companion Sprint scope ratification), and Review-Gated (future) — so that Review-Gated Advancement and Multi-Agent Engineering Orchestration, both named as future Milestone 8 directions, consume the same vocabulary rather than requiring a later refactor (2026-07-15).

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.3 to Version 1.4, adding `Workflow Advancement` to RFC-0004's Domain Ownership list and introducing a new "Workflow Advancement" section (placed after "Engineering Session" and before "Execution Session").

The amendment is intentionally organizational and vocabulary-defining, not implementation-authorizing: it names and defines the six Workflow Advancement concepts and the three Advancement Strategies, but authorizes no implementation by itself. Manual Advancement's existing Sprint 43 implementation is explicitly unmodified and unexpanded. Automatic/Event-Driven Advancement and Review-Gated Advancement are named but remain unimplemented pending their own future Sprint Owner scope ratifications — this ratification's companion, `NEXUS-RAT-2026-07-14-026`, authorizes Sprint 45's implementation of Automatic/Event-Driven Advancement only.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Advancement Strategy, Advancement Trigger, Advancement Eligibility, Advancement Authority, Advancement Result, Advancement Failure (normative vocabulary) | RFC-0004 "Workflow Advancement" section (this amendment) |
| Manual Advancement implementation | `EngineeringSession.advanceWorkflow()` (Sprint 43, unmodified by this amendment) |
| Automatic/Event-Driven Advancement implementation | Sprint 45 (authorized separately by `NEXUS-RAT-2026-07-14-026`) |
| Review-Gated Advancement implementation, its gating semantics against Review Outcome (RFC-0006) | Future, separately-ratified Sprint and/or RFC amendment |
| Engineering Session's existing runtime-progression ownership (current workflow position, workflow state, workflow execution history) | `EngineeringSession` (RFC-0004 v1.2/v1.3, unmodified) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.3 → 1.4; Amendment History entry; `Workflow Advancement` added to the Domain Ownership list; new "Workflow Advancement" section added after "Engineering Session" and before "Execution Session".
- Proceed to draft a Sprint 45 scope ratification and Sprint Implementation Record authorizing implementation of the Automatic/Event-Driven Advancement Strategy only.

`nexus-plan` SHALL NOT:

- Modify `Engineering Session`'s or `Execution Session`'s own section text, `Workflow Chain`'s section text, or any other RFC-0004 section, guarantee, or concept beyond the additive Domain Ownership entry and the new "Workflow Advancement" section.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing implementation of Automatic/Event-Driven Advancement, Review-Gated Advancement, Multi-Agent Engineering Orchestration, session recovery/checkpointing, or concurrent session coordination; each remains separately deferred pending its own ratification.
- Treat this ratification as a general precedent permitting future RFC modification by ratification alone; each future RFC amendment requires its own explicit Sprint Owner authorization (per `NEXUS-RAT-2026-07-14-014`'s existing restriction).

## Scope Restrictions

- This is a documentation/specification change only; it introduces exactly one new RFC-0004-owned concept (`Workflow Advancement`) and its organizing vocabulary, and modifies no other RFC-0004 guarantee, section, or concept.
- No Kernel Canon change.
- No source code or test change is authorized by this ratification alone; Sprint 45's own Sprint Implementation Record separately governs implementation scope.
- Review-Gated Advancement's gating semantics against Review Outcome (RFC-0006) remain undefined pending its own future amendment; this ratification names the strategy without defining that interaction.

## Related Sprint(s)

- Sprint 43 — Engineering Session Manual Workflow Advancement (the existing Manual Advancement Strategy this amendment names and organizes without modification).
- Sprint 44 — Assignment Policy Foundation (most recently approved Milestone 8 Sprint; unmodified by this amendment).
- Sprint 45 — Automatic/Event-Driven Workflow Advancement (planned; consumes this amendment; separately authorized by `NEXUS-RAT-2026-07-14-026`).

## Related Review(s)

- None. This ratification precedes Sprint 45 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies an amendment to RFC-0004 — Execution Model, incrementing it to Version 1.4 and introducing `Workflow Advancement` as a new RFC-0004-owned architectural concept: the generalized model for how an Engineering Session's current workflow position advances within its bound Workflow Chain, organized around six concepts — Advancement Strategy, Advancement Trigger, Advancement Eligibility, Advancement Authority, Advancement Result, Advancement Failure — and naming exactly three Advancement Strategies: Manual Advancement (Sprint 43, existing, unmodified), Automatic/Event-Driven Advancement (unimplemented, authorized for Sprint 45 by the companion ratification `NEXUS-RAT-2026-07-14-026`), and Review-Gated Advancement (unimplemented, deferred pending its own future ratification defining its Review Outcome gating semantics). This amendment authorizes no implementation by itself; it supplies the shared vocabulary so that Automatic/Event-Driven Advancement, Review-Gated Advancement, and Multi-Agent Engineering Orchestration may each be implemented, in future separately-ratified Sprints, against one consistent model rather than requiring later reconciliation. Engineering Session's existing ownership of runtime progression (current workflow position, workflow state, workflow execution history), established by v1.2 and v1.3, is entirely unmodified. The Sprint Owner authorizes `nexus-plan` to apply this amendment's text directly to `rfc-0004-execution-model.md` as an explicitly authorized exception to `nexus-plan`'s ordinary prohibition on RFC modification, and to proceed to draft Sprint 45's scope ratification and Sprint Implementation Record for Automatic/Event-Driven Advancement.

## Current Status

Active

---

# NEXUS-RAT-2026-07-14-026

## Ratification Identifier

NEXUS-RAT-2026-07-14-026

## Date

2026-07-15

## Subject

Sprint 45 Scope Ratification — Automatic/Event-Driven Workflow Advancement. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-14-025` amended RFC-0004 to v1.4, introducing the Automatic/Event-Driven Advancement Strategy's concrete implementation, including the Sprint Owner's refinement of the `AdvancementTrigger` concept's semantics.

## Originating Review Finding(s)

None. Originated as a `nexus-plan` Sprint Proposal (Sprint 45 — Automatic/Event-Driven Workflow Advancement) presenting a caller-asserted trigger design for Sprint Owner confirmation, since RFC-0004 defines no Event Bus subscription path for `EngineeringSession` and the Implementation Constitution forbids hidden or scheduled behavior. Approved by the Sprint Owner with a refinement decoupling `AdvancementTrigger`'s domain semantics from "caller" framing: the trigger represents a deterministic fact that advancement has become eligible, independent of how it is produced; Sprint 45 supports exactly one trigger producer (synchronous API submission), leaving room for future trigger producers (`ExecutionSession` completion, Review approval, Event Bus notification) to be added later without modifying the `AdvancementTrigger` concept itself (2026-07-15).

## Governance Decision

**Sprint 45 — Automatic/Event-Driven Workflow Advancement is authorized as Milestone 8's next Sprint.** Sprint 45 implements RFC-0004 v1.4's Automatic/Event-Driven Advancement Strategy only, reusing Sprint 43's existing Manual Advancement validation logic and `WorkflowChain`/`EngineeringSession` boundaries without modification.

### Sprint Owner Refinements (binding)

**Refinement 1 — `AdvancementTrigger` is producer-independent.** `AdvancementTrigger` SHALL be an immutable domain concept representing a deterministic fact that Advancement Eligibility should be (re-)evaluated. `AdvancementTrigger`'s definition SHALL NOT encode or name "caller," "API," or any other producer mechanism as part of its domain semantics. Sprint 45 SHALL support exactly one trigger-submission path — a synchronous application-service/aggregate operation accepting an `AdvancementTrigger` — without foreclosing future trigger producers.

**Refinement 2 — Fully synchronous, no hidden behavior.** Sprint 45 SHALL introduce no Event Bus subscription, scheduling, background processing, polling, or asynchronous execution of any kind. Trigger submission and advancement evaluation SHALL occur synchronously within one call.

**Refinement 3 — Reuse Sprint 43's advancement rules verbatim.** The Automatic/Event-Driven Advancement Strategy SHALL apply the exact same Advancement Eligibility checks and Advancement Result/Failure semantics already implemented for Manual Advancement (bound `WorkflowChain` exists; current position valid; current position not terminal). Sprint 45 SHALL NOT introduce a second, divergent validation path.

**Refinement 4 — No cross-domain wiring.** Sprint 45 SHALL NOT introduce any reference from `EngineeringSession`, `AdvancementTrigger`, or their supporting types to `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter dispatch, or the Event Bus. `ExecutionSession`-completion-driven triggering and Review-Gated Advancement remain explicitly deferred to future, separately-ratified Sprints.

## Architectural Responsibilities (binding)

| Concern | Owner |
| --- | --- |
| `AdvancementTrigger` value object, its validation | New (this Sprint), within `src/kernel/execution` |
| Advancement Eligibility evaluation, Advancement Result/Failure | `EngineeringSession` (Sprint 43's existing validation logic, reused/extended, not duplicated) |
| Trigger submission orchestration | `EngineeringSessionService` (existing service, thin orchestration only) |
| `WorkflowChain`/`WorkflowStep` structural definition | Unmodified (Sprint 41, frozen) |
| `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter dispatch, Event Bus | Unmodified; not referenced by this Sprint |

## Authorized Builder Scope

The Builder MAY:

- Introduce an immutable `AdvancementTrigger` value object satisfying Refinement 1.
- Introduce a new `EngineeringSession` operation (e.g. `advanceWorkflowOnTrigger` or equivalent name) that accepts an `AdvancementTrigger`, evaluates Advancement Eligibility using Sprint 43's existing validated logic, and produces the same Advancement Result/Failure outcomes as `advanceWorkflow()`, differing only in accepting a trigger argument instead of an unconditional caller request.
- Extend `EngineeringSessionService` with the corresponding thin orchestration operation (repository lookup, aggregate delegation, persistence only), mirroring `advanceWorkflow()`'s existing service method.
- Add unit/integration tests covering: trigger validation; eligible-trigger advancement; ineligible-trigger rejection (no bound chain, invalid position, terminal position); determinism (equivalent trigger + equivalent state produce equivalent outcomes); and that Sprint 43's existing `advanceWorkflow()` behavior and tests remain unmodified and passing.

The Builder SHALL NOT:

- Introduce any Event Bus subscription, scheduling, background processing, or asynchronous behavior.
- Introduce any reference from `AdvancementTrigger`, the new `EngineeringSession` operation, or `EngineeringSessionService` to `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter dispatch, `RoleRegistry`, `EngineeringRoleProfile`, `EngineeringRoleProfileRegistry`, or `ExecutionStrategy`.
- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, or Sprint 43's existing `advanceWorkflow()`/`isWorkflowComplete()` behavior.
- Modify any `src/hosts` or `src/adapters` file.
- Introduce Review-Gated Advancement, Multi-Agent Engineering Orchestration, session recovery/checkpointing, or concurrent session/workflow coordination in any form, including as an unused/stubbed reference.

## Explicitly Deferred (this Sprint and this ratification)

- `ExecutionSession`-completion-driven (or any other concrete domain-event-driven) trigger producer.
- Event Bus integration or subscription for `EngineeringSession`.
- Review-Gated Advancement and its Review Outcome gating semantics.
- Multi-Agent Engineering Orchestration.
- Session recovery/checkpointing.
- Concurrent session/workflow coordination.
- Any `src/hosts` or `src/adapters` change.

Each remains a separate future Milestone 8 Sprint requiring its own scope ratification.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No new execution, dispatch, orchestration, or workflow-progression concept beyond the Automatic/Event-Driven Advancement Strategy and its `AdvancementTrigger` value object.
- No previously approved test SHALL regress; TypeScript compilation, ESLint, Vitest, esbuild, the Sprint 18 Kernel Boundary Certification test, and the Sprint 28 Extension Host suite SHALL continue to pass.
- This ratification does not modify RFC-0004 beyond what `NEXUS-RAT-2026-07-14-025` already authorized; it selects and scopes one already-named Advancement Strategy for implementation.

## Related Sprint(s)

- Sprint 43 — Engineering Session Manual Workflow Advancement (the Advancement Eligibility/Result/Failure logic this Sprint reuses verbatim).
- Sprint 44 — Assignment Policy Foundation (most recently approved Milestone 8 Sprint; unmodified and unreferenced by this Sprint).

## Related Review(s)

- None. This ratification precedes Sprint 45 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 45 — Automatic/Event-Driven Workflow Advancement as Milestone 8's next Sprint, implementing RFC-0004 v1.4's Automatic/Event-Driven Advancement Strategy only. `AdvancementTrigger` SHALL be an immutable, producer-independent domain concept representing a deterministic fact that Advancement Eligibility should be evaluated, with no "caller"/"API"/producer framing in its domain semantics (Refinement 1). Sprint 45 SHALL introduce no Event Bus subscription, scheduling, background processing, or asynchronous behavior; trigger submission and evaluation SHALL occur synchronously within one call (Refinement 2). The Automatic/Event-Driven Strategy SHALL reuse Sprint 43's existing Advancement Eligibility checks and Advancement Result/Failure semantics verbatim, introducing no second validation path (Refinement 3). No reference from `AdvancementTrigger`, the new `EngineeringSession` operation, or `EngineeringSessionService` to `ExecutionSession`, `Review`, `AssignmentPolicy`, Adapter dispatch, or the Event Bus is authorized (Refinement 4). `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, and Sprint 43's existing `advanceWorkflow()`/`isWorkflowComplete()` remain unmodified. `ExecutionSession`-completion-driven triggering, Review-Gated Advancement, Multi-Agent Engineering Orchestration, session recovery/checkpointing, and concurrent session/workflow coordination all remain explicitly deferred to future, separately-ratified Milestone 8 Sprints. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 45, and to generate Sprint 45's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-001

## Ratification Identifier

NEXUS-RAT-2026-07-15-001

## Date

2026-07-15

## Subject

Review-Gated Advancement gating semantics — RFC-0004 v1.4 → v1.5 amendment defining the Blocking/Non-Blocking Review Outcome classification against Advancement Eligibility.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Governance Report presented after Sprint 45's approval, resolving the gating-semantics ambiguity RFC-0004 v1.4 (`NEXUS-RAT-2026-07-14-025`) explicitly left open for Review-Gated Advancement.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.4 to Version 1.5, defining Review-Gated Advancement's gating semantics against RFC-0006's `ReviewOutcome`.

A workflow position gated by Review-Gated Advancement is eligible to advance only when the governing Review reaches a **Non-Blocking Review Outcome**:

| Classification | ReviewOutcome values | Effect on Advancement Eligibility |
| --- | --- | --- |
| Non-Blocking Review Outcome | Accepted, Accepted With Observations | Eligible — Advancement Eligibility MAY be satisfied. |
| Blocking Review Outcome | Action Required, Rejected | Not eligible — Advancement Eligibility SHALL NOT be satisfied; the attempt SHALL produce an Advancement Failure. |

Rationale: a workflow position should advance only once the implementation has been independently certified, whether unconditionally (Accepted) or with only non-blocking observations (Accepted With Observations). Action Required and Rejected indicate recovery or reimplementation is still required, and advancing under either would allow uncertified work to progress, undermining the purpose of a review gate.

This classification is owned by RFC-0004 solely for Review-Gated Advancement's Advancement Eligibility. It does not modify RFC-0006's `ReviewOutcome` values, semantics, or lifecycle, and RFC-0006 is otherwise unmodified.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| `ReviewOutcome` identity, values, and lifecycle | RFC-0006 (unmodified) |
| Blocking/Non-Blocking Review Outcome classification (for Advancement Eligibility purposes only) | RFC-0004 "Workflow Advancement" section (this amendment) |
| Review-Gated Advancement implementation | Future, separately-ratified Sprint (not authorized by this ratification) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge\specifications\rfc-0004-execution-model.md`: Version 1.4 → 1.5; Amendment History entry; Review-Gated Advancement bullet and Blocking/Non-Blocking Review Outcome classification added to the "Workflow Advancement" section.
- Proceed to propose a future Sprint scope ratification authorizing Review-Gated Advancement implementation, consuming this classification.

`nexus-plan` SHALL NOT:

- Modify RFC-0006, `Engineering Session`, `Workflow Chain`, Manual Advancement, or Automatic/Event-Driven Advancement's own section text or semantics.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing implementation of Review-Gated Advancement; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No RFC-0006 change.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 45 — Automatic/Event-Driven Workflow Advancement (approved; unmodified and unaffected by this amendment).
- Future Review-Gated Advancement implementation Sprint (not yet proposed; will consume this classification).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Review-Gated Advancement SHALL use a non-blocking review outcome model: a workflow position is eligible to advance only when the governing Review's outcome is Accepted or Accepted With Observations (Non-Blocking Review Outcome); Action Required and Rejected (Blocking Review Outcome) SHALL NOT permit advancement and SHALL produce an Advancement Failure. This preserves Review-Gated Advancement as a certification gate: Accepted With Observations indicates independent certification with only non-blocking remaining observations, addressable through documentation or follow-up work without preventing advancement, while Action Required and Rejected indicate recovery or reimplementation is still required. RFC-0004 SHALL be amended to Version 1.5 to define this Blocking/Non-Blocking Review Outcome classification, scoped solely to Review-Gated Advancement's Advancement Eligibility; RFC-0006's `ReviewOutcome` values, semantics, and lifecycle are unmodified. This ratification authorizes the RFC-0004 clarification and its supporting documentation only; no implementation behavior change is authorized beyond this governance clarification, and Review-Gated Advancement implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-002

## Ratification Identifier

NEXUS-RAT-2026-07-15-002

## Date

2026-07-15

## Subject

Sprint 46 Scope Ratification — Review-Gated Workflow Advancement. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-001` amended RFC-0004 to v1.5, authorizing implementation of the Review-Gated Advancement Strategy, incorporating the Sprint Owner's objective refinement and architectural-responsibility clarification.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved with refinements by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 46 — Review-Gated Workflow Advancement as Milestone 8's next Sprint, implementing RFC-0004 v1.5's Review-Gated Advancement Strategy only, subject to the following binding refinements:

**Objective (binding, supersedes the `nexus-plan` proposal draft):** Implement RFC-0004 v1.5's Review-Gated Advancement Strategy by introducing an `EngineeringSession` advancement operation that consumes an already-finalized `ReviewOutcome`, determines advancement eligibility using the ratified Blocking/Non-Blocking classification (`NEXUS-RAT-2026-07-15-001`), and advances the current workflow position only when the supplied `ReviewOutcome` is classified as Non-Blocking. The Sprint SHALL NOT evaluate, calculate, reinterpret, or modify `ReviewOutcome`; `ReviewOutcome` remains exclusively owned by RFC-0006; Sprint 46 only consumes the final `ReviewOutcome` as immutable input.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Review lifecycle, Review evaluation, `ReviewOutcome` determination | RFC-0006 (unmodified) |
| Advancement eligibility, Blocking/Non-Blocking classification, workflow position advancement | RFC-0004 (this Sprint, consuming `NEXUS-RAT-2026-07-15-001`) |

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| `ReviewOutcome` identity, values, lifecycle, determination | RFC-0006 / `ReviewService` (unmodified; read-only lookup only) |
| Blocking/Non-Blocking Review Outcome classification | RFC-0004 v1.5 "Workflow Advancement" section (`NEXUS-RAT-2026-07-15-001`, unmodified by this ratification) |
| Review-Gated Advancement operation (new `EngineeringSession` operation, `EngineeringSessionService` orchestration) | This Sprint |
| Sprint 43 Advancement Eligibility/Result/Failure semantics | `EngineeringSession` (Sprint 43, reused unchanged, extended only with the additional Review-Gated eligibility check) |

## Authorized Scope

`nexus-plan` MAY:

- Activate Sprint 46 in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md`.
- Generate Sprint 46's Sprint Implementation Record (`knowledge/implementation/sprints/sprint-0046-review-gated-workflow-advancement.md`) as the Builder's authoritative implementation contract, incorporating this ratification's binding Objective and Architectural Responsibilities verbatim.

The Builder MAY:

- Introduce the `EngineeringSession` Review-Gated advancement operation, accepting an already-finalized `ReviewOutcome` (or a reference resolved to one via existing, unmodified `ReviewService` lookup) as immutable input.
- Classify the supplied `ReviewOutcome` using the ratified Blocking/Non-Blocking semantics (`NEXUS-RAT-2026-07-15-001`).
- Reuse Sprint 43's existing Advancement Eligibility, Advancement Result, and Advancement Failure semantics unchanged, adding only the Review-Gated eligibility check.
- Add a thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45's pattern.

The Builder SHALL NOT:

- Modify Review lifecycle semantics, `ReviewOutcome` values, or any `ReviewService` write operation.
- Persist or mutate Review state from within `EngineeringSession`/`EngineeringSessionService`.
- Introduce Event Bus triggers, orchestration, or any automatic Review-completion-driven wiring.
- Modify `AssignmentPolicy`, `ExecutionSession`, `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, or Sprint 43's/Sprint 45's existing `advanceWorkflow()`/`advanceWorkflowOnTrigger()`/`isWorkflowComplete()` methods.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- `ReviewOutcome` SHALL be treated as immutable input; Sprint 46 SHALL NOT modify or persist Review state.
- Advancement SHALL preserve Sprint 43 Advancement Eligibility, Result, and Failure semantics unchanged, adding only the Review-Gated eligibility check.
- Existing approved advancement behavior (Sprint 43 Manual Advancement, Sprint 45 Automatic/Event-Driven Advancement) SHALL remain byte-for-byte identical for all non-review-gated scenarios.
- No Kernel Canon change; no RFC-0004 or RFC-0006 change beyond what `NEXUS-RAT-2026-07-15-001` already authorized.

## Related Sprint(s)

- Sprint 43 — Engineering Session Manual Workflow Advancement (Advancement Eligibility/Result/Failure logic reused unchanged).
- Sprint 45 — Automatic/Event-Driven Workflow Advancement (sibling Advancement Strategy; unmodified and unaffected).
- Sprint 9 — Review Foundation (`ReviewOutcome` source; unmodified, read-only consumption only).

## Related Review(s)

- None. This ratification precedes Sprint 46 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 46 — Review-Gated Workflow Advancement as Milestone 8's next Sprint, implementing RFC-0004 v1.5's Review-Gated Advancement Strategy only. The Sprint's objective is refined to: implement an `EngineeringSession` advancement operation that consumes an already-finalized `ReviewOutcome`, determines advancement eligibility using the ratified Blocking/Non-Blocking classification, and advances the current workflow position only when the supplied `ReviewOutcome` is classified as Non-Blocking. The Sprint SHALL NOT evaluate, calculate, reinterpret, or modify `ReviewOutcome`; `ReviewOutcome` remains exclusively owned by RFC-0006 and is consumed only as immutable input. RFC-0006 owns Review lifecycle, Review evaluation, and `ReviewOutcome` determination; RFC-0004 owns advancement eligibility, the Blocking/Non-Blocking classification, and workflow position advancement — this separation SHALL be preserved. Acceptance criteria additionally require: `ReviewOutcome` treated as immutable input; no Review state modified or persisted by this Sprint; Sprint 43's Advancement Eligibility, Result, and Failure semantics preserved unchanged, extended only by the Review-Gated eligibility check; existing approved advancement behavior remains byte-for-byte identical for all non-review-gated scenarios. The Sprint SHALL NOT modify Review lifecycle semantics, `ReviewOutcome` values, introduce Event Bus triggers, introduce orchestration, or modify `AssignmentPolicy`, `ExecutionSession`, `Host`, or `Adapter` behavior. With these refinements incorporated into the Sprint Implementation Record, Sprint 46 is authorized and may be activated.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-003

## Ratification Identifier

NEXUS-RAT-2026-07-15-003

## Date

2026-07-15

## Subject

Workflow Chain Execution — RFC-0004 v1.5 → v1.6 amendment defining the act of executing the Workflow Step at an Engineering Session's current workflow position, distinct from Workflow Advancement.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` governance scan: Milestone 8's remaining candidate scope (Multi-Agent Engineering Orchestration, session recovery/checkpointing, concurrent session coordination) presupposes a capability RFC-0004 does not yet define — actually executing a bound Workflow Chain's steps, as opposed to only tracking/advancing a position within it. RFC-0004's existing "Workflow Chaining" § Architectural Responsibilities (line 303) and "Workflow Advancement" § Architectural Responsibilities (line 398) each explicitly reserve Adapter dispatch as "a separate, future orchestration capability requiring its own Sprint Owner ratification."

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.5 to Version 1.6, adding a new "Workflow Chain Execution" section between "Workflow Advancement" and "Execution Session."

A Workflow Chain Execution is the act of executing the Workflow Step at an Engineering Session's current workflow position, distinct from Workflow Advancement, which only moves that position.

Workflow Chain Execution owns: resolving the current Workflow Step's referenced Execution Role; invoking the existing Execution Strategy to evaluate execution readiness; dispatching through the existing Adapter contract (explicit `adapterId` only — no Adapter Selection); returning the execution outcome to the existing Workflow Advancement process. Execution is recorded through the existing Execution Session model without redefining Execution Session's own creation, update, completion, or persistence semantics — Execution Session remains the normative owner of its own lifecycle.

Workflow Chain Execution SHALL NOT own Review evaluation or Review Outcome determination, Assignment Policy, Adapter Selection, Task lifecycle transition, Execution Session lifecycle, Multi-Agent Orchestration, or any Advancement Strategy — those remain owned by their respective sections, unmodified.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Workflow Chain structure, identity, topology | RFC-0004 "Workflow Chaining" (v1.3, unmodified) |
| Current workflow position, workflow state, workflow execution history | RFC-0004 "Engineering Session" (v1.2/v1.3, unmodified) |
| Advancement Strategy, Trigger, Eligibility, Authority, Result, Failure | RFC-0004 "Workflow Advancement" (v1.4/v1.5, unmodified) |
| Resolving current Workflow Step's Execution Role; invoking Execution Strategy; Adapter dispatch (explicit `adapterId` only); returning outcome to Workflow Advancement | RFC-0004 "Workflow Chain Execution" (this amendment) |
| Execution Session creation, update, completion, persistence | RFC-0004 "Execution Session" (unmodified) |
| `ReviewOutcome` identity, values, lifecycle | RFC-0006 (unmodified) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge\specifications\rfc-0004-execution-model.md`: Version 1.5 → 1.6; Amendment History entry; new "Workflow Chain Execution" section.
- Proceed to draft a Sprint 47 scope ratification authorizing implementation of Workflow Chain Execution, consuming this amendment.

`nexus-plan` SHALL NOT:

- Modify RFC-0006, Engineering Session, Workflow Chain, Workflow Advancement, Review-Gated Advancement, Execution Strategy, Execution Session, or Assignment Policy's own section text or semantics.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing implementation of Workflow Chain Execution; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No RFC-0006 change. No Assignment Policy, Multi-Agent Orchestration, session recovery/checkpointing, or concurrent session coordination capability is introduced or implied.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 20 — Execution Pipeline Integration (the certified explicit-`adapterId`-only dispatch pattern this amendment reuses).
- Sprint 40 — Execution Session Foundation (the unmodified `ExecutionSession` model this amendment's execution is recorded through).
- Sprint 42/43/45/46 — Workflow Chain binding and all three Advancement Strategies (unmodified and unaffected by this amendment).
- Future Workflow Chain Execution implementation Sprint (not yet proposed; will consume this amendment).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Workflow Chain Execution — the act of executing the Workflow Step at an Engineering Session's current workflow position — SHALL be defined by RFC-0004 as a new, separate architectural concern from Workflow Advancement. Workflow Chain Execution owns resolving the current Workflow Step's Execution Role, invoking the existing Execution Strategy, dispatching through the existing Adapter contract via explicit `adapterId` only, and returning the execution outcome to the existing Workflow Advancement process; it does not own Review evaluation, Review Outcome determination, Assignment Policy, Adapter Selection, Task lifecycle transition, Execution Session lifecycle, or Multi-Agent Orchestration, each of which remains owned by its respective existing section. Execution is recorded through the existing Execution Session model without redefining that model's own lifecycle. RFC-0004 SHALL be amended to Version 1.6 to add this "Workflow Chain Execution" section; RFC-0006, Engineering Session, Workflow Chain, Workflow Advancement, Review-Gated Advancement, Execution Strategy, Execution Session, and Assignment Policy are otherwise unmodified. This ratification authorizes the RFC-0004 amendment and its supporting documentation only; no implementation behavior change is authorized beyond this governance clarification, and Workflow Chain Execution implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-004

## Ratification Identifier

NEXUS-RAT-2026-07-15-004

## Date

2026-07-15

## Subject

Sprint 47 Scope Ratification — Workflow Chain Execution. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-003` amended RFC-0004 to v1.6, authorizing implementation of Workflow Chain Execution.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 47 — Workflow Chain Execution as Milestone 8's next Sprint, implementing RFC-0004 v1.6's Workflow Chain Execution section only.

**Objective (binding):** Introduce a new `EngineeringSession` operation that, at the session's current workflow position, resolves the bound `WorkflowStep`'s `RoleId`, invokes the existing `ExecutionStrategyService` to evaluate execution readiness, dispatches through the existing `AdapterService` using an explicit, caller-supplied `adapterId` (no Adapter Selection), and returns the resulting execution outcome. A corresponding thin `EngineeringSessionService` orchestration operation SHALL mirror the existing Sprint 45/46 pattern. Execution SHALL be recorded through the existing, unmodified `ExecutionSession` model.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| `ReviewOutcome` determination, Review lifecycle | RFC-0006 / `ReviewService` (unmodified) |
| Workflow Chain structure, `WorkflowStep` topology | `WorkflowChain`/`WorkflowChainService` (Sprint 41, unmodified) |
| Current workflow position, workflow state | `EngineeringSession` (Sprint 39/42/43, unmodified except for this Sprint's new execution operation) |
| Execution readiness evaluation | `ExecutionStrategyService.evaluateAssignmentReadiness` (Sprint 10/20, unmodified) |
| Adapter dispatch | `AdapterService.dispatch` (Sprint 7/19/20, unmodified; explicit `adapterId` only) |
| Execution attempt record | `ExecutionSession`/`ExecutionSessionService` (Sprint 40, unmodified — this Sprint constructs records through the existing service, does not redefine its lifecycle) |
| Workflow position advancement (separate from execution) | Manual/Automatic/Review-Gated Advancement (Sprints 43/45/46, unmodified and unaffected) |

## Ownership Model (ratified)

Identical to `NEXUS-RAT-2026-07-15-003`'s Ownership Model table; this ratification authorizes implementation against it.

## Authorized Scope

The Builder MAY:

- Introduce one new `EngineeringSession` operation (e.g. `executeCurrentWorkflowStep`) resolving the current `WorkflowStep`'s `RoleId`, invoking `ExecutionStrategyService`, dispatching via `AdapterService.dispatch` with a caller-supplied explicit `adapterId`, and constructing an `ExecutionSession` record through the existing `ExecutionSessionService` to capture the attempt.
- Add a corresponding thin `EngineeringSessionService` orchestration operation, mirroring Sprint 45/46's pattern (repository lookup, delegation, persistence, snapshot return).
- Extend `createKernelServices` composition only as strictly required to supply the additional repository/service contracts this operation reads.

The Builder SHALL NOT:

- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Introduce Adapter Selection, Adapter routing, or any capability-scoring/fallback logic; dispatch SHALL use an explicit `adapterId` supplied by the caller.
- Introduce Assignment Policy evaluation, Multi-Agent Orchestration, Task lifecycle transition, session recovery/checkpointing, or concurrent session coordination.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- Execution and Advancement remain separate operations; this Sprint SHALL NOT fold execution into any existing `advanceWorkflow*` method or cause execution to implicitly advance the workflow position.
- `ReviewOutcome` remains untouched by this Sprint; Review-Gated Advancement (Sprint 46) is unaffected.
- No Kernel Canon change; no RFC-0004 change beyond what `NEXUS-RAT-2026-07-15-003` already authorized; no RFC-0006 change.

## Related Sprint(s)

- Sprint 20 — Execution Pipeline Integration (certified explicit-`adapterId`-only dispatch pattern reused).
- Sprint 40 — Execution Session Foundation (`ExecutionSession` model reused unmodified).
- Sprint 41/42/43/45/46 — `WorkflowChain`, binding, and all three Advancement Strategies (unmodified and unaffected).

## Related Review(s)

- None. This ratification precedes Sprint 47 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 47 — Workflow Chain Execution as Milestone 8's next Sprint, implementing RFC-0004 v1.6's Workflow Chain Execution section only. The Sprint introduces one new `EngineeringSession` operation that resolves the current workflow position's `WorkflowStep`/`RoleId`, invokes the existing `ExecutionStrategyService` for readiness evaluation, dispatches through the existing `AdapterService.dispatch` using an explicit, caller-supplied `adapterId` only (no Adapter Selection), and records the attempt through the existing, unmodified `ExecutionSessionService`/`ExecutionSession` model, together with a corresponding thin `EngineeringSessionService` orchestration operation mirroring Sprint 45/46's pattern. Execution and Advancement remain separate operations; this Sprint SHALL NOT fold execution into `advanceWorkflow()`, `advanceWorkflowOnTrigger()`, or `advanceWorkflowAfterReview()`, nor cause execution to implicitly advance the workflow position. `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, and `Finding` SHALL NOT be modified. No Adapter Selection, Assignment Policy evaluation, Multi-Agent Orchestration, Task lifecycle transition, session recovery/checkpointing, concurrent session coordination, or `src/hosts`/`src/adapters` change is authorized. With these refinements incorporated into the Sprint Implementation Record, Sprint 47 is authorized and may be activated.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-005

## Ratification Identifier

NEXUS-RAT-2026-07-15-005

## Date

2026-07-15

## Subject

Assignment Policy Evaluation — RFC-0004 v1.6 to v1.7 amendment adding an optional consumption point at which Workflow Chain Execution gates dispatch using the existing, unmodified Assignment Policy evaluation.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Owner planning request evaluating "Assignment Policy Foundation" as Milestone 8's next capability. Governance analysis determined that capability already shipped and was certified with zero findings as Sprint 44 (`NEXUS-REV-2026-07-14-024`), and remains frozen under the Constitution's Approved Vertical Slice Immutability rule. Sprint 44 explicitly deferred wiring of AssignmentPolicy into EngineeringSession, WorkflowChain, or ExecutionSession; Sprint 47 explicitly deferred Assignment Policy evaluation. RFC-0004 v1.6's Workflow Chain Execution section states it shall not own Assignment Policy, and that the amendment intentionally preserves future compatibility with Assignment Policy without introducing or implying it - i.e., the consumption point is anticipated but not yet authorized. The Sprint Owner directed that the stated objective (determine which Execution Role should execute the current Workflow Step, integrating cleanly with the existing execution pipeline) be re-scoped as this wiring/consumption capability rather than a re-implementation of Sprint 44.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.6 to Version 1.7, adding a new "Assignment Policy Evaluation" subsection under the existing "Workflow Chain Execution" section.

Workflow Chain Execution MAY accept a caller-supplied Assignment Policy reference alongside its existing execution inputs. When supplied, Workflow Chain Execution SHALL invoke that Assignment Policy's existing deterministic evaluation with the resolved Workflow Step's Execution Role and the caller-supplied evaluation input, before Adapter dispatch; when unsatisfied, execution SHALL be rejected deterministically with no Adapter dispatch and no Execution Session record created. When no reference is supplied, Workflow Chain Execution's existing v1.6 behavior is unchanged.

This amendment SHALL NOT redefine Assignment Policy's own value objects, evaluation semantics, or determinism guarantees (v1.3, unmodified). This amendment SHALL NOT introduce Assignment Policy selection, inference, or automatic binding to a Workflow Step - the reference SHALL be supplied explicitly by the caller, consistent with the standing explicit-adapterId-only guardrail already established for Adapter dispatch (Sprint 20, reaffirmed by `NEXUS-RAT-2026-07-15-003`).

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Assignment Policy value objects (required role, Adapter execution capability, repository configuration, execution constraints, human preferences), pure evaluation function | RFC-0004 "Assignment Policy" (Sprint 44, unmodified) |
| Resolving current Workflow Step's Execution Role; invoking Execution Strategy; Adapter dispatch (explicit adapterId only) | RFC-0004 "Workflow Chain Execution" (v1.6, Sprint 47, unmodified) |
| Consuming an explicitly-supplied Assignment Policy reference to gate dispatch before Adapter invocation | RFC-0004 "Workflow Chain Execution" section Assignment Policy Evaluation (this amendment) |
| Execution Session creation, update, completion, persistence | RFC-0004 "Execution Session" (Sprint 40, unmodified) |
| Workflow position advancement (separate from execution) | RFC-0004 "Workflow Advancement" (Sprints 43/45/46, unmodified and unaffected) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.6 to 1.7; Amendment History entry; new "Assignment Policy Evaluation" subsection under "Workflow Chain Execution."
- Proceed to draft a Sprint 48 scope ratification authorizing implementation of Assignment Policy Evaluation, consuming this amendment.

`nexus-plan` SHALL NOT:

- Modify RFC-0006, Engineering Session, Workflow Chain, Workflow Advancement, Review-Gated Advancement, Execution Strategy, Execution Session, or Assignment Policy's own section text, value objects, or evaluation semantics.
- Modify any other RFC, the Kernel Canon, or any prior Sprint's Implementation Record, `IMPLEMENTATION_REPORT.md` entry, or `REVIEW_HISTORY.md` entry.
- Treat this ratification as authorizing implementation; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No RFC-0006 change. No Adapter Selection, Adapter routing, capability scoring, automatic Assignment Policy binding/inference, Multi-Agent Orchestration, or Task lifecycle transition is introduced or implied.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 44 — Assignment Policy Foundation (the certified, unmodified AssignmentPolicy/AssignmentPolicyService this amendment's consumption point reuses).
- Sprint 47 — Workflow Chain Execution (the certified, unmodified dispatch pipeline this amendment extends with an optional gate).
- Future Assignment Policy Evaluation implementation Sprint (Sprint 48; not yet implemented; will consume this amendment).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Assignment Policy Evaluation - the act of gating Workflow Chain Execution's existing dispatch step using an explicitly-supplied Assignment Policy reference - SHALL be defined by RFC-0004 as a new subsection of the existing "Workflow Chain Execution" section. Workflow Chain Execution MAY accept a caller-supplied Assignment Policy reference; when supplied, it SHALL invoke the existing Assignment Policy evaluation with the resolved Execution Role and caller-supplied evaluation input before Adapter dispatch, rejecting execution deterministically (no dispatch, no Execution Session record) when unsatisfied; when omitted, existing v1.6 behavior is unchanged. This amendment does not redefine Assignment Policy's own semantics and does not introduce Assignment Policy selection, inference, or automatic binding. RFC-0004 SHALL be amended to Version 1.7 to add this subsection; Assignment Policy, Engineering Session, Workflow Chain, Workflow Advancement, Review-Gated Advancement, Execution Strategy, Execution Session, and RFC-0006 are otherwise unmodified. This ratification authorizes the RFC-0004 amendment and its supporting documentation only; implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-006

## Ratification Identifier

NEXUS-RAT-2026-07-15-006

## Date

2026-07-15

## Subject

Sprint 48 Scope Ratification — Assignment Policy Integration. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-005` amended RFC-0004 to v1.7, authorizing implementation of Assignment Policy Evaluation within Workflow Chain Execution.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner ("proceed to nexus-plan").

## Governance Decision

The Sprint Owner authorizes Sprint 48 — Assignment Policy Integration as Milestone 8's next Sprint, implementing RFC-0004 v1.7's Assignment Policy Evaluation subsection only.

**Objective (binding):** Extend `EngineeringSessionService.executeCurrentWorkflowStep` (Sprint 47) so that, when the caller supplies an Assignment Policy reference and evaluation input, the operation invokes the existing, unmodified `AssignmentPolicyService.evaluateAssignmentPolicy` with the resolved Workflow Step's `RoleId` as the required-role input before Adapter dispatch. When the evaluation reports unsatisfied, the operation SHALL return a deterministic rejection outcome with no Adapter dispatch and no `ExecutionSession` record created. When no Assignment Policy reference is supplied, behavior SHALL be byte-for-byte identical to Sprint 47.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Assignment Policy value objects, pure evaluation function | AssignmentPolicy/AssignmentPolicyService (Sprint 44, unmodified) |
| Resolving current Workflow Step's Execution Role; Execution Strategy readiness; Adapter dispatch | EngineeringSession/EngineeringSessionService (Sprint 47, unmodified except for this Sprint's new optional gate) |
| Assignment Policy Evaluation consumption gating dispatch | EngineeringSessionService.executeCurrentWorkflowStep (this Sprint, new optional gate only) |
| Execution attempt record | ExecutionSession/ExecutionSessionService (Sprint 40, unmodified) |
| Workflow position advancement | Manual/Automatic/Review-Gated Advancement (Sprints 43/45/46, unmodified and unaffected) |

## Ownership Model (ratified)

Identical to `NEXUS-RAT-2026-07-15-005`'s Ownership Model table; this ratification authorizes implementation against it.

## Authorized Scope

The Builder MAY:

- Extend `ExecuteCurrentWorkflowStepCommand` with an optional Assignment Policy reference and optional evaluation-input fields (mirroring `AssignmentPolicyEvaluationInput`'s existing shape: Adapter execution capability, repository configuration, execution constraints, human preferences).
- Extend `EngineeringSessionService.executeCurrentWorkflowStep` to invoke `AssignmentPolicyService.evaluateAssignmentPolicy` when a reference is supplied, using the resolved Workflow Step `RoleId` as the required-role input, before constructing the Adapter dispatch request.
- Add a new deterministic rejection outcome to `EngineeringSessionWorkflowExecutionStatus` (e.g. `AssignmentPolicyRejected`), mirroring the existing `ReadinessRejected` outcome shape, produced when evaluation is unsatisfied.
- Extend `createKernelServices` composition only as strictly required to supply `AssignmentPolicyService` to `EngineeringSessionService`'s constructor as an optional collaborator, mirroring the existing optional executionStrategyService/adapterService/executionSessionService pattern.
- Add unit/integration tests covering: satisfied policy leads to execution proceeding unchanged; unsatisfied policy leads to deterministic rejection with no dispatch and no ExecutionSession record; omitted policy reference leads to Sprint 47 behavior unchanged, byte-for-byte; determinism for equivalent inputs.

The Builder SHALL NOT:

- Modify `AssignmentPolicy`, `AssignmentPolicyService`, `IAssignmentPolicyRepository`, or any of their existing value objects, evaluation semantics, or public method signatures.
- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, or `Finding`.
- Modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, or Sprint 46's `advanceWorkflowAfterReview()`.
- Introduce Adapter Selection, Adapter routing, capability scoring, or fallback logic.
- Introduce automatic Assignment Policy binding, inference, or lookup by Workflow Step - the Assignment Policy reference SHALL be supplied explicitly by the caller.
- Introduce Multi-Agent Orchestration, Task lifecycle transition, session recovery/checkpointing, or concurrent session coordination.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- Execution and Advancement remain separate operations; this Sprint SHALL NOT fold Assignment Policy evaluation into any advanceWorkflow* method.
- When no Assignment Policy reference is supplied, `executeCurrentWorkflowStep` SHALL behave identically to Sprint 47's certified implementation; this is a regression-safety requirement, not an option.
- No Kernel Canon change; no RFC-0004 change beyond what `NEXUS-RAT-2026-07-15-005` already authorized; no RFC-0006 change.

## Related Sprint(s)

- Sprint 44 — Assignment Policy Foundation (the certified, unmodified domain model this Sprint consumes).
- Sprint 47 — Workflow Chain Execution (the certified dispatch pipeline this Sprint extends with an optional gate).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner ratifies Sprint 48 — Assignment Policy Integration, authorizing the Builder to extend `EngineeringSessionService.executeCurrentWorkflowStep` with an optional Assignment Policy Evaluation gate per RFC-0004 v1.7, consuming the existing, unmodified Sprint 44 AssignmentPolicyService and the existing, unmodified Sprint 47 execution pipeline. The Builder SHALL NOT modify AssignmentPolicy, AssignmentPolicyService, WorkflowChain, WorkflowStep, WorkflowChainService, ExecutionStrategy, AdapterService, AdapterRegistry, ExecutionSession, ExecutionSessionService, ReviewService, Review, Finding, or any existing Advancement method, and SHALL NOT introduce Adapter Selection, automatic Assignment Policy binding/inference, Multi-Agent Orchestration, or any src/hosts or src/adapters change. When no Assignment Policy reference is supplied, behavior SHALL remain byte-for-byte identical to Sprint 47.

## Current Status

Active (Sprint 48 subsequently closed, fully certified — `NEXUS-REV-2026-07-15-005`; `TASK-001` remediation of `NEXUS-REV-2026-07-15-004-F-001` verified; zero open findings).

---

# NEXUS-RAT-2026-07-15-007

## Ratification Identifier

NEXUS-RAT-2026-07-15-007

## Date

2026-07-15

## Subject

Session Recovery/Checkpointing — RFC-0004 v1.7 to v1.8 amendment adding a new "Session Recovery/Checkpointing" section defining a Checkpoint (a named, immutable, point-in-time capture of an Engineering Session's runtime state) and Recovery (reconstituting an Engineering Session's runtime state from a Checkpoint).

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal presented after Sprint 48's closure, evaluating Milestone 8's three remaining candidate directions (Multi-Agent Engineering Orchestration, Session Recovery/Checkpointing, Concurrent Session/Workflow Coordination) named by RFC-0004 v1.6 line 437's "future compatibility" reservation and carried forward, unauthorized, through Sprints 44-48. The Sprint Owner selected Session Recovery/Checkpointing.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.7 to Version 1.8, adding a new "Session Recovery/Checkpointing" section.

Engineering Session already owns runtime progression, workflow state, workflow execution history, the session timeline, and session diagnostics (v1.2/v1.3, unmodified), and already exposes deterministic snapshot/reconstitution (`toSnapshot()`/`fromSnapshot()`, Sprint 39, unmodified) used for repository persistence. This amendment formalizes an explicit, Kernel-owned Checkpoint capability — capturing that existing snapshot at a caller-determined point as a named, retrievable record distinct from ordinary repository persistence — and a Recovery operation that reconstitutes an Engineering Session from a given Checkpoint via the existing, unmodified `fromSnapshot()`.

Recovery SHALL reconstruct an Engineering Session that is semantically equivalent to the captured Checkpoint, preserving all RFC-defined state, workflow progression, workflow execution history, timeline, diagnostics, and architectural invariants; implementation-specific object identity, memory layout, or serialization format are not part of this contract (Sprint Owner wording refinement, adopted in place of a byte-for-byte equivalence formulation, to preserve implementation flexibility).

Checkpoint creation and Recovery SHALL remain deterministic and SHALL NOT redefine Engineering Session's existing snapshot/reconstitution semantics, workflow state, or timeline.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, snapshot, reconstitution | `EngineeringSession` (Sprints 39/40, unmodified) |
| Capturing a named Checkpoint from existing Engineering Session snapshot state | RFC-0004 "Session Recovery/Checkpointing" (this amendment) |
| Reconstituting an Engineering Session from a Checkpoint via existing `fromSnapshot()` | RFC-0004 "Session Recovery/Checkpointing" (this amendment) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation | Unmodified (Sprints 43/45/46/47/48) |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.7 to 1.8; Amendment History entry; new "Session Recovery/Checkpointing" section.
- Proceed to draft a Sprint 49 scope ratification authorizing implementation of Session Recovery/Checkpointing, consuming this amendment.

`nexus-plan` SHALL NOT:

- Modify Engineering Session's existing snapshot/reconstitution semantics, Workflow Chain, Workflow Advancement, Workflow Chain Execution, Assignment Policy, Execution Session, or any other RFC or the Kernel Canon.
- Introduce Concurrent Session Coordination or Multi-Agent Engineering Orchestration, both of which remain separately unauthorized.
- Treat this ratification as authorizing implementation; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No modification to Engineering Session's existing snapshot/reconstitution contract. No Concurrent Session Coordination or Multi-Agent Orchestration is introduced or implied.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (the certified, unmodified snapshot/reconstitution contract this amendment's Checkpoint/Recovery capability reuses).
- Sprint 40 — Execution Session Foundation (referenced; unaffected).
- Future Session Recovery/Checkpointing implementation Sprint (Sprint 49; not yet implemented; will consume this amendment).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Session Recovery/Checkpointing — capturing a named, immutable Checkpoint of an Engineering Session's existing runtime snapshot, and Recovery reconstituting an Engineering Session from that Checkpoint via the existing, unmodified `fromSnapshot()` — SHALL be defined by RFC-0004 as a new section. RFC-0004 SHALL be amended to Version 1.8. Recovery SHALL reconstruct a semantically equivalent Engineering Session, preserving all RFC-defined state, workflow progression, workflow execution history, timeline, diagnostics, and architectural invariants; implementation-specific object identity, memory layout, or serialization format are not part of this contract. Engineering Session's existing snapshot/reconstitution semantics, workflow state, timeline, and diagnostics ownership are otherwise unmodified. Concurrent Session Coordination and Multi-Agent Orchestration remain unauthorized and are not introduced by this amendment. This ratification authorizes the RFC-0004 amendment only; implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-008

## Ratification Identifier

NEXUS-RAT-2026-07-15-008

## Date

2026-07-15

## Subject

Sprint 49 Scope Ratification — Session Recovery/Checkpointing Foundation. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-007` amended RFC-0004 to v1.8, authorizing implementation of Session Recovery/Checkpointing.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 49 — Session Recovery/Checkpointing Foundation as Milestone 8's next Sprint, implementing RFC-0004 v1.8's Session Recovery/Checkpointing section only.

**Objective (binding):** Add `EngineeringSessionService.createCheckpoint()`, capturing an Engineering Session's existing `toSnapshot()` state as a named, immutable, timestamped `EngineeringSessionCheckpoint` persisted through a new `IEngineeringSessionCheckpointRepository`, and `EngineeringSessionService.recoverFromCheckpoint()`, reconstituting an `EngineeringSession` from a stored Checkpoint via the existing, unmodified `fromSnapshot()`.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, snapshot, reconstitution | `EngineeringSession` (Sprints 39/40, unmodified) |
| `EngineeringSessionCheckpoint` value object, Checkpoint identity, capture timestamp | `EngineeringSessionCheckpoint` (this Sprint, new) |
| Checkpoint capture orchestration | `EngineeringSessionService.createCheckpoint` (this Sprint, new) |
| Checkpoint persistence | `IEngineeringSessionCheckpointRepository` / in-memory implementation (this Sprint, new) |
| Recovery orchestration via existing `fromSnapshot()` | `EngineeringSessionService.recoverFromCheckpoint` (this Sprint, new) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation | Unmodified (Sprints 43/45/46/47/48) |

## Ownership Model (ratified)

Identical to `NEXUS-RAT-2026-07-15-007`'s Ownership Model table; this ratification authorizes implementation against it.

## Authorized Scope

The Builder MAY:

- Add `EngineeringSessionCheckpoint`, an immutable value object wrapping an Engineering Session's existing `EngineeringSessionSnapshot`, a `EngineeringSessionCheckpointId`, and a capture timestamp.
- Add `EngineeringSessionService.createCheckpoint()`, calling the existing, unmodified `EngineeringSession.toSnapshot()` and persisting the resulting Checkpoint.
- Add `IEngineeringSessionCheckpointRepository` and an in-memory implementation, mirroring existing Kernel repository patterns.
- Add `EngineeringSessionService.recoverFromCheckpoint()`, retrieving a stored Checkpoint and reconstituting an `EngineeringSession` via the existing, unmodified `EngineeringSession.fromSnapshot()`.
- Extend `createKernelServices` composition only as strictly required to construct and register the Checkpoint repository and supply it to `EngineeringSessionService`.
- Add unit/integration tests covering: deterministic Checkpoint capture; Recovery producing a semantically equivalent Engineering Session; the deterministic round-trip property `recoverFromCheckpoint(createCheckpoint(session))` yields a session semantically equivalent to `session` under all RFC-0004 invariants; not-found handling; repository behavior; Kernel composition continuity.

The Builder SHALL NOT:

- Modify `EngineeringSession`'s existing `toSnapshot()`, `fromSnapshot()`, snapshot structure, workflow state, timeline, or diagnostics.
- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Introduce Concurrent Session Coordination, Multi-Agent Engineering Orchestration, automatic or background checkpointing, Checkpoint retention/pruning policy, or cross-session Checkpoint sharing.
- Introduce a duplicate snapshot or reconstruction model; Checkpoint capture and Recovery SHALL reuse `toSnapshot()`/`fromSnapshot()` exactly as they exist.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- Checkpoint capture and Recovery are separate operations from Workflow Advancement and Workflow Chain Execution; this Sprint SHALL NOT fold either into any existing `advanceWorkflow*` or `executeCurrentWorkflowStep` method.
- Recovery SHALL satisfy semantic equivalence, not byte-for-byte identity, per `NEXUS-RAT-2026-07-15-007`'s wording refinement; this requirement SHALL be verified through automated tests, including the deterministic round-trip property.
- No Kernel Canon change; no RFC-0004 change beyond what `NEXUS-RAT-2026-07-15-007` already authorized; no RFC-0006 change.
- This ratification additionally authorizes `nexus-plan` to correct `IMPLEMENTATION_MANIFEST.md`'s stale Sprint 48 status line (previously "Implemented — Pending Reviewer Validation") to reflect Sprint 48's actual closure per `NEXUS-REV-2026-07-15-005`.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (the certified, unmodified snapshot/reconstitution contract this Sprint consumes).
- Sprint 40 — Execution Session Foundation (referenced; unaffected).
- Sprint 48 — Assignment Policy Integration (most recently closed Sprint; this Sprint's immediate predecessor).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner ratifies Sprint 49 — Session Recovery/Checkpointing Foundation, authorizing the Builder to add `EngineeringSessionCheckpoint`, `EngineeringSessionService.createCheckpoint()`, `IEngineeringSessionCheckpointRepository`, and `EngineeringSessionService.recoverFromCheckpoint()` per RFC-0004 v1.8, reusing the existing, unmodified Sprint 39 `EngineeringSession.toSnapshot()`/`fromSnapshot()` contract without introducing a duplicate snapshot or reconstruction model. The Builder SHALL NOT modify EngineeringSession's existing snapshot/reconstitution semantics, WorkflowChain, WorkflowStep, WorkflowChainService, ExecutionStrategy, AdapterService, AdapterRegistry, ExecutionSession, ExecutionSessionService, ReviewService, Review, Finding, AssignmentPolicy, AssignmentPolicyService, or any existing Advancement/Execution method, and SHALL NOT introduce Concurrent Session Coordination, Multi-Agent Orchestration, automatic checkpointing, Checkpoint retention policy, cross-session Checkpoint sharing, or any src/hosts or src/adapters change. Recovery SHALL satisfy semantic equivalence under all RFC-0004 invariants, verified by a deterministic round-trip test, per this ratification's adopted wording refinement.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-009

## Ratification Identifier

NEXUS-RAT-2026-07-15-009

## Date

2026-07-15

## Subject

RFC-0004 v1.9 Amendment — Concurrent Session Coordination. Defines how multiple Engineering Sessions MAY coexist within the Kernel, remain independently executable, and be observed through provider-neutral Kernel services.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal presented after Sprint 49's closure, evaluating Milestone 8's two remaining candidate directions (Multi-Agent Engineering Orchestration, Concurrent Session Coordination) named by RFC-0004 v1.6 line 438's "future compatibility" reservation and carried forward, unauthorized, through Sprints 44-49. The Sprint Owner selected Concurrent Session Coordination, then refined the planner's initial draft scope to remove single-session concurrency/locking semantics and to state the amendment capability-first rather than API-first.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.8 to Version 1.9, adding a new "Concurrent Session Coordination" section.

Concurrent Session Coordination formalizes concurrent session visibility and coordination: multiple Engineering Sessions MAY coexist within the Kernel, remain independently executable, and be observed through provider-neutral Kernel services. It does not redefine Engineering Session's existing runtime state, snapshot, or Recovery ownership (v1.2/v1.3, Sprint 39, unmodified; v1.8, Sprint 49, unmodified).

The RFC intentionally defines architectural capabilities rather than specific APIs; public service operations exposing concurrent session visibility remain an implementation detail for the corresponding Sprint Implementation Record, per the Sprint Owner's capability-first refinement.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, workflow position, timeline, diagnostics | `EngineeringSession` (Sprints 39/40, unmodified) |
| Checkpoint capture, Recovery | RFC-0004 "Session Recovery/Checkpointing" (Sprint 49, unmodified) |
| Concurrent visibility of Engineering Sessions; enumeration of Engineering Sessions eligible for further progression; observation of concurrent Engineering Session lifecycle; repository-level cross-session isolation guarantee | RFC-0004 "Concurrent Session Coordination" (this amendment) |
| Single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, Multi-Agent Engineering Orchestration | Unauthorized; reserved for future Sprint Owner scope ratification |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.8 to 1.9; Amendment History entry; new "Concurrent Session Coordination" section.
- Proceed to draft a Sprint 50 scope ratification authorizing implementation of Concurrent Session Coordination, consuming this amendment.

`nexus-plan` SHALL NOT:

- Modify Engineering Session's existing runtime state, snapshot/reconstitution semantics, Workflow Chain, Workflow Advancement, Workflow Chain Execution, Assignment Policy, Execution Session, Session Recovery/Checkpointing, or any other RFC or the Kernel Canon.
- Introduce single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, or Multi-Agent Engineering Orchestration, all of which remain separately unauthorized.
- Treat this ratification as authorizing implementation; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No modification to Engineering Session's existing runtime, snapshot/reconstitution, or Session Recovery/Checkpointing contracts. No single-session locking, distributed coordination, or Multi-Agent Orchestration is introduced or implied.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (referenced; unaffected).
- Sprint 49 — Session Recovery/Checkpointing Foundation (most recently closed Sprint; referenced; unaffected).
- Future Concurrent Session Coordination implementation Sprint (Sprint 50; not yet implemented; will consume this amendment).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Concurrent Session Coordination — formalizing how multiple Engineering Sessions MAY coexist within the Kernel, remain independently executable, and be observed through provider-neutral Kernel services, including concurrent visibility, eligible-for-progression enumeration, concurrent lifecycle observation, and a repository-level cross-session isolation guarantee — SHALL be defined by RFC-0004 as a new section. RFC-0004 SHALL be amended to Version 1.9. This amendment SHALL NOT redefine Engineering Session's existing runtime state, snapshot/reconstitution, or Session Recovery/Checkpointing ownership, and SHALL NOT introduce single-session mutation ordering, optimistic concurrency, locking semantics, distributed coordination, or Multi-Agent Engineering Orchestration, all of which remain separately unauthorized. The RFC defines architectural capabilities rather than specific APIs; public service operations remain an implementation detail for the Sprint Implementation Record. This ratification authorizes the RFC-0004 amendment only; implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-010

## Ratification Identifier

NEXUS-RAT-2026-07-15-010

## Date

2026-07-15

## Subject

Sprint 50 Scope Ratification — Concurrent Session Coordination. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-009` amended RFC-0004 to v1.9, authorizing implementation of Concurrent Session Coordination.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 50 — Concurrent Session Coordination as Milestone 8's next Sprint, implementing RFC-0004 v1.9's Concurrent Session Coordination section only.

**Objective (binding):** Introduce the minimum Kernel capability required to expose multiple concurrent Engineering Sessions while preserving complete isolation between them, reusing the existing `EngineeringSessionRepository` and `EngineeringSessionService`.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, workflow position, timeline, diagnostics | `EngineeringSession` (Sprints 39/40, unmodified) |
| Checkpoint capture, Recovery | `EngineeringSessionService.createCheckpoint`/`recoverFromCheckpoint` (Sprint 49, unmodified) |
| Concurrent visibility, active-session enumeration, cross-session isolation guarantee | `EngineeringSessionService` (this Sprint, new operation(s) only) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation | Unmodified (Sprints 43/45/46/47/48) |

## Ownership Model (ratified)

Identical to `NEXUS-RAT-2026-07-15-009`'s Ownership Model table; this ratification authorizes implementation against it.

## Authorized Scope

The Builder MAY:

- Add one new `EngineeringSessionService` operation exposing active/eligible-for-progression Engineering Session discovery (for example, an active-session query), reusing the existing `IEngineeringSessionRepository`/`enumerate()` without introducing a new aggregate or a new repository.
- Add tests demonstrating: multiple Engineering Sessions may exist concurrently; Engineering Sessions remain fully isolated; operations against one Engineering Session never mutate or observe another Engineering Session's runtime state; Engineering Session visibility is deterministic.
- Extend `createKernelServices` composition only as strictly required, if at all, to support the new operation (no new collaborator is anticipated; the existing repository is reused).

The Builder SHALL NOT:

- Modify `EngineeringSession`'s existing runtime state, snapshot/reconstitution semantics, workflow state, timeline, or diagnostics.
- Modify `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, or `recoverFromCheckpoint()` (Sprint 49).
- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Introduce a new `EngineeringSession`-family aggregate or repository; the new operation SHALL be a thin, reused-repository query.
- Introduce single-session mutation ordering, optimistic concurrency, locking primitives, distributed/durable coordination, orchestration, runtime scheduling, or Multi-Agent Engineering Orchestration, in any form, including as an unused/stubbed reference.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- No new aggregate. No new repository. No locking primitive. No orchestration. No runtime scheduling.
- Cross-session isolation is a repository-level guarantee to be demonstrated by test, not a new enforcement mechanism; the existing per-ID `IEngineeringSessionRepository` already isolates Engineering Sessions structurally.
- No Kernel Canon change; no RFC-0004 change beyond what `NEXUS-RAT-2026-07-15-009` already authorized; no RFC-0006 change.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (referenced; unaffected).
- Sprint 49 — Session Recovery/Checkpointing Foundation (most recently closed Sprint; this Sprint's immediate predecessor).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner ratifies Sprint 50 — Concurrent Session Coordination, authorizing the Builder to add one new thin `EngineeringSessionService` operation exposing active/eligible-for-progression Engineering Session discovery, reusing the existing, unmodified `IEngineeringSessionRepository` without introducing a new aggregate, repository, locking primitive, orchestration mechanism, or runtime scheduler. The Builder SHALL NOT modify EngineeringSession's existing runtime/snapshot/reconstitution semantics, EngineeringSessionCheckpoint, WorkflowChain, WorkflowStep, WorkflowChainService, ExecutionStrategy, AdapterService, AdapterRegistry, ExecutionSession, ExecutionSessionService, ReviewService, Review, Finding, AssignmentPolicy, AssignmentPolicyService, or any existing Advancement/Execution/Recovery method, and SHALL NOT introduce single-session concurrency control, distributed coordination, Multi-Agent Orchestration, or any src/hosts or src/adapters change. Cross-session isolation SHALL be verified by automated test, not by a new enforcement mechanism.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-011

## Ratification Identifier

NEXUS-RAT-2026-07-15-011

## Date

2026-07-15

## Subject

RFC-0004 v1.10 Amendment — Multi-Agent Engineering Orchestration Foundation. Defines the structural relationships (Mission Engineering Group, Engineering Session Handoff) through which multiple independent Engineering Sessions MAY participate in a single Mission while preserving complete session independence.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal presented after Sprint 50's closure. Sprint 50's Final Disposition recorded Multi-Agent Engineering Orchestration as Milestone 8's sole remaining candidate direction, requiring its own future Sprint Owner scope ratification. The planner found no existing normative definition of Multi-Agent Engineering Orchestration anywhere in RFC-0004, the Kernel Canon, or `knowledge/reference/`, and presented the Sprint Owner with candidate foundational framings (Mission-scoped session grouping; cross-role handoff; cross-session Workflow Chain distribution). The Sprint Owner selected a combined scope — Mission Engineering Grouping and cross-role Handoff as two complementary aspects of one architectural concern — to serve as Milestone 8's concluding Sprint, and explicitly rejected Workflow Chain distribution as out of scope.

## Governance Decision

The Sprint Owner ratifies an amendment to `knowledge/specifications/rfc-0004-execution-model.md`, incrementing it from Version 1.9 to Version 1.10, adding a new "Multi-Agent Engineering Orchestration Foundation" section.

Multi-Agent Engineering Orchestration Foundation formalizes two structural relationships: a **Mission Engineering Group** (the deterministic association of a Mission with the Engineering Sessions participating in it, and their enumeration) and an **Engineering Session Handoff** (an explicit, immutable record that engineering responsibility for a Mission passed from one Engineering Session/Execution Role to another, with a deterministic Handoff lifecycle). This amendment defines orchestration structure only — it does not introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, or automatic Adapter Selection.

The RFC intentionally defines architectural capabilities rather than specific APIs; public service operations exposing Mission Engineering Group and Handoff behavior remain an implementation detail for the corresponding Sprint Implementation Record.

## Ownership Model (ratified)

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, workflow position, timeline, diagnostics | `EngineeringSession` (Sprints 39/40, unmodified) |
| Checkpoint capture, Recovery | RFC-0004 "Session Recovery/Checkpointing" (Sprint 49, unmodified) |
| Concurrent visibility, active-session enumeration, cross-session isolation guarantee | RFC-0004 "Concurrent Session Coordination" (Sprint 50, unmodified) |
| Mission ↔ Engineering Session association; Mission Engineering Group enumeration; Engineering Session Handoff record and lifecycle; orchestration visibility and diagnostics | RFC-0004 "Multi-Agent Engineering Orchestration Foundation" (this amendment) |
| Autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, automatic Adapter Selection, Governance Engine | Unauthorized; reserved for future Sprint Owner scope ratification |

## Authorized Scope

`nexus-plan` MAY:

- Apply the amendment text to `knowledge/specifications/rfc-0004-execution-model.md`: Version 1.9 to 1.10; Amendment History entry; new "Multi-Agent Engineering Orchestration Foundation" section.
- Proceed to draft a Sprint 51 scope ratification authorizing implementation of Multi-Agent Engineering Orchestration Foundation, consuming this amendment.

`nexus-plan` SHALL NOT:

- Modify Engineering Session's existing runtime state, snapshot/reconstitution semantics, Session Recovery/Checkpointing, Concurrent Session Coordination, Workflow Chain, Workflow Advancement, Workflow Chain Execution, Assignment Policy, Execution Strategy, Execution Session, or any other RFC or the Kernel Canon.
- Introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, or automatic Adapter Selection, all of which remain separately unauthorized.
- Treat this ratification as authorizing implementation; implementation remains separately deferred pending its own Sprint scope ratification.

## Scope Restrictions

- This is a documentation/specification change only.
- No Kernel Canon change. No modification to Engineering Session's existing runtime/snapshot/reconstitution contract, Session Recovery/Checkpointing, or Concurrent Session Coordination. No autonomous orchestration, messaging, scheduling, or distributed coordination is introduced or implied.
- No source code or test change is authorized by this ratification alone.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (referenced; unaffected).
- Sprint 49 — Session Recovery/Checkpointing Foundation (referenced; unaffected).
- Sprint 50 — Concurrent Session Coordination (most recently closed Sprint; referenced; unaffected).
- Future Multi-Agent Engineering Orchestration Foundation implementation Sprint (Sprint 51; not yet implemented; will consume this amendment).

## Related Review(s)

- None.

## Full Ratification Text

> The Sprint Owner ratifies that Multi-Agent Engineering Orchestration Foundation — formalizing the structural relationships (Mission Engineering Group; Engineering Session Handoff) through which multiple independent Engineering Sessions MAY participate in a single Mission while preserving complete session independence — SHALL be defined by RFC-0004 as a new section. RFC-0004 SHALL be amended to Version 1.10. This amendment SHALL NOT redefine Engineering Session's existing runtime state, snapshot/reconstitution, Session Recovery/Checkpointing, or Concurrent Session Coordination ownership, and SHALL NOT introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, or automatic Adapter Selection, all of which remain separately unauthorized. The RFC defines architectural capabilities rather than specific APIs; public service operations remain an implementation detail for the Sprint Implementation Record. This ratification authorizes the RFC-0004 amendment only; implementation remains subject to its own future Sprint Owner scope ratification.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-012

## Ratification Identifier

NEXUS-RAT-2026-07-15-012

## Date

2026-07-15

## Subject

Sprint 51 Scope Ratification — Multi-Agent Engineering Orchestration Foundation. Resolves the `nexus-plan` Sprint Proposal presented after `NEXUS-RAT-2026-07-15-011` amended RFC-0004 to v1.10, authorizing implementation of Multi-Agent Engineering Orchestration Foundation and designating it as Milestone 8's concluding Sprint.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 51 — Multi-Agent Engineering Orchestration Foundation as Milestone 8's next and concluding Sprint, implementing RFC-0004 v1.10's Multi-Agent Engineering Orchestration Foundation section only.

**Objective (binding):** Introduce the minimum Kernel capabilities required to model multiple Engineering Sessions collaborating toward a common Mission through deterministic orchestration relationships — Mission Engineering Grouping and explicit cross-role Handoff — introducing orchestration structure only, no autonomous orchestration behavior.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Engineering Session runtime state, workflow position, timeline, diagnostics | `EngineeringSession` (Sprints 39/40, unmodified) |
| Checkpoint capture, Recovery | `EngineeringSessionService.createCheckpoint`/`recoverFromCheckpoint` (Sprint 49, unmodified) |
| Concurrent visibility, active-session enumeration, cross-session isolation guarantee | `EngineeringSessionService.enumerateActiveEngineeringSessions` (Sprint 50, unmodified) |
| Mission ↔ Engineering Session association, Mission Engineering Group enumeration, Engineering Session Handoff record and lifecycle, orchestration visibility and diagnostics | New Kernel concepts (this Sprint) |
| Workflow position, Workflow Advancement, Workflow Chain Execution, Assignment Policy Evaluation, Execution Strategy | Unmodified (Sprints 41/43/45/46/47/48) |

## Ownership Model (ratified)

Identical to `NEXUS-RAT-2026-07-15-011`'s Ownership Model; this ratification authorizes implementation against it.

## Authorized Scope

The Builder MAY:

- Introduce a `MissionEngineeringGroup` (or equivalently named canonical Kernel concept) recording the deterministic association between a Mission and the Engineering Sessions participating in it, together with a repository contract and in-memory implementation mirroring existing Kernel repository patterns.
- Add a Kernel service operation enumerating a Mission's participating Engineering Sessions (Mission Engineering Group enumeration), reusing existing Mission and Engineering Session identity references without accessing either aggregate's internals beyond published contracts.
- Introduce an `EngineeringSessionHandoff` (or equivalently named canonical Kernel concept): an explicit, immutable record that engineering responsibility for a Mission passed from one existing, unmodified Engineering Session to another, together with a deterministic Handoff lifecycle state, a repository contract, and an in-memory implementation.
- Add Kernel service operation(s) for recording a Handoff and enumerating Handoffs for orchestration visibility, and deterministic diagnostics for invalid or unauthorized Handoff attempts (for example: unknown Engineering Session reference, Handoff between Engineering Sessions not both members of the same Mission Engineering Group, duplicate Handoff).
- Extend `createKernelServices` composition only as strictly required to construct and register the new repositories/services.
- Add unit and integration tests covering: multiple Engineering Sessions participating in one Mission Engineering Group; deterministic enumeration; recording a Handoff between two participating Engineering Sessions; Handoff lifecycle determinism; rejection diagnostics; and that recording a Mission Engineering Group association, enumerating it, or recording a Handoff never mutates or is observable through any participating Engineering Session's own runtime state.

The Builder SHALL NOT:

- Modify `EngineeringSession`'s existing runtime state, snapshot/reconstitution semantics, workflow state, timeline, or diagnostics.
- Modify `EngineeringSessionCheckpoint`, `IEngineeringSessionCheckpointRepository`, `createCheckpoint()`, or `recoverFromCheckpoint()` (Sprint 49).
- Modify `EngineeringSessionService.enumerateActiveEngineeringSessions()` or Concurrent Session Coordination's isolation guarantee (Sprint 50).
- Modify `WorkflowChain`, `WorkflowStep`, `WorkflowChainService`, `ExecutionStrategy`, `ExecutionStrategyService`, `AdapterService`, `AdapterRegistry`, `ExecutionSession`, `ExecutionSessionService`, `ReviewService`, `Review`, `Finding`, `AssignmentPolicy`, or `AssignmentPolicyService`.
- Modify Sprint 43's `advanceWorkflow()`, Sprint 45's `advanceWorkflowOnTrigger()`, Sprint 46's `advanceWorkflowAfterReview()`, or Sprint 47's/48's `executeCurrentWorkflowStep()`.
- Introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling algorithms, load balancing, parallel execution semantics, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, or automatic Adapter Selection, in any form, including as an unused/stubbed reference.
- Have a Handoff or Mission Engineering Group operation execute a Workflow Step, advance a workflow position, evaluate an Assignment Policy, or dispatch an Adapter.
- Modify any `src/hosts` or `src/adapters` file.

## Scope Restrictions

- No modification to any previously certified aggregate, service, or repository beyond the additive `createKernelServices` wiring strictly required for the new repositories/services.
- Mission Engineering Group and Engineering Session Handoff are structural/observational records only; no orchestration behavior, scheduling, or automatic triggering is authorized.
- No Kernel Canon change; no RFC-0004 change beyond what `NEXUS-RAT-2026-07-15-011` already authorized; no other RFC change.
- Upon this Sprint's certification (Approved, zero open Critical/Major/Minor findings), Milestone 8 — Engineering Orchestration SHALL be considered Complete.

## Related Sprint(s)

- Sprint 39 — Engineering Sessions Foundation (referenced; unaffected).
- Sprint 49 — Session Recovery/Checkpointing Foundation (referenced; unaffected).
- Sprint 50 — Concurrent Session Coordination (most recently closed Sprint; this Sprint's immediate predecessor).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner ratifies Sprint 51 — Multi-Agent Engineering Orchestration Foundation, authorizing the Builder to introduce a Mission Engineering Group concept (deterministic Mission-to-Engineering-Session association and enumeration) and an Engineering Session Handoff concept (an explicit, immutable record that engineering responsibility passed between two existing, unmodified Engineering Sessions, with a deterministic lifecycle), each with its own repository contract and in-memory implementation, reusing existing Mission and Engineering Session identity references without modifying either aggregate. The Builder SHALL NOT modify EngineeringSession's existing runtime/snapshot/reconstitution semantics, EngineeringSessionCheckpoint, Concurrent Session Coordination's enumeration operation, WorkflowChain, WorkflowStep, WorkflowChainService, ExecutionStrategy, AdapterService, AdapterRegistry, ExecutionSession, ExecutionSessionService, ReviewService, Review, Finding, AssignmentPolicy, AssignmentPolicyService, or any existing Advancement/Execution/Recovery/Coordination method, and SHALL NOT introduce autonomous planning, dynamic workflow generation, AI negotiation, agent-to-agent messaging, scheduling, load balancing, distributed orchestration, execution synchronization primitives, dynamic Assignment Policy, automatic Adapter Selection, or any src/hosts or src/adapters change. Cross-session isolation SHALL be preserved and verified by automated test. Upon this Sprint's Approval with zero open Critical/Major/Minor findings, Milestone 8 — Engineering Orchestration SHALL be considered Complete.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-014

## Ratification Identifier

NEXUS-RAT-2026-07-15-014

## Date

2026-07-15

## Subject

RFC-0011 — Engineering Governance Model, Final Ratification. Resolves the pre-ratification architectural review requested against `NEXUS-RAT-2026-07-15-013`'s Draft, authorizing RFC-0011 v1.0 as Final and Normative.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan`-produced RFC Ratification Report (section-by-section validation against the Kernel Canon, RFC-0001 through RFC-0010, `IMPLEMENTATION_CONSTITUTION.md`, and `RATIFICATION_LEDGER.md`), reviewed and accepted by the Sprint Owner.

## Governance Decision

**RFC-0011 — Engineering Governance Model is ratified Final, Version 1.0, Authority Normative.**

RFC-0011 exclusively owns: Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, Governance Escalation. RFC-0011 consumes but does not redefine any concept owned by RFC-0001 through RFC-0010. Existing ownership of Mission, Evidence, Shared Reality, Execution, Domain Events, Engineering Assessment, Knowledge, Adapters, Host responsibilities, and Kernel boundaries is unchanged.

**Ratified Governance Decision values (canonical, deterministic, mutually exclusive):** Approved, Rejected, Deferred, Escalation Required. No Governance Decision value SHALL autonomously advance a Mission, modify repository state, publish Knowledge, activate a Sprint, or perform any other downstream transition. Rejected SHALL NOT reopen Review, cancel a Mission, or mutate execution state. Deferred SHALL NOT be interpreted as Approved or Rejected and MAY be re-evaluated once the missing input appears. Escalation Required SHALL fail closed and requires resolution through an authorized Sprint Owner decision or a new/amended Ratification. Governance SHALL NOT choose an outcome by unrestricted model judgment.

**Ratified Authority Hierarchy:** Repository Policies remain subordinate to superior repository law. The applicable architectural hierarchy is: (1) Nexus Kernel Canon, (2) RFC Suite, (3) Implementation Constitution, (4) Technology Standards, (5) Conventions, (6) Reference Documents, (7) Implementation. Governance-artifact precedence remains separately governed by the Implementation Constitution and Ratification Ledger. A Ratification inherits the authority of the artifact or governance scope it amends. A Repository Policy SHALL NOT override the Kernel Canon, an RFC, the Implementation Constitution, an applicable Ratification, or another superior repository authority. Any unresolved authority conflict, and any conflicting same-tier Repository Policies absent explicit deterministic precedence, SHALL produce Escalation Required.

**Ratified Immutability and Versioning:** Repository Policies are immutable per version; modification creates a new superseding version; previous versions remain preserved. Every Policy Evaluation and Governance Decision remains permanently attributable to the exact Policy version, Policy Criteria, Evidence, Shared Reality projection, Review Outcome, Findings, Ratifications, and repository state used during evaluation. Historical evaluations and decisions SHALL NOT be rewritten following Policy supersession.

**Ratified Architectural Boundary:** RFC-0011 authorizes deterministic engineering governance evaluation only. It does not authorize autonomous Mission creation, Mission objective modification, autonomous planning, RFC amendment, Ratification creation, architectural approval, policy generation, policy optimization, unrestricted AI deliberation, workflow orchestration, Adapter execution, repository-write automation, Sprint activation, or self-directed engineering. Governance Decisions are recommendations or gates, not self-executing commands. Human Authority remains preserved.

**Ratified Failure-Closed Requirement:** missing Evidence; stale or missing Shared Reality; incomplete or non-terminal Review; unsupported Policy Criteria; conflicting Policies; contradictory Ratifications; missing Policy versions; unresolved repository-state inconsistencies; ambiguous authority; and non-deterministic evaluation requirements SHALL produce Deferred (input merely absent) or Escalation Required (ambiguity, contradiction, conflict, or unsupported interpretation). These conditions SHALL NOT default to Approved or Rejected.

**Ratified Event Model Alignment:** RFC-0011 SHALL reuse the RFC-0005 "Policy Events" category and SHALL NOT introduce a competing event category. Concrete event vocabulary remains an implementation-layer decision requiring separate authorization during implementation planning.

**Deferred Governance Maintenance:** the identified wording tension in `IMPLEMENTATION_CONSTITUTION.md` Sprint Owner Ratifications section (stating ratifications amend implementation governance "without modifying the Kernel Canon or RFC suite," in apparent tension with the repeatedly-ratified practice of amending RFC text, including this RFC's own creation) is acknowledged as a pre-existing governance issue. It does not invalidate RFC-0011 and SHALL be addressed, if at all, through a separate governance-maintenance action. No amendment to RFC-0011 is authorized for that issue.

## Ownership Model (ratified)

Identical to the ownership matrix in `nexus-plan`'s RFC-0011 Ratification Report: RFC-0011 owns Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, Governance Escalation exclusively; all other listed concepts remain owned by their existing RFCs, unmodified.

## Authorized Scope

`nexus-plan` MAY:

- Update RFC-0011's metadata (Status: Final; Version: 1.0; Authority: Normative) and Amendment History.
- Synchronize `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and applicable Milestone 9 documentation to reflect RFC-0011's Final status.
- Proceed to re-evaluate the provisional Milestone 9 Sprint sequence and propose Sprint 52 as the smallest coherent first vertical slice of RFC-0011, for Sprint Owner approval.

`nexus-plan` SHALL NOT:

- Modify RFC-0011's ratified text beyond the metadata/status update authorized above without a further Sprint Owner ratification.
- Modify the Kernel Canon or RFC-0001 through RFC-0010.
- Activate Sprint 52 or any other implementation Sprint without a separate, explicit Sprint Owner approval of the Sprint 52 proposal.
- Treat Milestone 9 as anything other than OPEN with no Current Sprint until Sprint 52 (or another proposal) is approved.

## Scope Restrictions

- This is a documentation/specification ratification only.
- No source code or test change is authorized by this ratification.
- Milestone 9 remains OPEN; no Current Sprint exists as a result of this ratification alone.

## Related Sprint(s)

- No Milestone 9 Sprint exists yet. This ratification is a precondition for the Sprint 52 proposal `nexus-plan` will return next.

## Related Review(s)

- None. This ratification precedes any Milestone 9 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner ratifies RFC-0011 — Engineering Governance Model as Final, Version 1.0, Authority Normative, accepting the `nexus-plan` RFC Ratification Report and confirming that all required pre-ratification amendments (the Blocked-to-Deferred rename, Authority Hierarchy, per-value Decision Semantics, Failure and Conflict Handling table, expanded Boundaries, and RFC-0005 "Policy Events" alignment) are already incorporated into the ratified text. RFC-0011 exclusively owns Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, and Governance Escalation, and does not redefine any concept owned by RFC-0001 through RFC-0010. The canonical Governance Decision values — Approved, Rejected, Deferred, Escalation Required — are ratified as deterministic and mutually exclusive, with no value permitting autonomous Mission advancement, repository-state mutation, Knowledge publication, or Sprint activation. The ratified Authority Hierarchy subordinates Repository Policy to the Kernel Canon, the RFC Suite, the Implementation Constitution, and applicable Ratifications, with unresolved authority conflicts and same-tier Policy conflicts producing Escalation Required. Repository Policies are ratified as immutable per version and versioned by supersession, with full historical attribution preserved. The ratified Architectural Boundary confirms RFC-0011 authorizes deterministic governance evaluation only, excluding autonomous Mission creation, Mission objective modification, RFC amendment, Ratification creation, architectural approval, policy generation/optimization, unrestricted AI deliberation, workflow orchestration, Adapter execution, repository-write automation, and Sprint activation. The ratified Failure-Closed Requirement and Event Model Alignment (reuse of RFC-0005's "Policy Events" category) are confirmed as stated above. The identified `IMPLEMENTATION_CONSTITUTION.md` wording tension concerning Ratification authority over RFC text is acknowledged as a pre-existing issue requiring separate governance maintenance, not an RFC-0011 amendment. The Sprint Owner authorizes `nexus-plan` to update RFC-0011's metadata to Final, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`/Milestone 9 documentation accordingly, and to re-evaluate the provisional Milestone 9 Sprint sequence and return a Sprint 52 proposal for separate Sprint Owner approval. Milestone 9 remains OPEN with no Current Sprint until that proposal is approved.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-015

## Ratification Identifier

NEXUS-RAT-2026-07-15-015

## Date

2026-07-15

## Subject

Sprint 52 Scope Ratification — Governance Policy Model Foundation. Resolves the `nexus-plan` Sprint 52 Proposal presented after `NEXUS-RAT-2026-07-15-014` ratified RFC-0011 v1.0 Final, authorizing implementation of the `RepositoryPolicy` foundation as Milestone 9's opening Sprint. Also approves, in principle, merging the provisional Sprint 53/54 scopes into a future combined Sprint titled "Policy Evaluation and Governance Decision Foundation"; that merge does not activate any Sprint by this ratification.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, approved by the Sprint Owner with refinements supplied directly as binding Sprint scope.

## Governance Decision

The Sprint Owner authorizes Sprint 52 — Governance Policy Model Foundation as Milestone 9's opening Sprint, implementing RFC-0011 v1.0's Repository Policy and Policy Criterion sections only (policy definition, immutability, versioning/supersession, and Ratification attribution). No evaluation, decision production, escalation, event publication, or cross-domain consumption is authorized.

**Objective (binding):** Introduce `RepositoryPolicy` as an immutable, ratification-attributed, versioned Kernel domain concept. Sprint 52 establishes only the policy-definition and version-history foundation required by future deterministic Policy Evaluation.

**RepositoryPolicy Aggregate (binding):** immutable per version; each version contains stable `RepositoryPolicyId`, positive version number, name, description, ordered `PolicyCriterion` collection, Ratification identifier reference, and optional predecessor-version reference. A constructed version is never mutated; changes are represented only by a new superseding version.

**Version Lineage Rules (binding):** an initial version uses version `1`, has no predecessor, contains at least one `PolicyCriterion`, and includes a Ratification identifier reference. A superseding version preserves the same `RepositoryPolicyId`, uses the next sequential version number, references the immediately preceding version, includes the Ratification identifier authorizing that supersession, and produces a new immutable instance without overwriting the previous one. The implementation SHALL reject duplicate versions, skipped version numbers, version regression, supersession of an unknown predecessor, supersession across different `RepositoryPolicyId`s, multiple competing successors for the same current version, and mutation or replacement of an existing version. Policy history SHALL remain linear and queryable; policy branching is not authorized.

**PolicyCriterion Boundary (binding):** declarative policy-definition data only — criterion identifier, description, required-input declarations, and an opaque, immutable condition descriptor. Sprint 52 SHALL NOT define or implement predicates, comparison operators, boolean expression trees, expression parsing, executable callbacks, scripting, model prompts, evaluation functions, pass/fail state, criterion outcomes, or provider-specific condition formats. No part of Sprint 52 may execute or interpret a Policy Criterion. Within a version: criterion identifiers unique, order deterministic and preserved, at least one criterion required, criteria immutable, empty identifiers/descriptions rejected, duplicate identifiers rejected. Criterion order SHALL NOT imply evaluation precedence absent a future RFC amendment.

**Ratification Attribution (binding):** every version includes a Ratification identifier reference. Sprint 52 SHALL validate only the identifier's canonical structural format — it SHALL NOT read `RATIFICATION_LEDGER.md`, validate ledger contents, infer Ratification authority, determine legal authorization, or introduce a Ratification repository/service. The stored identifier is attribution data, not proof of authorization; live Ratification authority validation remains deferred.

**Repository Contract (binding):** `IRepositoryPolicyRepository` supports deterministic registration of an initial version, registration of a superseding version, retrieval by identity and version, retrieval of the current version, enumeration of all current policies, and enumeration of complete version history. Every historical version is preserved; duplicate registration and invalid lineage are rejected. The in-memory implementation is the only authorized implementation this Sprint; no durable persistence is authorized.

**RepositoryPolicyService (binding):** thin application service coordinating initial registration, supersession, retrieval, current-version lookup, enumeration, and version-history enumeration only, delegating invariant enforcement to the domain model and repository contracts. It SHALL NOT contain Policy Evaluation, Governance Decision production, Governance Escalation, authority interpretation, Ratification-Ledger validation, Evidence/Shared Reality/Review access, event publication, workflow orchestration, or repository mutation outside `RepositoryPolicy` persistence.

**Kernel Composition (binding):** `createKernelServices()` may be extended only to compose the Repository Policy repository and `RepositoryPolicyService`. No existing Kernel service contract may be modified beyond the minimum additive composition required. No Host or Adapter change is authorized.

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`); this ratification authorizes implementation of the Repository Policy/Policy Criterion foundation subset only, against it.

## Authorized Scope

The Builder MAY introduce exactly: `RepositoryPolicy`, `RepositoryPolicyId`, `PolicyCriterion`, policy version, policy supersession reference, Ratification attribution reference, `IRepositoryPolicyRepository`, an in-memory repository implementation, `RepositoryPolicyService`, minimal Kernel composition wiring, deterministic diagnostics, and unit tests, exactly as specified in the binding Governance Decision above and in Sprint 52's Sprint Implementation Record.

## Deferred Concepts

Policy Criterion predicate evaluation; Policy Evaluation; Governance Decision (Approved, Rejected, Deferred, Escalation Required); Governance Escalation; decision explanation records; Evidence consumption; Shared Reality consumption; Review Outcome/Finding consumption; Ratification-Ledger content validation; policy authority resolution; policy conflict resolution; policy precedence evaluation; RFC-0005 Policy Events; Domain Event publication; policy activation or enforcement; workflow gates; repository-write automation; Host-facing policy surfaces; durable persistence; `src/hosts` changes; `src/adapters` changes. No placeholder implementation of any deferred concept is authorized.

## Scope Restrictions

- No Domain Event is authorized this Sprint; policy creation and supersession remain event-silent until a dedicated event-publication slice is authorized.
- No `src/hosts` or `src/adapters` change.
- No modification to the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- The provisional Sprint 53/54 merge into a future "Policy Evaluation and Governance Decision Foundation" Sprint is approved in principle only; it does not activate any Sprint and requires its own future scope ratification when formally proposed.

## Related Sprint(s)

- Sprint 5 — Evidence Foundation; Sprint 9 — Review Foundation; Sprint 12 — Knowledge Foundation; Sprint 39 — Engineering Sessions Foundation (existing foundation-sprint patterns Sprint 52 mirrors).
- Sprint 51 — Multi-Agent Engineering Orchestration Foundation (Milestone 8's closing Sprint; immediate predecessor).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner approves Sprint 52 — Governance Policy Model Foundation as Milestone 9's opening Sprint, with the binding Objective, RepositoryPolicy Aggregate, Version Lineage Rules, PolicyCriterion Boundary, Criterion Integrity, Ratification Attribution, Repository Contract, RepositoryPolicyService, and Kernel Composition rules recorded above. The Builder SHALL implement exactly the Authorized Scope and SHALL NOT implement any Deferred Concept, including as a placeholder or stub. No Domain Event, `src/hosts`, or `src/adapters` change is authorized. The Sprint Owner additionally approves, in principle, merging the provisional Sprint 53 and Sprint 54 scopes into a future Sprint titled "Policy Evaluation and Governance Decision Foundation," delivering Policy Evaluation and exactly one Governance Decision as a single complete deterministic capability; the milestone sequence may be renumbered when that Sprint is formally proposed, and no future Sprint is activated by this decision. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 52 as Current under Milestone 9, and to generate Sprint 52's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-013

## Ratification Identifier

NEXUS-RAT-2026-07-15-013

## Date

2026-07-15

## Subject

Milestone Boundary Ratification — Opening Milestone 9 (Engineering Governance Automation). Resolves the `nexus-plan` governance question of what may follow Milestone 8 (Complete, `NEXUS-RAT-2026-07-15-012`).

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal presented after Sprint 51's closure, in which the planner recommended Governance/Policy Engine as the strongest next-capability candidate (repeatedly named as deferred and unauthorized since Milestone 4; explicitly logged in this ledger's `NEXUS-RAT-2026-07-14-016` Ownership Model as "Unauthorized; reserved for future Sprint Owner scope ratification"). The Sprint Owner accepted this direction and issued binding scope instructions directly.

## Governance Decision

**Milestone 9 — Engineering Governance Automation is opened.**

**Objective (binding):** Introduce deterministic, evidence-based governance capabilities that evaluate engineering outcomes, repository policies, review findings, ratifications, and workflow state. Milestone 9 SHALL reduce repetitive Sprint Owner intervention without transferring final engineering authority to the Kernel. The milestone SHALL build upon the completed Engineering Orchestration Foundation established through Milestone 8.

**Architectural Boundary (binding):**

Governance automation SHALL:

- evaluate explicit repository policies;
- consume authoritative Evidence and Shared Reality;
- consume finalized Review Outcomes and structured Findings;
- apply existing Ratifications and repository law;
- produce deterministic governance decisions and escalation requirements;
- preserve complete attribution and explainability.

Governance automation SHALL NOT:

- redefine Mission objectives;
- autonomously create project intent;
- perform unrestricted architectural deliberation;
- replace final human engineering authority;
- introduce persistent cognition or self-directed engineering;
- silently approve ambiguous or unsupported decisions.

Any decision that cannot be resolved deterministically from repository law SHALL be escalated to the Sprint Owner.

## Normative Work Required (authorized by this ratification)

This ratification authorizes `nexus-plan` to:

1. Draft RFC-0011 — Engineering Governance Model, Status: Draft, validated against the Kernel Canon and RFC-0002/0003/0005/0006/0007/0010.
2. Define RFC-0011's exclusive vocabulary ownership (Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, Governance Escalation) and its upstream dependencies.
3. Return RFC-0011 and this milestone's proposed implementation sequence to the Sprint Owner for a separate, follow-up ratification before RFC-0011 becomes Final.

This ratification does NOT authorize:

- RFC-0011 as Final/normative — a separate follow-up ratification is required;
- any implementation Sprint (Sprint 52 or otherwise);
- any source code, test, or `src/hosts`/`src/adapters` change;
- any modification to RFC-0001 through RFC-0010 or the Kernel Canon.

## Provisional Capability Sequence (non-binding, subject to `nexus-plan` dependency validation and re-sequencing)

- Sprint 52 — Governance Policy Model Foundation
- Sprint 53 — Policy Evaluation Foundation
- Sprint 54 — Governance Decision and Escalation
- Sprint 55 — Ratification and Repository-Law Integration
- Sprint 56 — Review-to-Governance Workflow Integration
- Sprint 57 — Governance Automation Validation

## Milestone Completion Condition

Milestone 9 SHALL be complete only when Nexus can deterministically:

- evaluate a finalized engineering outcome against repository policy;
- distinguish approved, rejected, blocked, and escalation-required outcomes;
- explain every decision using attributable Evidence and repository law;
- apply existing ratifications without repeated human interpretation;
- escalate genuine ambiguity rather than inventing authority;
- preserve the Sprint Owner as final engineering authority.

## Related Sprint(s)

- Sprint 51 — Multi-Agent Engineering Orchestration Foundation (Milestone 8's closing Sprint; immediate predecessor).
- No Milestone 9 Sprint exists yet; Sprint 52 is not authorized by this ratification.

## Related Review(s)

- None. This ratification precedes any Milestone 9 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner opens Milestone 9 — Engineering Governance Automation, with the binding Objective and Architectural Boundary recorded above. The Sprint Owner authorizes `nexus-plan` to draft RFC-0011 — Engineering Governance Model as a non-Final Draft, validated against the Kernel Canon and RFC-0002/0003/0005/0006/0007/0010, defining exclusive ownership of Repository Policy, Policy Criterion, Policy Evaluation, Governance Decision, and Governance Escalation, and to return it together with a validated implementation sequence for a separate follow-up Sprint Owner ratification. This ratification does not itself finalize RFC-0011, does not authorize Sprint 52 or any other implementation Sprint, and does not modify RFC-0001 through RFC-0010 or the Kernel Canon. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to open Milestone 9 in an unactivated (no Current Sprint) state.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-016

## Ratification Identifier

NEXUS-RAT-2026-07-15-016

## Date

2026-07-15

## Subject

Sprint 53 Scope Ratification — Policy Evaluation and Governance Decision Foundation. Resolves the `nexus-plan` Sprint 53 Proposal and its revised form after two Sprint Owner review cycles, authorizing implementation of RFC-0011's Policy Evaluation, Governance Decision, and Governance Escalation sections as Milestone 9's second Sprint, formally activating the "Policy Evaluation and Governance Decision Foundation" merge approved in principle by `NEXUS-RAT-2026-07-15-015`.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal, returned to Changes Required for missing deterministic evaluation rules/decision precedence/identity/idempotency/predicate boundaries, revised accordingly, and then approved with two final refinements (Missing Review Resolution; `UnresolvedFindingMatch` polarity) supplied directly as binding Sprint scope by the Sprint Owner.

## Governance Decision

The Sprint Owner authorizes Sprint 53 — Policy Evaluation and Governance Decision Foundation as Milestone 9's second Sprint, implementing RFC-0011 v1.0's Policy Evaluation, Governance Decision, and Governance Escalation sections against exactly one `RepositoryPolicy` version and one `Review`, producing exactly one immutable `GovernanceDecision`. No downstream enforcement, workflow advancement, repository mutation, event publication, multi-policy arbitration, or autonomous authority is authorized.

**Objective (binding):**

```text
RepositoryPolicy Version
        +
      Review
        ↓
  PolicyEvaluation
        ↓
Exactly One GovernanceDecision
```

Canonical Governance Decision values: **Approved, Rejected, Deferred, Escalation Required**.

**RFC Coverage (binding):** Primary — RFC-0011 v1.0 (Policy Evaluation, Governance Decision, Governance Escalation, Failure and Conflict Handling). Referenced — RFC-0006 (finalized Review Outcome/Finding consumption only, unmodified), RFC-0005 (Policy Events remain deferred), RFC-0010, Sprint 52's `RepositoryPolicy` (unmodified).

**Dependencies (binding):** Frozen, read-only consumption of Sprint 52's `RepositoryPolicy`/`PolicyCriterion`/`IRepositoryPolicyRepository` and Sprint 9's `Review`/`Finding`/`IReviewRepository`. Neither slice's approved behavior may be altered.

**Authorized Concepts (binding):** exactly `PolicyEvaluation`, `PolicyEvaluationId`, `PolicyCriterionResult`, `PolicyCriterionResultStatus`, `GovernanceDecision`, `GovernanceDecisionId`, the four canonical Governance Decision values, `GovernanceEscalation`, `IGovernanceDecisionRepository`, an in-memory append-only Governance Decision repository, `GovernanceService`, the two closed predicate representations below, minimal Kernel composition wiring, deterministic diagnostics, unit and integration tests. No additional governance capability is authorized.

**Evaluation Input Boundary (binding):** a Policy Evaluation consumes exactly one requested `RepositoryPolicyId`, one requested Policy version, one Review, its Review Outcome, its Findings, and an explicit evaluation timestamp or injected deterministic clock input. It SHALL NOT consume Evidence, Shared Reality, Knowledge, Mission internals, Execution internals, Host state, Adapter state, Ratification Ledger contents, or multiple Repository Policies. `RepositoryPolicy` and `Review` are immutable, read-only inputs.

**Finalized Review Boundary and Missing Review Resolution (binding — Final Refinement 1):** Criterion evaluation consumes a finalized, terminal Review per RFC-0006. The evaluator SHALL NOT finalize, reopen, revise, replace, or otherwise modify a Review, its Outcome, or its Findings.

- **Existing but non-final or incomplete Review** (has not reached a terminal Review state; lacks a finalized Review Outcome; otherwise incomplete under RFC-0006) → **Deferred**.
- **Missing or unresolvable Review** (does not exist; cannot be resolved by identity; references an invalid/unavailable immutable state; cannot be consumed without inventing or substituting data) → **Escalation Required**, with the `GovernanceEscalation` preserving the requested Review identity, requested immutable Review version/fingerprint/finalized-state reference when supplied, requested `RepositoryPolicy` identity and version, a deterministic reason code, and the required resolution authority.
- The implementation SHALL NOT fabricate a Review, substitute another Review, auto-select the latest Review, infer a Review Outcome, or treat a missing Review as Approved, Rejected, or Deferred.

```text
Review exists but is not final → Deferred
Review cannot be resolved → Escalation Required
```

**Closed Predicate Model (binding):** no general policy-expression language. Exactly two predicate kinds are authorized — no other kind is authorized this Sprint. Unknown predicate kinds or unsupported schema versions produce **Escalation Required** (never ignored, guessed, coerced, or treated as an ordinary violation).

- `ReviewOutcomeMembership` — descriptor contains only predicate kind, schema version, and allowed Review Outcome values. No executable logic.
- `UnresolvedFindingMatch` — descriptor contains only predicate kind, schema version, configured Finding severity values, configured Finding status values, and an explicit `expectedMatch: Present | Absent` polarity field (**Final Refinement 2**). No executable logic.

**`UnresolvedFindingMatch` Polarity (binding — Final Refinement 2):** a Finding match alone SHALL NOT implicitly mean satisfaction or violation. The evaluator determines whether at least one unresolved Finding matches the configured severity/status constraints, then resolves the Criterion result per:

| Actual Match | Expected Match | Criterion Result |
| --- | --- | --- |
| Present | Present | Satisfied |
| Absent | Present | Violated |
| Present | Absent | Violated |
| Absent | Absent | Satisfied |

Unavailable/incomplete required Finding data → **Undetermined**. An invalid `expectedMatch` value, unsupported schema version, contradictory configuration, or malformed structure → **Unsupported**, which produces **Escalation Required** through the ratified precedence. Polarity SHALL NOT be inferred from Criterion descriptions, identifiers, prose, severity values, Finding statuses, or Builder assumption — no other polarity model or generic expression mechanism is authorized.

**Prohibited Predicate Capabilities (binding):** arbitrary expression trees, nested logical expressions, generic boolean composition, scripting, callbacks, dynamically registered predicates/operators, free-text interpretation, regular-expression policy execution, reflection-based evaluation, provider-specific condition formats, model prompts, AI interpretation, unrestricted model judgment, executable user-defined conditions.

**PolicyCriterion Compatibility (binding):** Sprint 52's `PolicyCriterion.conditionDescriptor` remains opaque, immutable data. Sprint 53 interprets only descriptors conforming exactly to the two closed, versioned schemas above; preserves the original descriptor unchanged; validates predicate kind, schema version, and required fields; deterministically rejects malformed descriptors; never rewrites or mutates Sprint 52's `RepositoryPolicy`/`PolicyCriterion` objects; never broadens the descriptor into a generic expression language. No generic evaluator framework is authorized.

**PolicyCriterionResult Model (binding):** each Policy Criterion produces exactly one immutable `PolicyCriterionResult` referencing Criterion identity, predicate kind, predicate schema version, result status, relevant Review Outcome/Finding references, and a deterministic explanation code. Generated prose is never authoritative decision reasoning. Canonical statuses: **Satisfied** (deterministically evaluated and satisfied); **Violated** (deterministically evaluated and violated); **Undetermined** (a required authoritative Review input is absent, incomplete, or non-final); **Unsupported** (predicate kind/schema version unsupported, descriptor malformed/contradictory, or deterministic interpretation impossible).

**Governance Decision Precedence (binding):** exactly one `GovernanceDecision` is derived via strict precedence, unaffected by evaluation order: (1) **Escalation Required** — any Criterion `Unsupported`, OR unknown Policy identity/version, missing/unresolvable Review, invalid version lineage, unsupported predicate kind/schema version, malformed/contradictory Criterion data, conflicting evaluation inputs, or deterministic interpretation impossible; takes precedence over every lower result, never resolved by guesswork/fallback/model judgment. (2) **Deferred** — no escalation condition, but the Review exists and is non-final/incomplete, required Review data is absent, or at least one Criterion is `Undetermined`; takes precedence over Rejected/Approved; never interpreted as approval or rejection. (3) **Rejected** — no Criterion Unsupported or Undetermined, and at least one Criterion Violated; a Violated Criterion never yields Rejected when a higher-precedence result exists. (4) **Approved** — every Criterion Satisfied; none Violated, Undetermined, or Unsupported; never a default.

**Mixed-Result Decision Table (binding, normative):**

| Policy Criterion Results | Governance Decision |
| --- | --- |
| Satisfied + Satisfied | Approved |
| Satisfied + Violated | Rejected |
| Violated + Violated | Rejected |
| Satisfied + Undetermined | Deferred |
| Violated + Undetermined | Deferred |
| All Undetermined | Deferred |
| Satisfied + Unsupported | Escalation Required |
| Violated + Unsupported | Escalation Required |
| Undetermined + Unsupported | Escalation Required |
| Any Unsupported result | Escalation Required |

Every Criterion is evaluated unless evaluation cannot begin because the requested `RepositoryPolicy` or `Review` cannot be resolved. Criterion ordering never alters decision precedence.

**Deterministic Time (binding):** the domain evaluator never reads the system clock directly; the evaluation timestamp is supplied via an explicit evaluation input or an injected deterministic clock — attribution metadata only, never influencing the Governance Decision value. Identical inputs (Policy identity/version/Criteria, Review identity/revision-or-fingerprint/Outcome/Findings, predicate schema versions, evaluation contract version, evaluation timestamp) SHALL produce structurally equivalent `PolicyEvaluation`/`GovernanceDecision`.

**Deterministic Identity and Evaluation Key (binding):** a deterministic evaluation key is derived from `RepositoryPolicy` identity, Policy version, Review identity, immutable Review revision/finalized-state version/deterministic canonical fingerprint, and evaluator contract version, uniquely representing one immutable evaluation input set. Random identity generation inside evaluation semantics is prohibited unless supplied through an injected deterministic identity source. Identifiers never change the semantic evaluation outcome.

**Review State Attribution (binding):** Sprint 53 SHALL NOT invent a new RFC-0006 Review revision concept. Governance evaluation references the strongest immutable Review-state identifier already available from the approved Review implementation (an existing Review revision, immutable finalized-state version, existing immutable Review fingerprint, or a deterministic canonical fingerprint derived from the consumed finalized Review state). Any derived fingerprint SHALL be deterministic, use only immutable Review data, be documented, not modify the Review aggregate, and not redefine RFC-0006 ownership. A changed finalized Review state constitutes a new evaluation input set.

**Evaluation Idempotency (binding):** repeated evaluation of the same immutable input set SHALL NOT produce conflicting decisions. `IGovernanceDecisionRepository` enforces exactly one behavior — return the existing equivalent `GovernanceDecision`, or reject duplicate registration with a deterministic duplicate diagnostic — and rejects contradictory decisions for the same evaluation key, replacement, mutation, and duplicate registration with non-equivalent content. A changed Policy version or changed Review revision/fingerprint constitutes a new evaluation input set.

**PolicyEvaluation Model (binding):** immutable; contains `PolicyEvaluation` identity, `RepositoryPolicy` identity and version, Review identity and immutable revision/finalized-state/fingerprint reference, ordered `PolicyCriterionResult` collection, evaluation contract version, deterministic evaluation key, explicit evaluation timestamp, and resulting `GovernanceDecision` identity. `PolicyCriterionResult` order follows `PolicyCriterion` order from `RepositoryPolicy` for attribution/explainability/deterministic presentation only — never implying evaluation precedence, decision precedence, or short-circuiting.

**GovernanceDecision Model (binding):** immutable and attributable; contains `GovernanceDecision` identity, exactly one canonical value, `RepositoryPolicy` identity and version, Review identity and immutable revision/finalized-state/fingerprint reference, `PolicyEvaluation` identity, deterministic evaluation key, ordered `PolicyCriterionResult`s or immutable references, evaluation timestamp, deterministic explanation codes, and an optional `GovernanceEscalation` reference. A recorded fact, not a command — SHALL NOT mutate Mission, Mission Plan, Task, Review, Findings, Knowledge, Evidence, Shared Reality, or Execution state; advance a Workflow; activate a Sprint; modify governance documents; create a Ratification; execute an Adapter; invoke a model; or autonomously approve architecture.

**GovernanceEscalation Model (binding):** exists only when the Decision is Escalation Required; records escalation identity, deterministic reason code, affected `RepositoryPolicy` identity/version, affected Review identity, requested Review revision/fingerprint when supplied, affected Policy Criterion identities, unsupported/malformed/contradictory/conflicting/missing input references, and required authority category for resolution. SHALL NOT resolve the ambiguity, choose another Decision, invoke a model, create a Ratification, modify `RepositoryPolicy`/`Review`, mutate repository state, or trigger workflow/downstream enforcement. Resolution remains external to Sprint 53.

**GovernanceService Boundary (binding):** thin application service. MAY load one requested `RepositoryPolicy` version, load one requested Review, delegate Criterion evaluation to the authorized deterministic domain evaluator, derive exactly one `GovernanceDecision`, persist it immutably, and return the result. SHALL NOT select among multiple Policies, resolve precedence, arbitrate conflicts, interpret superior repository law, access `RATIFICATION_LEDGER.md`, validate Ratification authority, consume Evidence/Shared Reality/Knowledge, publish Domain Events, enforce a Decision, advance workflows, activate Sprints, invoke Adapters or AI models, or write governance files.

**Governance Decision Repository (binding):** `IGovernanceDecisionRepository` is append-only; supports deterministic registration and retrieval by Decision identity, evaluation key, Policy identity+version, or Review identity, plus enumeration; preserves all historical Decisions; rejects mutation, replacement, contradictory duplicate decisions, and duplicate registration with non-equivalent content. In-memory implementation only; no durable persistence.

**Failure-Closed Requirements (binding, normative minimum mappings):**

| Condition | Required Governance Decision |
| --- | --- |
| Every Criterion Satisfied | Approved |
| At least one Violated; none Undetermined or Unsupported | Rejected |
| Existing non-final Review | Deferred |
| Existing incomplete Review | Deferred |
| Missing required Review data | Deferred |
| Missing or unresolvable Review | Escalation Required |
| Any Criterion Undetermined; none Unsupported | Deferred |
| Unsupported predicate kind | Escalation Required |
| Unsupported predicate schema version | Escalation Required |
| Invalid `expectedMatch` value | Escalation Required |
| Malformed Criterion descriptor | Escalation Required |
| Unknown RepositoryPolicy identity | Escalation Required |
| Unknown RepositoryPolicy version | Escalation Required |
| Contradictory evaluation inputs | Escalation Required |
| Deterministic interpretation impossible | Escalation Required |
| Internal non-determinism detected | Escalation Required or deterministic failure; never Approved |

**Event Publication Boundary (binding):** no RFC-0005 Domain Events are authorized this Sprint (no `PolicyEvaluated`, `PolicyViolationDetected`, `GovernanceDecisionCreated`, `GovernanceEscalationCreated`, or equivalent), deferred to a future Event Publication slice following the established Foundation → Event Publication pattern.

**Cross-Domain Immutability (binding):** Sprint 53 SHALL NOT modify `RepositoryPolicy`, `PolicyCriterion`, RepositoryPolicy versioning or repository behavior, the Review aggregate, Review lifecycle, Review Outcome, Finding lifecycle, or Finding semantics. No existing approved vertical slice may be redefined.

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`); this ratification authorizes implementation of the Policy Evaluation/Governance Decision/Governance Escalation subset against exactly one Policy version and one Review, against it.

## Authorized Scope

The Builder MAY introduce exactly the Authorized Concepts listed above, exactly as specified in the binding Governance Decision, Final Refinements 1 and 2, and Sprint 53's Sprint Implementation Record. No additional governance capability is authorized.

## Deferred Concepts

Evidence-consuming and Shared Reality-consuming Policy Criteria; Knowledge consumption/capture; multi-Policy evaluation, precedence, and conflict arbitration; repository-law interpretation; Ratification-Ledger content/authority validation; superior authority resolution; policy enforcement; workflow gates/advancement; automatic remediation; downstream Governance Decision consumers; Domain Event publication; Host-facing and Adapter-facing governance surfaces; AI deliberation/unrestricted model judgment; durable persistence; policy generation/optimization; repository-write automation. No placeholder implementation of any deferred concept is authorized.

## Scope Restrictions

- No Domain Event is authorized this Sprint.
- No `src/hosts` or `src/adapters` change.
- No modification to the Kernel Canon, RFC-0011, RFC-0006, any other finalized RFC, or `REVIEW_HISTORY.md`.
- No modification to Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 9's `Review`/`Finding` behavior.
- `knowledge/reference/kernel-service-map.md`'s pre-existing incompleteness (`NEXUS-REV-2026-07-15-009-F-001`) remains out of scope; Sprint 53 SHALL NOT expand into unbounded service-map cleanup.

## Related Sprint(s)

- Sprint 52 — Governance Policy Model Foundation (Milestone 9's opening Sprint; immediate predecessor; frozen dependency).
- Sprint 9 — Review Foundation (frozen dependency).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner approves Sprint 53 — Policy Evaluation and Governance Decision Foundation as Milestone 9's second Sprint, with the binding Objective, RFC Coverage, Dependencies, Authorized Concepts, Evaluation Input Boundary, Finalized Review Boundary and Missing Review Resolution (Final Refinement 1), Closed Predicate Model and `UnresolvedFindingMatch` Polarity (Final Refinement 2), Prohibited Predicate Capabilities, PolicyCriterion Compatibility, PolicyCriterionResult Model, Governance Decision Precedence, Mixed-Result Decision Table, Deterministic Time, Deterministic Identity and Evaluation Key, Review State Attribution, Evaluation Idempotency, PolicyEvaluation Model, GovernanceDecision Model, GovernanceEscalation Model, GovernanceService Boundary, Governance Decision Repository, Failure-Closed Requirements, Event Publication Boundary, and Cross-Domain Immutability rules recorded above. The Builder SHALL implement exactly the Authorized Scope and SHALL NOT implement any Deferred Concept, including as a placeholder or stub. No Domain Event, `src/hosts`, or `src/adapters` change is authorized, and no previously approved vertical slice (Sprint 52, Sprint 9) may be modified. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 53 as Current under Milestone 9, and to generate Sprint 53's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-15-017

## Ratification Identifier

NEXUS-RAT-2026-07-15-017

## Date

2026-07-15

## Subject

Sprint 54 Scope Ratification — Ratification Attribution Validation Foundation. Resolves the `nexus-plan` Sprint 54 Proposal after two Sprint Owner review cycles (Changes Required — scope bundling; Changes Required — Snapshot cardinality and explicit Effective status), authorizing implementation of a standalone Ratification Attribution Validation capability as Milestone 9's third Sprint.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal cycle, not from a Reviewer finding.

## Governance Decision

The Sprint Owner authorizes Sprint 54 — Ratification Attribution Validation Foundation as Milestone 9's third Sprint: deterministic validation of the Ratification attribution recorded by exactly one immutable `RepositoryPolicy` version against an immutable collection of structured Ratification Authority Records, producing exactly one of three closed outcomes — **Valid**, **Invalid**, or **Unresolvable**. No semantic Ratification interpretation, Governance Decision integration, or repository-law precedence implementation is authorized.

**Objective (binding):**

```text
RepositoryPolicy Ratification Reference
        +
Immutable Ratification Authority Snapshot
        ↓
Ratification Attribution Validation
        ↓
    Valid
      or
Invalid / Unresolvable
```

**RFC Coverage (binding):** Primary — RFC-0011 v1.0 (Repository Policy § "attributable"). Referenced — RFC-0011 Authority Hierarchy § (tier-4 `RATIFICATION_LEDGER.md` relationship, referenced only, not implemented), `IMPLEMENTATION_CONSTITUTION.md` § Sprint Owner Ratifications (explicit supersession/withdrawal documentation requirement; identifier uniqueness/immutability rules).

**Dependencies (binding):** Frozen, read-only consumption of Sprint 52's `RepositoryPolicy` (its existing Ratification reference field only). Sprint 52 and Sprint 53's approved behavior SHALL NOT be modified.

**Snapshot Cardinality (binding):** `RatificationAuthoritySnapshot` (or equivalently named canonical concept) SHALL represent an immutable **collection** of structured `RatificationAuthorityRecord` entries captured from one authority source. It SHALL NOT represent only one Ratification. This collection boundary is required to deterministically detect missing identifiers, duplicate identifiers, supersession relationships, and withdrawal relationships. Each record within the collection remains independently immutable.

**RatificationAuthorityRecord Fields (binding):** identifier; date; subject; and any *explicitly documented* lifecycle relationship (superseded-by reference, withdrawn-by reference, when present) as recorded in the authority source. No field SHALL be inferred from prose, intent, or Builder assumption.

**Closed Lifecycle Statuses (binding):** at minimum `Effective`, `Superseded`, `Withdrawn`. No other status is authorized this Sprint without a superseding ratification. No default lifecycle status is permitted — a record's status SHALL be explicit, never inferred merely from the absence of a supersession or withdrawal marker.

**Required Outcome Mapping (binding, normative):**

| Condition | Required Outcome |
| --- | --- |
| Exactly one structurally valid record, canonical lifecycle status explicitly `Effective` | Valid |
| Record explicitly `Superseded` | Invalid |
| Record explicitly `Withdrawn` | Invalid |
| Contradictory record (e.g., simultaneously marked `Superseded` and `Withdrawn`, or conflicting explicit statuses) | Invalid |
| Structurally malformed record (missing required fields) | Invalid |
| No matching record found | Unresolvable |
| Duplicate identifier (more than one record resolves to the same reference) | Unresolvable |
| Unknown/unrecognized lifecycle status | Unresolvable |
| Malformed Ratification reference on the `RepositoryPolicy` | Unresolvable |
| Snapshot source unavailable | Unresolvable |

No outcome other than the three closed values (`Valid`, `Invalid`, `Unresolvable`) is authorized. No default outcome is permitted; every condition not explicitly listed above that the Builder encounters SHALL be treated as `Unresolvable` rather than guessed toward `Valid`.

**Authorized Concepts (binding):** exactly `RatificationAuthoritySnapshot` (or equivalently named canonical concept), `RatificationAuthorityRecord`, `RatificationAttributionValidation` (or equivalently named canonical capability) producing exactly the three closed outcomes above, a repository contract and in-memory implementation for the Snapshot source, deterministic diagnostics distinguishing each sub-condition in the Required Outcome Mapping table, minimal `createKernelServices` wiring. No additional governance capability is authorized.

**Scope Boundary (binding):** the capability SHALL NOT interpret Ratification prose or intent; SHALL NOT judge whether a Ratification semantically authorizes a `RepositoryPolicy`'s content; SHALL NOT detect contradictions across multiple distinct Ratifications or Policies beyond the single-record contradiction case in the Required Outcome Mapping table; SHALL NOT perform general repository-law interpretation or precedence resolution; SHALL NOT integrate with, be consumed by, or otherwise wire into `PolicyEvaluation`, `GovernanceDecision`, or `GovernanceService` — this Sprint's output is standalone; SHALL NOT publish Domain Events; SHALL NOT modify `src/hosts` or `src/adapters`; SHALL NOT modify Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 53's `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation` behavior.

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`); this ratification authorizes implementation of a standalone Ratification Attribution Validation capability against exactly one `RepositoryPolicy` version's Ratification reference, against it.

## Authorized Scope

The Builder MAY introduce exactly the Authorized Concepts listed above, exactly as specified in the binding Governance Decision, Snapshot Cardinality, RatificationAuthorityRecord Fields, Closed Lifecycle Statuses, and Required Outcome Mapping rules, and Sprint 54's Sprint Implementation Record. No additional governance capability is authorized.

## Deferred Concepts

Ratification prose/intent interpretation; semantic applicability of a Ratification to Policy content; contradiction detection across multiple distinct Ratifications or Policies; general repository-law interpretation or precedence; integration with `PolicyEvaluation`/`GovernanceDecision`/`GovernanceService`; Domain Event publication; Host-facing/Adapter-facing governance surfaces; durable persistence; automatic Ratification-Ledger ingestion beyond the Snapshot source contract. No placeholder implementation of any deferred concept is authorized.

## Scope Restrictions

- No Domain Event is authorized this Sprint.
- No `src/hosts` or `src/adapters` change.
- No modification to the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- No modification to Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 53's `PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation` behavior.
- No integration with `GovernanceService` or the Governance Decision path.

## Related Sprint(s)

- Sprint 52 — Governance Policy Model Foundation (frozen dependency — `RepositoryPolicy`'s Ratification reference field).
- Sprint 53 — Policy Evaluation and Governance Decision Foundation (immediate predecessor; frozen, unintegrated dependency).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner approves Sprint 54 — Ratification Attribution Validation Foundation as Milestone 9's third Sprint, with the binding Objective, RFC Coverage, Dependencies, Snapshot Cardinality, RatificationAuthorityRecord Fields, Closed Lifecycle Statuses, Required Outcome Mapping, Authorized Concepts, and Scope Boundary rules recorded above. The Builder SHALL implement exactly the Authorized Scope and SHALL NOT implement any Deferred Concept, including as a placeholder or stub. No Domain Event, `src/hosts`, or `src/adapters` change is authorized, no integration with `PolicyEvaluation`/`GovernanceDecision`/`GovernanceService` is authorized, and no previously approved vertical slice (Sprint 52, Sprint 53) may be modified. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 54 as Current under Milestone 9, and to generate Sprint 54's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-001

## Ratification Identifier

NEXUS-RAT-2026-07-16-001

## Date

2026-07-16

## Subject

Sprint 55 Scope Ratification — Ratification and Repository-Law Integration. Resolves the `nexus-plan` Sprint 55 Proposal, approved with mandatory refinements, authorizing integration of Sprint 54's standalone `RatificationAttributionValidationService` into Sprint 53's Governance Decision production path, as Milestone 9's fourth Sprint.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal cycle, not from a Reviewer finding.

## Governance Decision

The Sprint Owner authorizes Sprint 55 — Ratification and Repository-Law Integration as Milestone 9's fourth Sprint: `GovernanceService` gains a single additive precondition that consults Sprint 54's `RatificationAttributionValidationService` for the `RepositoryPolicy` version under evaluation, before any Policy Criteria are evaluated, per RFC-0011's Authority Hierarchy (tier 4, `RATIFICATION_LEDGER.md`) and Failure and Conflict Handling table.

**Validation Ordering (binding):** `RatificationAttributionValidationService` SHALL be invoked before Policy Criteria evaluation, for every `GovernanceDecision` production.

- `Valid` → continue through the existing Sprint 53 Policy Evaluation and decision-precedence logic, unchanged.
- `Invalid` or `Unresolvable` → Policy Criteria SHALL NOT be evaluated; exactly one `GovernanceDecision` with outcome `Escalation Required` SHALL be produced.

Governance SHALL NOT evaluate a `RepositoryPolicy` whose authority has not been validated.

**Escalation Attribution (binding):** an attribution-driven `GovernanceEscalation` SHALL preserve, at minimum:

- `RepositoryPolicy` identity and version;
- the referenced Ratification identity;
- the attribution-validation result (`Invalid` or `Unresolvable`);
- the deterministic attribution diagnostic (from Sprint 54's `RatificationAttributionDiagnostic`);
- the Ratification Authority Snapshot fingerprint or version consulted.

No Ratification prose or intent interpretation is authorized as part of this attribution or its diagnostic.

**Determinism and Idempotency (binding):** the complete deterministic input to a Sprint 55 Governance Decision SHALL include: the `RepositoryPolicy` version; the Review identity/version; and the Ratification Authority Snapshot fingerprint. Repeated evaluation using an identical complete input SHALL produce the identical `GovernanceDecision`, preserve the identical diagnostic, and avoid duplicate append-only decision records (consistent with Sprint 53's existing evaluation-key idempotency mechanism, extended to include the Snapshot fingerprint). A changed Ratification Authority Snapshot constitutes a changed governance input and MAY produce a different decision for the same `RepositoryPolicy`/Review pair — this is not a contradiction.

**RFC Coverage (binding):** Primary — RFC-0011 v1.0, Authority Hierarchy § (tier-4 `RATIFICATION_LEDGER.md` relationship) and Failure and Conflict Handling § ("Referenced Repository Policy version does not exist or has no ratified version" / "Applicable Ratifications are contradictory" → `Escalation Required`). Referenced — Sprint 53's `GovernanceDecision`/`PolicyEvaluation`/`GovernanceEscalation` (frozen structure, additively extended only); Sprint 54's `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot` (frozen, consumed read-only for the first time).

**Dependencies (binding):** Frozen, read-only consumption of Sprint 54's `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot` and Sprint 53's `GovernanceDecision`/`PolicyEvaluation`/`GovernanceEscalation`/`GovernanceService`. Neither may be modified in existing shape or existing behavior — only additively extended.

**Authorized Concepts (binding):** exactly — an additive `GovernanceService` precondition step invoking `RatificationAttributionValidationService`; the two-branch outcome mapping above; extension of the existing evaluation-key/idempotency mechanism to incorporate the Ratification Authority Snapshot fingerprint; extension of `GovernanceEscalation`'s existing attributable fields to include the attribution-driven fields listed above; minimal `createKernelServices` wiring change to supply `GovernanceService` with its new dependency. No additional governance capability is authorized.

**Architectural Boundaries (binding):** Sprint 55 SHALL NOT:

- modify the four-value `GovernanceDecision` model;
- modify the Mixed-Result Decision Table;
- modify existing Policy Criterion predicates (`ReviewOutcomeMembership`, `UnresolvedFindingMatch`);
- interpret `RATIFICATION_LEDGER.md`;
- detect cross-Policy or cross-Ratification contradictions beyond Sprint 54's existing single-record scope;
- introduce general repository-law precedence resolution;
- publish RFC-0005 Domain Events;
- modify `src/hosts` or `src/adapters`.

Sprint 53 and Sprint 54 contracts remain frozen and may only be consumed or additively wired, never redefined.

**Required Test Matrix (binding, normative):** Sprint 55 tests SHALL cover at minimum:

1. Valid attribution + Approved criteria → Approved.
2. Valid attribution + Rejected criteria → Rejected.
3. Valid attribution + Deferred criteria → Deferred.
4. Valid attribution + escalation criterion → Escalation Required.
5. Invalid attribution → Escalation Required without criterion evaluation.
6. Unresolvable attribution → Escalation Required without criterion evaluation.
7. Identical complete inputs → identical decision and no duplicate persistence.
8. Changed Authority Snapshot → independently evaluated deterministic result.
9. Existing Sprint 53 behavior remains unchanged when attribution is Valid.
10. Full repository validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build).

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`); this ratification authorizes `GovernanceService` to additively consume Sprint 54's standalone Ratification Attribution Validation capability as a precondition to Policy Evaluation, without redefining ownership of either capability.

## Authorized Scope

The Builder MAY introduce exactly the Authorized Concepts listed above, exactly as specified in the binding Governance Decision, Validation Ordering, Escalation Attribution, Determinism and Idempotency, and Architectural Boundaries rules, and Sprint 55's Sprint Implementation Record. No additional governance capability is authorized.

## Deferred Concepts

Contradiction detection across multiple distinct Ratifications or Policies beyond Sprint 54's existing single-record scope; general repository-law interpretation or precedence; automatic `RATIFICATION_LEDGER.md` ingestion; RFC-0005 Domain Event publication; Host-facing/Adapter-facing governance surfaces; durable persistence; any change to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates. No placeholder implementation of any deferred concept is authorized.

## Scope Restrictions

- No Domain Event is authorized this Sprint.
- No `src/hosts` or `src/adapters` change.
- No modification to the Kernel Canon, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- No modification to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates.
- No modification to Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 54's `RatificationAuthoritySnapshot`/`RatificationAttributionValidationService` behavior.
- No `RATIFICATION_LEDGER.md` prose interpretation.

## Related Sprint(s)

- Sprint 53 — Policy Evaluation and Governance Decision Foundation (frozen dependency — `GovernanceService`/`PolicyEvaluation`/`GovernanceDecision`/`GovernanceEscalation`).
- Sprint 54 — Ratification Attribution Validation Foundation (frozen dependency — `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot`, first-time integration).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner approves Sprint 55 — Ratification and Repository-Law Integration as Milestone 9's fourth Sprint, with the binding Governance Decision, Validation Ordering, Escalation Attribution, Determinism and Idempotency, RFC Coverage, Dependencies, Authorized Concepts, Architectural Boundaries, and Required Test Matrix rules recorded above. The Builder SHALL implement exactly the Authorized Scope and SHALL NOT implement any Deferred Concept, including as a placeholder or stub. No Domain Event, `src/hosts`, or `src/adapters` change is authorized, no modification to the four-value `GovernanceDecision` model, the Mixed-Result Decision Table, or existing Policy Criterion predicates is authorized, and no previously approved vertical slice (Sprint 52, Sprint 53, Sprint 54) may be redefined. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 55 as Current under Milestone 9, and to generate Sprint 55's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-002

## Ratification Identifier

NEXUS-RAT-2026-07-16-002

## Date

2026-07-16

## Subject

Sprint 56 Scope Ratification — Governance Decision Domain Event Publication. Resolves the `nexus-plan` Sprint 56 Proposal, approved with mandatory refinements, authorizing publication of exactly one Domain Event per produced `GovernanceDecision`, as Milestone 9's fifth Sprint.

## Originating Review Finding(s)

None. This ratification originates from a `nexus-plan` Sprint Proposal cycle, not from a Reviewer finding.

## Governance Decision

The Sprint Owner authorizes Sprint 56 — Governance Decision Domain Event Publication as Milestone 9's fifth Sprint: `GovernanceService` gains a single additive obligation to publish exactly one Domain Event for every persisted `GovernanceDecision`, reusing RFC-0005's reserved "Policy Events" category, per RFC-0011's Dependencies § ("Governance Decisions are published as Domain Events... following the existing Standard Event Envelope, Event Attribution, and Event Causality/Correlation rules").

**Event Model (binding):** exactly one Policy-category Domain Event type, `GovernanceDecisionRecorded`, SHALL be introduced. It SHALL represent creation and persistence of a new `GovernanceDecision` and SHALL carry the existing four-value outcome (Approved, Rejected, Deferred, Escalation Required) unchanged. No separate event type SHALL be introduced per individual outcome value. RFC-0005's `PolicyEvaluated`/`PolicyViolationDetected` names are illustrative examples of the "Policy Events" category, not a requirement to define multiple event types.

**Mission Identity (binding):** the `GovernanceDecisionRecorded` event envelope's `missionId` SHALL be obtained directly from the persisted `GovernanceDecision`. The implementation SHALL NOT resolve Mission identity indirectly through the referenced Review at publication time. This requires an additive `missionId` field on `GovernanceDecision`, populated by `GovernanceService` from the Review under evaluation at decision-production time (consistent with RFC-0011 Dependencies' "a Governance Decision references a Mission by identity only"), so that event publication remains possible even if the Review later becomes unresolvable.

**Publication Semantics (binding):** publication SHALL follow the established persistence-first pattern used by `ReviewService`/`MissionService`:

```text
Produce new GovernanceDecision
        ↓
Persist GovernanceDecision
        ↓
Record Domain Event
        ↓
Publish GovernanceDecisionRecorded
```

A `GovernanceDecision` SHALL be durably persisted before its corresponding event is recorded or published. Idempotent re-evaluation (Sprint 53/55's existing evaluation-key mechanism: identical complete inputs resolving to an already-persisted decision) SHALL NOT re-publish a duplicate event.

**RFC Coverage (binding):** Primary — RFC-0005 v1.0 (Domain Event, Event Identity/Attribution/Causality/Correlation, "Policy Events" category) and RFC-0011 v1.0 (Dependencies § Domain Event publication requirement). Referenced — Sprint 53's `GovernanceDecision`/`GovernanceEscalation`/`GovernanceService` (frozen structure, additively extended only); the existing `EventBusContract`/`DomainEvent` envelope infrastructure and `ReviewService` publication pattern (consumed unmodified, as precedent only).

**Dependencies (binding):** Frozen, read-only consumption of Sprint 53/55's `GovernanceDecision`/`GovernanceEscalation`/`GovernanceService`, additively extended only as specified above. Consumption of the existing `EventBusContract` port and `DomainEvent` envelope type (`src/kernel/events/domain-event.ts`), unmodified, following the same pattern already used by `ReviewService`/`MissionService`/`EvidenceService`/`KnowledgeService`.

**Authorized Concepts (binding):** exactly — the `GovernanceDecisionRecorded` Domain Event type; an additive `missionId` field on `GovernanceDecision`, populated at production time from the evaluated Review's Mission identity; wiring `EventBusContract` into `GovernanceService`'s constructor; draining and publishing the recorded event after persistence, mirroring the existing `ReviewService` pattern; minimal `createKernelServices` wiring change supplying `GovernanceService` its event bus dependency. No additional governance capability is authorized.

**Architectural Boundaries (binding):** Sprint 56 SHALL NOT:

- modify the four-value `GovernanceDecision` model's existing outcome semantics or the Mixed-Result Decision Table;
- modify existing Policy Criterion predicates (`ReviewOutcomeMembership`, `UnresolvedFindingMatch`);
- modify Sprint 54/55's `RatificationAttributionValidationService`/`RatificationAuthoritySnapshot` behavior;
- introduce any downstream event consumer, workflow gate, or repository-write automation triggered by `GovernanceDecisionRecorded`;
- introduce Evidence- or Shared-Reality-consuming Policy Criteria;
- introduce multi-Policy or multi-Ratification conflict arbitration beyond Sprint 55's existing scope;
- modify `src/hosts` or `src/adapters`;
- modify `EventBusContract`, `DomainEvent`, or any other RFC-0005 envelope type.

Sprint 52 through Sprint 55 contracts remain frozen and may only be consumed or additively extended, never redefined.

**Required Test Matrix (binding, normative):** Sprint 56 tests SHALL cover at minimum:

1. `GovernanceDecision` outcome Approved → exactly one `GovernanceDecisionRecorded` event published, envelope populated correctly (Event Identity, `missionId`, Attribution, Causality, Correlation).
2. `GovernanceDecision` outcome Rejected → exactly one `GovernanceDecisionRecorded` event published.
3. `GovernanceDecision` outcome Deferred → exactly one `GovernanceDecisionRecorded` event published.
4. `GovernanceDecision` outcome Escalation Required (criterion-driven, Sprint 53) → exactly one `GovernanceDecisionRecorded` event published.
5. `GovernanceDecision` outcome Escalation Required (attribution-driven, Sprint 55) → exactly one `GovernanceDecisionRecorded` event published.
6. Idempotent re-evaluation of identical complete inputs → no duplicate event published.
7. `missionId` on the published event matches the `missionId` additively stored on the persisted `GovernanceDecision`, obtained without a Review lookup at publication time.
8. `GovernanceDecision` is persisted before its event is published (publication failure SHALL NOT roll back or block the already-persisted decision).
9. Existing Sprint 53/55 evaluation, precedence, and attribution behavior remains unchanged.
10. Full repository validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build).

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`) and RFC-0005's ratified Domain Event ownership; this ratification authorizes `GovernanceService` to additively publish Domain Events under RFC-0005's existing "Policy Events" category, without redefining RFC-0005's event envelope, ownership, or infrastructure.

## Authorized Scope

The Builder MAY introduce exactly the Authorized Concepts listed above, exactly as specified in the binding Governance Decision, Event Model, Mission Identity, Publication Semantics, and Architectural Boundaries rules, and Sprint 56's Sprint Implementation Record. No additional governance capability is authorized.

## Deferred Concepts

Downstream consumption of `GovernanceDecisionRecorded` by any workflow gate, repository-write automation, or Host/Adapter surface; Evidence- or Shared-Reality-consuming Policy Criteria; multi-Policy or multi-Ratification conflict arbitration beyond Sprint 55's existing scope; any change to the four-value `GovernanceDecision` model's outcome semantics or the Mixed-Result Decision Table; any change to `EventBusContract` or the `DomainEvent` envelope. No placeholder implementation of any deferred concept is authorized.

## Scope Restrictions

- No `src/hosts` or `src/adapters` change.
- No modification to the Kernel Canon, RFC-0005, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.
- No modification to the four-value `GovernanceDecision` model's existing outcome semantics, the Mixed-Result Decision Table, or existing Policy Criterion predicates.
- No modification to Sprint 52's `RepositoryPolicy`/`PolicyCriterion` or Sprint 54's `RatificationAuthoritySnapshot`/`RatificationAttributionValidationService` behavior.
- No modification to `EventBusContract` or `DomainEvent`.
- No downstream event consumer of any kind.

## Related Sprint(s)

- Sprint 53 — Policy Evaluation and Governance Decision Foundation (frozen dependency — `GovernanceDecision`/`GovernanceEscalation`/`GovernanceService`, additively extended only).
- Sprint 55 — Ratification and Repository-Law Integration (frozen dependency — attribution-driven Escalation Required path, unmodified).

## Related Review(s)

- None yet. Pending Reviewer certification following Builder implementation.

## Full Ratification Text

> The Sprint Owner approves Sprint 56 — Governance Decision Domain Event Publication as Milestone 9's fifth Sprint, with the binding Governance Decision, Event Model, Mission Identity, Publication Semantics, RFC Coverage, Dependencies, Authorized Concepts, Architectural Boundaries, and Required Test Matrix rules recorded above. The Builder SHALL implement exactly the Authorized Scope and SHALL NOT implement any Deferred Concept, including as a placeholder or stub. No `src/hosts` or `src/adapters` change is authorized, no modification to the four-value `GovernanceDecision` model's existing outcome semantics, the Mixed-Result Decision Table, `EventBusContract`, or `DomainEvent` is authorized, and no previously approved vertical slice (Sprint 52 through Sprint 55) may be redefined. The Sprint Owner authorizes `nexus-plan` to update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 56 as Current under Milestone 9, and to generate Sprint 56's Sprint Implementation Record as the Builder's authoritative implementation contract.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-003

## Ratification Identifier

NEXUS-RAT-2026-07-16-003

## Date

2026-07-16

## Subject

Sprint 56 Remediation Ratification — Mission Identity Optionality for Governance Decision Events. Resolves `NEXUS-REV-2026-07-16-003-F-001` (Category 2, Architectural Violation, Critical) by ratifying that `missionId` is optional on the `GovernanceDecisionRecorded` event envelope, removing the unratified `EvaluateGovernancePolicyCommand.missionId` fallback the Builder introduced, and restoring Sprint 53's frozen "missing/unresolvable Review → `Escalation Required`" guarantee.

## Originating Review Finding(s)

- `NEXUS-REV-2026-07-16-003-F-001` — Category 2, Architectural Violation, Critical. Unratified `missionId` command fallback breaks Sprint 53's frozen "missing Review → Escalation Required" fail-closed guarantee.
- `NEXUS-REV-2026-07-16-003-F-002` — Category 4, Documentation Drift, Minor. `IMPLEMENTATION_REPORT.md` mischaracterizes F-001 as a non-deviating "Known Limitation."

## Governance Decision

The Sprint Owner accepts `NEXUS-REV-2026-07-16-003-F-001` as correctly identified: the Builder was not authorized to introduce `missionId` into `EvaluateGovernancePolicyCommand`. That fallback violates Sprint 53's frozen guarantee that a missing or unresolvable Review SHALL produce `Escalation Required`. The Builder SHALL remove the unratified command field and restore the Approved Sprint 53 behavior.

**Mission Identity Rule (binding):** For `GovernanceDecisionRecorded`:

- When the referenced Review resolves and exposes a Mission identity, the RFC-0005 event envelope SHALL contain that `missionId`.
- When the Review is missing or unresolvable, `missionId` MAY be absent from the event envelope.
- Absence of `missionId` SHALL NOT prevent creation, persistence, or publication of an `Escalation Required` `GovernanceDecision`.
- The event SHALL preserve all other available attribution and diagnostic data.

No synthetic, caller-supplied, inferred, or fallback Mission identity is authorized.

**Architectural Rationale:** Governance decisions may exist specifically because required repository references are unavailable. Event observability SHALL preserve that failure state rather than require fabricated attribution. Missing attribution is itself diagnostic evidence.

**Authorized Builder Changes (binding):** exactly —

1. Remove `missionId` from `EvaluateGovernancePolicyCommand`.
2. Remove the `GovernanceDecisionMissionUnavailableError` behavior.
3. Restore: missing Review → `Escalation Required`; unresolvable Review → `Escalation Required`.
4. Make `missionId` optional only within the applicable RFC-0005 event-envelope path.
5. Populate `missionId` when the Review resolves successfully.
6. Publish `GovernanceDecisionRecorded` without `missionId` when the Review cannot resolve.
7. Remove the test-helper default that masks missing Mission identity.
8. Add explicit tests for: missing Review and no Mission identity; unresolvable Review and no Mission identity; resolved Review with Mission identity; idempotent re-evaluation with no duplicate publication.
9. Correct `IMPLEMENTATION_REPORT.md` so F-001 is recorded as an architectural violation, not a known limitation.
10. Run the full repository validation pipeline.

**Scope Restrictions (binding):** the Builder SHALL NOT:

- modify `GovernanceDecision`'s existing shape beyond making `missionId` optional on the event-envelope path (the `GovernanceDecision` aggregate/model itself is not reauthorized for further change);
- modify `GovernanceEscalation`;
- modify Policy Evaluation precedence;
- introduce a new Mission lookup service;
- infer Mission identity from Policy or Ratification data;
- modify Host or Adapter code;
- introduce durable event storage or retry behavior.

**Finding Resolution (binding):** `NEXUS-REV-2026-07-16-003-F-001` remains OPEN until a Recovery Review verifies restoration of Sprint 53 behavior. `NEXUS-REV-2026-07-16-003-F-002` remains OPEN until documentation classification is corrected. A Recovery Review, limited to the authorized remediation changes above, SHALL follow implementation.

## Ownership Model (ratified)

Identical to RFC-0011's ratified ownership matrix (`NEXUS-RAT-2026-07-15-014`) and RFC-0005's ratified Domain Event ownership; this ratification narrows Sprint 56's own Mission Identity rule (`NEXUS-RAT-2026-07-16-002`) to make `missionId` optional on the event envelope specifically, without redefining `GovernanceDecision`, `GovernanceEscalation`, or Policy Evaluation ownership.

## Authorized Scope

The Builder MAY introduce exactly the Authorized Builder Changes listed above, exactly as specified in the binding Mission Identity Rule and Scope Restrictions, and the resulting Builder Task generated by `nexus-sprint`. No additional governance capability is authorized.

## Deferred Concepts

Unchanged from `NEXUS-RAT-2026-07-16-002`: downstream consumption of `GovernanceDecisionRecorded`; workflow gates; repository-write automation; Host/Adapter surfaces; Evidence/Shared-Reality-consuming Policy Criteria; multi-Policy/multi-Ratification conflict arbitration; durable event storage or retry behavior; any change to `EventBusContract`, the `DomainEvent` envelope structure, `GovernanceDecision`'s or `GovernanceEscalation`'s existing model, or Policy Evaluation precedence.

## Scope Restrictions

- No modification to `GovernanceDecision`'s or `GovernanceEscalation`'s existing model beyond making `missionId` optional on the event-envelope path.
- No modification to Policy Evaluation precedence.
- No new Mission lookup service; no inference of Mission identity from Policy or Ratification data.
- No `src/hosts` or `src/adapters` change.
- No durable event storage or retry behavior.
- No modification to the Kernel Canon, RFC-0005, RFC-0011, any other finalized RFC, or `REVIEW_HISTORY.md`.

## Related Sprint(s)

- Sprint 56 — Governance Decision Domain Event Publication (remediated by this ratification).
- Sprint 53 — Policy Evaluation and Governance Decision Foundation (frozen behavior restored by this ratification).

## Related Review(s)

- `NEXUS-REV-2026-07-16-003` — Sprint 56 Reviewer Report (FAIL; originates F-001 and F-002 resolved by this ratification).
- A Recovery Review is required following implementation, limited to the authorized remediation changes.

## Full Ratification Text

> The Sprint Owner ratifies Mission Identity Optionality for Governance Decision Events, accepting `NEXUS-REV-2026-07-16-003-F-001` as correctly identified: the Builder was not authorized to introduce `missionId` into `EvaluateGovernancePolicyCommand`, and that fallback violated Sprint 53's frozen guarantee that a missing or unresolvable Review SHALL produce `Escalation Required`. The Builder SHALL remove the unratified command field and restore the Approved Sprint 53 behavior. The binding Mission Identity Rule recorded above governs `GovernanceDecisionRecorded`: `missionId` SHALL be present when the Review resolves and exposes Mission identity, and MAY be absent when the Review is missing or unresolvable; absence SHALL NOT prevent creation, persistence, or publication of an `Escalation Required` `GovernanceDecision`; no synthetic, caller-supplied, inferred, or fallback Mission identity is authorized. The Builder SHALL implement exactly the ten Authorized Builder Changes listed above and SHALL NOT exceed the Scope Restrictions. `NEXUS-REV-2026-07-16-003-F-001` and `-F-002` remain OPEN until a Recovery Review, limited to these authorized remediation changes, verifies restoration of Sprint 53 behavior and documentation reconciliation. The Sprint Owner authorizes `nexus-sprint` to generate the corresponding Builder Task as the Builder's authoritative remediation contract.

## Current Status

Superseded by `NEXUS-RAT-2026-07-16-004`. This ratification's Mission Identity Rule ("`missionId` MAY be absent") is withdrawn; its ten Authorized Builder Changes' non-Mission-Identity elements (items 1–3, 7, 10) remain in effect as already-verified-Resolved per `NEXUS-REV-2026-07-16-004`.

---

# NEXUS-RAT-2026-07-16-004

## Ratification Identifier

NEXUS-RAT-2026-07-16-004

## Date

2026-07-16

## Subject

RFC-0011 Amendment Ratification — Mission-Scoped Governance Evaluation. Amends RFC-0011 — Engineering Governance Model to Version 1.1, adding a new binding "Mission-Scoped Governance Evaluation" section. Resolves `NEXUS-REV-2026-07-16-004-F-001` (Category 3, Specification Conflict, Critical) by withdrawing `NEXUS-RAT-2026-07-16-003`'s Mission Identity Rule and replacing it with a Mission-scoped evaluation model that satisfies RFC-0005's unconditional Event Attribution requirement without weakening RFC-0005 itself.

## Originating Review Finding(s)

- `NEXUS-REV-2026-07-16-004-F-001` — Category 3, Specification Conflict, Critical. `NEXUS-RAT-2026-07-16-003`'s Mission Identity Rule conflicts with RFC-0005's unconditional Event Attribution requirement, realized through an unsound type cast.

## Governance Decision

**RFC Amendment Required — Governance Evaluation SHALL Be Mission-Scoped.** The Sprint Owner accepts the Recovery Review findings recorded in `NEXUS-REV-2026-07-16-004`. The prior Sprint-level rule allowing `missionId` to be absent from `GovernanceDecisionRecorded` (`NEXUS-RAT-2026-07-16-003`'s Mission Identity Rule) is withdrawn. RFC-0005 remains unchanged and authoritative: every Domain Event SHALL identify its originating Mission. Sprint 56 SHALL NOT weaken, bypass, or structurally violate that requirement. No RFC-0005 amendment is authorized; no exception to mandatory Mission attribution is authorized.

The conflict is resolved through the RFC-0011 amendment recorded in `knowledge/specifications/rfc-0011-engineering-governance-model.md` v1.1 (see Amendment History, that document): governance evaluation is a Mission-scoped Kernel operation. Mission identity SHALL be an explicit, mandatory input to governance evaluation, independent of Review resolution. The authoritative evaluation inputs become: Mission identity; `RepositoryPolicy` version; Review reference; Ratification Authority Snapshot. The Review remains governance evidence; it SHALL NOT be the sole source of Mission identity.

**Mission-Scoped Governance Evaluation (binding, now RFC-0011 v1.1 text):**

- Every governance evaluation SHALL execute within exactly one Mission boundary; the evaluation request SHALL include an immutable `MissionId`, required for every evaluation — never optional, inferred from Ratification or Repository Policy data, synthesized, defaulted, or treated as a fallback.
- Every produced `GovernanceDecision` SHALL identify the Mission for which the evaluation occurred, originating from the evaluation request, not the referenced Review.
- When the referenced Review resolves successfully, its Mission identity SHALL equal the evaluation Mission identity; a mismatch SHALL produce `Escalation Required`.
- When the referenced Review is missing or unresolvable, governance evaluation SHALL still produce `Escalation Required`, retaining the explicit evaluation Mission identity; no Review-derived Mission lookup is required; no exception SHALL replace the required `GovernanceDecision`.
- `GovernanceDecisionRecorded` SHALL use the Mission identity stored by the `GovernanceDecision`. The event SHALL satisfy RFC-0005 structurally without casts, omitted fields, or weakened event contracts.

**Superseding Governance Effect:** this ratification supersedes the Mission-identity optionality authorized by `NEXUS-RAT-2026-07-16-003`. The rule "`missionId` MAY be absent when Review resolution fails" is withdrawn in its entirety.

## Ownership Model (ratified)

This ratification amends RFC-0011's own text (Dependencies, Policy Evaluation, the new Mission-Scoped Governance Evaluation section, Governance Decision, Boundaries, Failure and Conflict Handling, Explainability, Conformance, and Amendment History) and therefore carries RFC-tier authority for that amendment, per RFC-0011's own Authority Hierarchy: "a Ratification that amends RFC text... takes on RFC-tier authority for that amendment." It does not modify RFC-0005, RFC-0001–0004, RFC-0006–0010, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. draft the RFC-0011 amendment (v1.1) — complete, recorded in `knowledge/specifications/rfc-0011-engineering-governance-model.md`;
2. update RFC-0011's Amendment History — complete;
3. prepare this ratification entry — complete;
4. reconcile Sprint 56's Sprint Implementation Record to reflect the amended contract;
5. regenerate the authorized Builder recovery scope, reflecting the twelve-item Authorized Builder Remediation and Scope Restrictions the Sprint Owner specified in the originating governance decision, now grounded in the ratified RFC-0011 v1.1 text.

No Builder implementation is authorized until this ratification and the RFC-0011 amendment it carries are recorded as repository law — satisfied by this ratification's issuance.

## Authorized Builder Remediation (binding, carried forward from the Sprint Owner's governance decision)

After this ratification, the Builder SHALL:

1. Introduce required Mission identity into the canonical governance-evaluation request contract (`EvaluateGovernancePolicyCommand` or equivalent).
2. Preserve that Mission identity in every `GovernanceDecision`.
3. Validate resolved Review Mission identity against the requested Mission identity.
4. Produce `Escalation Required` for: missing Review; unresolvable Review; Review Mission mismatch.
5. Preserve Sprint 53 decision precedence and fail-closed behavior.
6. Populate `GovernanceDecisionRecorded.missionId` from the persisted `GovernanceDecision`.
7. Remove all unsafe `DomainEvent` casts.
8. Restore structural conformance with RFC-0005.
9. Remove tests asserting absent Mission attribution.
10. Add explicit tests covering: resolved Review with matching Mission; resolved Review with mismatched Mission; missing Review with explicit Mission; unresolvable Review with explicit Mission; all four `GovernanceDecision` outcomes; idempotent re-evaluation; no duplicate event publication.
11. Update Sprint 56 implementation and governance documentation.
12. Run the full repository validation pipeline.

## Scope Restrictions

The Builder SHALL NOT:

- weaken RFC-0005;
- make Domain Event Mission attribution optional;
- infer Mission identity from `RepositoryPolicy` or Ratification data;
- introduce synthetic Mission identities;
- change the Mixed-Result Decision Table;
- change Policy Criterion predicates;
- modify Host or Adapter code;
- introduce workflow gating or event consumers.

## Deferred Concepts

Unchanged from `NEXUS-RAT-2026-07-16-002`/`-003`: downstream consumption of `GovernanceDecisionRecorded`; workflow gates; repository-write automation; Host/Adapter surfaces; Evidence/Shared-Reality-consuming Policy Criteria; multi-Policy/multi-Ratification conflict arbitration; durable event storage or retry behavior.

## Related Sprint(s)

- Sprint 56 — Governance Decision Domain Event Publication (remediated by this ratification).
- Sprint 53 — Policy Evaluation and Governance Decision Foundation (frozen fail-closed behavior, now explicitly Mission-scoped).

## Related Review(s)

- `NEXUS-REV-2026-07-16-003` — Sprint 56 first review (FAIL).
- `NEXUS-REV-2026-07-16-004` — Sprint 56 Recovery Review (FAIL; originates F-001 resolved by this ratification).
- `NEXUS-REV-2026-07-16-005` — Status confirmation (FAIL, unchanged, no new remediation existed at that time).
- A further Recovery Review is required following implementation of the Authorized Builder Remediation above, limited to those changes.

## Full Ratification Text

> The Sprint Owner amends RFC-0011 — Engineering Governance Model to Version 1.1, adding Mission-Scoped Governance Evaluation as a new binding section, per the Governance Decision recorded above. RFC-0005 remains unchanged and authoritative; every Domain Event SHALL identify its originating Mission. The prior Mission Identity Rule authorized by `NEXUS-RAT-2026-07-16-003` (`missionId` MAY be absent) is withdrawn in its entirety. Governance evaluation becomes a Mission-scoped Kernel operation: every evaluation request SHALL carry an explicit, mandatory `MissionId`, independent of Review resolution; every `GovernanceDecision` retains that Mission identity; a resolved Review's Mission identity SHALL match the evaluation Mission identity (mismatch → `Escalation Required`); a missing or unresolvable Review continues to produce `Escalation Required`, retaining the evaluation Mission identity, never an unhandled exception; `GovernanceDecisionRecorded` obtains Mission identity exclusively from the persisted `GovernanceDecision`, satisfying RFC-0005 structurally without casts or omitted fields. The Sprint Owner authorizes `nexus-plan` to reconcile Sprint 56's Sprint Implementation Record and to regenerate the authorized Builder recovery scope reflecting the twelve-item Authorized Builder Remediation and Scope Restrictions recorded above. No Builder implementation was authorized before this ratification; it is authorized as of this ratification's issuance, strictly limited to the Authorized Builder Remediation and Scope Restrictions above. A further Recovery Review, limited to these changes, SHALL follow implementation.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-005

## Ratification Identifier

NEXUS-RAT-2026-07-16-005

## Date

2026-07-16

## Subject

RFC-0004 Amendment Ratification — Governance-Gated Advancement. Amends RFC-0004 — Execution Model to Version 1.11, adding **Governance-Gated Advancement** as RFC-0004's fourth Advancement Strategy, mirroring the Review-Gated Advancement precedent established by v1.5 (`NEXUS-RAT-2026-07-15-001`).

## Originating Request

Sprint Owner planning direction (`nexus-plan`, following Sprint 56's closure) directing that Milestone 9's Governance capability (Sprints 52–56) be integrated with the deterministic Engineering Workflow so that a finalized `GovernanceDecision` can gate workflow advancement. `nexus-plan`'s Governance Report identified that RFC-0004 currently defines exactly three Advancement Strategies and owns Workflow Advancement exclusively; RFC-0011 anticipates downstream consumption of an Approved `GovernanceDecision` by "a downstream Kernel capability... as one input toward an already-existing gate" but cannot itself authorize new Workflow Advancement behavior. No repository law authorized Governance-Gated Advancement prior to this ratification.

## Governance Decision

**RFC-0004 Amendment Approved — Option A (Approved-only Non-Blocking).** The Sprint Owner amends RFC-0004 to Version 1.11, adding Governance-Gated Advancement as a fourth Advancement Strategy. A `GovernanceDecision` (RFC-0011) is classified for this Strategy's Advancement Eligibility as exactly one of:

| `GovernanceDecision` | Classification | Advancement Effect |
| --- | --- | --- |
| Approved | Non-Blocking | Advancement MAY proceed when all other eligibility requirements are satisfied |
| Rejected | Blocking | Advancement SHALL NOT proceed |
| Deferred | Blocking | Advancement SHALL NOT proceed |
| Escalation Required | Blocking | Advancement SHALL NOT proceed |

Only `Approved` authorizes downstream advancement. `Rejected`, `Deferred`, and `Escalation Required` remain semantically distinct `GovernanceDecision` values under RFC-0011; this amendment classifies all three identically, and only for the narrow purpose of this Strategy's Blocking/Non-Blocking eligibility test — it does not collapse their distinct RFC-0011 meanings and does not authorize any differentiated downstream treatment (Recovery Requirement records, persisted Deferred/Escalation-Required Engineering Session states, or Mission completion preconditions) without a separate future Sprint Owner scope ratification.

This amendment SHALL NOT: redefine RFC-0011 `GovernanceDecision` values, lifecycle, or production; modify Manual, Automatic/Event-Driven, or Review-Gated Advancement; introduce AI interpretation or policy evaluation into RFC-0004; or permit `GovernanceService` to mutate Engineering Session state as a side effect.

RFC-0004 owns advancement eligibility and workflow-position mutation. RFC-0011 owns `GovernanceDecision` production and meaning. Neither is redefined by the other as a result of this amendment.

## Ownership Model (ratified)

This ratification amends RFC-0004's own text (Amendment History, Workflow Advancement § Advancement Strategy, new Governance Decision classification) and therefore carries RFC-tier authority for that amendment, per RFC-0004/RFC-0011's shared Authority Hierarchy convention: a Ratification that amends RFC text takes on RFC-tier authority for that amendment. It does not modify RFC-0011, RFC-0001–0003, RFC-0005–0010, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0004 to v1.11 as recorded in `knowledge/specifications/rfc-0004-execution-model.md` — complete;
2. update RFC-0004's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification (`NEXUS-RAT-2026-07-16-006`) authorizing implementation of Governance-Gated Advancement, narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Recovery Requirement records; any additional Engineering Session state distinguishing Rejected/Deferred/Escalation Required beyond uniform Blocking treatment; Governed Mission Completion or any Mission completion precondition change; Host or Adapter changes. Each remains unauthorized pending its own future RFC amendment and Sprint Owner scope ratification (see `NEXUS-RAT-2026-07-16-006`'s Follow-Up Planning Direction).

## Related Sprint(s)

- Sprint 57 — Governance-Gated Workflow Advancement (implements this amendment; see `NEXUS-RAT-2026-07-16-006`).
- Sprint 46 — Review-Gated Workflow Advancement (precedent pattern, unmodified).
- Sprint 52–56 — Governance foundation (frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 57 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.11, adding Governance-Gated Advancement as a fourth Advancement Strategy, per the Governance Decision recorded above (Option A). A `GovernanceDecision` classifies as Non-Blocking (Approved) or Blocking (Rejected, Deferred, Escalation Required) solely for this Strategy's Advancement Eligibility; only Approved permits advancement. This amendment does not redefine RFC-0011's `GovernanceDecision`, does not modify any other Advancement Strategy, and does not authorize Recovery Requirement records, differentiated blocking states, or Mission completion changes — each requires its own future ratification. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 57 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-006

## Ratification Identifier

NEXUS-RAT-2026-07-16-006

## Date

2026-07-16

## Subject

Sprint 57 Scope Ratification — Governance-Gated Workflow Advancement. Authorizes implementation of the Governance-Gated Advancement Strategy defined by `NEXUS-RAT-2026-07-16-005` (RFC-0004 v1.11).

## Originating Request

Following `NEXUS-RAT-2026-07-16-005`'s RFC-0004 v1.11 amendment, the Sprint Owner initially proposed a broader Sprint 57 scope including Recovery Requirement records, differentiated Rejected/Deferred/Escalation-Required Engineering Session states, and Governed Mission Completion. `nexus-plan`'s Governance Report identified that this broader scope exceeds the concepts actually owned by RFC-0004 v1.11 and RFC-0001 (Mission completion remains narrowly defined by Sprint 4): Recovery Requirement has no owning RFC section, differentiated blocking states are not defined by RFC-0004 v1.11 (which classifies all three Blocking values identically), and Governed Mission Completion would require its own RFC-0001 amendment. The Sprint Owner accepted this finding and narrowed Sprint 57 to exactly what RFC-0004 v1.11 authorizes, deferring the broader scope to separately-ratified future Sprints (58 and 59).

## Governance Decision

**Approved — Narrowed to RFC-0004 v1.11.** Sprint 57 — Governance-Gated Workflow Advancement is authorized for implementation, strictly as follows.

### Authorized Vertical Slice

Sprint 57 SHALL introduce an additive, RFC-0004-owned advancement operation on `EngineeringSession`/`EngineeringSessionService` (mirroring Sprint 46's Review-Gated Advancement pattern) that:

- consumes an existing, already-produced, immutable `GovernanceDecision` (via existing, unmodified `GovernanceService` retrieval);
- applies RFC-0004 v1.11's Non-Blocking/Blocking classification (Approved → Non-Blocking; Rejected/Deferred/Escalation Required → uniform Blocking, no sub-classification);
- preserves all existing Review-Gated Advancement requirements;
- advances the workflow position only when: Review eligibility is satisfied; the `GovernanceDecision` is Approved; and all existing Sprint 43/45/46 advancement prerequisites are satisfied;
- returns the existing, unmodified Advancement Result / Advancement Failure semantics uniformly for all three Blocking values (no differentiated failure type per value);
- remains deterministic and idempotent — repeated invocation or duplicate `GovernanceDecisionRecorded` delivery SHALL NOT advance the workflow more than once, alter an already-advanced position, or produce duplicate effects.

`GovernanceDecisionRecorded` MAY trigger this operation through a narrowly scoped consumer that retrieves the persisted `GovernanceDecision` and delegates all advancement eligibility and workflow mutation to this RFC-0004-owned operation; the consumer itself SHALL own no eligibility or mutation logic.

### Explicitly Unauthorized

Sprint 57 SHALL NOT introduce: Recovery Requirement records; recovery-plan generation; any new Engineering Session state persisting a distinction between Rejected, Deferred, and Escalation Required beyond RFC-0004 v1.11's uniform Blocking classification; Governed Mission Completion or any Mission completion precondition change; any mutation of `WorkflowChain` topology; reinterpretation of `GovernanceDecision`; any `GovernanceService` side effect; or any `src/hosts`/`src/adapters` change.

### Required Test Matrix

1. Approved Review + Approved `GovernanceDecision` advances exactly once.
2. Approved Review + Rejected `GovernanceDecision` does not advance.
3. Approved Review + Deferred `GovernanceDecision` does not advance.
4. Approved Review + Escalation Required does not advance.
5. Governance approval without Review eligibility does not advance.
6. Review approval without Governance approval does not advance.
7. Duplicate `GovernanceDecisionRecorded` delivery causes no duplicate advancement.
8. Existing Manual, Automatic/Event-Driven, and Review-Gated Advancement remain byte-for-byte unchanged.
9. `GovernanceService`, `GovernanceDecision`, `EventBusContract`, and `DomainEvent` remain unchanged.
10. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only; it operates at the Implementation Plan tier, below the RFC-tier authority already established by `NEXUS-RAT-2026-07-16-005`. It does not itself amend any RFC.

## Authorized Scope

`nexus-plan` is authorized to generate the Sprint 57 Sprint Implementation Record and Builder handoff, strictly limited to the Authorized Vertical Slice and Required Test Matrix above.

## Follow-Up Planning Direction (non-binding; each requires its own future ratification)

- **Sprint 58 — Governance Recovery and Blocking-State Foundation**: requires its own RFC amendment (RFC-0004 or a new capability) owning Recovery Requirement, recovery association/lifecycle, and any differentiated Engineering Session governance state. Not authorized for implementation.
- **Sprint 59 — Governed Mission Completion**: requires an RFC-0001 amendment defining expanded Mission completion preconditions involving Review, `GovernanceDecision`, unresolved recovery, and Knowledge requirements. Not authorized for implementation.

Neither Sprint 58 nor Sprint 59 is authorized for implementation by this ratification.

## Deferred Concepts

Recovery Requirement; recovery records/lifecycle; differentiated Rejected/Deferred/Escalation-Required Engineering Session states; Governed Mission Completion; any new Mission completion precondition; `WorkflowChain` mutation; Host or Adapter changes.

## Related Sprint(s)

- Sprint 57 — Governance-Gated Workflow Advancement (this ratification's authorized scope).
- Sprint 46 — Review-Gated Workflow Advancement (precedent pattern, unmodified).
- Sprint 52–56 — Governance foundation (frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 57 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner narrows Sprint 57 to exactly the Governance-Gated Advancement Strategy defined by `NEXUS-RAT-2026-07-16-005` (RFC-0004 v1.11), per the Governance Decision recorded above, accepting `nexus-plan`'s finding that the previously proposed broader scope (Recovery Requirement, differentiated blocking states, Governed Mission Completion) exceeds concepts currently owned by any ratified RFC text. Sprint 57 SHALL implement only the Authorized Vertical Slice above. `nexus-plan` is authorized to record this ratification, generate the Sprint 57 Sprint Implementation Record, and prepare Builder handoff. Sprint 58 and Sprint 59 are named as non-binding future planning direction only and are not authorized for implementation.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-007

## Ratification Identifier

NEXUS-RAT-2026-07-16-007

## Date

2026-07-16

## Subject

RFC-0004 Amendment Ratification — Recovery Requirement. Amends RFC-0004 — Execution Model to Version 1.12, adding **Recovery Requirement** as an explicit, attributable record that a Rejected `GovernanceDecision` (RFC-0011) has generated engineering remediation work.

## Originating Request

Following Sprint 57's closure, `nexus-plan` identified that Milestone 9's Provisional Capability Sequence names two remaining, unauthorized candidates — Sprint 58 (Governance Recovery and Blocking-State Foundation) and Sprint 59 (Governed Mission Completion) — and that Sprint 59's own candidate description depends on "unresolved recovery" as a completion precondition, a concept that does not yet exist. `nexus-plan` recommended pursuing Sprint 58 first. The Sprint Owner approved this sequencing and directed `nexus-plan` to draft an RFC-0004 amendment introducing `RecoveryRequirement`, its identity, its association with Mission/Engineering Session/Workflow Step/`GovernanceDecision`, its lifecycle, and the boundary distinguishing recovery-triggering Rejection from non-recovery Blocking outcomes (Deferred, Escalation Required). The Sprint Owner reviewed an initial draft and required two mandatory refinements before approval: (1) explicit Identity and Uniqueness rules (immutable identity; deterministic, idempotent creation; at most one Recovery Requirement per (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination; duplicate handling returns the existing record); and (2) explicit Required Attribution rules (immutable references to Mission/Engineering Session/Workflow Step/`GovernanceDecision` identity, creation timestamp, and causality/correlation identifiers, without duplicating or reinterpreting `GovernanceDecision` diagnostics).

## Governance Decision

**RFC-0004 Amendment Approved, with Sprint Owner-directed refinements incorporated.** The Sprint Owner amends RFC-0004 to Version 1.12, adding Recovery Requirement, as recorded in `knowledge/specifications/rfc-0004-execution-model.md`'s new "Recovery Requirement" section (placed after Multi-Agent Engineering Orchestration Foundation, before Execution Session) and its Amendment History v1.12 entry.

### Authorized Concepts

- `RecoveryRequirement` — immutable identity; immutable association with Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` identities; creation timestamp; causality/correlation identifiers where available.
- Deterministic, idempotent creation: at most one Recovery Requirement per (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination; duplicate handling of the same Rejected `GovernanceDecision` returns the existing record.
- Creation restricted to a Rejected `GovernanceDecision` only. Deferred and Escalation Required remain Blocking under Governance-Gated Advancement (v1.11, unmodified) but SHALL NOT create a Recovery Requirement. Approved SHALL NOT create a Recovery Requirement.
- Closed lifecycle: Open (initial) → Resolved | Withdrawn, both terminal.

### Explicitly Unauthorized

- AI-generated remediation plans, steps, or content.
- Workflow Chain topology mutation, Workflow Step definition mutation, or any change to Workflow Chain Execution.
- `GovernanceService`, `GovernanceDecision`, or `GovernanceEscalation` ownership, creation, or mutation of Recovery Requirement state, or vice versa.
- Any redefinition of `GovernanceDecision` values, semantics, lifecycle, or production (RFC-0011, unmodified).
- Any differentiated Engineering Session state for Deferred or Escalation Required beyond Governance-Gated Advancement's existing uniform Blocking classification (v1.11, unmodified).
- Any Mission objective, Mission intent, or Mission completion precondition change (RFC-0001, unmodified; Governed Mission Completion remains Sprint 59's separately unauthorized candidate).
- Any `src/hosts` or `src/adapters` change.

This amendment SHALL NOT modify Manual, Automatic/Event-Driven, Review-Gated, or Governance-Gated Advancement (v1.4/v1.5/v1.11, unmodified), Workflow Chain, Workflow Chain Execution, Session Recovery/Checkpointing, Concurrent Session Coordination, or Multi-Agent Engineering Orchestration Foundation.

## Ownership Model (ratified)

This ratification amends RFC-0004's own text (Amendment History, new Recovery Requirement section) and therefore carries RFC-tier authority for that amendment, per RFC-0004/RFC-0011's shared Authority Hierarchy convention: a Ratification that amends RFC text takes on RFC-tier authority for that amendment. It does not modify RFC-0011, RFC-0001–0003, RFC-0005–0010, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0004 to v1.12 as recorded in `knowledge/specifications/rfc-0004-execution-model.md` — complete;
2. update RFC-0004's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification authorizing implementation of Recovery Requirement (Sprint 58), narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Governed Mission Completion or any Mission completion precondition change (Sprint 59 candidate, unscheduled, requires its own RFC-0001 amendment); any differentiated Engineering Session state beyond uniform Blocking classification; AI-generated remediation planning; Host or Adapter changes.

## Related Sprint(s)

- Sprint 58 — Governance Recovery and Blocking-State Foundation (implements this amendment; companion Sprint-scope ratification pending).
- Sprint 57 — Governance-Gated Workflow Advancement (precedent pattern and immediate predecessor capability, unmodified).
- Sprint 52–56 — Governance foundation (frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 58 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.12, adding Recovery Requirement, per the Governance Decision recorded above. A Recovery Requirement is created only for a Rejected `GovernanceDecision`, never for Deferred, Escalation Required, or Approved; it carries immutable identity and attribution to Mission, Engineering Session, Workflow Step, and the originating `GovernanceDecision`; creation is deterministic and idempotent, producing at most one record per (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) combination; its lifecycle is limited to Open → Resolved | Withdrawn. It SHALL NOT generate AI remediation plans, mutate Workflow Chain topology, or be owned by `GovernanceService`. This amendment does not redefine RFC-0011's `GovernanceDecision`, does not modify any Advancement Strategy, and does not authorize Governed Mission Completion — that remains Sprint 59's separately unauthorized candidate. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 58 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-008

## Ratification Identifier

NEXUS-RAT-2026-07-16-008

## Date

2026-07-16

## Subject

Sprint 58 Scope Ratification — Governance Recovery and Blocking-State Foundation. Authorizes implementation of `RecoveryRequirement` as defined by `NEXUS-RAT-2026-07-16-007` (RFC-0004 v1.12).

## Originating Request

Following `NEXUS-RAT-2026-07-16-007`'s RFC-0004 v1.12 amendment, `nexus-plan` drafted a Sprint 58 scope proposal authorizing a `RecoveryRequirement` domain aggregate, a narrowly scoped `GovernanceDecisionRecorded` consumer, a repository and thin service, and the closed Open/Resolved/Withdrawn lifecycle. The Sprint Owner approved this scope subject to explicit resolution and withdrawal service contracts (rather than free-form transition calls) and additional lifecycle-immutability guarantees.

## Governance Decision

**Approved, with lifecycle-contract refinements incorporated.** Sprint 58 — Governance Recovery and Blocking-State Foundation is authorized for implementation, strictly as follows.

### Authorized Vertical Slice

Sprint 58 SHALL introduce:

- `RecoveryRequirement` domain aggregate per RFC-0004 v1.12: immutable identity; immutable Mission/Engineering Session/Workflow Step/`GovernanceDecision` identity references; creation timestamp; causality/correlation identifiers where available.
- A narrowly scoped `GovernanceDecisionRecorded` consumer (mirroring Sprint 57's `GovernanceGatedWorkflowAdvancementConsumer` pattern) that inspects the persisted `GovernanceDecision`'s outcome and creates a Recovery Requirement only when it is Rejected; the consumer owns no remediation logic beyond that classification.
- Deterministic, idempotent creation keyed on (Mission, Engineering Session, Workflow Step, `GovernanceDecision`): repeated handling of the same Rejected `GovernanceDecision` returns the existing record; a distinct `GovernanceDecision` producing a new Rejection creates a new, separate record.
- `IRecoveryRequirementRepository` and an in-memory implementation enforcing the uniqueness key.
- A thin `RecoveryRequirementService` mirroring `GovernanceService`'s orchestration style, exposing exactly:
  - `resolveRecoveryRequirement(...)` and
  - `withdrawRecoveryRequirement(...)`
  per the Recovery Resolution Contract and Recovery Withdrawal Contract below.
- Minimal `createKernelServices` wiring.

#### Recovery Resolution Contract

`resolveRecoveryRequirement(...)` SHALL require an immutable reference to the authoritative accepted engineering outcome (an accepted outcome or Evidence reference) demonstrating that remediation has completed.

The resulting resolution record SHALL preserve:

- the Recovery Requirement identity;
- the accepted-outcome or Evidence reference;
- a resolution timestamp;
- attribution;
- causality and correlation identifiers, where available.

`RecoveryRequirementService` SHALL NOT itself determine whether remediation is sufficient; it SHALL consume an already-accepted outcome supplied by the caller and delegate transition validation (current status, terminality) entirely to the `RecoveryRequirement` aggregate.

#### Recovery Withdrawal Contract

`withdrawRecoveryRequirement(...)` SHALL require:

- an authoritative decision or Ratification reference;
- a withdrawal reason;
- a withdrawal timestamp;
- attribution;
- causality and correlation identifiers, where available.

Withdrawal SHALL NOT occur from free-form caller intent alone; the authoritative decision/Ratification reference is a required input, not an optional annotation.

#### Lifecycle Immutability

After a Recovery Requirement transitions to `Resolved` or `Withdrawn`:

- the lifecycle state SHALL be terminal;
- the transition's resolution/withdrawal metadata SHALL remain immutable;
- a repeated, identical transition request MAY return the existing record rather than fail;
- a conflicting repeated transition request (for example, withdrawing an already-Resolved record, or resolving an already-Withdrawn record) SHALL fail deterministically.

### Explicitly Unauthorized

Sprint 58 SHALL NOT introduce: AI-generated remediation plans, steps, or content; any `WorkflowChain`/`WorkflowStep`/Workflow Chain Execution mutation; any `GovernanceService`, `GovernanceDecision`, or `GovernanceEscalation` modification, or Recovery Requirement ownership by `GovernanceService`; any differentiated Engineering Session state for Deferred/Escalation Required beyond Sprint 57's existing uniform Blocking classification; any Mission completion precondition change (Sprint 59 candidate); Recovery Requirement Domain Event publication (deferred to its own future Sprint, mirroring Sprint 53 preceding Sprint 56); or any `src/hosts`/`src/adapters` change.

### Required Test Matrix

1. Rejected `GovernanceDecision` creates exactly one Open Recovery Requirement with correct attribution.
2. Deferred `GovernanceDecision` creates no Recovery Requirement.
3. Escalation Required `GovernanceDecision` creates no Recovery Requirement.
4. Approved `GovernanceDecision` creates no Recovery Requirement.
5. Duplicate/repeated handling of the same Rejected `GovernanceDecision` returns the existing record; no duplicate created.
6. A distinct `GovernanceDecision` (new rejection) for the same Mission/Session/Step creates a new, separate Recovery Requirement.
7. `Open → Resolved` succeeds via `resolveRecoveryRequirement` given a valid accepted-outcome reference; further transitions on a Resolved record are rejected.
8. `Open → Withdrawn` succeeds via `withdrawRecoveryRequirement` given a valid authoritative reference; further transitions on a Withdrawn record are rejected.
9. Recovery Requirement stores no copied/re-derived `GovernanceDecision` diagnostics — identity reference only.
10. `GovernanceService`, `GovernanceDecision`, `WorkflowChain`, `EventBusContract`, `DomainEvent` remain byte-for-byte unmodified.
11. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
12. Resolution without an accepted-outcome reference is rejected.
13. Withdrawal without authoritative decision attribution is rejected.
14. Resolution metadata (accepted-outcome reference, timestamp, attribution, causality/correlation) is preserved and immutable after the transition.
15. Withdrawal metadata (authoritative reference, reason, timestamp, attribution, causality/correlation) is preserved and immutable after the transition.
16. Repeating the identical terminal transition (same target status, same reference) is idempotent or deterministically rejected, per the service contract above.
17. A conflicting terminal transition is rejected: `Resolved → Withdrawn` and `Withdrawn → Resolved` both fail deterministically.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only; it operates at the Implementation Plan tier, below the RFC-tier authority already established by `NEXUS-RAT-2026-07-16-007`. It does not itself amend any RFC.

## Authorized Scope

`nexus-plan` is authorized to generate the Sprint 58 Sprint Implementation Record and Builder handoff, strictly limited to the Authorized Vertical Slice and Required Test Matrix above.

## Deferred Concepts

Recovery Requirement Domain Event publication; AI-generated remediation planning; Mission completion preconditions (Sprint 59 candidate); differentiated Engineering Session state beyond uniform Blocking classification; `WorkflowChain`/`WorkflowStep` mutation; Host or Adapter changes.

## Related Sprint(s)

- Sprint 58 — Governance Recovery and Blocking-State Foundation (this ratification's authorized scope).
- Sprint 57 — Governance-Gated Workflow Advancement (precedent consumer pattern, unmodified).
- Sprint 52–56 — Governance foundation (frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 58 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 58 — Governance Recovery and Blocking-State Foundation, per the Governance Decision recorded above, implementing exactly the `RecoveryRequirement` aggregate, consumer, repository, and thin service defined by RFC-0004 v1.12 (`NEXUS-RAT-2026-07-16-007`), refined with explicit Recovery Resolution and Recovery Withdrawal service contracts and lifecycle-immutability guarantees. Sprint 58 SHALL implement only the Authorized Vertical Slice above. `nexus-plan` is authorized to record this ratification, generate the Sprint 58 Sprint Implementation Record, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-009

## Ratification Identifier

NEXUS-RAT-2026-07-16-009

## Date

2026-07-16

## Subject

Sprint 59 Scope Ratification — Recovery Requirement Domain Event Publication. Authorizes Domain Event publication for `RecoveryRequirement` (RFC-0004 v1.12, Sprint 58) creation, resolution, and withdrawal under RFC-0005's existing "Execution Events" category. No RFC-0005 text amendment.

## Originating Request

Following Sprint 58's closure with zero open findings, `nexus-plan` performed a Repository Analysis and Governance Scan. Two next-Sprint candidates were identified: (1) Governed Mission Completion (the provisional roadmap's original Sprint 59 candidate, requiring an unratified RFC-0001 amendment), and (2) Recovery Requirement Domain Event Publication (no RFC amendment required, mirroring the established Sprint 12→13 and Sprint 53→56 Foundation → Event Publication pattern). The Sprint Owner selected option (2). `nexus-plan` drafted a Sprint 59 scope proposal; the Sprint Owner approved it with seven refinements concerning attribution completeness, creation-event idempotency, rehydration safety, failure-path silence, save-then-publish sequencing, production EventBus wiring, and test coverage.

## Governance Decision

**Approved, with refinements incorporated.** Sprint 59 — Recovery Requirement Domain Event Publication is authorized for implementation, strictly as follows.

### Authorized Vertical Slice

Sprint 59 SHALL introduce:

- `recovery-requirement.events.ts`: `RecoveryRequirementEventType` union (`RecoveryRequirementCreated`, `RecoveryRequirementResolved`, `RecoveryRequirementWithdrawn`), a `RecoveryRequirementDomainEvent` type, and factory functions — mirroring `governance.events.ts`'s (Sprint 56) shape, catalogued under RFC-0005's existing "Execution Events" category (RFC-0004 owns `RecoveryRequirement`; no RFC-0005 text amendment).
- `RecoveryRequirement` aggregate: a recorded-events collection and `pullDomainEvents()` (drain-once), mirroring `Mission`/`Evidence`/`Review`/`Knowledge`/`GovernanceDecision`.
- `RecoveryRequirementGovernanceDecisionConsumer` and `RecoveryRequirementService` each gain constructor-injected `EventBusContract`, publishing only after the associated state transition has been successfully persisted (established save-then-publish pattern) — no event on failed persistence.
- `createKernelServices` updated so both receive the shared, production `EventBusContract` instance; optional injection MAY remain solely for isolated unit testing or backward compatibility, but production Kernel composition SHALL NOT omit it.
- `kernel-event-catalog.md` reference-document addition for the three new event types under "Execution Events."

#### Refinements (Sprint Owner, incorporated as binding)

1. Every Recovery Requirement Domain Event SHALL preserve RFC-0005 Mission attribution, causality, correlation, and the originating `GovernanceDecision` identity reference.
2. `RecoveryRequirementCreated` SHALL be recorded by the `RecoveryRequirement` aggregate during authoritative creation only. Aggregate rehydration (`fromSnapshot`) SHALL NOT emit a creation event.
3. Idempotent handling of an existing Recovery Requirement (duplicate `GovernanceDecisionRecorded` handling, same attribution key) SHALL NOT publish a duplicate creation event.
4. Invalid, repeated-conflicting, or failed lifecycle transitions SHALL publish no event.
5. Domain Events SHALL be published only after successful persistence — save-then-publish, matching Mission/Evidence/Review/Knowledge/GovernanceDecision.
6. Production Kernel composition (`createKernelServices`) SHALL inject the shared `EventBusContract`; optional injection MAY remain solely for isolated testing or backward compatibility.
7. Tests SHALL verify exact-once event recording per successful transition, event draining, attribution completeness, idempotency (no duplicate event on idempotent creation), and absence of publication on failed persistence or rejected/conflicting transitions.

### Explicitly Unauthorized

Sprint 59 SHALL NOT introduce: event subscriptions or consumers of the new events; Governed Mission Completion or any Mission completion precondition change; any `WorkflowChain`/`WorkflowStep`/Workflow Chain Execution mutation; any `GovernanceService`, `GovernanceDecision`, or `GovernanceEscalation` modification; durable or transactional event delivery; or any `src/hosts`/`src/adapters` change.

### Required Test Matrix

1. Successful `RecoveryRequirement` creation (Rejected `GovernanceDecision`, new attribution key) publishes exactly one `RecoveryRequirementCreated` event with complete Mission/causality/correlation/`GovernanceDecision` attribution.
2. Idempotent handling of an already-existing attribution key (duplicate `GovernanceDecisionRecorded` delivery) publishes no additional `RecoveryRequirementCreated` event.
3. Aggregate rehydration via `fromSnapshot` records and publishes no event.
4. `resolveRecoveryRequirement` on a valid `Open` record publishes exactly one `RecoveryRequirementResolved` event with complete attribution after successful persistence.
5. `withdrawRecoveryRequirement` on a valid `Open` record publishes exactly one `RecoveryRequirementWithdrawn` event with complete attribution after successful persistence.
6. A rejected/conflicting transition (e.g., resolving an already-`Withdrawn` record, or vice versa) publishes no event.
7. A transition that fails validation (missing required reference) publishes no event.
8. `GovernanceDecision`, `GovernanceService`, `WorkflowChain`, `EventBusContract`, `DomainEvent` envelope remain byte-for-byte unmodified.
9. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only; it operates at the Implementation Plan tier. It does not amend any RFC — RFC-0005 already permits additional events within its existing "Execution Events" category, and RFC-0004 v1.12's `RecoveryRequirement` definition is consumed unmodified.

## Authorized Scope

`nexus-plan` is authorized to generate the Sprint 59 Sprint Implementation Record and Builder handoff, strictly limited to the Authorized Vertical Slice, incorporated Refinements, and Required Test Matrix above.

## Deferred Concepts

Event subscriptions/consumers; Governed Mission Completion and any Mission completion precondition change; `WorkflowChain`/`WorkflowStep` mutation; `GovernanceService`/`GovernanceDecision` modification; durable/transactional event delivery; Host or Adapter changes.

## Related Sprint(s)

- Sprint 59 — Recovery Requirement Domain Event Publication (this ratification's authorized scope).
- Sprint 58 — Governance Recovery and Blocking-State Foundation (precedent aggregate/consumer/service, unmodified).
- Sprint 56 — Governance Decision Domain Event Publication (direct structural precedent: `governance.events.ts`, optional `EventBusContract` injection, save-then-publish).
- Sprint 13 — Knowledge Event Publication (earlier precedent for the Foundation → Event Publication pattern).

## Related Review(s)

None yet. A Sprint 59 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 59 — Recovery Requirement Domain Event Publication, per the Governance Decision recorded above, implementing exactly the `RecoveryRequirementCreated`/`RecoveryRequirementResolved`/`RecoveryRequirementWithdrawn` Domain Events under RFC-0005's existing "Execution Events" category, with the seven incorporated Refinements binding. Sprint 59 SHALL implement only the Authorized Vertical Slice above. `nexus-plan` is authorized to record this ratification, generate the Sprint 59 Sprint Implementation Record, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-010

## Ratification Identifier

NEXUS-RAT-2026-07-16-010

## Date

2026-07-16

## Subject

RFC-0004 Amendment Ratification — Recovery-Gated Re-Advancement Eligibility. Amends RFC-0004 — Execution Model to Version 1.13, adding a new "Recovery-Gated Re-Advancement Eligibility" subsection to § Workflow Advancement.

## Originating Request

Following Sprint 59's closure with zero open findings, `nexus-plan` performed a Repository Analysis and Governance Scan. Three next-Sprint candidates were identified for Milestone 9: (1) Recovery-Gated Re-Advancement — giving a Resolved Recovery Requirement (RFC-0004 v1.12) real effect on the Governance-Gated Advancement (v1.11) position it was created alongside; (2) a narrowly scoped, no-RFC-amendment consumer of Recovery Requirement/`GovernanceDecisionRecorded` events; (3) Governed Mission Completion, requiring its own RFC-0001 amendment. The Sprint Owner selected option (1). `nexus-plan` identified that RFC-0004 v1.11 and v1.12 each explicitly reserve this capability pending its own future RFC amendment and Sprint Owner ratification, and drafted this amendment. The Sprint Owner approved the draft with two binding wording refinements (preserving the Rejected `GovernanceDecision`'s immutability in the amendment text; requiring the Recovery Resolution Contract's existing accepted-outcome reference to match the exact Recovery Requirement being relied upon) before ratification.

## Governance Decision

**RFC-0004 Amendment Approved, with refinements incorporated.** The Sprint Owner amends RFC-0004 to Version 1.13, adding Recovery-Gated Re-Advancement Eligibility to Governance-Gated Advancement (v1.11).

### Ratified Semantics

For a workflow position governed by a Rejected `GovernanceDecision`:

| Recovery Requirement State | Advancement Eligibility |
| --- | --- |
| Missing | Blocking |
| Open | Blocking |
| Resolved | Eligible for normal advancement evaluation |
| Withdrawn | Blocking |

- A Resolved Recovery Requirement SHALL NOT change, supersede, or reinterpret the originating Rejected `GovernanceDecision`; the decision remains immutable and fully attributable (RFC-0011, unmodified). It provides an additional, independent advancement-eligibility input demonstrating that the remediation obligation created from that decision has been authoritatively satisfied.
- Eligibility applies only when: the Recovery Requirement's status is Resolved; the reference required by the existing Recovery Resolution Contract (v1.12, unmodified) — an immutable reference to the authoritative accepted engineering outcome demonstrating remediation — is present and is the reference that resolved that exact Recovery Requirement; and the Recovery Requirement's Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` identity references all match the workflow position being evaluated. An accepted outcome resolving a different, unrelated Recovery Requirement SHALL NOT satisfy this path.
- Resolved status SHALL NOT itself produce an Advancement Result; it SHALL only restore Advancement Eligibility for evaluation by Governance-Gated Advancement's existing Advancement Authority. Every other existing Advancement Eligibility precondition SHALL still be satisfied before an Advancement Result may be produced.
- Withdrawn is explicitly excluded: withdrawal demonstrates only that a Recovery Requirement ceased to apply through separate authority, not that the rejected engineering condition was remediated. Extending eligibility to Withdrawn requires its own future RFC amendment and Sprint Owner ratification.
- Deferred and Escalation Required remain Blocking and unaffected — v1.12 creates no Recovery Requirement for either.

This amendment SHALL NOT modify `GovernanceDecision`'s value, semantics, lifecycle, or production (RFC-0011, unmodified); SHALL NOT modify Recovery Requirement's own lifecycle, ownership, Recovery Resolution Contract, or Recovery Withdrawal Contract (v1.12, unmodified); SHALL NOT mutate Workflow Chain topology or Workflow Step definitions; SHALL NOT modify Mission completion preconditions (RFC-0001, unmodified; Governed Mission Completion remains separately unauthorized); and SHALL NOT introduce a new Advancement Authority.

## Ownership Model (ratified)

This ratification amends RFC-0004's own text (Amendment History, new Workflow Advancement subsection) and therefore carries RFC-tier authority for that amendment, per RFC-0004/RFC-0011's shared Authority Hierarchy convention. It does not modify RFC-0011, RFC-0001–0003, RFC-0005–0010, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0004 to v1.13 as recorded in `knowledge/specifications/rfc-0004-execution-model.md` — complete;
2. update RFC-0004's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification authorizing Sprint 60's implementation of this amendment, narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Advancement eligibility for Withdrawn Recovery Requirements; event subscriptions/consumers of Recovery Requirement or Governance Decision events; Governed Mission Completion or any Mission completion precondition change; any differentiated Deferred/Escalation-Required treatment beyond uniform Blocking; Host or Adapter changes. Each remains unauthorized pending its own future RFC amendment and/or Sprint Owner scope ratification.

## Related Sprint(s)

- Sprint 60 — Recovery-Gated Re-Advancement (implements this amendment; companion Sprint-scope ratification to follow).
- Sprint 59 — Recovery Requirement Domain Event Publication (precedent; frozen, consumed read-only).
- Sprint 58 — Governance Recovery and Blocking-State Foundation (`RecoveryRequirement` aggregate, Recovery Resolution Contract; frozen, consumed read-only).
- Sprint 57 — Governance-Gated Workflow Advancement (Governance-Gated Advancement Strategy, v1.11; frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 60 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.13, adding Recovery-Gated Re-Advancement Eligibility to Governance-Gated Advancement, per the Governance Decision recorded above. A Resolved Recovery Requirement, exactly attributed to the Rejected `GovernanceDecision` governing a blocked workflow position and referencing the accepted engineering outcome that resolved it, restores that position's Advancement Eligibility for evaluation by the existing Governance-Gated Advancement authority; it does not reclassify the `GovernanceDecision` itself, does not itself produce an Advancement Result, and does not extend to Withdrawn Recovery Requirements. This amendment does not modify RFC-0011, Recovery Requirement's existing lifecycle or contracts, Workflow Chain topology, or Mission completion preconditions, and introduces no new Advancement Authority. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 60 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-012

## Ratification Identifier

NEXUS-RAT-2026-07-16-012

## Date

2026-07-16

## Subject

RFC-0001 Amendment Ratification — Governance-Gated Mission Completion. Amends RFC-0001 — Mission Model to Version 1.1, adding a new "§ 15a. Governance-Gated Mission Completion" section.

## Originating Request

Following Sprint 60's closure with zero open findings, `nexus-plan` performed a Repository Analysis. Sprint 60's Final Disposition named three unscheduled Milestone 9 candidates: (1) Withdrawn Recovery Requirement eligibility; (2) event subscriptions/consumers; (3) Governed Mission Completion, requiring its own RFC-0001 amendment. `nexus-plan` confirmed via `RATIFICATION_LEDGER.md` that none of the three had prior ratified law, and — noting Governed Mission Completion's greater scope and risk relative to the other two — recommended option (1) as the narrowest, most precedented increment. The Sprint Owner selected option (3), Governed Mission Completion, instead. `nexus-plan` drafted an initial amendment narrowing the ledger's only existing design sketch (`RATIFICATION_LEDGER.md` §§ 5664, 5915, 6006: "Review, `GovernanceDecision`, unresolved recovery, and Knowledge requirements") to the `GovernanceDecision`/Recovery Requirement subset only, deferring Review-outcome and Knowledge-requirement gating to future amendments, and flagging the unrelated, still-unresolved `MissionPaused` lifecycle inconsistency (RFC-0001 § 13; `IMPLEMENTATION_MANIFEST.md:180,188`) as out of scope. The Sprint Owner approved this narrowed scope but required the amendment wording be revised: (a) existing Mission completion preconditions (RFC-0001 v1.0, unmodified) SHALL be evaluated first, before Governance eligibility; (b) Recovery Requirement attribution SHALL remain RFC-0004 v1.12's existing full four-part (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) key — not redefined to a two-part (Mission, `GovernanceDecision`) key as `nexus-plan`'s first draft had proposed; (c) Mission completion evaluation SHALL consider every applicable `GovernanceDecision` attributed to the Mission, each independently satisfying the matrix; (d) the originating Rejected `GovernanceDecision` remains immutable and historically authoritative. While preparing the Sprint 61 Implementation Record against this revised text, `nexus-plan` discovered that (b) is not implementable: `GovernanceDecision` carries no `engineeringSessionId`/`workflowStepId`, and `MissionExecutionService.completeMission()` has no Engineering Session or Workflow Step context in scope, so the exact four-part Recovery Requirement attribution key required by (b) cannot be constructed at Mission Completion time — confirmed by source inspection of `governance-decision.ts`, `engineering-session.service.ts`, and `recovery-requirement-governance-decision.consumer.ts`. `nexus-plan` reported this finding to the Sprint Owner rather than resolve it unilaterally. The Sprint Owner directed that Recovery Requirement override be dropped from this amendment entirely — not loosened to a two-part key, and not bridged with new cross-subsystem plumbing — deferring Recovery-aware Mission completion to its own future RFC amendment. This ratification and RFC-0001 § 15a were revised in place to remove all Recovery Requirement content before this ratification issued in its final form.

## Governance Decision

**RFC-0001 Amendment Approved, with refinements incorporated.** The Sprint Owner amends RFC-0001 to Version 1.1, adding Governance-Gated Mission Completion.

### Ratified Semantics

Before a Mission may transition `Reviewing → Completed`, the existing Mission completion preconditions (RFC-0001 v1.0 § 8 Invariant 7, § 9 Lifecycle, § 10 Operations — unmodified) SHALL first be satisfied. Governance eligibility is then evaluated against every `GovernanceDecision` (RFC-0011) attributed to the Mission:

| Governance Decision | Mission Completion |
| --- | --- |
| Approved | Non-blocking |
| Rejected | Blocking |
| Deferred | Blocking |
| Escalation Required | Blocking |

- Mission Completion is rejected when any applicable `GovernanceDecision` is Blocking. Every applicable `GovernanceDecision` independently satisfies the matrix.
- This amendment introduces no Recovery Requirement consultation of any kind. RFC-0004 v1.12's Recovery Requirement attribution key is scoped to (Mission, Engineering Session, Workflow Step, `GovernanceDecision`) — the full four-part key, unmodified — and Mission Completion has no authoritative Engineering Session or Workflow Step context to supply it. This amendment SHALL NOT weaken that attribution matching, infer missing Engineering Session or Workflow Step context, or introduce new cross-subsystem plumbing bridging Mission Completion to Engineering Session/Workflow Step. A Rejected, Deferred, or Escalation Required `GovernanceDecision` therefore blocks Mission Completion unconditionally. Recovery-aware Mission completion requires its own future RFC amendment and Sprint Owner ratification.
- When no `GovernanceDecision` is attributed to the Mission, this section does not apply; existing Mission completion behavior (Sprint 4, unmodified) governs unchanged.

This amendment SHALL NOT modify `GovernanceDecision`, `GovernanceService`, `RecoveryRequirement`, `RecoveryRequirementService`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract (RFC-0004/RFC-0011, unmodified); SHALL NOT modify `WorkflowChain`, `WorkflowStep`, or `EngineeringSession`; SHALL NOT introduce Review-outcome or Knowledge-requirement completion gating, Withdrawn Recovery Requirement eligibility, Recovery-aware Mission completion, Mission-level Recovery Requirement projection or aggregation, Engineering Session/Workflow Step attribution bridging, or any resolution of the `MissionPaused` lifecycle inconsistency; and SHALL NOT introduce event publication/subscription or any Host/Adapter surface.

## Ownership Model (ratified)

This ratification amends RFC-0001's own text (Amendment History, new § 15a) and therefore carries RFC-tier authority for that amendment, per RFC-0004/RFC-0011's shared Authority Hierarchy convention. It does not modify RFC-0004, RFC-0011, RFC-0002–0003, RFC-0005–0010, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0001 to v1.1 as recorded in `knowledge/specifications/rfc-0001-mission-model.md` — complete;
2. update RFC-0001's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification authorizing Sprint 61's implementation of this amendment, narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Recovery-aware Mission completion; Mission-level Recovery Requirement projection or aggregation; Engineering Session/Workflow Step attribution bridging; Review-outcome completion gating; Knowledge-requirement completion gating; Withdrawn Recovery Requirement eligibility (still gated by `NEXUS-RAT-2026-07-16-010`/`-011`); `MissionPaused` lifecycle semantics; event subscriptions/consumers; Host or Adapter changes. Each remains unauthorized pending its own future RFC amendment and/or Sprint Owner scope ratification.

## Related Sprint(s)

- Sprint 61 — Governance-Gated Mission Completion (implements this amendment; companion Sprint-scope ratification to follow).
- Sprint 60 — Recovery-Gated Re-Advancement (related architectural precedent for a possible future Recovery-aware Mission completion amendment; frozen, consumed read-only; not extended by this amendment).
- Sprint 58 — Governance Recovery and Blocking-State Foundation (`RecoveryRequirement`, Recovery Resolution Contract; frozen, consumed read-only; not consumed by this amendment).
- Sprint 4 — Mission Execution (existing Mission completion precondition; frozen, consumed read-only).

## Related Review(s)

None yet. A Sprint 61 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0001 — Mission Model to Version 1.1, adding Governance-Gated Mission Completion, per the Governance Decision recorded above. Existing Mission completion preconditions (v1.0, unmodified) are evaluated first; every `GovernanceDecision` attributed to the Mission is then independently evaluated against the ratified matrix, using RFC-0004's existing Blocking/Non-Blocking classification. This amendment introduces no Recovery Requirement consultation: the Sprint Owner accepted `nexus-plan`'s finding that Mission Completion has no Engineering Session/Workflow Step context to construct RFC-0004 v1.12's exact attribution key, and directed that Recovery-aware Mission completion be deferred to its own future RFC amendment rather than weaken attribution matching or introduce new cross-subsystem plumbing. This amendment does not modify RFC-0004, RFC-0011, Recovery Requirement's existing lifecycle or contracts, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, or the `MissionPaused` inconsistency. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 61 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-013

## Ratification Identifier

NEXUS-RAT-2026-07-16-013

## Date

2026-07-16

## Subject

Sprint 61 Scope Ratification — Governance-Gated Mission Completion. Authorizes implementation of Governance-Gated Mission Completion as defined by `NEXUS-RAT-2026-07-16-012` (RFC-0001 v1.1).

## Originating Request

Following `NEXUS-RAT-2026-07-16-012`'s RFC-0001 v1.1 amendment, `nexus-plan` drafted an initial Sprint 61 scope proposal that included Recovery Requirement override, using `IRecoveryRequirementRepository.findByAttributionKey`. Before Builder handoff, `nexus-plan` discovered a feasibility conflict: `GovernanceDecision` carries no `engineeringSessionId`/`workflowStepId`, and `MissionExecutionService.completeMission()` has no Engineering Session or Workflow Step context in scope, so the exact four-part Recovery Requirement attribution key required by RFC-0004 v1.12 (and by `NEXUS-RAT-2026-07-16-012`'s prohibition on loosening it) cannot be constructed at Mission Completion time. `nexus-plan` reported this finding to the Sprint Owner, who directed that Sprint 61 drop Recovery Requirement override entirely rather than weaken attribution matching or introduce new cross-subsystem plumbing, and that `NEXUS-RAT-2026-07-16-012` and RFC-0001 v1.1 be revised accordingly before this ratification issued. `knowledge/specifications/rfc-0001-mission-model.md` § 15a and `NEXUS-RAT-2026-07-16-012` were revised in place (not superseded) to remove all Recovery Requirement content prior to recording this ratification. This ratification reflects the revised, Recovery-free scope directly; no separate revision history is required for this ratification since it is issued for the first time in its final form.

## Governance Decision

**Approved.** Sprint 61 — Governance-Gated Mission Completion is authorized for implementation, strictly as follows.

### Authorized Vertical Slice

Sprint 61 SHALL introduce:

- Optional constructor-injected `IGovernanceDecisionRepository` on `MissionExecutionService`, used exclusively within `completeMission` — after the existing, unmodified `assertCompletionPermitted` Task-completion precondition succeeds and before the Mission's status is persisted as `Completed` — to retrieve every `GovernanceDecision` attributed to the Mission via the existing, unmodified `IGovernanceDecisionRepository.enumerate()` method (read-only), filtered client-side by `missionId`. No repository interface change; no repository mutation; no `GovernanceService` invocation; no `RecoveryRequirement`/`IRecoveryRequirementRepository` reference of any kind.
- A pure, deterministic Mission Completion eligibility function implementing exactly the Required Behavioral Matrix below over the full set of applicable `GovernanceDecision`s, with no repository access, no persistence, and no mutation of `GovernanceDecision` or `Mission` state.
- `createKernelServices()` wiring so `MissionExecutionService` always receives the shared, production `IGovernanceDecisionRepository` instance.
- Unit and integration tests satisfying the Required Test Matrix below.

#### Required Behavioral Matrix (binding, per `NEXUS-RAT-2026-07-16-012` as revised)

| Governance Decision | Mission Completion |
| --- | --- |
| Approved | Non-blocking |
| Rejected | Blocking |
| Deferred | Blocking |
| Escalation Required | Blocking |
| No applicable `GovernanceDecision` | Non-blocking (existing Sprint 4 behavior unchanged) |

Every applicable `GovernanceDecision` SHALL independently satisfy the matrix; Mission Completion SHALL be rejected when any applicable `GovernanceDecision` is Blocking. This Sprint introduces no Recovery Requirement consultation of any kind — Rejected, Deferred, and Escalation Required are uniformly and unconditionally Blocking.

### Explicitly Unauthorized

Sprint 61 SHALL NOT modify: `GovernanceDecision`'s lifecycle or semantics, `GovernanceService`, `GovernanceEscalation`; `RecoveryRequirement`'s lifecycle, identity, or attribution, `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract; `WorkflowChain`, `WorkflowStep`, or `EngineeringSession`; Manual, Automatic/Event-Driven, Review-Gated, or Governance-Gated Advancement, or Recovery-Gated Re-Advancement Eligibility (Sprints 57/60, frozen); the existing `assertCompletionPermitted` Task-completion precondition (Sprint 4, unmodified — this Sprint's gate SHALL apply additively, after it succeeds); Review-outcome or Knowledge-requirement completion gating; Recovery-aware Mission completion; Mission-level Recovery Requirement projection or aggregation; Engineering Session/Workflow Step attribution bridging; the `MissionPaused` lifecycle inconsistency; any event subscriber/consumer; or Host or Adapter code. Sprint 61 SHALL introduce no `IRecoveryRequirementRepository` reference anywhere.

### Required Test Matrix

1. Every row of the Required Behavioral Matrix above, exercised as a dedicated test.
2. A Mission with two applicable `GovernanceDecision`s where at least one is Blocking SHALL NOT complete, regardless of the other's value (independent-satisfaction test).
3. The eligibility function is verified pure: given identical inputs it is deterministic, and a dedicated test confirms no repository or persistence call occurs within it.
4. `createKernelServices()` wires the shared, production `IGovernanceDecisionRepository` into `MissionExecutionService` (integration-level test).
5. `GovernanceDecision`, `GovernanceService`, `RecoveryRequirement`, `RecoveryRequirementService`, `WorkflowChain`, `EngineeringSession` remain byte-for-byte unmodified.
6. A Mission with no applicable `GovernanceDecision` completes exactly as before this Sprint (regression test against Sprint 4 behavior).
7. A source-level check (e.g. import-graph or grep-based negative test) confirms no `RecoveryRequirement`/`IRecoveryRequirementRepository` symbol is referenced by the new Mission Completion eligibility code.
8. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only; it operates at the Implementation Plan tier, below the RFC-tier authority already established by `NEXUS-RAT-2026-07-16-012`. It does not itself amend any RFC.

## Authorized Scope

`nexus-plan` is authorized to generate the Sprint 61 Sprint Implementation Record, activate Sprint 61 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, and prepare Builder handoff, strictly limited to the Authorized Vertical Slice, Required Behavioral Matrix, and Required Test Matrix above.

## Deferred Concepts

Recovery-aware Mission completion; Mission-level Recovery Requirement projection or aggregation; Engineering Session/Workflow Step attribution bridging; Withdrawn Recovery Requirement eligibility; Review-outcome completion gating; Knowledge-requirement completion gating; `MissionPaused` lifecycle semantics; event subscriptions/consumers; Host or Adapter changes.

## Related Sprint(s)

- Sprint 61 — Governance-Gated Mission Completion (this ratification's authorized scope).
- Sprint 60 — Recovery-Gated Re-Advancement (related architectural precedent for a possible future Recovery-aware Mission completion amendment; frozen, consumed read-only; not extended by this Sprint).
- Sprint 53 — Policy Evaluation and Governance Decision Foundation (`GovernanceDecision`, `IGovernanceDecisionRepository`; frozen, consumed read-only).
- Sprint 4 — Mission Execution (`MissionExecutionService.completeMission`, `assertCompletionPermitted`; extended additively, not redefined).

## Related Review(s)

None yet. A Sprint 61 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 61 — Governance-Gated Mission Completion, per the Governance Decision recorded above, implementing exactly the Required Behavioral Matrix via optional, production-wired `IGovernanceDecisionRepository` injection on `MissionExecutionService` and a pure, side-effect-free eligibility function evaluated over every applicable `GovernanceDecision`. This Sprint introduces no Recovery Requirement consultation: the Sprint Owner accepted `nexus-plan`'s feasibility finding that Mission Completion has no Engineering Session/Workflow Step context to construct RFC-0004 v1.12's exact attribution key, and directed that Recovery-aware Mission completion be deferred to its own future RFC amendment rather than weaken attribution matching. Sprint 61 SHALL implement only the Authorized Vertical Slice above. `nexus-plan` is authorized to record this ratification, generate the Sprint 61 Sprint Implementation Record, activate Sprint 61, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-011

## Ratification Identifier

NEXUS-RAT-2026-07-16-011

## Date

2026-07-16

## Subject

Sprint 60 Scope Ratification — Recovery-Gated Re-Advancement. Authorizes implementation of Recovery-Gated Re-Advancement Eligibility as defined by `NEXUS-RAT-2026-07-16-010` (RFC-0004 v1.13).

## Originating Request

Following `NEXUS-RAT-2026-07-16-010`'s RFC-0004 v1.13 amendment, `nexus-plan` drafted a Sprint 60 scope proposal grounded in the existing source: `EngineeringSession.advanceWorkflowAfterGovernanceDecision` and its private `assertNonBlockingGovernanceDecision` (`engineering-session.ts`), and the existing, unmodified `IRecoveryRequirementRepository.findByAttributionKey` lookup and `acceptedOutcomeReference` field (Sprint 58, frozen). The Sprint Owner approved the proposal with three refinements: (1) mandatory production repository injection in `createKernelServices()`, with optional injection preserved only for isolated construction/unit testing; (2) explicit fail-closed behavior when a Resolved snapshot lacks its `acceptedOutcomeReference`; (3) a strict separation between repository-lookup orchestration (`EngineeringSessionService`) and a pure, side-effect-free eligibility function.

## Governance Decision

**Approved, with refinements incorporated.** Sprint 60 — Recovery-Gated Re-Advancement is authorized for implementation, strictly as follows.

### Authorized Vertical Slice

Sprint 60 SHALL introduce:

- An optional constructor-injected `IRecoveryRequirementRepository` on `EngineeringSessionService`, used exclusively to call `findByAttributionKey({ missionId, engineeringSessionId, workflowStepId, governanceDecisionId })` ahead of invoking `EngineeringSession.advanceWorkflowAfterGovernanceDecision` — read-only; no repository mutation, no `RecoveryRequirementService` invocation.
- A pure, deterministic eligibility function (replacing or wrapping the existing `assertNonBlockingGovernanceDecision`) accepting the `GovernanceDecisionSnapshot` and an optional `RecoveryRequirementSnapshot`, and implementing exactly the Required Behavioral Matrix below. The function SHALL perform no repository access, no persistence, and SHALL mutate neither `GovernanceDecision` nor `RecoveryRequirement` state; it SHALL return or throw deterministically from its supplied inputs only.
- `createKernelServices()` updated so `EngineeringSessionService` always receives the shared, production `IRecoveryRequirementRepository` instance. Optional injection MAY remain solely for isolated unit-test construction or backward compatibility; production composition SHALL NOT omit it.

#### Required Behavioral Matrix (binding)

| Governance Decision | Recovery Requirement | Result |
| --- | --- | --- |
| Approved | Any or none | Existing approved path unchanged |
| Rejected | Missing | Blocking |
| Rejected | Open | Blocking |
| Rejected | Withdrawn | Blocking |
| Rejected | Resolved without `acceptedOutcomeReference` | Blocking (fail closed) |
| Rejected | Resolved with exact attribution and `acceptedOutcomeReference` present | Eligible for normal advancement evaluation |
| Deferred | Any | Blocking |
| Escalation Required | Any | Blocking |

A Recovery Requirement whose attribution key does not exactly match the Mission, Engineering Session, Workflow Step, and originating `GovernanceDecision` under evaluation SHALL be treated as absent (Missing). Restored eligibility SHALL NOT itself advance the workflow; `EngineeringSession.advanceWorkflowAfterGovernanceDecision`'s existing delegation to the unmodified `advanceWorkflow` remains the sole mechanism producing an Advancement Result.

### Explicitly Unauthorized

Sprint 60 SHALL NOT modify: `RecoveryRequirement`'s lifecycle, identity, or attribution; `RecoveryRequirementService`, `RecoveryRequirementGovernanceDecisionConsumer`, the Recovery Resolution Contract, or the Recovery Withdrawal Contract; `GovernanceDecision`'s lifecycle or semantics, or `GovernanceService`; `WorkflowChain` or `WorkflowStep`; Manual, Automatic/Event-Driven, or Review-Gated Advancement; any event subscriber/consumer; Host or Adapter code; or Governed Mission Completion.

### Required Test Matrix

1. Every row of the Required Behavioral Matrix above, exercised as a dedicated test.
2. A Resolved Recovery Requirement at a mismatched attribution key (different Mission, Engineering Session, Workflow Step, or `GovernanceDecision`) does not restore eligibility for the position under evaluation.
3. The eligibility function is verified pure: given identical inputs it is deterministic, and a dedicated test confirms no repository or persistence call occurs within it.
4. `createKernelServices()` wires the shared, production `IRecoveryRequirementRepository` into `EngineeringSessionService` (integration-level test).
5. `RecoveryRequirement`, `RecoveryRequirementService`, `GovernanceDecision`, `GovernanceService`, `WorkflowChain` remain byte-for-byte unmodified (dedicated `git diff`-style or negative test).
6. Manual, Automatic/Event-Driven, and Review-Gated Advancement remain unaffected (regression test).
7. Full repository validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only; it operates at the Implementation Plan tier, below the RFC-tier authority already established by `NEXUS-RAT-2026-07-16-010`. It does not itself amend any RFC.

## Authorized Scope

`nexus-plan` is authorized to generate the Sprint 60 Sprint Implementation Record, activate Sprint 60 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, and prepare Builder handoff, strictly limited to the Authorized Vertical Slice, incorporated Refinements, Required Behavioral Matrix, and Required Test Matrix above.

## Deferred Concepts

Advancement eligibility for Withdrawn Recovery Requirements; event subscriptions/consumers; Governed Mission Completion and any Mission completion precondition change; any differentiated Deferred/Escalation-Required treatment beyond uniform Blocking; Host or Adapter changes.

## Related Sprint(s)

- Sprint 60 — Recovery-Gated Re-Advancement (this ratification's authorized scope).
- Sprint 59 — Recovery Requirement Domain Event Publication (unaffected; frozen, consumed read-only).
- Sprint 58 — Governance Recovery and Blocking-State Foundation (`RecoveryRequirement`, Recovery Resolution Contract, `IRecoveryRequirementRepository.findByAttributionKey`; frozen, consumed read-only).
- Sprint 57 — Governance-Gated Workflow Advancement (`EngineeringSession.advanceWorkflowAfterGovernanceDecision`, `assertNonBlockingGovernanceDecision`; extended, not redefined).

## Related Review(s)

None yet. A Sprint 60 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 60 — Recovery-Gated Re-Advancement, per the Governance Decision recorded above, implementing exactly the Required Behavioral Matrix via an optional, production-wired `IRecoveryRequirementRepository` injection on `EngineeringSessionService` and a pure, side-effect-free eligibility function consuming its lookup result. Sprint 60 SHALL implement only the Authorized Vertical Slice above. `nexus-plan` is authorized to record this ratification, generate the Sprint 60 Sprint Implementation Record, activate Sprint 60, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-014

## Ratification Identifier

NEXUS-RAT-2026-07-16-014

## Date

2026-07-16

## Subject

Sprint 62 Scope Ratification — Governance Automation Integration Validation and Milestone 9 Certification. Authorizes a validation-only Sprint exercising the complete Sprint 52–61 governed engineering path end-to-end and producing a Milestone 9 closure recommendation.

## Originating Request

Following Sprint 61's closure (`NEXUS-REV-2026-07-16-012`) with no Current Milestone 9 Sprint remaining, `nexus-plan` presented four candidate directions for Sprint 62 — Withdrawn Recovery Requirement eligibility, Recovery-aware Mission completion, a narrow event consumer, and MissionPaused/MissionResumed lifecycle correction — each requiring its own future RFC amendment or narrower Sprint Owner scoping decision before it could be responsibly proposed. The Sprint Owner declined all four as the next Sprint and instead directed a certification Sprint validating the complete Sprint 52–61 governance chain as an integrated system, with a Milestone 9 closure decision contingent on its outcome.

## Governance Decision

**Approved as directed.** Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification is authorized for implementation, strictly as follows. Sprint 62 SHALL introduce no new production capability, lifecycle state, domain concept, event consumer, or architectural dependency.

### Authorized Vertical Slice

Sprint 62 SHALL introduce only:

- An integration test suite exercising the complete governed engineering path: Review → Repository Policy Evaluation → Ratification Authority Validation → Governance Decision → Governance Decision Event Publication → Governance-Gated Workflow Advancement → (Rejected) → Recovery Requirement Creation → Recovery Requirement Event Publication → Recovery Resolution → Recovery-Gated Re-Advancement → Governance-Gated Mission Completion, assembled exclusively from existing, frozen Sprint 52–61 services and repositories through their existing public contracts.
- A Milestone 9 certification verdict and closure recommendation, documented in the Sprint 62 Implementation Record.

No modification to any Sprint 1–61 production source is authorized, except a change strictly required to correct a genuine defect exposed by certification. Any such defect SHALL be reported and routed through the established review and recovery workflow rather than silently expanding Sprint scope.

### Required Scenarios (binding)

1. Approved governance path advances the Workflow and permits Mission completion.
2. Rejected governance blocks both Workflow advancement and Mission completion.
3. A Rejected `GovernanceDecision` creates exactly one Recovery Requirement.
4. An Open Recovery Requirement remains blocking.
5. A Resolved Recovery Requirement restores Workflow advancement eligibility.
6. A Resolved Recovery Requirement does not override Sprint 61's Governance-Gated Mission Completion rules.
7. Deferred remains blocking.
8. Escalation Required remains blocking.
9. A missing Review produces the established fail-closed behavior.
10. Ratification attribution that is Invalid or Unresolvable produces Escalation Required.
11. A cross-Mission attribution mismatch fails closed.
12. Idempotent evaluation produces no duplicate Governance Decisions, Recovery Requirements, or Domain Events.
13. Failed persistence publishes no Domain Event.
14. Existing RFC ownership and Kernel boundaries remain intact throughout the exercised path.

### Certification Scope

Conformance SHALL be assessed against RFC-0001 v1.1, RFC-0004 v1.13, RFC-0005, RFC-0006, RFC-0011, the Kernel Canon, the Implementation Constitution, and all Milestone 9 Ratifications.

### Explicitly Unauthorized

Sprint 62 SHALL NOT introduce: Withdrawn Recovery Requirement eligibility; Recovery-aware Mission completion; any `MissionPaused`/`MissionResumed` lifecycle correction; generic event subscription infrastructure; Host or Adapter governance UI; autonomous ratification; AI governance deliberation.

### Milestone Decision Authority

If Sprint 62 certification passes with no blocking findings, the next `nexus-plan` cycle SHALL declare Milestone 9 — Engineering Governance Automation complete, synchronize all repository-state artifacts, close Sprint 62, and begin planning the next milestone. No Sprint 63 SHALL be created solely for administrative certification unless Sprint 62 uncovers remediation work.

## Ownership Model (ratified)

This ratification authorizes Sprint scope only, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, generate the Sprint 62 Sprint Implementation Record, activate Sprint 62 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, and prepare Builder handoff, strictly limited to the Authorized Vertical Slice, Required Scenarios, and Certification Scope above.

## Deferred Concepts

Withdrawn Recovery Requirement eligibility; Recovery-aware Mission completion; `MissionPaused`/`MissionResumed` lifecycle correction; generic event subscription/consumer infrastructure; Host/Adapter governance surfacing; autonomous ratification; AI governance deliberation.

## Related Sprint(s)

- Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification (this ratification's authorized scope).
- Sprint 52 through Sprint 61 (all frozen, consumed read-only through existing public contracts).

## Related Review(s)

None yet. A Sprint 62 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification, per the Governance Decision recorded above: a validation-only integration test suite exercising the complete Sprint 52–61 governed engineering path through existing, frozen public contracts, producing a Milestone 9 certification verdict and closure recommendation. No new production capability, lifecycle state, domain concept, event consumer, or architectural dependency is authorized. `nexus-plan` is authorized to record this ratification, generate the Sprint 62 Sprint Implementation Record, activate Sprint 62, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-015

## Ratification Identifier

NEXUS-RAT-2026-07-16-015

## Date

2026-07-16

## Subject

Milestone 10 Opening Ratification — Autonomous Engineering Readiness. Opens Milestone 10, sets its binding Objective, Architectural Boundary, and Initial Capability Sequence, and authorizes Sprint 63 — Governance State Projection Foundation.

## Originating Request

Following Milestone 9's closure (declared complete this `nexus-plan` cycle per `NEXUS-RAT-2026-07-16-014`'s Milestone Decision Authority), `nexus-plan` presented four candidate directions for the next Sprint — Host/Adapter governance surfacing, isolated `MissionPaused`/`MissionResumed` lifecycle correction, generic event-subscription infrastructure, and further narrow Milestone 9 recovery refinements. The Sprint Owner declined all four as the opening of Milestone 10 and instead directed a new milestone built around closing the loop between the deterministic execution and governance foundations completed through Milestone 9, opening with a concrete Domain Event consumer rather than speculative infrastructure.

## Governance Decision

**Approved as directed.** Milestone 10 — Autonomous Engineering Readiness is opened, strictly as follows.

### Milestone 10 Objective (binding)

Transform the deterministic execution and governance foundations completed through Milestone 9 into a closed-loop engineering workflow capable of reacting to authoritative engineering outcomes with reduced manual coordination.

### Architectural Boundary (binding)

Milestone 10 SHALL NOT begin with:

- Host or Adapter governance UI;
- isolated `MissionPaused`/`MissionResumed` lifecycle correction;
- generic event-subscription infrastructure without a concrete consumer;
- further narrow Milestone 9 recovery refinements.

These MAY be addressed later as supporting work but do not define the milestone's opening architecture. Milestone 10 SHALL NOT introduce autonomous architectural decision-making, autonomous ratification, or AI governance deliberation at any point in its Initial Capability Sequence.

### Initial Capability Sequence (binding, sequencing only — each future step requires its own Sprint scope ratification)

1. **Governance State Projection** — a concrete Mission-scoped consumer of `GovernanceDecision` and `RecoveryRequirement` Domain Events, producing a deterministic read model of governance, recovery, advancement, escalation, and completion state. No workflow mutation or Host UI.
2. **Event-Driven Workflow Coordination** — uses the governance projection to invoke existing advancement and completion authorities through public contracts. Introduces no new governance decision semantics.
3. **Recovery Workflow Automation** — converts authoritative Recovery Requirements into governed recovery execution using existing Engineering Sessions, Workflow Chains, Roles, and Adapters. No autonomous architectural decision-making.
4. **Autonomous Engineering Integration Validation** — validates the complete Plan → Build → Review → Govern → Recover → Re-review → Advance → Complete lifecycle.

This sequence governs ordering only; it does not pre-authorize any step beyond Sprint 63 below.

### Sprint 63 Authorization (binding)

Sprint 63 — Governance State Projection Foundation is authorized for implementation. Sprint 63 SHALL implement the first concrete Domain Event consumer and a Mission-scoped governance projection. Generic subscription infrastructure MAY be introduced only to the minimum extent required by this concrete projection and SHALL NOT become an independent framework-building exercise.

Sprint 63 SHALL NOT introduce: Host governance surfacing; `MissionPaused`/`MissionResumed` correction; Recovery-aware Mission completion attribution bridging; autonomous planning; AI architectural ratification; unrestricted workflow mutation.

### Certification Scope

Sprint 63 conformance SHALL be assessed against RFC-0004 v1.13, RFC-0005, RFC-0011, RFC-0001 v1.1, the Kernel Canon, the Implementation Constitution, and this ratification.

## Ownership Model (ratified)

This ratification opens a new Milestone and authorizes one Sprint's scope, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, open Milestone 10 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, generate the Sprint 63 Sprint Implementation Record, activate Sprint 63, and prepare Builder handoff, strictly limited to the Objective, Architectural Boundary, and Sprint 63 Authorization above.

## Deferred Concepts

Host/Adapter governance surfacing; `MissionPaused`/`MissionResumed` lifecycle correction; generic event-subscription infrastructure as an independent framework; Withdrawn Recovery Requirement eligibility; Recovery-aware Mission completion; Milestone 10 Steps 2–4 of the Initial Capability Sequence (each requires its own future Sprint scope ratification).

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (this ratification's authorized scope).
- Sprint 52 through Sprint 62 (Milestone 9, frozen, consumed read-only through existing public contracts).

## Related Review(s)

- `NEXUS-REV-2026-07-16-015` — Pre-Implementation Blocking Review. Confirmed the Sprint 63 Sprint Implementation Record's Objective exceeded this ratification's actual (Mission-scoped) authorization by requiring Workflow-Step-level attribution no authorized data source can supply. Category 5 — Governance Decision Required finding; resolved by `NEXUS-RAT-2026-07-16-016`.

## Full Ratification Text

> The Sprint Owner opens Milestone 10 — Autonomous Engineering Readiness, per the Governance Decision recorded above: its binding Objective is to transform the deterministic execution and governance foundations completed through Milestone 9 into a closed-loop engineering workflow capable of reacting to authoritative engineering outcomes with reduced manual coordination. Milestone 10 SHALL NOT begin with Host/Adapter governance UI, isolated `MissionPaused`/`MissionResumed` lifecycle correction, generic event-subscription infrastructure without a concrete consumer, or further narrow Milestone 9 recovery refinements. The Initial Capability Sequence is: (1) Governance State Projection, (2) Event-Driven Workflow Coordination, (3) Recovery Workflow Automation, (4) Autonomous Engineering Integration Validation. Sprint 63 — Governance State Projection Foundation is authorized now: the first concrete Domain Event consumer and Mission-scoped governance projection, with generic subscription infrastructure introduced only to the minimum extent this concrete projection requires. `nexus-plan` is authorized to record this ratification, open Milestone 10, generate the Sprint 63 Sprint Implementation Record, activate Sprint 63, and prepare Builder handoff.

## Current Status

Active — Sprint 63's scope is further narrowed by `NEXUS-RAT-2026-07-16-016`; this ratification's Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified and in effect.

---

# NEXUS-RAT-2026-07-16-016

## Ratification Identifier

NEXUS-RAT-2026-07-16-016

## Date

2026-07-16

## Subject

Sprint 63 Scope Narrowing — Governance State Projection Foundation. Resolves `NEXUS-REV-2026-07-16-015-F-001` (Category 5 — Governance Decision Required) by narrowing Sprint 63's Objective to Mission-scoped-only governance state projection, removing all Workflow-Step-level attribution requirements.

## Originating Request

`NEXUS-REV-2026-07-16-015` found that the Sprint 63 Sprint Implementation Record's Objective — reporting the latest `GovernanceDecision` outcome "per Workflow position" — exceeded what `NEXUS-RAT-2026-07-16-015` actually authorizes (a Mission-scoped read model) and cannot be satisfied by any authorized data source: `GovernanceDecisionRecorded` carries only Mission/Governance-Decision identity, `GovernanceDecision` owns no Workflow-Step attribution, and existing consumers obtain Workflow-Step position exclusively from caller-supplied command context. The Builder correctly performed no implementation and reported the blocker. The Sprint Owner reviewed the finding and elected to narrow Sprint 63's scope rather than pursue an RFC-0005 amendment.

## Governance Decision

**Approved as directed — narrowed scope.** Sprint 63 — Governance State Projection Foundation remains authorized, strictly re-scoped as follows. This ratification narrows, and does not expand, `NEXUS-RAT-2026-07-16-015`'s authorization; it introduces no new production capability, lifecycle state, domain concept, or architectural dependency beyond what `NEXUS-RAT-2026-07-16-015` already authorized.

### Revised Sprint 63 Objective (binding, supersedes the Objective in the original Sprint 63 Sprint Implementation Record)

Implement a deterministic, Mission-scoped `GovernanceStateProjection`. The projection SHALL report, per Mission:

- the latest authoritative `GovernanceDecision` and its outcome;
- unresolved Recovery Requirements and their lifecycle state;
- whether any governance state remains Blocking;
- whether Escalation Required is present;
- Mission-level governance diagnostics and attribution.

### Event Inputs (binding)

The projection MAY consume only: `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, `RecoveryRequirementWithdrawn`. All projection state SHALL be derived solely from authoritative event payloads and resolvable public contracts.

### Explicit Prohibitions (binding)

Sprint 63 SHALL NOT:

- infer Engineering Session or Workflow Step identity from any source;
- modify `GovernanceDecisionRecorded` or any other existing event type;
- modify the `GovernanceDecision` aggregate;
- introduce an attribution convention not defined by existing repository law;
- reuse transient caller-supplied command context inside a passive `EventBus` projection;
- amend RFC-0005 or RFC-0011.

### Explicitly Deferred (unchanged in kind from the original Sprint 63 record, restated for clarity)

Per-Engineering-Session governance projection; per-Workflow-Step governance projection; Workflow-position attribution in Governance events or in `GovernanceDecision`; Event-Driven Workflow Coordination (Milestone 10 Step 2); Host governance UI; Recovery-aware Mission completion. Any future Workflow-position projection SHALL require its own RFC ownership analysis and a dedicated Sprint Owner ratification.

### Certification Scope

Unchanged from `NEXUS-RAT-2026-07-16-015`: RFC-0004 v1.13, RFC-0005, RFC-0011, RFC-0001 v1.1, the Kernel Canon, the Implementation Constitution, `NEXUS-RAT-2026-07-16-015`, and this ratification.

## Ownership Model (ratified)

This ratification narrows one Sprint's scope, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice. It supersedes only the per-Workflow-position language in the original Sprint 63 Sprint Implementation Record; `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, revise the Sprint 63 Sprint Implementation Record to the Revised Sprint 63 Objective above, return Sprint 63 to an implementation-ready status, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` accordingly, and prepare a corrected Builder handoff.

## Deferred Concepts

Per-Engineering-Session governance projection; per-Workflow-Step governance projection; Workflow-position attribution in Governance events or `GovernanceDecision`; Event-Driven Workflow Coordination; Recovery Workflow Automation; Autonomous Engineering Integration Validation; Host governance UI; Recovery-aware Mission completion.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (this ratification's narrowed authorized scope).

## Related Review(s)

- `NEXUS-REV-2026-07-16-015` — the Category 5 finding this ratification resolves.

## Full Ratification Text

> The Sprint Owner accepts the Builder stop condition and the Reviewer's Category 5 finding (`NEXUS-REV-2026-07-16-015-F-001`). The Sprint 63 Implementation Record exceeded the scope authorized by `NEXUS-RAT-2026-07-16-015` by requiring Governance State to be projected per Workflow position. Current authoritative contracts provide Mission-scoped attribution only. Sprint 63 SHALL NOT infer Engineering Session or Workflow Step identity; modify `GovernanceDecisionRecorded`; modify `GovernanceDecision`; introduce an attribution convention not defined by repository law; reuse transient caller context inside a passive EventBus projection; or amend RFC-0005 or RFC-0011. The Revised Sprint 63 Objective is: implement a deterministic Mission-scoped `GovernanceStateProjection` reporting, per Mission, the latest authoritative Governance Decision, its outcome, unresolved Recovery Requirements, Recovery Requirement lifecycle state, whether any governance state remains blocking, whether escalation is required, and Mission-level governance diagnostics and attribution — derived solely from `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn`. Per-Engineering-Session and per-Workflow-Step governance projection, Workflow-position attribution in Governance events or `GovernanceDecision`, event-driven workflow advancement, Host governance UI, and Recovery-aware Mission completion all remain deferred. `nexus-plan` SHALL revise the Sprint 63 Implementation Record, remove all per-Workflow-position requirements, preserve the existing ratification's Mission-scoped intent, return Sprint 63 to an implementation-ready state, and prepare a corrected Builder handoff. No production implementation SHALL begin until the revised Sprint record is persisted.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-017

## Ratification Identifier

NEXUS-RAT-2026-07-16-017

## Date

2026-07-16

## Subject

Milestone 10 Step 2 Scope Narrowing — Event-Driven Workflow Coordination limited to Event-Driven Mission Completion. Authorizes Sprint 64.

## Originating Request

`nexus-plan`'s Sprint 64 candidacy analysis found that `NEXUS-RAT-2026-07-16-015`'s Initial Capability Sequence Step 2 ("uses the governance projection to invoke existing advancement and completion authorities") is only partially satisfiable by the Sprint 63 `GovernanceStateProjection`. `MissionExecutionService.completeMission` requires only `missionId` and is satisfiable Mission-scoped. `GovernanceGatedWorkflowAdvancementConsumer.handleGovernanceDecisionRecorded` requires `engineeringSessionId` and `currentWorkflowStepId`, which RFC-0004 (Workflow Advancement, §366/§404/§419) defines as inherently Engineering-Session/Workflow-Step-scoped. The Mission-scoped-only `GovernanceStateProjection` cannot supply this, and `NEXUS-RAT-2026-07-16-016` already prohibits inferring or reusing transient caller context for that purpose — the same constraint that blocked Sprint 63's original scope. The Sprint Owner selected narrowing Step 2 to Mission Completion only.

## Governance Decision

**Approved as directed — narrowed scope.** Milestone 10 Step 2 — Event-Driven Workflow Coordination — is authorized now, strictly limited to **Event-Driven Mission Completion**: a concrete consumer of existing `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` Domain Events that, upon confirming (via the Mission-scoped `GovernanceStateProjection`) that a Mission's governance state is fully non-blocking, invokes the existing, unmodified `MissionExecutionService.completeMission` authority through its existing public contract. No new governance decision semantics or completion authority is introduced; `completeMission` already performs its own independent governance-eligibility and Task-completeness checks — this Sprint adds only the deterministic trigger.

Event-Driven Workflow Advancement (the `engineeringSessionId`/`currentWorkflowStepId`-scoped remainder of Step 2) remains **deferred**, pending its own future RFC ownership analysis and dedicated Sprint Owner ratification for a session/step-scoped governance data source, per `NEXUS-RAT-2026-07-16-016`'s existing restriction. This ratification does not authorize that analysis or any session/step-scoped projection or extension.

### Sprint 64 Authorization (binding)

Sprint 64 — Event-Driven Mission Completion is authorized for implementation. The Sprint Implementation Record SHALL incorporate the Sprint Owner's activation-time refinement: the coordinator SHALL be a Domain Event consumer of `GovernanceDecisionRecorded`/`RecoveryRequirementCreated`/`RecoveryRequirementResolved`/`RecoveryRequirementWithdrawn` (the `GovernanceStateProjection` is a read model consulted per-event, never treated as an independent event source), SHALL be idempotent and safe under duplicate/replayed events with no automatic retry, and SHALL NOT modify `GovernanceStateProjection`, `GovernanceDecision`, `RecoveryRequirement`, `MissionExecutionService`, Mission completion semantics, any existing Domain Event contract, any repository, or any Host/Adapter file.

### Certification Scope

Sprint 64 conformance SHALL be assessed against RFC-0004 v1.13, RFC-0005, RFC-0011, RFC-0001 v1.1, the Kernel Canon, the Implementation Constitution, `NEXUS-RAT-2026-07-16-015`, `NEXUS-RAT-2026-07-16-016`, and this ratification.

## Ownership Model (ratified)

This ratification narrows one Initial-Capability-Sequence step's scope and authorizes one Sprint, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified; `NEXUS-RAT-2026-07-16-016`'s Sprint 63 scope remains unmodified and frozen.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Sprint 64, generate the Sprint 64 Sprint Implementation Record incorporating the activation-time refinement above, activate Sprint 64, and prepare Builder handoff.

## Deferred Concepts

Event-Driven Workflow Advancement; `EngineeringSession`/`WorkflowStep` attribution of any kind; session/step-scoped governance projections or extensions; Recovery Workflow Automation (Milestone 10 Step 3); Autonomous Engineering Integration Validation (Milestone 10 Step 4); autonomous recovery; autonomous decision-making; any new completion authority.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (frozen, consumed read-only).
- Sprint 64 — Event-Driven Mission Completion (this ratification's authorized scope).

## Related Review(s)

None yet — Sprint 64 has not been reviewed.

## Full Ratification Text

> The Sprint Owner reviewed `nexus-plan`'s finding that Milestone 10 Step 2 as sequenced by `NEXUS-RAT-2026-07-16-015` cannot be implemented as a single coherent Sprint: Mission Completion is satisfiable Mission-scoped, but Workflow Advancement requires Engineering-Session/Workflow-Step attribution the Mission-scoped-only `GovernanceStateProjection` is prohibited from supplying. Step 2 is narrowed to Event-Driven Mission Completion only. Sprint 64 SHALL implement a Domain Event consumer of `GovernanceDecisionRecorded`, `RecoveryRequirementCreated`, `RecoveryRequirementResolved`, and `RecoveryRequirementWithdrawn` that, for each relevant event, resolves the event's `missionId`, reads the current Mission-scoped `GovernanceStateProjection`, confirms no blocking Governance Decision, unresolved Recovery Requirement, or escalation state remains, and invokes the existing `MissionExecutionService.completeMission(missionId)` public contract only when fully non-blocking, preserving all existing Mission completion rules and diagnostics without reinterpretation. The `GovernanceStateProjection` SHALL be consulted as a read model per-event, never treated as an independent event source. The coordinator SHALL be deterministic and safe under duplicate or replayed events: a Mission SHALL NOT be successfully completed more than once; an already-completed Mission SHALL be treated as a benign no-op or observable terminal-state rejection per the existing `completeMission` contract; no automatic retry behavior SHALL be introduced; failed completion attempts SHALL remain observable through deterministic diagnostics. Sprint 64 SHALL NOT modify `GovernanceStateProjection`, `GovernanceDecision`, `RecoveryRequirement`, `MissionExecutionService`, Mission completion semantics, existing Domain Event contracts, repositories, or Host/Adapter layers, and SHALL NOT introduce Event-Driven Workflow Advancement, Engineering Session or Workflow Step attribution, session/step-scoped governance projections, autonomous recovery, autonomous decision-making, or new completion authority. `nexus-plan` SHALL record this ratification, update planning artifacts, generate the Sprint 64 Sprint Implementation Record incorporating this refinement, activate Sprint 64, and prepare Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-16-018

## Ratification Identifier

NEXUS-RAT-2026-07-16-018

## Date

2026-07-16

## Subject

Milestone 10 Attribution Gap Resolution — EngineeringSession Domain Event Publication authorized as the prerequisite foundation for Event-Driven Workflow Advancement and Recovery Workflow Automation. Authorizes Sprint 65.

## Originating Request

`nexus-plan`'s post-Sprint-64 Governance Scan found that both remaining Milestone 10 Initial Capability Sequence steps — the `engineeringSessionId`/`currentWorkflowStepId`-scoped remainder of Step 2 (Event-Driven Workflow Advancement) and Step 3 (Recovery Workflow Automation) — are blocked by the same root cause: no authorized data source can deterministically supply Engineering-Session/Workflow-Step attribution to an automatic, event-driven Kernel consumer. `GovernanceDecision`/`GovernanceDecisionRecorded` are Mission-scoped only by design (`NEXUS-RAT-2026-07-16-004`, reaffirmed by `NEXUS-RAT-2026-07-16-016`). The existing consumers that do act on session/step position (`GovernanceGatedWorkflowAdvancementConsumer`, `RecoveryRequirementGovernanceDecisionConsumer`) require `engineeringSessionId`/`workflowStepId` as caller-supplied command input, not as event-derived data — they are not auto-wired `EventBusContract` subscribers. `EngineeringSession` itself was independently confirmed to publish zero Domain Events (no `engineering-session.events.ts`; no `EventBusContract` usage anywhere in `engineering-session.service.ts`), so no session/step read model can be built from its state today.

## Governance Decision

**Approved — EngineeringSession Domain Event Publication authorized as Sprint 65, per Option B.** Session/workflow-step attribution SHALL originate from the `EngineeringSession` domain, which already owns Engineering Session identity, current Workflow position, Workflow advancement state, and session lifecycle. `GovernanceDecisionRecorded` SHALL remain unchanged and Mission-scoped; no session or Workflow Step attribution SHALL be inferred from Governance events. The resolution SHALL follow the repository's established implementation pattern: Domain Event Publication → Session State Projection → Event-Driven Consumers. Sprint 65 implements exactly the first step.

### Sprint 65 Authorization (binding)

Sprint 65 — EngineeringSession Domain Event Publication is authorized for implementation exactly as specified in `knowledge/implementation/sprints/sprint-0065-engineeringsession-domain-event-publication.md`, including: `EngineeringSession` recorded-events collection and `pullDomainEvents()`; optional constructor-injected `EventBusContract` on `EngineeringSessionService` using the existing `requireEventBus()` guard pattern; exactly two canonical events (`EngineeringSessionCreated`, `EngineeringSessionWorkflowAdvanced`) published only after successful persistence for `createEngineeringSession`, `advanceWorkflow`, `advanceWorkflowOnTrigger`, `advanceWorkflowAfterReview`, and `advanceWorkflowAfterGovernanceDecision`; a single canonical `EngineeringSessionWorkflowAdvanced` event shape across all four advancement strategies, carrying the triggering strategy as a closed-vocabulary data field (`Direct`/`Trigger`/`ReviewGated`/`GovernanceGated`); no event emission during rehydration, on failed/rejected operations, or when no state transition occurred.

### Certification Scope

Sprint 65 conformance SHALL be assessed against RFC-0005, RFC-0004 v1.13, the Kernel Canon, the Implementation Constitution, `NEXUS-RAT-2026-07-16-015`, `NEXUS-RAT-2026-07-16-016`, `NEXUS-RAT-2026-07-16-017`, and this ratification.

## Ownership Model (ratified)

This ratification resolves a governance ambiguity discovered during Milestone 10 planning and authorizes one Sprint, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified; `NEXUS-RAT-2026-07-16-016`'s Sprint 63 scope and `NEXUS-RAT-2026-07-16-017`'s Sprint 64 scope remain unmodified and frozen.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Sprint 65, generate the Sprint 65 Sprint Implementation Record, activate Sprint 65, and prepare Builder handoff.

## Deferred Concepts

Session State Projection (a future Sprint consuming Sprint 65's event stream); Event-Driven Workflow Advancement and Recovery Workflow Automation consumers (require Session State Projection first); `closeEngineeringSession`/checkpoint/recovery/handoff/execution-session event publication; Autonomous Engineering Integration Validation (Milestone 10 Step 4); any event subscription/consumer of any kind; any change to `GovernanceDecisionRecorded`, `GovernanceDecision`, or `RecoveryRequirement`.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (frozen, unaffected).
- Sprint 64 — Event-Driven Mission Completion (frozen, unaffected).
- Sprint 65 — EngineeringSession Domain Event Publication (this ratification's authorized scope).

## Related Review(s)

None yet — Sprint 65 has not been reviewed.

## Full Ratification Text

> The Sprint Owner reviewed `nexus-plan`'s finding that both remaining Milestone 10 Initial Capability Sequence steps are blocked by the same root cause: no authorized data source supplies Engineering-Session/Workflow-Step attribution to an automatic, event-driven Kernel consumer, and `EngineeringSession` itself publishes no Domain Events today. Session/workflow-step attribution SHALL originate from the `EngineeringSession` domain rather than from an extension to `GovernanceDecisionRecorded` or from preserved caller-supplied orchestration context. The resolution SHALL follow the sequence: Domain Event Publication → Session State Projection → Event-Driven Consumers. Sprint 65 — EngineeringSession Domain Event Publication is authorized to implement exactly the first step: `EngineeringSession` recorded-events and `pullDomainEvents()`; optional `EventBusContract` injection into `EngineeringSessionService`; exactly two canonical events, `EngineeringSessionCreated` and `EngineeringSessionWorkflowAdvanced` (the latter published identically across all four existing advancement strategies, with the strategy carried as closed-vocabulary event data, not as separate event types); publication strictly after successful persistence, never during rehydration, on rejection, or when no transition occurred. Sprint 65 SHALL NOT introduce event consumers, projections, workflow automation, or new Engineering Session behavior, and SHALL NOT modify `GovernanceDecision`, `GovernanceDecisionRecorded`, `RecoveryRequirement`, Review domain ownership, `WorkflowChain` semantics, Execution Strategy semantics, or any `src/hosts`/`src/adapters` file. `nexus-plan` SHALL record this ratification, update planning artifacts, generate the Sprint 65 Sprint Implementation Record, activate Sprint 65, and prepare Builder handoff.

## Current Status

Superseded by `NEXUS-RAT-2026-07-16-019` (Sprint 65 Mission-attribution scope revision, following a Builder block; this ratification's Milestone 10 attribution-gap resolution and general Sprint 65 authorization otherwise remain in force).

---

# NEXUS-RAT-2026-07-16-019

## Ratification Identifier

NEXUS-RAT-2026-07-16-019

## Date

2026-07-16

## Subject

Sprint 65 Scope Revision — Mission attribution for `EngineeringSessionWorkflowAdvanced` SHALL be resolved exclusively through the existing, RFC-0004-owned Mission Engineering Group association, not through caller-supplied input or a new `EngineeringSession`-owned field. `EngineeringSessionCreated` is deferred from Sprint 65 entirely.

## Originating Request

The Builder correctly stopped before writing code (`IMPLEMENTATION_CONSTITUTION.md` "Documentation Before Code"), reporting that Sprint 65 as originally authorized by `NEXUS-RAT-2026-07-16-018` requires `EngineeringSessionCreated`/`EngineeringSessionWorkflowAdvanced` to include `missionId`, but neither `EngineeringSession`, `CreateEngineeringSessionCommand`, nor `WorkflowChain` carries any Mission attribution, and Sprint 65 forbids both new `EngineeringSession` lifecycle semantics and operation-signature changes beyond additive `EventBusContract` injection. `nexus-plan` independently verified this in source (`engineering-session.ts`, `engineering-session.types.ts`, `engineering-session.service.ts`, `workflow-chain.ts` — no `missionId` field anywhere) and further identified that RFC-0004's "Multi-Agent Engineering Orchestration Foundation" section already assigns Mission-to-Engineering-Session association ownership to a separate, existing, approved capability — Mission Engineering Group (`mission-engineering-group.ts`, `MissionEngineeringOrchestrationService`) — which `EngineeringSession` explicitly must not duplicate. That capability currently exposes only a forward `missionId → engineeringSessionIds` lookup (`enumerateMissionEngineeringGroup`); no reverse lookup exists, and association is a separate, optional operation not guaranteed to exist at Engineering Session creation time. `nexus-plan` also confirmed that `IMissionEngineeringGroupRepository`'s in-memory implementation indexes groups by `missionId` only and does not prevent the same `engineeringSessionId` from being added to more than one Mission's group, so an unguarded reverse lookup could be ambiguous.

## Governance Decision

**Approved — revised scope.** The Builder's stop is valid. `EngineeringSession` does not own Mission association, and an unvalidated caller-supplied `missionId` SHALL NOT be accepted as authoritative attribution merely to satisfy the Domain Event contract. RFC-0004 already assigns Mission-to-Engineering-Session association ownership to Mission Engineering Group; Sprint 65 SHALL preserve that ownership boundary.

Rejected approaches: storing `missionId` directly on `EngineeringSession`; accepting an unvalidated caller-supplied `missionId`; inferring Mission identity from `WorkflowChain`, Review, Governance Decision, or unrelated runtime state; publishing Mission-attributed events when no authoritative association exists; removing `missionId` from Domain Events in violation of RFC-0005.

### Required Contract Extension (binding)

Sprint 65 is authorized to introduce a read-only reverse-association query within the existing Mission Engineering Group ownership boundary (exact method name is an implementation detail; e.g. `IMissionEngineeringGroupRepository`/`MissionEngineeringOrchestrationServiceContract` gains a query resolving `EngineeringSessionId → MissionId`). The query SHALL be: read-only; deterministic; owned by the existing Mission Engineering Group capability; return exactly one associated Mission identity; fail when no association exists; fail when association is ambiguous (more than one Mission's group contains the session); and SHALL NOT mutate Mission Engineering Groups or Engineering Sessions, and SHALL NOT introduce duplicate Mission state into `EngineeringSession`.

### Revised Canonical Events (binding, supersedes the original Sprint 65 record's Canonical Events section)

- **`EngineeringSessionWorkflowAdvanced`** remains authorized. Before publishing, `EngineeringSessionService` SHALL resolve the authoritative Mission association through the approved read-only Mission Engineering Group query. Publication SHALL occur only when: (1) Workflow advancement succeeds; (2) Engineering Session persistence succeeds; (3) exactly one authoritative Mission association is resolved. If Mission attribution is missing or ambiguous, the operation SHALL fail closed, no Domain Event SHALL be published, and no caller-supplied fallback SHALL be used. The event SHALL include authoritative `missionId`, `engineeringSessionId`, previous `workflowStepId`, new `workflowStepId`, and advancement strategy.
- **`EngineeringSessionCreated` is deferred from Sprint 65 entirely.** It cannot truthfully include authoritative `missionId` at Engineering Session creation time because Mission association is established through a separate operation after creation, and Sprint 65 SHALL NOT fabricate or prematurely assert that association. A future Sprint MAY introduce an authoritative Mission-association event (for example `EngineeringSessionAssociatedWithMission`, published by the Mission Engineering Group owner after successful association and persistence) or a future RFC amendment MAY authorize an atomic create-and-associate use case; neither is authorized now. `createEngineeringSession` remains behaviorally unchanged and SHALL NOT publish a Mission-attributed Domain Event in Sprint 65.

### Revised Authorized Operations (binding)

Event publication applies only to the successful existing advancement operations: `advanceWorkflow`, `advanceWorkflowOnTrigger`, `advanceWorkflowAfterReview`, `advanceWorkflowAfterGovernanceDecision`.

### Certification Scope

Sprint 65 conformance SHALL be assessed against RFC-0005, RFC-0004 v1.13 (including its Multi-Agent Engineering Orchestration Foundation / Mission Engineering Group ownership), the Kernel Canon, the Implementation Constitution, `NEXUS-RAT-2026-07-16-015`, `-016`, `-017`, `-018`, and this ratification.

## Ownership Model (ratified)

This ratification revises one Sprint's scope, at the Implementation Plan tier, following a Builder-reported block. It amends no RFC and redefines no previously approved vertical slice; it clarifies that Mission Engineering Group (RFC-0004, existing) — not `EngineeringSession` — owns Mission attribution, consistent with RFC-0004's existing text. `NEXUS-RAT-2026-07-16-018`'s Milestone 10 attribution-gap resolution and its authorization of Sprint 65 as the prerequisite foundation Sprint remain unmodified; only Sprint 65's Canonical Events and Authorized Operations are revised as specified above.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, revise the Sprint 65 Sprint Implementation Record, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for the revised Sprint 65 scope, and re-issue Builder handoff.

## Deferred Concepts

`EngineeringSessionCreated`; `EngineeringSessionAssociatedWithMission`; atomic Engineering Session creation and Mission association; changes to Mission Engineering Group lifecycle beyond the one authorized read-only reverse query; caller-supplied Mission attribution; persistent `missionId` on `EngineeringSession`; event consumers; Session State Projection; workflow coordination.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (frozen, unaffected).
- Sprint 64 — Event-Driven Mission Completion (frozen, unaffected).
- Sprint 65 — EngineeringSession Domain Event Publication (this ratification's revised scope).

## Related Review(s)

None yet — Sprint 65 has not been reviewed. This ratification responds to a pre-implementation Builder block, not a Reviewer finding.

## Full Ratification Text

> The Builder correctly stopped before implementing Sprint 65 upon discovering that `EngineeringSessionCreated`/`EngineeringSessionWorkflowAdvanced` cannot truthfully carry `missionId` because no authorized data source on `EngineeringSession`, `CreateEngineeringSessionCommand`, or `WorkflowChain` supplies it. Mission attribution SHALL originate exclusively from the existing, RFC-0004-owned Mission Engineering Group association, never from a new `EngineeringSession`-owned field, an unvalidated caller-supplied value, or inference from unrelated domains. Sprint 65 is authorized to add exactly one read-only, deterministic reverse-association query to the existing Mission Engineering Group capability (`EngineeringSessionId → MissionId`), which SHALL fail closed on a missing or ambiguous association. `EngineeringSessionWorkflowAdvanced` remains authorized and SHALL be published only when advancement succeeds, persistence succeeds, and exactly one Mission association resolves; it SHALL include authoritative `missionId`, `engineeringSessionId`, previous and new `workflowStepId`, and advancement strategy. `EngineeringSessionCreated` is deferred from Sprint 65 entirely, since Mission association is established through a separate operation after creation and SHALL NOT be fabricated or prematurely asserted. `nexus-plan` SHALL record this ratification, revise the Sprint 65 Sprint Implementation Record, update planning artifacts, and re-issue Builder handoff under the revised scope.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-001

## Ratification Identifier

NEXUS-RAT-2026-07-17-001

## Date

2026-07-17

## Subject

Sprint 66 Scope Ratification — Engineering Session State Projection. Resolves the `nexus-plan` Sprint Proposal presented after Sprint 65's certification (`NEXUS-REV-2026-07-17-001`), authorizing a read-only projection of `EngineeringSessionWorkflowAdvanced` events.

## Originating Request

None. This ratification originates from a `nexus-plan` Sprint Proposal (Sprint 66 — Engineering Session State Projection), approved by the Sprint Owner with binding refinements.

## Governance Decision

**Approved with refinements.** The Sprint Owner authorizes Sprint 66 — Engineering Session State Projection as Milestone 10's next Sprint, implementing the Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018` ("EngineeringSession Session State Projection").

**Objective (binding):** Introduce a deterministic, read-only projection of observed `EngineeringSession` Workflow position changes by consuming exactly the existing `EngineeringSessionWorkflowAdvanced` event stream (Sprint 65, frozen) through the existing `EventBusContract`. The projection SHALL expose the latest observed Workflow position and advancement history per Engineering Session. It SHALL NOT mutate Workflow state, trigger Workflow advancement, automate recovery, or infer unrecorded domain facts.

**Known Source Limitation (binding):** `EngineeringSessionCreated` remains deferred (per `NEXUS-RAT-2026-07-16-019`). Sprint 66 SHALL NOT claim to represent an Engineering Session's creation-time state. The projection SHALL distinguish "no observed advancement" from "an observed current Workflow position," MAY initialize its first history entry from the first event's `previousWorkflowStepId`/`newWorkflowStepId`, and SHALL NOT infer creation-time state from any repository, `WorkflowChain` definition, Mission Engineering Group, command, or unrelated event. A newly created Engineering Session with no advancement event MAY legitimately have no projection record.

**Architectural Responsibilities (binding):**

| Concern | Owner |
| --- | --- |
| Authoritative Workflow position, advancement behavior | `EngineeringSession`/`EngineeringSessionService` (Sprint 39/42/43/45/46/65, unmodified) |
| `EngineeringSessionWorkflowAdvanced` event contract, publication semantics | Sprint 65 (frozen, consumed unmodified) |
| Mission attribution | Copied exclusively from the consumed event; never independently resolved or re-derived |
| Observed Workflow-position read model | New `EngineeringSessionStateProjection`/`EngineeringSessionStateProjectionService` (this Sprint) |
| Event delivery, ordering, replay/subscription mechanics | Existing `EventBusContract` (Sprint 1/63, unmodified) |

## Authorized Scope

The Builder MAY:

- Introduce `EngineeringSessionStateProjection` (read model), `IEngineeringSessionStateProjectionRepository`/in-memory implementation, and `EngineeringSessionStateProjectionService`, subscribed to exactly `EngineeringSessionWorkflowAdvanced` through the existing `EventBusContract`, mirroring the Sprint 63 `GovernanceStateProjection` pattern where structurally reusable.
- Extend `createKernelServices()` composition only as additive wiring required to construct and register the new service/repository.

The Builder SHALL NOT:

- Modify `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, or Sprint 65's existing event contract.
- Modify any `src/hosts` or `src/adapters` file.
- Introduce Workflow mutation, Workflow-step execution, Review-outcome evaluation, Governance-decision evaluation, Recovery-requirement resolution, Adapter selection/dispatch, or Mission/Engineering-Session mutation of any kind from the projection or its service.
- Introduce event consumers of the projection itself, Host/Adapter surfacing, projection caching, durable persistence, distributed consumers, checkpoints, consumer offsets, dead-letter queues, retry policies, or event-stream compaction.
- Independently resolve or infer Mission association; Mission identity SHALL be copied exclusively from the consumed Domain Event.
- Reorder events by timestamp, introduce speculative sorting, conflict resolution, or eventual-consistency reconciliation; events SHALL be applied in authoritative `EventBus` order only.

## Deterministic Event Consumption (binding)

For every accepted `EngineeringSessionWorkflowAdvanced` event, the consumer SHALL: validate the event; locate the existing projection by `engineeringSessionId`; verify Mission attribution consistency; verify Workflow continuity when a prior projection exists (`event.previousWorkflowStepId` SHALL equal `projection.currentWorkflowStepId`); append exactly one advancement history entry; update the current observed Workflow position; persist the updated projection. Equivalent ordered event streams SHALL produce equivalent projections.

A continuity mismatch SHALL fail deterministically, leaving the existing projection unchanged — the consumer SHALL NOT repair the event, skip the mismatch silently, infer an intermediate transition, or overwrite the projection with contradictory state. A conflicting Mission identity for the same `engineeringSessionId` SHALL fail closed with deterministic diagnostics, leaving the existing projection unchanged; no Mission reassignment behavior is authorized.

Processing the same Domain Event identity more than once SHALL NOT duplicate history, increment projection revision, alter current state, or produce a second effective update. Idempotency SHALL be based on authoritative event identity, not payload similarity. The implementation SHALL avoid duplicate effective updates when historical replay and live subscription overlap, using the existing EventBus consumption mechanism only.

## Builder Stop Conditions (binding)

The Builder SHALL stop and report, rather than invent new event infrastructure or an inferred-state workaround, if: the EventBus cannot provide deterministic consumption or replay; replay and live subscription cannot be deduplicated using existing event identity; `EngineeringSessionWorkflowAdvanced` lacks required attribution; event ordering cannot be established through the existing contract; projection continuity cannot be validated without modifying Sprint 65; or implementation would require Host, Adapter, aggregate, or RFC changes.

## Ownership Model (ratified)

`EngineeringSession` remains the sole owner of authoritative Workflow position and advancement behavior. `EngineeringSessionStateProjection` is derived, read-only state, never authoritative domain state, consistent with the Sprint 63 `GovernanceStateProjection` precedent. This ratification introduces no new aggregate ownership and amends no RFC.

## Authorized Scope (planning artifacts)

`nexus-plan` is authorized to record this ratification, generate the Sprint 66 Sprint Implementation Record (`knowledge/implementation/sprints/sprint-0066-engineering-session-state-projection.md`), update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Sprint 66, and issue Builder handoff.

## Deferred Concepts

`EngineeringSessionCreated`; projection of creation-time Session state; Event-Driven Workflow Advancement; event-driven Workflow mutation; Recovery Workflow Automation; automatic recovery execution; Autonomous Engineering Integration Validation; Host projection UI; Adapter consumers; projection caching; durable projection storage; distributed consumers; event checkpoints; consumer offsets; dead-letter queues; retry policies; event-stream compaction; Mission-level orchestration; WorkflowStep execution-status projection; ExecutionSession projection.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (structural precedent, frozen, unaffected).
- Sprint 65 — EngineeringSession Domain Event Publication (frozen; sole event source for this Sprint).
- Sprint 66 — Engineering Session State Projection (this ratification's authorized scope).

## Related Review(s)

None yet — Sprint 66 has not been reviewed. This ratification precedes Sprint 66 implementation and its Reviewer cycle.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 66 — Engineering Session State Projection as Milestone 10's next Sprint, fulfilling the Prerequisite Foundation item named by `NEXUS-RAT-2026-07-16-018`. The Sprint introduces a deterministic, read-only projection (`EngineeringSessionStateProjection`/`EngineeringSessionStateProjectionRepository`/`EngineeringSessionStateProjectionService`) consuming exactly the existing `EngineeringSessionWorkflowAdvanced` event stream through the existing `EventBusContract`, exposing the latest observed Workflow position and ordered advancement history per Engineering Session. Because `EngineeringSessionCreated` remains deferred, the projection SHALL NOT claim to represent creation-time state, distinguishing "no observed advancement" from "an observed current position," and MAY initialize its first history entry from the first consumed event's previous/new Workflow positions only. Mission attribution SHALL be copied exclusively from the consumed event, never independently resolved. Event consumption SHALL be deterministic: Workflow continuity mismatches and Mission attribution conflicts SHALL fail closed, leaving any existing projection unchanged; duplicate event identities SHALL NOT produce duplicate history or a second effective update; events SHALL be applied in authoritative EventBus order only, with no timestamp-based reordering or reconciliation. `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Execution Strategy, Assignment Policy, Review, Governance, `RecoveryRequirement`, `Mission`, Sprint 65's event contract, and all `src/hosts`/`src/adapters` files SHALL NOT be modified. No Workflow mutation, execution, Review/Governance evaluation, Recovery resolution, Adapter dispatch, or Mission/Engineering-Session mutation is authorized from the projection or its service. The Builder SHALL stop and report rather than invent new event infrastructure if the EventBus cannot guarantee deterministic consumption, replay deduplication, or event ordering as required. `nexus-plan` SHALL record this ratification, generate the Sprint 66 Sprint Implementation Record, update planning artifacts, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-002

## Ratification Identifier

NEXUS-RAT-2026-07-17-002

## Date

2026-07-17

## Subject

RFC-0004 Amendment Ratification — Engineering Decision Correlation. Amends RFC-0004 — Execution Model to Version 1.14, adding `EngineeringDecisionCorrelation` as an explicit, attributable, append-only record correlating a governed Workflow position (Mission, Engineering Session, Workflow Step) with the Review and `GovernanceDecision` produced for it.

## Originating Request

`nexus-plan`'s post-Sprint-66 Governance Scan found that the Prerequisite Foundation authorized by `NEXUS-RAT-2026-07-16-018` (Sprint 65/66) resolves only the *outbound* Engineering Session attribution gap — `EngineeringSession` now publishes `EngineeringSessionWorkflowAdvanced` and a Session State Projection exposes current Workflow position per session. It does not resolve the *inbound* gap: `GovernanceGatedWorkflowAdvancementConsumer` and `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 57/59) still require `engineeringSessionId`/`workflowStepId` as caller-supplied command input because `GovernanceDecisionRecorded`, `GovernanceDecision`, and `Review` are Mission-scoped only (RFC-0006/RFC-0011, unmodified per `NEXUS-RAT-2026-07-16-004`/`-016`) and carry no Engineering Session or Workflow Step identity. `nexus-plan` independently verified in source that `governance-decision.ts` and `review.types.ts` carry no `engineeringSessionId` field anywhere in their attribution chain, and that neither consumer is wired as an automatic `EventBusContract` subscriber — both remain orphaned command handlers in `create-kernel-services.ts`. The Sprint Owner reviewed this finding and issued a binding architectural decision.

## Governance Decision

**RFC-0004 Amendment Approved.** The Sprint Owner amends RFC-0004 to Version 1.14, adding Engineering Decision Correlation as a new, standalone concept (not an Advancement Strategy) sitting alongside Recovery Requirement. Engineering Decision Correlation records, append-only and immutably attributed, the relationship between a governed Workflow position and the Review/`GovernanceDecision` subsequently produced for it, enabling deterministic bidirectional lookup without adding runtime-topology ownership to Review or `GovernanceDecision`.

**Rejected approaches** (per the Sprint Owner's decision): caller-supplied, unverified `engineeringSessionId`/`workflowStepId` attribution at consumption time; extending `Review`/`GovernanceDecision` themselves with Engineering Session/Workflow Step ownership (would couple Mission-scoped governance facts to one execution topology and require amending RFC-0006/RFC-0011); inferring the target session from Mission-scoped projection enumeration alone (non-deterministic when a Mission has zero, one, or multiple concurrent Engineering Sessions).

This amendment defines the correlation's identity, required attribution, append-only association lifecycle, and fail-closed lookup contract only. It does not implement Event-Driven Workflow Advancement or Recovery Workflow Automation, and does not identify the correlation's Creation Authority — consistent with Advancement Authority's existing RFC-0004 pattern (each capability's implementing Sprint Owner ratification states its own Authority), Engineering Decision Correlation's Creation Authority is deferred to its implementing Sprint's ratification (`NEXUS-RAT-2026-07-17-003`).

RFC-0004 owns the correlation record and its lookup contract. RFC-0006 remains the sole owner of Review production, evaluation, and Outcome semantics. RFC-0011 remains the sole owner of `GovernanceDecision` production, values, and lifecycle. Neither RFC-0006 nor RFC-0011 is modified by this amendment.

## Ownership Model (ratified)

This ratification amends RFC-0004's own text (Amendment History, new Engineering Decision Correlation section) and therefore carries RFC-tier authority for that amendment, per RFC-0004's established Amendment History convention (v1.5, v1.11, v1.12, v1.13). It does not modify RFC-0001, RFC-0002, RFC-0003, RFC-0005–0011, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0004 to v1.14 as recorded in `knowledge/specifications/rfc-0004-execution-model.md` — complete;
2. update RFC-0004's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification (`NEXUS-RAT-2026-07-17-003`) authorizing implementation of the Engineering Decision Correlation Foundation, narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Event-Driven Workflow Advancement; Recovery Workflow Automation; Autonomous Engineering Integration Validation; wiring `GovernanceGatedWorkflowAdvancementConsumer`/`RecoveryRequirementGovernanceDecisionConsumer` as automatic `EventBusContract` subscribers; any Host or Adapter surfacing. Each remains unauthorized pending its own future RFC-scoped-implementation and Sprint Owner scope ratification.

## Related Sprint(s)

- Sprint 65 — EngineeringSession Domain Event Publication (frozen, unaffected; outbound half of the attribution gap).
- Sprint 66 — Engineering Session State Projection (frozen, unaffected; outbound half of the attribution gap).
- Sprint 67 — Engineering Decision Correlation Foundation (implements this amendment; see `NEXUS-RAT-2026-07-17-003`).

## Related Review(s)

None yet. A Sprint 67 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.14, adding Engineering Decision Correlation: an explicit, attributable, append-only record correlating a governed Workflow position (Mission, Engineering Session, Workflow Step) with the Review and `GovernanceDecision` subsequently produced for it. This resolves the inbound half of the Milestone 10 attribution gap left open by `NEXUS-RAT-2026-07-16-018`'s Prerequisite Foundation (Sprint 65/66), which resolved only the outbound half. Engineering Decision Correlation's identity and Mission/Engineering-Session/Workflow-Step attribution are immutable once created; Mission attribution is resolved exclusively through the existing Mission Engineering Group association, never caller-supplied. Its `reviewId` and `governanceDecisionId` associations are append-only, recorded at most once each, and rejected when the referenced Review's or `GovernanceDecision`'s own Mission identity does not match. Lookup is deterministic and bidirectional, failing closed on missing or ambiguous correlation, with no fallback inference. This amendment does not modify RFC-0006 or RFC-0011, does not implement Event-Driven Workflow Advancement or Recovery Workflow Automation, and does not identify the correlation's Creation Authority — deferred to the implementing Sprint's own ratification. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 67 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-003

## Ratification Identifier

NEXUS-RAT-2026-07-17-003

## Date

2026-07-17

## Subject

Sprint 67 Scope Ratification — Engineering Decision Correlation Foundation. Authorizes implementation of RFC-0004 v1.14's Engineering Decision Correlation, narrowly scoped to the correlation record, its repository, its service, and deterministic lookup — no consumption, no auto-wiring, no Workflow mutation.

## Originating Request

Companion Sprint-scope ratification required by `NEXUS-RAT-2026-07-17-002`'s Authorized Scope (item 4), following the Sprint Owner's RFC-0004 v1.14 amendment approval.

## Governance Decision

**Approved.** Sprint 67 — Engineering Decision Correlation Foundation is authorized as Milestone 10's next Sprint.

**Creation Authority (binding; resolves RFC-0004 v1.14's deferred Creation Authority for this Sprint):** Sprint 67 SHALL expose Engineering Decision Correlation creation and association only as explicit, caller-invoked operations on a new `EngineeringDecisionCorrelationService` — mirroring the Recovery Requirement/`RecoveryRequirementService` precedent (Sprint 59) — requiring the caller to supply `engineeringSessionId` and `workflowStepId` directly, with `missionId` resolved exclusively through the existing Mission Engineering Group reverse-lookup query (Sprint 65 precedent, `NEXUS-RAT-2026-07-16-019`). Sprint 67 SHALL NOT wire this creation operation into `EngineeringSessionService`, `ReviewService`, or `GovernanceService` as an automatic side effect; no existing service gains a new call to the correlation service. Identifying and wiring the actual production call site belongs to Event-Driven Workflow Advancement's own future Sprint, since it requires deciding whether `EngineeringSessionService` itself becomes the invoking caller — a Workflow-mutation-adjacent decision this Sprint does not authorize.

## RFC Coverage

- RFC-0004 v1.14 (Partial — implements exactly the Engineering Decision Correlation section)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only for Mission-match validation)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only for Mission-match validation)
- RFC-0005 — Domain Event Model (Referenced; existing envelope conventions only, per Recovery Requirement precedent)

## Authorized Concepts

- `EngineeringDecisionCorrelation` aggregate: immutable identity; immutable Mission/Engineering-Session/Workflow-Step attribution set at creation; append-only, at-most-once `reviewId` and `governanceDecisionId` associations.
- `IEngineeringDecisionCorrelationRepository`/in-memory implementation.
- `EngineeringDecisionCorrelationService`: `beginCorrelation({ engineeringSessionId, workflowStepId })` (resolves `missionId` via the existing read-only Mission Engineering Group reverse-lookup, fails closed on missing/ambiguous association, mirroring Sprint 65); `associateReview({ correlationId, reviewId })`; `associateGovernanceDecision({ correlationId, governanceDecisionId })`; deterministic bidirectional lookup by `reviewId`, by `governanceDecisionId`, and by (Mission, Engineering Session, Workflow Step).
- Additive `createKernelServices()` composition wiring (construction and registration only; no new call sites in any existing service).

## Deferred Concepts

- Event-Driven Workflow Advancement and Recovery Workflow Automation (this Sprint provides their future attribution source only).
- Wiring `beginCorrelation` into `EngineeringSessionService`, `ReviewService`, or `GovernanceService` as an automatic side effect.
- Wiring `GovernanceGatedWorkflowAdvancementConsumer`/`RecoveryRequirementGovernanceDecisionConsumer` as automatic `EventBusContract` subscribers.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing, correlation caching, durable persistence, distributed consumers, event checkpoints, retry policies.
- Any change to `EngineeringSession`, `EngineeringSessionService`, `EngineeringSessionStateProjection`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, or `Mission`.

## Definition of Done

- `EngineeringDecisionCorrelation` identity and Mission/Engineering-Session/Workflow-Step attribution are immutable after `beginCorrelation`; Mission attribution is resolved exclusively through Mission Engineering Group, never caller-supplied.
- `associateReview`/`associateGovernanceDecision` are idempotent-safe (repeated identical association is a no-op, not a duplicate or error) and reject a Mission mismatch between the correlation and the referenced Review/`GovernanceDecision`, fail closed, leaving the correlation unchanged.
- Lookup by `reviewId`, by `governanceDecisionId`, and by (Mission, Engineering Session, Workflow Step) is deterministic and fails closed (explicit absence result) when no correlation exists.
- No `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.14 by `NEXUS-RAT-2026-07-17-002`) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes one Sprint, at the Implementation Plan tier, implementing exactly RFC-0004 v1.14's already-amended text. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified; the Sequence is revised only to insert Engineering Decision Correlation Foundation ahead of Event-Driven Workflow Advancement, per the Sprint Owner's sequencing decision.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, generate the Sprint 67 Sprint Implementation Record, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Sprint 67, and issue Builder handoff.

## Deferred Concepts (planning)

Sprint 68 — Event-Driven Workflow Advancement and Sprint 69 — Recovery Workflow Automation each require their own future Sprint scope ratification after Sprint 67 is certified, per the Sprint Owner's revised sequencing (Sprint 67 → 68 → 69 → 70).

## Related Sprint(s)

- Sprint 57 — Governance-Gated Workflow Advancement; Sprint 59 — Recovery Requirement (precedent patterns for a caller-invoked, read-only-repository-consuming Kernel service; frozen, unaffected).
- Sprint 65/66 — EngineeringSession Domain Event Publication / Session State Projection (frozen, unaffected; outbound half of the attribution gap this Sprint's inbound half complements).
- Sprint 67 — Engineering Decision Correlation Foundation (this ratification's authorized scope).

## Related Review(s)

None yet. Sprint 67 has not been reviewed.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 67 — Engineering Decision Correlation Foundation as Milestone 10's next Sprint, implementing exactly RFC-0004 v1.14 (`NEXUS-RAT-2026-07-17-002`). The Sprint introduces `EngineeringDecisionCorrelation`/`IEngineeringDecisionCorrelationRepository`/`EngineeringDecisionCorrelationService`, exposing `beginCorrelation` (caller-supplied `engineeringSessionId`/`workflowStepId`, Mission resolved exclusively through the existing Mission Engineering Group reverse-lookup), append-only `associateReview`/`associateGovernanceDecision` (each Mission-match-validated and fail-closed), and deterministic bidirectional lookup. Sprint 67 SHALL NOT wire correlation creation into any existing service as an automatic side effect, SHALL NOT wire either existing governance/recovery consumer as an automatic `EventBusContract` subscriber, and SHALL NOT modify `EngineeringSession`, `EngineeringSessionService`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, or `Mission`. Event-Driven Workflow Advancement (Sprint 68) and Recovery Workflow Automation (Sprint 69) each require their own future Sprint scope ratification and are not authorized by this ratification. `nexus-plan` SHALL record this ratification, generate the Sprint 67 Sprint Implementation Record, update planning artifacts, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-004

## Ratification Identifier

NEXUS-RAT-2026-07-17-004

## Date

2026-07-17

## Subject

RFC-0004 Amendment Ratification — Event-Driven Workflow Advancement. Amends RFC-0004 — Execution Model to Version 1.15, defining the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event and invokes Governance-Gated Advancement for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation.

## Originating Request

`nexus-plan`'s post-Sprint-67 Governance Scan found that Sprint 68 — Event-Driven Workflow Advancement, the next item in Milestone 10's Initial Capability Sequence, has no authorized mechanism definition: `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57) exists and is wired into `createKernelServices()`, but never calls `eventBus.subscribe(...)` and requires the caller to supply `engineeringSessionId`/`currentWorkflowStepId` directly; it is invoked only from tests today. RFC-0004 v1.14's Engineering Decision Correlation section (`knowledge/specifications/rfc-0004-execution-model.md`) is explicit that it does not itself trigger Workflow Advancement and that Event-Driven Workflow Advancement "remains gated behind its own future Sprint Owner scope ratification." `nexus-plan` presented this as a Governance Report with a recommended resolution (an RFC-0004 amendment followed by a companion Sprint-scope ratification, mirroring the `NEXUS-RAT-2026-07-17-002`/`-003` precedent) and alternatives. The Sprint Owner reviewed the report and issued a binding architectural decision, including the amendment's normative content in full.

## Governance Decision

**RFC-0004 Amendment Approved.** The Sprint Owner amends RFC-0004 to Version 1.15, adding Event-Driven Workflow Advancement as a new section defining: Trigger Authority (`GovernanceGatedWorkflowAdvancementConsumer` SHALL own the sole `EventBus` subscription to `GovernanceDecisionRecorded` for this purpose; no Host, Adapter, Review, Governance, or projection component SHALL independently trigger it); the normative event handling flow (validate event → resolve `GovernanceDecision` → resolve Engineering Decision Correlation → obtain authoritative Mission/Engineering-Session/Workflow-Step attribution → validate attribution consistency → invoke existing Governance-Gated Advancement → persist through existing authoritative services); Governance Decision handling (only Approved decisions MAY advance; Rejected/Deferred/Escalation Required produce a deterministic non-advancing result, not a technical failure, and do not create a Recovery Requirement in this Sprint); correlation resolution exclusively via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId` (no caller-supplied substitute, no enumeration/inference); fail-closed behavior on missing or ambiguous correlation or attribution mismatch; idempotency (duplicate event delivery SHALL NOT advance the same Workflow position more than once); and existing `EventBus` delivery ordering only (no reordering, buffering, retry queues, or durable delivery infrastructure — a future capability's own ratification).

**Rejected approaches** (per the Sprint Owner's decision): scoping Sprint 68 to also cover `RecoveryRequirementGovernanceDecisionConsumer`/Recovery Workflow Automation in the same slice (contradicts the already-ratified Sprint 67→68→69→70 sequence and doubles blast radius); authorizing Sprint 68 through a Sprint-scope ratification alone without an RFC amendment (breaks from the RFC-amendment-then-Sprint-ratification pattern used by every prior Milestone 10 sprint introducing new normative behavior).

This amendment defines Event-Driven Workflow Advancement's mechanics only. It does not itself authorize implementation — implementation requires the companion Sprint-scope ratification (`NEXUS-RAT-2026-07-17-005`). It does not modify `GovernanceDecision`, Review, Engineering Decision Correlation, Governance-Gated Advancement's existing Advancement Eligibility, Engineering Session's existing Workflow Advancement operations, or Mission Engineering Group (v1.2/v1.3/v1.10/v1.11/v1.14, unmodified), and does not authorize Recovery Workflow Automation.

## Ownership Model (ratified)

This ratification amends RFC-0004's own text (Amendment History, new Event-Driven Workflow Advancement section) and therefore carries RFC-tier authority for that amendment, per RFC-0004's established Amendment History convention (v1.5, v1.11, v1.12, v1.13, v1.14). It does not modify RFC-0001, RFC-0002, RFC-0003, RFC-0005–0011, or the Kernel Canon, and does not redefine any concept owned by another RFC.

## Authorized Scope

`nexus-plan` is authorized to:

1. amend RFC-0004 to v1.15 as recorded in `knowledge/specifications/rfc-0004-execution-model.md` — complete;
2. update RFC-0004's Amendment History accordingly — complete;
3. prepare this ratification entry — complete;
4. prepare a companion Sprint-scope ratification (`NEXUS-RAT-2026-07-17-005`) authorizing implementation of Event-Driven Workflow Advancement, narrowly scoped to this amendment's actual text.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Recovery Workflow Automation; `RecoveryRequirementGovernanceDecisionConsumer` wiring; Autonomous Engineering Integration Validation; durable delivery, retry queues, dead-letter queues, event buffering, or reordering; any Host or Adapter surfacing. Each remains unauthorized pending its own future RFC-scoped-implementation and Sprint Owner scope ratification.

## Related Sprint(s)

- Sprint 67 — Engineering Decision Correlation Foundation (frozen, unaffected; supplies this amendment's attribution source).
- Sprint 68 — Event-Driven Workflow Advancement (implements this amendment; see `NEXUS-RAT-2026-07-17-005`).

## Related Review(s)

None yet. A Sprint 68 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.15, adding Event-Driven Workflow Advancement: the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event and invokes Governance-Gated Advancement (v1.11, unmodified) for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation's (v1.14, unmodified) existing lookup by `governanceDecisionId`. `GovernanceGatedWorkflowAdvancementConsumer` SHALL own the sole `EventBus` subscription to `GovernanceDecisionRecorded` for this purpose; only an Approved `GovernanceDecision` MAY result in advancement, while Rejected/Deferred/Escalation Required produce a deterministic non-advancing result and create no Recovery Requirement in this Sprint; correlation resolution SHALL occur exclusively through Engineering Decision Correlation's existing lookup, never through caller-supplied substitutes or enumeration; missing or ambiguous correlation, or any Mission/Engineering-Session/Workflow-Step attribution mismatch, SHALL fail closed; duplicate event delivery SHALL NOT advance the same Workflow position more than once; and only the existing `EventBus`'s delivery order is used, with no reordering, buffering, or retry infrastructure introduced. This amendment does not modify RFC-0006, RFC-0011, Engineering Decision Correlation, Governance-Gated Advancement's existing eligibility rules, or Mission Engineering Group, and does not authorize Recovery Workflow Automation. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 68 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-005

## Ratification Identifier

NEXUS-RAT-2026-07-17-005

## Date

2026-07-17

## Subject

Sprint 68 Scope Ratification — Event-Driven Workflow Advancement. Authorizes implementation of RFC-0004 v1.15's Event-Driven Workflow Advancement, narrowly scoped to wiring the existing `GovernanceGatedWorkflowAdvancementConsumer` to an actual `EventBus` subscription, resolving attribution through Sprint 67's Engineering Decision Correlation, and invoking the existing Governance-Gated Advancement path — no Recovery automation, no second consumer.

## Originating Request

Companion Sprint-scope ratification required by `NEXUS-RAT-2026-07-17-004`'s Authorized Scope (item 4), following the Sprint Owner's RFC-0004 v1.15 amendment approval.

## Governance Decision

**Approved.** Sprint 68 — Event-Driven Workflow Advancement is authorized as Milestone 10's next Sprint.

**Existing Consumer Ownership (binding):** the existing `GovernanceGatedWorkflowAdvancementConsumer` SHALL be extended, not replaced; a second consumer for the same responsibility SHALL NOT be introduced. Its existing direct `handleGovernanceDecisionRecorded(...)` capability MAY be retained internally, but production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — production event handling SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

**Subscription Lifecycle (binding):** Kernel composition SHALL ensure the consumer subscribes exactly once; repeated service retrieval SHALL NOT create duplicate subscriptions; no new general-purpose event-consumer framework is authorized.

## RFC Coverage

- RFC-0004 v1.15 (Partial — implements exactly the Event-Driven Workflow Advancement section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Authorized Concepts

- Extending `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57, frozen contract) with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition (or the existing canonical consumer-registration mechanism), exactly once per Kernel composition.
- Attribution resolution via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId(...)` (Sprint 67, frozen), with Mission/Engineering-Session/Workflow-Step consistency validation against the event and the `GovernanceDecision` before invoking advancement.
- Deterministic handling of: advancement performed; already advanced; decision non-advancing (Rejected/Deferred/Escalation Required); correlation missing; correlation ambiguous; attribution invalid; advancement rejected by existing domain rules; repository/persistence failure.
- Idempotent handling of duplicate/replayed `GovernanceDecisionRecorded` delivery, using existing authoritative Engineering Session state and event identity.
- Additive `createKernelServices()` composition wiring establishing the subscription.

## Deferred Concepts

- `RecoveryRequirementGovernanceDecisionConsumer` wiring and Recovery Workflow Automation (Sprint 69) in their entirety, including automatic Recovery Requirement creation from events.
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Host or Adapter surfacing of any kind.
- Event-driven Review creation or event-driven Governance evaluation.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, or Mission Engineering Group.

## Definition of Done

- The consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no advancement, no aggregate mutation, and no Recovery Requirement creation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, the correlation, and the Engineering Session before advancement; any mismatch fails closed.
- An Approved `GovernanceDecision` invokes the existing Governance-Gated Advancement path through `EngineeringSessionService`'s existing operations without the consumer mutating `EngineeringSession` directly.
- Rejected, Deferred, and Escalation Required `GovernanceDecision` values produce a deterministic non-advancing result and create no Recovery Requirement.
- Duplicate/replayed event delivery does not advance the same Workflow position more than once and produces no duplicate effective side effects.
- No `EngineeringSession` (beyond its existing, unmodified public operations), `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, Sprint 65 event contract, Sprint 66 projection, Sprint 67 correlation contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.15 by `NEXUS-RAT-2026-07-17-004`) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes one Sprint, at the Implementation Plan tier, implementing exactly RFC-0004 v1.15's already-amended text. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, generate the Sprint 68 Sprint Implementation Record, update `IMPLEMENTATION_PLAN.md` for Sprint 68, and issue Builder handoff. `IMPLEMENTATION_MANIFEST.md` SHALL be updated by the Builder upon implementation, per established repository practice.

## Deferred Concepts (planning)

Sprint 69 — Recovery Workflow Automation requires its own future Sprint scope ratification after Sprint 68 is certified, per the Sprint Owner's revised sequencing (Sprint 67 → 68 → 69 → 70).

## Related Sprint(s)

- Sprint 57 — Governance-Gated Workflow Advancement (frozen contract this Sprint extends with real subscription wiring).
- Sprint 65/66 — EngineeringSession Domain Event Publication / Session State Projection (frozen, unaffected).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen; this Sprint's attribution source).
- Sprint 68 — Event-Driven Workflow Advancement (this ratification's authorized scope).

## Related Review(s)

None yet. Sprint 68 has not been reviewed.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 68 — Event-Driven Workflow Advancement as Milestone 10's next Sprint, implementing exactly RFC-0004 v1.15 (`NEXUS-RAT-2026-07-17-004`). The Sprint extends the existing `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 57, frozen contract) with an actual, exactly-once `EventBusContract` subscription to `GovernanceDecisionRecorded`; resolves Mission/Engineering-Session/Workflow-Step attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId` (Sprint 67, frozen); validates attribution consistency and fails closed on any mismatch or missing/ambiguous correlation; invokes the existing Governance-Gated Advancement path only for an Approved `GovernanceDecision`, producing a deterministic non-advancing result (not a Recovery Requirement) for Rejected/Deferred/Escalation Required; and guarantees idempotent handling of duplicate event delivery. The Sprint SHALL NOT introduce a second consumer, SHALL NOT wire `RecoveryRequirementGovernanceDecisionConsumer`, SHALL NOT implement Recovery Workflow Automation, and SHALL NOT modify `EngineeringSession`'s existing public operations, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`, `Mission`, or any Sprint 65/66/67 contract. `nexus-plan` SHALL record this ratification, generate the Sprint 68 Sprint Implementation Record, update planning artifacts, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-006

## Ratification Identifier

NEXUS-RAT-2026-07-17-006

## Date

2026-07-17

## Subject

RFC-0004 v1.16 Amendment — Recovery Workflow Automation. Defines the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event carrying a Rejected `GovernanceDecision` and creates the corresponding Recovery Requirement for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation, reusing Recovery Requirement's existing deterministic, idempotent creation contract unmodified.

## Originating Request

`nexus-plan`'s post-Sprint-68 Governance Scan found that Recovery Workflow Automation (Milestone 10 Step 3) has no authorized mechanism definition: the existing `RecoveryRequirementGovernanceDecisionConsumer` (frozen since Sprint 58/59) is not wired to the `EventBus` and requires caller-supplied Engineering Session/Workflow Step identifiers, and RFC-0004 v1.15's Event-Driven Workflow Advancement section explicitly defers Recovery Workflow Automation's mechanics to its own future Sprint Owner scope ratification. `nexus-plan` presented a Governance Report; the Sprint Owner directed this amendment.

## Governance Decision

**Approved as directed.** RFC-0004 — Execution Model is amended to Version 1.16, adding Recovery Workflow Automation.

No Builder implementation is authorized by this ratification alone; implementation requires the companion Sprint-scope ratification.

## Deferred Concepts

Recovery-plan generation; AI remediation planning; automatic recovery execution; Recovery Requirement resolution; Recovery Requirement withdrawal; event-driven re-advancement after recovery; automatic Builder invocation; Workflow topology mutation; retry or buffering of unresolved events; durable subscriptions; consumer checkpoints; dead-letter queues; any Host or Adapter surfacing; Autonomous Engineering Integration Validation. Each remains unauthorized pending its own future RFC-scoped-implementation and Sprint Owner scope ratification.

## Related Sprint(s)

- Sprint 58 — Governance Recovery and Blocking-State Foundation (frozen, unaffected; establishes `RecoveryRequirement`).
- Sprint 59 — Recovery Requirement Domain Event Publication (frozen, unaffected).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen, unaffected; supplies this amendment's attribution source).
- Sprint 68 — Event-Driven Workflow Advancement (frozen, unaffected; sibling consumer of the same event type, distinct responsibility).
- Sprint 69 — Recovery Workflow Automation (implements this amendment; see `NEXUS-RAT-2026-07-17-007`).

## Related Review(s)

None yet. A Sprint 69 Reviewer certification is required following implementation.

## Full Ratification Text

> The Sprint Owner amends RFC-0004 — Execution Model to Version 1.16, adding Recovery Workflow Automation: the Kernel mechanism that reacts to an authoritative `GovernanceDecisionRecorded` Domain Event carrying a Rejected `GovernanceDecision` (RFC-0011) and creates the corresponding Recovery Requirement (v1.12, unmodified) for the exact Engineering Session and Workflow Step resolved through Engineering Decision Correlation's (v1.14, unmodified) existing lookup by `governanceDecisionId`, reusing Recovery Requirement's existing deterministic, idempotent creation contract unmodified. `RecoveryRequirementGovernanceDecisionConsumer` SHALL own the sole `EventBus` subscription to `GovernanceDecisionRecorded` for this purpose, separate from and non-duplicative of Event-Driven Workflow Advancement's (v1.15) subscription to the same event type — the two consumers SHALL NOT duplicate each other's responsibilities. Only a Rejected `GovernanceDecision` SHALL authorize Recovery Requirement creation; Approved, Deferred, and Escalation Required SHALL create none and SHALL produce a deterministic no-recovery result. Correlation resolution SHALL occur exclusively through Engineering Decision Correlation's existing lookup, never through caller-supplied substitutes or enumeration; missing or ambiguous correlation, or any Mission/Engineering-Session/Workflow-Step attribution mismatch, SHALL fail closed. Repeated delivery of the same event SHALL NOT create more than one Recovery Requirement for the same deterministic key. Only the existing `EventBus`'s delivery order is used, with no reordering, buffering, or retry infrastructure introduced. This amendment does not modify RFC-0006, RFC-0011, Engineering Decision Correlation, Recovery Requirement's existing lifecycle and creation contract, Event-Driven Workflow Advancement, Governance-Gated Advancement, or Mission Engineering Group, and does not authorize recovery-plan generation, automatic recovery execution, Recovery Requirement resolution or withdrawal, or Autonomous Engineering Integration Validation. The Sprint Owner authorizes `nexus-plan` to prepare the companion Sprint 69 scope ratification narrowly implementing this amendment.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-007

## Ratification Identifier

NEXUS-RAT-2026-07-17-007

## Date

2026-07-17

## Subject

Sprint 69 Scope Ratification — Recovery Workflow Automation. Authorizes implementation of RFC-0004 v1.16's Recovery Workflow Automation, narrowly scoped to wiring the existing `RecoveryRequirementGovernanceDecisionConsumer` to an actual `EventBus` subscription, resolving attribution through Sprint 67's Engineering Decision Correlation, and invoking the existing `RecoveryRequirementService` creation path — no recovery execution, no second consumer, no advancement behavior.

## Originating Request

Companion Sprint-scope ratification required by `NEXUS-RAT-2026-07-17-006`'s Governance Decision, following the Sprint Owner's RFC-0004 v1.16 amendment approval.

## Governance Decision

**Approved.** Sprint 69 — Recovery Workflow Automation is authorized as Milestone 10's next Sprint.

**Existing Consumer Ownership (binding):** the existing `RecoveryRequirementGovernanceDecisionConsumer` SHALL be extended, not replaced; a second recovery consumer SHALL NOT be introduced. Its existing direct `handleGovernanceDecisionRecorded(...)` capability MAY be retained internally, but production `EventBus` subscription handling SHALL construct its command exclusively from authoritative loaded and correlated state — production event handling SHALL NOT require caller-supplied Engineering Session or Workflow Step identifiers.

**Subscription Lifecycle (binding):** Kernel composition SHALL ensure the consumer subscribes exactly once; repeated service retrieval SHALL NOT create duplicate subscriptions; no new general-purpose event-consumer framework is authorized.

**Consumer Separation (binding):** `GovernanceGatedWorkflowAdvancementConsumer` (Sprint 68) and `RecoveryRequirementGovernanceDecisionConsumer` (this Sprint) SHALL remain two separate `EventBus` subscriptions to the same event type, each independently exactly-once per Kernel composition; neither SHALL be merged into, replace, or depend on the other's handling result.

## RFC Coverage

- RFC-0004 v1.16 (Partial — implements exactly the Recovery Workflow Automation section)
- RFC-0005 — Domain Event Model (Referenced; consumes existing, unmodified `GovernanceDecisionRecorded` only)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Authorized Concepts

- Extending `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 58/59, frozen contract) with an actual `EventBusContract` subscription to `GovernanceDecisionRecorded`, established during Kernel composition, exactly once per Kernel composition.
- Attribution resolution via `EngineeringDecisionCorrelationService.findByGovernanceDecisionId(...)` (Sprint 67, frozen), with Mission/Engineering-Session/Workflow-Step consistency validation against the event and the `GovernanceDecision` before invoking Recovery Requirement creation.
- Deterministic handling of: Recovery Requirement created; existing Recovery Requirement returned (idempotent); Governance outcome does not require recovery (Approved/Deferred/Escalation Required); correlation missing; correlation ambiguous; attribution invalid; Governance Decision missing; malformed event; repository/persistence failure.
- Idempotent handling of duplicate/replayed `GovernanceDecisionRecorded` delivery, using Recovery Requirement's existing deterministic creation key and event identity.
- Additive `createKernelServices()` composition wiring establishing the subscription.
- `IMPLEMENTATION_MANIFEST.md` Sprint 68 status-line synchronization (documentation-only correction, not a governance decision).

## Deferred Concepts

- Recovery-plan generation, AI remediation planning, or automatic recovery execution.
- Recovery Requirement resolution or withdrawal.
- Event-driven re-advancement after recovery.
- Automatic Builder invocation.
- Autonomous Engineering Integration Validation (Milestone 10 Step 4).
- Retry, buffering, or reordering of unresolved/out-of-order events; durable subscriptions; consumer checkpoints; dead-letter queues.
- Host or Adapter surfacing of any kind.
- Any change to `GovernanceDecision`, Review, Engineering Decision Correlation, `EngineeringSessionStateProjection`, Workflow Chain topology, Mission Engineering Group, or Event-Driven Workflow Advancement (Sprint 68).

## Definition of Done

- The existing Recovery consumer subscribes to `GovernanceDecisionRecorded` exactly once per Kernel composition; repeated service resolution does not duplicate subscription behavior.
- Attribution is resolved exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId`; missing or ambiguous correlation fails closed with no Recovery Requirement creation and no aggregate mutation.
- Mission, Engineering Session, and Workflow Step identity are validated consistent across the event, the `GovernanceDecision`, and the correlation before Recovery Requirement creation; any mismatch fails closed.
- A Rejected `GovernanceDecision` invokes the existing Recovery Requirement creation path through `RecoveryRequirementService`'s/consumer's existing operations without direct aggregate construction bypassing that path.
- Approved, Deferred, and Escalation Required `GovernanceDecision` values produce a deterministic no-recovery result and create no Recovery Requirement.
- Duplicate/replayed event delivery does not create more than one Recovery Requirement for the same deterministic key and produces no duplicate effective side effects.
- Sprint 68's `GovernanceGatedWorkflowAdvancementConsumer` behavior is unchanged; the two consumers remain independent.
- No `EngineeringSession`, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement` lifecycle/creation contract, `Mission`, Sprint 65/66/67/68 contract, or `src/hosts`/`src/adapters` file is modified.
- No RFC other than RFC-0004 (already amended to v1.16 by `NEXUS-RAT-2026-07-17-006`) is amended.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.

## Ownership Model (ratified)

This ratification authorizes one Sprint, at the Implementation Plan tier, implementing exactly RFC-0004 v1.16's already-amended text. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, generate the Sprint 69 Sprint Implementation Record, update `IMPLEMENTATION_PLAN.md` for Sprint 69, synchronize the stale Sprint 68 status line in `IMPLEMENTATION_MANIFEST.md`, and issue Builder handoff. `IMPLEMENTATION_MANIFEST.md`'s Sprint 69 section SHALL be added by the Builder upon implementation, per established repository practice.

## Deferred Concepts (planning)

Autonomous Engineering Integration Validation (Sprint 70) requires its own future Sprint scope ratification after Sprint 69 is certified, per the Sprint Owner's sequencing (Sprint 67 → 68 → 69 → 70).

## Related Sprint(s)

- Sprint 58/59 — Recovery Requirement / its Domain Event Publication (frozen contracts this Sprint extends with real subscription wiring).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen; this Sprint's attribution source).
- Sprint 68 — Event-Driven Workflow Advancement (frozen, unaffected; sibling consumer, same event type).
- Sprint 69 — Recovery Workflow Automation (this ratification's authorized scope).

## Related Review(s)

None yet. Sprint 69 has not been reviewed.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 69 — Recovery Workflow Automation as Milestone 10's next Sprint, implementing exactly RFC-0004 v1.16 (`NEXUS-RAT-2026-07-17-006`). The Sprint extends the existing `RecoveryRequirementGovernanceDecisionConsumer` (Sprint 58/59, frozen contract) with an actual, exactly-once `EventBusContract` subscription to `GovernanceDecisionRecorded`; resolves Mission/Engineering-Session/Workflow-Step attribution exclusively through `EngineeringDecisionCorrelationService.findByGovernanceDecisionId` (Sprint 67, frozen); validates attribution consistency and fails closed on any mismatch or missing/ambiguous correlation; invokes the existing Recovery Requirement creation path only for a Rejected `GovernanceDecision`, producing a deterministic no-recovery result for Approved/Deferred/Escalation Required; and guarantees idempotent handling of duplicate event delivery using Recovery Requirement's existing deterministic creation key. The Sprint SHALL NOT introduce a second recovery consumer, SHALL NOT modify `GovernanceGatedWorkflowAdvancementConsumer` or its Sprint 68 behavior, SHALL NOT implement recovery execution, resolution, or withdrawal, and SHALL NOT modify `EngineeringSession`'s existing public operations, `WorkflowChain`, Mission Engineering Group, Review, `GovernanceDecision`, `RecoveryRequirement`'s existing lifecycle, `Mission`, or any Sprint 65/66/67/68 contract. `nexus-plan` SHALL record this ratification, generate the Sprint 69 Sprint Implementation Record, update planning artifacts, synchronize the stale Sprint 68 status line in `IMPLEMENTATION_MANIFEST.md`, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-008

## Ratification Identifier

NEXUS-RAT-2026-07-17-008

## Date

2026-07-17

## Subject

Sprint 70 Scope Ratification — Autonomous Engineering Integration Validation (Milestone 10 Step 4). Authorizes a validation-only integration test suite exercising the composed Milestone 10 lifecycle (Sprints 63–69) through existing public contracts, with a Milestone 10 closure recommendation. No RFC-0004 amendment; introduces no new production capability, mirroring the Sprint 62 / Milestone 9 closure precedent (`NEXUS-RAT-2026-07-16-014`).

## Originating Request

`nexus-plan` Governance Scan following Sprint 69's certification (`NEXUS-REV-2026-07-17-006`) found that Milestone 10 Step 4 — Autonomous Engineering Integration Validation — remained unscheduled and, unlike Steps 2 and 3, required no preceding RFC-0004 amendment: Step 4's own description in `NEXUS-RAT-2026-07-16-015` ("validates the complete Plan → Build → Review → Govern → Recover → Re-review → Advance → Complete lifecycle") defines no new mechanism, consumer, or domain concept — it certifies composition of the already-ratified and implemented Sprint 63–69 capabilities. `nexus-plan` presented this as a governance question (RFC amendment required, or Sprint-scope ratification alone) and recommended the Sprint-scope-only path, citing Sprint 62 as the controlling precedent.

## Governance Decision

**APPROVE SPRINT-SCOPE RATIFICATION ONLY.** Sprint 70 does not introduce a new architectural mechanism. It validates the already-ratified and implemented Milestone 10 lifecycle across the existing public contracts established by Sprints 63 through 69. No RFC-0004 amendment is required. The Sprint Owner authorizes `nexus-plan` to activate Sprint 70 as detailed in the Sprint 70 Sprint Implementation Record (`knowledge/implementation/sprints/sprint-0070-autonomous-engineering-integration-validation.md`), including its binding Objective, Architectural Intent, Required Validation Scenarios (1–8), Lifecycle Certification Flow, Event Ordering Assertions, Consumer Separation proof obligations, Production Source Restrictions, Category 6 Observation non-expansion rule, Repository Synchronization requirement, Acceptance Criteria, Milestone 10 Completion Conditions, and Builder Stop Conditions, reproduced in full in that record.

**Production Source Restrictions (binding):** Sprint 70 SHALL NOT modify production behavior in Mission, EngineeringSession, WorkflowChain, Engineering Decision Correlation, Governance Decision, Review, Recovery Requirement, projections, event consumers, Host, or Adapters. Permitted source changes are limited to test-support code that does not alter production semantics. If integration testing exposes an actual production defect, the Builder SHALL stop, document the defect with evidence, identify the owning Sprint or RFC, and await Sprint Owner authorization — Sprint 70 SHALL NOT silently repair architecture while acting as a validation sprint.

**Category 6 Observations (binding):** existing non-blocking Category 6 observations SHALL remain deferred unless they directly prevent the integration suite from executing. Sprint 70 SHALL NOT become a general cleanup sprint.

**Milestone 10 Completion Conditions (binding):** Sprint 70 SHALL recommend Milestone 10 closure only if all required integration scenarios pass, no Category 1–5 findings remain, no architectural contradiction is discovered, all Milestone 10 capabilities compose through public contracts, repository state is synchronized, and no open Builder task remains. If a defect is found, Milestone 10 remains open and the defect SHALL be routed through the existing review and recovery workflow rather than closed over.

## RFC Coverage

- RFC-0001 — Mission Model (Referenced; consumed read-only)
- RFC-0004 v1.16 — Execution Model (Referenced; consumed read-only, unmodified)
- RFC-0005 — Domain Event Model (Referenced; consumed read-only)
- RFC-0006 — Engineering Assessment Model (Referenced; consumed read-only)
- RFC-0011 — Engineering Governance Model (Referenced; consumed read-only)

No RFC is amended. No RFC-owned concept is redefined.

## Authorized Concepts

- An integration-only test suite exercising the composed Milestone 10 lifecycle (Sprints 63–69) through existing public service contracts and existing Kernel composition wiring, exclusively.
- Integration fixtures, deterministic test helpers, lifecycle assertions, event-order assertions, idempotency assertions, and failure-isolation assertions.
- Milestone 10 certification documentation and a Milestone 10 closure recommendation (Ready to Close / Not Ready, with justification), recorded in the Sprint 70 record's Reserved Sections.
- Repository-state synchronization across `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and the Sprint 70 record.
- A narrowly targeted, reported production defect fix, strictly required to make a Required Validation Scenario pass — SHALL be explicitly called out in `IMPLEMENTATION_REPORT.md` as defect remediation, not new capability, per the same authorization pattern as Sprint 62.

## Deferred Concepts

- Autonomous Mission planning, dynamic Workflow generation, AI deliberation, automatic policy generation, automatic recovery execution, provider selection, distributed orchestration, durable event infrastructure, production telemetry, autonomous deployment, cross-project engineering — each requires future milestone ratification.
- Any new production capability, event, mechanism, lifecycle state, or domain concept.
- Host or Adapter surfacing of any kind.
- General cleanup, dead-code removal, or documentation polish beyond what Repository Synchronization requires.

## Definition of Done

- Required Validation Scenarios 1 through 8 (Approved Governance Path; Rejected Governance Path; Recovery Resolution and Re-Advancement; Governance-Gated Mission Completion; Missing Correlation; Attribution Mismatch; Duplicate and Replay Delivery; Persistence Failure Isolation) and the single composed Lifecycle Certification Flow scenario all pass.
- Consumer Separation is proven: the Advancement Consumer (Sprint 68) and Recovery Consumer (Sprint 69) each perform only their own ratified responsibility across Approved, Rejected, Deferred, and Escalation Required outcomes.
- No Sprint 1–69 production contract, Host, or Adapter file is found to have drifted, or any drift found is reported as a defect and routed through the established review/recovery workflow rather than silently fixed within this Sprint's scope.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build.
- A Milestone 10 closure recommendation is documented in the Sprint 70 record's Reserved Sections.
- `IMPLEMENTATION_MANIFEST.md`'s stale Sprint 69 status line is synchronized (already applied by `nexus-plan` at activation).

## Ownership Model (ratified)

This ratification authorizes one Sprint's scope, at the Implementation Plan tier. It amends no RFC and redefines no previously approved vertical slice. `NEXUS-RAT-2026-07-16-015`'s Milestone 10 Objective, Architectural Boundary, and Initial Capability Sequence remain unmodified; all Sprint 63–69 ratifications and their frozen implementation contracts remain unmodified.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, synchronize the stale Sprint 69 status line in `IMPLEMENTATION_MANIFEST.md`, generate the Sprint 70 Sprint Implementation Record, update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Sprint 70, activate Sprint 70, and prepare Builder handoff.

## Related Sprint(s)

- Sprint 63 — Governance State Projection Foundation (frozen; consumed read-only).
- Sprint 64 — Event-Driven Mission Completion (frozen; consumed read-only).
- Sprint 65 — EngineeringSession Domain Event Publication (frozen; consumed read-only).
- Sprint 66 — Engineering Session State Projection (frozen; consumed read-only).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen; consumed read-only).
- Sprint 68 — Event-Driven Workflow Advancement (frozen; consumed read-only).
- Sprint 69 — Recovery Workflow Automation (frozen; consumed read-only).
- Sprint 70 — Autonomous Engineering Integration Validation (this ratification's authorized scope).
- Sprint 62 — Governance Automation Integration Validation and Milestone 9 Certification (controlling precedent for a validation-only, no-new-capability integration Sprint).

## Related Review(s)

None yet. Sprint 70 has not been reviewed.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 70 — Autonomous Engineering Integration Validation as Milestone 10's closing Sprint, validating the complete Milestone 10 lifecycle (Governance state established → `GovernanceDecisionRecorded` → Approved → Event-Driven Workflow Advancement, or Rejected → Recovery Requirement Automation → Recovery resolution → Recovery-Gated Re-Advancement → Governance-Gated Mission Completion) through an integration-only test suite exercising Sprints 63–69's existing public contracts and Kernel composition wiring exclusively. The Sprint SHALL introduce no new production capability, event, mechanism, lifecycle state, or domain concept, and SHALL NOT modify production behavior in Mission, EngineeringSession, WorkflowChain, Engineering Decision Correlation, Governance Decision, Review, Recovery Requirement, projections, event consumers, Host, or Adapters, except a narrowly targeted, reported defect fix strictly required by a Required Validation Scenario. The Sprint SHALL prove Consumer Separation between the Advancement Consumer (Sprint 68) and Recovery Consumer (Sprint 69), event-ordering guarantees (no publication before persistence, no consumer observing unpersisted facts), and idempotent handling of duplicate/replayed events. The Sprint SHALL record a Milestone 10 closure recommendation, and SHALL recommend closure only if all required scenarios pass, no Category 1–5 findings remain, and repository state is synchronized. `nexus-plan` SHALL record this ratification, synchronize the stale Sprint 69 status line in `IMPLEMENTATION_MANIFEST.md`, generate the Sprint 70 Sprint Implementation Record reproducing this ratification's full binding detail, update planning artifacts, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-009

## Ratification Identifier

NEXUS-RAT-2026-07-17-009

## Date

2026-07-17

## Subject

Milestone 10 formal closure; RFC-0001 v1.2 Governance Decision Applicability and Supersession amendment; Milestone 11 — Autonomous Engineering Planning Readiness opening (with RFC-0012 authorization); Sprint 71 — Governance Decision Applicability Correction authorization.

## Originating Request

Following Sprint 70's PASS certification (`NEXUS-REV-2026-07-17-008`) and `builder-task.md`'s confirmation of zero Open, Blocked, or Documentation Builder Tasks, `nexus-plan` presented a Governance Report identifying an unresolved ambiguity: `NEXUS-RAT-2026-07-17-008`'s binding Milestone 10 Completion Conditions were literally satisfied, yet Sprint 70's own record recommended "Not Ready pending future governance resolution" for the historical-decision-superseding Mission Completion gap it discovered (a historical Rejected `GovernanceDecision` remains independently blocking under RFC-0001 v1.1 §15a even after Recovery Requirement resolution, re-advancement, and a later Approved `GovernanceDecision` for the same governed position). The Sprint Owner resolved this in two decision rounds: (1) close Milestone 10 now, carrying the gap forward as a documented Known Limitation rather than a closure blocker; (2) require an RFC-0001 ownership analysis and corrective amendment before any autonomous-planning activation work, and authorize a new RFC-0012 for the distinct Autonomous Engineering Planning domain. `nexus-plan`'s RFC-0001 ownership analysis (consulting RFC-0001 §15a and RFC-0011's explicit disclaimer of Mission-completion-consumption ownership) confirmed RFC-0001 is the owning specification for the "applicable `GovernanceDecision`" definition. `nexus-plan` drafted an RFC-0001 v1.2 amendment; the Sprint Owner returned four required corrections (D2 must be Approved; corrected recovery-then-re-evaluation lifecycle ordering; exact recovery causality tracing to `D1`; preserved non-transitive, non-chronological independent satisfaction) and supplied final replacement text, incorporated into RFC-0001 v1.2 by `nexus-plan` prior to this ratification.

## Governance Decision

**APPROVED, AS DIRECTED, IN FULL.**

### 1. Milestone 10 — Autonomous Engineering Readiness: COMPLETE

All `NEXUS-RAT-2026-07-17-008` binding Completion Conditions are satisfied: all eight Required Validation Scenarios and the composed Lifecycle Certification Flow pass; zero Category 1–5 findings remain; the unratified latest-decision Mission Completion change was fully reverted and RFC-0001 v1.1 §15a's independent-satisfaction behavior was restored and independently verified (`NEXUS-REV-2026-07-17-008`); all Milestone 10 capabilities compose through public contracts; repository state is synchronized; no open Builder Task remains. The historical-decision-superseding gap is **not** a Category 1–5 finding — it was explicitly and correctly classified as a documented Known Limitation, discovered and disclosed rather than concealed, requiring its own future architectural resolution. It therefore does not block closure under `NEXUS-RAT-2026-07-17-008`'s literal Completion Conditions, consistent with the Milestone 9 / Sprint 62 closure precedent (`NEXUS-RAT-2026-07-16-014`), where deferred concepts did not block closure.

**Carried-Forward Known Limitation (binding, permanent record):** Under RFC-0001 v1.1 §15a, historical Rejected `GovernanceDecision`s remain independently blocking; Recovery Requirement resolution does not by itself change `GovernanceDecision` applicability; a later Approved `GovernanceDecision` does not automatically supersede an earlier Rejected decision; "latest decision wins" is explicitly unauthorized. This limitation is resolved by RFC-0001 v1.2, below, and by Sprint 71's implementation of it — it is retained here for traceability of the governance history, not as an open item.

### 2. RFC-0001 amended to v1.2 (ratified)

RFC-0001 § 15a's definition of "applicable `GovernanceDecision`" is narrowed by the supersession rule now recorded in `knowledge/specifications/rfc-0001-mission-model.md` (Amendment History v1.2 and § 15a body), incorporating the Sprint Owner's four required corrections in full:

1. The superseding decision `D2` SHALL have outcome `Approved`.
2. The lifecycle order is: `D1` Rejected → `RecoveryRequirement` created from `D1` → authoritative accepted recovery outcome → `RecoveryRequirement` Resolved → governance re-evaluation of the same governed position produces `D2` → `D2` Approved → Recovery-Gated Re-Advancement becomes eligible. Governance re-evaluation produces `D2`; Recovery-Gated Re-Advancement consumes the resolved recovery and `D2`, and does not itself produce a `GovernanceDecision`.
3. The resolved `RecoveryRequirement` SHALL have been created from `D1`, for the exact same governed position, and SHALL be the recovery basis for the re-evaluation producing `D2`. A `RecoveryRequirement` resolved for unrelated work does not permit supersession.
4. Supersession is scoped to one exact governed position (same Mission, same Engineering Session, same Workflow Step, established by `EngineeringDecisionCorrelation`), is non-transitive across distinct governed positions, is never inferred from chronological order alone, and never overrides a `GovernanceDecision` for a different governed position. "Latest decision wins" globally remains explicitly prohibited.

This amendment does not modify RFC-0004, RFC-0011, `GovernanceDecision`, `RecoveryRequirement`, `WorkflowChain`, `WorkflowStep`, `EngineeringSession`, or `EngineeringDecisionCorrelation` — all are Referenced and consumed read-only, through their existing, frozen public contracts.

### 3. Milestone 11 — Autonomous Engineering Planning Readiness: OPENED

**Objective (binding):** Enable governed, human-reviewed autonomous Mission Plan proposal, built on the corrected Mission Completion baseline established by RFC-0001 v1.2 and Sprint 71.

**Architectural Boundary (binding):** Milestone 11 SHALL NOT redefine Mission, active Mission Plan, Task, Task Graph, Mission completion, Governance Decision, Review, or Shared Reality. RFC-0001 remains the sole owner of active Mission Plan semantics and executable Mission state. No end-to-end autonomous planning integration certification (the sequence's closing step) SHALL proceed until Sprint 71 is Reviewer-certified and the corrected Mission Completion lifecycle is validated.

**RFC-0012 — Autonomous Engineering Planning Model (authorized for future drafting, after Sprint 71):** SHALL own Planning Policy, Proposed Mission Plan, Proposed Plan Revision, Planner Attribution, Structural Plan Validation, Planning Diagnostics, Proposal Lifecycle, Proposal Review Eligibility, and Proposal Activation Eligibility. SHALL NOT redefine Mission, active Mission Plan, Task, Task Graph, Mission completion, Governance Decision, Review, or Shared Reality. Integration boundary: Proposed Mission Plan → Review → Governance → Approved exact proposal revision → RFC-0001 Mission Plan activation.

**Initial Capability Sequence (binding, sequencing only — each future step requires its own Sprint scope ratification):**

1. **Governance Decision Applicability Correction** (Sprint 71, authorized below) — implements RFC-0001 v1.2.
2. **RFC-0012 drafting and ratification.**
3. **Planning Policy and Proposed Plan Foundation.**
4. **Governed Plan Generation.**
5. **Plan Review, Governance, and Activation.**
6. **Autonomous Planning Integration Validation.**

This sequence governs ordering only; it does not pre-authorize any step beyond Sprint 71 below. The provisional compression of steps 3–6 into four Sprints remains subject to revision once RFC-0012 analysis confirms step 5 can safely combine review, governance, and activation without violating ownership boundaries.

### 4. Sprint 71 — Governance Decision Applicability Correction (authorized)

Sprint 71 SHALL implement RFC-0001 v1.2's Governance Decision applicability and supersession semantics by excluding only a precisely superseded Rejected decision from Mission completion evaluation, strictly in `src/kernel/mission/mission-completion-eligibility.ts` and its direct collaborators. No other production file, event, consumer, projection, Host, or Adapter SHALL be modified.

**Required Test Matrix (binding, minimum):**

1. Rejected `D1` → exact `RecoveryRequirement` (created from `D1`) resolved → subsequent Approved `D2` for the same governed position → `D1` excluded from the applicable set; Mission Completion permitted (subject to all other applicable decisions and existing Task-completion rules).
2. A later Rejected `D2` for the same governed position does not supersede `D1`.
3. A later Deferred `D2` for the same governed position does not supersede `D1`.
4. A later Escalation Required `D2` for the same governed position does not supersede `D1`.
5. An Approved decision for a different Workflow Step does not supersede `D1`.
6. An Approved decision for a different Engineering Session does not supersede `D1`.
7. An Approved decision for a different Mission does not supersede `D1`.
8. A `RecoveryRequirement` not caused by `D1` does not permit supersession, even if Resolved.
9. An unresolved or Withdrawn `RecoveryRequirement` does not permit supersession.
10. Existing independent-satisfaction behavior (Sprint 61/62, frozen) is unchanged for every non-superseded `GovernanceDecision`.

## RFC Coverage

- RFC-0001 — Mission Model (Amended to v1.2 by this ratification)
- RFC-0004 v1.16 — Execution Model (Referenced; `EngineeringDecisionCorrelation`, `RecoveryRequirement`, Recovery-Gated Re-Advancement consumed read-only, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision` consumed read-only, unmodified)

## Ownership Model (ratified)

This ratification declares one Milestone complete, amends one RFC at the Constitutional tier (narrowly, additively, per the Sprint Owner's exact corrected text), opens one new Milestone with a binding Objective and Architectural Boundary, and authorizes one Sprint's scope at the Implementation Plan tier. It redefines no previously approved vertical slice: Sprint 61/62's independent-satisfaction behavior remains unmodified for every non-superseded `GovernanceDecision`, and every Sprint 1–70 frozen contract remains unmodified.

## Authorized Scope

`nexus-plan` is authorized to record this ratification; mark Milestone 10 Complete in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`; open Milestone 11 in the same artifacts with its Objective and Architectural Boundary; generate the Sprint 71 Sprint Implementation Record reproducing this ratification's full binding detail; activate Sprint 71; and prepare Builder handoff. RFC-0012 drafting is explicitly **not** authorized by this ratification — it requires its own future `nexus-plan` cycle after Sprint 71 is Reviewer-certified.

## Deferred Concepts

RFC-0012 drafting; Planning Policy; Proposed Mission Plan; Proposed Plan Revision; Planner Attribution; Structural Plan Validation; Planning Diagnostics; Proposal Lifecycle; Proposal Review/Activation Eligibility; Governed Plan Generation; Plan Review/Governance/Activation; Autonomous Planning Integration Validation — each requires its own future Sprint or ratification cycle, gated on Sprint 71's certification.

## Related Sprint(s)

- Sprint 70 — Autonomous Engineering Integration Validation (frozen; consumed read-only; discovered the gap resolved by this ratification).
- Sprint 71 — Governance Decision Applicability Correction (this ratification's authorized implementation scope).
- Sprint 60 — Recovery-Gated Re-Advancement Eligibility (frozen; consumed read-only).
- Sprint 61 — Governance-Gated Mission Completion (frozen; consumed read-only; independent-satisfaction behavior preserved unmodified).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen; consumed read-only).
- Sprint 69 — Recovery Workflow Automation (frozen; consumed read-only).

## Related Review(s)

- `NEXUS-REV-2026-07-17-009` — FAIL. Zero defects found in Sprint 71's source, tests, or Sprint Implementation Record; one Critical Category 3 finding (F-001) that this ratification's RFC-0001 v1.2 replacement text for § 15a had not been transcribed into `knowledge/specifications/rfc-0001-mission-model.md` — only the Version header and Amendment History were updated, leaving the operative section body self-contradictory. Corrected by `nexus-plan` post-review: § 15a's body now carries this ratification's exact Supersession Rule text, retitled "(v1.2)". No change to this ratification's substance was required or made. Sprint 71 is resubmitted for Reviewer re-certification.

## Full Ratification Text

> The Sprint Owner declares Milestone 10 — Autonomous Engineering Readiness COMPLETE, carrying forward the historical-decision-superseding Mission Completion gap as a documented Known Limitation rather than a closure blocker, consistent with the Milestone 9 / Sprint 62 precedent. The Sprint Owner ratifies RFC-0001 v1.2, narrowing § 15a's "applicable `GovernanceDecision`" definition to exclude a Rejected decision precisely superseded by a later Approved decision for the exact same governed position (Mission, Engineering Session, Workflow Step), reached only through the existing Recovery-Gated Re-Advancement path with recovery causality traced back to the superseded decision — never by chronology alone, never across distinct governed positions, and never by selecting one globally latest decision. The Sprint Owner opens Milestone 11 — Autonomous Engineering Planning Readiness, with the binding Objective of enabling governed, human-reviewed autonomous Mission Plan proposal without redefining Mission, active Mission Plan, Task, Task Graph, Mission completion, Governance Decision, Review, or Shared Reality, and authorizes a future RFC-0012 — Autonomous Engineering Planning Model to own the new Planning domain once Sprint 71 is certified. The Sprint Owner authorizes Sprint 71 — Governance Decision Applicability Correction to implement RFC-0001 v1.2 strictly within `mission-completion-eligibility.ts` and its direct collaborators, against the ten-item Required Test Matrix above. `nexus-plan` SHALL record this ratification, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Milestone 10 closure and Milestone 11 opening, generate the Sprint 71 Sprint Implementation Record, activate Sprint 71, and issue Builder handoff. RFC-0012 drafting is deferred to a future `nexus-plan` cycle.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-010

## Ratification Identifier

NEXUS-RAT-2026-07-17-010

## Date

2026-07-17

## Subject

RFC-0012 — Autonomous Engineering Planning Model ratified Final (v1.0); Milestone 11 Initial Capability Sequence step 2 closed; Sprint 72 — Planning Policy and Proposed Plan Foundation authorized (Initial Capability Sequence step 3).

## Originating Request

Following Sprint 71's Reviewer certification (`NEXUS-REV-2026-07-17-010`, PASS, zero open findings), `nexus-plan` drafted RFC-0012 per `NEXUS-RAT-2026-07-17-009`'s authorization, presenting four scoping questions (Proposed Task modeling, Proposal Lifecycle, Review/Governance reuse, Planner Attribution) to the Sprint Owner before drafting. The Sprint Owner returned exact directed decisions for all four, incorporated into RFC-0012 v0.1. The Sprint Owner then required a 16-point consistency review before ratification. `nexus-plan`'s review found the majority of points satisfied but identified five genuine gaps: (1) "Planning Policy" was named in `NEXUS-RAT-2026-07-17-009`'s authorized ownership list but never defined or bounded in the v0.1 draft; (2) repeated Activation of an already-`Activated` revision was not specified as idempotent; (3) Activation of a conflicting revision (a second revision of the same Proposed Mission Plan) was not explicitly rejected; (4) Planning Correlation lacked an explicit Mission-identity mismatch check and a general fail-closed statement, mirroring RFC-0004 Engineering Decision Correlation; (5) Non-Goals omitted explicit exclusion of autonomous objective creation, self-approval, Task execution, and workflow orchestration. `nexus-plan` corrected all five gaps in RFC-0012 v0.2 before requesting ratification.

## Governance Decision

**APPROVED.** RFC-0012 — Autonomous Engineering Planning Model is ratified **Final**, Version 1.0, incorporating v0.2 in full. RFC-0012 owns Planning Policy, Proposed Mission Plan, Proposed Plan Revision, Proposed Task, Proposed Task Dependency, Planner Attribution, Proposal Lifecycle, Planning Correlation, Structural Plan Validation, Planning Diagnostics, and Activation, exactly as recorded in `knowledge/specifications/rfc-0012-autonomous-engineering-planning-model.md`. RFC-0001, RFC-0004, RFC-0005, RFC-0006, RFC-0008, and RFC-0011 are Referenced, consumed read-only, and are not modified by this ratification.

**Binding confirmations (from the Sprint Owner's 16-point review, all satisfied in v0.2):** Proposed Mission Plan/Proposed Plan Revision hold separate identities with append-only, immutable revisions from `Submitted` onward; Review and Governance always target one exact revision via Planning Correlation; a `GovernanceDecision` for one revision cannot authorize another; `Governed` status alone does not imply `Approved`; Activation requires an exact correlated `GovernanceDecision = Approved`; Proposed Tasks are non-executable before Activation; Structural Plan Validation rejects invalid references, self-dependencies, duplicate dependencies, and cycles; Activation revalidates RFC-0001 invariants, is atomic with no partial state, is idempotent for an already-`Activated` revision, rejects conflicting/concurrent Activation, and preserves proposal-to-executable traceability; Planning Correlation fails closed on any missing or mismatched Review, Governance, Mission, revision, correlation, or Planner Attribution reference; Planning Policy cannot modify Mission objective or grant approval authority; RFC-0012 authorizes no autonomous objective creation, self-approval, Adapter selection, Task execution, workflow orchestration, or automatic recovery planning, and no silent Activation; Domain Event implementation remains deferred to future authorized Sprints.

**Milestone 11 Initial Capability Sequence step 2 (RFC-0012 drafting and ratification) is CLOSED.** Step 3 — Planning Policy and Proposed Plan Foundation — is authorized below as Sprint 72.

### Sprint 72 — Planning Policy and Proposed Plan Foundation (authorized)

Sprint 72 SHALL implement, strictly within a new Planning domain module (e.g. `src/kernel/planning/`) and its own repository/service composition, without modifying any Sprint 1–71 production file:

- Planning Policy as deterministic, read-only constraint data (RFC-0012 §Planning Policy).
- `ProposedMissionPlan`, `ProposedPlanRevision`, `ProposedTask`, `ProposedTaskDependency` domain models (RFC-0012, unmodified from the ratified specification).
- Planner Attribution value object exactly as specified (RFC-0012 §Planner Attribution).
- Proposal Lifecycle foundation: the `Draft`/`Submitted`/`Withdrawn` states and their transitions only — `Under Review`, `Governed`, `Activated`, `Rejected`, and `Superseded` are explicitly deferred, since they depend on Planning Correlation, Review, and Governance integration not yet authorized.
- Structural Plan Validation foundation: missing-reference, self-dependency, duplicate-dependency, and cycle validation for Proposed Task Dependencies, evaluated independently of RFC-0001.
- A repository contract and in-memory implementation for Proposed Mission Plans and Revisions, following this repository's established pattern (constructor-injected contracts, snapshot persistence).
- Unit tests for every implemented concept's construction, immutability, validation, and diagnostics.

Sprint 72 SHALL NOT implement: AI plan generation; Review execution or Review integration; Governance evaluation or Planning Correlation's Review/Governance association fields; Activation or any conversion into RFC-0001 executable objects; Domain Event publication for any reserved RFC-0012 event; workflow orchestration; the `Under Review`, `Governed`, `Activated`, `Rejected`, or `Superseded` Proposal Lifecycle states or their transitions.

Sprint 72 SHALL NOT modify `Mission`, `MissionPlan`, `Task`, `TaskDependency`, `Review`, `GovernanceDecision`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, any Execution Model concept, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`.

**Definition of Done:** all Planning Policy, Proposed Mission Plan/Revision/Task/Dependency, Planner Attribution, Draft/Submitted/Withdrawn lifecycle, and Structural Plan Validation behavior specified above is implemented and unit-tested; no Sprint 1–71 production contract, Host, or Adapter file is found to have drifted; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and `IMPLEMENTATION_REPORT.md` are synchronized.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (ratified Final by this ratification)
- RFC-0001, RFC-0004, RFC-0005, RFC-0006, RFC-0008, RFC-0011 (Referenced; consumed read-only, unmodified)

## Ownership Model (ratified)

This ratification ratifies one new RFC Final at the Constitutional tier and authorizes one Sprint's scope at the Implementation Plan tier. It redefines no previously approved vertical slice and modifies no existing RFC.

## Authorized Scope

`nexus-plan` is authorized to record this ratification; mark RFC-0012 Final in its own document; synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` for Milestone 11 Initial Capability Sequence step 2 closure and step 3 opening; generate the Sprint 72 Sprint Implementation Record reproducing this ratification's full binding detail; activate Sprint 72; and prepare Builder handoff.

## Deferred Concepts

Governed Plan Generation; Plan Review, Governance, and Activation; Autonomous Planning Integration Validation (Initial Capability Sequence steps 4–6) — each requires its own future Sprint scope ratification, gated on Sprint 72's certification. `Under Review`/`Governed`/`Activated`/`Rejected`/`Superseded` Proposal Lifecycle states, Planning Correlation's Review/Governance association, and Activation itself — deferred to those future Sprints per RFC-0012.

## Related Sprint(s)

- Sprint 71 — Governance Decision Applicability Correction (frozen; consumed read-only; Reviewer-certified, unblocking this cycle).
- Sprint 72 — Planning Policy and Proposed Plan Foundation (this ratification's authorized implementation scope).

## Related Review(s)

None yet. Sprint 72 has not been reviewed.

## Full Ratification Text

> The Sprint Owner ratifies RFC-0012 — Autonomous Engineering Planning Model Final, Version 1.0, as drafted by `nexus-plan` and corrected to v0.2 following the Sprint Owner's 16-point consistency review, confirming all sixteen points are satisfied without contradiction. RFC-0012 owns Planning Policy, Proposed Mission Plan, Proposed Plan Revision, Proposed Task, Proposed Task Dependency, Planner Attribution, Proposal Lifecycle, Planning Correlation, Structural Plan Validation, Planning Diagnostics, and Activation, and modifies no existing RFC. Milestone 11 Initial Capability Sequence step 2 is closed. The Sprint Owner authorizes Sprint 72 — Planning Policy and Proposed Plan Foundation (Initial Capability Sequence step 3), strictly limited to Planning Policy, the Proposed Mission Plan/Revision/Task/Dependency models, Planner Attribution, the Draft/Submitted/Withdrawn Proposal Lifecycle foundation, and Structural Plan Validation foundation, explicitly excluding AI plan generation, Review execution, Governance evaluation, Activation, conversion into RFC-0001 executable objects, Domain Event publication, and workflow orchestration. `nexus-plan` SHALL record this ratification, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, generate the Sprint 72 Sprint Implementation Record, activate Sprint 72, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-011

## Ratification Identifier

NEXUS-RAT-2026-07-17-011

## Date

2026-07-17

## Subject

Milestone 11 Initial Capability Sequence step 4 renamed from "Governed Plan Generation" to "Planning Service and Proposal Lifecycle Foundation"; Sprint 73 — Planning Service and Proposal Lifecycle Foundation authorized.

## Originating Request

Following Sprint 72's Reviewer certification (`NEXUS-REV-2026-07-17-012`, PASS, fully closed with zero open findings of any category) and confirmation that no open Builder Tasks remain, `nexus-plan` found that Milestone 11 Initial Capability Sequence step 4 ("Governed Plan Generation") has no concrete definition anywhere in RFC-0012, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, or this ledger beyond its bare label — a genuine governance ambiguity, consistent with `NEXUS-RAT-2026-07-16-015`'s own note that "the provisional compression of steps 3–6 ... remains subject to revision." `nexus-plan` presented the Sprint Owner three scoping alternatives plus an open option before drafting any Sprint proposal, mirroring the precedent set before RFC-0012 drafting itself.

## Governance Decision

**APPROVED.** The Sprint Owner directs that Milestone 11 Initial Capability Sequence step 4 be renamed **"Planning Service and Proposal Lifecycle Foundation"**, replacing the label "Governed Plan Generation" wherever it appears in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md`, because no Review, Governance, or Activation behavior is authorized at this step and the prior label implied unsupported semantics.

**Sprint 73 — Planning Service and Proposal Lifecycle Foundation (authorized):**

Sprint 73 SHALL implement, strictly within the existing Planning domain module (`src/kernel/planning/`) established by Sprint 72, without modifying any Sprint 1–72 production file:

- a thin `PlanningService` (mirroring the established `KnowledgeService`/`ReviewService` application-service pattern);
- Kernel composition registration of `PlanningService`;
- support for creating a `ProposedMissionPlan`;
- support for creating immutable `ProposedPlanRevision` instances;
- support for the existing `Draft`, `Submitted`, and `Withdrawn` Proposal Lifecycle transitions only (Sprint 72, frozen; no new state);
- enforcement of RFC-0012 Structural Plan Validation and Planner Attribution requirements at the service boundary, reusing Sprint 72's frozen validation and value objects unmodified;
- deterministic, idempotent proposal creation and revision behavior;
- persistence of proposal state exclusively through the existing Sprint 72 `IProposedMissionPlanRepository`/in-memory implementation, unmodified.

Sprint 73 SHALL NOT implement: Domain Event publication for any RFC-0012-reserved event; the `Under Review`, `Governed`, `Activated`, `Rejected`, or `Superseded` Proposal Lifecycle states or any transition into or out of them; Planning Correlation; RFC-0006 Review integration; RFC-0011 `GovernanceDecision` integration; Activation or any conversion into RFC-0001 executable objects; AI-generated planning, Adapter invocation, or provider/Adapter selection; workflow orchestration.

Sprint 73 SHALL NOT modify `Mission`, `MissionPlan`, `Task`, `TaskDependency`, `Review`, `GovernanceDecision`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, any Execution Model concept, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`. Sprint 73 SHALL NOT modify any Sprint 72 domain model, value object, or validation logic — it consumes them read-only/as-is through a new orchestration layer.

**Definition of Done:** `PlanningService` supports Proposed Mission Plan creation, Proposed Plan Revision creation, and the `Draft`/`Submitted`/`Withdrawn` transitions, registered through Kernel composition, with deterministic diagnostics on every validation failure; unit tests cover construction, idempotency, structural validation reuse, and Planner Attribution enforcement at the service boundary; no Sprint 1–72 production contract, Host, or Adapter file is found to have drifted; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and `IMPLEMENTATION_REPORT.md` are synchronized.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; PlanningService orchestrates Sprint 72's frozen domain model; RFC-0012 unmodified)
- RFC-0001, RFC-0004, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72)

## Ownership Model (ratified)

This ratification renames one non-binding Milestone sequencing label and authorizes one Sprint's scope at the Implementation Plan tier. It modifies no RFC, redefines no previously approved vertical slice, and does not reopen Sprint 72 (frozen).

## Authorized Scope

`nexus-plan` is authorized to record this ratification; rename Milestone 11 Initial Capability Sequence step 4 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`; generate the Sprint 73 Sprint Implementation Record reproducing this ratification's full binding detail; activate Sprint 73; and prepare Builder handoff.

## Deferred Concepts

Domain Event publication for the Planning domain; `Under Review`/`Governed`/`Activated`/`Rejected`/`Superseded` Proposal Lifecycle states; Planning Correlation; RFC-0006 Review integration; RFC-0011 Governance integration; Activation; conversion into RFC-0001 executable objects; AI-generated planning; workflow orchestration — each requires its own future Sprint scope ratification, gated on Sprint 73's certification.

## Related Sprint(s)

- Sprint 72 — Planning Policy and Proposed Plan Foundation (frozen; consumed read-only; Reviewer-certified, unblocking this cycle).
- Sprint 73 — Planning Service and Proposal Lifecycle Foundation (this ratification's authorized implementation scope).

## Related Review(s)

None yet. Sprint 73 has not been reviewed.

## Full Ratification Text

> The Sprint Owner renames Milestone 11 Initial Capability Sequence step 4 from "Governed Plan Generation" to "Planning Service and Proposal Lifecycle Foundation," because no Review, Governance, or Activation behavior is authorized at this step and the prior label implied unsupported semantics. The Sprint Owner authorizes Sprint 73 — Planning Service and Proposal Lifecycle Foundation, strictly limited to a thin `PlanningService`, its Kernel composition registration, Proposed Mission Plan creation, Proposed Plan Revision creation, and the existing `Draft`/`Submitted`/`Withdrawn` Proposal Lifecycle transitions, enforcing RFC-0012 Structural Plan Validation and Planner Attribution requirements and persisting exclusively through the existing Sprint 72 repository, explicitly excluding Domain Event publication, `Under Review`, Planning Correlation, RFC-0006 Review integration, RFC-0011 Governance integration, `Governed`, Activation, conversion into RFC-0001 objects, AI-generated planning, and workflow orchestration. `nexus-plan` SHALL record this ratification, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, generate the Sprint 73 Sprint Implementation Record, activate Sprint 73, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-012

## Ratification Identifier

NEXUS-RAT-2026-07-17-012

## Date

2026-07-17

## Subject

Milestone 11 Initial Capability Sequence step 5 ("Plan Review, Governance, and Activation") decomposed into four independently-scoped Sprints; Sprint 74 — Planning Correlation and Review Entry Foundation authorized.

## Originating Request

Following Sprint 73's Reviewer certification (`NEXUS-REV-2026-07-17-013`, PASS, fully closed with zero open findings of any category) and confirmation that no open Builder Tasks remain, `nexus-plan` found that Milestone 11 Initial Capability Sequence step 5 ("Plan Review, Governance, and Activation") bundles four architecturally distinct RFC-0012 concerns — Planning Correlation and Review initiation, Governance integration, and Activation (with its own roughly ten independent sub-requirements: idempotency, atomicity, concurrent-conflict rejection, revalidation, traceability, sibling supersession) — with no Sprint-level scope defined anywhere in RFC-0012, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, or this ledger, mirroring the exact ambiguity resolved for step 4 by `NEXUS-RAT-2026-07-17-011`. `nexus-plan` presented the Sprint Owner three scoping alternatives (narrow to Correlation/Review-entry only; combine Correlation, Review, and Governance integration; implement the full step as originally labeled) plus an open option, before drafting any Sprint proposal.

## Governance Decision

**APPROVED — NARROW STEP 5.**

Milestone 11 Initial Capability Sequence step 5 SHALL be decomposed into separate implementation Sprints, each independently implemented and Reviewer-certified, because each changes a separate authoritative boundary (Review initiation, Governance correlation, and Activation/executable-state conversion are not safely combinable into one vertical slice):

1. **Sprint 74 — Planning Correlation and Review Entry Foundation** (authorized below).
2. **Sprint 75 — Proposal Governance Integration** (not yet authorized; requires its own future Sprint scope ratification gated on Sprint 74's certification).
3. **Sprint 76 — Approved Plan Activation** (not yet authorized; requires its own future Sprint scope ratification gated on Sprint 75's certification).
4. **Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure** (not yet authorized; requires its own future Sprint scope ratification gated on Sprint 76's certification).

The Milestone 11 Initial Capability Sequence is refined accordingly: step 5 ("Plan Review, Governance, and Activation") is replaced by steps 5–7 above (Sprints 74–76); former step 6 ("Autonomous Planning Integration Validation") becomes step 8, renamed to include explicit Milestone 11 closure (Sprint 77). This refinement is non-binding sequencing only, consistent with `NEXUS-RAT-2026-07-16-015`'s and `NEXUS-RAT-2026-07-17-009`'s existing practice of revising provisional step compression once analysis confirms the safe division of scope; it amends no RFC and redefines no previously approved vertical slice.

### Sprint 74 — Planning Correlation and Review Entry Foundation (authorized)

Sprint 74 SHALL implement, strictly within the existing Planning domain module (`src/kernel/planning/`) established by Sprint 72 and extended by Sprint 73, without modifying any Sprint 1–73 production file:

- an immutable `PlanningCorrelation` record correlating: `missionId`; `ProposedMissionPlanId`; the exact `ProposedPlanRevisionId` under evaluation; Planner Attribution; an RFC-0006 `reviewId`, appended once Review is initiated; and causation/correlation identifiers, consistent with RFC-0005's Domain Event envelope;
- a repository contract and in-memory implementation for `PlanningCorrelation`, following this repository's established pattern (constructor-injected contracts, snapshot persistence, append-only history);
- the `Submitted → Under Review` Proposal Lifecycle transition only, implemented by requiring Review initiation (an RFC-0006 `Review`, consumed through its existing public contract, unmodified) against exactly one immutable `ProposedPlanRevision`;
- deterministic, fail-closed rejection when Planning Correlation association is attempted with: a missing or ambiguous Proposed Mission Plan, Proposed Plan Revision, or Review reference; a Review or Mission reference that does not match the Proposed Mission Plan's own `missionId`; an unresolved Planner Attribution; or a Proposed Mission Plan that has produced a later revision since the correlation was requested;
- a thin `PlanningService` extension (or sibling service) invoking Sprint 72/73's existing `ProposedMissionPlan`/`ProposedPlanRevision` operations and the new `PlanningCorrelation` record, adding no independent business logic beyond orchestration and idempotency detection, mirroring the `KnowledgeService`/`ReviewService`/`PlanningService` precedent;
- deterministic diagnostics for every rejection condition above;
- unit tests covering `PlanningCorrelation` construction, immutability, append-only history, every fail-closed rejection condition, the `Submitted → Under Review` transition (including idempotency for an already-`Under Review` revision), and Planner Attribution enforcement.

Sprint 74 SHALL NOT implement: terminal Review outcome handling or consumption of `ReviewOutcome`; the `Governed` Proposal Lifecycle transition; `GovernanceDecision` correlation or any RFC-0011 Governance evaluation; Activation or any conversion into RFC-0001 executable `MissionPlan`/`Task`/`TaskDependency` objects; Domain Event publication for any RFC-0012-reserved event; AI-generated planning, Adapter invocation, or provider/Adapter selection; workflow orchestration.

Sprint 74 SHALL NOT modify `Mission`, `MissionPlan`, `Task`, `TaskDependency`, `Review`, `GovernanceDecision`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, any Execution Model concept, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`. Sprint 74 SHALL NOT modify any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic — it consumes them read-only/as-is through a new, additive orchestration and correlation layer.

**Definition of Done:** `PlanningCorrelation` is implemented immutably with append-only history; the `Submitted → Under Review` transition is implemented and requires Review initiation against exactly one immutable Proposed Plan Revision; every fail-closed rejection condition above is enforced and tested; Kernel composition registration (if a new service/repository pair is introduced) is additive only; unit tests cover construction, immutability, every rejection condition, transition idempotency, and Planner Attribution enforcement; no Sprint 1–73 production contract, Host, or Adapter file is found to have drifted; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and `IMPLEMENTATION_REPORT.md` are synchronized.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; Planning Correlation and the `Submitted → Under Review` transition implement RFC-0012's Planning Correlation and Proposal Lifecycle sections, unmodified)
- RFC-0006 — Engineering Assessment Model (Referenced; `Review` consumed read-only through its existing public contract, unmodified)
- RFC-0001, RFC-0004, RFC-0005, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72/73)

## Ownership Model (ratified)

This ratification decomposes one non-binding Milestone sequencing step into four and authorizes one Sprint's scope at the Implementation Plan tier. It modifies no RFC, redefines no previously approved vertical slice, and does not reopen Sprint 72 or Sprint 73 (both frozen).

## Authorized Scope

`nexus-plan` is authorized to record this ratification; refine Milestone 11 Initial Capability Sequence step 5 into steps 5–7 (Sprints 74–76) and renumber former step 6 to step 8 (Sprint 77) in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`; generate the Sprint 74 Sprint Implementation Record reproducing this ratification's full binding detail; activate Sprint 74; and prepare Builder handoff.

## Deferred Concepts

Terminal Review outcome handling; `GovernanceDecision` correlation and RFC-0011 Governance integration (Sprint 75); Activation and conversion into RFC-0001 executable objects (Sprint 76); Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77); Domain Event publication for the Planning domain; AI-generated planning; workflow orchestration — each requires its own future Sprint scope ratification, gated on Sprint 74's certification.

## Related Sprint(s)

- Sprint 72 — Planning Policy and Proposed Plan Foundation (frozen; consumed read-only).
- Sprint 73 — Planning Service and Proposal Lifecycle Foundation (frozen; consumed read-only; Reviewer-certified, unblocking this cycle).
- Sprint 74 — Planning Correlation and Review Entry Foundation (this ratification's authorized implementation scope).

## Related Review(s)

None yet. Sprint 74 has not been reviewed.

## Full Ratification Text

> The Sprint Owner directs that Milestone 11 Initial Capability Sequence step 5 ("Plan Review, Governance, and Activation") be decomposed into four independently-scoped, independently-certified Sprints, because Review initiation, Governance correlation, and Activation each change a separate authoritative boundary and must not be combined into one vertical slice. The Sprint Owner authorizes Sprint 74 — Planning Correlation and Review Entry Foundation, strictly limited to an immutable `PlanningCorrelation` record correlating Mission, Proposed Mission Plan, exact Proposed Plan Revision, RFC-0006 Review, and Planner Attribution; the `Submitted → Under Review` Proposal Lifecycle transition; fail-closed rejection on missing, ambiguous, cross-Mission, cross-proposal, or cross-revision attribution; append-only correlation history; and repository, thin service, Kernel composition, diagnostics, and tests — explicitly excluding terminal Review outcome handling, the `Governed` transition, `GovernanceDecision` correlation, Governance evaluation, Activation, conversion into RFC-0001 objects, Domain Event publication, AI plan generation, and workflow orchestration. The remaining sequence is refined as: Sprint 74 — Planning Correlation and Review Entry Foundation; Sprint 75 — Proposal Governance Integration; Sprint 76 — Approved Plan Activation; Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure. `nexus-plan` SHALL record this ratification, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, generate the Sprint 74 Sprint Implementation Record, activate Sprint 74, and issue Builder handoff.

## Current Status

Superseded in part by `NEXUS-RAT-2026-07-17-013` (Sprint 74 authorized-scope correction only; the Initial Capability Sequence decomposition and Sprint 74 authorization otherwise remain Active).

---

# NEXUS-RAT-2026-07-17-013

## Ratification Identifier

NEXUS-RAT-2026-07-17-013

## Date

2026-07-17

## Subject

Correction of a self-contradiction in `NEXUS-RAT-2026-07-17-012`'s Sprint 74 authorization: Sprint 74 is explicitly authorized to additively extend the frozen `ProposedPlanRevision` lifecycle with an `Under Review` state and transition method.

## Originating Request

During Sprint 74 implementation, the Builder reported a stop condition: `NEXUS-RAT-2026-07-17-012` authorizes the `Submitted → Under Review` Proposal Lifecycle transition, but Sprint 72/73's frozen `ProposedPlanRevision` lifecycle model implements only `Draft`, `Submitted`, and `Withdrawn` — it has no `Under Review` value — and the same ratification prohibits modifying any Sprint 72/73 domain model, value object, service, or validation logic. Implementing the authorized transition is impossible without either extending that frozen lifecycle or representing `Under Review` as a derived state computed externally from `PlanningCorrelation`, and the ratification did not specify which. `nexus-plan` presented the Sprint Owner both alternatives, plus an open option, before making any correction.

## Governance Decision

**APPROVED — RATIFICATION CORRECTION.**

`NEXUS-RAT-2026-07-17-012`'s Sprint 74 authorization is corrected: Sprint 74 SHALL additively extend the existing `ProposedPlanRevision` lifecycle by adding an `Under Review` state and a corresponding transition method (e.g. `initiateReview()`/`markUnderReview()`), mirroring the precedent established by Sprint 12 → Sprint 14 (`KnowledgeStatus`: Sprint 12 froze `Candidate → Approved` only; Sprint 14 was explicitly ratified to add `Active`/`Superseded`/`Archived` as new transition methods on the same aggregate, without reopening or rewriting Sprint 12's existing behavior).

This extension SHALL be additive only:

- Sprint 72/73's existing `Draft → Submitted`, `Draft → Withdrawn`, and `Submitted → Withdrawn` transitions, their method signatures, and their existing validation and diagnostics SHALL remain byte-for-byte unchanged;
- the new `Under Review` state and its transition method SHALL be added to `ProposedPlanRevision`'s existing lifecycle type/enum and aggregate, following the same construction pattern already used for `Draft`/`Submitted`/`Withdrawn`;
- the new transition SHALL be reachable only from `Submitted`, SHALL be rejected from `Draft` or `Withdrawn`, and SHALL require an associated `PlanningCorrelation` carrying a `reviewId` for the exact same revision, per RFC-0012's Planning Correlation and Proposal Lifecycle sections;
- no other Sprint 72/73 concept (Planning Policy, Structural Plan Validation, `ProposedMissionPlan`, `ProposedTask`, `ProposedTaskDependency`, `PlannerAttribution`, the repository contract) SHALL be modified.

`NEXUS-RAT-2026-07-17-012`'s blanket prohibition on modifying "any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic" is corrected to read: "SHALL NOT modify any Sprint 72 or Sprint 73 domain model, value object, service, or validation logic, **except the additive `ProposedPlanRevision` lifecycle extension explicitly authorized by `NEXUS-RAT-2026-07-17-013`**." All other Sprint 74 authorized scope, boundaries, and deferred concepts from `NEXUS-RAT-2026-07-17-012` remain unchanged and in effect.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (unchanged; this correction clarifies implementation-layer aggregate design, not RFC-0012's Proposal Lifecycle definition, which already describes `Under Review` as a state a Proposed Plan Revision progresses through)

## Ownership Model (ratified)

This ratification corrects a self-contradiction within one prior ratification's Sprint authorization, at the Implementation Plan tier. It amends no RFC and does not reopen Sprint 72's or Sprint 73's already-approved, certified behavior — it authorizes exactly one narrow additive extension to `ProposedPlanRevision`, consistent with the Sprint 12 → Sprint 14 Knowledge precedent for additive lifecycle extension of a previously frozen aggregate.

## Authorized Scope

`nexus-plan` is authorized to record this ratification and update the Sprint 74 Sprint Implementation Record's Authorized Concepts and Architectural Boundaries to reflect the corrected authorization. No change to `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` beyond referencing this ratification is required, since Sprint 74's status and scope label are unchanged.

## Deferred Concepts

Unchanged from `NEXUS-RAT-2026-07-17-012`: terminal Review outcome handling; `GovernanceDecision` correlation and RFC-0011 Governance integration (Sprint 75); Activation (Sprint 76); Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77); Domain Event publication; AI-generated planning; workflow orchestration.

## Related Sprint(s)

- Sprint 72 — Planning Policy and Proposed Plan Foundation (frozen; consumed read-only; its `Draft`/`Submitted`/`Withdrawn` behavior is unmodified by this correction).
- Sprint 73 — Planning Service and Proposal Lifecycle Foundation (frozen; consumed read-only; unmodified by this correction).
- Sprint 74 — Planning Correlation and Review Entry Foundation (this ratification's corrected authorization).

## Related Review(s)

None yet. Sprint 74 has not been reviewed.

## Full Ratification Text

> The Sprint Owner corrects `NEXUS-RAT-2026-07-17-012`'s Sprint 74 authorization, which prohibited modifying any Sprint 72/73 domain model while simultaneously authorizing a `Submitted → Under Review` transition that Sprint 72/73's frozen `ProposedPlanRevision` lifecycle cannot express. Sprint 74 is explicitly authorized to additively extend `ProposedPlanRevision`'s existing lifecycle with an `Under Review` state and transition method, reachable only from `Submitted`, requiring an associated `PlanningCorrelation` with a `reviewId` for the same revision, and leaving every existing Sprint 72/73 transition, method signature, validation rule, and diagnostic byte-for-byte unchanged — mirroring the Sprint 12 → Sprint 14 `KnowledgeStatus` precedent for additive lifecycle extension of a previously frozen aggregate. All other Sprint 74 scope, boundaries, and deferred concepts from `NEXUS-RAT-2026-07-17-012` remain unchanged. `nexus-plan` SHALL record this ratification and update the Sprint 74 Sprint Implementation Record accordingly.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-014

## Ratification Identifier

NEXUS-RAT-2026-07-17-014

## Date

2026-07-17

## Subject

Sprint 75 — Proposal Governance Integration authorized (Milestone 11 Initial Capability Sequence step 6); explicit Repository Policy attribution rule for Proposal Governance evaluation established.

## Originating Request

Following Sprint 74's Reviewer certification (`NEXUS-REV-2026-07-17-014`/`-015`, PASS WITH FINDINGS/PASS, fully closed with zero open findings of any blocking category) and confirmation that no open Builder Tasks remain, `nexus-plan` found that `GovernanceServiceContract.evaluateGovernancePolicy` (RFC-0011) requires an explicit `repositoryPolicyId`/`repositoryPolicyVersion`, and neither RFC-0012 nor any prior ratification specifies which Repository Policy governs a Proposal's Governance evaluation. `nexus-plan` presented the Sprint Owner three alternatives (reuse the Workflow Step policy; require explicit policy attribution with no default; defer Governance evaluation itself to a later Sprint) plus an open option, before drafting the Sprint 75 proposal.

## Governance Decision

**APPROVED — EXPLICIT POLICY ATTRIBUTION.**

Sprint 75 SHALL require an explicit `repositoryPolicyId` and `repositoryPolicyVersion` when initiating Proposal Governance evaluation. The selected Repository Policy reference SHALL be recorded in the immutable `PlanningCorrelation` for the exact Proposed Plan Revision.

Rules (binding):

- No default Repository Policy.
- No reuse based solely on Workflow Step configuration.
- No Host- or Kernel-inferred policy selection.
- No automatic policy routing or scoring.
- The referenced policy must exist, be effective, and be valid for the evaluation.
- Missing, invalid, superseded, or unresolved policy attribution SHALL fail closed.
- Repeated evaluation of the same Proposal Revision SHALL use the same recorded policy reference.
- Changing the policy requires a new governance evaluation and correlation record.

RFC-0011 remains the sole owner of Repository Policy and Governance evaluation semantics; this ratification introduces no new Repository Policy concept and modifies no RFC-0011 behavior.

### Sprint 75 — Proposal Governance Integration (authorized)

Sprint 75 SHALL implement, strictly within the existing Planning domain module (`src/kernel/planning/`) established by Sprint 72, extended by Sprint 73, and extended by Sprint 74, without modifying any Sprint 1–74 production file except the one additive `PlanningCorrelation`/`ProposedPlanRevision` extension named below:

- an additive extension to the existing `PlanningCorrelation` record (Sprint 74, frozen except for this extension) carrying: an explicit `repositoryPolicyId`, `repositoryPolicyVersion` (required at Governance-evaluation initiation, no default); a `governanceDecisionId`, appended once Governance evaluation produces a decision;
- terminal RFC-0006 Review outcome consumption for the exact `Under Review` Proposed Plan Revision identified by the Planning Correlation, through `Review`'s existing public contract (unmodified) — reading the terminal `ReviewOutcome` only, never reinterpreting or duplicating it;
- invocation of the existing `GovernanceServiceContract.evaluateGovernancePolicy` (RFC-0011, unmodified) with the Planning Correlation's `missionId`, correlated `reviewId`, and the caller-supplied `repositoryPolicyId`/`repositoryPolicyVersion`, exactly mirroring the existing `EngineeringDecisionCorrelationService` pattern (RFC-0004, Sprint 67, unmodified) for associating a produced `GovernanceDecision`;
- the `Under Review → Governed` Proposal Lifecycle transition (additive extension to `ProposedPlanRevision`'s lifecycle, mirroring the Sprint 74/`NEXUS-RAT-2026-07-17-013` `Under Review` precedent), reachable only from `Under Review`, requiring a `PlanningCorrelation` carrying a `governanceDecisionId` whose resolved `GovernanceDecision` outcome is `Approved` and whose `missionId` exactly matches the Planning Correlation's `missionId`;
- the `Under Review → Rejected` and `Governed → Rejected` Proposal Lifecycle transitions (additive extensions, same lifecycle type), reached when: the correlated Review reaches a non-eligible outcome for Governance evaluation; or a produced `GovernanceDecision` outcome is not `Approved` (including `Escalation Required` and `Deferred`, per RFC-0011's existing outcome set — Deferred SHALL NOT be treated as eligible for `Governed`, consistent with RFC-0012's "Only a `Governed` revision whose correlated `GovernanceDecision` outcome is `Approved`");
- deterministic, fail-closed diagnostics for: missing, invalid, superseded, or unresolved Repository Policy attribution; a non-terminal or missing Review outcome; a `GovernanceDecision`/Review Mission-identity mismatch against the Planning Correlation's own `missionId`; re-evaluation attempted with a different `repositoryPolicyId`/`repositoryPolicyVersion` than the one already recorded for that Planning Correlation; and any other missing/ambiguous reference — no fallback inference is authorized;
- unit tests covering: Repository Policy attribution recording and its no-default/no-inference/no-reuse rule; re-evaluation-with-different-policy rejection; terminal Review outcome consumption (eligible and non-eligible); the `Under Review → Governed` transition and its `Approved`-only precondition; both `Rejected` paths; Mission-identity mismatch rejection; and idempotency for an already-`Governed`/already-`Rejected` revision.

Sprint 75 SHALL NOT implement: Activation or any conversion into RFC-0001 executable `MissionPlan`/`Task`/`TaskDependency` objects; the `Superseded` Proposal Lifecycle transition (Activation-triggered, Sprint 76); Domain Event publication for any RFC-0012-reserved event; any new Repository Policy concept, policy authoring, policy versioning mechanism, or policy selection/routing logic (RFC-0011 remains the sole owner; Sprint 75 only attributes an existing, externally-identified policy reference); AI-generated planning, Adapter invocation, or provider/Adapter selection; workflow orchestration.

Sprint 75 SHALL NOT modify `Mission`, `MissionPlan`, `Task`, `TaskDependency`, `Review`, `GovernanceDecision`, `GovernanceService`, `EngineeringDecisionCorrelation`, `RecoveryRequirement`, any Execution Model concept, any event, any event consumer, any projection, `src/hosts`, or `src/adapters`. Sprint 75 SHALL NOT modify any Sprint 72, 73, or 74 domain model, value object, service, or validation logic — it consumes them read-only/as-is, except for the one additive `PlanningCorrelation`/`ProposedPlanRevision` lifecycle extension named above.

**Definition of Done:** `PlanningCorrelation` carries explicit Repository Policy attribution with no default, no inference, and no cross-policy re-evaluation; terminal Review outcome consumption and Governance evaluation are correctly invoked through existing, unmodified RFC-0006/RFC-0011 public contracts; the `Under Review → Governed` transition enforces the `Approved`-only precondition and Mission-identity match; both `Rejected` paths are implemented and tested; every fail-closed rejection condition above is enforced and tested; no Sprint 1–74 production contract, Host, or Adapter file is found to have drifted beyond the one authorized additive extension; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and `IMPLEMENTATION_REPORT.md` are synchronized.

## RFC Coverage

- RFC-0012 v1.0 — Autonomous Engineering Planning Model (Referenced; Planning Correlation's Governance extension and the `Governed`/`Rejected` Proposal Lifecycle transitions implement RFC-0012's Planning Correlation and Proposal Lifecycle sections, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; `GovernanceDecision`/`GovernanceServiceContract.evaluateGovernancePolicy` consumed read-only through its existing public contract, unmodified)
- RFC-0006 — Engineering Assessment Model (Referenced; terminal `Review`/`ReviewOutcome` consumed read-only, unmodified)
- RFC-0001, RFC-0004, RFC-0005, RFC-0008 (Referenced; consumed read-only, unmodified, unchanged from Sprint 72–74)

## Ownership Model (ratified)

This ratification authorizes one Sprint's scope at the Implementation Plan tier and establishes one binding Repository Policy attribution rule for the Planning domain. It modifies no RFC, redefines no previously approved vertical slice, and does not reopen Sprint 72, 73, or 74 (all frozen except the one additive extension it authorizes).

## Authorized Scope

`nexus-plan` is authorized to record this ratification; generate the Sprint 75 Sprint Implementation Record reproducing this ratification's full binding detail; update `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` to activate Sprint 75; and prepare Builder handoff.

## Deferred Concepts

Activation and conversion into RFC-0001 executable objects; the `Superseded` transition (Sprint 76); Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77); Domain Event publication for the Planning domain; AI-generated planning; workflow orchestration; any new Repository Policy authoring/versioning/selection mechanism — each requires its own future Sprint scope ratification, gated on Sprint 75's certification (Sprint 76) or remaining permanently out of RFC-0012's scope (Repository Policy authoring, owned exclusively by RFC-0011).

## Related Sprint(s)

- Sprint 72 — Planning Policy and Proposed Plan Foundation (frozen; consumed read-only).
- Sprint 73 — Planning Service and Proposal Lifecycle Foundation (frozen; consumed read-only).
- Sprint 74 — Planning Correlation and Review Entry Foundation (frozen except for this ratification's authorized `PlanningCorrelation`/`ProposedPlanRevision` extension; consumed read-only otherwise).
- Sprint 67 — Engineering Decision Correlation Foundation (frozen; precedent pattern mirrored, not modified).
- Sprint 75 — Proposal Governance Integration (this ratification's authorized implementation scope).

## Related Review(s)

None yet. Sprint 75 has not been reviewed.

## Full Ratification Text

> The Sprint Owner authorizes Sprint 75 — Proposal Governance Integration, requiring an explicit `repositoryPolicyId` and `repositoryPolicyVersion` when initiating Proposal Governance evaluation, with no default, no reuse based solely on Workflow Step configuration, no Host- or Kernel-inferred policy selection, and no automatic policy routing or scoring; the referenced policy must exist, be effective, and be valid for the evaluation; missing, invalid, superseded, or unresolved policy attribution SHALL fail closed; repeated evaluation of the same Proposal Revision SHALL use the same recorded policy reference; changing the policy requires a new governance evaluation and correlation record. RFC-0011 remains the sole owner of Repository Policy and Governance evaluation semantics. Sprint 75 is authorized to implement terminal Review outcome handling; `GovernanceDecision` evaluation for the exact Proposed Plan Revision; Repository Policy attribution; `GovernanceDecision` correlation; and the `Under Review → Governed` transition (and its `Rejected` counterparts). Activation and RFC-0001 conversion remain deferred to Sprint 76. `nexus-plan` SHALL record this ratification, generate the Sprint 75 Sprint Implementation Record, synchronize `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, activate Sprint 75, and issue Builder handoff.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-015

## Ratification Identifier

NEXUS-RAT-2026-07-17-015

## Date

2026-07-17

## Subject

Resolution of `NEXUS-REV-2026-07-17-016-F-001` (Category 2, Critical): RFC-0011 `GovernanceDecision` outcomes `Deferred` and `Escalation Required` are not Proposal Lifecycle states; RFC-0012 amended to v1.1; corrective scope authorized for `BT-075-001`.

## Originating Request

`NEXUS-REV-2026-07-17-016` found that Sprint 75's `PlanningCorrelationService.evaluateGovernance` collapsed all non-`Approved` `GovernanceDecision` outcomes (`Rejected`, `Deferred`, `Escalation Required`) into the terminal `Rejected` Proposal Lifecycle state, violating RFC-0011's explicit prohibition on treating `Deferred` or `Escalation Required` as either `Approved` or `Rejected`, and specifically undermining Canon 12 (Human Authority) for `Escalation Required`. `nexus-sprint` translated this into `BT-075-001`, Blocked, pending a Sprint Owner Ratification defining how these two `GovernanceDecision` outcomes are represented in the Proposal Lifecycle, since RFC-0012 v1.0 did not address this case and no ratification may introduce new domain behavior without Sprint Owner decision.

## Governance Decision

**APPROVED — GOVERNANCE RESOLUTION.**

RFC-0012 SHALL NOT introduce separate Proposal Lifecycle states for `Deferred` or `Escalation Required`. These are RFC-0011 `GovernanceDecision` outcomes, not Proposal Lifecycle states.

The Proposal Lifecycle SHALL represent them as follows:

- `Approved` → transition `Under Review → Governed`; eligible for Activation.
- `Rejected` → transition `Under Review → Rejected`; terminal for that revision.
- `Deferred` → remain `Under Review`; not eligible for Activation.
- `Escalation Required` → remain `Under Review`; not eligible for Activation.

Rules (binding):

- `Deferred` and `Escalation Required` SHALL be recorded through the immutable `PlanningCorrelation` and `GovernanceDecision` reference.
- Neither outcome SHALL imply Governance completion.
- Neither outcome SHALL permit Activation.
- A later Governance evaluation for the same exact Proposed Plan Revision MAY produce a new authoritative decision.
- Only an `Approved` decision may transition the revision to `Governed`.
- A `Rejected` revision may continue only through creation of a new Proposed Plan Revision.
- No new lifecycle values are authorized.

### RFC-0012 Amendment (authorized)

RFC-0012 is amended to v1.1: the Proposal Lifecycle section's `Under Review`, `Governed`, and `Rejected` state definitions are corrected to reflect the rules above; a new paragraph is added stating that `Deferred`/`Escalation Required` outcomes are not Proposal Lifecycle states, do not transition the revision, are not eligible for Activation, and do not imply Governance completion; the Planning Correlation section's `governanceDecisionId` field is corrected from strictly append-once-immutable to immutable only once a terminal (`Approved`/`Rejected`) outcome is reached, permitting supersession by a later Governance evaluation while the outcome remains `Deferred`/`Escalation Required`. No other RFC-0012 section is amended. RFC-0011 is not modified.

### Sprint 75 Corrective Scope (authorized)

`BT-075-001` is unblocked. The Builder SHALL implement, strictly within `src/kernel/planning/`, without modifying `src/kernel/review/`, `src/kernel/governance/`, `src/hosts`, or `src/adapters`:

- Correct `PlanningCorrelationService.evaluateGovernance`'s outcome handling to distinguish all four `GovernanceDecisionValue` values: `Approved` transitions the revision `Under Review → Governed`; `Rejected` transitions the revision `Under Review → Rejected` (unchanged from the existing, already-Reviewer-confirmed-correct branch); `Deferred` and `Escalation Required` leave the current revision at `Under Review` and record the `GovernanceDecision` reference on the `PlanningCorrelation` without any Proposal Lifecycle transition.
- Correct `PlanningCorrelation.associateGovernanceDecision` (and/or `evaluateGovernance`'s orchestration) so that a `governanceDecisionId` referencing a `Deferred` or `Escalation Required` `GovernanceDecision` MAY be superseded by a later Governance evaluation's `GovernanceDecision` for the same exact revision, while a `governanceDecisionId` referencing an `Approved` or `Rejected` `GovernanceDecision` remains immutable exactly as already implemented (the existing `PlanningCorrelationAssociationRejectedError`/`InvalidPlanningCorrelationDefinitionError` rejection behavior for terminal outcomes is unchanged).
- The existing `assertPolicyReevaluationIsStable` Repository Policy stability rule is unchanged: a later Governance evaluation permitted by this correction SHALL still use the same recorded Repository Policy reference; changing the Repository Policy still requires a new Planning Correlation, per `NEXUS-RAT-2026-07-17-014`, unchanged.
- Add unit tests exercising `Deferred` and `Escalation Required` `GovernanceDecision` outcomes explicitly: the revision remains `Under Review`, is not eligible for Activation (no `Governed` transition occurs), the `GovernanceDecision` reference is recorded, and a subsequent Governance evaluation for the same revision may supersede the recorded `governanceDecisionId` and reach a new terminal or non-terminal outcome.

No other Authorized Concept, Architectural Boundary, or Deferred Concept from `NEXUS-RAT-2026-07-17-014` (Sprint 75's original authorization) is altered by this correction. Activation, the `Superseded` transition, Domain Event publication, and Repository Policy authoring/versioning/selection remain deferred to their originally authorized Sprints.

**Definition of Done:** `evaluateGovernance` correctly distinguishes all four `GovernanceDecisionValue` outcomes per the rules above; `Deferred`/`Escalation Required` outcomes leave the revision `Under Review` and do not permit Activation; `governanceDecisionId` supersession is correctly scoped to non-terminal outcomes only; unit tests cover both previously-untested outcomes and re-evaluation-after-`Deferred`/`Escalation Required`; every previously-passing Sprint 72–75 test continues to pass unmodified; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); RFC-0012 v1.1, the Sprint 75 Sprint Implementation Record, `IMPLEMENTATION_REPORT.md`, and `builder-task.md` are synchronized.

## RFC Coverage

- RFC-0012 (Amended to v1.1 by this ratification — Proposal Lifecycle and Planning Correlation sections corrected)
- RFC-0011 — Engineering Governance Model (Referenced; clarifies conformance requirement, unmodified)

## Ownership Model (ratified)

This ratification amends RFC-0012 (Constitutional Layer authority, RFC Specification Suite) to correct a genuine specification gap that the original Sprint 75 authorization (`NEXUS-RAT-2026-07-17-014`) did not anticipate, and authorizes a narrow corrective Sprint 75 implementation scope. It does not reopen or redefine any other Sprint 72–75 authorized concept, and does not modify RFC-0011.

## Authorized Scope

`nexus-plan`/reviewer workflow is authorized to record this ratification; amend RFC-0012 to v1.1; update the Sprint 75 Sprint Implementation Record's Authorized Concepts, Architectural Boundaries, and Ratification sections to reflect the correction; and `nexus-sprint` is authorized to translate this ratification into a corrective, unblocked Builder Task superseding `BT-075-001`'s Blocked status.

## Deferred Concepts

Unchanged from `NEXUS-RAT-2026-07-17-014`: Activation and conversion into RFC-0001 executable objects (Sprint 76); the `Superseded` transition (Sprint 76); Domain Event publication for the Planning domain; any new Repository Policy authoring/versioning/selection mechanism; Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77).

## Related Sprint(s)

- Sprint 72 — Planning Policy and Proposed Plan Foundation (frozen; unaffected).
- Sprint 73 — Planning Service and Proposal Lifecycle Foundation (frozen; unaffected).
- Sprint 74 — Planning Correlation and Review Entry Foundation (frozen; unaffected).
- Sprint 75 — Proposal Governance Integration (this ratification's corrective authorization).

## Related Review(s)

- `NEXUS-REV-2026-07-17-016` (Sprint 75; FAIL; originating Critical finding F-001).
- `NEXUS-REV-2026-07-17-017` (Sprint 75; BT-075-002 Resolution Verification; FAIL unchanged; F-001 remained open pending this ratification).

## Full Ratification Text

> RFC-0012 SHALL NOT introduce separate Proposal Lifecycle states for `Deferred` or `Escalation Required`. These are RFC-0011 GovernanceDecision outcomes, not Proposal Lifecycle states. The Proposal Lifecycle SHALL represent them as follows: `Approved` → transition `Under Review → Governed`, eligible for Activation; `Rejected` → transition `Under Review → Rejected`, terminal for that revision; `Deferred` → remain `Under Review`, not eligible for Activation; `Escalation Required` → remain `Under Review`, not eligible for Activation. `Deferred` and `Escalation Required` SHALL be recorded through the immutable PlanningCorrelation and GovernanceDecision reference; neither outcome SHALL imply Governance completion; neither outcome SHALL permit Activation; a later Governance evaluation for the same exact Proposed Plan Revision MAY produce a new authoritative decision; only an Approved decision may transition the revision to Governed; a Rejected revision may continue only through creation of a new Proposed Plan Revision; no new lifecycle values are authorized. RFC-0012 and the Sprint 75 implementation contract SHALL be updated accordingly, and the corrective Builder task for F-001 SHALL be generated.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-016

## Ratification Identifier

NEXUS-RAT-2026-07-17-016

## Date

2026-07-17

## Subject

Resolution of `NEXUS-REV-2026-07-17-016-F-003` / `NEXUS-REV-2026-07-17-014-F-002` (Category 6, Observation, carried forward): `Review.missionPlanRevision`'s dual, untyped semantics. RFC-0006 amended to v1.1 to define a typed `ReviewPlanRevisionReference`, replacing the opaque string field, ahead of Sprint 76 (Approved Plan Activation).

## Originating Request

`nexus-plan`'s governance scan preceding Sprint 76 scoping found that `Review.missionPlanRevision` (Sprint 9, `review.aggregate.ts`) is an untyped, opaque, non-empty string with no RFC-0006-defined domain semantics. Sprint 74/75's `PlanningCorrelationService.assertReviewMatchesCorrelation` currently populates and matches this field against an RFC-0012 `ProposedPlanRevisionId` — a Planning-domain identifier — while the field's name, its Sprint 9 origin, and `review.service.ts`'s original call sites all imply an RFC-0001 executable Mission Plan revision reference. Two consecutive Reviewer certifications (`NEXUS-REV-2026-07-17-014-F-002`, Sprint 74; `NEXUS-REV-2026-07-17-016-F-003`, Sprint 75) flagged this as a load-bearing ambiguity requiring reconciliation before Sprint 76, because Sprint 76 (Activation) is the first capability that treats this exact correlation as a precondition for an irreversible conversion into executable RFC-0001 state. `nexus-plan` presented this as a Governance Report with three alternatives (leave as-is; type the reference via RFC-0006 amendment; defer to a dedicated pre-Sprint-76 correction sprint). The Sprint Owner selected typing the reference via RFC-0006 amendment, to be completed before Sprint 76 implementation proceeds.

## Governance Decision

**APPROVED — TYPE THE REVIEW REVISION REFERENCE.**

`Review`'s revision-under-assessment reference SHALL no longer be represented as an untyped opaque string. It SHALL be represented as an explicit, discriminated reference identifying its owning domain:

```text
ReviewPlanRevisionReference
- kind: ExecutableMissionPlan | ProposedPlanRevision
- revisionId: string
```

Rules (binding):

- `kind: ExecutableMissionPlan` identifies an RFC-0001 executable `MissionPlan` revision (Sprint 3's `revisionNumber`-derived reference), matching every pre-Sprint-74 `Review` use of this field.
- `kind: ProposedPlanRevision` identifies an RFC-0012 `ProposedPlanRevisionId` (Sprint 74/75's Planning Correlation use of this field).
- This is a rename/typing correction of an existing field, not a new concept: no third `kind` value, no additional Review-owned domain behavior, and no change to `Review`'s lifecycle, `ReviewOutcome`, `Finding`, or any other RFC-0006 concept is authorized by this ratification.
- `PlanningCorrelationService.assertReviewMatchesCorrelation` SHALL be corrected to compare `kind: ProposedPlanRevision` and `revisionId` explicitly, rather than treating the field as an opaque string; a `Review` whose reference `kind` is not `ProposedPlanRevision` SHALL be rejected as a Planning Correlation mismatch (fail-closed), rather than compared as if it were.
- Every existing caller that constructs a `Review` for an RFC-0001 executable Mission Plan revision (pre-Sprint-74 call sites) SHALL be updated to supply `kind: ExecutableMissionPlan` with the same `revisionId` value already in use today; no behavioral change to those call sites' outcomes is authorized.
- This is a correction to Sprint 9's frozen `Review` model, narrowly scoped to this one field's representation; no other Sprint 9/11 `Review`/`Finding` behavior, validation rule, diagnostic, or event shape is reopened.

### RFC-0006 Amendment (authorized)

RFC-0006 is amended to v1.1: the "Assessment Session" section's `Mission Plan Revision` record is corrected to specify that this reference SHALL be represented as a typed `ReviewPlanRevisionReference` (`kind: ExecutableMissionPlan | ProposedPlanRevision`, `revisionId`), disambiguating an RFC-0001 executable Mission Plan revision from an RFC-0012 Proposed Plan Revision. An Amendment History section is added recording this change. No other RFC-0006 section is amended. RFC-0001 and RFC-0012 are not modified by this ratification.

### Sprint 76 Scope Interaction (authorized)

Sprint 76 (Approved Plan Activation) SHALL implement this typed reference as a prerequisite correction, strictly scoped as above, before or alongside implementing Activation itself. This ratification does not itself authorize Activation or any other Sprint 76 concept — Sprint 76's full scope requires its own Sprint Proposal and Sprint Owner approval, per `nexus-plan`'s process.

**Definition of Done (for this correction):** `Review`'s revision reference is represented as `ReviewPlanRevisionReference` with an explicit `kind` discriminator; every existing pre-Sprint-74 call site is migrated to `kind: ExecutableMissionPlan` with no behavioral change; `PlanningCorrelationService.assertReviewMatchesCorrelation` explicitly checks `kind: ProposedPlanRevision` and fail-closes on any other `kind`; every previously-passing Sprint 9–75 test continues to pass (updated only for the field's shape, not its outcome); RFC-0006 v1.1 is published; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build).

## RFC Coverage

- RFC-0006 (Amended to v1.1 by this ratification — Assessment Session's Mission Plan Revision record corrected)
- RFC-0012 — Autonomous Engineering Planning Model (Referenced; `ProposedPlanRevisionId` consumed as one of the two typed `kind` values, unmodified)
- RFC-0001 — Mission Model (Referenced; executable Mission Plan revision consumed as the other typed `kind` value, unmodified)

## Ownership Model (ratified)

This ratification amends RFC-0006 (Constitutional Layer authority, RFC Specification Suite) to correct a genuine specification gap identified by `nexus-plan`'s governance scan, and authorizes a narrow corrective migration within Sprint 76's future scope. It does not reopen or redefine any other RFC-0006 concept, and does not modify RFC-0001 or RFC-0012.

## Authorized Scope

`nexus-plan` is authorized to record this ratification and amend RFC-0006 to v1.1. Sprint 76's future Sprint Proposal is authorized to include this typed-reference migration as an in-scope prerequisite Authorized Concept, implemented by the Builder and independently verified by the Reviewer as part of Sprint 76's certification.

## Deferred Concepts

Unchanged: Activation and conversion into RFC-0001 executable objects, the `Superseded` Proposal Lifecycle transition, Domain Event publication for the Planning domain, any new Repository Policy authoring/versioning/selection mechanism, and Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77) — each requires Sprint 76's own Sprint Proposal (Activation) or Sprint 77's own future ratification.

## Related Sprint(s)

- Sprint 9 — Review Foundation (frozen; this ratification narrowly corrects `Review`'s revision-reference field shape only, per the rule above).
- Sprint 74 — Planning Correlation and Review Entry Foundation (frozen; `assertReviewMatchesCorrelation`'s comparison logic is corrected per the rule above; no other Sprint 74 behavior is reopened).
- Sprint 75 — Proposal Governance Integration (frozen; unaffected beyond the same `assertReviewMatchesCorrelation` correction).
- Sprint 76 — Approved Plan Activation (not yet authorized; this ratification's correction is a scoped prerequisite for Sprint 76's future Sprint Proposal).

## Related Review(s)

- `NEXUS-REV-2026-07-17-014` (Sprint 74; F-002, Category 6, Observation; originating identification).
- `NEXUS-REV-2026-07-17-016` (Sprint 75; F-003, Category 6, Observation; elevated priority ahead of Sprint 76).

## Full Ratification Text

> `Review`'s revision-under-assessment reference SHALL be represented as a typed `ReviewPlanRevisionReference` (`kind: ExecutableMissionPlan | ProposedPlanRevision`, `revisionId: string`), replacing the existing untyped opaque string field, with no other change to `Review`'s lifecycle, outcome, Finding, validation, or diagnostic behavior. Every existing pre-Sprint-74 call site SHALL be migrated to `kind: ExecutableMissionPlan` with identical `revisionId` values and no behavioral change. `PlanningCorrelationService.assertReviewMatchesCorrelation` SHALL explicitly check `kind: ProposedPlanRevision` and fail closed on any other `kind`. RFC-0006 is amended to v1.1 to define this typed reference. This correction is authorized as an in-scope prerequisite of Sprint 76's future Sprint Proposal (Approved Plan Activation), which requires its own separate Sprint Owner approval for Activation itself.

## Current Status

Active

---

# NEXUS-RAT-2026-07-17-017

## Ratification Identifier

NEXUS-RAT-2026-07-17-017

## Date

2026-07-17

## Subject

Authorizes Sprint 76 — Approved Plan Activation (Milestone 11 Initial Capability Sequence step 7), incorporating a required Activation atomicity refinement over `nexus-plan`'s original Sprint 76 Proposal.

## Originating Request

`nexus-plan` presented a Sprint 76 Proposal (Approved Plan Activation) implementing RFC-0012's Activation section by sequentially invoking `MissionPlanningService`'s existing public operations (`createMissionPlan`, `addTask` per Proposed Task). The Sprint Owner identified a critical boundary gap: `MissionPlanningService`'s existing operations each independently persist and publish Domain Events per call (`saveMissionPlan` immediately followed by `publishRecordedEvents`); sequentially invoking multiple such operations cannot, by itself, guarantee all-or-nothing Activation — a failure partway through converting a multi-Task Proposed Plan Revision could leave a partially-created executable `MissionPlan` and/or already-published RFC-0001 Domain Events for an Activation that ultimately fails.

## Governance Decision

**APPROVED WITH REQUIRED ACTIVATION ATOMICITY REFINEMENT.**

Sprint 76 — Approved Plan Activation is authorized, incorporating the following binding Required Activation Guarantees in addition to `nexus-plan`'s original Sprint 76 Proposal (typed `ReviewPlanRevisionReference` migration per `NEXUS-RAT-2026-07-17-016`, plus RFC-0012 Activation).

### Required Activation Guarantees (binding)

Activation SHALL:

- validate every RFC-0012 and RFC-0001 precondition before the first executable write;
- stage the complete `MissionPlan`, `Task`, and `TaskDependency` conversion before commit;
- commit all executable objects and lifecycle transitions as one exclusive operation;
- publish RFC-0001 Domain Events only after the entire commit succeeds;
- publish no events and preserve no executable state if any operation fails;
- prevent concurrent sibling revisions of the same Proposed Mission Plan from both activating;
- return the existing Activation result for an idempotent retry of the same already-`Activated` revision;
- reject Activation of a different revision once one revision of the same Proposed Mission Plan is already `Activated`;
- preserve exact traceability to `ProposedMissionPlanId`, `ProposedPlanRevisionId`, the typed `ReviewPlanRevisionReference`, `ReviewId`, and the terminal `Approved` `GovernanceDecisionId`.

### Permitted Architecture (non-mandatory guidance)

The implementation MAY introduce a narrow transaction or unit-of-work abstraction around the existing `MissionPlanningService` — for example, a staging decorator over the `IMissionPlanRepository`/`IMissionRepository` contracts and a buffering `EventBusContract` decorator, both flushed to the real repository/event bus only after every conversion step succeeds — but SHALL NOT duplicate RFC-0001 domain rules, SHALL NOT bypass `MissionPlanningService`'s existing public operations, and SHALL NOT modify `MissionPlanningService`, `MissionPlan`, `Task`, or `TaskDependency` themselves.

### Typed Review Migration (confirmed, unchanged from `NEXUS-RAT-2026-07-17-016`)

- pre-Sprint-74 Reviews → `kind: ExecutableMissionPlan`;
- planning Reviews → `kind: ProposedPlanRevision`;
- comparison includes both `kind` and `revisionId`;
- legacy untyped values are not silently inferred;
- mismatched revision kinds fail closed.

### Scope Confirmation

Still deferred, unchanged: RFC-0012 Domain Event publication (the Planning-domain event catalog, e.g. `ProposedMissionPlanActivated` — distinct from the RFC-0001 Domain Events Activation itself publishes via `MissionPlanningService`); AI-generated planning; Adapter invocation or selection; workflow orchestration/participation; new Repository Policy authoring/versioning/selection mechanisms; Milestone 11 Autonomous Planning Integration Validation and closure (Sprint 77).

**Definition of Done:** every Required Activation Guarantee above is implemented and independently testable; no partial executable state or premature event publication is observable under any injected mid-Activation failure; concurrent Activation of two sibling revisions resolves exclusively; repeat-Activation of an already-`Activated` revision is idempotent and returns the original result; `MissionPlanningService`, `MissionPlan`, `Task`, and `TaskDependency` remain byte-for-byte unmodified; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build).

## RFC Coverage

- RFC-0012 v1.1 — Autonomous Engineering Planning Model (Primary; implements the Activation section)
- RFC-0006 v1.1 (Referenced; consumes the `ReviewPlanRevisionReference` typed by `NEXUS-RAT-2026-07-17-016`)
- RFC-0001 — Mission Model (Referenced; Activation writes exclusively through `MissionPlanningService`'s existing public operations, unmodified)
- RFC-0011 — Engineering Governance Model (Referenced; terminal `Approved` `GovernanceDecision` re-verified read-only, unmodified)

## Ownership Model (ratified)

This ratification authorizes Sprint 76's implementation scope under RFC-0012 (unmodified) and RFC-0006 v1.1 (amended by `NEXUS-RAT-2026-07-17-016`). It does not modify RFC-0001, RFC-0011, or the Kernel Canon, and does not modify `MissionPlanningService`'s existing public contract.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, activate Sprint 76 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, and generate `knowledge/implementation/sprints/sprint-0076-approved-plan-activation.md` as the Sprint 76 Sprint Implementation Record (Builder implementation contract), incorporating the Required Activation Guarantees above as binding Acceptance Criteria.

## Deferred Concepts

RFC-0012 Domain Event publication for the Planning domain; AI-generated planning; Adapter invocation or selection; workflow orchestration/participation; new Repository Policy authoring/versioning/selection mechanisms; Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77) — each requires its own future Sprint scope ratification.

## Related Sprint(s)

- Sprint 72–75 — Planning domain foundation (frozen; consumed read-only by Sprint 76 except the `NEXUS-RAT-2026-07-17-016` typed-reference correction).
- Sprint 3 — Mission Foundation / `MissionPlanningService` (Sprint 3, frozen; consumed exclusively through its existing public operations, unmodified).
- Sprint 76 — Approved Plan Activation (authorized by this ratification).
- Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure (not yet authorized).

## Related Review(s)

None yet; Sprint 76 has not yet been Reviewer-certified.

## Full Ratification Text

> Sprint 76 — Approved Plan Activation is approved in principle, incorporating a required Activation atomicity refinement over `nexus-plan`'s original Proposal: Activation SHALL validate every precondition before the first executable write; stage the complete conversion before commit; commit all executable objects and lifecycle transitions as one exclusive operation; publish RFC-0001 Domain Events only after the entire commit succeeds; publish no events and preserve no executable state on any failure; prevent concurrent sibling revisions from both activating; return the existing result for an idempotent retry of an already-`Activated` revision; reject Activation of a different revision once one revision is already `Activated`; and preserve exact traceability to `ProposedMissionPlanId`, `ProposedPlanRevisionId`, the typed `ReviewPlanRevisionReference`, `ReviewId`, and the terminal `Approved` `GovernanceDecisionId`. The implementation MAY introduce a narrow transaction/unit-of-work abstraction around the existing `MissionPlanningService` but SHALL NOT duplicate RFC-0001 domain rules or bypass its public operations. The typed Review migration authorized by `NEXUS-RAT-2026-07-17-016` is confirmed unchanged. RFC-0012 Domain Event publication, AI-generated planning, Adapter invocation/selection, workflow participation, new Repository Policy mechanisms, and Milestone 11 integration validation remain deferred.

## Current Status

Active

---

# NEXUS-RAT-2026-07-18-001

## Ratification Identifier

NEXUS-RAT-2026-07-18-001

## Date

2026-07-18

## Subject

Resolution of `NEXUS-REV-2026-07-17-020-F-001` (Category 3, Specification Conflict): authorizes the explicit migration of the legacy `Review` call site in `src/hosts/vscode/host-mission-workflow.ts` to the typed `ReviewPlanRevisionReference`, and withdraws the silent string-inference fallback, unblocking `BT-076-001`.

## Originating Request

`NEXUS-REV-2026-07-17-020` found that Sprint 76's Authorized Concepts required migrating the sole pre-Sprint-74 `Review` construction call site (`host-mission-workflow.ts:471`) to explicitly supply `kind: 'ExecutableMissionPlan'`, while the same Sprint's Architectural Boundaries forbade modifying `src/hosts` — a genuine conflict the Builder did not stop to report, instead retaining a `ReviewPlanRevisionReference | string` union with a silent string-to-`ExecutableMissionPlan` inference path in `review.aggregate.ts`, contrary to the explicit rule ("legacy untyped values are not inferred silently") established by `NEXUS-RAT-2026-07-17-016` and confirmed by `NEXUS-RAT-2026-07-17-017`. `nexus-sprint` translated this into `BT-076-001`, Blocked, presenting two options: (1) authorize the explicit `host-mission-workflow.ts` migration and remove the silent-inference fallback, or (2) ratify the fallback as a permanent, documented exception. The Sprint Owner selected option (1).

## Governance Decision

**APPROVED — REMEDIATION AUTHORIZED (EXPLICIT HOST MIGRATION).**

`src/hosts/vscode/host-mission-workflow.ts:471`'s `reviewService.startReview(...)` call SHALL be updated to construct its `missionPlanRevision` argument explicitly as a typed `ReviewPlanRevisionReference`:

```text
missionPlanRevision: { kind: 'ExecutableMissionPlan', revisionId: missionPlanRevisionId }
```

replacing the current bare-string argument. This is a narrow, content-only edit to the one existing call site — not an architectural redesign of the Host — and is authorized as a one-time, explicitly scoped exception to Sprint 76's general `src/hosts` restriction, limited exclusively to this single line.

Following this migration:

- The `ReviewPlanRevisionReference | string` union SHALL be removed from `CreateReviewInput.missionPlanRevision` (`review.aggregate.ts`), `StartReviewCommand.missionPlanRevision` (`review.contract.ts`), and any other public `Review` construction contract; each SHALL require `ReviewPlanRevisionReference` only.
- The silent string-to-`ExecutableMissionPlan` inference branch in `normalizeReviewPlanRevisionReference` (`review.aggregate.ts`) SHALL be removed; a bare string input SHALL be rejected as an invalid `Review` definition (`InvalidReviewDefinitionError`), not silently coerced.
- Every test currently relying on the string-coercion branch (`host-mission-workflow.test.ts`, `host-mission-workflow-command-registration.test.ts`, `planning-correlation.test.ts`, and any other affected suite) SHALL be updated to construct the typed reference explicitly; no test SHALL continue to pass a bare string to a `Review`-constructing call.
- `IMPLEMENTATION_REPORT.md`'s Sprint 76 section SHALL be corrected so its claim that legacy callers were "normalized... to `kind: 'ExecutableMissionPlan'`" is accurate for every call site, with no remaining bare-string path.

Rules (binding):

- No other change to `Review`'s lifecycle, `ReviewOutcome`, `Finding`, or any other RFC-0006 concept is authorized by this ratification.
- No change to `host-mission-workflow.ts` beyond this one call site's argument construction is authorized.
- This ratification does not reopen `BT-076-002` (Activation's commit-ordering defect), which remains a separately tracked, independently resolvable Builder Task.

**Definition of Done:** `host-mission-workflow.ts:471` constructs the typed `ReviewPlanRevisionReference` explicitly; `CreateReviewInput`/`StartReviewCommand` accept only `ReviewPlanRevisionReference` (no `string` union); the silent-inference branch is removed and a bare string is rejected with a diagnostic; every affected test is updated accordingly with no remaining bare-string `Review` construction anywhere in the repository; `IMPLEMENTATION_REPORT.md` is corrected; every previously-passing Sprint 1–76 test continues to pass (updated only where this migration requires it); repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build).

## RFC Coverage

- RFC-0006 v1.1 (Referenced; completes the `ReviewPlanRevisionReference` migration `NEXUS-RAT-2026-07-17-016` authorized; RFC-0006 itself is not further amended)
- RFC-0012 v1.1 (Referenced; unaffected)

## Ownership Model (ratified)

This ratification completes, rather than amends, the RFC-0006 v1.1 migration authorized by `NEXUS-RAT-2026-07-17-016`. It authorizes a narrow, one-call-site exception to Sprint 76's `src/hosts` restriction, strictly scoped as above, and does not modify RFC-0001, RFC-0006, RFC-0011, RFC-0012, or the Kernel Canon.

## Authorized Scope

The Builder is authorized to: migrate `host-mission-workflow.ts:471` to the typed `ReviewPlanRevisionReference`; remove the `ReviewPlanRevisionReference | string` union and the silent-inference branch from `review.aggregate.ts`/`review.contract.ts`/`review.types.ts`; update every affected test; and correct `IMPLEMENTATION_REPORT.md`'s Sprint 76 section. `nexus-sprint` is authorized to translate this ratification into an unblocked, Open Builder Task superseding `BT-076-001`'s Blocked status.

## Deferred Concepts

Unchanged: RFC-0012 Domain Event publication for the Planning domain; AI-generated planning; Adapter invocation or selection; workflow orchestration/participation; new Repository Policy authoring/versioning/selection mechanisms; Autonomous Planning Integration Validation and Milestone 11 closure (Sprint 77). `BT-076-002` (Activation commit-ordering defect) is unaffected and remains separately open.

## Related Sprint(s)

- Sprint 9 — Review Foundation (frozen; this ratification completes the narrow field-representation correction begun by `NEXUS-RAT-2026-07-17-016`).
- Sprint 76 — Approved Plan Activation (Rejected by `NEXUS-REV-2026-07-17-020`; this ratification unblocks `BT-076-001`, one of its two remediation items).

## Related Review(s)

- `NEXUS-REV-2026-07-17-020` (Sprint 76; FAIL; originating Category 3 finding F-001).

## Full Ratification Text

> `src/hosts/vscode/host-mission-workflow.ts:471` SHALL construct its `missionPlanRevision` argument explicitly as `{ kind: 'ExecutableMissionPlan', revisionId: missionPlanRevisionId }`, replacing the bare-string argument, as a narrow, one-time, content-only exception to Sprint 76's `src/hosts` restriction scoped exclusively to this line. Following this migration, the `ReviewPlanRevisionReference | string` union and the silent string-to-`ExecutableMissionPlan` inference path SHALL be removed from `review.aggregate.ts`/`review.contract.ts`/`review.types.ts`; a bare string SHALL be rejected as an invalid `Review` definition. Every test relying on the string-coercion branch SHALL be updated to construct the typed reference explicitly. `IMPLEMENTATION_REPORT.md`'s Sprint 76 section SHALL be corrected accordingly. No other change to `Review`, `host-mission-workflow.ts`, or `BT-076-002`'s scope is authorized.

## Current Status

Active

---

# NEXUS-RAT-2026-07-18-002

## Ratification Identifier

NEXUS-RAT-2026-07-18-002

## Date

2026-07-18

## Subject

Authorizes Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure (Milestone 11 Initial Capability Sequence step 8), incorporating a required end-to-end validation-coverage refinement over `nexus-plan`'s original Sprint 77 Proposal.

## Originating Request

`nexus-plan` presented a Sprint 77 Proposal (Autonomous Planning Integration Validation and Milestone 11 Closure): one dedicated integration test exercising the full Planning domain flow through real Kernel composition, no new domain capability, followed by a Milestone 11 closure declaration. The Sprint Owner approved the Proposal and required the integration test's coverage to be enumerated explicitly and bindingly, rather than left to Builder discretion, given this Sprint is the sole certification gate for Milestone 11 closure.

## Governance Decision

**APPROVED WITH VALIDATION REFINEMENT.**

Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure is authorized. The Sprint SHALL remain validation-only: no Sprint 1–76 production file may be modified. The new integration test SHALL validate, through real (non-mocked) Kernel service composition only:

### 1. Complete happy path (binding)

Draft → Submitted → Under Review → terminal eligible Review → exact Planning Correlation → terminal `Approved` `GovernanceDecision` → Governed → Activated → executable RFC-0001 `MissionPlan`, `Task`, and `TaskDependency` created, with exact proposal-to-executable traceability preserved.

### 2. Typed revision integrity (binding)

`Review` uses `kind: ProposedPlanRevision`; the revision ID matches the exact activated revision; a mismatched `kind` or revision fails closed.

### 3. Activation safety (binding)

Repeated activation of the same revision is idempotent; activation of a sibling revision after a successful activation is rejected; no partial executable state exists after a failed activation attempt; the activated revision remains immutable; `Governed` sibling revisions become `Superseded`.

### 4. Governance protection (binding)

Non-`Approved` `GovernanceDecision`s cannot activate; stale or mismatched Planning Correlation cannot activate; Activation cannot bypass Review or Governance.

### 5. Milestone closure (binding)

Full repository validation passes; zero production drift is confirmed (no Sprint 1–76 production file modified); Milestone 11 SHALL be declared complete only after independent Reviewer PASS of this Sprint.

**Definition of Done:** the new integration test covers every enumerated item above, exercised exclusively through Kernel-composed services (no direct construction of domain internals); no Sprint 1–76 production file is modified; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); Milestone 11 closure in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md` is deferred until Reviewer certification, not declared by the Builder.

### Scope Confirmation

Explicitly out of scope, unchanged: RFC-0012 Domain Event publication, AI-generated planning, Adapter execution, workflow orchestration, and Corpus Review Mode implementation. None of these SHALL be introduced by this Sprint.

## RFC Coverage

- RFC-0012 v1.1 — Autonomous Engineering Planning Model (Referenced; validates the already-implemented Activation section, does not amend it)
- RFC-0001, RFC-0006 v1.1, RFC-0011 (Referenced; consumed read-only through existing public contracts, unmodified)

## Ownership Model (ratified)

This ratification authorizes Sprint 77's validation-only scope. It does not modify RFC-0001, RFC-0006, RFC-0011, RFC-0012, or the Kernel Canon, and does not modify any Sprint 1–76 production contract.

## Authorized Scope

`nexus-plan` is authorized to record this ratification, activate Sprint 77 in `IMPLEMENTATION_PLAN.md`/`IMPLEMENTATION_MANIFEST.md`, and generate `knowledge/implementation/sprints/sprint-0077-autonomous-planning-integration-validation-and-milestone-11-closure.md` as the Sprint 77 Sprint Implementation Record (Builder implementation contract), incorporating the five binding validation-coverage categories above as Acceptance Criteria.

## Deferred Concepts

RFC-0012 Domain Event publication for the Planning domain; AI-generated planning; Adapter invocation or selection; workflow orchestration/participation; Corpus Review Mode implementation; any new domain capability of any kind. Milestone 11 closure itself is conditional on this Sprint's independent Reviewer PASS, not self-declared by the Builder.

## Related Sprint(s)

- Sprint 71–76 — Milestone 11 Initial Capability Sequence steps 1–7 (frozen; validated read-only by this Sprint's integration test).
- Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure (authorized by this ratification).

## Related Review(s)

None yet; Sprint 77 has not yet been Reviewer-certified.

## Full Ratification Text

> Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure is approved, validation-only: no Sprint 1–76 production file may be modified. The new integration test SHALL validate, through real Kernel composition only: (1) the complete happy path from Draft through Activated executable RFC-0001 state with exact traceability; (2) typed revision integrity (`kind: ProposedPlanRevision`, exact revision-ID match, fail-closed on mismatch); (3) Activation safety (idempotent repeat, sibling-revision rejection, no partial state on failure, activated-revision immutability, sibling supersession); (4) Governance protection (non-`Approved` decisions cannot activate, stale/mismatched correlation cannot activate, Review/Governance cannot be bypassed); (5) Milestone closure (full repository validation passes, zero production drift, Milestone 11 declared complete only after independent Reviewer PASS). RFC-0012 Domain Events, AI-generated planning, Adapter execution, workflow orchestration, and Corpus Review Mode implementation remain out of scope.

## Current Status

Active

---

# NEXUS-RAT-2026-07-18-003

## Ratification Identifier

NEXUS-RAT-2026-07-18-003

## Date

2026-07-18

## Subject

Corrective ratification resolving a Planning Correlation lineage defect discovered during Sprint 77 validation: `PlanningCorrelation.proposedPlanRevisionId` remains pinned to the `Under Review` revision reviewed by RFC-0006 `Review`, while `evaluateGovernance`'s `Under Review → Governed` transition mints a new successor `ProposedPlanRevision` with a different ID that the correlation is never updated to reference — making the correlation permanently unresolvable by `PlanningActivationService`, which requires the exact `Governed` revision ID. Authorizes a narrow corrective scope to the Sprint 74–76 Planning Correlation, Governance transition, and Activation resolution paths. Sprint 77 remains paused until this correction is implemented and independently Reviewer-certified.

## Originating Request

While implementing Sprint 77's real Kernel-composition happy-path integration test (`NEXUS-RAT-2026-07-18-002`), the Builder drove the actual `evaluateGovernance → activateExclusive` chain end-to-end for the first time and hit a Builder Stop Condition: `PlanningActivationService.requirePlanningCorrelation` throws `PlanningCorrelation for ProposedPlanRevision '<governed-revision-id>' was not found for Activation`, because no `PlanningCorrelation` is ever persisted under the `Governed` revision's ID — `savePlanningCorrelationGovernanceDecision` (`planning-correlation.service.ts:525-550`) only updates `governanceDecisionId`/Repository Policy fields, never `proposedPlanRevisionId`, and is invoked before `markCurrentRevisionGoverned` mints the new revision. Sprint 74–76's own unit tests did not catch this because each constructs `PlanningCorrelation`/`ProposedMissionPlan` fixtures directly with matching pre-set IDs rather than driving the real transition chain. Sprint 77's Architectural Boundaries forbid modifying any Sprint 1–76 production file, so the Builder correctly stopped and reported rather than fixing frozen code outside its authorization or weakening the test. `nexus-plan` presented two corrective options (overwrite the correlation's revision reference on Governed; resolve Activation by proposal rather than exact revision); the Sprint Owner rejected both and specified the approved resolution below.

## Governance Decision

**APPROVED — CORRELATION LINEAGE EXTENSION.**

Neither prior option is authorized: overwriting `proposedPlanRevisionId` would destroy the immutable identity of the exact revision reviewed; resolving Activation by `proposedMissionPlanId` alone would weaken exact-revision correlation for an irreversible operation. `PlanningCorrelation` SHALL instead preserve both ends of the governed revision lineage as two distinct, individually immutable fields.

### Field Rename and Addition (binding)

- Rename the existing `PlanningCorrelation` field `proposedPlanRevisionId` to `reviewedProposedPlanRevisionId`.
- Add a new field, `governedProposedPlanRevisionId`.

### Required Semantics (binding)

`reviewedProposedPlanRevisionId` SHALL:

- identify the exact immutable `ProposedPlanRevision` submitted to RFC-0006 Review;
- remain unchanged for the lifetime of the Planning Correlation;
- continue to anchor the Review and `GovernanceDecision` lineage.

`governedProposedPlanRevisionId` SHALL:

- identify the exact successor revision created by the `Under Review → Governed` transition;
- be assigned exactly once;
- remain immutable after assignment;
- be used as the authoritative revision identity for Activation.

### Required Invariants (binding)

The implementation SHALL verify: both revisions belong to the same Mission; both revisions belong to the same `ProposedMissionPlan`; the Governed revision is the direct successor of the reviewed revision; the Review targets `reviewedProposedPlanRevisionId`; the Review uses `ReviewPlanRevisionReference.kind = ProposedPlanRevision`; the `GovernanceDecision` remains correlated to the reviewed revision lineage; the Governed revision carries the terminal `GovernanceDecision` recorded by the correlation; Activation resolves only through `governedProposedPlanRevisionId`; the revision supplied for Activation exactly matches the correlation's governed revision. Missing, duplicate, ambiguous, cross-Mission, cross-proposal, or broken lineage SHALL fail closed.

### Planning Correlation Persistence Rules (binding)

The Planning Correlation repository SHALL: preserve `reviewedProposedPlanRevisionId` unchanged; permit `governedProposedPlanRevisionId` to transition from absent to exactly one value; reject reassignment to a different governed revision; treat an identical repeated assignment as idempotent; reject unrelated mutation of immutable correlation fields; preserve Review, `GovernanceDecision`, Repository Policy, Planner Attribution, causation, and correlation data, including `GovernanceDecision` supersession history; remain deterministic and fail closed.

### Governance Transition Ordering (binding)

During `evaluateGovernance`:

1. Load the exact reviewed revision.
2. Validate the Review and Planning Correlation against that revision.
3. Evaluate and persist the terminal `GovernanceDecision`.
4. Create the new Governed successor revision.
5. Validate direct reviewed-to-governed lineage.
6. Persist `governedProposedPlanRevisionId` on the existing Planning Correlation.
7. Commit the `GovernanceDecision`, Governed revision, and correlation update as one atomic operation.
8. Publish no event if any part of the operation fails.

The repository SHALL NOT retain: a terminal `GovernanceDecision` without a resolvable Governed revision; a Governed revision without an updated Planning Correlation; a Planning Correlation pointing to a nonexistent or unrelated Governed revision.

### Activation Resolution (binding)

`PlanningActivationService.requirePlanningCorrelation` SHALL: resolve the Planning Correlation using `governedProposedPlanRevisionId`; verify the reviewed and governed revision lineage; verify the exact terminal `Approved` `GovernanceDecision`; verify Mission and `ProposedMissionPlan` consistency; reject proposal-level-only matching; reject fallback to `reviewedProposedPlanRevisionId`; reject silent inference from revision chronology; reject activation when `governedProposedPlanRevisionId` is absent; reject activation when the supplied revision is not the exact governed revision.

### Existing Correlation Migration (binding)

Existing Planning Correlations created before this correction SHALL be migrated explicitly: the existing `proposedPlanRevisionId` becomes `reviewedProposedPlanRevisionId`; `governedProposedPlanRevisionId` SHALL only be populated from authoritative persisted governance-transition evidence; missing governed lineage SHALL NOT be inferred from revision order alone; unresolved historical lineage SHALL remain unresolvable and fail closed; no correlation history may be rewritten to fabricate missing authority.

**Definition of Done:** every Required Semantics, Invariant, Persistence Rule, Governance Transition Ordering step, Activation Resolution rule, and Migration rule above is implemented and independently testable per the Required Test Coverage below; the real `evaluateGovernance → activateExclusive` chain succeeds through real Kernel composition with no fixture-level shortcut; no correlation history is fabricated or silently inferred; repository-wide validation passes (TypeScript compile, ESLint, Vitest, esbuild, extension-host bundle build); independent Reviewer PASS is recorded before Sprint 77 resumes.

## RFC Coverage

- RFC-0012 v1.1 — Autonomous Engineering Planning Model (Referenced; corrects the Planning Correlation/Governance/Activation implementation to actually satisfy the already-ratified guarantees; amends no RFC text)
- RFC-0006 v1.1, RFC-0011, RFC-0001 (Referenced; consumed read-only, unmodified)

## Ownership Model (ratified)

This ratification authorizes a narrow corrective scope confined to the Planning Correlation, Governance transition persistence, and Activation resolution paths (Sprint 74–76). It does not modify RFC-0001, RFC-0006, RFC-0011, RFC-0012, or the Kernel Canon, and does not reinterpret the "each lifecycle transition mints a new `ProposedPlanRevision`" design (carried-forward Observation `NEXUS-REV-2026-07-17-011`), which remains intentional and unchanged.

## Authorized Scope

Authorize the minimum required production and test changes to: `PlanningCorrelation`; Planning Correlation value types and contracts; the Planning Correlation repository; `PlanningCorrelationService`; Governance transition persistence; `PlanningActivationService`; affected Sprint 74–76 tests; affected implementation and governance documentation. Production changes outside the Planning Correlation, Governance integration, and Activation paths remain prohibited.

`nexus-sprint` is authorized to translate this ratification into a corrective Builder Task. The corrective work SHALL be independently Reviewer-certified before Sprint 77 resumes.

## Required Test Coverage

Add focused tests proving: reviewed revision identity remains unchanged after Governance; governed revision identity is recorded exactly once; identical repeated governed-revision assignment is idempotent; conflicting governed-revision reassignment is rejected; direct reviewed-to-governed successor lineage succeeds; unrelated successor lineage is rejected; cross-Mission lineage is rejected; cross-proposal lineage is rejected; missing governed revision identity blocks Activation; Activation using the reviewed revision is rejected; Activation using the exact governed revision succeeds; stale or mismatched `GovernanceDecision` lineage is rejected; partial Governance transition persistence leaves no orphaned terminal state; the real `evaluateGovernance → activateExclusive` chain succeeds through Kernel composition.

## Deferred Concepts

Unchanged: RFC-0012 Domain Event publication for the Planning domain; AI-generated planning; Adapter invocation or selection; workflow orchestration/participation; Corpus Review Mode implementation; any new domain capability. This ratification does not reopen or expand Sprint 77's original validation-only scope.

## Related Sprint(s)

- Sprint 74 — Planning Correlation and Review Entry Foundation (frozen; `reviewedProposedPlanRevisionId` field rename applies here).
- Sprint 75 — Proposal Governance Integration (frozen; `evaluateGovernance`'s transition ordering and `governedProposedPlanRevisionId` persistence correction apply here).
- Sprint 76 — Approved Plan Activation (frozen; `PlanningActivationService.requirePlanningCorrelation`'s resolution-by-`governedProposedPlanRevisionId` correction applies here).
- Sprint 77 — Autonomous Planning Integration Validation and Milestone 11 Closure (paused pending this correction's independent Reviewer PASS; resumes with its original validation-only scope unexpanded).

## Related Review(s)

None yet; this corrective scope has not yet been Reviewer-certified.

## Full Ratification Text

> `PlanningCorrelation` SHALL preserve both ends of the governed revision lineage as two distinct, individually immutable fields: `reviewedProposedPlanRevisionId` (renamed from `proposedPlanRevisionId`, pinned permanently to the exact revision submitted to Review) and `governedProposedPlanRevisionId` (assigned exactly once, immutable thereafter, identifying the exact successor revision created by the `Under Review → Governed` transition). `evaluateGovernance` SHALL persist `governedProposedPlanRevisionId` on the existing correlation as part of the same atomic commit as the terminal `GovernanceDecision` and the Governed revision, after validating direct reviewed-to-governed lineage; no partial state (a terminal decision without a resolvable Governed revision, a Governed revision without an updated correlation, or a correlation pointing to a nonexistent or unrelated revision) may be observable on any failure. `PlanningActivationService` SHALL resolve the Planning Correlation exclusively through `governedProposedPlanRevisionId`, rejecting proposal-level-only matching, fallback to the reviewed revision, silent chronological inference, and any mismatch against the revision supplied for Activation. Existing correlations SHALL be migrated by renaming their field only; missing governed lineage SHALL never be inferred or fabricated. This corrective scope is confined to the Planning Correlation, Governance transition persistence, and Activation resolution paths (Sprint 74–76); it does not reinterpret the per-transition revision-minting design, and it does not expand Sprint 77's validation-only scope, which remains paused until this correction is implemented and independently Reviewer-certified.

## Current Status

Active

---
