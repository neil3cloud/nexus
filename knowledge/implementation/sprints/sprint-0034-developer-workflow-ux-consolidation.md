# Sprint 34 — Developer Workflow UX Consolidation

**Status:** Approved (`NEXUS-REV-2026-07-14-010`).

---

## Objective

Consolidate the Developer Workflow's user experience around the provider-neutral entry point Sprint 33 already established (`nexus.runDeveloperMissionWorkflowWithConfiguredAdapter`), by promoting its discoverability, naming, and documentation as the recommended default. This Sprint is documentation, metadata, and presentation scope only. It does not introduce, modify, or extend any runtime or architectural capability — the Host → explicit `adapterId` → Execution Pipeline architecture certified through Sprint 33 is consumed unchanged.

The original candidate framing for this slice ("Sprint 34 — Unified Developer Workflow," architecturally merging the three provider-specific commands into one) was evaluated during `/nexus-plan` and found to already be satisfied by Sprint 33's `HostAdapterConfigurationResolver` / `HostConfiguredMissionWorkflow` (`src/hosts/vscode/host-adapter-configuration.ts`). A literal reading requiring removal of the three existing commands would violate `NEXUS-RAT-2026-07-14-007`'s freeze and `IMPLEMENTATION_CONSTITUTION.md` § Approved Vertical Slice Immutability. `NEXUS-RAT-2026-07-14-009` resolves this by re-scoping Sprint 34 to UX consolidation only, deferring any command removal/deprecation to a future, separately-ratified sprint.

---

## RFC Coverage

- No Primary RFC — documentation/presentation-only slice.
- Referenced: RFC-0009 — Host Contract (the Developer Workflow this Sprint presents, unmodified).

Sprint 34 introduces no new normative concept in any RFC.

---

## Ratification References

- `NEXUS-RAT-2026-07-14-009` — governs this Sprint's entire scope: title, authorized presentation/documentation surface, the binding decision that command consolidation (removal/deprecation) is deferred, authorized Builder scope, and scope restrictions.
- `NEXUS-RAT-2026-07-14-007` — governs the Sprint 33 architecture this Sprint promotes; unmodified, and its freeze on the three existing commands remains fully binding.
- `NEXUS-RAT-2026-07-13-011` — explicit-`adapterId`-only dispatch remains unaffected.

---

## Preserved Architecture (binding, unchanged)

```text
Developer → nexus.runDeveloperMissionWorkflowWithConfiguredAdapter →
HostAdapterConfigurationResolver.resolveDeveloperWorkflowAdapterId() →
HostConfiguredMissionWorkflow.runDeveloperMissionWorkflow() →
[Sprint 25/26/27 certified Execution Pipeline, unchanged] →
Host presents completion result
```

This Sprint changes no code path in this diagram. It changes only how the entry command is named, described, and documented, and how the three provider-specific commands are described as compatibility alternatives.

---

## Authorized Vertical Slice

- `package.json` `contributes.commands`: update the `title`/`category` (and, where the VS Code contribution schema supports it, ordering) of `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` so it reads as the primary "Run Developer Workflow" entry point; update the three existing commands' titles only to the extent needed to describe them as explicit provider-specific alternatives (identifiers unchanged).
- README / user-facing documentation: describe `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` plus `nexus.developerWorkflow.defaultAdapterId` configuration as the recommended default workflow; describe the Gemini/Codex/Mock explicit commands as compatibility entry points for when a developer wants to bypass configuration for one run.
- Optional: command `enablement`/description metadata clarifications supported by the existing VS Code contribution model.
- Test coverage asserting `package.json` command metadata (titles/labels) reflects the new presentation, without touching dispatch-behavior tests.

---

## Deferred Concepts

- Removal, deprecation, renaming, or aliasing of any existing command identifier.
- Any change to `HostAdapterConfigurationResolver`, `HostConfiguredMissionWorkflow`, or `HostMissionWorkflowCommandRegistration` registration/dispatch logic.
- Adapter Selection Policy, routing, capability scoring, automatic provider selection, or multi-adapter coordination.
- Execution Model deepening, a fourth production Adapter, authentication/credential management, `SecretStorage` integration.
- Any `src/kernel` or `src/adapters` change.

---

## Acceptance Criteria (Definition of Done)

- All four existing Developer Workflow commands (`nexus.runDeveloperMissionWorkflow`, `...WithGeminiCli`, `...WithCodexCli`, `...WithConfiguredAdapter`) and `nexus.showMissionWorkflowHistory` retain their existing command identifiers and dispatch behavior, unmodified.
- `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` is presented (title/description/documentation) as the primary, recommended Developer Workflow entry point.
- Every Sprint 25–33 test asserting command dispatch behavior passes unmodified.
- No `src/kernel`/`src/adapters` file changes.
- Sprint 18's `src/kernel` import-graph boundary test passes unmodified.
- Repository-wide validation passes: TypeScript compile, ESLint, Vitest, esbuild.

