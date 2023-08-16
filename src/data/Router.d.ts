import type { Trial, DataQuery, TableSchemaInfo } from './types';
import { Model } from './Model';
export type TrialPublic = Omit<Trial, 'database'>;
declare abstract class Router {
    abstract getTrials(): Promise<Trial[]>;
    abstract getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
    abstract getDataFromQuery(query: DataQuery): Promise<Model>;
}
export declare class FakeRouter extends Router {
    trials: Trial[];
    constructor();
    getTrials(): Promise<TrialPublic[]>;
    getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
    getDataFromQuery(query: DataQuery): Promise<Model>;
}
export declare class APIRouter extends Router {
    getTrials(): Promise<Trial[]>;
    getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
    getDataFromQuery(query: DataQuery): Promise<Model>;
}
export {};
