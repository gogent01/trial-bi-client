import { faker } from '@faker-js/faker';
import { Model } from '@/data/Model';
import type { TableRow, TableData } from '@/data/types';
import { cancerSchema } from '@/data/cancers/schema';

export function buildCancers(patients: TableData): Model {
  const schema = cancerSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < patients.length; i++) {
    data.push(createCancer(id, patients[i].id as number));
    id++;
    while (Math.random() > 0.7) {
      data.push(createCancer(id, patients[i].id as number));
      id++;
    }
  }
  return new Model('cancers', schema, data);
}

function createCancer(id: number, patientId: number): TableRow {
  const date_of_symptoms = faker.date.birthdate({ min: 0, max: 5, mode: 'age' });
  const date_of_diagnosis = faker.date.between(date_of_symptoms, new Date());
  return {
    id,
    patient_id: patientId,
    histologic_subtype: faker.helpers.arrayElement([
      'Неспецифический/неспецифицированный/протоковый',
      'Дольковый',
      'Метапластический',
      'Апокринная дифференцировка',
      'Другое',
      undefined,
    ]),
    detailed_localization: Math.random() > 0.4 ? faker.lorem.sentences(2) : undefined,
    date_of_symptoms,
    date_of_diagnosis,
    stage_T: faker.helpers.arrayElement(['0', 'is(DCIS)', 'is(LCIS)', '1', '2', '3', '4a', '4b', '4c', '4d']),
    stage_N: faker.helpers.arrayElement(['X', '0', '1', '2', '2a', '2b', '3', '3a', '3b', '3c']),
    stage_M: faker.helpers.arrayElement(['0', '1']),
    stage: faker.helpers.arrayElement(['0', 'I A', 'I B', 'II A', 'II B', 'III A', 'III B', 'III C', 'IV']),
    her2: faker.helpers.arrayElement(['3+', '2+', '1+', '0', undefined]),
  };
}