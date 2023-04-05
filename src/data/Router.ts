import type { Database } from '@/data/Database';
import type { DataQuery, TableSchemaInfo } from '@/data/types';
import { Model } from '@/data/Model';
import { BreastDatabase } from '@/data/breast/BreastDatabase';
import { MelanomaDatabase } from '@/data/melanoma/MelanomaDatabase';
import { QueryPlanner } from '@/data/QueryPlanner';

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

export class Router {
  trials: Trial[];

  constructor() {
    this.trials = trials;
  }

  getTrials(): TrialPublic[] {
    return this.trials.map((trial) => ({ ...trial, database: undefined }));
  }

  getCompleteSchema(trialKey: string): TableSchemaInfo {
    const trial = this.trials.find((trial) => trial.key === trialKey);
    if (!trial) return [];

    return trial.database.getCompleteSchema();
  }

  getDataFromQuery(query: DataQuery): Model {
    if (query.length === 0) return Model.empty();

    const trialKey = query[0].trialKey;
    const trial = this.trials.find((trial) => trial.key === trialKey);
    if (!trial) return Model.empty();

    const database = trial.database;
    const homogenousQuery = query.filter((dataQuery) => dataQuery.trialKey === trial.key);

    const planner = new QueryPlanner(database, homogenousQuery);
    const orderedQuery = planner.orderQuery();

    return database.getDataFromQuery(orderedQuery);
  }
}
