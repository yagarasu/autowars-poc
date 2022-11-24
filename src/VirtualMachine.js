import ECS from 'ecs';
import { v4 as uuid } from 'uuid';
import { clamp, degToRad, unitVectorFromAngle } from './mathUtils';

export const VM_COMMAND_RUN = 'run';

class VirtualMachine {
  game = null;
  worker = null;
  entities = {};

  constructor(game) {
    this.game = game;
    this.worker = new Worker(
      new URL("./scripting.webworker.js", import.meta.url)
    );
    this.worker.onmessage = this.handleMessage.bind(this);
  }
  
  execute(src, entity) {
    const newUuid = uuid();
    this.entities[newUuid] = entity;
    console.log(typeof newUuid);
    this.worker.postMessage({
      command: VM_COMMAND_RUN,
      args: [src, JSON.stringify({ entity, uuid: newUuid })],
    });
    return newUuid;
  }

  getEntity(entityUuid) {
    return this.entities[entityUuid];
  }

  handleMessage({ data }) {
    const { uuid: entityUuid, command, args } = data;
    switch (command) {
      case "accelerate": {
        const [value] = args;
        const entity = this.getEntity(entityUuid);
        const [x, y] = unitVectorFromAngle(entity.position.a);
        entity.motion.vx = clamp(entity.motion.vx + x * value, -10, 10);
        entity.motion.vy = clamp(entity.motion.vy + y * value, -10, 10);
        ECS.cleanup(this.game.world);
        break;
      }
      case "rotate": {
        const [value] = args;
        const entity = this.getEntity(entityUuid);
        entity.position.a = clamp(entity.position.a + value, 0, degToRad(360));
        ECS.cleanup(this.game.world);
        break;
      }
    }
  }
}

export default VirtualMachine;
