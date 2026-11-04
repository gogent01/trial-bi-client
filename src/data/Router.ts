import i18n from '../services/i18n';
import type { Trial, APITrial, DataQuery, TableSchemaInfo } from './types';
import { Model } from './Model';
import { BreastDatabase } from './breast/BreastDatabase';
import { MelanomaDatabase } from './melanoma/MelanomaDatabase';
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
  trials: Trial[];

  constructor() {
    super();
    this.trials = [
      {
        id: 0,
        key: 'breast',
        name: t('demo_trials.breast'),
        database: new BreastDatabase(1870),
        created_at: new Date('2022-01-10'),
        updated_at: new Date('2023-11-21'),
      },
      {
        id: 1,
        key: 'melanoma',
        name: t('demo_trials.melanoma'),
        database: new MelanomaDatabase(2236),
        created_at: new Date('2022-02-01'),
        updated_at: new Date('2023-12-05'),
      },
    ];
  }

  async getTrials(): Promise<TrialPublic[]> {
    return this.trials.map((trial) => ({ ...trial, database: undefined }));
  }

  async getCompleteSchema(trialKey: string): Promise<TableSchemaInfo> {
    const trial = this.trials.find((trial) => trial.key === trialKey);
    return trial?.database?.getCompleteSchema() ?? [];
  }

  async getDataFromQuery(query: DataQuery): Promise<Model> {
    if (query.length === 0) return Model.empty();

    const trialKey = query[0].trialKey;
    const trial = this.trials.find((trial) => trial.key === trialKey);
    if (!trial?.database) return Model.empty();

    const homogenousQuery = query.filter((dataQuery) => dataQuery.trialKey === trial.key);
    const planner = new QueryPlanner(trial.database, homogenousQuery);
    const orderedQuery = planner.orderQuery();

    return trial.database.getDataFromQuery(orderedQuery);
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
