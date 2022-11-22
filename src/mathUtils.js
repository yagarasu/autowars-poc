export function clamp(val, min = 0, max = 1) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}