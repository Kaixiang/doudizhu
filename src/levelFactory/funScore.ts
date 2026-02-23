import { VerifierReport } from '../verifier/types';
import { scoreBreakdown } from './rubric';

export const funScore = (report: VerifierReport, tagDiversity = 0.7, patternDiversity = 0.7): number =>
  scoreBreakdown(report, tagDiversity, patternDiversity).total;
