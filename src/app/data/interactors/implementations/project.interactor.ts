import {map, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {IProjectInteractor} from "../contracts/iproject.interactor";
import {ProjectRequest} from "../../requests/project.request";
import {ProjectResponse} from "../../responses/project.response";
import {ProjectMapper} from "../../mappers/project.mapper";
import {CreateProjectUseCase} from "../../../domain/usecases/project-usecases/create-project.usecase";
import {FetchProjectsUseCase} from "../../../domain/usecases/project-usecases/fetch-projects.usecase";
import {DeleteProjectUseCase} from "../../../domain/usecases/project-usecases/delete-project.usecase";
import {UpdateProjectUseCase} from "../../../domain/usecases/project-usecases/update-project.usecase";
import {FetchProjectUseCase} from "../../../domain/usecases/project-usecases/fetch-project.usecase";
import {
    FetchProjectResourcesUseCase
} from "../../../domain/usecases/resource-usecases/fetch-project-resources.usecase/fetch-project-resources.usecase";
import {ResourceMapper} from "../../mappers/resource.mapper";
import {
    DeleteResourceUseCase
} from "../../../domain/usecases/resource-usecases/delete-resource-usecase/delete-resource.usecase";

@Injectable({providedIn: 'root'})
export class ProjectInteractor extends IProjectInteractor {

    mapper = new ProjectMapper();
    resourceMapper = new ResourceMapper();

    constructor(private createProjectUseCase: CreateProjectUseCase,
                private deleteProjectUseCase: DeleteProjectUseCase,
                private updateProjectUseCase: UpdateProjectUseCase,
                private fetchProjectUseCase: FetchProjectUseCase,
                private fetchProjectsUseCase: FetchProjectsUseCase,
                private fetchProjectResourcesUseCase: FetchProjectResourcesUseCase,
                private deleteResourceUseCase: DeleteResourceUseCase) {
        super();
    }

    create(request: ProjectRequest): Observable<Result<ProjectResponse>> {
        let entity: ProjectEntity = this.mapper.fromRequest(request);
        entity.id = uuidv4();
        entity.createdAt = new Date();
        return this.createProjectUseCase.execute(entity)
            .pipe(map((e: ProjectEntity) => this.mapper.toResponse(e)));
    }

    delete(id: string): Observable<Result<ProjectResponse>> {
        this.fetchProjectResourcesUseCase.execute(id).subscribe({
            next: resources => {
                resources.forEach(value => this.deleteResourceUseCase.execute(value.id!));
            },
            error: err => {
            },
            complete: () => {
            }
        });
        this.deleteProjectUseCase.execute(id);
        return of(this.mapper.toEmptyResponse());
    }

    fetchAll(): Observable<Result<ProjectResponse[]>> {
        return this.fetchProjectsUseCase.execute()
            .pipe(map((e: ProjectEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<ProjectResponse>> {
        return this.fetchProjectUseCase.execute(id)
            .pipe(map((e: ProjectEntity | undefined) => this.mapper.toResponse(e)));
    }

    update(id: string, request: ProjectRequest): Observable<Result<ProjectResponse>> {
        this.updateProjectUseCase.execute({id: id, request: this.mapper.fromRequest(request)});
        return of(this.mapper.toEmptyResponse());
    }
}
