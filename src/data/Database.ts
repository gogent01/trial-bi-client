import { buildPatients } from '@/data/patients';
import { buildCancers } from '@/data/cancers';
import { Model } from '@/data/Model';
import type { TableData } from '@/data/types';

export class Database {
  patients: Model;
  cancers: Model;

  constructor(length: number) {
    this.patients = buildPatients(length);
    this.cancers = buildCancers(this.patients.data);
  }

  getPatients(): Model {
    return this.patients;
  }

  getCancers(): Model {
    return this.cancers;
  }

  getAll(): Model {
    return this.leftJoin(this.patients, this.cancers);
  }

  leftJoin(left: Model, right: Model): Model {
    const primaryKeyIdx = left.schema.findIndex((column) => column.primaryKey);
    const foreignKeyIdx = right.schema.findIndex((column) => (column.belongsTo || '') === left.name);
    const namingConflictColumnKeys = Model.getConflictingKeys(left, right);

    const safeLeftModel = left.copy();
    const safeRightModel = right.copy();
    for (const key of namingConflictColumnKeys) {
      safeLeftModel.resolveNamingConflict(key, 'left');
      safeRightModel.resolveNamingConflict(key, 'right');
    }

    const joinedSchema = [...safeLeftModel.schema, ...safeRightModel.schema];
    // TODO: other logic after schema join: remove redundant key column
    // joinedSchema.splice(left.schema.length + foreignKeyIdx, 1);
    const joinedData = [] as TableData;
    left.data.forEach((leftRow, idx) => {
      const primaryKey = left.schema[primaryKeyIdx].key;
      const foreignKey = right.schema[foreignKeyIdx].key;
      const indexesOfAllForeignRows = right.data.reduce((indexes: number[], rightRow, idx) => {
        if (leftRow[primaryKey] === rightRow[foreignKey]) indexes.push(idx);
        return indexes;
      }, []);
      console.log(indexesOfAllForeignRows);
      while (indexesOfAllForeignRows.length > 0) {
        const foreignIdx = indexesOfAllForeignRows.shift() as number;
        const rightRow = right.data[foreignIdx];
        joinedData.push({ ...leftRow, ...rightRow });
      }
    });

    console.log(new Model('all', joinedSchema, joinedData));

    return new Model('all', joinedSchema, joinedData);
  }
}
