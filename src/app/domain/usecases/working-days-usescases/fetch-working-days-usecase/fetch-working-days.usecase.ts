import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {WorkingDaysEntity} from "../../../entities/working-days.entity";
import {IWorkingDaysRepository} from "../../../repositories/iworking-days.repository";

@Injectable({
    providedIn: 'root'
})
export class FetchWorkingDaysUseCase implements UseCase<void, WorkingDaysEntity[]> {

    constructor(private repository: IWorkingDaysRepository) {
    }

    execute(): Observable<WorkingDaysEntity[]> {
        return this.repository.fetchAll();
    }
}
