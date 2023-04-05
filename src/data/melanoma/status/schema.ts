import type { ColumnType, TableSchema } from '@/data/types';

export const lifeStatusSchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'life_statuses',
  },
  {
    key: 'patient_id',
    name: 'Код пациента',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'contact_date',
    name: 'Дата контакта',
    type: 'date' as ColumnType,
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
  {
    key: 'death_date',
    name: 'Дата смерти',
    type: 'date' as ColumnType,
  },
  {
    key: 'death_cause',
    name: 'Причина смерти',
    type: 'factor' as ColumnType,
    levels: [
      'Прогрессирование основного заболевания',
      'Другая опухоль',
      'Осложнение противоопухолевого лечения',
      'Другое заболевание',
      'Неизвестно',
    ],
  },
].map((column, idx) => ({
  origin: { key: 'life_statuses', name: 'Жизненный статус', priority: 1 },
  position: idx,
  ...column,
}));
