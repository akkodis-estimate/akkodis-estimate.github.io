import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result} from "../../../core/params/result";
import {ProjectResponse} from "../../responses/project.response";
import {ProjectRequest} from "../../requests/project.request";

@Injectable({providedIn: 'root'})
export abstract class IProjectInteractor {
    abstract fetchAll(): Observable<Result<ProjectResponse[]>>;

    abstract fetchOne(id: string): Observable<Result<ProjectResponse>>

    abstract create(request: ProjectRequest): Observable<Result<ProjectResponse>>;

    abstract update(id: string, request: ProjectRequest): Observable<Result<ProjectResponse>>;

    abstract delete(id: string): Observable<Result<ProjectResponse>>;
}
