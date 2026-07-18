# Sprint 33 — Adapter Configuration Foundation

**Status:** Approved with Findings (`NEXUS-REV-2026-07-14-008`).

---

## Objective

Introduce a provider-neutral Adapter Configuration capability that allows the Host to resolve an explicit `adapterId` from VS Code User or Workspace configuration, while preserving the deterministic execution model established through Milestone 5 and Sprint 31/32. This is Milestone 6's next slice: the Developer Workflow now has parity commands for `MockAdapter`, `GeminiCliAdapter`, and `CodexCliAdapter` (Sprint 32); this Sprint lets a developer configure a default adapter instead of remembering which command targets which provider, without introducing Adapter Selection Policy, routing, or capability scoring.

---

## RFC Coverage

- RFC-0009 — Host Contract (Primary, Partial).
- Referenced: RFC-0008 — Kernel Adapter Contract, RFC-0010 — Kernel Boundaries.

Sprint 33 introduces no new normative concept in any RFC. Configuration resolution is a Host-local concern; the Kernel's explicit-`adapterId` dispatch contract (RFC-0008) is unchanged.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-007` — governs this Sprint's entire scope: title, authorized configuration surface, Host/Kernel responsibility split, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-005` — named the three candidate directions for Milestone 6 following Sprint 31; `NEXUS-RAT-2026-07-14-007` selects the persisted Adapter-selection configuration surface.
- `NEXUS-RAT-2026-07-13-011` — the binding constraint that dispatch remains explicit-`adapterId`-only; `NEXUS-RAT-2026-07-14-007` clarifies that a configuration-resolved default is not Adapter Selection Policy.

---

## Authorized Execution Path (binding)

```text
VS Code configuration (User/Workspace) → Host resolves default adapterId →
Developer Workflow → MissionExecutionService.startTask() → RoleService.assignRole() →
ExecutionStrategyService.evaluateAssignmentReadiness() → AdapterService.dispatch() →
[configured Adapter] → AdapterResponse → MissionExecutionService.completeTask() →
MissionExecutionService.completeMission() → EvidenceService.registerEvidence() →
ReviewService.startReview() → ReviewService.publishFinding() →
ReviewService.finalizeReviewOutcome() → KnowledgeService.captureKnowledge() →
Host presents completion result
```

The execution pipeline from `AdapterService.dispatch()` onward is the identical certified sequence from Sprints 25–27/30/32. The only new step is the Host resolving a configuration value into an explicit `adapterId` before invoking that unchanged pipeline.

---

## Authorized Vertical Slice

- VS Code User/Workspace configuration (`package.json` `contributes.configuration`) declaring a default Developer Workflow adapter identifier setting.
- Host-local resolution of this configuration value into an explicit `adapterId`, consumed only by the Host before invoking the existing, unmodified execution pipeline.
- Preservation of the existing execution pipeline (`HostMissionWorkflow`, `AdapterService.dispatch`, and the full Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge sequence) unchanged.
- Continued availability and backward compatibility of the three existing explicit Developer Workflow commands (`nexus.runDeveloperMissionWorkflow`, `nexus.runDeveloperMissionWorkflowWithGeminiCli`, `nexus.runDeveloperMissionWorkflowWithCodexCli`), which SHALL continue to dispatch via their own hardcoded `adapterId` exactly as certified in Sprints 25, 30, and 32.
- Unit/integration test coverage for configuration resolution (default present, default absent, default naming an unregistered/unknown adapter identifier), using only deterministic test-doubles.

---

## Deferred Concepts

- Adapter Selection Policy, automatic provider routing, capability scoring, fallback, or multi-adapter coordination.
- Role-based adapter assignment.
- Multi-provider coordination.
- Execution Model deepening (full RFC-0004 Execution State set, Execution Session, Review-gated execution progression) — remains a valid future candidate, not pursued this Sprint.
- Authentication management, credential storage, OAuth, `SecretStorage` integration.
- A fourth production Adapter (GitHub Copilot CLI, Claude CLI) — remains a valid future candidate, not pursued this Sprint.
- Streaming responses, background execution.

---

## Acceptance Criteria (Definition of Done)

- The three existing Developer Workflow commands and every Sprint 25–32 test asserting their behavior pass unmodified.
- A new configuration setting exists (`package.json` `contributes.configuration`) declaring a default Developer Workflow adapter identifier, resolved entirely within the Host.
- The Kernel continues to receive only an explicit `adapterId` at the call site; no Adapter Selection, routing, or capability scoring is introduced.
- Configuration resolution is covered by deterministic tests for: default present and valid, default absent, and default naming an unregistered adapter identifier.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-007`'s Authorized Builder Scope.
- Reuse `HostMissionWorkflow`'s existing construction pattern (Sprint 25/26/27/30/32) without modifying its Sprint-frozen behavior for the three existing commands.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 32 section's format.
- Record Sprint 33's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 33 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification (Builder marks "Implemented — Pending Reviewer Validation"; Reviewer subsequently updates to Approved).
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` — reconcile only if strictly required by the new configuration surface's existence.

---

## Known Limitations

- This Sprint does not introduce Adapter Selection Policy, routing, or capability scoring; a configured default merely supplies one explicit `adapterId`. This is an accepted, explicitly deferred limitation per `NEXUS-RAT-2026-07-14-007`.
- Session-only, non-durable history (Sprint 25's constraint) continues to apply; no persistence beyond the configuration setting itself is introduced.

---

## Reserved Sections

### Builder Results

Implemented the authorized Host-local Adapter Configuration foundation and remediated the deviations recorded by `NEXUS-REV-2026-07-14-007` under `NEXUS-RAT-2026-07-14-008`.

- Added `nexus.developerWorkflow.defaultAdapterId` to `package.json` `contributes.configuration`.
- Added Host-local resolution of the configured default Developer Workflow adapter identifier.
- Added `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` as a separate additive Developer Workflow command that resolves one explicit `adapterId` before invoking the unchanged execution pipeline.
- Preserved the three existing Developer Workflow commands and their explicit adapter dispatch paths.
- Added deterministic Host coverage for default present, default absent, and unknown/unregistered adapter identifier handling.
- Restored `nexus.runDeveloperMissionWorkflow` to hardcoded `mock-adapter` dispatch after `NEXUS-REV-2026-07-14-007-F-001`.
- Restored `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `NEXUS-RAT-2026-07-14-005`, and the Sprint 31 Implementation Record to "Multi-Provider Adapter Integration" wording after `NEXUS-REV-2026-07-14-007-F-002`.
- Modified no `src/kernel` files.

