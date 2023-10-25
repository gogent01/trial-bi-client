import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow } from '../../types';
import { patientSchema } from '../../breast/patients/schema';

export function buildPatients(length: number): Model {
  const schema = patientSchema;
  const data = Array.from({ length }).map((_, idx) => createPatient(idx));
  return new Model('patients', 'Patients', 0, schema, data);
}

function createPatient(id: number): TableRow {
  const centers: Record<string, string> = {
    'City Hospital 1': 'CH',
    'State Oncology Center': 'SOC',
    'State Multi-Specialty Surgical Center': 'MSC',
  };
  const center = faker.helpers.arrayElement(Object.keys(centers));
  const sex = faker.helpers.arrayElement(['Male', 'Female']);
  const history = centers[center] + '-' + faker.random.alphaNumeric(5, { casing: 'upper' });
  const code = 'RWE-BREAST-' + faker.random.numeric(4, { allowLeadingZeros: true });
  const dateOfBirth = Math.random() > 0.3 ? faker.date.birthdate({ min: 18, max: 85, mode: 'age' }) : undefined;
  const height = parseFloat(faker.finance.amount(140, 200, 1));
  const weight = parseFloat(faker.finance.amount(40, 140, 2));
  return {
    id,
    center,
    code,
    sex,
    history,
    date_of_birth: dateOfBirth,
    age: dateOfBirth ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear() : undefined,
    height,
    weight,
    bmi: Math.round((weight / (height / 100) ** 2) * 100) / 100,
  };
}
