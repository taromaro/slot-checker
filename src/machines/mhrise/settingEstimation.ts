import type { TableRates } from "./questTables";
import { SETTINGS, TABLE_KEYS, TABLE_TRANSITION_RATES } from "./tableTransitions";
import type { Setting, TableKey } from "./tableTransitions";

const allZero = (): Record<Setting, number> => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

// 予想の中で一番割合が高いテーブルを 1 つ決める。
// 同率で一番が複数あるときは TABLE_KEYS の順（A → B → 天国準備 → 天国）で先のものを選ぶ（predictTableLabel と同じ規則）。
// 4テーブルとも同じ割合なら、どれとも決められないので null を返す。
const decideTable = (rates: TableRates): TableKey | null => {
  const values = TABLE_KEYS.map((key) => rates[key]);
  if (values.every((value) => value === values[0])) return null;
  return TABLE_KEYS.reduce((top, key) => (rates[key] > rates[top] ? key : top));
};

// 設定 s のときに、決めたテーブルの並び（古い順）が起こる見込みを求める。
// 隣り合う「前 → 次」の移行率をすべて掛け合わせる。
const likelihood = (tables: TableKey[], setting: Setting) =>
  tables.slice(1).reduce((acc, to, i) => acc * TABLE_TRANSITION_RATES[tables[i]][setting][to], 1);

// 本前兆ごとのテーブル予想（古い順）から、各設定の割合（%、合計 100）を求める。
// 各予想は割合を混ぜずに、一番割合が高いテーブルに決まったものとして扱う。
// 割合を混ぜると推測があいまいになるうえ、画面の「〇〇と予想。」と違うテーブルで計算することになるため、
// 画面に出すテーブルと同じものを使う。
// 設定の事前確率は均等とみなし、設定ごとの見込みをそのまま割り振る。
export const calcSettingRates = (predictions: TableRates[]): Record<Setting, number> => {
  // 移行が 1 回もなければ設定差は出ない
  if (predictions.length < 2) return allZero();

  const decided = predictions.map(decideTable);
  // どれとも決められない予想が 1 つでもあれば、並びが決まらないので推測しない
  if (decided.some((table) => table === null)) return allZero();
  const tables = decided as TableKey[];

  const likelihoods = SETTINGS.map((s) => likelihood(tables, s));
  const total = likelihoods.reduce((a, b) => a + b, 0);
  // あり得ない移り方しかない場合は割り振れない（0 除算で NaN にしない）
  if (total === 0) return allZero();

  const result = allZero();
  SETTINGS.forEach((s, i) => {
    result[s] = (likelihoods[i] / total) * 100;
  });
  return result;
};
