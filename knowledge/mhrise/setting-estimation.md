---
type: Algorithm
title: 設定推測（テーブル移行から）
description: 本前兆（AT 当選）ごとに確定したテーブル予想を並べ、テーブル移行率から設定1〜6それぞれの割合を計算する方法。
tags: [mhrise, estimation, setting-estimation]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T13:58:45Z" }
sources:
  - id: quest-tables-ts
    resource: ../../src/machines/mhrise/questTables.ts
    title: src/machines/mhrise/questTables.ts（コミット 7d66ef6 時点）
  - id: table-transitions-ts
    resource: ../../src/machines/mhrise/tableTransitions.ts
    title: src/machines/mhrise/tableTransitions.ts（2026-11-25 時点）
  - id: setting-estimation-ts
    resource: ../../src/machines/mhrise/settingEstimation.ts
    title: src/machines/mhrise/settingEstimation.ts（2026-11-25 時点）
  - id: setting-estimation-test
    resource: ../../src/machines/mhrise/settingEstimation.test.ts
    title: src/machines/mhrise/settingEstimation.test.ts（2026-11-25 時点）
  - id: quest-table-tsx
    resource: ../../src/machines/mhrise/QuestTable.tsx
    title: src/machines/mhrise/QuestTable.tsx（2026-11-25 時点）
  - id: quest-table-test
    resource: ../../src/machines/mhrise/QuestTable.test.tsx
    title: src/machines/mhrise/QuestTable.test.tsx（2026-11-25 時点）
  - id: nana-press
    resource: https://nana-press.com/kaiseki/machine/837/25362/
    title: なな徹「【スマスロ モンハンライズ】クエストテーブルの詳細（移行抽選や示唆演出など）」（更新日 2026/03/25 時点）
---

最終的に知りたいのは「今打っている台の設定はどれか」。そのために、[テーブル推測](table-estimation.md)で本前兆ごとに確定したテーブル予想を並べ、「前のテーブル → 次のテーブル」の移り方が、どの設定の[テーブル移行率](table-transitions.md)でいちばん起こりやすいかを比べて、設定1〜6の割合（合計 100%）を出す。

考え方は 2026-11-25 にユーザーと決めたもの。計算は `settingEstimation.ts` の `calcSettingRates` に実装し、クエストテーブル画面に表示している。[^setting-estimation-ts] [^quest-table-tsx]

# 画面

クエストテーブル画面の「n回目のテーブル予想」の一覧の下に、「設定推測」の欄を出す。[^quest-table-tsx]

| 確定した予想 | 表示                                                    |
| ------------ | ------------------------------------------------------- |
| 0個          | 欄を出さない                                            |
| 1個          | 見出しと「本前兆2回目から設定の割合を表示します。」だけ |
| 2個以上      | 設定1〜設定6 の割合（小数1桁の %）                      |

テストでは「大社跡でフェイク前兆 → 寒冷群島で本前兆」を1セットとし、2セット後に設定1〜6 が 21.5／21.0／20.5／14.6／11.8／10.7% と出ることを確かめている。どちらの予想もテーブルA（57.7%）と予想されるので、A → A として計算した値。[^quest-table-test]

# 実装

- `calcSettingRates(predictions: TableRates[]): Record<Setting, number>`：本前兆ごとのテーブル予想（古い順）を受け取り、設定1〜6の割合（%）を返す。[^setting-estimation-ts]
- 内部の `decideTable(rates)` が、予想ごとにいちばん割合が高いテーブルを1つ選ぶ。4テーブルとも同じ割合なら選べない（`null`）。[^setting-estimation-ts]
- 内部の `likelihood(tables, setting)` が、選んだテーブルの並びの移行率を掛け合わせる。[^setting-estimation-ts]
- 入力の配列は変更しない。[^setting-estimation-test]

# 前提

- アプリでは、本前兆でテーブル予想を確定し、4テーブルの割合として保持している。本前兆の次から新しい履歴で次の予想を始める。[^quest-tables-ts]
- 本前兆はクエスト成功で、AT 当選にあたる。テーブル移行抽選は AT 当選時に行われる。[^nana-press]
- つまり、1つ目の予想のテーブルから、AT 当選時の移行抽選を経て、2つ目の予想のテーブルに移ったとみなせる。
- 移行率は設定ごとに `TABLE_TRANSITION_RATES[今のテーブル][設定][移行先]` で引ける。[^table-transitions-ts]

# 流れ

