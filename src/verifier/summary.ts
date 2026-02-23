import { GateResult } from './gates';
import { VerifierReport } from './types';

export const toSummaryCsv = (rows: Array<{ report: VerifierReport; timeMs: number }>): string => {
  const header = 'levelId,solvable,bestWinRate,uniqueScore,numDecisionPoints,timeMs';
  const lines = rows.map(({ report, timeMs }) =>
    [
      report.levelId,
      report.result.isSolvable,
      report.result.bestLineWinRate.toFixed(4),
      report.result.uniqueSolutionScore.toFixed(4),
      report.result.decisionPoints.length,
      timeMs
    ].join(',')
  );
  return [header, ...lines].join('\n');
};

export const gateResultsJson = (gates: GateResult[]): string => JSON.stringify(gates, null, 2);
