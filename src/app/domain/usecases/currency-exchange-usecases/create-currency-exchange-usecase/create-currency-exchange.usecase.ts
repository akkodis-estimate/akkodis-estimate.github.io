import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {CurrencyExchangeEntity} from "../../../entities/currency-exchange.entity";
import {ICurrencyExchangeRepository} from "../../../repositories/icurrency-exchange.repository";

@Injectable({
    providedIn: 'root'
})
export class CreateCurrencyExchangeUseCase implements UseCase<CurrencyExchangeEntity, CurrencyExchangeEntity> {

    constructor(private repository: ICurrencyExchangeRepository) {
    }

    execute(param: CurrencyExchangeEntity): Observable<CurrencyExchangeEntity> {
        return this.repository.create(param);
    }
}
