import {PeriodEnum} from "../core/enums/PeriodEnum";
import {CurrencyEnum} from "../core/enums/CurrencyEnum";
import {ResourceResponse} from "../data/responses/resource.response";
import {CurrencyExchangeResponse} from "../data/responses/currency-exchange.response";

export class AmountHelper {
    static convertToAnnualAmount(amount: number, period: PeriodEnum): number {
        switch (period) {
            case PeriodEnum.Annually:
                break;
            case PeriodEnum.Monthly:
                amount = amount / 12;
                break;
            case PeriodEnum.Weekly:
                amount = amount / 52;
                break;
            case PeriodEnum.Daily:
                amount = amount / 228;
                break;
            case PeriodEnum.Hourly:
                amount = amount / (52 * 48);
                break;
            default:
                break;
        }
        return amount;
    }

    static splitAmount(amount: string): string[] {
        return amount.split(" ");
    }

    static getAmountPeriod(amount: string): string {
        return amount ? AmountHelper.splitAmount(amount)[0] : PeriodEnum.Annually;
    }

    static getAmount(amount: string): string {
        return amount ? AmountHelper.splitAmount(amount)[2] : "";
    }

    static getAmountCurrency(amount: string): string {
        return amount ? AmountHelper.splitAmount(amount)[1] : CurrencyEnum.AED;
    }

    static calculateAttributeAnnualCost(attribute: string): number {
        let cost: number = 0;
        let splitAttr = AmountHelper.splitAmount(attribute);
        switch (splitAttr[0]) {
            case PeriodEnum.Annually:
                cost = +splitAttr[2];
                break;
            case PeriodEnum.Monthly:
                cost = +splitAttr[2] * 12;
                break;
            case PeriodEnum.Weekly:
                cost = +splitAttr[2] * 52;
                break;
            case PeriodEnum.Daily:
                cost = +splitAttr[2] * 228;
                break;
            case PeriodEnum.Hourly:
                cost = +splitAttr[2] * 52 * 48;
                break;
        }
        return cost;
    }

    static calculateTotalAnnualCost(resources: ResourceResponse[]): number {
        let cost: number = 0;
        resources.forEach(resource => {
            cost += AmountHelper.calculateAttributeAnnualCost(resource.basicSalary!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.allowance!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.gratuity!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.insurance!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.flightTicket!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.workPermit!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.office!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.generalSupportPackage!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.laptopWorkstation!);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.licenses!);
        });
        return cost;
    }

    static convertAmountToCurrency(amount: number, currency: CurrencyEnum, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate = this.getCurrencyRate(currency, currencyExchanges);
        return rate ? amount * rate : undefined;
    }

    static convertAmountFromCurrencyToCurrency(amount: number, coupleOfCurrencies: string, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let currencies: string[] = coupleOfCurrencies.split("/");
        let rate = this.getRateFromGivenCurrencies(currencies[0], currencies[1], currencyExchanges);
        return rate ? amount * rate : undefined;
    }

    static getRateFromGivenCurrencies(currency1: string, currency2: string, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate: number | undefined;
        if (currency1 == currency1) {
            return 1;
        }
        currencyExchanges.forEach(value => {
            if (value.currency1 == currency1 && value.currency2 == currency2) {
                rate = value.rate;
            }
        });
        return rate;
    }

    static getCurrencyRate(currency: CurrencyEnum, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate: number | undefined;
        if (currency == CurrencyEnum.AED) {
            return 1;
        }
        currencyExchanges.forEach(value => {
            if (value.currency1 == CurrencyEnum.AED && value.currency2 == currency) {
                rate = value.rate;
            } else if (value.currency1 == currency && value.currency2 == CurrencyEnum.AED) {
                rate = 1 / value.rate;
            }
        });
        return rate;
    }
}
