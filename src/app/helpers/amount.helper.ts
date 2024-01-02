import {PeriodEnum} from "../core/enums/PeriodEnum";
import {CurrencyEnum} from "../core/enums/CurrencyEnum";
import {ResourceResponse} from "../data/responses/resource.response";
import {CurrencyExchangeResponse} from "../data/responses/currency-exchange.response";
import {WorkingDaysResponse} from "../data/responses/working-days.response";

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

    static calculateAttributeAnnualCost(attribute: string, billableWorkingDays: number): number {
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
                cost = +splitAttr[2] * billableWorkingDays;
                break;
            case PeriodEnum.Hourly:
                cost = +splitAttr[2] * 52 * 48;
                break;
        }
        return cost;
    }

    static calculateTotalAnnualCost(resources: ResourceResponse[], workingDays: WorkingDaysResponse): number {
        let billableWorkingDays: number = this.calculateBillableWorkingDays(workingDays);
        let cost: number = 0;
        resources.forEach(resource => {
            cost += AmountHelper.calculateAttributeAnnualCost(resource.basicSalary!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.allowance!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.gratuity!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.insurance!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.flightTicket!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.workPermit!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.office!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.generalSupportPackage!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.laptopWorkstation!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.licenses!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.mobilizationCost!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.parking!, billableWorkingDays);
            cost += AmountHelper.calculateAttributeAnnualCost(resource.transportation!, billableWorkingDays);
            cost = cost * (resource.workload ? resource.workload : 1);
        });
        return cost;
    }

    static convertAmountToCurrency(amount: number, currency: CurrencyEnum, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate = this.getCurrencyRate(currency, currencyExchanges);
        return rate ? amount * rate : undefined;
    }

    static convertAmountFromCurrencyToCurrency(amount: number, currency1: string, currency2: string, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate = this.getRateFromGivenCurrencies(currency1, currency2, currencyExchanges);
        return rate ? amount * rate : undefined;
    }

    static getRateFromGivenCurrencies(currency1: string, currency2: string, currencyExchanges: CurrencyExchangeResponse[]): number | undefined {
        let rate: number | undefined;
        if (currency1 == currency2) {
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

    static getFirstLetterOfPeriod(period: string | PeriodEnum): string {
        switch (period) {
            case PeriodEnum.Annually:
                return "Y";
            case PeriodEnum.Monthly:
                return "M";
            case PeriodEnum.Weekly:
                return "W";
            case PeriodEnum.Daily:
                return "D";
            case PeriodEnum.Hourly:
                return "H";
            default:
                return "";
        }
    }

    static calculateBillableWorkingDays(workingDays: WorkingDaysResponse): number {
        return workingDays.totalCalendarDays
            - workingDays.weekends
            - workingDays.paidLeave
            - workingDays.publicHolidays;
    }

    static calculateCurrencyPeriodCost(resources: ResourceResponse[], workingDays: WorkingDaysResponse, currencyExchanges: CurrencyExchangeResponse[], currency: CurrencyEnum, period: PeriodEnum): number | undefined {
        let amount = AmountHelper.convertToAnnualAmount(AmountHelper.calculateTotalAnnualCost(resources, workingDays), period);
        return AmountHelper.convertAmountToCurrency(amount, currency, currencyExchanges);
    }
}
