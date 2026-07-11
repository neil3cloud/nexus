# Extension Architecture

## Purpose

Describe the VS Code extension as the first host implementation rather than the platform itself.

## Scope

Covers host responsibilities and boundaries for the initial extension.

## Intended Audience

Extension authors and platform architects.

## Status

Draft

## Related Documents

- system-overview.md
- ../../src/hosts/vscode/README.md

## Host Role

The VS Code extension should provide commands, views, settings, and interaction flows while delegating engineering workflow behavior to kernel service and role contracts.

## Thin Host Expectations

The host should avoid owning Shared Reality assembly, orchestration policy, or Adapter-specific reasoning. Those concerns belong in stable kernel layers.
