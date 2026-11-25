export const FIELDS = ["大社跡", "寒冷群島", "溶岩洞"] as const;
export const OMENS = ["本前兆", "フェイク前兆"] as const;
export const FIELD_BG: Record<Field, string> = {
  大社跡: "bg-blue-200",
  寒冷群島: "bg-green-200",
  溶岩洞: "bg-red-200",
};
export type Field = (typeof FIELDS)[number];
export type Omen = (typeof OMENS)[number];
type FieldRates = Record<Field, number>;
type Quest = {
  本前兆: FieldRates;
  フェイク前兆?: FieldRates;
};
type Table = {
  name: string;
  quest: Quest[];
  questExpectation: number[];
};
export const tableA: Table = {
  name: "テーブルA",
  // クエスト回数ごとの、前兆別・フィールド別の選択率（配列の 0 番目が 1 回目）
  quest: [
    // 1回目
    {
      本前兆: { 大社跡: 58.9, 寒冷群島: 33.3, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 89.7, 寒冷群島: 10.0, 溶岩洞: 0.3 },
    },
    // 2回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 9.7, 寒冷群島: 90.0, 溶岩洞: 0.3 },
    },
    // 3回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 9.7, 溶岩洞: 0.3 },
    },
    // 4回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 9.7, 寒冷群島: 90.0, 溶岩洞: 0.3 },
    },
    // 5回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 9.7, 溶岩洞: 0.3 },
    },
    // 6回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 9.7, 寒冷群島: 90.0, 溶岩洞: 0.3 },
    },
    // 7回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
    },
  ],
  // クエスト回数ごとの成功期待度（配列の 0 番目が 1 回目）
  questExpectation: [
    0.4, // 1回目
    30.1, // 2回目
    9.8, // 3回目
    44.9, // 4回目
    9.8, // 5回目
    30.1, // 6回目
    100, // 7回目
  ],
};

export const tableB = {
  name: "テーブルB",
  // クエスト回数ごとの、前兆別・フィールド別の選択率（配列の 0 番目が 1 回目）
  quest: [
    // 1回目
    {
      本前兆: { 大社跡: 58.9, 寒冷群島: 33.3, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 79.7, 寒冷群島: 20.0, 溶岩洞: 0.3 },
    },
    // 2回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 9.7, 溶岩洞: 0.3 },
    },
    // 3回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 9.7, 寒冷群島: 90.0, 溶岩洞: 0.3 },
    },
    // 4回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 9.7, 溶岩洞: 0.3 },
    },
    // 5回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 9.7, 寒冷群島: 90.0, 溶岩洞: 0.3 },
    },
    // 6回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 9.7, 溶岩洞: 0.3 },
    },
    // 7回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
    },
  ],
  // クエスト回数ごとの成功期待度（配列の 0 番目が 1 回目）
  questExpectation: [
    0.4, // 1回目
    9.8, // 2回目
    50.0, // 3回目
    9.8, // 4回目
    50.0, // 5回目
    9.8, // 6回目
    100, // 7回目
  ],
};

export const heavenPrep = {
  name: "天国準備",
  // クエスト回数ごとの、前兆別・フィールド別の選択率（配列の 0 番目が 1 回目）
  quest: [
    // 1回目
    {
      本前兆: { 大社跡: 58.9, 寒冷群島: 33.3, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 67.1, 寒冷群島: 30.0, 溶岩洞: 2.9 },
    },
    // 2回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 7.1, 寒冷群島: 90.0, 溶岩洞: 2.9 },
    },
    // 3回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 7.1, 溶岩洞: 2.9 },
    },
    // 4回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 7.1, 寒冷群島: 90.0, 溶岩洞: 2.9 },
    },
    // 5回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 90.0, 寒冷群島: 7.1, 溶岩洞: 2.9 },
    },
    // 6回目
    {
      本前兆: { 大社跡: 25.5, 寒冷群島: 66.7, 溶岩洞: 7.8 },
      フェイク前兆: { 大社跡: 7.1, 寒冷群島: 90.0, 溶岩洞: 2.9 },
    },
    // 7回目
    {
      本前兆: { 大社跡: 66.7, 寒冷群島: 25.5, 溶岩洞: 7.8 },
    },
  ],
  // クエスト回数ごとの成功期待度（配列の 0 番目が 1 回目）
  questExpectation: [
    0.4, // 1回目
    25.0, // 2回目
    50.0, // 3回目
    75.0, // 4回目
    50.0, // 5回目
    75.0, // 6回目
    100, // 7回目
  ],
};

export const heaven = {
  name: "天国",
  // クエスト回数ごとの、前兆別・フィールド別の選択率（配列の 0 番目が 1 回目）
  quest: [
    // 1回目
    {
      本前兆: { 大社跡: 58.9, 寒冷群島: 33.3, 溶岩洞: 7.8 },
    },
  ],
  // クエスト回数ごとの成功期待度（配列の 0 番目が 1 回目）
  questExpectation: [
    100, // 1回目
  ],
};

