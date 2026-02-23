import fs from 'node:fs';
import path from 'node:path';
import { runLevelVerifier, measureRun } from './index';
import { stableStringify, validateReportSchema } from './reportSchema';
import { gateResultsJson, toSummaryCsv } from './summary';
import { evaluateGate } from './gates';
import { DEFAULT_VERIFIER_CONFIG } from './types';

const parseArg = (name: string, fallback?: string): string | undefined => {
  const i = process.argv.indexOf(name);
  if (i < 0) return fallback;
  return process.argv[i + 1] ?? fallback;
};

const levelsDir = parseArg('--levels', 'levels/ch1')!;
const outDir = parseArg('--out', 'reports/ch1')!;
const seed = Number(parseArg('--seed', `${DEFAULT_VERIFIER_CONFIG.seed}`));
const rollouts = Number(parseArg('--rollouts', `${DEFAULT_VERIFIER_CONFIG.minRolloutsPerMove}`));
const topK = Number(parseArg('--topK', `${DEFAULT_VERIFIER_CONFIG.topK}`));
const withGate = process.argv.includes('--gate');

const readLevels = (dir: string): any[] =>
  fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')));

const main = (): void => {
  fs.mkdirSync(outDir, { recursive: true });
  const levels = readLevels(levelsDir);
  const rows: Array<{ report: any; timeMs: number }> = [];
  const gateRows: any[] = [];

  levels.forEach((level) => {
    const { value: report, timeMs } = measureRun(() =>
      runLevelVerifier(level, {
        seed,
        minRolloutsPerMove: rollouts,
        topK
      })
    );

    const schemaErrors = validateReportSchema(report);
    if (schemaErrors.length) {
      console.error(`[${level.levelId}] schema error: ${schemaErrors.join('; ')}`);
      process.exitCode = 1;
      return;
    }

    const outputPath = path.join(outDir, `${level.levelId}.report.json`);
    fs.writeFileSync(outputPath, stableStringify(report));
    rows.push({ report, timeMs });

    if (withGate) {
      gateRows.push(evaluateGate(report, { ...DEFAULT_VERIFIER_CONFIG, seed, minRolloutsPerMove: rollouts, topK }));
    }
  });

  fs.writeFileSync(path.join(outDir, 'summary.csv'), toSummaryCsv(rows));
  if (withGate) fs.writeFileSync(path.join(outDir, 'gate_results.json'), gateResultsJson(gateRows));

  if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);
};

main();
