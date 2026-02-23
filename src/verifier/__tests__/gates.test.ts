import { describe, expect, it } from 'vitest';
import { evaluateGate } from '../gates.ts';
import { DEFAULT_VERIFIER_CONFIG } from '../types.ts';

describe('gates', () => {
  it('returns fail reasons', () => {
    const result = evaluateGate(
      {
        levelId: 'L',
        version: 1,
        engineVersion: '0.1',
        verifierVersion: '0.1',
        seed: 1,
        rolloutPolicy: 'H',
        rolloutCount: 10,
        timeBudgetMs: 100,
        result: {
          isSolvable: false,
          bestLineWinRate: 0.2,
          bestLineCI95: { low: 0.1, high: 0.9 },
          uniqueSolutionScore: 0.1,
          decisionPoints: []
        },
        artifacts: { pvLine: [], counterExampleLines: [] }
      },
      DEFAULT_VERIFIER_CONFIG
    );
    expect(result.pass).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
