import {Response} from "./response";
import {CurrencyEnum} from "../../core/enums/CurrencyEnum";

export interface CurrencyExchangeResponse extends Response {
    currency1: CurrencyEnum;
    currency2: CurrencyEnum;
    rate: number;
}
