---
type: Playbook
title: "TDD の手順: src/ を変更するとき"
description: src/ に機能追加や修正をするときの手順。
tags: [process, tdd]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: claude-md
    resource: ../../CLAUDE.md
    title: CLAUDE.md
  - id: agents
    resource: ../../.claude/agents/red.md
    title: red / green エージェント定義
  - id: package-json
    resource: ../../package.json
    title: package.json のスクリプト
  - id: mhrise-todo
    resource: ../../docs/mhrise-todo.md
    title: モンハンライズ クエストテーブル推測 やることリスト
---

# Trigger

`src/` の機能追加・修正をするとき。本体は `src/` を直接編集できない（[編集ガード](../policies/edit-guards.md)）。[^claude-md]

# Steps

1. 仕様を言葉で書く。出典がある数値は、出典を確認する。[^mhrise-todo]
2. `red` エージェントに仕様を渡し、失敗するテストを書いてもらう。red は `npx vitest run <対象>` でテストが失敗することを確認する。[^agents]
3. `green` エージェントにテストファイルを渡し、テストが通る最小限の実装を書いてもらう。[^agents]
4. green が最後に `npm run check` を実行する。中身は format:check → lint → typecheck → test:coverage。[^package-json]
5. カバレッジは `src/machines` も 100% が必要。[^mhrise-todo]

[^claude-md]: CLAUDE.md

[^agents]: red / green エージェント定義

[^package-json]: package.json のスクリプト

[^mhrise-todo]: モンハンライズ クエストテーブル推測 やることリスト
