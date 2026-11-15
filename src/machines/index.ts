import type { ComponentType } from "react";

import { KabaneriPage } from "./kabaneri/KabaneriPage";

export type Machine = {
  // URL のハッシュに使う ID（#/kabaneri）。半角英小文字で、機種ごとに一意にする
  id: string;
  // ホーム画面に表示する機種名
  name: string;
  // 設定判別ページ
  Page: ComponentType;
};

// 機種を追加したらここに登録する（ホーム画面にこの順で並ぶ）
export const MACHINES: Machine[] = [{ id: "kabaneri", name: "カバネリ", Page: KabaneriPage }];
