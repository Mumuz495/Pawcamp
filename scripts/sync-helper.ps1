param(
    [Parameter(Position = 0)]
    [ValidateSet("status", "handoff", "home", "office")]
    [string]$Mode = "status"
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "== $Title ==" -ForegroundColor Cyan
}

function Get-GitCommand {
    $git = Get-Command git -ErrorAction SilentlyContinue
    if ($git) {
        return $git.Source
    }

    $candidates = @(
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\cmd\git.exe"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return $null
}

function Ensure-Handoff {
    $handoffPath = Join-Path $PSScriptRoot "..\HANDOFF.md"
    if (-not (Test-Path $handoffPath)) {
        throw "HANDOFF.md was not found: $handoffPath"
    }

    return (Resolve-Path $handoffPath).Path
}

function Show-HandoffReminder {
    $handoff = Ensure-Handoff
    Write-Section "Handoff Reminder"
    Write-Host "Update this file first: $handoff"
    Write-Host "Minimum checklist:"
    Write-Host "1. What is already done"
    Write-Host "2. What to do next"
    Write-Host "3. Anything the other computer should know"
}

function Show-GitStatus {
    $git = Get-GitCommand
    Write-Section "Git Status"

    if (-not $git) {
        Write-Host "Git was not found."
        Write-Host "Install Git for Windows and reopen the terminal."
        return
    }

    & $git status --short --branch
}

function Show-HomeSteps {
    $git = Get-GitCommand
    Show-HandoffReminder

    Write-Section "Before Leaving Home"
    if (-not $git) {
        Write-Host "Git is missing. Install it before running the commands below."
    }

    Write-Host "git add ."
    Write-Host 'git commit -m "home: save progress"'
    Write-Host "git push"
}

function Show-OfficeSteps {
    $git = Get-GitCommand
    Write-Section "When You Arrive At Office"

    if (-not $git) {
        Write-Host "Git is missing. Install it before continuing."
        return
    }

    Write-Host "Recommended order:"
    Write-Host "1. git pull"
    Write-Host "2. open HANDOFF.md"
    Write-Host "3. continue coding"
}

switch ($Mode) {
    "status" {
        Show-GitStatus
    }
    "handoff" {
        Show-HandoffReminder
    }
    "home" {
        Show-HomeSteps
    }
    "office" {
        Show-OfficeSteps
    }
}
