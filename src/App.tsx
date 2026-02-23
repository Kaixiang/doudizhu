import React, { useState } from 'react';
import { levels } from './levels';
import { GameScreen } from './ui/GameScreen';
import { LevelSelect } from './ui/LevelSelect';

export default function App() {
  const [levelId, setLevelId] = useState<string | null>(null);
  const level = levels.find((l) => l.levelId === levelId) ?? null;

  if (!level) return <LevelSelect onSelect={setLevelId} />;
  return <GameScreen level={level} onBack={() => setLevelId(null)} />;
}
