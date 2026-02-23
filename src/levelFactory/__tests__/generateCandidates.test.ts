import { describe, expect, it } from 'vitest';
import { generateCandidates } from '../generateCandidates';

describe('generateCandidates', () => {
  it('is deterministic by seed', () => {
    const a = generateCandidates(5, 'mixed', 123);
    const b = generateCandidates(5, 'mixed', 123);
    expect(a.map((x) => x.candidateId)).toEqual(b.map((x) => x.candidateId));
    expect(a[0].meta).toEqual(b[0].meta);
  });

  it('generates valid states with non-empty hands', () => {
    const c = generateCandidates(10, 'start', 1);
    expect(c.every((x) => x.initialState.hands[0].length > 0)).toBe(true);
  });
});
