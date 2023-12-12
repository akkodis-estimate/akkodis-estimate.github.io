import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {AccountInteractor} from "../../../data/interactors/implementations/account.interactor";
import {AccountResponse} from "../../../data/responses/account.response";
import {RoleEnum} from "../../../core/enums/RoleEnum";
import {AccountRequest} from "../../../data/requests/account.request";

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
    accountForm: FormGroup;
    public accounts?: AccountResponse[] = [];
    public roles: RoleEnum[] = [];

    constructor(private accountInteractor: AccountInteractor,
                private router: Router,
                private toastr: ToastrService,
                private localStorageService: LocalStorageService) {

        this.roles = Object.values(RoleEnum);

        this.accountForm = new FormGroup({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            address: new FormControl(''),
            phoneNumber: new FormControl(''),
            avatar: new FormControl(''),
            role: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.fetchAccounts();
    }

    fetchAccounts() {
        this.accountInteractor.fetchAll().subscribe({
            next: response => {
                this.accounts = response.data;
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    onSubmit() {
        if (this.accountForm.valid) {
            let request: AccountRequest = {
                firstname: this.accountForm.value.firstname,
                lastname: this.accountForm.value.lastname,
                email: this.accountForm.value.email,
                address: this.accountForm.value.address,
                phoneNumber: this.accountForm.value.phoneNumber,
                role: this.accountForm.value.role,
                avatar: ""
            };

            this.accountInteractor.create(request).subscribe({
                next: value => {
                    this.toastr.success('account successfully saved', 'Success');
                    this.fetchAccounts();
                },
                error: err => {
                    this.toastr.error('Error occurred while saving account', 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }
}
