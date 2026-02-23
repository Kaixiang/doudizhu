import { listLegalMoves } from '../engine/legalMoves';
import { applyMove } from '../engine/reducer';
import { GameState } from '../engine/types';
import { stateHash } from './hash';
import { estimateMoves } from './estimate';
import { buildExplainDraft } from './explain';
import { DecisionPoint, Policy, VerifierConfig } from './types';

export const findDecisionPoints = (
  initialState: GameState,
  rolloutPolicy: Policy,
  config: VerifierConfig
): { decisionPoints: DecisionPoint[]; pvLine: string[]; bestFinalWinRate: number; bestCI95: { low: number; high: number } } => {
  let state = JSON.parse(JSON.stringify(initialState)) as GameState;
  const points: DecisionPoint[] = [];
  const pvLine: string[] = [];
  let bestFinalWinRate = 0;
  let bestCI95 = { low: 0, high: 1 };

  for (let ply = 0; ply < config.maxPlies; ply += 1) {
    if (state.winner !== null || points.length >= config.maxDecisionPoints) break;

    const legal = listLegalMoves(state);
    const candidates = legal.slice(0, config.topK);
    const policyBySeat = { 0: rolloutPolicy, 1: rolloutPolicy, 2: rolloutPolicy } as const;
    const stats = estimateMoves(state, candidates, {
      minRollouts: config.minRolloutsPerMove,
      rolloutsPerMove: config.minRolloutsPerMove,
      policyBySeat,
      seed: config.seed + ply,
      maxPlies: config.maxPlies,
      timeBudgetMs: Math.max(200, Math.floor(config.timeBudgetMsPerLevel / 10))
    });

    if (stats.length === 0) break;
    const best = stats[0];
    const second = stats[1];
    if (ply === 0) {
      bestFinalWinRate = best.pHat;
      bestCI95 = best.ci95;
    }

    if (second && best.pHat - second.pHat >= config.primaryDeltaThreshold) {
      const draft = buildExplainDraft({ plyIndex: ply, stateHash: stateHash(state), topMoves: stats.slice(0, 3), explanationDraft: '' });
      points.push({
        plyIndex: ply,
        stateHash: stateHash(state),
        topMoves: stats.slice(0, 3),
        explanationDraft: `${draft.hint1} ${draft.review}`
      });
    }

    pvLine.push(best.moveKey);
    state = applyMove(state, best.move);
  }

  return { decisionPoints: points, pvLine, bestFinalWinRate, bestCI95 };
};
