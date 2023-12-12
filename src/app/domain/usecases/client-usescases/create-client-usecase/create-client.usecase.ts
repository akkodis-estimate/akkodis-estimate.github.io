import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ClientEntity} from "../../../entities";
import {IClientRepository} from "../../../repositories/iclient.repository";

@Injectable({
    providedIn: 'root'
})
export class CreateClientUseCase implements UseCase<ClientEntity, ClientEntity> {

    constructor(private repository: IClientRepository) {
    }

    execute(param: ClientEntity): Observable<ClientEntity> {
        return this.repository.create(param);
    }
}
