import {IAccountRepository} from "../../../repositories/iaccount.repository";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {AccountEntity} from "../../../entities";

@Injectable({
    providedIn: 'root'
})
export class FetchAccountUseCase implements UseCase<string, AccountEntity> {

    constructor(private accountRepository: IAccountRepository) {
    }

    execute(param: string): Observable<AccountEntity> {
        return this.accountRepository.fetch(param);
    }
}
