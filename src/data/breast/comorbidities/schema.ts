import type { ColumnType, TableSchema } from '../../types';

export const comorbiditySchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'comorbidities',
  },
  {
    key: 'patient_id',
    name: 'Patient ID',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'category',
    name: 'Comorbidity type',
    type: 'factor' as ColumnType,
    levels: ['Cancer', 'Autoimmune disease', 'Other'],
  },
  {
    key: 'comment',
    name: 'Commentary',
    type: 'text' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'comorbidities', name: 'Comorbidities', priority: 1 },
  position: idx,
  ...column,
}));
