import type { TableData, TableRow, TableSchema } from './types';

/** Key of a column in query results: unique across joined tables and independent of which columns were picked */
export function resultKey(tableKey: string, columnKey: string): string {
  return `${tableKey}.${columnKey}`;
}

export class Model {
  key: string;
  name: string;
  priority: number;
  schema: TableSchema;
  data: TableData;

  constructor(key: string, name: string, priority: number, schema: TableSchema, data: TableData) {
    this.key = key;
    this.name = name;
    this.priority = priority;
    this.schema = schema;
    this.data = data;
  }

  get parentKey(): string {
    const referenceColumn = this.schema.find((column) => !!column.belongsTo);
    if (!referenceColumn) return '';
    return referenceColumn.belongsTo!;
  }

  static empty(): Model {
    return new Model('empty', 'None', 100, [], []);
  }

  /** Selects the given columns plus ID columns, with keys turned into result keys */
  selectByColumnKeys(keys: string[]): Model {
    const selectedColumns = this.schema.filter((column) => keys.includes(column.key) || column.type === 'id');
    const schema = selectedColumns.map((column) => ({ ...column, key: resultKey(this.key, column.key) }));
    const data = this.data.map((row) => {
      const filteredRow: TableRow = {};
      for (const column of selectedColumns) {
        filteredRow[resultKey(this.key, column.key)] = row[column.key];
      }
      return filteredRow;
    });

    return new Model(this.key, this.name, this.priority, schema, data);
  }
}
