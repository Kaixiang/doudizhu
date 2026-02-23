import { chooseBotMove } from '../../ai/botHeuristic';
import { Move } from '../../engine/types';
import { assertLegalMove } from '../policy';
import { Policy } from '../types';

export const HeuristicPolicy: Policy = {
  name: 'HeuristicPolicy',
  selectMove(state, legalMoves): Move {
    const move = chooseBotMove(state);
    assertLegalMove(move, legalMoves);
    return move;
  }
};
