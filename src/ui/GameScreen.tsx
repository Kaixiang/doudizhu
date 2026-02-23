import React, { useMemo, useState } from 'react';
import { chooseBotMove } from '../ai/botHeuristic';
import { getCoachMessage } from '../coach/coach';
import { applyMove } from '../engine/reducer';
import { GameState, LevelData, Rank } from '../engine/types';
import { getHintForStep } from '../hints/hintEngine';
import { markAttempt } from '../progress/storage';
import { jumpToSnapshot, saveSnapshot } from '../replay/replay';
import { HintModal } from './components/HintModal';
import { useLegalMoves } from './hooks/useLegalMoves';
import { PostGameReview } from './PostGameReview';

const toggle = (arr: Rank[], card: Rank): Rank[] => (arr.includes(card) ? arr.filter((x) => x !== card) : [...arr, card]);

export const GameScreen = ({ level, onBack }: { level: LevelData; onBack: () => void }) => {
  const [state, setState] = useState<GameState>(JSON.parse(JSON.stringify(level.initialState)));
  const [selected, setSelected] = useState<Rank[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [coach, setCoach] = useState<string | null>(null);
  const [playerStep, setPlayerStep] = useState(0);
  const [snaps, setSnaps] = useState<any[]>([]);
  const { selectedIsLegal, canPass, reason } = useLegalMoves(state, selected);

  const isPlayerTurn = state.currentPlayer === 0;

  const runBotsUntilPlayer = (gs: GameState): GameState => {
    let next = gs;
    let guard = 0;
    while (next.winner === null && next.currentPlayer !== 0 && guard < 50) {
      next = applyMove(next, chooseBotMove(next));
      guard += 1;
    }
    return next;
  };

  const submitPlay = () => {
    if (!selectedIsLegal) return;
    setSnaps((s) => saveSnapshot(s, playerStep, state));
    const coachMessage = getCoachMessage(level, playerStep, selected);
    if (coachMessage) setCoach(coachMessage);
    let next = applyMove(state, { kind: 'PLAY', cards: selected });
    setPlayerStep((v) => v + 1);
    next = runBotsUntilPlayer(next);
    if (next.winner !== null) markAttempt(level.levelId, next.winner === 0);
    setState(next);
    setSelected([]);
  };

  const pass = () => {
    let next = applyMove(state, { kind: 'PASS' });
    next = runBotsUntilPlayer(next);
    setState(next);
  };

  const restart = () => {
    setState(JSON.parse(JSON.stringify(level.initialState)));
    setSelected([]);
    setPlayerStep(0);
    setSnaps([]);
  };

  const hand = useMemo(() => state.hands[0], [state]);

  if (state.winner !== null) {
    return (
      <div>
        <h2>{state.winner === 0 ? '胜利' : '失败'}</h2>
        <PostGameReview
          level={level}
          onRetryStep={(step) => {
            const snap = jumpToSnapshot(snaps, step);
            if (snap) setState(snap);
          }}
        />
        <button onClick={onBack}>返回选关</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{level.title}</h2>
      <p>当前轮到: 玩家{state.currentPlayer}</p>
      <p>桌面: {state.trick.lastMove ? `${state.trick.lastMove.type} ${state.trick.lastMove.cards.join(' ')}` : '新一轮'}</p>
      <p>剩余牌数: {Object.entries(state.hands).map(([pid, cards]) => `${pid}:${cards.length}`).join(' | ')}</p>

      <div>
        <h3>你的手牌</h3>
        {hand.map((c, idx) => (
          <button key={`${c}-${idx}`} onClick={() => isPlayerTurn && setSelected((s) => toggle(s, c))} style={{ background: selected.includes(c) ? '#ffd54f' : undefined }}>
            {c}
          </button>
        ))}
      </div>

      <div>
        <button disabled={!isPlayerTurn || !selectedIsLegal} onClick={submitPlay}>出牌</button>
        <button disabled={!isPlayerTurn || !canPass} onClick={pass}>PASS</button>
        <button onClick={() => setHint(getHintForStep(level, playerStep))}>提示</button>
        <button onClick={restart}>重开本关</button>
      </div>

      {reason && <p>{reason}</p>}
      {coach && <p>教练：{coach}</p>}
      {hint && <HintModal text={hint} onClose={() => setHint(null)} />}
    </div>
  );
};
