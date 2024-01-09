import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {UseCase} from "../../../core/contracts/usecase.contract";
import {IResourceRepository} from "../../repositories/iresource.repository";

@Injectable({
    providedIn: 'root'
})
export class DeleteResourceUseCase implements UseCase<string, void> {

    constructor(private repository: IResourceRepository) {
    }

    execute(id: string): Observable<void> {
        return this.repository.delete(id);
    }
}
