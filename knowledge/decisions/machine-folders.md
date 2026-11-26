---
type: Decision
title: 機種ごとのフォルダ
description: 機種専用のソースは src/machines/<機種>/ に置き、カバレッジ 100% の対象にする。
tags: [architecture, coverage]
generated: { by: "claude-code/claude-opus-5-5", at: "2026-11-25T12:12:18Z" }
sources:
  - id: commit-coverage
    resource: https://github.com/taromaro/slot-checker/commit/552adde
    title: "コミット 552adde: カバレッジ 100% の対象を src/machines に広げる"
  - id: git-log
    resource: https://github.com/taromaro/slot-checker/commits/dev
    title: slot-checker の git log（dev ブランチ）
  - id: add-machine
    resource: ../../.claude/skills/add-machine/SKILL.md
    title: add-machine スキル
---

# 決定

2026-11-15 に決めた。機種専用の画面とロジックは `src/machines/<機種>/` にまとめる。`src/logic` は廃止した。機種専用のソースも、カバレッジ 100% を求める対象にする。[^commit-coverage]

# 経緯

ホーム画面に機種選択を追加し、[カバネリ](../kabaneri/overview.md)の画面と周期の推測ロジックを `src/machines/kabaneri/` に移した。同じ日に、モンハンライズの枠も追加した。[^git-log]

# 影響

新しい機種は `src/machines/<機種>/` に置く。localStorage のキーには `<機種>-` を前に付けて、他の機種と重ならないようにする。手順は add-machine スキルにある。[^add-machine]

[^commit-coverage]: "コミット 552adde: カバレッジ 100% の対象を src/machines に広げる"

[^git-log]: slot-checker の git log（dev ブランチ）

[^add-machine]: add-machine スキル
