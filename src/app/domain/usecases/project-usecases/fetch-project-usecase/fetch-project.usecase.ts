import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ProjectEntity} from "../../../entities";
import {IProjectRepository} from "../../../repositories/iproject.repository";

@Injectable({
    providedIn: 'root'
})
export class FetchProjectUseCase implements UseCase<string, ProjectEntity | undefined> {

    constructor(private repository: IProjectRepository) {
    }

    execute(id: string): Observable<ProjectEntity | undefined> {
        return this.repository.fetch(id);
    }
}
