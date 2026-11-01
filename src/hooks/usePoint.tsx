import { useState } from "react";

export const usePoint = () => {
  const [point, setPoint] = useState(0);
  const incrementPoint = (num: number) => setPoint((prev) => prev + num)
  const pointClear = () => setPoint(0);
  return [point, incrementPoint, pointClear] as const;
}