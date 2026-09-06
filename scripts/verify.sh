#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
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

if [ "$SKIP_BUILD" = false ]; then
  step "build"
  pnpm build
else
  echo
  echo "==> build (skipped: --skip-build)"
fi

echo
echo "verify: all steps passed"
