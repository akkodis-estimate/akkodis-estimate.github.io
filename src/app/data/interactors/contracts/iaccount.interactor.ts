import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AccountRequest} from "../../requests/account.request";
import {AccountResponse} from "../../responses/account.response";
import {Result} from "../../../core/params/result";

@Injectable({providedIn: 'root'})
export abstract class IAccountInteractor {
    abstract login(request: { username: string, password: string }): Observable<Result<AccountResponse>>;

    abstract fetchAll(): Observable<Result<AccountResponse[]>>;

    abstract fetchOne(id: string): Observable<Result<AccountResponse>>

    abstract create(request: AccountRequest): Observable<Result<AccountResponse>>;

    abstract update(id: string, request: AccountRequest): Observable<Result<AccountResponse>>;

    abstract delete(id: string): Observable<Result<AccountResponse>>;
}
