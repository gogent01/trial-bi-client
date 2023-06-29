import { Database } from '../Database';
import type { Model } from '../Model';
import { buildPatients } from '../melanoma/patients';
import { buildLifeStatuses } from '../melanoma/status';
import { buildCancers } from '../melanoma/cancers';
import { buildhistologicCharacteristics } from '../melanoma/histology';
import { buildSurgeries } from '../melanoma/surgery';

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
