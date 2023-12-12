import {BaseRepository} from "./base.repository";
import {ClientEntity} from "../entities";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export abstract class IClientRepository extends BaseRepository<ClientEntity> {
}
