# slot-checker

パチスロ実戦中に使うカウンター／設定推測アプリ

## 開発の進め方

- `src/` の変更は TDD で、テストは `red` エージェント、実装は `green` エージェントに Agent ツールで依頼する
- 本体は `src/` を直接編集できない（`.claude/hooks/tdd-guard.sh` がブロックする）
