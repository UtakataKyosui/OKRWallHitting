---
name: manage-env-vars
description: Securely manage environment variables using dotenvx.
---

# manage-env-vars

This skill enables the agent to securely manage and access environment variables using [dotenvx](https://github.com/dotenvx/dotenvx). It allows for encrypting sensitive values in `.env` files, which can then be safely committed to version control.

## Prerequisites

- `dotenvx` must be available. You can use it via `npx dotenvx` or install it globally.

## Usage

### 1. Setting an Encrypted Variable

To set a new environment variable or update an existing one with encryption:

```bash
npx dotenvx set KEY_NAME "secret_value"
```

To specify a target file (e.g., `.env.production`):

```bash
npx dotenvx set -f .env.production API_KEY "prod_secret_key"
```

**What this does:**
- Encrypts the value in the specified `.env` file.
- Adds the decryption key to `.env.keys`.
- **Note:** Always ensure `.env.keys` is ignored by git.

### 2. Running Commands with Env Vars

To execute a command with the decrypted environment variables loaded:

```bash
npx dotenvx run -- <command>
```

Example:
```bash
npx dotenvx run -- npm start
npx dotenvx run -f .env.production -- npm run build
```

### 3. Reading Variables

To see the decrypted value of a variable:

```bash
npx dotenvx get KEY_NAME
```

### 4. Setup

If initializing for the first time or ensuring security:
1.  Ensure `.env.keys` is in `.gitignore`.
2.  Commit your `.env` files (containing `encrypted: ...` values).
3.  Store your `.env.keys` securely (e.g., 1Password, CI secrets).

## Agent Instructions

- When asked to add a secret or token, ALWAYS use `dotenvx set`.
- When asked to run a script that requires secrets, use `dotenvx run --`.
- **NEVER** output the contents of `.env.keys` or decrypted values in the chat unless explicitly requested for debugging (and assume checking).
