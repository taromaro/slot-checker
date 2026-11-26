export const SETTINGS = [1, 2, 3, 4, 5, 6] as const;
export type Setting = (typeof SETTINGS)[number];

export const TABLE_KEYS = ["tableA", "tableB", "heavenPrep", "heaven"] as const;
export type TableKey = (typeof TABLE_KEYS)[number];

// AT 当選時に、今の滞在テーブル（1段目のキー）から移行先（3段目のキー）へ移る割合（%）。
// 設定（2段目のキー）ごと。移らない移行先は 0。
// 出典: なな徹 https://nana-press.com/kaiseki/machine/837/25362/ 滞在テーブル別の移行率
export const TABLE_TRANSITION_RATES: Record<TableKey, Record<Setting, Record<TableKey, number>>> = {
  tableA: {
    1: { tableA: 50.0, tableB: 22.7, heavenPrep: 7.0, heaven: 20.3 },
    2: { tableA: 48.8, tableB: 23.0, heavenPrep: 7.4, heaven: 20.8 },
    3: { tableA: 47.7, tableB: 23.4, heavenPrep: 7.8, heaven: 21.1 },
    4: { tableA: 34.0, tableB: 23.8, heavenPrep: 18.8, heaven: 23.4 },
    5: { tableA: 27.4, tableB: 24.2, heavenPrep: 24.2, heaven: 24.2 },
    6: { tableA: 25.0, tableB: 25.0, heavenPrep: 25.0, heaven: 25.0 },
  },
  tableB: {
    1: { tableA: 0, tableB: 50.0, heavenPrep: 25.0, heaven: 25.0 },
    2: { tableA: 0, tableB: 49.2, heavenPrep: 25.4, heaven: 25.4 },
    3: { tableA: 0, tableB: 48.4, heavenPrep: 25.8, heaven: 25.8 },
    4: { tableA: 0, tableB: 39.0, heavenPrep: 30.5, heaven: 30.5 },
    5: { tableA: 0, tableB: 35.2, heavenPrep: 32.4, heaven: 32.4 },
    6: { tableA: 0, tableB: 33.6, heavenPrep: 33.2, heaven: 33.2 },
  },
  heavenPrep: {
    1: { tableA: 0, tableB: 0, heavenPrep: 25.0, heaven: 75.0 },
    2: { tableA: 0, tableB: 0, heavenPrep: 24.6, heaven: 75.4 },
    3: { tableA: 0, tableB: 0, heavenPrep: 24.2, heaven: 75.8 },
    4: { tableA: 0, tableB: 0, heavenPrep: 22.3, heaven: 77.7 },
    5: { tableA: 0, tableB: 0, heavenPrep: 20.7, heaven: 79.3 },
    6: { tableA: 0, tableB: 0, heavenPrep: 19.9, heaven: 80.1 },
  },
  heaven: {
    1: { tableA: 50.0, tableB: 6.3, heavenPrep: 6.3, heaven: 37.4 },
    2: { tableA: 49.2, tableB: 6.7, heavenPrep: 6.7, heaven: 37.4 },
    3: { tableA: 48.4, tableB: 7.1, heavenPrep: 7.1, heaven: 37.4 },
    4: { tableA: 36.8, tableB: 9.4, heavenPrep: 16.4, heaven: 37.4 },
    5: { tableA: 31.7, tableB: 11.8, heavenPrep: 19.1, heaven: 37.4 },
    6: { tableA: 30.1, tableB: 12.5, heavenPrep: 20.0, heaven: 37.4 },
  },
};
