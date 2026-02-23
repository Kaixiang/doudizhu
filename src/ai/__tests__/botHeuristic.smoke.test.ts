import { describe, expect, it } from 'vitest';
import { chooseBotMove } from '../botHeuristic';
import { applyMove } from '../../engine/reducer';
import { GameState } from '../../engine/types';

const makeState = (): GameState => ({
  hands: {
    0: ['3', '4', '5'],
    1: ['6', '7', '8'],
    2: ['9', '10', 'J']
  },
  currentPlayer: 0,
  roles: { 0: 'landlord', 1: 'farmerA', 2: 'farmerB' },
  trick: { lastMove: null, lastPlayer: null, passCount: 0 },
  history: [],
  winner: null
});

describe('bot smoke', () => {
  it('can finish random games without crash', () => {
    for (let i = 0; i < 100; i += 1) {
      let state = makeState();
      let guard = 0;
      while (state.winner === null && guard < 100) {
        const move = chooseBotMove(state);
        state = applyMove(state, move);
        guard += 1;
      }
      expect(state.winner).not.toBeNull();
    }
  });
});
