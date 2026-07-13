# Nexus Implementation Report

## Sprint 31 — Codex CLI Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 6 Sprint 31 Codex CLI Adapter Runtime Integration vertical slice. This sprint introduces the second production Adapter implementation in isolation, alongside the certified `MockAdapter` and `GeminiCliAdapter`, without wiring it into Developer Workflow execution.

Implemented scope:

- Added `CodexCliAdapter` under `src/adapters/codex/`.
- Implemented RFC-0008 `Adapter` metadata and `execute(request): Promise<AdapterResponse>`.
- Translated `AdapterRequest` into a local `ProcessRequest` and invoked it only through constructor-injected `LocalProcessRuntimeContract`.
- Used Codex CLI's non-interactive execution shape, `codex exec "<Nexus Adapter prompt>"`, by default.
- Parsed successful Codex CLI JSON output into the existing `AdapterResponse` shape.
- Preserved process diagnostics from `LocalProcessRuntimeContract` for executable-not-found, non-zero exit, timeout, and startup/runtime failure paths.
- Added malformed-output, invalid-timeout, unsupported-role, and runtime-exception Adapter diagnostics.
- Added deterministic local test-double coverage and direct `AdapterService.dispatch` composition coverage with `MockAdapter`, `GeminiCliAdapter`, and `CodexCliAdapter` registered together.
- Updated `ADAPTER_RUNTIME_INSTRUCTIONS.md` as provider-neutral runtime guidance covering both Gemini CLI and Codex CLI manual verification.

Out of scope and not implemented:

- Developer Workflow integration or any Host command targeting `CodexCliAdapter`.
- Host orchestration changes, `HostMissionWorkflow` changes, or `extension.ts` dispatch-target changes.
- Any `src/kernel` changes.
- Adapter Selection, provider routing, provider preference, fallback, persisted Adapter-selection configuration, or multi-adapter execution policy.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, retries beyond existing runtime timeout behavior, or multi-provider coordination.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, or any third production Adapter.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial — second production implementation).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Production `Adapter` implementation for Codex CLI.
- Adapter metadata, declared capabilities, and supported roles using the existing Adapter Framework vocabulary.
- Adapter request translation to a local process invocation.
- Adapter response parsing and attribution-preserving execution metadata.
- Deterministic Adapter diagnostics for runtime and parsing failure modes.
- Composition-time registration through the existing `createKernelServices` `adapters` option, exercised only through explicit `adapterId` dispatch.

Deferred Concepts:

- Developer Workflow integration and any Host command targeting `CodexCliAdapter`.
- GitHub Copilot CLI, Claude CLI, or any third production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, persisted Adapter-selection configuration, and multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed credentials.
- Streaming responses, multi-provider coordination, and background provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-005`, `NEXUS-RAT-2026-07-14-002`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0031-codex-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

### Architectural Assumptions

- Codex CLI request execution can be represented as a single local process invocation through the existing `LocalProcessRuntimeContract`.
- The Adapter can require JSON-only provider output because RFC-0008 defines Adapter Response shape, while provider-specific protocol details remain inside the Adapter boundary.
- The executable path and base arguments are runtime composition details, enabling deterministic local test-double execution without adding Adapter Selection or provider routing.
- Codex CLI uses `codex exec [PROMPT]` for non-interactive execution; the Adapter's injected runtime passes the prompt as a process argument, avoiding shell prompt-splitting behavior.

### Known Limitations

- `CodexCliAdapter` is not reachable from any VS Code command or Developer Workflow path in this sprint.
- Automated validation exercises only a deterministic local test-double executable, never the live Codex CLI.
- Manual Production Verification depends on a local Codex CLI installation and a usable pre-authenticated Codex account/session.
- In this environment, Codex CLI executable discovery succeeded (`C:\Users\NeilBusa\AppData\Roaming\npm\codex.ps1`, version `codex-cli 0.144.3`). Live request execution succeeded outside the repository using Codex CLI stdin mode with `--skip-git-repo-check`, `--ignore-rules`, `--ephemeral`, and `--output-last-message`; Codex returned the expected parseable JSON response contract.
- No retry, streaming, or multi-turn session support is implemented.

### Validation Summary

- Targeted Sprint 31 Vitest suite passed: 2 files, 7 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 54 files, 272 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- `git diff --stat -- src\kernel src\hosts src\extension.ts package.json` is empty.
- Manual Production Verification procedure is documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`; live execution evidence is recorded above.

### Deviations

No architectural deviations.

---

## Sprint 30 — Developer Workflow Integration of GeminiCliAdapter

### Implemented Slice

Implemented the Milestone 5 Sprint 30 Developer Workflow Integration of `GeminiCliAdapter` vertical slice. This sprint connects the certified Sprint 29 `GeminiCliAdapter` to the Developer Workflow through a second, dedicated Host command while preserving the existing `MockAdapter` workflow command as the deterministic baseline.

Implemented scope:

- Added `nexus.runDeveloperMissionWorkflowWithGeminiCli` as a second Host command.
- Preserved `nexus.runDeveloperMissionWorkflow` and its explicit `MOCK_ADAPTER_ID` dispatch path.
- Added the new command contribution and activation event in `package.json`.
- Registered `GeminiCliAdapter` at the extension composition root alongside `MockAdapter`.
- Composed a separate `HostMissionWorkflow` instance with explicit `adapterId: GEMINI_CLI_ADAPTER_ID`.
- Preserved the already-certified Mission → MissionPlan → Task → Execution → Evidence → Review → Knowledge workflow sequence unchanged.
- Added deterministic command-registration and end-to-end workflow coverage for success and failure paths using the Sprint 29 Gemini CLI test-double only.

Out of scope and not implemented:

- Adapter Selection Policy, provider routing, capability scoring, fallback, or multi-adapter coordination.
- Persisted adapter preferences, Workspace/User settings, or any Adapter-selection configuration subsystem.
- Authentication management, credential storage, OAuth, or `SecretStorage`.
- GitHub Copilot CLI Adapter, Claude CLI Adapter, Codex CLI Adapter, or any second production Adapter.
- Streaming responses, multi-provider coordination, background execution, or retry behavior beyond existing runtime timeout behavior.
- Any `src/kernel` changes.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Multiple Host Developer Workflow command entry points.
- Explicit `adapterId` dispatch from a Host workflow call site.
- Extension composition of `MockAdapter` and `GeminiCliAdapter`.
- Deterministic CI-safe Gemini CLI workflow validation through the existing local test-double.

Deferred Concepts:

- Adapter Selection Policy, provider routing, provider preference, fallback, capability scoring, and multi-adapter execution.
- Persisted adapter preferences, Workspace/User settings, default adapter preferences, and configuration subsystem support.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed provider credentials.
- Additional production provider Adapters.
- Streaming responses, background execution, and multi-provider coordination.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-004`, `NEXUS-RAT-2026-07-14-003`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0030-developer-workflow-gemini-cli-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A second Host command is a Host entry point and does not constitute Adapter Selection Policy when the command constructs a workflow with an explicit `adapterId`.
- The Kernel remains unaware of which Host command initiated the workflow because the same `HostMissionWorkflow` contract and public Kernel services are reused.
- Automated Sprint 30 validation must use the existing deterministic Gemini CLI test-double, never a live Gemini CLI.

### Known Limitations

- The Gemini CLI Developer Workflow command depends on a locally authenticated Gemini CLI session in practical production use.
- Automated validation proves the command path with the deterministic test-double only.
- No persisted preference exists for choosing an Adapter; developers must explicitly invoke the Gemini CLI command.
- No retry, streaming, multi-turn conversation, or background workflow behavior is implemented.

### Validation Summary

- Targeted Sprint 30 Vitest suite passed: 2 files, 3 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 52 files, 265 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- `git diff --stat -- src\kernel src\adapters` is empty.

### Deviations

No architectural deviations.

---

## Sprint 29 — Gemini CLI Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 5 Sprint 29 Gemini CLI Adapter Runtime Integration vertical slice. This sprint introduces the first production Adapter implementation in isolation, alongside the certified `MockAdapter`, without wiring it into Developer Workflow execution.

Implemented scope:

- Added `GeminiCliAdapter` under `src/adapters/gemini/`.
- Implemented RFC-0008 `Adapter` metadata and `execute(request): Promise<AdapterResponse>`.
- Translated `AdapterRequest` into a local `ProcessRequest` and invoked it only through constructor-injected `LocalProcessRuntimeContract`.
- Parsed successful Gemini CLI JSON output into the existing `AdapterResponse` shape.
- Preserved process diagnostics from `LocalProcessRuntimeContract` for executable-not-found, non-zero exit, timeout, and startup/runtime failure paths.
- Added malformed-output, invalid-timeout, unsupported-role, and runtime-exception Adapter diagnostics.
- Added deterministic local test-double coverage and direct `AdapterService.dispatch` composition coverage with `MockAdapter` and `GeminiCliAdapter` registered together.
- Created `ADAPTER_RUNTIME_INSTRUCTIONS.md` as provider-neutral runtime execution guidance with a Manual Production Verification procedure.

Out of scope and not implemented:

- Developer Workflow integration or replacement of `MockAdapter`.
- Host orchestration changes, `HostMissionWorkflow` changes, or `extension.ts` dispatch-target changes.
- Any `src/kernel` changes.
- Adapter Selection, provider routing, provider preference, fallback, or multi-adapter execution policy.
- Authentication management, credential storage, OAuth, `SecretStorage`, streaming responses, retries beyond existing runtime timeout behavior, or multi-provider coordination.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial — first production implementation).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Production `Adapter` implementation for Gemini CLI.
- Adapter metadata, declared capabilities, and supported roles using the existing Adapter Framework vocabulary.
- Adapter request translation to a local process invocation.
- Adapter response parsing and attribution-preserving execution metadata.
- Deterministic Adapter diagnostics for runtime and parsing failure modes.
- Composition-time registration through the existing `createKernelServices` `adapters` option, exercised only through explicit `adapterId` dispatch.

Deferred Concepts:

- Developer Workflow integration and replacement of `MockAdapter` in Host workflow execution.
- GitHub Copilot CLI, Claude CLI, Codex CLI, or any second production Adapter.
- Adapter Selection Policy, provider routing, provider preference, fallback, and multi-adapter execution.
- Authentication management, credential storage, OAuth, `SecretStorage`, and Nexus-managed credentials.
- Streaming responses, multi-provider coordination, and background provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-003`, `NEXUS-RAT-2026-07-14-002`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0029-gemini-cli-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `ADAPTER_RUNTIME_INSTRUCTIONS.md`.

### Architectural Assumptions

- Gemini CLI request execution can be represented as a single local process invocation through the existing `LocalProcessRuntimeContract`.
- The Adapter can require JSON-only provider output because RFC-0008 defines Adapter Response shape, while provider-specific protocol details remain inside the Adapter boundary.
- The executable path and base arguments are runtime composition details, enabling deterministic local test-double execution without adding Adapter Selection or provider routing.

### Known Limitations

- `GeminiCliAdapter` is not reachable from any VS Code command or Developer Workflow path in this sprint.
- Automated validation exercises only a deterministic local test-double executable, never the live Gemini CLI.
- Manual Production Verification depends on a local Gemini CLI installation and a usable pre-authenticated Gemini account/session.
- In this environment, Gemini CLI executable discovery succeeded (`C:\Users\NeilBusa\AppData\Roaming\npm\gemini.ps1`, version `0.50.0`), but live request execution failed before provider response parsing because Gemini CLI returned `IneligibleTierError` / `UNSUPPORTED_CLIENT` for the local Gemini Code Assist account tier. A rerun with `--skip-trust` removed the workspace-trust blocker and confirmed the remaining blocker is provider-side eligibility, not Nexus automation.
- No retry, streaming, or multi-turn session support is implemented.

### Validation Summary

- Targeted Sprint 29 Vitest suite passed: 2 files, 7 tests.
- Repository validation passed with `npm run validate`: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 50 files, 262 tests.
- Sprint 18 Kernel boundary certification passed unmodified.
- Manual Production Verification procedure is documented in `ADAPTER_RUNTIME_INSTRUCTIONS.md`; live execution evidence is recorded above.

### Deviations

No architectural deviations.

---

## Sprint 28 — VS Code Extension Installability

### Implemented Slice

Implemented the Milestone 5 Sprint 28 VS Code Extension Installability vertical slice. This sprint productizes the already-certified provider-independent Developer Workflow as an installable local VS Code extension and validates it inside a real Extension Host without extending Nexus architecture.

Implemented scope:

- Completed extension packaging metadata in `package.json`: command-scoped `activationEvents`, `icon`, `repository`, `license`, and `engines.vscode`.
- Added local VSIX packaging through `@vscode/vsce` and `npm run package`, producing `nexus-0.0.1.vsix`.
- Added `.vscodeignore` to exclude source, tests, generated Extension Host output, generated VSIX files, and development tooling from the packaged extension.
- Added `.vscode/launch.json` for manual Extension Development Host verification.
- Added `@vscode/test-electron` and a distinct `test:extension-host` target.
- Added Extension Host validation that installs the packaged VSIX through the VS Code CLI, activates the extension, verifies all six contributed commands, executes `nexus.runDeveloperMissionWorkflow` through the certified `MockAdapter`, and verifies Mission workflow history.
- Added a local extension icon at `assets/nexus-icon.png`.

Out of scope and not implemented:

- Production provider Adapters, live AI execution, Adapter Selection, provider routing, authentication, credential management, OAuth, `SecretStorage`, streaming responses, multi-provider coordination, Marketplace publication, release automation, or `COPILOT_INSTRUCTIONS.md` activation.
- Kernel, Adapter, or Host business-logic changes.
- New commands, capabilities, workflow steps, business rules, execution semantics, lifecycle transitions, or architectural ownership changes.

### RFC Coverage

Primary RFC:

- No Primary RFC — packaging/tooling and validation-only slice.

Referenced RFCs:

- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Local VSIX generation and installation validation.
- Extension activation validation inside a real VS Code Extension Host.
- Public command registration validation for the six existing Host entry points.
- Provider-independent Developer Workflow command execution validation through the certified `MockAdapter`.

Deferred Concepts:

- GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, or any production provider Adapter.
- Adapter Selection, provider routing, provider preference, fallback, and multi-provider execution.
- Authentication, credential management, OAuth, and `SecretStorage`.
- Streaming responses, background execution, workflow automation, release automation, Marketplace publication, and `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-14-001`, `NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-014`, `NEXUS-RAT-2026-07-13-010`, `NEXUS-RAT-2026-07-13-011`).
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/sprints/sprint-0028-vs-code-extension-installability.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Extension Host validation may use command-scoped activation rather than eager activation because the existing public command surface is the authorized activation and execution boundary.
- The Extension Host test validates package installation before launching the development Extension Host test harness; this satisfies local installation validation without introducing Marketplace publication or release automation.
- The test runner may use `VSCODE_EXECUTABLE_PATH` when a local VS Code executable is available, preserving the same Extension Host validation semantics while avoiding external download fragility.

### Known Limitations

- Local VSIX generation and local installation are validated; Visual Studio Marketplace packaging, marketplace metadata validation, release automation, and publication remain deferred.
- Only the certified `MockAdapter` participates in Extension Host workflow execution.
- Cross-version VS Code compatibility testing is not introduced; validation uses the VS Code executable supplied by `@vscode/test-electron` or `VSCODE_EXECUTABLE_PATH`.

### Validation Summary

- TypeScript compile passed.
- ESLint passed.
- Existing Vitest suite passed: 48 files, 255 tests, with the Extension Host suite excluded from Vitest and run through its distinct target.
- esbuild passed.
- Repository validation passed after rerunning a transient local-process runtime timeout.
- Local VSIX packaging passed and produced `nexus-0.0.1.vsix`.
- Extension Host validation passed using `@vscode/test-electron` with a local VS Code executable: VSIX installation succeeded, activation completed, all six commands were registered, `nexus.runDeveloperMissionWorkflow` completed through `MockAdapter`, and workflow history was returned.

### Deviations

No architectural deviations.

---

## Sprint 27 — Developer Workflow Completion

### Implemented Slice

Implemented the Milestone 4 Sprint 27 Developer Workflow Completion vertical slice. This sprint completes the provider-independent Host Developer Workflow by extending the existing Mission/Task/Adapter flow through the authorized Evidence -> Review -> Knowledge completion sequence using only existing public Kernel service contracts.

Implemented scope:

- Extended `HostMissionWorkflow` to invoke `EvidenceService.registerEvidence()`, `ReviewService.startReview()`, `ReviewService.publishFinding()`, `ReviewService.finalizeReviewOutcome()`, and `KnowledgeService.captureKnowledge()` immediately after successful `MissionExecutionService.completeMission()`.
- Supplied deterministic Host command inputs for Evidence, Review, Finding, Review outcome, and Knowledge capture without adding Host-side Evidence validity, Review interpretation, or Knowledge eligibility rules.
- Called `KnowledgeService.captureKnowledge()` unconditionally after `finalizeReviewOutcome()`; Kernel-thrown rejection stops the workflow through the existing deterministic Kernel-rejection path.
- Presented Review Finding, Review outcome, Knowledge capture status, and captured Knowledge identity through the existing `HostPresentationSurface`.
- Extended session-only workflow history with Review outcome and Knowledge capture status while preserving the non-durable presentation-only constraint.
- Wired `EvidenceService`, `ReviewService`, and `KnowledgeService` into the VS Code Host composition root using the existing `resolveService` pattern.
- Added focused unit and integration coverage for the authorized call sequence, successful Knowledge capture, command history output, real Kernel service composition, and Knowledge rejection stop behavior.

Out of scope and not implemented:

- Live AI Providers, production Adapter integration, Adapter Selection, provider routing, or multi-provider coordination.
- Human review intervention, review retry workflows, or AI-generated review judgment.
- Streaming, background workflow execution, workflow automation, cancellation, or retries.
- Persistent workflow/execution/review/knowledge history, Evidence indexing, Knowledge conflict resolution, Mission browser, dashboards, or Shared Reality visualization.
- New Kernel capabilities, aggregates, repositories, business rules, lifecycle transitions, Domain Events, or direct Kernel/Adapter source changes.
- `COPILOT_INSTRUCTIONS.md` activation or consumption.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host-layer orchestration of the provider-independent Developer Workflow completion phase.
- Existing public Kernel service invocation for Evidence registration, Review lifecycle/finding/outcome, and Knowledge capture.
- Deterministic Host-supplied command data for the authorized completion workflow.
- Session-only Review outcome and Knowledge capture status presentation/history.
- Deterministic stop behavior on Kernel rejection during the completion phase.

Deferred Concepts:

- Production provider Adapters, Adapter Selection, provider routing, and live AI execution.
- Human review intervention, review retry workflows, and AI/human Review judgment generation.
- Persistent workflow, execution, review, and knowledge history.
- Evidence indexing, Knowledge conflict resolution, Policy Engine integration, and Shared Reality visualization.
- Streaming execution, background workflow execution, workflow automation, cancellation, and multi-provider coordination.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-13-014`, `NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-010`).
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0005-evidence-foundation.md`.
- `knowledge/implementation/sprints/sprint-0009-review-foundation.md`.
- `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md`.
- `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md`.
- `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/sprints/sprint-0027-developer-workflow-completion.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Deterministic Review outcome input supplied by the Host is command data, not Host interpretation, consistent with `NEXUS-RAT-2026-07-13-014`.
- Knowledge eligibility remains exclusively enforced by `KnowledgeService.captureKnowledge()` and the Knowledge aggregate; the Host does not branch on Review outcome before invoking Knowledge capture.
- Session history remains non-authoritative Host presentation state because it is in-memory only and records minimal workflow outcome fields.
- Deterministic completion Evidence/Finding/Knowledge content is fixed workflow data and does not introduce new Review or Knowledge business rules.

### Known Limitations

- The workflow still supports exactly one Task per Mission.
- Only one deterministic Evidence item, Finding, Review outcome, and Knowledge capture path is exercised.
- Review outcome is a fixed Host-supplied command value, not human or AI-generated engineering judgment.
- Mission workflow history remains session-scoped and is discarded with the extension process.
- Kernel rejection recovery remains stop-and-present diagnostics only; retry and partial-completion recovery remain deferred.

### Validation Summary

- TypeScript compile passed.
- Focused Sprint 27 Vitest coverage passed: 3 files, 9 tests.
- ESLint passed.
- Full Vitest suite passed on rerun: 48 files, 255 tests. The first full `npm run validate` attempt hit a transient timeout in the frozen Sprint 21 local-process runtime integration test; that test passed immediately on targeted rerun and in the subsequent full suite.
- esbuild passed.
- `git diff --stat HEAD -- src\kernel src\adapters` is empty.

### Deviations

No architectural deviations.

---

## Sprint 26 — Developer Workflow Adapter Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 26 Developer Workflow Adapter Integration vertical slice. This sprint connects the Sprint 25 Host Mission workflow to the Sprint 20 certified Adapter execution pipeline through existing public Kernel services and the existing provider-independent `MockAdapter`.

Implemented scope:

- Extended `HostMissionWorkflow` to insert `ExecutionStrategyService.createExecutionStrategy`, `RoleService.assignRole`, `ExecutionStrategyService.evaluateAssignmentReadiness`, `RoleService.retrieveRole`, and `AdapterService.dispatch` between `startTask` and `completeTask`.
- Built Adapter requests from the Kernel readiness result and retrieved Role, using deterministic Mission/Task/Execution Strategy identity metadata.
- Completed Tasks only after a `Completed` Adapter response.
- Stopped deterministically on non-`Completed` Adapter responses, presented Adapter diagnostics, recorded the true last-known Mission status, and did not fabricate Task failure state.
- Wired VS Code Host composition to provide Role, Execution Strategy, and Adapter services plus explicit `mock-adapter` / `CodeModification` dispatch inputs.
- Extended session-only Mission workflow history with Adapter ID and dispatch status.
- Updated unit and integration tests for success sequencing, non-success Adapter handling, command registration, real Kernel composition with `MockAdapter`, and unchanged Sprint 20 pipeline behavior.

Out of scope and not implemented:

- Live AI provider integration or production provider Adapter behavior.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, load balancing, or multi-adapter execution.
- Background execution, workflow automation, retries, streaming, cancellation, or additional progress callbacks beyond existing markers.
- Persistent execution history, Knowledge integration, Shared Reality visualization, Mission browser, dashboards, or `COPILOT_INSTRUCTIONS.md`.
- New Kernel or Adapter business rules, states, lifecycle transitions, events, or source changes.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host-driven invocation of the certified execution pipeline using public Kernel services.
- Explicit provider-independent Adapter dispatch using `MockAdapter`.
- Adapter response-gated Task completion.
- Deterministic non-success Adapter stop behavior without fabricated Task failure state.
- Session-only Adapter dispatch outcome history.

Deferred Concepts:

- Production providers and live AI execution.
- Adapter Selection Policy and any routing/fallback/provider-preference behavior.
- Persistent execution history and broader workflow dashboards.
- Knowledge, Shared Reality, Review-domain, and Evidence workflow integration.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` (`NEXUS-RAT-2026-07-13-013`, `NEXUS-RAT-2026-07-13-011`, `NEXUS-RAT-2026-07-13-010`).
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/sprints/sprint-0026-developer-workflow-adapter-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Host may orchestrate the certified pipeline by invoking public Kernel services, but role assignment, readiness evaluation, dispatch authorization, and Adapter execution outcomes remain owned by Kernel/Adapter contracts.
- Explicit `mock-adapter` dispatch supplied by composition is not Adapter selection and remains consistent with `NEXUS-RAT-2026-07-13-011`.
- Session history remains non-authoritative Host presentation state because it is in-memory only and records only minimal workflow outcome fields.

### Known Limitations

- The workflow continues to support exactly one Task per Mission.
- Only `MockAdapter` participates; no production provider Adapter exists.
- Non-`Completed` Adapter responses stop the workflow with the Task left in the last Kernel-authored state because Task execution failure states remain deferred.
- Mission workflow history is discarded with the extension process.

### Validation Summary

- Targeted Sprint 26 validation passed: 4 files, 11 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files, 254 tests.
- `git diff --stat -- src\kernel src\adapters` is empty.
- Built-in search for `globalState|workspaceState|Memento` under `src\hosts` returned no matches.

### Deviations

No architectural deviations.

---

## Sprint 25 — Developer Workflow Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 25 Developer Workflow Foundation vertical slice. This sprint adds the first provider-independent Mission developer workflow inside the VS Code Host, sequencing the certified Mission/Planning/Execution golden path through public Kernel service contracts only.

Implemented scope:

- Added `HostMissionWorkflow` as a Host-layer orchestration component for the authorized eleven-call sequence: `createMission`, `createMissionPlan`, `planMission`, `addTask`, `updateTask` to `Ready`, `markMissionReady`, `startMission`, `startTask`, `completeTask`, `reviewMission`, and `completeMission`.
- Added `nexus.runDeveloperMissionWorkflow` with interactive input for Mission objective and one Task title/description.
- Added `nexus.showMissionWorkflowHistory` for the session-only in-memory Mission workflow history.
- Added Workspace Trust enforcement before the first Kernel call.
- Added deterministic cancellation handling before Kernel calls.
- Added deterministic progress, result, and failure presentation through the existing Host presentation surface.
- Added Kernel rejection handling that stops without retrying or continuing and records last-known Mission status when a Mission was created.
- Added unit and integration coverage for success, cancellation, Kernel rejection, trust gating, history shape, command registration, and real `createKernelServices` composition.

Out of scope and not implemented:

- Evidence, Shared Reality, Review-domain behavior, and Knowledge capture.
- Multiple Tasks per Mission, Task dependencies, Task Graph authoring, Mission editing, or Mission revision after the fixed single-task sequence.
- Persistent or cross-session Mission history, including `vscode.Memento`, `globalState`, or `workspaceState`.
- Live AI providers, Adapter dispatch, Adapter Selection Policy, provider protocol logic, workflow automation, background execution, retries, or scheduling.
- New Kernel domains, aggregates, business rules, states, or events.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host command registration for the Mission developer workflow.
- Host user interaction for Mission objective and single Task input.
- Host progress/result/error presentation for Mission workflow execution.
- Host Workspace Trust enforcement before Mission workflow Kernel calls.
- Session-only minimal Mission workflow history.
- Public Kernel service invocation only for Mission/Planning/Execution behavior.

Deferred Concepts:

- Evidence, Shared Reality, Review-domain, and Knowledge Host workflows.
- Multiple Task workflows and Task dependency authoring.
- Persistent Mission history.
- Adapter/provider execution and selection.
- Workflow automation and retry policies.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/sprints/sprint-0025-developer-workflow-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- The Host may thinly invoke existing public Kernel Mission service contracts without owning Mission business logic, consistent with Sprint 25's Critical Boundary and the Sprint 23/24 Host precedent.
- Generating Host-supplied identifiers for the authorized calls is implementation wiring; Mission identity validation and lifecycle legality remain owned by the Kernel.
- Session history is non-authoritative Host presentation state because it is in-memory only and contains only `{missionId, objective, finalStatus}`.

### Known Limitations

- The workflow supports exactly one Task per Mission.
- Mission workflow history is discarded with the extension process.
- The workflow stops at Mission completion; Evidence, Review-domain, Shared Reality, and Knowledge capture remain future work.
- No Adapter or live provider participates in this workflow.

### Validation Summary

- Targeted Sprint 25 validation passed: 3 files, 7 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 48 files, 253 tests.
- `git diff --stat -- src/kernel src/adapters` is empty.
- `rg "globalState|workspaceState|Memento" src\hosts` returns no matches.

### Deviations

No architectural deviations.

---

## Sprint 24 — Host Runtime Completion

### Implemented Slice

Implemented the Milestone 4 Sprint 24 Host Runtime Completion vertical slice. This sprint completes the provider-independent Host runtime by adding interactive dispatch input, full Adapter response presentation with progress, and Workspace Trust enforcement before dispatch.

Implemented scope:

