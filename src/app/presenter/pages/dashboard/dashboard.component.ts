import {Component, OnInit} from '@angular/core';
import {ProjectResponse} from "../../../data/responses/project.response";
import {ProjectInteractor} from "../../../data/interactors/implementations/project.interactor";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ProjectRequest} from "../../../data/requests/project.request";
import {ClientResponse} from "../../../data/responses/client.response";
import {IClientInteractor} from "../../../data/interactors/contracts/iclient.interactor";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {Router} from "@angular/router";
import {variables} from "../../../../environments/variables";
import {ClientRequest} from "../../../data/requests/client.request";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    public projects: ProjectResponse[] = [];
    public clients: ClientResponse[] = [];
    projectForm: FormGroup;
    options: string[] = ["aaa", "bbb", "eee"];

    constructor(private projectInteractor: ProjectInteractor,
                private clientInteractor: IClientInteractor,
                private localStorageService: LocalStorageService,
                private router: Router,
                private toastr: ToastrService,) {
        this.projectForm = new FormGroup({
            title: new FormControl('', [Validators.required]),
            client: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            duration: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.fetchClients();
        this.fetchProjects();
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

    fetchProjects() {
        this.projectInteractor.fetchAll().subscribe({
            next: response => {
                if (response && response.success) {
                    this.projects = response.data!;
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    getClient(id: string): ClientResponse | undefined {
        return this.clients.find(client => client.id === id);
    }

    getClientByCompanyName(companyName: string): ClientResponse | undefined {
        return this.clients.find(client => client.companyName === companyName);
    }

    onSubmit() {
        if (this.projectForm.valid) {
            let request: ProjectRequest = {
                title: this.projectForm.value.title,
                duration: this.projectForm.value.duration,
                description: this.projectForm.value.description,
                client: this.projectForm.value.client,
                margin: 18
            };
            let clientResponse: ClientResponse | undefined = this.getClientByCompanyName(request.client!);
            if (clientResponse) {
                request.client = clientResponse.id;
                this.saveProject(request);
            } else {
                let clientRequest: ClientRequest = {
                    companyName: request.client,
                    email: "",
                    address: "",
                    phoneNumber: "",
                    logo: ""
                };
                this.saveClient(clientRequest, request);
            }
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }

    saveProject(request: ProjectRequest) {
        this.projectInteractor.create(request).subscribe({
            next: value => {
                this.toastr.success('project successfully saved', 'Success');
                this.projectForm.reset();
                this.fetchProjects();
            },
            error: err => {
                this.toastr.error('Error occurred while saving the project', 'Error');
            },
            complete: () => {
            }
        });
    }

    saveClient(clientRequest: ClientRequest, projectRequest: ProjectRequest) {
        this.clientInteractor.create(clientRequest).subscribe({
            next: value => {
                projectRequest.client = value.data?.id;
                this.saveProject(projectRequest);
            },
            error: err => {
                this.toastr.error('Error occurred while saving the client', 'Error');
            },
            complete: () => {
            }
        });
    }

    onClickProject(project: ProjectResponse) {
        this.projectForm.setValue({
            title: project.title,
            duration: project.duration,
            description: project.description,
            client: project.client
        });
    }

    onClickAddResources(project: ProjectResponse) {
        this.localStorageService.add(variables.project, project);
        this.router.navigate(['/resources']);
    }
}
