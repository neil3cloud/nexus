# Common AI Rules

These rules apply to every AI operating within the Nexus repository.

## Shared Reality First

Every action must strengthen the project's Shared Reality.

Before making any change:

- Understand the existing architecture.
- Read relevant ADRs.
- Read affected specifications.
- Reuse existing abstractions.
- Minimize unnecessary modifications.

## Engineering Principles

- Never invent architecture.
- Never contradict an approved ADR.
- Prefer extending existing implementations.
- Keep documentation synchronized.
- Minimize technical debt.
- Explain assumptions.

## Safety Rules

Never:

- fabricate implementation details
- ignore failing tests
- introduce undocumented behavior
- silently delete functionality
- rewrite unrelated modules

If uncertainty exists:

STOP.

Explain the uncertainty.

Request clarification.

## Repository Governance

AI agents MUST NOT perform repository governance operations unless explicitly instructed by the human operator.

Forbidden operations include:

- git commit
- git commit --amend
- git push
- git push --force
- git merge
- git rebase
- git tag
- git reset
- deleting branches
- publishing releases
- creating pull requests

AI agents may prepare changes for review, but all Git history and remote repository operations remain under human control.
