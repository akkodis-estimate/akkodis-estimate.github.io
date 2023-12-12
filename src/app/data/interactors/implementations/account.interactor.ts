import {IAccountInteractor} from "../contracts/iaccount.interactor";
import {AccountRequest} from "../../requests/account.request";
import {map, Observable, of} from "rxjs";
import {AccountEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {
    FetchAccountUseCase
} from "../../../domain/usecases/account-usescases/fetch-account-usecase/fetch-account.usecase";
import {AccountMapper} from "../../mappers/account.mapper";
import {AccountResponse} from "../../responses/account.response";
import {
    LoginAccountUseCase
} from "../../../domain/usecases/account-usescases/login-account-usecase/login-account.usecase";
import {
    CreateAccountUseCase
} from "../../../domain/usecases/account-usescases/create-account-usecase/create-account.usecase";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {
    FetchAccountsUseCase
} from "../../../domain/usecases/account-usescases/fetch-accounts-usecase/fetch-accounts.usecase";

@Injectable({providedIn: 'root'})
export class AccountInteractor extends IAccountInteractor {

    mapper = new AccountMapper();

    constructor(private fetchAccountUseCase: FetchAccountUseCase,
                private fetchAccountsUseCase: FetchAccountsUseCase,
                private loginAccountUseCase: LoginAccountUseCase,
                private createAccountUseCase: CreateAccountUseCase) {
        super();
    }

    create(request: AccountRequest): Observable<Result<AccountResponse>> {

        let account: AccountEntity = this.mapper.fromRequest(request);
        account.id = uuidv4();
        account.password = "Password1";
        account.createdAt = new Date();

        return this.createAccountUseCase.execute(account)
            .pipe(map((account: AccountEntity) => this.mapper.toResponse(account)));
    }

    delete(id: string): Observable<Result<AccountResponse>> {
        return of();
    }

    fetchAll(): Observable<Result<AccountResponse[]>> {
        return this.fetchAccountsUseCase.execute()
            .pipe(map((e: AccountEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<AccountResponse>> {
        return this.fetchAccountUseCase.execute(id)
            .pipe(map((account: AccountEntity) => this.mapper.toResponse(account)));
    }

    login(request: { username: string; password: string }): Observable<Result<AccountResponse>> {
        return this.loginAccountUseCase.execute(request)
            .pipe(map((account: AccountEntity[]) => this.mapper.toFirstResponse(account)));
    }

    update(id: string, request: AccountRequest): Observable<Result<AccountResponse>> {
        return of();
    }

}
