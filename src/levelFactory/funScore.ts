import { VerifierReport } from '../verifier/types.ts';
import { scoreBreakdown } from './rubric.ts';

export const funScore = (report: VerifierReport, tagDiversity = 0.7, patternDiversity = 0.7): number =>
  scoreBreakdown(report, tagDiversity, patternDiversity).total;
