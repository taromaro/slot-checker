---
type: Decision
title: TDD とサブエージェント
description: src/ の変更は TDD で行い、テストは red エージェント、実装は green エージェントに任せる。
tags: [process, tdd, claude-code]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: claude-md
    resource: ../../CLAUDE.md
    title: CLAUDE.md
  - id: commit-tdd
    resource: https://github.com/taromaro/slot-checker/commit/9bff37f
    title: "コミット 9bff37f: AIエージェントをうまく使うためTDDを踏襲"
  - id: commit-agents
    resource: https://github.com/taromaro/slot-checker/commit/21c7d9f
    title: "コミット 21c7d9f: サブエージェント定義作成"
  - id: agents
    resource: ../../.claude/agents/red.md
    title: red / green エージェント定義
---

# 決定

2026-11-25 に決めた。`src/` の変更は TDD で進め、テストは `red` エージェント、実装は `green` エージェントに Agent ツールで依頼する。本体（メインのエージェント）は `src/` を直接編集できない。[^claude-md]

# 理由

コミットメッセージには「AIエージェントをうまく使うため」とある。[^commit-tdd] テストを書く役と実装する役を分けると、実装に合わせてテストを書いたり、テストを書き換えて通したりすることを防げる。

# 役割

- **red**：渡された仕様だけを根拠に、失敗するテストを書く。編集できるのは `*.test.ts` / `*.test.tsx` だけ。書いた後、テストが失敗することを確認する。[^agents]
- **green**：渡されたテストを通す最小限の実装を書く。テストファイルは編集しない。最後に `npm run check` を実行する。[^agents]

この役割分担は [編集ガード](../policies/edit-guards.md) の hook で強制している。手順は [TDD の手順](../playbooks/tdd-workflow.md) を参照。サブエージェントの定義は 2026-11-25 に作成した。[^commit-agents]

[^claude-md]: CLAUDE.md

[^commit-tdd]: "コミット 9bff37f: AIエージェントをうまく使うためTDDを踏襲"

[^commit-agents]: "コミット 21c7d9f: サブエージェント定義作成"

[^agents]: red / green エージェント定義
