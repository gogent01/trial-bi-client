import { Database } from '@/data/Database';
import type { Model } from '@/data/Model';

export class MelanomaDatabase extends Database {
  constructor(length: number) {
    super(length);
  }

  buildDatabase(length: number): Model[] {
    return [];
  }
}
