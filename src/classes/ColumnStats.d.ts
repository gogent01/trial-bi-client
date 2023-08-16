import type { TableColumn } from '../data/types';
export type StatsRow = {
    param: string;
    value: string;
};
export declare class ColumnStats {
    variable: string;
    data: StatsRow[];
    constructor();
    calculate(columnMetadata: TableColumn, columnValues: unknown[]): this;
    empty(): this;
    private buildEmptyStats;
    private buildNumberStats;
    private buildTextStats;
    private buildFactorStats;
    private buildDateStats;
    private removeNAs;
    private pretty;
    private toSentenceCase;
}
