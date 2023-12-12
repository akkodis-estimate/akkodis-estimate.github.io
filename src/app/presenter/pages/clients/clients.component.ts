import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {IClientInteractor} from "../../../data/interactors/contracts/iclient.interactor";
import {ClientResponse} from "../../../data/responses/client.response";
import {ClientRequest} from "../../../data/requests/client.request";
import {variables} from "../../../../environments/variables";
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
    clientForm: FormGroup;
    public clients: ClientResponse[] = [];
    closeResult = '';
    private editClientModalReference!: NgbModalRef;
    selectedClient!: ClientResponse | undefined;

    constructor(private clientInteractor: IClientInteractor,
                private router: Router,
                private toastr: ToastrService,
                private modalService: NgbModal,
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

            if (this.selectedClient && this.selectedClient.id) {
                this.clientInteractor.update(this.selectedClient.id!, clientRequest).subscribe({
                    next: value => {
                        this.selectedClient = undefined;
                        this.clientForm.reset();
                        this.editClientModalReference.dismiss();
                        this.toastr.success('client successfully updated', 'Update client');
                        this.fetchClients();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while updating the client', 'Update client');
                    },
                    complete: () => {
                    }
                });
            } else {
                this.clientInteractor.create(clientRequest).subscribe({
                    next: value => {
                        this.clientForm.reset();
                        this.editClientModalReference.dismiss();
                        this.toastr.success('client successfully saved', 'Add client');
                        this.fetchClients();
                    },
                    error: err => {
                        this.toastr.error('Error occurred while saving the client', 'Add client');
                    },
                    complete: () => {
                    }
                });
            }
        } else {
            this.toastr.error('Some inputs are incorrect', 'Edit client');
        }
    }

    onClickDeleteClient() {
        let client = this.localStorageService.get(variables.client);
        if (client && client.id) {
            this.clientInteractor.delete(client.id!).subscribe({
                next: value => {
                    this.localStorageService.delete(variables.client);
                    this.toastr.success("Client deleted successfully", "Delete client");
                },
                error: err => {
                    this.localStorageService.delete(variables.client);
                    this.toastr.error("Error occurred while deleting the client", "Delete client");
                },
                complete: () => {
                }
            });
        } else {
            this.localStorageService.delete(variables.client);
            this.toastr.error("Client not found", "Delete client");
        }
    }

    onClickClientToBeDeleted(client: ClientResponse) {
        this.localStorageService.add(variables.client, client);
    }

    onClickDismiss() {
        this.localStorageService.delete(variables.client);
    }

    openEditClientModal(client: ClientResponse, content: TemplateRef<any>) {
        this.selectedClient = client;
        this.clientForm = new FormGroup({
            companyName: new FormControl(client.companyName, [Validators.required]),
            email: new FormControl(client.email),
            phoneNumber: new FormControl(client.phoneNumber),
            address: new FormControl(client.address),
            logo: new FormControl(client.logo),
        });

        this.open(content);
    }


    open(content: TemplateRef<any>) {
        this.editClientModalReference = this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg'
        });
        this.editClientModalReference.result.then(
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

    onClickEditClientModalClose() {
        this.clientForm.reset();
        this.editClientModalReference.dismiss();
    }
}
