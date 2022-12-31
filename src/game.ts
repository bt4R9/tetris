import { Board } from './board';
import { Key, Keyboard } from './keyboard';
import { Renderer } from './renderer';
import { Panel } from './panel';
import { Shape } from './shape';
import { Records } from './records';
import { spawnRandom } from './spawn';

export interface GameProps {
  canvas: HTMLCanvasElement;
}

export class Game {
  readonly board: Board;
  readonly renderer: Renderer;
  readonly keyboard: Keyboard;
  readonly panel: Panel;
  readonly records: Records;

  private frameId = -1;
  private timestamp = -1;
  private speedModifier = 5;
  private animationFrames: number | null = null;

  private ticks = 0;
  private collapseCount = 0;
  private score = 0;
  private level = 1;
  private nextShape: Shape;

  currentShape: Shape | null = null;

  constructor({ canvas }: GameProps) {
    const context = canvas.getContext('2d');
   
    if (!context) {
      throw new Error('Can not get a canvas context.');
    }

    this.board = new Board();
    this.renderer = new Renderer({
      board: this.board,
      canvas,
      context,
    });

    this.panel = new Panel({ context });
    this.records = new Records();
    this.keyboard = new Keyboard();

    this.nextShape = spawnRandom();
  }

  get speed() {
    return 1000 / this.speedModifier;
  }

  init() {
    const { keyboard, renderer } = this;

    const disposer = keyboard.init();
    keyboard.events.on('key', this.onKey);
    renderer.start();
    this.start();

    this.panel.updateLevel(this.level);
    this.panel.updateRecords(this.records.records);

    return () => {
      disposer();
      keyboard.events.off('key', this.onKey);
      cancelAnimationFrame(this.frameId);
      renderer.stop();
      this.stop();
    }
  }

  start() {
    this.tick();
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  onKey = ({ key }: { key: Key }) => {
    if (key === 'L' || key == 'R') {
      const dx = key === 'L' ? -1 : 1;

      if (this.currentShape) {
        this.currentShape.move({ dx });

        if (!this.board.canPlaceShape(this.currentShape)) {
          this.currentShape.move({ dx: -dx });
        }
      }
    } else if (key === "U") {
      if (this.currentShape) {
        this.currentShape.rotate(true);

        if (!this.board.canPlaceShape(this.currentShape)) {
          this.currentShape.rotate(false);
        }
      }
    } else if (key === "D") {
      if (this.currentShape) {
        this.currentShape.move({ dy: 1})

        if (!this.board.canPlaceShape(this.currentShape)) {
          this.currentShape.move({ dy: -1 });
        }
      } 
    }
  }

  tick = () => {
    this.frameId = requestAnimationFrame(this.tick);

    const now = Date.now();
    const elapsed = now - this.timestamp;

    if (elapsed < this.speed) {
      return;
    }

    this.timestamp = now - (elapsed % this.speed);
    this.ticks += 1;

    if ([100, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000].includes(this.ticks)) {
      this.level += 1;
      this.speedModifier += 1;

      this.panel.updateLevel(this.level);
    }

    if (this.board.collapsed) {
      if (this.animationFrames === null) {
        this.animationFrames = 3;
      }

      this.animationFrames -= 1;

      if (this.animationFrames === 0) {
        this.animationFrames = null;
        this.board.collapseRows();
        this.collapseCount += 1;
        this.score += 100 * this.collapseCount * this.level;
      }

      return;
    }

    this.collapseCount = 0;

    if (!this.currentShape) {
      this.currentShape = this.nextShape;
      this.nextShape = spawnRandom();
      this.panel.updateNext(this.nextShape);
      this.currentShape.move({
        dy: 0,
        dx: Math.floor(this.board.width / 2) - Math.floor(this.currentShape.grid.length / 2)
      });
      this.board.shape = this.currentShape;
      return;
    }

    this.currentShape.move({ dy: 1 });
 
    if (!this.board.canPlaceShape(this.currentShape)) {
      this.currentShape.move({ dy: -1 });

      if (this.currentShape.dy === 0) {
        this.stop();
        this.renderer.stop();
        this.panel.drawGameOver();
        if (this.records.isRecord(this.score)) {
          this.records.saveRecord(this.score);
          this.panel.updateRecords(this.records.records);
        }
      } else {
        this.board.attachShape();
        this.board.shape = null;
        this.currentShape = null;

        this.score += this.level * 10;
      }
    } else {
      this.score += this.level;
    }

    this.panel.updateScore(this.score);
  }
}
