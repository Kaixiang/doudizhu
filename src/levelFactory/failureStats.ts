export const failureStats = (failed: Array<{ failReasons: string[] }>): Array<{ reason: string; count: number }> => {
  const m = new Map<string, number>();
  failed.forEach((f) => f.failReasons.forEach((r) => m.set(r, (m.get(r) ?? 0) + 1)));
  return [...m.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
};
