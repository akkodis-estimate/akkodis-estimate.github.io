import {Response} from "./response";

export interface ProjectResponse extends Response {
    title?: string;
    duration?: number;
    description?: string;
    client?: string;
    margin?: number;
    riskProvision?: number;
}
