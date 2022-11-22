import ECS from "ecs";
import { clamp } from "../mathUtils";

class ScriptingSystem {
  game = null;

  constructor(game) {
    this.game = game;
  }

  createContext(entity) {
    return {
      // Add interface here
      foo: (args) => console.log("(From %s) >>> %s", entity.id, args),
      console,
      hardware: {
        accelerate: () => {
          entity.motion.vx = clamp(entity.motion.vx + ((Math.random() * 10) - 5), -5, 5);
          entity.motion.vy = clamp(entity.motion.vy + ((Math.random() * 10) - 5), -5, 5);
        },
      },
    };
  }

  compile(src) {
    const guardedSrc = `with (sandbox) {
      ${src}
    }`;
    const compiledFunction = new Function("sandbox", guardedSrc);
    return (sandbox) => {
      const sandboxProxy = new Proxy(sandbox, {
        has: () => true,
        get: (target, key) => {
          if (key === Symbol.unscopables) return undefined;
          return target[key];
        },
      });
      return compiledFunction(sandboxProxy);
    };
  }

  init() {
    for (const entity of ECS.getEntities(this.game.world, ["scriptable"])) {
      entity.scriptable.compiledInit = entity.scriptable.initSrc
        ? this.compile(entity.scriptable.initSrc)
        : null;
      entity.scriptable.compiledLoop = entity.scriptable.loopSrc
        ? this.compile(entity.scriptable.loopSrc)
        : null;
      if (entity.scriptable.compiledInit)
        entity.scriptable.compiledInit(this.createContext(entity));
    }
  }

  onUpdate(dt) {
    for (const entity of ECS.getEntities(this.game.world, ["scriptable"])) {
      if (entity.scriptable.compiledLoop)
        entity.scriptable.compiledLoop({ ...this.createContext(entity), frame: { dt } });
    }
  }
}

export default ScriptingSystem;
