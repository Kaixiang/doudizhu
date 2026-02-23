import { VerifierReport } from '../verifier/types.ts';

export type DifficultyBucket = 'DEMO' | 'PRACTICE' | 'EXAM';

export const inferTags = (report: VerifierReport): string[] => {
  const tags = new Set<string>();
  const top = report.result.decisionPoints[0]?.topMoves ?? [];
  const keys = top.map((m) => m.moveKey).join('|');
  if (keys.includes('BJ') || keys.includes('RJ')) tags.add('王的处理');
  if (top.some((m) => m.moveKey.split('-').length === 4)) tags.add('炸弹时机');
  if (report.result.decisionPoints[0]?.plyIndex <= 6) tags.add('控先手');
  if (report.result.uniqueSolutionScore > 0.75) tags.add('残局收官');
  if (tags.size === 0) tags.add('读牌推断');
  return [...tags];
};

export const inferDifficultyBucket = (report: VerifierReport): DifficultyBucket => {
  const ply = report.result.decisionPoints[0]?.plyIndex ?? 99;
  const pvLength = report.artifacts.pvLine.length;
  const unique = report.result.uniqueSolutionScore;
  if (ply <= 5 && pvLength <= 12) return 'DEMO';
  if (ply > 10 || unique > 0.75) return 'EXAM';
  return 'PRACTICE';
};
