import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import golden1 from '../../../levels/golden/golden_001.json';
import { runLevelVerifier } from '../index.ts';

describe('golden regression', () => {
  it('metrics stay within tolerance', () => {
    const current = runLevelVerifier(golden1 as any, { seed: 12345, minRolloutsPerMove: 2, topK: 3 });
    const baselinePath = path.join(process.cwd(), 'verifier_golden_baseline/golden_001.json');
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));

    expect(Math.abs(current.result.bestLineWinRate - baseline.bestLineWinRate)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(current.result.decisionPoints.length - baseline.numDecisionPoints)).toBeLessThanOrEqual(1);
    if (baseline.primaryDecisionPlyIndex !== null && current.result.decisionPoints.length > 0) {
      expect(current.result.decisionPoints[0].plyIndex).toBe(baseline.primaryDecisionPlyIndex);
    }
  });
});
