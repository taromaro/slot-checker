#!/usr/bin/env bash
# Stop: src に変更があれば型チェックとテストを実行し、失敗を Claude に差し戻す
# 失敗中は .claude/state/verify-failed を置き、guard.sh が既存テストの編集を禁止する
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

input=$(cat)
marker=.claude/state/verify-failed

fail() {
  mkdir -p .claude/state && touch "$marker"
  echo "$1 実装側を修正してください（テストと設定は編集できません）:" >&2
  echo "$2" >&2
  exit 2
}

# 差し戻し後の再停止ではループさせない（マーカーは残す）
[[ "$(jq -r '.stop_hook_active // false' <<<"$input")" == "true" ]] && exit 0
# コードに変更がない応答（質問への回答など）ではスキップ
[[ -z "$(git status --porcelain -- src package.json tsconfig.json vite.config.js 2>/dev/null)" ]] && exit 0

out=$(npm run --silent typecheck 2>&1) || fail "型チェックが失敗しています。" "$(tail -40 <<<"$out")"
out=$(NO_COLOR=1 npx --no-install vitest run 2>&1) || fail "テストが失敗しています。" "$(tail -60 <<<"$out")"

rm -f "$marker"
exit 0
