---
name: nexus-publish-sprint
description: Publishes an already closed and finalized Nexus Sprint by validating an orchestrator-issued publication manifest, staging only its authorized files, creating one commit, and pushing it without force. Use only when AI-Orchestrator explicitly invokes this skill after SPRINT_CLOSED and REVIEW_FINALIZED.
argument-hint: '<absolute publish-manifest.json path>'
user-invocable: true
disable-model-invocation: true
---

# Nexus Sprint Publisher

Publish an already closed Nexus Sprint using the publication manifest supplied
by AI-Orchestrator.

This is a publication role, not an implementation role.

Do not modify source files, tests, documentation, governance artifacts, Git
configuration, remotes, or repository history.

## Required input

Receive exactly one absolute path to `publish-manifest.json`.

The manifest must identify:

- schema version;
- orchestrator run ID;
- Sprint number;
- absolute repository path;
- publication authorization;
- Sprint workflow state;
- closure disposition;
- review-finalization disposition;
- baseline commit;
- target remote;
- target branch;
- commit message;
- exact paths authorized for staging.

Treat the manifest as immutable.

## Preconditions

Refuse publication unless all of the following are true:

1. `publishAuthorized` is `true`.
2. `workflowState` is `SPRINT_CLOSED`.
3. `closureDisposition` is `SPRINT_CLOSED`.
4. `finalizationDisposition` is `REVIEW_FINALIZED`.
5. The manifest repository is the current Git repository.
6. The repository HEAD matches `baseCommit`.
7. The current branch matches `targetBranch`.
8. The target branch is not detached.
9. The target remote exists.
10. Every changed path is present in `authorizedPaths`.
11. Every authorized path belongs to the current repository.
12. There are no unresolved merges or Git conflicts.
13. The staged index is empty before publication.
14. At least one authorized change exists.

If any precondition fails, make no Git mutation and return
`PUBLICATION_BLOCKED`.

## Publication procedure

Run the bundled publisher script from the repository root:

`python .github/skills/nexus-publish-sprint/scripts/publish_sprint.py --manifest "<absolute-manifest-path>"`

The script must:

1. Repeat every precondition independently.
2. Stage only the exact paths listed in `authorizedPaths`.
3. Never use `git add .`, `git add -A`, or a wildcard.
4. Verify that the staged paths exactly match the authorized paths.
5. Run `git diff --cached --check`.
6. Create one commit using the manifest commit message.
7. Resolve and record the new commit SHA.
8. Push using:

   `git push <targetRemote> HEAD:refs/heads/<targetBranch>`

9. Verify that the remote branch resolves to the new commit SHA.
10. Emit one JSON result.

## Prohibited actions

Never:

- modify repository files;
- generate or repair implementation;
- change the publication manifest;
- stage an unauthorized path;
- amend an existing commit;
- force push;
- use `--force-with-lease`;
- reset, rebase, merge, cherry-pick, or clean;
- create or delete tags;
- add, remove, or modify remotes;
- change Git configuration;
- push to a different branch;
- bypass Git hooks;
- retry with broader permissions;
- claim success without remote verification.

If the commit succeeds but the push fails, return `PUBLISH_FAILED` with the
local commit SHA. Do not create another commit during a retry.

## Output

Return only one JSON object:

{
"disposition": "PUBLISHED | PUBLISH_FAILED | PUBLICATION_BLOCKED",
"summary": "Short result summary",
"runId": "orchestrator run ID",
"sprint": 79,
"commitSha": "full SHA or null",
"remote": "remote name",
"branch": "target branch",
"published": true,
"findings": [],
"requiredActions": [],
"evidence": []
}

Use `PUBLISHED` only after verifying that the target remote branch points to
the new commit SHA.
