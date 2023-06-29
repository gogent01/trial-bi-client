import type { Database } from './Database';
import type { DataQuery, DataQueryRow } from './types';
import { QueryPlan } from './QueryPlan';

export class QueryPlanner {
  db: Database;
  query: DataQuery;

  constructor(db: Database, query: DataQuery) {
    this.db = db;
    this.query = query;
  }

  orderQuery(): DataQuery {
    const plans: QueryPlan[] = this.query
      .reduce((keys: string[], row: DataQueryRow) => {
        if (!keys.includes(row.modelKey)) keys.push(row.modelKey);
        return keys;
      }, [])
      .map((key) => this.db.getModelByKey(key))
      .sort((modelA, modelB) => modelA.priority - modelB.priority)
      .map((model) => new QueryPlan(this.db, model));

    if (plans.length === 0) return [];

    const superplan: QueryPlan[] = [];
    superplan.push(plans.shift()!);

    let counter = 0;
    while (plans.length > 0 && counter < 1000) {
      const existingKeys = superplan.map((plan) => plan.modelKeys).flat(1);
      const existingPriority = superplan[0].priority;
      const plan = plans[0];
      counter++;

      if (existingKeys.includes(plan.modelKeys[0])) {
        plans.shift();
      } else if (existingKeys.includes(plan.parent.key)) {
        superplan.push(plans.shift()!);
      } else if (existingPriority === plan.priority) {
        superplan[0].addParent();
      } else if (existingPriority < plan.priority) {
        plan.addParent();
      }
    }

    const modelOrder = superplan.flatMap((plan) => plan.modelKeys);

    const orderedQuery: DataQuery = [];
    modelOrder.forEach((modelKey) => {
      if (this.query.map((row) => row.modelKey).includes(modelKey)) {
        orderedQuery.push(...this.query.filter((row) => row.modelKey === modelKey));
      } else {
        orderedQuery.push({ trialKey: 'breast', modelKey, columnKey: 'id' });
      }
    });

    return orderedQuery;
  }
}
