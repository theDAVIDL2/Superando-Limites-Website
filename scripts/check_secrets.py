
import os
import re

PATTERNS = [
    re.compile(r"(key|secret|token|password)[\s:=]\s*[\'\"]([a-zA-Z0-9_-]{20,})[\'\"]", re.IGNORECASE),
    re.compile(r"sk-or-v1-[a-zA-Z0-9_-]{32,}", re.IGNORECASE),
]

ALLOWED_STRINGS = [
    "YOUR_API_KEY",
    "YOUR_PASSWORD",
    "YOUR_FALLBACK_OPENROUTER_API_KEY",
]

EXCLUDE_DIRS = ["node_modules", "build", ".git", "__pycache__", "tests", ".venv", "venv", "backend/.venv"]
EXCLUDE_EXTENSIONS = [".lock", ".env", ".sh", ".pyc", ".css", ".svg", ".md"]

def main():
    exit_code = 0
    for root, dirs, files in os.walk("."):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            # Exclude files by extension
            if any(file.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
                continue

            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line_num, line in enumerate(f, 1):
                        for pattern in PATTERNS:
                            for match in pattern.finditer(line):
                                matched_string = match.group(2) if len(match.groups()) > 1 else match.group(0)
                                if matched_string not in ALLOWED_STRINGS:
                                    print(f"Potential secret found in {file_path} at line {line_num}: {line.strip()}")
                                    exit_code = 1
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")

    return exit_code

if __name__ == "__main__":
    exit(main())
