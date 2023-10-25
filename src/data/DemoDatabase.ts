import { Model } from './Model';
import type { Database, TableColumn, TableData, TableSchemaInfo, DataQuery } from './types';

export abstract class DemoDatabase implements Database {
  models: Model[];

  protected constructor(length: number) {
    this.models = this.buildDatabase(length);
  }

  abstract buildDatabase(length: number): Model[];

  getCompleteSchema(): TableSchemaInfo {
    return this.models.reduce((columns: TableSchemaInfo, model: Model) => {
      return columns.concat(
        model.schema.map((column: TableColumn) => {
          return {
            origin: { key: model.key, name: model.name, priority: model.priority },
            position: column.position,
            key: column.key,
            name: column.name,
            isServiceColumn: !!column.primaryKey || !!column.belongsTo,
          };
        })
      );
    }, []);
  }

  getDataFromQuery(query: DataQuery): Model {
    const queryMap = new Map<string, string[]>();
    query.forEach((column) => {
      const modelColumns = queryMap.get(column.modelKey) || [];
      modelColumns.push(column.columnKey);
      queryMap.set(column.modelKey, modelColumns);
    });

    const models: Model[] = [];
    queryMap.forEach((columnKeys, modelKey) => {
      const selectedModel = this.getModelByKey(modelKey).selectByColumnKeys(columnKeys);
      models.push(selectedModel);
    });

    let result: Model = models.shift() || Model.empty();

    while (models.length > 0) {
      result = this.leftJoin(result, models.shift()!);
    }

    return result;
  }

  getModelByKey(key: string): Model {
    return this.models.find((model) => model.key === key) as Model;
  }

  leftJoin(left: Model, right: Model): Model {
    const foreignKeyIdx = right.schema.findIndex((column) => column.belongsTo);
    const primaryKeyIdx = left.schema.findIndex(
      (column) => column.primaryKey === right.schema[foreignKeyIdx].belongsTo
    );
    const namingConflictColumnKeys = Model.getConflictingKeys(left, right);

    const safeLeftModel = left.copy();
    const safeRightModel = right.copy();
    for (const key of namingConflictColumnKeys) {
      safeLeftModel.resolveNamingConflict(key, 'left');
      safeRightModel.resolveNamingConflict(key, 'right');
    }

    const joinedSchema = [...safeLeftModel.schema, ...safeRightModel.schema];
    const joinedData = [] as TableData;

    safeLeftModel.data.forEach((leftRow, idx) => {
      const primaryKey = safeLeftModel.schema[primaryKeyIdx].key;
      const foreignKey = safeRightModel.schema[foreignKeyIdx].key;
      const indexesOfAllForeignRows = safeRightModel.data.reduce((indexes: number[], rightRow, idx) => {
        if (leftRow[primaryKey] === rightRow[foreignKey]) indexes.push(idx);
        return indexes;
      }, []);

      while (indexesOfAllForeignRows.length > 0) {
        const foreignIdx = indexesOfAllForeignRows.shift() as number;
        const rightRow = safeRightModel.data[foreignIdx];
        joinedData.push({ ...leftRow, ...rightRow });
      }
    });

    return new Model('all', 'All', 0, joinedSchema, joinedData);
  }
}
