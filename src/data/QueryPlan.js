export class QueryPlan {
    constructor(db, model) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = db;
        this.plan = [model];
    }
    get parent() {
        return this.db.getModelByKey(this.plan[0].parentKey);
    }
    get priority() {
        return this.plan.reduce((priority, model) => Math.min(priority, model.priority), 1000);
    }
    get modelKeys() {
        return this.plan.map((model) => model.key);
    }
    addParent() {
        const parentModel = this.db.getModelByKey(this.plan[0].parentKey);
        this.plan.unshift(parentModel);
    }
}
