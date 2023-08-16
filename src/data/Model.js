export class Model {
    constructor(key, name, priority, schema, data) {
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "priority", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.key = key;
        this.name = name;
        this.priority = priority;
        this.schema = schema;
        this.data = data;
    }
    get parentKey() {
        const referenceColumn = this.schema.find((column) => !!column.belongsTo);
        if (!referenceColumn)
            return '';
        return referenceColumn.belongsTo;
    }
    static empty() {
        return new Model('empty', 'None', 100, [], []);
    }
    copy() {
        const schema = this.schema.map((column) => (Object.assign({}, column)));
        const data = this.data.map((row) => (Object.assign({}, row)));
        return new Model(this.key, this.name, this.priority, schema, data);
    }
    selectByColumnKeys(keys) {
        const schema = this.schema.filter((column) => keys.includes(column.key) || column.type === 'id');
        const allKeysToSelect = schema.map((column) => column.key);
        const data = this.data.map((row) => {
            const filteredRow = {};
            for (const key of allKeysToSelect) {
                filteredRow[key] = row[key];
            }
            return filteredRow;
        });
        return new Model(this.key, this.name, this.priority, schema, data);
    }
    static getConflictingKeys(left, right) {
        const conflictingKeys = [];
        const leftKeys = new Set(left.schema.map((column) => column.key));
        const rightKeys = right.schema.map((column) => column.key);
        for (const key of rightKeys) {
            if (leftKeys.has(key))
                conflictingKeys.push(key);
        }
        return conflictingKeys;
    }
    resolveNamingConflict(key, direction) {
        const columnIdx = this.schema.findIndex((column) => column.key === key);
        if (columnIdx < 0)
            return;
        const addendum = direction === 'left' ? '.x' : '.y';
        this.schema[columnIdx].key += addendum;
        this.schema[columnIdx].name += addendum;
        for (let i = 0; i < this.data.length; i++) {
            this.data[i][key + addendum] = this.data[i][key];
            delete this.data[i][key];
        }
    }
}
