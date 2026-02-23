import fs from 'node:fs';

export type ReviewDecision = {
  levelId: string;
  status: 'APPROVE' | 'REJECT' | 'NEED_EDIT';
  reasonTags: string[];
  reviewer: string;
  ts: string;
};

export const saveReviewDecisions = (path: string, decisions: ReviewDecision[]): void => {
  fs.writeFileSync(path, JSON.stringify(decisions, null, 2));
};

export const makeDecision = (
  levelId: string,
  status: ReviewDecision['status'],
  reasonTags: string[],
  reviewer: string
): ReviewDecision => ({ levelId, status, reasonTags, reviewer, ts: new Date().toISOString() });
