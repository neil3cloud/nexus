# Sprint 19 — Mock Adapter Runtime Integration

## Sprint Status

Current

## Sprint Objective

Implement the first concrete Adapter — a deterministic **Mock Adapter** — conforming to the certified Adapter Contract (RFC-0008), and integrate it into the composed Nexus Kernel. This sprint validates the complete Adapter runtime lifecycle using a deterministic, in-process implementation. It does not introduce AI providers.

Its purpose is to certify that the Kernel can successfully execute work through an Adapter while preserving the architectural guarantees established during Milestone 3 (Sprint 16 nominal composition, Sprint 17 failure-path composition, Sprint 18 RFC-0010 boundary certification).

## Milestone

**Milestone 4 — External Integration** (first slice).

Milestone 3 — Kernel Integration & Composition is now Complete (Sprint 16–18, all Approved with no open findings). Milestone 3's Engineering Principle constrained that milestone to validating already-implemented behavior with no new foundational domains. A concrete Adapter implementation is a new runtime capability, not composed-behavior validation of existing capability — the Sprint Owner accordingly opens Milestone 4 to house it, rather than stretching Milestone 3's validation-only scope to cover it.

## Architectural Context

The Adapter Contract, Adapter value objects, `AdapterRegistry`, and `AdapterService` were implemented and approved in Sprint 7 (Milestone 2) against an empty in-memory registry — no concrete Adapter has ever been registered or dispatched to. Sprint 19 begins the transition from internal Kernel certification to external extensibility by proving the existing Adapter Framework end-to-end with a deterministic implementation, before any production provider Adapter (e.g., GitHub Copilot CLI) is attempted in a future sprint.

## RFC Coverage

Primary:

- RFC-0008 — Kernel Adapter Contract

Referenced:

- RFC-0004 — Execution Model
- RFC-0010 — Kernel Boundaries

## Ratification References

- `NEXUS-RAT-2026-07-13-010` — establishes `COPILOT_INSTRUCTIONS.md` as a planned, optional, future Provider Integration artifact, deferred until the repository's first production AI provider integration sprint; its absence is not a documentation defect, governance deviation, or repository readiness blocker for Sprint 19.

Sprint 19's scope, including the Milestone 3 → Milestone 4 transition, was otherwise approved directly by Sprint Owner decision during `/nexus-plan` (2026-07-13); no other governance ambiguity requiring a Sprint Owner Ratification was identified during planning.

## Architectural Responsibilities

**Kernel owns:** Mission lifecycle, Execution Strategy, Role Assignment, Adapter discovery, Adapter selection, Request creation, Response consumption, Attribution, Diagnostics. The Kernel SHALL remain the sole owner of engineering orchestration.

**Adapter owns:** Contract implementation, Request handling, Response production, Capability declaration, Adapter diagnostics. The Adapter SHALL remain stateless.

**Mock Adapter SHALL:** simulate deterministic execution; produce predictable responses; never invoke external processes; never access AI providers; never modify Kernel behavior. Its purpose is architectural validation, not feature delivery.

## Authorized Scope

Implement only:

