export class Shape {
  grid: number[][];
  dy = 0
  dx = 0

  constructor(grid: number[][]) {
    this.grid = grid.map(row => ([...row]));
  }

  get points() {
    const points: [number, number][] = [];

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid.length; x++) {
        if (this.grid[y][x] === 1) {
          points.push([y + this.dy, x + this.dx]);
        }
      }
    }

    return points;
  }

  move({ dy = 0, dx = 0 }: {dy?: number; dx?: number}) {
    this.dy += dy;
    this.dx += dx;
  }

  rotate(clockwise = true) {
    const n = this.grid.length;
  
    for (let y = 0; y < n; y++) {
      for (let x = y; x < n; x++) {
        const temp = this.grid[y][x];
        this.grid[y][x] = this.grid[x][y];
        this.grid[x][y] = temp;
      }
    }
  
    if (clockwise) {
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < Math.floor(this.grid[0].length / 2); x++) {
          const temp = this.grid[y][x];
          this.grid[y][x] = this.grid[y][this.grid[0].length - 1 - x];
          this.grid[y][this.grid[0].length - 1 - x] = temp;
        }
      }
    } else {
      for (let x = 0; x < this.grid[0].length; x++) {
        for (let y = 0; y < Math.floor(this.grid.length / 2); y++) {
          const temp = this.grid[y][x];
          this.grid[y][x] = this.grid[this.grid.length - 1 - y][x];
          this.grid[this.grid.length - 1 - y][x] = temp;
        }
      }
    }
  }
}