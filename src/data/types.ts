export type ColumnType = 'id' | 'text' | 'number' | 'date' | 'factor';

export type TableColumnInfo = {
  origin: {
    key: string;
    name: string;
  };
  key: string;
  name: string;
  isServiceColumn: boolean;
};
export type TableColumn = {
  key: string;
  name: string;
  type: ColumnType;
  levels?: string[];
  primaryKey?: boolean;
  belongsTo?: string;
};
type ReactiveColumnInfo = {
  selected: boolean;
};
type ReactiveColumn = {
  hasFilter: boolean;
  hasSort: 'NONE' | 'ASC' | 'DESC';
  sortPriority?: number;
  hasStats: boolean;
  invisible?: boolean;
};
export type ReactiveTableColumnInfo = TableColumnInfo & ReactiveColumnInfo;
export type ReactiveTableColumn = TableColumn & ReactiveColumn;

export type TableSchemaInfo = TableColumnInfo[];
export type ReactiveTableSchemaInfo = ReactiveTableColumnInfo[];
export type TableSchema = TableColumn[];
export type ReactiveTableSchema = ReactiveTableColumn[];

export type TableRow = { [key: string]: string | number | Date | undefined };
export type TableData = TableRow[];

export type DataQuery = {
  modelKey: string;
  columnKey: string;
}[];
