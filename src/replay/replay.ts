import { GameState } from '../engine/types';

export type ReplaySnapshot = {
  step: number;
  state: GameState;
};

export const saveSnapshot = (snapshots: ReplaySnapshot[], step: number, state: GameState): ReplaySnapshot[] => {
  const cloned = JSON.parse(JSON.stringify(state)) as GameState;
  return [...snapshots, { step, state: cloned }];
};

export const jumpToSnapshot = (snapshots: ReplaySnapshot[], step: number): GameState | null => {
  const s = snapshots.find((x) => x.step === step);
  return s ? (JSON.parse(JSON.stringify(s.state)) as GameState) : null;
};
