import { describe, expect, it } from 'vitest';
import { stateHash } from '../hash';
import { mulberry32 } from '../rng';
import { runLevelVerifier } from '../index';
import level001 from '../../../levels/ch1/level_001.json';

describe('determinism', () => {
  it('state hash ignores hand order', () => {
    const a = JSON.parse(JSON.stringify(level001.initialState));
    const b = JSON.parse(JSON.stringify(level001.initialState));
    b.hands[0] = [...b.hands[0]].reverse();
    expect(stateHash(a)).toBe(stateHash(b));
  });

  it('rng repeatability', () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('same seed yields same report core metrics', () => {
    const a = runLevelVerifier(level001, { seed: 42, minRolloutsPerMove: 2, topK: 3 });
    const b = runLevelVerifier(level001, { seed: 42, minRolloutsPerMove: 2, topK: 3 });
    expect(a.result.bestLineWinRate).toBe(b.result.bestLineWinRate);
    expect(a.result.decisionPoints.length).toBe(b.result.decisionPoints.length);
  });
});
