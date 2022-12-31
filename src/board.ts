import { Shape } from "./shape";

export const EmptyCell = 0;
export const ShapeCell = 1;

export class Board {
  readonly width = 15;
  readonly height = 30;

  grid: number[][];
  shape: Shape | null = null;
  collapsed: { y: number; } | null = null;

  constructor() {
    this.grid = [];

    this.clean();
  }

  clean() {
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = EmptyCell;
      }
    }
  }

  attachShape() {
    if (!this.shape) {
      return;
    }

    for (const [y, x] of this.shape.points) {
      this.grid[y][x] = ShapeCell;
    }

    this.collapse();
  }

  collapse() {
    for (let y = this.grid.length - 1; y > 0; y--) {
      let isFull = true;

      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 0) {
          isFull = false;
        }
      }

      if (isFull) {
        this.collapsed = {
          y
        };

        break;
      }
    }
  }

  collapseRows() {
    if (!this.collapsed) {
      return;
    }

    let y = this.collapsed.y;

    while (y > 0) {
      for (let x = 0; x < this.grid[y].length; x++) {
        this.grid[y][x] = this.grid[y - 1][x];
        this.grid[y - 1][x] = 0;
      }

      y -= 1;
    }

    this.collapsed = null;
    this.collapse();
  }

  canPlaceShape(shape: Shape) {
    const { width, height } = this;
    
    for (let y = 0; y < shape.grid.length; y++) {
      for (let x = 0; x < shape.grid[y].length; x++) {
        if (shape.grid[y][x] === EmptyCell) {
          continue;
        }

        const dy = y + shape.dy;
        const dx = x + shape.dx;

        if (dx < 0 || dx > width - 1 || dy < 0 || dy > height - 1) {
          return false
        }
  
        if (this.grid[dy][dx] === ShapeCell) {
          return false; 
        } 
      }
    }

    return true;
  }
}