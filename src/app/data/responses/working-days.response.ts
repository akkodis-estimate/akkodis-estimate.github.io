import {Response} from "./response";

export interface WorkingDaysResponse extends Response {
    totalCalendarDays: number;
    weekends: number;
    paidLeave: number;
    publicHolidays: number;
    billableWorkingDays: number;
}
