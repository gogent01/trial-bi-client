import type { ColumnType, TableSchema } from '@/data/types';

export const histologicCharacteristicSchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'histologic_characteristics',
  },
  {
    key: 'cancer_id',
    name: 'Код онкозаболевания',
    type: 'id' as ColumnType,
    belongsTo: 'cancers',
  },
  {
    key: 'form',
    name: 'Форма роста',
    type: 'factor' as ColumnType,
    levels: ['Узловая', 'Поверхностно распространающаяся', 'Лентиго', 'Другое'],
  },
  {
    key: 'pigmentation',
    name: 'Наличие пигмента',
    type: 'factor' as ColumnType,
    levels: ['Да', 'Нет', 'Нет данных'],
  },
  {
    key: 'clark',
    name: 'Уровень инвазии по Кларку',
    type: 'factor' as ColumnType,
    levels: ['I', 'II', 'III', 'IV', 'V'],
  },
  {
    key: 'height',
    name: 'Толщина опухоли, мм',
    type: 'number' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'histologic_characteristics', name: 'Гистологическая характеристика', priority: 2 },
  position: idx,
  ...column,
}));
