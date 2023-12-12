import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ProjectEntity} from "../../../entities";
import {IProjectRepository} from "../../../repositories/iproject.repository";

@Injectable({
    providedIn: 'root'
})
export class FetchProjectsUseCase implements UseCase<void, ProjectEntity[]> {

    constructor(private repository: IProjectRepository) {
    }

    execute(): Observable<ProjectEntity[]> {
        return this.repository.fetchAll();
    }
}
