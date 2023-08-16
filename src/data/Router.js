import { Model } from './Model';
import { BreastDatabase } from './breast/BreastDatabase';
import { MelanomaDatabase } from './melanoma/MelanomaDatabase';
import { QueryPlanner } from './QueryPlanner';
import { axiosInstance } from '../services/axios';
class Router {
}
export class FakeRouter extends Router {
    constructor() {
        super();
        Object.defineProperty(this, "trials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.trials = [
            {
                id: 0,
                key: 'breast',
                name: 'RWE: рак молочной железы',
                database: new BreastDatabase(279),
                created_at: new Date('2022-01-10'),
                updated_at: new Date('2023-01-18'),
            },
            {
                id: 1,
                key: 'melanoma',
                name: 'RWE: меланома',
                database: new MelanomaDatabase(350),
                created_at: new Date('2022-02-01'),
                updated_at: new Date('2022-12-05'),
            },
        ];
    }
    async getTrials() {
        return new Promise((resolve) => {
            resolve(this.trials.map((trial) => (Object.assign(Object.assign({}, trial), { database: undefined }))));
        });
    }
    async getCompleteSchema(trialKey) {
        return new Promise((resolve) => {
            const trial = this.trials.find((trial) => trial.key === trialKey);
            if (!trial)
                return [];
            resolve(trial.database.getCompleteSchema());
        });
    }
    async getDataFromQuery(query) {
        return new Promise((resolve) => {
            if (query.length === 0)
                resolve(Model.empty());
            const trialKey = query[0].trialKey;
            const trial = this.trials.find((trial) => trial.key === trialKey);
            if (!trial)
                resolve(Model.empty());
            const database = trial.database;
            const homogenousQuery = query.filter((dataQuery) => dataQuery.trialKey === trial.key);
            const planner = new QueryPlanner(database, homogenousQuery);
            const orderedQuery = planner.orderQuery();
            resolve(database.getDataFromQuery(orderedQuery));
        });
    }
}
export class APIRouter extends Router {
    async getTrials() {
        const response = await axiosInstance.get('/api/1.0/trials').catch((error) => console.log(error));
        if (!response)
            return [];
        const apiTrials = response.data;
        return apiTrials.map((trial) => ({
            id: trial.id,
            key: trial.key,
            name: trial.name,
            created_at: new Date(trial.created_at),
            updated_at: new Date(trial.updated_at),
        }));
    }
    async getCompleteSchema(trialKey) {
        return axiosInstance
            .get('/api/1.0/schema', { params: { trial: trialKey } })
            .then((response) => {
            return response.data;
        })
            .catch((error) => console.log(error));
    }
    async getDataFromQuery(query) {
        return axiosInstance
            .post('/api/1.0/data', query)
            .then((response) => {
            const model = response.data;
            const dateColumnsKeys = model.schema
                .filter((column) => column.type === 'date')
                .map((column) => column.key);
            model.data = model.data.map((row) => {
                const fixedRow = Object.assign({}, row);
                for (const key of dateColumnsKeys) {
                    if (fixedRow[key])
                        fixedRow[key] = new Date(row[key]);
                }
                return fixedRow;
            });
            return model;
        })
            .catch((error) => console.log(error));
    }
}
