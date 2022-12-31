import { AlphaNums } from './ascii';
import { Shape } from './shape';

export interface PanelParams {
  context: CanvasRenderingContext2D;
}

export class Panel {
  context: CanvasRenderingContext2D;
  size = 3;
  gap = 0;
  y0: number;
  y1: number;
  x0: number;
  x1: number;

  constructor({ context }: PanelParams) {
    this.context = context;

    this.y0 = 16;
    this.x0 = 15 * (1 + 15) + 15 * 2;
    this.y1 = 510;
    this.x1 = 15 * (1 + 15) + 15 * 2 + 140;

    this.drawBoard();
  }

  drawBoard() {
    const { y0, x0 } = this;

    this.drawText('level'.padStart(8), { y: y0, x: x0, color: '#999' })
    this.drawText('score'.padStart(8), { y: y0 + 70, x: x0, color: '#999' });
    this.drawText('next'.padStart(8), { y: y0 + 140, x: x0, color: '#999' })
    this.drawText('records'.padStart(8), { y: y0 + 240, x: x0, color: '#999' });
  }

  drawText(str: string, options: {
    y: number;
    x: number;
    color?: string;
    size?: number;
    gap?: number;
    offset?: number;
  }) {
    const { context } = this;
    const { y, x, color = '#444', size = 3, gap = 0, offset = 5 } = options;

    context.fillStyle = color;

    let dx = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i].toUpperCase();

      if (char in AlphaNums === false) {
        throw new Error(`Symbol ${char} is not supported.`);
      }

      const grid = AlphaNums[char];

      for (let row = 0; row < grid.length; row++) {
        const row_dy = row * size;

        for (let col = 0; col < grid[row].length; col++) {
          const col_dx = col * size;

          if (grid[row][col] === 1) {
            const offset_y = y + gap * row + row_dy;
            const offset_x = x + gap * col + col_dx + dx;

            context.fillRect(offset_x, offset_y, size, size);
          }
        }
      }

      dx += (size + gap) * offset;
    }
  }

  drawGameOver() {
    const { context } = this;

    context.fillStyle = '#ddd';
    context.fillRect(40, 190, 194, 34);

    context.fillStyle = '#000';
    this.drawText('game over', {
      y: 196,
      x: 50,
      size: 4
    })
  }

  updateScore(score: number) {
    const { context, y0, x0 } = this;

    const str = String(score).padStart(8, ' ');
    context.clearRect(x0, y0 + 94, 122, 20);
    this.drawText(str, { y: y0 + 94, x: x0, color: '#000' });
  }

  updateLevel(level: number) {
    const { context, y0, x0, size } = this;

    const str = String(level).padStart(8, ' ');
    context.clearRect(x0, y0 + 24, 122, 20);
    this.drawText(str, { y: y0 + 8 * size, x: x0, color: '#000' });  }

  updateNext(next: Shape) {
    const { context, y0, x0 } = this;

    const y = y0 + 170;
    const x = x0 + 116;

    const pixelSize = 15;
    const pixelGap = 1;

    const width = next.grid[0].length;

    context.fillStyle = "#fff";
    context.fillRect(x0, y0 + 160, 124, 60);

    context.fillStyle = '#000';

    for (const [dy, dx] of next.points) {
      context.fillRect(x + dx * (pixelSize + pixelGap) - (width * (pixelSize + pixelGap)), y + dy * (pixelSize + pixelGap), pixelSize, pixelSize);
    }
  }

  updateRecords(records: [string, number][]) {
    const { context, x0 } = this;

    context.fillStyle = '#fff';
    context.fillRect(x0, 300, 130, 180);

    let y = 300;

    for (let i = 0; i < records.length; i++) {
      const [str, record] = records[i];

      this.drawText(str.padStart(12), { y: y + (i * 50), x: x0, size: 2 });
      this.drawText(String(record).padStart(12), { y: y + (i * 50) + 20, x: x0, size: 2, color: '#999' });
    }
  }
}