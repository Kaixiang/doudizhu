import { inferTags } from './tagging.ts';
import { funScore } from './funScore.ts';
import { VerifierReport } from '../verifier/types.ts';

export const selectDiverseSet = (reports: VerifierReport[], take: number, seed: number): VerifierReport[] => {
  const sorted = [...reports].sort((a, b) => {
    const s = funScore(b) - funScore(a);
    if (s !== 0) return s;
    return (a.levelId + seed).localeCompare(b.levelId + seed);
  });

  const selected: VerifierReport[] = [];
  const tagCount = new Map<string, number>();
  const maxPerTag = Math.max(1, Math.floor(take * 0.35));

  for (const r of sorted) {
    if (selected.length >= take) break;
    const tags = inferTags(r);
    const violates = tags.some((t) => (tagCount.get(t) ?? 0) >= maxPerTag);
    if (violates) continue;
    selected.push(r);
    tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1));
  }

  return selected;
};
