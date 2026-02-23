import { describe, expect, it } from 'vitest';
import { listLegalMoves } from '../../engine/legalMoves';
import level001 from '../../../levels/ch1/level_001.json';
import { estimateMoves } from '../estimate';
import { HeuristicPolicy } from '../policies/HeuristicPolicy';

describe('estimateMoves', () => {
  it('returns stable sorted move stats', () => {
    const legal = listLegalMoves(level001.initialState as any).slice(0, 3);
    const stats = estimateMoves(level001.initialState as any, legal, {
      minRollouts: 2,
      rolloutsPerMove: 2,
      policyBySeat: { 0: HeuristicPolicy, 1: HeuristicPolicy, 2: HeuristicPolicy },
      seed: 7,
      maxPlies: 80
    });
    expect(stats).toHaveLength(3);
    expect(stats.every((s) => s.n >= 2)).toBe(true);
    expect(stats[0].pHat).toBeGreaterThanOrEqual(stats[1].pHat);
  });
});
