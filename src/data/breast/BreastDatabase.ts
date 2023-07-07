import { DemoDatabase } from '../DemoDatabase';
import { buildPatients } from '../breast/patients';
import { buildComorbidities } from '../breast/comorbidities';
import { buildCancers } from '../breast/cancers';
import { buildNeoTherapies } from '../breast/neoTherapy';
import { buildNeoDrugs } from '../breast/neoDrugs';
import type { Model } from '../Model';

export class BreastDatabase extends DemoDatabase {
  constructor(length: number) {
    super(length);
  }

  buildDatabase(length: number): Model[] {
    const patients = buildPatients(length);
    const comorbidities = buildComorbidities(patients.data);
    const cancers = buildCancers(patients.data);
    const neoTherapies = buildNeoTherapies(cancers.data);
    const neoDrugs = buildNeoDrugs(neoTherapies.data);
    return [patients, comorbidities, cancers, neoTherapies, neoDrugs];
  }
}
