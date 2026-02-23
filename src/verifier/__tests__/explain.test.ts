import { describe, expect, it } from 'vitest';
import { buildExplainDraft } from '../explain';

describe('explain draft', () => {
  it('generates two hints and one review', () => {
    const draft = buildExplainDraft({ plyIndex: 3, stateHash: 'abcd', topMoves: [{ moveKey: 'BJ-RJ' } as any], explanationDraft: '' });
    expect(draft.hint1.length).toBeGreaterThan(0);
    expect(draft.hint2.length).toBeGreaterThan(0);
    expect(draft.review.length).toBeGreaterThan(0);
  });
});
