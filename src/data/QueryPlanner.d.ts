import type { Database, DataQuery } from './types';
export declare class QueryPlanner {
    db: Database;
    query: DataQuery;
    constructor(db: Database, query: DataQuery);
    orderQuery(): DataQuery;
}
