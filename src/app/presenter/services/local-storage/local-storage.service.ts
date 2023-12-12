import {Injectable} from '@angular/core';
import {variables} from "../../../../environments/variables";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    add(key: string, value: any): void {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }

    update(key: string, value: any): void {
        let oldValue: any = localStorage.getItem(key);
        if (oldValue) {
            this.delete(key);
        }
        this.add(key, value);
    }

    get(key: string): any {
        const param: any = localStorage.getItem(key);
        return param ? JSON.parse(param) : null;
    }

    getLoggedAccount(): any {
        return this.get(variables.logged_account);
    }

    delete(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
