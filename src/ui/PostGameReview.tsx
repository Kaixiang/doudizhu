import React from 'react';
import { LevelData } from '../engine/types';

export const PostGameReview = ({ level, onRetryStep }: { level: LevelData; onRetryStep: (step: number) => void }) => (
  <div>
    <h3>关键步复盘</h3>
    {level.solution.map((s) => (
      <div key={s.stepIndex}>
        <p>关键第 {s.stepIndex} 手：应出 {s.expectedMove.join(' ')}</p>
        <p>原因：{s.explain}</p>
        <button onClick={() => onRetryStep(s.stepIndex)}>回到该步</button>
      </div>
    ))}
  </div>
);
