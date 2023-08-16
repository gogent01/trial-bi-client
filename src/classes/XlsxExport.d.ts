import type { TableData, TableSchema } from '../data/types';
export declare class XlsxExport {
    constructor();
    generateXLSX(schema: TableSchema, data: TableData, sheetName: string, fileName: string): Promise<void>;
}
