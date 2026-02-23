import { describe, expect, it } from 'vitest';
import { selectDiverseSet } from '../selectDiverseSet.ts';

const mkReport = (id: string, ply: number, best = 0.9, second = 0.5) =>
  ({
    levelId: id,
    version: 1,
    engineVersion: '0.1',
    verifierVersion: '0.1',
    seed: 1,
    rolloutPolicy: 'H',
    rolloutCount: 2,
    timeBudgetMs: 1,
    result: {
      isSolvable: true,
      bestLineWinRate: best,
      bestLineCI95: { low: 0.8, high: 0.95 },
      uniqueSolutionScore: 0.8,
      decisionPoints: [
        {
          plyIndex: ply,
          stateHash: id,
          topMoves: [
            { moveKey: '3', pHat: best },
            { moveKey: '4', pHat: second }
          ]
        }
      ]
    },
    artifacts: { pvLine: ['3', '4'], counterExampleLines: ['4'] }
  }) as any;

describe('selectDiverseSet', () => {
  it('selects requested count deterministically', () => {
    const input = [mkReport('a', 3), mkReport('b', 2), mkReport('c', 9), mkReport('d', 1)];
    const out = selectDiverseSet(input, 3, 42);
    expect(out).toHaveLength(3);
    expect(out.map((x) => x.levelId)).toEqual(selectDiverseSet(input, 3, 42).map((x) => x.levelId));
  });
});
