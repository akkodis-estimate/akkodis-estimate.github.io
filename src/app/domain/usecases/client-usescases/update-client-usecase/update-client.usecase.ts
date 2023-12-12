import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {IClientRepository} from "../../../repositories/iclient.repository";
import {ClientRequest} from "../../../../data/requests/client.request";

@Injectable({
    providedIn: 'root'
})
export class UpdateClientUseCase implements UseCase<{ id: string, request: ClientRequest }, void> {

    constructor(private repository: IClientRepository) {
    }

    execute(param: { id: string, request: ClientRequest }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
