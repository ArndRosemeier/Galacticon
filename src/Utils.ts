export class Utils {
  /**
   * Distribute a new value at index in an array, scaling the rest to preserve proportions and sum to totalSum.
   * @param arr The original array of integers
   * @param index The index to set to newAmount
   * @param newAmount The new value for arr[index]
   * @param totalSum The desired total sum of the array
   * @returns A new array of integers with the desired properties
   */
  static distribute(arr: number[], index: number, newAmount: number, totalSum: number): number[] {
    const n = arr.length;
    if (n === 0) return [];
    // Clamp newAmount
    newAmount = Math.max(0, Math.min(newAmount, totalSum));
    // Copy array
    const result = arr.slice();
    // Calculate sum of other elements
    const oldOtherSum = arr.reduce((sum, v, i) => i === index ? sum : sum + v, 0);
    const newOtherSum = totalSum - newAmount;
    // Edge case: all other elements are zero
    if (oldOtherSum === 0) {
      // Distribute newOtherSum as evenly as possible
      let base = Math.floor(newOtherSum / (n - 1));
      let remainder = newOtherSum - base * (n - 1);
      for (let i = 0; i < n; ++i) {
        if (i === index) continue;
        result[i] = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
      }
      result[index] = newAmount;
      return result;
    }
    // Scale other elements proportionally
    let scaled = arr.map((v, i) => i === index ? newAmount : v * newOtherSum / oldOtherSum);
    // Round and track remainders
    let rounded = scaled.map((v, i) => i === index ? newAmount : Math.floor(v));
    let remainder = newOtherSum - rounded.reduce((sum, v, i) => i === index ? sum : sum + v, 0);
    // Distribute remainder to elements with largest fractional part
    let fractions = scaled.map((v, i) => i === index ? -1 : v - Math.floor(v));
    while (remainder > 0) {
      let maxIdx = -1, maxFrac = -1;
      for (let i = 0; i < n; ++i) {
        if (i === index) continue;
        if (fractions[i] > maxFrac) {
          maxFrac = fractions[i];
          maxIdx = i;
        }
      }
      if (maxIdx === -1) break;
      rounded[maxIdx]++;
      fractions[maxIdx] = -1;
      remainder--;
    }
    result[index] = newAmount;
    for (let i = 0; i < n; ++i) {
      if (i !== index) result[i] = rounded[i];
    }
    return result;
  }
} 