import {AccountRequest} from "../../requests/account.request";
import {map, Observable, of} from "rxjs";
import {ClientEntity} from "../../../domain/entities";
import {Injectable} from "@angular/core";
import {v4 as uuidv4} from 'uuid';
import {Result} from "../../../core/params/result";
import {IClientInteractor} from "../contracts/iclient.interactor";
import {ClientMapper} from "../../mappers/client.mapper";
import {ClientResponse} from "../../responses/client.response";
import {ClientRequest} from "../../requests/client.request";
import {
    CreateClientUseCase
} from "../../../domain/usecases/client-usescases/create-client-usecase/create-client.usecase";
import {
    FetchClientsUseCase
} from "../../../domain/usecases/client-usescases/fetch-clients-usecase/fetch-clients.usecase";

@Injectable({providedIn: 'root'})
export class ClientInteractor extends IClientInteractor {

    mapper = new ClientMapper();

    constructor(private createClientUseCase: CreateClientUseCase,
                private fetchClientsUseCase: FetchClientsUseCase) {
        super();
    }

    create(request: ClientRequest): Observable<Result<ClientResponse>> {

        let entity: ClientEntity = this.mapper.fromRequest(request);
        entity.id = uuidv4();
        entity.createdAt = new Date();

        return this.createClientUseCase.execute(entity)
            .pipe(map((e: ClientEntity) => this.mapper.toResponse(e)));
    }

    delete(id: string): Observable<Result<ClientResponse>> {
        return of();
    }

    fetchAll(): Observable<Result<ClientResponse[]>> {
        return this.fetchClientsUseCase.execute()
            .pipe(map((e: ClientEntity[]) => this.mapper.toResponses(e)));
    }

    fetchOne(id: string): Observable<Result<ClientResponse>> {
        return of();
    }

    update(id: string, request: AccountRequest): Observable<Result<ClientResponse>> {
        return of();
    }

}
