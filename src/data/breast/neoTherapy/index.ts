import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { neoTherapySchema } from '../../breast/neoTherapy/schema';

export function buildNeoTherapies(cancers: TableData): Model {
  const schema = neoTherapySchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < cancers.length; i++) {
    data.push(createNeoTherapy(id, cancers[i].id as number));
    id++;
    while (Math.random() > 0.7) {
      data.push(createNeoTherapy(id, cancers[i].id as number));
      id++;
    }
  }
  return new Model('neo_therapies', 'Neoadjuvant chemotherapy', 2, schema, data);
}

function createNeoTherapy(id: number, cancerId: number): TableRow {
  const startDate = faker.date.recent(60, '2023-01-20T00:00:00.000Z');
  const endDate = faker.date.recent(30, '2023-03-01T00:00:00.000Z');
  const height = parseFloat(faker.finance.amount(140, 200, 1));
  const weight = parseFloat(faker.finance.amount(40, 140, 2));

  const endReason =
    Math.random() < 0.75
      ? 'Therapy completed'
      : faker.helpers.arrayElement(['Patient refused therapy', 'Adverse events', 'Disease progression', 'Death']);

  return {
    id,
    cancer_id: cancerId,
    start_date: startDate,
    end_date: endDate,
    height,
    weight,
    end_reason: endReason,
  };
}
