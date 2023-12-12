import {Entity} from "./entity";
import {CurrencyEnum} from "../../core/enums/CurrencyEnum";

export interface CurrencyExchangeEntity extends Entity {
    currency1?: CurrencyEnum;
    currency2?: CurrencyEnum;
    rate?: number;
    code?: string;
}
