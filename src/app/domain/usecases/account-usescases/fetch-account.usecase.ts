import {IAccountRepository} from "../../repositories/iaccount.repository";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {AccountEntity} from "../../entities";

@Injectable({
    providedIn: 'root'
})
export class FetchAccountUseCase implements UseCase<string, AccountEntity | undefined> {

    constructor(private accountRepository: IAccountRepository) {
    }

    execute(param: string): Observable<AccountEntity | undefined> {
        return this.accountRepository.fetch(param);
    }
}
