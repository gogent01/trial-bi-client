import type { Model } from './Model';
import type { Database } from './types';
export declare class QueryPlan {
    db: Database;
    plan: Model[];
    constructor(db: Database, model: Model);
    get parent(): Model;
    get priority(): number;
    get modelKeys(): string[];
    addParent(): void;
}
