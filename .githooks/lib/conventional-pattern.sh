#!/usr/bin/env bash
# Single source of truth for the Conventional Commits subject rule
# (https://www.conventionalcommits.org).
#
# Sourced by:
#   - .githooks/commit-msg          (local, opt-in via core.hooksPath)
#   - .github/workflows/ci.yaml     (commit-lint job, authoritative)
#
# release-please derives the version bump and CHANGELOG from these subjects,
# so the CI job - not the local hook - is what actually protects releases.

CONVENTIONAL_TYPES='build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test'

# type(optional-scope)!: subject
CONVENTIONAL_SUBJECT_PATTERN="^(${CONVENTIONAL_TYPES})(\([a-z0-9_-]+\))?!?: .{1,72}$"

# Validates a single subject line. Returns 0 when valid, 1 otherwise, and
# explains the rejection on stderr. Merge and revert subjects, which git and
# GitHub generate themselves, are exempt.
conventional_check_subject() {
  local subject_line="$1"
  local label="${2:-Commit message}"

  if [[ "$subject_line" =~ ^Merge ]] || [[ "$subject_line" =~ ^Revert ]]; then
    return 0
  fi

  if [[ "$subject_line" =~ $CONVENTIONAL_SUBJECT_PATTERN ]]; then
    return 0
  fi

  echo "$label rejected: does not follow Conventional Commits." >&2
  echo "" >&2
  echo "  Got:      $subject_line" >&2
  echo "  Expected: <type>(<scope>): <subject>" >&2
  echo "  Types:    ${CONVENTIONAL_TYPES}" >&2
  echo "  Example:  feat(search): add tag filter to package search" >&2
  return 1
}
