import { LevelData } from '../engine/types';

export type LevelManifest = {
  version: number;
  chapters: Record<string, string[]>;
};

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export type LevelSchema = LevelData;
