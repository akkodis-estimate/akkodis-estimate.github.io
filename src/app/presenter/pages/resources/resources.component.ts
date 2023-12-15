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
import {AmountHelper} from "../../../helpers/amount.helper";
import {CurrencyExchangeInteractor} from "../../../data/interactors/implementations/currency-exchange.interactor";
import {CurrencyExchangeResponse} from "../../../data/responses/currency-exchange.response";
import {WorkingDaysInteractor} from "../../../data/interactors/implementations/working-days.interactor";
import {WorkingDaysResponse} from "../../../data/responses/working-days.response";

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
    public currencyExchanges: CurrencyExchangeResponse[] = [];
    public workingDays!: WorkingDaysResponse;
    resourceForm: FormGroup;
    projectForm: FormGroup;
    displayForm: FormGroup;
    pricesForm: FormGroup;
    closeResult = '';
    private editResourceModalReference!: NgbModalRef;
    selectedResource!: ResourceResponse | undefined;
    editPrice: string = "";
    editRiskProvision: boolean = false;
    editMargin: boolean = false;
    selectedResourceType!: ResourceTypeEnum;

    constructor(private localStorageService: LocalStorageService,
                private toastr: ToastrService,
                private router: Router,
                private modalService: NgbModal,
                private currencyExchangeInteractor: CurrencyExchangeInteractor,
                private workingDaysInteractor: WorkingDaysInteractor,
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
        this.fetchCurrencyExchanges();
        this.fetchWorkingDays();
    }

    fetchWorkingDays() {
        this.workingDaysInteractor.fetch().subscribe({
            next: value => {
                this.workingDays = value.data!;
            },
            error: err => {
            },
            complete: () => {
            }
        });
    }

    initResourceForm(resource?: ResourceResponse): FormGroup {
        resource = resource == undefined ? {} : resource;
        return new FormGroup({
            jobTitle: new FormControl(resource.jobTitle ? resource.jobTitle : "", [Validators.required]),
            resourceType: new FormControl(resource.resourceType ? resource.resourceType : "", [Validators.required]),
            workload: new FormControl(resource && resource.workload ? resource.workload : 1),

            basicSalaryPeriod: new FormControl(resource.basicSalary ? AmountHelper.getAmountPeriod(resource.basicSalary) : 'MONTHLY'),
            basicSalaryCurrency: new FormControl(resource.basicSalary ? AmountHelper.getAmountCurrency(resource.basicSalary) : 'AED'),
            basicSalary: new FormControl(AmountHelper.getAmount(resource.basicSalary!), [Validators.required]),

            allowancePeriod: new FormControl(resource.allowance ? AmountHelper.getAmountPeriod(resource.allowance) : 'MONTHLY'),
            allowanceCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.allowance!)),
            allowance: new FormControl(AmountHelper.getAmount(resource.allowance!)),

            gratuityPeriod: new FormControl(resource.gratuity ? AmountHelper.getAmountPeriod(resource.gratuity) : 'ANNUALLY'),
            gratuityCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.gratuity!)),
            gratuity: new FormControl(AmountHelper.getAmount(resource.gratuity!)),

            insurancePeriod: new FormControl(resource.insurance ? AmountHelper.getAmountPeriod(resource.insurance) : 'ANNUALLY'),
            insuranceCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.insurance!)),
            insurance: new FormControl(resource.insurance ? AmountHelper.getAmount(resource.insurance) : '790'),

            flightTicketPeriod: new FormControl(resource.flightTicket ? AmountHelper.getAmountPeriod(resource.flightTicket) : 'ANNUALLY'),
            flightTicketCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.flightTicket!)),
            flightTicket: new FormControl(resource.flightTicket ? AmountHelper.getAmount(resource.flightTicket) : '2500'),

            workPermitPeriod: new FormControl(resource.workPermit ? AmountHelper.getAmountPeriod(resource.workPermit) : 'ANNUALLY'),
            workPermitCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.workPermit!)),
            workPermit: new FormControl(resource.workPermit ? AmountHelper.getAmount(resource.workPermit) : '6500'),

            officePeriod: new FormControl(resource.office ? AmountHelper.getAmountPeriod(resource.office) : 'DAILY'),
            officeCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.office!)),
            office: new FormControl(resource.office ? AmountHelper.getAmount(resource.office) : '19'),

            generalSupportPackagePeriod: new FormControl(resource.generalSupportPackage ? AmountHelper.getAmountPeriod(resource.generalSupportPackage) : 'DAILY'),
            generalSupportPackageCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.generalSupportPackage!)),
            generalSupportPackage: new FormControl(resource.generalSupportPackage ? AmountHelper.getAmount(resource.generalSupportPackage) : '15'),

            laptopWorkstationPeriod: new FormControl(resource.laptopWorkstation ? AmountHelper.getAmountPeriod(resource.laptopWorkstation) : 'ANNUALLY'),
            laptopWorkstationCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.laptopWorkstation!)),
            laptopWorkstation: new FormControl(resource.laptopWorkstation ? AmountHelper.getAmount(resource.laptopWorkstation) : '5000'),

            licensesPeriod: new FormControl(resource.licenses ? AmountHelper.getAmountPeriod(resource.licenses) : 'ANNUALLY'),
            licensesCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.licenses!)),
            licenses: new FormControl(resource.licenses ? AmountHelper.getAmount(resource.licenses) : '400'),

            mobilizationCostPeriod: new FormControl(resource.mobilizationCost ? AmountHelper.getAmountPeriod(resource.mobilizationCost) : 'ANNUALLY'),
            mobilizationCostCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.mobilizationCost!)),
            mobilizationCost: new FormControl(resource.mobilizationCost ? AmountHelper.getAmount(resource.mobilizationCost) : '3500'),

            parkingPeriod: new FormControl(resource.parking ? AmountHelper.getAmountPeriod(resource.parking) : 'ANNUALLY'),
            parkingCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.parking!)),
            parking: new FormControl(resource.parking ? AmountHelper.getAmount(resource.parking) : '0'),

            transportationPeriod: new FormControl(resource.transportation ? AmountHelper.getAmountPeriod(resource.transportation) : 'ANNUALLY'),
            transportationCurrency: new FormControl(AmountHelper.getAmountCurrency(resource.transportation!)),
            transportation: new FormControl(resource.transportation ? AmountHelper.getAmount(resource.transportation) : '0'),
        });
    }

    fetchCurrencyExchanges() {
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

    calculateCurrencyPeriodCost(currency: CurrencyEnum, period: PeriodEnum): number | undefined {
        let amount = AmountHelper.convertToAnnualAmount(AmountHelper.calculateTotalAnnualCost(this.resources, this.workingDays), period);
        return AmountHelper.convertAmountToCurrency(amount, currency, this.currencyExchanges);
    }

    calculateTotalAnnualPrice(): number {
        return (1 + (this.project.margin! / 100)) * (1 + (this.project.riskProvision! / 100)) * AmountHelper.calculateTotalAnnualCost(this.resources, this.workingDays);
    }

    calculateMargin(price: number, currency: CurrencyEnum, period: PeriodEnum) {
        let annualCost: number = AmountHelper.calculateTotalAnnualCost(this.resources, this.workingDays);
        let convertedPrice = AmountHelper.convertAmountFromCurrencyToCurrency(price, currency + "/AED", this.currencyExchanges);
        let annualPrice: number = AmountHelper.convertToAnnualAmount(convertedPrice ?? 0, period);
        return ((annualPrice / ((1 + (this.project.riskProvision! / 100)) * annualCost)) - 1) * 100;
    }

    calculateCurrencyPeriodPrice(currency: CurrencyEnum, period: PeriodEnum): number | undefined {
        let amount = AmountHelper.convertToAnnualAmount(this.calculateTotalAnnualPrice(), period);
        return AmountHelper.convertAmountToCurrency(amount, currency, this.currencyExchanges);
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
                mobilizationCost: this.resourceForm.value.mobilizationCostPeriod + " " + this.resourceForm.value.mobilizationCostCurrency + " " + this.resourceForm.value.mobilizationCost,
                parking: this.resourceForm.value.parkingPeriod + " " + this.resourceForm.value.parkingCurrency + " " + this.resourceForm.value.parking,
                transportation: this.resourceForm.value.transportationPeriod + " " + this.resourceForm.value.transportationCurrency + " " + this.resourceForm.value.transportation,
            };

            if (this.selectedResource && this.selectedResource.id) {
                this.resourceInteractor.update(this.selectedResource.id!, request).subscribe({
                    next: value => {
                        this.selectedResource = undefined;
                        this.resourceForm.reset();
                        if (this.editResourceModalReference) {
                            this.editResourceModalReference.dismiss();
                        }
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
                        if (this.editResourceModalReference) {
                            this.editResourceModalReference.dismiss();
                        }
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
            mobilizationCostPeriod: this.resourceForm.value.mobilizationCostPeriod,
            mobilizationCostCurrency: this.resourceForm.value.mobilizationCostCurrency,
            mobilizationCost: this.resourceForm.value.mobilizationCost,
            parkingPeriod: this.resourceForm.value.parkingPeriod,
            parkingCurrency: this.resourceForm.value.parkingCurrency,
            parking: this.resourceForm.value.parking,
            transportationPeriod: this.resourceForm.value.transportationPeriod,
            transportationCurrency: this.resourceForm.value.transportationCurrency,
            transportation: this.resourceForm.value.transportation,
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

    onChangePrice(period: PeriodEnum, currency: CurrencyEnum, amount: any) {
        this.projectForm = new FormGroup({
            title: new FormControl(this.project.title, [Validators.required]),
            client: new FormControl(this.project.client, [Validators.required]),
            description: new FormControl(this.project.description),
            duration: new FormControl(this.project.duration),
            margin: new FormControl(this.calculateMargin(amount.target.value, currency, period)),
            riskProvision: new FormControl(this.project.riskProvision),
        });

        this.onSubmitProject();
    }

    onClickResourceDuplicate(resource: ResourceResponse) {
        this.resourceForm = this.initResourceForm(resource);
        this.onSubmit();
    }

    onMouseLeaveEditPrice() {
        this.editPrice = "";
        this.pricesForm.reset();
    }

    getEditPriceTag() {
        return this.editPrice;
    }

    onMouseEnterEditPrice(amount: number | undefined, currency: CurrencyEnum, period: PeriodEnum, i: number, j: number) {
        this.editPrice = i + "" + j;
        this.pricesForm = new FormGroup({
            period: new FormControl(period),
            currency: new FormControl(currency),
            amount: new FormControl(amount),
        });
    }

    onMouseEnterEditRiskProvision() {
        this.editRiskProvision = true;
    }

    onMouseLeaveEditRiskProvision() {
        this.editRiskProvision = false;
    }

    onMouseEnterEditMargin() {
        this.editMargin = true;
    }

    onMouseLeaveEditMargin() {
        this.editMargin = false;
    }

    onChangeResourceType() {
        this.selectedResourceType = this.resourceForm.value.resourceType;
    }

    protected readonly ResourceTypeEnum = ResourceTypeEnum;
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
    mobilizationCostPeriod?: PeriodEnum,
    mobilizationCostCurrency?: CurrencyEnum,
    mobilizationCost?: number;
    parkingPeriod?: PeriodEnum,
    parkingCurrency?: CurrencyEnum,
    parking?: number;
    transportationPeriod?: PeriodEnum,
    transportationCurrency?: CurrencyEnum,
    transportation?: number;
}

export interface DisplayInputs {
    period?: PeriodEnum,
    currency?: CurrencyEnum
}
