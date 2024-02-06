import {describe, test, expect} from 'vitest';
import {
  consolidateCodeRanges,
  inverseCodeRange,
  isPointInCodeRange,
  range,
} from './CodeRange';

describe('CodeRange', () => {
  test('should detect ranges', () => {
    expect(
      isPointInCodeRange([50, 50], range(0, 0, 100, 100)[0]),
      'Should work within both ranges',
    ).toBeTruthy();
    expect(
      isPointInCodeRange([50, 1000], range(0, 0, 100, 100)[0]),
      'Should accept any column when within lines',
    ).toBeTruthy();
    expect(
      isPointInCodeRange([50, 50], range(0, 0, Infinity, Infinity)[0]),
      'Should work with infinity',
    ).toBeTruthy();
    expect(
      isPointInCodeRange([100, 100], range(0, 0, 100, 100)[0]),
      'Should reject points on the outer edge',
    ).toBeFalsy();
  });

  test('should consolidate ranges that are completely contained', () => {
    expect(
      consolidateCodeRanges([...range(0, 0, 100, 100), ...range(20, 0, 50, 0)]),
    ).toEqual([...range(0, 0, 100, 100)]);
    expect(
      consolidateCodeRanges([...range(20, 0, 50, 0), ...range(0, 0, 100, 100)]),
    ).toEqual([...range(0, 0, 100, 100)]);
  });

  test('should combine ranges that overlap', () => {
    expect(
      consolidateCodeRanges([...range(0, 5, 0, 10), ...range(0, 7, 0, 13)]),
    ).toEqual([...range(0, 5, 0, 13)]);
    expect(
      consolidateCodeRanges([...range(0, 7, 2, 13), ...range(0, 5, 2, 10)]),
    ).toEqual([...range(0, 5, 2, 13)]);
  });

  test('should not combine ranges that do not overlap', () => {
    expect(
      consolidateCodeRanges([
        ...range(0, 5, 0, 10),
        ...range(0, 7, 0, 13),
        ...range(1, 5, 1, 10),
      ]),
    ).toEqual([...range(0, 5, 0, 13), ...range(1, 5, 1, 10)]);
  });

  test('should invert empty ranges', () => {
    expect(inverseCodeRange([])).toEqual([...range(0, 0, Infinity, Infinity)]);
  });
});
