import { useState } from "react";

export const usePoint = () => {
  const [point, setPoint] = useState(0);
  const incrementPoint = (num: number) => setPoint((prev) => prev + num)
  const [results, setResults] = useState<number[]>([]);
  const decide = () => {
    setResults(prev => [...prev, point]) 
    setPoint(0);
  }
  return [point, incrementPoint, results, decide] as const;
}