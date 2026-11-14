import { useEffect, useState } from "react";

const loadCount = (storageKey?: string): number => {
  if (!storageKey) return 0;
  try {
    const raw = localStorage.getItem(storageKey);
    const n = Number(raw);
    return raw !== null && Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
};

export const useCount = (storageKey?: string) => {
  const [point, setCount] = useState(() => loadCount(storageKey));

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, String(point));
    } catch {}
  }, [storageKey, point]);

  const incrementCount = (num = 1) => setCount((prev) => prev + num);
  const decrementCount = (num = 1) => setCount((prev) => prev - num);
  const reset = () => setCount(0);
  return [point, incrementCount, decrementCount, reset] as const;
};