- Added `HostInputSurface` and VS Code-backed input prompts for command-palette dispatch invocation without a pre-built argument.
- Added deterministic cancellation handling for interactive input; cancellation emits a Host diagnostic and aborts without dispatch.
- Preserved Sprint 23's programmatic dispatch path for pre-built command arguments without prompting.
- Extended `HostPresentationSurface` with deterministic progress support and wired it to VS Code `window.withProgress`.
- Extended `HostIngressLayer.dispatchAdapterRequest` presentation to surface the full `AdapterResponseSnapshot`: `status`, `diagnostics`, `producedArtifacts`, `findings`, and sorted `executionMetadata`.
- Added `HostWorkspaceTrustSurface` and VS Code-backed `workspace.isTrusted` enforcement, gating dispatch only while leaving discovery and capability commands ungated.
- Added unit coverage for interactive input, cancellation, preserved programmatic dispatch, full response/progress presentation, and untrusted-workspace refusal before Adapter execution.

Out of scope and not implemented:

- Live AI provider integration, authentication, provider protocol translation, prompt execution, response parsing, or streaming.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, priority ordering, or load balancing.
- Persisted VS Code configuration for Adapter settings.
- Mission UI, Review UI, Knowledge UI, workflow visualization, broader Host Ingress Contract operations, or `COPILOT_INSTRUCTIONS.md`.
- Modifications to `src/kernel`, `src/adapters/mock`, `src/adapters/runtime`, `AdapterRequest`/`AdapterResponse` shape, `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, or Role Assignment.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host user interaction for Adapter dispatch input.
- Host structured presentation of Adapter responses.
- Host progress indication for Adapter dispatch.
- Host Workspace Trust enforcement before dispatch.
- Provider-independent preservation of explicit `adapterId` / fails-closed single-match dispatch.

Deferred Concepts:

- Live provider execution and provider protocol behavior.
- Adapter Selection Policy and routing/fallback behavior.
- Persisted Host configuration surface.
- Workflow UI and broader Mission/Review/Knowledge Host ingress.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/sprints/sprint-0024-host-runtime-completion.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Interactive input is Host-owned user interaction under RFC-0009 and does not change Adapter Request/Response contracts.
- Presenting Adapter response fields verbatim is Host presentation, not provider protocol interpretation.
- Workspace Trust is a Host security responsibility and gates dispatch because future Adapters may execute local processes.
- User-supplied `adapterId`/`requiredCapability` remains explicit dispatch input and does not introduce Adapter Selection Policy.

### Known Limitations

- Input is per-invocation only; no persisted VS Code configuration surface is introduced.
- Workspace Trust enforcement covers Adapter dispatch only in this sprint.
- The completed Host runtime still exercises only certified provider-independent Adapters; no production provider exists yet.

### Validation Summary

- Targeted Sprint 24 validation passed: 3 files, 10 tests.
- Repository-wide validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 246 tests.
- `git diff --stat -- src/kernel src/adapters/mock src/adapters/runtime` is empty.

### Deviations

No architectural deviations.

---

## Sprint 23 — Host Ingress Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 23 Host Ingress Foundation vertical slice. This sprint establishes the first VS Code Host entry point into the certified Kernel Adapter path without introducing live provider execution.

Implemented scope:

- Added Host command registration for Adapter discovery, Adapter dispatch, and Host capability declaration.
- Added `HostIngressLayer` as the Host-layer coordination component for invoking `AdapterService.enumerateAdapters` and `AdapterService.dispatch` through public Kernel service contracts only.
- Added deterministic Host capability declaration for RFC-0009 platform services: Command Registration, Notifications, Diagnostics, and User Interface.
- Added deterministic Adapter discovery presentation including Adapter metadata, Sprint 22 operational metadata, runtime diagnostics, and Host diagnostics.
- Added deterministic Adapter dispatch using explicit `adapterId` or fails-closed single-match lookup only.
- Wired the extension activation composition root to register the certified `MockAdapter`, present provider-independent operational metadata, and expose the new commands through `package.json`.
- Added unit and integration coverage for Host command registration, Host ingress behavior, metadata presentation, fails-closed dispatch, and the Host → Kernel → AdapterService → MockAdapter path.

Out of scope and not implemented:

- Live AI provider integration, authentication, provider protocol translation, prompt execution, response parsing, or streaming.
- Adapter Selection Policy, routing, capability scoring, provider preference, fallback, priority ordering, or load balancing.
- Mission UI, Review UI, Knowledge UI, workflow visualization, or the broader Host Ingress Contract operations.
- `COPILOT_INSTRUCTIONS.md`.
- Modifications to `AdapterLifecycle`, `AdapterRegistry`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, Role Assignment, Kernel Canon, or RFCs.

### RFC Coverage

Primary RFC:

- RFC-0009 — Host Contract (Partial).

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Host command registration.
- Host ingress routing.
- Host capability declaration.
- Adapter discovery through public Kernel service contracts.
- Deterministic Adapter dispatch through public Kernel service contracts.
- Host diagnostics and provider-independent output/notification presentation.
- Runtime operational metadata presentation.

Deferred Concepts:

- Live AI provider execution and provider protocol behavior.
- Adapter Selection Policy and routing/fallback behavior.
- Workflow UI and broader Mission/Review/Knowledge Host ingress.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md`.
- `knowledge/implementation/sprints/sprint-0023-host-ingress-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `AdapterService` is the public Kernel service contract for Adapter discovery and dispatch.
- A Host-layer static operational metadata provider may present already-certified Sprint 22 metadata without making the Host an Adapter owner.
- Fails-closed single-match lookup is permitted only when exactly one registered Adapter matches; multiple matches require explicit `adapterId`.
- Registering the certified `MockAdapter` at the extension activation composition root is the provider-independent exercise path authorized by Sprint 23.

### Known Limitations

- The VS Code Host exercises only the certified deterministic `MockAdapter`; no production provider Adapter exists yet.
- Operational metadata presentation is provider-independent and static for the current Mock Adapter composition.
- The broader Host Ingress Contract operations remain deferred.

### Validation Summary

- Targeted Sprint 23 validation passed: 3 files, 6 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 45 files, 242 tests.

### Deviations

No architectural deviations.

---

## Sprint 22 — Adapter Runtime Operational Metadata

### Implemented Slice

Implemented the Milestone 4 Sprint 22 Adapter Runtime Operational Metadata vertical slice. This sprint makes Adapter runtime state operationally self-describing before any live provider integration is introduced.

Implemented scope:

- Added immutable Adapter-layer metadata models outside `src/kernel`: `AdapterInstallationStatus`, `AdapterHealthStatus`, `AdapterRuntimeDiagnostics`, and `AdapterConfiguration`.
- Added `AdapterExecutableDiscovery` for short-lived executable/version detection through `LocalProcessRuntimeContract`.
- Extended `AdapterCapability` with technical capability values `CLI`, `Chat`, and `Completion`.
- Added unit coverage for immutable snapshots, deterministic diagnostics, configuration validation, secret-bearing setting rejection, invalid metadata rejection, and executable discovery outcomes.
- Preserved `AdapterRegistry` as the sole registry and left `AdapterLifecycle`, `AdapterMetadata`, `MockAdapter`, `LocalProcessRuntime`, Execution Strategy, and Role Assignment unchanged.

Out of scope and not implemented:

- Provider-prefixed types or a second runtime registry.
- GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI, Azure OpenAI, or any live provider integration.
- Authentication, login, OAuth, tokens, credential storage, secrets, or account management.
- Provider execution, prompt submission, response parsing, streaming, protocol translation, retries, routing, fallback, prioritization, Adapter Selection Policy, Host integration, or `COPILOT_INSTRUCTIONS.md`.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Adapter runtime installation status.
- Adapter runtime health status.
- Runtime diagnostics with deterministic attribution.
- Adapter runtime configuration metadata without authentication or secrets.
- Executable/version discovery helper for concrete Adapter instances.
- Additive technical Adapter capability values.

Deferred Concepts:

- All production provider integrations and provider execution behavior.
- Authentication, credentials, tokens, account management, and secrets.
- Adapter Selection Policy, routing, fallback, prioritization, and provider selection.
- Host/VS Code integration.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/sprints/sprint-0022-adapter-runtime-operational-metadata.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Operational metadata is Adapter-layer tooling, not new RFC-0008 Contract vocabulary.
- `AdapterExecutableDiscovery` may use `LocalProcessRuntimeContract` for short-lived version probes while process execution remains owned by the runtime.
- `AdapterConfiguration` may describe paths, environment metadata, and runtime settings, but must reject secret-bearing configuration keys.
- The authorized additive `AdapterCapability` extension is limited to technical capability values and does not redefine Engineering Roles.

### Known Limitations

- The metadata models describe runtime readiness only; they do not prove future provider execution correctness.
- No production Adapter consumes the metadata yet.
- Executable discovery detects version output and process status; it does not parse provider protocols or perform work execution.

### Validation Summary

- Targeted Sprint 22 validation passed: 2 files, 11 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 42 files, 236 tests.

### Deviations

No architectural deviations.

---

## Sprint 21 — Local Process Runtime Foundation

### Implemented Slice

Implemented the Milestone 4 Sprint 21 Local Process Runtime Foundation vertical slice. This sprint adds provider-agnostic local process execution infrastructure beneath the Adapter layer, outside `src/kernel`, without introducing any production provider integration.

Implemented scope:

- Added `src/adapters/runtime/local-process-runtime.ts`.
- Added `LocalProcessRuntimeContract` so Adapters consume a runtime abstraction rather than operating-system process APIs.
- Added immutable runtime value objects: `ProcessRequest`, `ProcessExecutionOptions`, `ProcessResult`, `ProcessExitStatus`, and `ProcessDiagnostics`.
- Added explicit runtime errors for invalid request and result definitions.
- Implemented process launch, stdout/stderr capture, exit status, execution duration, timeout termination, cancellation termination, and deterministic diagnostics.
- Added unit tests for value-object validation, successful execution, non-zero exit, executable-not-found, startup failure, timeout, cancellation, and abnormal termination.
- Added an Adapter-layer integration proof using a separate test-only Adapter that consumes `LocalProcessRuntime`; `MockAdapter` remains unchanged.

Out of scope and not implemented:

- GitHub Copilot CLI, Claude CLI, Codex CLI, Gemini CLI, OpenAI, Azure OpenAI, or any production provider integration.
- Authentication, login management, credential storage, provider configuration, provider discovery, provider capability negotiation.
- Parallel execution, process pools, retries, fallback execution, scheduling, prioritization, Adapter Selection Policy, routing, capability scoring, provider preference, fallback selection, or load balancing.
- CLI/response interpretation, markdown interpretation, JSON payload semantics, provider protocol validation, prompt interpretation, and `COPILOT_INSTRUCTIONS.md`.
- Kernel architectural changes, Kernel imports of runtime code, Adapter Contract changes, Execution Strategy changes, Role Assignment changes, Domain Events, repositories, or `MockAdapter` modifications.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Provider-agnostic process execution infrastructure beneath Adapters.
- Immutable process request, execution options, process result, exit status, and diagnostics value objects.
- Deterministic process lifecycle handling: launch, output capture, exit status, timeout, cancellation, and diagnostics.
- Adapter-layer integration proof without changing the Kernel or `MockAdapter`.

Deferred Concepts:

- All production provider integrations and provider runtime features.
- Process orchestration, retries, scheduling, fallback execution, and process pools.
- Adapter Selection Policy / routing / prioritization.
- CLI interpretation and provider protocol semantics.
- `COPILOT_INSTRUCTIONS.md`.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/sprints/sprint-0021-local-process-runtime-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `LocalProcessRuntime` is Adapter-layer infrastructure, not a Kernel capability, and therefore belongs under `src/adapters/runtime/`.
- Adapters consume `LocalProcessRuntimeContract`; operating-system process management remains encapsulated inside the concrete runtime implementation.
- Runtime diagnostics are process-execution diagnostics; provider-specific interpretation remains the responsibility of future provider Adapters.
- A test-only Adapter is sufficient to prove Adapter-layer integration while preserving `MockAdapter`'s approved in-process behavior.

### Known Limitations

- The runtime executes only local processes and does not implement remote or distributed execution.
- Timeout and cancellation terminate the spawned process; no process-tree management, retry, or cleanup orchestration is introduced.
- The runtime does not parse or interpret CLI responses.
- No production Adapter consumes the runtime yet.

### Validation Summary

- Targeted Sprint 21 validation passed: 3 files, 12 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 41 files, 232 tests.

### Deviations

No architectural deviations.

---

## Sprint 20 — Execution Pipeline Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 20 Execution Pipeline Integration vertical slice. This sprint certifies the complete execution pipeline using existing public Kernel service contracts and the deterministic Mock Adapter from Sprint 19.

Implemented scope:

- Added `test/integration/execution-pipeline-integration.integration.test.ts`.
- Certified Task readiness through `ExecutionStrategyService.evaluateAssignmentReadiness`.
- Certified Role Assignment integration and Role resolution through the existing `RoleService`.
- Certified Adapter Registry lookup and explicit Mock Adapter dispatch through `AdapterService`.
- Certified successful `AdapterResponse` handling, deterministic Mock Adapter execution failure handling, attribution metadata, and diagnostics.
- Reused existing diagnostics for missing Role Assignment, missing Adapter, and unsupported Adapter capability.

Out of scope and not implemented:

- Production provider integrations, process execution, authentication, network communication, streaming, retry/timeout policies, telemetry, metrics, observability, VS Code Host integration, and `COPILOT_INSTRUCTIONS.md`.
- Adapter selection, routing, prioritization, capability scoring, provider preference, fallback adapters, or any automatic selection policy.
- New Execution State, Execution Session, RoleAssignment business rules, MissionPlan/Task lifecycle changes, aggregates, repositories, Domain Events, or production Adapter implementations.
- A new `ExecutionStrategyService` coordination method; public-service composition was sufficient to express the authorized pipeline.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model.

Referenced RFCs:

- RFC-0008 — Kernel Adapter Contract.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Complete execution pipeline integration through public service contracts.
- Execution Strategy readiness evaluation as advisory/evaluative coordination.
- Role Assignment resolution without modifying the Sprint 8 model.
- Explicit Adapter dispatch through the existing Adapter Registry and Mock Adapter.
- Successful and failed execution-result handling using the existing `AdapterResponse` contract.
- Deterministic pipeline diagnostics.

Deferred Concepts:

- Production provider integrations and runtime infrastructure.
- Adapter Selection Policy / routing / prioritization.
- Full RFC-0004 Execution State set, Execution Session, and Review-gated execution progression.
- Host integration, Builder Runtime, and live provider execution.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0010-execution-strategy.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/sprints/sprint-0020-execution-pipeline-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Public-service composition is the correct Sprint 20 implementation because existing `RoleService`, `ExecutionStrategyService`, and `AdapterService` contracts already express the authorized pipeline.
- Explicit `adapterId` dispatch satisfies the Sprint 20 Critical Guardrail without introducing Adapter selection policy.
- A test-only limited-capability Adapter used to exercise an existing unsupported-capability diagnostic does not introduce a production Adapter or new runtime capability.

### Known Limitations

- The certified pipeline executes only against deterministic in-process Adapter behavior.
- Adapter Registry and dispatch remain in-memory and process-local.
- Context Package handling remains reference-only.
- Execution Strategy remains advisory/evaluative and does not gate `MissionExecutionService`.

### Validation Summary

- Targeted Sprint 20 validation passed: 1 file, 3 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 38 files, 220 tests.

### Deviations

No architectural deviations.

---

## Sprint 19 — Mock Adapter Runtime Integration

### Implemented Slice

Implemented the Milestone 4 Sprint 19 Mock Adapter Runtime Integration vertical slice. This sprint introduces the first concrete Adapter implementation while preserving the RFC-0008 Adapter Contract and RFC-0010 Kernel boundaries.

Implemented scope:

- Added `src/adapters/mock/mock-adapter.ts`.
- Implemented `MockAdapter` as a deterministic, stateless, in-process Adapter implementation.
- Declared static Adapter capabilities using the existing Adapter Framework vocabulary.
- Added deterministic request handling and immutable `AdapterResponse` generation with diagnostics and attribution metadata.
- Added composition-time Adapter registration through `createKernelServices` using Adapter contracts, without introducing a Kernel dependency on concrete Adapter implementations.
- Added Adapter discovery through `AdapterService.enumerateAdapters`.
- Added unit and integration tests covering Mock Adapter metadata, deterministic responses, failure diagnostics, registry discovery, and runtime dispatch through Kernel service composition.

Out of scope and not implemented:

- GitHub Copilot, Claude, Gemini, Codex, OpenAI, or any production provider integration.
- Process execution, CLI invocation, network communication, authentication, streaming, retry policies, timeout policies, resource management, telemetry, metrics, or observability.
- Adapter lifecycle management beyond the existing value object, dynamic capability negotiation, multi-adapter routing, adapter prioritization, load balancing, or fallback adapters.
- Event subscribers/consumers, Shared Reality expansion, Review Engine enhancements, Knowledge enhancements, Context Package production/consumption beyond the existing reference-only field, VS Code Host integration, new aggregates, repositories, business rules, lifecycle transitions, or Domain Events outside the Adapter domain.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract.

Referenced RFCs:

- RFC-0004 — Execution Model.
- RFC-0010 — Kernel Boundaries.

Implemented Concepts:

- Mock Adapter contract implementation.
- Adapter registration with the existing `AdapterRegistry`.
- Adapter discovery through `AdapterService`.
- Static Adapter capability declaration.
- Deterministic Adapter request handling.
- Immutable Adapter response generation.
- Deterministic Adapter diagnostics.
- Runtime dispatch through `AdapterService.dispatch` and Kernel service composition.

Deferred Concepts:

- Production provider integrations.
- Runtime features including process execution, authentication, retry logic, streaming responses, timeout policies, resource management, telemetry, metrics, and observability.
- Adapter evolution features including dynamic capability negotiation, multi-adapter routing, prioritization, load balancing, fallback adapters, and lifecycle management beyond the existing value object.
- Host integration, event subscribers/consumers, and Context Package production/consumption beyond the existing reference-only field.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/implementation/sprints/sprint-0007-adapter-framework.md`.
- `knowledge/implementation/sprints/sprint-0019-mock-adapter-runtime-integration.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- A concrete Adapter implementation belongs outside `src/kernel`; Kernel composition may receive Adapter contract implementations without importing concrete Adapter implementation modules.
- The Mock Adapter validates runtime integration through deterministic simulation only and does not establish production provider behavior.
- Context Package handling remains the existing Sprint 7 reference-only field.

### Known Limitations

- The Mock Adapter is an in-process simulation and does not execute external tools or contact AI providers.
- Adapter registration remains in-memory and process-local.
- Failure diagnostics are deterministic Adapter responses for Mock Adapter-owned request handling failures; existing registry and service diagnostics remain responsible for missing adapters, duplicate registration, unsupported capabilities, and incompatible protocol versions.

### Validation Summary

- Targeted Sprint 19 validation passed: 4 files, 9 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 37 files, 217 tests.

### Deviations

No architectural deviations.

---

## Sprint 18 — RFC-0010 Kernel Boundary Certification

### Implemented Slice

Implemented the Milestone 3 Sprint 18 RFC-0010 Kernel Boundary Certification validation-only slice. This sprint certifies architectural boundary conformance for the composed Kernel baseline implemented through Sprints 1–17; it introduces no new normative concepts, production capabilities, runtime behavior, lifecycle semantics, repositories, aggregate responsibilities, or Domain Events.

Implemented scope:

- Added `test/integration/kernel-boundary-certification.integration.test.ts`.
- Certified `createKernelServices` composes every currently implemented Kernel bounded-context service and initializes them through the Kernel lifecycle.
- Certified successful composed-Kernel behavior through public service contracts across Mission, Mission Planning, Task execution, Evidence, Shared Reality projection, Review, Knowledge, Role assignment, Execution Strategy readiness, Domain Event publication, repository coordination, and dependency injection.
- Certified deterministic rejection of invalid cross-boundary interactions: cross-Mission Execution Strategy evaluation, missing Adapter dispatch targets, and mismatched Domain Event Mission attribution.
- Certified rejected boundary interactions publish no unintended Domain Events and preserve observable repository state.
- Certified Kernel source dependency boundaries with a static integration assertion that `src/kernel` source files do not import outside `src/kernel`.

Out of scope and not implemented:

- Event subscribers, event handlers, event orchestration, and event consumers.
- Adapter runtime implementations, Mock Adapter, AI provider integrations, and VS Code host integration.
- Workflow automation, Context Package, Policy Engine, Durable Event Streams, persistent infrastructure, new aggregates, new repositories, new business rules, new lifecycle transitions, new Domain Events, RFC amendments, or Kernel Canon amendments.

### RFC Coverage

Primary RFC:

- RFC-0010 — Kernel Boundaries.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0003 — Shared Reality Projection Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.
- RFC-0008 — Kernel Adapter Contract (contract validation only).
- RFC-0009 — Host Contract (boundary validation only).

Implemented Concepts:

- RFC-0010 boundary certification for currently implemented Kernel bounded contexts.
- Successful composed-Kernel public-contract validation.
- Deterministic boundary-violation rejection with no unintended EventBus or repository side effects.
- Kernel source dependency boundary validation.

Deferred Concepts:

- Event subscribers, event handlers, event orchestration, and event consumers.
- Adapter implementations, Mock Adapter, AI provider integrations, VS Code host integration, workflow automation, Context Package, Policy Engine, Durable Event Streams, and persistent infrastructure.
- New aggregates, repositories, business rules, lifecycle transitions, Domain Events, RFC amendments, and Kernel Canon amendments.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0010-kernel-boundaries.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/specifications/rfc-0009-host-contract.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0018-rfc-0010-kernel-boundary-certification.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 18 certifies existing approved behavior only; it does not expand RFC semantics or introduce new enforcement mechanisms.
- Repository contracts and the Kernel-owned EventBus are approved public contracts for validating composed behavior and rejected side effects.
- Static dependency validation is limited to currently implemented Kernel TypeScript source files.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- Certification is limited to currently implemented bounded contexts and does not certify deferred runtime capabilities.
- No event consumer is introduced; tests observe the EventBus and public repository-backed service results directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 18 boundary certification tests passed: 1 file, 4 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 35 files, 212 tests.

### Deviations

No architectural deviations.

---

## Sprint 17 — Cross-Domain Failure-Path Integration Validation

### Implemented Slice

Implemented the Milestone 3 Sprint 17 failure-path integration-validation slice. This sprint validates previously implemented Kernel bounded contexts using the actual composed services from `createKernelServices`; it introduces no new normative concepts.

Implemented scope:

- Added `test/integration/kernel-failure-paths.integration.test.ts`.
- Exercised all eight authorized rejection scenarios through `Kernel` + `createKernelServices` and public service contracts.
- Validated deterministic rejection for Task dependency violation, premature Mission completion, duplicate MissionPlan registration, duplicate Review registration, invalid Knowledge capture, missing Evidence, invalid Review completion, and terminal Mission planning.
- Validated side-effect behavior: rejected operations do not publish unintended Domain Events and preserve observable aggregate/repository state.
- Validated subsequent valid operations continue to succeed after each rejection path.
- Remediated `NEXUS-REV-2026-07-13-015-F-001` per `NEXUS-RAT-2026-07-13-009`: restored the Sprint 9 `ReviewService` orchestration-only baseline and replaced Scenario 4 with duplicate Review registration, an already-approved Review repository rejection path.

Out of scope and not implemented:

- New bounded contexts, provider integrations, adapter runtimes, VS Code host integration, Context Package, Policy Engine, durable Event Streams, event subscriptions, persistent storage, production infrastructure, observability/telemetry, retry policies, or distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the eight authorized scenarios.

### RFC Coverage

Primary RFC:

- None. Sprint 17 introduces no new normative concepts.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.

Implemented Concepts:

- Cross-domain failure-path integration validation.
- Side-effect verification for rejected operations.
- Public-contract validation through composed Kernel services.
- Duplicate Review registration rejection through approved Sprint 9 Review repository behavior.

Deferred Concepts:

- AI Providers, Adapter runtime implementations, VS Code host integration.
- Context Package and Policy Engine.
- Durable Event Streams and event subscriptions.
- Persistent storage, production infrastructure, observability/telemetry, retry policies, and distributed execution.
- Exhaustive combinatorial failure-path coverage beyond the authorized eight scenarios.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/interface-contracts/review-service-contract.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-009.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/sprints/sprint-0017-cross-domain-failure-path-integration-validation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 17 validates rejection behavior and approved contracts only; it does not expand RFC semantics.
- `ReviewService` remains orchestration-only and has no Mission repository dependency or Mission lifecycle precondition.
- Scenario 4's replacement exercises only approved Sprint 9 Review-domain behavior.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- Failure-path coverage is limited to the eight authorized scenarios.
- No event consumer is introduced; tests observe the EventBus directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 17 integration and related regression tests passed: 3 files, 14 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 34 files, 208 tests.

### Deviations

Initial Sprint 17 delivery introduced an unauthorized Mission-Completed precondition on `ReviewService.startReview` (`NEXUS-REV-2026-07-13-015-F-001`), exceeding the sprint's validation-only scope and creating a Critical Architectural Violation. That deviation was corrected within Sprint 17 per `NEXUS-RAT-2026-07-13-009` by restoring the Sprint 9 `ReviewService` baseline and replacing Scenario 4 with duplicate Review registration; the correction was verified by `NEXUS-REV-2026-07-13-016`.

---

## Sprint 16 — End-to-End Mission Workflow Integration Validation

### Implemented Slice

Implemented the Milestone 3 Sprint 16 integration-validation slice. This sprint validates previously implemented Kernel bounded contexts using the actual composed services from `createKernelServices`; it introduces no new normative concepts.

Implemented scope:

- Added an end-to-end integration test in `test/integration/kernel-mission-workflow.integration.test.ts`.
- Exercised the composed Kernel through `Kernel` service-factory wiring and the Kernel-owned `EventBusContract`.
- Validated the complete public-contract workflow: Create Mission → Create Mission Plan → Create Tasks → Execute Tasks → Complete Mission → Perform Review → Capture Knowledge.
- Validated shared repository coordination across `MissionService`, `MissionPlanningService`, `MissionExecutionService`, `ProjectionService`, `ReviewService`, `EvidenceService`, and `KnowledgeService`.
- Validated Domain Event ordering across the participating implemented domains.
- Validated Knowledge capture preconditions against real composed state: completed Mission, accepted completed Review, and stored supporting Evidence.
- Corrected an integration-discovered RFC-0005 defect in Review event publication: `ReviewCompleted` and outcome-specific `ReviewAccepted`/`ReviewRejected` events now use distinct Domain Event identities.

Out of scope and not implemented:

- New bounded contexts, provider integrations, adapter runtimes, VS Code host integration, workflow automation, durable Event Streams, event subscriptions, persistent storage, Context Package, Policy Engine, or production infrastructure.
- Exhaustive failure-path integration coverage beyond the authorized happy-path workflow.

### RFC Coverage

Primary RFC:

- None. Sprint 16 introduces no new normative concepts.

Referenced RFCs:

- RFC-0001 — Mission Model.
- RFC-0002 — Evidence Model.
- RFC-0003 — Shared Reality Projection Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0006 — Engineering Assessment Model.
- RFC-0007 — Knowledge Model.

Implemented Concepts:

- End-to-end composed service validation.
- Dependency-injection and shared EventBus validation.
- Shared repository interaction validation.
- Aggregate interaction validation through public service contracts.
- Domain Event ordering and event identity validation.
- Cross-domain Knowledge capture invariant validation.

Deferred Concepts:

- Claude CLI integration, GitHub Copilot integration, Gemini integration, Codex integration.
- Provider implementations and Adapter runtime implementations.
- VS Code host integration.
- Workflow engine, automatic sprint generation, and automatic governance orchestration.
- Context Package and Policy Engine.
- Durable Event Streams and event subscriptions.
- Persistent storage, production infrastructure, distributed execution, and background processing.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/implementation/milestone-2-completion-report.md`.
- `knowledge/implementation/repository-readiness-assessment.md`.
- `knowledge/implementation/sprints/sprint-0016-end-to-end-mission-workflow-integration-validation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Sprint 16 validates composition and approved behavior only; it does not expand RFC semantics.
- `ProjectionService` remains active-Mission scoped, so Shared Reality projection is exercised before Mission completion.
- Review remains a separate implemented assessment aggregate; Sprint 16 validates Knowledge capture after a completed accepted Review without adding review-gated Mission completion behavior.
- The Review event identity correction is an implementation defect fix under RFC-0005's existing requirement that every Domain Event has a globally unique immutable identity.

### Known Limitations

- Repository and EventBus persistence remain in-memory and process-local.
- The integration test validates one happy-path workflow, not exhaustive cross-domain failure paths.
- No event consumer is introduced; the test observes the EventBus directly.
- Event publication remains save-then-publish and non-atomic, consistent with prior approved slices.

### Validation Summary

- Targeted Sprint 16 and Review event identity tests passed: 3 files, 15 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 33 files, 200 tests.

### Deviations

No architectural deviations.

---

## Sprint 15 — Mission Plan & Task Event Publication

### Implemented Slice

Implemented the RFC-0005/RFC-0001 Mission Plan & Task Event Publication vertical slice authorized by NEXUS-RAT-2026-07-13-006.

Implemented scope:

- `MissionPlanCreated`, `MissionPlanRevised`, and `TaskCreated` event definitions and factories in `mission-planning.events.ts`.
- `TaskStarted`, `TaskCompleted`, and `TaskCancelled` event definitions and factories in `mission-execution.events.ts`.
- `MissionPlan` and `Task` aggregate recorded-events collections with drain-once `pullDomainEvents()`.
- `MissionPlanningService` optional constructor-injected `EventBusContract` and post-persistence publication for `createMissionPlan`, `addTask`, and `reviseMissionPlan`.
- `MissionExecutionService` post-persistence publication for existing `startTask`, `completeTask`, and `cancelTask` operations using its existing required `EventBusContract`.
- Kernel service composition wiring so `MissionPlanningService` receives the shared Kernel EventBus.
- Reference-document corrections to `knowledge/reference/kernel-state-machine.md` and `knowledge/reference/kernel-event-catalog.md` per NEXUS-RAT-2026-07-13-006.

Out of scope and not implemented:

- `MissionPlanActivated` publication or MissionPlan status/activation lifecycle.
- `TaskReady`, `TaskAssigned`, and `TaskBlocked` publication.
- `updateTask` / `removeTask` event publication.
- Event subscriptions, consumers, handlers, or event-driven Mission Plan/Task behavior.
- Knowledge, Shared Reality, Context Package, Policy, or durable Event Stream implementation.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0001 — Mission Model (Referenced; existing MissionPlan and Task lifecycle operations only).

Ratification:

- NEXUS-RAT-2026-07-13-006 — authorizes Mission Plan/Task event producer reattribution to `MissionPlanningService` and `MissionExecutionService`, Task Lifecycle reference reconciliation, and Mission Plan/Task catalog duplicate removal while preserving Sprint 3/4 frozen behavior.

Implemented Concepts:

- Mission Plan event factories and aggregate recorded-events publication.
- Task event factories and aggregate recorded-events publication.
- Save-then-publish service orchestration for exactly six authorized events.
- EventBus injection for MissionPlanningService.
- Reference-document producer and lifecycle reconciliation.

Deferred Concepts:

- `MissionPlanActivated`.
- `TaskReady`, `TaskAssigned`, and `TaskBlocked`.
- `TaskUpdated` / `TaskRemoved`-equivalent events.
- Event subscriptions and consumers.
- Knowledge, Shared Reality, Context Package, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-006.
- `knowledge/implementation/sprints/sprint-0015-mission-plan-task-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Mission Plan and Task events are notifications of already-completed, successfully persisted state transitions.
- `MissionPlanningService.updateTask` and `.removeTask` remain event-silent because no ratified canonical event name exists for those operations.
- Task lifecycle reference documentation follows the frozen implementation `TaskStatus` vocabulary (`Planned`, `Ready`, `InProgress`, `Completed`, `Cancelled`) without modifying the `TaskStatus` enum or transition rules.
- Save-then-publish follows the established Mission/Evidence/Review/Knowledge pattern and remains service orchestration rather than aggregate persistence behavior.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted MissionPlan/Task state ahead of the process-local event stream.
- No event consumers are added; published MissionPlan/Task events do not trigger domain behavior.
- `MissionPlanActivated` remains unpublishable because no MissionPlan activation operation exists.
- `updateTask` and `removeTask` remain event-silent pending future ratification.

