import type { FilterTask } from '../classes/FilterTask';
import type { Model } from './Model';
export type ColumnType = 'id' | 'text' | 'number' | 'date' | 'factor';
export type TableColumnInfo = {
    origin: {
        key: string;
        name: string;
        priority: number;
    };
    position: number;
    key: string;
    name: string;
    isServiceColumn: boolean;
};
export type TableColumn = {
    origin: {
        key: string;
        name: string;
        priority: number;
    };
    position: number;
    key: string;
    name: string;
    type: ColumnType;
    levels?: string[];
    primaryKey?: string;
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
export type TableRow = {
    [key: string]: string | number | Date | undefined;
};
export type TableData = TableRow[];
export type DataQueryRow = {
    trialKey: string;
    modelKey: string;
    columnKey: string;
};
export type DataQuery = DataQueryRow[];
export type GroupingAction = 'none' | 'group' | 'hide' | 'count' | 'first' | 'last' | 'nth' | 'sum' | 'mean' | 'median' | 'all' | 'unique';
export type GroupingMixin = {
    grouping: {
        action: GroupingAction;
        param?: string;
    };
};
export type GroupingReactiveTableColumn = ReactiveTableColumn & GroupingMixin;
export type GroupingReactiveTableSchema = GroupingReactiveTableColumn[];
export interface SelectOption {
    text: string;
    value: string;
    disabled?: boolean;
}
export type TableState = {
    data: TableData;
    reactiveSchema: ReactiveTableSchema;
    filters: FilterTask[];
};
export interface Database {
    getCompleteSchema(): TableSchemaInfo;
    getDataFromQuery(query: DataQuery): Model;
    getModelByKey(key: string): Model;
    leftJoin(left: Model, right: Model): Model;
}
export type APITrial = {
    id: number;
    key: string;
    name: string;
    created_at: string;
    updated_at: string;
};
export type Trial = {
    id: number;
    key: string;
    name: string;
    database?: Database;
    created_at: Date;
    updated_at: Date;
};
export {};
