# Nexus

Nexus is a role-based AI engineering workspace for Visual Studio Code.

It improves software engineering by coordinating AI providers through explicit engineering workflows while maintaining a shared understanding of the current project.

## Core Mission

Given an engineering request, Nexus should:

1. Understand the project.
2. Assemble Shared Reality from engineering evidence.
3. Select an execution strategy.
4. Assign engineering roles.
5. Coordinate one or more AI providers.
6. Review and validate implementation.
7. Capture engineering knowledge.
8. Return control to the developer.

## Architectural Commitments

- Shared Reality is an implementation mechanism, not the product identity.
- The kernel remains small and owns mission, context, execution, review, knowledge, and execution strategy.
- Providers are replaceable execution adapters.
- Roles are stable; providers are interchangeable.
- Every feature must directly improve software engineering inside VS Code.

## Scope Boundaries

Nexus does not aim to be an autonomous AI platform, a memory operating system, a distributed multi-agent framework, or a persistent reasoning engine.

## Repository Overview

- `/knowledge` — architectural guidance, decisions, workflows, and engineering evidence
- `/src` — kernel contracts, host integration points, adapters, and implementation scaffolding
- `/tests` — reserved structure for validation layers
- `ARCHITECTURE.md` — top-level architectural orientation for contributors

## Current Status

This repository remains an architectural foundation. The current implementation is intentionally thin, but the documented contracts now align around engineering workflow coordination inside VS Code rather than platform- or capability-first expansion.

## Developer Workflow Entry Point

Use **Nexus: Run Developer Workflow** (`nexus.runDeveloperMissionWorkflowWithConfiguredAdapter`) as the recommended default command in VS Code. It reads `nexus.developerWorkflow.defaultAdapterId`, resolves that configured value to one explicit `adapterId`, and then invokes the existing certified execution pipeline unchanged.

Set `nexus.developerWorkflow.defaultAdapterId` to the adapter you want for routine Developer Workflow runs. The built-in default remains `mock-adapter`; configured environments may set it to another registered adapter such as `gemini-cli-adapter` or `codex-cli-adapter`.

Use **Nexus: Run Builder Workflow** (`nexus.runBuilderMissionWorkflow`) when the same configured adapter should execute the dedicated Builder Workflow entry point. The Host resolves `nexus.developerWorkflow.defaultAdapterId` to one explicit `adapterId`, invokes the same certified execution pipeline with explicit `roleId: 'builder'`, and labels the result with the assigned Builder role.

Use **Nexus: Run Reviewer Workflow** (`nexus.runReviewerMissionWorkflow`) when the same configured adapter should execute the dedicated Reviewer Workflow entry point. The Host resolves `nexus.developerWorkflow.defaultAdapterId` to one explicit `adapterId`, invokes the same certified execution pipeline with explicit `roleId: 'reviewer'`, and labels the result with the assigned Reviewer role.

Use **Nexus: Run Documentation Reviewer Workflow** (`nexus.runDocumentationReviewerMissionWorkflow`) when the same configured adapter should execute the dedicated Documentation Reviewer Workflow entry point. The Host resolves `nexus.developerWorkflow.defaultAdapterId` to one explicit `adapterId`, invokes the same certified execution pipeline with explicit `roleId: 'documentation-reviewer'`, and labels the result with the assigned Documentation Reviewer role.

The explicit commands remain available as compatibility entry points when a developer wants to bypass configuration for one run:

- `nexus.runDeveloperMissionWorkflow` — run with the Mock Adapter compatibility path.
- `nexus.runDeveloperMissionWorkflowWithGeminiCli` — run with Gemini CLI directly.
- `nexus.runDeveloperMissionWorkflowWithCodexCli` — run with Codex CLI directly.
