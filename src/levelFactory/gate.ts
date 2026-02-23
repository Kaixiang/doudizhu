import { explainabilityScore } from './explainability';
import { DEFAULT_RUBRIC, primaryDelta } from './rubric';
import { VerifierReport } from '../verifier/types';

export type GateOutcome = {
  pass: boolean;
  failReasons: string[];
};

export const gateReport = (report: VerifierReport): GateOutcome => {
  const reasons: string[] = [];
  if (report.result.bestLineWinRate < DEFAULT_RUBRIC.bestWinRateMin) reasons.push('bestWinRate');
  if (primaryDelta(report) < DEFAULT_RUBRIC.primaryDeltaMin) reasons.push('primaryDelta');
  if (report.result.decisionPoints.length === 0) reasons.push('noDecisionPoint');
  if (report.result.decisionPoints.length > DEFAULT_RUBRIC.maxDecisionPoints) reasons.push('tooManyDecisionPoints');
  if (report.result.bestLineCI95.high - report.result.bestLineCI95.low > DEFAULT_RUBRIC.maxCIWidth) reasons.push('ciTooWide');
  if (report.result.uniqueSolutionScore < DEFAULT_RUBRIC.uniqueScoreMin) reasons.push('uniqueTooLow');
  if (report.artifacts.pvLine.length > DEFAULT_RUBRIC.maxPvLength) reasons.push('pvTooLong');
  if (explainabilityScore(report) < DEFAULT_RUBRIC.explainabilityMin) reasons.push('explainabilityLow');

  return { pass: reasons.length === 0, failReasons: reasons };
};
