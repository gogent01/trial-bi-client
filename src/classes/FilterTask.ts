import type { ColumnType, TableRow } from '../data/types';

export type FilterType = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'sw' | 'has' | 'ew' | 'range' | 'any';

export class FilterTask {
  columnKey: string;
  columnName: string;
  columnType: ColumnType;
  columnLevels?: string[];
  type?: FilterType;
  value?: unknown;
  multipleValues: string[];
  rangeValues: [unknown | undefined, unknown | undefined];

  constructor(columnKey: string, columnName: string, columnType: ColumnType, columnLevels?: string[]) {
    this.columnKey = columnKey;
    this.columnName = columnName;
    this.columnType = columnType;
    this.columnLevels = columnLevels;
    this.multipleValues = [] as string[];
    this.rangeValues = [undefined, undefined];
  }

  updateType(filterType: FilterType) {
    this.type = filterType;
  }

  updateValue(value?: unknown) {
    this.value = value;
  }

  updateRangeValues(rangeValues: [unknown | undefined, unknown | undefined]) {
    this.rangeValues = rangeValues;
  }

  updateMultipleValues(values: string[]) {
    this.multipleValues = values;
  }

  isEmpty(): Boolean {
    if (this.type === 'range') {
      return this.rangeValues[0] === undefined && this.rangeValues[1] === undefined;
    } else if (this.type === 'any') {
      return this.multipleValues.length === 0;
    }
    return this.value === undefined;
  }

  apply(row: TableRow): boolean {
    if (this.isEmpty()) return true;

    if (this.columnType === 'text') {
      const cellValue = row[this.columnKey] as string;
      if (this.type === 'eq') return cellValue === (this.value as string);
      if (this.type === 'sw') return cellValue.startsWith(this.value as string);
      if (this.type === 'ew') return cellValue.endsWith(this.value as string);
      if (this.type === 'has') return cellValue.includes(this.value as string);
    } else if (this.columnType === 'number') {
      const cellValue = row[this.columnKey] as number;
      if (this.type === 'eq') return cellValue === (this.value as number);
      if (this.type === 'gt') return cellValue > (this.value as number);
      if (this.type === 'gte') return cellValue >= (this.value as number);
      if (this.type === 'lt') return cellValue < (this.value as number);
      if (this.type === 'lte') return cellValue <= (this.value as number);
      if (this.type === 'range')
        return (
          cellValue >= ((this.rangeValues[0] as number) || Number.NEGATIVE_INFINITY) &&
          cellValue < ((this.rangeValues[1] as number) || Number.POSITIVE_INFINITY)
        );
    } else if (this.columnType === 'date') {
      const cellValue = row[this.columnKey] as Date;
      if (this.type === 'eq') return cellValue.toDateString() === (this.value as Date).toDateString();
      if (this.type === 'gt') return cellValue > (this.value as Date);
      if (this.type === 'gte') return cellValue >= (this.value as Date);
      if (this.type === 'lt') return cellValue < (this.value as Date);
      if (this.type === 'lte') return cellValue <= (this.value as Date);
      if (this.type === 'range')
        return (
          cellValue >= ((this.rangeValues[0] as Date) || Number.NEGATIVE_INFINITY) &&
          cellValue < ((this.rangeValues[1] as Date) || Number.POSITIVE_INFINITY)
        );
    } else if (this.columnType === 'factor') {
      const cellValue = row[this.columnKey] as string;
      if (this.type === 'sw') return cellValue.startsWith(this.value as string);
      if (this.type === 'ew') return cellValue.endsWith(this.value as string);
      if (this.type === 'has') return cellValue.includes(this.value as string);
      if (this.type === 'any') return this.multipleValues.indexOf(cellValue) >= 0;
    }

    return false;
  }
}
