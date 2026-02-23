import { chooseBotMove } from '../../ai/botHeuristic.ts';
import { Move } from '../../engine/types.ts';
import { assertLegalMove } from '../policy.ts';
import { Policy } from '../types.ts';

export const makeEpsilonGreedyPolicy = (epsilon: number): Policy => ({
  name: `EpsilonGreedyPolicy(e=${epsilon})`,
  selectMove(state, legalMoves, rng): Move {
    if (rng() < epsilon) {
      const idx = Math.floor(rng() * legalMoves.length);
      return legalMoves[idx];
    }
    const move = chooseBotMove(state);
    assertLegalMove(move, legalMoves);
    return move;
  }
});
