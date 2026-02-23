import { Candidate } from './generateCandidates.ts';
import { stateHash } from '../verifier/hash.ts';

export const canonicalStateKey = (candidate: Candidate): string => stateHash(candidate.initialState);
