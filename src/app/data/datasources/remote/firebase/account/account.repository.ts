import {Injectable} from "@angular/core";
import {IAccountRepository} from "../../../../../domain/repositories/iaccount.repository";
import {from, map, Observable, of} from "rxjs";
import {AccountEntity} from "../../../../../domain/entities";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";

@Injectable({
    providedIn: 'root',
})
export class AccountRepository extends IAccountRepository {

    private collection: AngularFirestoreCollection<AccountEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<AccountEntity>(DbTables.ACCOUNTS);
    }

    override login(param: { username: string; password: string }): Observable<AccountEntity[]> {
        return this.firestore.collection<AccountEntity>(DbTables.ACCOUNTS, ref => ref
            .where("deleted", "==", false)
            .where("email", "==", param.username)
            .where("password", "==", param.password)
            .limit(1))
            .valueChanges();
    }

    changePassword(params: { id: string; password: string; }): Observable<AccountEntity[]> {
        throw new Error("Method not implemented.");
    }

    create(account: AccountEntity): Observable<AccountEntity> {
        this.collection.doc(account.id).set(account);
        return of(account);
    }

    delete(id: string): Observable<void> {
        return from(this.collection.doc(id).delete());
    }

    fetch(id: string): Observable<AccountEntity> {
        return of();
    }

    fetchAll(): Observable<AccountEntity[]> {
        return this.collection.valueChanges();
    }

    update(id: string, entity: AccountEntity): Observable<void> {
        return from(this.collection.doc(id).update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<AccountEntity[]> {
        let query = this.collection.ref;

        console.log(conditions);
        conditions.forEach(condition => {
            query.where(condition.field, condition.comparator, condition.value);
        });

        return from(query.get()).pipe(
            map(querySnapshot => {
                const documents: AccountEntity[] = [];
                querySnapshot.forEach(doc => {
                    documents.push(<AccountEntity>doc.data());
                });
                console.log(documents);
                return documents;
            })
        );
    }

}
