import { Database } from '@/data/Database';
import type { Model } from '@/data/Model';
import { buildPatients } from '@/data/melanoma/patients';
import { buildCancers } from '@/data/melanoma/cancers';

export class MelanomaDatabase extends Database {
  constructor(length: number) {
    super(length);
  }

  buildDatabase(length: number): Model[] {
    const patients = buildPatients(length);
    const cancers = buildCancers(patients.data);
    return [patients, cancers];
  }
}
