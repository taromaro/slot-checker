#!/usr/bin/env bash
# PostToolUse: 編集されたファイルを oxfmt で整形し、oxlint の結果を Claude に返す
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

file=$(jq -r '.tool_input.file_path // empty')
[[ -z "$file" || ! -f "$file" ]] && exit 0
case "$file" in
  */node_modules/*|*/dist/*|*/coverage/*) exit 0 ;;
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) ;;
  *) exit 0 ;;
esac

npx --no-install oxfmt "$file" >/dev/null 2>&1

case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    if ! out=$(npx --no-install oxlint --deny-warnings "$file" 2>&1); then
      echo "oxlint で問題が見つかりました。修正してください:" >&2
      echo "$out" >&2
      exit 2
    fi
    ;;
esac
exit 0
