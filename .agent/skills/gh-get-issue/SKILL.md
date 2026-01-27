---
name: gh-get-issue
description: Retrieve details of a GitHub Issue using the gh CLI.
---

# `gh-get-issue`

This skill allows the agent to retrieve detailed information about a specific GitHub Issue.

## Usage

Use the `run_command` tool to execute the `gh` CLI command.

```bash
gh issue view <issue-number> --json number,title,body,state,assignees,labels,comments
```

### Parameters
- `<issue-number>`: The number of the issue to retrieve (e.g., `123`).

### Example

To get details for issue #42:

```bash
gh issue view 42 --json number,title,body,state,assignees,labels,comments
```

## Tips
- Always request JSON output for easier parsing.
- You can include other fields in the `--json` flag if needed, such as `url`, `createdAt`, `author`, etc.
