import { describe, expect, it } from 'vitest';
import { uniqueSolutionScore } from '../uniqueness';

describe('uniqueSolutionScore', () => {
  it('high when only one near-optimal move', () => {
    const score = uniqueSolutionScore(
      [
        { pHat: 0.9 },
        { pHat: 0.7 },
        { pHat: 0.4 }
      ] as any,
      0.05,
      8
    );
    expect(score).toBeGreaterThanOrEqual(0.8);
  });

  it('low when many near-optimal moves', () => {
    const score = uniqueSolutionScore(
      [
        { pHat: 0.9 },
        { pHat: 0.89 },
        { pHat: 0.88 },
        { pHat: 0.87 },
        { pHat: 0.86 },
        { pHat: 0.85 }
      ] as any,
      0.06,
      5
    );
    expect(score).toBeLessThanOrEqual(0.4);
  });
});
