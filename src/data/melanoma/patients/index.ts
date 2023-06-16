import { faker } from '@faker-js/faker';
faker.setLocale('ru');
import { Model } from '../../Model';
import type { TableRow } from '../../types';
import { patientSchema } from '../../melanoma/patients/schema';

export function buildPatients(length: number): Model {
  const schema = patientSchema;
  const data = Array.from({ length }).map((_, idx) => createPatient(idx));
  return new Model('patients', 'Пациенты', 0, schema, data);
}

function createPatient(id: number): TableRow {
  const gender = faker.helpers.arrayElement(['Мужской', 'Женский']);
  const fullname = gender === 'Мужской' ? faker.name.fullName({ sex: 'male' }) : faker.name.fullName({ sex: 'female' });
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const status = faker.helpers.arrayElement([
    'Лечение проводится',
    'Лечение завершено планово',
    'Лечение отменено',
    'Отзыв согласия на наблюдение',
    'Зарегистрирована смерть',
  ]);
  return {
    id,
    center: faker.helpers.arrayElement(['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62']),
    fullname,
    gender,
    history: faker.random.alphaNumeric(5, { casing: 'upper' }),
    date_of_birth: dateOfBirth,
    age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
    status,
  };
}
