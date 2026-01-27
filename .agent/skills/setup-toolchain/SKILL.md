---
name: setup-toolchain
description: Install and configure the appropriate toolchain manager (proto or mise) based on project type.
---

# `setup-toolchain`

This skill helps the agent set up the correct toolchain manager for the project.

## Logic

1.  **Determine Project Type**:
    *   **Monorepo**: Look for indicators like `moon.yml`, `.moon/`, or if the user explicitly mentions "monorepo" or "moonrepo".
    *   **Single Application**: If it's a standalone app (e.g., simple Next.js app, Rust crate) without Moonrepo configuration.

2.  **Select Tool**:
    *   **Monorepo** -> Use `proto`.
    *   **Single Application** -> Use `mise`.

## Installation Instructions

### Option A: `proto` (for Monorepos / Moonrepo)

Use `proto` when working with Moonrepo or complex monorepos.

1.  **Install**:
    ```bash
    curl -fsSL https://moonrepo.dev/install/proto.sh | bash
    ```
2.  **Verify**:
    ```bash
    proto --version
    ```
3.  **Configuration**:
    *   Create a `.prototools` file in the project root to pin versions.
    *   Example `.prototools`:
        ```toml
        node = "20.11.0"
        pnpm = "8.15.0"
        ```

### Option B: `mise` (for Single Applications)

Use `mise` for simpler, single-application projects.

1.  **Install**:
    ```bash
    curl https://mise.jdx.dev/install.sh | sh
    ```
    *   *Note: Ensure `~/.local/bin` is in the PATH.*
2.  **Verify**:
    ```bash
    mise --version
    ```
3.  **Configuration**:
    *   Create a `.mise.toml` file in the project root.
    *   Example `.mise.toml`:
        ```toml
        [tools]
        node = "20.11.0"
        ```

## Usage Tip
Always check for existing configuration files (`.prototools`, `.mise.toml`, `.tool-versions`) before initializing a new one to avoid conflicts.
