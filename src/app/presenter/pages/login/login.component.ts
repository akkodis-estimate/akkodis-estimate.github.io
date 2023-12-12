import {Component, OnInit} from '@angular/core';
import {IAccountInteractor} from "../../../data/interactors/contracts/iaccount.interactor";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {Router} from "@angular/router";
import {variables} from "../../../../environments/variables";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(private accountInteractor: IAccountInteractor,
                private router: Router,
                private toastr: ToastrService,
                private localStorageService: LocalStorageService) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): void {
        this.localStorageService.clear();
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.accountInteractor.login({
                username: this.loginForm.value.email,
                password: this.loginForm.value.password
            }).subscribe({
                next: result => {
                    if (result && result.success) {
                        this.localStorageService.add(variables.logged_account, result.data);
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.toastr.error("Account not found", 'Error');
                    }
                },
                error: err => {
                    this.toastr.error(err.message(), 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }
}
