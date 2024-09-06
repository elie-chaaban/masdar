// db.ts
import Dexie, {Table} from 'dexie';

export interface Model {
  id?: number;
  url: string;
  model: string;
}

export class MySubClassedDexie extends Dexie {
  models!: Table<Model>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      models: '++id, url, model' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
