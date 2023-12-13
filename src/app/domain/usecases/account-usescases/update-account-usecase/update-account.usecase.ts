import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {IAccountRepository} from "../../../repositories/iaccount.repository";
import {AccountEntity} from "../../../entities";

@Injectable({
    providedIn: 'root'
})
export class UpdateAccountUseCase implements UseCase<{ id: string, request: AccountEntity }, void> {

    constructor(private repository: IAccountRepository) {
    }

    execute(param: { id: string, request: AccountEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
