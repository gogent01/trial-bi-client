import { faker } from '@faker-js/faker/locale/ru';
import { Model } from '../../Model';
import type { TableRow } from '../../types';
import { patientSchema } from '../../breast/patients/schema';

export function buildPatients(length: number): Model {
  const schema = patientSchema;
  const data = Array.from({ length }).map((_, idx) => createPatient(idx));
  return new Model('patients', 'Пациенты', 0, schema, data);
}

function createPatient(id: number): TableRow {
  const center =
    Math.random() > 0.2 ? faker.helpers.arrayElement(['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62']) : undefined;
  const gender = faker.helpers.arrayElement(['Мужской', 'Женский']);
  const fullname = gender === 'Мужской' ? faker.name.fullName({ sex: 'male' }) : faker.name.fullName({ sex: 'female' });
  const dateOfBirth = Math.random() > 0.3 ? faker.date.birthdate({ min: 18, max: 85, mode: 'age' }) : undefined;
  const height = parseFloat(faker.finance.amount(140, 200, 1));
  const weight = parseFloat(faker.finance.amount(40, 140, 2));
  return {
    id,
    center,
    fullname,
    gender,
    history: faker.random.alphaNumeric(5, { casing: 'upper' }),
    date_of_birth: dateOfBirth,
    age: dateOfBirth ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear() : undefined,
    height,
    weight,
    bmi: Math.round((weight / (height / 100) ** 2) * 100) / 100,
  };
}
