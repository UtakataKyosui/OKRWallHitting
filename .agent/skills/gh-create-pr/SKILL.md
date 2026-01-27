---
name: gh-create-pr
description: Create a new GitHub Pull Request using the gh CLI.
---

# `gh-create-pr`

This skill allows the agent to create a new GitHub Pull Request.

## Usage

Use the `run_command` tool to execute the `gh` CLI command.

```bash
gh pr create --title "<title>" --body "<body>" --base <base-branch> --head <head-branch>
```

### Parameters
- `--title "<title>"`: The title of the pull request.
- `--body "<body>"`: The body content of the pull request.
- `--base <base-branch>`: The branch into which you want your code merged.
- `--head <head-branch>`: The branch that contains commits for your pull request.

### Optional Parameters
- `--reviewer "<user>"`: Request reviews from people by their login.
- `--assignee "<user>"`: Assign people by their login. Use `@me` to self-assign.
- `--label "<label>"`: Add labels by name.
- `--draft`: Create the pull request as a draft.

### Example

To create a feature PR:

```bash
gh pr create --title "Feat: Add login page" --body "Implements the new login UI." --base main --head feat/login-page
```

## Tips
- Ensure you have pushed your branch before creating the PR.
- Ensure the title and body are properly quoted.
