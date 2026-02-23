import { describe, expect, it } from 'vitest';
import level001 from '../../../levels/ch1/level_001.json';
import { HeuristicPolicy } from '../policies/HeuristicPolicy';
import { simulateOneGame } from '../simulate';
import { mulberry32 } from '../rng';

describe('simulateOneGame', () => {
  it('terminates without crash', () => {
    for (let i = 0; i < 20; i += 1) {
      const out = simulateOneGame(level001.initialState as any, { 0: HeuristicPolicy, 1: HeuristicPolicy, 2: HeuristicPolicy }, mulberry32(i + 1), 100);
      expect(['NORMAL_END', 'MAX_PLIES_GUARD']).toContain(out.terminalReason);
      expect(out.plies.length).toBeGreaterThan(0);
    }
  });
});
