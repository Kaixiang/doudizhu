import { classifyMove } from '../../engine/pattern.ts';
import { Move } from '../../engine/types.ts';
import { sampleIndex } from '../policy.ts';
import { Policy } from '../types.ts';

const weight = (move: Move): number => {
  if (move.kind === 'PASS') return 0.2;
  const p = classifyMove(move.cards);
  if (p.type === 'BOMB' || p.type === 'ROCKET') return 0.3;
  if (p.type === 'SINGLE' || p.type === 'PAIR') return 2.2;
  if (p.type.startsWith('AIRPLANE')) return 0.8;
  return 1;
};

export const BiasedRandomPolicy: Policy = {
  name: 'BiasedRandomPolicy',
  selectMove(_state, legalMoves, rng): Move {
    const weights = legalMoves.map(weight);
    return legalMoves[sampleIndex(weights, rng)];
  }
};
