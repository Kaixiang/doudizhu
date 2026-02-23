import fs from 'node:fs';
import path from 'node:path';
import { VerifierReport } from '../verifier/types.ts';

export const materializeLevels = (
  reports: VerifierReport[],
  stateByLevelId: Record<string, any>,
  outDir: string,
  chapterId = 'generated_ch1'
): void => {
  fs.mkdirSync(outDir, { recursive: true });
  reports.forEach((r, idx) => {
    const dp = r.result.decisionPoints[0];
    const best = dp?.topMoves[0]?.moveKey?.split('-') ?? ['3'];
    const wrong = dp?.topMoves[1]?.moveKey ?? 'PASS';
    const level = {
      levelId: `gen_${String(idx + 1).padStart(3, '0')}`,
      chapterId,
      title: `自动关卡 ${idx + 1}`,
      storyIntro: '由关卡工厂自动生成。',
      storyOutro: '可进入人工润色阶段。',
      tags: ['自动生成'],
      version: 1,
      winCondition: 'PLAYER_SIDE_WIN',
      initialState: stateByLevelId[r.levelId],
      hints: [
        { stepIndex: 0, text: '先看能否保持先手，不要轻易交权。' },
        { stepIndex: 0, text: `常见误区是走 ${wrong}，优先考虑更高胜率方案。` }
      ],
      solution: [
        {
          stepIndex: 0,
          expectedMove: best,
          explain: '该步是主分叉，选对可显著提高胜率。',
          coachMessage: '你在关键分叉走了低胜率分支。'
        }
      ]
    };
    fs.writeFileSync(path.join(outDir, `${level.levelId}.json`), JSON.stringify(level, null, 2));
  });
};
