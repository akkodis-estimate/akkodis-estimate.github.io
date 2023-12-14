import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ICurrencyExchangeRepository} from "../../repositories/icurrency-exchange.repository";
import {CurrencyExchangeEntity} from "../../entities/currency-exchange.entity";
import {UseCase} from "../../../core/contracts/usecase.contract";

@Injectable({
    providedIn: 'root'
})
export class UpdateCurrencyExchangeUseCase implements UseCase<{ id: string, request: CurrencyExchangeEntity }, void> {

    constructor(private repository: ICurrencyExchangeRepository) {
    }

    execute(param: { id: string, request: CurrencyExchangeEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
