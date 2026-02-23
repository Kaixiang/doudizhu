import { DecisionPoint, ExplainDraft } from './types';
import { templates } from './templates';

const pickTemplate = (dp: DecisionPoint): keyof typeof templates => {
  const mv = dp.topMoves[0]?.moveKey ?? '';
  if (mv.includes('BJ') || mv.includes('RJ')) return 'bombTiming';
  if (dp.topMoves.length >= 3) return 'controlLead';
  return 'teamwork';
};

export const buildExplainDraft = (dp: DecisionPoint): ExplainDraft => {
  const t = templates[pickTemplate(dp)];
  return {
    hint1: `${t.hint1}（局面 ${dp.stateHash}）`,
    hint2: `${t.hint2}（关键手第 ${dp.plyIndex} 手）`,
    review: `${t.review} 最优动作候选胜率差明显。`
  };
};
