import { GameState } from '../engine/types.ts';

const fnv1a = (input: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const sortHand = (cards: string[]): string[] => [...cards].sort();

export const stateHash = (state: GameState): string => {
  const payload = {
    currentPlayer: state.currentPlayer,
    hands: {
      0: sortHand(state.hands[0]),
      1: sortHand(state.hands[1]),
      2: sortHand(state.hands[2])
    },
    trick: {
      lastMove: state.trick.lastMove ? { type: state.trick.lastMove.type, cards: [...state.trick.lastMove.cards].sort() } : null,
      lastPlayer: state.trick.lastPlayer,
      passCount: state.trick.passCount
    }
  };
  return fnv1a(JSON.stringify(payload));
};
