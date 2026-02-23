import { applyMove } from '../engine/reducer';
import { GameState, Move } from '../engine/types';
import { deriveSeed, mulberry32 } from './rng';
import { simulateOneGame } from './simulate';
import { wilsonCI95 } from './stats';
import { EstimateConfig, MoveStat, moveToKey } from './types';

export const estimateMoves = (
  initialState: GameState,
  candidateMoves: Move[],
  config: EstimateConfig
): MoveStat[] => {
  const start = Date.now();
  const stats: MoveStat[] = [];

  candidateMoves.forEach((move, moveIdx) => {
    let wins = 0;
    let n = 0;
    let lengthSum = 0;

    while (n < config.minRollouts || (config.rolloutsPerMove && n < config.rolloutsPerMove)) {
      if (config.timeBudgetMs && Date.now() - start > config.timeBudgetMs && n >= config.minRollouts) break;
      const nextState = applyMove(JSON.parse(JSON.stringify(initialState)), move);
      const rng = mulberry32(deriveSeed(config.seed, moveIdx * 100000 + n + 1));
      const out = simulateOneGame(nextState, config.policyBySeat, rng, config.maxPlies);
      const perspective = initialState.roles[initialState.currentPlayer] === 'landlord' ? 'LANDLORD' : 'FARMERS';
      if (out.winnerSide === perspective) wins += 1;
      n += 1;
      lengthSum += out.plies.length;
    }

    const pHat = n === 0 ? 0 : wins / n;
    stats.push({
      move,
      moveKey: moveToKey(move),
      pHat,
      ci95: wilsonCI95(wins, n),
      n,
      avgGameLength: n === 0 ? 0 : lengthSum / n
    });
  });

  stats.sort((a, b) => b.pHat - a.pHat || a.moveKey.localeCompare(b.moveKey));
  const best = stats[0]?.pHat ?? 0;
  return stats.map((s) => ({ ...s, deltaVsBest: best - s.pHat }));
};
