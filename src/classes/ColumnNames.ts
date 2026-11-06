import type { TableSchema } from '../data/types';

/** Adds the table name to every shown column whose name repeats in a query result: "Height, cm (Patients)" */
export function withUniqueNames(schema: TableSchema): TableSchema {
  const shownColumns = schema.filter((column) => column.type !== 'id');
  const nameCounts = new Map<string, number>();
  shownColumns.forEach((column) => nameCounts.set(column.name, (nameCounts.get(column.name) ?? 0) + 1));

  return schema.map((column) =>
    column.type !== 'id' && nameCounts.get(column.name)! > 1
      ? { ...column, name: `${column.name} (${column.origin.name})` }
      : column
  );
}
