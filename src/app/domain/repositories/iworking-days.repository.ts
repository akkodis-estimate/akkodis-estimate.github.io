import {BaseRepository} from "./base.repository";
import {Injectable} from "@angular/core";
import {WorkingDaysEntity} from "../entities/working-days.entity";

@Injectable({providedIn: 'root'})
export abstract class IWorkingDaysRepository extends BaseRepository<WorkingDaysEntity> {
}
