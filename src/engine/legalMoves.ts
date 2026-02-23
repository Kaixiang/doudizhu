import { canBeat } from './compare';
import { classifyMove } from './pattern';
import { GameState, Move, Rank } from './types';

const combinations = <T,>(arr: T[], k: number): T[][] => {
  const result: T[][] = [];
  const path: T[] = [];
  const dfs = (start: number): void => {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i += 1) {
      path.push(arr[i]);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(0);
  return result;
};

export const listLegalMoves = (state: GameState): Move[] => {
  const hand = [...state.hands[state.currentPlayer]].sort();
  const seen = new Set<string>();
  const legal: Move[] = [];
  const freshRound = state.trick.lastMove === null || state.trick.lastPlayer === state.currentPlayer;

  for (let size = 1; size <= hand.length; size += 1) {
    for (const combo of combinations(hand, size)) {
      const pattern = classifyMove(combo as Rank[]);
      if (pattern.type === 'INVALID') continue;
      if (!freshRound && !canBeat(pattern, state.trick.lastMove)) continue;
      const key = pattern.cards.join('-');
      if (seen.has(key)) continue;
      seen.add(key);
      legal.push({ kind: 'PLAY', cards: pattern.cards, pattern });
    }
  }

  legal.sort((a, b) => (a.kind === 'PASS' ? 1 : b.kind === 'PASS' ? -1 : a.cards.length - b.cards.length));

  if (!freshRound) {
    legal.push({ kind: 'PASS' });
  }

  return legal;
};
