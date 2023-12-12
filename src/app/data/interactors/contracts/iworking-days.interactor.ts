import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Result} from "../../../core/params/result";
import {WorkingDaysResponse} from "../../responses/working-days.response";
import {WorkingDaysRequest} from "../../requests/working-days.request";

@Injectable({providedIn: 'root'})
export abstract class IWorkingDaysInteractor {
    abstract fetch(): Observable<Result<WorkingDaysResponse>>;

    abstract update(id: string, request: WorkingDaysRequest): Observable<Result<WorkingDaysResponse>>;
}
