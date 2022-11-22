export const BACKGROUND_COLOR = '#333';

export const SCREEN_WIDTH = 1080;
export const SCREEN_HEIGHT = 720;

class Screen {
  canvas = null;
  ctx = null;

  constructor(mount) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute('width', SCREEN_WIDTH);
    canvas.setAttribute('height', SCREEN_HEIGHT);
    this.canvas = canvas;
    mount.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.clean();
  }

  clean() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawEntity(entity) {
    const { renderable } = entity;
    const { type, drawFunction } = renderable;
    switch (type) {
      case 'graphic':
        this.ctx.save();
        if (entity.position) {
          this.ctx.translate(entity.position.x, entity.position.y);
          this.ctx.rotate(entity.position.a);
        }
        drawFunction(this.ctx);
        this.ctx.restore();
    }
  }
}

export default Screen;
