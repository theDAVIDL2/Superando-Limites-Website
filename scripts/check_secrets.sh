
#!/bin/bash

# This script scans the codebase for hardcoded secrets.

PATTERNS=(
    "API_KEY"
    "SECRET"
    "TOKEN"
    "PASSWORD"
    "sk-or-v1-"
)

EXIT_CODE=0

for pattern in "${PATTERNS[@]}"
do
    echo "Scanning for pattern: $pattern"
    # Exclude files that are expected to contain secrets, like .env files.
    # Also exclude the script itself.
    grep -r -i --exclude-dir={node_modules,build} --exclude='*.{lock,env,sh}' "$pattern" . > /dev/null
    if [ $? -eq 0 ]; then
        echo "Potential secret found for pattern: $pattern"
        EXIT_CODE=1
    fi
done

exit $EXIT_CODE
