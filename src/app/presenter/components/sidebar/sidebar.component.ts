import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    menu: string = "dashboard";

    constructor(private router: Router, private localStorageService: LocalStorageService) {
    }

    onClickMenu(menu: string) {
        this.menu = menu;
        this.router.navigate([menu]);
    }

    onClickSignOut() {
        this.localStorageService.clear();
        this.router.navigate(["login"]);
    }
}
