import type { Model } from '../src/data/Model';
import type { TableColumn } from '../src/data/types';

export function getColumnMetadata(model: Model, columnKey: string): TableColumn | undefined {
  return model.schema.find((column) => column.key === columnKey);
}

export function getColumnValues(model: Model, columnKey: string): unknown[] {
  return model.data.map((row) => row[columnKey]);
}
