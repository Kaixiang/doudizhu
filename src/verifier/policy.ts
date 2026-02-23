import { Move } from '../engine/types';
import { Policy } from './types';

export const assertLegalMove = (selected: Move, legalMoves: Move[]): void => {
  const key = selected.kind === 'PASS' ? 'PASS' : [...selected.cards].sort().join('-');
  const ok = legalMoves.some((m) => (m.kind === 'PASS' ? 'PASS' : [...m.cards].sort().join('-')) === key);
  if (!ok) {
    throw new Error(`Policy selected illegal move: ${key}`);
  }
};

export const sampleIndex = (weights: number[], rng: () => number): number => {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return 0;
  const r = rng() * sum;
  let acc = 0;
  for (let i = 0; i < weights.length; i += 1) {
    acc += weights[i];
    if (r <= acc) return i;
  }
  return weights.length - 1;
};

export const ensurePolicy = (policy: Policy): Policy => policy;
