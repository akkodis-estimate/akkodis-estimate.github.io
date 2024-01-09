import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {IResourceRepository} from "../../repositories/iresource.repository";

@Injectable({
    providedIn: 'root'
})
export class CountProjectResourcesUseCase implements UseCase<string, number> {

    constructor(private repository: IResourceRepository) {
    }

    execute(projectId: string): Observable<number> {
        return this.repository.countByProject(projectId);
    }
}
