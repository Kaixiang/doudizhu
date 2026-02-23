import React from 'react';
import { getLevelsByChapter } from '../levels';
import { getProgress } from '../progress/storage';

export const LevelSelect = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const grouped = getLevelsByChapter();
  const progress = getProgress();
  return (
    <div>
      <h2>章节选择</h2>
      {Object.entries(grouped).map(([chapter, levels]) => (
        <div key={chapter}>
          <h3>{chapter}</h3>
          <ul>
            {levels.map((l) => (
              <li key={l.levelId}>
                <button onClick={() => onSelect(l.levelId)}>{l.title}</button>
                {progress[l.levelId]?.cleared ? ' ✅已通关' : ''}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
