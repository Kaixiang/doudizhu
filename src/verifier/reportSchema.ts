import { VerifierReport } from './types';

const isNumber = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

export const validateReportSchema = (report: VerifierReport): string[] => {
  const errors: string[] = [];
  if (!report.levelId) errors.push('levelId missing');
  if (!isNumber(report.seed)) errors.push('seed missing');
  if (!isNumber(report.rolloutCount)) errors.push('rolloutCount missing');
  if (!isNumber(report.timeBudgetMs)) errors.push('timeBudgetMs missing');
  if (!report.result) errors.push('result missing');
  if (!report.result?.bestLineCI95 || !isNumber(report.result.bestLineCI95.low) || !isNumber(report.result.bestLineCI95.high)) {
    errors.push('bestLineCI95 missing');
  }
  if (!Array.isArray(report.result?.decisionPoints)) errors.push('decisionPoints missing');
  return errors;
};

export const stableStringify = (value: unknown): string => {
  const normalize = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === 'object') {
      return Object.keys(input as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = normalize((input as Record<string, unknown>)[key]);
          return acc;
        }, {});
    }
    return input;
  };
  return JSON.stringify(normalize(value), null, 2);
};
