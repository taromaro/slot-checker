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

//期待度をクエスト回数とフィールドと、前兆の違いを使って算出
const tableSelectionRate = (table: Table, questCount: number, field: Field, omen: Omen) => {
  if (questCount <= 0) {
    return 0;
  }

  if (questCount > table.quest.length) {
    return 0;
  }
  return table.quest[questCount - 1][omen]?.[field] ?? 0;
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
