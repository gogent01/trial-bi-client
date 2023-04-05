import { Database } from '@/data/Database';
import type { Model } from '@/data/Model';
import { buildPatients } from '@/data/melanoma/patients';
import { buildLifeStatuses } from '@/data/melanoma/status';
import { buildCancers } from '@/data/melanoma/cancers';
import { buildhistologicCharacteristics } from '@/data/melanoma/histology';
import { buildSurgeries } from '@/data/melanoma/surgery';

export class MelanomaDatabase extends Database {
  constructor(length: number) {
    super(length);
  }

  buildDatabase(length: number): Model[] {
    const patients = buildPatients(length);
    const statuses = buildLifeStatuses(patients.data);
    const cancers = buildCancers(patients.data);
    const histologicCharacteristics = buildhistologicCharacteristics(cancers.data);
    const surgeries = buildSurgeries(cancers.data);
    return [patients, statuses, cancers, histologicCharacteristics, surgeries];
  }
}