### Test Summary

- Targeted Sprint 15 Mission tests passed: 4 files, 39 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 199 tests.

### Deviations

No architectural deviations.

---

## Sprint 14 — Knowledge Lifecycle Advancement

### Implemented Slice

Implemented the RFC-0005/RFC-0007 Knowledge Lifecycle Advancement vertical slice authorized by NEXUS-RAT-2026-07-13-005.

Implemented scope:

- `KnowledgeService.approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge`.
- Minimal `{ knowledgeId }` lifecycle request shape on `KnowledgeServiceContract`.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` event factories.
- Save-then-publish service orchestration for all four lifecycle-advancement events.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-005.

Out of scope and not implemented:

- Successor-reference modeling for superseded Knowledge.
- Authorization, policy evaluation, governance workflow, or approval automation.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Context Assembly consumption of Knowledge.
- Durable Event Streams.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0007 — Knowledge Model (Referenced; existing Memory Lifecycle exercised without semantic change).

Ratification:

- NEXUS-RAT-2026-07-13-005 — authorizes the four Knowledge lifecycle-advancement service operations and corresponding Domain Events, while preserving existing aggregate lifecycle rules and deferring successor modeling, authorization/policy enforcement, and event consumers.

Implemented Concepts:

- Knowledge lifecycle-advancement service operations.
- Knowledge lifecycle Domain Event factories.
- KnowledgeService lifecycle EventBus publication after successful persistence.

Deferred Concepts:

- Successor-reference modeling.
- Authorization, policy, and governance workflow enforcement.
- Event subscriptions and consumers.
- Context Assembly consumption.
- Mission Plan Events, Task Events, Execution Strategy Events, Shared Reality Events, Context Package Events, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/reference/interface-contracts/knowledge-service-contract.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entries NEXUS-RAT-2026-07-13-003, NEXUS-RAT-2026-07-13-004, and NEXUS-RAT-2026-07-13-005.
- `knowledge/implementation/sprints/sprint-0014-knowledge-lifecycle-advancement.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `KnowledgeService` remains thin orchestration; lifecycle legality remains owned by the `Knowledge` aggregate.
- Lifecycle aggregate methods remain parameterless and unmodified per the Sprint Governance Constraint; lifecycle event factories are invoked by `KnowledgeService` only after successful persistence.
- Knowledge lifecycle events are notifications of already-completed, successfully persisted state transitions.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted Knowledge state ahead of the process-local event stream.
- No successor-reference link exists between a superseded Knowledge item and any replacement.
- No event consumers are added; published Knowledge lifecycle events do not trigger domain behavior.
- No authorization or policy enforcement gates who may call lifecycle-advancement operations.

