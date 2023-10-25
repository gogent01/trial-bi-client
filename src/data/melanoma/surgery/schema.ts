import type { ColumnType, TableSchema } from '../../types';

export const surgerySchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'surgeries',
  },
  {
    key: 'cancer_id',
    name: 'Cancer ID',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'aim',
    name: 'Aim of surgery',
    type: 'factor' as ColumnType,
    levels: ['Resection of primary tumor', 'Metastasectomy', 'Resection of recurrent tumor'],
  },
  {
    key: 'date',
    name: 'Surgery date',
    type: 'date' as ColumnType,
  },
  {
    key: 'result',
    name: 'Surgery result',
    type: 'factor' as ColumnType,
    levels: ['Radical resection', 'Cytoreduction'],
  },
].map((column, idx) => ({
  origin: { key: 'surgeries', name: 'Surgical treatment', priority: 2 },
  position: idx,
  ...column,
}));
