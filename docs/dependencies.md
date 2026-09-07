<p align="center">
  <strong>Language:</strong> English | <a href="dependencies.pt-BR.md">Português (BR)</a> | <a href="dependencies.es.md">Español</a>
</p>

# Dependency pins

Most dependencies in `package.json` use a caret range and update freely
through Renovate. The entries below are pinned to an exact version
(no `^`) on purpose. Each one answers: what it is, why it's pinned, what
breaks if the pin is removed, and what removes it.

## `next` - `16.2.6`

**What:** the framework itself.

**Why pinned:** this project runs a very recent Next.js release with
Cache Components (`cacheComponents: true`, `"use cache"` + `cacheLife`)
and tracks the framework closely enough to have hit a breaking rename
mid-development: the `middleware.ts` file convention was renamed to
`proxy.ts` in a point release, discovered only by reading
`node_modules/next/dist/docs/` directly, because the change hadn't
propagated to public docs indexed by the training data of AI coding
assistants yet (see `AGENTS.md`). A caret range on a framework moving
this fast risks pulling in another such rename, a Cache Components
semantics change, or an App Router behavior shift without a deliberate
review of the changelog first.

**What breaks if unpinned:** nothing today - but the next `next` release
could change Cache Components' caching semantics, rename another file
convention, or alter how `generateMetadata`/`opengraph-image.tsx`
interact with a catch-all route (see the note in
[architecture.md](architecture.md) about why per-package OG images
aren't dynamic). Any of those would surface as a build failure or a
silent behavior change, not a type error.

**What removes the pin:** a deliberate upgrade - read the release notes
(and re-check `node_modules/next/dist/docs/` for anything not yet on the
public site) for every minor version between the current pin and the
target, bump both `next` and `eslint-config-next` together, run
`./scripts/verify.sh`, and update this entry with the new reasoning.

## `eslint-config-next` - `16.2.6`

**What:** the ESLint rules shipped by the Next.js team for App Router
projects.

**Why pinned:** it must match the `next` version exactly - the config it
exports is generated against a specific framework release and isn't
guaranteed compatible across versions.

**What breaks if unpinned:** lint rules referencing removed or renamed
Next.js APIs, or missing rules for new ones - inconsistent, not a hard
failure, but worth avoiding.

**What removes the pin:** always bumped in the same commit as `next`,
never independently.

## `react` / `react-dom` - `19.2.4`

**What:** the UI runtime.

**Why pinned:** Next 16.2.6's Cache Components and Partial Prerendering
depend on specific React internals (the ones that let a page have a
static shell with a dynamically-streamed region). Next pins a narrow
compatible React range for exactly this reason, and this project mirrors
that pin instead of letting Renovate move React independently of Next,
which could combine a React version Next 16.2.6 wasn't built against.

**What breaks if unpinned:** potentially nothing for a patch bump, but
there's no guarantee - React internals used by Cache Components aren't
part of React's public stability contract the way component APIs are.

**What removes the pin:** bumped together with `next`, after checking
the target Next version's own `package.json` for the React range it was
built and tested against.

## Renovate configuration

Once Renovate is configured (`renovate.json`), it must disable updates
for these four packages explicitly, each rule's `description` pointing
back to this file. Until then, a Renovate PR proposing to bump one of
them individually is a signal that this document is out of date -
reconcile the two rather than merging the PR blind.
