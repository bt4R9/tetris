import { Shape } from './shape';
import { Writer, Mono_5x7 } from 'retrotype';

export interface PanelParams {
  context: CanvasRenderingContext2D;
}

export class Panel {
  context: CanvasRenderingContext2D;
  writer: Writer;
  symbolWidth: number;
  size = 3;
  gap = 0;
  y0: number;
  y1: number;
  x0: number;
  x1: number;

  constructor({ context }: PanelParams) {
    this.context = context;

    this.writer = new Writer({
      context,
      font: Mono_5x7,
    });

    this.symbolWidth = (Mono_5x7.symbol_width * 2) + (Mono_5x7.default_inter_letter_width ?? 0);

    this.y0 = 16;
    this.x0 = 15 * (1 + 15) + 15 * 2;
    this.y1 = 510;
    this.x1 = 15 * (1 + 15) + 15 * 2 + 140;

    this.drawBoard();
  }

  drawBoard() {
    const { symbolWidth } = this;

    this.writer.write('LEVEL', {
      size: 2,
      gap: 0,
      color: 0x999999,
      padding: 4,
      area: { x: 270 + (symbolWidth * 6), y: 11, width: 140, height: 23 }
    });

    this.writer.write('SCORE', {
      size: 2,
      gap: 0,
      color: 0x999999,
      padding: 4,
      area: { x: 270 + (symbolWidth * 6), y: 80, width: 140, height: 23 }
    });

    this.writer.write('NEXT', {
      size: 2,
      gap: 0,
      color: 0x999999,
      padding: 4,
      area: { x: 270 + (symbolWidth * 7), y: 155, width: 140, height: 23 }
    });

    this.writer.write('RECORDS', {
      size: 2,
      gap: 0,
      color: 0x999999,
      padding: 4,
      area: { x: 270 + (symbolWidth * 4), y: 265, width: 140, height: 23 }
    });
  }

  drawGameOver() {
    const { writer } = this;

    writer.animate('GAME OVER!', {
      area: { x: 14, y: 190, width: 240, height: 50 },
      padding: 10,
      size: 4,
      clear_background_color: 0xdddddd,
      color: 0x000000
    }, {
      fps: 15
    });
  }

  updateScore(score: number) {
    const { symbolWidth, writer } = this;
    const str = String(score)

    writer.write(str, {
      size: 2,
      gap: 0,
      color: 0x000000,
      clear_background_color: 0xffffff,
      padding: 4,
      area: { x: 270 + (symbolWidth * (11 - str.length)), y: 105, width: 140, height: 23 }
    });
  }

  updateLevel(level: number) {
    const { symbolWidth, writer } = this;
    const str = String(level)

    writer.write(str, {
      size: 2,
      gap: 0,
      color: 0x000000,
      clear_background_color: 0xffffff,
      padding: 4,
      area: { x: 270 + (symbolWidth * (11 - str.length)), y: 35, width: 140, height: 23 }
    });
  }

  updateNext(next: Shape) {
    const { context, y0, x0 } = this;

    const pixelSize = 15;
    const pixelGap = 1;
    const finalSize = pixelSize + pixelGap;

    const y = y0 + 170;
    const x = x0 + 116 + finalSize;

    const width = next.grid[0].length;

    context.fillStyle = "#fff";
    context.fillRect(330, y, 124, 60);

    context.fillStyle = '#000';

    for (const [dy, dx] of next.points) {
      context.fillRect(x + dx * finalSize - (width * finalSize), y + dy * finalSize, pixelSize, pixelSize);
    }
  }

  updateRecords(records: [string, number][]) {
    const { context, writer } = this;
    const symbolWidth = Mono_5x7.symbol_width + (Mono_5x7.default_inter_letter_width ?? 0);
    const y0 = 300;

    context.fillStyle = '#fff';
    context.fillRect(270, y0, 140, 198);

    for (let i = 0; i < records.length; i++) {
      const [str, _record] = records[i];
      const record = String(_record);
      const dy = y0 + i * 40;

      writer.write(str, {
        area: { x: 270 + (symbolWidth * (19 - str.length)), y: dy, width: 140, height: 23 },
        padding: 4,
        clear_background_color: 0xffffff,
        color: 0x000000,
        size: 1,
        gap: 0,
      });

      writer.write(record, {
        area: { x: 270 + (symbolWidth * (19 - record.length)), y: dy + 15, width: 140, height: 23 },
        padding: 4,
        clear_background_color: 0xffffff,
        color: 0x999999,
        size: 1,
        gap: 0,
      });
    }
  }
}