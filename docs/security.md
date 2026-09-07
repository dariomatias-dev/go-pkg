<p align="center">
<strong>English</strong> · <a href="security.es.md">Español</a> · <a href="security.pt-BR.md">Português (BR)</a>
</p>

# Security Policy

## Supported versions

This project has no version branches to speak of - `main` is the only
supported version, and a fix ships as a new commit there, not backported
anywhere.

## Scope

Before reporting, please note what this app actually is: a public,
read-only catalogue of Go package metadata. There is **no account
system, no server-side user state, and no database** - favorites and
search history live entirely in the visitor's own browser
(`localStorage`), never sent to the server. That rules out a category of
reports (session fixation, account takeover, stored-XSS-via-user-profile,
IDOR on user data) that don't apply because the surface they'd target
doesn't exist here. See [architecture.md](architecture.md) for the full
picture.

What _is_ in scope: the public web app and its API routes
(`app/api/**`), including input validation, the GitHub/Gemini API
integration, the Content-Security-Policy and other security headers
(`next.config.ts`), and the dependency chain (`pnpm-lock.yaml`, scanned
automatically by `osv-scanner` in CI - see
[contributing.md](contributing.md)).

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a security report.

Preferred: use GitHub's private
[Security Advisories](https://github.com/dariomatias-dev/go-pkg/security/advisories/new)
for this repository.

Alternative: email **dariomatias.dev@gmail.com** with a description of
the issue.

Include, if you can:

- The affected route or component.
- Steps to reproduce, or a minimal proof of concept.
- The impact as you see it (what an attacker could actually do with it).

## What to expect

This is a single-maintainer, portfolio-scale project. There is no formal
SLA, and it would be dishonest to promise one. In practice: a report
that includes a clear reproduction gets acknowledged and looked at
promptly, but "promptly" here means "when the maintainer is available,"
not a contractual response window. If the project ever grows a team,
this section is the first thing that should change.
