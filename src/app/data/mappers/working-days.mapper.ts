import {Mapper} from "../../core/contracts/mapper.contract";
import {WorkingDaysRequest} from "../requests/working-days.request";
import {WorkingDaysResponse} from "../responses/working-days.response";
import {WorkingDaysEntity} from "../../domain/entities/working-days.entity";

export class WorkingDaysMapper extends Mapper<WorkingDaysRequest, WorkingDaysResponse, WorkingDaysEntity> {

    toEntity(param: WorkingDaysResponse): WorkingDaysEntity {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            updatedAt: new Date(),
            deleted: false,
            totalCalendarDays: param.totalCalendarDays!,
            weekends: param.weekends!,
            paidLeave: param.paidLeave!,
            publicHolidays: param.publicHolidays!,
        }
    }

    fromEntity(param: WorkingDaysEntity): WorkingDaysResponse {
        return {
            id: param.id!,
            createdAt: param.createdAt!,
            totalCalendarDays: param.totalCalendarDays!,
            weekends: param.weekends!,
            paidLeave: param.paidLeave!,
            publicHolidays: param.publicHolidays!,
            billableWorkingDays: param.totalCalendarDays ?? 365 - param.weekends! ?? 104 - param.paidLeave! ?? 0 - param.publicHolidays! ?? 0
        };
    }

    fromRequest(param: WorkingDaysRequest): WorkingDaysEntity {
        return {
            updatedAt: new Date(),
            deleted: false,
            totalCalendarDays: param.totalCalendarDays!,
            weekends: param.weekends!,
            paidLeave: param.paidLeave!,
            publicHolidays: param.publicHolidays!,
        }
    }
}
