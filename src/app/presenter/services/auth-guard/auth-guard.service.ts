import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

}
