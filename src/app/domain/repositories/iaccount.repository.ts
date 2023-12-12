import {Observable} from "rxjs";
import {BaseRepository} from "./base.repository";
import {AccountEntity} from "../entities";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export abstract class IAccountRepository extends BaseRepository<AccountEntity> {
    abstract login(params: { username: string, password: string }): Observable<AccountEntity[]>;
}
