import { chooseBotMove } from '../../ai/botHeuristic';
import { Move } from '../../engine/types';
import { assertLegalMove } from '../policy';
import { Policy } from '../types';

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
