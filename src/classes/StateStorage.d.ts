import type { ReactiveTableSchema, TableData, TableState } from '../data/types';
import type { FilterTask } from './FilterTask';
export declare class StateStorage {
    storage: TableState[];
    activeIdx: number;
    constructor();
    get state(): TableState;
    get reactiveSchema(): ReactiveTableSchema;
    get data(): TableData;
    get filters(): FilterTask[];
    add(state: TableState): void;
    duplicateState(): void;
    clear(): void;
    back(): void;
    forward(): void;
}
