import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result} from "../../../core/params/result";
import {ResourceResponse} from "../../responses/resource.response";
import {ResourceRequest} from "../../requests/resource.request";

@Injectable({providedIn: 'root'})
export abstract class IResourceInteractor {
    abstract fetchAll(): Observable<Result<ResourceResponse[]>>;

    abstract fetchByProject(projectId: string): Observable<Result<ResourceResponse[]>>;

    abstract fetchOne(id: string): Observable<Result<ResourceResponse>>

    abstract create(request: ResourceRequest): Observable<Result<ResourceResponse>>;

    abstract update(id: string, request: ResourceRequest): Observable<Result<ResourceResponse>>;

    abstract delete(id: string): Observable<Result<ResourceResponse>>;
}
