import { describe, expect, it } from 'vitest';
import { chooseBotMove } from '../../ai/botHeuristic';
import { applyMove } from '../../engine/reducer';
import { levels } from '../index';
import { validateLevel } from '../validateLevel';

describe('levels regression', () => {
  it('all levels validate and can terminate with bot', () => {
    levels.forEach((level) => {
      const errors = validateLevel(level);
      expect(errors, `${level.levelId}: ${errors.join(';')}`).toHaveLength(0);

      for (let i = 0; i < 10; i += 1) {
        let state = JSON.parse(JSON.stringify(level.initialState));
        let guard = 0;
        while (state.winner === null && guard < 200) {
          const move = chooseBotMove(state);
          state = applyMove(state, move);
          guard += 1;
        }
        expect(state.winner, `level ${level.levelId} run ${i} not ended`).not.toBeNull();
      }
    });
  });
});
