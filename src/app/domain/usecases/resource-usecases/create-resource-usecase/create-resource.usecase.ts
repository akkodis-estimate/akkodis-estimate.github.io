import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../../core/contracts/usecase.contract";
import {ResourceEntity} from "../../../entities/resource.entity";
import {IResourceRepository} from "../../../repositories/iresource.repository";

@Injectable({
    providedIn: 'root'
})
export class CreateResourceUseCase implements UseCase<ResourceEntity, ResourceEntity> {

    constructor(private repository: IResourceRepository) {
    }

    execute(param: ResourceEntity): Observable<ResourceEntity> {
        return this.repository.create(param);
    }
}
