import { listLegalMoves } from '../engine/legalMoves';
import { GameState, Move } from '../engine/types';

export type BotConfig = {
  keepBomb: boolean;
};

export const chooseBotMove = (state: GameState, config: BotConfig = { keepBomb: true }): Move => {
  const legal = listLegalMoves(state);
  const plays = legal.filter((m) => m.kind === 'PLAY');
  if (plays.length === 0) return { kind: 'PASS' };

  const freshRound = state.trick.lastMove === null || state.trick.lastPlayer === state.currentPlayer;

  const sorted = [...plays].sort((a, b) => {
    if (a.kind !== 'PLAY' || b.kind !== 'PLAY') return 0;
    const aBomb = a.pattern?.type === 'BOMB' || a.pattern?.type === 'ROCKET';
    const bBomb = b.pattern?.type === 'BOMB' || b.pattern?.type === 'ROCKET';
    if (config.keepBomb && aBomb !== bBomb) return aBomb ? 1 : -1;
    if (freshRound) {
      const rankA = a.pattern?.type === 'PAIR' ? 0 : a.pattern?.type === 'SINGLE' ? -1 : 1;
      const rankB = b.pattern?.type === 'PAIR' ? 0 : b.pattern?.type === 'SINGLE' ? -1 : 1;
      if (rankA !== rankB) return rankA - rankB;
    }
    return a.cards.length - b.cards.length || a.cards.join('-').localeCompare(b.cards.join('-'));
  });

  return sorted[0];
};
