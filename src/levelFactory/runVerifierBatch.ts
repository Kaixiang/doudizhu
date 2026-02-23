import fs from 'node:fs';
import path from 'node:path';
import { runLevelVerifier, measureRun } from '../verifier';
import { stableStringify } from '../verifier/reportSchema';
import { Candidate } from './generateCandidates';
import { canonicalStateKey } from './canonicalize';
import { loadProgress, saveProgress } from './progressStore';

export type BatchRow = {
  candidateId: string;
  stateHash: string;
  bestWinRate: number;
  ciLow: number;
  ciHigh: number;
  primaryDelta: number;
  primaryPly: number;
  uniqueScore: number;
  pvLength: number;
  timeMs: number;
};

export const runVerifierBatch = (
  candidates: Candidate[],
  outDir: string,
  checkpointPath: string,
  config: { seed: number; rollouts: number; topK: number }
): BatchRow[] => {
  fs.mkdirSync(outDir, { recursive: true });
  const progress = loadProgress(checkpointPath);
  const completed = new Set(progress.completedIds);
  const rows: BatchRow[] = [];

  candidates.forEach((c) => {
    if (completed.has(c.candidateId)) return;
    const levelLike = {
      levelId: c.candidateId,
      chapterId: 'generated',
      title: c.candidateId,
      storyIntro: '',
      storyOutro: '',
      tags: [],
      version: 1,
      initialState: c.initialState,
      winCondition: 'PLAYER_SIDE_WIN',
      hints: [{ stepIndex: 0, text: 'auto' }],
      solution: [{ stepIndex: 0, expectedMove: ['3'], explain: 'auto' }]
    } as any;

    const { value: report, timeMs } = measureRun(() =>
      runLevelVerifier(levelLike, { seed: config.seed, minRolloutsPerMove: config.rollouts, topK: config.topK })
    );

    fs.writeFileSync(path.join(outDir, `${c.candidateId}.json`), stableStringify(report));
    completed.add(c.candidateId);

    const first = report.result.decisionPoints[0];
    rows.push({
      candidateId: c.candidateId,
      stateHash: canonicalStateKey(c),
      bestWinRate: report.result.bestLineWinRate,
      ciLow: report.result.bestLineCI95.low,
      ciHigh: report.result.bestLineCI95.high,
      primaryDelta: first && first.topMoves.length >= 2 ? first.topMoves[0].pHat - first.topMoves[1].pHat : 0,
      primaryPly: first?.plyIndex ?? -1,
      uniqueScore: report.result.uniqueSolutionScore,
      pvLength: report.artifacts.pvLine.length,
      timeMs
    });
  });

  saveProgress(checkpointPath, { completedIds: [...completed].sort() });
  return rows.sort((a, b) => a.candidateId.localeCompare(b.candidateId));
};
