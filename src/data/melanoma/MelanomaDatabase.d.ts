import { DemoDatabase } from '../DemoDatabase';
import type { Model } from '../Model';
export declare class MelanomaDatabase extends DemoDatabase {
    constructor(length: number);
    buildDatabase(length: number): Model[];
}
