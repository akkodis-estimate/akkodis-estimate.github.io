import {Entity} from "./entity";

export interface ClientEntity extends Entity {
    companyName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    logo?: string;
}
