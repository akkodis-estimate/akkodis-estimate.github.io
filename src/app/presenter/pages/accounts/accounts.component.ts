import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {AccountInteractor} from "../../../data/interactors/implementations/account.interactor";
import {AccountResponse} from "../../../data/responses/account.response";
import {RoleEnum} from "../../../core/enums/RoleEnum";
import {AccountRequest} from "../../../data/requests/account.request";
import {variables} from "../../../../environments/variables";
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
    accountForm: FormGroup;
    public accounts?: AccountResponse[] = [];
    public roles: RoleEnum[] = [];
    closeResult = '';
    private editAccountModalReference!: NgbModalRef;
    selectedAccount!: AccountResponse | undefined;

    constructor(private accountInteractor: AccountInteractor,
                private router: Router,
                private modalService: NgbModal,
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

            if (this.selectedAccount && this.selectedAccount.id) {
                this.accountInteractor.update(this.selectedAccount.id!, request).subscribe({
                    next: value => {
                        this.selectedAccount = undefined;
                        this.accountForm.reset();
                        this.editAccountModalReference.dismiss();
                        this.toastr.success('account successfully updated', 'Update account');
                        this.fetchAccounts();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while updating the account', 'Update account');
                    },
                    complete: () => {
                    }
                });
            } else {
                this.accountInteractor.create(request).subscribe({
                    next: value => {
                        this.accountForm.reset();
                        this.editAccountModalReference.dismiss();
                        this.toastr.success('account successfully saved', 'Success');
                        this.fetchAccounts();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while saving account', 'Error');
                    },
                    complete: () => {
                    }
                });
            }
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }

    onClickAccountToBeDeleted(account: AccountResponse) {
        this.localStorageService.add(variables.account, account);
    }

    onClickDeleteAccount() {
        let account = this.localStorageService.get(variables.account);
        if (account && account.id) {
            this.accountInteractor.delete(account.id!).subscribe({
                next: value => {
                    this.localStorageService.delete(variables.account);
                    this.toastr.success("Account deleted successfully", "Delete account");
                },
                error: err => {
                    this.localStorageService.delete(variables.account);
                    this.toastr.error("Error occurred while deleting the account", "Delete account");
                },
                complete: () => {
                }
            });
        } else {
            this.localStorageService.delete(variables.account);
            this.toastr.error("Account not found", "Delete account");
        }
    }

    onClickDismiss() {
        this.localStorageService.delete(variables.account);
    }

    onClickEditAccountModalClose() {
        this.accountForm.reset();
        this.editAccountModalReference.dismiss();
    }

    open(content: TemplateRef<any>) {
        this.editAccountModalReference = this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg'
        });
        this.editAccountModalReference.result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }

    private getDismissReason(reason: any): string {
        switch (reason) {
            case ModalDismissReasons.ESC:
                return 'by pressing ESC';
            case ModalDismissReasons.BACKDROP_CLICK:
                return 'by clicking on a backdrop';
            default:
                return `with: ${reason}`;
        }
    }

    openEditAccountModal(account: AccountResponse, content: TemplateRef<any>) {
        this.selectedAccount = account;
        this.accountForm = new FormGroup({
            firstname: new FormControl(account.firstname, [Validators.required]),
            lastname: new FormControl(account.lastname, [Validators.required]),
            email: new FormControl(account.email, [Validators.required]),
            address: new FormControl(account.address),
            phoneNumber: new FormControl(account.phoneNumber),
            avatar: new FormControl(account.avatar),
            role: new FormControl(account.role, [Validators.required]),
        });

        this.open(content);
    }
}
