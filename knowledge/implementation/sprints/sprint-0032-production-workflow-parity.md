# Sprint 32 — Production Workflow Parity

**Status:** Approved with Findings (NEXUS-REV-2026-07-14-005).

---

## Objective

Complete the production workflow matrix by integrating `CodexCliAdapter` (certified in isolation by Sprint 31, `NEXUS-REV-2026-07-14-004`) into the Developer Workflow, using the identical architectural pattern `NEXUS-RAT-2026-07-14-004` established for `GeminiCliAdapter` in Sprint 30. This introduces exactly one architectural variable — a third Developer Workflow command targeting `CodexCliAdapter` via an explicit `adapterId` — reusing the existing certified execution pipeline verbatim.

---

## RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial).
- Referenced: RFC-0004 — Execution Model, RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries.

Sprint 32 introduces no new normative concept in any RFC.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-006` — governs this Sprint's entire scope: title, authorized command addition, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-006` selects Developer Workflow integration.
- `NEXUS-RAT-2026-07-14-004` — the Sprint 30 scope ratification this Sprint mirrors provider-for-provider.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; the new command dispatches via explicit `adapterId` only.

---

## Authorized Execution Path (binding)

```text
Developer Workflow → MissionExecutionService.startTask() → RoleService.assignRole() →
ExecutionStrategyService.evaluateAssignmentReadiness() → AdapterService.dispatch() →
CodexCliAdapter → AdapterResponse → MissionExecutionService.completeTask() →
MissionExecutionService.completeMission() → EvidenceService.registerEvidence() →
ReviewService.startReview() → ReviewService.publishFinding() →
ReviewService.finalizeReviewOutcome() → KnowledgeService.captureKnowledge() →
Host presents completion result
```

This is the identical certified sequence Sprints 26/27 already proved legal for `MockAdapter` and Sprint 30 reused verbatim for `GeminiCliAdapter`, with the Adapter dispatch step's explicit `adapterId` set to the Codex CLI Adapter identifier.

---

## Authorized Vertical Slice

- A new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithCodexCli`) sequencing the identical, already-certified workflow steps (Sprint 25/26/27's Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence), with the Adapter dispatch step's explicit `adapterId` set to the `CodexCliAdapter` identifier instead of `MOCK_ADAPTER_ID`/`GEMINI_CLI_ADAPTER_ID`.
- Registration of `CodexCliAdapter` at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` and `GeminiCliAdapter` registrations.
- New command contribution point (`package.json` `contributes.commands` / `activationEvents`) mirroring the existing commands' registration pattern.
- Unit/integration test coverage for the new command's success and failure paths, using the existing deterministic Codex CLI test-double (Sprint 31) exclusively — never a live `codex` CLI.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` reconciliation only if the new command's existence requires it; no redefinition of its existing runtime-guidance-only scope.

---

## Deferred Concepts

- Persisted adapter preferences, Workspace/User adapter settings, or any configuration subsystem for Adapter selection (remains deferred from Sprint 24/30, unaffected).
- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression) — remains a valid future candidate, not pursued this Sprint.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any fourth production Adapter.
- Streaming responses, multi-provider coordination, background execution.

---

## Acceptance Criteria (Definition of Done)

