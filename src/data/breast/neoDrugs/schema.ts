import type { ColumnType, TableSchema } from '../../types';

export const neoDrugSchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'neo_therapies',
  },
  {
    key: 'neo_therapy_id',
    name: 'Код неоадъювантной терапии',
    type: 'id' as ColumnType,
    belongsTo: 'neo_therapies',
  },
  {
    key: 'drug_name',
    name: 'Название препарата',
    type: 'factor' as ColumnType,
    levels: ['Схема: TCHP', 'Доцетаксел', 'Паклитаксел', 'Трастузумаб', 'Карбоплатин'],
  },
  {
    key: 'dose',
    name: 'Доза',
    type: 'number' as ColumnType,
  },
  {
    key: 'units',
    name: 'Единицы измерения',
    type: 'factor' as ColumnType,
    levels: ['мг', 'мг/кг', 'ЕД'],
  },
  {
    key: 'courses',
    name: 'Число курсов',
    type: 'number' as ColumnType,
  },
  {
    key: 'commentary',
    name: 'Комментарий',
    type: 'text' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'neo_drugs', name: 'Препараты неоадъювантной терапии', priority: 3 },
  position: idx,
  ...column,
}));
