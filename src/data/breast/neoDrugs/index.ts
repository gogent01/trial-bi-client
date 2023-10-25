import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow, TableData } from '../../types';
import { neoDrugSchema } from '../../breast/neoDrugs/schema';

export function buildNeoDrugs(neoTherapies: TableData): Model {
  const schema = neoDrugSchema;
  const data = [] as TableData;

  for (let i = 0, id = 0; i < neoTherapies.length; i++) {
    data.push(createNeoDrug(id, neoTherapies[i].id as number));
    id++;
    while (Math.random() > 0.5) {
      data.push(createNeoDrug(id, neoTherapies[i].id as number));
      id++;
    }
  }
  return new Model('neo_drugs', 'Neoadjuvant chemotherapy drugs', 3, schema, data);
}

function createNeoDrug(id: number, neoTherapyId: number): TableRow {
  const drugName: string = faker.helpers.arrayElement([
    'TCHP',
    'Docetaxel',
    'Paclitaxel',
    'Trastuzumab',
    'Carboplatin',
  ]);
  const units: string = faker.helpers.arrayElement(['mg', 'mg/kg', 'ME']);

  return {
    id,
    neo_therapy_id: neoTherapyId,
    drug_name: drugName,
    dose: faker.datatype.number({ min: 0.01, max: 2, precision: 0.01 }),
    units,
    courses: faker.datatype.number({ min: 4, max: 7 }),
    commentary: Math.random() > 0.7 ? faker.lorem.sentences(1) : '',
  };
}
