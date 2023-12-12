import {BaseRepository} from "./base.repository";
import {ProjectEntity} from "../entities";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export abstract class IProjectRepository extends BaseRepository<ProjectEntity> {
}
