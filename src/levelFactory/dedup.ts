import { Candidate } from './generateCandidates';
import { canonicalStateKey } from './canonicalize';

export const dedupCandidates = (candidates: Candidate[]): { deduped: Candidate[]; duplicateRate: number } => {
  const map = new Map<string, Candidate>();
  candidates.forEach((c) => {
    const key = canonicalStateKey(c);
    const existing = map.get(key);
    if (!existing || c.meta.sourcePly < existing.meta.sourcePly) {
      map.set(key, c);
    }
  });
  const deduped = [...map.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  return {
    deduped,
    duplicateRate: candidates.length === 0 ? 0 : 1 - deduped.length / candidates.length
  };
};

export const toNdjson = (candidates: Candidate[]): string => candidates.map((c) => JSON.stringify(c)).join('\n');
