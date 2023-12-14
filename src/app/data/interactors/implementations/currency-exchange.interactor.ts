import {map, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {ICurrencyExchangeInteractor} from "../contracts/icurrency-exchange.interactor";
import {CurrencyExchangeMapper} from "../../mappers/currency-exchange.mapper";
import {
    CreateCurrencyExchangeUseCase
} from "../../../domain/usecases/currency-exchange-usecases/create-currency-exchange.usecase";
import {
    FetchCurrencyExchangesUseCase
} from "../../../domain/usecases/currency-exchange-usecases/fetch-currency-exchanges.usecase";
import {CurrencyExchangeRequest} from "../../requests/currency-exchange.request";
import {CurrencyExchangeResponse} from "../../responses/currency-exchange.response";
import {CurrencyExchangeEntity} from "../../../domain/entities/currency-exchange.entity";
import {
    UpdateCurrencyExchangeUseCase
} from "../../../domain/usecases/currency-exchange-usecases/update-currency-exchange.usecase";
import {
    DeleteCurrencyExchangeUseCase
} from "../../../domain/usecases/currency-exchange-usecases/delete-currency-exchange.usecase";

@Injectable({providedIn: 'root'})
export class CurrencyExchangeInteractor extends ICurrencyExchangeInteractor {

    mapper = new CurrencyExchangeMapper();

    constructor(private createCurrencyExchangeUseCase: CreateCurrencyExchangeUseCase,
                private updateCurrencyExchangeUseCase: UpdateCurrencyExchangeUseCase,
                private deleteCurrencyExchangeUseCase: DeleteCurrencyExchangeUseCase,
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

    delete(id: string): Observable<Result<{}>> {
        this.deleteCurrencyExchangeUseCase.execute(id);
        return of(this.mapper.toEmptyResponse());
    }

    fetchAll(): Observable<Result<CurrencyExchangeResponse[]>> {
        return this.fetchCurrencyExchangesUseCase.execute()
            .pipe(map((e: ProjectEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<CurrencyExchangeResponse>> {
        return of();
    }

    update(id: string, request: CurrencyExchangeRequest): Observable<Result<{}>> {
        this.updateCurrencyExchangeUseCase.execute({id: id, request: this.mapper.fromRequest(request)});
        return of(this.mapper.toEmptyResponse());
    }

}
