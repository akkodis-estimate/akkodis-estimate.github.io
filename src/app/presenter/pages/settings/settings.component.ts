import {Component, OnInit} from '@angular/core';
import {CurrencyEnum} from "../../../core/enums/CurrencyEnum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyExchangeResponse} from "../../../data/responses/currency-exchange.response";
import {CurrencyExchangeRequest} from "../../../data/requests/currency-exchange.request";
import {CurrencyExchangeInteractor} from "../../../data/interactors/implementations/currency-exchange.interactor";
import {ToastrService} from "ngx-toastr";
import {WorkingDaysRequest} from "../../../data/requests/working-days.request";
import {WorkingDaysInteractor} from "../../../data/interactors/implementations/working-days.interactor";
import {WorkingDaysResponse} from "../../../data/responses/working-days.response";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {variables} from "../../../../environments/variables";
import {AmountHelper} from "../../../helpers/amount.helper";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    public languages: string[] = ["English"];
    public currencies: CurrencyEnum[] = [];
    public currencyExchanges: CurrencyExchangeResponse[] = [];
    private selectedCurrencyExchange: CurrencyExchangeResponse | undefined;
    public workingDaysResponse!: WorkingDaysResponse;
    currencyForm: FormGroup;
    workingDaysForm: FormGroup;
    languageForm: FormGroup;

    constructor(private currencyExchangeInteractor: CurrencyExchangeInteractor,
                private workingDaysInteractor: WorkingDaysInteractor,
                private localStorageService: LocalStorageService,
                private toastr: ToastrService,) {
        this.currencies = Object.values(CurrencyEnum);

        this.currencyForm = new FormGroup({
            currency1: new FormControl('', [Validators.required]),
            currency2: new FormControl('', [Validators.required]),
            rate: new FormControl('', [Validators.required]),
        });

        this.workingDaysForm = new FormGroup({
            totalCalendarDays: new FormControl('', [Validators.required]),
            weekends: new FormControl('', [Validators.required]),
            paidLeave: new FormControl('', [Validators.required]),
            publicHolidays: new FormControl('', [Validators.required]),
        });

        this.languageForm = new FormGroup({
            language: new FormControl(this.languages[0], [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.fetchCurrencyExchanges();
        this.fetchWorkingDays();
    }

    fetchWorkingDays() {
        this.workingDaysInteractor.fetch().subscribe({
            next: response => {
                if (response && response.success) {
                    this.workingDaysResponse = response.data!;
                    this.workingDaysForm.setValue({
                        totalCalendarDays: this.workingDaysResponse.totalCalendarDays,
                        weekends: this.workingDaysResponse.weekends,
                        paidLeave: this.workingDaysResponse.paidLeave,
                        publicHolidays: this.workingDaysResponse.publicHolidays,
                    });
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    private fetchCurrencyExchanges() {
        this.currencyExchangeInteractor.fetchAll().subscribe({
            next: response => {
                if (response && response.success) {
                    this.currencyExchanges = response.data!;
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    onSubmitCurrency() {
        if (this.currencyForm.valid) {
            let request: CurrencyExchangeRequest = {
                currency1: this.currencyForm.value.currency1,
                currency2: this.currencyForm.value.currency2,
                rate: this.currencyForm.value.rate,
            }

            if (this.selectedCurrencyExchange && this.selectedCurrencyExchange.id) {
                this.currencyExchangeInteractor.update(this.selectedCurrencyExchange.id, request).subscribe({
                    next: value => {
                        this.toastr.success('currency exchange successfully updated', 'Currency exchange');
                        this.fetchCurrencyExchanges();
                        this.selectedCurrencyExchange = undefined;
                        this.currencyForm.reset();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while updating the currency exchange', 'Currency exchange');
                    },
                    complete: () => {
                    }
                });
            } else {
                this.currencyExchangeInteractor.create(request).subscribe({
                    next: value => {
                        this.toastr.success('currency exchange successfully saved', 'Currency exchange');
                        this.fetchCurrencyExchanges();
                        this.currencyForm.reset();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while saving the currency exchange', 'Currency exchange');
                    },
                    complete: () => {
                    }
                });
            }
        } else {
            this.toastr.error('Some inputs are incorrect', 'Currency exchange');
        }
    }

    onSubmitWorkingDays() {
        if (this.workingDaysForm.valid) {
            let request: WorkingDaysRequest = {
                totalCalendarDays: this.workingDaysForm.value.totalCalendarDays,
                weekends: this.workingDaysForm.value.weekends,
                paidLeave: this.workingDaysForm.value.paidLeave,
                publicHolidays: this.workingDaysForm.value.publicHolidays,
            }
            this.workingDaysInteractor.update(this.workingDaysResponse.id!, request).subscribe({
                next: value => {
                    this.toastr.success('working days successfully updated', 'Working days');
                    this.fetchCurrencyExchanges();
                    this.currencyForm.reset();
                },
                error: err => {
                    this.toastr.error('Error occurred while updating working days', 'Working days');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Working days');
        }

    }

    onSubmitLanguage() {

    }

    onClickCurrencyExchangeToBeDeleted(currency: CurrencyExchangeResponse) {
        this.localStorageService.add(variables.currencyExchange, currency);
    }

    onClickDismiss() {
        this.localStorageService.delete(variables.currencyExchange);
    }

    onClickDeleteCurrencyExchange() {
        let currencyExchange = this.localStorageService.get(variables.currencyExchange);
        if (currencyExchange && currencyExchange.id) {
            this.currencyExchangeInteractor.delete(currencyExchange.id!).subscribe({
                next: value => {
                    this.localStorageService.delete(variables.currencyExchange);
                    this.toastr.success("Currency exchange deleted successfully", "Delete currency exchange");
                },
                error: err => {
                    this.localStorageService.delete(variables.currencyExchange);
                    this.toastr.error("Error occurred while deleting the currency exchange", "Delete currency exchange");
                },
                complete: () => {
                }
            });
        } else {
            this.localStorageService.delete(variables.currencyExchange);
            this.toastr.error("Currency exchange not found", "Delete currency exchange");
        }
    }

    onClickCurrencyExchange(currency: CurrencyExchangeResponse) {
        this.selectedCurrencyExchange = currency;
        this.currencyForm = new FormGroup({
            currency1: new FormControl(currency.currency1, [Validators.required]),
            currency2: new FormControl(currency.currency2, [Validators.required]),
            rate: new FormControl(currency.rate, [Validators.required]),
        });
    }

    protected readonly AmountHelper = AmountHelper;
}
