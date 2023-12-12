import {Mapper} from "../../core/contracts/mapper.contract";
import {ClientEntity} from "../../domain/entities";
import {ClientResponse} from "../responses/client.response";
import {ClientRequest} from "../requests/client.request";

export class ClientMapper extends Mapper<ClientRequest, ClientResponse, ClientEntity> {

    toEntity(param: ClientResponse): ClientEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            companyName: param.companyName!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            logo: param.logo!,
        }
    }

    fromEntity(param: ClientEntity): ClientResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            companyName: param.companyName!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            logo: param.logo!
        };
    }

    fromRequest(param: ClientRequest): ClientEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            companyName: param.companyName!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            logo: param.logo!,
        }
    }
}
