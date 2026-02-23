import { chooseBotMove } from '../../ai/botHeuristic.ts';
import { Move } from '../../engine/types.ts';
import { assertLegalMove } from '../policy.ts';
import { Policy } from '../types.ts';

export const HeuristicPolicy: Policy = {
  name: 'HeuristicPolicy',
  selectMove(state, legalMoves): Move {
    const move = chooseBotMove(state);
    assertLegalMove(move, legalMoves);
    return move;
  }
};
