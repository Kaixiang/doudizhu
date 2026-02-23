import { describe, expect, it } from 'vitest';
import golden1 from '../../../levels/golden/golden_001.json';
import { findDecisionPoints } from '../decisionPoints';
import { HeuristicPolicy } from '../policies/HeuristicPolicy';
import { DEFAULT_VERIFIER_CONFIG } from '../types';

describe('decision points golden', () => {
  it('produces decision metadata with required fields', () => {
    const out = findDecisionPoints(golden1.initialState as any, HeuristicPolicy, {
      ...DEFAULT_VERIFIER_CONFIG,
      minRolloutsPerMove: 2,
      topK: 3,
      maxPlies: 60
    });
    out.decisionPoints.forEach((d) => {
      expect(typeof d.plyIndex).toBe('number');
      expect(d.stateHash.length).toBeGreaterThan(0);
      expect(d.topMoves.length).toBeGreaterThanOrEqual(1);
    });
  });
});
