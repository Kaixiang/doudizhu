import { VerifierReport } from '../verifier/types';

export type RubricThresholds = {
  bestWinRateMin: number;
  primaryDeltaMin: number;
  maxDecisionPoints: number;
  maxCIWidth: number;
  uniqueScoreMin: number;
  maxPvLength: number;
  explainabilityMin: number;
};

export const DEFAULT_RUBRIC: RubricThresholds = {
  bestWinRateMin: 0.8,
  primaryDeltaMin: 0.25,
  maxDecisionPoints: 3,
  maxCIWidth: 0.2,
  uniqueScoreMin: 0.6,
  maxPvLength: 20,
  explainabilityMin: 0.65
};

export type ScoreBreakdown = {
  earlyDecision: number;
  deltaStrength: number;
  pvLength: number;
  uniqueness: number;
  tagDiversity: number;
  patternDiversity: number;
  total: number;
};

export const ciWidth = (report: VerifierReport): number => report.result.bestLineCI95.high - report.result.bestLineCI95.low;

export const primaryDelta = (report: VerifierReport): number => {
  const d = report.result.decisionPoints[0];
  if (!d || d.topMoves.length < 2) return 0;
  return d.topMoves[0].pHat - d.topMoves[1].pHat;
};

export const scoreBreakdown = (report: VerifierReport, tagDiversity = 0.7, patternDiversity = 0.7): ScoreBreakdown => {
  const primaryPly = report.result.decisionPoints[0]?.plyIndex ?? 99;
  const earlyDecision = primaryPly <= 8 ? 20 : Math.max(0, 20 - (primaryPly - 8) * 2);
  const deltaStrength = Math.min(25, Math.round((primaryDelta(report) / 0.4) * 25));
  const pvLen = report.artifacts.pvLine.length;
  const pvLength = pvLen <= 20 ? 15 : Math.max(0, 15 - (pvLen - 20));
  const uniqueness = Math.round(Math.max(0, Math.min(1, report.result.uniqueSolutionScore)) * 15);
  const tag = Math.round(Math.max(0, Math.min(1, tagDiversity)) * 15);
  const pattern = Math.round(Math.max(0, Math.min(1, patternDiversity)) * 10);
  return {
    earlyDecision,
    deltaStrength,
    pvLength,
    uniqueness,
    tagDiversity: tag,
    patternDiversity: pattern,
    total: earlyDecision + deltaStrength + pvLength + uniqueness + tag + pattern
  };
};
