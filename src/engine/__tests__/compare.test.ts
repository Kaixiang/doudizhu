import { describe, expect, it } from 'vitest';
import { canBeat } from '../compare';
import { classifyMove } from '../pattern';

describe('canBeat', () => {
  it('supports same-type comparison', () => {
    expect(canBeat(classifyMove(['8']), classifyMove(['7']))).toBe(true);
    expect(canBeat(classifyMove(['7', '7']), classifyMove(['8', '8']))).toBe(false);
  });

  it('supports bomb and rocket priority', () => {
    expect(canBeat(classifyMove(['9', '9', '9', '9']), classifyMove(['A']))).toBe(true);
    expect(canBeat(classifyMove(['BJ', 'RJ']), classifyMove(['9', '9', '9', '9']))).toBe(true);
  });

  it('rejects invalid type mismatch', () => {
    expect(canBeat(classifyMove(['5', '5']), classifyMove(['6']))).toBe(false);
  });
});
