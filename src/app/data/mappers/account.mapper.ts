import {Mapper} from "../../core/contracts/mapper.contract";
import {AccountResponse} from "../responses/account.response";
import {AccountEntity} from "../../domain/entities";
import {AccountRequest} from "../requests/account.request";

export class AccountMapper extends Mapper<AccountRequest, AccountResponse, AccountEntity> {

    toEntity(param: AccountResponse): AccountEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            firstname: param.firstname!,
            lastname: param.lastname!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            role: param.role!,
            avatar: param.avatar!,
        }
    }

    fromEntity(param: AccountEntity): AccountResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            firstname: param.firstname!,
            lastname: param.lastname!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            role: param.role!,
            avatar: param.avatar!,
        }
    }

    fromRequest(param: AccountRequest): AccountEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            firstname: param.firstname!,
            lastname: param.lastname!,
            email: param.email!,
            phoneNumber: param.phoneNumber!,
            address: param.address!,
            role: param.role!,
            avatar: param.avatar!,
        }
    }


}
