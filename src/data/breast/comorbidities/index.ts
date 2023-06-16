import { faker } from '@faker-js/faker';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { comorbiditySchema } from '../../breast/comorbidities/schema';

export function buildComorbidities(patients: TableData): Model {
  const schema = comorbiditySchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < patients.length; i++) {
    data.push(createComorbidity(id, patients[i].id as number));
    id++;
    while (Math.random() > 0.7) {
      data.push(createComorbidity(id, patients[i].id as number));
      id++;
    }
  }
  return new Model('comorbidities', 'Сопутствующие заболевания', 1, schema, data);
}

function createComorbidity(id: number, patientId: number): TableRow {
  const category = faker.helpers.arrayElement(['Онкологическое заболевание', 'Аутоиммунное заболевание', 'Другое']);
  let comment = '';
  if (category === 'Онкологическое заболевание') {
    comment = faker.helpers.arrayElement(['Меланома', 'Рак желудка', 'Рак толстой кишки', 'Рак легкого']);
  } else if (category === 'Аутоиммунное заболевание') {
    comment = faker.helpers.arrayElement([
      'Болезнь Крона',
      'Псориаз',
      'Системная красная волчанка',
      'Системная склеродерма',
    ]);
  } else {
    comment = faker.helpers.arrayElement([
      'Бронхиальная астма',
      'ХОБЛ',
      'ИБС',
      'Первичная артериальная гипертензия',
      'Хроническая болезнь почек',
    ]);
  }

  return {
    id,
    patient_id: patientId,
    category,
    comment,
  };
}
