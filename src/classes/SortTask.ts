export class SortTask {
  key: string;
  direction: 'ASC' | 'DESC';

  constructor(columnKey: string, direction: 'ASC' | 'DESC') {
    this.key = columnKey;
    this.direction = direction;
  }

  setDirection(direction: 'ASC' | 'DESC') {
    this.direction = direction;
  }
}
