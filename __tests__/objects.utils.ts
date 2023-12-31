import type { TableColumn, TableRow } from '../src/data/types';
import { Model } from '../src/data/Model';

const schema: TableColumn[] = [
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 0,
    key: 'id',
    name: 'id',
    type: 'id',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 1,
    key: 'center',
    name: 'Центр проведения исследования',
    type: 'factor',
    levels: ['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62'],
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 2,
    key: 'fullname',
    name: 'ФИО',
    type: 'text',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 3,
    key: 'date_of_birth',
    name: 'Дата рождения',
    type: 'date',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 4,
    key: 'age',
    name: 'Возраст',
    type: 'number',
  },
];

const data: TableRow[] = [
  {
    id: 0,
    center: 'ГКОБ 62',
    fullname: 'Фока Юдин',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 1,
    center: undefined,
    fullname: 'Ульян Богданов',
    date_of_birth: new Date('1954-05-12T11:25:52.131Z'),
    age: 69,
  },
  {
    id: 2,
    center: 'ГКОБ 62',
    fullname: 'Зосима Мишин',
    date_of_birth: new Date('1992-03-01T01:45:38.117Z'),
    age: 31,
  },
  {
    id: 3,
    center: 'ГКОБ 1',
    fullname: 'Давыд Нестеров',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 4,
    center: 'МКНЦ им. А.С. Логинова',
    fullname: 'Анжела Фокина',
    date_of_birth: new Date('1973-05-09T12:07:54.510Z'),
    age: 50,
  },
  {
    id: 5,
    center: undefined,
    fullname: 'Василиса Макарова',
    date_of_birth: new Date('1973-03-28T00:00:32.955Z'),
    age: 50,
  },
  {
    id: 6,
    center: 'ГКОБ 62',
    fullname: 'Тамара Павлова',
    date_of_birth: new Date('1973-06-06T08:34:21.479Z'),
    age: 50,
  },
  {
    id: 7,
    center: 'ГКОБ 1',
    fullname: 'Милий Савельев',
    date_of_birth: new Date('1981-01-13T18:09:13.510Z'),
    age: 42,
  },
  {
    id: 8,
    center: 'ГКОБ 1',
    fullname: undefined,
    date_of_birth: new Date('1988-07-19T12:29:06.024Z'),
    age: 35,
  },
  {
    id: 9,
    center: undefined,
    fullname: undefined,
    date_of_birth: new Date('1995-04-03T10:31:38.927Z'),
    age: 28,
  },
];

export const testPatientModel = new Model('patients', 'Пациенты', 0, schema, data);
