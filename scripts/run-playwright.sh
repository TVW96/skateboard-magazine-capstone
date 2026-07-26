#!/usr/bin/env bash
set -euo pipefail

# Pass through any Playwright CLI options, for example:
#   scripts/run-playwright.sh --project=chromium
#   scripts/run-playwright.sh --ui
npx playwright test "$@"
