<p align="center">
<strong>English</strong> · <a href="architecture.es.md">Español</a> · <a href="architecture.pt-BR.md">Português (BR)</a>
</p>

# Architecture

This document describes the system as it is today. Anything not yet built
belongs in an issue, not here.

## Directory tree

```
app/                  Routes (Next.js App Router). Pages, layouts, API
                       route handlers, sitemap.ts, robots.ts.
  api/                 Route handlers - the only place allowed to read
                       secrets (GITHUB_TOKEN, GEMINI_API_KEY) or write
                       to lib/api/*.
  package/[...importPath]/  The package detail page. A catch-all segment
                       because a Go import path itself contains slashes
                       (e.g. golang.org/x/net).

components/            React components, grouped by the page/feature that
                       owns them (home/, search/, compare/, package/,
                       favorites/, popular/) plus shared groups:
  common/              Generic UI reused across features (Pagination,
                       SearchHistoryDropdown) that isn't a raw design
                       primitive.
  layout/              Header, Footer, nav-links - the page shell.
  providers/           App-wide client providers (theme, scroll restore).
  ui/                  Design primitives (button, select, tooltip,
                       dropdown-menu) - mostly shadcn-generated, generic
                       enough to have no knowledge of Go packages.

hooks/                 Client-side React hooks (useFavorites,
                       usePackageDetail) - state and browser-API access
                       that a Server Component can't do directly.

lib/                   Framework-agnostic logic: no JSX, no React hooks.
  api/                 Route-handler support: zod schemas, the
                       { error: { code, message } } response envelope,
                       the in-memory rate limiter.
  github/               GitHub REST + Go Module Proxy client, response
                       normalization, the vanity-import mapping table,
                       resilientFetch (timeout + retry).

types/                  Shared TypeScript types with no runtime code.
```

## Layering rule

```
app/  →  components/  →  hooks/  →  lib/  →  types/
```

An arrow means "may import from". The rule only runs one direction:

- `lib/` never imports from `components/`, `hooks/`, or `app/` - it has
  no JSX and no React, so it can be unit-tested with plain Vitest and no
  DOM (see `lib/**/*.test.ts`).
- `hooks/` may use `lib/` and browser APIs, but is not tied to a specific
  page - `useFavorites` is shared across the home page, the package
  card, and the package detail header.
- `components/` may use `hooks/` and `lib/`, never the other way round.
- `app/` composes `components/` into routes and owns data fetching for
  Server Components; it's the only layer allowed to call `getPackageDetail`
  or a `lib/api/*` schema directly outside of a route handler.

`types/` sits outside the arrow chain: any layer may import a type, and
types never import from anything but other types.

## Server / Client Component boundary

Every route's `page.tsx` is a Server Component by default. It fetches
data (via `lib/github` or `lib/github/cached`) and renders. The moment a
component needs `useState`, `useEffect`, `onClick`, or a browser API
(`localStorage`, `window`), it's marked `"use client"` and pushed as far
down the tree as practical - the search page itself stays a Server
Component; `SearchSection` (which owns pagination state and the debounced
fetch to `/api/search`) is the client boundary.

The package detail page (`app/package/[...importPath]/page.tsx`) is a
partial exception: it fetches package data server-side twice for two
different purposes - once for `generateMetadata` (title/OG tags) and
once for the JSON-LD `<script>` tag rendered in the page body - while the
actual interactive UI (`PackageDetail`) is a client component that
independently fetches `/api/package-info` again on mount. Both server
fetches go through the same `getCachedPackageDetail` wrapper
(`lib/github/cached.ts`) specifically so they share one cache entry
instead of paying for the GitHub/Go-proxy/README fetch twice.

## Caching strategy

Three layers, each solving a different problem:

1. **`"use cache"` + `cacheLife`** (Next.js Cache Components) - used
   inside API route handlers and the package detail page to cache the
   _result of the expensive fetch itself_ (GitHub API + Go Proxy + README
   scraping can mean a dozen outbound requests for one package). Every
   cached function sets its own `cacheLife({ revalidate: <seconds> })`:
   30 min for package details, 1 hour for search/versions/releases/popular,
   1 day for the AI summary and the Go Report Card grade (they change
   rarely and cost real API quota to regenerate).
2. **HTTP `Cache-Control` headers** on the route handler's response -
   lets browsers, CDNs, and `fetch()` on the client skip the network
   round-trip entirely on a warm cache, independent of the server-side
   cache above. The `s-maxage` matches the route's `cacheLife` value.
3. **`localStorage`**, for state that's genuinely per-browser and has no
   server representation: favorites (`useFavorites`), package view
   history, and search history. There's no backend account system or
   database - favorites and history are deliberately scoped to a single
   browser, not a product gap to fill later.

## Vanity import mapping

`lib/github/client.ts` maps a fixed list of Go vanity import paths
(`go.uber.org/zap`, `golang.org/x/net`, `gopkg.in/yaml.v3`, …) to their
real GitHub `owner/repo`. This is a **static table**, not a dynamic
resolution (following the vanity import's `go-import` meta tag or
`?go-get=1` redirect), for two reasons:

- **Determinism under a strict CSP.** Resolving a vanity import
  dynamically means fetching an arbitrary third-party HTML page and
  parsing a meta tag before the real request can even start - an extra
  network hop with its own failure modes, timeout budget, and (if scraped
  carelessly) injection surface.
- **It's a short, known list.** Go's ecosystem has a small number of
  popular vanity domains. When a new one shows up often enough to matter,
  it's a one-line addition to the table, not a new resolution mechanism.

An import path that isn't in the table and isn't already `github.com/...`
is assumed to be `github.com/<path>` directly (`parseGithubRepo`). That
assumption holds for the large majority of Go packages and fails
silently (returns `null`, callers degrade gracefully) for anything else.

## Rate limiting

`lib/api/rate-limit.ts` implements a fixed-window, in-memory counter
(10 requests/minute per client IP), applied to `package-summary` and
`package-assistant` - the two routes that spend Gemini API quota per
request.

**Known limitation:** the counter lives in the Node process's memory. On
a serverless platform that runs multiple concurrent instances (which
Vercel does under load), each instance enforces the limit independently,
so the _effective_ limit is `10 × instance count`, not a hard global 10.
This is acceptable for this project's current scale - it stops trivial
abuse from a single client, which was the actual problem - but it is not
a distributed rate limiter. A real fix would move the counter to a
shared store (Redis, Vercel KV) and is out of scope until quota
consumption actually becomes a problem in production.

## Resilient HTTP client

`resilientFetch` (`lib/github/client.ts`) wraps every outbound call to
GitHub, the Go Module Proxy, `raw.githubusercontent.com`, and
goreportcard.com with:

- A request timeout (`AbortSignal.timeout`), so a slow upstream can't
  hold a route open until the platform's own timeout kills it.
- Retry with exponential backoff, but **only** for 5xx responses and
  network errors - a 4xx is never retried, since retrying a client error
  just repeats the same failure.
- Respect for a `Retry-After` header on 403/429 (GitHub's rate-limit
  responses), capped at 10 seconds so a route never hangs waiting out an
  arbitrarily long upstream cooldown.

The README-scanning loop in `getPackageDetail` (which tries up to 5
branches × 5 filenames) calls it with `retries: 0` deliberately - with
up to 25 attempts already, adding retries on top would multiply an
already-expensive worst case.
