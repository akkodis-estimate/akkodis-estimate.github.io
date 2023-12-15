import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {IProjectRepository} from "../../repositories/iproject.repository";

@Injectable({
    providedIn: 'root'
})
export class DeleteProjectUseCase implements UseCase<string, void> {

    constructor(private repository: IProjectRepository) {
    }

    execute(id: string): Observable<void> {
        return this.repository.delete(id);
    }
}
