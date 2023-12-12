import {map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {Result} from "../../../core/params/result";
import {IWorkingDaysInteractor} from "../contracts/iworking-days.interactor";
import {WorkingDaysResponse} from "../../responses/working-days.response";
import {
    FetchWorkingDaysUseCase
} from "../../../domain/usecases/working-days-usescases/fetch-working-days-usecase/fetch-working-days.usecase";
import {WorkingDaysMapper} from "../../mappers/working-days.mapper";
import {WorkingDaysEntity} from "../../../domain/entities/working-days.entity";
import {WorkingDaysRequest} from "../../requests/working-days.request";

@Injectable({providedIn: 'root'})
export class WorkingDaysInteractor extends IWorkingDaysInteractor {


    mapper = new WorkingDaysMapper();

    constructor(private fetchWorkingDaysUseCase: FetchWorkingDaysUseCase) {
        super();
    }

    fetch(): Observable<Result<WorkingDaysResponse>> {
        return this.fetchWorkingDaysUseCase.execute()
            .pipe(map((e: WorkingDaysEntity[]) => this.mapper.toFirstResponse(e)));
    }

    update(id: string, request: WorkingDaysRequest): Observable<Result<WorkingDaysResponse>> {
        return of();
    }
}
