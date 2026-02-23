import { ciWidth } from './stats.ts';
import { VerifierConfig, VerifierReport } from './types.ts';

export type GateResult = {
  levelId: string;
  pass: boolean;
  reasons: string[];
};

export const evaluateGate = (report: VerifierReport, config: VerifierConfig): GateResult => {
  const reasons: string[] = [];
  if (report.result.bestLineWinRate < config.bestWinRateThreshold) reasons.push('bestWinRate below threshold');
  if (report.result.decisionPoints.length === 0) reasons.push('no decision points');
  if (report.result.decisionPoints.length > config.maxDecisionPoints) reasons.push('too many decision points');
  if (ciWidth(report.result.bestLineCI95) > config.maxCIWidth) reasons.push('CI width too wide');
  const primary = report.result.decisionPoints[0];
  const delta = primary?.topMoves?.[1] ? primary.topMoves[1].deltaVsBest ?? 0 : 0;
  if (primary && delta < config.primaryDeltaThreshold) reasons.push('primary decision delta too small');
  if (report.result.uniqueSolutionScore < 0.6) reasons.push('unique score too low');
  return { levelId: report.levelId, pass: reasons.length === 0, reasons };
};
