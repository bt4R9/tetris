const defaultRecords: [string, number][] = [
  ['coolkid', 100000],
  ['madman', 50000],
  ['metroid', 25000],
  ['crasher', 10000]
];

export class Records {
  records: [string, number][] = [];
  count = 4;

  constructor() {
    this.records = this.read();
  }

  read() {
    let read: [string, number][] = [];

    try {
      const raw = localStorage.getItem('records');

      if (raw) {
        read = JSON.parse(raw) as [string, number][];
      }
    } catch (e) {}

    return read && read.length ? read : defaultRecords;
  }

  save() {
    localStorage.setItem('records', JSON.stringify(this.records));
  }

  isRecord(score: number) {
    const min = Math.min(...this.records.map((entry) => entry[1]));
    return score >= min;
  }

  saveRecord(score: number) {
    const nickname = prompt('Congratulations! Write your nickname.') ?? 'anonymous';
    let index = -1;

    for (let i = this.records.length - 1; i >= 0; i--) {
      if (score < this.records[i][1]) {
        index = i + 1;
        break;
      }
    }

    this.records.splice(index, 0, [nickname, score]);

    while (this.records.length > this.count) {
      this.records.pop();
    }

    this.save();
  }
}