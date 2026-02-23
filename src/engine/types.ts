export const RANKS = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'BJ', 'RJ'] as const;

export type Rank = (typeof RANKS)[number];

export type Card = {
  rank: Rank;
};

export type PlayerId = 0 | 1 | 2;

export type PlayerRole = 'landlord' | 'farmerA' | 'farmerB';

export type PatternType =
  | 'INVALID'
  | 'PASS'
  | 'SINGLE'
  | 'PAIR'
  | 'TRIPLE'
  | 'TRIPLE_WITH_ONE'
  | 'TRIPLE_WITH_PAIR'
  | 'STRAIGHT'
  | 'CONSECUTIVE_PAIRS'
  | 'AIRPLANE'
  | 'AIRPLANE_WITH_SINGLES'
  | 'AIRPLANE_WITH_PAIRS'
  | 'FOUR_WITH_TWO'
  | 'BOMB'
  | 'ROCKET';

export type MovePattern = {
  type: PatternType;
  mainRank?: Rank;
  length?: number;
  kickers?: Rank[];
  cards: Rank[];
};

export type Move =
  | { kind: 'PASS' }
  | { kind: 'PLAY'; cards: Rank[]; pattern?: MovePattern };

export type TrickState = {
  lastMove: MovePattern | null;
  lastPlayer: PlayerId | null;
  passCount: number;
};

export type GameState = {
  hands: Record<PlayerId, Rank[]>;
  currentPlayer: PlayerId;
  roles: Record<PlayerId, PlayerRole>;
  trick: TrickState;
  history: Array<{ player: PlayerId; move: Move }>;
  winner: PlayerId | null;
};

export type LevelHint = {
  stepIndex: number;
  text: string;
};

export type LevelSolutionStep = {
  stepIndex: number;
  expectedMove: Rank[];
  explain: string;
  coachMessage?: string;
};

export type LevelData = {
  levelId: string;
  chapterId: string;
  title: string;
  storyIntro: string;
  storyOutro: string;
  tags: string[];
  initialState: GameState;
  winCondition: 'PLAYER_SIDE_WIN';
  hints: LevelHint[];
  solution: LevelSolutionStep[];
  version: number;
};

export const RANK_VALUE: Record<Rank, number> = {
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
  '2': 15,
  BJ: 16,
  RJ: 17
};

export const NON_STRAIGHT_RANKS: Rank[] = ['2', 'BJ', 'RJ'];
