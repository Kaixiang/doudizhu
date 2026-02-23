import { Candidate } from './generateCandidates';
import { stateHash } from '../verifier/hash';

export const canonicalStateKey = (candidate: Candidate): string => stateHash(candidate.initialState);
