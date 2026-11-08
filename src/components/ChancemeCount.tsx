import { useState } from "react";
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

// それぞれ異なる変数名で 4 つのカウント状態を定義する
  const [nonHakkouPoint, incrementNonHakkou, decrementNonHakkou] = useCount();
  const [hakkouPoint, incrementHakkou, decrementHakkou] = useCount();
  const [p1Point, increment1p, decrement1p] = useCount();
  const [p15Point, increment15p, decrement15p] = useCount();
  //CZの合計ポイント
  const [totalPoint, setTotalPoint] = useState(0);

  const total = nonHakkouPoint + hakkouPoint;
  const hakkouRitu = total === 0 ? 0 : (hakkouPoint / total) * 100;
  const test = [
    { 
      name: "発光無し", 
      num: nonHakkouPoint, 
      onIncrement: incrementNonHakkou, 
      onDecrement: decrementNonHakkou,
      point: 1 
    },
    { 
      name: "発光", 
      num: hakkouPoint, 
      onIncrement: incrementHakkou, 
      onDecrement: decrementHakkou,
      point: 15
    },
    { 
      name: "1p", 
      num: p1Point, 
      onIncrement: increment1p, 
      onDecrement: decrement1p,
      point: 1 
    },
    { 
      name: "15p", 
      num: p15Point, 
      onIncrement: increment15p, 
      onDecrement: decrement15p,
      point: 15 
    },
  ] as const;

//  const total = hakkou + nonHakkou;
//  const hakkouRitu = total === 0 ? 0 : (hakkou / total) * 100;
  return (
    <section className={`rounded-xl border p-3 ${colorClass[color]}`}>
      <h2 className="mb-2 text-lg font-bold">{name}</h2>

      <div className="flex flex-wrap gap-2">
          {test.map((p) => (
            <Stepper
              onIncrement={p.onIncrement}
              onDecrement={p.onDecrement}
              name={p.name}
              num={p.num}
              onClick={() => setTotalPoint((prev) => prev + p.point)}
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
          onClick={() => setTotalPoint(0)}
          className="cursor-pointer rounded-lg border border-red-300 bg-white px-3 py-2 text-sm text-red-600 select-none active:bg-red-100"
        >
          ポイントクリア
        </button>
      </div>
    </section>
  );
};