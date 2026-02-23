import { listLegalMoves } from '../engine/legalMoves.ts';
import { applyMove } from '../engine/reducer.ts';
import { GameState } from '../engine/types.ts';
import { stateHash } from './hash.ts';
import { PoliciesBySeat, SimulationOutput } from './types.ts';

const sideOfWinner = (state: GameState): 'LANDLORD' | 'FARMERS' | 'UNKNOWN' => {
  if (state.winner === null) return 'UNKNOWN';
  return state.roles[state.winner] === 'landlord' ? 'LANDLORD' : 'FARMERS';
};

export const simulateOneGame = (
  initialState: GameState,
  policiesBySeat: PoliciesBySeat,
  rng: () => number,
  maxPlies: number
): SimulationOutput => {
  let state: GameState = JSON.parse(JSON.stringify(initialState));
  const plies: Array<{ player: number; moveKey: string }> = [];

  for (let ply = 0; ply < maxPlies; ply += 1) {
    if (state.winner !== null) {
      return { winnerSide: sideOfWinner(state), plies, terminalReason: 'NORMAL_END' };
    }
    const legal = listLegalMoves(state);
    const seat = state.currentPlayer;
    const selected = policiesBySeat[seat].selectMove(state, legal, rng);
    const selectedKey = selected.kind === 'PASS' ? 'PASS' : [...selected.cards].sort().join('-');
    const legalSet = new Set(legal.map((m) => (m.kind === 'PASS' ? 'PASS' : [...m.cards].sort().join('-'))));
    if (!legalSet.has(selectedKey)) {
      throw new Error(`Illegal move at ply=${ply} hash=${stateHash(state)} move=${selectedKey}`);
    }
    state = applyMove(state, selected);
    plies.push({ player: seat, moveKey: selectedKey });
  }

  return { winnerSide: sideOfWinner(state), plies, terminalReason: 'MAX_PLIES_GUARD' };
};
