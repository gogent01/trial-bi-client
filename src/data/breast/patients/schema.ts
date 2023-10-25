import type { ColumnType, TableSchema } from '../../types';

export const patientSchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'patients',
  },
  {
    key: 'center',
    name: 'Medical organization',
    type: 'factor' as ColumnType,
    levels: ['City Hospital 1', 'State Oncology Center', 'State Multi-Specialty Surgical Center'],
  },
  {
    key: 'code',
    name: 'Patient code',
    type: 'text' as ColumnType,
  },
  {
    key: 'sex',
    name: 'Sex',
    type: 'factor' as ColumnType,
    levels: ['Male', 'Female'],
  },
  {
    key: 'history',
    name: 'Case number',
    type: 'text' as ColumnType,
  },
  {
    key: 'date_of_birth',
    name: 'Date of birth',
    type: 'date' as ColumnType,
  },
  {
    key: 'age',
    name: 'Age',
    type: 'number' as ColumnType,
  },
  {
    key: 'height',
    name: 'Height, cm',
    type: 'number' as ColumnType,
  },
  {
    key: 'weight',
    name: 'Weight, kg',
    type: 'number' as ColumnType,
  },
  {
    key: 'bmi',
    name: 'BMI',
    type: 'number' as ColumnType,
  },
].map((column, idx) => ({ origin: { key: 'patients', name: 'Пациенты', priority: 0 }, position: idx, ...column }));
