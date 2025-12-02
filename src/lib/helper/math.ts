/**
 * Clamp a number within a specified range.
 * 
 * Ensures that the given `value` stays between `min` and `max`.
 * If `value` is less than `min`, it returns `min`.  
 * If `value` is greater than `max`, it returns `max`.  
 * Otherwise, it returns the original `value`.
 * 
 * @param value - The value to be clamped.
 * @param [min=value] - The lower bound. Defaults to `value` if not provided.
 * @param [max=value] - The upper bound. Defaults to `value` if not provided.
 * @returns The clamped value.
 * 
 * @example
 * clamp(5, 1, 10); // returns 5
 * clamp(-3, 0, 10); // returns 0
 * clamp(15, 0, 10); // returns 10
 */
export function clamp(
  value: number,
  min = value,
  max = value,
) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Compute integer power using exponentiation by squaring.
 *
 * Efficiently calculates `value` raised to the power of `exp` without using floating-point operations.
 *
 * @param {number} value - The base number.
 * @param {number} exp - The exponent (must be a non-negative integer).
 * @returns {number} The result of raising `value` to the power of `exp`.
 *
 * @example
 * powerInt(2, 3); // returns 8
 * powerInt(5, 0); // returns 1
 * powerInt(3, 1); // returns 3
 */
export function powerInt(value: number, exp: number): number {
  if (exp === 0) {
    return 1;
  }
  if (exp === 1) {
    return value;
  }
  if (exp & 1) {
    return value * powerInt(value * value, exp >> 1);
  }
  return powerInt(value * value, exp >> 1);
}

/**
 * round value
 * @param value value to be rounded
 * @param significants amount of rounding
 * if postive become amount of digit behind comma
 * if negative become amount of zero after comma
 * @returns rounded value
 */
export function roundInt(value: number, significants = 1) {
  const base = powerInt(10, Math.abs(significants));

  return significants < 0 ? Math.round(value / base) * base : Math.round(value * base) / base;
}

/**
 * Round up value to certain degree
 * @param value value to be rounded
 * @param degree degree of rounding
 * if degree is positive, it will be the amount of digit behind comma
 * if degree is negative, it will be the amount of zero after comma
 * @returns rounded value
 */
export function ceilInt(value: number, degree: number = 1) {
  const base = powerInt(10, Math.abs(degree));

  return degree < 0 ? Math.ceil(value / base) * base : Math.ceil(value * base) / base;
}
