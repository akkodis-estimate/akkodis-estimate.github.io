import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {LocalStorageService} from "../local-storage/local-storage.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(public router: Router, private localStorageService: LocalStorageService, private toastr: ToastrService) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let account = this.localStorageService.getLoggedAccount();
        if (account && account.id) {
            return true;
        } else {
            this.toastr.error('Account not found. Please log in again', 'Account');
            this.router.navigate(['']);
            return false;
        }
    }
}
