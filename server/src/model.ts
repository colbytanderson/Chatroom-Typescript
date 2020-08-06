import _ from 'lodash';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithoutId<T extends Model> = Omit<T, 'id'> & { id?: number };

export interface Model {
  id: number;
}

export class ModelArray<T extends Model> {

  array: T[] = [];
  protected highestId = 0;

  get chain(): _.LoDashExplicitWrapper<T[]> {
    return _.chain(this.array);
  }

  insert<U extends T>(o: WithoutId<U>): U {
    o.id = ++this.highestId;
    const t = o as U;
    this.array.push(t);
    return t;
  }

}
