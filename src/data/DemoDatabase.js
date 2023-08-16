import { Model } from './Model';
export class DemoDatabase {
    constructor(length) {
        Object.defineProperty(this, "models", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.models = this.buildDatabase(length);
    }
    getCompleteSchema() {
        return this.models.reduce((columns, model) => {
            return columns.concat(model.schema.map((column) => {
                return {
                    origin: { key: model.key, name: model.name, priority: model.priority },
                    position: column.position,
                    key: column.key,
                    name: column.name,
                    isServiceColumn: !!column.primaryKey || !!column.belongsTo,
                };
            }));
        }, []);
    }
    getDataFromQuery(query) {
        const queryMap = new Map();
        query.forEach((column) => {
            const modelColumns = queryMap.get(column.modelKey) || [];
            modelColumns.push(column.columnKey);
            queryMap.set(column.modelKey, modelColumns);
        });
        const models = [];
        queryMap.forEach((columnKeys, modelKey) => {
            const selectedModel = this.getModelByKey(modelKey).selectByColumnKeys(columnKeys);
            models.push(selectedModel);
        });
        let result = models.shift() || Model.empty();
        while (models.length > 0) {
            result = this.leftJoin(result, models.shift());
        }
        return result;
    }
    getModelByKey(key) {
        return this.models.find((model) => model.key === key);
    }
    leftJoin(left, right) {
        // console.log(`${left.key} joins ${right.key}...`);
        const foreignKeyIdx = right.schema.findIndex((column) => column.belongsTo);
        const primaryKeyIdx = left.schema.findIndex((column) => column.primaryKey === right.schema[foreignKeyIdx].belongsTo);
        const namingConflictColumnKeys = Model.getConflictingKeys(left, right);
        const safeLeftModel = left.copy();
        const safeRightModel = right.copy();
        for (const key of namingConflictColumnKeys) {
            safeLeftModel.resolveNamingConflict(key, 'left');
            safeRightModel.resolveNamingConflict(key, 'right');
        }
        const joinedSchema = [...safeLeftModel.schema, ...safeRightModel.schema];
        const joinedData = [];
        safeLeftModel.data.forEach((leftRow, idx) => {
            const primaryKey = safeLeftModel.schema[primaryKeyIdx].key;
            const foreignKey = safeRightModel.schema[foreignKeyIdx].key;
            const indexesOfAllForeignRows = safeRightModel.data.reduce((indexes, rightRow, idx) => {
                if (leftRow[primaryKey] === rightRow[foreignKey])
                    indexes.push(idx);
                return indexes;
            }, []);
            while (indexesOfAllForeignRows.length > 0) {
                const foreignIdx = indexesOfAllForeignRows.shift();
                const rightRow = safeRightModel.data[foreignIdx];
                joinedData.push(Object.assign(Object.assign({}, leftRow), rightRow));
            }
        });
        return new Model('all', 'Все', 0, joinedSchema, joinedData);
    }
}
