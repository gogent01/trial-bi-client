import type { Model } from './Model';
import type { Database } from './types';

export class QueryPlan {
  db: Database;
  plan: Model[];
  constructor(db: Database, model: Model) {
    this.db = db;
    this.plan = [model];
  }

  get parent(): Model {
    return this.db.getModelByKey(this.plan[0].parentKey);
  }

  get priority(): number {
    return this.plan.reduce((priority, model) => Math.min(priority, model.priority), 1000);
  }

  get modelKeys(): string[] {
    return this.plan.map((model) => model.key);
  }

  addParent() {
    const parentModel = this.db.getModelByKey(this.plan[0].parentKey);
    this.plan.unshift(parentModel);
  }
}
