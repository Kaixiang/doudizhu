import { CI95 } from './types.ts';

export const wilsonCI95 = (wins: number, n: number): CI95 => {
  if (n <= 0) return { low: 0, high: 1 };
  const z = 1.96;
  const p = wins / n;
  const denom = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const margin = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  return {
    low: Math.max(0, (center - margin) / denom),
    high: Math.min(1, (center + margin) / denom)
  };
};

export const ciWidth = (ci: CI95): number => ci.high - ci.low;
