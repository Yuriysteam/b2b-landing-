#!/usr/bin/env python3
"""Build a publish archive for the B2B landing project.

This helper intentionally only creates the ZIP archive. The actual Tracker
ticket creation is handled by the project-specific `/publish-b2b-landing`
opencode command so it can use agent tools directly.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


PROJECT_ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_PREFIX = "b2b-landing"
EXCLUDED_DIRS = {
    ".git",
    ".claude",
    ".cursor",
    ".opencode",
    ".playwright-mcp",
    ".ruff_cache",
    ".pytest_cache",
    "__pycache__",
    "node_modules",
    ".venv",
    "venv",
    "env",
}
EXCLUDED_FILES = {
    ".DS_Store",
    ".gitignore",
    "CLAUDE.md",
    "README.md",
}
EXCLUDED_SUFFIXES = {
    ".log",
    ".pyc",
    ".pyo",
    ".swp",
    ".swo",
    "~",
}


def should_skip_file(relative_path: Path) -> bool:
    if relative_path.parts and relative_path.parts[0] == "scripts":
        return True

    if any(part in EXCLUDED_DIRS for part in relative_path.parts[:-1]):
        return True

    name = relative_path.name
    if name in EXCLUDED_FILES:
        return True

    if name.startswith(".env"):
        return True

    if any(name.endswith(suffix) for suffix in EXCLUDED_SUFFIXES):
        return True

    if name.startswith(f"{ARCHIVE_PREFIX}-") and name.endswith(".zip"):
        return True

    return False


def build_archive() -> dict[str, object]:
    date_stamp = datetime.now().strftime("%Y-%m-%d")
    archive_name = f"{ARCHIVE_PREFIX}-{date_stamp}.zip"
    archive_path = PROJECT_ROOT / archive_name

    if archive_path.exists():
        archive_path.unlink()

    archived_files = 0

    with ZipFile(archive_path, "w", compression=ZIP_DEFLATED) as archive:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            dirs[:] = [
                directory for directory in dirs if directory not in EXCLUDED_DIRS
            ]

            root_path = Path(root)
            for file_name in sorted(files):
                file_path = root_path / file_name
                relative_path = file_path.relative_to(PROJECT_ROOT)

                if should_skip_file(relative_path):
                    continue

                archive.write(file_path, relative_path.as_posix())
                archived_files += 1

    return {
        "archive_name": archive_name,
        "archive_path": str(archive_path),
        "file_count": archived_files,
    }


def main() -> int:
    result = build_archive()
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
