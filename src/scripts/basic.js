const degToRad = (deg) => deg * Math.PI / 180;
const radToDeg = (rad) => rad * 180 / Math.PI;
function adjustForfullRotation(val) {
  if (val > degToRad(360)) return 0;
  if (val < 0) return degToRad(360);
  return val;
}

function handleIdle() {
  const turret = hardware.get('turret');
  const newAngle = adjustForfullRotation(turret.angle + degToRad(1));
  turret.rotate(newAngle);
}

function main() {
  let state = 'IDLE';

  const stateToFuncMap = {
    IDLE: handleIdle,
  };

  while (true) {
    const func = stateToFuncMap[state];
    func();
  }
}

main();