Deviation disclosure: `NEXUS-REV-2026-07-14-007` rejected the initial Sprint 33 implementation for two architectural deviations. This Builder pass implements only the ratified remediation authorized by `NEXUS-RAT-2026-07-14-008`; no remaining architectural deviations are known after this remediation.

### Reviewer Notes

**Status:** PASS WITH FINDINGS — see `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-008` for full detail. Supersedes the prior FAIL recorded under `NEXUS-REV-2026-07-14-007`.

Independently reproduced `git diff` against `src/hosts/vscode/vscode-host.ts`, `src/hosts/vscode/host-mission-workflow-command-registration.ts`, `package.json`, `IMPLEMENTATION_REPORT.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `knowledge/governance/RATIFICATION_LEDGER.md`, and `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md` (confirmed byte-identical to its pre-Sprint-33 committed state). Ran `npm run validate` and `npm run test:extension-host:build` independently: `tsc --noEmit`, ESLint, Vitest (58 files / 282 tests), esbuild, and the extension-host bundle all pass, and `git diff --stat -- src/kernel` is confirmed empty.

Both Critical findings from `NEXUS-REV-2026-07-14-007` are resolved:

1. **F-001 resolved.** `nexus.runDeveloperMissionWorkflow` is once again bound to a `HostMissionWorkflow` hardcoded to `mock-adapter`, confirmed both by code diff and by `test/hosts/vscode/host-mission-workflow-configured-command-registration.test.ts`, which explicitly asserts the MockAdapter command is unaffected by the new additive `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` command. Existing Gemini/Codex command tests and integration tests are confirmed untouched.
2. **F-002 substantially resolved.** `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, and the Sprint 31 record are restored (the Sprint 31 record byte-identical to its pre-Sprint-33 state). One residual gap: `NEXUS-RAT-2026-07-14-005`'s restored text dropped a non-binding parenthetical qualifier present in the original ratified wording — see new finding F-001 (Minor) in `NEXUS-REV-2026-07-14-008`. This does not reintroduce any disputed scope and does not block approval.

DOC-001 is also resolved: `IMPLEMENTATION_REPORT.md`'s Sprint 33 § Deviations now accurately discloses both the original findings and the remediation performed.

### Final Disposition

**Approved with Findings** — `NEXUS-REV-2026-07-14-008`. No Critical or Major findings remain. One Minor Category 4 (Documentation Drift) finding recorded (`NEXUS-REV-2026-07-14-008-F-001` — a dropped parenthetical clause in `NEXUS-RAT-2026-07-14-005`'s restored text); does not block approval or progression. One Informational observation carried forward (cosmetic table formatting, no action required). Recommend a Documentation Task via `nexus-sprint` to restore the dropped clause verbatim.

Date: 2026-07-14

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-14-008`
