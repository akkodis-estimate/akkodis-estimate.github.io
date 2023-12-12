import {Entity} from "./entity";

export interface ProjectEntity extends Entity {
    title?: string;
    duration?: number;
    description?: string;
    client?: string;
    margin?: number;
    riskProvision?: number;
}
