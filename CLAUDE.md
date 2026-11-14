# slot-checker

パチスロ実戦中に使うカウンター／設定推測アプリ。現在は「カバネリ」用。
React 19 + TypeScript + Vite + Tailwind CSS v4。GitHub Pages の `/slot-checker/` で公開（`vite.config.js` の `base`）。

## コマンド

| 目的          | コマンド                                                                |
| ------------- | ----------------------------------------------------------------------- |
| 開発サーバー  | `npm run dev`（コンテナ内 5173 → ホスト 15173）                         |
| 全チェック    | `npm run check`（format:check → lint → typecheck → test:run）           |
| テスト（1回） | `npm run test:run` / 単体: `npx vitest run src/hooks/useCount.test.tsx` |
| 整形          | `npm run format`（oxfmt）                                               |
| Lint          | `npm run lint`（oxlint）                                                |
| 型チェック    | `npm run typecheck`                                                     |
| ビルド        | `npm run build`                                                         |

**変更を終えたら必ず `npm run check` を通すこと。** 失敗したまま完了報告しない。

## 構成

- `src/hooks/` — 状態とロジック（`useCount`, `usePoint`）。UI を持たない
- `src/components/` — 表示コンポーネント。共通部品は `CountUp`, `Stepper`
- `src/App.tsx` — 画面の組み立て
- テストは対象ファイルの隣に `*.test.tsx` で置く（Vitest + Testing Library、jsdom）

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
