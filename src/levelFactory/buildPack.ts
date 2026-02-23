import fs from 'node:fs';
import path from 'node:path';
import { gateReport } from './gate';
import { VerifierReport } from '../verifier/types';

export const buildPack = (
  levels: any[],
  reports: VerifierReport[],
  outDir: string,
  packId: string,
  verifierMeta: { version: string; seed: number }
): void => {
  fs.mkdirSync(outDir, { recursive: true });
  const byLevelId = new Map(reports.map((r) => [r.levelId, r]));

  const checked = levels.map((l) => {
    const report = byLevelId.get(l.levelId);
    if (!report) throw new Error(`Missing report for ${l.levelId}`);
    const g = gateReport(report);
    if (!g.pass) throw new Error(`Gate fail ${l.levelId}: ${g.failReasons.join(',')}`);
    return {
      levelId: l.levelId,
      tags: l.tags,
      metrics: {
        bestWinRate: report.result.bestLineWinRate,
        uniqueScore: report.result.uniqueSolutionScore,
        primaryPly: report.result.decisionPoints[0]?.plyIndex ?? -1
      }
    };
  });

  fs.writeFileSync(path.join(outDir, `${packId}.levels.json`), JSON.stringify(levels, null, 2));
  fs.writeFileSync(
    path.join(outDir, `${packId}.manifest.json`),
    JSON.stringify(
      {
        packId,
        verifier: verifierMeta,
        count: checked.length,
        levels: checked
      },
      null,
      2
    )
  );
};
