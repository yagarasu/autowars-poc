import ECS from "ecs";
import { clamp } from "../mathUtils";

class MotionSystem {
  game = null;

  constructor(game) {
    this.game = game;
  }

  init() {}

  onUpdate(dt) {
    for (const entity of ECS.getEntities(this.game.world, ["motion", "position"])) {
      entity.position.x = clamp(entity.position.x + entity.motion.vx, 0, 1080);
      entity.position.y = clamp(entity.position.y + entity.motion.vy, 0, 720);
    }
  }
}

export default MotionSystem;
