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

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    public languages: string[] = ["English"];
    public currencies: CurrencyEnum[] = [];
    public currencyExchanges: CurrencyExchangeResponse[] = [];
    public workingDaysResponse!: WorkingDaysResponse;
    currencyForm: FormGroup;
    workingDaysForm: FormGroup;
    languageForm: FormGroup;

    constructor(private currencyExchangeInteractor: CurrencyExchangeInteractor,
                private workingDaysInteractor: WorkingDaysInteractor,
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

    calculateBillableWorkingDays(): number {
        return this.workingDaysResponse.totalCalendarDays
            - this.workingDaysResponse.weekends
            - this.workingDaysResponse.paidLeave
            - this.workingDaysResponse.publicHolidays;
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
            this.currencyExchangeInteractor.create(request).subscribe({
                next: value => {
                    this.toastr.success('currency exchange successfully saved', 'Success');
                    this.fetchCurrencyExchanges();
                    this.currencyForm.reset();
                },
                error: err => {
                    this.toastr.error('Error occurred while saving the currency exchange', 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
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
                    this.toastr.success('working days successfully saved', 'Success');
                    this.fetchCurrencyExchanges();
                    this.currencyForm.reset();
                },
                error: err => {
                    this.toastr.error('Error occurred while saving working days', 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }

    }

    onSubmitLanguage() {

    }
}
