import { describe, expect, it } from 'vitest';
import { applyMove } from '../reducer';
import { classifyMove } from '../pattern';
import { GameState } from '../types';

const seed: GameState = {
  hands: {
    0: ['3'],
    1: ['4'],
    2: ['5']
  },
  currentPlayer: 0,
  roles: { 0: 'landlord', 1: 'farmerA', 2: 'farmerB' },
  trick: { lastMove: null, lastPlayer: null, passCount: 0 },
  history: [],
  winner: null
};

describe('applyMove', () => {
  it('ends game when hand empties', () => {
    const next = applyMove(seed, { kind: 'PLAY', cards: ['3'] });
    expect(next.winner).toBe(0);
  });

  it('resets trick after two passes', () => {
    let state: GameState = {
      ...seed,
      hands: { 0: ['3', '6'], 1: ['4'], 2: ['5'] },
      currentPlayer: 1,
      trick: { lastMove: classifyMove(['6']), lastPlayer: 0, passCount: 0 }
    };
    state = applyMove(state, { kind: 'PASS' });
    state = applyMove(state, { kind: 'PASS' });
    expect(state.trick.lastMove).toBeNull();
    expect(state.currentPlayer).toBe(0);
  });
});
