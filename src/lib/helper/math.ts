export function clamp(
  value: number,
  min = value,
  max = value,
) {
  return Math.max(min, Math.min(value, max));
}
