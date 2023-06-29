import type { ColumnType, TableSchema } from '../../types';

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
    key: 'status',
    name: 'Жизненный статус',
    type: 'factor' as ColumnType,
    levels: [
      'Лечение проводится',
      'Лечение завершено планово',
      'Лечение отменено',
      'Отзыв согласия на наблюдение',
      'Зарегистрирована смерть',
    ],
  },
].map((column, idx) => ({ origin: { key: 'patients', name: 'Пациенты', priority: 0 }, position: idx, ...column }));
