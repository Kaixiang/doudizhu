import { MoveStat } from './types.ts';

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export const uniqueSolutionScore = (topMoves: MoveStat[], eps: number, k: number): number => {
  if (topMoves.length === 0) return 0;
  const best = topMoves[0].pHat;
  const near = topMoves.filter((m) => m.pHat >= best - eps).length;
  return 1 - clamp((near - 1) / Math.max(1, k), 0, 1);
};
