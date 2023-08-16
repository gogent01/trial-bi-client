import type { ColumnType, TableRow } from '../data/types';
export type FilterType = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'sw' | 'has' | 'ew' | 'range' | 'any';
export declare class FilterTask {
    columnKey: string;
    columnName: string;
    columnType: ColumnType;
    columnLevels?: string[];
    type?: FilterType;
    value?: unknown;
    multipleValues: string[];
    rangeValues: [unknown | undefined, unknown | undefined];
    constructor(columnKey: string, columnName: string, columnType: ColumnType, columnLevels?: string[]);
    clone(): FilterTask;
    setType(filterType: FilterType): void;
    setValue(value?: unknown): void;
    setRangeValues(rangeValues: [unknown | undefined, unknown | undefined]): void;
    setMultipleValues(values: string[]): void;
    isEmpty(): Boolean;
    apply(row: TableRow): boolean;
}
