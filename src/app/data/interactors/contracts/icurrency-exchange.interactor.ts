import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result} from "../../../core/params/result";
import {CurrencyExchangeResponse} from "../../responses/currency-exchange.response";
import {CurrencyExchangeRequest} from "../../requests/currency-exchange.request";

@Injectable({providedIn: 'root'})
export abstract class ICurrencyExchangeInteractor {
    abstract fetchAll(): Observable<Result<CurrencyExchangeResponse[]>>;

    abstract fetchOne(id: string): Observable<Result<CurrencyExchangeResponse>>

    abstract create(request: CurrencyExchangeRequest): Observable<Result<CurrencyExchangeResponse>>;

    abstract update(id: string, request: CurrencyExchangeRequest): Observable<Result<CurrencyExchangeResponse>>;

    abstract delete(id: string): Observable<Result<CurrencyExchangeResponse>>;
}
