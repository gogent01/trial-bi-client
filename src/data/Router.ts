import type { Database } from '@/data/Database';
import type { DataQuery, TableSchemaInfo } from '@/data/types';
import { Model } from '@/data/Model';
import { BreastDatabase } from '@/data/breast/BreastDatabase';
import { MelanomaDatabase } from '@/data/melanoma/MelanomaDatabase';
import { QueryPlanner } from '@/data/QueryPlanner';
import { axiosInstance } from '@/services/axios';

type Trial = {
  key: string;
  name: string;
  database: Database;
  created_at: Date;
  updated_at: Date;
};

export type TrialPublic = Omit<Trial, 'database'>;

const trials: Trial[] = [
  {
    key: 'breast',
    name: 'RWE: рак молочной железы',
    database: new BreastDatabase(279),
    created_at: new Date('2022-01-10'),
    updated_at: new Date('2023-01-18'),
  },
  {
    key: 'melanoma',
    name: 'RWE: меланома',
    database: new MelanomaDatabase(350),
    created_at: new Date('2022-02-01'),
    updated_at: new Date('2022-12-05'),
  },
];

abstract class Router {
  abstract getTrials(): Promise<TrialPublic[]>;
  abstract getCompleteSchema(trialKey: string): Promise<TableSchemaInfo>;
  abstract getDataFromQuery(query: DataQuery): Promise<Model>;
}

export class FakeRouter extends Router {
  trials: Trial[];

  constructor() {
    super();
    this.trials = trials;
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

      resolve(trial.database.getCompleteSchema());
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

      const planner = new QueryPlanner(database, homogenousQuery);
      const orderedQuery = planner.orderQuery();

      resolve(database.getDataFromQuery(orderedQuery));
    });
  }
}

export class APIRouter extends Router {
  async getTrials(): Promise<TrialPublic[]> {
    const trials: Trial[] = [
      {
        key: 'rwe_breast',
        name: 'RWE: рак молочной железы',
        database: new BreastDatabase(279),
        created_at: new Date('2022-01-10'),
        updated_at: new Date('2023-01-18'),
      },
    ];

    return new Promise((resolve) => {
      resolve(trials.map((trial) => ({ ...trial, database: undefined })));
    });
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
