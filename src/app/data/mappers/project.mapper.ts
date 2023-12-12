import {Mapper} from "../../core/contracts/mapper.contract";
import {ProjectEntity} from "../../domain/entities";
import {ProjectResponse} from "../responses/project.response";
import {ProjectRequest} from "../requests/project.request";

export class ProjectMapper extends Mapper<ProjectRequest, ProjectResponse, ProjectEntity> {

    toEntity(param: ProjectResponse): ProjectEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            title: param.title!,
            duration: param.duration!,
            description: param.description!,
            margin: param.margin!,
            client: param.client,
            riskProvision: param.riskProvision
        }
    }

    fromEntity(param: ProjectEntity): ProjectResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            title: param.title!,
            duration: param.duration!,
            description: param.description!,
            margin: param.margin!,
            client: param.client,
            riskProvision: param.riskProvision
        };
    }

    fromRequest(param: ProjectRequest): ProjectEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            title: param.title!,
            duration: param.duration!,
            description: param.description!,
            margin: param.margin!,
            client: param.client!,
            riskProvision: param.riskProvision
        }
    }
}
