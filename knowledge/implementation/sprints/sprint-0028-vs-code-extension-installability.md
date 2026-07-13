# Sprint 28 — VS Code Extension Installability

## Sprint Status

Approved with Findings (NEXUS-REV-2026-07-14-001)

## Sprint Objective

Establish Nexus as an installable, activatable, and operational VS Code extension by validating the complete provider-independent Developer Workflow inside a real VS Code Extension Host. This is a productization and host-validation vertical slice: its purpose is to prove that the architecture certified through Sprint 27 operates correctly in a real extension environment. Sprint 28 SHALL validate the existing architecture. Sprint 28 SHALL NOT extend it.

## Milestone

Milestone 5 — Production Adapter Integration (opening slice). Per `NEXUS-RAT-2026-07-14-001`, Milestone 5 begins with productization/host-validation rather than a production Adapter. Provider selection, authentication model, and `COPILOT_INSTRUCTIONS.md` activation remain explicitly deferred and unresolved, reserved for a future, dedicated Sprint after this one is independently certified.

## RFC Coverage

No Primary RFC — this is a packaging/tooling and validation-only slice; it introduces no new normative concept.

Referenced:

- RFC-0009 — Host Contract (validated inside a real Extension Host, not modified).
- RFC-0010 — Kernel Boundaries (preserved; no `src/kernel`/`src/adapters` change authorized).

## Ratification References

- `NEXUS-RAT-2026-07-14-001` — governs this sprint's entire scope: retitling/confirmation, refined Authorized Vertical Slice, the binding Extension Host Validation Boundary, the binding Packaging Scope, authorized Builder scope, and scope restrictions. This record implements that ratification; where any ambiguity arises, the Ratification Ledger entry is authoritative.
- `NEXUS-RAT-2026-07-13-013` / `NEXUS-RAT-2026-07-13-014` — govern the certified Developer Workflow (Mission → Task → Adapter → Evidence → Review → Knowledge) this sprint validates inside a real host; unaffected and unmodified.
- `NEXUS-RAT-2026-07-13-010` — `COPILOT_INSTRUCTIONS.md` remains deferred; this sprint continues using the certified `MockAdapter` exclusively.
- `NEXUS-RAT-2026-07-13-011` — Adapter Selection Policy remains deferred and unaffected.

## Critical Boundary (binding — from NEXUS-RAT-2026-07-14-001)

**Host SHALL:** remain responsible only for extension lifecycle, activation, command registration, dependency injection, workflow orchestration, presentation, and user interaction.

**Host SHALL NOT:** implement business rules, bypass Kernel services, access aggregates directly, access repositories directly, invoke adapters directly, or change execution semantics.

**Kernel remains authoritative for (unchanged):** Mission execution, Evidence, Review, Knowledge, Adapter dispatch, business rules, execution decisions. No ownership boundaries are modified by this Sprint.

## Extension Host Validation Boundary (binding)

