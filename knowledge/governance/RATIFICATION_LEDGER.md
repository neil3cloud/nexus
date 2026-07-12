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

| RFC-0006 Normative Term | Canonical Implementation Name |
| --- | --- |
| Engineering Assessment / Assessment Session | `Review` |
| Assessment Criteria | `ReviewCriteria` |
| Assessment Finding | `Finding` |
| Finding Severity | `Severity` |
| Finding Intent | `FindingCategory` |
| Observation | `Observation` |
| Actionable Finding | `ActionableFinding` |
| Assessment Outcome | `ReviewOutcome` (Accepted / Accepted With Observations / Action Required / Rejected) |
| *(implementation-layer only; not RFC-0006-owned)* | `ReviewStatus` (`Pending → In Progress → Completed`) |
| *(implementation-layer only; not RFC-0006-owned)* | `FindingStatus` (`Created → Accepted / Resolved / Dismissed`) |

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

| RFC-0007 Normative Term | Canonical Implementation Name |
| --- | --- |
| Engineering Memory | `Knowledge` (aggregate) |
| *(implementation-layer identity)* | `KnowledgeId` |
| Memory Lifecycle (`Candidate → Approved → Active → Superseded → Archived`) | `KnowledgeStatus` (`Candidate → Approved → Active → Superseded → Archived`) |
| Memory Scope | `KnowledgeScope` |
| Memory Provenance | `KnowledgeProvenance` |
| Memory Attribution | `KnowledgeAttribution` |

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
