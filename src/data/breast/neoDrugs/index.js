import { faker } from '@faker-js/faker';
import { Model } from '../../Model';
import { neoDrugSchema } from '../../breast/neoDrugs/schema';
export function buildNeoDrugs(neoTherapies) {
    const schema = neoDrugSchema;
    const data = [];
    for (let i = 0, id = 0; i < neoTherapies.length; i++) {
        data.push(createNeoDrug(id, neoTherapies[i].id));
        id++;
        while (Math.random() > 0.5) {
            data.push(createNeoDrug(id, neoTherapies[i].id));
            id++;
        }
    }
    return new Model('neo_drugs', 'Препараты неоадъювантной терапии', 3, schema, data);
}
function createNeoDrug(id, neoTherapyId) {
    const drugName = faker.helpers.arrayElement([
        'Схема: TCHP',
        'Доцетаксел',
        'Паклитаксел',
        'Трастузумаб',
        'Карбоплатин',
    ]);
    const units = faker.helpers.arrayElement(['мг', 'мг/кг', 'ЕД']);
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