---

## Builder Responsibilities

- Implement exactly the Authorized Vertical Slice above; do not exceed `NEXUS-RAT-2026-07-14-009`'s Authorized Builder Scope.
- Do not modify any file under `src/kernel` or `src/adapters`.
- Do not modify the registration logic in `host-mission-workflow-command-registration.ts` or `host-adapter-configuration.ts` beyond metadata/description text, if such text exists there; all dispatch logic is frozen.
- Report implementation outcome, assumptions, limitations, and any architectural deviations ("No architectural deviations." if none) in `IMPLEMENTATION_REPORT.md`, following the Sprint 33 section's format.
- Record Sprint 34's completion in `IMPLEMENTATION_PLAN.md` and `IMPLEMENTATION_MANIFEST.md` per the Constitution's Implementation Manifest requirements.

---

## Documentation Requirements

- `IMPLEMENTATION_REPORT.md` — new Sprint 34 section (Scope, Referenced RFCs, Referenced Reference Documents, Assumptions, Limitations, Architectural Deviations).
- `IMPLEMENTATION_PLAN.md` / `IMPLEMENTATION_MANIFEST.md` — status update to Implemented/Approved upon Reviewer certification.
- README or equivalent user-facing documentation reconciled to describe the consolidated UX.

---

## Known Limitations

- Four Developer Workflow commands remain registered after this Sprint; true consolidation (removing the three provider-specific commands) is explicitly deferred pending operational experience and a future superseding ratification, per `NEXUS-RAT-2026-07-14-009`.
- This Sprint does not change session-only, non-durable history behavior (Sprint 25's constraint).

---

## Reserved Sections

### Builder Results

Implemented the Sprint 34 Developer Workflow UX Consolidation slice as documentation, metadata, and presentation-only work.

- Updated `package.json` command contribution ordering and labels so `nexus.runDeveloperMissionWorkflowWithConfiguredAdapter` is presented as **Nexus: Run Developer Workflow**, the primary recommended Developer Workflow entry point.
- Labeled the Mock, Gemini CLI, and Codex CLI commands as explicit compatibility alternatives while preserving every command identifier.
- Updated the `nexus.developerWorkflow.defaultAdapterId` configuration description to identify the recommended configured-adapter command and its unchanged explicit-`adapterId` resolution.
- Updated `README.md` user guidance to describe the configured-adapter command as the recommended default and the three explicit provider commands as compatibility entry points.
- Added package metadata test coverage for command ordering, configured-adapter presentation, and compatibility command labels.

No `src/kernel`, `src/adapters`, Host adapter-configuration, configured-workflow, or command-dispatch logic was modified.

### Reviewer Notes

**Status:** PASS — see `REVIEW_HISTORY.md` § `NEXUS-REV-2026-07-14-010` for full detail.

Independently verified `git diff --stat -- src/kernel src/adapters` against `aa55d88` is empty. Confirmed `package.json`'s diff touches only `title`/`category`/`shortTitle`/ordering for the four Developer Workflow commands and the `nexus.developerWorkflow.defaultAdapterId` configuration's description text — no command identifier added, removed, or renamed. Confirmed `src/hosts/vscode/host-adapter-configuration.ts` (Sprint 33's resolver) is untouched, and that the diff present in `vscode-host.ts`/`host-mission-workflow-command-registration.ts` is Sprint 33's already-approved `HostConfiguredMissionWorkflow` wiring (matches `NEXUS-REV-2026-07-14-008`'s description verbatim), not new work introduced by this Builder pass. Confirmed README's adapter identifier references (`gemini-cli-adapter`, `codex-cli-adapter`) match the real constants in `src/adapters/gemini/gemini-cli-adapter.ts` and `src/adapters/codex/codex-cli-adapter.ts`.

Independently reran `npm run validate` (`tsc --noEmit`, ESLint, Vitest 59 files / 284 tests, esbuild) and `npm run test:extension-host:build`: all passed, matching the Builder's claimed counts exactly.

No findings recorded.

### Final Disposition

**Approved** — `NEXUS-REV-2026-07-14-010`. No Critical, Major, or Minor findings. Implementation stays entirely within `NEXUS-RAT-2026-07-14-009`'s authorized presentation/documentation scope; no runtime, dispatch, Kernel, or Adapter behavior changed.

Date: 2026-07-14

Reviewer: Reviewer AI (Claude Code)

Review Reference: `NEXUS-REV-2026-07-14-010`
