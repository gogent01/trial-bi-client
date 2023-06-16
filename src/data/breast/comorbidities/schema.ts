import type { ColumnType, TableSchema } from '../../types';

export const comorbiditySchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'comorbidities',
  },
  {
    key: 'patient_id',
    name: 'Код пациента',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'category',
    name: 'Вид заболевания',
    type: 'factor' as ColumnType,
    levels: ['Онкологическое заболевание', 'Аутоиммунное заболевание', 'Другое'],
  },
  {
    key: 'comment',
    name: 'Комментарий',
    type: 'text' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'comorbidities', name: 'Сопутствующие заболевания', priority: 1 },
  position: idx,
  ...column,
}));
