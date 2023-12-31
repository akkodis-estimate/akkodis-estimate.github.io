import {map, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {IResourceInteractor} from "../contracts/iresource.interactor";
import {ResourceMapper} from "../../mappers/resource.mapper";
import {CreateResourceUseCase} from "../../../domain/usecases/resource-usecases/create-resource.usecase";
import {FetchResourcesUseCase} from "../../../domain/usecases/resource-usecases/fetch-resources.usecase";
import {ResourceResponse} from "../../responses/resource.response";
import {ResourceRequest} from "../../requests/resource.request";
import {ResourceEntity} from "../../../domain/entities/resource.entity";
import {FetchProjectResourcesUseCase} from "../../../domain/usecases/resource-usecases/fetch-project-resources.usecase";
import {DeleteResourceUseCase} from "../../../domain/usecases/resource-usecases/delete-resource.usecase";
import {UpdateResourceUseCase} from "../../../domain/usecases/resource-usecases/update-resource.usecase";
import {CountProjectResourcesUseCase} from "../../../domain/usecases/resource-usecases/count-project-resources.usecase";

@Injectable({providedIn: 'root'})
export class ResourceInteractor extends IResourceInteractor {
    mapper = new ResourceMapper();

    constructor(private createResourceUseCase: CreateResourceUseCase,
                private fetchProjectResourcesUseCase: FetchProjectResourcesUseCase,
                private deleteResourceUseCase: DeleteResourceUseCase,
                private countProjectResourcesUseCase: CountProjectResourcesUseCase,
                private updateResourceUseCase: UpdateResourceUseCase,
                private fetchResourcesUseCase: FetchResourcesUseCase) {
        super();
    }

    create(request: ResourceRequest): Observable<Result<ResourceResponse>> {
        let entity: ResourceEntity = this.mapper.fromRequest(request);
        entity.id = uuidv4();
        entity.createdAt = new Date();
        return this.createResourceUseCase.execute(entity)
            .pipe(map((e: ResourceEntity) => this.mapper.toResponse(e)));
    }

    delete(id: string): Observable<Result<ResourceResponse>> {
        this.deleteResourceUseCase.execute(id);
        return of(this.mapper.toEmptyResponse());
    }

    fetchAll(): Observable<Result<ResourceResponse[]>> {
        return this.fetchResourcesUseCase.execute()
            .pipe(map((e: ResourceEntity[]) => this.mapper.toResponses(e)));
    }

    fetchByProject(projectId: string): Observable<Result<ResourceResponse[]>> {
        return this.fetchProjectResourcesUseCase.execute(projectId)
            .pipe(map((e: ResourceEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<ResourceResponse>> {
        return of();
    }

    update(id: string, request: ResourceRequest): Observable<Result<ResourceResponse>> {
        this.updateResourceUseCase.execute({id: id, request: this.mapper.fromRequest(request)});
        return of(this.mapper.toEmptyResponse());
    }

    countByProject(projectId: string): Observable<number> {
        return this.countProjectResourcesUseCase.execute(projectId);
    }

}
