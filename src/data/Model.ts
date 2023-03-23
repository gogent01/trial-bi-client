import type { TableData, TableSchema } from '@/data/types';

export class Model {
  key: string;
  name: string;
  schema: TableSchema;
  data: TableData;

  constructor(key: string, name: string, schema: TableSchema, data: TableData) {
    this.key = key;
    this.name = name;
    this.schema = schema;
    this.data = data;
  }

  copy(): Model {
    const schema = this.schema.map((column) => ({ ...column }));
    const data = this.data.map((row) => ({ ...row }));
    return new Model(this.key, this.name, schema, data);
  }

  static getConflictingKeys(left: Model, right: Model): string[] {
    const conflictingKeys = [] as string[];
    const leftKeys = new Set(left.schema.map((column) => column.key));
    const rightKeys = right.schema.map((column) => column.key);
    for (const key of rightKeys) {
      if (leftKeys.has(key)) conflictingKeys.push(key);
    }

    return conflictingKeys;
  }

  resolveNamingConflict(key: string, direction: 'left' | 'right'): void {
    const columnIdx = this.schema.findIndex((column) => column.key === key);
    if (columnIdx < 0) return;

    const addendum = direction === 'left' ? '.x' : '.y';
    this.schema[columnIdx].key += addendum;
    this.schema[columnIdx].name += addendum;
    for (let i = 0; i < this.data.length; i++) {
      this.data[i][key + addendum] = this.data[i][key];
      delete this.data[i][key];
    }
  }
}
