import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {DATA_ACCOUNT_IOC} from "./data.ioc";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ...DATA_ACCOUNT_IOC
  ]
})
export class DataModule {
}
