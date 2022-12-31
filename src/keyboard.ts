import EventEmitter from 'eventemitter3';

export type Key = "U" | "D" | "L" | "R" | "S";

export class Keyboard {
  events = new EventEmitter<{
    'key': (params: {
      key: Key;
    }) => unknown;
    'keyUp': () => unknown;
  }>();

  onKeyDown = (e: KeyboardEvent) => {
    const { events } = this;

    switch (e.key) {
      case "ArrowLeft":
        events.emit('key', { key: 'L' });
        break;
      case "ArrowRight":
        events.emit('key', { key: 'R' });
        break;
      case "ArrowUp":
        events.emit('key', { key: 'U' });
        break;
      case "ArrowDown":
        events.emit('key', { key: 'D' });
        break;
      case ' ':
        events.emit('key', { key: "S" });
        break;
    }
  }

  onKeyUp = () => {
    this.events.emit('keyUp');
  }

  init() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    return () => {
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
    }
  }
}