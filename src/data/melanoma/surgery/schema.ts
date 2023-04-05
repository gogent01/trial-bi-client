import type { ColumnType, TableSchema } from '@/data/types';

export const surgerySchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'surgeries',
  },
  {
    key: 'cancer_id',
    name: 'Код онкозаболевания',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'aim',
    name: 'Цель хирургического лечения',
    type: 'factor' as ColumnType,
    levels: ['Иссечение первичной опухоли', 'Метастазэктомия', 'Удаление рецидива'],
  },
  {
    key: 'date',
    name: 'Дата хирургического лечения',
    type: 'date' as ColumnType,
  },
  {
    key: 'result',
    name: 'Исход хирургического лечения',
    type: 'factor' as ColumnType,
    levels: ['Радикальное удаление', 'Циторедукция'],
  },
].map((column, idx) => ({
  origin: { key: 'surgeries', name: 'Хирургическое лечение', priority: 2 },
  position: idx,
  ...column,
}));
