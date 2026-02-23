import fs from 'node:fs';
import path from 'node:path';
import { generateCandidates, CandidateMode } from './generateCandidates';
import { dedupCandidates, toNdjson } from './dedup';
import { runVerifierBatch } from './runVerifierBatch';
import { gateReport } from './gate';
import { failureStats } from './failureStats';
import { selectDiverseSet } from './selectDiverseSet';
import { materializeLevels } from './materializeLevels';

const arg = (k: string, d: string): string => {
  const i = process.argv.indexOf(k);
  if (i < 0) return d;
  return process.argv[i + 1] ?? d;
};

const count = Number(arg('--count', '1000'));
const mode = arg('--mode', 'mixed') as CandidateMode;
const seed = Number(arg('--seed', '12345'));

const outRoot = 'reports/level_factory';
fs.mkdirSync(outRoot, { recursive: true });

const raw = generateCandidates(count, mode, seed);
const { deduped, duplicateRate } = dedupCandidates(raw);
fs.writeFileSync(path.join(outRoot, 'candidates.ndjson'), toNdjson(deduped));

const rows = runVerifierBatch(deduped, path.join(outRoot, 'reports'), path.join(outRoot, 'checkpoint.json'), {
  seed,
  rollouts: 20,
  topK: 6
});

const reports = rows.map((r) => JSON.parse(fs.readFileSync(path.join(outRoot, 'reports', `${r.candidateId}.json`), 'utf-8')));
const passRows: any[] = [];
const failRows: any[] = [];
reports.forEach((r) => {
  const g = gateReport(r);
  (g.pass ? passRows : failRows).push({ candidateId: r.levelId, ...g });
});

passRows.sort((a, b) => a.candidateId.localeCompare(b.candidateId));
failRows.sort((a, b) => a.candidateId.localeCompare(b.candidateId));

fs.writeFileSync(path.join(outRoot, 'passed.ndjson'), passRows.map((x) => JSON.stringify(x)).join('\n'));
fs.writeFileSync(path.join(outRoot, 'failed.ndjson'), failRows.map((x) => JSON.stringify(x)).join('\n'));
fs.writeFileSync(path.join(outRoot, 'failure_stats.json'), JSON.stringify(failureStats(failRows), null, 2));

const selected = selectDiverseSet(reports.filter((r) => gateReport(r).pass), 30, seed);
fs.writeFileSync(path.join(outRoot, 'selected_levels.json'), JSON.stringify(selected.map((x) => x.levelId), null, 2));

const stateMap = Object.fromEntries(deduped.map((c) => [c.candidateId, c.initialState]));
materializeLevels(selected as any, stateMap, 'levels/generated/ch1', 'generated_ch1');

console.log(
  JSON.stringify(
    {
      generated: raw.length,
      deduped: deduped.length,
      duplicateRate,
      passed: passRows.length,
      failed: failRows.length,
      selected: selected.length
    },
    null,
    2
  )
);
