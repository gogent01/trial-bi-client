import i18n from '../services/i18n';
import type { DemoDatabase } from './DemoDatabase';
import type { Trial, APITrial, DataQuery, TableSchemaInfo } from './types';
import { Model } from './Model';
import { BreastDatabase } from './breast/BreastDatabase';
import { MelanomaDatabase } from './melanoma/MelanomaDatabase';
import { QueryPlanner } from './QueryPlanner';
import { axiosInstance } from '../services/axios';

const { t } = i18n.global;

export type TrialPublic = Omit<Trial, 'database'>;

abstract class Router {
  abstract getTrials(): Promise<Trial[]>;
  abstract getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
  abstract getDataFromQuery(query: DataQuery): Promise<Model>;
}

export class FakeRouter extends Router {
  trials: Trial[];

  constructor() {
    super();
    this.trials = [
      {
        id: 0,
        key: 'breast',
        name: t('demo_trials.breast'),
        database: new BreastDatabase(279),
        created_at: new Date('2022-01-10'),
        updated_at: new Date('2023-11-21'),
      },
      {
        id: 1,
        key: 'melanoma',
        name: t('demo_trials.melanoma'),
        database: new MelanomaDatabase(350),
        created_at: new Date('2022-02-01'),
        updated_at: new Date('2023-12-05'),
      },
    ];
  }

  async getTrials(): Promise<TrialPublic[]> {
    return new Promise((resolve) => {
      resolve(this.trials.map((trial) => ({ ...trial, database: undefined })));
    });
  }

  async getCompleteSchema(trialKey: string): Promise<TableSchemaInfo> {
    return new Promise((resolve) => {
      const trial = this.trials.find((trial) => trial.key === trialKey);
      if (!trial) return [];

      resolve(trial.database!.getCompleteSchema());
    });
  }

  async getDataFromQuery(query: DataQuery): Promise<Model> {
    return new Promise((resolve) => {
      if (query.length === 0) resolve(Model.empty());

      const trialKey = query[0].trialKey;
      const trial = this.trials.find((trial) => trial.key === trialKey);
      if (!trial) resolve(Model.empty());

      const database = trial!.database;
      const homogenousQuery = query.filter((dataQuery) => dataQuery.trialKey === trial!.key);

      const planner = new QueryPlanner(database!, homogenousQuery);
      const orderedQuery = planner.orderQuery();

      resolve(database!.getDataFromQuery(orderedQuery));
    });
  }
}

export class APIRouter extends Router {
  async getTrials(): Promise<Trial[]> {
    const response = await axiosInstance.get('/api/1.0/trials').catch((error) => console.log(error));

    if (!response) return [];

    const apiTrials: APITrial[] = response.data;
    return apiTrials.map(
      (trial: APITrial): Trial => ({
        id: trial.id,
        key: trial.key,
        name: trial.name,
        created_at: new Date(trial.created_at),
        updated_at: new Date(trial.updated_at),
      })
    );
  }
  async getCompleteSchema(trialKey: string): Promise<TableSchemaInfo> {
    return axiosInstance
      .get('/api/1.0/schema', { params: { trial: trialKey } })
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.log(error));
  }

  async getDataFromQuery(query: DataQuery): Promise<Model> {
    return axiosInstance
      .post('/api/1.0/data', query)
      .then((response) => {
        const model = response.data;

        const dateColumnsKeys = (model as Model).schema
          .filter((column) => column.type === 'date')
          .map((column) => column.key);

        model.data = (model as Model).data.map((row) => {
          const fixedRow = { ...row };
          for (const key of dateColumnsKeys) {
            if (fixedRow[key]) fixedRow[key] = new Date(row[key] as string);
          }
          return fixedRow;
        });

        return model;
      })
      .catch((error) => console.log(error));
  }
}
