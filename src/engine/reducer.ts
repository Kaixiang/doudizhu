import { listLegalMoves } from './legalMoves';
import { classifyMove } from './pattern';
import { GameState, Move, PlayerId, Rank } from './types';

const nextPlayer = (p: PlayerId): PlayerId => ((p + 1) % 3) as PlayerId;

const removeCards = (hand: Rank[], cards: Rank[]): Rank[] => {
  const copy = [...hand];
  cards.forEach((c) => {
    const idx = copy.indexOf(c);
    if (idx < 0) throw new Error(`Card ${c} not in hand`);
    copy.splice(idx, 1);
  });
  return copy;
};

export const applyMove = (state: GameState, move: Move): GameState => {
  if (state.winner !== null) return state;
  const legal = listLegalMoves(state);
  const moveKey = move.kind === 'PASS' ? 'PASS' : [...move.cards].sort().join('-');
  const isLegal = legal.some((m) => (m.kind === 'PASS' ? 'PASS' : [...m.cards].sort().join('-')) === moveKey);
  if (!isLegal) throw new Error('Illegal move');

  const current = state.currentPlayer;
  const newState: GameState = JSON.parse(JSON.stringify(state));

  if (move.kind === 'PASS') {
    newState.history.push({ player: current, move });
    newState.trick.passCount += 1;
    if (newState.trick.passCount >= 2 && newState.trick.lastPlayer !== null) {
      newState.currentPlayer = newState.trick.lastPlayer;
      newState.trick.lastMove = null;
      newState.trick.lastPlayer = null;
      newState.trick.passCount = 0;
      return newState;
    }
    newState.currentPlayer = nextPlayer(current);
    return newState;
  }

  const pattern = move.pattern ?? classifyMove(move.cards);
  newState.hands[current] = removeCards(newState.hands[current], move.cards);
  newState.history.push({ player: current, move: { kind: 'PLAY', cards: [...move.cards], pattern } });
  newState.trick.lastMove = pattern;
  newState.trick.lastPlayer = current;
  newState.trick.passCount = 0;

  if (newState.hands[current].length === 0) {
    newState.winner = current;
    return newState;
  }

  newState.currentPlayer = nextPlayer(current);
  return newState;
};
