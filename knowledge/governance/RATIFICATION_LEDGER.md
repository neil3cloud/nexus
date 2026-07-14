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
