import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ClientEntity} from "../../../entities";
import {IClientRepository} from "../../../repositories/iclient.repository";

@Injectable({
    providedIn: 'root'
})
export class DeleteClientUseCase implements UseCase<string, void> {

    constructor(private repository: IClientRepository) {
    }

    execute(id: string): Observable<void> {
        return this.repository.delete(id);
    }
}
