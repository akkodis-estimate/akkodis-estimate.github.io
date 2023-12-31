import {Entity} from "./entity";
import {ResourceTypeEnum} from "../../core/enums/ResourceTypeEnum";

export interface ResourceEntity extends Entity {
    jobTitle?: string;
    resourceType?: ResourceTypeEnum;
    workload?: number;
    quantity?: number;
    project?: string;
    basicSalary?: string;
    allowance?: string;
    gratuity?: string;
    insurance?: string;
    flightTicket?: string;
    workPermit?: string;
    office?: string;
    generalSupportPackage?: string;
    laptopWorkstation?: string;
    licenses?: string;
    mobilizationCost?: string;
    parking?: string;
    transportation?: string;
}
