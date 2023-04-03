import type { ColumnType, TableSchema } from '@/data/types';

export const patientSchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'patients',
  },
  {
    key: 'center',
    name: 'МО',
    type: 'factor' as ColumnType,
    levels: ['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62'],
  },
  {
    key: 'fullname',
    name: 'ФИО',
    type: 'text' as ColumnType,
  },
  {
    key: 'gender',
    name: 'Пол',
    type: 'factor' as ColumnType,
    levels: ['Мужской', 'Женский'],
  },
  {
    key: 'history',
    name: 'Номер ИБ',
    type: 'text' as ColumnType,
  },
  {
    key: 'date_of_birth',
    name: 'Дата рождения',
    type: 'date' as ColumnType,
  },
  {
    key: 'age',
    name: 'Возраст',
    type: 'number' as ColumnType,
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
    key: 'bmi',
    name: 'ИМТ',
    type: 'number' as ColumnType,
  },
].map((column, idx) => ({ origin: { key: 'patients', name: 'Пациенты', priority: 0 }, position: idx, ...column }));
