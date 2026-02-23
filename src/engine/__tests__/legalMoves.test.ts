import { describe, expect, it } from 'vitest';
import { listLegalMoves } from '../legalMoves';
import { classifyMove } from '../pattern';
import { GameState } from '../types';

const baseState: GameState = {
  hands: {
    0: ['3', '3', '4', '5', '6'],
    1: ['7', '7'],
    2: ['8', '8']
  },
  currentPlayer: 0,
  roles: { 0: 'landlord', 1: 'farmerA', 2: 'farmerB' },
  trick: { lastMove: null, lastPlayer: null, passCount: 0 },
  history: [],
  winner: null
};

describe('listLegalMoves', () => {
  it('returns legal opening moves without duplicates', () => {
    const moves = listLegalMoves(baseState);
    const keys = moves.map((m) => (m.kind === 'PASS' ? 'PASS' : m.cards.join('-')));
    expect(new Set(keys).size).toBe(keys.length);
    moves.forEach((m) => {
      if (m.kind === 'PLAY') expect(classifyMove(m.cards).type).not.toBe('INVALID');
    });
  });

  it('contains pass and only beating moves in follow round', () => {
    const moves = listLegalMoves({ ...baseState, trick: { lastMove: classifyMove(['4']), lastPlayer: 1, passCount: 0 } });
    expect(moves.some((m) => m.kind === 'PASS')).toBe(true);
    moves.forEach((m) => {
      if (m.kind === 'PLAY') expect(['5', '6']).toContain(m.cards[0]);
    });
  });
});
