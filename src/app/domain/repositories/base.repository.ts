import {Observable} from "rxjs";
import {Condition} from "../../core/params/condition";
import {Option} from "../../core/params/option";

export abstract class BaseRepository<T> {
    abstract create(param: T): Observable<T>;

    abstract update(id: string, param: T): Observable<void>;

    abstract fetchAll(): Observable<T[]>;

    abstract fetch(id: string): Observable<T>;

    abstract delete(id: string): Observable<void>;

    abstract search(conditions: Condition[], options?: Option[]): Observable<T[]>;
}
