import {BaseRepository} from "./base.repository";
import {Injectable} from "@angular/core";
import {CurrencyExchangeEntity} from "../entities/currency-exchange.entity";

@Injectable({providedIn: 'root'})
export abstract class ICurrencyExchangeRepository extends BaseRepository<CurrencyExchangeEntity> {
}
