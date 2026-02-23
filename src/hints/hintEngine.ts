import { LevelData } from '../engine/types';

export const getHintForStep = (level: LevelData, playerStepIndex: number): string | null => {
  const hint = level.hints.find((h) => h.stepIndex === playerStepIndex);
  return hint?.text ?? null;
};
