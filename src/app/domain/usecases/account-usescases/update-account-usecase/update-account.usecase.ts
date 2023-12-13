import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {AccountRequest} from "../../../../data/requests/account.request";
import {IAccountRepository} from "../../../repositories/iaccount.repository";

@Injectable({
    providedIn: 'root'
})
export class UpdateAccountUseCase implements UseCase<{ id: string, request: AccountRequest }, void> {

    constructor(private repository: IAccountRepository) {
    }

    execute(param: { id: string, request: AccountRequest }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
