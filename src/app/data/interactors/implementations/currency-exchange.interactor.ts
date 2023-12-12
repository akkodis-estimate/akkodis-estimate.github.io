import {map, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {ICurrencyExchangeInteractor} from "../contracts/icurrency-exchange.interactor";
import {CurrencyExchangeMapper} from "../../mappers/currency-exchange.mapper";
import {
    CreateCurrencyExchangeUseCase
} from "../../../domain/usecases/currency-exchange-usecases/create-currency-exchange-usecase/create-currency-exchange.usecase";
import {
    FetchCurrencyExchangesUseCase
} from "../../../domain/usecases/currency-exchange-usecases/fetch-currency-exchanges-usecase/fetch-currency-exchanges.usecase";
import {CurrencyExchangeRequest} from "../../requests/currency-exchange.request";
import {CurrencyExchangeResponse} from "../../responses/currency-exchange.response";
import {CurrencyExchangeEntity} from "../../../domain/entities/currency-exchange.entity";

@Injectable({providedIn: 'root'})
export class CurrencyExchangeInteractor extends ICurrencyExchangeInteractor {

    mapper = new CurrencyExchangeMapper();

    constructor(private createCurrencyExchangeUseCase: CreateCurrencyExchangeUseCase,
                private fetchCurrencyExchangesUseCase: FetchCurrencyExchangesUseCase) {
        super();
    }

    create(request: CurrencyExchangeRequest): Observable<Result<CurrencyExchangeResponse>> {

        let entity: CurrencyExchangeEntity = this.mapper.fromRequest(request);
        entity.id = uuidv4();
        entity.createdAt = new Date();

        return this.createCurrencyExchangeUseCase.execute(entity)
            .pipe(map((e: ProjectEntity) => this.mapper.toResponse(e)));
    }

    delete(id: string): Observable<Result<CurrencyExchangeResponse>> {
        return of();
    }

    fetchAll(): Observable<Result<CurrencyExchangeResponse[]>> {
        return this.fetchCurrencyExchangesUseCase.execute()
            .pipe(map((e: ProjectEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<CurrencyExchangeResponse>> {
        return of();
    }

    update(id: string, request: CurrencyExchangeRequest): Observable<Result<CurrencyExchangeResponse>> {
        return of();
    }

}