- `MockAdapter` (and a `MockAdapterFactory`, if required by existing construction conventions)
- Adapter registration with the existing (Sprint 7) `AdapterRegistry`
- Adapter discovery through the existing `AdapterService`
- Capability declaration (static, using RFC-0008's existing capability vocabulary — e.g. Source Code Generation, Documentation Generation)
- `AdapterRequest` handling (validation using the existing `AdapterRequest` contract)
- `AdapterResponse` generation (using the existing `AdapterResponse` contract)
- Adapter diagnostics, using existing diagnostic patterns
- Runtime dispatch through the existing `AdapterService.dispatch` and Kernel composition (`createKernelServices`)
- Unit and integration tests

## Explicitly Out of Scope

The Builder SHALL NOT implement:

- GitHub Copilot Adapter, Claude Adapter, Gemini Adapter, Codex Adapter, or any OpenAI/production provider integration
- Process execution, CLI invocation, network communication, authentication
- Streaming responses, retry policies, timeout policies, resource management
- Telemetry, metrics, observability
- Event consumers/subscribers of any kind
- Shared Reality expansion, Review Engine enhancements, Knowledge enhancements
- Context Package production/consumption beyond the existing Sprint 7 reference-only `contextPackageReference` field
- Adapter lifecycle management beyond the existing Sprint 7 `AdapterLifecycle` value object, dynamic capability negotiation, multi-adapter routing, adapter prioritization, load balancing, or fallback adapters
- VS Code Host integration, commands, UI integration, workspace services
- Any new aggregate, repository, business rule, lifecycle transition, or Domain Event outside the Adapter domain

If a task cannot be completed without one of the above, implementation SHALL stop and the gap SHALL be reported rather than filled by assumption.

## Implemented Concepts (Authorized Tasks)

- **TASK-001 — Mock Adapter.** The first concrete Adapter implementing the existing Adapter Contract; stateless; deterministic; repeatable execution. Acceptance: Adapter Contract implemented, deterministic behavior, unit tested.
- **TASK-002 — Adapter Registration.** Register the Mock Adapter with the existing `AdapterRegistry`, preserving the existing runtime architecture. Acceptance: registration succeeds; registry discovery succeeds; duplicate registration rejected (existing diagnostic); unit tested.
- **TASK-003 — Capability Declaration.** Declare supported, static Adapter capabilities using RFC-0008's existing capability vocabulary. Acceptance: capabilities discoverable; immutable declarations; unit tested.
- **TASK-004 — Adapter Request Handling.** Deterministic request validation and rejection of invalid requests; the Adapter SHALL NOT interpret repository state independently. Acceptance: request validation; deterministic responses; error handling; unit tested.
- **TASK-005 — Adapter Response.** Immutable `AdapterResponse` generation including execution status, diagnostics, metadata, and attribution. Acceptance: immutable response; attribution preserved; unit tested.
- **TASK-006 — Runtime Integration.** End-to-end dispatch: `AdapterService` → `AdapterRegistry` → `MockAdapter` → `AdapterResponse`, with the Kernel remaining the orchestration owner. Acceptance: runtime dispatch succeeds; execution deterministic; architecture preserved; integration tested.
- **TASK-007 — Diagnostics.** Deterministic diagnostics for adapter-not-registered, unsupported capability, invalid request, execution failure, and duplicate registration (reusing existing Sprint 7 diagnostics where they already exist). Acceptance: meaningful diagnostics; deterministic failures; unit tested.
- **TASK-008 — Documentation.** Update `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_MANIFEST.md`, `IMPLEMENTATION_REPORT.md`, and this Sprint Implementation Record with implemented capabilities, RFC coverage, deferred concepts, architectural decisions, diagnostics summary, validation summary, and test summary.

## Deferred Concepts

- Provider integrations: GitHub Copilot CLI, Claude CLI, Gemini CLI, Codex CLI, OpenAI APIs
- Runtime features: process execution, authentication, retry logic, streaming responses, timeout policies, resource management, telemetry, metrics, observability
- Adapter evolution: adapter lifecycle management beyond the existing value object, dynamic capability negotiation, multi-adapter routing, adapter prioritization, load balancing, fallback adapters
- Host integration: VS Code extension host, commands, UI integration, workspace services
- Event subscribers/consumers of any kind
- Context Package production/consumption (beyond the existing reference-only field)

## Acceptance Criteria

Sprint 19 SHALL demonstrate:

- successful Adapter registration;
- capability discovery;
- deterministic request handling;
- deterministic response generation;
- runtime dispatch through Kernel services;
- preservation of the Adapter Contract;
- preservation of RFC-0010 Kernel boundaries;
- repository-wide validation (`npm run validate`);
- comprehensive unit and integration tests;
- a fully functional Mock Adapter that the Adapter Registry successfully discovers and the Kernel executes requests through, returning deterministic responses;
- no unauthorized provider-specific behavior.

## Builder Responsibilities

- Read, in order: `IMPLEMENTATION_CONSTITUTION.md`, `IMPLEMENTATION_PLAN.md` § Milestone 4 / Sprint 19, `IMPLEMENTATION_MANIFEST.md` § Milestone 4 / Sprint 19, `knowledge/canon/nexus-kernel-canon.md`, `knowledge/specifications/rfc-0008-kernel-adapter-contract.md`, `knowledge/specifications/rfc-0004-execution-model.md`, `knowledge/specifications/rfc-0010-kernel-boundaries.md`, the Sprint 7 record and existing Adapter domain source (`src/kernel/adapter/`) as the established contract baseline, `knowledge/implementation/implementation-technology-standard.md`, `knowledge/implementation/implementation-conventions.md`.

  **Note:** the Sprint Owner's original scope draft also named `COPILOT_INSTRUCTIONS.md` as required reading. Per `NEXUS-RAT-2026-07-13-010`, that file is a planned, optional, future Provider Integration artifact whose creation is intentionally deferred until the repository's first production AI provider integration sprint; it does not exist yet, its absence is not a documentation defect, and it is correctly omitted from Sprint 19's required reading.
- Implement only the concepts listed under Authorized Scope / Implemented Concepts (TASK-001 through TASK-008) above.
- Preserve every Deferred Concept without approximation.
- Do not modify any other domain's aggregate business rules or lifecycle transitions. The Mock Adapter SHALL remain stateless per RFC-0008 and SHALL NOT own Mission, Mission Plan, Evidence, Shared Reality, Domain Events, Engineering Assessment, or Engineering Memory.
- Report any additional undocumented concept, terminology gap, or specification conflict rather than guessing; stop and request ratification if one is found.
- Produce the Sprint 19 section of `IMPLEMENTATION_REPORT.md` upon completion.
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

- The Mock Adapter is a deterministic, in-process simulation; it proves the runtime pipeline, not real AI-provider behavior.
- Adapter Registry/dispatch remain in-memory and process-local, consistent with every domain since Sprint 1.
- Context Package handling remains reference-only, unchanged from Sprint 7 — no Context Package production or real consumption is introduced.
- No event consumer is introduced.

## Expected Outcome

Upon successful completion, Nexus will have its first executable Adapter runtime: the Kernel will be capable of executing work through a certified Adapter implementation while remaining completely provider-agnostic. This establishes the runtime foundation for a future sprint in which the Mock Adapter can be complemented or replaced by a first production Adapter implementation (e.g., GitHub Copilot CLI) without requiring architectural changes.

## Builder Results

Pending.

## Test Summary

Pending.

## Reviewer Notes

**Status**

Pending

## Review Summary

Pending.

## Findings

Pending.

## Required Actions

Pending.

## Final Disposition

Pending.