### Test Summary

- Targeted Sprint 14 Knowledge lifecycle tests passed: 2 files, 23 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 192 tests.

### Deviations

No architectural deviations.

---

## Sprint 13 — Knowledge Event Publication

### Implemented Slice

Implemented the RFC-0005 Knowledge Event Publication vertical slice authorized by NEXUS-RAT-2026-07-13-004.

Implemented scope:

- `KnowledgeCandidateCreated` event publication for completed `captureKnowledge` transitions.
- `KnowledgeRevisionCreated` event publication for completed `reviseKnowledge` transitions.
- `knowledge.events.ts` with Knowledge event type definitions and RFC-0005 envelope-compliant event factories.
- `Knowledge` aggregate recorded-event support through drain-once `pullDomainEvents()`.
- `KnowledgeService` optional constructor-injected `EventBusContract` with deterministic unavailable-publisher diagnostics.
- Save-then-publish service orchestration for Knowledge events; persistence failure prevents publication.
- Kernel service composition updated so `KnowledgeService` receives the shared Kernel-owned EventBus.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-004.

Out of scope and not implemented:

- `approveKnowledge`, `activateKnowledge`, `supersedeKnowledge`, and `archiveKnowledge` service operations.
- `KnowledgeAccepted`, `KnowledgePublished`, `KnowledgeSuperseded`, and `KnowledgeArchived` publication.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Durable Event Streams.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFC:

- RFC-0007 — Knowledge Model (Referenced; event trigger only).

Ratification:

- NEXUS-RAT-2026-07-13-004 — ratifies `KnowledgeCandidateCreated` and `KnowledgeRevisionCreated` for Sprint 13, defers lifecycle-advancement operations and events, and establishes that Domain Events represent completed domain facts rather than implementation actions.

Implemented Concepts:

- Knowledge Domain Event factories.
- Knowledge aggregate recorded-events collection and drain-once access.
- KnowledgeService EventBus publication after successful persistence.
- Kernel composition EventBus injection for KnowledgeService.

Deferred Concepts:

- Knowledge lifecycle-advancement service operations and their events.
- Event subscriptions and consumers.
- Mission Plan Events, Task Events, Execution Strategy Events, Shared Reality Events, Context Package Events, and Policy Events.
- Durable/persistent Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-004.
- `knowledge/implementation/sprints/sprint-0013-knowledge-event-publication.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Knowledge events are notifications of already-completed, successfully persisted state transitions.
- Knowledge always carries Mission identity, so Knowledge events use the standard Mission-scoped `DomainEvent` envelope.
- Save-then-publish follows the existing Mission/Evidence/Review event publication pattern.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish remains non-atomic; a publication failure after successful persistence can leave persisted Knowledge state ahead of the process-local event stream.
- No event consumers are added; published Knowledge events do not trigger domain behavior.
- Knowledge lifecycle states beyond `Candidate` remain reachable only through existing aggregate methods, not through KnowledgeService operations.

### Test Summary

- Targeted Sprint 13 Knowledge event tests passed: 2 files, 18 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 187 tests.

### Deviations

No architectural deviations.

---

## Sprint 12 — Knowledge Foundation

### Implemented Slice

Implemented the RFC-0007 Knowledge Foundation vertical slice under the `Knowledge` implementation vocabulary ratified by NEXUS-RAT-2026-07-13-003.

Implemented scope:

- `Knowledge` aggregate with immutable `KnowledgeId`, Mission and Mission Plan Revision attribution, summary, `KnowledgeScope`, `KnowledgeStatus`, supporting Evidence references, supporting Review reference, contributing Domain Event references, approving authority, provenance, and append-only revision history.
- `KnowledgeId`, `KnowledgeStatus`, `KnowledgeScope`, `KnowledgeAttribution`, and `KnowledgeProvenance` value objects.
- `KnowledgeStatus` lifecycle: `Candidate → Approved → Active → Superseded → Archived`; `Archived` is terminal.
- Aggregate-owned Knowledge capture precondition validation: supporting Review exists; supporting Review is `Completed`; supporting Review outcome is `Accepted` or `Accepted With Observations`; supporting Evidence exists; originating Mission is `Completed`; approval metadata is present.
- Memory Evolution through `Knowledge.revise`, producing new immutable Knowledge instances with preserved identity, attribution, provenance, and prior revisions.
- `IKnowledgeRepository` and `InMemoryKnowledgeRepository` process-local snapshot persistence.
- `KnowledgeService` thin orchestration for capture, revision, retrieval, and enumeration using constructor-injected repository contracts.
- Kernel service composition updated so `KnowledgeService` receives the Knowledge repository plus the shared Mission, Evidence, and Review repositories.
- Reference-document corrections authorized by NEXUS-RAT-2026-07-13-003.

Out of scope and not implemented:

- Knowledge event publication.
- Reconciliation of the three existing Knowledge/Memory event-name sets.
- Event subscriptions, consumers, handlers, or event-driven Knowledge workflows.
- Context Assembly consumption of Knowledge.
- Policy-driven capture criteria beyond the five deterministic capture preconditions.
- Human Authority approval workflow automation beyond recording `approvingAuthority`.
- Adapter invocation or AI Provider integration.
- Search, indexing, durable persistence, or multi-source Knowledge synthesis.

### RFC Coverage

Primary RFC:

- RFC-0007 — Knowledge Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model (Referenced; supporting Evidence lineage).
- RFC-0006 — Engineering Assessment Model (Referenced; supporting accepted Review outcome).
- RFC-0001 — Mission Model (Referenced; Mission and Mission Plan Revision attribution and completed Mission state).

Ratification:

- NEXUS-RAT-2026-07-13-003 — ratifies `Knowledge` as the canonical implementation-layer vocabulary for RFC-0007 Engineering Memory and authorizes the Sprint 12 reference-document corrections.

Implemented Concepts:

- Knowledge aggregate.
- Knowledge identity.
- Knowledge status lifecycle.
- Knowledge scope.
- Knowledge provenance.
- Knowledge attribution.
- Knowledge capture.
- Knowledge revision/evolution.
- Knowledge repository contract and in-memory repository.
- Knowledge service orchestration.

Deferred Concepts:

- Knowledge event publication and event-name reconciliation.
- Event subscriptions and consumers.
- Context Assembly consumption.
- Governance/policy-driven capture criteria.
- Human approval workflow automation.
- Adapter/AI Provider integration.
- Search, indexing, durable persistence, and multi-source synthesis.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0007-knowledge-model.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/interface-contracts/knowledge-service-contract.md`.
- `knowledge/reference/service-catalog/knowledge-service.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-003.
- `knowledge/implementation/sprints/sprint-0012-knowledge-foundation.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- `KnowledgeService` retrieves Mission, Evidence, and Review aggregate state from existing repositories and passes that context into `Knowledge.capture`; capture precondition decisions remain aggregate-owned.
- Required Mission work completion is represented by the existing Sprint 4 Mission lifecycle state `Completed`; no new Mission or Task concept is introduced.
- `contributingEventIds` are recorded as attribution data only; no Knowledge event publication or event consumption is introduced.
- Revisions preserve the original Knowledge attribution and provenance for this foundation slice.

