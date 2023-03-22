export type ColumnType = 'id' | 'text' | 'number' | 'date' | 'factor';

export type TableColumn = {
  key: string;
  name: string;
  type: ColumnType;
  levels?: string[];
  primaryKey?: boolean;
  belongsTo?: string;
};
export type TableRow = { [key: string]: string | number | Date | undefined };

export type TableSchema = TableColumn[];
export type TableData = TableRow[];

type ReactiveColumn = {
  hasFilter: boolean;
  hasSort: 'NONE' | 'ASC' | 'DESC';
  sortPriority?: number;
  hasStats: boolean;
};
export type ReactiveTableColumn = (TableColumn & ReactiveColumn)[];
