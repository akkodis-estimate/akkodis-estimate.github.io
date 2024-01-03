import {ResourceResponse} from "../../data/responses/resource.response";
import {ProjectResponse} from "../../data/responses/project.response";

export interface ExportData {
    resources?: ResourceResponse[];
    project?: ProjectResponse;
    cost?: number;
    price?: number;
}
