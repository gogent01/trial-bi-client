import { Database } from '@/data/Database';
import { buildPatients } from '@/data/breast/patients';
import { buildCancers } from '@/data/breast/cancers';
import type { Model } from '@/data/Model';

export class BreastDatabase extends Database {
  constructor(length: number) {
    super(length);
  }

  buildDatabase(length: number): Model[] {
    const patients = buildPatients(length);
    const cancers = buildCancers(patients.data);
    return [patients, cancers];
  }
}
