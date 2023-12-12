import {Entity} from "./entity";
import {RoleEnum} from "../../core/enums/RoleEnum";

export interface AccountEntity extends Entity {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string,
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  role?: RoleEnum;
}
