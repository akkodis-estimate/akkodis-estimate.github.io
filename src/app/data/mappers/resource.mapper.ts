import {Mapper} from "../../core/contracts/mapper.contract";
import {ResourceRequest} from "../requests/resource.request";
import {ResourceResponse} from "../responses/resource.response";
import {ResourceEntity} from "../../domain/entities/resource.entity";
import {environment} from "../../../environments/environment";

export class ResourceMapper extends Mapper<ResourceRequest, ResourceResponse, ResourceEntity> {

    toEntity(param: ResourceResponse): ResourceEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            jobTitle: param.jobTitle!,
            resourceType: param.resourceType!,
            workload: param.workload!,
            project: param.project!,
            basicSalary: param.basicSalary,
            allowance: param.allowance,
            gratuity: param.gratuity,
            insurance: param.insurance,
            flightTicket: param.flightTicket,
            workPermit: param.workPermit,
            office: param.office,
            generalSupportPackage: param.generalSupportPackage,
            laptopWorkstation: param.laptopWorkstation,
            licenses: param.licenses,
        }
    }

    fromEntity(param: ResourceEntity): ResourceResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            jobTitle: param.jobTitle!,
            resourceType: param.resourceType!,
            workload: param.workload!,
            project: param.project!,
            basicSalary: param.basicSalary,
            allowance: param.allowance,
            gratuity: param.gratuity,
            insurance: param.insurance,
            flightTicket: param.flightTicket,
            workPermit: param.workPermit,
            office: param.office,
            generalSupportPackage: param.generalSupportPackage,
            laptopWorkstation: param.laptopWorkstation,
            licenses: param.licenses,
        };
    }

    fromRequest(param: ResourceRequest): ResourceEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            jobTitle: param.jobTitle!,
            resourceType: param.resourceType!,
            workload: param.workload!,
            project: param.project!,
            basicSalary: param.basicSalary,
            allowance: param.allowance,
            gratuity: param.gratuity,
            insurance: param.insurance ?? environment.resource.insurance,
            flightTicket: param.flightTicket ?? environment.resource.flightTicket,
            workPermit: param.workPermit ?? environment.resource.workPermit,
            office: param.office ?? environment.resource.office,
            generalSupportPackage: param.generalSupportPackage ?? environment.resource.generalSupportPackage,
            laptopWorkstation: param.laptopWorkstation ?? environment.resource.laptopWorkstation,
            licenses: param.licenses ?? environment.resource.licenses,
        }
    }
}
