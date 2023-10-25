import type { ColumnType, TableSchema } from '../../types';

export const lifeStatusSchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'life_status',
  },
  {
    key: 'patient_id',
    name: 'Patient ID',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'contact_date',
    name: 'Contact date',
    type: 'date' as ColumnType,
  },
  {
    key: 'status',
    name: 'Life status',
    type: 'factor' as ColumnType,
    levels: [
      'Treatment in progress',
      'Treatment completed',
      'Treatment cancelled',
      'Observation consent withdrawn',
      'Death registered',
    ],
  },
  {
    key: 'death_date',
    name: 'Death date',
    type: 'date' as ColumnType,
  },
  {
    key: 'death_cause',
    name: 'Death cause',
    type: 'factor' as ColumnType,
    levels: ['Primary disease progression', 'Other cancer', 'Adverse event', 'Other disease', 'Unknown'],
  },
].map((column, idx) => ({
  origin: { key: 'life_status', name: 'Life status', priority: 1 },
  position: idx,
  ...column,
}));
