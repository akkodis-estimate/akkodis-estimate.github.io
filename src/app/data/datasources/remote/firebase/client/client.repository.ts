import {Injectable} from "@angular/core";
import {from, Observable, of} from "rxjs";
import {ClientEntity} from "../../../../../domain/entities";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";
import {IClientRepository} from "../../../../../domain/repositories/iclient.repository";

@Injectable({
    providedIn: 'root',
})
export class ClientRepository extends IClientRepository {

    private collection: AngularFirestoreCollection<ClientEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<ClientEntity>(DbTables.CLIENTS);
    }

    override create(entity: ClientEntity): Observable<ClientEntity> {
        this.collection.doc(entity.id).set(entity);
        return of(entity);
    }

    delete(id: string): Observable<void> {
        return of();
    }

    fetch(id: string): Observable<ClientEntity> {
        return of();
    }

    fetchAll(): Observable<ClientEntity[]> {
        return this.collection.valueChanges();
    }

    update(id: string, entity: ClientEntity): Observable<void> {
        const docRef = this.firestore.doc(id);
        return from(docRef.update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<ClientEntity[]> {
        return of();
    }

}
