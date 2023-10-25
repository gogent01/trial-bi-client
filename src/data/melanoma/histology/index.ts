import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { histologicCharacteristicSchema } from '../../melanoma/histology/schema';

export function buildhistologicCharacteristics(cancers: TableData): Model {
  const schema = histologicCharacteristicSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < cancers.length; i++) {
    data.push(createHistologicCharacteristic(id, cancers[i].id as number));
    id++;
  }
  return new Model('histologic_characteristics', 'Histologic characteristics', 2, schema, data);
}

function createHistologicCharacteristic(id: number, cancerId: number): TableRow {
  const form = faker.helpers.arrayElement([
    'Nodular melanoma',
    'Superficial spreading melanoma',
    'Lentiginous melanoma',
    'Other',
  ]);
  const pigmentation = faker.helpers.arrayElement(['Yes', 'No', 'No data']);
  const clark = faker.helpers.arrayElement(['I', 'II', 'III', 'IV', 'V']);

  return {
    id,
    cancer_id: cancerId,
    form,
    pigmentation,
    clark,
    height: faker.datatype.number({ min: 0, max: 12 }),
  };
}
