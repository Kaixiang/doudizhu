import { describe, expect, it } from 'vitest';
import { listLegalMoves } from '../../engine/legalMoves';
import level001 from '../../../levels/ch1/level_001.json';
import { HeuristicPolicy } from '../policies/HeuristicPolicy';
import { makeEpsilonGreedyPolicy } from '../policies/EpsilonGreedyPolicy';
import { BiasedRandomPolicy } from '../policies/BiasedRandomPolicy';

const state = level001.initialState as any;
const legal = listLegalMoves(state);

describe('policies', () => {
  it('all policies return legal move', () => {
    const rng = () => 0.5;
    const m1 = HeuristicPolicy.selectMove(state, legal, rng);
    const m2 = makeEpsilonGreedyPolicy(0.1).selectMove(state, legal, rng);
    const m3 = BiasedRandomPolicy.selectMove(state, legal, rng);
    const key = (m: any) => (m.kind === 'PASS' ? 'PASS' : m.cards.sort().join('-'));
    const legalKeys = new Set(legal.map(key));
    expect(legalKeys.has(key(m1))).toBe(true);
    expect(legalKeys.has(key(m2))).toBe(true);
    expect(legalKeys.has(key(m3))).toBe(true);
  });

  it('epsilon 0 equals heuristic behavior', () => {
    const rng = () => 0.99;
    const h = HeuristicPolicy.selectMove(state, legal, rng);
    const e0 = makeEpsilonGreedyPolicy(0).selectMove(state, legal, rng);
    expect(e0).toEqual(h);
  });
});