### Limitations

- Repository persistence remains in-memory and process-local.
- Knowledge lifecycle transitions and revisions publish no events and are observable only through direct service calls or repository retrieval.
- `KnowledgeService` does not subscribe to Review events or approval events.
- Knowledge models one supporting Review per item.
- Approval authority is recorded as data only; no approval command, workflow, role check, or UI is implemented.
- Search, indexing, durable persistence, Context Assembly consumption, Adapter integration, and AI Provider integration remain deferred.

### Test Summary

- Targeted Knowledge tests passed: 4 files, 19 tests.
- TypeScript compile passed.
- ESLint passed.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 32 files, 182 tests.

### Deviations

No architectural deviations.

---

## Sprint 11 — Domain Event Publication (Evidence, Review)

### Implemented Slice

Implemented the RFC-0005 Domain Event Publication vertical slice for the Evidence and Review domains.

Implemented scope:

- Optional `missionId` contextual association on `RegisterEvidenceRequest`, `EvidenceSnapshot`, and the `Evidence` aggregate as authorized by NEXUS-RAT-2026-07-13-001.
- `EvidenceCaptured` event factory and Evidence aggregate recorded-events collection with `pullDomainEvents()`.
- EvidenceService EventBus publication after successful Evidence repository registration.
- `ReviewStarted`, `FindingCreated`, `ReviewCompleted`, `ReviewAccepted`, and `ReviewRejected` event factories.
- Review aggregate recorded-events collection with `pullDomainEvents()`.
- ReviewService EventBus publication after successful Review repository persistence.
- Outcome-conditional Review publication: Accepted and Accepted With Observations publish `ReviewAccepted`; Rejected publishes `ReviewRejected`; Action Required publishes only `ReviewCompleted`.
- Kernel service composition updated so EvidenceService and ReviewService receive the Kernel-owned EventBus.
- EventBus support for the ratified Mission-independent EvidenceCaptured partial-conformance case through an Evidence-specific event publication variant where `missionId` is omitted.
- Shared `DomainEvent` and `DomainEventAttribution` contracts restored to required `missionId` per NEXUS-RAT-2026-07-13-002.

Out of scope and not implemented:

- Execution Strategy event publication.
- `EvidenceAccepted` and `EvidenceRejected`.
- `FindingAccepted`, `FindingResolved`, and `FindingDismissed`.
- Mission Plan Events and Task Events.
- Knowledge Events, Shared Reality Events, Context Package Events, and Policy Events.
- Event subscription/consumption by other services.
- Durable/persistent Event Streams.
- Event-driven domain behavior, reactions, gates, commands, or workflow automation.

### RFC Coverage

Primary RFC:

- RFC-0005 — Domain Event Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model (Referenced; optional `missionId` extension authorized by NEXUS-RAT-2026-07-13-001).
- RFC-0006 — Engineering Assessment Model (Referenced; event trigger only).

Implemented Concepts:

- EvidenceCaptured.
- ReviewStarted.
- ReviewCompleted.
- ReviewAccepted.
- ReviewRejected.
- FindingCreated.
- Aggregate recorded-events collections and `pullDomainEvents()` for Evidence and Review.
- Service-level EventBus publication for EvidenceService and ReviewService.

Deferred Concepts:

- Execution Strategy event publication.
- Evidence acceptance/rejection events.
- Finding acceptance/resolution/dismissal events.
- Mission Plan and Task events.
- Knowledge, Shared Reality, Context Package, and Policy events.
- Event consumers and durable Event Streams.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0005-domain-event-model.md`.
- `knowledge/implementation/sprints/sprint-0011-domain-event-publication.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-001.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-13-002.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- Events are notifications of completed facts only; no consumer, handler, command, gate, or workflow reaction is introduced.
- Evidence remains Mission-independent; `missionId` is an optional contextual association only.
- The shared Kernel `DomainEvent` contract remains Mission-scoped with required `missionId`; only the Evidence-specific publication variant permits Mission-independent omission.
- Review events are Mission-scoped because Review already owns a Mission identity reference.
- EvidenceService and ReviewService follow the existing MissionService save-then-publish pattern.

### Limitations

- EventBus persistence remains in-memory and process-local.
- Save-then-publish is non-atomic for Evidence and Review, matching the disclosed Mission limitation.
- EvidenceCaptured events for Evidence without Mission context omit `missionId`, as authorized by NEXUS-RAT-2026-07-13-001.
- Mission-independent EvidenceCaptured events are not retrievable through `EventBusContract.replay()`, because replay remains scoped to a required Mission stream identifier.
- Review event causality does not chain across repository round trips because Review snapshots do not own a latest-event identity field in this slice.

### Test Summary

- Targeted Evidence/Review/EventBus tests passed: 9 files, 52 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 28 files, 163 tests.

### Deviations

Initial Sprint 11 delivery exceeded NEXUS-RAT-2026-07-13-001's Authorized Builder Scope by making the shared Kernel `DomainEvent` / `DomainEventAttribution` contract's `missionId` optional Kernel-wide. That deviation was corrected within Sprint 11 per NEXUS-RAT-2026-07-13-002 by restoring required `missionId` on the shared contract and confining Mission-independent omission to the Evidence-specific event publication variant.

---

## Sprint 10 — Execution Strategy

### Implemented Slice

Implemented the RFC-0004 Execution Strategy vertical slice.

Implemented scope:

- `ExecutionStrategy` aggregate with immutable `ExecutionStrategyId`, Mission reference, dependency-ordering rule, concurrency rule, and deterministic readiness evaluation.
- Dependency-ordering validation for existing Sprint 8 `RoleAssignment` readiness against MissionPlan Task Graph dependencies, including direct and transitive dependencies.
- `IExecutionStrategyRepository` and `InMemoryExecutionStrategyRepository` process-local persistence for ExecutionStrategies.
- `ExecutionStrategyService` orchestration for creating ExecutionStrategies, retrieving and enumerating strategies, and evaluating assigned Task readiness through constructor-injected repository contracts.
- Kernel service composition updated so `ExecutionStrategyService` shares the existing in-memory `RoleAssignmentRepository` used by `RoleService`.
- Deterministic Execution Strategy diagnostics for invalid definitions, duplicate strategies, duplicate Mission strategy ownership, missing strategy references, missing RoleAssignments, missing MissionPlans, missing Tasks, and unsatisfied dependency ordering.

Out of scope and not implemented:

- Execution State enum or state machine.
- Execution Session.
- Review gating of execution progression.
- Adapter invocation or Adapter selection.
- AI Providers and provider coordination.
- Runtime scheduling or actual parallel/concurrent execution.
- Governance.
- Assignment Policy elements beyond dependency ordering.
- Human Authority operations.
- Event Bus integration.
- Full explainability records beyond deterministic validation diagnostics.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Implemented Concepts:

- ExecutionStrategy.
- ExecutionStrategyId.
- Assignment dependency-ordering preservation for RoleAssignment readiness.
- ExecutionStrategyService.
- IExecutionStrategyRepository.
- InMemoryExecutionStrategyRepository.

Deferred Concepts:

- Execution State.
- Execution Session.
- Review requirements enforcement / RFC-0006 Review gating.
- Adapter invocation and Adapter selection.
- AI Providers and provider coordination.
- Actual parallel/concurrent execution runtime.
- Governance.
- Assignment Policy elements beyond dependency ordering.
- Human Authority operations.
- Event Bus integration.
- Full explainability records.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/sprints/sprint-0010-execution-strategy.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-12-007.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.

### Architectural Assumptions

- ExecutionStrategy references Mission, MissionPlan Tasks, and RoleAssignments by identity and published repository contracts; it does not own or mutate those aggregates.
- Dependency-ordering readiness is advisory/evaluative in this slice and does not gate or trigger Task execution.
- The concurrency rule is deterministic policy data only; no scheduler, executor, or runtime concurrency behavior is introduced.
- ExecutionStrategyService remains orchestration-only and delegates dependency-ordering behavior to the ExecutionStrategy aggregate.

### Limitations

- ExecutionStrategy persistence is in-memory and process-local.
- Readiness evaluation depends on existing MissionPlan Task statuses and RoleAssignment records.
- ExecutionStrategy evaluations do not publish domain events.

### Test Summary

- Targeted Sprint 10 execution tests passed: 6 files, 22 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 28 files, 156 tests.

### Deviations

No architectural deviations.

---

## Sprint 9 — Review Foundation

### Implemented Slice

Implemented the RFC-0006 Review Foundation vertical slice using the ratified Review implementation vocabulary from NEXUS-RAT-2026-07-12-006.

Implemented scope:

- `Review` aggregate with immutable `ReviewId`, Mission reference, MissionPlan revision reference, explicit `ReviewCriteria`, consumed Evidence references, `ReviewStatus`, completion-only `ReviewOutcome`, and owned Finding collection.
- `Finding` entity with immutable `FindingId`, owning `ReviewId`, `Severity`, optional `FindingCategory` for actionable Findings, summary, description, supporting Evidence references, affected artifact references, criteria references, and `FindingStatus`.
- `ReviewStatus` lifecycle validation for Pending → In Progress → Completed.
- `FindingStatus` lifecycle validation for Created → Accepted / Resolved / Dismissed.
- `ReviewOutcome` value object supporting Accepted, Accepted With Observations, Action Required, and Rejected.
- `ReviewCriteria`, `Severity`, `FindingCategory`, `ReviewId`, and `FindingId` value objects with deterministic validation.
- `IReviewRepository` and `InMemoryReviewRepository` process-local snapshot persistence for Reviews and Findings.
- `ReviewService` orchestration for start Review, publish Finding, finalize Review outcome, retrieve Review, enumerate Reviews, and enumerate Findings through constructor-injected repository contracts.
- Kernel service composition updated to inject a shared in-memory Review repository into `ReviewService`.
- Deterministic Review diagnostics for invalid definitions, invalid lifecycle transitions, duplicate Reviews, duplicate Findings, missing Evidence references, missing Reviews, rejected completion, and invalid Finding transitions.

Out of scope and not implemented:

- AI review execution.
- Claude Reviewer and Copilot Reviewer.
- Adapter invocation from Review.
- Event Bus integration and Review/Finding event publication.
- Governance decisions and policy evaluation.
- Multi-Assessment-Session Reviews.
- Actionable Finding to Mission Plan revision / Mission Evolution wiring.
- Human Authority approve, reject, override, or Override-as-Evidence operations.
- Execution Session consumption.
- Produced artifacts becoming Knowledge.
- Workflow automation and repository state transitions outside Review/Finding lifecycle state.
- Sensitive Finding access control.

### RFC Coverage

Primary RFC:

- RFC-0006 — Engineering Assessment Model (Partial).

Implemented Concepts:

- Review / Engineering Assessment Session.
- ReviewCriteria / Assessment Criteria.
- Finding / Assessment Finding.
- Severity / Finding Severity.
- FindingCategory / Finding Intent for actionable Findings.
- Observation as a Finding without FindingCategory.
- ReviewOutcome / Assessment Outcome.
- ReviewStatus and FindingStatus as implementation-layer operational lifecycle concepts ratified by NEXUS-RAT-2026-07-12-006.
- ReviewService.
- InMemoryReviewRepository.

Deferred Concepts:

