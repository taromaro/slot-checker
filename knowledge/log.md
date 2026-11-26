# Bundle history

## 2026-11-25

- **Update**: [設定推測（テーブル移行から）](mhrise/setting-estimation.md) の計算方法を変更。予想の割合を混ぜると設定の差が薄まるため、各予想はいちばん割合が高いテーブルに決まったものとして、その並びの移行率を掛け合わせる方式にした（ユーザーの判断）。例と注意点も書き直した。
- **Update**: [設定推測（テーブル移行から）](mhrise/setting-estimation.md) に「画面」の節を追加。クエストテーブル画面のテーブル予想一覧の下に、設定1〜6の割合を出すようにした。
- **Update**: [設定推測（テーブル移行から）](mhrise/setting-estimation.md) に実装（`calcSettingRates`）とテストの内容を追記。計算が実装・テスト済みになったので `status: draft` を外した（画面への表示はまだ）。
- **Addition**: [設定推測（テーブル移行から）](mhrise/setting-estimation.md) を追加。本前兆ごとのテーブル予想を並べ、移行率から設定の割合を出す設計（未実装なので draft）。[テーブル移行率](mhrise/table-transitions.md) の「アプリでの使い道」をこの記事へのリンクに置き換えた。
- **Addition**: [テーブル移行率](mhrise/table-transitions.md) を追加。なな徹の解析ページ（更新日 2026/03/25）から、滞在テーブル別・設定別の移行率と移行のルールを書き起こした。表の列は見出しの順に組み立て直したもので、出典との目視の突き合わせがまだなので `status: draft`。
- **Update**: [テーブル推測](mhrise/table-estimation.md) をコミット 7d66ef6 に合わせて更新。実装がコミットされたので `status: draft` を外し、出典の表記を直した。画面（前兆ボタンでの記録と、確定した予想の一覧）の節と、その出典の `QuestTable.tsx` を追加した。
- **Creation**: OKF v0.3 バンドルを作成。[プロジェクトの時系列](references/project-timeline.md)、[TDD とサブエージェント](decisions/tdd-with-subagents.md)、[機種ごとのフォルダ](decisions/machine-folders.md)、[編集ガード](policies/edit-guards.md)、[TDD の手順](playbooks/tdd-workflow.md)、[カバネリ概要](kabaneri/overview.md)、[クエストテーブル](mhrise/quest-tables.md)、[テーブル推測](mhrise/table-estimation.md) を、git log・CLAUDE.md・`.claude/`・`docs/mhrise-todo.md`・ソースコードから起こした。
