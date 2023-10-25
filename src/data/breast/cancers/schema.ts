import type { ColumnType, TableSchema } from '../../types';

export const cancerSchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'cancers',
  },
  {
    key: 'patient_id',
    name: 'Patient ID',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'histologic_subtype',
    name: 'Histologic subtype',
    type: 'factor' as ColumnType,
    levels: ['Unspecific / ductal', 'Lobular', 'Metaplastic', 'Apocrine differentiation', 'Other'],
  },
  {
    key: 'detailed_localization',
    name: 'Detailed localization',
    type: 'text' as ColumnType,
  },
  {
    key: 'date_of_symptoms',
    name: 'Date of first symptoms',
    type: 'date' as ColumnType,
  },
  {
    key: 'date_of_diagnosis',
    name: 'Date of diagnosis',
    type: 'date' as ColumnType,
  },
  {
    key: 'stage_T',
    name: 'Stage T (at the time of diagnosis)',
    type: 'factor' as ColumnType,
    levels: ['0', 'is(DCIS)', 'is(LCIS)', '1', '2', '3', '4a', '4b', '4c', '4d'],
  },
  {
    key: 'stage_N',
    name: 'Stage N (at the time of diagnosis)',
    type: 'factor' as ColumnType,
    levels: ['X', '0', '1', '2', '2a', '2b', '3', '3a', '3b', '3c'],
  },
  {
    key: 'stage_M',
    name: 'Stage M (at the time of diagnosis)',
    type: 'factor' as ColumnType,
    levels: ['0', '1'],
  },
  {
    key: 'stage',
    name: 'Tumor stage (at the time of diagnosis)',
    type: 'factor' as ColumnType,
    levels: ['0', 'I A', 'I B', 'II A', 'II B', 'III A', 'III B', 'III C', 'IV'],
  },
  {
    key: 'her2',
    name: 'HER2 status',
    type: 'factor' as ColumnType,
    levels: ['3+', '2+', '1+', '0'],
  },
].map((column, idx) => ({
  origin: { key: 'cancers', name: 'Cancers', priority: 1 },
  position: idx,
  ...column,
}));
