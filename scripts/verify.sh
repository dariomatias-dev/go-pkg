#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

FAST=false
for arg in "$@"; do
  case "$arg" in
    --fast) FAST=true ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

step() {
  echo
  echo "==> $1"
}

step "format:check"
pnpm format:check

step "lint"
pnpm lint

step "typecheck"
pnpm typecheck

step "test:coverage"
pnpm test:coverage

if [ "$FAST" = false ]; then
  step "build"
  pnpm build
else
  echo
  echo "==> build (skipped: --fast)"
fi

echo
echo "verify: all steps passed"
