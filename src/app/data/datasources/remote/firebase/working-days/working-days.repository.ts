import {Injectable} from "@angular/core";
import {from, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../../../domain/entities";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";
import {IWorkingDaysRepository} from "../../../../../domain/repositories/iworking-days.repository";
import {WorkingDaysEntity} from "../../../../../domain/entities/working-days.entity";

@Injectable({
    providedIn: 'root',
})
export class WorkingDaysRepository extends IWorkingDaysRepository {

    private collection: AngularFirestoreCollection<WorkingDaysEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<ProjectEntity>(DbTables.WORKING_DAYS);
    }

    override create(entity: ProjectEntity): Observable<WorkingDaysEntity> {
        return of();
    }

    delete(id: string): Observable<void> {
        return of();
    }

    fetch(id: string): Observable<WorkingDaysEntity> {
        return of();
    }

    fetchAll(): Observable<WorkingDaysEntity[]> {
        return this.collection.valueChanges();
    }

    update(id: string, entity: ProjectEntity): Observable<void> {
        const docRef = this.firestore.doc(id);
        return from(docRef.update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<WorkingDaysEntity[]> {
        return of();
    }
}
