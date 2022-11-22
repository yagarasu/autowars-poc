import Game from './Game';

const game = new Game();

game.init({
  mountingPoint: document.getElementById('app'),
});

game.start();

setTimeout(() => {
  game.stop();
}, 5000);
