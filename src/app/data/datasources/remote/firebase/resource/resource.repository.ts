import {Injectable} from "@angular/core";
import {from, Observable, of} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Condition} from "src/app/core/params/condition";
import {Option} from "../../../../../core/params/option";
import {DbTables} from "../db.tables";
import {IResourceRepository} from "../../../../../domain/repositories/iresource.repository";
import {ResourceEntity} from "../../../../../domain/entities/resource.entity";

@Injectable({
    providedIn: 'root',
})
export class ResourceRepository extends IResourceRepository {

    private collection: AngularFirestoreCollection<ResourceEntity>;

    constructor(private firestore: AngularFirestore) {
        super();
        this.collection = firestore.collection<ResourceEntity>(DbTables.RESOURCES);
    }

    override create(entity: ResourceEntity): Observable<ResourceEntity> {
        this.collection.doc(entity.id).set(entity);
        return of(entity);
    }

    delete(id: string): Observable<void> {
        return from(this.collection.doc(id).delete());
    }

    fetch(id: string): Observable<ResourceEntity> {
        return of();
    }

    fetchByProject(projectId: string): Observable<ResourceEntity[]> {
        return this.firestore.collection<ResourceEntity>(DbTables.RESOURCES, ref => ref
            .where("project", "==", projectId))
            .valueChanges();
    }

    update(id: string, entity: ResourceEntity): Observable<void> {
        const docRef = this.firestore.doc(id);
        return from(docRef.update(entity));
    }

    search(conditions: Condition[], options: Option[]): Observable<ResourceEntity[]> {
        return of();
    }

    fetchAll(): Observable<ResourceEntity[]> {
        return this.firestore.collection<ResourceEntity>(DbTables.RESOURCES, ref => ref
            .where("delete", "==", false))
            .valueChanges();
    }

}
