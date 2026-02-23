import { useMemo } from 'react';
import { classifyMove } from '../../engine/pattern';
import { listLegalMoves } from '../../engine/legalMoves';
import { GameState, Rank } from '../../engine/types';

export const useLegalMoves = (state: GameState, selected: Rank[]) => {
  const legal = useMemo(() => listLegalMoves(state), [state]);
  const selectedPattern = useMemo(() => classifyMove(selected), [selected]);

  const selectedIsLegal = legal.some((m) => m.kind === 'PLAY' && m.cards.join('-') === [...selected].sort().join('-'));
  const canPass = legal.some((m) => m.kind === 'PASS');

  const reason = selected.length === 0
    ? '请选择牌'
    : selectedPattern.type === 'INVALID'
      ? '不是合法牌型'
      : !selectedIsLegal
        ? '无法压过上家或不在合法动作中'
        : null;

  return { legal, selectedIsLegal, canPass, reason };
};
