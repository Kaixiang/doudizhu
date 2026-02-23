import { NON_STRAIGHT_RANKS, RANK_VALUE, Rank, MovePattern } from './types';

const sortRanks = (cards: Rank[]): Rank[] => [...cards].sort((a, b) => RANK_VALUE[a] - RANK_VALUE[b]);

const countRanks = (cards: Rank[]): Map<Rank, number> => {
  const m = new Map<Rank, number>();
  cards.forEach((c) => m.set(c, (m.get(c) ?? 0) + 1));
  return m;
};

const isConsecutive = (ranks: Rank[]): boolean => {
  if (ranks.some((r) => NON_STRAIGHT_RANKS.includes(r))) return false;
  const values = ranks.map((r) => RANK_VALUE[r]).sort((a, b) => a - b);
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] !== values[i - 1] + 1) return false;
  }
  return true;
};

export const classifyMove = (cards: Rank[]): MovePattern => {
  const normalized = sortRanks(cards);
  if (normalized.length === 0) {
    return { type: 'INVALID', cards: normalized };
  }
  const counts = countRanks(normalized);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || RANK_VALUE[a[0]] - RANK_VALUE[b[0]]);

  if (normalized.length === 1) return { type: 'SINGLE', mainRank: normalized[0], cards: normalized };
  if (normalized.length === 2) {
    if (counts.get('BJ') === 1 && counts.get('RJ') === 1) return { type: 'ROCKET', mainRank: 'RJ', cards: normalized };
    if (groups[0][1] === 2) return { type: 'PAIR', mainRank: groups[0][0], cards: normalized };
    return { type: 'INVALID', cards: normalized };
  }
  if (normalized.length === 3) {
    if (groups[0][1] === 3) return { type: 'TRIPLE', mainRank: groups[0][0], cards: normalized };
    return { type: 'INVALID', cards: normalized };
  }
  if (normalized.length === 4) {
    if (groups[0][1] === 4) return { type: 'BOMB', mainRank: groups[0][0], cards: normalized };
    if (groups[0][1] === 3) {
      return {
        type: 'TRIPLE_WITH_ONE',
        mainRank: groups[0][0],
        kickers: [groups[1][0]],
        cards: normalized
      };
    }
  }
  if (normalized.length === 5 && groups[0][1] === 3 && groups[1][1] === 2) {
    return { type: 'TRIPLE_WITH_PAIR', mainRank: groups[0][0], kickers: [groups[1][0]], cards: normalized };
  }

  const unique = [...counts.keys()];
  if (normalized.length >= 5 && unique.length === normalized.length && isConsecutive(unique)) {
    return { type: 'STRAIGHT', mainRank: unique[unique.length - 1], length: unique.length, cards: normalized };
  }

  if (normalized.length >= 6 && normalized.length % 2 === 0 && groups.every(([, v]) => v === 2) && isConsecutive(unique)) {
    return { type: 'CONSECUTIVE_PAIRS', mainRank: unique[unique.length - 1], length: unique.length, cards: normalized };
  }

  // four with two singles only (MVP standard)
  if (normalized.length === 6 && groups[0][1] === 4) {
    return {
      type: 'FOUR_WITH_TWO',
      mainRank: groups[0][0],
      kickers: groups.slice(1).map(([r]) => r),
      cards: normalized
    };
  }

  const tripleRanks = groups.filter(([, c]) => c === 3).map(([r]) => r).sort((a, b) => RANK_VALUE[a] - RANK_VALUE[b]);
  if (tripleRanks.length >= 2 && isConsecutive(tripleRanks)) {
    const seqLen = tripleRanks.length;
    const total = normalized.length;
    if (total === seqLen * 3) {
      return { type: 'AIRPLANE', mainRank: tripleRanks[seqLen - 1], length: seqLen, cards: normalized };
    }
    if (total === seqLen * 4) {
      const kickers = groups.filter(([, c]) => c === 1).map(([r]) => r);
      if (kickers.length === seqLen) {
        return {
          type: 'AIRPLANE_WITH_SINGLES',
          mainRank: tripleRanks[seqLen - 1],
          length: seqLen,
          kickers,
          cards: normalized
        };
      }
    }
    if (total === seqLen * 5) {
      const pairKickers = groups.filter(([, c]) => c === 2).map(([r]) => r);
      if (pairKickers.length === seqLen) {
        return {
          type: 'AIRPLANE_WITH_PAIRS',
          mainRank: tripleRanks[seqLen - 1],
          length: seqLen,
          kickers: pairKickers,
          cards: normalized
        };
      }
    }
  }

  return { type: 'INVALID', cards: normalized };
};
