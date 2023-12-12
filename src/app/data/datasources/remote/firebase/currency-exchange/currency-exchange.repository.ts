import {Injectable} from "@angular/core";
import {from, Observable, of} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";
import {ICurrencyExchangeRepository} from "../../../../../domain/repositories/icurrency-exchange.repository";
import {CurrencyExchangeEntity} from "../../../../../domain/entities/currency-exchange.entity";

@Injectable({
    providedIn: 'root',
})
export class CurrencyExchangeRepository extends ICurrencyExchangeRepository {

    private collection: AngularFirestoreCollection<CurrencyExchangeEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<CurrencyExchangeEntity>(DbTables.CURRENCY_EXCHANGE);
    }

    override create(entity: CurrencyExchangeEntity): Observable<CurrencyExchangeEntity> {
        this.collection.doc(entity.id).set(entity);
        return of(entity);
    }

    delete(id: string): Observable<void> {
        return of();
    }

    fetch(id: string): Observable<CurrencyExchangeEntity> {
        return of();
    }

    fetchAll(): Observable<CurrencyExchangeEntity[]> {
        return this.collection.valueChanges();
    }

    update(id: string, entity: CurrencyExchangeEntity): Observable<void> {
        const docRef = this.firestore.doc(id);
        return from(docRef.update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<CurrencyExchangeEntity[]> {
        return of();
    }

}
