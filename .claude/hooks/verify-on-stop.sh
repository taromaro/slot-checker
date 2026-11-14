#!/usr/bin/env bash
# Stop: src に変更があれば型チェックとテストを実行し、失敗を Claude に差し戻す
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

input=$(cat)
# 差し戻し後の再停止ではループさせない
[[ "$(jq -r '.stop_hook_active // false' <<<"$input")" == "true" ]] && exit 0
# コードに変更がない応答（質問への回答など）ではスキップ
[[ -z "$(git status --porcelain -- src package.json tsconfig.json vite.config.js 2>/dev/null)" ]] && exit 0

if ! out=$(npm run --silent typecheck 2>&1); then
  echo "型チェックが失敗しています。修正してから完了してください:" >&2
  echo "$out" | tail -40 >&2
  exit 2
fi
if ! out=$(NO_COLOR=1 npx --no-install vitest run 2>&1); then
  echo "テストが失敗しています。修正してから完了してください:" >&2
  echo "$out" | tail -60 >&2
  exit 2
fi
exit 0
