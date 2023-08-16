import { DemoDatabase } from '../DemoDatabase';
import type { Model } from '../Model';
export declare class BreastDatabase extends DemoDatabase {
    constructor(length: number);
    buildDatabase(length: number): Model[];
}
