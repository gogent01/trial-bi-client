import { faker } from '@faker-js/faker';
import { Model } from '../../Model';
import { surgerySchema } from '../../melanoma/surgery/schema';
export function buildSurgeries(cancers) {
    const schema = surgerySchema;
    const data = [];
    for (let i = 0, id = 0; i < cancers.length; i++) {
        data.push(createSurgery(id, cancers[i].id));
        id++;
        while (Math.random() > 0.85) {
            data.push(createSurgery(id, cancers[i].id));
            id++;
        }
    }
    return new Model('surgeries', 'Хирургическое лечение', 2, schema, data);
}
function createSurgery(id, cancerId) {
    const aim = faker.helpers.arrayElement(['Иссечение первичной опухоли', 'Метастазэктомия', 'Удаление рецидива']);
    const result = faker.helpers.arrayElement(['Радикальное удаление', 'Циторедукция', undefined]);
    return {
        id,
        cancer_id: cancerId,
        aim,
        date: faker.date.recent(120),
        result,
    };
}
