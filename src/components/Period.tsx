import { useCount } from "../hooks/useCount";
import { CountUp } from "./CountUp";

export const Period = () => {
  const [firstPeriod, setFirstPeriod] = useCount();
  const [secondPeriod, setSecondPeriod] = useCount();
  const [thirdPeriod, setThirdPeriod] = useCount();
  const [fourthPeriod, setFourthPeriod] = useCount();
  const [fivePeriod, setFivePeriod] = useCount();
  const [sixPeriod, setSixPeriod] = useCount();

  const total =
    firstPeriod +
    secondPeriod +
    thirdPeriod +
    fourthPeriod +
    fivePeriod +
    sixPeriod;
  const rate = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  const periods = [
    { name: "1周期", num: firstPeriod, onClick: setFirstPeriod },
    { name: "2周期", num: secondPeriod, onClick: setSecondPeriod },
    { name: "3周期", num: thirdPeriod, onClick: setThirdPeriod },
    { name: "4周期", num: fourthPeriod, onClick: setFourthPeriod },
    { name: "5周期", num: fivePeriod, onClick: setFivePeriod },
    { name: "6周期", num: sixPeriod, onClick: setSixPeriod },
  ];

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-3">
      <h2 className="mb-2 text-lg font-bold">非短縮時の通常周期</h2>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {periods.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-1">
            <CountUp
              onClick={() => p.onClick()}
              name={p.name}
              num={p.num}
            />
            <p className="text-sm font-bold">{rate(p.num).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </section>
  );
};