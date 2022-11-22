import ECS from 'ecs';
import tankEntityTemplate from './entityTemplates/tank';
import GraphicsSystem from "./systems/GraphicsSystem";
import MotionSystem from './systems/MotionSystem';
import ScriptingSystem from './systems/ScriptingSystem';

class Game {
  running = false;
  el = null;
  world = null;
  loopId = null;

  systems = [];

  constructor() {
    this.world = ECS.createWorld();
    this.systems.push(new GraphicsSystem(this));
    this.systems.push(new ScriptingSystem(this));
    this.systems.push(new MotionSystem(this));
  }
  
  init({
    mountingPoint,
  }) {
    // TEMP
    const p1 = ECS.createEntity(this.world);
    tankEntityTemplate(this.world, p1, {
      position: {
        x: 100,
        y: 100,
        a: (45 * Math.PI) / 180,
      },
      scriptable: {
        initSrc: 'foo("iiiinit");',
        loopSrc: "hardware.accelerate();",
      },
    });

    if (!mountingPoint)
      throw new Error("Unable to mount game. Check mounting point.");
    this.el = mountingPoint;
    for (const system of this.systems) {
      system.init();
      ECS.addSystem(this.world, () => system);
    }
  }

  start() {
    this.running = true;
    this.loopId = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.loopId);
  }

  update(dt) {
    ECS.update(this.world, dt);
    ECS.cleanup(this.world);
    this.loopId = requestAnimationFrame(this.update.bind(this));
  }
}

export default Game;
