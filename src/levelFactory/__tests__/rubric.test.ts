import { describe, expect, it } from 'vitest';
import { scoreBreakdown } from '../rubric.ts';

describe('rubric score', () => {
  it('returns bounded total score', () => {
    const report = {
      result: {
        uniqueSolutionScore: 0.7,
        decisionPoints: [{ plyIndex: 6, topMoves: [{ pHat: 0.9 }, { pHat: 0.6 }] }]
      },
      artifacts: { pvLine: ['a', 'b', 'c'] }
    } as any;
    const s = scoreBreakdown(report);
    expect(s.total).toBeGreaterThan(0);
    expect(s.total).toBeLessThanOrEqual(100);
  });
});
