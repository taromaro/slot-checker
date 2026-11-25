---
type: Timeline
title: プロジェクトの時系列
description: 2026-11-01 の初期設定から現在までの、主な出来事を日付順に並べたもの。
tags: [history, handover]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: git-log
    resource: https://github.com/taromaro/slot-checker/commits/dev
    title: slot-checker の git log（dev ブランチ）
---

slot-checker の主な出来事を、古い順に並べる。日付はコミット日。細かいコミットは省き、方針や構成が変わった点を残している。[^git-log]

詳しい理由は各決定のページ（[TDD とサブエージェント](../decisions/tdd-with-subagents.md)、[機種ごとのフォルダ](../decisions/machine-folders.md)）を参照。

# 2026-11-01 〜 11-13：カバネリのカウンターを作る

- 11-01 初期設定（React + Vite）。最初の画面は[カバネリ](../kabaneri/overview.md)向けで、チャンス目カウント・周期・下段ベルのコンポーネントがあった。同日に GitHub Pages へのデプロイを追加。[^git-log]
- 11-01 〜 11-08 CZ 発動時の履歴、プラス／マイナスのカウント機能を追加（PR #1, #2）。[^git-log]
- 11-09 〜 11-11 テストコードを追加。周期の計算ロジックを変更。CZ 関連だけ localStorage に保存するようにした。[^git-log]
- 11-13 下段ベルを追加（PR #3）。[^git-log]

# 2026-11-14：Claude Code 用のハーネスとテストの仕組み

- oxfmt を導入してコード全体を整形。[^git-log]
- Claude Code のハーネスを追加し、テスト・設定の改ざんを防ぐ hook を追加（[編集ガード](../policies/edit-guards.md)）。[^git-log]
- テスト品質を機械的にチェックする仕組み（oxlint の vitest プラグイン、カバレッジ下限）を追加。[^git-log]
- 周期の設定推測ロジックを `src/logic` に切り出してテストを追加。[^git-log]

# 2026-11-15：複数機種に対応する構成へ

- PR ごとに CI でチェックを実行し、Node を 24 に統一（PR #4）。[^git-log]
- ホーム画面に機種選択を追加し、カバネリの画面とロジックを `src/machines/kabaneri/` に移動（[機種ごとのフォルダ](../decisions/machine-folders.md)）。[^git-log]
- ホーム画面にモンハンライズの枠（準備中ページ）を追加。[^git-log]

# 2026-11-17 〜 11-25：モンハンライズのテーブル推測

- 11-17 フィールド選択ボタンと前兆決定ボタンを追加。本前兆時のテーブル割合の算出ロジックを実装。[^git-log]
- 11-23 各テーブルの比率の算出ロジックを作成（[テーブル推測](../mhrise/table-estimation.md)）。[^git-log]
- 11-25 QuestTable のテストを追加・整形（PR #5）。[^git-log]
- 11-25 「AI エージェントをうまく使うため」TDD を踏襲し、red / green のサブエージェントを定義（[TDD とサブエージェント](../decisions/tdd-with-subagents.md)）。[^git-log]

[^git-log]: slot-checker の git log（dev ブランチ）
