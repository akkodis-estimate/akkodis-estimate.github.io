import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ResourceEntity} from "../../../entities/resource.entity";
import {IResourceRepository} from "../../../repositories/iresource.repository";

@Injectable({
    providedIn: 'root'
})
export class FetchProjectResourcesUseCase implements UseCase<string, ResourceEntity[]> {

    constructor(private repository: IResourceRepository) {
    }

    execute(projectId: string): Observable<ResourceEntity[]> {
        return this.repository.fetchByProject(projectId);
    }
}
