import { classifyMove } from '../engine/pattern';
import { LevelData, RANKS } from '../engine/types';

const buildDeck = (): string[] => {
  const deck: string[] = [];
  const normals = RANKS.filter((r) => r !== 'BJ' && r !== 'RJ');
  normals.forEach((r) => {
    deck.push(r, r, r, r);
  });
  deck.push('BJ', 'RJ');
  return deck;
};

export const validateLevel = (level: LevelData): string[] => {
  const errors: string[] = [];
  if (!level.levelId) errors.push('levelId is required');
  if (!level.chapterId) errors.push('chapterId is required');
  if (!level.title) errors.push('title is required');

  const deck = buildDeck();
  const used: string[] = [];
  ([0, 1, 2] as const).forEach((pid) => {
    level.initialState.hands[pid].forEach((c) => {
      if (!deck.includes(c)) {
        errors.push(`invalid rank in player ${pid}: ${c}`);
      }
      used.push(c);
    });
  });

  const counter = new Map<string, number>();
  used.forEach((c) => counter.set(c, (counter.get(c) ?? 0) + 1));
  counter.forEach((n, c) => {
    const limit = c === 'BJ' || c === 'RJ' ? 1 : 4;
    if (n > limit) errors.push(`card overflow ${c}: ${n}`);
  });

  if (level.initialState.trick.lastMove && classifyMove(level.initialState.trick.lastMove.cards).type === 'INVALID') {
    errors.push('initialState.trick.lastMove is invalid');
  }

  level.solution.forEach((s, idx) => {
    if (classifyMove(s.expectedMove).type === 'INVALID') {
      errors.push(`solution[${idx}] expectedMove invalid`);
    }
  });

  if (level.hints.length === 0) errors.push('at least one hint is required');

  return errors;
};
