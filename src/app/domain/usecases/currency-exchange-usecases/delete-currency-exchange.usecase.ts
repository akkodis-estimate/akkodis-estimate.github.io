import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ICurrencyExchangeRepository} from "../../repositories/icurrency-exchange.repository";
import {UseCase} from "../../../core/contracts/usecase.contract";

@Injectable({
    providedIn: 'root'
})
export class DeleteCurrencyExchangeUseCase implements UseCase<string, void> {

    constructor(private repository: ICurrencyExchangeRepository) {
    }

    execute(id: string): Observable<void> {
        return this.repository.delete(id);
    }
}
