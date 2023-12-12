import {Response} from "./response";

export interface ClientResponse extends Response {
    companyName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    logo?: string;
}
