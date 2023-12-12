import {Injectable} from "@angular/core";
import {from, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../../../domain/entities";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";
import {IProjectRepository} from "../../../../../domain/repositories/iproject.repository";

@Injectable({
    providedIn: 'root',
})
export class ProjectRepository extends IProjectRepository {

    private collection: AngularFirestoreCollection<ProjectEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<ProjectEntity>(DbTables.PROJECTS);
    }

    override create(entity: ProjectEntity): Observable<ProjectEntity> {
        this.collection.doc(entity.id).set(entity);
        return of(entity);
    }

    delete(id: string): Observable<void> {
        return of();
    }

    fetch(id: string): Observable<ProjectEntity> {
        return of();
    }

    fetchAll(): Observable<ProjectEntity[]> {
        return this.collection.valueChanges();
    }

    update(id: string, entity: ProjectEntity): Observable<void> {
        const docRef = this.firestore.doc(id);
        return from(docRef.update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<ProjectEntity[]> {
        return of();
    }

}
