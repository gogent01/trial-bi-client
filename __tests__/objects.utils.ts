import type { TableColumn, TableRow } from '../src/data/types';
import { Model } from '../src/data/Model';

const schema: TableColumn[] = [
  {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 0,
    key: 'id',
    name: 'id',
    type: 'id',
  },
  {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 1,
    key: 'center',
    name: 'Study center',
    type: 'factor',
    levels: ['State Multi-Specialty Surgical Center', 'City Hospital 1', 'City Hospital 62'],
  },
  {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 2,
    key: 'fullname',
    name: 'Full name',
    type: 'text',
  },
  {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 3,
    key: 'date_of_birth',
    name: 'Date of birth',
    type: 'date',
  },
  {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 4,
    key: 'age',
    name: 'Age',
    type: 'number',
  },
];

const data: TableRow[] = [
  {
    id: 0,
    center: 'City Hospital 62',
    fullname: 'Fred Young',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 1,
    center: undefined,
    fullname: 'Ulysses Bowman',
    date_of_birth: new Date('1954-05-12T11:25:52.131Z'),
    age: 69,
  },
  {
    id: 2,
    center: 'City Hospital 62',
    fullname: 'Zachary Mitchell',
    date_of_birth: new Date('1992-03-01T01:45:38.117Z'),
    age: 31,
  },
  {
    id: 3,
    center: 'City Hospital 1',
    fullname: 'David Nelson',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 4,
    center: 'State Multi-Specialty Surgical Center',
    fullname: 'Angela Fisher',
    date_of_birth: new Date('1973-05-09T12:07:54.510Z'),
    age: 50,
  },
  {
    id: 5,
    center: undefined,
    fullname: 'Vanessa Mackenzie',
    date_of_birth: new Date('1973-03-28T00:00:32.955Z'),
    age: 50,
  },
  {
    id: 6,
    center: 'City Hospital 62',
    fullname: 'Tamara Palmer',
    date_of_birth: new Date('1973-06-06T08:34:21.479Z'),
    age: 50,
  },
  {
    id: 7,
    center: 'City Hospital 1',
    fullname: 'Miles Sawyer',
    date_of_birth: new Date('1981-01-13T18:09:13.510Z'),
    age: 42,
  },
  {
    id: 8,
    center: 'City Hospital 1',
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

export const testPatientModel = new Model('patients', 'Patients', 0, schema, data);
