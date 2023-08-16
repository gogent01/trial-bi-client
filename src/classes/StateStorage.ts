import type { ReactiveTableSchema, TableData, TableState } from '../data/types';
import type { FilterTask } from './FilterTask';

export class StateStorage {
  storage: TableState[];
  activeIdx: number;

  constructor() {
    this.storage = [];
    this.activeIdx = -1;
  }

  get state(): TableState {
    if (this.activeIdx > -1) return this.storage[this.activeIdx];
    return { reactiveSchema: [], data: [], filters: [] };
  }

  get reactiveSchema(): ReactiveTableSchema {
    if (this.activeIdx > -1) return this.storage[this.activeIdx].reactiveSchema;
    return [];
  }

  get data(): TableData {
    if (this.activeIdx > -1) return this.storage[this.activeIdx].data;
    return [];
  }

  get filters(): FilterTask[] {
    if (this.activeIdx > -1) return this.storage[this.activeIdx].filters;
    return [];
  }

  add(state: TableState): void {
    if (this.activeIdx < this.storage.length - 1) {
      this.storage.splice(this.activeIdx + 1, Infinity, state);
    } else {
      this.storage.push(state);
    }
    this.activeIdx += 1;
  }

  duplicateState(): void {
    const data: TableData = this.data.map((row) => Object.assign({}, row));
    const reactiveSchema: ReactiveTableSchema = this.reactiveSchema.map((column) => Object.assign({}, column));
    const filters = this.filters.map((filterTask) => filterTask.clone());
    this.add({ data, reactiveSchema, filters });
  }

  clear(): void {
    this.storage = [];
  }

  back(): void {
    if (this.activeIdx > 0) this.activeIdx -= 1;
  }

  forward(): void {
    if (this.activeIdx < this.storage.length - 1) this.activeIdx += 1;
  }
}
