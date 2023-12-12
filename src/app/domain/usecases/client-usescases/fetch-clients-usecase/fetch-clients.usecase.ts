import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ClientEntity} from "../../../entities";
import {IClientRepository} from "../../../repositories/iclient.repository";

@Injectable({
    providedIn: 'root'
})
export class FetchClientsUseCase implements UseCase<void, ClientEntity[]> {

    constructor(private repository: IClientRepository) {
    }

    execute(): Observable<ClientEntity[]> {
        return this.repository.fetchAll();
    }
}
