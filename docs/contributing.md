<p align="center">
<strong>English</strong> · <a href="contributing.es.md">Español</a> · <a href="contributing.pt-BR.md">Português (BR)</a>
</p>

# Contributing

## Setup

```bash
git clone https://github.com/dariomatias-dev/go-pkg.git
cd go-pkg
pnpm install
cp .env.example .env   # fill in GEMINI_API_KEY at minimum
```

`pnpm install` runs a `prepare` script that points `core.hooksPath` at
`.githooks`, activating a `commit-msg` hook that rejects commits not
following the [commit convention](#commit-convention) below. That hook is
a local convenience; the `commit-lint` job in CI is what actually gates
the convention. Node and pnpm versions are pinned via `.nvmrc`, `engines`, and
`packageManager` in `package.json` - use them (`nvm use`) rather than
whatever happens to be on `PATH`.

## Before opening a PR

Run the local gate - it mirrors CI step for step, so a green run here
means CI has no new reason to fail:

```bash
./scripts/verify.sh              # format, lint, typecheck, test:coverage, build
./scripts/verify.sh --skip-build # faster loop while iterating
```

Checklist:

- [ ] `./scripts/verify.sh` passes.
- [ ] New logic in `lib/` or `hooks/` has a test (see
      [architecture.md](architecture.md) for what belongs in which layer).
- [ ] A behavior change to an API route has an updated or new test in
      `app/api/**/*.test.ts`.
- [ ] A UI change that affects a user-facing flow has an E2E smoke test
      (`pnpm e2e`) or an update to an existing one.
- [ ] Commit subject and PR title follow the
      [convention](#commit-convention) below - the `commit-msg` hook
      checks commits locally, and CI checks the PR title.

## Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <subject>
```

- **type**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `build`, `ci`, `revert`
- **scope**: optional, lowercase, e.g. `search`, `compare`, `readme`
- **subject**: imperative mood, no trailing period, ≤72 chars

Examples:

```
feat(compare): add dependency count column
fix(popular-package): handle GitHub API rate limit errors
docs(readme): document available npm scripts
```

Body (optional) explains _why_, not _what_ - the diff already shows what
changed.

## Branching

- `main` is protected: no direct pushes, merges only via pull request.
- Branch names: `<type>/<short-description>` (e.g. `feat/tag-filter`,
  `fix/search-pagination`).
- Required status checks on `main`: `verify` and `e2e` (the `vulnerabilities`
  and `lighthouse` jobs report but don't block - see the table below).
- Squash or rebase merge only - no merge commits, to keep history linear
  and each entry a valid Conventional Commit.
- For this repo (single maintainer), self-merge after CI passes is
  allowed; branch protection still requires the PR flow and passing
  checks.

## What CI checks

| Job               | What it does                                                                                           | Blocks merge?                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `verify`          | `format:check` → `lint` → `typecheck` → `test:coverage` → `build`, in that order (fastest check first) | Yes                                                                        |
| `vulnerabilities` | `osv-scanner` against `pnpm-lock.yaml`                                                                 | No - a freshly disclosed advisory with no fix yet shouldn't block every PR |
| `e2e`             | Playwright smoke flows on Chromium and WebKit, `needs: verify`                                         | Yes                                                                        |
| `lighthouse`      | Lighthouse CI against the built app, report-only                                                       | No - no performance budget has been calibrated against real traffic yet    |

## Reproducing CI locally with `act`

[`act`](https://github.com/nektos/act) runs the GitHub Actions workflow
in a local Docker container. `.actrc` is already configured with a
runner image close enough to GitHub's to catch most environment
differences:

```bash
act pull_request -j verify
```

This is slower than `./scripts/verify.sh` (it builds a container image
first) - use it when you need to debug something that only fails in CI,
not as the everyday loop.

## Triaging a Renovate PR

- If it touches one of the packages pinned in
  [dependencies.md](dependencies.md), close it and check whether
  `renovate.json`'s `enabled: false` rule for that package is missing or
  out of date - that's the actual bug, not the PR.
- Otherwise: check the PR's own description (Renovate includes the
  changelog diff), run `./scripts/verify.sh`, and merge if green. A
  grouped PR (e.g. all `react` + `@types/react*` together) should be
  reviewed as one unit - don't cherry-pick commits out of it.
- A major-version bump PR gets a normal review, not a rubber stamp: read
  the changelog for breaking changes before merging.

## Working with an AI coding agent

This repository has `AGENTS.md` (and `CLAUDE.md`, which re-exports it)
at the root, read automatically by coding agents that support the
convention. It currently states that the pinned Next.js version has
diverged from what's in most models' training data, and points to
`node_modules/next/dist/docs/` as the source of truth for framework
behavior - that directory ships with the `next` package itself and is
more current than public documentation indexed before this pin.

If you're using an agent to contribute:

- Treat `node_modules/next/dist/docs/` as authoritative over the agent's
  training knowledge for anything Next.js-specific - API route
  conventions, the `proxy.ts` file convention, `cacheLife`/Cache
  Components semantics, and metadata file rules (see the note on
  catch-all routes and `opengraph-image.tsx` in
  [architecture.md](architecture.md)).
- An agent's plausible-sounding explanation for _why_ something is
  pinned or structured a certain way should still be checked against
  [dependencies.md](dependencies.md) and this file - prefer updating the
  docs over letting undocumented reasoning drift out of sync with the
  code.
- Run `./scripts/verify.sh` yourself before trusting an agent's claim
  that a change is green.

## Code style

Follows the project's ESLint config (`eslint.config.mjs`) and Prettier
config (`.prettierrc.json`) - both run as part of `./scripts/verify.sh`,
so there's no separate style guide to keep in sync by hand.
