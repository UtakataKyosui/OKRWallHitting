---
name: gh-get-pr
description: Retrieve details of a GitHub Pull Request using the gh CLI.
---

# `gh-get-pr`

This skill allows the agent to retrieve detailed information about a specific GitHub Pull Request.

## Usage

Use the `run_command` tool to execute the `gh` CLI command.

```bash
gh pr view <pr-number> --json number,title,body,state,assignees,labels,reviews,comments,headRefName,baseRefName
```

### Parameters
- `<pr-number>`: The number of the pull request to retrieve (e.g., `123`).

### Example

To get details for PR #88:

```bash
gh pr view 88 --json number,title,body,state,assignees,labels,reviews,comments,headRefName,baseRefName
```

## Tips
- Always request JSON output for easier parsing.
- Helpful fields to include: `mergeable`, `mergedAt`, `url`.
