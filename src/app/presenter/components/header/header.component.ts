import {Component} from '@angular/core';
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {AccountResponse} from "../../../data/responses/account.response";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    loggedAccount: AccountResponse;

    constructor(private localStorageService: LocalStorageService, private router: Router) {
        this.loggedAccount = localStorageService.getLoggedAccount();
    }

    showSideBar: boolean = true;

    onClickBars() {
        this.showSideBar = !this.showSideBar;
    }

    onClickLogo() {
        this.router.navigate(['dashboard']);
    }
}
