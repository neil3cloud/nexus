# Sprint 30 — Developer Workflow Integration of GeminiCliAdapter

## Sprint Status

Approved (NEXUS-REV-2026-07-14-003)

## Sprint Objective

Connect the certified, isolated `GeminiCliAdapter` (Sprint 29, `NEXUS-REV-2026-07-14-002`) to the Developer Workflow through a **second, dedicated Host command**, so a developer can exercise a real production Adapter end-to-end, while leaving the existing `nexus.runDeveloperMissionWorkflow` command and its frozen, deterministic `MockAdapter`-based test baseline (Sprints 25–28) completely unmodified. This Sprint introduces exactly one architectural variable: a second workflow command targeting `GeminiCliAdapter` via an explicit `adapterId`, reusing the existing certified execution pipeline verbatim.

## Milestone

Milestone 5 — Production Adapter Integration (third slice). Sprint 28 productized Nexus as an installable extension; Sprint 29 certified `GeminiCliAdapter` in isolation. Sprint 30 completes Milestone 5's remaining Expected Outcome: Developer Workflow integration of `GeminiCliAdapter`.

## RFC Coverage

Primary:

- RFC-0009 — Host Contract (Partial).

Referenced:

- RFC-0004 — Execution Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

## Ratification References

- `NEXUS-RAT-2026-07-14-004` — governs this sprint's entire scope: the binding decision to introduce a second Developer Workflow command rather than a persisted Adapter-configuration surface, the Architectural Responsibilities, authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-14-003` — established that Developer Workflow integration of `GeminiCliAdapter` is authorized only after Sprint 29's independent certification; satisfied by `NEXUS-REV-2026-07-14-002`.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected; dispatch SHALL use explicit `adapterId` only.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-14-004)

**Sprint 30 SHALL:**

