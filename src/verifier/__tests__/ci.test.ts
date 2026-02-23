import { describe, expect, it } from 'vitest';
import { wilsonCI95 } from '../stats';

describe('CI', () => {
  it('wilson interval is bounded and sensible', () => {
    const ci = wilsonCI95(80, 100);
    expect(ci.low).toBeGreaterThan(0.7);
    expect(ci.high).toBeLessThanOrEqual(1);
    expect(ci.low).toBeLessThan(ci.high);
  });
});
