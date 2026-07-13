# Sprint 27 — Developer Workflow Completion

## Sprint Status

Approved (NEXUS-REV-2026-07-13-028)

## Sprint Objective

Complete the provider-independent Developer Workflow by extending it, after Mission completion, through an Evidence → Review → Knowledge sequence using only previously approved, existing public Kernel service contracts (`EvidenceService`, `ReviewService`, `KnowledgeService`). This closes the "Builder/Reviewer workflow integration" outcome Milestone 4 has listed as future scope since its opening, completing at the Host layer the same Evidence → Review → Knowledge sequence Sprint 16 already certified legal at the Kernel-composition level.

Review and Knowledge integration are implementation details of completing the developer workflow — not new architectural capability. Sprint 27 introduces no new Kernel capability, aggregate, business rule, or execution semantics.

## Milestone

Milestone 4 — External Integration (ninth slice). Upon successful review, Milestone 4 remains complete and extended with the completed developer workflow, and the repository becomes ready to begin Milestone 5 — Production Adapter Integration (the `MockAdapter → Live Provider Adapter` substitution reserved by `NEXUS-RAT-2026-07-13-013`).

## RFC Coverage

Primary:

- RFC-0009 — Host Contract (Partial, extending Sprint 25/26's Host orchestration pattern).

Referenced:

- RFC-0002 — Evidence Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.
- RFC-0010 — Kernel Boundaries.

This sprint implements Host-layer integration only. No Evidence, Review, or Knowledge business rule, state, or event is modified.

## Ratification References

- `NEXUS-RAT-2026-07-13-014` — governs this sprint's entire scope: title, authorized completion workflow, Host/Kernel responsibility split, the binding Knowledge-eligibility implementation clarification, authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-13-013` — governs the Sprint 26 pipeline this sprint extends; unaffected and unmodified by this sprint.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint is provider-independent.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-13-014)

**Host SHALL:** orchestrate the Developer Workflow's completion phase; invoke existing public Kernel service contracts (`EvidenceService`, `ReviewService`, `KnowledgeService`); present Review Findings, Review outcome, and Knowledge capture results.

**Host SHALL NOT:** implement business rules, interpret Review Findings, determine Knowledge eligibility, or own execution/lifecycle decisions. The Host calls `EvidenceService.registerEvidence`/`ReviewService.startReview`/`ReviewService.publishFinding`/`ReviewService.finalizeReviewOutcome`/`KnowledgeService.captureKnowledge` — it does not itself decide Evidence validity, Review outcome semantics, or Knowledge eligibility; the Kernel owns those decisions entirely.

**Kernel remains authoritative for (unchanged):** Evidence registration, Review lifecycle, Review outcome determination, Knowledge eligibility, Knowledge capture, all business rules.

## Authorized Completion Workflow (binding — the only workflow extension this sprint may exercise)

```text
Developer Workflow
        ↓
MissionExecutionService.completeMission()   (Sprint 25/26, unchanged)
        ↓
EvidenceService.registerEvidence()
        ↓
ReviewService.startReview()
        ↓
ReviewService.publishFinding()
        ↓
ReviewService.finalizeReviewOutcome()
        ↓
KnowledgeService.captureKnowledge()
        ↓
Host presents completion result
```

This sequence extends the exact call chain Sprint 16's `test/integration/kernel-mission-workflow.integration.test.ts` already proves legal (`... → Perform Review → Capture Knowledge`). Duplicate or alternate orchestration SHALL NOT be introduced.

## Execution Semantics (binding)

1. The sequence begins immediately after the existing Sprint 25/26 `completeMission()` call succeeds. Sprint 25/26's authorized execution path (Mission/Task/Adapter pipeline) is unmodified and unextended by anything upstream of this point.
2. `EvidenceService.registerEvidence({ id, type, version, hash, metadata, provenance, missionId })` — Host supplies deterministic identity (mirroring the existing `createIdentity()` pattern) and deterministic, fixed workflow metadata/provenance content. This is data supply, not business content generation; no Evidence validity judgment is made by the Host.
3. `ReviewService.startReview({ id, missionId, missionPlanRevision, reviewCriteria, evidenceReferences })` — references the Evidence registered in step 2 and the completed MissionPlan revision.
4. `ReviewService.publishFinding({ reviewId, severity, summary, description, supportingEvidenceReferences, affectedArtifactReferences, criteriaReferences })` — at least one Finding, with deterministic, fixed content. The Host does not interpret or generate Finding content beyond deterministic pass-through workflow data.
5. `ReviewService.finalizeReviewOutcome({ reviewId, outcome })` — **binding clarification:** the Sprint 9-approved `FinalizeReviewOutcomeCommand` requires the caller to supply an explicit `outcome` value; the Review domain does not derive one from Findings, and this Approved Vertical Slice is not reopened by this sprint. The Host MAY supply a deterministic, fixed `outcome` value as an explicit command input — exactly as Sprint 26 supplies a deterministic default `roleId` and explicit `adapterId`. This is data supply, not Review-outcome interpretation; the Kernel's `Review` aggregate remains the sole owner of what the supplied outcome value legally means (event selection, status transition, terminal-state enforcement).
6. `KnowledgeService.captureKnowledge({ id, missionId, missionPlanRevisionId, summary, scope, supportingEvidenceIds, supportingReviewId, contributingEventIds, approvingAuthority })` — **binding clarification:** called unconditionally as the next workflow step. The Host SHALL NOT contain conditional logic equivalent to `if (reviewAccepted) { captureKnowledge(); }`. Knowledge eligibility is enforced entirely inside `Knowledge.capture()` (throwing `KnowledgeCapturePreconditionError` when the supporting Review has not reached a terminal accepted state, per the frozen Sprint 12 rule). A rejection here SHALL be handled through the exact same Kernel-rejection stop-deterministically pattern Sprint 25/26 already established: stop, present Kernel diagnostics, record the true last-known workflow state, and do not fabricate a Knowledge capture outcome.
7. On success, the Host presents the Review outcome and the captured `KnowledgeSnapshot` through the existing `HostPresentationSurface`, exactly as Sprint 26 presents the Adapter response.

Workflow completion or Knowledge capture SHALL NOT be fabricated at any step.

## Authorized Vertical Slice

- Extend `HostMissionWorkflow` (Sprint 25/26, `src/hosts/vscode/host-mission-workflow.ts`) to invoke the Authorized Completion Workflow above immediately after the existing `completeMission()` call.
- Wire `EvidenceService`, `ReviewService`, and `KnowledgeService` into the VS Code Host composition root (`vscode-host.ts`), mirroring the existing `resolveService` pattern used for `RoleService`/`ExecutionStrategyService`/`AdapterService`.
- Extend the session-only history entry shape (still in-memory, non-durable, minimal fields) to additionally record the Review outcome and Knowledge capture status, alongside the existing fields.
- Present Review Findings, Review outcome, and Knowledge capture results through the existing `HostPresentationSurface`, consistent with the presentation style already used for Adapter dispatch results.

## Explicitly Out of Scope / Deferred Concepts

**Provider Integration:** Live AI Providers, production Adapter integration, Adapter Selection, provider routing (all unaffected by this sprint).

**Review:** Human review intervention, review retry workflows, multi-Assessment-Session Reviews, Human Authority override operations.

**Workflow:** Streaming execution, background workflow execution, workflow automation, multi-provider coordination, cancellation, progress callbacks beyond Sprint 24's existing `withProgress` markers.

**Runtime:** Persistent or durable workflow/execution/review/knowledge history, Policy Engine integration, Evidence indexing, Knowledge conflict resolution, Shared Reality visualization, Mission browser, execution dashboards.

**Unchanged baselines:** `EvidenceService`, `ReviewService`, `KnowledgeService`, every Evidence/Review/Knowledge aggregate and value object, and every Sprint 5/8/9/10/12/13/14/19/20/23/24/25/26 approved capability beyond the authorized Developer Workflow extension itself. Existing Sprint 16 integration tests and Sprint 25/26 tests SHALL continue to pass unmodified.

**`COPILOT_INSTRUCTIONS.md`:** SHALL NOT be activated or consumed.

## Acceptance Criteria

Sprint 27 SHALL demonstrate:

- The Developer Workflow exercises the exact Authorized Completion Workflow above, in order, immediately after `completeMission()`, with no duplicate or alternate orchestration.
- Host remains orchestration-only: it makes no Evidence-validity, Review-outcome-interpretation, or Knowledge-eligibility decision itself — verified by code inspection confirming all such decisions flow through `EvidenceService`/`ReviewService`/`KnowledgeService`, and that `KnowledgeService.captureKnowledge()` is called unconditionally (no `if (reviewAccepted)`-shaped branch in Host code).
- On successful Knowledge capture, the workflow completes and results are presented, verified by a test asserting the full call sequence and final state (including the captured `KnowledgeSnapshot`).
- On a Kernel-thrown rejection at any step (Evidence, Review, or Knowledge), the workflow stops deterministically without fabricating success, presents Kernel diagnostics, and records the true last-known state — verified by a dedicated test, mirroring Sprint 25/26's Kernel-rejection test pattern.
- Existing Sprint 16 integration tests pass unmodified.
- Existing Sprint 25/26 unit/integration tests for the parts of the workflow this sprint does not change continue to pass, extended only where the new steps require additional assertions.
- No `src/kernel` or `src/adapters` file changes (`git diff --stat HEAD -- src/kernel/ src/adapters/` empty).
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 27, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 27, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-13-014` (authoritative for this sprint's scope), `knowledge/specifications/rfc-0002-evidence-model.md`, `knowledge/specifications/rfc-0006-engineering-assessment-model.md`, `knowledge/specifications/rfc-0007-knowledge-model.md`, `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 5, 9, 12–14, 16, 25, and 26 records, `test/integration/kernel-mission-workflow.integration.test.ts` as the authoritative reference sequence, `src/hosts/vscode/host-mission-workflow.ts` as the file to extend, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, following the Authorized Completion Workflow and Execution Semantics exactly.
- Do not modify `test/integration/kernel-mission-workflow.integration.test.ts`, `test/integration/execution-pipeline-integration.integration.test.ts`, or any other prior sprint's frozen file; reuse existing service contracts, do not redefine them.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 27 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- Only a single, deterministic Evidence/Finding/Review-outcome path is exercised; no branching Review scenarios or multi-Finding review sessions.
- The Review outcome value is a deterministic, fixed Host-supplied input, not a human or AI-generated engineering judgment (Human Authority and AI-driven Review execution remain deferred).
- Session history remains in-memory and non-durable, per Sprint 25's unchanged Critical Boundary.
- No retry, cancellation, or partial-completion recovery beyond the existing Kernel-rejection stop pattern.

## Expected Outcome

Upon successful completion, Nexus provides the complete provider-independent developer workflow ratified by `NEXUS-RAT-2026-07-13-014`:

```text
Developer
        ↓
Developer Workflow
        ↓
Host
        ↓
Kernel
        ↓
Evidence
        ↓
Review
        ↓
Knowledge
        ↓
Developer Presentation
```

without introducing any dependency on production AI providers. This completes the provider-independent developer experience and establishes the final baseline before Milestone 5 — Production Adapter Integration.

## Builder Results

Implemented the Sprint 27 Developer Workflow Completion slice in the Host layer only.

- Extended `HostMissionWorkflow` to invoke `EvidenceService.registerEvidence()`, `ReviewService.startReview()`, `ReviewService.publishFinding()`, `ReviewService.finalizeReviewOutcome()`, and `KnowledgeService.captureKnowledge()` immediately after the existing `MissionExecutionService.completeMission()` call.
- Preserved Host orchestration-only ownership: Evidence validity, Review lifecycle/outcome legality, and Knowledge eligibility remain enforced by existing Kernel service contracts and aggregates.
- Wired `EvidenceService`, `ReviewService`, and `KnowledgeService` into `vscode-host.ts` through the existing `resolveService` composition pattern.
- Extended session-only Mission workflow history with Review outcome and Knowledge capture status.
- Presented Review Finding, Review outcome, Knowledge capture status, and captured Knowledge identity through the existing `HostPresentationSurface`.
- Left `src/kernel` and `src/adapters` unchanged.

## Test Summary

- TypeScript compile: passed.
- Focused Sprint 27 Vitest coverage: `test/hosts/vscode/host-mission-workflow.test.ts`, `test/hosts/vscode/host-mission-workflow-command-registration.test.ts`, and `test/integration/host-mission-workflow.integration.test.ts` passed.
- ESLint, full Vitest suite, and esbuild passed after rerunning a transient local-process runtime timeout.
- `git diff --stat HEAD -- src\kernel src\adapters` is empty.

## Reviewer Notes

Independent re-validation confirms the Builder's reported results exactly: `tsc --noEmit`, ESLint, `npm run build` (esbuild), and Vitest (48 files / 255 tests) all pass. `git diff --stat -- src/kernel src/adapters` is confirmed empty. `host-mission-workflow.ts` was read line-by-line: `completeDeveloperWorkflow` runs immediately after `completeMission()` and executes exactly `EvidenceService.registerEvidence` → `ReviewService.startReview` → `ReviewService.publishFinding` → `ReviewService.finalizeReviewOutcome` → `KnowledgeService.captureKnowledge`, matching the Authorized Completion Workflow in `NEXUS-RAT-2026-07-13-014` verbatim. The ratification's binding "no `if (reviewAccepted) { captureKnowledge() }`" constraint is verifiably honored: `captureKnowledge()` is called unconditionally immediately after `finalizeReviewOutcome()` with no intervening branch on the outcome value, and the dedicated `'calls Knowledge capture unconditionally and stops on Kernel Knowledge rejection'` test proves this by forcing a Kernel-thrown rejection *after* a successful `Accepted` outcome and confirming the call still happened and the workflow still stopped deterministically. The Review-outcome supply mechanism (`completion.reviewOutcome ?? 'Accepted'`) is a deterministic, fixed command input mirroring Sprint 26's `roleId` pattern, not Host-side outcome interpretation. The real-Kernel integration test independently confirms genuine Kernel-owned validation via the actual `EvidenceCaptured, ReviewStarted, FindingCreated, ReviewCompleted, ReviewAccepted, KnowledgeCandidateCreated` event sequence — the Sprint 12 Knowledge capture preconditions are genuinely satisfied, not fabricated. Sprint 16's and Sprint 20's frozen integration tests are untouched and pass unmodified. `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this record are mutually consistent and accurately scoped.

## Findings

None.

## Required Actions

None. No Category 1 Implementation Defects, Category 2 Architectural Violations, Category 3 Specification Conflicts, or Category 5 Governance Decisions were identified.

## Final Disposition

PASS. No architectural violations detected. Sprint 27 is Approved (`NEXUS-REV-2026-07-13-028`). This completes the provider-independent Developer Workflow; the repository is ready to begin Milestone 5 — Production Adapter Integration.
