---
name: gh-create-issue
description: Create a new GitHub Issue using the gh CLI.
---

# `gh-create-issue`

This skill allows the agent to create a new GitHub Issue.

## Usage

Use the `run_command` tool to execute the `gh` CLI command.

```bash
gh issue create --title "<title>" --body "<body>"
```

### Parameters
- `--title "<title>"`: The title of the issue.
- `--body "<body>"`: The body content of the issue.

### Optional Parameters
- `--assignee "<user>"`: Assign people by their login. Use `@me` to self-assign.
- `--label "<label>"`: Add labels by name.
- `--milestone "<name>"`: Add the issue to a milestone by name.
- `--project "<name>"`: Add the issue to a project by name.

### Example

To create a bug report:

```bash
gh issue create --title "Bug: Application crashes on start" --body "Steps to reproduce: ..." --label "bug"
```

## Tips
- Ensure the title and body are properly quoted to handle special characters.
- You can create an issue interactively if really needed, but flags are preferred for automation.
