import { buildPatients } from '@/data/patients';
import { buildCancers } from '@/data/cancers';
import { Model } from '@/data/Model';
import type { TableColumn, TableData, TableSchemaInfo, DataQuery } from '@/data/types';

export class Database {
  models: Model[];

  constructor(length: number) {
    const patients = buildPatients(length);
    const cancers = buildCancers(patients.data);
    this.models = [patients, cancers];
  }

  getCompleteSchema(): TableSchemaInfo {
    return this.models.reduce((columns: TableSchemaInfo, model: Model) => {
      return columns.concat(
        model.schema.map((column: TableColumn) => {
          return {
            origin: { key: model.key, name: model.name },
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

    const sortedModels = models.sort((modelA: Model, modelB: Model) => modelA.key.localeCompare(modelB.key));
    let result: Model = sortedModels.pop() || Model.empty();

    while (sortedModels.length > 0) {
      result = this.leftJoin(result, sortedModels.pop()!);
    }

    return result;
  }

  getModelByKey(key: string): Model {
    return this.models.find((model) => model.key === key) as Model;
  }

  getPatients(): Model {
    return this.getModelByKey('patients');
  }

  getCancers(): Model {
    return this.getModelByKey('cancers');
  }

  getAll(): Model {
    const patients = this.getModelByKey('patients');
    const cancers = this.getModelByKey('cancers');
    return this.leftJoin(patients, cancers);
  }

  leftJoin(left: Model, right: Model): Model {
    const primaryKeyIdx = left.schema.findIndex((column) => column.primaryKey);
    const foreignKeyIdx = right.schema.findIndex((column) => (column.belongsTo || '') === left.key);
    const namingConflictColumnKeys = Model.getConflictingKeys(left, right);

    const safeLeftModel = left.copy();
    const safeRightModel = right.copy();
    for (const key of namingConflictColumnKeys) {
      safeLeftModel.resolveNamingConflict(key, 'left');
      safeRightModel.resolveNamingConflict(key, 'right');
    }

    const joinedSchema = [...safeLeftModel.schema, ...safeRightModel.schema];
    const joinedData = [] as TableData;
    left.data.forEach((leftRow, idx) => {
      const primaryKey = left.schema[primaryKeyIdx].key;
      const foreignKey = right.schema[foreignKeyIdx].key;
      const indexesOfAllForeignRows = right.data.reduce((indexes: number[], rightRow, idx) => {
        if (leftRow[primaryKey] === rightRow[foreignKey]) indexes.push(idx);
        return indexes;
      }, []);

      while (indexesOfAllForeignRows.length > 0) {
        const foreignIdx = indexesOfAllForeignRows.shift() as number;
        const rightRow = right.data[foreignIdx];
        joinedData.push({ ...leftRow, ...rightRow });
      }
    });

    return new Model('all', 'Все', joinedSchema, joinedData);
  }
}
