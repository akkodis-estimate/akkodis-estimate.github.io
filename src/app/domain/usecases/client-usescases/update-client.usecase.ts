import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {IClientRepository} from "../../repositories/iclient.repository";
import {ClientEntity} from "../../entities";

@Injectable({
    providedIn: 'root'
})
export class UpdateClientUseCase implements UseCase<{ id: string, request: ClientEntity }, void> {

    constructor(private repository: IClientRepository) {
    }

    execute(param: { id: string, request: ClientEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
