import {Entity} from "./entity";

export interface WorkingDaysEntity extends Entity {
    totalCalendarDays?: number;
    weekends?: number;
    paidLeave?: number;
    publicHolidays?: number;
}
