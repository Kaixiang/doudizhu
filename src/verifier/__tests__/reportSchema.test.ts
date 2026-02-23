import { describe, expect, it } from 'vitest';
import { validateReportSchema } from '../reportSchema.ts';
import { VerifierReport } from '../types.ts';

describe('report schema', () => {
  it('accepts valid report', () => {
    const r: VerifierReport = {
      levelId: 'L1',
      version: 1,
      engineVersion: '0.1',
      verifierVersion: '0.1',
      seed: 1,
      rolloutPolicy: 'HeuristicPolicy',
      rolloutCount: 10,
      timeBudgetMs: 1000,
      result: {
        isSolvable: true,
        bestLineWinRate: 0.8,
        bestLineCI95: { low: 0.7, high: 0.9 },
        uniqueSolutionScore: 0.8,
        decisionPoints: []
      },
      artifacts: { pvLine: [], counterExampleLines: [] }
    };
    expect(validateReportSchema(r)).toHaveLength(0);
  });
});
