---
type: Machine
title: カバネリ概要
description: 最初に作った機種。チャンス目・周期・下段ベルを数え、周期の当選回数から設定1と設定6のどちらに近いかを推測する。
tags: [kabaneri, machine]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: git-log
    resource: https://github.com/taromaro/slot-checker/commits/dev
    title: slot-checker の git log（dev ブランチ）
  - id: page
    resource: ../../src/machines/kabaneri/KabaneriPage.tsx
    title: src/machines/kabaneri/KabaneriPage.tsx
  - id: period-estimate
    resource: ../../src/machines/kabaneri/periodEstimate.ts
    title: src/machines/kabaneri/periodEstimate.ts
---

このアプリで最初に作った機種。2026-11-01 の初期設定のときから画面があり、11-13 までは主にカバネリの機能を作っていた。2026-11-15 に `src/machines/kabaneri/` へ移した（[機種ごとのフォルダ](../decisions/machine-folders.md)）。[^git-log] 経緯は [プロジェクトの時系列](../references/project-timeline.md) を参照。

# 画面

チャンス目カウント（無名・生駒）、周期、下段ベルの3つで構成される。[^page]

# 周期による設定推測

1〜4周期それぞれの当選・非当選の回数から、設定1と設定6のどちらに近いかを出す。事前確率は 50:50 とし、各周期の対数尤度を合計して、事後確率と尤度比（設定1が設定6の何倍この結果になりやすいか）を表示する。[^period-estimate]

| 周期  | 設定1 の当選率 | 設定6 の当選率 |
| ----- | -------------- | -------------- |
| 1周期 | 33%            | 33%            |
| 2周期 | 33%            | 57%            |
| 3周期 | 18%            | 37%            |
| 4周期 | 34%            | 47%            |

この当選率はコードの値を写したもの。[^period-estimate] コードに出典は書かれていない。

[^git-log]: slot-checker の git log（dev ブランチ）

[^page]: src/machines/kabaneri/KabaneriPage.tsx

[^period-estimate]: src/machines/kabaneri/periodEstimate.ts
