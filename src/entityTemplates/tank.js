import ECS from 'ecs';

const tankEntityTemplate = (world, entity, { position }) => {
  ECS.addComponentToEntity(world, entity, "position", position);
  ECS.addComponentToEntity(world, entity, "motion", {
    vx: 0,
    vy: 0,
  });
  ECS.addComponentToEntity(world, entity, "renderable", {
    type: "graphic",
    drawFunction: (ctx) => {
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, 16);
      ctx.lineTo(16, 0);
      ctx.stroke();
      ctx.closePath();
    },
  });
};

export default tankEntityTemplate;
