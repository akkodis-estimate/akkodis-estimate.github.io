import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {IClientInteractor} from "../../../data/interactors/contracts/iclient.interactor";
import {ClientResponse} from "../../../data/responses/client.response";
import {ClientRequest} from "../../../data/requests/client.request";

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
    clientForm: FormGroup;
    public clients: ClientResponse[] = [];

    constructor(private clientInteractor: IClientInteractor,
                private router: Router,
                private toastr: ToastrService,
                private localStorageService: LocalStorageService) {
        this.clientForm = new FormGroup({
            companyName: new FormControl('', [Validators.required]),
            email: new FormControl(''),
            address: new FormControl(''),
            phoneNumber: new FormControl(''),
        });
    }

    ngOnInit() {
        this.fetchClients();
    }

    fetchClients() {
        this.clientInteractor.fetchAll().subscribe({
            next: response => {
                if (response && response.success) {
                    this.clients = response.data!;
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    onSubmit() {
        if (this.clientForm.valid) {
            let clientRequest: ClientRequest = {
                companyName: this.clientForm.value.companyName,
                email: this.clientForm.value.email,
                address: this.clientForm.value.address,
                phoneNumber: this.clientForm.value.phoneNumber,
                logo: ""
            };

            this.clientInteractor.create(clientRequest).subscribe({
                next: value => {
                    this.toastr.success('client successfully saved', 'Success');
                    this.fetchClients();
                },
                error: err => {
                    this.toastr.error('Error occurred while saving the client', 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }
}
