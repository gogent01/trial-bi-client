import { Model } from './Model';
import type { Database, TableColumn, TableData, TableRow, TableSchemaInfo, DataQuery } from './types';

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

    // Result keys are prefixed with the table, so columns of joined tables never clash
    const joinedSchema = [...left.schema, ...right.schema];
    const joinedData = [] as TableData;

    const primaryKey = left.schema[primaryKeyIdx].key;
    const foreignKey = right.schema[foreignKeyIdx].key;

    const rightRowsByKey = new Map<TableRow[string], TableData>();
    for (const rightRow of right.data) {
      const rows = rightRowsByKey.get(rightRow[foreignKey]);
      if (rows) rows.push(rightRow);
      else rightRowsByKey.set(rightRow[foreignKey], [rightRow]);
    }

    const emptyRightRow: TableRow = Object.fromEntries(right.schema.map((column) => [column.key, undefined]));

    for (const leftRow of left.data) {
      const matchingRows = rightRowsByKey.get(leftRow[primaryKey]);
      if (!matchingRows || leftRow[primaryKey] === undefined) {
        joinedData.push({ ...leftRow, ...emptyRightRow });
        continue;
      }
      for (const rightRow of matchingRows) {
        joinedData.push({ ...leftRow, ...rightRow });
      }
    }

    return new Model('all', 'All', 0, joinedSchema, joinedData);
  }
}
