import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {IProjectRepository} from "../../../repositories/iproject.repository";
import {ProjectEntity} from "../../../entities";

@Injectable({
    providedIn: 'root'
})
export class UpdateProjectUseCase implements UseCase<{ id: string, request: ProjectEntity }, void> {

    constructor(private repository: IProjectRepository) {
    }

    execute(param: { id: string, request: ProjectEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
