import { faker } from '@faker-js/faker/locale/en';
import { Model } from '../../Model';
import type { TableRow } from '../../types';
import { patientSchema } from '../../melanoma/patients/schema';

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
  const code = 'MCT-MELANOMA-' + faker.random.numeric(4, { allowLeadingZeros: true });
  const sex = faker.helpers.arrayElement(['Male', 'Female']);
  const history = centers[center] + '-' + faker.random.alphaNumeric(5, { casing: 'upper' });
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const status = faker.helpers.arrayElement([
    'Treatment in progress',
    'Treatment completed',
    'Treatment cancelled',
    'Observation consent withdrawn',
    'Death registered',
  ]);
  return {
    id,
    center,
    code,
    sex,
    history,
    date_of_birth: dateOfBirth,
    age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
    status,
  };
}
