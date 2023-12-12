import {BaseRepository} from "./base.repository";
import {Injectable} from "@angular/core";
import {ResourceEntity} from "../entities/resource.entity";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export abstract class IResourceRepository extends BaseRepository<ResourceEntity> {
    abstract fetchByProject(projectId: string): Observable<ResourceEntity[]>;
}
