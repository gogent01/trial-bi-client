export class StateStorage {
    constructor() {
        Object.defineProperty(this, "storage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "activeIdx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.storage = [];
        this.activeIdx = -1;
    }
    get state() {
        if (this.activeIdx > -1)
            return this.storage[this.activeIdx];
        return { reactiveSchema: [], data: [], filters: [] };
    }
    get reactiveSchema() {
        if (this.activeIdx > -1)
            return this.storage[this.activeIdx].reactiveSchema;
        return [];
    }
    get data() {
        if (this.activeIdx > -1)
            return this.storage[this.activeIdx].data;
        return [];
    }
    get filters() {
        if (this.activeIdx > -1)
            return this.storage[this.activeIdx].filters;
        return [];
    }
    add(state) {
        if (this.activeIdx < this.storage.length - 1) {
            this.storage.splice(this.activeIdx + 1, Infinity, state);
        }
        else {
            this.storage.push(state);
        }
        this.activeIdx += 1;
    }
    duplicateState() {
        const data = this.data.map((row) => Object.assign({}, row));
        const reactiveSchema = this.reactiveSchema.map((column) => Object.assign({}, column));
        const filters = this.filters.map((filterTask) => filterTask.clone());
        this.add({ data, reactiveSchema, filters });
    }
    clear() {
        this.storage = [];
    }
    back() {
        if (this.activeIdx > 0)
            this.activeIdx -= 1;
    }
    forward() {
        if (this.activeIdx < this.storage.length - 1)
            this.activeIdx += 1;
    }
}
