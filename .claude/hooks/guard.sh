#!/usr/bin/env bash
# PreToolUse: テストや設定を書き換えて「通ったことにする」のを機械的に防ぐ
#   1. 設定ファイル・ハーネス自体は常に編集禁止
#   2. テスト失敗で差し戻された後は、テストが通るまで既存テストの編集禁止
#   3. lint/型チェック/テストを無効化するコードの追加禁止
#   4. Bash 経由での 1・2 の書き換えも禁止
# 解除: ユーザーが手動で .claude/allow-config-edit を作成する（使い終わったら削除）
set -uo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
input=$(cat)

[[ -f "$root/.claude/allow-config-edit" ]] && exit 0

marker="$root/.claude/state/verify-failed"
paths='(CLAUDE\.md|\.claude/|\.github/|tsconfig[^/]*\.json|\.oxlintrc\.json|\.oxfmtrc\.json|vite\.config\.[jt]s|package(-lock)?\.json|src/setupTests\.ts)'
protected="(^|/)$paths"
protected_in_cmd="(^|[/[:space:]\"'=:])$paths"
testfile='\.test\.[jt]sx?$'
cheat='oxlint-disable|eslint-disable|@ts-ignore|@ts-nocheck|@ts-expect-error|\b(it|test|describe)\.(skip|only|todo)\b|\bx(it|describe)\('

deny() {
  echo "ブロック: $1" >&2
  echo "テストや設定ではなく、実装側を修正してください。どうしても変更が必要なら、理由を添えてユーザーに提案し、作業を止めてください。" >&2
  exit 2
}

tool=$(jq -r '.tool_name' <<<"$input")

if [[ "$tool" == "Bash" ]]; then
  cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
  writes='(^|[^0-9&>])>[^&]|sed +-[a-zA-Z]*i|perl +-[a-zA-Z]*i|\btee\b|\bmv\b|\brm\b|\bcp\b|\btruncate\b|\bchmod\b|git +(checkout|restore|rm|mv)\b'
  grep -qE 'npm +pkg +(set|delete)' <<<"$cmd" && deny "npm pkg による package.json の変更は禁止です"
  if grep -qE "$writes" <<<"$cmd"; then
    grep -qE "$protected_in_cmd" <<<"$cmd" && deny "Bash で設定ファイル/ハーネスを書き換えようとしました: $cmd"
    [[ -f "$marker" ]] && grep -qE '\.test\.[jt]sx?' <<<"$cmd" && deny "テスト失敗中に Bash でテストファイルを書き換えようとしました: $cmd"
  fi
  exit 0
fi

# Edit / Write / MultiEdit
file=$(jq -r '.tool_input.file_path // empty' <<<"$input")
[[ -z "$file" ]] && exit 0
rel="${file#"$root"/}"

grep -qE "$protected" <<<"$rel" && deny "$rel は保護された設定ファイルです"

if [[ -f "$marker" && -f "$file" ]] && grep -qE "$testfile" <<<"$rel"; then
  deny "テストが失敗中のため、既存テスト $rel は編集できません"
fi

# 無効化コードが「増える」編集だけを止める（既存の記述は対象外）
new=$(jq -r '[.tool_input.new_string?, .tool_input.content?, (.tool_input.edits[]?.new_string)] | map(select(. != null)) | join("\n")' <<<"$input")
if [[ "$tool" == "Write" ]]; then
  old=$( [[ -f "$file" ]] && cat "$file" || true )
else
  old=$(jq -r '[.tool_input.old_string?, (.tool_input.edits[]?.old_string)] | map(select(. != null)) | join("\n")' <<<"$input")
fi
count() { grep -oE "$cheat" <<<"$1" | wc -l; }
if (( $(count "$new") > $(count "$old") )); then
  deny "lint/型チェック/テストを無効化する記述（$(grep -oE "$cheat" <<<"$new" | sort -u | tr '\n' ' ')）は追加できません"
fi
exit 0
