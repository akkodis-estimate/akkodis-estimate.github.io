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
import {ResourceInteractor} from "../../../data/interactors/implementations/resource.interactor";
import {ResourceRequest} from "../../../data/requests/resource.request";
import {ResourceResponse} from "../../../data/responses/resource.response";
import {Observable} from "rxjs";

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
                private resourceInteractor: ResourceInteractor,
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

    countResourcesByProject(id?: string): Observable<number> {
        return this.resourceInteractor.countByProject(id!);
    }

    countResources(resources: ResourceResponse[]): number {
        let nbResources = 0;
        resources.forEach(value => {
            nbResources += value.workload ?? 1;
        });
        return nbResources;
    }

    // getClient(id: string): ClientResponse | undefined {
    //     return this.clients.find(client => client.id === id);
    // }

    getClientById(id: string): ClientResponse | undefined {
        return this.clients.find(client => client.id === id);
    }

    onSubmit() {
        if (this.projectForm.valid) {
            let request: ProjectRequest = {
                title: this.projectForm.value.title,
                duration: this.projectForm.value.duration,
                description: this.projectForm.value.description,
                client: this.projectForm.value.client,
                margin: 18,
                riskProvision: 0
            };
            let clientResponse: ClientResponse | undefined = this.getClientById(request.client!);
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
            this.toastr.error('Some inputs are incorrect', 'Save project');
        }
    }

    saveProject(request: ProjectRequest) {
        this.projectInteractor.create(request).subscribe({
            next: value => {
                this.toastr.success('project successfully saved', 'Save project');
                this.projectForm.reset();
                this.fetchProjects();
            },
            error: err => {
                this.toastr.error('Error occurred while saving the project', 'Save project');
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
                this.toastr.error('Error occurred while saving the client', 'Save client');
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

    onClickProjectToBeDeleted(project: ProjectResponse) {
        this.localStorageService.add(variables.project, project);
    }

    onClickDismiss() {
        this.localStorageService.delete(variables.project);
    }

    onClickDeleteProjectAndResources() {
        let project = this.localStorageService.get(variables.project);
        if (project && project.id) {
            this.resourceInteractor.fetchByProject(project.id).subscribe({
                next: resources => {
                    resources.data?.forEach(value => this.resourceInteractor.delete(value.id!));
                    this.deleteProject(project.id);
                },
                error: err => {
                },
                complete: () => {
                }
            });
        } else {
            this.localStorageService.delete(variables.project);
            this.toastr.error("Project not found", "Delete project");
        }
    }

    deleteProject(id: string) {
        this.projectInteractor.delete(id).subscribe({
            next: value => {
                this.localStorageService.delete(variables.project);
                this.toastr.success("Project deleted successfully", "Delete project");
                this.fetchProjects();
            },
            error: err => {
                this.localStorageService.delete(variables.project);
                this.toastr.error("Error occurred while deleting the project", "Delete project");
            },
            complete: () => {
            }
        });
    }

    fetchResources(projectId: string) {
        this.resourceInteractor.fetchByProject(projectId).subscribe({
            next: response => {
                if (response && response.success) {
                    let resources = response.data!;
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    onClickProjectDuplicate(project: ProjectResponse) {
        let request: ProjectRequest = {
            title: project.title + "_duplicated",
            duration: project.duration,
            description: project.description,
            client: project.client,
            margin: project.margin,
            riskProvision: project.riskProvision
        };
        this.projectInteractor.create(request).subscribe({
            next: duplicatedProject => {
                this.resourceInteractor.fetchByProject(project.id!).subscribe({
                    next: resources => {
                        resources.data?.forEach(response => {
                            let request: ResourceRequest = {
                                jobTitle: response.jobTitle,
                                resourceType: response.resourceType,
                                workload: response.workload,
                                project: duplicatedProject.data?.id,
                                basicSalary: response.basicSalary,
                                allowance: response.allowance,
                                gratuity: response.gratuity,
                                insurance: response.insurance,
                                flightTicket: response.flightTicket,
                                workPermit: response.workPermit,
                                office: response.office,
                                generalSupportPackage: response.generalSupportPackage,
                                laptopWorkstation: response.laptopWorkstation,
                                licenses: response.licenses,
                            };
                            this.resourceInteractor.create(request);
                        });
                        this.toastr.success('project successfully duplicated', 'Duplicate project');
                    },
                    error: err => {
                        this.toastr.error('Error occurred while duplicating the project', 'Duplicate client');
                    },
                    complete: () => {
                    }
                });
            },
            error: err => {
                this.toastr.error('Error occurred while duplicating the project', 'Duplicate client');
            },
            complete: () => {
            }
        });
    }
}
