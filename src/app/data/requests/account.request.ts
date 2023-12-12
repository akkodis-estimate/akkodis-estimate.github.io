import {RoleEnum} from "../../core/enums/RoleEnum";


export interface AccountRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  role?: RoleEnum;
}
