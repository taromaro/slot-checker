#!/usr/bin/env bash
# PreToolUse: TDD の役割分担を強制する
# - 本体・その他のエージェント：src/ を編集できない（red / green エージェントに任せる）
# - red  ：src/ ではテストファイル（*.test.ts / *.test.tsx）だけ編集できる
# - green：src/ ではテストファイル以外だけ編集できる
# 誰が操作しているかは、フック入力の agent_type で判定する（本体のときは空）
set -uo pipefail

input=$(cat)
role=$(jq -r '.agent_type // empty' <<<"$input")
tool=$(jq -r '.tool_name // empty' <<<"$input")
case "$role" in
  red | green) ;;
  *) role=main ;;
esac

block() {
  echo "$1" >&2
  exit 2
}

main_msg="src/ は本体から編集できません。テストは red エージェント、実装は green エージェントに Agent ツールで依頼してください。"

is_test() { [[ "$1" =~ \.test\.tsx?$ ]]; }

check_file() {
  local path="${1#"${CLAUDE_PROJECT_DIR:-$PWD}"/}"
  path="${path#./}"
  [[ "$path" == src/* ]] || return 0
  case "$role" in
    main) block "$main_msg" ;;
    red) is_test "$path" || block "red はテストファイル（*.test.ts / *.test.tsx）だけ編集できます: $path" ;;
    green) is_test "$path" && block "green はテストファイルを編集できません。テストがおかしいと思ったら、直さずに報告してください: $path" ;;
  esac
  return 0
}

case "$tool" in
  Edit | Write | MultiEdit | NotebookEdit)
    check_file "$(jq -r '.tool_input.file_path // .tool_input.notebook_path // empty' <<<"$input")"
    ;;
  Bash)
    # ファイル編集は Edit / Write で行う。Bash で src/ に書き込むコマンドは誰でもブロック
    cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
    [[ "$cmd" == *src/* ]] || exit 0
    stripped=$(sed -E 's/[0-9]*>&[0-9]+//g; s#[0-9]*>+ *(/dev/null|/tmp/[^ ]*)##g' <<<"$cmd")
    if grep -Eq '(^|[^0-9])>|\bsed\b[^|;&]*-i|\btee\b|\bpython3?\b|\bnode +-e|\bperl\b|\b(cp|mv|rm|truncate|patch)\b|git +(checkout|restore|apply)' <<<"$stripped"; then
      block "Bash で src/ のファイルを書き換えることはできません。Edit / Write ツールを使ってください（本体からは red / green エージェント経由で）。"
    fi
    ;;
esac
exit 0
