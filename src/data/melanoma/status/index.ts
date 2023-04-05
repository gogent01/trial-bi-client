import { faker } from '@faker-js/faker';
import { Model } from '@/data/Model';
import type { TableRow, TableData } from '@/data/types';
import { lifeStatusSchema } from '@/data/melanoma/status/schema';

export function buildLifeStatuses(patients: TableData): Model {
  const schema = lifeStatusSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < patients.length; i++) {
    data.push(createLifeStatus(id, patients[i].id as number));
    id++;
  }
  return new Model('life_statuses', 'Жизненный статус', 1, schema, data);
}

function createLifeStatus(id: number, patientId: number): TableRow {
  const status = faker.helpers.arrayElement([
    'Лечение проводится',
    'Лечение завершено планово',
    'Лечение отменено',
    'Отзыв согласия на наблюдение',
    'Зарегистрирована смерть',
  ]);
  const deathDate = status === 'Зарегистрирована смерть' ? faker.date.recent(40) : undefined;
  const deathCause =
    status === 'Зарегистрирована смерть'
      ? faker.helpers.arrayElement([
          'Прогрессирование основного заболевания',
          'Другая опухоль',
          'Осложнение противоопухолевого лечения',
          'Другое заболевание',
          'Неизвестно',
        ])
      : undefined;

  return {
    id,
    patient_id: patientId,
    contact_date: faker.date.recent(90, '2023-02-15'),
    status,
    death_date: deathDate,
    death_cause: deathCause,
  };
}
