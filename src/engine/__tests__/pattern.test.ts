import { describe, expect, it } from 'vitest';
import { classifyMove } from '../pattern';

describe('classifyMove', () => {
  it('recognizes basic patterns', () => {
    expect(classifyMove(['3']).type).toBe('SINGLE');
    expect(classifyMove(['4', '4']).type).toBe('PAIR');
    expect(classifyMove(['5', '5', '5']).type).toBe('TRIPLE');
    expect(classifyMove(['BJ', 'RJ']).type).toBe('ROCKET');
    expect(classifyMove(['7', '7', '7', '7']).type).toBe('BOMB');
  });

  it('recognizes combo patterns', () => {
    expect(classifyMove(['6', '6', '6', '8']).type).toBe('TRIPLE_WITH_ONE');
    expect(classifyMove(['6', '6', '6', '8', '8']).type).toBe('TRIPLE_WITH_PAIR');
    expect(classifyMove(['3', '4', '5', '6', '7']).type).toBe('STRAIGHT');
    expect(classifyMove(['3', '3', '4', '4', '5', '5']).type).toBe('CONSECUTIVE_PAIRS');
    expect(classifyMove(['3', '3', '3', '4', '4', '4']).type).toBe('AIRPLANE');
    expect(classifyMove(['3', '3', '3', '4', '4', '4', '7', '8']).type).toBe('AIRPLANE_WITH_SINGLES');
    expect(classifyMove(['3', '3', '3', '4', '4', '4', '7', '7', '8', '8']).type).toBe('AIRPLANE_WITH_PAIRS');
    expect(classifyMove(['9', '9', '9', '9', '4', '5']).type).toBe('FOUR_WITH_TWO');
  });

  it('rejects invalids and is order stable', () => {
    expect(classifyMove(['2', '3', '4', '5', '6']).type).toBe('INVALID');
    const a = classifyMove(['5', '3', '4', '6', '7']);
    const b = classifyMove(['7', '6', '5', '4', '3']);
    expect(a.type).toBe('STRAIGHT');
    expect(a).toEqual(b);
  });
});
