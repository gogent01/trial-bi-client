import type { ColumnType, TableSchema } from '@/data/types';

export const neoTherapySchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'neo_therapies',
  },
  {
    key: 'cancer_id',
    name: 'Код онкозаболевания',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'start_date',
    name: 'Дата начала',
    type: 'date' as ColumnType,
  },
  {
    key: 'end_date',
    name: 'Дата окончания',
    type: 'date' as ColumnType,
  },
  {
    key: 'height',
    name: 'Рост, см',
    type: 'number' as ColumnType,
  },
  {
    key: 'weight',
    name: 'Вес, кг',
    type: 'number' as ColumnType,
  },
  {
    key: 'end_reason',
    name: 'Причина окончания терапии',
    type: 'factor' as ColumnType,
    levels: [
      'Плановое окончание терапии',
      'Отказ пациента от терапии',
      'Нежелательные явления',
      'Прогрессирование',
      'Смерть',
    ],
  },
].map((column, idx) => ({
  origin: { key: 'neo_therapies', name: 'Неоадъювантная терапия', priority: 2 },
  position: idx,
  ...column,
}));
