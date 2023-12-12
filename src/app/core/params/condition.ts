import {ComparatorEnum} from "../enums/comparatorEnum";

export interface Condition {
    field: string;
    value: string | number | boolean;
    comparator: ComparatorEnum;
}
