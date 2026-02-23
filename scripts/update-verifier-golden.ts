import fs from 'node:fs';
import path from 'node:path';
import { runLevelVerifier } from '../src/verifier';

const level = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'levels/golden/golden_001.json'), 'utf-8'));
const report = runLevelVerifier(level, { seed: 12345, minRolloutsPerMove: 50, topK: 5 });
const baseline = {
  bestLineWinRate: report.result.bestLineWinRate,
  numDecisionPoints: report.result.decisionPoints.length,
  primaryDecisionPlyIndex: report.result.decisionPoints[0]?.plyIndex ?? null
};
fs.writeFileSync(path.join(process.cwd(), 'verifier_golden_baseline/golden_001.json'), JSON.stringify(baseline, null, 2));
console.log('updated verifier golden baseline');
