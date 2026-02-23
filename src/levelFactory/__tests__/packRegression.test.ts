import { describe, expect, it } from 'vitest';

const within = (a: number, b: number, t: number) => Math.abs(a - b) <= t;

describe('pack regression thresholds', () => {
  it('detects drift violations', () => {
    const baseline = { bestWinRate: 0.84, primaryPly: 6, primaryDelta: 0.28 };
    const current = { bestWinRate: 0.7, primaryPly: 9, primaryDelta: 0.18 };
    expect(within(current.bestWinRate, baseline.bestWinRate, 0.05)).toBe(false);
    expect(current.primaryPly === baseline.primaryPly).toBe(false);
    expect(current.primaryDelta >= 0.2).toBe(false);
  });
});
