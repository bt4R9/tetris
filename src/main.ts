import { Game } from './game';

const game = new Game({
  canvas: <HTMLCanvasElement>document.getElementById('canvas')
});

game.init();