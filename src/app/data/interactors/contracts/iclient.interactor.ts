import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result} from "../../../core/params/result";
import {ClientResponse} from "../../responses/client.response";
import {ClientRequest} from "../../requests/client.request";

@Injectable({providedIn: 'root'})
export abstract class IClientInteractor {
    abstract fetchAll(): Observable<Result<ClientResponse[]>>;

    abstract fetchOne(id: string): Observable<Result<ClientResponse>>

    abstract create(request: ClientRequest): Observable<Result<ClientResponse>>;

    abstract update(id: string, request: ClientRequest): Observable<Result<ClientResponse>>;

    abstract delete(id: string): Observable<Result<ClientResponse>>;
}
