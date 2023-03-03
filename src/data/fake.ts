import { faker } from '@faker-js/faker';

type FakeQueryColumn = {
  key: string;
  name: string;
  type: 'number' | 'text' | 'factor' | 'date';
  levels?: string[];
};

type FakeQueryRow = { [key: string]: string | number | Date };

export type FakeQuerySchema = FakeQueryColumn[];
export type FakeQueryTable = FakeQueryRow[];
type ReactiveColumn = {
  hasFilter: boolean;
  hasSort: 'NONE' | 'ASC' | 'DESC';
  sortPriority?: number;
  hasStats: boolean;
};
export type ReactiveSchema = (FakeQueryColumn & ReactiveColumn)[];

function createRandomRow(id: number): FakeQueryRow {
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const height = parseFloat(faker.finance.amount(140, 200, 1));
  const weight = parseFloat(faker.finance.amount(40, 140, 2));
  return {
    center: faker.helpers.arrayElement(['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62']),
    fullname: faker.name.fullName(),
    gender: faker.helpers.arrayElement(['Мужской', 'Женский']),
    history: faker.random.alphaNumeric(5, { casing: 'upper' }),
    dateOfBirth: dateOfBirth,
    age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
    height,
    weight,
    bmi: Math.round((weight / (height / 100) ** 2) * 100) / 100,
  };
}

export function getData(length: number): { schema: FakeQuerySchema; rows: FakeQueryTable } {
  const schema: FakeQuerySchema = [
    {
      key: 'center',
      name: 'МО',
      type: 'factor',
      levels: ['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62'],
    },
    {
      key: 'fullname',
      name: 'ФИО',
      type: 'text',
    },
    {
      key: 'gender',
      name: 'Пол',
      type: 'factor',
      levels: ['Мужской', 'Женский'],
    },
    {
      key: 'history',
      name: 'Номер ИБ',
      type: 'text',
    },
    {
      key: 'dateOfBirth',
      name: 'Дата рождения',
      type: 'date',
    },
    {
      key: 'age',
      name: 'Возраст',
      type: 'number',
    },
    {
      key: 'height',
      name: 'Рост, см',
      type: 'number',
    },
    {
      key: 'weight',
      name: 'Вес, кг',
      type: 'number',
    },
    {
      key: 'bmi',
      name: 'ИМТ',
      type: 'number',
    },
  ];
  const rows = Array.from({ length }).map((_, idx) => createRandomRow(idx));

  return { schema, rows };
}
