import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { surgerySchema } from '../../melanoma/surgery/schema';

export function buildSurgeries(cancers: TableData): Model {
  const schema = surgerySchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < cancers.length; i++) {
    data.push(createSurgery(id, cancers[i].id as number));
    id++;
    while (Math.random() > 0.85) {
      data.push(createSurgery(id, cancers[i].id as number));
      id++;
    }
  }
  return new Model('surgeries', 'Surgical treatment', 2, schema, data);
}

function createSurgery(id: number, cancerId: number): TableRow {
  const aim = faker.helpers.arrayElement([
    'Resection of primary tumor',
    'Metastasectomy',
    'Resection of recurrent tumor',
  ]);
  const result = faker.helpers.arrayElement(['Radical resection', 'Cytoreduction', undefined]);

  return {
    id,
    cancer_id: cancerId,
    aim,
    date: faker.date.recent(120),
    result,
  };
}
