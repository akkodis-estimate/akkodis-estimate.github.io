import {IAccountRepository} from "../../../repositories/iaccount.repository";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {AccountEntity} from "../../../entities";

@Injectable({
    providedIn: 'root'
})
export class LoginAccountUseCase implements UseCase<{ username: string, password: string }, AccountEntity[]> {

    constructor(private accountRepository: IAccountRepository) {
    }

    execute(param: { username: string, password: string }): Observable<AccountEntity[]> {
        return this.accountRepository.login(param);
    }
}
