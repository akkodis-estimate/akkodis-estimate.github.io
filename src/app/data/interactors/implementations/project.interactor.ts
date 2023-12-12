import {map, Observable, of} from "rxjs";
import {ProjectEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {IProjectInteractor} from "../contracts/iproject.interactor";
import {ProjectRequest} from "../../requests/project.request";
import {ProjectResponse} from "../../responses/project.response";
import {ProjectMapper} from "../../mappers/project.mapper";
import {
    CreateProjectUseCase
} from "../../../domain/usecases/project-usecases/create-project-usecase/create-project.usecase";
import {
    FetchProjectsUseCase
} from "../../../domain/usecases/project-usecases/fetch-projects-usecase/fetch-projects.usecase";

@Injectable({providedIn: 'root'})
export class ProjectInteractor extends IProjectInteractor {

    mapper = new ProjectMapper();

    constructor(private createProjectUseCase: CreateProjectUseCase,
                private fetchProjectsUseCase: FetchProjectsUseCase) {
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
        return of();
    }

    fetchAll(): Observable<Result<ProjectResponse[]>> {
        return this.fetchProjectsUseCase.execute()
            .pipe(map((e: ProjectEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<ProjectResponse>> {
        return of();
    }

    update(id: string, request: ProjectRequest): Observable<Result<ProjectResponse>> {
        return of();
    }

}