// そのテーブルで、この回にこの前兆・このフィールドになる見込み（成功期待度 × フィールド選択率）
const tableSelectionRate = (table: Table, questCount: number, field: Field, omen: Omen) => {
  if (questCount <= 0) {
    return 0;
  }

  if (questCount > table.quest.length) {
    return 0;
  }
  // その前兆になる見込み：本前兆はクエスト成功期待度、フェイク前兆は（100 − 成功期待度）
  const expectation = table.questExpectation[questCount - 1];
  const omenRate = omen === "本前兆" ? expectation : 100 - expectation;
  // その前兆のときに、このフィールドが選ばれる見込み
  const fieldRate = table.quest[questCount - 1][omen]?.[field] ?? 0;
  return omenRate * fieldRate;
};

export const calcTableRates = (questCount: number, field: Field, omen: Omen) => {
  const valueOfTableA = tableSelectionRate(tableA, questCount, field, omen);
  const valueOfTableB = tableSelectionRate(tableB, questCount, field, omen);
  const valueOfHeavenPrep = tableSelectionRate(heavenPrep, questCount, field, omen);
  const valueOfHeaven = tableSelectionRate(heaven, questCount, field, omen);
  const total = valueOfTableA + valueOfTableB + valueOfHeavenPrep + valueOfHeaven;
  const toRate = (value: number) => (total === 0 ? 0 : (value / total) * 100);

  return {
    tableA: toRate(valueOfTableA),
    tableB: toRate(valueOfTableB),
    heavenPrep: toRate(valueOfHeavenPrep),
    heaven: toRate(valueOfHeaven),
  } as const;
};

// 1回分のクエストで見た情報（どのフィールドに、どの前兆で行ったか）
export type QuestRecord = {
  field: Field;
  omen: Omen;
};

// テーブルごとに、1回目からの見込みをすべて掛け合わせる（そのテーブルで、この履歴になる見込み）
// どこかの回で見込みが 0 なら、そのテーブルは以降ずっと 0（候補から外れる）
const cumulativeSelectionRate = (table: Table, history: QuestRecord[]) =>
  history.reduce(
    (product, record, index) =>
      product * tableSelectionRate(table, index + 1, record.field, record.omen),
    1,
  );

// これまでのクエスト履歴（配列の 0 番目が 1 回目）をすべて使って、各テーブルの割合（%）を算出
export const calcCumulativeTableRates = (history: QuestRecord[]) => {
  if (history.length === 0) {
    return { tableA: 0, tableB: 0, heavenPrep: 0, heaven: 0 } as const;
  }
  const valueOfTableA = cumulativeSelectionRate(tableA, history);
  const valueOfTableB = cumulativeSelectionRate(tableB, history);
  const valueOfHeavenPrep = cumulativeSelectionRate(heavenPrep, history);
  const valueOfHeaven = cumulativeSelectionRate(heaven, history);
  const total = valueOfTableA + valueOfTableB + valueOfHeavenPrep + valueOfHeaven;
  const toRate = (value: number) => (total === 0 ? 0 : (value / total) * 100);

  return {
    tableA: toRate(valueOfTableA),
    tableB: toRate(valueOfTableB),
    heavenPrep: toRate(valueOfHeavenPrep),
    heaven: toRate(valueOfHeaven),
  } as const;
};

// クエストは最大 7 回目まで。7 回目はフェイク前兆の選択率がない（必ず本前兆）
export const MAX_QUEST_COUNT = 7;

export type TableRates = ReturnType<typeof calcCumulativeTableRates>;

export type Prediction = {
  // 本前兆の回を含む、確定までのクエスト回数
  questCount: number;
  rates: TableRates;
};

export type QuestState = {
  // 進行中の予想のクエスト履歴（配列の 0 番目が 1 回目）
  history: QuestRecord[];
  // 本前兆で確定したテーブル予想（配列の 0 番目が 1 回目の予想）
  predictions: Prediction[];
};

export const INITIAL_QUEST_STATE: QuestState = { history: [], predictions: [] };

// 前兆ボタンを押したときの状態の変化
// - フェイク前兆：履歴に追加して予想を続ける（7 回目にフェイク前兆はないので、6 回目までのときだけ）
// - 本前兆：本前兆の回も含めた履歴で予想を確定し、履歴を空にして次の予想を始める
export const recordOmen = (state: QuestState, record: QuestRecord): QuestState => {
  const history = [...state.history, record];
  if (record.omen === "本前兆") {
    return {
      history: [],
      predictions: [
        ...state.predictions,
        { questCount: history.length, rates: calcCumulativeTableRates(history) },
      ],
    };
  }
  if (history.length >= MAX_QUEST_COUNT) {
    return state;
  }
  return { ...state, history };
};

// テーブル名（表示順。同率で一番高いときは先のテーブルを予想する）
export const TABLE_LABELS = [
  { label: "テーブルA", key: "tableA" },
  { label: "テーブルB", key: "tableB" },
  { label: "天国準備", key: "heavenPrep" },
  { label: "天国", key: "heaven" },
] as const;

// 確定した予想から、一番可能性が高いテーブル名の文言を作る
// 4テーブルとも全く同じ割合なら、どれとも言えないので「全テーブルの可能性あり。」
export const predictTableLabel = (rates: TableRates) => {
  const values = TABLE_LABELS.map((row) => rates[row.key]);
  if (values.every((value) => value === values[0])) {
    return "全テーブルの可能性あり。";
  }
  const best = TABLE_LABELS.reduce((top, row) => (rates[row.key] > rates[top.key] ? row : top));
  return `${best.label}と予想。`;
};
