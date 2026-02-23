import { MovePattern, RANK_VALUE } from './types';

export const canBeat = (attempt: MovePattern, target: MovePattern | null): boolean => {
  if (attempt.type === 'INVALID' || attempt.type === 'PASS') return false;
  if (target === null) return true;
  if (target.type === 'INVALID' || target.type === 'PASS') return true;

  if (attempt.type === 'ROCKET') return true;
  if (target.type === 'ROCKET') return false;

  if (attempt.type === 'BOMB' && target.type !== 'BOMB') return true;
  if (attempt.type !== target.type) return false;
  if ((attempt.length ?? 0) !== (target.length ?? 0)) return false;
  if (!attempt.mainRank || !target.mainRank) return false;

  return RANK_VALUE[attempt.mainRank] > RANK_VALUE[target.mainRank];
};
