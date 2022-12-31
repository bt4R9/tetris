import { Board, ShapeCell } from "./board";

export interface RendererProps {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  board: Board;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  board: Board;
  size = 15;

  #frameId = -1;
  #timestamp = -1;
  #speed = 1000 / 30;
  #animationId = 0;
  #boardOffsetY = 15;
  #boardOffsetX = 15;

  x0: number;
  y0: number;
  x1: number;
  y1: number;

  gap = 1;

  constructor({canvas, context, board }: RendererProps) {
    this.canvas = canvas;
    this.context = context;
    this.board = board;

    this.x0 = this.#boardOffsetY + this.gap;
    this.y0 = this.#boardOffsetX + this.gap;
  
    this.x1 = this.board.width * (this.gap + this.size) + this.#boardOffsetX * 2;
    this.y1 = this.board.height * (this.gap + this.size) + this.#boardOffsetY * 2;

    this.context = context;

    this.drawGameBoard();
  }

  start() {
    this.draw();
  }

  stop() {
    cancelAnimationFrame(this.#frameId);
  }

  drawGameBoard() {
    const { context, x0, y0, x1, y1 } = this;

    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    context.lineWidth = 0.5;
    context.strokeStyle = '#000';
  
    const offset = 4.5;

    context.beginPath();
    context.moveTo(x0 - offset, y0 - offset);
    context.lineTo(x0 - offset, y1 - this.#boardOffsetY + offset / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(x0 - offset, y0 - offset);
    context.lineTo(x1 - this.#boardOffsetX + offset / 2, y0 - offset);
    context.stroke();

    context.beginPath();
    context.moveTo(x1 - this.#boardOffsetX + offset / 2, y0 - offset);
    context.lineTo(x1 - this.#boardOffsetX + offset / 2, y1 - this.#boardOffsetY + offset / 2);
    context.stroke();

    context.beginPath();
    context.moveTo(x0 - offset, y1 - this.#boardOffsetY + offset / 2);
    context.lineTo(x1 - this.#boardOffsetX + offset / 2, y1 - this.#boardOffsetY + offset / 2);
    context.stroke();
  }

  draw = () => {
    this.#frameId = requestAnimationFrame(this.draw);
    const now = Date.now();
    const elapsed = now - this.#timestamp;

    if (elapsed < this.#speed) {
      return;
    }

    this.#timestamp = now - (elapsed % this.#speed);
    this.#animationId = (this.#animationId + 1) % 10;

    this.context.fillStyle = "#fff";
    this.context.fillRect(this.#boardOffsetX, this.#boardOffsetY, 12 * 20, 16 * 30);

    const shape = new Set(this.board.shape?.points.map(([y, x]) => `${y}-${x}`) ?? []);
    
    for (let y = 0; y < this.board.height; y++) {
      const dy = y * this.size;

      for (let x = 0; x < this.board.width; x++) {
        const dx = x * this.size;

        const offsetY = dy + this.gap * y + this.#boardOffsetY;
        const offsetX = dx + this.gap * x + this.#boardOffsetX;

        if (this.board.grid[y][x] === ShapeCell) {
          this.context.fillStyle = '#000';
          this.context.fillRect(offsetX, offsetY, this.size, this.size);
        }

        if (shape.has(`${y}-${x}`)) {
          this.context.fillStyle = '#9E9E9E';
          this.context.fillRect(offsetX, offsetY, this.size, this.size);
        }
      }
    }

    if (this.board.collapsed) {
      this.context.fillStyle = this.#animationId % 2 == 0 ? '#9E9E9E' : '#000';

      const y = this.board.collapsed.y;
      const offsetY = y * this.size + this.gap * y + this.#boardOffsetY;
            
      for (let x = 0; x < this.board.width; x++) {
        const offsetX = x * this.size + this.gap * x + this.#boardOffsetX;

        this.context.fillRect(offsetX, offsetY, this.size, this.size);
      }
    }
  }
}