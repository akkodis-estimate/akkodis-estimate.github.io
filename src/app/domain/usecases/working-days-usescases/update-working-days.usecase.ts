import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {WorkingDaysEntity} from "../../entities/working-days.entity";
import {IWorkingDaysRepository} from "../../repositories/iworking-days.repository";

@Injectable({
    providedIn: 'root'
})
export class UpdateWorkingDaysUseCase implements UseCase<{ id: string, request: WorkingDaysEntity }, void> {

    constructor(private repository: IWorkingDaysRepository) {
    }

    execute(param: { id: string, request: WorkingDaysEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
