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

| Operation | Event | Status |
| --- | --- | --- |
| `captureKnowledge` | `KnowledgeCandidateCreated` (reused from `kernel-event-catalog.md`) | Authorized for Sprint 13 |
| `reviseKnowledge` | `KnowledgeRevisionCreated` (new) | Authorized for Sprint 13 |
| *(future)* `approveKnowledge` | `KnowledgeAccepted` (reused) | Deferred |
| *(future)* `activateKnowledge` | `KnowledgePublished` (reused) | Deferred |
| *(future)* `supersedeKnowledge` | `KnowledgeSuperseded` (reused from `knowledge-service.md`) | Deferred |
| *(future)* `archiveKnowledge` | `KnowledgeArchived` (new) | Deferred |

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

| Event | Corrected Producer | Rationale |
| --- | --- | --- |
| `MissionPlanCreated` | `MissionPlanningService` | Matches existing `createMissionPlan` operation. No duplicate. |
| `MissionPlanRevised` | `MissionPlanningService` | Matches existing `reviseMissionPlan` operation and `kernel-state-machine.md`'s transition table. Canonical name; the legacy `# Mission Events` duplicate (Producer: Mission Service) and the redundant `MissionPlanSuperseded` entry are removed as the same fact under competing names. |
| `TaskCreated` | `MissionPlanningService` | Matches existing `addTask` operation. Canonical name; the legacy `# Mission Events` `TaskAdded` duplicate (Producer: Mission Service) is removed as the same fact under a competing name. |
| `TaskStarted` | `MissionExecutionService` | Matches existing `startTask` operation (reattributed from "Adapter"). |
| `TaskCompleted` | `MissionExecutionService` | Matches existing `completeTask` operation (reattributed from "Adapter"). |
| `TaskCancelled` | `MissionExecutionService` | Matches existing `cancelTask` operation (reattributed from "Mission Service", which is not the operation's actual owner). |

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
