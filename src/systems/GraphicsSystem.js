import ECS from 'ecs';
import Screen from "../Screen";

class GraphicsSystem {
  game = null;
  screen = null;

  constructor(game) {
    this.game = game;
  }

  init() {
    this.screen = new Screen(this.game.el);
  }

  onUpdate(dt) {
    this.screen.clean();
    for (const entity of ECS.getEntities(this.game.world, [ 'renderable' ])) {
      this.screen.drawEntity(entity);
    }
  }
}

export default GraphicsSystem;
