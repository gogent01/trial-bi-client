import { faker } from '@faker-js/faker/locale/en';
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
  return new Model('comorbidities', 'Comorbidities', 1, schema, data);
}

function createComorbidity(id: number, patientId: number): TableRow {
  const category = faker.helpers.arrayElement(['Cancer', 'Autoimmune disease', 'Other']);
  let comment = '';
  if (category === 'Cancer') {
    comment = faker.helpers.arrayElement(['Melanoma', 'Gastric cancer', 'Colon cancer', 'Lung cancer']);
  } else if (category === 'Autoimmune disease') {
    comment = faker.helpers.arrayElement([
      "Crohn's disease",
      'Psoriasis',
      'Systemic lupus erythematosus',
      'System scleroderma',
    ]);
  } else {
    comment = faker.helpers.arrayElement(['Bronchial asthma', 'COPD', 'IHD', 'Primary arterial hypertension', 'CKD']);
  }

  return {
    id,
    patient_id: patientId,
    category,
    comment,
  };
}
