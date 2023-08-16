import type { TableData, TableSchema } from './types';
export declare class Model {
    key: string;
    name: string;
    priority: number;
    schema: TableSchema;
    data: TableData;
    constructor(key: string, name: string, priority: number, schema: TableSchema, data: TableData);
    get parentKey(): string;
    static empty(): Model;
    copy(): Model;
    selectByColumnKeys(keys: string[]): Model;
    static getConflictingKeys(left: Model, right: Model): string[];
    resolveNamingConflict(key: string, direction: 'left' | 'right'): void;
}
