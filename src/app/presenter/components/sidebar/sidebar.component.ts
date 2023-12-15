import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import packageJson from "../../../../../package.json";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    menu: string = "dashboard";
    year: number = new Date().getFullYear();
    public version: string = packageJson.version;

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
