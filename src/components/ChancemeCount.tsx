import { useCount } from "../hooks/useCount";
import { Stepper } from "./Stepper";

type Props = {
  name: string;
  color: "red" | "green";
};

const colorClass = {
  red: "border-red-200 bg-red-50",
  green: "border-green-200 bg-green-50",
};

export const ChancemeCount = (props: Props) => {
  const { name, color } = props;

  // 発光なし
  const [nonHakkouPoint, incrementNonHakkou, decrementNonHakkou, resetNonHakkouPoint] = useCount(
    `${name}-nonHakkouPoint`,
  );
  // 発光あり
  const [hakkouPoint, incrementHakkou, decrementHakkou, resetHakkouPoint] = useCount(
    `${name}-hakkouPoint`,
  );
  // 発光不明で1ポイント
  const [p1Point, increment1p, decrement1p, resetP1Point] = useCount(`${name}-p1Point`);
  // 発光不明で15ポイント
  const [p15Point, increment15p, decrement15p, resetP15Point] = useCount(`${name}-p15Point`);
  // CZの合計ポイント
  const [totalPoint, incrementPoint, decrementPoint, pointReset] = useCount(`${name}-totalPoint`);
  const totalHakkou = nonHakkouPoint + hakkouPoint;
  const hakkouRitu = totalHakkou === 0 ? 0 : (hakkouPoint / totalHakkou) * 100;
  const list = [
    {
      name: "発光無し",
      num: nonHakkouPoint,
      onIncrement: incrementNonHakkou,
      onDecrement: decrementNonHakkou,
      point: 1,
    },
    {
      name: "発光",
      num: hakkouPoint,
      onIncrement: incrementHakkou,
      onDecrement: decrementHakkou,
      point: 15,
    },
    {
      name: "1p",
      num: p1Point,
      onIncrement: increment1p,
      onDecrement: decrement1p,
      point: 1,
    },
    {
      name: "15p",
      num: p15Point,
      onIncrement: increment15p,
      onDecrement: decrement15p,
      point: 15,
    },
  ] as const;

  return (
    <section className={`rounded-xl border p-3 ${colorClass[color]}`}>
      <h2 className="mb-2 text-lg font-bold">{name}</h2>
      <button
        onClick={() => {
          resetNonHakkouPoint();
          resetHakkouPoint();
          resetP1Point();
          resetP15Point();
          pointReset();
        }}
        className="mb-2 cursor-pointer rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-sm text-white select-none hover:bg-red-700 active:bg-red-800"
      >
        オールクリア
      </button>
      <div className="flex flex-wrap gap-2">
        {list.map((p) => (
          <Stepper
            key={p.name}
            onIncrement={() => {
              p.onIncrement();
              incrementPoint(p.point);
            }}
            onDecrement={() => {
              p.onDecrement();
              // ポイントクリア後に減らしても合計がマイナスにならないようにする
              decrementPoint(Math.min(p.point, totalPoint));
            }}
            name={p.name}
            num={p.num}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-base">
          ポイント合計: <span className="text-xl font-bold">{totalPoint}</span>
        </p>
        <p className="text-base">
          発光率: <span className="text-xl font-bold">{hakkouRitu.toFixed(1)}%</span>
        </p>
        <button
          onClick={() => pointReset()}
          className="cursor-pointer rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-red-600 select-none active:bg-red-100"
        >
          ポイントクリア
        </button>
      </div>
    </section>
  );
};
