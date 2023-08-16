import { Model } from './Model';
import type { Database, TableSchemaInfo, DataQuery } from './types';
export declare abstract class DemoDatabase implements Database {
    models: Model[];
    protected constructor(length: number);
    abstract buildDatabase(length: number): Model[];
    getCompleteSchema(): TableSchemaInfo;
    getDataFromQuery(query: DataQuery): Model;
    getModelByKey(key: string): Model;
    leftJoin(left: Model, right: Model): Model;
}
