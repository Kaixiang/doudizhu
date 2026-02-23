import { describe, expect, it } from 'vitest';
import { classifyMove } from '../../engine/pattern';

describe('play level e2e contract', () => {
  it('invalid selection cannot form playable move', () => {
    expect(classifyMove(['3', '4']).type).toBe('INVALID');
  });
});
