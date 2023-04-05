import { Database } from '@/data/Database';
import { buildPatients } from '@/data/breast/patients';
import { buildComorbidities } from '@/data/breast/comorbidities';
import { buildCancers } from '@/data/breast/cancers';
import { buildNeoTherapies } from '@/data/breast/neoTherapy';
import { buildNeoDrugs } from '@/data/breast/neoDrugs';
import type { Model } from '@/data/Model';

export class BreastDatabase extends Database {
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
