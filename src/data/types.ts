export type ColumnType = 'text' | 'number' | 'date' | 'factor';

export type TableColumn = {
  key: string;
  name: string;
  type: ColumnType;
  levels?: string[];
};
export type TableRow = { [key: string]: string | number | Date | undefined };

export type TableSchema = TableColumn[];
export type TableData = TableRow[];
export type Model = {
  schema: TableSchema;
  data: TableData;
};

type ReactiveColumn = {
  hasFilter: boolean;
  hasSort: 'NONE' | 'ASC' | 'DESC';
  sortPriority?: number;
  hasStats: boolean;
};
export type ReactiveTableColumn = (TableColumn & ReactiveColumn)[];
