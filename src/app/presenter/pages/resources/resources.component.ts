import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProjectResponse} from "../../../data/responses/project.response";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {variables} from "../../../../environments/variables";
import {ResourceResponse} from "../../../data/responses/resource.response";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceTypeEnum} from "../../../core/enums/ResourceTypeEnum";
import {CurrencyEnum} from "../../../core/enums/CurrencyEnum";
import {PeriodEnum} from "../../../core/enums/PeriodEnum";
import {ResourceRequest} from "../../../data/requests/resource.request";
import {ResourceInteractor} from "../../../data/interactors/implementations/resource.interactor";
import {ToastrService} from "ngx-toastr";
import {ClientResponse} from "../../../data/responses/client.response";
import {ClientInteractor} from "../../../data/interactors/implementations/client.interactor";
import {ProjectRequest} from "../../../data/requests/project.request";
import {ProjectInteractor} from "../../../data/interactors/implementations/project.interactor";
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

    public inputs!: ResourceInputs;
    public project: ProjectResponse;
    public clients: ClientResponse[] = [];
    public resources: ResourceResponse[] = [];
    public resourceTypes: ResourceTypeEnum[] = [];
    public currencies: CurrencyEnum[] = [];
    public periods: PeriodEnum[] = [];
    public displayCurrencies: CurrencyEnum[] = [];
    public displayPeriods: PeriodEnum[] = [];
    resourceForm: FormGroup;
    projectForm: FormGroup;
    displayForm: FormGroup;
    pricesForm: FormGroup;
    closeResult = '';
    private editResourceModalReference!: NgbModalRef;
    selectedResource!: ResourceResponse | undefined;

    constructor(private localStorageService: LocalStorageService,
                private toastr: ToastrService,
                private router: Router,
                private modalService: NgbModal,
                private clientInteractor: ClientInteractor,
                private projectInteractor: ProjectInteractor,
                private resourceInteractor: ResourceInteractor) {
        this.project = localStorageService.get(variables.project);
        this.periods = Object.values(PeriodEnum);
        this.resourceTypes = Object.values(ResourceTypeEnum);
        this.currencies = Object.values(CurrencyEnum);

        this.displayCurrencies.push(CurrencyEnum.AED);
        this.displayPeriods.push(PeriodEnum.Annually);

        this.resourceForm = this.initResourceForm();

        this.projectForm = new FormGroup({
            title: new FormControl(this.project.title, [Validators.required]),
            client: new FormControl(this.project.client, [Validators.required]),
            description: new FormControl(this.project.description),
            duration: new FormControl(this.project.duration),
            margin: new FormControl(this.project.margin),
            riskProvision: new FormControl(this.project.riskProvision),
        });

        this.displayForm = new FormGroup({
            period: new FormControl(PeriodEnum.Annually),
            currency: new FormControl(CurrencyEnum.AED),
        });

        this.pricesForm = new FormGroup({
            period: new FormControl(""),
            currency: new FormControl(""),
            amount: new FormControl(""),
        });
    }

    ngOnInit(): void {
        this.fetchClients();
        this.fetchResources(this.project.id!);
    }

    initResourceForm(resource?: ResourceResponse): FormGroup {
        resource = resource == undefined ? {} : resource;
        return new FormGroup({
            jobTitle: new FormControl(resource.jobTitle ? resource.jobTitle : "", [Validators.required]),
            resourceType: new FormControl(resource.resourceType ? resource.resourceType : "", [Validators.required]),
            workload: new FormControl(resource && resource.workload ? resource.workload : ""),

            basicSalaryPeriod: new FormControl(resource.basicSalary ? this.getPeriod(resource.basicSalary) : 'MONTHLY'),
            basicSalaryCurrency: new FormControl(resource.basicSalary ? this.getCurrency(resource.basicSalary) : 'AED'),
            basicSalary: new FormControl(this.getAmount(resource.basicSalary!), [Validators.required]),

            allowancePeriod: new FormControl(resource.allowance ? this.getPeriod(resource.allowance) : 'MONTHLY'),
            allowanceCurrency: new FormControl(this.getCurrency(resource.allowance!)),
            allowance: new FormControl(this.getAmount(resource.allowance!)),

            gratuityPeriod: new FormControl(resource.gratuity ? this.getPeriod(resource.gratuity) : 'ANNUALLY'),
            gratuityCurrency: new FormControl(this.getCurrency(resource.gratuity!)),
            gratuity: new FormControl(this.getAmount(resource.gratuity!)),

            insurancePeriod: new FormControl(resource.insurance ? this.getPeriod(resource.insurance) : 'ANNUALLY'),
            insuranceCurrency: new FormControl(this.getCurrency(resource.insurance!)),
            insurance: new FormControl(resource.insurance ? this.getAmount(resource.insurance) : '790'),

            flightTicketPeriod: new FormControl(resource.flightTicket ? this.getPeriod(resource.flightTicket) : 'ANNUALLY'),
            flightTicketCurrency: new FormControl(this.getCurrency(resource.flightTicket!)),
            flightTicket: new FormControl(resource.flightTicket ? this.getAmount(resource.flightTicket) : '2500'),

            workPermitPeriod: new FormControl(resource.workPermit ? this.getPeriod(resource.workPermit) : 'ANNUALLY'),
            workPermitCurrency: new FormControl(this.getCurrency(resource.workPermit!)),
            workPermit: new FormControl(resource.workPermit ? this.getAmount(resource.workPermit) : '6500'),

            officePeriod: new FormControl(resource.office ? this.getPeriod(resource.office) : 'DAILY'),
            officeCurrency: new FormControl(this.getCurrency(resource.office!)),
            office: new FormControl(resource.office ? this.getAmount(resource.office) : '19'),

            generalSupportPackagePeriod: new FormControl(resource.generalSupportPackage ? this.getPeriod(resource.generalSupportPackage) : 'DAILY'),
            generalSupportPackageCurrency: new FormControl(this.getCurrency(resource.generalSupportPackage!)),
            generalSupportPackage: new FormControl(resource.generalSupportPackage ? this.getAmount(resource.generalSupportPackage) : '15'),

            laptopWorkstationPeriod: new FormControl(resource.laptopWorkstation ? this.getPeriod(resource.laptopWorkstation) : 'ANNUALLY'),
            laptopWorkstationCurrency: new FormControl(this.getCurrency(resource.laptopWorkstation!)),
            laptopWorkstation: new FormControl(resource.laptopWorkstation ? this.getAmount(resource.laptopWorkstation) : '5000'),

            licensesPeriod: new FormControl(resource.licenses ? this.getPeriod(resource.licenses) : 'ANNUALLY'),
            licensesCurrency: new FormControl(this.getCurrency(resource.licenses!)),
            licenses: new FormControl(resource.licenses ? this.getAmount(resource.licenses) : '400'),
        });
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

    fetchResources(projectId: string) {
        this.resourceInteractor.fetchByProject(projectId).subscribe({
            next: response => {
                if (response && response.success) {
                    this.resources = response.data!;
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    splitAmount(amount: string): string[] {
        return amount.split(" ");
    }

    getAmount(amount: string): string {
        return amount ? this.splitAmount(amount)[2] : "";
    }

    getCurrency(amount: string): string {
        return amount ? this.splitAmount(amount)[1] : CurrencyEnum.AED;
    }

    getPeriod(amount: string): string {
        return amount ? this.splitAmount(amount)[0] : PeriodEnum.Annually;
    }

    calculateAttributeAnnualCost(attribute: string): number {
        let cost: number = 0;
        let splitAttr = this.splitAmount(attribute);
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
                cost = +splitAttr[2] * 228;
                break;
            case PeriodEnum.Hourly:
                cost = +splitAttr[2] * 52 * 48;
                break;
        }
        return cost;
    }

    calculateTotalAnnualCost(): number {
        let cost: number = 0;
        this.resources.forEach(resource => {
            cost += this.calculateAttributeAnnualCost(resource.basicSalary!);
            cost += this.calculateAttributeAnnualCost(resource.allowance!);
            cost += this.calculateAttributeAnnualCost(resource.gratuity!);
            cost += this.calculateAttributeAnnualCost(resource.insurance!);
            cost += this.calculateAttributeAnnualCost(resource.flightTicket!);
            cost += this.calculateAttributeAnnualCost(resource.workPermit!);
            cost += this.calculateAttributeAnnualCost(resource.office!);
            cost += this.calculateAttributeAnnualCost(resource.generalSupportPackage!);
            cost += this.calculateAttributeAnnualCost(resource.laptopWorkstation!);
            cost += this.calculateAttributeAnnualCost(resource.licenses!);
        });
        return cost;
    }

    calculateByCurrencyAndPeriod(amount: number, currency: CurrencyEnum, period: PeriodEnum): number {
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

    calculateCurrencyPeriodCost(currency: CurrencyEnum, period: PeriodEnum): number {
        return this.calculateByCurrencyAndPeriod(this.calculateTotalAnnualCost(), currency, period);
    }

    calculateTotalAnnualPrice(): number {
        return (1 + (this.project.margin! / 100)) * (1 + (this.project.riskProvision! / 100)) * this.calculateTotalAnnualCost();
    }

    calculateCurrencyPeriodPrice(currency: CurrencyEnum, period: PeriodEnum): number {
        return this.calculateByCurrencyAndPeriod(this.calculateTotalAnnualPrice(), currency, period);
    }

    onSubmit() {
        if (this.resourceForm.valid) {
            let request: ResourceRequest = {
                jobTitle: this.resourceForm.value.jobTitle,
                resourceType: this.resourceForm.value.resourceType,
                workload: this.resourceForm.value.workload,
                project: this.project.id,
                basicSalary: this.resourceForm.value.basicSalaryPeriod + " " + this.resourceForm.value.basicSalaryCurrency + " " + this.resourceForm.value.basicSalary,
                allowance: this.resourceForm.value.allowancePeriod + " " + this.resourceForm.value.allowanceCurrency + " " + this.resourceForm.value.allowance,
                gratuity: this.resourceForm.value.gratuityPeriod + " " + this.resourceForm.value.gratuityCurrency + " " + this.resourceForm.value.gratuity,
                insurance: this.resourceForm.value.insurancePeriod + " " + this.resourceForm.value.insuranceCurrency + " " + this.resourceForm.value.insurance,
                flightTicket: this.resourceForm.value.flightTicketPeriod + " " + this.resourceForm.value.flightTicketCurrency + " " + this.resourceForm.value.flightTicket,
                workPermit: this.resourceForm.value.workPermitPeriod + " " + this.resourceForm.value.workPermitCurrency + " " + this.resourceForm.value.workPermit,
                office: this.resourceForm.value.officePeriod + " " + this.resourceForm.value.officeCurrency + " " + this.resourceForm.value.office,
                generalSupportPackage: this.resourceForm.value.generalSupportPackagePeriod + " " + this.resourceForm.value.generalSupportPackageCurrency + " " + this.resourceForm.value.generalSupportPackage,
                laptopWorkstation: this.resourceForm.value.laptopWorkstationPeriod + " " + this.resourceForm.value.laptopWorkstationCurrency + " " + this.resourceForm.value.laptopWorkstation,
                licenses: this.resourceForm.value.licensesPeriod + " " + this.resourceForm.value.licensesCurrency + " " + this.resourceForm.value.licenses,
            };

            if (this.selectedResource && this.selectedResource.id) {
                this.resourceInteractor.update(this.selectedResource.id!, request).subscribe({
                    next: value => {
                        this.selectedResource = undefined;
                        this.resourceForm.reset();
                        this.editResourceModalReference.dismiss();
                        this.toastr.success('resource successfully updated', 'Update resource');
                        this.fetchResources(this.project.id!);
                    },
                    error: err => {
                        this.toastr.error('Error occurred while updating the client', 'Update client');
                    },
                    complete: () => {
                    }
                });
            } else {
                this.resourceInteractor.create(request).subscribe({
                    next: value => {
                        this.resourceForm.reset();
                        this.editResourceModalReference.dismiss();
                        this.toastr.success('resource successfully saved', 'Add resource');
                        this.fetchResources(this.project.id!);
                    },
                    error: err => {
                        this.toastr.error('Error occurred while saving the resource', 'Add resource');
                    },
                    complete: () => {
                    }
                });
            }
        } else {
            this.toastr.error('Some inputs are incorrect', 'Edit resource');
        }
    }

    onChangeBasicSalary() {
        this.inputs = {
            jobTitle: this.resourceForm.value.jobTitle,
            basicSalaryPeriod: this.resourceForm.value.basicSalaryPeriod,
            basicSalaryCurrency: this.resourceForm.value.basicSalaryCurrency,
            basicSalary: this.resourceForm.value.basicSalary,
            resourceType: this.resourceForm.value.resourceType,
            workload: this.resourceForm.value.workload,
            allowancePeriod: this.resourceForm.value.allowancePeriod,
            allowanceCurrency: this.resourceForm.value.allowanceCurrency,
            allowance: this.resourceForm.value.basicSalary,
            gratuityPeriod: this.resourceForm.value.gratuityPeriod,
            gratuityCurrency: this.resourceForm.value.gratuityCurrency,
            gratuity: this.resourceForm.value.basicSalary,
            insurancePeriod: this.resourceForm.value.insurancePeriod,
            insuranceCurrency: this.resourceForm.value.insuranceCurrency,
            insurance: this.resourceForm.value.insurance,
            flightTicketPeriod: this.resourceForm.value.flightTicketPeriod,
            flightTicketCurrency: this.resourceForm.value.flightTicketCurrency,
            flightTicket: this.resourceForm.value.flightTicket,
            workPermitPeriod: this.resourceForm.value.workPermitPeriod,
            workPermitCurrency: this.resourceForm.value.workPermitCurrency,
            workPermit: this.resourceForm.value.workPermit,
            officePeriod: this.resourceForm.value.officePeriod,
            officeCurrency: this.resourceForm.value.officeCurrency,
            office: this.resourceForm.value.office,
            generalSupportPackagePeriod: this.resourceForm.value.generalSupportPackagePeriod,
            generalSupportPackageCurrency: this.resourceForm.value.generalSupportPackageCurrency,
            generalSupportPackage: this.resourceForm.value.generalSupportPackage,
            laptopWorkstationPeriod: this.resourceForm.value.laptopWorkstationPeriod,
            laptopWorkstationCurrency: this.resourceForm.value.laptopWorkstationCurrency,
            laptopWorkstation: this.resourceForm.value.laptopWorkstation,
            licensesPeriod: this.resourceForm.value.licensesPeriod,
            licensesCurrency: this.resourceForm.value.licensesCurrency,
            licenses: this.resourceForm.value.licenses,
        };
        this.resourceForm.setValue(this.inputs);
    }

    onChangePeriod() {
        let request: DisplayInputs = {
            period: this.displayForm.value.period,
            currency: this.displayForm.value.currency,
        };

        let indexPeriod: number = this.displayPeriods.indexOf(request.period!);
        if (indexPeriod > -1) {
            this.displayPeriods.splice(indexPeriod, 1);
        } else {
            this.displayPeriods.push(request.period!);
        }
    }

    onChangeCurrency() {
        let request: DisplayInputs = {
            period: this.displayForm.value.period,
            currency: this.displayForm.value.currency,
        };

        let indexCurrency: number = this.displayCurrencies.indexOf(request.currency!);
        if (indexCurrency > -1) {
            this.displayCurrencies.splice(indexCurrency, 1);
        } else {
            this.displayCurrencies.push(request.currency!);
        }
    }

    fetchProject() {
        this.projectInteractor.fetchOne(this.project.id!).subscribe({
            next: response => {
                if (response && response.success) {
                    this.project = response.data!;
                    this.localStorageService.update(variables.project, this.project);
                }
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    onSubmitProject() {
        if (this.projectForm.valid) {
            let request: ProjectRequest = {
                title: this.projectForm.value.title,
                duration: this.projectForm.value.duration,
                description: this.projectForm.value.description,
                client: this.projectForm.value.client,
                margin: this.projectForm.value.margin,
                riskProvision: this.projectForm.value.riskProvision,
            };
            this.projectInteractor.update(this.project.id!, request).subscribe({
                next: value => {
                    this.fetchProject();
                    this.toastr.success('project successfully updated', 'Success');
                },
                error: err => {
                    this.toastr.error('Error occurred while updating the project', 'Error');
                },
                complete: () => {
                }
            });
        } else {
            this.toastr.error('Some inputs are incorrect', 'Error');
        }
    }

    onSubmitDisplay() {
        let request: DisplayInputs = {
            period: this.displayForm.value.period,
            currency: this.displayForm.value.currency,
        };
    }

    onClickBack() {
        this.router.navigate(["dashboard"]);
    }

    onClickDeleteResource() {
        let resource = this.localStorageService.get(variables.resource);
        if (resource && resource.id) {
            this.resourceInteractor.delete(resource.id!).subscribe({
                next: value => {
                    this.localStorageService.delete(variables.resource);
                    this.toastr.success("Resource deleted successfully", "Delete resource");
                },
                error: err => {
                    this.localStorageService.delete(variables.resource);
                    this.toastr.error("Error occurred while deleting the resource", "Delete resource");
                },
                complete: () => {
                }
            });
        } else {
            this.localStorageService.delete(variables.resource);
            this.toastr.error("Resource not found", "Delete resource");
        }
    }

    onClickResourceToBeDeleted(resource: ResourceResponse) {
        this.localStorageService.add(variables.resource, resource);
    }

    onClickDismissResource() {
        this.localStorageService.delete(variables.resource);
    }

    onClickEditResourceModalClose() {
        this.resourceForm = this.initResourceForm();
        this.editResourceModalReference.dismiss();
    }

    open(content: TemplateRef<any>) {
        this.editResourceModalReference = this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'xl'
        });
        this.editResourceModalReference.result.then(
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

    openEditResourceModal(resource: ResourceResponse, content: TemplateRef<any>) {
        this.selectedResource = resource;
        this.resourceForm = this.initResourceForm(this.selectedResource);
        this.open(content);
    }

    onSubmitPrices() {

    }

    onChangePrice(period: PeriodEnum, currency: CurrencyEnum, amount: any) {
        console.log(period);
        console.log(currency);
        console.log(amount.target.value);
    }

    calculateMargin() {

    }
}

export interface ResourceInputs {
    jobTitle?: string;
    resourceType?: ResourceTypeEnum;
    workload?: number;
    basicSalaryPeriod?: PeriodEnum,
    basicSalaryCurrency?: CurrencyEnum,
    basicSalary?: number;
    allowancePeriod?: PeriodEnum,
    allowanceCurrency?: CurrencyEnum,
    allowance?: number;
    gratuityPeriod?: PeriodEnum,
    gratuityCurrency?: CurrencyEnum,
    gratuity?: number;
    insurancePeriod?: PeriodEnum,
    insuranceCurrency?: CurrencyEnum,
    insurance?: number;
    flightTicketPeriod?: PeriodEnum,
    flightTicketCurrency?: CurrencyEnum,
    flightTicket?: number;
    workPermitPeriod?: PeriodEnum,
    workPermitCurrency?: CurrencyEnum,
    workPermit?: number;
    officePeriod?: PeriodEnum,
    officeCurrency?: CurrencyEnum,
    office?: number;
    generalSupportPackagePeriod?: PeriodEnum,
    generalSupportPackageCurrency?: CurrencyEnum,
    generalSupportPackage?: number;
    laptopWorkstationPeriod?: PeriodEnum,
    laptopWorkstationCurrency?: CurrencyEnum,
    laptopWorkstation?: number;
    licensesPeriod?: PeriodEnum,
    licensesCurrency?: CurrencyEnum,
    licenses?: number;
}

export interface DisplayInputs {
    period?: PeriodEnum,
    currency?: CurrencyEnum
}
