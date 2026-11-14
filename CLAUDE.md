# slot-checker

パチスロ実戦中に使うカウンター／設定推測アプリ。現在は「カバネリ」用。
React 19 + TypeScript + Vite + Tailwind CSS v4。GitHub Pages の `/slot-checker/` で公開（`vite.config.js` の `base`）。

## コマンド

| 目的          | コマンド                                                                |
| ------------- | ----------------------------------------------------------------------- |
| 開発サーバー  | `npm run dev`（コンテナ内 5173 → ホスト 15173）                         |
| 全チェック    | `npm run check`（format:check → lint → typecheck → test:coverage）      |
| テスト（1回） | `npm run test:run` / 単体: `npx vitest run src/hooks/useCount.test.tsx` |
| 整形          | `npm run format`（oxfmt）                                               |
| Lint          | `npm run lint`（oxlint）                                                |
| 型チェック    | `npm run typecheck`                                                     |
| ビルド        | `npm run build`                                                         |

**変更を終えたら必ず `npm run check` を通すこと。** 失敗したまま完了報告しない。

### テストが失敗したとき

- 直すのは**実装側**。テスト・設定ファイル（`tsconfig.json`、`.oxlintrc.json`、`package.json`、`.claude/` など）を変えて通すのは禁止
- `@ts-ignore`、`oxlint-disable`、`it.skip`、`.only` などで黙らせるのも禁止
- テストや設定が本当に間違っていると判断したら、理由を説明してユーザーに提案し、作業を止める
- これらは `.claude/hooks/guard.sh` で機械的にブロックされる。解除できるのはユーザーだけ（`.claude/allow-config-edit` を手動で作成）

## 構成

- `src/hooks/` — 状態とロジック（`useCount`）。UI を持たない
- `src/components/` — 表示コンポーネント。共通部品は `Stepper`
- `src/App.tsx` — 画面の組み立て
- テストは対象ファイルの隣に `*.test.tsx` で置く（Vitest + Testing Library、jsdom）

## テストの書き方

- カバレッジは**下限**であって目標ではない。行を通すだけでなく、**結果の値を検証する**（「表示されている」ではなく「15 になる」）
- 実装を壊したら失敗するテストか？を意識する。不具合修正は、まず再現テストを書いて失敗を確認してから直す
- localStorage を使うコンポーネントのテストは `beforeEach(() => localStorage.clear())` を入れる
- カバレッジ下限（`vite.config.js` の `thresholds`）は引き上げるだけ。全体は現状値、`src/hooks`・`src/logic` は 90%

## 規約

- ロジック（計算・状態遷移）は hook または純粋関数に切り出し、テストを書く
- コンポーネントは named export のアロー関数（`export const Foo = () => ...`）。`App` のみ default export
- スタイルは Tailwind のユーティリティクラスのみ。CSS ファイルは増やさない
- localStorage は `useCount(storageKey)` 経由で使う。キーは機能ごとに一意にする（保存するのは CZ 関連など、リロードで消えると困る値だけ）
- localStorage アクセスは try/catch で囲む（プライベートモード対策）
- 確率計算の数値は出典の値をそのまま定数にし、意味をコメントで残す
- UI 文言・コメントは日本語

## デプロイ

`main` に push すると `.github/workflows/deploy.yml` で GitHub Pages に自動デプロイされる。普段の作業ブランチは `dev`。
push・main へのマージはユーザーの指示があるときだけ行う。

## 今後の予定（設計時に考慮する）

- 機種追加（モンハンライズ、グール）→ 機種ごとに画面を分ける構成にする想定
- CZ 解放時ポイントの履歴、周期のローカルストレージ保存