1. 1回目の本前兆：テーブル予想が1つ確定する。移り方がまだないので、設定の割合は出せない。
2. 次のクエストの履歴を増やしていく。
3. 2回目の本前兆：テーブル予想が2つになり、初めて「1つ目 → 2つ目」の移り方から設定の割合が出せる。
4. 以降、本前兆のたびに予想が1つ増え、すべての予想を使って設定の割合を計算し直す。

# 計算

**各予想は、いちばん割合が高いテーブルに決まったものとして扱う。** 予想の割合（例：テーブルA 57.7%・天国準備 35.9%）をすべて混ぜて計算すると、設定の差が薄まって推測があいまいになるため。画面に「〇〇と予想。」と出ているテーブルをそのまま使う。[^setting-estimation-ts]

1. **テーブルを決める**：予想ごとに、いちばん割合が高いテーブルを1つ選ぶ。同率で一番が複数あるときは、テーブルA → テーブルB → 天国準備 → 天国 の順で先のもの（画面の予想表示と同じ規則）。[^setting-estimation-ts] [^quest-tables-ts]
2. **見込みを出す**：設定 s ごとに、決めたテーブルの並びで隣り合う「前 → 次」の移行率をすべて掛け合わせる。たとえば A → A → 天国 なら、見込み(s) = 移行率(s, A → A) × 移行率(s, A → 天国)。[^setting-estimation-ts]
3. **割合にする**：設定1〜6の見込みを、合計が 100% になるように割り振る。設定の事前確率は均等とみなす。[^setting-estimation-ts]

次のときは、全設定 0% を返す（0 除算で NaN にしない）。[^setting-estimation-ts] [^setting-estimation-test]

- 予想が 0〜1 個（移り方がまだない）
- 4テーブルとも同じ割合の予想（「全テーブルの可能性あり。」）が1つでもある
- 見込みの合計が 0（天国準備 → テーブルA など、どの設定でもあり得ない移り方）

# 例

| 予想の並び   | 設定1 | 設定2 | 設定3 | 設定4 | 設定5 | 設定6 |
| ------------ | ----- | ----- | ----- | ----- | ----- | ----- |
| A → A        | 21.5% | 21.0% | 20.5% | 14.6% | 11.8% | 10.7% |
| A → 天国     | 15.1% | 15.4% | 15.7% | 17.4% | 18.0% | 18.5% |
| A → 天国準備 | 7.8%  | 8.2%  | 8.6%  | 20.8% | 26.8% | 27.7% |
| A → A → A    | 25.8% | 24.6% | 23.5% | 11.9% | 7.7%  | 6.5%  |

A → A は、A → A の移行率（50.0／48.8／47.7／34.0／27.4／25.0）をそのまま割り振ったもの。設定1と設定6の比は 50:25 = 2:1 で、割合にすると 21.5% と 10.7% になる。本前兆を重ねて予想が増えるほど、設定ごとの差が掛け合わさって開いていく。[^setting-estimation-test] [^table-transitions-ts]

# 注意点

- 移行率の表（[テーブル移行率](table-transitions.md)）は、出典との目視確認がまだの draft。
- 予想が外れていても、いちばん割合が高いテーブルを確定として扱う。予想が外れて「天国準備 → テーブルA」のようなあり得ない移り方になると、それ以降はずっと全設定 0% になる。
- 天国滞在中に CZ 成功や AT 直撃で当選したときは、次も天国が濃厚という特別なルールがあるが、この計算には入れていない。[^nana-press]
- 設定変更（リセット）時の初期テーブル（75% 以上で天国準備か天国）は、計算に入れていない。[^nana-press]
- 予想を記録していない AT 当選（取りこぼし）があると、移り方の前提がずれる。

[^quest-tables-ts]: src/machines/mhrise/questTables.ts（コミット 7d66ef6 時点）

[^table-transitions-ts]: src/machines/mhrise/tableTransitions.ts（2026-11-25 時点）

[^setting-estimation-ts]: src/machines/mhrise/settingEstimation.ts（2026-11-25 時点）

[^setting-estimation-test]: src/machines/mhrise/settingEstimation.test.ts（2026-11-25 時点）

[^quest-table-tsx]: src/machines/mhrise/QuestTable.tsx（2026-11-25 時点）

[^quest-table-test]: src/machines/mhrise/QuestTable.test.tsx（2026-11-25 時点）

[^nana-press]: なな徹「【スマスロ モンハンライズ】クエストテーブルの詳細（移行抽選や示唆演出など）」（更新日 2026/03/25 時点）
