import { Shape } from './shape';

type Figure = "J" | "I" | "O" | "L" | "Z" | "T" | "S"

const templates: Record<Figure, number[][]> = {
  "J": [
    [0,1,0],
    [0,1,0],
    [1,1,0],
  ],
  "I": [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
  ],
  "O": [
    [1,1],
    [1,1]
  ],
  "L": [
    [0,1,0],
    [0,1,0],
    [0,1,1]
  ],
  "Z": [
    [1,1,0],
    [0,1,1],
    [0,0,0]
  ],
  "T": [
    [0,1,0],
    [1,1,1],
    [0,0,0]
  ],
  "S": [
    [0,1,1],
    [1,1,0],
    [0,0,0]
  ],
}

export function spawn(figure: Figure) {
  return new Shape(templates[figure]);
}

export function spawnRandom() {
  const index = Math.floor(Math.random() * 7);
  const key = Object.keys(templates)[index] as Figure;

  return spawn(key);
}