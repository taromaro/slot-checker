---
type: Algorithm
title: テーブル推測
description: クエストの履歴（フィールドと前兆）から、4テーブルそれぞれの割合を計算する方法。
tags: [mhrise, estimation]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:37:20Z" }
sources:
  - id: quest-tables-ts
    resource: ../../src/machines/mhrise/questTables.ts
    title: src/machines/mhrise/questTables.ts（コミット 7d66ef6 時点）
  - id: quest-table-tsx
    resource: ../../src/machines/mhrise/QuestTable.tsx
    title: src/machines/mhrise/QuestTable.tsx（コミット 7d66ef6 時点）
  - id: mhrise-todo
    resource: ../../docs/mhrise-todo.md
    title: モンハンライズ クエストテーブル推測 やることリスト
---

クエストごとに「どのフィールドに行き、どの前兆だったか」を記録し、その履歴から4つの[クエストテーブル](quest-tables.md)それぞれの割合（合計 100%）を出す。実装はコミット 7d66ef6（クエスト履歴からテーブルを予想する）で入った。[^quest-tables-ts]

# 計算

1. **1回分の見込み**：あるテーブルで、n 回目にその前兆・そのフィールドになる見込みを「前兆の見込み × フィールド選択率」で出す。本前兆なら成功期待度、フェイク前兆なら（100 − 成功期待度）を前兆の見込みにする。テーブルにその回がなければ 0。[^quest-tables-ts]
2. **履歴全体の見込み**：1回目からの見込みをテーブルごとにすべて掛け合わせる。どこかの回で 0 になったテーブルは、候補から外れる。[^quest-tables-ts]
3. **割合にする**：4テーブルの値を、合計が 100% になるように割り振る。事前確率を均等とみなす前提。履歴が空、または合計が 0 なら全部 0%。[^quest-tables-ts] [^mhrise-todo]

# 状態の変化

- **フェイク前兆**：履歴に追加して予想を続ける。7回目にフェイク前兆はないので、追加できるのは6回目まで。[^quest-tables-ts]
- **本前兆**：本前兆の回も含めた履歴で予想を確定し、履歴を空にして次の予想を始める。[^quest-tables-ts]
- **表示**：一番割合が高いテーブルを「〇〇と予想。」と出す。同率で一番なら、テーブルA → テーブルB → 天国準備 → 天国 の順で先のものを選ぶ。4つとも同じなら「全テーブルの可能性あり。」と出す。[^quest-tables-ts]

# 画面

- フィールドを選んで前兆ボタン（本前兆／フェイク前兆）を押すと、そのフィールドと前兆を履歴に記録する。[^quest-table-tsx]
- 進行中の履歴から計算した4テーブルの割合を表示する。[^quest-table-tsx]
- 本前兆で確定した予想は「n回目のテーブル予想」として一覧に残る。各予想には、何回目のクエストで本前兆だったか、4テーブルの割合（小数1桁の %）、予想テーブル名を出す。[^quest-table-tsx]

# 今後の候補

- 事前確率を均等以外にする（例：リセット時は 75% 以上で天国準備 or 天国）。[^mhrise-todo]
- [テーブル移行率](table-transitions.md)（設定ごと）を使って、設定推測につなげる。[^mhrise-todo]

[^quest-tables-ts]: src/machines/mhrise/questTables.ts（コミット 7d66ef6 時点）

[^quest-table-tsx]: src/machines/mhrise/QuestTable.tsx（コミット 7d66ef6 時点）

[^mhrise-todo]: モンハンライズ クエストテーブル推測 やることリスト
