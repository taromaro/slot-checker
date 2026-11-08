import { useState } from "react";

export const useCount = () => {
  const [point, setCount] = useState(0);
  const incrementCount = () => setCount((prev) => prev + 1)
  const decrementCount = () => setCount((prev) => prev - 1)
  return [point, incrementCount, decrementCount] as const;
}