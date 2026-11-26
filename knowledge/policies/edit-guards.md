---
type: Policy
title: 編集ガード
description: hook で強制している編集ルール（src/ の役割分担、テスト・設定の改ざん防止）。
tags: [claude-code, hooks, tdd]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: tdd-guard
    resource: ../../.claude/hooks/tdd-guard.sh
    title: .claude/hooks/tdd-guard.sh
  - id: commit-guard
    resource: https://github.com/taromaro/slot-checker/commit/e12cab2
    title: "コミット e12cab2: テスト・設定の改ざんを防ぐ hook を追加"
---

Claude Code が作業するときの編集ルールを、PreToolUse の hook で強制している。どれも指示ではなく、hook が機械的にブロックする。

# src/ の役割分担（tdd-guard.sh）

誰が操作しているかは、hook 入力の `agent_type` で判定する。[^tdd-guard]

| 操作者                     | src/ で編集できるもの                            |
| -------------------------- | ------------------------------------------------ |
| 本体・その他のエージェント | なし                                             |
| red                        | テストファイル（`*.test.ts` / `*.test.tsx`）だけ |
| green                      | テストファイル以外だけ                           |

Bash 経由の書き換えもブロックする。本体が `src/` を読むときは Read ツールを使う。コマンドに `src` を含む文字列が入っていると、読むだけでもブロックされることがある。

背景は [TDD とサブエージェント](../decisions/tdd-with-subagents.md) を参照。

# テスト・設定の改ざん防止

2026-11-14 に追加した。テストが失敗したときに、Claude がテストや設定を書き換えて通そうとするのを防ぐ。[^commit-guard]

- 設定ファイル・CLAUDE.md・`.claude/` は常に編集禁止
- テストが失敗している間は、既存のテストを編集禁止（新規作成は可）
- `@ts-ignore` / `oxlint-disable` / `it.skip` / `.only` などの追加を禁止
- Bash 経由（`sed -i`、リダイレクト、`cp`、`rm`、`npm pkg set`）の書き換えも禁止
- ユーザーが `.claude/allow-config-edit` を作ったときだけ解除される
- Stop 時の検証に失敗すると `.claude/state/verify-failed` を置き、成功すると削除する

[^tdd-guard]: .claude/hooks/tdd-guard.sh

[^commit-guard]: "コミット e12cab2: テスト・設定の改ざんを防ぐ hook を追加"
