export function clamp(val, min = 0, max = 1) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

export function unitVectorFromAngle(a) {
  return [
    Math.cos(a),
    Math.sin(a),
  ];
}

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;