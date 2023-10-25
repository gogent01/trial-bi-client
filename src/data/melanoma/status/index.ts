import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { lifeStatusSchema } from '../../melanoma/status/schema';

export function buildLifeStatuses(patients: TableData): Model {
  const schema = lifeStatusSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < patients.length; i++) {
    data.push(createLifeStatus(id, patients[i].id as number));
    id++;
  }
  return new Model('life_status', 'Life status', 1, schema, data);
}

function createLifeStatus(id: number, patientId: number): TableRow {
  const status = faker.helpers.arrayElement([
    'Treatment in progress',
    'Treatment completed',
    'Treatment cancelled',
    'Observation consent withdrawn',
    'Death registered',
  ]);
  const deathDate = status === 'Death registered' ? faker.date.recent(40) : undefined;
  const deathCause =
    status === 'Death registered'
      ? faker.helpers.arrayElement([
          'Primary disease progression',
          'Other cancer',
          'Adverse event',
          'Other disease',
          'Unknown',
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
