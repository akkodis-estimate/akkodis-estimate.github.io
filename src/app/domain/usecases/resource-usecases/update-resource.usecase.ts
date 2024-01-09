import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {IResourceRepository} from "../../repositories/iresource.repository";
import {ResourceEntity} from "../../entities/resource.entity";

@Injectable({
    providedIn: 'root'
})
export class UpdateResourceUseCase implements UseCase<{ id: string, request: ResourceEntity }, void> {

    constructor(private repository: IResourceRepository) {
    }

    execute(param: { id: string, request: ResourceEntity }): Observable<void> {
        return this.repository.update(param.id, param.request);
    }
}
