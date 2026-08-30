#!/usr/bin/env bash
# ==============================================================================
# Norway SmartLife - Clean Release Archive Packager (Bash)
# ==============================================================================
# This script produces a clean, portable distribution ZIP (~10-20 MB) by excluding:
# - node_modules / package caches
# - .venv / venv / Python cache files (__pycache__, *.pyc)
# - dist / build outputs
# - test results & coverage (playwright-report, test-results, coverage)
# - .git folder and temporary logs
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_NAME="norway-smartlife-clean-release-${TIMESTAMP}.zip"
ZIP_PATH="${ROOT_DIR}/${ZIP_NAME}"

echo "Creating clean release archive for Norway SmartLife..."
echo "Root Directory: ${ROOT_DIR}"
echo "Output ZIP:     ${ZIP_PATH}"

cd "${ROOT_DIR}"

zip -r "${ZIP_PATH}" . \
  -x "*/node_modules/*" \
  -x "node_modules/*" \
  -x "*/.venv/*" \
  -x ".venv/*" \
  -x "*/venv/*" \
  -x "venv/*" \
  -x "*/dist/*" \
  -x "dist/*" \
  -x "*/dist-ssr/*" \
  -x "dist-ssr/*" \
  -x "*/__pycache__/*" \
  -x "__pycache__/*" \
  -x "*.pyc" \
  -x "*/playwright-report/*" \
  -x "playwright-report/*" \
  -x "*/test-results/*" \
  -x "test-results/*" \
  -x "*/coverage/*" \
  -x "coverage/*" \
  -x "*/.git/*" \
  -x ".git/*" \
  -x "*/.vscode/*" \
  -x ".vscode/*" \
  -x "*/.idea/*" \
  -x ".idea/*" \
  -x "*.zip" \
  -x "*.log" \
  -x "audit_results.json" \
  -x "linter_report.txt"

echo "Clean release archive created successfully!"
ls -lh "${ZIP_PATH}"
