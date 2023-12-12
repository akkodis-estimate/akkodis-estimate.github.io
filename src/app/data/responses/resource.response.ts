import {Response} from "./response";
import {ResourceTypeEnum} from "../../core/enums/ResourceTypeEnum";

export interface ResourceResponse extends Response {
    jobTitle?: string;
    resourceType?: ResourceTypeEnum;
    workload?: number;
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
}