- AI/provider execution and Adapter invocation.
- Event Bus integration.
- Governance and policy-driven Assessment Criteria selection.
- Multi-session Reviews.
- Mission Plan revision or Mission Evolution caused by Actionable Findings.
- Human Authority operations and overrides as Evidence.
- Execution Session consumption.
- Shared Reality Projection consumption as an Assessment input.
- Produced Artifacts consumption as an Assessment input.
- Assessment Outcome reasoning-chain capture (RFC-0006 § Explainability).
- Knowledge capture from accepted assessment artifacts.
- Workflow automation and repository state transitions.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0006-engineering-assessment-model.md`.
- `knowledge/implementation/sprints/sprint-0009-review-foundation.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-state-machine.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/interface-contracts/review-service-contract.md`.
- `knowledge/reference/service-catalog/review-service.md`.
- `knowledge/governance/RATIFICATION_LEDGER.md` entry NEXUS-RAT-2026-07-12-006.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.
- `knowledge/.github/copilot-instructions.md`.

### Architectural Assumptions

- Mission identity, MissionPlan revision identity, Evidence references, affected artifact references, and criteria references are stored as immutable references; Review does not access or own foreign aggregate internals.
- `ReviewOutcome` is supplied through `finalizeReviewOutcome` and validated/assigned by the Review aggregate during completion; no undocumented policy heuristic determines outcomes in this slice.
- A Finding with `FindingCategory` is actionable; a Finding without `FindingCategory` is an Observation.
- ReviewService remains orchestration-only and does not validate business rules outside aggregate/repository coordination.

### Limitations

- Review persistence is in-memory and process-local.
- Review and Finding lifecycle transitions do not publish domain events.
- Reviews are recorded through direct ReviewService calls only; no provider, adapter, scheduler, workflow, or policy engine is invoked.
- Review stores consumed Evidence references but does not validate Evidence existence through the Evidence repository in this slice.
- Review models exactly one Assessment Session.

### Test Summary

- Targeted Sprint 9 Review tests passed: 4 files, 17 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 25 files, 147 tests.

### Deviations

No architectural deviations.

---

## Sprint 8 — Execution Roles

### Implemented Slice

Implemented the RFC-0004 Execution Roles vertical slice.

Implemented scope:

- `ExecutionRole` immutable domain model with RoleId, name, description, category, metadata, deterministic equality, and snapshots.
- `RoleMetadata` immutable value object with deterministic attribute normalization and validation.
- Built-in provider-independent Kernel roles: Builder and Reviewer.
- `RoleAssignment` immutable Task-to-ExecutionRole relationship with assignment metadata.
- `RoleRegistry` contract and `InMemoryRoleRegistry` for deterministic role registration, retrieval, enumeration, and duplicate prevention.
- `RoleAssignmentRepository` contract and `InMemoryRoleAssignmentRepository` for process-local assignment persistence and duplicate task-assignment prevention.
- `RoleValidation` deterministic validation diagnostics for unknown roles and duplicate task assignments.
- `RoleService` orchestration for default role registration, role lookup, role registration, assignment creation, and assignment lookup through constructor-injected contracts.
- Kernel service composition updated to include `RoleService`.

Out of scope and not implemented:

- Execution Strategy.
- Assignment dependency-ordering preservation (RFC-0004 § Assignment).
- Provider Mapping.
- Adapter Invocation.
- Review Engine.
- Governance.
- Scheduling.
- Parallel Execution.
- Adapter selection.
- Provider selection.
- Builder workflow.
- Reviewer workflow.
- Event Bus integration.

### RFC Coverage

Primary RFC:

- RFC-0004 — Execution Model (Partial).

Implemented Concepts:

- ExecutionRole.
- RoleAssignment.
- RoleRegistry.
- RoleMetadata.
- RoleValidation.
- RoleService.

Deferred Concepts:

- Execution Strategy.
- Assignment dependency-ordering preservation (RFC-0004 § Assignment).
- Provider Mapping.
- Adapter Invocation.
- Review Engine.
- Governance.
- Scheduling.
- Parallel Execution.
- Adapter selection and provider selection.
- Builder and Reviewer workflows.
- Event Bus integration.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0004-execution-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- Role category is modeled as deterministic text because RFC-0004 does not define a category enumeration.
- RoleAssignment represents the RFC-0004 Task-to-ExecutionRole relationship by Task identity and Role identity without accessing Task aggregate internals.
- RoleService default role registration is orchestration; role uniqueness remains owned by RoleRegistry.

### Limitations

- Registered roles and role assignments are process-local and in-memory.
- RoleAssignment does not select adapters, select providers, invoke adapters, schedule work, or execute workflows.
- RoleService does not publish events because Event Bus integration is deferred.

### Test Summary

- Targeted Sprint 8 execution-role tests passed: 3 files, 13 tests.
- Full repository validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 21 files, 130 tests.

### Deviations

No architectural deviations.

---

## Sprint 7 — Adapter Framework

### Implemented Slice

Implemented the RFC-0008 Adapter Framework vertical slice.

Implemented scope:

- `Adapter` contract defining the minimum implementation-independent adapter interface.
- `AdapterId`, `AdapterName`, `AdapterVersion`, and `ProtocolVersion` immutable value objects.
- `AdapterMetadata` immutable metadata containing adapter identity, version, protocol version, declared capabilities, supported engineering role names, lifecycle, and attributes.
- `AdapterCapability` immutable technical capability value object for CodeGeneration, CodeModification, StaticAnalysis, DocumentationGeneration, and TestGeneration.
- `AdapterLifecycle` immutable lifecycle value object with deterministic transitions through Registered, Available, Active, Completed, and Unavailable.
- `AdapterRequest` immutable execution request containing Engineering Role name, Task Identifier, Context Package Reference, Execution Constraints, and Request Metadata.
- `AdapterResponse` immutable execution outcome containing status, diagnostics, produced artifacts, findings, and execution metadata.
- `AdapterRegistry` contract and `InMemoryAdapterRegistry` for deterministic registration, unregistration, lookup, discovery, and duplicate validation.
- `AdapterService` for orchestration-only registry lookup, protocol compatibility validation, capability validation, and request dispatch.
- Deterministic adapter diagnostics for duplicate registration, adapter not found, unsupported capability, invalid lifecycle transition, incompatible protocol version, invalid definitions, invalid requests, and invalid responses.
- Kernel service composition updated so AdapterService is registered with an empty in-memory AdapterRegistry.

Out of scope and not implemented:

- AI Providers.
- Copilot Adapter.
- Claude Adapter.
- Gemini Adapter.
- Codex Adapter.
- Human Adapter.
- Execution Roles.
- Execution Strategy.
- Builder.
- Reviewer.
- Review Engine.
- Shared Reality enhancements.
- Context Assembly.
- Knowledge.
- Governance.
- AdapterRequest applicable-policies element pending Kernel policy concepts.
- Event Bus integration.
- Provider configuration.
- Retry policies.
- Adapter security policies.

### RFC Coverage

Primary RFC:

- RFC-0008 — Kernel Adapter Contract (Partial).

Implemented Concepts:

- Adapter contract.
- AdapterRegistry.
- AdapterRequest.
- AdapterResponse.
- AdapterMetadata.
- AdapterCapability.
- Adapter lifecycle.
- AdapterService.

Deferred Concepts:

- AI Providers.
- Provider-specific adapters.
- Human Adapter.
- Execution Roles and Execution Strategy.
- Review Engine, Builder, and Reviewer.
- Shared Reality expansion and Context Assembly.
- Knowledge and Governance.
- AdapterRequest applicable-policies element pending Kernel policy concepts.
- Event Bus integration.
- Provider configuration, retry policies, and Adapter security policies.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- Engineering Roles are Kernel-assigned role-name strings in this slice; the Adapter Framework declares role support but does not define, enumerate, or own Execution Roles.
- Context Package handling is limited to an immutable reference string; Context Assembly and Shared Reality expansion remain deferred.
- AdapterService compatibility checks for protocol version and declared capability are contract orchestration, not business-rule ownership.
- Adapter lifecycle validation is local and deterministic; lifecycle observability through Event Bus integration remains deferred.

### Limitations

- No provider adapters are implemented.
- Registry persistence is in-memory and process-local.
- AdapterResponse produced artifacts and findings are immutable references/strings and are not promoted to Evidence.
- AdapterRequest applicable policies are not modeled because Kernel policy concepts are not implemented in this slice.
- AdapterService does not retry requests, configure providers, enforce security policy, publish events, or assemble context.

### Test Summary

- Targeted Adapter Framework tests passed: 3 files, 11 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 18 files, 117 tests.

### Deviations

No architectural deviations.

### Governance Notes

- Sprint Owner authorized persisting the Sprint 7 specification and activating `builder-task.md` from the inline Sprint 7 work order on 2026-07-12T19:57:09.375+08:00 before implementation began.

---

## Sprint 6 — Shared Reality Foundation

### Implemented Slice

Implemented the RFC-0003 Shared Reality Foundation vertical slice.

Implemented scope:

- `SharedReality` immutable read model for the computed engineering understanding of an active Mission.
- `ProjectionService` for deterministic projection orchestration through injected Mission and Evidence repository contracts.
- `ProjectionResult` immutable result exposing Projection Version, Active Mission, Mission Plan, Mission Execution State, Evidence References, and Projection Metadata.
- `ProjectionVersion` immutable value object generated deterministically from stable projection inputs.
- Context aggregation by Evidence type and Evidence source.
- Deterministic projection diagnostics for missing Mission, inactive Mission, missing MissionPlan, missing Evidence, empty Evidence sets, duplicate Evidence references, inconsistent Evidence versions, unsupported Evidence types, and internal context consistency.
- Kernel service composition updated so ProjectionService receives the shared in-memory Mission repository and Evidence repository.

Out of scope and not implemented:

- Context Assembly.
- AI Context Packaging and prompt construction.
- Provider Context.
- Adapter Framework.
- Execution Roles.
- Review Engine.
- Knowledge.
- Governance.
- Event Bus integration.
- Incremental projections.
- Projection caching.
- Projection persistence and persistence optimization.
- Search and indexing.

### RFC Coverage

Primary RFC:

- RFC-0003 — Shared Reality Projection Model (Partial).

Referenced RFCs:

- RFC-0002 — Evidence Model.
- RFC-0001 — Mission Model.

Implemented Concepts:

- Shared Reality.
- Projection.
- Projection Version.
- Context aggregation for the foundation slice.
- Projection validation.

Deferred Concepts:

- Context Assembly.
- Context Package / AI Context Packaging.
- Provider Context.
- Adapter Framework.
- Execution Roles.
- Review Engine.
- Knowledge.
- Governance.
- Event Bus integration.
- Incremental projections.
- Projection caching.
- Projection Scope (full scope declaration).
- Projection Freshness / stale projection invalidation.
- Projection persistence.
- Search and indexing.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/specifications/rfc-0003-shared-reality-projection-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- The active Evidence set for this foundation slice is either the explicitly requested Evidence references or all Evidence returned by the injected Evidence repository when no references are supplied.
- Evidence authority resolution, conflict resolution, policy application, and freshness invalidation remain deferred; ProjectionService does not approximate those concepts.
- Mission execution state is projected from existing Mission status and MissionPlan Task statuses; Shared Reality does not own or mutate execution state.
- Projection metadata is intentionally deterministic and excludes wall-clock generation timestamps.

### Limitations

- Repository persistence remains in-memory and process-local.
- ProjectionService does not cache, persist, incrementally update, or publish projections.
- Context aggregation is limited to deterministic grouping of Evidence references by type and source.
- Projection validation rejects empty Evidence sets because Shared Reality must be computed from Evidence.
- Unsupported Evidence type rejection is defensive for repository-contract consumers; the current Evidence aggregate already restricts registered Evidence to supported Sprint 5 types.

### Test Summary

- Targeted Shared Reality tests passed: 1 file, 8 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 15 files, 106 tests.

### Deviations

No architectural deviations.

### Review Remediation

- TASK-001 — Recorded Projection Scope and Projection Freshness as deferred Sprint 6 concepts in the Implementation Manifest, Sprint 6 record, Implementation Plan, and Implementation Report.
- TASK-002 — Reconciled the NEXUS-RAT-2026-07-12-002 canonical RFC-0003 contract surface by removing the duplicate `projection.contract.ts` request/service placeholders, removing the obsolete `SharedRealityService` alias, removing legacy Shared Reality placeholder interfaces, and updating placeholder consumers to use the canonical `SharedRealitySnapshot` type.

### Governance Notes

- Sprint 6 implementation proceeded using the human-authorized inline Sprint 6 request as the active Sprint Specification and Builder Work Order because `builder-task.md` remained closed for Sprint 5 and no persisted Sprint 6 sprint specification existed before implementation.
- NEXUS-RAT-2026-07-12-004 — Sprint Owner acknowledged and ratified the Sprint 6 concurrent-Sprint-Specification deviation and established the mandatory Sprint 7+ specification-first workflow.

---

## Sprint 5 — Evidence Foundation

### Implemented Slice

Implemented the RFC-0002 Evidence Foundation vertical slice.

Implemented scope:

- `Evidence` aggregate with immutable identity, type, version, hash, metadata, and provenance.
- `EvidenceId`, `EvidenceType`, `EvidenceSource`, `EvidenceVersion`, and `EvidenceHash` value objects with validation and equality semantics.
- `EvidenceMetadata` and `Provenance` immutable domain objects.
- `IEvidenceRepository` and `InMemoryEvidenceRepository` for process-local registration, retrieval, existence checks, and enumeration.
- `EvidenceService` for thin orchestration over Evidence registration, validation, retrieval, and enumeration using constructor-injected repository contracts.
- Deterministic domain diagnostics: `DuplicateEvidenceException`, `InvalidEvidenceException`, and `EvidenceNotFoundException`.
- Kernel service composition updated so EvidenceService receives an injected in-memory Evidence repository.

Out of scope and not implemented:

- Shared Reality.
- Context Assembly.
- Projection.
- Knowledge.
- Review and Review Findings.
- Event Bus expansion.
- Domain Events.
- Execution Strategy and Execution Roles.
- Provider Adapters.
- AI Providers.
- Indexing and Search.
- Durable persistence engines.
- Evidence relationships.
- Evidence conflict resolution.
- Evidence authority set resolution.
- Evidence confidence policy enforcement.

### RFC Coverage

Primary RFC:

- RFC-0002 — Evidence Model (Partial).

Ratification:

- NEXUS-RAT-2026-07-12-001 — Sprint Owner ratified the Sprint 5 retroactive Sprint Specification as a recoverable governance deviation with no architecture or implementation impact.

Implemented Concepts:

- Evidence aggregate.
- Evidence Identity.
- Evidence Provenance.
- Evidence Version.
- Evidence registration.
- Evidence validation.
- Deterministic Evidence retrieval.
- Append-only in-memory registration semantics.

Deferred Concepts:

- Evidence Relationships.
- Evidence Conflict.
- Evidence Authority resolution.
- Evidence Confidence policy enforcement.
- Shared Reality projection from Evidence.
- Durable append-only Evidence persistence.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0002-evidence-model.md`.
- `knowledge/reference/interface-contracts/evidence-service-contract.md`.
- `knowledge/reference/service-catalog/evidence-service.md`.
- `knowledge/reference/kernel-data-model.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- EvidenceType support is limited to the RFC-0002 example evidence categories needed to validate this foundation slice: repository source code, architecture documents, ADRs, accepted mission outcomes, approved repository policies, build outputs, static analysis results, test results, and human-approved decisions.
- Evidence registration is append-only for this slice; corrections create additional Evidence instances and versions rather than mutating registered Evidence.
- Duplicate EvidenceId detection is coordinated by EvidenceService before repository registration; InMemoryEvidenceRepository also protects its storage contract from accidental overwrite.
- Evidence confidence classification and authority policies remain deferred even though RFC-0002 owns them.

### Limitations

- Repository persistence is in-memory and process-local.
- Evidence relationships and conflict resolution are intentionally absent.
- Evidence authority set resolution is intentionally absent.
- No indexing, search, durable storage, provider adapters, or event publication were introduced.
- Evidence hash validation requires a non-empty integrity token but does not mandate a specific hashing algorithm because RFC-0002 does not prescribe one for this slice.

### Test Summary

- Targeted Evidence tests passed: 4 files, 16 tests.
- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 14 files, 98 tests.

### Deviations

No architectural deviations.

### Review Remediation

- TASK-001 — Reconciled `evidence.contract.ts` with the repository capability contract convention by converting it to a barrel export of the implemented Evidence types, aggregate, repository, diagnostics, and service surface.
- TASK-002 — Removed the unreachable source-consistency branch from `EvidenceService.validateEvidence`.
- TASK-004 — Added Evidence Confidence classification and Evidence Lifecycle progression to the Sprint 5 deferred concepts in `IMPLEMENTATION_MANIFEST.md`.
- TASK-005 — Reconciled Evidence Service reference documents with implemented operation names while keeping authority resolution and Evidence relationships deferred.
- TASK-003 — Sprint Owner ratification NEXUS-RAT-2026-07-12-001 resolved the governance dependency for the retroactive Sprint 5 Sprint Specification; the ratification citation is recorded in the Sprint 5 implementation-layer sections.

---

## Sprint 4 — Mission Execution

### Implemented Slice

Implemented deterministic Mission Execution for the RFC-0001 Mission Model vertical slice.

Implemented scope:

- `MissionExecutionService` for thin application orchestration over the existing repository contracts.
- Mission aggregate execution validation for start, complete, fail, and cancel.
- Mission completion evaluation against Task snapshots.
- Task execution operations for start, complete, and cancel.
- MissionPlan execution validation for executable plans and Task dependency satisfaction.
- In-memory repository persistence of Mission status and Task execution status through existing snapshot storage.
- Deterministic domain diagnostics for invalid transitions, dependency violations, non-executable Missions, and rejected completion.
- Kernel service registration of `MissionExecutionService` with the shared in-memory Mission repository.

Out of scope and not implemented:

- Execution Strategy.
- Builder.
- Reviewer.
- Governance.
- Provider Adapters.
- AI Providers.
- Event Bus expansion.
- Domain Event expansion.
- Shared Reality.
- Evidence.
- Knowledge.
- Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- Mission pause and resume.
- Task execution failure states.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission execution use cases.
- Task execution lifecycle.
- Mission completion evaluation.
- Execution validation.

Deferred Concepts:

- Execution Strategy and roles.
- Execution Policies.
- Provider Coordination.
- Provider/adapter execution.
- Task execution failure states deferred to RFC-0004.
- Review Engine.
- Shared Reality, Evidence, and Knowledge.
- Scheduling, parallel execution, and critical path analysis.
- Mission pause and resume pending RFC amendment candidate review.

### Architectural Assumptions

- MissionExecutionService coordinates aggregate loading, aggregate method calls, and persistence only; business rules remain inside Mission, MissionPlan, and Task.
- Mission completion requires the RFC-0001 lifecycle to permit completion and requires every Task in the MissionPlan to be `Completed`.
- Task dependency satisfaction is owned by MissionPlan because MissionPlan owns the Task Graph.
- Task lifecycle validation is owned by Task, including terminal-state immutability.

### Limitations

- Repository persistence remains in-memory and process-local.
- Task execution operations do not publish Task-level events or invoke providers.
- Mission completion requires the Mission to be in the RFC-0001 completion-permitted lifecycle state; this sprint does not implement a Review Engine or reinterpret review semantics.
- Mission pause/resume remains unimplemented because the current RFC lifecycle does not define a `Paused` state transition.
- Task execution failure states are deferred to RFC-0004.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 10 files, 82 tests.

### Deviations

- The Task-level failure state introduced during Sprint 4 was withdrawn per Sprint Owner ratification on 2026-07-12.
- Task execution states beyond start, completion, and cancellation remain deferred to RFC-0004.

### Process Deviations

- Sprint 4 was implemented without a sprint specification conforming to `knowledge/implementation/sprint-template.md`.
- Sprint 4 implementation proceeded outside the executable scope of the governing Builder Task document.
- Sprint 4 RFC coverage was re-scoped from RFC-0004 to RFC-0001 (Partial) concurrently with implementation; the Sprint Owner ratified this re-scope on 2026-07-12.
- The Sprint Owner ratified the RFC-0001 (Partial) re-scope and authorized the retroactive Sprint 4 specification on 2026-07-12, resolving the pending TASK-006 reference.

### Ratification

- Sprint Owner ratification recorded 2026-07-12: Sprint 4 is an RFC-0001 Mission Model (Partial) slice and does not implement RFC-0004.

---

## Sprint 3 — Mission Planning Review Remediation

**Governance Note (added retroactively, NEXUS-RAT-2026-07-13-008):** `NEXUS-REV-2026-07-12-003`/`-004`, cited throughout this section, were never persisted in `REVIEW_HISTORY.md`. This sprint is recorded as a Historically Accepted Governance Deviation; no retroactive Reviewer certification is fabricated. See `knowledge/governance/RATIFICATION_LEDGER.md` § NEXUS-RAT-2026-07-13-008.

### Implemented Slice

Implemented the Sprint 3 Mission Planning remediation tasks authorized by `builder-task.md`, including the Kernel integration restoration from NEXUS-REV-2026-07-12-004.

Implemented scope:

- `MissionPlan`, `PlanRevision`, `Task`, `TaskId`, `TaskStatus`, `TaskDependency`, and `MissionPlanningService`.
- In-memory MissionPlan repository support for MissionPlans, Tasks, and Revisions.
- TASK-001 — Enforced one MissionPlan per Mission.
- TASK-002 — Made `MissionPlan.updateTask` atomic for validation failures.
- TASK-003 — Rejected planning operations for terminal Missions.
- NEXUS-REV-2026-07-12-004 TASK-001 — Restored Kernel factory registration so MissionService receives the Kernel-owned EventBus, MissionService and MissionPlanningService share one `InMemoryMissionRepository`, and MissionPlanningService is registered in the running Kernel.
- NEXUS-REV-2026-07-12-004 TASK-002 — Rejected same-status update validation on terminal Tasks as part of the authorized Task Graph invariant remediation.
- NEXUS-REV-2026-07-12-004 TASK-003 — Implemented Option A cycle validation in the MissionPlan aggregate for direct and transitive Task Graph cycles.

Out of scope and not implemented:

- Execution Strategy.
- Planning Domain Events.
- Task Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- AI-generated Plans.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph dependency validation, including duplicate prevention, self-reference rejection, direct cycle rejection, and transitive cycle rejection.
- Mission Planning Service.

Deferred Concepts:

- Execution Strategy.
- Planning Domain Events.
- Task Scheduling.
- Parallel Execution.
- Critical Path Analysis.
- Automatic Planning.
- AI-generated Plans.

### Architectural Assumptions

- Planning operations are rejected for terminal Missions (`Completed`, `Cancelled`, `Failed`).
- Non-terminal lifecycle coordination for planning operations is deferred pending explicit RFC guidance; planning remains permitted for `Draft`, `Planned`, `Ready`, `Executing`, and `Reviewing` Missions.
- The Sprint 3 slice enforces one MissionPlan per Mission without introducing active/inactive plan, archival, or replacement semantics.
- The Kernel composes MissionService and MissionPlanningService with one shared in-memory Mission repository; MissionService receives the Kernel-owned EventBus.

### Limitations

- Repository persistence is in-memory and process-local.
- Planning operations are event-silent in this slice.
- Cycle detection is limited to validation in the MissionPlan aggregate and does not introduce scheduling, execution ordering, topological sorting, or critical path analysis.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 9 files, 68 tests.

### Deviations

No architectural deviations.

---

## Sprint 2 — Mission Foundation

### Implemented Slice

Implemented the first Mission Domain vertical slice for `SPRINT-0002` under Milestone 1 — Kernel Foundation.

Implemented scope:

- `Mission` aggregate with immutable `MissionId`, immutable `MissionObjective`, lifecycle behavior, invariant enforcement, and recorded Mission domain events.
- RFC-0001 lifecycle states: `Draft`, `Planned`, `Ready`, `Executing`, `Reviewing`, `Completed`, `Cancelled`, and `Failed`.
- RFC-0001 lifecycle transitions for implemented Mission states, with terminal states preserved.
- `MissionId` value object with equality and serialization support.
- `IMissionRepository` contract with `save`, `getById`, and `exists`.
- Development-only `InMemoryMissionRepository` with serialized operations and snapshot-based retrieval.
- `MissionService` for Mission creation, lifecycle updates, repository coordination, duplicate handling, not-found handling, and publication through the existing `EventBusContract`.
- Mission domain event catalog names defined by RFC-0001.
- Explicit Mission domain exceptions for identity, objective, lifecycle transition, duplicate Mission, missing Mission, and unavailable event publisher violations.
- Unit tests covering Mission creation, lifecycle, invariants, invalid transitions, value objects, repository behavior, service lifecycle operations, event publication, and duplicate handling.

Out of scope and not implemented:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph.
- Evidence.
- Shared Reality.
- Execution Strategy.
- Event Bus implementation.
- Review Engine.
- Adapter Framework.
- Host features.
- VS Code commands.
- Tree views.

### RFC Coverage

Primary RFC:

- RFC-0001 — Mission Model.

Implemented Concepts:

- Mission.
- Mission Identity.
- Mission Objective.
- Mission Lifecycle.
- Mission Repository.
- Mission Service.
- Mission Domain Events.
- Mission Domain Exceptions.

Deferred Concepts:

- Mission Plan.
- Mission Revision.
- Task.
- Task Graph.

### Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_PLAN.md`.
- `IMPLEMENTATION_MANIFEST.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/canon/nexus-kernel-canon.md`.
- `knowledge/specifications/rfc-0001-mission-model.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `.github/copilot-instructions.md`.

### Architectural Assumptions

- RFC-0001 `Any State -> Cancelled` is implemented for non-terminal Mission states because `IMPLEMENTATION_GATE.md` requires terminal states to remain terminal.
- The existing Kernel `EventBusContract` is the publishing mechanism for MissionService; this sprint does not implement a new Event Bus.
- Mission event payloads remain minimal except for `MissionCreated`, which carries Mission identity and objective.

### Limitations

- Mission events are process-local when published through the existing in-memory EventBus.
- `MissionService` requires an `EventBusContract` before create or lifecycle operations; it rejects mutation if an event publisher is unavailable.
- `MissionService` saves Mission state before publishing recorded events; a publish failure after save can leave persisted Mission state ahead of the process-local event stream. Transactional outbox and ordering semantics are deferred until durable persistence is implemented.
- Mission Plan, Mission Revision, Task, and Task Graph are intentionally absent until a later RFC-0001 vertical slice.

### Review Remediation

- TASK-001 — `MissionService.create(objective)` is removed; `createMission(request)` remains the only Mission Service creation operation.
- TASK-002 — Mission lifecycle events preserve causality from the immediately preceding Mission event and lifecycle operations accept optional correlation IDs.
- TASK-003 — The non-atomic save/publish limitation is documented in this report.
- TASK-004 — Blocked pending human ratification; Mission reference documents were not modified.

### Test Summary

- Full validation passed: TypeScript compile, ESLint, Vitest, and esbuild.
- Vitest passed: 6 files, 43 tests.

### Deviations

No architectural deviations.

---

# Nexus Bootstrap Implementation Report

## Scope

This report covers the initial Nexus VS Code extension bootstrap slice and corrective follow-up tasks through Task-005.

Implemented scope:

- Compilable VS Code extension scaffold.
- VS Code host activation and `nexus.initializeWorkspace` command registration.
- Kernel creation, service coordination, initialization, health reporting, and shutdown.
- Placeholder Kernel services for Mission, Evidence, Shared Reality, Execution, Review, and Knowledge.
- Capability-based Kernel folder structure with cross-cutting Kernel infrastructure under `src/kernel/common/`.
- RFC-0005-aligned DomainEvent contract and hardened in-memory EventBus infrastructure.
- Terminal EventBus disposal behavior that rejects publish, subscribe, and replay after disposal.
- EventBus publication validation for the RFC-0005 Mission attribution invariant.
- Event Bus reference documentation reconciled to the implemented `replay(missionId)` contract and terminal-disposal behavior.
- Terminal Kernel disposal semantics aligned with the Kernel-owned terminal EventBus lifecycle.
- Contract deduplication and removal of speculative placeholder interfaces/directories.
- Corrected Kernel Event Catalog envelope documentation.
- Strict TypeScript, ESLint, Vitest, esbuild, and npm validation configuration.
- VS Code host command semantics and lifecycle cleanup for honest initialization reporting and single-owner disposal.

Not implemented:

- Mission Aggregate.
- Mission Repository.
- Mission execution.
- AI providers or adapters.
- Shared Reality computation.
- Review engine.
- Knowledge persistence.
- Durable event persistence.
- Telemetry.
- Storage.
- Networking.
- Git integration.
- MCP integration.
- Settings UI, webviews, or authentication.

## Referenced RFCs

- RFC-0001 — Mission Model.
- RFC-0004 — Execution Model.
- RFC-0005 — Domain Event Model.
- RFC-0008 — Kernel Adapter Contract.
- RFC-0009 — Host Contract.
- RFC-0010 — Kernel Boundaries.

## Referenced Reference Documents

- `IMPLEMENTATION_CONSTITUTION.md`.
- `IMPLEMENTATION_GATE.md`.
- `knowledge/implementation/implementation-technology-standard.md`.
- `knowledge/implementation/implementation-conventions.md`.
- `knowledge/reference/interface-contracts/event-bus-contract.md`.
- `knowledge/reference/kernel-event-catalog.md`.
- `knowledge/reference/domain-schema.md`.
- `knowledge/reference/kernel-reference-architecture.md`.
- `knowledge/reference/kernel-service-map.md`.
- `knowledge/reference/kernel-dependency-graph.md`.

## Assumptions

- In-memory EventBus replay is acceptable for the bootstrap slice because durable event persistence is outside the requested milestone.
- Placeholder services may expose only lifecycle and health behavior until their owning vertical slices implement domain behavior.
- Public capability contracts may remain even when not yet consumed internally.
- The VS Code host owns the Pino-backed adapter for `KernelLogger`; the Kernel remains independent of Pino.

## Limitations

- Event replay is process-local and is lost when the extension process exits.
- The Kernel does not yet persist Domain Events, Evidence, Knowledge, Missions, or service state.
- Placeholder services do not implement domain behavior.
- The extension registers one command and does not expose additional UI.
- The Event Catalog still contains broader event names and service naming that may require future RFC/reference reconciliation.
- The Projection Service versus Shared Reality naming conflict identified during Task-002 remains unresolved and requires human ratification before broad reference-document renaming.

## Architectural Deviations

No architectural deviations.

## Process Deviations

Tasks 005, 007, 008, and 009 were implemented beyond the authorized scope of sprint `NEXUS-SPRINT-2026-07-11-001`, which listed only Tasks 001, 002, 003, 004, and 006 for implementation. This process deviation was accepted by review `NEXUS-REV-2026-07-12-001`.

Future sprints will implement only the tasks explicitly listed in the authorized sprint scope.
