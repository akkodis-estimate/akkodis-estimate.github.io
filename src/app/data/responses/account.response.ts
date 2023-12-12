import {Response} from "./response";
import {RoleEnum} from "../../core/enums/RoleEnum";

export interface AccountResponse extends Response {
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  role?: RoleEnum;
}
