import { GameState, Move, Rank } from '../engine/types.ts';

export type WinnerSide = 'LANDLORD' | 'FARMERS' | 'UNKNOWN';

export type CI95 = {
  low: number;
  high: number;
};

export type MoveStat = {
  move: Move;
  moveKey: string;
  pHat: number;
  ci95: CI95;
  n: number;
  avgGameLength: number;
  deltaVsBest?: number;
};

export type DecisionPoint = {
  plyIndex: number;
  stateHash: string;
  topMoves: MoveStat[];
  explanationDraft: string;
};

export type VerifierArtifacts = {
  pvLine: string[];
  counterExampleLines: string[];
};

export type VerifierResult = {
  isSolvable: boolean;
  bestLineWinRate: number;
  bestLineCI95: CI95;
  uniqueSolutionScore: number;
  decisionPoints: DecisionPoint[];
};

export type VerifierReport = {
  levelId: string;
  version: number;
  engineVersion: string;
  verifierVersion: string;
  seed: number;
  rolloutPolicy: string;
  rolloutCount: number;
  timeBudgetMs: number;
  result: VerifierResult;
  artifacts: VerifierArtifacts;
};

export type VerifierConfig = {
  topK: number;
  minRolloutsPerMove: number;
  timeBudgetMsPerLevel: number;
  maxPlies: number;
  primaryDeltaThreshold: number;
  bestWinRateThreshold: number;
  maxCIWidth: number;
  seed: number;
  maxDecisionPoints: number;
  uniqueEps: number;
};

export type Policy = {
  name: string;
  selectMove: (state: GameState, legalMoves: Move[], rng: () => number) => Move;
};

export type SimulationOutput = {
  winnerSide: WinnerSide;
  plies: Array<{ player: number; moveKey: string }>;
  terminalReason: 'NORMAL_END' | 'MAX_PLIES_GUARD';
};

export type PoliciesBySeat = Record<0 | 1 | 2, Policy>;

export type EstimateConfig = {
  rolloutsPerMove?: number;
  minRollouts: number;
  policyBySeat: PoliciesBySeat;
  seed: number;
  maxPlies: number;
  timeBudgetMs?: number;
};

export type ExplainDraft = {
  hint1: string;
  hint2: string;
  review: string;
};

export const DEFAULT_VERIFIER_CONFIG: VerifierConfig = {
  topK: 8,
  minRolloutsPerMove: 200,
  timeBudgetMsPerLevel: 8000,
  maxPlies: 300,
  primaryDeltaThreshold: 0.25,
  bestWinRateThreshold: 0.8,
  maxCIWidth: 0.2,
  seed: 12345,
  maxDecisionPoints: 3,
  uniqueEps: 0.05
};

export const moveToKey = (move: Move): string => (move.kind === 'PASS' ? 'PASS' : [...move.cards].sort().join('-'));

export const normalizeRanks = (cards: Rank[]): Rank[] => [...cards].sort();
