const KEY = 'ddz_progress';

type ProgressRecord = Record<string, { cleared: boolean; attempts: number }>;

export const getProgress = (): ProgressRecord => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ProgressRecord;
  } catch {
    return {};
  }
};

export const markAttempt = (levelId: string, cleared: boolean): void => {
  const p = getProgress();
  p[levelId] = { cleared: p[levelId]?.cleared || cleared, attempts: (p[levelId]?.attempts ?? 0) + 1 };
  localStorage.setItem(KEY, JSON.stringify(p));
};
