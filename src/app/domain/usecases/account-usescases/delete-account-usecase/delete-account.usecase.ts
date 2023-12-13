import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {IAccountRepository} from "../../../repositories/iaccount.repository";

@Injectable({
    providedIn: 'root'
})
export class DeleteAccountUseCase implements UseCase<string, void> {

    constructor(private repository: IAccountRepository) {
    }

    execute(id: string): Observable<void> {
        return this.repository.delete(id);
    }
}