- The existing `nexus.runDeveloperMissionWorkflow` (MockAdapter) and `nexus.runDeveloperMissionWorkflowWithGeminiCli` (GeminiCliAdapter) commands, and every Sprint 25–31 test asserting their behavior, pass unmodified.
- The new command executes the identical certified workflow sequence through `CodexCliAdapter` via explicit `adapterId`, with no Adapter Selection, routing, or persisted configuration introduced.
- The new command's automated test coverage remains fully deterministic and CI-safe, using only the Sprint 31 test-double executable.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-006`'s Authorized Builder Scope.
- Reuse `HostMissionWorkflow`'s existing construction pattern (Sprint 25/26/27/30) without modifying its Sprint-frozen behavior for the two existing commands.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 31 section's format.
- Record Sprint 32's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 32 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification (Builder marks "Implemented — Pending Reviewer Validation"; Reviewer subsequently updates to Approved).
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` — reconcile only if strictly required by the new command's existence.

---

## Known Limitations

- This Sprint does not introduce Adapter Selection; a developer must invoke the correct command for the desired provider. This is an accepted, explicitly deferred limitation per `NEXUS-RAT-2026-07-14-006`.
- Session-only, non-durable history (Sprint 25's constraint) continues to apply; no persistence is introduced.

---

## Reserved Sections

### Builder Results

Implemented the Sprint 32 Production Workflow Parity vertical slice.

Implemented scope:

- Added `nexus.runDeveloperMissionWorkflowWithCodexCli` as a third Host command.
- Preserved the existing `nexus.runDeveloperMissionWorkflow` and `nexus.runDeveloperMissionWorkflowWithGeminiCli` commands and dispatch paths.
- Registered `CodexCliAdapter` at the VS Code extension composition root alongside `MockAdapter` and `GeminiCliAdapter`.
- Added the Codex CLI command activation event and command contribution in `package.json`.
- Reused the existing certified `HostMissionWorkflow` execution sequence with explicit `adapterId: CODEX_CLI_ADAPTER_ID`.
- Added deterministic command-registration and end-to-end workflow tests for Codex CLI success and failure paths using the Sprint 31 test-double.

Deferred concepts remain unchanged:

- No Adapter Selection Policy, routing, fallback, persisted preferences, workspace/user setting, or provider coordination was introduced.
- No authentication management, credential storage, OAuth, `SecretStorage`, streaming response, or background execution support was introduced.
- No `src/kernel` files were modified.

Validation summary:

- Targeted Sprint 32 workflow validation passed: 4 files, 6 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 56 files, 275 tests.
- Extension-host test bundle build passed with `npm run test:extension-host:build`.
- Sprint 18 Kernel boundary certification passed unmodified.
- No architectural deviations.

### Reviewer Notes

Independently reproduced the Builder's validation claims: `git diff --name-only` confirmed the change set is limited to `src/extension.ts`, `src/hosts/vscode/vscode-host.ts`, `src/hosts/vscode/host-mission-workflow-command-registration.ts`, `package.json`, `test/extension-host/suite/extension-host.test.ts`, and two new test files — with `src/hosts/vscode/host-mission-workflow.ts`, `src/adapters/codex/**`, `src/adapters/gemini/**`, `src/adapters/mock/**`, and all of `src/kernel/**` confirmed absent from the diff. `knowledge/governance/RATIFICATION_LEDGER.md`'s diff was independently confirmed to be exactly the `NEXUS-RAT-2026-07-14-006` entry from the prior `/nexus-plan` cycle, not a Builder addition. `npm run validate` independently reproduced `tsc --noEmit`, ESLint, Vitest (56 files / 275 tests), and `esbuild` all passing, matching the Builder's reported numbers exactly.

One finding recorded: `NEXUS-REV-2026-07-14-005-F-001` (Category 4 — Documentation Drift, Minor) — the Extension Host activation smoke test's command-discoverability list omits `nexus.runDeveloperMissionWorkflowWithGeminiCli`, a pre-existing gap traced to Sprint 30 that this Sprint's touch of the same file did not close. Non-blocking; does not indicate a functional defect. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-005` for full detail.

No architectural violations detected. Sprint 32 conforms to `NEXUS-RAT-2026-07-14-006`'s authorized scope exactly: the existing `MockAdapter`/`GeminiCliAdapter` commands and their test coverage are unmodified, no Adapter Selection Policy or persisted configuration was introduced, and no `src/kernel` file was touched.

### Final Disposition

**Approved with Findings** — `NEXUS-REV-2026-07-14-005`. One Minor Category 4 (Documentation Drift) finding recorded (`NEXUS-REV-2026-07-14-005-F-001`); does not block approval or progression. Recommend a Documentation Task via `nexus-sprint` to add the missing command entry to the Extension Host test's discoverability list.

**Remediation Verified — `NEXUS-REV-2026-07-14-006`.** `builder-task.md` `DOC-001` (remediating `NEXUS-REV-2026-07-14-005-F-001`) was independently verified: `test/extension-host/suite/extension-host.test.ts`'s `COMMANDS` array now lists all 8 commands registered in `package.json`, in matching order, with no other file touched. `npm run validate` and `npm run test:extension-host:build` both independently reproduced passing. `DOC-001` is Completed; zero Open or Blocked tasks remain. The Sprint's disposition remains **Approved with Findings**; this remediation does not reopen or change it.
