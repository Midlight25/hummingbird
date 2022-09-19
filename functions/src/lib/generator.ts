/**
 * Generates a random number in a range.
 * @param {number} from
 * @param {number} to
 * @param {number} fixed
 * @return {number}
 */
export function getRandomInRange(from:number, to: number,
    fixed:number): number {
  return Number((Math.random() * (to - from) + from).toFixed(fixed));
}
