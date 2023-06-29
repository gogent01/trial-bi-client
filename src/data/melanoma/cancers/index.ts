import { faker } from '@faker-js/faker';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { cancerSchema } from '../../melanoma/cancers/schema';

export function buildCancers(patients: TableData): Model {
  const schema = cancerSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < patients.length; i++) {
    data.push(createCancer(id, patients[i].id as number));
    id++;
    while (Math.random() > 0.95) {
      data.push(createCancer(id, patients[i].id as number));
      id++;
    }
  }
  return new Model('cancers', 'Онкозаболевания', 1, schema, data);
}

function createCancer(id: number, patientId: number): TableRow {
  const date_of_symptoms = faker.date.birthdate({ min: 0, max: 5, mode: 'age' });
  const date_of_diagnosis = faker.date.between(date_of_symptoms, new Date());
  return {
    id,
    patient_id: patientId,
    localization: faker.helpers.arrayElement([
      'Меланома кожи',
      'Меланома слизистых',
      'Увеальная меланома',
      'Меланома без выявленного первичного очага',
      'Меланома конъюнктивы',
      'Меланома кожи века',
    ]),
    localization_comment: Math.random() > 0.4 ? faker.lorem.sentences(2) : undefined,
    date_of_symptoms,
    date_of_diagnosis,
    ldh: faker.datatype.number({ min: 105, max: 390 }),
    stage_T: faker.helpers.arrayElement(['0', 'is(DCIS)', 'is(LCIS)', '1', '2', '3', '4a', '4b', '4c', '4d']),
    stage_N: faker.helpers.arrayElement(['X', '0', '1', '2', '2a', '2b', '3', '3a', '3b', '3c']),
    stage_M: faker.helpers.arrayElement(['0', '1']),
    stage: faker.helpers.arrayElement(['0', 'I A', 'I B', 'II A', 'II B', 'III A', 'III B', 'III C', 'IV']),
  };
}
