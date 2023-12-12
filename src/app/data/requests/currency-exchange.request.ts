import {CurrencyEnum} from "../../core/enums/CurrencyEnum";

export interface CurrencyExchangeRequest {
    currency1: CurrencyEnum;
    currency2: CurrencyEnum;
    rate: number;
}
