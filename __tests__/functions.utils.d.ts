import type { Model } from '../src/data/Model';
import type { TableColumn } from '../src/data/types';
export declare function getColumnMetadata(model: Model, columnKey: string): TableColumn | undefined;
export declare function getColumnValues(model: Model, columnKey: string): unknown[];
