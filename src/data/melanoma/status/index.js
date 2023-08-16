import { faker } from '@faker-js/faker';
import { Model } from '../../Model';
import { lifeStatusSchema } from '../../melanoma/status/schema';
export function buildLifeStatuses(patients) {
    const schema = lifeStatusSchema;
    const data = [];
    for (let i = 0, id = 0; i < patients.length; i++) {
        data.push(createLifeStatus(id, patients[i].id));
        id++;
    }
    return new Model('life_statuses', 'Жизненный статус', 1, schema, data);
}
function createLifeStatus(id, patientId) {
    const status = faker.helpers.arrayElement([
        'Лечение проводится',
        'Лечение завершено планово',
        'Лечение отменено',
        'Отзыв согласия на наблюдение',
        'Зарегистрирована смерть',
    ]);
    const deathDate = status === 'Зарегистрирована смерть' ? faker.date.recent(40) : undefined;
    const deathCause = status === 'Зарегистрирована смерть'
        ? faker.helpers.arrayElement([
            'Прогрессирование основного заболевания',
            'Другая опухоль',
            'Осложнение противоопухолевого лечения',
            'Другое заболевание',
            'Неизвестно',
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
