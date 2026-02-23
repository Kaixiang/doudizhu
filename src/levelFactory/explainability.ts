import { VerifierReport } from '../verifier/types.ts';

const clamp = (x: number): number => Math.max(0, Math.min(1, x));

export const explainabilityScore = (report: VerifierReport): number => {
  const d = report.result.decisionPoints[0];
  if (!d) return 0;

  const bestKey = d.topMoves[0]?.moveKey ?? '';
  const commonPatternBonus = ['BJ', 'RJ'].some((x) => bestKey.includes(x)) ? 0.2 : 0.35;
  const visibility = d.plyIndex <= 10 ? 0.25 : 0.15;
  const tactical = report.artifacts.pvLine.length <= 20 ? 0.2 : 0.1;
  const naturalWrong = d.topMoves.length >= 3 ? 0.2 : 0.1;

  return clamp(commonPatternBonus + visibility + tactical + naturalWrong);
};
