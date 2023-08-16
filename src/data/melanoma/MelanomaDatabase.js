import { DemoDatabase } from '../DemoDatabase';
import { buildPatients } from '../melanoma/patients';
import { buildLifeStatuses } from '../melanoma/status';
import { buildCancers } from '../melanoma/cancers';
import { buildhistologicCharacteristics } from '../melanoma/histology';
import { buildSurgeries } from '../melanoma/surgery';
export class MelanomaDatabase extends DemoDatabase {
    constructor(length) {
        super(length);
    }
    buildDatabase(length) {
        const patients = buildPatients(length);
        const statuses = buildLifeStatuses(patients.data);
        const cancers = buildCancers(patients.data);
        const histologicCharacteristics = buildhistologicCharacteristics(cancers.data);
        const surgeries = buildSurgeries(cancers.data);
        return [patients, statuses, cancers, histologicCharacteristics, surgeries];
    }
}