The real Extension Host introduced by this Sprint SHALL exercise only the existing public Host entry points (registered commands). Extension-host tests SHALL validate: installation, activation, command execution, provider-independent workflow execution, and extension lifecycle — and nothing else. Extension-host tests SHALL NOT become a replacement for Kernel integration testing; Kernel integration remains owned by the existing repository validation suite (Sprint 16/17/18's integration tests, unmodified and untouched by this sprint).

## Packaging Scope (binding)

**Authorized:** local VSIX generation; local installation; Extension Development Host validation; packaging metadata completion.

**Explicitly excluded:** Visual Studio Marketplace publication; marketplace metadata validation; release automation; extension publishing. Local packaging and installation are the only deployment objectives authorized by this Sprint.

## Authorized Vertical Slice

- Complete `package.json` extension-manifest metadata required for packaging: `activationEvents`, `icon`, `repository`, `license`, `engines` verification.
- Add `.vscodeignore` to exclude source, tests, and dev tooling from the packaged VSIX.
- Add `@vscode/vsce` as a dev dependency and a local `package` script producing a `.vsix` from a clean checkout.
- Add `.vscode/launch.json` for manual Extension Development Host verification (F5), without altering `.vscode/settings.json` or `.vscode/extensions.json` beyond what is required for this purpose.
- Add `@vscode/test-electron` as a dev dependency and a new automated extension-host integration test (a distinct test target from the existing Vitest suite) that:
  - launches a real VS Code instance via `@vscode/test-electron`;
  - activates the Nexus extension;
  - verifies all currently-contributed commands are registered (`nexus.initializeWorkspace`, `nexus.discoverAdapters`, `nexus.dispatchAdapterRequest`, `nexus.showHostCapabilities`, `nexus.runDeveloperMissionWorkflow`, `nexus.showMissionWorkflowHistory`);
  - exercises `nexus.runDeveloperMissionWorkflow` end-to-end against the certified `MockAdapter` composition already wired in `extension.ts`, and asserts the workflow completes successfully.
- No `src/kernel`, `src/adapters`, or `src/hosts` business-logic file changes. No new command, capability, or workflow step.

## Explicitly Out of Scope / Deferred Concepts

**Provider Integration:** GitHub Copilot CLI Adapter, Claude CLI Adapter, Gemini CLI Adapter, Codex CLI Adapter, any production Adapter integration, Adapter Selection, provider routing.

**Security/Auth:** Authentication and credential management, OAuth, `SecretStorage` integration.

**Runtime:** Streaming responses, multi-provider execution, background execution, workflow automation.

**Distribution:** Visual Studio Marketplace publishing, marketplace metadata validation, release automation.

**`COPILOT_INSTRUCTIONS.md`:** SHALL NOT be activated or consumed; this sprint continues using the certified `MockAdapter` runtime exclusively.

**Unchanged baselines:** Every Kernel and Adapter capability approved through Sprint 27; the existing Vitest unit/integration suite (Sprint 16/17/18/20/25/26/27) remains the sole owner of Kernel-level integration validation and is not modified or duplicated by the new extension-host tests.

## Acceptance Criteria

Sprint 28 SHALL demonstrate:

- A valid `.vsix` package is produced from a clean repository via a local `package` script.
- The packaged extension installs successfully into VS Code.
- The extension activates successfully without runtime errors.
- All six currently-implemented commands register and are discoverable after activation.
- The complete provider-independent Developer Workflow executes successfully through the certified `MockAdapter`, verified by an automated `@vscode/test-electron` test running inside a real Extension Host.
- The new extension-host tests validate only installation/activation/command-execution/workflow-execution/lifecycle, per the binding Extension Host Validation Boundary — they do not duplicate or replace Kernel integration test ownership.
- No `src/kernel` or `src/adapters` file changes (`git diff --stat HEAD -- src/kernel/ src/adapters/` empty); no `src/hosts` business-logic change beyond packaging/tooling files.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, existing Vitest suite, esbuild, plus the new extension-host test target.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 5 / Sprint 28, `IMPLEMENTATION_MANIFEST.md` § Milestone 5 / Sprint 28, `knowledge/governance/RATIFICATION_LEDGER.md` § `NEXUS-RAT-2026-07-14-001` (authoritative for this sprint's scope), `knowledge/specifications/rfc-0009-host-contract.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 1, 23, 24, 25, 26, and 27 records, `package.json` and `src/extension.ts` as the files defining the current activation/command surface, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.
- Implement only the concepts listed under Authorized Vertical Slice above, honoring the Extension Host Validation Boundary and Packaging Scope exactly.
- Do not modify any existing Vitest test file's assertions about Kernel or Adapter behavior; the new extension-host test is additive and separate.
- Preserve every Deferred/Out-of-Scope item without approximation.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 28 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- Only local packaging and installation are validated; Marketplace publication and release automation remain deferred.
- Only `MockAdapter` participates; no production provider Adapter exists yet.
- Extension-host tests run in whatever VS Code version `@vscode/test-electron` downloads for CI/local execution; cross-version compatibility testing is not in scope.
- Workspace Trust validation covers the existing gating behavior only; no new trust surface is introduced.

## Expected Outcome

Upon successful completion, Nexus SHALL be installable, activatable, executable inside a real VS Code Extension Host, and capable of exercising the complete provider-independent Developer Workflow through the certified `MockAdapter`:

```text
VS Code
        ↓
Nexus Extension (packaged, installed, activated)
        ↓
Developer Workflow
        ↓
Kernel
        ↓
Execution Pipeline
        ↓
MockAdapter
        ↓
Evidence
        ↓
Review
        ↓
Knowledge
```

This establishes the first operational Nexus product while preserving the previously certified architecture. Only after independent certification of this Sprint SHALL the repository proceed to the first production Adapter implementation.

## Builder Results

Implemented Sprint 28 VS Code Extension Installability as a packaging/tooling and Extension Host validation slice.

Implemented scope:

- Completed `package.json` extension packaging metadata with command-scoped `activationEvents`, `icon`, `repository`, `license`, and existing `engines.vscode` verification.
- Added a local PNG extension icon at `assets/nexus-icon.png`.
- Added `.vscodeignore` to exclude source, tests, Extension Host test output, generated VSIX files, and development-tooling folders from the packaged VSIX.
- Added `@vscode/vsce`, `@vscode/test-electron`, a local `package` script that produces `nexus-0.0.1.vsix`, and a distinct `test:extension-host` target.
- Added `.vscode/launch.json` for manual Extension Development Host verification without modifying existing `.vscode/settings.json` or `.vscode/extensions.json`.
- Added an automated Extension Host validation suite that installs the local VSIX with the VS Code CLI, activates the Nexus extension, verifies all six contributed commands, executes `nexus.runDeveloperMissionWorkflow` end to end through the certified `MockAdapter`, and verifies session history through `nexus.showMissionWorkflowHistory`.

Preserved deferred scope:

- No production provider Adapter, Adapter Selection, provider routing, authentication, credential management, OAuth, `SecretStorage`, streaming, multi-provider execution, Marketplace publication, release automation, or `COPILOT_INSTRUCTIONS.md` activation was introduced.
- No `src/kernel`, `src/adapters`, or `src/hosts` business-logic file was modified.
- No new command, capability, workflow step, Kernel concept, Adapter concept, business rule, or execution semantic was introduced.

## Test Summary

- TypeScript compile passed.
- ESLint passed.
- Existing Vitest suite passed: 48 files, 255 tests, with the Extension Host suite excluded from Vitest and run through its distinct target.
- esbuild passed.
- Repository validation passed after rerunning a transient local-process runtime timeout.
- Local VSIX packaging passed and produced `nexus-0.0.1.vsix`.
- Extension Host validation passed using `@vscode/test-electron` with local VS Code: VSIX installation succeeded, extension activation completed, all six commands were registered, and the provider-independent Developer Workflow completed through `MockAdapter`.
- The initial `@vscode/test-electron` download path encountered a transient TLS disconnect; the test runner now honors `VSCODE_EXECUTABLE_PATH` so local validation can use an installed VS Code without changing test semantics.

## Reviewer Notes

Independent re-validation confirms every environment-independent Builder claim exactly: `tsc --noEmit`, ESLint, and `npm run build` all pass; the existing Vitest suite passes 48 files / 255 tests; `npm run package` produces a structurally correct `nexus-0.0.1.vsix` whose contents (bundled `dist/extension.js`, manifest, icon, no source/test leakage) match the Builder's reported listing precisely. `test/extension-host/suite/extension-host.test.ts` was read line-by-line and stays exactly within the ratified Extension Host Validation Boundary — activation, all six command registrations, one full Developer Workflow execution result, and history, with no Kernel-internal assertions.

I attempted to independently execute `npm run test:extension-host` against a local VS Code 1.127.0 installation and could not obtain a passing run: both the Builder's `run-tests.ts` and a minimal, Nexus-code-free canonical `@vscode/test-electron` reproduction failed identically with `Cannot find module 'vscode'`. Diagnosis (`Code.exe --version` anomalously returning a bare Node.js version string rather than a VS Code product version, on an AzureAD-joined machine) points to review-environment/endpoint-security interference with raw Electron executable launches rather than a Nexus defect, since the identical failure reproduces with zero Nexus code involved. Recorded as Observation `NEXUS-REV-2026-07-14-001-F-001` rather than certified silently or treated as a blocking defect. A second Observation (`F-002`) notes non-blocking VSIX packaging bloat (`node_modules/pino` shipped redundantly alongside the already-bundled `dist/extension.js`). `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this record are mutually consistent and accurately scoped.

## Findings

- `NEXUS-REV-2026-07-14-001-F-001` (Observation, Informational) — Extension Host test pass could not be independently reproduced in this review environment; strong evidence points to environment interference, not a code defect. No Builder action required; recommend one additional independent confirmation (e.g., CI) as due diligence.
- `NEXUS-REV-2026-07-14-001-F-002` (Observation, Minor) — `.vscodeignore` does not exclude `node_modules/**` despite full bundling, causing redundant `pino` source inclusion in the VSIX (~580 KB). No functional impact. Optional future cleanup.

## Required Actions

None blocking. Both findings are Observations (Category 6); no Builder action is required for Sprint 28 to be considered complete.

## Final Disposition

PASS WITH FINDINGS. No architectural violations detected. Sprint 28 is Approved with Findings (`NEXUS-REV-2026-07-14-001`). Per `NEXUS-RAT-2026-07-14-001`, the repository is now ready for the Sprint Owner to plan the first production Adapter implementation via `/nexus-plan`, with provider choice, authentication model, and `COPILOT_INSTRUCTIONS.md` activation still unresolved and reserved for that cycle.
