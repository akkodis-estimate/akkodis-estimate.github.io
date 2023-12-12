import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./presenter/pages/login/login.component";
import {AuthComponent} from "./presenter/pages/auth/auth.component";
import {DashboardComponent} from "./presenter/pages/dashboard/dashboard.component";
import {AuthGuardService} from "./presenter/services/auth-guard/auth-guard.service";
import {ClientsComponent} from "./presenter/pages/clients/clients.component";
import {SettingsComponent} from "./presenter/pages/settings/settings.component";
import {ResourcesComponent} from "./presenter/pages/resources/resources.component";
import {AccountsComponent} from "./presenter/pages/accounts/accounts.component";


const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
        path: '', component: AuthComponent, canActivate: [AuthGuardService], children: [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'resources', component: ResourcesComponent},
            {path: 'clients', component: ClientsComponent},
            {path: 'accounts', component: AccountsComponent},
            {path: 'settings', component: SettingsComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
