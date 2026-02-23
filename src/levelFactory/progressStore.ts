import fs from 'node:fs';

export type ProgressRecord = {
  completedIds: string[];
};

export const loadProgress = (path: string): ProgressRecord => {
  if (!fs.existsSync(path)) return { completedIds: [] };
  return JSON.parse(fs.readFileSync(path, 'utf-8')) as ProgressRecord;
};

export const saveProgress = (path: string, progress: ProgressRecord): void => {
  fs.writeFileSync(path, JSON.stringify(progress, null, 2));
};
