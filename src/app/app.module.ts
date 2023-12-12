import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {MarkdownModule} from 'ngx-markdown';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {
    DATA_ACCOUNT_IOC,
    DATA_CLIENT_IOC,
    DATA_CURRENCY_EXCHANGE_IOC,
    DATA_PROJECT_IOC,
    DATA_RESOURCE_IOC,
    DATA_WORKING_DAYS_IOC
} from './data/data.ioc';
import {environment} from 'src/environments/environment.development';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireModule} from "@angular/fire/compat";
import {LoginComponent} from "./presenter/pages/login/login.component";
import {DashboardComponent} from './presenter/pages/dashboard/dashboard.component';
import {HeaderComponent} from './presenter/components/header/header.component';
import {SidebarComponent} from './presenter/components/sidebar/sidebar.component';
import {AuthComponent} from './presenter/pages/auth/auth.component';
import {ToastrModule} from "ngx-toastr";
import {ClientsComponent} from './presenter/pages/clients/clients.component';
import {SettingsComponent} from './presenter/pages/settings/settings.component';
import {ResourcesComponent} from './presenter/pages/resources/resources.component';
import {AccountsComponent} from './presenter/pages/accounts/accounts.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        HeaderComponent,
        SidebarComponent,
        AuthComponent,
        ClientsComponent,
        SettingsComponent,
        ResourcesComponent,
        AccountsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        MarkdownModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        ToastrModule.forRoot(),
    ],
    providers: [
        ...DATA_ACCOUNT_IOC,
        ...DATA_CLIENT_IOC,
        ...DATA_PROJECT_IOC,
        ...DATA_RESOURCE_IOC,
        ...DATA_WORKING_DAYS_IOC,
        ...DATA_CURRENCY_EXCHANGE_IOC,
    ],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule {
}
