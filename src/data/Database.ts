import { faker } from '@faker-js/faker';
faker.setLocale('ru');

import type { TableSchema, TableData } from '@/data/types';
import { buildPatients } from '@/data/patients';
import { buildCancers } from '@/data/cancers';
import type { Model } from '@/data/types';

export class Database {
  patients: Model;
  cancers: Model;

  constructor(length: number) {
    this.patients = buildPatients(length);
    this.cancers = buildCancers(this.patients.data);
  }

  getPatients() {
    return this.patients;
  }
}
