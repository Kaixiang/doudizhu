import { LevelData } from '../engine/types.ts';
import { findDecisionPoints } from './decisionPoints.ts';
import { HeuristicPolicy } from './policies/HeuristicPolicy.ts';
import { uniqueSolutionScore } from './uniqueness.ts';
import { DEFAULT_VERIFIER_CONFIG, VerifierConfig, VerifierReport } from './types.ts';

export const runLevelVerifier = (level: LevelData, partial?: Partial<VerifierConfig>): VerifierReport => {
  const config: VerifierConfig = { ...DEFAULT_VERIFIER_CONFIG, ...(partial ?? {}) };
  const found = findDecisionPoints(level.initialState, HeuristicPolicy, config);
  const unique = found.decisionPoints.length
    ? uniqueSolutionScore(found.decisionPoints[0].topMoves, config.uniqueEps, config.topK)
    : 0;

  return {
    levelId: level.levelId,
    version: level.version,
    engineVersion: '0.1.0',
    verifierVersion: '0.1.0',
    seed: config.seed,
    rolloutPolicy: HeuristicPolicy.name,
    rolloutCount: config.minRolloutsPerMove,
    timeBudgetMs: config.timeBudgetMsPerLevel,
    result: {
      isSolvable: found.bestFinalWinRate >= config.bestWinRateThreshold,
      bestLineWinRate: found.bestFinalWinRate,
      bestLineCI95: found.bestCI95,
      uniqueSolutionScore: unique,
      decisionPoints: found.decisionPoints
    },
    artifacts: {
      pvLine: found.pvLine,
      counterExampleLines: found.decisionPoints[0]?.topMoves.slice(1).map((m) => m.moveKey) ?? []
    }
  };
};

export const measureRun = <T>(fn: () => T): { value: T; timeMs: number } => {
  const s = Date.now();
  const value = fn();
  return { value, timeMs: Date.now() - s };
};
