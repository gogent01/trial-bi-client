import type { ColumnType, TableSchema } from '../../types';

export const neoTherapySchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'neo_therapies',
  },
  {
    key: 'cancer_id',
    name: 'Cancer ID',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'start_date',
    name: 'Start date',
    type: 'date' as ColumnType,
  },
  {
    key: 'end_date',
    name: 'End date',
    type: 'date' as ColumnType,
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
    key: 'end_reason',
    name: 'Reason for therapy termination',
    type: 'factor' as ColumnType,
    levels: ['Planned termination', 'Patient refused therapy', 'Adverse events', 'Disease progression', 'Death'],
  },
].map((column, idx) => ({
  origin: { key: 'neo_therapies', name: 'Neoadjuvant chemotherapy', priority: 2 },
  position: idx,
  ...column,
}));
