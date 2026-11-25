# Decisions

- [TDD とサブエージェント](tdd-with-subagents.md) - src/ の変更は TDD で行い、テストは red エージェント、実装は green エージェントに任せる。
- [機種ごとのフォルダ](machine-folders.md) - 機種専用のソースは src/machines/<機種>/ に置き、カバレッジ 100% の対象にする。
