import ECS from 'ecs';
import { v4 as uuid } from 'uuid';

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
  }

  handleMessage({ data }) {
    const { command, args } = data;
    switch (command) {
      case 'UPDATE_ENTITY':
        const [entityUuid, key, value] = args;
        this.entities[entityUuid][key] = value;
        ECS.cleanup(this.game.world);
        break;
    }
  }
}

export default VirtualMachine;