- Leave the existing `nexus.runDeveloperMissionWorkflow` command, its `HostMissionWorkflow` construction, and its Sprint 25–28 test coverage completely unmodified. This command SHALL remain the sole target of all existing automated integration tests and the Sprint 28 Extension Host suite; its execution path SHALL remain `Developer Workflow → MockAdapter`.
- Introduce exactly one new Host command dedicated to production Adapter validation (e.g. `nexus.runDeveloperMissionWorkflowWithGeminiCli`), whose execution path is `Developer Workflow → GeminiCliAdapter`, reusing the identical, already-certified workflow sequence (Sprint 25/26/27's Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge) with only the Adapter dispatch `adapterId` changed to `GEMINI_CLI_ADAPTER_ID`.
- Dispatch via explicit `adapterId` only — no Adapter routing, selection policy, capability scoring, or persisted preference.
- Register `GeminiCliAdapter` at the `extension.ts` composition root alongside the existing, unmodified `MockAdapter` registration.

**Sprint 30 SHALL NOT:**

- Modify the existing `nexus.runDeveloperMissionWorkflow` command's behavior, its `HostMissionWorkflow` construction, or any Sprint 25–29 test asserting its behavior.
- Introduce any persisted VS Code configuration/setting for Adapter selection, Workspace/User adapter preferences, or any configuration subsystem of any kind.
- Introduce Adapter Selection Policy, provider routing, capability scoring, fallback, or multi-adapter coordination.
- Introduce authentication management, credential storage, OAuth, or `SecretStorage` integration.
- Modify any `src/kernel` file.

**Architectural Responsibilities (binding):**

- The Host MAY expose multiple Developer Workflow entry points (commands); this does not constitute Adapter Selection Policy.
- The Kernel SHALL remain unaware of which command initiated execution.
- Execution Strategy SHALL continue receiving an explicit adapter identifier at the call site, exactly as today.
- The Adapter Registry SHALL continue performing deterministic dispatch only, never routing or scoring.

## Authorized Vertical Slice

- A new Host command (e.g. `nexus.runDeveloperMissionWorkflowWithGeminiCli`, or an equivalent provider-neutral name reviewed against the existing command-naming convention in `host-mission-workflow-command-registration.ts`) that constructs/invokes the workflow with the Adapter dispatch step's explicit `adapterId` set to `GEMINI_CLI_ADAPTER_ID`, reusing every other step of the existing, certified `HostMissionWorkflow` pipeline unchanged (`RoleService.assignRole`, `ExecutionStrategyService.evaluateAssignmentReadiness`, `AdapterService.dispatch`, `EvidenceService.registerEvidence`, `ReviewService.startReview`/`publishFinding`/`finalizeReviewOutcome`, `KnowledgeService.captureKnowledge`).
- Registration of `GeminiCliAdapter` (constructor-injected with a `LocalProcessRuntimeContract` instance, e.g. `new LocalProcessRuntime()`) at the `extension.ts` composition root, alongside `createMockAdapter()` — both Adapters registered; `MockAdapter` remains the existing command's dispatch target.
- New command contribution (`package.json` `contributes.commands`, `activationEvents`) mirroring the existing `nexus.runDeveloperMissionWorkflow` contribution pattern.
- Unit and/or integration test coverage for the new command's success and failure paths, using the existing deterministic Gemini CLI test-double (`test/adapters/gemini/gemini-cli-test-double.cjs`, Sprint 29) exclusively — never a live Gemini CLI.
- Presentation/history extension (if needed) mirroring the existing command's progress/result presentation and session-only history pattern, distinguishing which command/adapter produced each history entry if both commands share a history view.

## Explicitly Out of Scope / Deferred Concepts

**Configuration:** Persisted adapter preferences; Workspace or User adapter settings; any configuration subsystem for Adapter selection (remains deferred from Sprint 24).

**Selection/Routing:** Adapter Selection Policy, provider routing, provider preference, fallback, capability scoring, multi-adapter execution.

**Security:** Authentication management, credential storage, OAuth, `SecretStorage` integration.

**Providers:** GitHub Copilot CLI Adapter; Claude CLI Adapter; Codex CLI Adapter; any second production Adapter.

**Runtime:** Streaming responses, multi-provider coordination, background execution, retries beyond Sprint 21's existing timeout/cancellation primitives.

**Unchanged baselines:** `nexus.runDeveloperMissionWorkflow`, `HostMissionWorkflow`'s existing construction, `MockAdapter`, `GeminiCliAdapter`'s Sprint 29-approved implementation, `LocalProcessRuntime`, `Adapter`/`AdapterService`/`AdapterRegistry`, and every Kernel capability approved through Sprint 29. Existing Sprint 16/17/18/20/25/26/27/28/29 tests SHALL continue to pass unmodified.

## Acceptance Criteria

Sprint 30 SHALL demonstrate:

- The existing `nexus.runDeveloperMissionWorkflow` command and every Sprint 25–29 test asserting its behavior pass unmodified.
- A new Host command executes the identical certified workflow sequence through `GeminiCliAdapter` via explicit `adapterId`, with no Adapter Selection, routing, or persisted configuration introduced.
- The new command's automated test coverage is fully deterministic and CI-safe, using only the Sprint 29 test-double executable — no live-network or live-Gemini-CLI dependency in `npm run validate`.
- No `src/kernel` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide automated validation passes: TypeScript compile, ESLint, Vitest, esbuild.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 5 / Sprint 30, `IMPLEMENTATION_MANIFEST.md` § Milestone 5 / Sprint 30, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-14-004`, § `NEXUS-RAT-2026-07-14-003`, and § `NEXUS-RAT-2026-07-13-011` (all authoritative for this sprint's scope), `knowledge/specifications/rfc-0009-host-contract.md`, the Sprint 25, 26, 27, and 29 records, `src/hosts/vscode/host-mission-workflow.ts`, `src/hosts/vscode/vscode-host.ts`, `src/hosts/vscode/host-mission-workflow-command-registration.ts`, `src/extension.ts`, and `src/adapters/gemini/gemini-cli-adapter.ts` as the structural precedents to reuse/mirror, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, honoring the Critical Boundary and Architectural Responsibilities exactly.
- Do not modify the existing `nexus.runDeveloperMissionWorkflow` command's behavior or its Sprint 25–29 test coverage.
- Do not add any live-network-dependent step to `npm run validate` or any script it invokes.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 30 section of `IMPLEMENTATION_REPORT.md` upon completion.
- Populate the Builder Results / Test Summary sections of this record upon completion.

## Documentation Requirements

The Builder SHALL update:

- `IMPLEMENTATION_PLAN.md`
- `IMPLEMENTATION_MANIFEST.md`
- `IMPLEMENTATION_REPORT.md`
- This Sprint Implementation Record (Builder Results / Test Summary sections)
- `ADAPTER_RUNTIME_INSTRUCTIONS.md` (only if the new command's existence requires a reconciliation note; no redefinition of its existing runtime-guidance-only scope)

The Builder SHALL NOT modify:

- Kernel Canon
- Any RFC
- `REVIEW_HISTORY.md`
- `RATIFICATION_LEDGER.md`

## Known Limitations (anticipated)

- The new command still depends on a locally authenticated Gemini CLI session to succeed in practice; this Sprint does not change the pre-authenticated-local-session authentication model established by `NEXUS-RAT-2026-07-14-002`.
- No persisted preference exists yet for which Adapter a developer prefers by default; a developer must explicitly invoke the new command to exercise `GeminiCliAdapter`. Persisted configuration remains a future, separately-ratified concept.
- No retry, streaming, or multi-turn conversation support, matching Sprint 29's existing `GeminiCliAdapter` behavior.

## Expected Outcome

Upon successful completion, Nexus SHALL possess two parallel, independently-certified Developer Workflow entry points:

```text
nexus.runDeveloperMissionWorkflow              → MockAdapter              (frozen, deterministic, CI baseline)
nexus.runDeveloperMissionWorkflowWithGeminiCli → GeminiCliAdapter         (production Adapter validation)
```

This demonstrates that the RFC-0008 Adapter Contract and the RFC-0009 Host Contract compose correctly with a real production provider inside the Developer Workflow, without introducing Adapter Selection Policy, routing, or persisted configuration — completing Milestone 5's remaining Expected Outcome.

## Builder Results

Implemented the Sprint 30 Developer Workflow Integration of `GeminiCliAdapter` vertical slice.

- Added a second Host command, `nexus.runDeveloperMissionWorkflowWithGeminiCli`, while preserving the existing `nexus.runDeveloperMissionWorkflow` command and its `MockAdapter` dispatch path.
- Registered the new command in `package.json` command contributions and activation events.
- Extended command input normalization to preserve deterministic Adapter execution constraints supplied to workflow commands.
- Composed a second `HostMissionWorkflow` instance in the VS Code Host with explicit `adapterId: GEMINI_CLI_ADAPTER_ID`; the existing workflow instance continues to use explicit `adapterId: MOCK_ADAPTER_ID`.
- Registered `GeminiCliAdapter` at the extension composition root alongside `MockAdapter`, using `LocalProcessRuntime`.
- Added deterministic success and failure coverage for the new command/workflow path using the Sprint 29 Gemini CLI test-double only.
- Preserved all deferred concepts: no Adapter Selection Policy, routing, persisted preferences, configuration subsystem, credential handling, OAuth, `SecretStorage`, streaming responses, multi-provider coordination, or `src/kernel` change was introduced.

No architectural deviations.

## Test Summary

- Targeted Sprint 30 Vitest suite passed: `test\hosts\vscode\host-mission-workflow-gemini-command-registration.test.ts` and `test\integration\host-mission-workflow-gemini-cli.integration.test.ts` — 2 files, 3 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 52 files, 265 tests.
- Sprint 18 Kernel boundary certification passed unmodified as part of the Vitest suite.
- `git diff --stat -- src\kernel src\adapters` is empty.

## Reviewer Notes

Independently re-verified every claim in Builder Results and Test Summary: diffed `vscode-host.ts`, `host-mission-workflow-command-registration.ts`, `extension.ts`, and `package.json` line-by-line and confirmed all changes are additive; confirmed via `git diff --stat` that `host-mission-workflow.ts`, every pre-existing Sprint 25–27 test file, `src/kernel`, and `src/adapters` are all untouched. Re-ran the targeted Sprint 30 suite directly (2 files / 3 tests passed) and the full `npm run validate` pipeline independently (TypeScript compile, ESLint, Vitest 52 files / 265 tests, esbuild — all passed, matching the Builder's reported counts exactly), with the Sprint 18 kernel boundary certification test included and passing unmodified. Confirmed both new tests exercise `GeminiCliAdapter` exclusively via the deterministic Sprint 29 test-double executable, never a live Gemini CLI. See `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-003` for the complete review record.

## Findings

None.

## Required Actions

None. Zero findings; nothing blocks or requires remediation.

## Final Disposition

**Approved** (`NEXUS-REV-2026-07-14-003`). No architectural violations detected. Milestone 5's remaining Expected Outcome (Developer Workflow integration of `GeminiCliAdapter`) is now complete.
