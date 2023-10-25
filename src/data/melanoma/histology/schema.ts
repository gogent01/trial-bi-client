import type { ColumnType, TableSchema } from '../../types';

export const histologicCharacteristicSchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'histologic_characteristics',
  },
  {
    key: 'cancer_id',
    name: 'Cancer ID',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'form',
    name: 'Growth form',
    type: 'factor' as ColumnType,
    levels: ['Nodular melanoma', 'Superficial spreading melanoma', 'Lentiginous melanoma', 'Other'],
  },
  {
    key: 'pigmentation',
    name: 'Pigmentation',
    type: 'factor' as ColumnType,
    levels: ['Yes', 'No', 'No data'],
  },
  {
    key: 'clark',
    name: 'Clark invasion level',
    type: 'factor' as ColumnType,
    levels: ['I', 'II', 'III', 'IV', 'V'],
  },
  {
    key: 'height',
    name: 'Tumor width, mm',
    type: 'number' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'histologic_characteristics', name: 'Histologic characteristics', priority: 2 },
  position: idx,
  ...column,
}));
