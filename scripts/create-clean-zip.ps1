# ==============================================================================
# Norway SmartLife - Clean Release Archive Packager (PowerShell)
# ==============================================================================
# This script produces a clean, portable distribution ZIP (~10-20 MB) by excluding:
# - node_modules / package caches
# - .venv / venv / Python cache files (__pycache__, *.pyc)
# - dist / build outputs
# - test results & coverage (playwright-report, test-results, coverage)
# - .git folder and temporary logs
# ==============================================================================

$ErrorActionPreference = "Stop"
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
$zipName = "norway-smartlife-clean-release-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
$zipPath = Join-Path -Path $rootDir -ChildPath $zipName
$stagingDir = Join-Path -Path $rootDir -ChildPath "release_staging_tmp"

Write-Host "Creating clean release archive for Norway SmartLife..." -ForegroundColor Cyan
Write-Host "Root Directory: $rootDir"
Write-Host "Output ZIP:     $zipPath"

# Cleanup any previous staging directory
if (Test-Path $stagingDir) {
    Remove-Item -Path $stagingDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingDir | Out-Null

# List of excluded directory and file patterns
$excludePatterns = @(
    "node_modules",
    ".venv",
    "venv",
    "dist",
    "dist-ssr",
    "__pycache__",
    "playwright-report",
    "test-results",
    "coverage",
    ".git",
    ".idea",
    ".vscode",
    "release_staging_tmp",
    "*.zip",
    "*.pyc",
    "*.log",
    "audit_results.json",
    "linter_report.txt"
)

Write-Host "Copying project files while skipping excluded artifacts..." -ForegroundColor Yellow

Get-ChildItem -Path $rootDir -Recurse -Force | ForEach-Object {
    $item = $_
    $relPath = $item.FullName.Substring($rootDir.Length).TrimStart("\", "/")

    # Check if item or any of its parent segments match exclusion patterns
    $skip = $false
    foreach ($pattern in $excludePatterns) {
        if ($item.Name -like $pattern -or $relPath -like "*\$pattern*" -or $relPath -like "*/$pattern*") {
            $skip = $true
            break
        }
    }

    if (-not $skip) {
        $destPath = Join-Path -Path $stagingDir -ChildPath $relPath
        if ($item.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath | Out-Null
            }
        } else {
            $parentDir = Split-Path -Path $destPath -Parent
            if (-not (Test-Path $parentDir)) {
                New-Item -ItemType Directory -Path $parentDir | Out-Null
            }
            Copy-Item -Path $item.FullName -Destination $destPath -Force
        }
    }
}

Write-Host "Compressing to $zipName..." -ForegroundColor Yellow
Compress-Archive -Path "$stagingDir\*" -DestinationPath $zipPath -Force

# Cleanup staging directory
Remove-Item -Path $stagingDir -Recurse -Force

$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host "Clean release archive created successfully!" -ForegroundColor Green
Write-Host "File: $zipPath" -ForegroundColor Green
Write-Host ("Size: {0:N2} MB" -f $zipSize) -ForegroundColor Green
