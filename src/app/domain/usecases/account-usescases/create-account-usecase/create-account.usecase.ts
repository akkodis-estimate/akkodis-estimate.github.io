import {IAccountRepository} from "../../../repositories/iaccount.repository";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {AccountEntity} from "../../../entities";

@Injectable({
    providedIn: 'root'
})
export class CreateAccountUseCase implements UseCase<AccountEntity, AccountEntity> {

    constructor(private accountRepository: IAccountRepository) {
    }

    execute(param: AccountEntity): Observable<AccountEntity> {
        return this.accountRepository.create(param);
    }
}
