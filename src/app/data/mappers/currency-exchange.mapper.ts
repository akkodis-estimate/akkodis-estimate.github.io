import {Mapper} from "../../core/contracts/mapper.contract";
import {CurrencyExchangeRequest} from "../requests/currency-exchange.request";
import {CurrencyExchangeResponse} from "../responses/currency-exchange.response";
import {CurrencyExchangeEntity} from "../../domain/entities/currency-exchange.entity";

export class CurrencyExchangeMapper extends Mapper<CurrencyExchangeRequest, CurrencyExchangeResponse, CurrencyExchangeEntity> {

    toEntity(param: CurrencyExchangeResponse): CurrencyExchangeEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            currency1: param.currency1!,
            currency2: param.currency2!,
            rate: param.rate!,
            code: param.currency1 + param.currency2
        }
    }

    fromEntity(param: CurrencyExchangeEntity): CurrencyExchangeResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            currency1: param.currency1!,
            currency2: param.currency2!,
            rate: param.rate!,
        };
    }

    fromRequest(param: CurrencyExchangeRequest): CurrencyExchangeEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            currency1: param.currency1!,
            currency2: param.currency2!,
            rate: param.rate!,
            code: param.currency1 + param.currency2
        }
    }
}
