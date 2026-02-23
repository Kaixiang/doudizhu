import { LevelData, Rank } from '../engine/types';

const eq = (a: Rank[], b: Rank[]): boolean => [...a].sort().join('-') === [...b].sort().join('-');

export const getCoachMessage = (level: LevelData, stepIndex: number, move: Rank[]): string | null => {
  const key = level.solution.find((s) => s.stepIndex === stepIndex);
  if (!key) return null;
  if (eq(key.expectedMove, move)) return null;
  return key.coachMessage ?? `关键手第 ${stepIndex} 步偏离正确路线。`;
};
