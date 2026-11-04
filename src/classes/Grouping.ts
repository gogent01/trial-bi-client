import { sort } from 'fast-sort';
import { median } from 'simple-statistics';
import { CURRENT_LOCALE } from '../config/variables';
import type { GroupingReactiveTableSchema, TableRow } from '../data/types';

type CellValue = TableRow[string];

function isMissing(value: CellValue): boolean {
  return value === undefined || value === null || value === '';
}

function formatValue(value: CellValue): string {
  if (isMissing(value)) return 'NA';
  if (value instanceof Date) return value.toLocaleDateString(CURRENT_LOCALE);
  return String(value);
}

function prettyNumber(n: number): number {
  return parseFloat(n.toFixed(3));
}

/** Collapses a group of rows into one row, applying each column's grouping action */
export function compressRowGroup(rowGroup: TableRow[], groupingSchema: GroupingReactiveTableSchema): TableRow {
  const compressedRow: TableRow = {};

  groupingSchema.forEach((column) => {
    const action = column.grouping.action;
    const dataValues = rowGroup.map((row) => row[column.key]);
    const numberValues = () => dataValues.filter((value): value is number => typeof value === 'number');

    if (action === 'count') {
      compressedRow[column.key] = dataValues.length;
    } else if (action === 'first') {
      compressedRow[column.key] = dataValues[0];
    } else if (action === 'last' || action === 'hide' || action === 'none' || action === 'group') {
      compressedRow[column.key] = dataValues[dataValues.length - 1];
    } else if (action === 'nth') {
      const position = parseInt(column.grouping.param || '1', 10);
      compressedRow[column.key] = position >= 1 && position <= dataValues.length ? dataValues[position - 1] : undefined;
    } else if (action === 'all') {
      const separator = column.grouping.param || '; ';
      compressedRow[column.key] = sort(dataValues).asc().map(formatValue).join(separator);
    } else if (action === 'unique') {
      const separator = column.grouping.param || '; ';
      const uniqueValues = new Set(sort(dataValues).asc().map(formatValue));
      compressedRow[column.key] = Array.from(uniqueValues).join(separator);
    } else if (action === 'sum' || action === 'mean' || action === 'median') {
      const values = numberValues();
      if (column.type !== 'number' || values.length === 0) {
        compressedRow[column.key] = undefined;
      } else if (action === 'sum') {
        compressedRow[column.key] = prettyNumber(values.reduce((sum, value) => sum + value, 0));
      } else if (action === 'mean') {
        compressedRow[column.key] = prettyNumber(values.reduce((sum, value) => sum + value, 0) / values.length);
      } else {
        compressedRow[column.key] = prettyNumber(median(values));
      }
    }
  });

  return compressedRow;
}
