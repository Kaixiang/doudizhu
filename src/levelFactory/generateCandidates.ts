import { applyMove } from '../engine/reducer.ts';
import { RANKS, GameState, Rank } from '../engine/types.ts';
import { chooseBotMove } from '../ai/botHeuristic.ts';
import { deriveSeed, mulberry32 } from '../verifier/rng.ts';

export type CandidateMode = 'start' | 'mid' | 'end' | 'mixed';

export type Candidate = {
  candidateId: string;
  initialState: GameState;
  meta: {
    mode: CandidateMode;
    sourcePly: number;
    remain: [number, number, number];
  };
};

const fullDeck = (): Rank[] => {
  const d: Rank[] = [];
  RANKS.forEach((r) => {
    const n = r === 'BJ' || r === 'RJ' ? 1 : 4;
    for (let i = 0; i < n; i += 1) d.push(r);
  });
  return d;
};

const shuffle = (arr: Rank[], rng: () => number): Rank[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const dealState = (rng: () => number): GameState => {
  const deck = shuffle(fullDeck(), rng);
  const hands: Record<0 | 1 | 2, Rank[]> = { 0: [], 1: [], 2: [] };
  deck.forEach((c, i) => hands[(i % 3) as 0 | 1 | 2].push(c));
  return {
    hands,
    currentPlayer: 0,
    roles: { 0: 'landlord', 1: 'farmerA', 2: 'farmerB' },
    trick: { lastMove: null, lastPlayer: null, passCount: 0 },
    history: [],
    winner: null
  };
};

const rollToPly = (state: GameState, targetPly: number): GameState => {
  let s = JSON.parse(JSON.stringify(state)) as GameState;
  for (let i = 0; i < targetPly && s.winner === null; i += 1) {
    s = applyMove(s, chooseBotMove(s));
  }
  return s;
};

export const generateCandidates = (count: number, mode: CandidateMode, seed: number): Candidate[] => {
  const out: Candidate[] = [];
  for (let i = 0; i < count; i += 1) {
    const rng = mulberry32(deriveSeed(seed, i + 1));
    const pickedMode =
      mode === 'mixed' ? (['start', 'mid', 'end'][Math.floor(rng() * 3)] as CandidateMode) : mode;
    const base = dealState(rng);

    let sourcePly = 0;
    let initial = base;
    if (pickedMode === 'mid') {
      sourcePly = 6 + Math.floor(rng() * 7);
      initial = rollToPly(base, sourcePly);
    } else if (pickedMode === 'end') {
      sourcePly = 12 + Math.floor(rng() * 12);
      initial = rollToPly(base, sourcePly);
    }

    out.push({
      candidateId: `cand_${seed}_${i.toString().padStart(6, '0')}`,
      initialState: initial,
      meta: {
        mode: pickedMode,
        sourcePly,
        remain: [initial.hands[0].length, initial.hands[1].length, initial.hands[2].length]
      }
    });
  }
  return out;
};
