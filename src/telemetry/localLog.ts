import fs from 'node:fs';

export type HintABLog = {
  levelId: string;
  strategy: 'A' | 'B';
  attempts: number;
  hintClicks: number;
  cleared: boolean;
  durationSec: number;
  ts: string;
};

export const appendLocalLog = (path: string, row: HintABLog): void => {
  const header = 'levelId,strategy,attempts,hintClicks,cleared,durationSec,ts\n';
  if (!fs.existsSync(path)) fs.writeFileSync(path, header);
  fs.appendFileSync(
    path,
    `${row.levelId},${row.strategy},${row.attempts},${row.hintClicks},${row.cleared},${row.durationSec},${row.ts}\n`
  );
};
