import i18n from '../services/i18n';
import type { Trial, APITrial, Database, DataQuery, TableSchemaInfo } from './types';
import { Model } from './Model';
import { QueryPlanner } from './QueryPlanner';
import { axiosInstance } from '../services/axios';

const { t } = i18n.global;

export type TrialPublic = Omit<Trial, 'database'>;

export abstract class Router {
  abstract getTrials(): Promise<Trial[]>;
  abstract getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
  abstract getDataFromQuery(query: DataQuery): Promise<Model>;
}

export class DemoRouter extends Router {
  trials: TrialPublic[];
  // Demo data generators (with Faker) are large, so each trial's database is loaded and built on first use
  private databaseLoaders: Record<string, () => Promise<Database>>;
  private databases = new Map<string, Promise<Database | undefined>>();

  constructor() {
    super();
    this.trials = [
      {
        id: 0,
        key: 'breast',
        name: t('demo_trials.breast'),
        created_at: new Date('2022-01-10'),
        updated_at: new Date('2023-11-21'),
      },
      {
        id: 1,
        key: 'melanoma',
        name: t('demo_trials.melanoma'),
        created_at: new Date('2022-02-01'),
        updated_at: new Date('2023-12-05'),
      },
    ];
    this.databaseLoaders = {
      breast: () => import('./breast/BreastDatabase').then(({ BreastDatabase }) => new BreastDatabase(1870)),
      melanoma: () => import('./melanoma/MelanomaDatabase').then(({ MelanomaDatabase }) => new MelanomaDatabase(2236)),
    };
    this.prefetchGenerators();
  }

  // Downloads the generator code once the page is idle, so the first query doesn't wait for the download.
  // The databases themselves are still built only when a trial is first used.
  private prefetchGenerators(): void {
    const prefetch = () => {
      // Errors are ignored here: the download is retried when the data is actually needed
      import('./breast/BreastDatabase').catch(() => undefined);
      import('./melanoma/MelanomaDatabase').catch(() => undefined);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(prefetch);
    else setTimeout(prefetch, 1000);
  }

  private getDatabase(trialKey: string): Promise<Database | undefined> {
    const cached = this.databases.get(trialKey);
    if (cached) return cached;

    const load = this.databaseLoaders[trialKey];
    if (!load) return Promise.resolve(undefined);

    const database = load().catch((error) => {
      // Allow a retry on the next call, e.g. after a network error
      console.error(error);
      this.databases.delete(trialKey);
      return undefined;
    });
    this.databases.set(trialKey, database);
    return database;
  }

  async getTrials(): Promise<TrialPublic[]> {
    return this.trials.map((trial) => ({ ...trial }));
  }

  async getCompleteSchema(trialKey: string): Promise<TableSchemaInfo> {
    const database = await this.getDatabase(trialKey);
    return database?.getCompleteSchema() ?? [];
  }

  async getDataFromQuery(query: DataQuery): Promise<Model> {
    if (query.length === 0) return Model.empty();

    const trialKey = query[0].trialKey;
    const database = await this.getDatabase(trialKey);
    if (!database) return Model.empty();

    const homogenousQuery = query.filter((dataQuery) => dataQuery.trialKey === trialKey);
    const planner = new QueryPlanner(database, homogenousQuery);
    const orderedQuery = planner.orderQuery();

    return database.getDataFromQuery(orderedQuery);
  }
}

export class APIRouter extends Router {
  async getTrials(): Promise<Trial[]> {
    try {
      const response = await axiosInstance.get<APITrial[]>('/api/1.0/trials');
      return response.data.map(
        (trial: APITrial): Trial => ({
          id: trial.id,
          key: trial.key,
          name: trial.name,
          created_at: new Date(trial.created_at),
          updated_at: new Date(trial.updated_at),
        })
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getCompleteSchema(trialKey: string): Promise<TableSchemaInfo> {
    try {
      const response = await axiosInstance.get<TableSchemaInfo>('/api/1.0/schema', { params: { trial: trialKey } });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDataFromQuery(query: DataQuery): Promise<Model> {
    try {
      const response = await axiosInstance.post<Model>('/api/1.0/data', query);
      const { key, name, priority, schema, data } = response.data;

      // Dates arrive as ISO strings in JSON
      const dateColumnsKeys = schema.filter((column) => column.type === 'date').map((column) => column.key);
      const parsedData = data.map((row) => {
        const fixedRow = { ...row };
        for (const columnKey of dateColumnsKeys) {
          if (fixedRow[columnKey]) fixedRow[columnKey] = new Date(row[columnKey] as string);
        }
        return fixedRow;
      });

      return new Model(key, name, priority, schema, parsedData);
    } catch (error) {
      console.error(error);
      return Model.empty();
    }
  }
}
